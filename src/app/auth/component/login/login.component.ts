import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { EmpProfileService } from 'src/app/feature/employer/profile/shared/service/profile.service';
import { PartProfileService } from 'src/app/feature/partner/profile/shared/service/profile.service';
import { ToastrService } from 'ngx-toastr';

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
  public emailID: string;
  public uportUser: string = "false";

  //Arrays
  public indepUserDetails: any = [];
  public empUserDetails: any = [];
  public partUserDetails: any = [];

  constructor(

    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,


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

  /**
   * @name onSubmit
   * @description submit login info
   */
  onSubmit() {
    this.loading = true;

    const loginPayload = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }
    console.log("login data", loginPayload);

    this.__authService.login(loginPayload).subscribe((resData: any) => {

      if (resData.status == "SUCCESS") {
        this.__authService.getUportInfo(loginPayload.email).then((data: any) => {
          this.loading = false;
          console.log("Res:", data[0]);
          console.log("Data:", data[0]);


          var baseName = data[0].email;
          baseName = baseName.substring(0, baseName.indexOf('@'));
          const emailName = baseName.charAt(0).toUpperCase() + baseName.substring(1);

          this.toastr.success(emailName, 'Welcome to Konnecteum');
          localStorage.setItem('uid', data[0].uid);
          localStorage.setItem('uportUser', this.uportUser);
          localStorage.setItem('email', data[0].email);
          this.__router.navigate(['/feature/feature/full-layout/dashboard'])
        })
      } else if (resData.status == "ERROR") {
        this.loading = false;
        this.toastr.error(resData.response.message);
        this.__router.navigate(['/auth/auth/login'])
      }

    })


  }


}
