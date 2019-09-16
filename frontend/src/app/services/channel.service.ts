import { Injectable } from '@angular/core';

import { Channel } from '../classes/channel';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  private channelsUrl = environment.api_endpoint+'/channels';

  getChannels(search: string): Observable<Array<Channel>> {
    if (search == null || search == "")
    {
      return this.http.get<Array<Channel>>(this.channelsUrl);
    }
    else
    {
      return this.http.get<Array<Channel>>(this.channelsUrl, { params: { 'name': search} });;
    }
  }
}
