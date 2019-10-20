import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  private profileBaseUrl = environment.api_endpoint+'/Auth';
  private profileGetImageUrl = this.profileBaseUrl + '/image';
  private profileUploadImageUrl = this.profileBaseUrl + '/upload';
  private profileUsernameUrl = this.profileBaseUrl + '/username';
  private changePasswordUrl = this.profileBaseUrl + '/password_reset';

  getUsername() : Observable<string> {
    this.authService.checkAndNavigateToLogin();
    return this.http.get<string>(this.profileUsernameUrl, {headers: this.authService.getAuthorizationHeader()});
  }
}
