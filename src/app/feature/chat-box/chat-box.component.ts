import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatWindowService } from './service/chat-window.service';
import { Subscription, Observable } from 'rxjs';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { all } from 'q';


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
  public emailId: any = '';
  public socketId: any = '';
  public clients: any = [];
  public allClients: any = [];
  public textEnable: boolean = true;
  public fileEnable: boolean = false;
  public audioEnable: boolean = false;
  public audioCallEnable: boolean = false;
  public videoEnable: boolean = false;
  public screenEnable: boolean = false;
  public connected: boolean = false;
  public fromEmailId: any;
  public toEmailId: any;
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
  public selectedUseremailId: any;
  public sendMessagesObject: any;
  public receivedMessageObject: any;
  public selectedUserInfo: any;
  public selectUser: any;

  public is_chats: boolean = true;
  public is_contact: boolean = false;
  public is_favouriteContacts: boolean = false;
  public is_groupRooms: boolean = false;
  public is_room_created: boolean = false;

  // public roomId: String;
  public currentUserEmailID: any;
  public showRoomsForChatRespData: any = [];
  public allRoomInformationArray: any = [];
  public showGroupRoomsAvailableArray: any = [];
  public showAvbRoomsArray: any = [];
  public individualRoomArray: any = [];

  public userselect: boolean = false;
  public langSelect: boolean = false;
  public selectedUserGroupName: any;

  public roomData: any;
  public roomIdData: any;


  public roomId = "";
  public roomName = "";
  public dataForJoinRoom: any;
  public dataForCreateRoom: any;
  public chatNamesArray = [];
  public groupNamesArray = [];
  public allRoomsInformation = [];
  public allIndependentChatRooms = [];
  public setOfParticipants = [];
  public allSentMessages = [];
  public allHistoryMessages = [];
  public allHistoryMessagesOfRoom = [];
  public allReceivedMessages = [];
  public isChatRoomAvailable: boolean = false;
  public isGroupRoomAvailable: boolean = false;
  public showLanguageSelection: boolean = false;
  public isGroupSelected: boolean = false;
  public currentRoom: any;
  public allGroupMessages: any = [];
  public roomfound: boolean = false;
  public translateMessage: boolean = false;
  public sendMessageResp: any = [];
  public getSendMessageResp: any = [];
  public base64textString : any;
  public receivedFile: any;
  public receiveFileData: any;
  public joinRoomDetails: any = [];
  public sourceLangCode: any = 'en';
  public sourceLanguage: any = "English";
  public selectLanguage: any = [
    {
      'language': 'Afrikaans',
      'languageCode': 'af'
    },
    {
      'language': 'Albanian',
      'languageCode': 'sq'
    },
    {
      'language': 'Amharic',
      'languageCode': 'am'
    },
    {
      'language': 'Arabic',
      'languageCode': 'ar'
    },
    {
      'language': 'Azerbaijani',
      'languageCode': 'az'
    },
    {
      'language': 'Bengali',
      'languageCode': 'bn'
    },
    {
      'language': 'Bosnian',
      'languageCode': 'bs'
    },
    {
      'language': 'Bulgarian',
      'languageCode': 'bg'
    },
    {
      'language': 'Chinese (Simplified)',
      'languageCode': 'zh'
    },
    {
      'language': 'Chinese (Traditional)',
      'languageCode': 'zh-TW'
    },
    {
      'language': 'Croatian',
      'languageCode': 'hr'
    },
    {
      'language': 'Czech',
      'languageCode': 'cs'
    },
    {
      'language': 'Danish',
      'languageCode': 'da'
    }, {
      'language': 'Dari',
      'languageCode': 'fa-AF'
    },
    {
      'language': 'Dutch',
      'languageCode': 'nl'
    },
    {
      'language': 'English',
      'languageCode': 'en'
    },
    {
      'language': 'Estonian',
      'languageCode': 'et'
    },
    {
      'language': 'Finnish',
      'languageCode': 'fi'
    },
    {
      'language': 'French',
      'languageCode': 'fr'
    },
    {
      'language': 'French (Canadian)',
      'languageCode': 'fr-CAf'
    },
    {
      'language': 'Georgian',
      'languageCode': 'ka'
    },
    {
      'language': 'German',
      'languageCode': 'de'
    },
    {
      'language': 'Greek',
      'languageCode': 'el'
    },
    {
      'language': 'Hausa',
      'languageCode': 'ha'
    },
    {
      'language': 'Hebrew',
      'languageCode': 'he'
    },
    {
      'language': 'Hindi',
      'languageCode': 'hi'
    },
    {
      'language': 'Hungarian',
      'languageCode': 'hu'
    },
    {
      'language': 'Indonesian',
      'languageCode': 'id'
    },
    {
      'language': 'Italian',
      'languageCode': 'it'
    },
    {
      'language': 'Japanese',
      'languageCode': 'ja'
    },
    {
      'language': 'Korean',
      'languageCode': 'ko'
    },
    {
      'language': 'Latvian',
      'languageCode': 'lv'
    },
    {
      'language': 'Malay',
      'languageCode': 'ms'
    },
    {
      'language': 'Norwegian',
      'languageCode': 'no'
    },
    {
      'language': 'Persian',
      'languageCode': 'fa'
    },
    {
      'language': 'Pashto',
      'languageCode': 'ps'
    },
    {
      'language': 'Polish',
      'languageCode': 'pl'
    },
    {
      'language': 'Portuguese',
      'languageCode': 'pt'
    },
    {
      'language': 'Romanian',
      'languageCode': 'ro'
    },
    {
      'language': 'Russian',
      'languageCode': 'ru'
    },
    {
      'language': 'Serbian',
      'languageCode': 'sr'
    },
    {
      'language': 'Slovak',
      'languageCode': 'sk'
    },
    {
      'language': 'Slovenian',
      'languageCode': 'sl'
    },
    {
      'language': 'Somali',
      'languageCode': 'so'
    },
    {
      'language': 'Spanish',
      'languageCode': 'es'
    },
    {
      'language': 'Swahili',
      'languageCode': 'af'
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
  }

  ngOnInit() {
    this.decodeJWToken();
    this.socketConnect();
    this.getAllUser();
    this.getValidateLanguage();
    this.getValidateGroupUser();
    this.showChatAndGroupName();
    this.getGroupMessages();
  }


  /* START - Socket Connection */
  async socketConnect() {
    if (this.socketservice) {
      this.subscription = await this.socketservice.getSocketId().subscribe((message: any) => {
        this.serverStatus = true;
        this.fromEmailId = message.emailId;
        this.socketId = message.socketId;
        this.subscription.unsubscribe();
      });
      await this.socketservice.getClients().subscribe((clients: any) => {
        this.clients = clients;
        this.allClients = clients;
      });
      window.RTCPeerConnection = this.getRTCPeerConnection();
      window.RTCSessionDescription = this.getRTCSessionDescription();
      window.RTCIceCandidate = this.getRTCIceCandidate();
      console.log("**************this.browser****************", this.browser);
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
        console.log("Called onicecandidate");
        
        this.socketservice.sendIceCandidate({
          from: this.fromEmailId,
          roomId: this.currentRoom.room_id,
          // to: this.toEmailId,
          type: candidate.type,
          candidate: candidate.candidate
        });
      };

      this.peerConnection.oniceconnectionstatechange = (connection: RTCIceConnectionState) => {

      };
      this.peerConnection.ondatachannel = (event: any) => {
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
          console.log('Audio File Track Received');
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
          console.log('Audio Call Track Received');
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
          console.log('Video call Track Received');
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
          console.log('Screen Share Track Received');
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
        console.log("Received Offer broadcasted Room :", offer);
        await this.peerConnection.setRemoteDescription({ type: 'offer', sdp: offer.sdp });
        this.toEmailId = offer['from'];
        // console.log("offer['from'] : ", offer['from']);
        this.peerConnection.createAnswer().then(async (answer: RTCSessionDescription) => {
          await this.peerConnection.setLocalDescription(answer);
          // console.log("from client id after set local description", this.fromEmailId);
          this.socketservice.sendAnswer({
            from: this.fromEmailId,
            // to: this.toEmailId,
            roomId: this.currentRoom.room_id,
            type: answer.type,
            sdp: answer.sdp
          });
        });
      });
      this.socketservice.receiveAnswer().subscribe(async (answer: RTCSessionDescription) => {
        console.log("Receive answer broadcasted Room :", answer);

        await this.peerConnection.setRemoteDescription({ type: 'answer', sdp: answer.sdp });
      });
      this.socketservice.receiveIceCandidate().subscribe((candidate: RTCIceCandidate) => {
        if (candidate.candidate) {
          this.peerConnection.addIceCandidate(candidate.candidate);
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
  /* END - Socket Connection */

  /* START - Enable the Text */
  public async enableText() {
    // this.connect();
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
    this.enableFile();
  }
  /* END - Enable the Text */

  /* START - Enable the File */
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
      console.log("*********this.browser.mediaDevices*************", this.browser);
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
  /* END - Enable the Audio file */

  /* START - Enable the Audio Call */
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
      console.log("Browser Media for Get User Media:", this.browser);

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
        // console.log('Using video device: ' + this.videoTrack[0].label);
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
  /* END - Enable the Audio Call */

  /* START - Enable the video call */
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
      console.log("Browser Media for Get User Media:", this.browser);

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
  /* END - Enable the video call */

  /* START - Enable the Screen share */

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

  /* END - Enable the Screen share */

  public stopAudio() {
    this.audioStream.stop();
  }

  public stopVideo() {
    this.videoStream.stop();
  }

  public stopScreen() {
    this.screenStream.stop();
  }

  /* START - Connect the Peer to Peer */
  public async connect() {
    console.log("************Current Room**************",this.currentRoom);
    let allJoinedRooms = JSON.parse(localStorage.getItem("joinRoomDetails"));
    let  currentJoinRoom : any;
    allJoinedRooms.forEach((room)=>{
      if(room.roomId == this.currentRoom.room_id){
        currentJoinRoom = room;
      }
    });

    this.connected = true;
    this.dataChannel = await this.peerConnection.createDataChannel('datachannel');
    if (this.fileEnable) {
      this.dataChannel.binaryType = 'arraybuffer';
    }
    this.dataChannel.onerror = (error: any) => {
      console.log("Data Channel Error:", error);
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
      await this.peerConnection.setLocalDescription(offer);

      // currentJoinRoom.users.forEach((user)=>{
      //   if(user.userName != this.emailID){
          this.socketservice.sendOffer({
            from: this.fromEmailId,
            // to: this.toEmailId,
            roomId: this.currentRoom.room_id,
            type: offer.type,
            sdp: offer.sdp,
          // });
        // }  
      });
    });
  }
  /* End - Connect the Peer to Peer */



  /* START - Disconnect the Peer to Peer */
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
    this.toEmailId = '';
    this.enableDownload = false;
    this.sendProgressValue = 0;
    this.receivedProgressValue = 0;
    this.sendFileName = '';
    this.receivedFileName = '';
    this.receivedFileSize = '';
    this.receivedFileType = '';
  }
  /* END - Disconnect the Peer to Peer */


  /**
   * @author Irshad Ahmed
   * @name decodeJWToken()
   * @description decode the JWT Token
   */
  decodeJWToken() {
    let token = localStorage.getItem('access_token');
    this.jwtData = decode(token);
    this.userRole = this.jwtData['custom:role'];
    this.emailID = this.jwtData['email'];
  }

  /**
   * @author Irshad Ahmed
   * @name getValidateLanguage
   * @description validate language form data
   */
  getValidateLanguage() {
    this.langForm = this.__fb.group({
      sourceLanguageCode: new FormControl(),
      sourceLanguage: new FormControl()
    });
  }

  /**
   * @author Irshad Ahmed
   * @name getValidateGroupUser
   * @description validate group room form data
   */
  getValidateGroupUser() {
    this.selectedGroupUserForm = this.__fb.group({
      groupName: new FormControl(),
      groupUserName: new FormControl()
    });
  }

  /**
   * @author Irshad Ahmed
   * @name selectPreferedLanguage
   * @param languageCode
   * @description select the prefered language
   */
  selectPreferedLanguage(languageCode) {
    this.selectLanguage.forEach((lang) => {
      if (lang.languageCode == languageCode) {
        this.sourceLanguage = lang.language;
        this.sourceLangCode = lang.languageCode
        this.showLanguageSelection = false;
      }
    });
    console.log("Prefered Language is:", languageCode)
    var selectUser = JSON.stringify(localStorage.getItem('selectedUserInfo'));
    console.log("Selected User Info:", selectUser);

    if (selectUser) {
      // this.sourceLangCode = languageCode;
      localStorage.setItem("preferedSourceLanguageCode", "en")

      localStorage.setItem("preferedTargetLanguageCode", languageCode)
    }
    else if (this.userSelected) {
      // this.sourceLangCode = languageCode;
      localStorage.setItem("preferedSourceLanguageCode", "en")
      localStorage.setItem("preferedTargetLanguageCode", languageCode)

    }
  }

  /**
   * @author Irshad Ahmed
   * @name getAllUser()
   * @description call API for get registered Users from Server.
   */
  async getAllUser() {
    if (this.userRole == 'Employer') {
      await this.__authService.getAllFreelancers().then((resData: any) => {
        this.allUsersArr = resData.responseObject;
      });
    } else if (this.userRole == 'Freelancer') {
      await this.__authService.getAllEmployers().then((resData: any) => {
        this.allUsersArr = resData.responseObject;
      });
    }
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

  // save the chat message's in DB
  // saveChatMessage() {
  //   var sendfromStorage = localStorage.getItem("senderObj");
  //   var sendObjectsFromStorage = JSON.parse(sendfromStorage);
  //   var recfromStorage = localStorage.getItem("receiverObj");
  //   var receiveObjectsFromStorage = JSON.parse(recfromStorage);
  // }

  selectedGroupUsers() {
    console.log("Selected Group Users:", this.selectedGroupUserForm.value);
    this.selectedUserGroupName = this.selectedGroupUserForm.value.groupName;
    this.createOrJoinGroupRoomChat();
  }

  showChatUserWindow() {
    this.is_contact = false;
    this.is_groupRooms = false;
    this.is_favouriteContacts = false;
    this.is_chats = true
  }

  showChatContacts() {
    this.is_contact = true;
    this.is_groupRooms = false;
    this.is_favouriteContacts = false;
    this.is_chats = false;
    console.log("Show Chat contacts");
  }

  showChatsFavourite() {
    this.is_contact = false;
    this.is_groupRooms = false;
    this.is_favouriteContacts = true;
    this.is_chats = false;
    console.log("Show Chat Favourite Users");

  }

  async showAvailableRooms() {
    console.log("Show Available Rooms ");
    this.is_contact = false;
    this.is_groupRooms = true;
    this.is_favouriteContacts = false;
    this.is_chats = false;
  }

  /********************Sorting Names of Individual and Group chat rooms*********************/
  /**
   * @author Shefali Bhavekar
   * @date 20/12/2019
   * @name showChatAndGroupNames
   */
  showChatAndGroupName() {
    this.is_contact = false;
    this.is_groupRooms = false;
    this.is_favouriteContacts = false;
    this.is_chats = true;
    this.allRoomsInformation = JSON.parse(localStorage.getItem("all-rooms"));
    this.allRoomsInformation.forEach((room) => {
      if (room.room_type == "Group") {
        this.groupNamesArray.push(room);
      }
      room.participants.forEach(participant => {
        if (participant.participant_name != this.emailID) {
          if (room.room_type == "Individual") {
            this.chatNamesArray.push(participant);
            this.allIndependentChatRooms.push(room);
          }
        }
      });
    });
    if (this.chatNamesArray.length != 0) {
      this.isChatRoomAvailable = true;
    }
    if (this.groupNamesArray.length != 0) {
      this.isGroupRoomAvailable = true;
    }
    this.getAllMessages();
  }

  /**********************************Join Or Create Independent Chat Room*******************************/
  /**
   * @author Shefali Bhavekar
   * @date 21/12/2019
   * @name createOrJoinIndependentChat
   */
  createOrJoinIndependentChat() {

    this.allIndependentChatRooms.forEach((independentRoom) => {
      independentRoom.participants.forEach(participant => {
        if (participant.participant_name == this.userSelected) {
          console.log("independentRoom", independentRoom);
          this.roomId = independentRoom.room_id,
            this.roomName = independentRoom.room_name
        }
      });
    });

    this.dataForJoinRoom = {
      roomId: this.roomId,
      roomName: this.roomName,
      userName: this.emailID
    }

    if (this.userRole == "Freelancer") {
      console.log("dataForJoinRoom for direct joining");
      this.socketservice.joinRoom(this.dataForJoinRoom).subscribe((joinRes: any) => {
        localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
      });
    } else if (this.userRole == "Employer") {
      if (this.roomId == "" && this.roomName == "") {
        this.setOfParticipants = [];
        this.setOfParticipants.push({ 'username': this.emailID, 'role': 'Employer', 'type': 'Initiator' });
        this.setOfParticipants.push({ 'username': this.userSelected, 'role': 'Freelancer', 'type': 'participant' });

        this.dataForCreateRoom = {
          roomName: this.emailID + "&" + this.userSelected,
          participants: this.setOfParticipants,
          roomType: "Individual"
        }
        this.socketservice.createRoom(this.dataForCreateRoom).then((createRoomRespData: any) => {
          let sendInvitationData = {
            toEmails: this.userSelected,
            fromEmail: this.emailID
          }

          this.socketservice.sendInvitaionByEmail(sendInvitationData).then((invitaionsRes: any) => {
            console.log("*******************invitaionsRes*********************", invitaionsRes);
          });

          let dataForJoinRoom = {
            roomId: createRoomRespData.responseObject[0].this.roomId,
            roomName: createRoomRespData.responseObject[0].roomName,
            userName: this.emailID
          }
          this.setOfParticipants = [];
          this.setOfParticipants.push({ 'participant_name': this.emailID, 'role': 'Employer', 'type': 'Initiator' });
          this.setOfParticipants.push({ 'participant_name': this.userSelected, 'role': 'Freelancer', 'type': 'participant' });
          let pushData = {
            room_id: createRoomRespData.responseObject[0].roomId,
            room_name: createRoomRespData.responseObject[0].roomName,
            room_type: "Individual",
            participants: this.setOfParticipants
          }
          this.allRoomsInformation.push(pushData);
          localStorage.setItem("all-rooms", JSON.stringify(this.allRoomsInformation));
          this.showChatAndGroupName();
          localStorage.setItem("all-rooms", JSON.stringify(this.allRoomsInformation));
          this.socketservice.joinRoom(dataForJoinRoom).subscribe((joinRes: any) => {
            localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
          });
        });
      }
      else {
        this.socketservice.joinRoom(this.dataForJoinRoom).subscribe((joinRes: any) => {
          localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
        });
      }
    }
  }


  /**********************************Send the message and save into cassandra db**************************************/
  /**
   * @author Irshad ahmed
   * @method sendMessage
   * @description send the message and save into cassandra db
   */

  async sendMessage() {

    if (this.userRole == 'Employer') {
      var preferedSourceLanguageCode = localStorage.getItem('preferedSourceLanguageCode');
      console.log("prefered employer lang code", preferedSourceLanguageCode);

      var joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
      console.log("Join room details get from Local storage:", joinRoomDetails);

      this.messageObject = {
        'sessionId': joinRoomDetails[0].users[0].sessionId,
        'roomId': joinRoomDetails[0].roomId,
        'sender': this.jwtData.email,
        'senderRole': this.userRole,
        'sourceLanguageCode': preferedSourceLanguageCode,
        'originalMessage': this.message
      };

      console.log("send Message (before) to cassandra:", this.messageObject);

      await this.socketservice.sendMessageToCassandra(this.messageObject).then((msgRes: any) => {
        console.log("response of emp from casendra msg", msgRes);
        localStorage.setItem("sendMessageResp", JSON.stringify(msgRes));
      });

      this.sendMessageResp = localStorage.getItem('sendMessageResp');
      console.log("this.sendMessageResp :", JSON.parse(this.sendMessageResp));
      this.getSendMessageResp = JSON.parse(this.sendMessageResp);

      /* Send Cassandra Reapsone data with MessageId to DataChannel */
      await this.dataChannel.send(JSON.stringify(
        {
          emailId: this.fromEmailId,
          data: this.message,
          sessionId: joinRoomDetails[0].users[0].sessionId,
          roomId: joinRoomDetails[0].roomId,
          messageId: this.getSendMessageResp.responseObject.messageId
        }
      ));

    } else if (this.userRole == 'Freelancer') {
      var preferedSourceLanguageCode = localStorage.getItem('preferedSourceLanguageCode');
      console.log("prefered freelancer lang code", preferedSourceLanguageCode);

      let joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
      console.log("Join Room Details for send message:", joinRoomDetails);

      this.messageObject = {
        'sessionId': joinRoomDetails[0].users[0].sessionId,
        'roomId': joinRoomDetails[0].roomId,
        'sender': this.jwtData.email,
        'senderRole': this.userRole,
        'sourceLanguageCode': preferedSourceLanguageCode,
        'originalMessage': this.message
      };
      console.log("send Message (before) to cassandra:", this.messageObject);

      await this.socketservice.sendMessageToCassandra(this.messageObject).then((msgRes: any) => {
        console.log("response of free from casendra msg", msgRes);
        localStorage.setItem("sendMessageResp", JSON.stringify(msgRes));
      });

      this.sendMessageResp = localStorage.getItem('sendMessageResp');
      console.log("this.sendMessageResp :", JSON.parse(this.sendMessageResp));
      this.getSendMessageResp = JSON.parse(this.sendMessageResp);

      /* Send Cassandra Reapsone data with MessageId to DataChannel */
      await this.dataChannel.send(JSON.stringify(
        {
          emailId: this.fromEmailId,
          data: this.message,
          sessionId: joinRoomDetails[0].users[0].sessionId,
          roomId: joinRoomDetails[0].roomId,
          messageId: this.getSendMessageResp.responseObject.messageId
        }
      ));
    }

    this.messages.push(JSON.parse(JSON.stringify({ emailId: this.fromEmailId, user: 'sender', data: this.message })));
    this.message = '';
    var stringToStore = JSON.stringify(this.messageObject);
    // localStorage.setItem("senderObj", stringToStore);
    // this.getLocalStorageSenderMessage();
  }

  /**********************************Join Or Create "Group" Chat Room**************************************/
  /**
   * @author Shefali Bhavekar
   * @date 21/12/2019
   * @name createOrJoinIndependentChat
   */

  createOrJoinGroupRoomChat() {
    console.log("Inside createOrJoinGroupRoomChat", this.groupNamesArray);
    this.groupNamesArray.forEach((groupRoom) => {
      groupRoom.participants.forEach(participant => {
        if (participant.participant_name == this.userSelected || this.userSelected == groupRoom.room_name) {
          console.log("groupRoom", groupRoom);
          this.roomId = groupRoom.room_id,
            this.roomName = groupRoom.room_name
        }
      });
    });

    this.dataForJoinRoom = {
      roomId: this.roomId,
      roomName: this.roomName,
      userName: this.emailID
    }

    if (this.userRole == "Freelancer") {
      console.log("dataForJoinRoom for direct joining");
      this.socketservice.joinRoom(this.dataForJoinRoom).subscribe((joinRes: any) => {
        localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
      });
    } else if (this.userRole == "Employer") {
      console.log("******************this.roomId******************", this.roomId);
      console.log("******************this.roomName******************", this.roomName);

      if (this.roomId == "" && this.roomName == "") {
        this.setOfParticipants = [];
        this.setOfParticipants.push({ 'username': this.emailID, 'role': 'Employer', 'type': 'Initiator' });
        this.selectedGroupUserForm.value.groupUserName.forEach(element => {
          this.setOfParticipants.push({ 'username': element, 'role': 'Freelancer', 'type': 'participant' });
        });

        this.dataForCreateRoom = {
          roomName: this.selectedGroupUserForm.value.groupName,
          participants: this.setOfParticipants,
          roomType: "Group"
        }
        console.log("creating room", this.dataForCreateRoom);
        this.socketservice.createRoom(this.dataForCreateRoom).then((createRoomRespData: any) => {
          console.log("*******************Room created*********************");
          let sendInvitationData = {
            toEmails: this.selectedGroupUserForm.value.groupUserName,
            fromEmail: this.emailID
          }

          this.socketservice.sendInvitaionByEmail(sendInvitationData).then((invitaionsRes: any) => {
            console.log("*******************invitaionsRes*********************", invitaionsRes);
          });

          let dataForJoinRoom = {
            roomId: createRoomRespData.responseObject[0].roomId,
            roomName: createRoomRespData.responseObject[0].roomName,
            userName: this.emailID
          }

          console.log("joining room", createRoomRespData);
          this.setOfParticipants = [];
          this.setOfParticipants.push({ 'participant_name': this.emailID, 'role': 'Employer', 'type': 'Initiator' });
          this.selectedGroupUserForm.value.groupUserName.forEach(element => {
            this.setOfParticipants.push({ 'participant_name': element, 'role': 'Freelancer', 'type': 'participant' });
          });
          let pushData = {
            room_id: createRoomRespData.responseObject[0].roomId,
            room_name: createRoomRespData.responseObject[0].roomName,
            room_type: "Group",
            participants: this.setOfParticipants
          }
          this.allRoomsInformation.push(pushData);
          localStorage.setItem("all-rooms", JSON.stringify(this.allRoomsInformation));
          this.showChatAndGroupName();
          this.socketservice.joinRoom(dataForJoinRoom).subscribe((joinRes: any) => {
            localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
          });
        });
      } else {
        this.socketservice.joinRoom(this.dataForJoinRoom).subscribe((joinRes: any) => {
          localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
        });
      }
    }
  }

  /**********************************get all messages**************************************/
  /**
   * @author Shefali Bhavekar
   * @date 21/12/2019
   * @name getAllMessages()
   */

  getAllMessages(){
    this.allRoomsInformation.forEach(room => {
      let getMsgRequest = {
        roomId: room.room_id
      }
      this.socketservice.getAllMessages(getMsgRequest).then((msgs : any)=>{
        this.allHistoryMessages.push(msgs);
        console.log("this.allHistoryMessages:" , this.allHistoryMessages);
        // console.log("***********allHistoryMessages********************",this.allHistoryMessages);

      });
    });
  }

  /************************sender and receiver wise sorting of messages to show history**************************************/
  /**
   * @author Shefali Bhavekar
   * @date 21/12/2019
   * @name showIndependentHistoryMessages()
   */

  showIndependentHistoryMessages() {
    // console.log("*******************Inside showIndependentHistoryMessages*****************");
    if (this.allIndependentChatRooms != undefined) {
      this.allIndependentChatRooms.forEach((independentRoom) => {
        independentRoom.participants.forEach(participant => {
          if (participant.participant_name == this.userSelected) {
            console.log("allHistoryMessages values:", this.allHistoryMessages);
            if (this.allHistoryMessages != undefined) {
              this.allHistoryMessages.forEach((history) => {
                console.log("history values:", history);
                if (history.customResponseObject.roomId == independentRoom.room_id) {
                  this.allHistoryMessagesOfRoom.push(history.responseObject);
                  history.responseObject.forEach(element => {
                    console.log("Element:", element);

                    // if(this.userSelected == element.senderName || this.userSelected == element.ReceiverName){
                    // console.log("*****************history.responseObject***********" , element);
                    let msg = {
                      historyMessage:true,
                      roomId: history.customResponseObject.roomId,
                      sessionId: element.sessionId,
                      receiverName: element.receiverData.receiverName,
                      receiverRole: element.receiverData.receiverRole,
                      messageId: element.messageId,
                      sourceLanguageCode: element.sourceLanguageCode,
                      targetLanguageCode: element.receiverData.targetLanguageCode,
                      senderName: element.senderName,
                      senderRole: element.senderRole,
                      originalMessage: element.originalMessage,
                      translatedMessage: element.receiverData.translatedMessage,
                      sendDate: element.sendDate,
                      receiveDate: element.receiverData.recievedDate,
                    }
                    console.log("Get all messages:", msg);

                    this.allGroupMessages.push(msg);


                  });
                }
              });
            }
          }
        });
      });
    }

  }

 /************************sender and receiver wise sorting of messages to show history**************************************/   
  /**
   * @author Shefali Bhavekar
   * @date 25/12/2019
   * @name showGroupHistoryMessages()
   */

  showGroupHistoryMessages() {
    // console.log("*******************Inside showGroupHistoryMessages*****************");
    console.log("In group History message");
    
    if(this.groupNamesArray !== undefined){
      this.groupNamesArray.forEach((groupRoom) => {
        if(this.allHistoryMessages !== undefined){
          console.log("History group message:", this.allHistoryMessages );
          
          this.allHistoryMessages.forEach((history) => {
            if (history.customResponseObject.roomId == groupRoom.room_id) {
              this.allHistoryMessagesOfRoom.push(history.responseObject);
              history.responseObject.forEach(element => {
                let msg = {
                  historyMessage:true,
                  roomId: element.roomId,
                  sessionId: element.sessionId,
                  receiverName: element.receiverData.receiverName,
                  receiverRole: element.receiverData.receiverRole,
                  messageId: element.messageId,
                  sourceLanguageCode: element.sourceLanguageCode,
                  targetLanguageCode: element.receiverData.targetLanguageCode,
                  senderName: element.senderName,
                  senderRole: element.senderRole,
                  originalMessage: element.originalMessage,
                  translatedMessage: element.receiverData.translatedMessage,
                  sendDate: element.sendDate,
                  receiveDate: element.receiverData.recievedDate,
                }
                this.allGroupMessages.push(msg);
                console.log("Get all Group previous messages :", this.allGroupMessages);
    
              });
            }
          });
        }
      });
    }
  }

  /************************************Changing Language for traslation**************************************/
  /**
   * @author Shefali Bhavekar
   * @date 24/12/2019
   * @name changeLanguage()
   */
  changeLanguage(event: any) {
    if (event == true) {
      this.showLanguageSelection = true;
    } else {
      this.showLanguageSelection = false;
    }
  }


  /************************************Group selection**************************************/
  /**
   * @author Shefali Bhavekar
   * @date 24/12/2019
   * @name groupSelected()
   */
  groupSelected(i: any) {
    this.isGroupSelected = true;
    this.textEnable = true;
    this.userselect = true;
    this.userSelected = this.groupNamesArray[i].room_name;
    this.currentRoom = this.groupNamesArray[i];
    this.joinRoomDetails = localStorage.getItem('joinRoomDetails');
    this.createOrJoinGroupRoomChat();
  }


  independentChatSelected(independentUser: any) {
    this.userSelected = independentUser;
    this.textEnable = true;
    this.userselect = true;
    this.allIndependentChatRooms.forEach((independentRoom: any) => {
      independentRoom.participants.forEach((participant: any) => {
        if (participant.participant_name == independentUser) {
          this.currentRoom = independentRoom;
        }
      });
    });
    this.createOrJoinIndependentChat();
  }
  /************************************Send Group messages**************************************/
  /**
   * @author Shefali Bhavekar
   * @date 24/12/2019
   * @name sendGroupMessages()
   */

  sendGroupMessages() {
    let currentJoinRoom: any;
    let joinRoomDetails: any = [];
    let sendMessageData: any;

    joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));

    joinRoomDetails.forEach(room => {
      if (this.currentRoom.room_id == room.roomId) {
        currentJoinRoom = room;
        console.log("*******currentJoinRoom*****", currentJoinRoom);
        room.users.forEach((user) => {
          if (user.userName == this.emailID) {
            sendMessageData = {
              originalMessage: this.message,
              roomId: currentJoinRoom.roomId,
              sessionId: user.sessionId,
              sender: this.emailID,
              senderRole: this.userRole,
              sourceLanguageCode: this.sourceLangCode,
            }
            this.socketservice.sendMessageToCassandra(sendMessageData).then((msgRes: any) => {
              console.log("################****msgRes*****#################", msgRes);
              if (msgRes.status == "Success") {
                sendMessageData = {
                  originalMessage: this.message,
                  roomId: currentJoinRoom.roomId,
                  sessionId: user.sessionId,
                  senderName: this.emailID,
                  senderRole: this.userRole,
                  sourceLanguageCode: this.sourceLangCode,
                  messageId: msgRes.responseObject.messageId,
                  sendDate: msgRes.responseObject.sendDate
                }
                this.socketservice.sendMessagestoGroup(msgRes.responseObject);
                this.allGroupMessages.push(sendMessageData);
                this.message = "";
                console.log("********** allGroupMessages data************", this.allGroupMessages );
              }
            });
          }
        });
      }
    });
  }

  /************************************Sending file to save in cassandra********************************************/
   /**
   * @author Shefali Bhavekar
   * @date 25/12/2019
   * @name handleFileSelect()
   * @name _handleReaderLoaded()
   * @name sendFile()
   * @description convert file object to base 64
   */
  handleFileSelect(evt){
    var files = evt.target.files;
    this.file = files[0];
    
  if (files && this.file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.file);
  }
}

_handleReaderLoaded(readerEvt) {
   var binaryString = readerEvt.target.result;
          this.base64textString= btoa(binaryString);
          console.log(btoa(binaryString));
          let fileNameDisplay;
          fileNameDisplay = this.file['name'];
          this.sendFile(this.file['name']);
  }

  sendFile(fileName : any){
    let currentJoinRoom : any;
    let joinRoomDetails : any = [];
    let sendFileData : any;
    
    joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));

    joinRoomDetails.forEach(room => {
      if(this.currentRoom.room_id == room.roomId){
        currentJoinRoom = room;
        console.log("*******currentJoinRoom*****" , currentJoinRoom);
        room.users.forEach((user)=>{
          if(user.userName == this.emailID){
            sendFileData = {
              fileName : fileName,
              fileData : this.base64textString,
              roomId :  currentJoinRoom.roomId,
              sessionId : user.sessionId,
              sender : this.emailID,
              senderRole : this.userRole,
            }
            this.socketservice.sendFileToCassandra(sendFileData).then((msgRes : any)=>{
              console.log("################****msgRes*****#################" , msgRes);
              if(msgRes.status == "Success"){
                sendFileData = {
                  fileName : fileName,
                  fileData : this.base64textString,
                  roomId :  currentJoinRoom.roomId,
                  sessionId : user.sessionId,
                  senderName : this.emailID,
                  senderRole : this.userRole,
                  sourceLanguageCode : this.sourceLangCode,
                  messageId:msgRes.responseObject.messageId,
                  sendDate:msgRes.responseObject.sendDate,
                  sendingFileFlag : true
                }
                this.socketservice.sendMessagestoGroup(sendFileData);
                this.allGroupMessages.push(sendFileData);
                console.log("********** allGroupMessages data************", this.allGroupMessages );
              } 
            });
          }
        });
      }
    });
  }

  public downloadFile(downloadFile: any) {
    if(this.receiveFileData !== 'undefined' || this.receiveFileData !== ''){
      if(this.receiveFileData.fileName == downloadFile){
        console.log("Download file method called : ", downloadFile)
        let sliceSize=512;
        const byteArrays = [];
        let contentType='';
        let incommingFile = atob(this.receiveFileData.fileData);
        for (let offset = 0; offset < incommingFile.length; offset += sliceSize) {
          const slice = incommingFile.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const fileBlob = new Blob(byteArrays, {type: contentType});
        console.log("********incomming file after converting atob()**********",incommingFile);
        console.log("Download file method calling...");
        saveAs(fileBlob, downloadFile);
      }
    }
   
  }



  /************************************get Group messages**************************************/   
  /**
   * @author Shefali Bhavekar
   * @date 24/12/2019
   * @name getGroupMessages()
   * @description This function get messages from socket and save to the cassandra 
   *              after receiving the messages.
   *              It also use traslation if needed.
   * @lastmodefied 26/12/2019
   */
  async getGroupMessages(){
    let msg : any ;
    await this.socketservice.getGroupMessages().subscribe((messages: any) => {
      console.log("Response of file :", messages)
    if(messages.sendingFileFlag == true){

      console.log("*********************incomming file messges*************************",messages);
      // this.downloadFile(messages);
      console.log("Download file is:", messages.fileName);
      this.receiveFileData = messages;
      this.receivedFile = messages.fileName;
      console.log("Download file name:", this.receivedFile);
      
      


      msg = {
          roomId : messages.roomId,
          sessionId : messages.sessionId,
          receiverName : this.emailID ,
          receiverRole : this.userRole,
          messageId : messages.messageId
         }
         this.socketservice.sendMessageToReceivedMessageCassandra(msg).then((saveReceivedMsgRes : any) => {
            msg = {
              roomId : messages.roomId,
              sessionId : messages.sessionId,
              receiverName : this.emailID ,
              receiverRole : this.userRole,
              messageId : messages.messageId,
              senderName : messages.sender,
              sendDate : messages.sendDate,
              receiveDate : saveReceivedMsgRes.responseObject.recievedDate,
              fileName : messages.fileName,
              fileData : messages.fileData,
              recievedFileFlag : true
             }
            this.allGroupMessages.push(msg);
         });

    }else{
      if(this.sourceLangCode == messages.sourceLanguageCode){
        msg = {
          roomId : messages.roomId,
          sessionId : messages.sessionId,
          receiverName : this.emailID ,
          receiverRole : this.userRole,
          messageId : messages.messageId
         }
         this.socketservice.sendMessageToReceivedMessageCassandra(msg).then((saveReceivedMsgRes : any) => {
            msg = {
              roomId : messages.roomId,
              sessionId : messages.sessionId,
              receiverName : this.emailID ,
              receiverRole : this.userRole,
              messageId : messages.messageId,
              sourceLanguageCode : messages.sourceLanguageCode,
              targetLanguageCode : "",
              senderName : messages.sender,
              originalMessage : messages.originalMessage,
              translatedMessage : "",
              sendDate : messages.sendDate,
              receiveDate : saveReceivedMsgRes.responseObject.recievedDate,
             }
            this.allGroupMessages.push(msg);
         });

       }else{
        msg = {
          roomId : messages.roomId,
          sessionId : messages.sessionId,
          receiverName : this.emailID ,
          receiverRole : this.userRole,
          messageId : messages.messageId,
          sourceLanguageCode : messages.sourceLanguageCode,
          targetLanguageCode : this.sourceLangCode,
          senderName : messages.sender,
          originalMessage : messages.originalMessage
         }
         
         this.socketservice.messageToTranslantion(msg).then((translationRes : any)=>{
          msg = {
            roomId : messages.roomId,
            sessionId : messages.sessionId,
            receiverName : this.emailID ,
            receiverRole : this.userRole,
            messageId : messages.messageId,
            targetLanguageCode : this.sourceLangCode,
            translatedMessage : translationRes.translatedMessage.TranslatedText
           }
           this.socketservice.sendMessageToReceivedMessageCassandra(msg).then((saveReceivedMsgRes : any) => {
              msg = {
                roomId : messages.roomId,
                sessionId : messages.sessionId,
                receiverName : this.emailID ,
                receiverRole : this.userRole,
                messageId : messages.messageId,
                sourceLanguageCode : messages.sourceLanguageCode,
                targetLanguageCode : this.sourceLangCode,
                senderName : messages.sender,
                originalMessage : messages.originalMessage,
                sendDate : messages.sendDate,
                receiveDate : saveReceivedMsgRes.responseObject.recievedDate,
                translatedMessage : translationRes.translatedMessage.TranslatedText
               }
               this.allGroupMessages.push(msg);
           });
         });
       }
      }
    });
  }
}
