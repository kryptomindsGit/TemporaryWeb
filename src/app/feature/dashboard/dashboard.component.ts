import { Component, OnInit } from '@angular/core';
import { IndeptProfileService } from '../independent-prof/profile/shared/service/profile.service';
import { EmpProfileService } from '../employer/profile/shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public freeUser: boolean;
  public empUser: boolean;
  public userRole: any;
  public isUportUser: any;


  constructor(
    private __idptProfileService: IndeptProfileService,
    private __empProfileService: EmpProfileService,
    private __authService: AuthService,
  ) { }

  ngOnInit() {
    this.isUportUser = localStorage.getItem("uportUser");

    if (this.isUportUser == "false") {
      const user = this.__authService.decode();
      this.userRole = user["custom:role"];
    } else {
      this.userRole = localStorage.getItem("role");
    }
    this.getUserInfo()
  }

  getUserInfo() {
    if (this.userRole == "Freelancer") {
      this.__idptProfileService.getFreelancerByEmail().then((resData: any) => {
      });
    } else if (this.userRole == "Employer") {
      this.__empProfileService.getEmployerByEmailId().then((resData: any) => {
        
      });
    }
  }

}
