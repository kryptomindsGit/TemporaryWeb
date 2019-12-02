import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//Import service's
import { EmpProfileService } from 'src/app/feature/employer/profile/shared/service/profile.service';
import { PartProfileService } from 'src/app/feature/partner/profile/shared/service/profile.service';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatWindowService } from 'src/app/feature/chat-box/service/chat-window.service';
import { BnNgIdleService } from 'bn-ng-idle';
import Swal from 'sweetalert2';

//Constant URL's
import { AWS_URL } from '../../../constant/constant-url';
import { UPORT_URL } from '../../../constant/constant-url';


@Component({
  selector: 'app-uport-login',
  templateUrl: './uport-login.component.html',
  styleUrls: ['./uport-login.component.scss']
})

export class UportLoginComponent implements OnInit {

  //Variables
  public loading = false;
  public qrData: string;
  public tagId: string;
  public URL: any;
  public eventName: any;
  public email: any;

  //Arrays
  public profileDetailsArr: any = [];
  public uPortDetailsArr: any = [];

  public employerDetailsArr: any = [];
  public partnerDetailsArr: any = [];
  public freelancerDetailsArr: any = [];



  constructor(
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
    private __eventSourceService: ChatWindowService,
    private zone: NgZone,
    private bnIdle: BnNgIdleService,

  ) {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit() {
    this.getQrcode();

    let yes = "true"
    localStorage.setItem("uportuser", yes);
  }

  async getQrcode() {
    await this.__authService.uporService().then((data: any) => {
      this.qrData = data.image;
      this.tagId = data.tagID;
      // this.URL = 'http://uport-ebs-webapp-dev.ap-south-1.elasticbeanstalk.com/events/' + this.tagId;
      this.URL = `${UPORT_URL}/events/` + this.tagId;
      this.watch().subscribe(data => {
        let a = JSON.parse(JSON.stringify(data));
        this.email = a.email;
        this.getuPortDetails(data);
      });
    })
  }


  watch(): Observable<object> {
    return Observable.create((observer) => {
      const eventSource = new EventSource(this.URL);
      this.eventName = 'event_' + this.tagId;
      eventSource.addEventListener(this.eventName, (event: any) => this.zone.run(() => {
        observer.next(JSON.parse(event.data));
        eventSource.close();
      }));
      eventSource.onmessage = (event) => this.zone.run(() => {
        observer.next(JSON.parse(event.data));
        eventSource.close();
      });
      eventSource.onerror = error => this.zone.run(() => {
        if (eventSource.readyState === eventSource.CLOSED) {
          eventSource.close();
          observer.complete();
        } else {
          observer.error(error);
        }
      });
      return () => eventSource.close();
    });
  }

  getuPortDetails(jwtdata: any) {    
    this.loading = true;
    const userDataPaylaod = {
      emailId : this.email
    }

    this.__authService.getUserLoginData(userDataPaylaod).then((data: any) => {
      if ( data.responseObject == null) {
        this.loading = false;
        this.__router.navigate(['/auth/auth/uport-signup']);
      } else {
        this.loading = false;
        this.uPortDetailsArr =  data.responseObject.User;

        if (data.responseObject.User.isLoggedIn == false) {
          const loggedInFlagPayload = {
            isLoggedIn : 1,
            emailId: this.email
          }
          this.__authService.updateUserData(loggedInFlagPayload).then((resData: any) => {
            this.getConnectWithServer();
            this.__router.navigate(['/feature/feature/full-layout/dashboard'])
            var baseName = data.responseObject.User.emailId;
            baseName = baseName.substring(0, baseName.indexOf('@'));
            const emailName = baseName.charAt(0).toUpperCase() + baseName.substring(1);
            this.toastr.success(emailName, 'Welcome ');
            this.sessionTimeOut();
            let role= "";
        if(this.uPortDetailsArr.role == 1){
          role = "Freelancer";
          localStorage.setItem("role", role);
        }else if(this.uPortDetailsArr.role == 2){
          role = "Employer";
          localStorage.setItem("role", role);
        }else if(this.uPortDetailsArr.role == 3){
          role = "Partner";
          localStorage.setItem("role", role);
        }
        let phone = this.uPortDetailsArr.contactNo;
        localStorage.setItem("phone_no", phone);
        localStorage.setItem('uid', this.uPortDetailsArr.userId);
        localStorage.setItem('email', this.uPortDetailsArr.emailId);
        localStorage.setItem('userAuthToken', data.authtoken);
        this.__router.navigate(['/feature/feature/full-layout/dashboard'])
        });
       }
      }
    });
  }

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
          cancelButtonText : 'Log out'
        }).then(async (result) => {
          if (!result.value) {
            await Swal.fire(
              'Bye,See You Soon!',
            )
            this.onLogout();     
          }else if(result.value){
              this.sessionTimeOut();
          }
        })
      }
    });
  }

  onLogout() {
    const databaseloginPayload = {
      emailId: this.email
    }
    this.__authService.getUserLoginData(databaseloginPayload).then((data: any) => {
      if (data.responseObject.User.isLoggedIn == true) {
        const loggedInFlagPayload = {
          isLoggedIn: 0,
          emailId:this.email
        }
        this.__authService.updateUserData(loggedInFlagPayload).then((resData: any) => {
          this.__authService.logout();
          this.__router.navigate(['/auth/auth/login']);
        });
      }
    });
  }
}
