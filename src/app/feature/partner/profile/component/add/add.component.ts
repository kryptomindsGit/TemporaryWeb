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
  public partnerProfile: FormGroup;

  //Variable's
  public email: string;
  public country: string;
  public fileType: any;

  //Array's
  public congnitoId: any = [];
  public documentFileArr: any = [];

  //static Array's


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
  }

  /**
   * @name valEmpProfile
   * @description validating the form fields
   */
  valPartProfile() {
    this.partnerProfile = this.__fb.group({
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
    return this.partnerProfile.get('documents') as FormArray;
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

  setDocTypeCatType(inputValue) {
    console.log(inputValue);
    this.fileType = inputValue
  }

  /**
   * @description File Handler
   */



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
      company_name: this.partnerProfile.controls.comapany_name.value,
      website_addr: this.partnerProfile.controls.website_addr.value,
      address_line_one: this.partnerProfile.controls.address_line_one.value,
      address_line_two: this.partnerProfile.controls.address_line_two.value,
      country: this.partnerProfile.controls.country.value,
      state: this.partnerProfile.controls.state.value,
      city: this.partnerProfile.controls.city.value,
      zipcode: this.partnerProfile.controls.zipcode.value,
      company_profile: this.partnerProfile.controls.company_profile.value,
      business_cat: this.partnerProfile.controls.business_cat.value,
      company_rep_det: this.partnerProfile.controls.company_rep_det.value,
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
