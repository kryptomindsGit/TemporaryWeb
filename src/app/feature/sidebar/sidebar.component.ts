import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { IndeptProfileService } from '../independent-prof/profile/shared/service/profile.service';
import { EmpProfileService } from '../employer/profile/shared/service/profile.service';
import { PartProfileService } from '../partner/profile/shared/service/profile.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public userRole: any;
  public email_id: any;
  public congnitoID: any;
  public isUportUser: any;
  public isEmployer: boolean = true;

  public indepUserDetails: any = [];
  public empUserDetails: any = [];
  public partUserDetails: any = [];

  public employerDetailsArr: any = [];
  public partnerDetailsArr: any = [];
  public freelancerDetailsArr: any = [];

  constructor(
    private __router: Router,
    private __authService: AuthService,
    private __idptProfileService: IndeptProfileService,
    private __empProfileService: EmpProfileService,
    private __partProfileService: PartProfileService
  ) { }

  ngOnInit() {

    this.isUportUser = localStorage.getItem("uportUser");

    if (this.isUportUser == "false") {

      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      console.log(this.congnitoID);

      this.email_id = user["email"];
      console.log(this.email_id);

      this.congnitoID = user["cognito:username"];
      this.userRole = user["custom:role"];
      console.log(this.userRole);
      // this.country = user["custom:country"];

    } else {

      this.email_id = localStorage.getItem("email");
      this.userRole = localStorage.getItem("role");
      // this.country = localStorage.getItem("country");
      console.log("Email Id is : " + this.email_id);

    }

    if (this.userRole != 'Employer') {
      this.isEmployer = false;
    }
  }

  userRoleInfo() {
    console.log("Indise userRoleInfo", this.userRole);
    if (this.userRole == "Freelancer") {
      console.log("Inside Freelancer");
      this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/add']);

      // this.__idptProfileService.getFreelancerByEmail(this.email_id).then((resData: any) => {
      //   this.freelancerDetailsArr = resData[0];
      //   console.log(this.freelancerDetailsArr);

      //   if (this.freelancerDetailsArr == null) {

      //   } else {
      //     this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view', this.email_id]);
      //   }
      // });
    }
    else if (this.userRole == "Employer") {
      console.log("Inside Employer");
      this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/add']);

      // this.__empProfileService.getEmployerByEmailId(this.email_id).then((resData: any) => {
      //   this.employerDetailsArr = resData[0];
      //   console.log(this.employerDetailsArr);

      //   if (this.__empProfileService == null) {
      //     this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/add']);
      //   } else {
      //     this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view', this.email_id]);
      //   }
      // });
    }
    else if (this.userRole == "Partner") {
      console.log("Inside Partner");
      this.__router.navigate(['/feature/feature/full-layout/partner/part/profile/profile/add']);

      // this.__partProfileService.getPartnerByEmailId(this.email_id).then((resData: any) => {
      //   this.partnerDetailsArr = resData[0];
      //   console.log(this.partnerDetailsArr);

      //   if (this.partnerDetailsArr == null) {
      //     this.__router.navigate(['/feature/feature/full-layout/partner/part/profile/profile/add']);
      //   } else {
      //     this.__router.navigate(['/feature/feature/full-layout/partner/part/profile/profile/view', this.email_id]);
      //   }
      // });
    }
  }

  // userEmployer() {
  //   this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/viewall', this.email_id]);
  // }

}
