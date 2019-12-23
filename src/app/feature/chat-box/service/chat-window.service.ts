import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import * as io from 'socket.io-client';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { NODE_URL_CHAT_WEB_RTC } from '../../../constant/constant-url';

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
    console.log("Node chat IP:", NODE_URL_CHAT_WEB_RTC);

    this.socket = io(`${NODE_URL_CHAT_WEB_RTC}`, {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 1,
      transports: ['websocket'], // default is ['polling', 'websocket']
      rejectUnauthorized: false
    });

    this.onInit();
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
    console.log("File in Service:", file);

    this.socket.emit('file', file);
  }

  public receiveFile = () => {
    return Observable.create((observer: any) => {
      this.socket.on('file', (file: any) => {
        observer.next(file);
      });
    });
  }

  // API's calls 
  async messageToTranslantion(senderMessage: any) {
    console.log("senderMessage:", senderMessage);
    try {
      console.log("service side messages: ", senderMessage);
      let res = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/translation`, senderMessage, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  joinRoom(data: any) {
    console.log("Inside Join Room - Service", data);
    this.socket.emit('join-room', data);
    return new Observable(observer => {
      this.socket.on('join-room', (data) => {
        observer.next(data);
      });
    })
  }

  /**
   * @name createRoom
   * @param createRoomData 
   */
  async createRoom(createRoomData: any) {
    // console.log("Data of create room:", createRoomData);
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/create-room`, createRoomData, httpOptions).toPromise();
      console.log("result of create room:", result);
      return result;

    } catch (error) {
      await this.handleError(error);
    }
  }


  /**
   * @name isRoomAvailable
   * @param isRoomAvailableData 
   */
  async isRoomAvailable(isRoomAvailableData: any) {
    // console.log("Data of is room available:", isRoomAvailableData);
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/room-available`, isRoomAvailableData, httpOptions).toPromise();
      console.log("Result of Room available:", result);

      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * @name showRoomAvailable
   * @param showRoomAvailableData 
   */
  async showRoomAvailable(showRoomAvailableData: any) {
    // console.log("Data to get room details:", showRoomAvailableData);
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/show-rooms`, showRoomAvailableData, httpOptions).toPromise();
      console.log("result for show-rooms", result);
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
  * @name getRoomInfo
  * @param getRoomAvailableData 
  */
  async getRoomInfo(getRoomAvailableData: any) {
    // console.log("Data of Join room:", getRoomAvailableData);
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/get-room`, getRoomAvailableData, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * @name sendMessageToCasssandra
   * @param sendMessageToCasssandraData 
   */
  async sendMessageToCassandra(sendMessageToCasssandraData: any) {
    // console.log("Data of send message to cassandra:", sendMessageToCasssandraData);
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/save-msg`, sendMessageToCasssandraData, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }

  /**
   * @name sendMessageToReceivedMessageCassandra
   * @param sendMessage 
   */
  async sendMessageToReceivedMessageCassandra(sendMessage: any) {
    // console.log("Data of get message from cassandra:", sendMessage);
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/received-msg`, sendMessage, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }


/************************Fetching Messages from chat-Msg Table(Cassandra)************************** */
 /**
 * @name getMessageFromCasssandra
 * @author Shefali Bhavekar
 * @date 21-12-2019
 */
  async getSentMessages(data:any) {
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/get-msg`, data, httpOptions).toPromise();
      return result;
    } catch (error) {
      await this.handleError(error);
    }
  }


  /************************Fetching Messages from Recived-Msg Table(Cassandra)************************** */
 /**
 * @name getRecievedMessage
 * @author Shefali Bhavekar
 * @date 21-12-2019
 */

  async getRecievedMessages(data: any){
    try {
      let result = await this.__http.post(`${NODE_URL_CHAT_WEB_RTC}/get-received-msg`, data, httpOptions).toPromise();
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
