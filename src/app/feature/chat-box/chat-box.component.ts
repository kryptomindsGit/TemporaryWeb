import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
declare var require: any
import decode from 'jwt-decode';
// import { ChatboxService } from './service/chatbox.service';
import { ChatWindowService } from './service/chat-window.service';
import { SPRING_URL } from 'src/app/constant/constant-url';
import { HttpHeaders } from '@angular/common/http';
import { EventSourceService } from 'src/app/shared/service/event-source.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';

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
  senderObject: any = [];
  receiverObject: any = [];
  senderEmail: any;
  evtRespObject: any = [];


  newSenderMessage: any = [];
  newReceiverMessage: any = [];

  senderMessage: any = [];
  receiverMessage: any = [];
  messageDetails: any = [];
  public eventName: any;
  public URL: any;
  public tagId: string;
  receiverEmail: any;
  sendMsg: any;
  greeting: any;
  name: string;

  sendUser: boolean = false;
  receiverUser: boolean = false;

  public userRole: any;
  public userSelected: any = "";
  public activeStatus: boolean;
  userId: number;
  emailID: string;
  // sendMessage: any;
  date: Date = new Date();

  senderMessages: any = [];
  reciverMessages: any = [];
  public activeUser: any = [];
  public deactiveUser: any = [];
  public jwtData: any = [];

  userMessage: any = [];
  arrMessage: any = [];

  TypeMsg: any = "Type a Message";


  public allusers: any = [];

  keyword = 'emailId'

  constructor(
    // private __eventSourceService: EventSourceService,
    private __chatboxService: ChatWindowService,
    private __authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.decodeJWT();
    this.getConnectWithServer();
    this.getOnlineUsers();
    this.getAllUser();
  }

  decodeJWT() {
    let token = localStorage.getItem('access_token');
    this.jwtData = decode(token);
    this.userRole = this.jwtData['custom:role'];
    this.emailID = this.jwtData['email'];
  }

  /**
   * @name sendUserMessage()
   * @param messages 
   * @description send message details to spring API
   */
  sendMessage(messages: string) {

    // this.reqObject.push(messages);
    this.messageDetails = {
      sourceLanguageCode: "en",
      targetLanguageCode: "hi",
      text: messages,
      sender: this.jwtData.email,
      receiver: this.userSelected
    };
    this.__chatboxService.senderUserMessage(this.messageDetails).then(
      (resData) => {
        // this.respObject.push(resData); 
      },
      error => {
        return Observable.throw(error);
      }
    );
  }

  getAllUser() {
    if (this.userRole == 'Employer') {
      this.__authService.getAllFreelancers().then((resData: any) => {
        this.allusers = resData.responseObject;
        console.log("All user list:", this.allusers);

        this.getActivateUserAllList();
      }
      );
    } else if (this.userRole == 'Freelancer') {
      this.__authService.getAllEmployers().then((resData: any) => {
        this.allusers = resData.responseObject;
        console.log("All user list:", this.allusers);

        this.getActivateUserAllList();
      }
      );
    }
  }

  getActivateUserAllList() {
    this.allusers.forEach(element => {
      if (element.isLoggedIn == true) {
        this.activeUser = true;
      }
      else {
        this.deactiveUser = false;
      }
    });
  }

  getOnlineUsers() {
    this.__chatboxService.getOnlineUserList().subscribe((eventData) => {
      let flag = 0;
      if (this.userRole == 'Freelancer') {
        this.userId = 2;
      } else if (this.userRole == 'Employer') {
        this.userId = 1;
      }

      this.allusers.forEach(element => {
        if (element.emailId == eventData.onlineUsers.emailId) {
          element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
          flag = 1;
        }
      });
      if (flag == 0 && eventData.onlineUsers.role == this.userId) {
        this.allusers.forEach(element => {
          if (element.emailId == eventData.onlineUsers.emailId) {
            element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
          }
        });
        this.allusers.push(eventData.onlineUsers);
      }
    });
  }

  getConnectWithServer() {
    this.__chatboxService.getServerSentEvent().subscribe((eventData) => {
      this.senderEmail = this.messageDetails.sender;
      if (this.senderEmail == eventData.eventResponse.sender) {
        this.senderObject.push({
          'senderMsg': eventData.eventResponse.originalText,
          'receiverMsg': eventData.eventResponse.result.translatedText,
          'user': 'sender',
          'sender': eventData.eventResponse.sender,
          'receiver': eventData.eventResponse.receiver,
        });
        this.sendUser = true;
        this.receiverUser = false;
        this.newSenderMessage = [...this.senderObject];
        console.log("this.newSenderMessage(Sender) \n", this.newSenderMessage);
      }
      else {
        this.senderObject.push({
          'senderMsg': eventData.eventResponse.originalText,
          'receiverMsg': eventData.eventResponse.result.translatedText,
          'user': 'receiver',
          'receiver': eventData.eventResponse.receiver,
          'sender': eventData.eventResponse.sender,
        });
        if (eventData.eventResponse.receiver == this.emailID) {
          this.sendUser = false;
          this.receiverUser = true;
          this.newSenderMessage = [...this.senderObject];
          console.log("this.newSenderMessage(Receiver) \n", this.newSenderMessage);
        }
      }
    });
  }
  selectUser(selectedUser) {
    this.userSelected = selectedUser.emailId;
    this.activeStatus = selectedUser.isLoggedIn;
    console.log("selected User", this.userSelected);
  }

  /**
   * @name Autosearch
   * @param item 
   */
  selectEvent(item) {
    this.userSelected = item.emailId;
    console.log("Selected Email:", this.userSelected);

    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }
}
