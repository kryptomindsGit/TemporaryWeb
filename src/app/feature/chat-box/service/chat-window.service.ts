import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { throwError } from 'rxjs';

// Constan URL's call
import { SPRING_URL } from '../../../constant/constant-url';


@Injectable({
  providedIn: 'root'
})

export class ChatWindowService {

  tokenAuth: any;

  constructor(
    private __http: HttpClient
  ) {
    this.tokenAuth = localStorage.getItem('userAuthToken');
  }

  //CORS Handler
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      // 'X-Authorization': localStorage.getItem('userAuthToken')
    })
  };


  // POST API call
  async senderUserMessage(senderMessage: any) {
    try {
      console.log("Req Data:", senderMessage);
      let res = await this.__http.post(`${SPRING_URL}/translation`, senderMessage).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // GET API call
  // async receiverUserMessage() {
  //   try {
  //     let res = await this.__http.get(`${SPRING_URL}/translate/`, this.httpOptions).toPromise();
  //     return res;
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }

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
