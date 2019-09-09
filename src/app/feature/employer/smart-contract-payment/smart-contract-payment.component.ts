import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-smart-contract-payment',
  templateUrl: './smart-contract-payment.component.html',
  styleUrls: ['./smart-contract-payment.component.scss']
})
export class SmartContractPaymentComponent implements OnInit {

teamMemberArr = [
                  {memberId: 1 ,status :'pending'},
                  {memberId: 2 ,status:'completed'},
                  {memberId: 3 ,status:'rejected'}
                ];
paymentMethodArr = ['paypal','net-backing'];

  contractForm : FormGroup;
  contractStatus : string ="";
  searchFreelancer:number;
  constructor(
    private __fb: FormBuilder,

  ) { }

  ngOnInit() {

    this.contractForm = this.__fb.group({
      teamMember: ['', Validators.required],
    });
  }

  onMemberSelect(){
    this.searchFreelancer= this.contractForm.controls.teamMember.value;

    for(let i=0;i<this.teamMemberArr.length ;i++){
      if(this.searchFreelancer == this.teamMemberArr[i].memberId){
        this.contractStatus = this.teamMemberArr[i].status;
        break; 
      }
    }
    console.log("selected Team Member" + this.searchFreelancer);
    
  }

}
