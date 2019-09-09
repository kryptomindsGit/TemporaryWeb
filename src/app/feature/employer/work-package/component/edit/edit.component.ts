import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  showModal : boolean;
  UserId    : string;
  Firstname : string;
  Lastname  : string;
  Email     : string;
  
  constructor() { }

  ngOnInit() {
  }
  
  onClick(event)
  {
    this.showModal = true; // Show-Hide Modal Check
      this.UserId = event.target.id;
      this.Firstname = document.getElementById("firstname"+this.UserId).innerHTML;
      this.Lastname = document.getElementById("lastname"+this.UserId).innerHTML;
      this.Email = document.getElementById("email"+this.UserId).innerHTML;

  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }
}