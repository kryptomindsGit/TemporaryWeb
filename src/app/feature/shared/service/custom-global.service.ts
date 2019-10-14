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

@Injectable({
  providedIn: 'root'
})
export class CustomGlobalService {

  constructor(
    private __http: HttpClient
  ) { }

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
