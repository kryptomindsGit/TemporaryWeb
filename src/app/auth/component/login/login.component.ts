import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChatWindowService } from 'src/app/feature/chat-box/service/chat-window.service';

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
  customLoadingTemplate: any;

  //Validation variable
  public submitted = false;

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
    private __eventSourceService: ChatWindowService) { }

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
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    });
  }

  // convenience getter for easy access to form fields
  get formValidation() { return this.loginForm.controls; }

  /**
   * @name onSubmit
   * @description submit login info
   */
  onSubmit() {
    this.submitted = true;
    console.log("Lgin data:", this.loginForm.value);
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      // console.log("Lgin data:", this.loginForm.value);
      this.loading = true;
      const cognitologinPayload = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      }
      const databaseloginPayload = {
        emailId: this.loginForm.controls.email.value
      }
      this.__authService.login(cognitologinPayload).subscribe((resData: any) => {
        if (resData.status == "SUCCESS") {
          this.__authService.getUserLoginData(databaseloginPayload).then((data: any) => {
            localStorage.setItem('uid', data.responseObject.User.userId);
            localStorage.setItem('uportUser', this.uportUser);
            localStorage.setItem('email', data.responseObject.User.emailId);
            localStorage.setItem('userAuthToken', data.authtoken);
            this.loading = false;
            if (data.responseObject.User.cognitoId == null) {
              const cognitoUpdatePayload = {
                cognitoId: resData.response.payload.sub
              }
              this.__authService.updateUserData(cognitoUpdatePayload).then((resData: any) => {
              });
            }
            console.log("User Data : ", data);
            console.log("**********logged in ************", data.responseObject.User.isLoggedIn);
            if (data.responseObject.User.isLoggedIn == false) {
              const loggedInFlagPayload = {
                isLoggedIn: 1
              }
              this.__authService.updateUserData(loggedInFlagPayload).then((resData: any) => {
                console.log("Logged in value : ", resData);
                this.getConnectWithServer();
                this.__router.navigate(['/feature/feature/full-layout/dashboard'])
                var baseName = data.responseObject.User.emailId;
                baseName = baseName.substring(0, baseName.indexOf('@'));
                const emailName = baseName.charAt(0).toUpperCase() + baseName.substring(1);
                this.toastr.success(emailName, 'Welcome ');
              });
            }
          })
        } else if (resData.status == "ERROR") {
          this.loading = false;
          this.toastr.error(resData.response.message);
          this.__router.navigate(['/auth/auth/login'])
        }
      })
    }
  }
  /**
   * @name getConnectWithServer
   * @description get connect with server event to listen continuously. 
   */
  getConnectWithServer() {
    this.__eventSourceService.getServerSentEvent().subscribe((eventData) => {
      this.toastr.success('You can chat!!! ');
    });
  }
}
