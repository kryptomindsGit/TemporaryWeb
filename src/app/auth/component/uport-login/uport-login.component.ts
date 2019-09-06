import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

//URL's
import { AWS_URL } from '../../../constant/constant-url'
import { EmpProfileService } from 'src/app/feature/employer/profile/shared/service/profile.service';
import { PartProfileService } from 'src/app/feature/partner/profile/shared/service/profile.service';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';

@Component({
  selector: 'app-uport-login',
  templateUrl: './uport-login.component.html',
  styleUrls: ['./uport-login.component.scss']
})

export class UportLoginComponent implements OnInit {

  //Variables
  public qrData: string;
  public tagId :string;
  public URL :any;
  public eventName:any;
  public email: any;

  //Arrays
  public profileDetailsArr : any = [];
  public uPortDetailsArr: any = [];


  constructor(
    private __authService: AuthService,
    private __router: Router,
    private __indeptProfileService: IndeptProfileService,
    private __empProfileService: EmpProfileService,
    private __partProfileService: PartProfileService,
    // public ngxSmartModalService: NgxSmartModalService,
    private zone: NgZone
  ) {
    this.zone =  new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit() {
    this.getQrcode();
    
    let yes = "true"
    localStorage.setItem("uportuser", yes );
  }

  async getQrcode() {
    await this.__authService.uporService().then((data: any) => {
      console.log("data from response", data);
      this.qrData = data.image;
      this.tagId = data.tagID;     
      // this.URL = 'http://uport-ebs-webapp-dev.ap-south-1.elasticbeanstalk.com/events/' + this.tagId;
      this.URL = `${AWS_URL}/events/` + this.tagId;
      console.log("TEST 1", this.URL);
      this.watch().subscribe( data => {
        let a=JSON.parse(JSON.stringify(data));
        console.log("watch response", a.email);
        this.email=a.email;
        this.getuPortDetails(data);
      });
    })
  }

  watch(): Observable<object> {
    return Observable.create((observer) => {
      console.log("TEST", this.URL);
      const eventSource  = new EventSource(this.URL );
      this.eventName = 'event_' + this.tagId;
     
      eventSource.addEventListener(this.eventName, (event: any) => this.zone.run(() =>{
        console.log("EVENTNAME:",event);
        observer.next(JSON.parse(event.data));
        eventSource.close();
      }));  
      eventSource.onmessage = (event) => this.zone.run(() => {
          console.log("EVENT:",event);
          observer.next(JSON.parse(event.data));
        eventSource.close();
      });
      eventSource.onerror = error => this.zone.run(() => {
        console.log("TEST dsgkjdsbngkdsfb" );
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

getuPortDetails(jwtdata :any) {
  console.log("JWT token is :" , jwtdata);
  
  console.log("email from JWT " + this.email);
  
  this.__authService.getUportInfo(this.email).then((data: any) => {
          console.log("data from database : " , data);
          
          if(data.length == 0){
              console.log("User needs to sign up");
              this.__router.navigate(['/auth/auth/sign-up']);
          }else {            
              this.uPortDetailsArr = data[0];

              let role = this.uPortDetailsArr.role;
              let country = this.uPortDetailsArr.country;
              let phone = this.uPortDetailsArr.phone_num;

              localStorage.setItem("role", role);
              console.log("port detail " , this.uPortDetailsArr );

              localStorage.setItem("country", country);
              localStorage.setItem("email", this.email);
              localStorage.setItem("phone_no", phone);

              if (this.uPortDetailsArr.role == "Freelancer") {
                this.__indeptProfileService.getFreelancerByEmail(this.email).then((freelancerdata: any) => {
                  this.profileDetailsArr = freelancerdata[0];
                    console.log("Freelancer Data From Database : " , this.profileDetailsArr);
                    
                    if (this.profileDetailsArr == null || this.profileDetailsArr.length ==0) {
                      this.__router.navigate(['/feature/independent/profile/indp-profile/add']);
                    } else {
                         this.__router.navigate(['/feature/independent/profile/indp-profile/view', this.email]);
                      }
                  });
               } 

               else if (this.uPortDetailsArr.role == "Employer") {
                this.__empProfileService.getEmployerByEmailId(this.email).then((employerdata: any) => {
                  this.profileDetailsArr = employerdata[0];
                    if (this.profileDetailsArr == null || this.profileDetailsArr.length ==0) {
                      this.__router.navigate(['/feature/employer/profile/emp-profile/add']);
                    } else {
                         this.__router.navigate(['/feature/employer/profile/emp-profile/view', this.email]);
                      }
                  });
               } 

               else if (this.uPortDetailsArr.role == "Partner") {
                this.__partProfileService.getPartnerByEmailId(this.email).then((partnerdata: any) => {
                  this.profileDetailsArr = partnerdata[0];
                    if (this.profileDetailsArr == null || this.profileDetailsArr.length ==0) {
                      this.__router.navigate(['/feature/partner/profile/part-profile/add']);
                    } else {
                         this.__router.navigate(['/feature/partner/profile/part-profile/view', this.email]);
                      }
                  });
                  this.__router.navigate(['/feature/partner/profile/part-profile/add']);
               }else {
                  console.log("error in routing based User Role");
                }
            } 
      });       
  } 
}
