import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { WorkPackageService } from '../../shared/service/work-package.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  //form groups
  projectForm: FormGroup;
  skillForm: FormGroup;
  i: any;

  loading = false;
  addWorkPackage: any;

  calculateAvgRate: boolean = false;
  calculateAvgRate1: boolean = false;
  calculateAvgRate2: boolean = false;
  show: boolean;


  //Static Arrays 
  complexityArr = ['High', 'Medium', 'Low'];
  skillLevelArr = ['Moderate', 'Intermediate', 'Beginner'];
  projectTypeArr = ['Full-time', 'Part-time'];
  durationArr = ['days', 'months', 'years'];

  //arrays 
  allDomainArr : any = [];
  allSkillsArr : any = [];
  countries : any= [];
  currencyArr : any = [];
  domainSkillsList : any = [];

  //Date 
  today = new Date();
  todayDate: string;
  employerName: string = "Bhushan Mahajan";
  email: any;

  //skill related variables
  avgRatePayscale : any = 0 ; 
  avgRateLinkedIn : any = 0;
  avgRateGlassdoor : any = 0;
  wpId: any;
  durationYears: number;
  durationMonths: number;
  durationDays: number;
  isSelected: boolean = false;

  costEstimated: any = "Estimated Cost";

  constructor(
    private fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __workpackageService: WorkPackageService,
    private __router: Router,
    private toastr: ToastrService,
    private __customGlobalService: CustomGlobalService

  ) {
  }

  ngOnInit() {
    this.email = localStorage.getItem("email");

    this.formatToday();
    this.createProjectForm();
    this.createSkillForm();
    this.getAllDomain();
    this.getCountryList();
    this.getSkillList();
    this.getCurrencyList();
  }

  formatToday() {
    this.todayDate = formatDate(this.today, 'dd MMM yyyy ', 'en-US', '+0530');
  }

  createProjectForm() {
    this.projectForm = this.fb.group({
      proj_name: ['', [Validators.required, Validators.maxLength(25)]],
      proj_desc: ['', [Validators.required, Validators.maxLength(25)]],
      complexity: ['', [Validators.required]],
      duration_option: ['', [Validators.required]],
      durationYears: ['', [Validators.required]],
      durationMonths: ['', [Validators.required]],
      durationDays: ['', [Validators.required]],
      proj_start_date: ['', [Validators.required]],
      budgetAmt: ['', [Validators.required]],
      budgetCurrencyCode: ['', [Validators.required]],
      estimatedCost: ['', [Validators.required]],
      yes_reviewer: ['', [Validators.required]]
    });
  }

  createSkillForm() {
    this.skillForm = this.fb.group({
      skillDetails: this.fb.array([this.fb.group({
        domainId: ['', [Validators.required]],
        skill: ['', [Validators.required]],
        skillLevel: ['', [Validators.required]],
        availability: ['', [Validators.required]],
        teamMembers: ['', Validators.required],
        country: ['', [Validators.required]],
        ratePerHour: ['', [Validators.required]],
        availableAvgRatePerHour: ['', [Validators.required]],
        currencyCode: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
      })]),
    });
  }

  getCountryList() {
    console.log("inisde");
    this.__customGlobalService.getCountryList().then((resData: any) => {
      console.log("All Countries", resData);
      this.countries = resData.responseObject;
    });
  }

  getAllDomainSkills(domainId, i) {
    this.domainSkillsList = this.allSkillsArr.filter((item) => item.masterDomain.domainId == domainId);
  }

  getSkillList() {
    this.__customGlobalService.getSkillTypeList().then((resData: any) => {
      this.allSkillsArr = resData.responseObject;
    });
  }

  getCurrencyList(){
    this.__customGlobalService.getCurrencyList().then((resData: any) => {
      this.currencyArr= resData.responseObject; 
      console.log("currency : ", this.currencyArr);

    });    
  }

  getAllDomain() {
    this.__customGlobalService.getSkillDomainList().then((data: any) => {
      this.allDomainArr = data.responseObject;
      console.log("Domain Values", this.allDomainArr);
    })
  }
  setDuration() {
    this.durationYears = this.projectForm.controls.durationYears.value == null ? 0 : this.projectForm.controls.durationYears.value;
    this.durationMonths = this.projectForm.controls.durationMonths.value == null ? 0 : this.projectForm.controls.durationMonths.value;
    this.durationDays = this.projectForm.controls.durationDays.value == null ? 0 : this.projectForm.controls.durationDays.value;
  }


  get skillDetailsArr() {
    return this.skillForm.get('skillDetails') as FormArray;
  }

  addSkill() {
    this.skillDetailsArr.push(this.fb.group(
      {
        domainId: '',
        skill: '',
        skillLevel: '',
        availability: '',
        teamMembers: '',
        country: '',
        ratePerHour: '',
        availableAvgRatePerHour: '',
        currencyCode: '',
        startDate: '',
        endDate: '',
      }))
  }

  removeSkill(index) {
    this.skillDetailsArr.removeAt(index);
  }

  isReviewer() {
    this.isSelected = this.projectForm.controls.yes_reviewer.value;
    console.log("I need Reviewer" + this.isSelected);
  }

  saveDetails() {
    this.loading = true;
    this.setDuration();
    const workPackagePayload = {
      budget: this.projectForm.controls.budgetAmt.value,
      estimatedCost: this.projectForm.controls.estimatedCost.value,
      durationYears: this.durationYears,
      durationMonths: this.durationMonths,
      durationDays: this.durationDays,
      reviewerRequired: this.isSelected,
      projectName: this.projectForm.controls.proj_name.value,
      projectDescription: this.projectForm.controls.proj_desc.value,
      complexity: this.projectForm.controls.complexity.value,
      budgetCurrencyCode: this.projectForm.controls.budgetCurrencyCode.value,
      estimatedCostCurrency: this.projectForm.controls.budgetCurrencyCode.value,
      approxStartDate: this.projectForm.controls.proj_start_date.value,
      preferredAttributes: ""
      // wpsSet:this.skillForm.controls.skillDetails.value
    }
  
    this.__workpackageService.postWorkPackageData(workPackagePayload).then((workData: any) => {
      console.log("Data is successfully saved");
      // this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/viewall'])

      this.wpId = workData.responseObject.workPackageId;

      localStorage.setItem("workpackageId", this.wpId);
      this.__workpackageService.postWorkPackageSkillData(this.skillForm.controls.skillDetails.value, this.wpId).then((workData: any) => {
          this.loading = false;
          this.toastr.success('Project Saved Successfully');
          this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/viewall']);
        });
      });
  }

  onProfileView() {
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view', this.email]);
  }
  
  onSubmit() {
    this.saveDetails();
  }

  calulateAvgRate(no,position){
    console.log(" no is  :" , no);
    console.log("position is :" ,position);
  
    let skillName : String = this.domainSkillsList[this.skillForm.controls.skillDetails.value[position].skill-1].skillName;
    let shortCountryName : String = this.countries[this.skillForm.controls.skillDetails.value[position].country-1].countryShortName;
    
    this.__customGlobalService.getAvgRateForSkill(shortCountryName,skillName).then((resData: any) => {
      console.log("res for avg ", resData.responseObject);
      if(no==1){
        this.avgRatePayscale = resData.responseObject.payscale.salary;
        this.calculateAvgRate = this.calculateAvgRate ? false : true;
      }else if(no == 2){
        this.avgRateGlassdoor = resData.responseObject.payscale.salary ;
        this.calculateAvgRate1 = this.calculateAvgRate1 ? false : true;
      }else if(no == 3){
        this.avgRateLinkedIn = resData.responseObject.payscale.salary ;
        this.calculateAvgRate2 = this.calculateAvgRate2 ? false : true;
      }else{
  
      }
    })
  }
}