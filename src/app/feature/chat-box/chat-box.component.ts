import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatWindowService } from './service/chat-window.service';
import { Subscription, Observable } from 'rxjs';
import adapter from 'webrtc-adapter';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { async } from 'q';

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
  public is_contact: boolean = false;
  public is_favouriteContacts: boolean = false;
  public is_groupRooms: boolean = false;
  public is_room_created: boolean = false;

  public roomId: String;
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


  public chatNamesArray = [];
  public groupNamesArray = [];
  public allRoomsInformation = [];
  public allIndependentChatRooms= [];
  public setOfParticipants = [];
  public isChatRoomAvailable: boolean = false;
  public isGroupRoomAvailable: boolean = false;


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
    console.log("Sender Email :", this.senderEmail);

    console.log("lanfguadskjskjd:", this.langSelect);
  }

  ngOnInit() {
    this.decodeJWToken();
    this.socketConnect();
    this.getAllUser();
    this.getValidateLanguage();
    this.getValidateGroupUser();
    // this.showChatUser();
    this.showChatAndGroupName();
    // this.showGroupChatRoomAvailable();
  }

  /**
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
   * @name getValidateGroupUser
   * @description validate group room form data
   */
  getValidateGroupUser() {
    this.selectedGroupUserForm = this.__fb.group({
      groupName: new FormControl(),
      groupUserName: new FormControl()
    });
  }

  selectPreferedLanguage(languageCode) {
    console.log("Prefered Language is:", languageCode)
    var selectUser = JSON.stringify(localStorage.getItem('selectedUserInfo'));
    console.log("Selected User Info:", selectUser);

    if (selectUser) {
      localStorage.setItem("preferedSourceLanguageCode", languageCode)
    }
    else if (this.userSelected) {
      localStorage.setItem("preferedTargetLanguageCode", languageCode)
    }
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

        if (this.userRole == 'Employer') {
          var preferedSourceLanguageCode = localStorage.getItem('preferedSourceLanguageCode');
          console.log("prefered Data channel Employer Source Language Code ", preferedSourceLanguageCode);
          var preferedTargetLanguageCode = localStorage.getItem('preferedTargetLanguageCode');
          console.log("prefered Data channel Employer Target Language Code ", preferedTargetLanguageCode);

          this.sendMessages = {
            sourceLanguageCode: preferedSourceLanguageCode,
            targetLanguageCode: "hi",
            originalText: messageData.data,
            sender: this.jwtData.email,
            receiver: this.userSelected,
            clientId: messageData.clientId,
          }

          // this.socketservice.getMessageFromCassandra(this.emailID).then((respGetMsgCassandra: any) => {
          //   console.log("Get Message Data from Cassandra:", respGetMsgCassandra);
          //   this.messages.push(JSON.parse(JSON.stringify({ clientId: respGetMsgCassandra.clientId, originalText: respGetMsgCassandra.originalText, data: respGetMsgCassandra.translatedText.TranslatedText })));

          // });

          this.socketservice.translantionMessage(this.sendMessages).then((messgeData1: any) => {
            console.log("Translated Data :", messgeData1);
            this.messages.push(JSON.parse(JSON.stringify({ clientId: messgeData1.clientId, originalText: messgeData1.originalText, data: messgeData1.translatedText.TranslatedText })));

          });
        }
        else if (this.userRole == 'Freelancer') {

          var preferedSourceLanguageCode = localStorage.getItem('preferedSourceLanguageCode');
          console.log("prefered Data channel freelancer Source Language Code", preferedSourceLanguageCode);
          var preferedTargetLanguageCode = localStorage.getItem('preferedTargetLanguageCode');
          console.log("prefered Data channel freelancer Target Language Code", preferedTargetLanguageCode);

          this.sendMessages = {
            sourceLanguageCode: "en",
            targetLanguageCode: preferedSourceLanguageCode,
            originalText: messageData.data,
            sender: this.jwtData.email,
            receiver: this.userSelected,
            clientId: messageData.clientId,
          }

          // this.socketservice.getMessageFromCassandra(this.emailID).then((respGetMsgCassandra: any) => {
          //   console.log("Get Message Data from Cassandra:", respGetMsgCassandra);
          //   this.messages.push(JSON.parse(JSON.stringify({ clientId: respGetMsgCassandra.clientId, originalText: respGetMsgCassandra.originalText, data: respGetMsgCassandra.translatedText.TranslatedText })));
          // });

          this.socketservice.translantionMessage(this.sendMessages).then((messgeData1: any) => {
            console.log("Send Message component Data:", messgeData1);
            this.messages.push(JSON.parse(JSON.stringify({ clientId: messgeData1.clientId, originalText: messgeData1.originalText, data: messgeData1.translatedText.TranslatedText })));

          });
        }

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
    if (this.userRole == 'Employer') {
      var preferedSourceLanguageCode = localStorage.getItem('preferedSourceLanguageCode');
      console.log("prefered employer lang code", preferedSourceLanguageCode);


      var joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
      console.log("Join room details get from Local storage:", joinRoomDetails);

      this.messageObject = {
        // 'sessionId': "d6c0461dcc47e08bb577081d9093415d2b2dfe2b",
        // 'roomId': "3f93c281daa55a6d3c343cd5a692666980884047",
        'sessionId': joinRoomDetails[0].users[0].sessionId,
        'roomId': joinRoomDetails[0].roomId,
        'sender': this.jwtData.email,
        'receiver': this.userSelected,
        'senderRole': this.userRole,
        'recieverRole': 'Freelancer',
        'sourceLanguageCode': preferedSourceLanguageCode,
        'originalMsg': this.message
      };
      console.log("Message for send to receiver:", this.messageObject);

      // this.socketservice.postMessageToCassandra(this.messageObject).then((msgRes: any) => {
      //   console.log("response emp from casendra msg", msgRes);
      //   //  localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
      // });

    } else if (this.userRole == 'Freelancer') {
      var preferedSourceLanguageCode = localStorage.getItem('preferedSourceLanguageCode');
      console.log("prefered freelancer lang code", preferedSourceLanguageCode);

      let joinRoomDetails = JSON.parse(localStorage.getItem('joinRoomDetails'));
      console.log("Join Room Details for send message:", joinRoomDetails);

      this.messageObject = {
        'sessionId': joinRoomDetails[0].users[0].sessionId,
        'roomId': joinRoomDetails[0].roomId,
        // 'sessionId': "d6c0461dcc47e08bb577081d9093415d2b2dfe2b",
        // 'roomId': "3f93c281daa55a6d3c343cd5a692666980884047",
        'sender': this.jwtData.email,
        'receiver': this.userSelected,
        'senderRole': this.userRole,
        'recieverRole': 'Employer',
        'sourceLanguageCode': preferedSourceLanguageCode,
        'originalMsg': this.message
      };
      console.log("Message for send to receiver:", this.messageObject);
      // this.socketservice.postMessageToCassandra(this.messageObject).then((msgRes: any) => {
      //   console.log("response free from casendra msg", msgRes);
      //   //  localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
      // });
    }
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
   * @name selectedUser
   * @param selectedUser 
   * @description select user
   */
  async selectedUser(selectUser) {
    console.log("selected User Information :", selectUser);
    this.userselect = true;
    this.selectedUserInfo = JSON.stringify(selectUser);
    localStorage.setItem('selectedUserInfo', this.selectedUserInfo)
    this.userSelected = selectUser.emailId || selectUser;
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

 
  // async showGroupChatRoomAvailable() {
  //   await this.socketservice.showRoomAvailable(this.currentUserEmailID).then((showRoomsAvailable: any) => {
  //     console.log("showRoomsAvailable:", showRoomsAvailable.status);
  //     if (showRoomsAvailable.status == 'Available') {
  //       this.isShowRoomAvailable = true;
  //       showRoomsAvailable.responseObject.forEach(room => {
  //         if (room.room_type == "Group") {
  //           this.showGroupRoomsAvailableArray.push(room);
  //           this.roomIdData = {
  //             roomId: room.room_id
  //           }
  //           this.socketservice.getRoomInfo(this.roomIdData).then((getRoomInfoResp: any) => {
  //             let roomdata = {
  //               room_name: room.room_name,
  //               room_id: room.room_id,
  //               room_creation_date: room.room_creation_date,
  //               participants: []
  //             }
  //             getRoomInfoResp.responseObject.forEach(roomParticipant => {
  //               roomdata.participants.push({
  //                 participant_name: roomParticipant.participant,
  //                 role: roomParticipant.role,
  //                 type: roomParticipant.participant_type
  //               });
  //             });
  //             this.allRoomInformationArray.push(roomdata);
  //             localStorage.setItem("all-rooms", JSON.stringify(this.allRoomInformationArray));
  //           });
  //         }
  //       });
  //     }
  //     else {
  //       this.isShowRoomAvailable = false;
  //     }
  //   });
  // }

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

  // async createOrJoinIndependentChat() {
  //   var setOfParticipants: any = [];
  //   if (this.userRole == "Freelancer") {
  //     setOfParticipants.push({ 'username': this.userSelected, 'role': 'Employer', 'type': 'Initiator' });
  //     setOfParticipants.push({ 'username': this.emailID, 'role': 'Freelancer', 'type': 'participant' });
  //     this.roomData = {
  //       roomName: this.userSelected + "&" + this.emailID,
  //       participants: setOfParticipants,
  //       roomType: "Individual"
  //     }
  //   } else if (this.userRole == "Employer") {
  //     setOfParticipants.push({ 'username': this.emailID, 'role': 'Employer', 'type': 'Initiator' });
  //     setOfParticipants.push({ 'username': this.userSelected, 'role': 'Freelancer', 'type': 'participant' });
  //     this.roomData = {
  //       roomName: this.emailID + "&" + this.userSelected,
  //       participants: setOfParticipants,
  //       roomType: "Individual"
  //     }
  //   }

  //   let showAllRoomInfoData = localStorage.getItem("all-rooms");
  //   console.log("Show all room info data:", showAllRoomInfoData);
    
  //   // var roomAvailableData = {
  //   //   roomName: this.roomData.roomName
  //   // }

  //   // console.log("One to One Room  Data : ", this.roomData);
  //   // await this.socketservice.isRoomAvailable(roomAvailableData).then((isRoomAvailableRes: any) => {
  //     // console.log("response of isRoomAvailable", isRoomAvailableRes);
  //     //  this.roomId = isRoomAvailableRes.responseObject[0].room_id;
  //     if (this.userRole == "Employer") {
  //       // if (isRoomAvailableRes.message == "True") {
          
  //       console.log("Create or Join Data:", setOfParticipants);
        
  //         let dataForJoiningRoom = {
  //             // roomId: isRoomAvailableRes.responseObject[0].room_id,
  //             // roomName: isRoomAvailableRes.responseObject[0].room_name,
  //             // userName: this.emailID
  //         }

  //         // console.log("Employer is room available object to join room :", dataForJoiningRoom);

  //         this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
  //           console.log("Response of join room :", JSON.stringify(joinRes));
  //           localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
  //         });
  //       // } 

  //       // else {
  //         // this.socketservice.createRoom(this.roomData).then((createRoomRespData: any) => {
  //         //   console.log("response of create room", createRoomRespData.responseObject);
  //         //   let dataForJoiningRoom = {
  //         //     roomId: createRoomRespData.responseObject[0].roomId,
  //         //     roomName: createRoomRespData.responseObject[0].roomName,
  //         //     userName: this.emailID
  //         //   }
  //         //   console.log("Is room available object to join room :", dataForJoiningRoom);

  //         //   this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
  //         //     console.log("Response of join room :", joinRes);
  //         //     localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));

  //         //   });
  //         // });
  //       // }
       

  //     }
  //     else if (this.userRole == "Freelancer") {
  //       // console.log("isRoomAvailableRes.responseObject : ", isRoomAvailableRes.responseObject);
  //       // if (isRoomAvailableRes.message == "True") {
  //         let dataForJoiningRoom = {
  //           // roomId: isRoomAvailableRes.responseObject[0].room_id,
  //           // roomName: isRoomAvailableRes.responseObject[0].room_name,
  //           // userName: this.emailID
  //         }
  //         this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
  //           console.log("response of join", joinRes);
  //           localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));

  //         });

  //       } 
  //       // else if (isRoomAvailableRes.message == "False") {

  //       // }
  //     // }
  //   // });
  // }



  async createOrJoinGroupRoomChat() {
    console.log("Callinng Group room chat");

    var setOfParticipants: any = [];
    if (this.userRole == "Freelancer") {
      setOfParticipants.push({ 'username': this.userSelected, 'role': 'Employer', 'type': 'Initiator' });
      this.selectedGroupUserForm.value.groupUserName.forEach(element => {
        setOfParticipants.push({ 'username': element, 'role': 'Freelancer', 'type': 'participant' });
      });
      this.roomData = {
        roomName: this.selectedGroupUserForm.value.groupName,
        participants: setOfParticipants,
        roomType: "Group"
      }
    } else if (this.userRole == "Employer") {
      setOfParticipants.push({ 'username': this.emailID, 'role': 'Employer', 'type': 'Initiator' });
      this.selectedGroupUserForm.value.groupUserName.forEach(element => {
        setOfParticipants.push({ 'username': element, 'role': 'Freelancer', 'type': 'participant' });
      });
      this.roomData = {
        roomName: this.selectedGroupUserForm.value.groupName,
        participants: setOfParticipants,
        roomType: "Group"
      }
    }

    let showAllRoomInfoData = localStorage.getItem("all-rooms");
    console.log("Show group room info data:", showAllRoomInfoData);

    console.log("Group Room Data : ", this.roomData);
    var roomAvailableData = {
      roomName: this.roomData.roomName
    }

    await this.socketservice.isRoomAvailable(roomAvailableData).then((isRoomAvailableRes: any) => {
      console.log("response of Group is room available", isRoomAvailableRes);

      if (this.userRole == "Employer") {
        if (isRoomAvailableRes.message == "True") {
          let dataForJoiningRoom = {
            roomId: isRoomAvailableRes.responseObject[0].room_id,
            roomName: isRoomAvailableRes.responseObject[0].room_name,
            userName: [{
              users: this.roomData.participant
            }]
          }
          console.log("Group: Joining Room user:", dataForJoiningRoom);

          this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
            console.log("response Group: form join room", JSON.stringify(joinRes));
            localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
          });
        }
        else if (isRoomAvailableRes.message == "False") {
          this.socketservice.createRoom(this.roomData).then((createRoomRespData: any) => {
            console.log("response Group: form create room", createRoomRespData);
            let dataForJoiningRoom = {
              roomId: createRoomRespData.responseObject[0].roomId,
              roomName: createRoomRespData.responseObject[0].roomName,
              userName: [{
                users: this.roomData.participant
              }]
            }
            console.log("Create room user:", dataForJoiningRoom);

            this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
              console.log("response Group: form join room in create room:", joinRes);
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
              users: this.roomData.participant
            }]
          }
          this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
            console.log("response Group: for join", joinRes);
            localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
          });
        }
        else if (isRoomAvailableRes.message == "False") {
          // this.socketservice.createRoom(this.roomData).then((createRes: any) => {
          //   console.log("response form create room", createRes);
          //   this.roomId = createRes.roomId;
          //   let dataForJoiningRoom = {
          //     roomId: createRes.roomId,
          //     roomName: this.selectedGroupUserForm.value.groupName,
          //     userName: [{
          //       users:this.roomData.participant
          // }]
          //   }
          //   console.log("Create room user:", dataForJoiningRoom);

          //   this.socketservice.joinRoom(dataForJoiningRoom).subscribe((joinRes: any) => {
          //     console.log("response form join room in create room:", joinRes);
          //     localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
          //   });

          // });
        }
      }
    });
  }
  
  /********************Sorting Names of Individual and Group chat rooms*********************/
  /**
   * @author Shefali Bhavekar
   * @date 20/12/2019
   * @name showChatAndGroupNames
   */
  showChatAndGroupName(){
    this.is_contact = false;
    this.is_groupRooms = false;
    this.is_favouriteContacts = false;
    this.is_chats = true
    this.allRoomsInformation = JSON.parse(localStorage.getItem("all-rooms"));
    this.allRoomsInformation.forEach((room)=>{
      if(room.room_type == "Group"){
        this.groupNamesArray.push(room);
      }
      room.participants.forEach(participant => {
        if(participant.participant_name != this.emailID){
          if(room.room_type == "Individual"){
            this.chatNamesArray.push(participant);
            this.allIndependentChatRooms.push(room);
          }
        }
      });
    }); 
    if(this.chatNamesArray.length != 0){
      this.isChatRoomAvailable = true;
    }
    if(this.groupNamesArray.length != 0){
      this.isGroupRoomAvailable = true;  
    }
  }

  /********************Join Or Create Independent Chat Rooms*********************/   
  /**
   * @author Shefali Bhavekar
   * @date 21/12/2019
   * @name createOrJoinIndependentChat
   */
  createOrJoinIndependentChat(){
    let roomId = "";
    let roomName = "";
    let dataForJoinRoom : any;
    let dataForCreateRoom : any;

    this.allIndependentChatRooms.forEach((independentRoom)=>{
      independentRoom.participants.forEach(participant => {
        if(participant.participant_name == this.userSelected){
          console.log("independentRoom",independentRoom);
          roomId = independentRoom.room_id,
          roomName = independentRoom.room_name
        }
      });
    });

    dataForJoinRoom = {
      roomId: roomId,
      roomName: roomName,
      userName: this.emailID
    }

   if(this.userRole == "Freelancer"){
    console.log("dataForJoinRoom for direct joining");
    this.socketservice.joinRoom(dataForJoinRoom).subscribe((joinRes: any) => {
      localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
    });
   }else if(this.userRole == "Employer"){
    if(roomId == "" && roomName == ""){
      this.setOfParticipants.push({ 'username': this.emailID, 'role': 'Employer', 'type': 'Initiator' });
      this.setOfParticipants.push({ 'username': this.userSelected, 'role': 'Freelancer', 'type': 'participant' });
    
      dataForCreateRoom = {
        roomName: this.emailID + "&" + this.userSelected,
        participants: this.setOfParticipants,
        roomType: "Individual"
      }
      console.log("dataForCreateRoom for create room" , dataForCreateRoom);
      this.socketservice.createRoom(dataForCreateRoom).then((createRoomRespData: any) => {
        let dataForJoinRoom = {
          roomId: createRoomRespData.responseObject[0].roomId,
          roomName: createRoomRespData.responseObject[0].roomName,
          userName: this.emailID
        }
        this.allRoomsInformation.push(createRoomRespData);
        localStorage.setItem("all-rooms", JSON.stringify(this.allRoomsInformation));
        console.log("dataForJoinRoom for joining room" , dataForJoinRoom);
        this.socketservice.joinRoom(dataForJoinRoom).subscribe((joinRes: any) => {
          localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
        });
      });
     }else{
      console.log("dataForJoinRoom for direct joining : ",dataForJoinRoom);
      this.socketservice.joinRoom(dataForJoinRoom).subscribe((joinRes: any) => {
        localStorage.setItem('joinRoomDetails', JSON.stringify(joinRes));
      });
     }
    }
  }
}
