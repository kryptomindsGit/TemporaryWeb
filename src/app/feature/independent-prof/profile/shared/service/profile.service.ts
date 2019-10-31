import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

//Constant URL
import { BASE_URL } from '../../../../../constant/constant-url';
import { SPRING_URL } from '../../../../../constant/constant-url';
// import { BASE_URL_ADDRESS } from '../../../../../constant/constant-url';
import { BLOCKCHAIN_URL } from '../../../../../constant/constant-url';
import { UPORT_URL } from '../../../../../constant/constant-url';
import { AWS_URL } from '../../../../../constant/constant-url';
import { AbstractControl } from '@angular/forms';
// import { Moment } from 'moment';


// /CORS
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  })
};

@Injectable({
  providedIn: 'root'
})

export class IndeptProfileService {

  token :String;

  constructor(
    private __http: HttpClient
  ) { 
    }

    

  // Blockchain POST API call
  async postDocHashData(fileData: any, cognitoId: any, fileName: any) {
    console.log("file Data:", fileName);
    console.log("file Data:", cognitoId);
    console.log("file Data:", fileName);

    try {
      let formData = new FormData();
      formData.append('fileData', fileData);
      formData.append('cognitoId', cognitoId);
      formData.append('fileName', fileName);

      // let formData = {
      //   fileData : fileData,
      //   cognitoId : cognitoId,
      //   fileName : fileName
      // }
      console.log(formData);
      
      let res = await this.__http.post(`${BLOCKCHAIN_URL}/sendHash/`, formData).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Blockchain GET API call
  async getDocHashData(id): Promise<any> {
    try {
      let res = await this.__http.get(`${BLOCKCHAIN_URL}/getHash/${id}`,
        { responseType: 'blob', observe: 'response' as 'body' }).toPromise();

      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }


  // Independent Prof by email id GET API call
  async getFreelancerByEmail() {
    
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })} 

    console.log("http-options : ",httpOptions);
    
    try {
      let res = await this.__http.get(`${SPRING_URL}/freelancer/view-profile`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }
  async savePersonalDetails(freelancer: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })}
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/profile`, freelancer, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async saveEducationDetails(freelancer: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })}
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/education`, freelancer, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async saveWorkDetails(freelancer: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })}
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/work-experience`, freelancer,httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async saveSkillDetails(freelancer: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })}
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/skills`, freelancer, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  
  async updateProfileInfo(freelancer: any) {
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })}
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/profile-update`, freelancer, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateEducationDetails(freelancer: any){
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })}
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/education-update`, freelancer, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateWorkDetails(freelancer: any){
    const httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Authorization':localStorage.getItem('userAuthToken')
    })}
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/work-update`, freelancer, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getFreelancerDocumentByCat(id: any) {
    try {
      console.log("doc cat id : " + id);

      let res = await this.__http.get(`${SPRING_URL}/master/document-type/` + id, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }








































  
  // Independent Prof documents by id GET API call
  

  // Independent Prof documents by id GET API call
  async getFreelancerDocumentById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerfile/${id}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof education by id GET API call
  async getFreelancerEduById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/freelanceredu/${id}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof portfolio by id GET API call
  async getFreelancerPortfolioById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/portfolio/${id}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof organization by id GET API call
  async getFreelancerOrgById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/org/${id}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof country GET API call
  async getFreelancerCountry() {
    try {
      let res = await this.__http.get(`${BASE_URL}/countries`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof state by country id GET API call
  async getFreelancerStateByID(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/states/${id}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof city by state id GET API call
  async getFreelancerCityByID(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/cities/${id}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

// Independent Prof files by id GET API call
async getFreelancerFiles(id: any): Promise<any> {
  try {
    let res = await this.__http.get(`${BASE_URL}/freelancerfile/${id}`, { responseType: 'arraybuffer' }).toPromise();
    return res;
  } catch (error) {
    await this.handleError(error);
  }
}

// Independent Prof quality by id GET API call
async getFreelancerQuality(id: any): Promise<any> {
  try {
    let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerquality/${id}`, httpOptions).toPromise();
    return res;
  } catch (error) {
    await this.handleError(error);
  }
}

// Independent Prof skills by id GET API call
async getFreelancerSkillById(id: any): Promise<any> {
  try {
    let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerskills/${id}`, httpOptions).toPromise();
    return res;
  } catch (error) {
    await this.handleError(error);
  }
}

// Independent Prof education by id GET API call
async getFreelancerEducname(id: any): Promise<any> {
  try {
    let res = await this.__http.get(`${BASE_URL}/freelancer/education/${id}`, httpOptions).toPromise();
    return res;
  } catch (error) {
    await this.handleError(error);
  }
}

// Independent Prof education category GET API call
async getFreelancerEduCat(): Promise<any> {
  try {
    let res = await this.__http.get(`${BASE_URL}/freelancer/educat`, httpOptions).toPromise();
    return res;
  } catch (error) {
    await this.handleError(error);
  }
}

// Independent freelancer education data list GET API call
async getFreelancerEduList(): Promise<any> {
  try {
    let res = await this.__http.get(`${BASE_URL}/freelancer/education`, httpOptions).toPromise();
    return res;
  } catch (error) {
    await this.handleError(error);
  }
}

// Independent Prof skills by id GET API call
async getFreelancerSkills(id: any): Promise<any> {
  try {
    let res = await this.__http.get(`${BASE_URL}/freelancer/skills/${id}`, httpOptions).toPromise();
    return res;
  } catch (error) {
    await this.handleError(error);
  }
}

  async updateFreelancer(id: any, freelancer: any) {
    try {
      let res = await this.__http.put(`${BASE_URL}/freelancer/freelancers/${id}`, freelancer, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteFreelancer(id: any) {
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
    console.log(" Error : ", errorMessage);
    return throwError(errorMessage);
  }

}
