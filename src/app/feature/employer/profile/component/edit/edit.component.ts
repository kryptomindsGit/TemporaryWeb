import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { EmpProfileService } from '../../shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IndeptProfileService } from 'src/app/feature/independent-prof/profile/shared/service/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  submitted = true;

  // FormGroup object's
  public employerProfileForm: FormGroup;

  //Variable's
  public editprofileemployer: any;
  public loading = false;

  public congnitoId: string;
  public emailId: any;
  public id: any;
  public fileName: string;
  public fileObj: any;
  public doc_cat_id: any;
  public FileArrData: any;
  public uid: any;
  public docTypeArr: any = [];

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
    private __freelancerProfileService: IndeptProfileService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {

    let isUportUser = localStorage.getItem("uportUser");

    if (isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoId = user["cognito:username"];
      this.emailId = user["email"];
      this.uid = user["uid"];
    } else {
      this.congnitoId = "TEST"
      this.uid = localStorage.getItem("uid");
      this.emailId = localStorage.getItem("email");
      // this.country = localStorage.getItem("country");
    }

    //Calling Function's

    this.getEmplyeeDetails();
    this.valEmpProfile();
    this.getAllCountry();
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
      zipcode: ['', [Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
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
   * @name getEmplyeeDetails
   * @description call get API for employer file details 
   */
  async getEmplyeeDetails() {

    await this.__profileService.getEmployerByEmailId(this.emailId).then((data: any) => {
      this.employerArr = data[0];
      console.log(this.employerArr);
    });

    await this.populateStateList();
    await this.populateCityList();

    if (this.employerArr != null) {
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

      await this.__profileService.getEmployerFileById(this.emailId).then((resData: any) => {
        this.employerFileArr = resData;
        console.log(this.employerFileArr);

        if (this.employerFileArr.length > 0) {

          for (let index = 0; index < this.employerFileArr.length; index++) {
            this.documentArr.push(this.__fb.group(
              {
                chooseFile: this.employerFileArr[index].file_name,
                docType: this.employerFileArr[index].file_type,
                file_id: this.employerFileArr[index].file_id,
                part_id: this.employerFileArr[index].part_id
              }));
          }
        } else {
          this.addDocument();
        }

      });
    }

  }

  async populateStateList() {
    for (let i = 0; i < this.countryArr.length; i++) {
      if (this.countryArr[i].name == this.employerArr.country) {
        let countryID = this.countryArr[i].id;
        await this.getStateListByCountryID(countryID);
      }
    }
  }
  async populateCityList() {
    for (let i = 0; i < this.stateArr.length; i++) {
      if (this.stateArr[i].name == this.employerArr.state) {
        let stateID = this.stateArr[i].id;
        this.getCityListByStateID(stateID);
      }
    }
  }

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
   * @description get the selected country id and pass to getStateListByCountryID method.
   */
  setCountryID(country_id) {
    this.getStateListByCountryID(country_id)
  }

  /**
   * @method getStateListByCountryID
   * @param country_id
   * @description get the all state values based on selected country id.
   */
  async getStateListByCountryID(country_id) {
    await this.__profileService.getEmpStateByID(country_id).then((resData: any) => {
      this.stateArr = resData;
    })
  }

  /**
   * @method setStateID
   * @param state_id
   * @description get the selected state id and pass to getCityListByStateID method.
   */
  setStateID(state_id) {
    this.getCityListByStateID(state_id)
  }

  /**
   * @method getCityListByStateID
   * @param state_id
   * @description get the all city values based on selected state id.
   */
  async getCityListByStateID(state_id) {
    await this.__profileService.getEmpCityByID(state_id).then((resData: any) => {
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
      this.fileName = file.name.replace(" ", "");
      console.log("File name:", file.name);

      this.fileObj = file;
    }
  }


  async uploadFile() {

    this.loading = true;
    await this.__profileService.postDocHashData(this.fileObj, this.emailId, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;

      console.log("File Resp:", this.FileArrData.fileId);
      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }
    });
    // this.FileArrData = "jkdhfjkhkdjshfkjhdskjfh"

    await this.documentFileArr.push(
      {
        'file_name': this.FileArrData.fileId,
        'file_type': this.fileType
      });
    console.log(this.documentFileArr);
  }

  getDocumentsTypeCat(index) {
    this.__freelancerProfileService.getFreelancerDocumentByCat(index).then((resData: any) => {
      this.docTypeArr = resData;
    })

  }

  setDocTypeCatID(id) {
    console.log(this.doc_cat_id = id);
  }

  /**
   * @name onSubmit
   * @description submit the form fileds values
   */
  onSubmit() {
    this.submitted = true;
    if (this.employerProfileForm.invalid) {
      return;
    } else {
      this.loading = true;
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

      this.__profileService.updateEmployer(this.emailId, employerProfileVal).then((resData: any) => {
        console.log(resData);
        this.loading = false;
        if (resData.status == 'success') {
          this.toastr.success("Profile added Successfully");
          this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view', this.emailId]);
        }
        else if (resData.status == 'error') {
          this.toastr.error("Profile not saved");
        }
      });
    }
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
    this.getEmplyeeDetails();
  }

}
