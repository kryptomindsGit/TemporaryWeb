import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import { PartProfileService } from '../../shared/service/profile.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  //FormGroup object
  public partnerProfileForm: FormGroup;

  //Variable's
  public email: string;
  public country: string;
  public fileType: any;
  public fileName: any;
  public FileArrData: any;
  public fileObj: any;


  //Array's
  public congnitoId: any = [];
  public documentFileArr: any = [];
  public stateArr: any = [];
  public countryArr: any = [];
  public cityArr: any = [];

  constructor(
    private __fb: FormBuilder,
    private __profileService: PartProfileService,
    private __authService: AuthService,
    private __router: Router
  ) { }

  ngOnInit() {
    let isUportUser = localStorage.getItem("uportUser");
    if (isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoId = user["cognito:username"];
      this.email = user["email"];
    } else {
      this.email = localStorage.getItem("email");
      this.country = localStorage.getItem("country");
    }

    //Call function
    this.valPartProfile();
    this.getAllCountry();
  }

  /**
   * @name valEmpProfile
   * @description validating the form fields
   */
  valPartProfile() {
    this.partnerProfileForm = this.__fb.group({
      comapany_name: ['', Validators.required],
      website_addr: ['', Validators.required],
      address_line_one: ['', Validators.required],
      address_line_two: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      business_cat: ['', Validators.required],
      company_profile: ['', Validators.required],
      company_rep_det: ['', Validators.required],
      documents: this.__fb.array([this.__fb.group({
        chooseFile: '',
        docType: ''
      })])

    })
  }


  /**
   * @description FormArray (Dynamicaly create input)
   */

  get documentArr() {
    return this.partnerProfileForm.get('documents') as FormArray;
  }

  addDocument() {
    this.documentArr.push(this.__fb.group({
      chooseFile: '',
      docType: ''
    }));
  }

  deleteDocument(index) {
    this.documentArr.removeAt(index);
  }

  /**
  * @method getAllCountry
  * @description get all country values.
  */
  getAllCountry() {
    this.__profileService.getPartCountry().then((resData: any) => {
      this.countryArr = resData;
    })
  }

  /**
   * @method setCountryID
   * @param country_id
   * @description get the selected country id and pass to getStateByID method.
   */
  setCountryID(country_id) {
    this.getStateByID(country_id)
  }

  /**
   * @method getStateByID
   * @param country_id
   * @description get the all state values based on selected country id.
   */
  getStateByID(country_id) {
    this.__profileService.getPartStateByID(country_id).then((resData: any) => {
      this.stateArr = resData;
    })
  }

  /**
   * @method setStateID
   * @param state_id
   * @description get the selected state id and pass to getCityByID method.
   */
  setStateID(state_id) {
    this.getCityByID(state_id)
  }

  /**
   * @method getCityByID
   * @param state_id
   * @description get the all city values based on selected state id.
   */
  getCityByID(state_id) {
    this.__profileService.getPartCityByID(state_id).then((resData: any) => {
      this.cityArr = resData;
      console.log(this.cityArr)
    })
  }

  /**
   * @description File Handler
   */

  /**
    * @name 
    * @description file handler
    */

  setDocTypeCatType(inputValue) {
    console.log(inputValue);
    this.fileType = inputValue
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      this.fileName = file.name;
      console.log("File name:", file.name);

      this.fileObj = file;
    }
  }


  uploadFile() {

    // this.__profileService.postDocHashData(this.fileObj, this.congnitoId, this.fileName).then((event) => {
    //   this.FileArrData = event;
    //   console.log("File Resp:", this.FileArrData);
    // });
    this.FileArrData = "jkdhfjkhkdjshfkjhdskjfh"

    this.documentFileArr.push(
      {
        'file_name': this.FileArrData,
        'file_type': this.fileType
      });
    console.log(this.documentFileArr);
  }

  /**
  * @name onSubmit
  * @description submit the form fileds values
  */
  onSubmit() {

    let documentsFile: any = [
      'file_name',
      'file_type'
    ];

    documentsFile = [
      ...this.documentFileArr
    ]

    const partnerProfileVal = {
      cognito_id: this.congnitoId,
      email: this.email,
      uid: 35,
      company_name: this.partnerProfileForm.controls.comapany_name.value,
      website_addr: this.partnerProfileForm.controls.website_addr.value,
      address_line_one: this.partnerProfileForm.controls.address_line_one.value,
      address_line_two: this.partnerProfileForm.controls.address_line_two.value,
      country: this.partnerProfileForm.controls.country.value,
      state: this.partnerProfileForm.controls.state.value,
      city: this.partnerProfileForm.controls.city.value,
      zipcode: this.partnerProfileForm.controls.zipcode.value,
      company_profile: this.partnerProfileForm.controls.company_profile.value,
      business_cat: this.partnerProfileForm.controls.business_cat.value,
      company_rep_det: this.partnerProfileForm.controls.company_rep_det.value,
      chooseFile: documentsFile

    }
    console.log(partnerProfileVal)

    this.__profileService.createPartner(partnerProfileVal).then((resData: any) => {
      console.log(resData);
    });
  }

  onLogout() {
    this.__authService.logout();
    this.__router.navigate(['/auth/auth/login']);
  }

  onCancel() {
    console.log(" Canceled the process");
  }

}
