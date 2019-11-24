import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) { }

  private profileBaseUrl = environment.api_endpoint+'/auth';
  private profileGetImageUrl = this.profileBaseUrl + '/image';
  private profileUploadImageUrl = this.profileBaseUrl + '/upload';
  private profileUsernameUrl = this.profileBaseUrl + '/username';
  private changePasswordUrl = this.profileBaseUrl + '/password_reset';

  getUsername() : Observable<string> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get<string>(this.profileUsernameUrl, {headers: this.authService.getAuthorizationHeader()});
  }

  getUsernameById(id: number) : Observable<any> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get<any>(this.profileBaseUrl+"/"+id, {headers: this.authService.getAuthorizationHeader()});
  }

  getImage(): Observable<Blob> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get(this.profileGetImageUrl, {headers: this.authService.getAuthorizationHeader(), responseType: 'blob'});
  }

  getImageByUserId(id: number) : Observable<Blob> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get(this.profileGetImageUrl+"/"+id, {headers: this.authService.getAuthorizationHeader(), responseType: 'blob'});
  }

  uploadProfileImage(image): Observable<any> {
    this.authService.checkAndNavigateToLogin();

    let body = new FormData();
    body.append('file', image, image.name);

    return this.http.post(this.profileUploadImageUrl, body, {headers: this.authService.getAuthorizationHeader()});
  }

  changePassword(currentPassword: string, newPassword:string): Observable<any> {
    let body = new HttpParams()
      .set('new_password', newPassword)
      .set('current_password', currentPassword);

    let header = this.authService.getAuthorizationHeader()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.changePasswordUrl, body.toString(), {headers: header});
  }
}
