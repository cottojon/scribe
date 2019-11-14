import { Injectable } from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Observable, Subject} from 'rxjs/Rx';



@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  clips: Subject<any>;

  //dp inject websocket service
  constructor(private websocketService: WebsocketService) { 
    this.clips = <Subject<any>>websocketService.connect().map((response: any) : any =>{
      return response;
    })
  }


  //sendmessage to backend gateway
  sendMessage(msg: any){
    this.clips.next(msg); //
  }
}
