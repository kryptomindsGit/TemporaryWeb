import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

//Import service's
import { EmpProfileService } from 'src/app/feature/employer/profile/shared/service/profile.service';
import { PartProfileService } from 'src/app/feature/partner/profile/shared/service/profile.service';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';

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


  constructor(
    private __authService: AuthService,
    private __router: Router,
    private __indeptProfileService: IndeptProfileService,
    private __empProfileService: EmpProfileService,
    private __partProfileService: PartProfileService,
    private toastr: ToastrService,

    // public ngxSmartModalService: NgxSmartModalService,
    private zone: NgZone
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
      console.log("data from response", data);
      this.qrData = data.image;
      this.tagId = data.tagID;
      // this.URL = 'http://uport-ebs-webapp-dev.ap-south-1.elasticbeanstalk.com/events/' + this.tagId;
      this.URL = `${UPORT_URL}/events/` + this.tagId;
      this.watch().subscribe(data => {
        let a = JSON.parse(JSON.stringify(data));
        console.log("watch response", a.email);
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
        console.log("EVENTNAME:", event);
        observer.next(JSON.parse(event.data));
        eventSource.close();
      }));
      eventSource.onmessage = (event) => this.zone.run(() => {
        console.log("EVENT:", event);
        observer.next(JSON.parse(event.data));
        eventSource.close();
      });
      eventSource.onerror = error => this.zone.run(() => {
        console.log("TEST dsgkjdsbngkdsfb");
        if (eventSource.readyState === eventSource.CLOSED) {
          console.log('The stream has been closed by the server.');
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
    console.log("JWT token is :", jwtdata);

    console.log("email from JWT " + this.email);

    this.__authService.getUportInfo(this.email).then((data: any) => {
      console.log("data from database : ", data);

      if (data.length == 0) {
        this.loading = false;
        console.log("User needs to sign up");
        this.__router.navigate(['/auth/auth/sign-up']);
      } else {
        this.loading = false;
        this.uPortDetailsArr = data[0];

        let role = this.uPortDetailsArr.role;
        let country = this.uPortDetailsArr.country;
        let phone = this.uPortDetailsArr.phone_num;

        localStorage.setItem("role", role);
        console.log("port detail ", this.uPortDetailsArr);

        localStorage.setItem("country", country);
        localStorage.setItem("email", this.email);
        localStorage.setItem("phone_no", phone);
        localStorage.setItem('uid', this.uPortDetailsArr.uid);
        localStorage.setItem('email', this.uPortDetailsArr.email);

        var baseName = this.email;
        baseName = baseName.substring(0, baseName.indexOf('@'));
        const emailName = baseName.charAt(0).toUpperCase() + baseName.substring(1);

        this.toastr.success(emailName, 'Welcome to Konnecteum');

        this.__router.navigate(['/feature/feature/full-layout/dashboard'])

        if (this.uPortDetailsArr.role == "Freelancer") {
          console.log("Freelancer In");

          this.__indeptProfileService.getFreelancerByEmail(this.email).then((freelancerdata: any) => {
            this.profileDetailsArr = freelancerdata[0];
            console.log("Freelancer Data From Database : ", this.profileDetailsArr);

            if (this.profileDetailsArr == null || this.profileDetailsArr.length == 0) {
              this.__router.navigate(['/feature/feature/full-layout/independent/profile/indp-profile/add']);
            } else {
              this.__router.navigate(['/feature/feature/full-layout/independent/profile/indp-profile/view', this.email]);
            }
          });
        }

        else if (this.uPortDetailsArr.role == "Employer") {
          console.log("Employer In");
          this.__empProfileService.getEmployerByEmailId(this.email).then((employerdata: any) => {
            this.profileDetailsArr = employerdata[0];
            if (this.profileDetailsArr == null || this.profileDetailsArr.length == 0) {
              this.__router.navigate(['/feature/feature/full-layout/employer/profile/emp-profile/add']);
            } else {
              this.__router.navigate(['/feature/feature/full-layout/employer/profile/emp-profile/view', this.email]);
            }
          });
        }

        else if (this.uPortDetailsArr.role == "Partner") {
          console.log("Partner In");

          this.__partProfileService.getPartnerByEmailId(this.email).then((partnerdata: any) => {
            this.profileDetailsArr = partnerdata[0];
            if (this.profileDetailsArr == null || this.profileDetailsArr.length == 0) {
              this.__router.navigate(['/feature/feature/full-layout/partner/profile/part-profile/add']);
            } else {
              this.__router.navigate(['/feature/feature/full-layout/partner/profile/part-profile/view', this.email]);
            }
          });
          // this.__router.navigate(['/feature/feature/full-layout/partner/profile/part-profile/add']);
        } else {
          console.log("error in routing based User Role");
        }
      }
    });
  }
}
