import { Injectable, NgZone } from '@angular/core';
import { SseService } from './sse.service'
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SPRING_URL } from 'src/app/constant/constant-url';

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
export class EventSourceService {

  eventURL: string;
  eventName: string;
  springurl: any;

  constructor(
    private __http: HttpClient,
    private __zone: NgZone,
    private __sseService: SseService
  ) { }

  getServerSentEvent() {
    // this.eventURL = this.__http.post(`${SPRING_URL}/event/chat`, httpOptions);
    // console.log("fkghkfdkgjhfdh", this.eventURL);
    this.eventURL = `${SPRING_URL}/event/chat`;
    this.eventName = 'second';
    return Observable.create(observer => {
      // const eventSource = this.__sseService.getEventSource(this.eventURL);
      const eventSource = new EventSource(this.eventURL);
      console.log("dbkghjfdhjghkjhfdghlfdhgl");

      eventSource.addEventListener(this.eventName, (event: any) => this.__zone.run(() => {
        console.log("EVENTNAME fdgdfgfdgfd:", event);
        observer.next(JSON.parse(event.data));
        // eventSource.close();
      }));

      eventSource.onmessage = event => {
        this.__zone.run(() => {
          observer.next(JSON.parse(event.data));
          // eventSource.close();
        })
      }

      eventSource.onerror = error => {
        this.__zone.run(() => {
          // if (eventSource.readyState === eventSource.CLOSED) {
          console.log('The stream has been closed by the server.');
          //   // eventSource.close();
          //   observer.complete();
          // } else {
          observer.error(error);
          // }
        })
      }
      return () => eventSource.close();
    })
  }
}
