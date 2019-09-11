import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { EmpProfileService } from 'src/app/feature/employer/profile/shared/service/profile.service';
import { PartProfileService } from 'src/app/feature/partner/profile/shared/service/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //Form Group Object
  public loginForm: FormGroup;

  //Variables
  public emailID: string;

  //Arrays
  public indepUserDetails: any = [];
  public empUserDetails: any = [];
  public partUserDetails: any = [];

  constructor(
    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router,
    private __indepprofileService: IndeptProfileService,
    private __empprofileService: EmpProfileService,
    private __partprofileService: PartProfileService,

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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // /**
  //  * @name getIndeptProfileDetails
  //  * @description get Independent user profile info
  //  */
  // getIndeptProfileDetails() {
  //   this.__indepprofileService.getFreelancerByEmail(this.emailID).then((resData: any) => {
  //     this.indepUserDetails = resData[0];
  //     console.log(this.indepUserDetails);
  //   });
  // }

  // /**
  // * @name getEmpProfileDetails
  // * @description get Employer user profile info
  // */
  // getEmpProfileDetails() {
  //   this.__empprofileService.getEmployerByEmailId(this.emailID).then((resData: any) => {
  //     this.empUserDetails = resData[0];
  //     console.log(this.empUserDetails);
  //   });
  // }

  // /**
  // * @name getPartProfileDetails
  // * @description get partner user profile info
  // */
  // getPartProfileDetails() {
  //   this.__partprofileService.getPartnerByEmailId(this.emailID).then((resData: any) => {
  //     this.__partprofileService = resData[0];
  //     console.log(this.__partprofileService);
  //   });
  // }

  /**
   * @name onSubmit
   * @description submit login info
   */
  onSubmit() {

    const loginPayload = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }
    console.log("login data", loginPayload);

    this.__authService.login(loginPayload).subscribe((resData: any) => {

      console.log(resData);

      if (resData) {
        this.__authService.getUportInfo(loginPayload.email).then((data: any) => {
          console.log("Res:", data[0]);

          // localStorage.setItem('cognito_id', data[0].cognito:username)
          localStorage.setItem('uid', data[0].uid);
          localStorage.setItem('email', data[0].email);
          this.__router.navigate(['/feature/feature/full-layout/dashboard'])
        })
      }

    })


  }


}
