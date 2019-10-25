import { Injectable, NgZone } from '@angular/core';
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
    private __zone: NgZone
  ) { }

  getServerSentEvent() {
    // this.eventURL = this.__http.post(`${SPRING_URL}/event/chat`, httpOptions);
    // console.log("fkghkfdkgjhfdh", this.eventURL);
    this.eventURL = `${SPRING_URL}/memory/chat`;
    this.eventName = 'second';
    return Observable.create(observer => {
      // const eventSource = this.__sseService.getEventSource(this.eventURL);
      const eventSource = new EventSource(this.eventURL);

      eventSource.addEventListener(this.eventName, (event: any) => this.__zone.run(() => {
        console.log("on addEventListener function", event.data);
        // observer.next(JSON.parse(event.data));
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
      // return () => eventSource.close();
    })
  }
}
