import { Injectable } from '@angular/core';

import { Channel } from '../classes/channel';
import { Clip } from '../classes/clip';
import { SearchParams } from '../classes/search-params';
import { ClipResponse } from '../classes/clip-response';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  constructor(private http: HttpClient) { }

  // private clipsUrl = 'http://ec2-52-14-40-111.us-east-2.compute.amazonaws.com:3000/api/clips';
  private clipsUrl = '/api/clips';

  getClips(channel: Channel, parameters: SearchParams): Observable<ClipResponse> {
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
    return this.http.get<ClipResponse>(this.clipsUrl, {
      params: {
        text: (parameters.text === undefined ? '' : parameters.text),
        speaker: (parameters.speaker === undefined ? '' : parameters.speaker),
        channel_name: (parameters.channel_name === undefined ? '' : parameters.channel_name),
        channel_id: (channel.id === undefined ? '' : channel.id.toString()),
        start_date: parameters.start_date.toJSON(),
        end_date: (parameters.end_date.toString() === 'Invalid Date' ? maxDate.toJSON() : parameters.end_date.toJSON())
      }
    });
  }

  saveClip(clip: Clip) {

    return this.http.put(this.clipsUrl, {
      'text': clip.text.toString(),
      'id': clip.id.toString()
    })
      .subscribe(data => {
        console.log('PUT Request is successful ', data);
      },
        error => {
          console.log('Error', error);
        });
  }
}
