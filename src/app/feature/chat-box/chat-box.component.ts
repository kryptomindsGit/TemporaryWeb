import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
declare var require: any
import decode from 'jwt-decode';
// import { ChatboxService } from './service/chatbox.service';
import { ChatWindowService } from './service/chat-window.service';
import { SPRING_URL } from 'src/app/constant/constant-url';
import { HttpHeaders } from '@angular/common/http';
import { EventSourceService } from 'src/app/shared/service/event-source.service';

// import { ChatWindowService } from './service/chat-window.service';
// const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {

  // Websocket variable's
  reqObject: any = [];
  resObject: any = [];
  respObject: any = [];
  evtRespObject: any = [];
  newResMessage: any = [];
  public eventName: any;
  public URL: any;
  public tagId: string;
  receiverEmail: any;
  sendMsg: any;
  greeting: any;
  name: string;

  emailId: string;
  // sendMessage: any;
  date: Date = new Date();

  senderMessages: any = [];
  reciverMessages: any = [];
  activeUser: any = [];
  public jwtData: any = [];

  userMessage: any = [];
  arrMessage: any = [];

  constructor(
    // private __eventSourceService: EventSourceService,
    private __chatboxService: ChatWindowService
  ) {
  }

  ngOnInit() {
    this.decodeJWT();
    this.getConnectWithServer();
  }


  decodeJWT() {
    let token = localStorage.getItem('access_token');
    this.jwtData = decode(token);
    console.log("Res JWT Data: ", this.jwtData.email);
  }

  /**
   * @name sendUserMessage()
   * @param messages 
   * @description send message details to spring API
   */
  sendMessage(messages: string) {
    // this.reqObject.push(messages);

    console.log("Send msg:", this.reqObject)
    let messageDetails = {
      sourceLanguageCode: "en",
      targetLanguageCode: "hi",
      text: messages,
      sender: this.jwtData.email
    };

    this.__chatboxService.senderUserMessage(messageDetails).then(
      (resData) => {
        // this.respObject.push(resData);
      },
      error => {
        console.error("Error saving user!");
        return Observable.throw(error);
      }
    );
  }

  getConnectWithServer() {
    this.__chatboxService.getServerSentEvent().subscribe((eventData) => {
      console.log("Servcer Event Connect", eventData);

      this.respObject.push(eventData);

      // for (let i = 0; i < this.respObject.length; i++) {
      //   this.receiverEmail = this.respObject[i].eventResponse.sender;
      //   console.log("Current User:", this.receiverEmail)
      // }
      // this.receiverEmail = this.respObject.eventResponse.sender;

      // if (this.receiverEmail == this.jwtData.email) {
      //   console.log("email id same");
      //   // this.resObject = this.respObject;
      // } else {
      //   console.log("not matched");
      this.newResMessage = [
        { sender: [...this.respObject], receiver: [...this.respObject] }
      ];
      console.log("Response data: ", this.newResMessage);
      // }


    });
  }
}
