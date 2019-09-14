import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { WorkPackageService } from '../work-package/shared/service/work-package.service';
import { SmartContractService } from '../services/smart-contract.service';

@Component({
  selector: 'app-smart-contract-payment',
  templateUrl: './smart-contract-payment.component.html',
  styleUrls: ['./smart-contract-payment.component.scss']
})

export class SmartContractPaymentComponent implements OnInit {


//Milestone Related Variables
milestoneForm : FormGroup;
scheduleForm : FormGroup;
i : any;
show : boolean = false;

approvedEmp: boolean  = false;
approvedRev: boolean = false;

//payment section realated variables


//Payment Shedule related Variables



teamMemberArr = [
                  {memberId: 1 ,status :'pending'},
                  {memberId: 2 ,status:'completed'},
                  {memberId: 3 ,status:'rejected'}
                ];
paymentMethodArr = ['paypal','net-backing'];

  contractStatus : string ="";
  searchFreelancer:number;
  constructor(
    private __fb: FormBuilder,
    private __paymentService: SmartContractService
  ) { }

  ngOnInit() {
   console.log("inside init");
   
   this.createMilestoneForm();
   this.createScheduleForm();
  }


  createMilestoneForm(){
    this.milestoneForm = this.__fb.group({
        milestoneDetails: this.__fb.array([this.__fb.group({
          milestone:['',[Validators.required]],
          start_date:['',[Validators.required]],
          end_date:['',[Validators.required]],
          completionCriteria:['',[Validators.required]],
          teamMember:['',[Validators.required]],
          amountPayable:['',[Validators.required]],
          contractStatus:['',Validators.required],
          paymentConditionApprovedByEmployer : ['',Validators.required] ,
          paymentConditionApprovedByReviewer : ['',Validators.required] ,
          paymentConditionDueDate : ['',Validators.required],
          currencyCd : ['',Validators.required]
        })
      ])
    });
  }
  
  
  get milestoneDetailsArr() {
    return this.milestoneForm.get('milestoneDetails') as FormArray;
  }

  get scheduleDetailsArr() {
    return this.scheduleForm.get('scheduleDetails') as FormArray;
  }

  addMolestone(){
    this.milestoneDetailsArr.push(this.__fb.group(
      {
        milestone : '',
        start_date : '',
        end_date : '',
        completionCriteria : '',
        teamMember : '',
        amountPayable : '',
        paymentConditionApprovedByEmployer: false,
        paymentConditionApprovedByReviewer: false

      }))
  }

  addSchedule(){
    this.scheduleDetailsArr.push(this.__fb.group(
      {
          paymentAmount:'',
          payerAccount:'',
          payeeAccount:'',
          payerName:'',
          payeeName:'',
          paymentMethod:'',
          paymentCurrency:'',
          paymentStatus:'',
          aymentDate:'',
       
      }))
  }

  removeMilestone(index){
    this.milestoneDetailsArr.removeAt(index);
  }
  removeShedule(index){
    this.scheduleDetailsArr.removeAt(index);
  }

  createScheduleForm(){
    this.scheduleForm = this.__fb.group({
        scheduleDetails: this.__fb.array([this.__fb.group({
          paymentAmount:['',[Validators.required]],
          payerAccount:['',[Validators.required]],
          payeeAccount:['',[Validators.required]],
          payerName:['',[Validators.required]],
          payeeName:['',[Validators.required]],
          paymentMethod:['',[Validators.required]],
          paymentCurrency:['',[Validators.required]],
          paymentStatus:['',[Validators.required]],
          paymentDate:['',[Validators.required]],
        })
      ])
    });
  }
  saveMilestones(){
    
  }

  onSaveChanges(){

    console.log(" Milestone details  " , this.milestoneForm.controls.milestoneDetails.value);
      this.__paymentService.postMilestoneData(this.milestoneForm.controls.milestoneDetails.value).then((workData: any) =>{
      console.log("Data is successfully saved" ,workData);
          this.__paymentService.postMilestoneData(this.milestoneForm.controls.milestoneDetails.value).then((workData: any) =>{
            console.log("Data is successfully saved" ,workData);
           });
   });
  }

  onSaveContract(){

  }

}
