import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { throwError } from 'rxjs';


//Constant URL
import { BASE_URL } from '../../../../../constant/constant-url';
// import { BASE_URL_ADDRESS } from '../../../../../constant/constant-url';
import { BLOCKCHAIN_URL } from '../../../../../constant/constant-url';
import { UPORT_URL } from '../../../../../constant/constant-url';
import { AWS_URL } from '../../../../../constant/constant-url';
import { map } from 'rxjs/operators';
import { SPRING_URL } from '../../../../../constant/constant-url';

//CORS
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'X-Authorization':localStorage.getItem('userAuthToken')
  })
};

@Injectable({
  providedIn: 'root'
})

export class EmpProfileService {

  constructor(
    private __http: HttpClient
  ) { }

  //Blockchain POST API call
  // async postDocHashData(fileData: any, cognitoId: any, fileName: any) {
  //   try {
  //     let formData = new FormData();
  //     formData.append('fileData', fileData);
  //     formData.append('cognitoId', cognitoId);
  //     formData.append('fileName', fileName);

  //     let res = await this.__http.post(`${BLOCKCHAIN_URL}/sendHash/`, formData).toPromise();
  //     return res;
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }

  async postDocHashData(fileData: any, cognitoId: any, fileName: any) {
    try {
      let formData = new FormData();
      formData.append('fileData', fileData);
      formData.append('cognitoId', cognitoId);
      formData.append('fileName', fileName);

      let res = await this.__http.post(`${BLOCKCHAIN_URL}/sendHash/`, formData).toPromise();
      console.log("Resp service:", res);
      return res;


    } catch (error) {
      await this.handleError(error);
    }
  }

  // {
  //   reportProgress: true,
  //   observe: 'events'
  // }).pipe(map((event) => {

  //   switch (event.type) {

  //     case HttpEventType.UploadProgress:
  //       const progress = Math.round(100 * event.loaded / event.total);
  //       return { status: 'progress', message: progress };

  //     case HttpEventType.Response:
  //       return event.body;
  //     default:
  //       return `Unhandled event: ${event.type}`;
  //   }
  // })



  // ).pipe(map((event) => {

  //   switch (event.type) {

  //     case HttpEventType.UploadProgress:
  //       const progress = Math.round(100 * event.loaded / event.total);
  //       return { status: 'progress', message: progress };

  //     case HttpEventType.Response:
  //       return event.body;
  //     default:
  //       return `Unhandled event: ${event.type}`;
  //   }
  // })

  // Blockchain GET API call
  async getDocHashData(id): Promise<any> {
    try {
      let res = await this.__http.get(`${BLOCKCHAIN_URL}/getHash/${id}`,
        { responseType: 'blob', observe: 'response' as 'body' }).toPromise();

      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }


  async getEmployer() {
    try {
      let result = await this.__http.get(`${BASE_URL}/employers/`, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getEmployerByEmailId() {

    try {
      let res = await this.__http.get(`${SPRING_URL}/employer/profile-view`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async createEmployer(employerData: any) {
    try {
      let result = await this.__http.post(`${SPRING_URL}/employer/profile`, employerData, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateEmployer( employerData: any) {
    console.log("before send data: ", employerData);
    
    try {
      let result = await this.__http.post(`${SPRING_URL}/employer/profile-update` , employerData, httpOptions).toPromise();
      console.log("Res Value:", result);
      
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteEmployer(id: number) {
    try {
      let result = await this.__http.delete(`${BASE_URL}/employer/` + id, httpOptions).toPromise();
      return result;
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
