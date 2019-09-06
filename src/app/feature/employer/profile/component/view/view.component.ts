import { Component, OnInit } from '@angular/core';
import { EmpProfileService } from '../../shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  //Variable's
  public id: number;
  public emailId: string;

  //Array's
  public congnitoID: any = [];
  public employerDetailsArr: any = [];
  public employerFileArr: any = [];

  constructor(
    private __profileService: EmpProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
  ) {
    this.id = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {
    const userInfo = this.__authService.decode();
    this.congnitoID = userInfo["cognito:username"];

    //call function's
    this.getEmployerDetails();
    this.getEmplyeeFileDetails();
  }

  /**
   * @name getEmployerDetails
   * @description call get API for employer details 
   */
  getEmployerDetails() {
    this.__profileService.getEmployerByEmailId(this.emailId).then((resData: any) => {
      this.employerDetailsArr = resData[0];
      console.log(this.employerDetailsArr);

    });
  }

  /**
   * @name getEmplyeeFileDetails
   * @description call get API for employer file details 
   */
  getEmplyeeFileDetails() {
    this.__profileService.getEmployerFileById(this.id).then((data: any) => {
      this.employerFileArr = data;
      for (let i = 0; i < data.length; i++) {
        this.employerFileArr[i] = data[i].file_name;
      }
      console.log(this.employerFileArr);

    });
  }

}
