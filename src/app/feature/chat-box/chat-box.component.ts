import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
declare var require: any
import decode from 'jwt-decode';
import { ChatWindowService } from './service/chat-window.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import { VideoAudioChatService } from './service/video-audio-chat.service';
declare var SimplePeer: any;


declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
    RTCSessionDescription: RTCSessionDescription;
    mozRTCSessionDescription: RTCSessionDescription;
    webkitRTCSessionDescription: RTCSessionDescription;
    RTCIceCandidate: RTCIceCandidate;
    mozRTCIceCandidate: RTCIceCandidate;
    webkitRTCIceCandidate: RTCIceCandidate;
  }
}

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
  public peer: any;
  public client: Object = {};


  public browser = <any>navigator;
  public subscription: Subscription;
  public serverStatus: boolean;
  public clientId: any = '';
  public socketId: any = '';
  public fromClientId: any;
  public toClientId: any;
  public clients: any = [];
  public peerConnection: any;
  public videoTrack: VideoTrack;
  public video: any;
  public remoteVideo: any;
  public videoStream: any;
  public videoWidth: number = 400;
  public videoHeight: number = 300;
  public dataChannel: any;
  public remoteAudio: any;
  public audioEnable: boolean = false;
  public videoEnable: boolean = false;
  public remoteScreen: any;
  public audioStream: any;
  public audioTrack: AudioTrack;
  public screenStream: any;
  public connected: boolean = false;
  public textEnable: boolean = true;
  public fileEnable: boolean = false;
  public message: any;
  public messages: string[] = [];
  public receiveBuffer = [];
  public offer: any;
  public enableDownload: boolean = false;
  public sendProgressValue: any = 0;
  public receivedProgressValue: any = 0;
  public receivedFileName: any;
  public receivedFileSize: any;
  public receivedFileType: any;
  public sendFileName: any = 'Choose file';
  public allUsers: any = [];
  // public client: Array<string>;

  // Arrays
  public messageObject: any = [];
  public messageDetails: any = [];
  public allUserArray: any = [];
  public newMessageObject: any = [];

  keyword = 'emailId';


  @ViewChild('remoteAudioElement', { static: false }) remoteAudioElement: ElementRef;
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef;
  @ViewChild('remoteVideoElement', { static: false }) remoteVideoElement: ElementRef;

  constructor(
    private __chatboxService: ChatWindowService,
    private __authService: AuthService,
    private __router: Router,
    private __videoAudioChatService: VideoAudioChatService
  ) {
    this.peer = new SimplePeer({ initiator: true, trickle: false })
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
  sendMessageChat(messages: string) {
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
        localStorage.setItem("chatObj", stringToStore);
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
          localStorage.setItem("chatObj", stringToStore);
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
    localStorage.setItem('selectedUser', this.userSelected)
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

  // save the chat message's in DB
  saveChatMessage() {
    var sendfromStorage = localStorage.getItem("senderObj");
    var sendObjectsFromStorage = JSON.parse(sendfromStorage);
    console.log("Send messages", sendObjectsFromStorage);

    var recfromStorage = localStorage.getItem("receiverObj");
    var receiveObjectsFromStorage = JSON.parse(recfromStorage);
    console.log("Send messages", receiveObjectsFromStorage);
  }

  // videoCall() {
  //   this.__router.navigate(['feature/feature/full-layout/chat-vide-audio']);
  // }

  chatVideo(){
    this.__router.navigate(['/feature/feature/full-layout/chat-video-audio']);
  }
}
