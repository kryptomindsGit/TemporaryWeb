// import { Injectable, NgZone } from '@angular/core';
// import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// // Constan URL's call
// import { SPRING_URL } from '../../../constant/constant-url';

// //CORS Handler


// // const httpOptions = {
// //   headers: new HttpHeaders({
// //     'Access-Control-Allow-Origin': '*',
// //     'enctype': 'multipart/form-data',
// //     'Content-Type': 'application/json',
// //     'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
// //     'X-Autherization': localStorage.getItem('userAuthToken')
// //   })
// // }


// @Injectable({
//   providedIn: 'root'
// })

// export class ChatWindowService {

//   tokenAuth: any;
//   EVENT_URL: any;
//   eventName: any;
//   springurl: any;
//   myData: any;

//   constructor(
//     private __http: HttpClient,
//     private __zone: NgZone
//   ) {

//     this.EVENT_URL = `${SPRING_URL}/event/chat`;
//     this.__zone = new NgZone({ enableLongStackTrace: false });
//     this.tokenAuth = localStorage.getItem('userAuthToken');
//   }

//   // POST API call
//   async senderUserMessage(senderMessage: any) {
//     try {
//       let res = await this.__http.post(`${SPRING_URL}/translation?`, senderMessage).toPromise();
//       return res;
//     } catch (error) {
//       await this.handleError(error);
//     }
//   }

//   getOnlineUserList() {
//     this.EVENT_URL = `${SPRING_URL}/event/chat`;
//     return Observable.create(observer => {
//       const eventSource = new EventSource(this.EVENT_URL);
//       eventSource.addEventListener('loggedIn', (event: any) => this.__zone.run(() => {
//         console.log("listening online users", event.data);
//         observer.next(JSON.parse(event.data));
//       }));

//       eventSource.onerror = error => {
//         this.__zone.run(() => {
//           if (eventSource.readyState === eventSource.CLOSED) {
//             console.log("on error function");
//             observer.complete();
//           } else {
//             observer.error(error);
//           }
//         })
//       }
//       return () => eventSource.close();
//     })
//   }

//   getServerSentEvent() {
//     this.EVENT_URL = `${SPRING_URL}/event/chat`;
//     this.eventName = 'translation';
//     return Observable.create(observer => {
//       const eventSource = new EventSource(this.EVENT_URL);

//       eventSource.addEventListener(this.eventName, (event: any) => this.__zone.run(() => {
//         // this.myData = JSON.parse(event.data);
//         observer.next(JSON.parse(event.data));
//         // observer.next(event.data);
//         // eventSource.close();

//       }));

//       // eventSource.onmessage = (event: any) => {
//       //   this.__zone.run(() => {
//       //     console.log("on message function", event.data);
//       //     observer.next(event);
//       //     // observer.next(JSON.parse(event.data));
//       //     // eventSource.close();
//       //   })
//       // }

//       // eventSource.onopen = (event: any) => {
//       //   this.__zone.run(() => {
//       //     observer.next(event);
//       //     // observer.next(JSON.parse(event.data));
//       //     eventSource.close();
//       //     console.log("on open function", event);
//       //   })
//       // }

//       eventSource.onerror = error => {
//         this.__zone.run(() => {
//           if (eventSource.readyState === eventSource.CLOSED) {
//             console.log("on error function");
//             // eventSource.close();
//             observer.complete();
//           } else {
//             observer.error(error);
//           }
//         })
//       }
//       return () => eventSource.close();
//     })
//   }

//   // Error Handler
//   handleError(error) {
//     let errorMessage = '';
//     if (error.error instanceof ErrorEvent) {
//       // client-side error
//       errorMessage = `Client Error: ${error.error.message}`;
//     } else {
//       // server-side error
//       errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
//     console.log(" Error : ", errorMessage);
//     return throwError(errorMessage);
//   }
// }


import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import * as io from 'socket.io-client';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { NODE_URL_CHAT } from '../../../constant/constant-url';


const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'X-Autherization': localStorage.getItem('userAuthToken')
  })
}

@Injectable({
  providedIn: 'root'
})
export class ChatWindowService {

  public socket: any;
  tokenAuth: any;
  EVENT_URL: any;
  eventName: any;
  springurl: any;
  myData: any;



  constructor(
    private __http: HttpClient,
    private __zone: NgZone
  ) {
    console.log("Node chat IP:", NODE_URL_CHAT);

    this.socket = io('http://192.168.0.3:3040', {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 1,
      transports: ['websocket'], // default is ['polling', 'websocket']
      rejectUnauthorized: false
    });

    this.onInit();
    // this.EVENT_URL = `${NODE_URL_CHAT}/event/chat`;
    // this.EVENT_URL = `${NODE_URL_CHAT}`;

    this.__zone = new NgZone({ enableLongStackTrace: false });
    this.tokenAuth = localStorage.getItem('userAuthToken');
  }

  public onInit() {
    this.socket.on('connect', () => {
      this.socket.emit("email", localStorage.getItem("email"));
      console.log('Connected to Server');
    });
    this.socket.on('connect_timeout', (timeout: any) => {
      console.log('Connection Timeout with : ', timeout);
    });
    this.socket.on('connect_error', (error: any) => {
      console.log('Connection Error : ', error);
    });
    this.socket.on('disconnect', (reason: any) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually by socket.connect()
        console.log('The disconnection was initiated by the server, server disconnected');
      } else {
        // else the socket will automatically try to reconnect
        console.log('Server Disconnected : ', reason);
      }
    });
    this.socket.on('reconnect', (attemptNumber: any) => {
      console.log('Socket Server Successfully Reconnected with attempt : ', attemptNumber);
    });
    this.socket.on('reconnect_attempt', (attemptNumber: any) => {
      console.log('Reconnect Attempt : ', attemptNumber);
    });
    this.socket.on('reconnecting', (attemptNumber: any) => {
      console.log('Attempting to Reconnect : ', attemptNumber);
    });
    this.socket.on('reconnect_error', (error: any) => {
      console.log('Reconnection Error : ', error);
    });
    this.socket.on('reconnect_failed', () => {
      console.log('Reconnection Failed');
    });
    this.socket.on('ping', () => {
      console.log('ping packet is written out to the server');
    });
    this.socket.on('pong', (latency: any) => {
      console.log('pong is received from the server in : ', latency);
    });
  }

  public getSocketId = () => {
    console.log("call Socket ID");

    return Observable.create((observer: any) => {
      this.socket.on('socketid', (message: any) => {
        console.log("socket id Resp", message);

        observer.next(message);
      });
    });
  }

  public getClients = () => {
    console.log("call client ID");

    this.socket.emit('clients');
    return Observable.create((observer: any) => {
      this.socket.on('clients', (clients: any) => {
        console.log("client id Resp", clients);

        observer.next(clients);
      });
    });
  }

  public sendOffer = (offer: any) => {
    this.socket.emit('offer', offer);
  }

  public receiveOffer = () => {
    return Observable.create((observer: any) => {
      this.socket.on('offer', (offer: any) => {
        observer.next(offer);
      });
    });
  }

  public sendAnswer = (answer: any) => {
    this.socket.emit('answer', answer);
  }

  public receiveAnswer = () => {
    return Observable.create((observer: any) => {
      this.socket.on('answer', (answer: any) => {
        observer.next(answer);
      });
    });
  }

  public sendIceCandidate = (candidate: any) => {
    this.socket.emit('icecandidate', candidate);
  }

  public receiveIceCandidate = () => {
    return Observable.create((observer: any) => {
      this.socket.on('icecandidate', (candidate: any) => {
        observer.next(candidate);
      });
    });
  }

  public sendFile = (file: any) => {
    this.socket.emit('file', file);
  }

  public receiveFile = () => {
    return Observable.create((observer: any) => {
      this.socket.on('file', (file: any) => {
        observer.next(file);
      });
    });
  }

  // POST API call
  // async senderUserMessage(senderMessage: any) {
  //   try {
  //     console.log("service side messages: ", senderMessage);

  //     let res = await this.__http.post(`${NODE_URL_CHAT}/translation`, senderMessage, httpOptions).toPromise();

  //     // this.socket.on(`${NODE_URL_CHAT}/translation`, () => {
  //     //   console.log('bhushan called');
  //     // });

  //     return res;
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }

  async callEventTranslation(senderMessage: any) {
    console.log("senderMessage:", senderMessage);
    try {
      console.log("service side messages: ", senderMessage);

      let res = await this.__http.post(`${NODE_URL_CHAT}/translation`, senderMessage, httpOptions).toPromise();

      // this.socket.on(`${NODE_URL_CHAT}/translation`, () => {
      //   console.log('bhushan called');
      // });

      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  gettingResult() {
    console.log("listeing traslated message");

    return new Observable(observer => {
      this.socket.on('translated', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  // gettingResult() {
  //   // let res = this.socket.on('translated', (messageData: any) => {
  //   //   console.log("resp from nodejs message :", messageData);
  //   // });
  //   // return res;

  //   return Observable.create((observer: any) => {
  //     this.socket.on('translated', (data: any) => {
  //       observer.next(data);
  //     });
  //     this.socket.off('translated', (data: any) => {
  //       observer.next(data);
  //     });
  //   });
  // }

  // listenTranslatedData() {

  // }

  // getOnlineUserList() {
  //   // this.EVENT_URL = `${NODE_URL_CHAT}/event/chat`;
  //   // this.EVENT_URL = `${NODE_URL_CHAT}`;

  //   return Observable.create(observer => {
  //     const eventSource = new EventSource(this.EVENT_URL);
  //     eventSource.addEventListener('loggedIn', (event: any) => this.__zone.run(() => {
  //       console.log("listening online users", event.data);
  //       observer.next(JSON.parse(event.data));
  //     }));

  //     eventSource.onerror = error => {
  //       this.__zone.run(() => {
  //         if (eventSource.readyState === eventSource.CLOSED) {
  //           console.log("on error function");
  //           observer.complete();
  //         } else {
  //           observer.error(error);
  //         }
  //       })
  //     }
  //     return () => eventSource.close();
  //   })
  // }

  // getServerSentEvent() {
  //   // this.EVENT_URL = `${SPRING_URL}/event/chat`;
  //   this.EVENT_URL = `${NODE_URL_CHAT}/event/chat`;

  //   this.eventName = 'translation';
  //   return Observable.create(observer => {
  //     const eventSource = new EventSource(this.EVENT_URL);

  //     eventSource.addEventListener(this.eventName, (event: any) => this.__zone.run(() => {
  //       this.myData = JSON.parse(event.data);
  //       observer.next(JSON.parse(event.data));

  //     }));

  //     eventSource.onerror = error => {
  //       this.__zone.run(() => {
  //         if (eventSource.readyState === eventSource.CLOSED) {
  //           console.log("on error function");
  //           observer.complete();
  //         } else {
  //           observer.error(error);
  //         }
  //       })
  //     }
  //     return () => eventSource.close();
  //   })
  // }


  createRoom(data:any){
    console.log("Inside Create Room");
    this.socket.emit("create-room",data);
    return new Observable(observer => {
      this.socket.on('create-room', (data) => {
        observer.next(data);
      });
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
