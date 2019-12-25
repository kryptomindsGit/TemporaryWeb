import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BnNgIdleService } from 'bn-ng-idle';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  //Form Group Object
  public loginForm: FormGroup;

  //Variables
  public loading = false;
  customLoadingTemplate: any;

  //Validation variable
  public submitted = false;

  public emailID: string;
  public uportUser: string = "false";

  //Arrays
  public indepUserDetails: any = [];
  public empUserDetails: any = [];
  public partUserDetails: any = [];
  public allRoomInformationArray : any = [];

  constructor(

    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
    private bnIdle: BnNgIdleService,
    
  ) { }

  ngOnInit() {
    this.valData();
  }

  /**
   * @name valData
   * @description validate login form data
   */
  valData() {
    this.loginForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    });
  }

  // convenience getter for easy access to form fields
  get formValidation() { return this.loginForm.controls; }

  /**
   * @name onSubmit
   * @description submit login info
   */
  onSubmit() {
    this.emailID = this.loginForm.controls.email.value;
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.loading = true;
      const cognitologinPayload = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      }
      const databaseloginPayload = {
        emailId: this.loginForm.controls.email.value
      }
      this.__authService.login(cognitologinPayload).subscribe((resData: any) => {
        if (resData.status == "SUCCESS") {
          this.__authService.getUserLoginData(databaseloginPayload).then((data: any) => {
            localStorage.setItem('uid', data.responseObject.User.userId);
            localStorage.setItem('uportUser', this.uportUser);
            localStorage.setItem('email', data.responseObject.User.emailId);
            localStorage.setItem('userAuthToken', data.authtoken);
            this.loading = false;
            if (data.responseObject.User.cognitoId == null && data.responseObject.User.isUportUser == 0) {
              const cognitoUpdatePayload = {
                cognitoId: resData.response.payload.sub,
                emailId: this.emailID
              }
              this.__authService.updateUserData(cognitoUpdatePayload).then((resData: any) => {
              });
            }
            if (data.responseObject.User.isLoggedIn == false) {
              const loggedInFlagPayload = {
                isLoggedIn: 1,
                emailId: this.loginForm.controls.email.value
              }
              this.__authService.updateUserData(loggedInFlagPayload).then(async (resData: any) => {
                console.log("2 resData", resData);

                this.getConnectWithServer();
                this.getAvailableChatRooms();
                var baseName = data.responseObject.User.emailId;
                baseName = baseName.substring(0, baseName.indexOf('@'));
                const emailName = baseName.charAt(0).toUpperCase() + baseName.substring(1);
                this.toastr.success(emailName, 'Welcome ');
                // this.sessionTimeOut();
              });
            }
          })
        } else if (resData.status == "ERROR") {
          this.loading = false;
          this.toastr.error(resData.response.message);
          this.__router.navigate(['/auth/auth/sign-up']);
        }
      })
    }
  }
  /**
   * @name getConnectWithServer
   * @description get connect with server event to listen continuously. 
   */
  getConnectWithServer() {
    // this.__eventSourceService.getServerSentEvent().subscribe((eventData) => {
    //   this.toastr.success('You can chat!!! ');
    // });
  }

  sessionTimeOut() {
    this.bnIdle.startWatching(1200).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        Swal.fire({
          title: 'Session is going to expired.',
          text: "Would you like to continue?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Continue!',
          cancelButtonText: 'Log out'
        }).then(async (result) => {
          if (!result.value) {
            await Swal.fire(
              'Bye,See You Soon!',
            )
            this.onLogout();
          } else if (result.value) {
            this.sessionTimeOut();
          }
        })
      }
    });
  }

  onLogout() {
    console.log("inside login");

    const databaseloginPayload = {
      emailId: this.emailID
    }

    this.__authService.getUserLoginData(databaseloginPayload).then((data: any) => {
      if (data.responseObject.User.isLoggedIn == true) {
        const loggedInFlagPayload = {
          isLoggedIn: 0,
          emailId: this.emailID
        }
        this.__authService.updateUserData(loggedInFlagPayload).then((resData: any) => {
          this.__authService.logout();
          this.__router.navigate(['/auth/auth/login']);
        });
      }
    });
  }

/******************************Fetching all available rooms-data from Cassandra**************************************/ 
/**
 * @author Shefali Bhavekar
 * @date 20/12/2019
 * @name getAvailableChatRooms
 */

  getAvailableChatRooms(){
    console.log("Inside getAvailableChatRooms");
    let sendData = {
        emailId : this.emailID
      }
    console.log("sendData", sendData);
    
    this.__authService.showRoomAvailable(sendData).then((roomData : any) =>{
      console.log("roomData" ,  roomData);
      if(roomData != 'undefined' ){
        if(roomData.status == "Not-available"){
          localStorage.setItem("all-rooms", "");
          this.__router.navigate(['/feature/feature/full-layout/dashboard'])        
        }else{
          roomData.responseObject.forEach((room)=> {
            let roomIdData ={
              roomId: room.room_id
            }
          this.__authService.getRoomInfo(roomIdData).then((getRoomInfoResp: any) => {
              let roomdata = {
                room_name : room.room_name,
                room_id: room.room_id,
                room_creation_date: room.room_creation_date,
                room_type : room.room_type,
                participants : []
              }
              getRoomInfoResp.responseObject.forEach( roomParticipant =>{
                roomdata.participants.push({ 
                                              participant_name : roomParticipant.participant,
                                              role : roomParticipant.role,
                                              type : roomParticipant.participant_type
                                            });
              });
              this.allRoomInformationArray.push(roomdata);
              localStorage.setItem("all-rooms", JSON.stringify(this.allRoomInformationArray));
              this.__router.navigate(['/feature/feature/full-layout/dashboard'])
            });
          });
        }
      }
    });
  }
}
