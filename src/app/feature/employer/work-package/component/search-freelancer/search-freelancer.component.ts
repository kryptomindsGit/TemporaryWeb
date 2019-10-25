import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-freelancer',
  templateUrl: './search-freelancer.component.html',
  styleUrls: ['./search-freelancer.component.scss']
})
export class SearchFreelancerComponent implements OnInit {

  constructor(
    private __router:Router
  ) { }

  ngOnInit() {
  }

  goBacktoWork(){
    this.__router.navigate(['/feature/feature/full-layout/employer/emp/workpackage/workpack/viewall'])
  }

}
