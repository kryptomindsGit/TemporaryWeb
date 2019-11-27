import { Component, OnInit } from '@angular/core';
import { EmpProfileService } from '../../shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  //Variable's
  public viewprofileemployer: any;
  public loading = false;

  public id: number;
  public emailId: string;
  public uid: any;

  //Array's
  public congnitoID: any = [];
  public employerDetailsArr: any = [];
  public employerFileArr: any = [];

  constructor(
    private __profileService: EmpProfileService,
    private __authService: AuthService,
    private __router: Router,
  ) {
  }

  async ngOnInit() {
    let isUportUser = localStorage.getItem("uportUser");

    if (isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.emailId = user["email"];
      this.uid = user["uid"];
    } else {
      this.congnitoID = "TEST"
      this.uid = localStorage.getItem("uid");
      this.emailId = localStorage.getItem("email");
    }
    //call function's
    await this.getEmployerDetails();
  }
  /**
   * @name getEmployerDetails
   * @description call get API for employer details 
   */
  async getEmployerDetails() {
    await this.__profileService.getEmployerByEmailId().then((resData: any) => {      
      this.employerDetailsArr = resData.responseObject.employerEnterprise;
      this.employerFileArr = resData.responseObject.employerDocument;
     });
    console.log(" this.employerDetailsArr " ,  this.employerDetailsArr );
    console.log(" this.employerFileArr " ,  this.employerFileArr);
  }

  /**
   * @name getEmplyeeFileDetails
   * @description call get API for employer file details 
   */
  downloadFile(item) {
    this.loading = true;
    var filesave = item.substring(item.lastIndexOf("-") + 1);
    this.__profileService.getDocHashData(item).then((data) => {
      this.loading = false;
      var file = new Blob([data.body], { type: 'application/octet-stream' });
      saveAs(file, filesave);
    })
  }
  editProfile() {
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/edit']);
  }
}
