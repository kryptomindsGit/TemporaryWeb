import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

//Constant URL
import { BASE_URL } from '../../../../../constant/constant-url';
// import { BASE_URL_ADDRESS } from '../../../../../constant/constant-url';
import { BLOCKCHAIN_URL } from '../../../../../constant/constant-url';
import { UPORT_URL } from '../../../../../constant/constant-url';
import { AWS_URL } from '../../../../../constant/constant-url';


//CORS
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
  })
};


@Injectable({
  providedIn: 'root'
})
export class WorkPackageService {



  constructor() { }
}
