import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EmpProfileService } from '../../shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  // FormGroup object's
  public employerProfileForm: FormGroup;

  //Variable's
  public congnitoId: string;
  public emailId: any;
  public id: any;
  public fileName: string;
  public fileObj: any;
  public doc_cat_id: any;
  public FileArrData: any;
  public uid: any;

  //Static Array's
  prefixArr = ['Mr', 'Mrs', 'Miss'];

  //Array's
  public documentFileArr: any = [];
  public stateArr: any = [];
  public countryArr: any = [];
  public cityArr: any = [];
  public fileType: any;

  employerArr: any = [];
  employerFileArr: any = [];

  constructor(
    private __fb: FormBuilder,
    private __profileService: EmpProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.emailId = this.__activatedRoute.snapshot.params.id;
    const user = this.__authService.decode();
    this.uid = localStorage.getItem("uid");
    this.congnitoId = user["cognito:username"];


    const userInfo = this.__authService.decode();
    this.congnitoId = userInfo["cognito:username"];

    //Calling Function's

    this.getEmplyeeDetails();
    this.valEmpProfile();
  }

  /**
   * @name valEmpProfile
   * @description validating the form fields
   */

  valEmpProfile() {
    this.employerProfileForm = this.__fb.group({
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
      // documents: this.__fb.array([]),
    })
  }

  /**
   * @name getEmplyeeDetails
   * @description call get API for employer file details 
   */
  getEmplyeeDetails() {

    this.__profileService.getEmployerByEmailId(this.emailId).then((data: any) => {
      this.employerArr = data[0];
      console.log(this.employerArr);

      this.employerProfileForm.patchValue({
        comapany_name: this.employerArr.cmp_name,
        website_addr: this.employerArr.cmp_website,
        address_line_one: this.employerArr.cmp_addr,
        address_line_two: this.employerArr.cmp_addr_2,
        country: this.employerArr.country,
        state: this.employerArr.state,
        city: this.employerArr.city,
        zipcode: this.employerArr.zipcode,
        business_cat: this.employerArr.business_cat,
        company_profile: this.employerArr.cpm_profile,
        company_rep_det: this.employerArr.cmp_reprentative
      });

    });

    this.__profileService.getEmployerFileById(this.id).then((resData: any) => {
      this.employerFileArr = resData;
      console.log(this.employerFileArr);

      for (let index = 0; index < this.employerFileArr.length; index++) {
        this.documentArr.push(this.__fb.group(
          {
            file_name: this.employerFileArr[index].file_name,
            file_type: this.employerFileArr[index].file_type,
            file_id: this.employerFileArr[index].file_id,
            part_id: this.employerFileArr[index].part_id
          }));
      }
      console.log(this.documentArr);
      // this.valEmpProfile();
    });


  }

  /**
  * @description FormArray (Dynamicaly create input)
  */
  get documentArr() {
    return this.employerProfileForm.get('documents') as FormArray;
  }

  addDocument() {
    this.documentArr.push(this.__fb.group(
      { chooseFile: '' },
      { docType: '' }
    ));
  }

  deleteDocument(index) {
    this.documentArr.removeAt(index);
  }



  /**
  * @method getAllCountry
  * @description get all country values.
  */
  getAllCountry() {
    this.__profileService.getEmpCountry().then((resData: any) => {
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
    this.__profileService.getEmpStateByID(country_id).then((resData: any) => {
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
    this.__profileService.getEmpCityByID(state_id).then((resData: any) => {
      this.cityArr = resData;
      console.log(this.cityArr)
    })
  }


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


  async uploadFile() {

    await this.__profileService.postDocHashData(this.fileObj, this.congnitoId, this.fileName).then((event) => {
      this.FileArrData = event;
      console.log("File Resp:", this.FileArrData.fileId);
    });
    // this.FileArrData = "jkdhfjkhkdjshfkjhdskjfh"

    await this.documentFileArr.push(
      {
        'file_name': this.FileArrData.fileId,
        'file_type': this.fileType
      });
    console.log(this.documentFileArr);
  }


  /**
   * @name onSubmit
   * @description submit the form fileds values
   */
  onSubmit() {

    let documensFile: any = [
      'file_name',
      'file_type'
    ];

    documensFile = [
      ...this.documentFileArr
    ];

    const employerProfileVal = {
      cognito_id: this.congnitoId,
      email: this.emailId,
      uid: this.uid,
      company_name: this.employerProfileForm.controls.comapany_name.value,
      website_addr: this.employerProfileForm.controls.website_addr.value,
      address_line_1: this.employerProfileForm.controls.address_line_one.value,
      address_line_2: this.employerProfileForm.controls.address_line_two.value,
      country: this.employerProfileForm.controls.country.value,
      state: this.employerProfileForm.controls.state.value,
      city: this.employerProfileForm.controls.city.value,
      zipcode: this.employerProfileForm.controls.zipcode.value,
      company_profile: this.employerProfileForm.controls.company_profile.value,
      business_cat: this.employerProfileForm.controls.business_cat.value,
      company_rep_det: this.employerProfileForm.controls.company_rep_det.value,
      chooseFile: documensFile,
    }
    console.log(" Submit values:", employerProfileVal);

    this.__profileService.updateEmployer(this.emailId, employerProfileVal).then((data: any) => {
      console.log(data);
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
    console.log(" Canceled the process");
  }

}
