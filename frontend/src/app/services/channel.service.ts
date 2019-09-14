import { Injectable } from '@angular/core';

import { Channel } from '../classes/channel';
import { ChannelResponse } from '../classes/channel-response';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  // private channelsUrl = 'http://ec2-52-14-40-111.us-east-2.compute.amazonaws.com:3000/api/channels';
  private channelsUrl = '/api/channels';

  getChannels(search: string): Observable<ChannelResponse> {
    console.log('Im at ' + window.location.host);
    return this.http.get<ChannelResponse>(this.channelsUrl, { params: { 'name': search} });
  }
}
