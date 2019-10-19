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


//CORS
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Access-Control-Allow-Origin': '*',
//     'enctype': 'multipart/form-data',
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
//   })
// };

@Injectable({
  providedIn: 'root'
})

export class IndeptProfileService {

  token :String;

  constructor(
    private __http: HttpClient
  ) { 
    }

    httpOptions = {
      headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'enctype': 'multipart/form-data',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'X-Autherization':localStorage.getItem('userAuthToken')
    })} 

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
      let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerquality/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof skills by id GET API call
  async getFreelancerSkillById(id: any): Promise<any> {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerskills/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof education by id GET API call
  async getFreelancerEducname(id: any): Promise<any> {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/education/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof education category GET API call
  async getFreelancerEduCat(): Promise<any> {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/educat`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent freelancer education data list GET API call
  async getFreelancerEduList(): Promise<any> {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/education`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof skills by id GET API call
  async getFreelancerSkills(id: any): Promise<any> {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/skills/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // // Independent Prof skill category GET API call
  // async getFreelancerCategory() {
  //   try {
  //     let res = await this.__http.get(`${BASE_URL}/freelancer/skillcat`, httpOptions).toPromise();
  //     return res;
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }

  // Independent Prof documents by id GET API call
  async getFreelancerDocumentByCat(id: any) {
    try {
      console.log("doc cat id : " + id);

      let res = await this.__http.get(`${SPRING_URL}/master/document-type/` + id, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof documents by id GET API call
  async getFreelancerDocumentById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/freelancerfile/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof education by id GET API call
  async getFreelancerEduById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/freelanceredu/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof portfolio by id GET API call
  async getFreelancerPortfolioById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/portfolio/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof organization by id GET API call
  async getFreelancerOrgById(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/freelancer/org/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof country GET API call
  async getFreelancerCountry() {
    try {
      let res = await this.__http.get(`${BASE_URL}/countries`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof state by country id GET API call
  async getFreelancerStateByID(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/states/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof city by state id GET API call
  async getFreelancerCityByID(id: any) {
    try {
      let res = await this.__http.get(`${BASE_URL}/cities/${id}`, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // Independent Prof by email id GET API call
  async getFreelancerByEmail(email: any) {
    
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
      let res = await this.__http.get(`${SPRING_URL}/freelancer/${email}`, httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  // async getFreelancerById(id: any) {
  //   try {
  //     let res = await this.__http.get(`${BASE_URL}/freelancer/freelancers/${id}`, httpOptions).toPromise();
  //     return res;
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }

  // async getFreelancerByEmail(email: string) {
  //   try {

  //     let res = await this.__http.get(`${BASE_URL}/freelancer/freelancers/${email}`, httpOptions).toPromise();

  //     console.log("Email sending to retrive database info "+ email);

  //     return res;
  //   } catch (error) {
  //     await this.handleError(error);
  //   }
  // }

  async savePersonalDetails(freelancer: any) {
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/profile`, freelancer, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async saveEducationDetails(freelancer: any) {
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/education`, freelancer, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async saveWorkDetails(freelancer: any) {
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/work-experience`, freelancer,this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async saveSkillDetails(freelancer: any) {
    try {
      let res = await this.__http.post(`${SPRING_URL}/freelancer/skills`, freelancer, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }


  async updateFreelancer(id: any, freelancer: any) {
    try {
      let res = await this.__http.put(`${BASE_URL}/freelancer/freelancers/${id}`, freelancer, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteFreelancer(id: any) {
    try {
      let res = await this.__http.delete(`${BASE_URL}/freelancers/${id}`, this.httpOptions).toPromise();
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
