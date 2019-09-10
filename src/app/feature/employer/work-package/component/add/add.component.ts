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


  //Static Arrays 
  complexityArr = ['High','Medium','Low'];
  skillLevelArr = ['Moderrate','Intermediate','Begginer'];
  projectTypeArr = ['Full-time','Part-time'];
  currencyArr=['$' , 'Rs'];
  countries=[];
  durationArr=['days','months','years'];

  //Date 
  today = new Date();
  todayDate: string ;
  employerId:number = 123456789;

  //other variables

  durationYears : number = 2019;
  durationMonths : number = 8;
  durationDays : number = 23;
  duration_options : string;
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
      duration:['',[Validators.required]],
      proj_start_date:['',[Validators.required]],
      budgetAmt:['',[Validators.required]],
      currency:['',[Validators.required]],
      estimatedCost:['',[Validators.required]],
      yes_reviewer:['',[Validators.required]]
    });
  }

  createSkillForm(){
    this.skillForm = this.fb.group({
        // skillDetails :  this.fb.array([this.fb.group({
          skill:['',[Validators.required]],
          skillLevel:['',[Validators.required]],
          projectType:['',[Validators.required]],
          members:['', Validators.required],
          country:['',[Validators.required]],
          rate:['',[Validators.required]],
          avgRate:['',[Validators.required]],
          currency:['',[Validators.required]],
          skill_start_date:['',[Validators.required]],
          skill_end_date:['',[Validators.required]],
        });
    //   ])
    // });
  }

  getAllCountries(){
    console.log("inisde");
    this.__profileService.getFreelancerCountry().then((resData: any) => {
      console.log("All Countries" , resData);   
      this.countries = resData; 
    });
  }

  setDuration(){
    console.log("duration" + this.projectForm.controls.duration_option.value);
    this.duration_options = this.projectForm.controls.duration_option.value;
    if(this.duration_options == 'years'){
      this.durationYears = this.projectForm.controls.duration.value ;
      this.durationMonths= 0;
      this.durationDays= 0;
    }else if(this.duration_options == 'months'){
      this.durationYears = 0;
      this.durationMonths= this.projectForm.controls.duration.value ;
      this.durationDays= 0;
    }else{
      this.durationYears = 0 ;
      this.durationMonths= 0;
      this.durationDays= this.projectForm.controls.duration.value ;
    }
  }

  
  get workSkillArr() {
    return this.skillForm.get('skillDetails') as FormArray;
  }

  addSkill(){
    this.workSkillArr.push(this.fb.group(
      {
        skill : '',
        skillLevel : '',
        projectType : '',
        members : '',
        country : '',
        rate : '',
        avgRate :'',
        currency :'',
        skill_start_date :'',
        skill_end_date:''
      }))
  }

  removeSkill(index){
    this.workSkillArr.removeAt(index);
  }

  isReviewer(){
    this.isSelected = this.projectForm.controls.yes_reviewer.value;
    console.log("I need Reviewer" + this.isSelected);
  }

  onSubmit(){

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
      countryPreference:this.skillForm.controls.country.value,
      approxStartDate1 :this.projectForm.controls.proj_start_date.value,
      preferredAttributes :"",
      postedByIndividualEmpId :"" ,
      postedByEnterpriseEmpId : "",
    }

    const skillDetails = {
      // skillDetails :  
    }
    console.log("Work package payload" , workPackagePayload);

    this.__workpackageService.postWorkPackageData(workPackagePayload).then((workData: any) =>{
        console.log("Data is successfully saved");
    });
  }
}
