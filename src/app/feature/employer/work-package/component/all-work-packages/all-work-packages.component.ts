import { Component, OnInit } from '@angular/core';
import { WorkPackageService } from '../../shared/service/work-package.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-work-packages',
  templateUrl: './all-work-packages.component.html',
  styleUrls: ['./all-work-packages.component.scss']
})
export class AllWorkPackagesComponent implements OnInit {

  email : string ;
  workArr : any = [];
  wpId:any;

  constructor(
    private __workService: WorkPackageService,
    private __router : Router
  ) { }

  ngOnInit() {
    this.email = localStorage.getItem("email"); 
    this.allWorkPackages(this.email);
  }

  allWorkPackages(email:any){
    this.__workService.getAllWorkPackageData(email).then((resData: any) => {
      console.log("Data of skills" +  resData.responseObject);
      this.workArr = resData.responseObject;
     
    });
  } 

  gotoWorkpackage(index){
    this.wpId = this.workArr[index].workPackageId; 
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/view/',this.wpId])
  }
  
  gotogotPayment(index){
    this.wpId = this.workArr[index].workPackageId; 
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/smartpayment/',this.wpId])
  }
}
