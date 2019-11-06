import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';

@Component({
  selector: 'app-uport-sign-up',
  templateUrl: './uport-sign-up.component.html',
  styleUrls: ['./uport-sign-up.component.scss']
})
export class UportSignUpComponent implements OnInit {

  //Form Group object
  public uportSignupForm: FormGroup;

  //Variables
  public loading = false;
  public showMsg: string;
  public submitted = false;

  //Array's
  public countryArr: any;

  constructor(
    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router,
    private __profileService: IndeptProfileService,
    private __customGlobalService: CustomGlobalService

  ) { }

  ngOnInit() {
    this.validateData();
    this.getCountryList();
  }
  /**
   * @name validateData
   * @description validate uport sign-up form data
   */
  validateData() {
    this.uportSignupForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone_no: ['', [Validators.required, Validators.pattern('^[0-9\-\']+')]],
      role: ['', Validators.required],
      country: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]]
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
  get formValidation() { return this.uportSignupForm.controls; }

  /**
   * @name onSubmit
   * @description submit uport sipn-up info
   */
  onSubmit() {
    this.submitted = true;
    if (this.uportSignupForm.invalid) {
      return;
    } else {

      this.loading = true;
      const signupUportPayload = {
        email: this.uportSignupForm.controls.email.value,
        phone_no: this.uportSignupForm.controls.phone_no.value,
        role: this.uportSignupForm.controls.role.value,
        country: this.uportSignupForm.controls.country.value,
        flag: 'Y'
      }
      const userDataPayload = {
        emialId : this.uportSignupForm.controls.email.value
      }


      this.__authService.getUserLoginData(userDataPayload).then((resData: any) => {
        if (resData == null || resData[0] == undefined) {
          let email = "email";
          let flag = 'y';
          localStorage.setItem(email, this.uportSignupForm.controls.email.value);

          this.__authService.saveSignUpData(signupUportPayload).then((resData: any) => {
            this.loading = false;
            this.showMsg = resData.message;
            this.__router.navigate(['/auth/auth/uport-login']);
          });
        } else {
          this.loading = false;
          this.__router.navigate(['/auth/auth/uport-login']);
        }
      });
    }
  }
}
