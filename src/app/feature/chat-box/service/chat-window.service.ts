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
  springurl: any;
  myData: any;

  constructor(
    private __http: HttpClient,
    private __zone: NgZone
  ) {

    this.EVENT_URL = `${SPRING_URL}/event/chat`;
    this.__zone = new NgZone({ enableLongStackTrace: false });
    this.tokenAuth = localStorage.getItem('userAuthToken');
  }

  // POST API call
  async senderUserMessage(senderMessage: any) {
    try {
      let res = await this.__http.post(`${SPRING_URL}/translation?`, senderMessage).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  getServerSentEvent() {
    // this.eventURL = this.__http.post(`${SPRING_URL}/event/chat`, httpOptions);
    // console.log("fkghkfdkgjhfdh", this.eventURL);
    this.EVENT_URL = `${SPRING_URL}/event/chat`;
    this.eventName = 'translation';
    return Observable.create(observer => {
      // const eventSource = this.__sseService.getEventSource(this.eventURL);
      const eventSource = new EventSource(this.EVENT_URL);

      eventSource.addEventListener(this.eventName, (event: any) => this.__zone.run(() => {
        console.log("on addEventListener function", event.data);
        // this.myData = JSON.parse(event.data);
        observer.next(JSON.parse(event.data));
        // observer.next(event.data);
        // eventSource.close();

      }));

      // eventSource.onmessage = (event: any) => {
      //   this.__zone.run(() => {
      //     console.log("on message function", event.data);
      //     observer.next(event);
      //     // observer.next(JSON.parse(event.data));
      //     // eventSource.close();
      //   })
      // }

      // eventSource.onopen = (event: any) => {
      //   this.__zone.run(() => {
      //     observer.next(event);
      //     // observer.next(JSON.parse(event.data));
      //     eventSource.close();
      //     console.log("on open function", event);
      //   })
      // }

      eventSource.onerror = error => {
        this.__zone.run(() => {
          if (eventSource.readyState === eventSource.CLOSED) {
            console.log("on error function");
            // eventSource.close();
            observer.complete();
          } else {
            observer.error(error);
          }
        })
      }
      return () => eventSource.close();
    })
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
