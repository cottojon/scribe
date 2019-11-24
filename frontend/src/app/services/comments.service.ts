import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { TouchSequence } from 'selenium-webdriver';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClipComment } from '../classes/clip-comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) { }

    private commentsUrl = environment.api_endpoint+'/comments';

  getCommentsByClipId(clipId: number) : Observable<ClipComment[]> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get<ClipComment[]>(this.commentsUrl+"/"+clipId, {headers: this.authService.getAuthorizationHeader()});
  }

  /*
  deleteCommentByCommentId(id: number) : Observable {
    this.authService.checkAndNavigateToLogin();
    return this.http.delete(this.commentsUrl+"/"+id, {headers: this.authService.getAuthorizationHeader()});
  }
  */

  postCommentToClip(clipId: number, text: string) : Observable<any> {
    let body = new HttpParams()
      .set('text', text)
      .set('clip_id', String(clipId));

    let header = this.authService.getAuthorizationHeader()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post<any>(this.commentsUrl, body.toString(), {headers: header});
  }
}
