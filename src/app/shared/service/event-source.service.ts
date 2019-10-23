import { Injectable, NgZone } from '@angular/core';
import { SseService } from './sse.service'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventSourceService {

  constructor(
    private __zone: NgZone,
    private __sseService: SseService
  ) { }

  getServerSentEvent(url: string) {
    return Observable.create(observer => {
      const eventSource = this.__sseService.getEventSource(url);

      eventSource.onmessage = event => {
        this.__zone.run(() => {
          observer.next(event)
        })
      }

      eventSource.onerror = error => {
        this.__zone.run(() => {
          observer.error(error)
        })
      }

    })
  }
}
