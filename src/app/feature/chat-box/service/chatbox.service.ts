import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SPRING_URL } from '../../../constant/constant-url';
import { throwError } from 'rxjs';
import * as SockJS from 'sockjs-client';
// import { ChatBoxComponent } from '../chat-box.component';

//CORS
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'X-Authorization': localStorage.getItem('userAuthToken')
  })
};



@Injectable({
  providedIn: 'root'
})

export class ChatboxService {

  public currentUserName;

  // webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/greetings";
  stompClient: any;
  tokenAuth: any;


  // appComponent: any;


  constructor(
    private __http: HttpClient
    // chatBoxComponent: ChatBoxComponent
  ) {
    this.tokenAuth = localStorage.getItem('userAuthToken');
    this.currentUserName = 'Bhushan Mahajan';
    // this.appComponent = chatBoxComponent;
  }
  // let res = await this.__http.get(`${SPRING_URL}/employer/profile/` + email, httpOptions).toPromise();


  connectChatApp() {
    // this.currentUserName = localStorage.getItem('userName');

    console.log("Current User:", this.currentUserName);

    if (this.currentUserName) {
      console.log("Initialize Connection");
      let ws = new SockJS(`${SPRING_URL}/websocket`);
      // this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, this.onConnected, this.onError);
      // const _this = this;
      // _this.stompClient.connect({}, function (frame) {
      //   _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
      //     _this.getUserMessage(sdkEvent);
      //   });
      //   _this.stompClient.send(`${SPRING_URL}/app/chat.addUser`, JSON.stringify({ sender: this.currentUserName, type: 'JOIN' })
      //   )
      //   //_this.stompClient.reconnect_delay = 2000;
      // }, this.errorCallBack);
    };
  }

  onError(error) {
    // connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    // connectingElement.style.color = 'red';
  }

  onConnected() {
    // Subscribe to the Public Topic
    console.log("In OnConnected");

    this.stompClient.subscribe(`${SPRING_URL}/topic/public`, this.onMessageReceived);

    // Tell your username to the server
    this.stompClient.send(`${SPRING_URL}/app/chat.addUser`,
      {},
      JSON.stringify({ sender: this.currentUserName, type: 'JOIN' })
    )

    // connectingElement.classList.add('hidden');
  }

  disconnectChatApp() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }


  async sendUserMessage(userMessageDetails: any) {
    try {
      console.log("Res - User msg:", userMessageDetails);

      // let result = await this.stompClient.send(`${SPRING_URL}/app/hello`, userMessageDetails).toPromise();
      let result = await this.stompClient.send(`${SPRING_URL}/app/chat.sendMessage`, {}, JSON.stringify(userMessageDetails));
      return result;
    } catch (error) {
      // await this.handleError(error);
    }
  }



  onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
      messageElement.classList.add('event-message');
      message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
      messageElement.classList.add('event-message');
      message.content = message.sender + ' left!';
    } else {
      messageElement.classList.add('chat-message');

      var avatarElement = document.createElement('i');
      var avatarText = document.createTextNode(message.sender[0]);
      avatarElement.appendChild(avatarText);
      // avatarElement.style['background-color'] = getAvatarColor(message.sender);

      messageElement.appendChild(avatarElement);

      var usernameElement = document.createElement('span');
      var usernameText = document.createTextNode(message.sender);
      usernameElement.appendChild(usernameText);
      messageElement.appendChild(usernameElement);
    }


    // async getUserMessage(userMessage: string) {
    //   try {
    //     // let res = await this.appComponent.handleMessage(JSON.stringify(userMessage));
    //     // return res;
    //   } catch (error) {
    //     await this.handleError(error);
    //   }
    // }

    // // Error Handler
    // handleError(error) {
    //   let errorMessage = '';
    //   if (error.error instanceof ErrorEvent) {
    //     // client-side error
    //     errorMessage = `Client Error: ${error.error.message}`;
    //   } else {
    //     // server-side error
    //     errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    //   }
    //   console.log(" Error : ", errorMessage);
    //   return throwError(errorMessage);
    // }

    // // on error, schedule a reconnection attempt
    // errorCallBack(error) {
    //   console.log("errorCallBack -> " + error)
    //   setTimeout(() => {
    //     this.connectChatApp();
    //   }, 5000);
    // }


    // async getBrodcastMessage(userName: string) {
    //   try {
    //     let res = await this.__http.get(`${SPRING_URL}/chatbox/` + userName, httpOptions).toPromise();
    //     return res;
    //   } catch (error) {
    //     await this.handleError(error);
    //   }
    // }



  }
}