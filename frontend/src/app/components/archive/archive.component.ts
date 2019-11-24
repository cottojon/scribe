import { SearchParams } from './../../classes/search-params';
import { Component, OnInit } from '@angular/core';
import { Clip } from 'src/app/classes/clip';
import { ClipDisplay } from 'src/app/classes/clip-display';
import { Channel } from 'src/app/classes/channel';
import { ChannelService } from 'src/app/services/channel.service';
import { NgbModal, ModalDismissReasons, NgbDateStruct, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, interval } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ClipComment } from 'src/app/classes/clip-comment';
import { ProfileService } from 'src/app/services/profile.service';
import { CommentsService } from 'src/app/services/comments.service';
import { LikedClip } from 'src/app/classes/liked-clip';
import { LikesService } from 'src/app/services/likes.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class ArchiveComponent implements OnInit {
  clipDisplays: ClipDisplay[];
  channels: Channel[];

  start_date: Date;
  end_date: Date;
  channel_name: string;
  text: string;
  speaker: string;
  any_channel: Channel;
  likedClips: LikedClip[];

  constructor(
    private channelService: ChannelService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private router: Router,
    private profileSerivce: ProfileService,
    private commentsService: CommentsService,
    private likesService: LikesService
  ) {}

  ngOnInit() {
    this.authService.checkAndNavigateToLogin();

    this.clipDisplays = [];
    this.likedClips = [];

    this.any_channel = new Channel();
    this.any_channel.name = "";
    this.channels = [this.any_channel];

    this.channelService.getChannels("").subscribe((channels) => {
      this.channels = [this.any_channel].concat(channels);
    });

    this.refreshLikedClips();
  }

  refreshLikedClips(): void {
    this.likesService.getLikedClips().subscribe((likedClips) => {
      this.likedClips = likedClips;
    })
  }

  likeClip(clipDisplay: ClipDisplay) {
    this.likesService.likeClip(clipDisplay.clip.id).subscribe(x => this.refreshLikedClips());
  }

  unlikeClip(clipDisplay: ClipDisplay) {
    this.likesService.unlikeClip(clipDisplay.clip.id).subscribe(x => this.refreshLikedClips());
  }

  clearResults(): void {
    this.clipDisplays = [];
  }
  
  checkIfClipIsLiked(clipId: number): boolean {
    return this.likedClips.some(x => x.clipId === clipId);
  }

  getClips(): void {
    this.refreshLikedClips();

    let searchParams = new SearchParams();
    searchParams.text = this.text;
    searchParams.channel_name = this.channel_name;
    searchParams.speaker = this.speaker;
    searchParams.start_date = (this.start_date === null || !(this.start_date instanceof Date)) ? undefined : this.start_date;
    searchParams.end_date = (this.end_date === null || !(this.end_date instanceof Date)) ? undefined : this.end_date;

    let newClipDisplays: ClipDisplay[] = [];

    let commentRequestCounter = 0;
    // Get clips for search params
    this.channelService.getClips(searchParams).subscribe(clips => {
      clips.forEach(clip => {

        // Get comments for clip
        this.commentsService.getCommentsByClipId(clip.id).subscribe((comments) => {
          newClipDisplays.push(new ClipDisplay(clip, clip.channelId, comments));

          // If we have recieved all comments, emit the clips
          commentRequestCounter++;
          if (commentRequestCounter >= clips.length) {
            this.clipDisplays = newClipDisplays.sort((a, b) => {
              return (a.created_at > b.created_at) ? 1 : ((a.created_at < b.created_at) ? -1 : (a.clip.id - b.clip.id));
            });
          }
        });
      });
    });
    /*
    if (channel !== null) {
      const searchParams = new SearchParams();
      searchParams.text = this.text;
      searchParams.channel_name = this.channel_name;
      searchParams.speaker = this.speaker;
      searchParams.start_date = new Date(this.start_date);
      searchParams.end_date = new Date(this.end_date);

      this.clipService.getClips(channel, searchParams).subscribe(
        (response: Array<Clip>) =>
          response.forEach(clip => {
            newClipDisplays = newClipDisplays.concat(
              new ClipDisplay(clip, channel.id)
            );
          }),
        error => console.log('Error: ', error),
        () => {
          this.clipDisplays = newClipDisplays.sort(
            (a, b) =>
              a.created_at.valueOf() > b.created_at.valueOf()
                ? -1
                : a.created_at.valueOf() < b.created_at.valueOf()
                  ? 1
                  : 0
          );
          console.log(this.clipDisplays);
        }
      );
    }
    */
  }

  makeCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = true;
  }

  saveCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = false;
    this.channelService.updateClip(clipDisplay.clip.id, clipDisplay.displayed_text).subscribe(() => {
      this.channelService.ReinitalizeService();
      this.getClips();
    });
  }

  playClip(clipDisplay: ClipDisplay): void {
    const audio = new Audio();
    audio.src = ('../../../assets/clips/' + clipDisplay.clip.path_to_file.toString());
    audio.load();
    audio.play();
  }

  viewInChannel(clipDisplay: ClipDisplay): void {
    this.text = '';
    this.speaker = '';
    this.start_date = undefined;
    this.end_date = undefined;
    this.channel_name = clipDisplay.clip.channel.name;
    this.getClips();
  }
  
  showRevisedText(clipDisplay: ClipDisplay): void {
    clipDisplay.displayed_text = clipDisplay.clip.revised_text;
    clipDisplay.displayingOriginalText = false;
  }

  showOriginalText(clipDisplay: ClipDisplay): void {
    clipDisplay.displayed_text = clipDisplay.clip.text;
    clipDisplay.displayingOriginalText = true;
  }

  toggleShowComments(clipDisplay: ClipDisplay): void {
    clipDisplay.showingComments = !clipDisplay.showingComments;
  }

  toggleWritingComment(clipDisplay: ClipDisplay): void {
    clipDisplay.writingComment = !clipDisplay.writingComment;
    if (clipDisplay.writingComment){
      clipDisplay.newCommentText = "";
      clipDisplay.showingComments = true;
    }
  }

  loadCommentUserInfo(comment: ClipComment): void {
    if (comment.userName === null || comment.userName === undefined || comment.userName === ""){
      this.profileSerivce.getUsernameById(comment.userId).subscribe((response) => {
        comment.userName = response["username"];
      });
    }

    if (!comment.profileImageLoaded && !comment.profileImageLoading) {
      comment.profileImageLoading = true;
      let fileReader = new FileReader();
      this.profileSerivce.getImageByUserId(comment.userId).subscribe((raw) => {
        if (raw && raw.size != 0) {
          fileReader.addEventListener("load", () => { comment.profileImage = fileReader.result; comment.profileImageLoaded = true;}, false);
          fileReader.readAsDataURL(raw);
        }
      });
    }
  }

  submitComment(clipDisplay: ClipDisplay): void {
    this.commentsService.postCommentToClip(clipDisplay.clip.id, clipDisplay.newCommentText).subscribe((comment) => {
      clipDisplay.comments.push(comment);
    });
    this.toggleWritingComment(clipDisplay);
  }
}
