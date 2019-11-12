import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
declare var require: any
import decode from 'jwt-decode';
import { ChatWindowService } from './service/chat-window.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {


  // Variables
  public senderEmail: any;
  public emailID: any;
  public jwtData: any;
  public userRole: any;
  public userSelected: any = "";
  public userId: any;
  public activeStatus: boolean;
  public activeUser: any;
  public deactiveUser: any;
  public videoTabMenu: boolean = false;
  public audioTabMenu: boolean = false;


  // Arrays
  public messageObject: any = [];
  public messageDetails: any = [];
  public allUserArray: any = [];
  public newMessageObject: any = [];

  keyword = 'emailId';

  constructor(
    private __chatboxService: ChatWindowService,
    private __authService: AuthService,
  ) {
  }


  ngOnInit() {
    this.decodeJWToken();
    this.getServerChatEventCall();
    this.getOnlineAllUser();
    this.getAllUser();
  }

  /**
   * @name decodeJWToken()
   * @description decode the JWT
   */
  decodeJWToken() {
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
    this.messageDetails = {
      sourceLanguageCode: "en",
      targetLanguageCode: "hi",
      text: messages,
      sender: this.jwtData.email,
      receiver: this.userSelected
    };
    this.__chatboxService.senderUserMessage(this.messageDetails).then(
      (resData) => {
      },
      error => {
        return Observable.throw(error);
      }
    );
  }

  /**
   * @name getAllUser()
   * @description call API for get registered Users from Server.
   */
  getAllUser() {
    if (this.userRole == 'Employer') {
      this.__authService.getAllFreelancers().then((resData: any) => {
        this.allUserArray = resData.responseObject;
        console.log("All user list:", this.allUserArray);
        this.getActiveAllUser();
      }
      );
    } else if (this.userRole == 'Freelancer') {
      this.__authService.getAllEmployers().then((resData: any) => {
        this.allUserArray = resData.responseObject;
        console.log("All user list:", this.allUserArray);
        this.getActiveAllUser();
      }
      );
    }
  }

  /**
   * @name getActiveAllUser()
   * @description call API for get active Users from Server.
   */
  getActiveAllUser() {
    this.allUserArray.forEach(element => {
      if (element.isLoggedIn == true) {
        this.activeUser = true;
        this.getLocalStorageSenderMessage();
      }
      else {
        this.deactiveUser = false;
        this.getLocalStorageReceiverMessage();
      }
    });
  }

  /**
   * @name getOnlineAllUser()
   * @description call API for get online Users from Server.
   */
  getOnlineAllUser() {
    this.__chatboxService.getOnlineUserList().subscribe((eventData) => {
      let flag = 0;
      if (this.userRole == 'Freelancer') {
        this.userId = 2;
      } else if (this.userRole == 'Employer') {
        this.userId = 1;
      }

      this.allUserArray.forEach(element => {
        if (element.emailId == eventData.onlineUsers.emailId) {
          element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
          flag = 1;
        }
      });
      if (flag == 0 && eventData.onlineUsers.role == this.userId) {
        this.allUserArray.forEach(element => {
          if (element.emailId == eventData.onlineUsers.emailId) {
            element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
          }
        });
        this.allUserArray.push(eventData.onlineUsers);
      }
    });
  }

  /**
   * @name getServerChatEventCall()
   * @description call API for lsten server chat message event.
   */
  getServerChatEventCall() {
    this.__chatboxService.getServerSentEvent().subscribe((eventData) => {
      this.senderEmail = this.messageDetails.sender;
      if (this.senderEmail == eventData.eventResponse.sender) {
        this.messageObject.push({
          'senderMsg': eventData.eventResponse.originalText,
          'receiverMsg': eventData.eventResponse.result.translatedText,
          'user': 'sender',
          'sender': eventData.eventResponse.sender,
          'receiver': eventData.eventResponse.receiver,
        });
        var stringToStore = JSON.stringify(this.messageObject);
        localStorage.setItem("senderObj", stringToStore);
        this.getLocalStorageSenderMessage();
      }
      else {
        this.messageObject.push({
          'senderMsg': eventData.eventResponse.originalText,
          'receiverMsg': eventData.eventResponse.result.translatedText,
          'user': 'receiver',
          'receiver': eventData.eventResponse.receiver,
          'sender': eventData.eventResponse.sender,
        });
        if (eventData.eventResponse.receiver == this.emailID) {
          var stringToStore = JSON.stringify(this.messageObject);
          localStorage.setItem("receiverObj", stringToStore);
          this.getLocalStorageReceiverMessage();
        }
      }

      // var messageBody = document.querySelector('#msg_history');
      // messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });
  }

  /**
   * @name selectUser
   * @param selectedUser 
   * @description select user
   */
  selectUser(selectedUser) {
    this.userSelected = selectedUser.emailId;
    this.activeStatus = selectedUser.isLoggedIn;
  }

  /**
   * @name selectEvent()
   * @param item 
   * @description autosearch the users by email ID
   */
  selectEvent(item) {
    this.userSelected = item.emailId;
    console.log("Selected Email:", this.userSelected);
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  getLocalStorageSenderMessage() {
    var fromStorage = localStorage.getItem("senderObj");
    var objectsFromStorage = JSON.parse(fromStorage)
    this.newMessageObject = objectsFromStorage;
    console.log("Local storegae(Sender) \n", this.newMessageObject);
  }

  getLocalStorageReceiverMessage() {
    var fromStorage = localStorage.getItem("receiverObj");
    var objectsFromStorage = JSON.parse(fromStorage)
    this.newMessageObject = objectsFromStorage;
    console.log("Local storegae(Receiver) \n", this.newMessageObject);
  }

  videoCall() {
    this.videoTabMenu = true;
    console.log("videoCall", this.videoTabMenu);
    const videoCall = <HTMLVideoElement>document.getElementById('myVideo');
    console.log("My Video:", videoCall);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        videoCall.srcObject = stream;
        videoCall.play();
      })
      .catch(function (error) {
        console.log(`Error: ${error}`);

      })
  }

  videoRecoder() {


  }

  videoRecordSave() {

  }

  // Audio Record
  audioCall() {
    this.audioTabMenu = true;
    console.log("audioCall", this.audioTabMenu);
  }

  audioRecoder() {

  }

  audioRecordSave() {

  }



}
