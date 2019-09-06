import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IndeptProfileService } from '../../shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

export class ViewComponent implements OnInit {

  //Variable's
  public __id: any;
  public email_addr: any;
  public phone_number: any;

  //Array's
  public congnitoID: any = [];
  public freelancerDetailsArr: any = [];
  public freelancerSkillDetailsArr: any = [];
  public qualityArray: any = [];
  public strengthArr: any = [];
  public weaknessArr: any = [];
  public freelancerDocsArr: any = [];
  public freelancerEduArr: any = [];

  constructor(
    private __fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
  ) {
    this.__id = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {

    let isUportUser = localStorage.getItem("uportUser");
    if (isUportUser == "false") {

      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.email_addr = user["email"];
      this.phone_number = user["phone_number"];

    } else {

      this.email_addr = localStorage.getItem("email");
      this.phone_number = localStorage.getItem("phone_no");
    }

    // get API call function's
    this.getFreelancerDetails();
    this.getFreelancerDocuments();
    this.getFreelancerEducation();
    this.getFreelancerSkillDetails();
    this.getQualitiesById(this.__id);
  }


  getFreelancerDetails() {
    this.__profileService.getFreelancerByEmail(this.email_addr).then((resData: any) => {
      this.freelancerDetailsArr = resData[0];
      console.log(this.freelancerDetailsArr);
    });
  }

  getFreelancerSkillDetails() {
    this.__profileService.getFreelancerSkillById(this.email_addr).then((resData: any) => {
      this.freelancerSkillDetailsArr = resData;
      console.log(this.freelancerSkillDetailsArr);
    });
  }

  getQualitiesById(__id) {
    this.__profileService.getFreelancerQuality(this.email_addr).then((resData: any) => {
      this.qualityArray = resData;

      this.strengthArr = this.qualityArray.map(function (a) { return a["strengths"]; });

      this.weaknessArr = this.qualityArray.map(function (a) { return a["weaknesses"]; });
    });
  }

  getFreelancerDocuments() {
    this.__profileService.getFreelancerDocumentById(this.__id).then((resData: any) => {
      this.freelancerDocsArr = resData;
    });
  }

  getFreelancerEducation() {
    this.__profileService.getFreelancerEduById(this.email_addr).then((resData: any) => {
      this.freelancerEduArr = resData;
      console.log(this.freelancerEduArr);
    });
  }


}
