import { Injectable, NgZone } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// Constan URL's call
import { SPRING_URL } from '../../../constant/constant-url';

//CORS Handler


// const httpOptions = {
//   headers: new HttpHeaders({
//     'Access-Control-Allow-Origin': '*',
//     'enctype': 'multipart/form-data',
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
//     'X-Autherization': localStorage.getItem('userAuthToken')
//   })
// }


@Injectable({
  providedIn: 'root'
})

export class ChatWindowService {

  tokenAuth: any;
  EVENT_URL: any;
  eventName: any;

  constructor(
    private __http: HttpClient,
    private zone: NgZone
  ) {

    this.EVENT_URL = `${SPRING_URL}/event/chat`;
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.tokenAuth = localStorage.getItem('userAuthToken');
  }

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


  eventListenWatch(): Observable<object> {
    return Observable.create((observer) => {
      const eventSource = new EventSource(this.EVENT_URL);
      // this.eventName = 'receiver3';
      // var post_request = new XMLHttpRequest();
      // eventSource.open("POST", this.EVENT_URL);
      // eventSource.setRequestHeader("Content-Type", "application/json");
      // eventSource.addEventListener(this.eventName, (event: any) => this.zone.run(() => {
      //   console.log("EVENTNAME fdgdfgfdgfd:", event);
      //   observer.next(JSON.parse(event.data));
      //   eventSource.close();
      // }));
      // eventSource.onopen = (event) => this.zone.run(() => {
      //   console.log("EVENT:", event);
      //   observer.next(JSON.parse(event.data));
      //   eventSource.close();
      // });
      eventSource.onmessage = (event) => this.zone.run(() => {
        console.log("EVENT jhdfjsdkhfkjhdskfh:", event);
        observer.next(JSON.parse(event.data));
        eventSource.close();
      });
      eventSource.onerror = error => this.zone.run(() => {
        // console.log("TEST dsgkjdsbngkdsfb");
        if (eventSource.readyState === eventSource.CLOSED) {
          // console.log('The stream has been closed by the server.');
          eventSource.close();
          observer.complete();
        } else {
          observer.error(error);
        }
      });
      return () => eventSource.close();
    });
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
