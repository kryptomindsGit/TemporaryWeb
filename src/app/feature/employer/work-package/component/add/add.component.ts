import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {formatDate } from '@angular/common';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { WorkPackageService } from '../../shared/service/work-package.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  //FormGroup
  // basicForm : FormGroup;
  projectForm : FormGroup;
  skillForm : FormGroup;
  i: any;

  //Static Arrays 
  complexityArr = ['High','Medium','Low'];
  skillLevelArr = ['Moderrate','Intermediate','Begginer'];
  projectTypeArr = ['Full-time','Part-time'];
  currencyArr=['$' , 'Rs'];
  countries=[];
  durationArr=['days','months','years'];
  allDomainArr = [];
  allSkillsArr = [];
  wpId:any;
  //Date 
  today = new Date();
  todayDate: string ;
  employerId:number = 123456789;

  //skill related variables
 
  durationYears : number = 2019;
  durationMonths : number = 8;
  durationDays : number = 23;
  isSelected : boolean = false;

  

  constructor(
    private fb:FormBuilder ,
    private __profileService: IndeptProfileService,
    private __workpackageService : WorkPackageService
  ) {    
}

  ngOnInit() {
    this.formatToday();
    this.createProjectForm();
    this.createSkillForm();
    this.getAllDomain();
    this.getAllCountries();
  }

  formatToday(){
   
    this.todayDate = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    console.log("Todays date : " ,this.today);
    console.log("Todays date : " ,this.todayDate);
  }

  createProjectForm(){
    this.projectForm = this.fb.group({
      proj_name:['',[Validators.required]],
      proj_desc:['',[Validators.required]],
      complexity:['',[Validators.required]],
      duration_option:['',[Validators.required]],
      durationYears:['',[Validators.required]],
      durationMonths:['',[Validators.required]],
      durationDays:['',[Validators.required]],
      proj_start_date:['',[Validators.required]],
      budgetAmt:['',[Validators.required]],
      budgetCurrencyCode:['',[Validators.required]],
      estimatedCost:['',[Validators.required]],
      yes_reviewer:['',[Validators.required]]
    });
  }

  createSkillForm(){
    this.skillForm = this.fb.group({
      skillDetails: this.fb.array([this.fb.group({
          domain : ['',[Validators.required]],
          skill:['',[Validators.required]],
          skillLevel:['',[Validators.required]],
          availability:['',[Validators.required]],
          members:['', Validators.required],
          country:['',[Validators.required]],
          ratePerHour:['',[Validators.required]],
          availableAvgRatePerHour:['',[Validators.required]],
          currencyCode:['',[Validators.required]],
          skill_start_date:['',[Validators.required]],
          skill_end_date:['',[Validators.required]],
      })]),
    });
  }

  selectSkills(country_id){
    this.__profileService.getFreelancerSkills(country_id).then((data: any) => {
      this.allSkillsArr = data;
      console.log("all skills" , this.allSkillsArr);
    })
  }

  getAllCountries(){
    console.log("inisde");
    this.__profileService.getFreelancerCountry().then((resData: any) => {
      console.log("All Countries" , resData);   
      this.countries = resData; 
    });
  }

  setDuration(){

    if((
          this.durationYears !==null && this.durationMonths == null && this.durationDays == null)
      ){
        this.durationYears = this.projectForm.controls.durationYears.value;
        this.durationMonths= 0;
      this.durationDays= 0;
    }else if(this.durationYears ==null && this.durationMonths != null && this.durationDays == null){
      this.durationYears = 0;
      this.durationDays= 0;
      this.durationMonths = this.projectForm.controls.durationMonths.value;

    }else if(this.durationYears ==null && this.durationMonths == null && this.durationDays != null){
      this.durationYears = 0 ;
      this.durationMonths= 0;
      this.durationDays = this.projectForm.controls.durationDays.value;
    }
  }

  
  get skillDetailsArr() {
    return this.skillForm.get('skillDetails') as FormArray;
  }

  addSkill(){
    this.skillDetailsArr.push(this.fb.group(
      {
        domain:'',
        skill : '',
        skillLevel : '',
        availability : '',
        members : '',
        country : '',
        ratePerHour : '',
        availableAvgRatePerHour :'',
        currencyCode :'',
        skill_start_date :'',
        skill_end_date:''
      }))
  }

  removeSkill(index){
    this.skillDetailsArr.removeAt(index);
  }

  getAllDomain(){
    this.__profileService.getFreelancerCategory().then((data: any) => {
      this.allDomainArr = data;
      console.log("Domain Values" , this.allDomainArr);
    })
  }

  isReviewer(){
    this.isSelected = this.projectForm.controls.yes_reviewer.value;
    console.log("I need Reviewer" + this.isSelected);
  }

 
  saveDetails(){
    this.setDuration();
    const workPackagePayload = { 
      budget: this.projectForm.controls.budgetAmt.value,
      estimatedCost: this.projectForm.controls.estimatedCost.value,
      durationYears:this.durationYears,
      durationMonths:this.durationMonths,
      durationDays:this.durationDays,
      reviewerRequired : this.isSelected,
      projectName: this.projectForm.controls.proj_name.value,
      projectDescription: this.projectForm.controls.proj_desc.value,
      complexity: this.projectForm.controls.complexity.value,
      budgetCurrencyCode: this.projectForm.controls.currency.value,
      estimatedCostCurrency:this.projectForm.controls.currency.value,
      approxStartDate1 :this.projectForm.controls.proj_start_date.value,
      preferredAttributes :"",
      // postedByIndividualEmpId :{} ,
      // postedByEnterpriseEmpId : {},
    }
    console.log("Work package payload" , workPackagePayload);


    this.__workpackageService.postWorkPackageData(workPackagePayload).then((workData: any) =>{
        console.log("Data is successfully saved");

        this.wpId = workData.responseObject.workPackageId;
      
    

        console.log("Work payload",  this.skillForm.controls.skillDetails.value);

        this.__workpackageService.postWorkPackageSkillData(this.skillForm.controls.skillDetails.value, this.wpId).then((workData: any) =>{
          console.log("Data is successfully saved" ,workData);
        });

      });     
  } 

  onSubmit(){
    this.saveDetails();
  }
}
