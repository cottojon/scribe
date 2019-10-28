import { SearchParams } from './../../classes/search-params';
import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Clip } from 'src/app/classes/clip';
import { ClipDisplay } from 'src/app/classes/clip-display';
import { Channel } from 'src/app/classes/channel';
import { ChannelService } from 'src/app/services/channel.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, interval } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { LikesService } from 'src/app/services/likes.service';
import { LikedClip } from 'src/app/classes/liked-clip';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  channelSearchInput: string;
  closeResult: string;
  activeChannels: Channel[];
  lastActiveIdx: number;
  addedChannels: Channel[];
  channelSearchResults: Channel[];
  clipDisplays: ClipDisplay[];
  showNotification = false;
  sub: Subscription;
  likedClips: LikedClip[];

  private minimumChannelWidth = 600;
  private channelMargin = 5;

  constructor(
    private channelService: ChannelService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private likesService: LikesService
  ) { }

  ngOnInit() {
    if (this.authService.checkAndNavigateToLogin()) {
      this.activeChannels = [];
      this.addedChannels = this.channelService.subscribedChannels;
      this.clipDisplays = this.channelService.displayedClips;
      this.likedClips = this.channelService.likedClips;
      this.lastActiveIdx = 0;
      this.setActiveChannelByIdx(this.lastActiveIdx);

      this.channelService.subscribedChannelsUpdates.subscribe((channels) => {
        this.addedChannels = channels;
        this.setActiveChannelByIdx(this.lastActiveIdx);
      });
      this.channelService.displayedClipsUpdates.subscribe((clips) => { this.clipDisplays = clips; });
      this.channelService.likedClipsUpdates.subscribe((likedClips) => { this.likedClips = likedClips; });
      this.channelService.initalizeServiceIfNeeded();
    }
  }

  open(content) {
    this.modalService.open(content).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  addChannel(channel: Channel): void {
    if (!this.addedChannels.some(x => x.id === channel.id)) {
      this.channelService.subscribeToChannel(channel.id).subscribe(() => this.channelService.initalizeChannels());

      if (this.addedChannels.length <= this.getMaximumDisplayedChannels()) {
        this.setActiveChannelByIdx(0);
      }
    }
  }

  removeChannel(channel: Channel): void {
    if (this.addedChannels.some(x => x.id == channel.id)) {
      this.channelService.unsubscribeFromChannel(channel.id).subscribe(() => this.channelService.initalizeChannels());
    }

    this.setActiveChannelByIdx(this.lastActiveIdx);
  }

  getMaximumDisplayedChannels(): number {
    return Math.floor(window.innerWidth / (this.minimumChannelWidth + this.channelMargin * 2));
  }

  getMaximumChannelWidth(): number {
    return Math.floor(window.innerWidth / Math.min(this.getMaximumDisplayedChannels(), Math.max(this.addedChannels.length, 1)));
  }

  setActiveChannelById(channelId: number): void {
    let idx = this.addedChannels.findIndex(x => x.id === channelId);

    if (idx === -1) {
      console.log("ERROR: Tried to set active channel to " + channelId + " but no added channel has this id");
      return;
    }

    this.setActiveChannelByIdx(idx);
  }

  setActiveChannelByIdx(idx: number): void {
    let maxDisplayedChannels = this.getMaximumDisplayedChannels();

    if (idx > this.addedChannels.length - maxDisplayedChannels) {
      idx = Math.max(0, this.addedChannels.length - maxDisplayedChannels);
    }

    this.lastActiveIdx = idx;
    this.activeChannels = this.addedChannels.filter((_, i) => i >= idx && i < idx + maxDisplayedChannels);
  }

  searchForChannel(): void {
    this.channelService.getChannels(this.channelSearchInput)
      .subscribe(
        (response: Array<Channel>) => {
          this.channelSearchResults = [];
          response.forEach(item => {
            this.channelSearchResults = this.channelSearchResults.concat(item)
          });
        },
        (error: any) => {
          console.log("searchForChannel Error: ", error);
        });
  }

  checkIfClipIsLiked(clipId: number): boolean {
    return this.likedClips.some(x => x.clipId === clipId);
  }

  getCurrentClipsForChannel(channelId: number): ClipDisplay[] {
    return this.clipDisplays.filter(x => x.channel_id === channelId);
  }

  getColor(idx: number): string {
    switch (idx % 4) {
      case 0: {
        return 'bg-secondary';
      }
      case 1: {
        return 'bg-primary';
      }
      case 2: {
        return 'bg-light';
      }
      case 3: {
        return 'bg-dark';
      }
    }
  }

  findChannelFromId(channel_id: number): Channel {
    return this.activeChannels.filter(x => x.id === channel_id)[0];
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closeNotification(): void {
    this.showNotification = false;
  }

  playClip(clipDisplay: ClipDisplay): void {
    const audio = new Audio();
    // audio.src = 'http://' + document.location.hostname + clipDisplay.clip.path_to_file;
    audio.src = ('../../../assets/clips/' + clipDisplay.clip.path_to_file.toString());
    audio.load();
    audio.play();
  }

  likeClip(clipDisplay: ClipDisplay) {
    this.likesService.likeClip(clipDisplay.clip.id).subscribe(x => this.channelService.updateLikedClips());
  }

  unlikeClip(clipDisplay: ClipDisplay) {
    this.likesService.unlikeClip(clipDisplay.clip.id).subscribe(x => this.channelService.updateLikedClips());
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setActiveChannelByIdx(this.lastActiveIdx);
  }

  makeCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = true;
  }

  saveCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = false;
    this.channelService.updateClip(clipDisplay.clip.id, clipDisplay.displayed_text).subscribe(() => {
      this.channelService.ReinitalizeService();
    });
  }

  showRevisedText(clipDisplay: ClipDisplay): void {
    clipDisplay.displayed_text = clipDisplay.clip.revised_text;
    clipDisplay.displayingOriginalText = false;
  }

  showOriginalText(clipDisplay: ClipDisplay): void {
    clipDisplay.displayed_text = clipDisplay.clip.text;
    clipDisplay.displayingOriginalText = true;
  }
}
