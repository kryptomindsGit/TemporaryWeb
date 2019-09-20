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
    private __activatedRoute: ActivatedRoute,
  ) {
    // this.emailId = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {
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
    this.__profileService.getEmployerFileById(this.emailId).then((data: any) => {
      this.employerFileArr = data;
      console.log(this.employerFileArr);

    });
  }

  downloadFile(item) {
    console.log("Download")
    var filesave = item.substring(item.lastIndexOf("-") + 1);
    console.log("file save:", filesave);

    this.__profileService.getDocHashData(item).then((data) => {
      console.log("Blockchain get data done", data);

      var file = new Blob([data.body], { type: 'application/octet-stream' });
      saveAs(file, filesave);
      // var fileURL = URL.createObjectURL(file);
      // window.open(fileURL);
      // window.open(fileURL, '_blank');
    })
  }

  editProfile() {
    console.log("Edit calling");

    this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/edit/', this.emailId]);
  }


}
