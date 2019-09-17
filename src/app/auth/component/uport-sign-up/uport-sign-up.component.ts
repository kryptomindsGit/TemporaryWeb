import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router
  ) { }

  ngOnInit() {
    this.valData();
  }

  hello() {
    console.log("ind");

  }

  /**
   * @name valData
   * @description validate uport sign-up form data
   */
  valData() {
    this.uportSignupForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone_no: ['', Validators.required],
      role: ['', Validators.required],
      country: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]]
    });
  }

  /**
   * @name onSubmit
   * @description submit uport sipn-up info
   */
  onSubmit() {
    this.loading = true;
    console.log("Inside Submit btn");

    const signupUportPayload = {
      email: this.uportSignupForm.controls.email.value,
      phone_no: this.uportSignupForm.controls.phone_no.value,
      role: this.uportSignupForm.controls.role.value,
      country: this.uportSignupForm.controls.country.value,
      flag: 'Y'
    }

    console.log(signupUportPayload);



    this.__authService.getUportInfo(this.uportSignupForm.controls.email.value).then((resData: any) => {
      console.log("Res data :", resData == null);
      console.log("Res data :", resData.length);
      console.log("Res data :", resData.length > 0);
      console.log("Res data :", resData[0]);

      if (resData == null || resData[0] == undefined) {
        let email = "email";
        let flag = 'y';
        localStorage.setItem(email, this.uportSignupForm.controls.email.value);

        this.__authService.uportSignup(signupUportPayload).then((resData: any) => {
          this.loading = false;
          console.log("uportSignup ", resData);
          this.showMsg = resData.message;
          this.__router.navigate(['/auth/auth/uport-login']);
        });
      } else {
        this.loading = false;
        console.log("Your have signed up already with this email id please login...!!!");
        this.__router.navigate(['/auth/auth/uport-login']);
      }
    });

  }
}
