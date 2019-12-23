import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndeptProfileService } from '../independent-prof/profile/shared/service/profile.service';
import { EmpProfileService } from '../employer/profile/shared/service/profile.service';
import { PartProfileService } from '../partner/profile/shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { CustomGlobalService } from '../shared/service/custom-global.service';
import { DownloadFileService } from '../chat-box/service/download-file.service';
import { empty } from 'rxjs';
import { ChatWindowService } from '../chat-box/service/chat-window.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  emailName: any;
  public userRole: any;
  public email_id: any;
  public congnitoID: any;
  public isUportUser: any;
  public profile_img: string;

  public indepUserDetails: any = [];
  public empUserDetails: any = [];
  public partUserDetails: any = [];

  public employerDetailsArr: any = [];
  public partnerDetailsArr: any = [];
  public freelancerDetailsArr: any = [];
  public chatMessage: any = [];
  public sendObjectsFromStorage: any = [];
  public allChatRooms:any = [];
  public allSentMessages:any = [];
  public allRecievedMessages:any = [];
  public sentMsgCount = 0;
  public receivedMsgcount = 0;
  public unReadMsgCount = 0;


  constructor(
    private __router: Router,
    private __authService: AuthService,
    private __idptProfileService: IndeptProfileService,
    private __empProfileService: EmpProfileService,
    private __partProfileService: PartProfileService,
    private __globalService: CustomGlobalService,
    private __downloadFileService: DownloadFileService,
    private __chatService: ChatWindowService,
  ) { }

  ngOnInit() {

    this.isUportUser = localStorage.getItem("uportUser");

    if (this.isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.email_id = user["email"];
      this.userRole = user["custom:role"];
      var baseName = this.email_id;
      baseName = baseName.substring(0, baseName.indexOf('@'));
      this.emailName = baseName.charAt(0).toUpperCase() + baseName.substring(1);
    } else {
      this.email_id = localStorage.getItem("email");
      this.userRole = localStorage.getItem("role");
      var baseName = this.email_id;
    baseName = baseName.substring(0, baseName.indexOf('@'));
    this.emailName = baseName.charAt(0).toUpperCase() + baseName.substring(1);
    }

    this.getHeaderInage();
    setTimeout(() => {
      this.getAllMessages();
    }, 2000);
    setTimeout(() => {
      this.getCount();
    }, 4000);
  }

  getHeaderInage() {
    if (this.userRole == "Freelancer") {
      this.__idptProfileService.getFreelancerByEmail().then((resData: any) => {
        this.profile_img = atob(resData.responseObject.freelancerProfile.photo);
      });
    } else if (this.userRole == "Employer") {
      this.__empProfileService.getEmployerByEmailId().then((resData: any) => {
        if (resData != undefined) {
          this.profile_img = atob(resData.responseObject.employerEnterprise.companyLogo);
        }
      });
      
    } else {
      this.profile_img = '../../../assets/images/bule_img.png';
      
    }
  }
  userRoleInfo() {
    if (this.userRole == "Freelancer") {
      this.__idptProfileService.getFreelancerByEmail().then((resData: any) => {
        this.freelancerDetailsArr = resData.responseObject.freelancerProfile;
        if (this.freelancerDetailsArr == null) {
          this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/add']);
        } else {
          this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view']);
        }
      });
    }
    else if (this.userRole == "Employer") {
      this.__empProfileService.getEmployerByEmailId().then((resData: any) => {
        console.log("emp data\n" ,resData);
  
        this.employerDetailsArr = resData.responseObject.employerEnterprise;
        if (this.employerDetailsArr == null ) {
          this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/add']);
        } else {
          this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view']);
        }
      });
    }
    else if (this.userRole == "Partner") {
      this.__partProfileService.getPartnerByEmailId(this.email_id).then((resData: any) => {
        this.partnerDetailsArr = resData[0];
        if (this.partnerDetailsArr == null) {
          this.__router.navigate(['/feature/feature/full-layout/partner/part/profile/profile/add']);
        } else {
          this.__router.navigate(['/feature/feature/full-layout/partner/part/profile/profile/view']);
        }
      });
    }
  }


  /**
    *@name onLogout 
    * @description call Logout
    */
  onLogout() {
    console.log("log out");
    const databaseloginPayload = {
      emailId: this.email_id
    }
    this.__authService.getUserLoginData(databaseloginPayload).then((data: any) => {
      console.log("data",data);
      
      if (data.responseObject.User.isLoggedIn == true) {
        const loggedInFlagPayload = {
          isLoggedIn: 0,
          emailId: this.email_id
        }
        this.saveChatMessage();
        this.__authService.updateUserData(loggedInFlagPayload).then((resData: any) => {
          this.__authService.logout();
          this.__router.navigate(['/auth/auth/login']);
        });
      }
    });

  }

  // save the chat message's in DB
  saveChatMessage() {
    var sendfromStorage = localStorage.getItem("chatObj");
    if(sendfromStorage != null){
      console.log("sendfromStorage " , sendfromStorage );
     this.sendObjectsFromStorage = JSON.parse(sendfromStorage);
      this.chatMessage = [...this.sendObjectsFromStorage];
      console.log("chat message object:", this.chatMessage);
      this.downloadFile();
    }
  }

  downloadFile() {
    this.__downloadFileService.exportToCsv('test.csv', this.chatMessage);
  }

  /******************************Fetching all available rooms-data from Cassandra**************************************/ 
  /**
   * @author Shefali Bhavekar
   * @date 20/12/2019
   * @name getAllMessages
  */
  
  async getAllMessages(){
    this.allChatRooms = JSON.parse(localStorage.getItem("all-rooms"));
    console.log("this.allChatRooms from header : " , this.allChatRooms);
    
    this.allChatRooms.forEach(async room => {
      let getMsgRequest = {
        roomId : room.room_id
      }
      await this.__chatService.getSentMessages(getMsgRequest).then((msgs : any)=>{
        this.allSentMessages.push(msgs);
      });
      await this.__chatService.getRecievedMessages(getMsgRequest).then((msgs : any)=>{
        this.allRecievedMessages.push(msgs);
      });
    });
  }

  async getCount(){
    console.log("**************Countring***************");

    this.allSentMessages.forEach(sentMsg => {
      this.sentMsgCount += sentMsg.responseObject.length;
    });
    this.allRecievedMessages.forEach(sentMsg => {
      this.receivedMsgcount += sentMsg.responseObject.length;
    });
    this.unReadMsgCount = this.sentMsgCount - this.receivedMsgcount ;
    console.log("this.unReadMsgCount" , this.unReadMsgCount);
  }
}