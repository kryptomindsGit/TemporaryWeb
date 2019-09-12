import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-workpackage-view',
  templateUrl: './workpackage-view.component.html',
  styleUrls: ['./workpackage-view.component.scss']
})
export class WorkpackageViewComponent implements OnInit {

  //Other Variables


  //Employer Information

  duration:string = "3 Months";
  startDate: string= "12 jan 2019";
  endDate: string= "02 apr 2019";
  employer:string="Joseph Sharif";
  region:string="India";
  budget:string="$300";
  description:string="I had this issue the problem here is that the form is being called way to quick before the initialisation in the ionViewLoaded is happening. As soon as you move it to the constructor it works properly. Also, the same code in a normal NG2 app works in the ngOnInit is this a Bug or something else?";

//Array

searchByArr = ['Project Id' , 'Project Name' , 'Skill' , 'Duration','Start date' , 'Employer Name' ,'Region' , 'Budget'];
allInvitations = [ 
                    {
                      projectId:221232244 ,duration: 3 ,startDate:"12 jan 2019",endDate:"02 apr 2019",employer:"Joseph Sharif",region:"India",budget:"$400",description:"I had this issue the problem here is that the form is being called way to quick before the initialisation in the ionViewLoaded is happening. As soon as you move it to the constructor it works properly. Also, the same code in a normal NG2 app works in the ngOnInit is this a Bug or something else?"
                    },
                    {
                      projectId:985655244, duration: 5,startDate:"17 jan 2019",endDate:"04 apr 2019",employer:"Joseph Sharif",region:"India",budget:"$400",description:"I had this issue the problem here is that the form is being called way to quick before the initialisation in the ionViewLoaded is happening. As soon as you move it to the constructor it works properly. Also, the same code in a normal NG2 app works in the ngOnInit is this a Bug or something else?"
                    }
                 ]
  
  showModal : boolean;
  UserId    : string;
  Firstname : string;
  Lastname  : string;
  Email     : string;
  
//formgroup

  searchForm:FormGroup;


  
  projectName : string = "Web developmet For 'X-Company'";
  projectDesc : string ="Lorem ipsum, dolor sit amet consectetur adipisicing elit.Exercitationem consequatur adipisci,aliquam consequuntur minus sunt dolorequas quideminventore suscipit laudantium voluptatum iure nulla soluta nemo qui sit, maxime nostrum! ";
  estimatedCost: number =  320 ;
  complexity : string ="High";
  fromDate : string = "14 jan 2019";
  toDate : string = "1 june 2019";

     
  //other variables

  show : boolean = false;

  
  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 30
  };
  constructor(
    private __fb: FormBuilder,
  ) { }



  ngOnInit() {

  //   this.searchForm = new FormGroup({
  //     searchBy: new FormControl()
  //  });
    this.searchForm = this.__fb.group({
      searchBy: ['', Validators.required],
      data:['',Validators.required]
    });
  
  }

  onClick(event)
  {
    this.showModal = true; // Show-Hide Modal Check
      // this.UserId = event.target.id;
      // this.Firstname = document.getElementById("firstname"+this.UserId).innerHTML;
      // this.Lastname = document.getElementById("lastname"+this.UserId).innerHTML;
      // this.Email = document.getElementById("email"+this.UserId).innerHTML;

      
      this.UserId= "1";
      this.Firstname = "Irshad";
      this.Lastname ="Hukeri";
      this.Email="irshad@gmaiil.com";
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }

  showModel(){
    this.show = ! this.show ; 
  }

  onSearch(){
    const searchData ={
      searchFreelancer: this.searchForm.controls.searchBy.value,
      data: this.searchForm.controls.data.value
    }

    console.log("search Data : " , searchData);
    
  }

}
