import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IndeptProfileService } from '../../shared/service/profile.service';
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
  public loading = false;
  public viewprofilefreelancer: any;

  public __id: any;
  public email_addr: any;
  public phone_number: any;
  public uid: any;

  //Array's
  public congnitoID: any = [];
  public freeDetailsArr: any = [];
  public freeSkillDetailsArr: any = [];
  public qualityArray: any = [];
  public strengthArr: any = [];
  public weaknessArr: any = [];
  public freeDocsArr: any = [];
  public freeEduArr: any = [];
  public freelancerOrgArr: any = [];
  public freelancerPortArr: any = [];
  cityName: any;
  stateName: any;
  countryName: any;

  constructor(
    private __fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
  ) {
    // this.email_addr = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {

    let isUportUser = localStorage.getItem("uportUser");

    if (isUportUser == "false") {

      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.email_addr = user["email"];
      this.uid = localStorage.getItem("uid");
      console.log("UID:", this.uid);


    } else {
      this.congnitoID = "TEST";
      this.uid = localStorage.getItem("uid");
      console.log("UID:", this.uid);

      this.email_addr = localStorage.getItem("email");
    }

    this.getFreelancerDetails();

  }


  getFreelancerDetails() {
    this.__profileService.getFreelancerByEmail().then((resData: any) => {    
      console.log(resData.responseObject);     
      this.freeDetailsArr = resData.responseObject.freelancerProfile;
      this.freeSkillDetailsArr = resData.responseObject.skills,
      this.freelancerPortArr = resData.responseObject.portfolio,
      this.freelancerOrgArr = resData.responseObject.workExperience,
      this.strengthArr = resData.responseObject.strength,
      this.weaknessArr = resData.responseObject.weakness,
      this.freeEduArr = resData.responseObject.freelancerEdu
      this.freeDocsArr = resData.responseObject.freelancerDocument,
      this.cityName = resData.responseObject.freelancerProfile.city.cityName,
      this.stateName = resData.responseObject.freelancerProfile.province.stateName,
      this.countryName = resData.responseObject.freelancerProfile.country.countryName
    });
  }

 
  getHashDataBlockChainPDF(fileName) {
    this.loading = true;
    console.log("File ", fileName);
    var filesave = fileName.substring(fileName.lastIndexOf("-") + 1);
    console.log("file save:", filesave);


    this.__profileService.getDocHashData(fileName).then((data) => {
      console.log("Blockchain get data done", data);
      // setTimeout(() => {
      this.loading = false;

      var file = new Blob([data.body], { type: 'application/octet-stream' });
      // var fileURL = URL.createObjectURL(file);
      // window.open(fileURL);
      console.log(" Download URL :", file);
      saveAs(file, filesave);

      // window.open(fileURL, '_blank');
      // }, 3000);

    })
  }


  editProfile() {
    console.log("indise edit btn");
    this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/edit']);
  }


}
