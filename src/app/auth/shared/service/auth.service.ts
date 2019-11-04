import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

//Constant URL
import { BASE_URL } from '../../../constant/constant-url';
import { UPORT_URL } from '../../../constant/constant-url';
import { AWS_URL } from '../../../constant/constant-url';
import { SPRING_URL } from '../../../constant/constant-url';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private __http: HttpClient,

  ) { }

  login(loginPayload): any {
    return this.__http.post<{ response: string }>(`${AWS_URL}/login`, loginPayload, httpOptions)
      .pipe(
        map(result => {
          // console.log("Response :", result.response['jwtToken']);

          localStorage.setItem('access_token', result.response['jwtToken']);
          return result;
        })
      );
  }

  async register(userInfo: any) {
    console.log("aws cognito register method");

    try {
      let res = await this.__http.post(`${AWS_URL}/signup`, userInfo, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('access_token') != null;
  }

  logout() {
    localStorage.clear();
  }

  decode() {
    return decode(localStorage.getItem('access_token'));
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  //uPort REST API calls
  async uporService(): Promise<any> {
    try {
      let result = await this.__http.post(`${UPORT_URL}/login`, { responseType: 'text' }).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async saveSignUpData(user: any): Promise<any> {
    try {
      let result = await this.__http.post(`${SPRING_URL}/auth/signup`, user, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getUserLoginData(payload: any): Promise<any> {
    try {
      let result = await this.__http.post(`${SPRING_URL}/auth/login`, payload, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  
  async getAllFreelancers(): Promise<any> {
    try {
      let result = await this.__http.post(`${SPRING_URL}/auth/allFree`, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getAllEmployers(): Promise<any> {
    try {
      let result = await this.__http.post(`${SPRING_URL}/auth/allEmp`, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }


  async updateUserData(payload: any): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({     
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin': '*',
        'X-Authorization': localStorage.getItem('userAuthToken')
      })
    };

    try {
      let result = await this.__http.post(`${SPRING_URL}/freelancer/user-update`, payload, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }


  async getSecurityToken(payload: any): Promise<any> {
    try {
      let result = await this.__http.post(`${SPRING_URL}/auth/getToken`, payload, httpOptions).toPromise();
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
