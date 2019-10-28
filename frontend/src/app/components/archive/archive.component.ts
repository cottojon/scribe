import { SearchParams } from './../../classes/search-params';
import { Component, OnInit } from '@angular/core';
import { Clip } from 'src/app/classes/clip';
import { ClipDisplay } from 'src/app/classes/clip-display';
import { Channel } from 'src/app/classes/channel';
import { ChannelService } from 'src/app/services/channel.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, interval } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  clipDisplays: ClipDisplay[];

  start_date: string;
  end_date: string;
  channel_name: string;
  text: string;
  speaker: string;

  constructor(
    private channelService: ChannelService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.checkAndNavigateToLogin();

    this.clipDisplays = [];
  }

  clearResults(): void {
    this.clipDisplays = [];
  }

  getClips(): void {

    let channel = new Channel();
    channel.name = this.channel_name;

    let searchParams = new SearchParams();
    searchParams.text = this.text;
    searchParams.channel_name = this.channel_name;
    searchParams.speaker = this.speaker;
    searchParams.start_date = new Date(this.start_date);
    searchParams.end_date = new Date(this.end_date);

    let newClipDisplays: ClipDisplay[] = [];
    this.channelService.getClips(channel, searchParams).subscribe(clips => {
      clips.forEach(clip => {
        newClipDisplays.push(new ClipDisplay(clip, clip.channelId));
      });
      this.clipDisplays = newClipDisplays;
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
    console.log("Writing update of text = " + clipDisplay.clip.text);
    this.channelService.updateClip(clipDisplay.clip.id, clipDisplay.clip.text);
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
}
