import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private client: HttpClient) { }

  private token = "";
  private url = environment.api_endpoint+'/auth';

  signin(username: string, password: string): Observable<any> {
    let body = new HttpParams()
      .set('username', username)
      .set('password', password);

    let header = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.client.post(this.url+"/signin", body.toString(), {headers: header});
  }
}
