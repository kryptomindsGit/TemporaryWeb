import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  showSignUpCard: number;
  
  constructor() { }

  ngOnInit() {
  }

  onSignUp(index){
    this.showSignUpCard = index;
    if(this.showSignUpCard == 1){
      this.showSignUpCard == 1;
    }else {
      this.showSignUpCard == 2;
    }
  }

}
