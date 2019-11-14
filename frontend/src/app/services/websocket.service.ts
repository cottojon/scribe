import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket; //socket that connects to our socket.io server

  constructor() { }


  connect() : Rx.Subject<MessageEvent> {
    this.socket = io(environment.ws_url);


    //create an observer and observable for our subject

    //this observable will handle all the new messages coming from our websocket gateway
    let observable = new Observable(observer => {
      this.socket.on('chatToClient', (data) => {
        console.log("Received Message from websocket gateway");
        observer.next(data);
      })

      return () => {
        this.socket.disconnect(); //disconnect
      }
    });



    //this observer listens to messagea and emit/sends messages to the websocket gateway
    let observer = {
      next : (data: Object) => {
        this.socket.emit('chatToServer', JSON.stringify(data));
      },

    };


    //return a rx.subject which is both an observer and observable
    return Rx.Subject.create(observer, observable);
  }
}
