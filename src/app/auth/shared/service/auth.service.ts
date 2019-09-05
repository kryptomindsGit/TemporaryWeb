import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import decode from 'jwt-decode';

//Constant URL
import { BASE_URL } from '../../../constant/constant-url';
import { UPORT_HTML_URL } from '../../../constant/constant-url';
import { AWS_URL } from '../../../constant/constant-url';
import { throwError } from 'rxjs';

const httpOptions    = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
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
    private __http : HttpClient,

  ) { }

  login(loginPayload): any {
    return this.__http.post<{jwtToken: string}>(`${AWS_URL}login`, loginPayload, httpOptions)
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.jwtToken);
          return result;
        })
      );
  }

  async register(userInfo: any) {
    try {
      let res = await this.__http.post(`${AWS_URL}/signup`,userInfo, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // register(user: any) {
  //   return this.__http.post(`${AWS_URL}signup`, user, httpOptions);
  // }

  isAuthenticated(): boolean {
    return localStorage.getItem('access_token') != null;
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  decode() {
    return decode(localStorage.getItem('access_token'));
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }


  //uPort REST API calls
  async uporService():Promise <any>{
    try {
      let result = await this.__http.post(`${UPORT_HTML_URL}/login`,{responseType: 'text'}).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async uportSignup(user:any){;
    try {
      let result = await this.__http.post(`${BASE_URL}/uportsignup`, user, httpOptions);
      return result;
    } catch (error) {
      await this.handleError(error);
    } 
  }

  getUportInfo(email:any):any{
    try {
      let result = this.__http.get(`${BASE_URL}/uportsignup/${email}`,httpOptions);
      return result;
    } catch (error) {
      
    }
  }

  async updateDid(data:any){
    try {
      let result = await this.__http.put(`${BASE_URL}/uportsignup`,data,httpOptions);
      return result;
    } catch (error) {
      await this.handleError(error)
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
    console.log(" Error : ",errorMessage);
    return throwError(errorMessage);
  }

}
