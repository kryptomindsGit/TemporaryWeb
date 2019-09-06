import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

//import URL from custome url file.
import { BASE_URL } from '../../../../../constant/constant-url';
import { BASE_URL_ADDRESS } from '../../../../../constant/constant-url';
import { BLOCKCHAIN_URL } from '../../../../../constant/constant-url';
import { AWS_URL } from '../../../../../constant/constant-url';


//CORS
const httpOptions = { 
  headers: new HttpHeaders({ 
  'Access-Control-Allow-Origin':'*',
  'enctype': 'multipart/form-data',
  'Content-Type':'application/json',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
  })
}; 

@Injectable({
  providedIn: 'root'
})

export class IndeptProfileService {

  constructor(
    private __http: HttpClient
  ) { }


  // Blockchain POST API call
  async postDocHashData(fileData: any, cognitoId: any, fileName: any){
    try {
    let formData = new FormData();
    formData.append('fileData', fileData);
    formData.append('cognitoId', cognitoId);
    formData.append('fileName', fileName);
    
    let res = await this.__http.post(`${BLOCKCHAIN_URL}/sendHash/`,formData, ).toPromise();  
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Blockchain GET API call
  async getDocHashData(id):Promise<any> {
    try {
      let res = await this.__http.get(`${BLOCKCHAIN_URL}/getHash/${id}`, 
      {responseType: 'blob',observe: 'response' as 'body'}).toPromise();
      
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof files by id GET API call
  async getFreelancerFiles(id: number):Promise<any> {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancerfile/${id}`, {responseType:'arraybuffer'}).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof quality by id GET API call
  async getFreelancerQuality(id: number):Promise<any> {
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerquality/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

  // Independent Prof skills by id GET API call
    async getFreelancerSkillById(id: any):Promise<any> {
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerskills/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof education by id GET API call
    async getFreelancerEducname(id: number): Promise<any>{
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/education/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof education category GET API call
    async getFreelancerEduCat(): Promise<any>{
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/educat`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof skills by id GET API call
    async getFreelancerSkills(id: number): Promise<any>{
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/skills/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof skill category GET API call
    async getFreelancerCategory(){
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/skillcat`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof documents by id GET API call
    async getFreelancerDocumentByCat(id: number){
      try {
        console.log("doc cat id : " + id );
        
        let res = await this.__http.get(`${BASE_URL}/freelancer/doctypes/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof documents by id GET API call
    async getFreelancerDocumentById(id: number){
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancerfile/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof education by id GET API call
    async getFreelancerEduById(id: any){
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/freelanceredu/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof portfolio by id GET API call
    async getFreelancerPortfolioById(id: number){
      try {
        let res = await this.__http.get(`${BASE_URL}/portfolio/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof organization by id GET API call
    async getFreelancerOrgById(id: number){
      try {
        let res = await this.__http.get(`${BASE_URL}/org/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof country GET API call
    async getFreelancerCountry(){
      try {
        let res = await this.__http.get(`${BASE_URL_ADDRESS}/countries`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof state by country id GET API call
    async getFreelancerStateByID(id: number){
      try {
        let res = await this.__http.get(`${BASE_URL_ADDRESS}/states/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof city by state id GET API call
    async getFreelancerCityByID(id: number){
      try {
        let res = await this.__http.get(`${BASE_URL_ADDRESS}/cities/${id}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    // Independent Prof by email id GET API call
    async getFreelancerByEmail(email: any) {
      try {
        let res = await this.__http.get(`${BASE_URL}/freelancer/freelancers/${email}`, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }
    // async getFreelancerByEmail(email: string) {
    //   try {

    //     let res = await this.__http.get(`${BASE_URL}/freelancer/freelancers/${email}`, httpOptions).toPromise();

    //     console.log("Email sending to retrive database info "+ email);
      
    //     return res;
    //   } catch (error) {
    //     await this.handleError(error);
    //   }
    // }

    async createFreelancer(freelancer: any) {
      try {
        let res = await this.__http.post(`${BASE_URL}/freelancer/freelancers`, freelancer, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    async updateFreelancer(id: any, freelancer: any) {
      try {
        let res = await this.__http.put(`${BASE_URL}/freelancers/${id}`, freelancer, httpOptions).toPromise();
        return res;
      } catch (error) {
        await this.handleError(error);
      }
    }

    async deleteFreelancer(id: number) {
      try {
        let res = await this.__http.delete(`${BASE_URL}/freelancers/${id}`, httpOptions).toPromise();
        return res;
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
      console.log(" Error : ",errorMessage);
      return throwError(errorMessage);
    }

}
