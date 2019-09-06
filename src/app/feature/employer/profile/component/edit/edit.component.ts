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
  public emailId: string;
  public id: number;
  public fileType: any;

  //Static Array's
  prefixArr = ['Mr', 'Mrs', 'Miss'];

  //Array's
  documentFileArr: any = [];
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
    const userInfo = this.__authService.decode();
    this.congnitoId = userInfo["cognito:username"];

    //Calling Function's
    this.valEmpProfile();
    this.getEmplyeeDetails();
    this.getEmplyeeFileDetails();
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
      documents: this.__fb.array([this.__fb.group(
        { chooseFile: '' },
        { docType: '' }
      )]),
    })
  }

  /**
   * @name getEmplyeeDetails
   * @description call get API for employer file details 
   */
  getEmplyeeDetails() {
    this.emailId = this.__activatedRoute.snapshot.params.id;
    this.__profileService.getEmployerByEmailId(this.emailId).then((data: any) => {
      this.employerArr = data[0];
      console.log(this.employerArr);
    });
  }

  /**
   * @name getEmplyeeFileDetails
   * @description call get API for employer file details 
   */
  getEmplyeeFileDetails() {
    this.id = this.__activatedRoute.snapshot.params.id;
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

  setDocTypeCatType(inputValue) {
    console.log(inputValue);
    this.fileType = inputValue
  }

  /**
   * @name 
   * @description file handler
   */



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

    this.__profileService.updateEmployer(this.id, employerProfileVal).then((data: any) => {
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
