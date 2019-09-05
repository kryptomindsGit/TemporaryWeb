import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { Router } from '@angular/router';

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

  constructor(
    private __fb: FormBuilder,
    private __authService: AuthService,
    private __router: Router,
    // private __profileService : ProfileService
  ) { }

  ngOnInit() {
    this.valData();
  }

  /**
   * @name valData
   * @description validate login form data
   */
  valData(){
    this.loginForm = this.__fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * @name getIndeptProfileDetails
   * @description get Independent user profile info
   */
  getIndeptProfileDetails(){
    // this.__profileService.getIndeptProfileById(this.emailID).then((data: any) => {
    //   this.indepUserDetails = data[0];
    //   console.log(this.indepUserDetails);
    // });
  }

  /**
   * @name onSubmit
   * @description submit login info
   */
  onSubmit(){

    const loginPayload = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }
    console.log("login data", loginPayload);

    this.__authService.login(loginPayload).subscribe((resData: any) => {

      if(resData){
        if(this.__authService.isAuthenticated()){

          let no = "false"
          localStorage.setItem("uportuser", no );
          
          const user = this.__authService.decode();
          console.log("User is  : " , user);
          
          this.emailID = user["cognito:username"];
          this.getIndeptProfileDetails();
          const role = resData.payload["custom:role"];

          if (role == "Freelancer") {
            if(this.indepUserDetails == null){
              this.__router.navigate(['/feature/independent/profile/indp-profile/add']);
            }else{
              this.__router.navigate(['/feature/independent/profile/indp-profile/view', this.emailID]);
            }
          }else if (role == "Employer") {
            this.__router.navigate(['/feature/employer/profile/emp-profile/add']);
          }else if(role == "Partner") {
            this.__router.navigate(['/feature/partner/profile/part-profile/add']);
          }else{
            console.log("error in routing based User Role")
          } 
        }
      }

    })
    
  }
  

}
