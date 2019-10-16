import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { WorkPackageService } from '../../shared/service/work-package.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  //FormGroup
  // basicForm : FormGroup;
  projectForm: FormGroup;
  skillForm: FormGroup;
  i: any;
  show: boolean;

  loading = false;
  addWorkPackage: any;

  calAvgRate: any = 'ETH 1';
  calculateAvgRate1: boolean = false;

  //Static Arrays 
  complexityArr = ['High', 'Medium', 'Low'];
  skillLevelArr = ['Moderate', 'Intermediate', 'Beginner'];
  projectTypeArr = ['Full-time', 'Part-time'];
  currencyArr = ['ETH', 'INR', 'USD', 'IDR', 'AUD', 'EUR'];
  countries = [];
  durationArr = ['days', 'months', 'years'];
  allDomainArr = [];
  allSkillsArr = [];
  wpId: any;
  domainSkillsList: any = [];
  //Date 
  today = new Date();
  todayDate: string;
  employerName: string = "Bhushan Mahajan";
  email: any;
  //skill related variables

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
  ) {
  }

  ngOnInit() {
    this.formatToday();
    this.createProjectForm();
    this.createSkillForm();
    this.getAllDomain();
    this.getAllCountries();
    this.getAllSkills();
    this.email = localStorage.getItem("email");
  }

  formatToday() {

    this.todayDate = formatDate(this.today, 'dd MMM yyyy ', 'en-US', '+0530');
    console.log("Todays date : ", this.today);
    console.log("Todays date : ", this.todayDate);
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

  // selectSkills(country_id) {
  //   this.__profileService.getFreelancerSkills(country_id).then((data: any) => {
  //     this.allSkillsArr = data;
  //     console.log("all skills", this.allSkillsArr);
  //   })
  // }

  getAllCountries() {
    console.log("inisde");
    this.__profileService.getFreelancerCountry().then((resData: any) => {
      console.log("All Countries", resData);
      this.countries = resData;
    });
  }

  getAllDomainSkills(domainId, i) {
    this.domainSkillsList[domainId] = this.allSkillsArr.filter((item) => item.skill_cat_id == domainId);
    this.skillForm.get('skillDetails')['controls'][i].patchValue({ domainId: domainId, skill: '' });

  }

  getAllSkills() {
    this.__workpackageService.getAllSkills().then((resData: any) => {
      this.allSkillsArr = resData;
      //console.log(`allskills: ${JSON.stringify(this.allSkillsArr)}`);
    });
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

  getAllDomain() {
    // this.__profileService.getFreelancerCategory().then((data: any) => {
    //   this.allDomainArr = data;
    //   console.log("Domain Values", this.allDomainArr);
    // })
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
    console.log("Work package payload", workPackagePayload);


    this.__workpackageService.postWorkPackageData(workPackagePayload).then((workData: any) => {
      console.log("Data is successfully saved");
      // this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/viewall'])

      this.wpId = workData.responseObject.workPackageId;

      localStorage.setItem("workpackageId", this.wpId);

      console.log("Work payload", this.skillForm.controls.skillDetails.value);

      this.__workpackageService.postWorkPackageSkillData(this.skillForm.controls.skillDetails.value, this.wpId).then((workData: any) => {
        console.log("Data is successfully saved", workData);
        this.loading = false;
        this.toastr.success('Project Saved Successfully');
        this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/viewall']);
      });
    });
  }

  calCost() {
    this.costEstimated = this.projectForm.controls.budgetCurrencyCode.value + " 230";
  }

  onProfileView() {
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view', this.email]);
  }
  onSubmit() {
    this.saveDetails();
  }


  //calculateAvgRate()
  calulateAvgRatePayscale() {
    this.calculateAvgRate1 = this.calculateAvgRate1 ? false : true;;
  }
}