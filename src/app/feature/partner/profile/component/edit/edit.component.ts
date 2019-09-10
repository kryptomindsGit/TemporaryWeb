import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { PartProfileService } from '../../shared/service/profile.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  //FormGroup object
  public partnerProfileForm: FormGroup;

  //Variable's
  public email: string;
  public country: string;
  public emailId: string;
  public id: any;
  public fileType: any;
  public fileName: any;
  public FileArrData: any;
  public fileObj: any;
  public uid: any;

  //Array's
  public congnitoId: any = [];
  public documentFileArr: any = [];
  public partnerArr: any = [];
  public partnerFileArr: any = [];
  public countryArr: any = [];
  public stateArr: any = [];
  public cityArr: any = [];

  //static Array's


  constructor(
    private __fb: FormBuilder,
    private __profileService: PartProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
  ) {
    this.emailId = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {
    const user = this.__authService.decode();
    let isUportUser = localStorage.getItem("uportUser");
    this.uid = localStorage.getItem("uid");
    this.congnitoId = user["cognito:username"];

    if (isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoId = user["cognito:username"];
      this.email = user["email"];
    } else {
      this.email = localStorage.getItem("email");
      this.country = localStorage.getItem("country");
    }

    console.log("UID", this.uid);
    console.log("emial", this.email);


    //Call function

    this.getPartnerDetails();
    this.getAllCountry();

  }

  /**
   * @name valEmpProfile
   * @description validating the form fields
   */
  valPartProfile() {

    this.partnerProfileForm = this.__fb.group({

      jo: ['TEST'],
      jo1: ['TEST'],
      jo2: ['TEST'],
      comapany_name: [(this.partnerArr == null || this.partnerArr.part_name == null) ? '' :
        this.partnerArr.part_name, Validators.required],
      website_addr: [(this.partnerArr == null || this.partnerArr.part_website == null) ? '' :
        this.partnerArr.part_website, Validators.required],
      address_line_one: [(this.partnerArr == null || this.partnerArr.part_addr == null) ? '' :
        this.partnerArr.part_addr, Validators.required],
      address_line_two: [(this.partnerArr == null || this.partnerArr.part_addr_2 == null) ? '' :
        this.partnerArr.part_addr_2, Validators.required],
      country: [(this.partnerArr == null || this.partnerArr.country == null) ? '' :
        this.partnerArr.country, Validators.required],
      state: [(this.partnerArr == null || this.partnerArr.state == null) ? '' :
        this.partnerArr.state, Validators.required],
      city: [(this.partnerArr == null || this.partnerArr.city == null) ? '' :
        this.partnerArr.city, Validators.required],
      zipcode: [(this.partnerArr == null || this.partnerArr.zipcode == null) ? '' :
        this.partnerArr.zipcode, [Validators.required, Validators.pattern('^[0-9]*$')]],
      business_cat: [(this.partnerArr == null || this.partnerArr.business_details == null) ? '' :
        this.partnerArr.business_details, Validators.required],
      company_profile: [(this.partnerArr == null || this.partnerArr.part_type == null) ? '' :
        this.partnerArr.part_type, Validators.required],
      company_rep_det: [(this.partnerArr == null || this.partnerArr.part_reprentative == null) ? '' :
        this.partnerArr.part_reprentative, Validators.required],
      documents: this.__fb.array([this.__fb.group({
        chooseFile: (this.partnerFileArr == null || this.partnerFileArr.file_name == null) ? '' :
          this.partnerFileArr.file_name,
        docType: (this.partnerFileArr == null || this.partnerFileArr.file_type == null) ? '' :
          this.partnerFileArr.file_type
      })])

    })

  }

  /**
   * @name getPartnerDetails
   * @description call get API for partner details 
   */
  getPartnerDetails() {

    this.__profileService.getPartnerByEmailId(this.emailId).then((resData: any) => {
      this.partnerArr = resData[0];
      console.log(this.partnerArr);
      this.valPartProfile();

    });


    this.__profileService.getPartnerFileById(this.emailId).then((resData: any) => {
      this.partnerFileArr = resData;
      console.log(this.partnerFileArr);

      for (let index = 0; index < this.partnerFileArr.length; index++) {
        this.documentArr.push(this.__fb.group(
          {
            chooseFile: this.partnerFileArr[index].file_name,
            docType: this.partnerFileArr[index].file_type,
            file_id: this.partnerFileArr[index].file_id,
            part_id: this.partnerFileArr[index].part_id
          }));
      }
      this.valPartProfile();
      console.log(this.documentArr);

    });
    // await this.valPartProfile();
  }

  /**
   * @name getPartnerFile
   * @description call get API for partner file details 
   */
  // getPartnerFile() {
  //   this.__profileService.getPartnerFileById(this.id).then((resData: any) => {
  //     this.partnerFileArr = resData;
  //     console.log(this.partnerFileArr);

  //     for (let index = 0; index < this.partnerFileArr.length; index++) {
  //       this.documentArr.push(this.__fb.group(
  //         {
  //           chooseFile: this.partnerFileArr[index].file_name,
  //           docType: this.partnerFileArr[index].file_type,
  //           file_id: this.partnerFileArr[index].file_id,
  //           part_id: this.partnerFileArr[index].part_id
  //         }));
  //     }
  //     console.log(this.documentArr);

  //   });
  // }


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
      uid: this.uid,
      email: this.email,
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

    this.__profileService.updatePartner(this.emailId, partnerProfileVal).then((data: any) => {
      console.log(data);
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
