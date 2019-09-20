import { Component, OnInit } from '@angular/core';
import { PartProfileService } from '../../shared/service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/service/auth.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  //Variable's
  public id: number;
  public email_id: any;
  public uid: any;

  //Array's
  public congnitoID: any = [];
  public partnerDetailsArr: any = [];
  public partnerFileArr: any = [];

  constructor(
    private __profileService: PartProfileService,
    private __activatedRoute: ActivatedRoute,
    private __authService: AuthService,
    private __router: Router
  ) {
    // this.email_id = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {
    let isUportUser = localStorage.getItem("uportUser");

    if (isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.email_id = user["email"];
      this.uid = user["uid"];
    } else {
      this.congnitoID = "TEST"
      this.uid = localStorage.getItem("uid");
      this.email_id = localStorage.getItem("email");
    }

    this.getPartnerDetails();
    this.getPartnerFile();
  }

  /**
   * @name getPartnerDetails
   * @description call get API for partner details 
   */
  getPartnerDetails() {
    this.__profileService.getPartnerByEmailId(this.email_id).then((resData: any) => {
      this.partnerDetailsArr = resData[0];
      console.log(this.partnerDetailsArr);
    });
  }

  /**
   * @name getPartnerFile
   * @description call get API for partner file details 
   */
  getPartnerFile() {
    this.__profileService.getPartnerFileById(this.email_id).then((data: any) => {
      this.partnerFileArr = data;
      console.log(this.partnerFileArr);

      // for (let i = 0; i < data.length; i++) {
      //   this.partnerFileArr[i] = data[i].file_name
      // }
      console.log(this.partnerFileArr);

    });
  }

  downloadFile(item) {
    console.log("Download")
    var filesave = item.substring(item.lastIndexOf("-") + 1);
    console.log("file save:", filesave);

    this.__profileService.getDocHashData(item).then((data) => {
      console.log("Blockchain get data done", data);

      var file = new Blob([data.body], { type: 'application/octet-stream' });
      var fileURL = URL.createObjectURL(file);
      saveAs(file, filesave);
      // window.open(fileURL);
      // window.open(fileURL, '_blank');
    })
  }

  /**
   * @name editProfile
   * @description redirect to edit profile page 
   */
  editProfile() {
    console.log("edit button call");

    this.__router.navigate(['/feature/feature/full-layout/partner/part/profile/profile/edit/', this.email_id]);
  }

  /**
   * @name onLogout
   * @description call Logout
   */
  onLogout() {
    this.__authService.logout();
    this.__router.navigate(['/auth/auth/login']);
  }
}
