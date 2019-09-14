import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { SPRING_URL } from '../../../constant/constant-url';

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


  async postMilestoneData(milestoneData : any):Promise<any> {
    console.log("milestone Data :" , milestoneData);
    
    try {
    let res = await this.http.post(`${SPRING_URL}/milestone/save`, milestoneData , httpOptions).toPromise();
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
