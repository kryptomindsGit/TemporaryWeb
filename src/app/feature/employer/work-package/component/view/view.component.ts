import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { WorkPackageService } from '../../shared/service/work-package.service';
import { Router } from '@angular/router';
import { SearchFreelancerComponent } from '../search-freelancer/search-freelancer.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  //model variables

  showModal: boolean;
  UserId: string;
  Firstname: string;
  Lastname: string;
  Email: string;

  //project Details variables

  projectName: string ;
  projectDesc: string ;
  budget: number;
  estimatedCost: number ;
  complexity: string ;
  // stratDate : Date ;
  // fromDate : Date ;
  // toDate : Date ;
  startDate: string;
  fromDate: string;
  toDate: string ;
  creation : string;

  budgetCurrency: string;
  workId:any;
  //Arr
  skillArr = [];
  durationDays : any;
  durationYears : any;
  durationMonths : any;


  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 30
  };

  constructor(
    private __workService: WorkPackageService,
    private __router : Router,
    // private __search : SearchFreelancerComponent

  ) { }

  ngOnInit() {
  
   console.log("date creation" , this.creation);
 
    this.workId = localStorage.getItem("workpackageId");
    this.getWorkPackage(this.workId);
    console.log("creation" , this.creation);

    let random = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    console.log("random",random);
    
  }
  onClick(event) {
    this.showModal = true; // Show-Hide Modal Check
    // this.UserId = event.target.id;
    // this.Firstname = document.getElementById("firstname"+this.UserId).innerHTML;
    // this.Lastname = document.getElementById("lastname"+this.UserId).innerHTML;
    // this.Email = document.getElementById("email"+this.UserId).innerHTML;

    this.UserId = "1";
    this.Firstname = "Khemraj";
    this.Lastname = "Adhawade";
    this.Email = "khemrajAdhawade@gmaiil.com";
  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  getWorkPackage(id) {

    this.__workService.getWorkPackageData(id).then((resData: any) => {
      console.log("response data : ",resData.responseObject);
      this.projectName = resData.responseObject.projectName;
      this.projectDesc = resData.responseObject.projectDescription;
      this.budget = resData.responseObject.budget;
      this.estimatedCost = resData.responseObject.estimatedCost;
      this.startDate = (resData.responseObject.approxStartDate);
      this.toDate = (resData.responseObject.approxStartDate);
      this.budgetCurrency = resData.responseObject.budgetCurrencyCode;
      this.complexity=resData.responseObject.complexity;
      this.durationYears = resData.responseObject.durationYears;
      this.durationMonths = resData.responseObject.durationMonths;
      this.durationDays = resData.responseObject.durationDays;
      this.creation= formatDate(new Date(), 'dd MMM yyyy ', 'en-US', '+0530');
    });

    this.__workService.getSkillPackageData(id).then((resData: any) => {
      console.log("Data of skills" + resData.responseObject);
      this.skillArr = resData.responseObject;
      console.log("Data of skills" ,this.skillArr);
      // localStorage.removeItem("workpackageId");

    });

  }

  gotoSearch(){
    // this.__search.goBacktoWork(this.workId);
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/findfree']);
  }
}
