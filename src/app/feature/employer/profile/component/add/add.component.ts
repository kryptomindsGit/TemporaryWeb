import { Component, OnInit } from '@angular/core';
import { EmpProfileService } from '../../shared/service/profile.service';
import { IndeptProfileService } from '../../../../independent-prof/profile/shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';

//Custome global validation
import { GlobalValidationDirective } from '../../../../../shared/global-validation.directive';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  submitted = false;

  // FormGroup object's
  public employerProfileForm: FormGroup;

  //Variable's
  public addprofileemployer: any;
  public loading = false;

  public uid: any;
  public email_id: any;
  public country: any;
  public congnitoId: string;
  public fileName: string;
  public fileObj: any;
  public doc_cat_id: any;
  public FileArrData: any;
  public error: any;
  public docTypeArr: any = [];
  //Static Array's
  prefixArr = ['Mr', 'Mrs', 'Miss'];

  //Array's
  public documentFileArr: any = [];
  public stateArr: any = [];
  public countryArr: any = [];
  public cityArr: any = [];
  public fileType: any;

  public stateArrByCountryId=[];
  public cityArrByStateId = [];

  constructor(
    private __fb: FormBuilder,
    private __profileService: EmpProfileService,
    private __freelancerProfileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
    private __customGlobalService: CustomGlobalService
  ) { }

  ngOnInit() {

    let isUportUser = localStorage.getItem("uportUser");

    if (isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoId = user["cognito:username"];
      this.email_id = user["email"];
      this.uid = localStorage.getItem("uid");
    } else {
      this.congnitoId = "TEST"
      this.uid = localStorage.getItem("uid");
      this.email_id = localStorage.getItem("email");
      this.country = localStorage.getItem("country");
    }


    //Calling Function's
    this.valEmpProfile();
    this.getCountryList();
    this.getStateList();
    this.getCityList();
    this.getDocumentsTypeCat(4);
  }

  /**
   * @name valEmpProfile
   * @description validating the form fields
   */
  valEmpProfile() {
    this.employerProfileForm = this.__fb.group({
      comapany_name: ['', [Validators.required, Validators.maxLength(25)]],
      website_addr: ['', [Validators.required, Validators.maxLength(25)]],
      address_line_one: ['', [Validators.required, Validators.maxLength(25)]],
      address_line_two: ['', [Validators.required, Validators.maxLength(25)]],
      country: ['', [Validators.required, Validators.maxLength(25)]],
      state: ['', [Validators.required, Validators.maxLength(25)]],
      city: ['', [Validators.required, Validators.maxLength(25)]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(6)]],
      business_cat: ['', [Validators.required, Validators.maxLength(25)]],
      company_profile: ['', [Validators.required, Validators.maxLength(25)]],
      company_rep_det: ['', [Validators.required, Validators.maxLength(25)]],
      documents: this.__fb.array([this.__fb.group(
        {
          chooseFile: ['', [Validators.required, Validators.maxLength(25)]],
          docType: ['', [Validators.required, Validators.maxLength(25)]]
        }
      )]),
    })
  }

  // convenience getter for easy access to form fields
  get formValidation() { return this.employerProfileForm.controls; }

  /**
  * @description FormArray (Dynamicaly create input)
  */
  get documentArr() {
    return this.employerProfileForm.get('documents') as FormArray;
  }

  addDocument() {
    this.documentArr.push(this.__fb.group(
      {
        chooseFile: new FormControl(""),
        docType: new FormControl("")
      }
    ));
  }

  deleteDocument(index) {
    if (this.documentArr.length > 0) {
      this.documentArr.removeAt(index);
    } else {

    }

  }

  /**
  * @method getAllCountry
  * @description get all country values.
  */
  getCountryList() {
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.countryArr = resData.responseObject;
      console.log("Countries: ", this.countryArr);
      
    })
  }

  getStateList() {
    this.__customGlobalService.getStateList().then((resData: any) => {
      this.stateArr = resData.responseObject;
      console.log("State: ", this.stateArr);
      
    })
  }

  setStateListByCountryId(countryId) {
    console.log("id country" , countryId);
    this.stateArrByCountryId[countryId] = this.stateArr.filter((item) => item.masterCountry.countryId == countryId);
    console.log(this.stateArrByCountryId);
    // this.employerProfileForm.get('state')['controls'].patchValue({ countryId : this.stateArrByCountryId[countryId].masterCountry.countryId, stateId: '' });
  }

  getCityList() {
    this.__customGlobalService.getCityList().then((resData: any) => {
      this.cityArr = resData.responseObject;
      console.log("City: ", this.cityArr);
      
    })
  }

  setCityListByStateId(stateId) {
    console.log("id state" , stateId);
    this.cityArrByStateId[stateId] = this.cityArr.filter((item) => item.masterStates.stateId == stateId);
    console.log(this.cityArrByStateId);
    // this.employerProfileForm.get('state')['controls'].patchValue({ countryId : this.stateArrByCountryId[countryId].masterCountry.countryId, stateId: '' });
  }
  

  /**
    * @name 
    * @description file handler
    */
  setDocTypeCatType(inputValue) {
    console.log(inputValue);
    this.fileType = inputValue
  }

  /**
   * @method setDocTypeCatID
   * @param city_id
   * @description get the zipcode based on selected city id.
   */
  setDocTypeCatID(id) {
    console.log(this.doc_cat_id = id);
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      this.fileName = file.name.replace(" ", "");
      console.log("File name:", file.name, this.fileName);
      this.fileObj = file;
    }
  }


  async uploadFile() {
    this.loading = true;
    await this.__profileService.postDocHashData(this.fileObj, this.email_id, this.fileName).then((resData) => {
      // this.FileArrData = resData;
      this.loading = false;
      this.FileArrData = resData,
        (error) => this.error = error

      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }



      console.log("Resp data:", this.FileArrData.Message);
      console.log("File Resp:", this.FileArrData.fileId);
    });
    // this.FileArrData = "jkdhfjkhkdjshfkjhdskjfh"

    await this.documentFileArr.push(
      {
        'file_name': this.FileArrData.fileId,
        'file_type': this.doc_cat_id
      });
    console.log(this.documentFileArr);
  }


  /**
   * @name onSubmit
   * @description submit the form fileds values
   */
  onSubmit() {
    this.loading = true;
    console.log(this.employerProfileForm);
    let documensFile: any = [
      'file_name',
      'file_type'
    ];

    documensFile = [
      ...this.documentFileArr
    ];

  
    const employerProfileVal = {
      uid: this.uid,
      // emailId: this.email_id,
      emailId : "emp@employer.com",
      companyName: this.employerProfileForm.controls.comapany_name.value,
      website: this.employerProfileForm.controls.website_addr.value,
      addressOne: this.employerProfileForm.controls.address_line_one.value,
      addressTwo: this.employerProfileForm.controls.address_line_two.value,
      country: this.employerProfileForm.controls.country.value,
      stateProvince: this.employerProfileForm.controls.state.value,
      city: this.employerProfileForm.controls.city.value,
      zipCode: this.employerProfileForm.controls.zipcode.value,
      companyProfile: this.employerProfileForm.controls.company_profile.value,
      businessCategory: this.employerProfileForm.controls.business_cat.value,
      companyRepresentativeName: this.employerProfileForm.controls.company_rep_det.value,
      chooseFile: documensFile,
    }
    console.log(" Submit values:", employerProfileVal);

    this.__profileService.createEmployer(employerProfileVal).then((resData: any) => {
      console.log(resData);
      this.loading = false;
      if (resData.status == 'success') {
        this.toastr.success("Profile added Successfully");
        this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view', this.email_id]);
      }
      else if (resData.status == 'error') {
        this.toastr.error("Profile not saved");
      }
      console.log(" Submit values:", employerProfileVal);

      this.__profileService.createEmployer(employerProfileVal).then((resData: any) => {
        console.log(resData);
        this.loading = false;
        if (resData.status == 'success') {
          this.toastr.success("Profile added Successfully");
          this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view', this.email_id]);
        }
        else if (resData.status == 'error') {
          this.toastr.error("Profile not saved");
        }
      });
    });
  }

  /**
   * @name getDocumentsTypeCat
   * @description get API for all document category type of independent prof 
   */
  getDocumentsTypeCat(index) {
    this.__freelancerProfileService.getFreelancerDocumentByCat(index).then((resData: any) => {
      this.docTypeArr = resData;
      console.log("docTypeArr:", this.docTypeArr);

    });
  }

  /**
   * @name onLogout
   * @description call Logout 
   */

  onLogout() {
    this.__authService.logout();
    this.__router.navigate(['/auth/auth/login']);
  }

  /**
  * @name onCancel
  * @description call Cancel the process
  */
  onCancel() {
    this.employerProfileForm.reset();
  }

}
