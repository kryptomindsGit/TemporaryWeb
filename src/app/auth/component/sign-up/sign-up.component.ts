import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { GlobalValidationDirective } from '../../../shared/global-validation.directive'
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  //Form Group object
  public signupForm: FormGroup;

  //Variables
  public loading = false;
  public showMsg: string;
  public submitted = false;
  phoneNo : String ;
  //Array's
  public showMsgCognito: any = [];
  public countryArr: any = [];

  constructor(
    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
    private __profileService: IndeptProfileService,
    private __customGlobalService: CustomGlobalService

  ) { }

  ngOnInit() {
    this.validateData();
    this.getCountryList();
  }

  /**
   * @name validateData
   * @description validate sign-up form data
   */
  validateData() {
    this.signupForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,20}')]],
      phone_no: ['', Validators.compose([Validators.required, Validators.pattern('/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g'), GlobalValidationDirective.phoneNumberValidator])],
      custom_role: ['', Validators.required],
      custom_country: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]]
    });
  }

  /**
  * @method getCountry
  * @description get all country values.
  */
  getCountryList() {
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.countryArr = resData.responseObject;
    })
  }

  // convenience getter for easy access to form fields
  get formValidation() { return this.signupForm.controls; }

  /**
   * @name onSubmit
   * @description submit sipn-up info
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    // if (this.signupForm.invalid) {
    //   return;
    // } else {
      // this.loading = true;

      let role :any = this.signupForm.controls.custom_role.value;
      if(role == 1){
        role = "Freelancer"
      }else if(role == 2){
        role = "Employer"

      }else{
        role = "Partner"

      }
      const signupPayload = {
        email: this.signupForm.controls.email.value,
        password: this.signupForm.controls.password.value,
        phone_no: this.signupForm.controls.phone_no.value,
        custom_role: role,
        custom_country: this.countryArr[this.signupForm.controls.custom_country.value].countryName
      }

      this.phoneNo = this.signupForm.controls.phone_no.value;
      const cognitoPayload = {
        isUportUser: 0,
        emailId: signupPayload.email,
        contactNo:this.phoneNo.substring(3, 13),
        role: this.signupForm.controls.custom_role.value,
        country: this.signupForm.controls.custom_country.value
      }
      this.__authService.register(signupPayload).then((resData: any) => {
        if (resData.status == "SUCCESS") {
          setTimeout(() => {
            this.loading = false;
            this.toastr.success(resData.message);
            this.__router.navigate(['/auth/auth/login']);
          }, 5000);
          
          this.__authService.saveSignUpData(cognitoPayload).then((resData: any) => {
            this.showMsg = resData;           
          });

        } else if (resData.status == "ERROR") {
          this.loading = false;
          this.toastr.error(resData.response.message);
          this.__router.navigate(['/auth/auth/sign-up']);
        } else {
          this.toastr.warning(resData.response.message);
        }
      });
  }

}
