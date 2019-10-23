import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import createSubscriber, { Subscriber } from 'pg-listen';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';



/*
const databaseURL = 'postgres://postgres:postgres@localhost:5432/scribe';

// Accepts the same connection config object that the "pg" package would take
const subscriber: Subscriber = createSubscriber({ connectionString: databaseURL });

subscriber.notifications.on("new_clip", (payload) => {
  // Payload as passed to subscriber.notify() (see below)
  console.log("Received notification in 'new_clip':", payload);
});

subscriber.events.on("error", (error) => {
  console.error("Fatal database connection error:", error);
  //process.exit(1)
});


subscriber.events.on("reconnect", (attempt) => {
  console.error("Database reconnection attempt: ", attempt);
});

process.on("exit", () => {
  subscriber.close();
});

export async function connect() {
  console.log("inside connect function");
  await subscriber.connect();
  await subscriber.listenTo("new_clip");
}

//connect();
*/

//serve client allows us to serve the client socket.io file
//namespace: default name space is root = '/'
@WebSocketGateway({namespace:'/chat'}) // we can put in a port number or options for our gateway, if nothing it defaults to the basic socket.io options/ port
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  private databaseURL = 'postgres://postgres:postgres@localhost:5432/scribe';

  // Accepts the same connection config object that the "pg" package would take
  public subscriber: Subscriber = createSubscriber({ connectionString: this.databaseURL });;

  constructor(){
      
      this.subscriber.notifications.on("new_clip", (payload) => {
          // Payload as passed to subscriber.notify() (see below)
          console.log("Received notification in 'new_clip':", payload);
          this.wss.emit('chatToClient', payload); //emit the payload to client
        });
        
        this.subscriber.events.on("error", (error) => {
          console.error("Fatal database connection error:", error);
          //process.exit(1)
        });
        
        
        this.subscriber.events.on("reconnect", (attempt) => {
          console.error("Database reconnection attempt: ", attempt);
        });


        process.on("exit", () => {
          this.subscriber.close();
        });

        //connect to subscriber
        this.connect();
  }


  async connect()  {
    console.log("inside connect function");
   await this.subscriber.connect();
   await this.subscriber.listenTo("new_clip");
  }

  





  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() wss: Server; // to be able to emit responses to everyone

  
  // implement this method after intializing gateway
  afterInit(server: Server) {
    this.logger.log('Intialized');
  }

  // implement this method for disconnect
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`); //client.id is a unique string for every client, if a socket disconnects and reconnects its going to have a different id
    client.leaveAll(); //leave all rooms
  }

  // implement this method for connection
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
  }


   //client subscribes to event called msgToServer
  // the client will send a event called 'msgToServer'
  @SubscribeMessage('msgToServer') //this decorater is the method that will handle each event request to the server. The name of the event goes in the decorator as a string
  handleMessage(client: Socket, text: string): WsResponse<string> { // get passed in the client socket and the text and client is sending witht eh event
    
    //to emit a message to everyone we can do
    // this.wss.emit('msgToClient', text);



    // this will only return to the client that send the event not every one connected to the socket
    return {event: 'msgToClient', data: text}; //we return a web socket response with the event name and the data getting passed back(data type and return type should match)
    // this is equivalent to doing client.emit('msgToClient', text);
  }




  /*
  @SubscribeMessage('chatToServer')
  handleMessage2(client: Socket, message: {sender: string, room: string, message: string}){
    //emit to a room
    this.wss.to(message.room).emit('chatToClient', message);
  }


  //leaving a room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string){
    client.join(room); //client joins a room
    client.emit('joinedRoom', room); //event name, pass the room that the client joined
  }


  //joining a room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string){
    //client leaves a room
    client.leave(room);
    client.emit('leftRoom', room); //event name, pass the room that the client left

  }
*/

}
