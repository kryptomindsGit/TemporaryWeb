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


    // get API call function's
    this.getFreelancerDetails();
    this.getFreelancerDocuments();
    this.getFreelancerEducation();
    this.getFreelancerOrganization();
    this.getFreelancerSkillDetails();
    this.getQualitiesById(this.__id);
    this.getFreelancerPortfolio();
  }


  getFreelancerDetails() {
    this.__profileService.getFreelancerByEmail(this.email_addr).then((resData: any) => {
      this.freeDetailsArr = resData[0];
      console.log("Basic Details", this.freeDetailsArr);
    });
  }

  getFreelancerSkillDetails() {
    this.__profileService.getFreelancerSkillById(this.email_addr).then((resData: any) => {
      this.freeSkillDetailsArr = resData;
      console.log("Skills", this.freeSkillDetailsArr);
    });
  }

  getFreelancerOrganization() {
    this.__profileService.getFreelancerOrgById(this.email_addr).then((data: any) => {
      this.freelancerOrgArr = data;
      console.log("freelancerOrgArr", this.freelancerOrgArr);

    });
  }


  getQualitiesById(__id) {
    this.__profileService.getFreelancerQuality(this.email_addr).then((resData: any) => {
      this.qualityArray = resData;
      console.log("Qualities", this.qualityArray);

      this.strengthArr = this.qualityArray.map(function (a) { return a["strengths"]; });
      console.log("Strength:", this.strengthArr);

      this.weaknessArr = this.qualityArray.map(function (a) { return a["weaknesses"]; });
      console.log("Weakness:", this.weaknessArr);
    });
  }

  getFreelancerPortfolio() {
    this.__profileService.getFreelancerPortfolioById(this.email_addr).then((data: any) => {
      this.freelancerPortArr = data;
      console.log("freelancerPortArr:", this.freelancerPortArr.port_addr);
    });
  }

  getFreelancerDocuments() {
    this.__profileService.getFreelancerDocumentById(this.email_addr).then((resData: any) => {
      this.freeDocsArr = resData;
      console.log("Documents:", this.freeDocsArr);

    });
  }

  getFreelancerEducation() {
    this.__profileService.getFreelancerEduById(this.email_addr).then((resData: any) => {
      this.freeEduArr = resData;
      console.log("Education:", this.freeEduArr);
    });
  }

  getHashDataBlockChainPDF(fileName) {
    console.log("File ", fileName);

    this.__profileService.getDocHashData(fileName).then((data) => {
      console.log("Blockchain get data done", data);

      var file = new Blob([data.body], { type: 'application/octet-stream' });
      var fileURL = URL.createObjectURL(file);
      // window.open(fileURL);
      window.open(fileURL, '_blank');
    })
  }


  editProfile() {
    console.log("indise edit btn");
    this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/edit', this.email_addr]);

  }


}
