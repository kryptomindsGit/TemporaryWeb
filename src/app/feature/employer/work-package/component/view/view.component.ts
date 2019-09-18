import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { WorkPackageService } from '../../shared/service/work-package.service';

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

  projectName: string = "Web developmet For 'X-Company'";
  projectDesc: string = "Lorem ipsum, dolor sit amet consectetur adipisicing elit.Exercitationem consequatur adipisci,aliquam consequuntur minus sunt dolorequas quideminventore suscipit laudantium voluptatum iure nulla soluta nemo qui sit, maxime nostrum! ";
  budget: number = 350;
  estimatedCost: number = 320;
  complexity: string = "High";
  // stratDate : Date ;
  // fromDate : Date ;
  // toDate : Date ;
  startDate: string = "10 jan 2019";
  fromDate: string = "14 jan 2019";
  toDate: string = "1 june 2019";
  budgetCurrency: string;

  //Arr
  skillArr = [];


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
  ) { }

  ngOnInit() {
 
    let wpId = localStorage.getItem("workpackageId");
    this.getWorkPackage(wpId);
    
  }
  onClick(event) {
    this.showModal = true; // Show-Hide Modal Check
    // this.UserId = event.target.id;
    // this.Firstname = document.getElementById("firstname"+this.UserId).innerHTML;
    // this.Lastname = document.getElementById("lastname"+this.UserId).innerHTML;
    // this.Email = document.getElementById("email"+this.UserId).innerHTML;

    this.UserId = "1";
    this.Firstname = "John";
    this.Lastname = "D'souza";
    this.Email = "johndsouza@gmaiil.com";
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
      this.startDate = (resData.responseObject.approxStartDate).substring(0, 10);
      this.toDate = (resData.responseObject.approxStartDate).substring(0, 10);
      this.budgetCurrency = resData.responseObject.budgetCurrencyCode;
    });

    this.__workService.getSkillPackageData(id).then((resData: any) => {
      console.log("Data of skills" + resData.responseObject);
      this.skillArr = resData.responseObject;
      console.log("Data of skills" + resData.responseObject);
    });
  }
}
