import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';


//Constant URL
import { BASE_URL } from '../../../../../constant/constant-url';
// import { BASE_URL_ADDRESS } from '../../../../../constant/constant-url';
import { BLOCKCHAIN_URL } from '../../../../../constant/constant-url';
import { UPORT_URL } from '../../../../../constant/constant-url';
import { AWS_URL } from '../../../../../constant/constant-url';

//CORS
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
  })
};

@Injectable({
  providedIn: 'root'
})

export class EmpProfileService {

  constructor(
    private __http: HttpClient
  ) { }

  // Blockchain POST API call
  async postDocHashData(fileData: any, cognitoId: any, fileName: any) {
    try {
      let formData = new FormData();
      formData.append('fileData', fileData);
      formData.append('cognitoId', cognitoId);
      formData.append('fileName', fileName);

      let res = await this.__http.post(`${BLOCKCHAIN_URL}/sendHash/`, formData).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

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

  async getEmployerFileById(id: number) {
    try {
      let result = await this.__http.get(`${BASE_URL}/employerfiles/` + id, httpOptions).toPromise();
      return result;
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

  async getEmployerByEmailId(email: string) {
    try {
      let res = await this.__http.get(`${BASE_URL}/employer/` + email, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async createEmployer(employerData: any) {
    try {
      let result = await this.__http.post(`${BASE_URL}/employers`, employerData, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateEmployer(id: number, employerData: any) {
    try {
      let result = await this.__http.put(`${BASE_URL}/employer/` + id, employerData, httpOptions).toPromise();
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

  // Employer country GET API call
  async getEmpCountry() {
    try {
      let res = await this.__http.get(`${BASE_URL}/countries`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Employer state by country id GET API call
  async getEmpStateByID(id: number) {
    try {
      let res = await this.__http.get(`${BASE_URL}/states/${id}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Employer city by state id GET API call
  async getEmpCityByID(id: number) {
    try {
      let res = await this.__http.get(`${BASE_URL}/cities/${id}`, httpOptions).toPromise();
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
