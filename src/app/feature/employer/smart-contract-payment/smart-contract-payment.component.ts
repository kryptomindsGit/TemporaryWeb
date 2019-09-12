import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-smart-contract-payment',
  templateUrl: './smart-contract-payment.component.html',
  styleUrls: ['./smart-contract-payment.component.scss']
})

export class SmartContractPaymentComponent implements OnInit {


//Milestone Related Variables
milestoneForm : FormGroup;
i : any;
show : boolean = false;
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

  ) { }

  ngOnInit() {

   this.createProjectForm();
  }


  createProjectForm(){
    this.milestoneForm = this.__fb.group({
        milestoneDetails: this.__fb.array([this.__fb.group({
          milestone:['',[Validators.required]],
          start_date:['',[Validators.required]],
          end_date:['',[Validators.required]],
          criteria:['',[Validators.required]],
          teamMember:['',[Validators.required]],
          amt:['',[Validators.required]]
        })
      ])
    });
  }
  
  
  get milstoneDetailsArr() {
    return this.milestoneForm.get('milestoneDetails') as FormArray;
  }


  addMolestone(){
    this.milstoneDetailsArr.push(this.__fb.group(
      {
        milestone : '',
        start_date : '',
        end_date : '',
        criteria : '',
        teamMember : '',
        amt : ''
      }))
  }

  removeMilestone(index){
    this.milstoneDetailsArr.removeAt(index);
  }


  saveMilestones(){
    
  }

  onSaveChanges(){

  }

  onSaveContract(){

  }

}
