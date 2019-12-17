// import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
// import { Observable, Subscription } from 'rxjs';
// declare var require: any
// import decode from 'jwt-decode';
// import { ChatWindowService } from './service/chat-window.service';
// import { AuthService } from 'src/app/auth/shared/service/auth.service';
// import { Router } from '@angular/router';
// import { VideoAudioChatService } from './service/video-audio-chat.service';
// declare var SimplePeer: any;
// import { saveAs } from 'file-saver';



// declare global {
//   interface Window {
//     RTCPeerConnection: RTCPeerConnection;
//     mozRTCPeerConnection: RTCPeerConnection;
//     webkitRTCPeerConnection: RTCPeerConnection;
//     RTCSessionDescription: RTCSessionDescription;
//     mozRTCSessionDescription: RTCSessionDescription;
//     webkitRTCSessionDescription: RTCSessionDescription;
//     RTCIceCandidate: RTCIceCandidate;
//     mozRTCIceCandidate: RTCIceCandidate;
//     webkitRTCIceCandidate: RTCIceCandidate;
//   }
// }

// @Component({
//   selector: 'app-chat-box',
//   templateUrl: './chat-box.component.html',
//   styleUrls: ['./chat-box.component.scss']
// })
// export class ChatBoxComponent implements OnInit {


//   // Variables
//   public senderEmail: any;
//   public emailID: any;
//   public jwtData: any;
//   public userRole: any;
//   public userSelected: any = "";
//   public userId: any;
//   public activeStatus: boolean;
//   public activeUser: any;
//   public deactiveUser: any;
//   public videoTabMenu: boolean = false;
//   public audioTabMenu: boolean = false;
//   public peer: any;
//   public client: Object = {};


//   public browser = <any>navigator;
//   public subscription: Subscription;
//   public serverStatus: boolean;
//   public clientId: any = '';
//   public socketId: any = '';
//   public fromClientId: any;
//   public toClientId: any;
//   public clients: any = [];
//   public peerConnection: any;
//   public videoTrack: VideoTrack;
//   public video: any;
//   public remoteVideo: any;
//   public videoStream: any;
//   public videoWidth: number = 400;
//   public videoHeight: number = 300;
//   public dataChannel: any;
//   public remoteAudio: any;
//   public audioEnable: boolean = false;
//   public videoEnable: boolean = false;
//   public remoteScreen: any;
//   public audioStream: any;
//   public audioTrack: AudioTrack;
//   public screenStream: any;
//   public connected: boolean = false;
//   public textEnable: boolean = true;
//   public fileEnable: boolean = false;
//   public message: any;
//   public messages: string[] = [];
//   public receiveBuffer = [];
//   public offer: any;
//   public enableDownload: boolean = false;
//   public sendProgressValue: any = 0;
//   public receivedProgressValue: any = 0;
//   public receivedFileName: any;
//   public receivedFileSize: any;
//   public receivedFileType: any;
//   public sendFileName: any = 'Choose file';
//   public allUsers: any = [];
//   public screenEnable: boolean = false;
//   public receivedBlob: Blob;
//   public file: File;
//   public fileReader: FileReader;
//   public sendProgressMin: number = 0;
//   public sendProgressMax: number = 0;
//   // public client: Array<string>;

//   // Arrays
//   public messageObject: any = [];
//   public messageDetails: any = [];
//   public allUserArray: any = [];
//   public newMessageObject: any = [];

//   keyword = 'emailId';

//   @ViewChild('audioElement', { static: false }) audioElement: ElementRef;
//   @ViewChild('remoteAudioElement', { static: false }) remoteAudioElement: ElementRef;
//   @ViewChild('videoElement', { static: false }) videoElement: ElementRef;
//   @ViewChild('remoteVideoElement', { static: false }) remoteVideoElement: ElementRef;
//   @ViewChild('screenElement', { static: false }) screenElement: ElementRef;
//   @ViewChild('remoteScreenElement', { static: false }) remoteScreenElement: ElementRef;

//   constructor(
//     private __chatboxService: ChatWindowService,
//     private __authService: AuthService,
//     private __router: Router,
//     public socketservice: VideoAudioChatService
//   ) {
//     this.peer = new SimplePeer({ initiator: true, trickle: false })
//   }


//   ngOnInit() {
//     this.decodeJWToken();
//     this.getServerChatEventCall();
//     this.getOnlineAllUser();
//     this.getAllUser();
//     this.createSocket();
//   }


//   /**
//    * @name decodeJWToken()
//    * @description decode the JWT
//    */
//   decodeJWToken() {
//     let token = localStorage.getItem('access_token');
//     this.jwtData = decode(token);
//     this.userRole = this.jwtData['custom:role'];
//     this.emailID = this.jwtData['email'];
//   }

//   /**
//    * @name sendUserMessage()
//    * @param messages 
//    * @description send message details to spring API
//    */
//   sendMessageChat(messages: string) {
//     this.messageDetails = {
//       sourceLanguageCode: "en",
//       targetLanguageCode: "hi",
//       text: messages,
//       sender: this.jwtData.email,
//       receiver: this.userSelected
//     };
//     this.__chatboxService.senderUserMessage(this.messageDetails).then(
//       (resData) => {
//       },
//       error => {
//         return Observable.throw(error);
//       }
//     );
//   }

//   /**
//    * @name getAllUser()
//    * @description call API for get registered Users from Server.
//    */
//   getAllUser() {
//     if (this.userRole == 'Employer') {
//       this.__authService.getAllFreelancers().then((resData: any) => {
//         console.log("Employer: ", resData);
//         this.allUserArray = resData.responseObject;
//         this.getActiveAllUser();
//       });
//     } else if (this.userRole == 'Freelancer') {
//       this.__authService.getAllEmployers().then((resData: any) => {
//         console.log("Freelancer: ", resData);
//         this.allUserArray = resData.responseObject;
//         this.getActiveAllUser();
//       }
//       );
//     }
//   }

//   /**
//    * @name getActiveAllUser()
//    * @description call API for get active Users from Server.
//    */
//   getActiveAllUser() {
//     this.allUserArray.forEach(element => {
//       if (element.isLoggedIn == true) {
//         this.activeUser = true;
//         this.getLocalStorageSenderMessage();
//       }
//       else {
//         this.deactiveUser = false;
//         this.getLocalStorageReceiverMessage();
//       }
//     });
//   }

//   /**
//    * @name getOnlineAllUser()
//    * @description call API for get online Users from Server.
//    */
//   getOnlineAllUser() {
//     this.__chatboxService.getOnlineUserList().subscribe((eventData) => {
//       let flag = 0;
//       if (this.userRole == 'Freelancer') {
//         this.userId = 2;
//       } else if (this.userRole == 'Employer') {
//         this.userId = 1;
//       }

//       this.allUserArray.forEach(element => {
//         if (element.emailId == eventData.onlineUsers.emailId) {
//           element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
//           flag = 1;
//         }
//       });
//       if (flag == 0 && eventData.onlineUsers.role == this.userId) {
//         this.allUserArray.forEach(element => {
//           if (element.emailId == eventData.onlineUsers.emailId) {
//             element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
//           }
//         });
//         this.allUserArray.push(eventData.onlineUsers);
//       }
//     });
//   }

//   /**
//    * @name getServerChatEventCall()
//    * @description call API for lsten server chat message event.
//    */
//   getServerChatEventCall() {
//     this.__chatboxService.getServerSentEvent().subscribe((eventData) => {
//       this.senderEmail = this.messageDetails.sender;
//       if (this.senderEmail == eventData.eventResponse.sender) {
//         this.messageObject.push({
//           'senderMsg': eventData.eventResponse.originalText,
//           'receiverMsg': eventData.eventResponse.result.translatedText,
//           'user': 'sender',
//           'sender': eventData.eventResponse.sender,
//           'receiver': eventData.eventResponse.receiver,
//         });
//         var stringToStore = JSON.stringify(this.messageObject);
//         localStorage.setItem("senderObj", stringToStore);
//         localStorage.setItem("chatObj", stringToStore);
//         this.getLocalStorageSenderMessage();
//       }
//       else {
//         this.messageObject.push({
//           'senderMsg': eventData.eventResponse.originalText,
//           'receiverMsg': eventData.eventResponse.result.translatedText,
//           'user': 'receiver',
//           'receiver': eventData.eventResponse.receiver,
//           'sender': eventData.eventResponse.sender,
//         });
//         if (eventData.eventResponse.receiver == this.emailID) {
//           var stringToStore = JSON.stringify(this.messageObject);
//           localStorage.setItem("receiverObj", stringToStore);
//           localStorage.setItem("chatObj", stringToStore);
//           this.getLocalStorageReceiverMessage();
//         }
//       }

//       // var messageBody = document.querySelector('#msg_history');
//       // messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
//     });
//   }

//   /**
//    * @name selectUser
//    * @param selectedUser 
//    * @description select user
//    */
//   selectUser(selectedUser) {
//     this.userSelected = selectedUser.emailId;
//     localStorage.setItem('selectedUser', this.userSelected)
//     this.activeStatus = selectedUser.isLoggedIn;
//   }

//   /**
//    * @name selectEvent()
//    * @param item 
//    * @description autosearch the users by email ID
//    */
//   selectEvent(item) {
//     this.userSelected = item.emailId;
//   }

//   onChangeSearch(val: string) {
//     // fetch remote data from here
//     // And reassign the 'data' which is binded to 'data' property.
//   }

//   onFocused(e) {
//     // do something when input is focused
//   }

//   getLocalStorageSenderMessage() {
//     var fromStorage = localStorage.getItem("senderObj");
//     var objectsFromStorage = JSON.parse(fromStorage)
//     this.newMessageObject = objectsFromStorage;
//   }

//   getLocalStorageReceiverMessage() {
//     var fromStorage = localStorage.getItem("receiverObj");
//     var objectsFromStorage = JSON.parse(fromStorage)
//     this.newMessageObject = objectsFromStorage;
//   }

//   // save the chat message's in DB
//   saveChatMessage() {
//     var sendfromStorage = localStorage.getItem("senderObj");
//     var sendObjectsFromStorage = JSON.parse(sendfromStorage);
//     var recfromStorage = localStorage.getItem("receiverObj");
//     var receiveObjectsFromStorage = JSON.parse(recfromStorage);
//   }

//   createSocket() {
//     if (this.socketservice) {
//       console.log("before current this.client", this.clientId);
//       this.subscription = this.socketservice.getSocketId().subscribe((message: any) => {
//         this.serverStatus = true;
//         this.clientId = message.clientId;
//         this.fromClientId = message.clientId;
//         this.socketId = message.socketId;
//         this.subscription.unsubscribe();
//       });

//       this.socketservice.getClients().subscribe((clients: any) => {
//         this.clients = clients;
//         console.log("this.clients", this.clients);
//       });
//       window.RTCPeerConnection = this.getRTCPeerConnection();
//       window.RTCSessionDescription = this.getRTCSessionDescription();
//       window.RTCIceCandidate = this.getRTCIceCandidate();
//       this.browser.getUserMedia = this.getAllUserMedia();
//       this.peerConnection = new RTCPeerConnection({
//         "iceServers": [
//           {
//             "urls": "stun:stun.l.google.com:19302"
//           },
//           {
//             "urls": "turn:192.158.29.39:3478?transport=udp",
//             "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
//             "username": "28224511:1379330808"
//           },
//           {
//             "urls": "turn:192.158.29.39:3478?transport=tcp",
//             "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
//             "username": "28224511:1379330808"
//           }
//         ]
//       });
//       console.log('RTCPeerConnection : ', this.peerConnection);
//       this.peerConnection.onicecandidate = (candidate: RTCIceCandidate) => {
//         console.log('ICE Candidate : ', candidate);
//         this.socketservice.sendIceCandidate({
//           from: this.fromClientId,
//           to: this.toClientId,
//           type: candidate.type,
//           candidate: candidate.candidate
//         });
//       };
//       this.peerConnection.oniceconnectionstatechange = (connection: RTCIceConnectionState) => {
//         console.log('ICE Connection : ', connection);
//         console.log('ICE Connection State : ', this.peerConnection.iceConnectionState);
//       };
//       this.peerConnection.ondatachannel = (event: any) => {
//         console.log("Data Channel Attached");
//         const onChannelReady = () => {
//           this.dataChannel = event.channel;
//         };
//         if (event.channel.readyState !== 'open') {
//           event.channel.onopen = onChannelReady;
//         } else {
//           onChannelReady();
//         }
//       };

//       this.peerConnection.ontrack = (event: any) => {
//         if (this.audioEnable) {
//           this.remoteAudio = this.remoteAudioElement.nativeElement;
//           console.log('Audio Track Received');
//           try {
//             this.remoteAudio.srcObject = event.streams[0];
//           } catch (err) {
//             this.remoteAudio.src = window.URL.createObjectURL(event.streams[0]);
//           }
//           setTimeout(() => {
//             this.remoteAudio.play();
//           }, 500);
//         } else if (this.videoEnable) {
//           this.remoteVideo = this.remoteVideoElement.nativeElement;
//           console.log('Video Track Received');
//           try {
//             this.remoteVideo.srcObject = event.streams[0];
//           } catch (err) {
//             this.remoteVideo.src = window.URL.createObjectURL(event.streams[0]);
//           }
//           setTimeout(() => {
//             this.remoteVideo.play();
//           }, 500);
//         } else if (this.screenEnable) {
//           this.remoteScreen = this.remoteScreenElement.nativeElement;
//           console.log('Screen Track Received');
//           try {
//             this.remoteScreen.srcObject = event.streams[0];
//           } catch (err) {
//             this.remoteScreen.src = window.URL.createObjectURL(event.streams[0]);
//           }
//           setTimeout(() => {
//             this.remoteScreen.play();
//           }, 500);
//         }
//       };
//       this.socketservice.receiveOffer().subscribe(async (offer: RTCSessionDescription) => {
//         console.log('Offer Received : ', offer);
//         await this.peerConnection.setRemoteDescription({ type: 'offer', sdp: offer.sdp });
//         this.toClientId = offer['from'];
//         this.peerConnection.createAnswer().then(async (answer: RTCSessionDescription) => {
//           console.log('Answer Created : ', answer);
//           await this.peerConnection.setLocalDescription(answer);
//           this.socketservice.sendAnswer({
//             from: this.fromClientId,
//             to: this.toClientId,
//             type: answer.type,
//             sdp: answer.sdp
//           });
//         });
//       });
//       this.socketservice.receiveAnswer().subscribe(async (answer: RTCSessionDescription) => {
//         console.log('Answer Received : ', answer);
//         await this.peerConnection.setRemoteDescription({ type: 'answer', sdp: answer.sdp });
//       });
//       this.socketservice.receiveIceCandidate().subscribe((candidate: RTCIceCandidate) => {
//         if (candidate.candidate) {
//           console.log('ICE Candidate Received : ', candidate);
//           // this.peerConnection.addIceCandidate(candidate.candidate);
//         }
//       });
//       this.socketservice.receiveFile().subscribe(async (file: any) => {
//         console.log('File Received : ', file);
//         if (file['type'] == 'file') {
//           this.receivedFileName = file['fileName'];
//           this.receivedFileSize = file['fileSize'] + ' bytes';
//           this.receivedFileType = file['fileType'];
//           this.receivedProgressValue = 0;
//         } else if (file['type'] == 'file-status') {
//           this.receivedProgressValue = file['progressValue'];
//         } else if (file['type'] == 'file-complete') {
//           this.receivedBlob = new Blob(this.receiveBuffer, { type: this.receivedFileType });
//           this.enableDownload = true;
//         }
//       });
//     } else {
//       this.serverStatus = false;
//     }

//   }

//   public stopAudio() {
//     this.audioStream.stop();
//   }

//   public stopVideo() {
//     this.videoStream.stop();
//   }

//   public stopScreen() {
//     this.screenStream.stop();
//   }

//   public enableFile() {
//     try {
//       this.stopAudio();
//     } catch (e) { }
//     try {
//       this.stopVideo();
//     } catch (e) { }
//     try {
//       this.stopScreen();
//     } catch (e) { }
//     this.textEnable = false;
//     this.fileEnable = true;
//     this.audioEnable = false;
//     this.videoEnable = false;
//     this.screenEnable = false;
//   }

//   public handleFileInput(files: FileList) {
//     if (files[0]) {
//       this.file = files[0];
//       this.sendFileName = this.file['name'];
//       console.log(this.file);
//       this.sendProgressMin = 0;
//       this.sendProgressMax = this.file.size;
//     } else {
//       this.sendFileName = 'Choose file';
//     }
//   }

//   public sendFile() {

//     this.clients.forEach(client => {
//       if (client.emailId == this.userSelected) {
//         console.log("client.clientId", client.clientId);
//         this.toClientId = client.clientId;
//       }
//     });
//     let oldSendProgressValue = 0;
//     this.socketservice.sendFile({
//       from: this.fromClientId,
//       to: this.toClientId,
//       type: 'file',
//       fileName: this.file['name'],
//       fileSize: this.file['size'],
//       fileType: this.file['type']
//     });
//     const chunkSize = 16384;
//     let offset = 0;
//     this.fileReader = new FileReader();
//     this.fileReader.onload = (event: any) => {
//       this.dataChannel.send(event.target.result);
//       offset += event.target.result.byteLength;
//       this.sendProgressValue = ((offset * 100) / this.sendProgressMax).toFixed(1);
//       if (this.sendProgressValue !== oldSendProgressValue) {
//         this.socketservice.sendFile({
//           from: this.fromClientId,
//           to: this.toClientId,
//           type: 'file-status',
//           progressValue: this.sendProgressValue
//         });
//         oldSendProgressValue = this.sendProgressValue;
//       }
//       if (offset < this.file.size) {
//         this.readSlice(offset, chunkSize);
//       }
//       if (this.sendProgressValue == 100.0) {
//         this.socketservice.sendFile({
//           from: this.fromClientId,
//           to: this.toClientId,
//           type: 'file-complete'
//         });
//       }
//     }
//     this.readSlice(offset, chunkSize);
//   }

//   public readSlice(offset: any, chunkSize: any) {
//     const slice = this.file.slice(offset, offset + chunkSize);
//     this.fileReader.readAsArrayBuffer(slice);
//   }

//   public downloadFile() {
//     saveAs(this.receivedBlob, this.receivedFileName);
//   }

//   public getRTCPeerConnection() {
//     return window.RTCPeerConnection ||
//       window.mozRTCPeerConnection ||
//       window.webkitRTCPeerConnection;
//   }

//   public getRTCSessionDescription() {
//     return window.RTCSessionDescription ||
//       window.mozRTCSessionDescription ||
//       window.webkitRTCSessionDescription;
//   }

//   public getRTCIceCandidate() {
//     return window.RTCIceCandidate ||
//       window.mozRTCIceCandidate ||
//       window.webkitRTCIceCandidate;
//   }

//   public getAllUserMedia() {
//     return this.browser.getUserMedia ||
//       this.browser.webkitGetUserMedia ||
//       this.browser.mozGetUserMedia ||
//       this.browser.msGetUserMedia;
//   }

//   public getAllUserMediaScreen() {
//     if (this.browser.getDisplayMedia) {
//       return this.browser.getDisplayMedia({ video: true });
//     } else if (this.browser.mediaDevices.getDisplayMedia) {
//       return this.browser.mediaDevices.getDisplayMedia({ video: true });
//     } else {
//       return this.browser.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
//     }
//   }

//   chatVideo() {
//     this.__router.navigate(['/feature/feature/full-layout/chat-video-audio']);
//   }
// }
























import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatWindowService } from './service/chat-window.service';
import { Subscription, Observable } from 'rxjs';
import adapter from 'webrtc-adapter';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

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

  public langForm: FormGroup;
  public selectedGroupUserForm: FormGroup;

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
  public messageObject: any = [];
  public messageDetails: any = [];
  public allUserArray: any = [];
  public allUsersArr: any = [];
  public newMessageObject: any = [];

  keyword = 'emailId';

  public browser = <any>navigator;
  public title: string = 'Angular WebRTC Project';
  public introline: string = '(Web Real-Time Communication using Socket.IO)';
  public subscription: Subscription;
  public serverStatus: boolean;
  public clientId: any = '';
  public socketId: any = '';
  public clients: any = [];
  public allClients; any = [];
  public textEnable: boolean = true;
  public fileEnable: boolean = false;
  public audioEnable: boolean = false;
  public audioCallEnable: boolean = false;
  public videoEnable: boolean = false;
  public screenEnable: boolean = false;
  public connected: boolean = false;
  public fromClientId: any;
  public toClientId: any;
  public peerConnection: any;
  public dataChannel: any;
  public offer: any;
  public message: any;
  public messages: string[] = [];
  public audio: any;
  public remoteAudio: any;
  public remoteAudioCall: any;
  public audioStream: any;
  public audioTrack: AudioTrack;
  public audioCallTrack: AudioTrack;
  public videoTrack: VideoTrack;
  public video: any;
  public audioCall: any;
  public audioCallStream: any;
  public remoteVideo: any;
  public videoStream: any;
  public videoWidth: number = 400;
  public videoHeight: number = 400;
  public screen: any;
  public remoteScreen: any;
  public screenStream: any;
  public screenWidth: number = 400;
  public screenHeight: number = 400;
  public file: File;
  public fileReader: FileReader;
  public sendFileName: any;
  public senderFileName: any;
  public sendProgressMin: number = 0;
  public sendProgressMax: number = 0;
  public sendProgressValue: any = 0;
  public receivedFileName: any;
  public receivedFileSize: any;
  public receivedFileType: any;
  public receivedProgressMin: number = 0;
  public receivedProgressMax: number = 0;
  public receivedProgressValue: any = 0;
  public receiveBuffer = [];
  public receivedBlob: Blob;
  public enableDownload: boolean = false;

  public senderEmail: any;
  public receiverEmail: any;
  public selectedUserClientID: any;
  public sendMessages: any;
  public selectedUserInfo: any;
  public selectUser: any;
  public is_chats: boolean = true;
  public is_rooms: boolean = false;
  public is_room_created: boolean = false;


  public userselect: boolean = false;
  public langSelect: boolean = false;
  public selectedUserGroupName: any ;

  public selectLanguage: any = [
    {
      'language': 'Afrikaans',
      'lang_code': 'af'
    },
    {
      'language': 'Albanian',
      'lang_code': 'sq'
    },
    {
      'language': 'Amharic',
      'lang_code': 'am'
    },
    {
      'language': 'Arabic',
      'lang_code': 'ar'
    },
    {
      'language': 'Azerbaijani',
      'lang_code': 'az'
    },
    {
      'language': 'Bengali',
      'lang_code': 'bn'
    },
    {
      'language': 'Bosnian',
      'lang_code': 'bs'
    },
    {
      'language': 'Bulgarian',
      'lang_code': 'bg'
    },
    {
      'language': 'Chinese (Simplified)',
      'lang_code': 'zh'
    },
    {
      'language': 'Chinese (Traditional)',
      'lang_code': 'zh-TW'
    },
    {
      'language': 'Croatian',
      'lang_code': 'hr'
    },
    {
      'language': 'Czech',
      'lang_code': 'cs'
    },
    {
      'language': 'Danish',
      'lang_code': 'da'
    }, {
      'language': 'Dari',
      'lang_code': 'fa-AF'
    },
    {
      'language': 'Dutch',
      'lang_code': 'nl'
    },
    {
      'language': 'English',
      'lang_code': 'en'
    },
    {
      'language': 'Estonian',
      'lang_code': 'et'
    },
    {
      'language': 'Finnish',
      'lang_code': 'fi'
    },
    {
      'language': 'French',
      'lang_code': 'fr'
    },
    {
      'language': 'French (Canadian)',
      'lang_code': 'fr-CAf'
    },
    {
      'language': 'Georgian',
      'lang_code': 'ka'
    },
    {
      'language': 'German',
      'lang_code': 'de'
    },
    {
      'language': 'Greek',
      'lang_code': 'el'
    },
    {
      'language': 'Hausa',
      'lang_code': 'ha'
    },
    {
      'language': 'Hebrew',
      'lang_code': 'he'
    },
    {
      'language': 'Hindi',
      'lang_code': 'hi'
    },
    {
      'language': 'Hungarian',
      'lang_code': 'hu'
    },
    {
      'language': 'Indonesian',
      'lang_code': 'id'
    },
    {
      'language': 'Italian',
      'lang_code': 'it'
    },
    {
      'language': 'Japanese',
      'lang_code': 'ja'
    },
    {
      'language': 'Korean',
      'lang_code': 'ko'
    },
    {
      'language': 'Latvian',
      'lang_code': 'lv'
    },
    {
      'language': 'Malay',
      'lang_code': 'ms'
    },
    {
      'language': 'Norwegian',
      'lang_code': 'no'
    },
    {
      'language': 'Persian',
      'lang_code': 'fa'
    },
    {
      'language': 'Pashto',
      'lang_code': 'ps'
    },
    {
      'language': 'Polish',
      'lang_code': 'pl'
    },
    {
      'language': 'Portuguese',
      'lang_code': 'pt'
    },
    {
      'language': 'Romanian',
      'lang_code': 'ro'
    },
    {
      'language': 'Russian',
      'lang_code': 'ru'
    },
    {
      'language': 'Serbian',
      'lang_code': 'sr'
    },
    {
      'language': 'Slovak',
      'lang_code': 'sk'
    },
    {
      'language': 'Slovenian',
      'lang_code': 'sl'
    },
    {
      'language': 'Somali',
      'lang_code': 'so'
    },
    {
      'language': 'Spanish',
      'lang_code': 'es'
    },
    {
      'language': 'Swahili',
      'lang_code': 'af'
    }
  ]


  @ViewChild('audioElement', { static: false }) audioElement: ElementRef;
  @ViewChild('remoteAudioElement', { static: false }) remoteAudioElement: ElementRef;
  @ViewChild('audioCallElement', { static: false }) audioCallElement: ElementRef;
  @ViewChild('remoteAudioCallElement', { static: false }) remoteAudioCallElement: ElementRef;
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef;
  @ViewChild('remoteVideoElement', { static: false }) remoteVideoElement: ElementRef;
  @ViewChild('screenElement', { static: false }) screenElement: ElementRef;
  @ViewChild('remoteScreenElement', { static: false }) remoteScreenElement: ElementRef;

  constructor(public socketservice: ChatWindowService,
    private __authService: AuthService,
    private __router: Router,
    private __fb: FormBuilder
  ) {
    this.senderEmail = localStorage.getItem('email');
    console.log("Sender Email :", this.senderEmail);

    console.log("lanfguadskjskjd:", this.langSelect);
  }

  ngOnInit() {
    this.decodeJWToken();
    this.socketConnect();
    this.getAllUser();
    // this.getServerChatEventCall();
    // this.getOnlineAllUser();
    this.getValidateGroupUser();
  }

  /**
   * @name valLanguage
   * @description validate login form data
   */
  getvalidateLanguage() {
    this.langForm = this.__fb.group({
      sourceLang: new FormControl(),
      targetLang: new FormControl()
    });
  }

  getValidateGroupUser(){
    this.selectedGroupUserForm = this.__fb.group({
      groupName: new FormControl(),
      groupUserName: new FormControl()
    });
  }

  sourceLanguages() {
    console.log("Selected sourceLang Lang:", this.langForm.controls.sourceLang.value);
    // this.langSelect = false;
  }

  targetLanguages() {
    console.log("Selected targetLang Lang:", this.langForm.controls.targetLang.value);
    // this.langSelect = false;
  }

  async socketConnect() {
    console.log("Socket Connect");

    if (this.socketservice) {
      this.subscription = await this.socketservice.getSocketId().subscribe((message: any) => {
        console.log("Socket Message:", message);

        this.serverStatus = true;
        this.clientId = message.clientId;
        this.fromClientId = message.clientId;
        this.socketId = message.socketId;
        this.subscription.unsubscribe();
        console.log("Current user Client ID:", this.clientId);

      });

      await this.socketservice.getClients().subscribe((clients: any) => {
        this.clients = clients;
        console.log("Clients:", clients);

        this.allClients = clients;
        console.log(" List of Clients :", this.allClients);

        // this.getAllUser();
      });
      window.RTCPeerConnection = this.getRTCPeerConnection();
      window.RTCSessionDescription = this.getRTCSessionDescription();
      window.RTCIceCandidate = this.getRTCIceCandidate();
      this.browser.getUserMedia = this.getAllUserMedia();
      this.peerConnection = new RTCPeerConnection({
        "iceServers": [
          // {
          //   "urls": "stun:stun.l.google.com:19302"
          // },
          // {
          //   "urls": "turn:192.158.29.39:3478?transport=udp",
          //   "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          //   "username": "28224511:1379330808"
          // },
          // {
          //   "urls": "turn:192.158.29.39:3478?transport=tcp",
          //   "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          //   "username": "28224511:1379330808"
          // }
        ]
      });

      this.peerConnection.onicecandidate = (candidate: RTCIceCandidate) => {
        this.socketservice.sendIceCandidate({
          from: this.fromClientId,
          to: this.toClientId,
          type: candidate.type,
          candidate: candidate.candidate
        });
      };
      console.log("To user Client ID:", this.toClientId);

      this.peerConnection.oniceconnectionstatechange = (connection: RTCIceConnectionState) => {
        console.log('ICE Connection : ', connection);
        console.log('ICE Connection State : ', this.peerConnection.iceConnectionState);
      };
      this.peerConnection.ondatachannel = (event: any) => {
        console.log("peerConnection Connected");

        const onChannelReady = () => {
          this.dataChannel = event.channel;
          console.log("peerConnection datachannel opended");

        };
        if (event.channel.readyState !== 'open') {
          event.channel.onopen = onChannelReady;
        } else {
          onChannelReady();
        }
      };
      this.peerConnection.ontrack = (event: any) => {
        if (this.audioEnable) {
          this.remoteAudio = this.remoteAudioElement.nativeElement;
          console.log('Audio Track Received');
          try {
            this.remoteAudio.srcObject = event.streams[0];
          } catch (err) {
            this.remoteAudio.src = window.URL.createObjectURL(event.streams[0]);
          }
          setTimeout(() => {
            this.remoteAudio.play();
          }, 500);
        } else if (this.audioCallEnable) {
          this.remoteAudioCall = this.remoteAudioCallElement.nativeElement;
          console.log('Audio Track Received');
          try {
            this.remoteAudioCall.srcObject = event.streams[0];
          } catch (err) {
            this.remoteAudioCall.src = window.URL.createObjectURL(event.streams[0]);
          }
          setTimeout(() => {
            this.remoteAudioCall.play();
          }, 500);
        } else if (this.videoEnable) {
          this.remoteVideo = this.remoteVideoElement.nativeElement;
          console.log('Video Track Received');
          try {
            this.remoteVideo.srcObject = event.streams[0];
          } catch (err) {
            this.remoteVideo.src = window.URL.createObjectURL(event.streams[0]);
          }
          setTimeout(() => {
            this.remoteVideo.play();
          }, 500);
        } else if (this.screenEnable) {
          this.remoteScreen = this.remoteScreenElement.nativeElement;
          console.log('Screen Track Received');
          try {
            this.remoteScreen.srcObject = event.streams[0];
          } catch (err) {
            this.remoteScreen.src = window.URL.createObjectURL(event.streams[0]);
          }
          setTimeout(() => {
            this.remoteScreen.play();
          }, 500);
        }
      };
      this.socketservice.receiveOffer().subscribe(async (offer: RTCSessionDescription) => {
        console.log("Receive Offer :", offer);
        // window.alert(offer['email']);
        await this.peerConnection.setRemoteDescription({ type: 'offer', sdp: offer.sdp });

        this.toClientId = offer['from'];
        this.peerConnection.createAnswer().then(async (answer: RTCSessionDescription) => {
          ;
          await this.peerConnection.setLocalDescription(answer);
          this.socketservice.sendAnswer({
            from: this.fromClientId,
            to: this.toClientId,
            type: answer.type,
            sdp: answer.sdp
          });
        });
      });
      this.socketservice.receiveAnswer().subscribe(async (answer: RTCSessionDescription) => {
        console.log("Receive Answer :", answer);

        await this.peerConnection.setRemoteDescription({ type: 'answer', sdp: answer.sdp });
      });
      this.socketservice.receiveIceCandidate().subscribe((candidate: RTCIceCandidate) => {
        if (candidate.candidate) {
          // this.peerConnection.addIceCandidate(candidate.candidate);
        }
      });
      this.socketservice.receiveFile().subscribe(async (file: any) => {
        console.log('File Received : ', file);
        if (file['type'] == 'file') {
          this.receivedFileName = file['fileName'];
          this.messages.push(JSON.parse(JSON.stringify({ receivedFile: this.receivedFileName })));

          this.receivedFileSize = file['fileSize'] + ' bytes';
          this.receivedFileType = file['fileType'];
          this.receivedProgressValue = 0;
        } else if (file['type'] == 'file-status') {
          this.receivedProgressValue = file['progressValue'];
        } else if (file['type'] == 'file-complete') {
          this.receivedBlob = new Blob(this.receiveBuffer, { type: this.receivedFileType });
          this.enableDownload = true;
        }
      });

    } else {
      this.serverStatus = false;
    }
  }

  public getRTCPeerConnection() {
    console.log("RTC Connected");

    return window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
  }

  public getRTCSessionDescription() {

    return window.RTCSessionDescription ||
      window.mozRTCSessionDescription ||
      window.webkitRTCSessionDescription;
  }

  public getRTCIceCandidate() {

    return window.RTCIceCandidate ||
      window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate;
  }

  public getAllUserMedia() {
    return this.browser.getUserMedia ||
      this.browser.webkitGetUserMedia ||
      this.browser.mozGetUserMedia ||
      this.browser.msGetUserMedia;
  }

  public getAllUserMediaScreen() {
    if (this.browser.getDisplayMedia) {
      return this.browser.getDisplayMedia({ video: true });
    } else if (this.browser.mediaDevices.getDisplayMedia) {
      return this.browser.mediaDevices.getDisplayMedia({ video: true });
    } else {
      return this.browser.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
    }
  }

  public async enableText() {
    try {
      this.stopAudio();
    } catch (e) { }
    try {
      this.stopVideo();
    } catch (e) { }
    try {
      this.stopScreen();
    } catch (e) { }
    this.textEnable = true;
    this.fileEnable = false;
    this.audioEnable = false;
    this.audioCallEnable = false;
    this.videoEnable = false;
    this.screenEnable = false;
    // await this.getServerChatEventCall();
    // await this.getOnlineAllUser();
    this.enableFile();
  }

  public enableFile() {
    this.connect();
    try {
      this.stopAudio();
    } catch (e) { }
    try {
      this.stopVideo();
    } catch (e) { }
    try {
      this.stopScreen();
    } catch (e) { }
    this.textEnable = true;
    this.fileEnable = false;
    this.audioEnable = false;
    this.audioCallEnable = false;
    this.videoEnable = false;
    this.screenEnable = false;
  }

  public handleFileInput(files: FileList) {
    console.log("File Handle method calling...");
    // this.enableFile();
    if (files[0]) {
      this.file = files[0];
      this.sendFileName = this.file['name'];
      // this.senderFileName = this.file['name'];
      console.log(this.file);
      this.sendProgressMin = 0;
      this.sendProgressMax = this.file.size;
      this.messages.push(JSON.parse(JSON.stringify({ senderFile: this.file['name'], user: 'sender' })));

      this.sendFile();
    } else {
      this.sendFileName = 'Choose File';
    }
  }

  public sendFile() {
    console.log("Send file method calling...");

    let oldSendProgressValue = 0;
    this.socketservice.sendFile({
      from: this.fromClientId,
      to: this.toClientId,
      type: 'file',
      fileName: this.file['name'],
      fileSize: this.file['size'],
      fileType: this.file['type'],
      sender: this.jwtData.email,
      receiver: this.userSelected,
    });
    const chunkSize = 16384;
    let offset = 0;
    this.fileReader = new FileReader();
    this.fileReader.onload = (event: any) => {
      this.dataChannel.send(event.target.result);
      offset += event.target.result.byteLength;
      this.sendProgressValue = ((offset * 100) / this.sendProgressMax).toFixed(1);
      if (this.sendProgressValue !== oldSendProgressValue) {
        this.socketservice.sendFile({
          from: this.fromClientId,
          to: this.toClientId,
          type: 'file-status',
          progressValue: this.sendProgressValue
        });
        oldSendProgressValue = this.sendProgressValue;
      }
      if (offset < this.file.size) {
        this.readSlice(offset, chunkSize);
      }
      if (this.sendProgressValue == 100.0) {
        this.socketservice.sendFile({
          from: this.fromClientId,
          to: this.toClientId,
          type: 'file-complete'
        });
        console.log("Send file details:", this.messages);

      }
    }
    this.readSlice(offset, chunkSize);
  }

  public readSlice(offset: any, chunkSize: any) {
    const slice = this.file.slice(offset, offset + chunkSize);
    this.fileReader.readAsArrayBuffer(slice);
  }

  public downloadFile(downloadFile) {
    console.log("Download file method calling...");

    saveAs(this.receivedBlob, downloadFile);
  }

  public enableAudio() {
    this.connect();
    try {
      this.stopVideo();
    } catch (e) { }
    try {
      this.stopScreen();
    } catch (e) { }
    this.textEnable = false;
    this.fileEnable = false;
    this.audioEnable = true;
    this.audioCallEnable = false;
    this.videoEnable = false;
    this.screenEnable = false;
    setTimeout(() => {
      this.audio = this.audioElement.nativeElement;
      let constraints = { audio: true };
      this.browser.mediaDevices.getUserMedia(constraints).then((stream: any) => {
        if (!stream.stop && stream.getTracks) {
          stream.stop = function () {
            this.getTracks().forEach(function (track: any) {
              track.stop();
            });
          };
        }
        this.audioStream = stream;
        this.audioTrack = stream.getAudioTracks();
        if (this.audioTrack) {
          console.log('Using audio device: ' + this.audioTrack[0].label);
        }
        try {
          this.audio.srcObject = this.audioStream;
        } catch (err) {
          this.audio.src = window.URL.createObjectURL(this.audioStream);
        }
        stream.getTracks().forEach((track: any) => {
          this.peerConnection.addTrack(track, stream);
        });
        setTimeout(() => {
          this.audio.play();
        }, 500);
      });
    }, 1000);
  }

  public enableAudioCall() {
    this.connect();
    try {
      this.stopVideo();
    } catch (e) { }
    try {
      this.stopScreen();
    } catch (e) { }
    this.textEnable = false;
    this.fileEnable = false;
    this.audioEnable = false;
    this.audioCallEnable = true;
    this.videoEnable = false;
    this.screenEnable = false;
    setTimeout(() => {
      this.audioCall = this.audioCallElement.nativeElement;
      // this.connect();
      let constraints = { audio: true };
      this.browser.mediaDevices.getUserMedia(constraints).then((stream: any) => {
        // this.audioCall.autoplay = true;
        // this.audioCall.muted = true;
        if (!stream.stop && stream.getTracks) {
          stream.stop = function () {
            this.getTracks().forEach(function (track: any) {
              track.stop();
            });
          };
        }
        this.audioCallStream = stream;
        // this.videoTrack = stream.getVideoTracks();
        this.audioCallTrack = stream.getAudioTracks();
        // if (this.videoTrack) {
        //   console.log('Using video device: ' + this.videoTrack[0].label);
        // }
        if (this.audioCallTrack) {
          console.log('Using audio call device: ' + this.audioCallTrack[0].label);
        }
        try {
          this.audioCall.srcObject = this.audioCallStream;
        } catch (err) {
          this.audioCall.src = window.URL.createObjectURL(this.audioCallStream);
        }
        stream.getTracks().forEach((track: any) => {
          this.peerConnection.addTrack(track, stream);
        });
        setTimeout(() => {
          this.audioCall.play();
        }, 500);
      });
    }, 1000);
  }

  public enableVideo() {
    this.connect();
    try {
      this.stopAudio();
    } catch (e) { }
    try {
      this.stopScreen();
    } catch (e) { }
    this.textEnable = false;
    this.fileEnable = false;
    this.audioEnable = false;
    this.audioCallEnable = false;
    this.videoEnable = true;
    this.screenEnable = false;
    setTimeout(() => {
      this.video = this.videoElement.nativeElement;
      // this.connect();
      let constraints = { audio: true, video: { minFrameRate: 60, width: 400, height: 300 } };
      this.browser.mediaDevices.getUserMedia(constraints).then((stream: any) => {
        
        if (!stream.stop && stream.getTracks) {
          stream.stop = function () {
            this.getTracks().forEach(function (track: any) {
              track.stop();
            });
          };
        }
        this.videoStream = stream;
        this.videoTrack = stream.getVideoTracks();
        this.audioTrack = stream.getAudioTracks();
        if (this.videoTrack) {
          console.log('Using video device: ' + this.videoTrack[0].label);
        }
        if (this.audioTrack) {
          console.log('Using audio device: ' + this.audioTrack[0].label);
        }
        try {
          this.video.srcObject = this.videoStream;
        } catch (err) {
          this.video.src = window.URL.createObjectURL(this.videoStream);
        }
        stream.getTracks().forEach((track: any) => {
          this.peerConnection.addTrack(track, stream);
        });
        setTimeout(() => {
          this.video.play();
        }, 500);
      });
    }, 1000);
  }

  public enableScreen() {
    this.connect();
    try {
      this.stopAudio();
    } catch (e) { }
    try {
      this.stopVideo();
    } catch (e) { }
    this.textEnable = false;
    this.fileEnable = false;
    this.audioEnable = false;
    this.audioCallEnable = false;
    this.videoEnable = false;
    this.screenEnable = true;
    setTimeout(() => {
      // this.connect();
      this.screen = this.screenElement.nativeElement;
      this.getAllUserMediaScreen().then((stream: any) => {
        if (!stream.stop && stream.getTracks) {
          stream.stop = function () {
            this.getTracks().forEach(function (track: any) {
              track.stop();
            });
          };
        }
        this.screenStream = stream;
        this.videoTrack = stream.getVideoTracks();
        if (this.videoTrack) {
          console.log('Using video device: ' + this.videoTrack[0].label);
        }
        try {
          this.screen.srcObject = this.screenStream;
        } catch (err) {
          this.screen.src = window.URL.createObjectURL(this.screenStream);
        }
        stream.getTracks().forEach((track: any) => {
          this.peerConnection.addTrack(track, stream);
        });
        setTimeout(() => {
          this.screen.play();
        }, 500);
      });
    }, 1000);
  }

  public stopAudio() {
    this.audioStream.stop();
  }

  public stopVideo() {
    this.videoStream.stop();
  }

  public stopScreen() {
    this.screenStream.stop();
  }

  public async connect() {

    this.selectUser = JSON.stringify(localStorage.getItem('selectedUserInfo'));
    console.log("select User:", this.selectUser);

    this.allClients.forEach(selectedUser => {
      if (this.userSelected != '') {
        if (selectedUser.emailId == this.userSelected) {
          this.toClientId = selectedUser.clientId;
        }
      } else {
        if (selectedUser.emailId == this.selectUser) {
          this.toClientId = selectedUser.clientId;
        }
      }
    });

    console.log("to client ID:", this.toClientId);
    this.connected = true;
    console.log("this.connected:", this.connected);
    this.dataChannel = await this.peerConnection.createDataChannel('datachannel');
    if (this.fileEnable) {
      this.dataChannel.binaryType = 'arraybuffer';
    }
    this.dataChannel.onerror = (error: any) => {
      console.log("Data Channel Error:", error);
    };
    this.dataChannel.onmessage = (event: any) => {

      if (this.textEnable) {
        console.log("Calling Data channel on message");
        

        let messageData = JSON.parse(event.data);
        console.log("Got Data Channel Message:", messageData.data);


        if (this.userRole == 'Employer') {
      
          var joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
                console.log("Join room details get from Local storage:", joinRoomDetails);
          
          this.messageObject = {
            'sessionId': joinRoomDetails.sessionId,
            'roomId': joinRoomDetails.roomId,
            'sender': this.jwtData.email,
            'receiver': this.userSelected,
            'senderRole': this.userRole,
            'receiverRole': 'Freelancer',
            'sourceLanguageCode': "en",
            'originalText': messageData.data,
            'targetLanguageCode': "hi",
          };
          console.log("Message for send to receiver:", this.messageObject);
    
          this.socketservice.callEventTranslation(this.messageObject).then((messgeData1: any) => {
            console.log("Send Message component Data:", messgeData1);
            this.messages.push(JSON.parse(JSON.stringify({ clientId: messgeData1.clientId, originalText: messgeData1.originalText, data: messgeData1.translatedText.TranslatedText })));
  
          });
          
        } 
        else if (this.userRole == 'Freelancer') {
          let joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
          console.log("Join Room Details for send message:", joinRoomDetails);
          
          this.messageObject = {
            'sessionId': joinRoomDetails.sessionId,
            'roomId': joinRoomDetails.roomId,
            'sender': this.jwtData.email,
            'receiver': this.userSelected,
            'senderRole': this.userRole,
            'receiverRole': 'Employer',
            'sourceLanguageCode': "en",
            'originalText': messageData.data,
            'targetLanguageCode': "hi",
          };
          console.log("Message for send to receiver:", this.messageObject);
          this.socketservice.callEventTranslation(this.messageObject).then((messgeData1: any) => {
            console.log("Send Message component Data:", messgeData1);
            this.messages.push(JSON.parse(JSON.stringify({ clientId: messgeData1.clientId, originalText: messgeData1.originalText, data: messgeData1.translatedText.TranslatedText })));
  
          });
          
        }

        // this.sendMessages = {
        //   sourceLanguageCode: "en",
        //   targetLanguageCode: "hi",
        //   originalText: messageData.data,
        //   sender: this.jwtData.email,
        //   receiver: this.userSelected,
        //   clientId: messageData.clientId
        // }

        // this.socketservice.callEventTranslation(this.sendMessages).then((messgeData1: any) => {
        //   console.log("Send Message component Data:", messgeData1);
        //   this.messages.push(JSON.parse(JSON.stringify({ clientId: messgeData1.clientId, originalText: messgeData1.originalText, data: messgeData1.translatedText.TranslatedText })));

        // });

        //Event listing chat recieve response 

        // this.socketservice.gettingResult().subscribe((messgeData1: any) => {
        //   console.log("res for traslation", messgeData1);
        //   this.messages.push(JSON.parse(JSON.stringify({ clientId: messgeData1.clientId, data: messgeData1.translatedText.TranslatedText })));
        // });

        // var data = this.socketservice.gettingResult();
        // console.log("data", data);
        // this.messages.push(JSON.parse(JSON.stringify({ clientId: data.clientId, data: data.translatedText.TranslatedText })));

        // this.messages.push(JSON.parse(JSON.stringify({ clientId: messageData.clientId, data: messageData.data })));
        // this.socketservice.callEventTranslation(this.sendMessages).subscribe((messgeData: any) => {


        //   console.log(" response messages :", messgeData);


        //   this.message = '';
        //   // this.senderEmail = this.sendMessages.receiver;

        //   // if (messgeData.receiver == this.senderEmail) {

        //   //   this.messageObject.push({
        //   //     'senderMsg': messgeData.originalText,
        //   //     'receiverMsg': messgeData.translatedText.TranslatedText,
        //   //     'user': 'receiver',
        //   //     'receiver': messgeData.receiver,
        //   //     'sender': messgeData.sender,
        //   //   });
        //   //   var stringToStore = JSON.stringify(this.messageObject);
        //   //   localStorage.setItem("receiverObj", stringToStore);
        //   //   this.getLocalStorageReceiverMessage();
        //   // }


        //   // else if (this.sendMessages.sender  == this.userSelected) {

        //   //   this.messageObject.push({
        //   //     'senderMsg': messgeData.originalText,
        //   //     'receiverMsg': messgeData.translatedText.TranslatedText,
        //   //     'user': 'sender',
        //   //     'sender': messgeData.sender,
        //   //     'receiver': messgeData.receiver,
        //   //   });

        //   //   var stringToStore = JSON.stringify(this.messageObject);
        //   //   localStorage.setItem("senderObj", stringToStore);
        //   //   this.getLocalStorageSenderMessage();
        //   // }
        //   // this.messages.push(JSON.parse(JSON.stringify({ clientId: messageData.clientId, data: messgeData.translatedText.TranslatedText })));
        //   // console.log("Messages array:", this.messages);


        // });
      } else if (this.fileEnable) {
        let filerecivedData = event.data;
        console.log("File sending :", filerecivedData);
        this.receiveBuffer.push(event.data);
      }
    };
    this.dataChannel.onopen = () => {
      console.log("Data Channel Opened");
    };
    this.dataChannel.onclose = () => {
      console.log("The Data Channel is Closed");
    };
    this.offer = this.peerConnection.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
      voiceActivityDetection: 1
    }).then(async (offer: RTCSessionDescription) => {
      console.log('Offer Send : ', offer);
      await this.peerConnection.setLocalDescription(offer);

      // this.allClients.forEach(selectedUser => {

      //     if (selectedUser.emailId == this.userSelected) {
      //       this.toClientId = selectedUser.clientId;
      //     }

      // });

      this.socketservice.sendOffer({
        from: this.fromClientId,
        to: this.toClientId,
        type: offer.type,
        sdp: offer.sdp,
        email: this.senderEmail
      });
    });
  }

  public sendMessage() {
    // this.messageObject.push({
    //   'senderMsg': this.message,
    //   'user': 'sender',
    //   'sender': this.jwtData.email,
    //   'receiver': this.userSelected,
    //   'clientId': this.fromClientId
    // });
    // if (this.userRole == 'Employer') {
      
    //   var joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
    //         console.log("Join room details get from Local storage:", joinRoomDetails);
      
    //   this.messageObject = {
    //     'sessionId': joinRoomDetails.responseObject.sessionId,
    //     'roomId': joinRoomDetails.responseObject.roomId,
    //     'sender': this.jwtData.email,
    //     'receiver': this.userSelected,
    //     'senderRole': this.userRole,
    //     'recieverRole': 'Freelancer',
    //     'sourceLanguageCode': "en",
    //     'originalMsg': this.message
    //   };
    //   console.log("Message for send to receiver:", this.messageObject);

    //   this.socketservice.sendMessageToCasssandra(this.messageObject).subscribe((msgRes: any) => {
    //     console.log("response emp from casendra msg", msgRes);
    //   //  localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
    //   });
      
    // } else if (this.userRole == 'Freelancer') {
    //   let joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
    //   console.log("Join Room Details for send message:", joinRoomDetails);
      
    //   this.messageObject = {
    //     'sessionId': joinRoomDetails.responseObject.sessionId,
    //     'roomId': joinRoomDetails.responseObject.roomId,
    //     'sender': this.jwtData.email,
    //     'receiver': this.userSelected,
    //     'senderRole': this.userRole,
    //     'recieverRole': 'Employer',
    //     'sourceLanguageCode': "en",
    //     'originalMsg': this.message
    //   };
    //   console.log("Message for send to receiver:", this.messageObject);
    //   this.socketservice.sendMessageToCasssandra(this.messageObject).subscribe((msgRes: any) => {
    //     console.log("response free from casendra msg", msgRes);
    //   //  localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
    //   });
     
      
    // }


    this.dataChannel.send(JSON.stringify({ clientId: this.fromClientId, data: this.message }));
    this.messages.push(JSON.parse(JSON.stringify({ clientId: this.fromClientId, user: 'sender', data: this.message })));
    this.message = '';
    var stringToStore = JSON.stringify(this.messageObject);
    localStorage.setItem("senderObj", stringToStore);
    this.getLocalStorageSenderMessage();
  }

  public disconnect() {
    try {
      this.stopAudio();
    } catch (e) { }
    try {
      this.stopVideo();
    } catch (e) { }
    try {
      this.stopScreen();
    } catch (e) { }
    this.connected = false;
    this.toClientId = '';
    this.enableDownload = false;
    this.sendProgressValue = 0;
    this.receivedProgressValue = 0;
    this.sendFileName = '';
    this.receivedFileName = '';
    this.receivedFileSize = '';
    this.receivedFileType = '';
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
  // sendMessageChat(messages: string) {
  //   console.log("Text Message:", messages);

  //   this.messageDetails = {
  //     sourceLanguageCode: "en",
  //     targetLanguageCode: "hi",
  //     originalText: messages,
  //     sender: this.jwtData.email,
  //     // receiver: this.userSelected
  //   };
  //   console.log("this.messageDetails:", this.messageDetails);

  //   this.socketservice.senderUserMessage(this.messageDetails).then(
  //     (resData) => {
  //     },
  //     error => {
  //       return Observable.throw(error);
  //     }
  //   );
  // }

  /**
   * @name getAllUser()
   * @description call API for get registered Users from Server.
   */
  async getAllUser() {
    if (this.userRole == 'Employer') {
      await this.__authService.getAllFreelancers().then((resData: any) => {
        this.allUsersArr = resData.responseObject;
        console.log("Employer User list: ", this.allUsersArr);
        // this.getActiveAllUser();
      });
    } else if (this.userRole == 'Freelancer') {
      await this.__authService.getAllEmployers().then((resData: any) => {
        this.allUsersArr = resData.responseObject;
        // this.getActiveAllUser();
      });
    }
  }

  /**
   * @name getActiveAllUser()
   * @description call API for get active Users from Server.
   */
  //   getActiveAllUser() {
  //     // this.allUserArray = this.allUsersArr.filter(o1 => this.clients.some(o2 => o1.emailId === o2.emailId));
  // // this.allUserArray = this.allUsersArr.filter(o1 => this.clients.some(o2 => o1.emailId === o2.emailId));
  //     this.allUsersArr.forEach(element => {
  //       if (element.isLoggedIn == true) {
  //         this.activeUser = true;
  //         this.getLocalStorageSenderMessage();
  //       }
  //       else {
  //         this.deactiveUser = false;
  //         this.getLocalStorageReceiverMessage();
  //       }
  //     });
  //   }

  /**
   * @name getOnlineAllUser()
   * @description call API for get online Users from Server.
   */
  //  async getOnlineAllUser() {
  //     console.log("online user calling ...");

  //     await this.socketservice.getOnlineUserList().subscribe((eventData) => {
  //       let flag = 0;
  //       if (this.userRole == 'Freelancer') {
  //         this.userId = 2;
  //       } else if (this.userRole == 'Employer') {
  //         this.userId = 1;
  //       }

  //       this.allUserArray.forEach(element => {
  //         if (element.emailId == eventData.onlineUsers.emailId) {
  //           element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
  //           flag = 1;
  //         }
  //       });
  //       if (flag == 0 && eventData.onlineUsers.role == this.userId) {
  //         this.allUserArray.forEach(element => {
  //           if (element.emailId == eventData.onlineUsers.emailId) {
  //             element.isLoggedIn = eventData.onlineUsers.isLoggedIn;
  //           }
  //         });
  //         this.allUserArray.push(eventData.onlineUsers);
  //       }
  //     });
  //   }

  /**
   * @name getServerChatEventCall()
   * @description call API for lsten server chat message event.
   */
  // async getServerChatEventCall() {
  //   console.log("Server chat event calling....");

  //   await this.socketservice.getServerSentEvent().subscribe((eventData) => {
  //     console.log("eventData: ", eventData);

  //     this.senderEmail = this.messageDetails.sender;
  //     if (this.senderEmail == eventData.eventResponse.sender) {
  //       this.messageObject.push({
  //         'senderMsg': eventData.eventResponse.originalText,
  //         'receiverMsg': eventData.eventResponse.result.translatedText,
  //         'user': 'sender',
  //         'sender': eventData.eventResponse.sender,
  //         'receiver': eventData.eventResponse.receiver,
  //       });
  //       var stringToStore = JSON.stringify(this.messageObject);
  //       localStorage.setItem("senderObj", stringToStore);
  //       localStorage.setItem("chatObj", stringToStore);
  //       this.getLocalStorageSenderMessage();
  //     }
  //     else {
  //       this.messageObject.push({
  //         'senderMsg': eventData.eventResponse.originalText,
  //         'receiverMsg': eventData.eventResponse.result.translatedText,
  //         'user': 'receiver',
  //         'receiver': eventData.eventResponse.receiver,
  //         'sender': eventData.eventResponse.sender,
  //       });
  //       if (eventData.eventResponse.receiver == this.emailID) {
  //         var stringToStore = JSON.stringify(this.messageObject);
  //         localStorage.setItem("receiverObj", stringToStore);
  //         localStorage.setItem("chatObj", stringToStore);
  //         this.getLocalStorageReceiverMessage();
  //       }
  //     }

  //     // var messageBody = document.querySelector('#msg_history');
  //     // messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  //   });
  // }

  /**
   * @name selectedUser
   * @param selectedUser 
   * @description select user
   */
  async selectedUser(selectUser) {
    this.userselect = true;
    this.selectedUserInfo = JSON.stringify(selectUser);
    localStorage.setItem('selectedUserInfo', this.selectedUserInfo)
    this.userSelected = selectUser.emailId;
    this.activeStatus = selectUser.isLoggedIn;
    this.langSelect = true;

    this.connect();
    this.createOrJoinIndependentChat();
  }



  /**
   * @name selectEvent()
   * @param item 
   * @description autosearch the users by email ID
   */
  selectEvent(item) {
    this.userSelected = item.emailId;
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
  }

  getLocalStorageReceiverMessage() {
    var fromStorage = localStorage.getItem("receiverObj");
    var objectsFromStorage = JSON.parse(fromStorage)
    this.newMessageObject = objectsFromStorage;
  }

  // save the chat message's in DB
  saveChatMessage() {
    var sendfromStorage = localStorage.getItem("senderObj");
    var sendObjectsFromStorage = JSON.parse(sendfromStorage);
    var recfromStorage = localStorage.getItem("receiverObj");
    var receiveObjectsFromStorage = JSON.parse(recfromStorage);
  }


  selectedGroupUsers(){
    console.log("Selected Group Users:", this.selectedGroupUserForm.value);
    this.selectedUserGroupName = this.selectedGroupUserForm.value.groupName;
    this.createOrJoinGroupRoomChat();
    // this.showAvailableRooms(this.selectedUserGroupName);
  }

  showChats() {
    this.is_chats = true;
    this.is_rooms = false;
  }

  async showAvailableRooms() {
    this.is_rooms = true;
    this.is_chats = false;
    this.is_room_created = true;

    await this.socketservice.showRoomAvailable(this.emailID).subscribe((showRoomsAvailable: any) => {
      console.log("Show rooms already available by current user email:", showRoomsAvailable.responseObject);
    });
  }

  async createOrJoinIndependentChat() {
    var setOfParticipants: any = [];

    var roomData: any;
    if (this.userRole == "Freelancer") {
      setOfParticipants.push({ 'username': this.userSelected, 'role': 'Employer', 'type': 'Owner' });
      setOfParticipants.push({ 'username': this.emailID, 'role': 'Freelancer', 'type': 'participant' });
      roomData = {
        roomName: this.userSelected + "&" + this.emailID,
        participant: setOfParticipants
      }
    } else if (this.userRole == "Employer") {
      setOfParticipants.push({ 'username': this.emailID, 'role': 'Employer', 'type': 'Owner' });
      setOfParticipants.push({ 'username': this.userSelected, 'role': 'Freelancer', 'type': 'participant' });
      roomData = {
        roomName: this.emailID + "&" + this.userSelected,
        participant: setOfParticipants
      }
    }

    console.log("Room  Data : ", roomData);
    await this.socketservice.isRoomAvailable(roomData.roomName).subscribe((isRoomAvailableRes: any) => {
      console.log("response for room available", isRoomAvailableRes);
      var roomId = 0;
      if (this.userRole == "Employer") {
        if (isRoomAvailableRes.message == "True") {
          let dataForJoiningRoom = {
            roomId: isRoomAvailableRes.responseObject[0].room_id,
            roomName: isRoomAvailableRes.responseObject[0].room_name,
            userName: this.emailID
          }
          this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
            console.log("response for join", JSON.stringify(joinRes));
            localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
          });
        } else if (isRoomAvailableRes.message == "False") {
          this.socketservice.createRoom(roomData).subscribe((createRes: any) => {
            console.log("response for create room", createRes);
            roomId = createRes.roomId;
            let dataForJoiningRoom = {
              roomId: createRes.roomId,
              roomName: createRes.roomName,
              userName: this.emailID
            }
            this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
              console.log("response for join", joinRes);
              localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));

            });
            
          });
        }

      }
      else if (this.userRole == "Freelancer") {
        console.log("isRoomAvailableRes.responseObject : ", isRoomAvailableRes.responseObject);
        if (isRoomAvailableRes.message == "True") {
          let dataForJoiningRoom = {
            roomId: isRoomAvailableRes.responseObject[0].room_id,
            roomName: isRoomAvailableRes.responseObject[0].room_name,
            userName: this.emailID
          }
          this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
            console.log("response for join", joinRes);
            localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));

          });
          
        } else if (isRoomAvailableRes.message == "False") {

        }
      }
    });
  }

  

  

  async createOrJoinGroupRoomChat(){
    console.log("Callinng Group room chat");
    
      var setOfParticipants: any = [];
      // var groupUserListArray: any = [];
  
      var roomData: any;
      if (this.userRole == "Freelancer") {
        setOfParticipants.push({ 'username': this.userSelected, 'role': 'Employer', 'type': 'Owner' });
        this.selectedGroupUserForm.value.groupUserName.forEach(element => {
          setOfParticipants.push({ 'username': element, 'role': 'Freelancer', 'type': 'participant' });          
        });
        roomData = {
          roomName: this.selectedGroupUserForm.value.groupName,
          participant: setOfParticipants
        }
      } else if (this.userRole == "Employer") {
        setOfParticipants.push({ 'username': this.emailID, 'role': 'Employer', 'type': 'Owner' });
        // setOfParticipants.push({ 'username': this.userSelected, 'role': 'Freelancer', 'type': 'participant' });
        this.selectedGroupUserForm.value.groupUserName.forEach(element => {
        setOfParticipants.push({ 'username': element, 'role': 'Freelancer', 'type': 'participant' });         
        });
        roomData = {
          roomName: this.selectedGroupUserForm.value.groupName,
          participant: setOfParticipants
        }
      }
  
      console.log("Room  Data : ", roomData);

      await this.socketservice.isRoomAvailable(roomData.roomName).subscribe((isRoomAvailableRes: any) => {
        console.log("response for room available", isRoomAvailableRes);
        var roomId = 0;
        if (this.userRole == "Employer") {
          if (isRoomAvailableRes.message == "True") {
            let dataForJoiningRoom = {
              roomId: isRoomAvailableRes.responseObject[0].room_id,
              roomName: isRoomAvailableRes.responseObject[0].room_name,
              userName: [{
                    users:roomData.participant
              }]
            }
            console.log("Joining Room user:", dataForJoiningRoom);
            
            this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
              console.log("response form join room", JSON.stringify(joinRes));
              localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
            });
          } 
          else if (isRoomAvailableRes.message == "False") {
            this.socketservice.createRoom(roomData).subscribe((createRes: any) => {
              console.log("response form create room", createRes);
              roomId = createRes.roomId;
              let dataForJoiningRoom = {
                roomId: createRes.roomId,
                roomName: this.selectedGroupUserForm.value.groupName,
                userName: [{
                  users:roomData.participant
            }]
              }
              console.log("Create room user:", dataForJoiningRoom);
              
              this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
                console.log("response form join room in create room:", joinRes);
                localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
              });
              
            });
          }
  
        }
        else if (this.userRole == "Freelancer") {
          console.log("isRoomAvailableRes.responseObject : ", isRoomAvailableRes.responseObject);
          if (isRoomAvailableRes.message == "True") {
            let dataForJoiningRoom = {
              roomId: isRoomAvailableRes.responseObject[0].room_id,
              roomName: isRoomAvailableRes.responseObject[0].room_name,
              userName: [{
                users:roomData.participant
          }]
            }
            this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
              console.log("response for join", joinRes);
              localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
            });
          } 
          else if (isRoomAvailableRes.message == "False") {
            this.socketservice.createRoom(roomData).subscribe((createRes: any) => {
              console.log("response form create room", createRes);
              roomId = createRes.roomId;
              let dataForJoiningRoom = {
                roomId: createRes.roomId,
                roomName: this.selectedGroupUserForm.value.groupName,
                userName: [{
                  users:roomData.participant
            }]
              }
              console.log("Create room user:", dataForJoiningRoom);
              
              this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
                console.log("response form join room in create room:", joinRes);
                localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
              });
              
            });
          }
        }
      });
  }
}
