import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { IndeptProfileService } from '../../shared/service/profile.service';
import { ToastrService } from 'ngx-toastr';
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';
// 
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit {

  /* FormGroup object's */
  public personalDetailForm: FormGroup;
  public qualificationDetailForm: FormGroup;
  public workExpDetailsForm: FormGroup;
  public skillDetailsForm: FormGroup;

  /* Static Array variables */
  public prefixArr = ['Mr', 'Mrs', 'Miss'];
  public yearArr = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
  public gradeArr = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* skill variables. */
  keyword = 'domainName';

  /* Loader Variable's */
  public loading = false;

  /* Variable's */
  public submitted = false;
  public showMainContent: number = 1;
  public isUportUser: string;
  public email: string;
  public country: string;
  public doc_cat_id: number;
  public uid: any;

  /* Document related Variable's */
  public fileType: any;
  public fileName: any;
  public fileObj: any;
  public FileArrData: any;
  public fileUploadProgress: string = null;

  /* Education related Array's */
  public congnitoID: any = [];

  /* Skill related Array's */
  public skill: any = [];
  public categ: any = [];

  /* Document related Arrays */
  public documentPersonalArray: any = [];
  public documentQualArray: any = [];
  public documentWorkArray: any = [];
  public documentFileArr: any = [];

  /* Master Data Related Arrays */ 
  public countryArr : any = [];
  public stateArr : any = [];
  public cityArr : any = [];
  public stateArrByCountryId : any = [];
  public cityArrByStateId : any = [];
  public eduCatArr: any = [];
  public eduTypeList : any = [];
  public eduTypeArrByEduCatList : any = [];
  public skills: any = [];
  public skillArrBySkillCatList : any = [];
  public personalAttributes : any = [];
  public currencyList : any = [];
  public docTypeArr: any = [];

  constructor(
    /* Constructor variable's */
    private __fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
    private __customGlobalService: CustomGlobalService
  ) {

  }

  ngOnInit() {
    this.isUportUser = localStorage.getItem("uportUser");

    if (this.isUportUser == "false") {

      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.email = user["email"];
      this.uid = localStorage.getItem("uid");
      this.country = user["custom:country"];

    } else {
      this.congnitoID = "TEST";
      this.uid = localStorage.getItem("uid");
      this.email = localStorage.getItem("email");
      this.country = localStorage.getItem("country");
    }

    //Call validation funtion's
    this.validatePersonalProfile();
    this.validateQualificationProfile();
    this.validateWorlExpProfile();
    this.validateSkillsProfile();

    //Call get REST API's function
    this.getEducationCategoryList();
    this.getEducationTypeList();
    this.getPersonalAttributes();
    this.getSkillCategoryList();
    this.getSkillTypeList();
    this.getCountryList();
    this.getStateList();
    this.getCityList();
    this.getDocumentsTypeCat(1);
    this.getCurrencyList();
  }

  /**
   * @name valPersonalProfile
   * @description validating the Personal details form fields
   */
  validatePersonalProfile() {
    this.personalDetailForm = this.__fb.group({
      prefix: ['', Validators.required],
      first_name: ['', Validators.compose([
        Validators.required, Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      middle_name: [''],
      last_name: ['', Validators.compose([
        Validators.required, Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      address_one: ['', [Validators.required, Validators.maxLength(30)]],
      address_two: ['', [Validators.required, Validators.maxLength(30)]],
      country: [''],
      province: [''],
      city: [''],
      postal_code: ['', Validators.compose([
        Validators.required, Validators.maxLength(8), Validators.minLength(6),
        Validators.pattern("^[0-9]*$")
      ])],
      documents_personal: this.__fb.array([this.__fb.group(
        {
          documentUrl: [''],
          documentTypeId: ['']
        })]),
    });
  }

  /**
   * @name valQualificationProfile
   * @description validating the Qualification details form fields
   */
  validateQualificationProfile() {
    this.qualificationDetailForm = this.__fb.group({
      qualification: this.__fb.array([this.__fb.group({
        eduCatId: ['', Validators.required],
        eduTypeId: ['', Validators.required],
        university: ['', [Validators.required, Validators.maxLength(25)]],
        passingYear: ['', Validators.required],
        percentage: ['', [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(4),
        ]],
        grade: ['', Validators.required],
        doc_name: ['', Validators.required]
      })]),
    });
  }

  /**
   * @name valWorlExpProfile
   * @description validating the Work Exp details form fields
   */
  validateWorlExpProfile() {
    this.workExpDetailsForm = this.__fb.group({
      org_details: this.__fb.array([this.__fb.group({
        organization: ['', [Validators.required, Validators.maxLength(25)]],
        designation: ['', [Validators.required, Validators.maxLength(25)]],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        responsibilities: ['', [Validators.required, Validators.maxLength(25)]]
      })]),
      strength: this.__fb.array([this.__fb.group({ strength: '' })]),
      weakness: this.__fb.array([this.__fb.group({ weakness: '' })]),
      portfolios: this.__fb.array([this.__fb.group({ portfolio: '' })]),
      references: ['', [Validators.required, Validators.maxLength(25)]],
      area_of_expertise: ['', [Validators.required, Validators.maxLength(25)]],
      psychomatric: ['', [Validators.required, Validators.maxLength(25)]],
      isFreelancer: ['', Validators.required],
      documents_work: this.__fb.array([this.__fb.group({ documentTypeId: ['', Validators.required], documentUrl: ['', Validators.required] })]),
    });
  }

  /**
   * @name valSkillsProfile
   * @description validating the Skill details form fields
   */
  validateSkillsProfile() {
    this.skillDetailsForm = this.__fb.group({
      skills: this.__fb.array([])
    });
  }


  // convenience getter for easy access to form fields of Personal Form.
  get personalFormValidation() { return this.personalDetailForm.controls; }

  // convenience getter for easy access to form fields of Qualification Form.
  get qualifFormValidation() { return this.qualificationDetailForm.get('qualification') as FormArray; }

  // convenience getter for easy access to form fields of Work Exp Form.
  get workExpFormValidation() { return this.workExpDetailsForm.controls; }

  // convenience getter for easy access to form fields of Skill Management Form.
  get skillMangFormValidation() { return this.skillDetailsForm.controls; }

  /**
   * @name getEducationCat
   * @description get API for all education category of independent prof 
   */
  getEducationCategoryList() {
    this.__customGlobalService.getEducationCategoryList().then((resData: any) => {
      this.eduCatArr = resData.responseObject;
    })
  }

  getEducationTypeList() {
    this.__customGlobalService.getEducationTypeList().then((resData: any) => {
      this.eduTypeList = resData.responseObject;
    })
  }

  setEduTypeListByEduCategoryId(eduCatId , i) {
    this.eduTypeArrByEduCatList[eduCatId] = this.eduTypeList.filter((item) => item.masterEduDomain.eduDomainId == eduCatId);
  }

  getSkillCategoryList() {
    this.__customGlobalService.getSkillDomainList().then((resData: any) => {
      this.categ = resData.responseObject;
    })
  }

  getSkillTypeList(){
    this.__customGlobalService.getSkillTypeList().then((resData: any) => {
      this.skills = resData.responseObject;
    })
  }

  setSkillArrBySkillCatList(skillDomainId){ 
    this.skillArrBySkillCatList = this.skills.filter((item) => item.masterDomain.domainId == skillDomainId);
  }

  getCountryList() {
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.countryArr = resData.responseObject;
    });
  }
  getStateList() {
    this.__customGlobalService.getStateList().then((resData: any) => {
      this.stateArr = resData.responseObject;
    })
  }

  setStateListByCountryId(countryId) {
    this.stateArrByCountryId[countryId] = this.stateArr.filter((item) => item.masterCountry.countryId == countryId);
  }

  getCityList() {
    this.__customGlobalService.getCityList().then((resData: any) => {
      this.cityArr = resData.responseObject;      
    })
  }

  setCityListByStateId(stateId) {
    this.cityArrByStateId[stateId] = this.cityArr.filter((item) => item.masterStates.stateId == stateId);
  }

  getCurrencyList(){
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.currencyList = resData.responseObject;
    })
  }

  getPersonalAttributes(){
    this.__customGlobalService.getPersonalAttributeList().then((resData: any) => {
      this.personalAttributes = resData.responseObject;      
    })
  }

  setDocTypeCatID(id) {
    this.doc_cat_id = id;
  }

  getDocumentsTypeCat(index) {
    this.__profileService.getFreelancerDocumentByCat(index).then((resData: any) => {
      this.docTypeArr = resData.responseObject;      
  })

  }

  selectEvent(item) {
    const skills = item;
    const skill_id = skills.skill_cat_id;
    this.setSkillArrBySkillCatList(item.domainId)
  }

  get qualfArr() {
    return this.qualificationDetailForm.get('qualification') as FormArray;
  }

  addQualification() {
    this.qualfArr.push(this.__fb.group(
      {
        eduCatId: '',
        eduTypeId: '',
        university: '',
        passingYear: '',
        percentage: '',
        grade: '',
        doc_name: ''
      }));
  }

  deleteQualification(index) {
    this.qualfArr.removeAt(index);
  }

  get orgArr() {
    return this.workExpDetailsForm.get('org_details') as FormArray;
  }

  addResponsibility() {
    this.orgArr.push(this.__fb.group(
      {
        organization: '',
        designation: '',
        startDate: '',
        endDate: '',
        responsibilities: ''
      }));
  }

  deleteResponsibility(index) {
    this.orgArr.removeAt(index);
  }

  get strengthArr() {
    return this.workExpDetailsForm.get('strength') as FormArray;
  }

  addStrength() {
    this.strengthArr.push(this.__fb.group({ strength: '' }));
  }

  deleteStrength(index) {
    this.strengthArr.removeAt(index);
  }

  get weaknessArr() {
    return this.workExpDetailsForm.get('weakness') as FormArray;
  }

  addWeakness() {
    this.weaknessArr.push(this.__fb.group({ weakness: '' }));
  }

  deleteWeakness(index) {
    this.weaknessArr.removeAt(index);
  }

  get portfolioArr() {
    return this.workExpDetailsForm.get('portfolios') as FormArray;
  }

  addPortfolio() {
    this.portfolioArr.push(this.__fb.group({ portfolio: '' }));
  }

  deletePortfolio(index) {
    this.portfolioArr.removeAt(index);
  }

  get documentArr() {
    return this.personalDetailForm.get('documents_personal') as FormArray;
  }

  addDocument() {
    this.documentArr.push(this.__fb.group(
      {
        documentUrl: '',
        documentTypeId: ''
      }
    ));
  }

  deleteDocument(index) {
    this.documentArr.removeAt(index);
  }

  get workdocumentArr() {
    return this.workExpDetailsForm.get('documents_work') as FormArray;
  }

  getValidity(i) {
    return (<FormArray>this.workExpDetailsForm.get('documents_work')).controls[i].invalid;
  }

  addWorkDocument() {
    this.workdocumentArr.push(this.__fb.group(
      {
        documentUrl: '',
        documentTypeId: ''
      }
    ));
  }

  deleteWorkDocument(index) {
    this.workdocumentArr.removeAt(index);
  }

  get skillRateArr() {
    return this.skillDetailsForm.get('skills') as FormArray;
  }

  onChange(skill: string, skill_id: number, isChecked: boolean) {
    if (isChecked && skill != null) {
      this.skillRateArr.push(this.__fb.group(
        {
          skillName: skill,
          skillId: skill_id,
          rateHour: '',
          skillExperience: '',
          expertise:'',
        }
      ));
    }
    else {
      let index = this.skillRateArr.controls.findIndex(x => x.value.skill == skill_id);
      this.skillRateArr.removeAt(index);
    }
  }

  setDocTypeCatType(inputValue) {
    this.fileType = inputValue
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name.replace(" ", "");
      this.fileObj = file;
    }
  }


  async uploadPersonalFile() {
    this.loading = true;

    this.fileUploadProgress = '0%';
    await this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
        this.FileArrData = event;
        this.loading = false;
        if (this.FileArrData) {
          this.toastr.success(this.fileName, "Successfully uploaded");
        } else {
          this.toastr.error(this.fileName, "File not uploaded");
        }
    });

    this.documentPersonalArray.push({
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': this.doc_cat_id
      });
  }

  uploadEducationFile() {
    this.loading = true;
    this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;
      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }
    });

    this.documentQualArray.push({
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': 4
      });
  }

  uploadWorkExpFile() {
    this.loading = true;
    this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;
      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }
    });

    this.documentWorkArray.push( {
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': this.doc_cat_id
      });
  }

  savePersonalDetailForm(){    
    const personalData = {
      emailId: this.email,
      prefix: this.personalDetailForm.controls.prefix.value,
      firstName: this.personalDetailForm.controls.first_name.value,
      middleName: this.personalDetailForm.controls.middle_name.value,
      lastName: this.personalDetailForm.controls.last_name.value,
      addressLine1: this.personalDetailForm.controls.address_one.value,
      addressLine2: this.personalDetailForm.controls.address_two.value,
      country: this.personalDetailForm.controls.country.value,
      province: this.personalDetailForm.controls.province.value,
      city: this.personalDetailForm.controls.city.value,
      postalCode: this.personalDetailForm.controls.postal_code.value,
      freelancerDocuments: this.documentPersonalArray
    }
    this.__profileService.savePersonalDetails(personalData).then((resData: any) => {
      this.loading = false;
      if (resData.status == 'success') {
        this.toastr.success("Profile added Successfully");
      }
      else if (resData.responseObjec.message == 'error') {
        this.toastr.error("Profile not saved");
      }
    });
  }


  saveEducationDetails(){
    const eductionPayload = {
      educationDetails :  this.qualificationDetailForm.controls.qualification.value,
      emailId : this.email
    }
    this.__profileService.saveEducationDetails(eductionPayload).then((resData: any) => {
        this.loading = false;
        if (resData.status == 'success') {
          this.toastr.success("Profile added Successfully");
        }
        else if (resData.responseObjec.message == 'error') {
          this.toastr.error("Profile not saved");
        }
    });
  }

  saveWorkDetails(){
    let portfolioArray = [];
    let i;
    for(i = 0 ; i < this.workExpDetailsForm.controls.portfolios.value.length ; i++){
      portfolioArray[i]=this.workExpDetailsForm.controls.portfolios.value[i].portfolio;
    }
    let strengthArr = [];
    for(i = 0 ; i < this.workExpDetailsForm.controls.strength.value.length ; i++){
      strengthArr[i]=this.workExpDetailsForm.controls.strength.value[i].strength;
    }
    let weaknessArr = [];
    for(i = 0 ; i <  this.workExpDetailsForm.controls.weakness.value.length ; i++){
      weaknessArr[i]=this.workExpDetailsForm.controls.weakness.value[i].weakness;
    }
    const orgDetailsPayload = {
      emailId: this.email,
      freelancerOrgDetails : this.workExpDetailsForm.controls.org_details.value,
      portfolio: portfolioArray,
      freelancerDocument : this.documentWorkArray,
      areaOfExpertise : this.workExpDetailsForm.controls.area_of_expertise.value,
      personalAttributeStrength :  strengthArr,
      personalAttributeWeakness : weaknessArr
    }
    this.__profileService.saveWorkDetails(orgDetailsPayload).then((resData: any) => {
        this.loading = false;
        if (resData.responseObjec.message == 'success') {
          this.toastr.success("Profile added Successfully");
        }
        else if (resData.status == 'error') {
          this.toastr.error("Profile not saved");
        }
    });
  }

  onSaveSkills(){
    const skillPayload = {
      freelancerSkills: this.skillRateArr.value,
      emailId : this.email
    }
    this.__profileService.saveSkillDetails(skillPayload).then((resData: any) => {
        this.loading = false;
        this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view/', this.email]);

        if (resData.responseObjec.message == 'success') {
          this.toastr.success("Profile added Successfully");
          this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view', this.email]);
        }
        else if (resData.status == 'error') {
          this.toastr.error("Profile not saved");
        }
    });
  }


  ShowNextButton(index) {
    if (this.showMainContent == 1) {
      this.showMainContent = index;

      this.submitted = true;
      // if (this.personalDetailForm.invalid) {
      //   this.showMainContent = 1;

      //   return;
      // } else {
        this.showMainContent = 2;
      // }


    } else if (this.showMainContent == 2) {
      this.showMainContent = index;

      // this.submitted = true;
      // if (this.qualificationDetailForm.invalid) {
      //   this.showMainContent = 2;
      //   return;
      // } else {
        this.showMainContent = 3;
      // }

    } else if (this.showMainContent == 3) {
      this.showMainContent = index;

      this.submitted = true;

      // if (this.workExpDetailsForm.invalid) {
      //   this.showMainContent = 3;
      //   return;
      // } else {
        this.showMainContent = 4;
      // }
    } else if (this.showMainContent == 4) {
      this.showMainContent = index;

      this.submitted = true;
      // if (this.skillDetailsForm.invalid) {
      //   this.showMainContent = 4
      //   return;
      // } else {
        this.showMainContent = 4;
      // }

    } else {
    }
  }

  ShowPreviousButton(index) {
    this.showMainContent = --index;
  }

  /**
    *@name onLogout 
    * @description call Logout
    */
  onLogout() {
    this.__authService.logout();
    this.__router.navigate(['/auth/auth/login']);
  }
}