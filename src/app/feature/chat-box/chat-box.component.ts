import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
declare var require: any
import decode from 'jwt-decode';
// import { ChatboxService } from './service/chatbox.service';
import { ChatWindowService } from './service/chat-window.service';
import { SPRING_URL } from 'src/app/constant/constant-url';
import { HttpHeaders } from '@angular/common/http';

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
  newResMessage: any = [];
  public eventName: any;
  public URL: any;
  public tagId: string;
  senderEmail: any;
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
    // private __chatboxService: ChatboxService,
    private __chatboxService: ChatWindowService,

    // private zone: NgZone
    // private __chatboxService: ChatWindowService
  ) {

    // this.zone = new NgZone({ enableLongStackTrace: false });
    // this.URL = `${SPRING_URL}/translation`;
    // console.log("URL :", this.URL);

    // this.watch().subscribe(resData => {
    //   console.log("Res of Event Listener:", resData);
    // });

    //   this.activeUser = [
    //     {
    //       'id': 1,
    //       'userName': 'Bhushan Mahajan',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/akhshay.png')
    //     },
    //     {
    //       'id': 1,
    //       'userName': 'Shefali Patil',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/shefali.jpg')
    //     },
    //     {
    //       'id': 1,
    //       'userName': 'Irshad Ahmed',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/bhushan.png')
    //     },
    //     {
    //       'id': 1,
    //       'userName': 'Jyoti Pawar',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/jothipawar.jpg')
    //     },
    //     {
    //       'id': 1,
    //       'userName': 'Khemraj D',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/akhshay.png')
    //     },
    //     {
    //       'id': 1,
    //       'userName': 'Swapna Shet',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/akhshay.png')
    //     }, {
    //       'id': 1,
    //       'userName': 'Jyoti Pawar',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/akhshay.png')
    //     },
    //     {
    //       'id': 1,
    //       'userName': 'Khemraj D',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/akhshay.png')
    //     },
    //     {
    //       'id': 1,
    //       'userName': 'Swapna Shet',
    //       'message': ' Hello! every one',
    //       'date': new Date(),
    //       "imageSrc": require('../../../assets/images/akhshay.png')
    //     }
    //   ]

    //   this.userMessage = {
    //     receiverMsg: [
    //       {
    //         'id': 1,
    //         'userName': 'Bhushan Mahajan',
    //         'message': 'Lorem ipsum dolor sit amet',
    //         'date': new Date(),
    //         'userType': 'receiver'
    //       },
    //       {
    //         'id': 2,
    //         'userName': 'Bhushan Mahajan',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'receiver'
    //       },
    //       {
    //         'id': 3,
    //         'userName': 'Bhushan Mahajan',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'receiver'
    //       },
    //       {
    //         'id': 4,
    //         'userName': 'Bhushan Mahajan',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'receiver'
    //       },
    //       {
    //         'id': 5,
    //         'userName': 'Bhushan Mahajan',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'receiver'
    //       },
    //       {
    //         'id': 6,
    //         'userName': 'Bhushan Mahajan',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'receiver'
    //       },
    //       // ],
    //       // senderMsg: [
    //       {
    //         'id': 1,
    //         'userName': 'Irshad ahmed',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'sender'
    //       },
    //       {
    //         'id': 2,
    //         'userName': 'Irshad ahmed',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'sender'
    //       },
    //       {
    //         'id': 3,
    //         'userName': 'Irshad ahmed',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'sender'
    //       },
    //       {
    //         'id': 4,
    //         'userName': 'Irshad ahmed',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'sender'
    //       },
    //       {
    //         'id': 5,
    //         'userName': 'Irshad ahmed',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'sender'
    //       },
    //       {
    //         'id': 6,
    //         'userName': 'Irshad ahmed',
    //         'message': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus amet quas accusamus quia',
    //         'date': new Date(),
    //         'userType': 'sender'
    //       }
    //     ]
    //     // }
    //   }
  }

  ngOnInit() {
    // this.__chatboxService = new ChatboxService(new ChatBoxComponent());
    // this.sendUserMessage();
    this.decodeJWT()
    this.getUserMessage();
  }

  getUserMessage(): void {
    this.__chatboxService.eventListenWatch().subscribe(
      (resData) => {
        console.log("Res of Event Listener:", resData);
      });
  }

  decodeJWT() {
    let token = localStorage.getItem('access_token')
    console.log("Res JWT token: ", token)
    this.jwtData = decode(token);
    console.log("Res JWT Data: ", this.jwtData.email);
    // this.doConnection();
  }

  // doConnection() {
  //   this.__chatboxService.connectChatApp();

  // }

  /**
   * @name sendUserMessage()
   * @param messages 
   * @description send message details to spring API
   */
  sendMessage(messages: string) {
    this.reqObject.push(messages);

    console.log("Send msg:", this.reqObject)
    let messageDetails = {
      sourceLanguageCode: "en",
      targetLanguageCode: "ur",
      text: messages,
      sender: this.jwtData.email
    };
    // let messageDetails = {
    //   SourceLanguageCode: "en",
    //   TargetLanguageCode: "ur",
    //   Text: sendMsg,
    //   content: sendMsg,
    //   sender: this.jwtData.email,
    //   emailID: this.jwtData.email,
    //   status: 'active',
    //   type: 'CHAT',
    //   currentDate: new Date()
    // };

    this.__chatboxService.senderUserMessage(messageDetails).then(
      (resData) => {
        this.respObject.push(resData);
        console.log("Res Object:", this.respObject);
        this.newResMessage = [
          { sender: [...this.reqObject], receiver: [...this.respObject] }
        ];
        console.log("this.newResMessage", ...this.newResMessage);


        // for (let i = 0; i < this.newResMessage.length; i++) {

        //   this.senderEmail = this.newResMessage[i].responseObject.sender;
        //   console.log("Email id:", this.senderEmail);
        //   if (this.senderEmail == this.jwtData.email) {
        //     console.log("email id same");
        //     this.resObject = this.respObject;
        //   } else {
        //     console.log("not matched");
        //     this.resObject = this.respObject;
        //     console.log("Res new data: ", this.resObject);

        //     // this.newResMessage.push({ senderMsg: this.reqObject[i], receiverMsg: this.respObject[i] });
        //   }
        // }




      },
      error => {
        console.error("Error saving user!");
        return Observable.throw(error);
      }
    );

    // this.__chatboxService.senderUserMessage(messageDetails).then(
    //   (resData) => {

    //     this.resObject = resData;
    //     console.log("Res Object:", this.resObject);

    //     // return true;
    //   },
    //   error => {
    //     console.error("Error saving user!");
    //     return Observable.throw(error);
    //   }
    // );
  }

}
