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
    this.allWorkPackages();
  }

  allWorkPackages(){
    this.__workService.getAllWorkPackageData().then((resData: any) => {
      console.log("Data of skills" +  resData.responseObject);
      this.workArr = resData.responseObject;    
    });
  } 

  setWorkId(index){
    console.log("index :" ,index);
    this.wpId = this.workArr[index].workPackageId; 
    console.log("wp id is :" ,this.wpId);
    this.wpId = this.workArr[index].workPackageId;
    localStorage.setItem("workpackageId",this.wpId);
    
  }
  
  gotoWorkpackage(index){
    console.log("index :" ,index);
    this.wpId = this.workArr[index].workPackageId; 
    console.log("wp id is :" ,this.wpId);
    this.wpId = this.workArr[index].workPackageId;
    localStorage.setItem("workpackageId",this.wpId);
 
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/view/',this.wpId])
  }
  
  gotoPayment(index){
    console.log("index :" ,index);
    this.wpId = this.workArr[index].workPackageId; 
    console.log("wp id is :" ,this.wpId);
    this.wpId = this.workArr[index].workPackageId;
    localStorage.setItem("workpackageId",this.wpId);
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/smartpayment/',this.wpId])
  }
}
