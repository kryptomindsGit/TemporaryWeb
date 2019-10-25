import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SPRING_URL } from '../../../constant/constant-url';
import {DEPLOY_CONTRACT_URL} from '../../../constant/constant-url';
import {DEPLOY_CONTRACT_SAW_URL} from '../../../constant/constant-url';


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
export class SmartContractService {

  constructor(
    private http: HttpClient
  ) { }


  async postMilestoneData(milestoneData : any , id:any):Promise<any> {
    console.log("milestone Data :" , milestoneData);
    
    try {
    let res = await this.http.post(`${SPRING_URL}/milestone/save/${id}`, milestoneData , httpOptions).toPromise();
      console.log(`response befre return: ${res}`);
      console.log(`response befre return JSON.stringify: ${JSON.stringify(res)}`);
      return res;
    } catch (error) {
      this.handleError(error);      
    }
  }

  async postScheduleData(scheduleData : any):Promise<any> {
    console.log("schedule Data :" , scheduleData);
    
    try {
    let res = await this.http.post(`${SPRING_URL}/payment/schedule`, scheduleData , httpOptions).toPromise();
      return res;
    } catch (error) {
      this.handleError(error);      
    }
  }

  //fetch Milestones
  // async getEmployerFileById(id: any) {
  //   try {
  //     let result = await this.__http.get(`${BASE_URL}/employerfiles/` + id, httpOptions).toPromise();
  //     return result;
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }

  //deploy contract 
  async deployContractData(workId : any):Promise<any> {
    console.log("deploy Data :" , workId);
    
    try {
    let res = await this.http.post(`${DEPLOY_CONTRACT_URL}/deployContract`, workId , httpOptions).toPromise();
      return res;
    } catch (error) {
      this.handleError(error);      
    } 
  }

  //Deploy Milestone ethereum
  async deployMilestoneData(payload : any):Promise<any> {
    
    // console.log("schedule Data :" , payload);
    
    try {
    let res = await this.http.post(`${DEPLOY_CONTRACT_URL}/addMile`, payload,{responseType:'text'}).toPromise();
      return res;
    } catch (error) {
      this.handleError(error);      
    } 

  }

  async deployMilestoneData1(payload : any):Promise<any> {
    // console.log("schedule Data :" , payload);
    // console.log("schedule Data :" , JSON.stringify(payload));
    
    try {
    let res = await this.http.post(`${DEPLOY_CONTRACT_SAW_URL}/addmilestone`, payload,{responseType:'text'}).toPromise();
      return res;
    } catch (error) {
      this.handleError(error);      
    } 

  }

  
  async getMilestoneData(workPackageId : any):Promise<any> {
    console.log("schedule Data :" , workPackageId);
    
    try {
    let res = await this.http.get(`${SPRING_URL}/milestone/fetchAll/${workPackageId}`,{responseType:'json'}).toPromise();
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
