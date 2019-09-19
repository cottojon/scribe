import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SigninResponse } from '../classes/signin-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private client: HttpClient) { }

  private token = "";
  private url = environment.api_endpoint+'/auth';

  signin(username: string, password: string): Observable<SigninResponse> {
    let body = new HttpParams()
      .set('username', username)
      .set('password', password);

    let header = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    console.log("Body: "+body.toString());

    let observable = this.client.post<SigninResponse>(this.url+"/signin", body.toString(), {headers: header});
    observable.subscribe(x => {
      this.token = x.accessToken;
    });

    return observable;
  }

  checkToken(): boolean {
    return this.token === "";
  }
}
