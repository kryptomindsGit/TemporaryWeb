import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  //Form Group object
  public signupForm: FormGroup;

  //Variables
  public showMsg: string;
  public showMsgCognito: any = [];

  constructor(
    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.valData();
  }

  /**
   * @name valData
   * @description validate sign-up form data
   */
  valData() {
    this.signupForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone_no: ['', Validators.required],
      custom_role: ['', Validators.required],
      custom_country: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]]
    });
  }

  /**
   * @name onSubmit
   * @description submit sipn-up info
   */
  onSubmit() {

    const signupPayload = {
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value,
      phone_no: this.signupForm.controls.phone_no.value,
      custom_role: this.signupForm.controls.custom_role.value,
      custom_country: this.signupForm.controls.custom_country.value
    }

    console.log("Sing up Data:", signupPayload);

    this.__authService.register(signupPayload).then((resData: any) => {
      this.showMsgCognito = resData;

      const cognitoPayload = {
        flag: "N",
        email: signupPayload.email,
        phone_no: signupPayload.phone_no,
        role: signupPayload.custom_role,
        country: signupPayload.custom_country
      }

      this.__authService.uportSignup(cognitoPayload).then((resData: any) => {
        this.showMsg = resData;
        this.toastr.success(this.showMsgCognito.message);
        setTimeout(() => {
          this.__router.navigate(['/auth/auth/login']);
        }, 5000);

      });

      // if (this.toastr.success) {
      //   this.toastr.success(this.showMsgCognito.message);

      // } else if (this.toastr.error) {
      //   this.toastr.error(this.showMsgCognito.message);
      // } else {
      //   this.toastr.warning(this.showMsgCognito.message);
      // }

      console.log("Message: ", this.showMsgCognito.message);
    });



  }

}
