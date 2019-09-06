import { Component, OnInit } from '@angular/core';
import { PartProfileService } from '../../shared/service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/service/auth.service';

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
  public partnerDetailsArr: any = [];
  public partnerFileArr: any = [];

  constructor(
    private __profileService: PartProfileService,
    private __activatedRoute: ActivatedRoute,
    private __authService: AuthService,
    private __router: Router
  ) {
    this.id = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {
    const userInfo = this.__authService.decode();
    this.congnitoID = userInfo["cognito:username"];
    console.log(this.congnitoID)

    this.getPartnerDetails();
    this.getPartnerFile();
  }

  /**
   * @name getPartnerDetails
   * @description call get API for partner details 
   */
  getPartnerDetails() {
    this.__profileService.getPartnerByEmailId(this.emailId).then((resData: any) => {
      this.partnerDetailsArr = resData[0];
      console.log(this.partnerDetailsArr);
    });
  }

  /**
   * @name getPartnerFile
   * @description call get API for partner file details 
   */
  getPartnerFile() {
    this.__profileService.getPartnerFileById(this.id).then((data: any) => {
      this.partnerFileArr = data;
      console.log(this.partnerFileArr);

      for (let i = 0; i < data.length; i++) {
        this.partnerFileArr[i] = data[i].file_name
      }
      console.log(this.partnerFileArr);

    });
  }

  /**
   * @name editProfile
   * @description redirect to edit profile page 
   */
  editProfile() {
    this.__router.navigate(['partner/part-profile/profile/edit/', this.congnitoID]);
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
