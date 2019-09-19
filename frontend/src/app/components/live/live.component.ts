import { SearchParams } from './../../classes/search-params';
import { Component, OnInit, HostListener } from '@angular/core';
import { Clip } from 'src/app/classes/clip';
import { ClipDisplay } from 'src/app/classes/clip-display';
import { Channel } from 'src/app/classes/channel';
import { ChannelService } from 'src/app/services/channel.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ClipService } from 'src/app/services/clip.service';
import { Observable, Subscription, interval } from 'rxjs';

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
  
  private minimumChannelWidth = 600;
  private channelMargin = 5;

  constructor(
    private channelService: ChannelService,
    private clipService: ClipService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.activeChannels = [];
    this.addedChannels = [];
    this.clipDisplays = [];
    this.lastActiveIdx = 0;

    this.sub = interval(2000)
      .subscribe((val) => {
        this.getNewClips();
      });
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
      this.addedChannels.push(channel);
      this.getClips();

      if (this.addedChannels.length <= this.getMaximumDisplayedChannels()){
        this.setActiveChannelByIdx(0);
      }
    }
  }

  removeChannel(channel: Channel): void{
    this.addedChannels = this.addedChannels.filter(x => x.id != channel.id);
    this.setActiveChannelByIdx(this.lastActiveIdx);
  }

  getMaximumDisplayedChannels(): number {
    return Math.floor(window.innerWidth/(this.minimumChannelWidth));
  }

  getMaximumChannelWidth(): number {
    return Math.floor(window.innerWidth/Math.min(this.getMaximumDisplayedChannels(), Math.max(this.addedChannels.length, 1)));
  }

  setActiveChannelById(channelId: number): void {
    let idx = this.addedChannels.findIndex(x => x.id === channelId);

    if (idx === -1)
    {
      console.log("ERROR: Tried to set active channel to " + channelId + " but no added channel has this id");
      return;
    }

    this.setActiveChannelByIdx(idx);
  }

  setActiveChannelByIdx(idx: number): void {
    let maxChannels = this.getMaximumDisplayedChannels();

    if (idx > this.addedChannels.length - maxChannels)
    {
      idx = Math.max(0, this.addedChannels.length - maxChannels);
    }

    this.lastActiveIdx = idx;
    this.activeChannels = this.addedChannels.filter((_, i) => i >= idx && i < idx + maxChannels);
  }

  searchForChannel(): void {
    this.channelService.getChannels(this.channelSearchInput)
      .subscribe(
        (response: Array<Channel>) => {
          this.channelSearchResults = [];
          console.log("Recieved channels: ", response)
          response.forEach(item => {
            this.channelSearchResults = this.channelSearchResults.concat(item)
          });
        },
        (error: any) => {
          console.log("searchForChannel Error: ", error);
        });
  }

  getClips(): void {
    let newClipDisplays: ClipDisplay[] = [];

    this.activeChannels.forEach(channel => {
      if (channel !== null) {

        const searchParams = new SearchParams();
        searchParams.start_date = new Date();
        searchParams.start_date.setHours(searchParams.start_date.getHours() - 1);

        this.clipService.getClips(channel, searchParams).subscribe((response: Array<Clip>) => response.forEach(clip => {
          newClipDisplays = newClipDisplays.concat(
            new ClipDisplay(clip, channel.id)
          );
        }),
          error => console.log('Error: ', error),
          () => {

            this.clipDisplays = newClipDisplays.sort((a, b) =>
              a.created_at.valueOf() > b.created_at.valueOf() ? -1 : a.created_at.valueOf() < b.created_at.valueOf() ? 1 : 0
            );
          });
      }
    });
  }

  getNewClips(): void {
    let newClipDisplays: ClipDisplay[] = [];

    this.activeChannels.forEach(channel => {
      if (channel !== null) {

        const searchParams = new SearchParams();
        searchParams.start_date = new Date();
        searchParams.start_date.setMinutes(searchParams.start_date.getMinutes() - 1);

        this.clipService.getClips(channel, searchParams).subscribe((response: Array<Clip>) => response.forEach(clip => {
          newClipDisplays = newClipDisplays.concat(
            new ClipDisplay(clip, channel.id)
          );
        }),
          error => console.log('Error: ', error),
          () => {

            // this.clipDisplays = newClipDisplays.sort((a, b) =>
            //   a.created_at.valueOf() > b.created_at.valueOf() ? -1 : a.created_at.valueOf() < b.created_at.valueOf() ? 1 : 0
            //   );
            newClipDisplays = newClipDisplays.filter(newClipDisplay =>
              this.clipDisplays.filter(oldClipDiplay => newClipDisplay.clip.id === oldClipDiplay.clip.id).length === 0
            );
            newClipDisplays = newClipDisplays.concat(this.clipDisplays)
              .sort((a, b) =>
                a.created_at.valueOf() > b.created_at.valueOf() ? -1 : a.created_at.valueOf() < b.created_at.valueOf() ? 1 : 0
              );

            this.clipDisplays = newClipDisplays;
          });
      }
    });
  }

  getCurrentClipsForChannel(channelId: number): ClipDisplay[]
  {
    return this.clipDisplays.filter(x => x.channel_id === channelId);
  }

  getColor(idx: number): string {
    switch (idx%4) {
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setActiveChannelByIdx(this.lastActiveIdx);
  }
}
