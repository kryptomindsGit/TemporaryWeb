import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';


//CORS
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
  })
};

import { SPRING_URL } from '../../../constant/constant-url';
import { SPRING_AVG_RATE_URL } from '../../../constant/constant-url';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { IndeptProfileService } from '../../independent-prof/profile/shared/service/profile.service';
import { PartProfileService } from '../../partner/profile/shared/service/profile.service';
import { EmpProfileService } from '../../employer/profile/shared/service/profile.service';


@Injectable({
  providedIn: 'root'
})
export class CustomGlobalService {
  isUportUser: string;
  congnitoID: any;
  userRole: any;
  email_id: any;
  profile_img: string;

  constructor(
    private __http: HttpClient,
    private __authService: AuthService,
    private __idptProfileService: IndeptProfileService,
    private __empProfileService: EmpProfileService,
    private __partProfileService: PartProfileService
  ) { 

    if (this.isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.email_id = user["email"];
      this.userRole = user["custom:role"];
    } else {
      this.email_id = localStorage.getItem("email");
      this.userRole = localStorage.getItem("role");
    }

  }

  async getCountryList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/countries`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getStateList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/states`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }
  
  async getCityList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/cities`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getEducationCategoryList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/edu-domains`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getEducationTypeList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/edu-types`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  
  async getSkillDomainList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/domains`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }


  getHeaderImage(){
    if (this.userRole == "Freelancer") {
     this.__idptProfileService.getFreelancerByEmail().then((resData: any) => {
       this.profile_img =atob(resData.responseObject.freelancerProfile.photo);
     });
   } else if (this.userRole == "Employer") {
     this.__empProfileService.getEmployerByEmailId().then((resData: any) => {
       this.profile_img =atob(resData.responseObject.freelancerProfile.photo);
     });
   } else {
     this.profile_img = '../../../assets/images/bule_img.png';
   }
 }
  
  async getSkillTypeList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/skills`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getPersonalAttributeList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/personal-attributes`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getCurrencyList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/currency`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  
  async getLanguageList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/languages`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getDocumentList() {
    try {
      let res = await this.__http.get(`${SPRING_URL}/master/document-types`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }
  async getAvgRateForSkill(country:any , skill:any) {
    try {
      const parameters = "country="+country+"&"+"skill="+skill;
      console.log("parameters",parameters);
      
      let res = await this.__http.post(`${SPRING_AVG_RATE_URL}/salary?${parameters}`, httpOptions).toPromise();
      // let res = await this.__http.post(`${SPRING_AVG_RATE_URL}/`, httpOptions).toPromise();

      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }
  // Error Handler
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(" Error : ", errorMessage);
    return throwError(errorMessage);
  }
}
