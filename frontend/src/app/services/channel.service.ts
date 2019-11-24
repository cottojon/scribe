import { Injectable } from '@angular/core';

import { Channel } from '../classes/channel';
import { Clip } from '../classes/clip';
import { SearchParams } from '../classes/search-params';
import { Observable, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { SubscribedChannel } from '../classes/subscribed-channel';
import { ClipDisplay } from '../classes/clip-display';
import { LikedClip } from '../classes/liked-clip';
import { LikesService } from './likes.service';
import { EventEmitter } from '@angular/core';
import { RealtimeService } from './realtime.service';
import { CommentsService } from './comments.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private likesService: LikesService,
    private realtimeClipService: RealtimeService,
    private commentsService: CommentsService) {
    this.subscribedChannelsUpdates.subscribe(channels => this.subscribedChannels = channels);
    this.displayedClipsUpdates.subscribe(clips => this.displayedClips = clips);
    this.likedClipsUpdates.subscribe(likedClips => this.likedClips = likedClips);
  }

  private channelsUrl = environment.api_endpoint + '/channels';
  private subscribeUrl = environment.api_endpoint + '/subscribe';
  private clipsUrl = environment.api_endpoint + '/clips';

  private clipRefreshRateMs = 2000;
  private clipRefreshTrigger;
  private initalized = false;

  public subscribedChannels: Array<Channel> = [];
  public displayedClips: Array<ClipDisplay> = [];
  public likedClips: Array<LikedClip> = [];

  public subscribedChannelsUpdates: EventEmitter<Array<Channel>> = new EventEmitter();
  public displayedClipsUpdates: EventEmitter<Array<ClipDisplay>> = new EventEmitter();
  public likedClipsUpdates: EventEmitter<Array<LikedClip>> = new EventEmitter();

  getClips(parameters: SearchParams): Observable<Array<Clip>> {
    this.authService.checkAndNavigateToLogin();
    const minDate = (new Date('1/1/0001'));
    const maxDate = (new Date('12/30/9999'));

    if (parameters.start_date === undefined) {
      parameters.start_date = minDate;
    } else {
      if (parameters.start_date.toString() === 'Invalid Date') {
        parameters.start_date = minDate;
      }
    }

    if (parameters.end_date === undefined) {
      parameters.end_date = maxDate;
    } else {
      if (parameters.end_date.toString() === 'Invalid Date') {
        parameters.end_date = maxDate;
      }
    }

    let filteredArray: EventEmitter<Array<Clip>> = new EventEmitter();

    let query = this.http.get<Array<Clip>>(this.clipsUrl, {
      headers: this.authService.getAuthorizationHeader(),
      params: {
        text: (parameters.text === undefined ? '' : parameters.text),
        speaker: (parameters.speaker === undefined ? '' : parameters.speaker),
        channel_name: (parameters.channel_name === undefined ? '' : parameters.channel_name)
      }
    });

    query.subscribe((clips) => {
      filteredArray.emit(clips.filter((clip) => new Date(clip.created_at) >= parameters.start_date && new Date(clip.created_at) <= parameters.end_date));
    });

    return filteredArray;
  }

  updateClip(clipId: number, revisedText: string): Observable<any> {
    this.authService.checkAndNavigateToLogin();
    if (clipId === undefined || revisedText === undefined) return null;

    let body = new HttpParams().set('revised_text', revisedText);
    let headers = this.authService.getAuthorizationHeader().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.patch(this.clipsUrl + '/' + clipId + '/revised_text', body, { headers: headers });
  }

  getChannels(search: string): Observable<Array<Channel>> {
    this.authService.checkAndNavigateToLogin();
    if (search == null || search == "") {
      return this.http.get<Array<Channel>>(this.channelsUrl, { headers: this.authService.getAuthorizationHeader() });
    }
    else {
      return this.http.get<Array<Channel>>(this.channelsUrl, { headers: this.authService.getAuthorizationHeader(), params: { 'name': search } });;
    }
  }

  subscribeToChannel(id: number): Observable<any> {
    this.authService.checkAndNavigateToLogin();
    return this.http.post(this.subscribeUrl + '/' + id, '', { headers: this.authService.getAuthorizationHeader() });;
  }

  unsubscribeFromChannel(id: number): Observable<any> {
    this.authService.checkAndNavigateToLogin();
    return this.http.delete(this.subscribeUrl + '/' + id, { headers: this.authService.getAuthorizationHeader() });;
  }

  getSubscribedChannels(): Observable<Array<SubscribedChannel>> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get<Array<SubscribedChannel>>(this.subscribeUrl, { headers: this.authService.getAuthorizationHeader() });
  }

  initalizeServiceIfNeeded(): void {
    if (!this.initalized && this.authService.checkToken()) {
      this.initalizeChannels();
      this.realtimeClipService.clips.subscribe((clip: Clip) => {
        console.log("Recieved Clip via Websocket: ");
        console.log(clip);

        // Get Comments for the new clip and emit the new clips array to the observer
        this.commentsService.getCommentsByClipId(clip.id).subscribe((comments) => {
          let newClipDisplay = new ClipDisplay(clip, clip.channelId, comments);
          let newDisplayedClips = this.displayedClips.filter((displayedClip) => displayedClip.clip.id !== clip.id).concat(newClipDisplay);
          this.displayedClipsUpdates.emit(newDisplayedClips);
        });
      });
      // this.clipRefreshTrigger = interval(this.clipRefreshRateMs).subscribe(() => this.refreshSubscribedChannels());
      this.initalized = true;
    }
  }

  ReinitalizeService(): void {
    this.initalizeChannels();
    this.initalized = true;
  }

  initalizeChannels(): void {
    this.getSubscribedChannels().subscribe(channels => {
      let newSubscribedChannels = [];
      channels.forEach(channel => { newSubscribedChannels.push(channel.channel); });
      this.subscribedChannelsUpdates.emit(newSubscribedChannels);

      this.updateLikedClips();

      this.displayedClips = [];
      let newDisplayedClips = [];
      this.subscribedChannels.forEach((channel) => {
        const searchParams = new SearchParams();
        searchParams.start_date = new Date();
        searchParams.start_date.setMinutes(searchParams.start_date.getMinutes() - 15);
        searchParams.channel_name = channel.name;

        let commentRequestCounter = 0;
        // Get clips for channel
        this.getClips(searchParams).subscribe((response: Array<Clip>) => {
          response.forEach(clip => {

            // Get comments for clip
            this.commentsService.getCommentsByClipId(clip.id).subscribe((comments) => {
              newDisplayedClips.push(new ClipDisplay(clip, channel.id, comments));

              // If we have recieved all comments, emit the clips
              commentRequestCounter++;
              if (commentRequestCounter >= response.length){
                this.displayedClipsUpdates.emit(newDisplayedClips);
              }
            });
          });
        });
      });
    });
  }

  refreshComments(): void {
    this.displayedClips.forEach((clip) => {
      this.commentsService.getCommentsByClipId(clip.clip.id).subscribe((comments) => {
        clip.comments = comments;
      });
    });
  }

  /*
  refreshSubscribedChannels(): void {
    console.log("POLLING FOR CLIPS");
    this.updateLikedClips();

    let newDisplayedClips = [];
    this.subscribedChannels.forEach(channel => {
      const searchParams = new SearchParams();
      searchParams.start_date = new Date();
      searchParams.start_date.setMinutes(searchParams.start_date.getMinutes() - 1);
      searchParams.channel_name = channel.name;

      this.getClips(searchParams).subscribe((response: Array<Clip>) => {
        response.forEach(clip => {
          newDisplayedClips = newDisplayedClips.concat(
            new ClipDisplay(clip, channel.id)
          );
        });
        this.displayedClipsUpdates.emit(this.displayedClips.concat(newDisplayedClips));
      });

    });
  }
  */

  updateLikedClips(): void {
    this.likesService.getLikedClips().subscribe(likedClips => {
      this.likedClipsUpdates.emit(likedClips);
    });
  }
}
