import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';

//Constant URL
import { BASE_URL } from '../../../../../constant/constant-url';
// import { BASE_URL_ADDRESS } from '../../../../../constant/constant-url';
// import { BLOCKCHAIN_URL } from '../../../../../constant/constant-url';
// import { UPORT_URL } from '../../../../../constant/constant-url';
// import { AWS_URL } from '../../../../../constant/constant-url';
import { SPRING_URL } from '../../../../../constant/constant-url';

//CORS
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    // 'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
  })
};


@Injectable({
  providedIn: 'root'
})
export class WorkPackageService {



  constructor(
    private http: HttpClient
  ) { }

  async postWorkPackageData(packageData : any):Promise<any> {
    console.log("Package Data :" , packageData);
    
    try {
      let res = await this.http.post(`${SPRING_URL}/workpackage/wp-save`, packageData , httpOptions).toPromise();
      return res;
    } catch (error) {
      this.handleError(error);      
    }
  }
  async postWorkPackageSkillData(packageData:any , wpId:any):Promise<any> {
    console.log("Package Data :" , packageData, wpId);
    try {
      let res = await this.http.post(`${SPRING_URL}/workpackage/wp-skills/${wpId}`,packageData,httpOptions).toPromise();
      return res;
    } catch (error) {
      this.handleError(error);      
    }
  }

  //fetch using emial id latter
  async getWorkPackageData(workPackageId : number):Promise<any> {
    console.log("Package Data :" , workPackageId);
    
    try {
      let res = await this.http.get(`${SPRING_URL}/workpackage/wp-fetch/${workPackageId}`,httpOptions).toPromise();
      return res;
    } catch (error) {
      this.handleError(error);      
    }
  }

  async getSkillPackageData(workPackageSkillId : any):Promise<any> {
    console.log("Package Data :" , workPackageSkillId);
    
    try {
      let res = await this.http.get(`${SPRING_URL}/workpackage/wp-skills/${workPackageSkillId}`,httpOptions).toPromise();
      console.log("data " ,res);
      return res;
      
    } catch (error) {
      this.handleError(error);      
    }
  }

  //get all work packages
  async getAllWorkPackageData(email : any):Promise<any> {
    console.log("Package Data :" , email);
    
    try {
      let res = await this.http.get(`${SPRING_URL}/workpackage/wp-all`,httpOptions).toPromise();
      console.log("data " ,res);
      return res;
      
    } catch (error) {
      this.handleError(error);      
    }
  }

  //get all skills

async getAllSkills():Promise<any> {
    
    try {
      let res = await this.http.get(`${BASE_URL}/freelancer/skills`,httpOptions).toPromise();
      console.log("data " ,res);
      return res;
      
    } catch (error) {
      this.handleError(error);      
    }
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(" Error : ",errorMessage);
    return throwError(errorMessage);
  }

}
 