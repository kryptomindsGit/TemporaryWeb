import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  //FormGroup
  basicForm : FormGroup;
  projectForm : FormGroup;
  skillForm : FormGroup;

  //Static Arrays 
  complexityArr = ['High','Medium','Low'];
  skillLevelArr = ['Moderrate','Intermediate','Begginer'];
  projectTypeArr = ['Full-time','Part-time'];
  currencyArr=['$' , 'Rs'];
  countries=['India','America'];

  //Date 
  today = new Date();
  todayDate: string ;
  employerId:number = 123456789;

  constructor(
    private fb:FormBuilder
  ) {    
}

  ngOnInit() {
    this.formatToday();
    this.createProjectForm();
    this.createSkillForm();
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
      proj_durationFrom:['',[Validators.required]],
      proj_durationTo:['',[Validators.required]],
      proj_start_date:['',[Validators.required]],
      budgetAmt:['',[Validators.required]],
      currency:['',[Validators.required]],
      estimatedCost:['',[Validators.required]],
    });
  }

  createSkillForm(){
    this.basicForm = this.fb.group({
      skill:['',[Validators.required]],
      skillLevel:['',[Validators.required]],
      projectType:['',[Validators.required]],
      country:['',[Validators.required]],
      rate:['',[Validators.required]],
      avgRate:['',[Validators.required]],
      currency:['',[Validators.required]],
      skill_start_date:['',[Validators.required]],
      skill_end_date:['',[Validators.required]],
    });
  }

  onSubmit(){
    const workPackagePayload = {
      
    }
  }
}
