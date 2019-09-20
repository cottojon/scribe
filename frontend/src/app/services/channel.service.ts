import { Injectable } from '@angular/core';

import { Channel } from '../classes/channel';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { SubscribedChannel } from '../classes/subscribed-channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) { }

  private channelsUrl = environment.api_endpoint+'/channels';
  private subscribeUrl = environment.api_endpoint+'/subscribe';

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

  subscribeToChannel(id: number): Observable<any> {
    this.authService.checkAndNavigateToLogin();
    return this.http.post(this.subscribeUrl+'/'+id, '', {headers: this.authService.getAuthorizationHeader()});
  }

  unsubscribeFromChannel(id: number): Observable<any> {
    this.authService.checkAndNavigateToLogin();
    return this.http.delete(this.subscribeUrl+'/'+id, {headers: this.authService.getAuthorizationHeader()});
  }

  getSubscribedChannels(): Observable<Array<SubscribedChannel>> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get<Array<SubscribedChannel>>(this.subscribeUrl, {headers: this.authService.getAuthorizationHeader()});
  }
}
