import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { LikedClip } from '../classes/liked-clip';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) { }
  
  private likesUrl = environment.api_endpoint+'/likes';

  likeClip(clipId: number): Observable<any> {
    this.authService.checkAndNavigateToLogin();
    return this.http.post(this.likesUrl+'/'+clipId, '', {headers: this.authService.getAuthorizationHeader()});
  }
  
  unlikeClip(clipId: number): Observable<any> {
    this.authService.checkAndNavigateToLogin();
    return this.http.delete(this.likesUrl+'/'+clipId, {headers: this.authService.getAuthorizationHeader()});
  }

  getLikedClips(): Observable<Array<LikedClip>> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get<Array<LikedClip>>(this.likesUrl, {headers: this.authService.getAuthorizationHeader()});
  }
}
