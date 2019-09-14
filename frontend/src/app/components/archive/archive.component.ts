import { SearchParams } from './../../classes/search-params';
import { Component, OnInit } from '@angular/core';
import { Clip } from 'src/app/classes/clip';
import { ClipDisplay } from 'src/app/classes/clip-display';
import { Channel } from 'src/app/classes/channel';
import { ChannelService } from 'src/app/services/channel.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ClipService } from 'src/app/services/clip.service';
import { Observable, Subscription, interval } from 'rxjs';

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
    private clipService: ClipService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.clipDisplays = [];
  }

  getClips(): void {
    let newClipDisplays: ClipDisplay[] = [];

    const channel = new Channel();
    channel.name = this.channel_name;

    if (channel !== null) {
      const searchParams = new SearchParams();
      searchParams.text = this.text;
      searchParams.channel_name = this.channel_name;
      searchParams.speaker = this.speaker;
      searchParams.start_date = new Date(this.start_date);
      searchParams.end_date = new Date(this.end_date);

      this.clipService.getClips(channel, searchParams).subscribe(
        response =>
          response.data.forEach(clip => {
            newClipDisplays = newClipDisplays.concat(
              new ClipDisplay(clip, channel.name)
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
  }

  makeCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = true;
  }

  saveCorrection(clipDisplay: ClipDisplay): void {
    clipDisplay.editing = false;
    this.clipService.saveClip(clipDisplay.clip);
  }

  playClip(clipDisplay: ClipDisplay): void {
    const audio = new Audio();
    audio.src = ('../../../assets/clips/' + clipDisplay.clip.path_to_file.toString());
    audio.load();
    audio.play();
  }
}
