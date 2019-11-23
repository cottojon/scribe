import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SigninResponse } from '../classes/signin-response';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

  private token = "";
  private url = environment.api_endpoint+'/auth';
  private loginPingUrl = this.url+"/username";

  signin(username: string, password: string): Observable<SigninResponse> {
    let body = new HttpParams()
      .set('username', username)
      .set('password', password);

    let header = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    let observable = this.http.post<SigninResponse>(this.url+"/signin", body.toString(), {headers: header});
    observable.subscribe(x => {
      this.token = x.accessToken;
    });

    return observable;
  }

  logoutAndRedirect(): void {
    this.token = "";
    this.router.navigate(['']);
  }

  checkToken(): boolean {
    return this.token !== "";
  }

  checkAndNavigateToLogin(): boolean {
    let result = this.checkToken();

    this.http.get<string>(this.loginPingUrl, {headers: this.getAuthorizationHeader()}).subscribe(() => {}, (error) => {
      console.log("Failed authorization ping, logging out");
      this.router.navigate(['']);
      this.token = "";
    });

    if (!result) {
      this.router.navigate(['']);
    }

    return result;
  }

  getToken(): string {
    return this.token;
  }

  getAuthorizationHeader(): HttpHeaders {
    return this.addAuthorizationHeader(new HttpHeaders());
  }

  addAuthorizationHeader(headers: HttpHeaders): HttpHeaders {
    return headers.set('Authorization', 'Bearer '+this.token);
  }
}
