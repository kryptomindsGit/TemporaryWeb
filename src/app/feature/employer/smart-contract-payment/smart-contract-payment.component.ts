import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { WorkPackageService } from '../work-package/shared/service/work-package.service';
import { SmartContractService } from '../services/smart-contract.service';
import { EmpProfileService } from '../profile/shared/service/profile.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';

@Component({
  selector: 'app-smart-contract-payment',
  templateUrl: './smart-contract-payment.component.html',
  styleUrls: ['./smart-contract-payment.component.scss'],
  animations: [
    trigger('bounce', [transition('* => *', useAnimation(bounce, {
      // Set the duration to 5seconds and delay to 2seconds
      params: { timing: 5, delay: 2 }
    }))])
  ],
})

export class SmartContractPaymentComponent implements OnInit {


//Milestone Related Variables
milestoneForm : FormGroup;
scheduleForm : FormGroup;
i : any;
show : boolean = false;
workPackageID : any;
approvedEmp: boolean  = false;
approvedRev: boolean = false;
milestoneArr = [];
//payment section realated variables


//Payment Shedule related Variables
contractAddr : string ; 


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
    private __paymentService: SmartContractService,
    private __empProfile : EmpProfileService
  ) { }

  ngOnInit() {
   console.log("inside init");
   this.getWorkPackageId();
   this.createMilestoneForm();
   this.createScheduleForm();
  }

  getWorkPackageId(){
    this.workPackageID = localStorage.getItem("workId");
  }

  createMilestoneForm(){
    this.milestoneForm = this.__fb.group({
        milestoneDetails: this.__fb.array([this.__fb.group({
          milestoneName:['',[Validators.required]],
          startDate:['',[Validators.required]],
          endDate:['',[Validators.required]],
          completionCriteria:['',[Validators.required]],
          freelancerId:['',[Validators.required]],
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
  
  get milestoneDetailsArr() {
    return this.milestoneForm.get('milestoneDetails') as FormArray;
  }

  get scheduleDetailsArr() {
    return this.scheduleForm.get('scheduleDetails') as FormArray;
  }

  addMolestone(){
    this.milestoneDetailsArr.push(this.__fb.group(
      {
        milestoneName : '',
        startDate : '',
        endDate : '',
        completionCriteria : '',
        freelancerId : '',
        amountPayable : '',
        contractStatus : '',
        paymentConditionApprovedByEmployer: false,
        paymentConditionApprovedByReviewer: false,
        paymentConditionDueDate : '',
        currencyCd:'',
        uploadedContractDocument:'',
      }))
  }

  addSchedule(){
    this.scheduleDetailsArr.push(this.__fb.group(
      {
          milestoneId:'',
          paymentAmount:'',
          payerAccount:'',
          payeeAccount:'',
          payerName:'',
          payeeName:'',
          paymentMethod:'',
          paymentCurrency:'',
          paymentStatus:'',
          paymentDate:'',
       
      }))
  }

  removeMilestone(index){
    this.milestoneDetailsArr.removeAt(index);
  }

  removeSchedule(index){
    this.scheduleDetailsArr.removeAt(index);
  }
 
  saveMilestones(){
    
  }

  onDeployContract(){
    // const payload={
    //   projectId: this.workPackageID
    // }

    const payload={
      projectId: 101116
    }

    this.__paymentService.deployContractData(payload).then((workData: any) =>{
      console.log("Data is successfully saved" ,workData);
      this.contractAddr = workData.ContractAddress;
    });
  }

  onDeployMilestone(i:any){
    console.log("addr "+this.contractAddr);
    
    
    const payloade = {
      milestoneStr:(this.milestoneForm.controls.milestoneDetails.value)[i].milestoneName,
      reviewAddrs:"0xd15eE84e3308249E178D8Fb8f20BD7A03b358ee5",
      startDate:(this.milestoneForm.controls.milestoneDetails.value)[i].startDate,
      endDate:(this.milestoneForm.controls.milestoneDetails.value)[i].endDate,
      dueDate:(this.milestoneForm.controls.milestoneDetails.value)[i].paymentConditionDueDate,
      amount:(this.milestoneForm.controls.milestoneDetails.value)[i].amountPayable,
      contractAddr:this.contractAddr,
    }
    
    this.__paymentService.deployMilestoneData(payloade).then((workData: any) =>{
      console.log("Data is successfully saved" ,workData);
    });

   
        
    const payloads = {
      milestoneStr:(this.milestoneForm.controls.milestoneDetails.value)[i].milestoneName,
      reviewAddrs:"0xd15eE84e3308249E178D8Fb8f20BD7A03b358ee5",
      startDate:((this.milestoneForm.controls.milestoneDetails.value)[i].startDate),
      endDate:((this.milestoneForm.controls.milestoneDetails.value)[i].endDate),
      dueDate:((this.milestoneForm.controls.milestoneDetails.value)[i].paymentConditionDueDate),
      amount:(this.milestoneForm.controls.milestoneDetails.value)[i].amountPayable,
      currency:(this.milestoneForm.controls.milestoneDetails.value)[i].currencyCd,
      // contractAddress:this.contractAddr,
      freeAddr:'0xD4496dA2a4b376fC8Ce4786EB6B71483436077c4',
      empAddr:'0xDbc71C18Ab38edc4b7E2cd926e2Bd53cA8e8E52E'
    }
    this.__paymentService.deployMilestoneData1(payloads).then((workData: any) =>{
      console.log("Data is successfully saved" ,workData);
    });
  }

  onSaveChanges(){
    console.log(" Milestone details  " , this.milestoneForm.controls.milestoneDetails.value);
      this.__paymentService.postMilestoneData(this.milestoneForm.controls.milestoneDetails.value).then((workData: any) =>{
        console.log("Data is successfully saved" ,workData);
      });
  }

  onSaveContract(){

  }

}
