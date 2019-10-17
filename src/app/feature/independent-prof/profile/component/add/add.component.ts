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
  public personalDetails: FormGroup;
  public qualificationDetails: FormGroup;
  public workExpDetails: FormGroup;
  public skillDetails: FormGroup;

  /* Static Array variables */
  public prefixArr = ['Mr', 'Mrs', 'Miss'];
  public yearArr = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
  public gradeArr = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* skill variables. */
  keyword = 'domainName';
  skillItem: any = [];

  /* Loader Variable's */
  public loading = false;
  public addprofilefreelancer: any;


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
  public eduCatArr: any = [];
  public eduList: any = [];
  public eduListbyId: any = [];
  public eduArr: any = [];

  /* Skill related Array's */
  public skills: any = [];
  public skill: any = [];
  public categ: any = [];


  /* Address related Array's */
  public countryArr: any = [];
  public stateArr: any = [];
  public cityArr: any = [];

  /* Document related Array's */
  public docTypeArr: any = [];
  public documentPersonalArray: any = [];
  public documentQualArray: any = [];
  public documentWorkArray: any = [];
  public documentFileArr: any = [];

  public stateArrByCountryId=[];
  public cityArrByStateId = [];
  public eduTypeArrByEduCatList=[];
  public skillArrBySkillCatList=[];
  public personalAttributes = [];
  public currencyList = [];

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
    this.personalDetails = this.__fb.group({
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
    this.qualificationDetails = this.__fb.group({
      qualification: this.__fb.array([this.__fb.group({
        docCatId: ['', Validators.required],
        docTypeId: ['', Validators.required],
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
    this.workExpDetails = this.__fb.group({
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
    this.skillDetails = this.__fb.group({
      skills: this.__fb.array([])
    });
  }


  // convenience getter for easy access to form fields of Personal Form.
  get personalFormValidation() { return this.personalDetails.controls; }

  // convenience getter for easy access to form fields of Qualification Form.
  get qualifFormValidation() { return this.qualificationDetails.get('qualification') as FormArray; }

  // convenience getter for easy access to form fields of Work Exp Form.
  get workExpFormValidation() { return this.workExpDetails.controls; }

  // convenience getter for easy access to form fields of Skill Management Form.
  get skillMangFormValidation() { return this.skillDetails.controls; }

  /**
   * @name getEducationCat
   * @description get API for all education category of independent prof 
   */
  getEducationCategoryList() {
    this.__customGlobalService.getEducationCategoryList().then((resData: any) => {
      this.eduCatArr = resData.responseObject;
      console.log("Education categories " , this.eduCatArr);
    })
  }

  /**
   * @name getEducationList
   * @description get API for all education data in List
   */
  getEducationTypeList() {
    this.__customGlobalService.getEducationTypeList().then((resData: any) => {
      this.eduList = resData.responseObject;
      console.log('eduList : ', this.eduList);
    })
  }

  setEduTypeListByEduCategoryId(eduCatId , i) {
    
    this.eduTypeArrByEduCatList[eduCatId] = this.eduList.filter((item) => item.masterEduDomain.eduDomainId == eduCatId);
    console.log(this.eduTypeArrByEduCatList);
  }

  /**
   * @method getAllEducation
   * @param eduCat_id
   * @description get all education values based on selected education category id.
   */
  setEduCatByID(eduCat_id) {
    this.__profileService.getFreelancerEducname(eduCat_id).then((resData: any) => {
      this.eduArr = resData;
    })
  }



  /**
 * @method getAllEducation
 * @param eduCat_id
 * @description get all education values based on selected education category id.
 */
  setEduListByCatId(eduCat_id, i) {
    this.eduListbyId[eduCat_id] = this.eduList.filter((item) => item.docCatId == eduCat_id);
    this.qualificationDetails.get('qualification')['controls'][i].patchValue({ docCatId: eduCat_id, docTypeId: '' });

  }
  /**
   * @method getSkillsByID
   * @param skill_cat_id
   * @description get all education category values
   */
  getSkillsByID(skill_cat_id) {
    this.__profileService.getFreelancerSkills(skill_cat_id).then((resData: any) => {
      this.skills = resData;
    })
  }

  /**
   * @name getSkillCategoryList
   * @description get API for all skill category of independent prof 
   */
  getSkillCategoryList() {
    this.__customGlobalService.getSkillDomainList().then((resData: any) => {
      this.categ = resData.responseObject;
      console.log("skill cat" , this.categ );
    })
  }

  

  getSkillTypeList(){
    this.__customGlobalService.getSkillTypeList().then((resData: any) => {
      this.skills = resData.responseObject;
      console.log("skills arrrrrrrrrrrr" , this.skills );
    })
  }

  setSkillArrBySkillCatList(skillDomainId){
    console.log("skill domain id " , skillDomainId );
    
    this.skillArrBySkillCatList = this.skills.filter((item) => item.masterDomain.domainId == skillDomainId);
    console.log("skill array sorted" , this.skillArrBySkillCatList);
  }

  /**
   * @method getCountryList
   * @description get all country values.
   */
  getCountryList() {
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.countryArr = resData.responseObject;
      console.log("CountryArr:", this.countryArr);
      
    });
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

  getCurrencyList(){
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.currencyList = resData.responseObject;
      console.log("currencyList: ", this.currencyList);
    })
  }

  /**
   * @method setDocTypeCatID
   * @param city_id
   * @description get the zipcode based on selected city id.
   */
  setDocTypeCatID(id) {
    this.doc_cat_id = id;
  }

  getPersonalAttributes(){
    this.__customGlobalService.getPersonalAttributeList().then((resData: any) => {
      this.personalAttributes = resData.responseObject;
      console.log("personal atrributes: ", this.personalAttributes);
      
    })
  }
  /**
   * @name getDocumentsTypeCat
   * @description get API for all document category type of independent prof 
   */
  getDocumentsTypeCat(index) {
    this.__profileService.getFreelancerDocumentByCat(index).then((resData: any) => {
      this.docTypeArr = resData.responseObject;
      console.log("Document array " , this.docTypeArr);
      
    })

  }

  /**
   * @method selectEvent
   * @param item
   * @description get the selected skill id and pass to getSkillsByID.
   */
  selectEvent(item) {
    const skills = item;
    const skill_id = skills.skill_cat_id;
    console.log("item:",item);
    
    this.setSkillArrBySkillCatList(item.domainId)
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  /**
  * @description Qualification FormArray (Dynamicaly create input)
  */

  get qualfArr() {
    return this.qualificationDetails.get('qualification') as FormArray;
  }

  addQualification() {
    this.qualfArr.push(this.__fb.group(
      {
        docCatId: '',
        docTypeId: '',
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

  /**
  * @description Orgnization FormArray (Dynamicaly create input)
  */

  get orgArr() {
    return this.workExpDetails.get('org_details') as FormArray;
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

  /**
  * @description strength FormArray (Dynamicaly create input)
  */

  get strengthArr() {
    return this.workExpDetails.get('strength') as FormArray;
  }

  addStrength() {
    this.strengthArr.push(this.__fb.group({ strength: '' }));
  }

  deleteStrength(index) {
    this.strengthArr.removeAt(index);
  }

  /**
  * @description weakness FormArray (Dynamicaly create input)
  */

  get weaknessArr() {
    return this.workExpDetails.get('weakness') as FormArray;
  }

  addWeakness() {
    this.weaknessArr.push(this.__fb.group({ weakness: '' }));
  }

  deleteWeakness(index) {
    this.weaknessArr.removeAt(index);
  }


  /**
  * @description portfolio FormArray (Dynamicaly create input)
  */

  get portfolioArr() {
    return this.workExpDetails.get('portfolios') as FormArray;
  }

  addPortfolio() {
    this.portfolioArr.push(this.__fb.group({ portfolio: '' }));
  }

  deletePortfolio(index) {
    this.portfolioArr.removeAt(index);
  }

  /**
  * @description Documents FormArray (Dynamicaly create input)
  */
  get documentArr() {
    return this.personalDetails.get('documents_personal') as FormArray;
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

  /**
  * @description Work Documents FormArray (Dynamicaly create input)
  */

  get workdocumentArr() {
    return this.workExpDetails.get('documents_work') as FormArray;
  }

  getValidity(i) {
    return (<FormArray>this.workExpDetails.get('documents_work')).controls[i].invalid;
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

  /**
 * @description Skill FormArray (Dynamicaly create input)
 */

  get skillRateArr() {
    return this.skillDetails.get('skills') as FormArray;
  }

  onChange(skill: string, skill_id: number, isChecked: boolean) {
    console.log("jyoti", skill);

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
      console.log(this.skillRateArr)
    }
    console.log("this.skillRateArr", this.skillRateArr);

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
      this.fileName = file.name.replace(" ", "");
      this.fileObj = file;
      console.log("File name:", this.fileName);
      console.log("File obj:", this.fileObj);
    }
  }


  async uploadPersonalFile() {
    this.loading = true;

    this.fileUploadProgress = '0%';
    await this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;
      console.log("Data Resp:", this.FileArrData);
      console.log("Resp File ID:", this.FileArrData.fileId);

      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }

      // file upload progress start
      /* if (event.type === HttpEventType.UploadProgress) {
         this.fileUploadProgress = Math.round(event.loaded / event.total * 100) + '%';
         console.log(this.fileUploadProgress);
       } else if (event.type === HttpEventType.Response) {
         this.fileUploadProgress = '';
         console.log(event.body);
         this.toastr.success(this.fileName, "Successfully uploaded");
       } */
     // file upload progress end
    });

    //await 
    this.documentPersonalArray.push(
      {
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': this.doc_cat_id
      });
    console.log("Personal Document " , this.documentPersonalArray);
  }

  uploadEducationFile() {
    this.loading = true;
    this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;
      console.log("File Resp:", this.FileArrData.fileId);
      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }
    });

    this.documentQualArray.push(
      {
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': 4
      });
    console.log(this.documentQualArray);
  }

  uploadWorkExpFile() {
    this.loading = true;
    this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;
      console.log("File Resp:", this.FileArrData.fileId);
      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }
    });

    this.documentWorkArray.push(
      {
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': this.doc_cat_id
      });
    console.log("work document" ,this.documentWorkArray);
  }


  /**
   * @name onSubmitDetails
   * @description submit the form filed value to serer through REST API
   */


  savePersonalDetails(){
    console.log("email" , this.email);
    
    const personalData = {
      emailId: this.email,
      prefix: this.personalDetails.controls.prefix.value,
      firstName: this.personalDetails.controls.first_name.value,
      middleName: this.personalDetails.controls.middle_name.value,
      lastName: this.personalDetails.controls.last_name.value,
      addressLine1: this.personalDetails.controls.address_one.value,
      addressLine2: this.personalDetails.controls.address_two.value,
      country: this.personalDetails.controls.country.value,
      province: this.personalDetails.controls.province.value,
      city: this.personalDetails.controls.city.value,
      postalCode: this.personalDetails.controls.postal_code.value,
      freelancerDocuments: this.documentPersonalArray
    }

    console.log('Freelancer Payload Value : ', personalData);

    this.__profileService.savePersonalDetails(personalData).then((resData: any) => {
      console.log("Res Data:", resData);
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

   console.log("qualification details" ,  this.qualificationDetails.controls.qualification.value);

    this.__profileService.saveEducationDetails(this.qualificationDetails.controls.qualification.value).then((resData: any) => {
        console.log("Res Data:", resData);
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
    for(i = 0 ; i < this.workExpDetails.controls.portfolios.value.length ; i++){
      portfolioArray[i]=this.workExpDetails.controls.portfolios.value[i].portfolio;
    }
    console.log("portfolioArr" , portfolioArray);


    let strengthArr = [];
    for(i = 0 ; i < this.workExpDetails.controls.strength.value.length ; i++){
      strengthArr[i]=this.workExpDetails.controls.strength.value[i].strength;
    }
    console.log("strength" , this.workExpDetails.controls.strength.value);
    console.log("strength" , strengthArr);


    let weaknessArr = [];
    for(i = 0 ; i <  this.workExpDetails.controls.weakness.value.length ; i++){
      weaknessArr[i]=this.workExpDetails.controls.weakness.value[i].weakness;
    }
    console.log("weaknessArr" , weaknessArr);
    console.log("weaknessArr" , weaknessArr);

    
    // console.log("work details" ,  this.workExpDetails.controls.org_details.value);
   // console.log()
    const orgDetailsPayload = {
      email: this.email,
      freelancerOrgDetails : this.workExpDetails.controls.org_details.value,
      portfolio: portfolioArray,
      freelancerDocument : this.documentWorkArray,
      areaOfExpertise : this.workExpDetails.controls.area_of_expertise.value,
      personalAttributeStrength :  strengthArr,
      personalAttributeWeakness : weaknessArr
    }

     console.log("org details " , orgDetailsPayload);
  
     this.__profileService.saveWorkDetails(orgDetailsPayload).then((resData: any) => {
        console.log("Res Data:", resData);
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
    console.log("skill array :" , skillPayload);
    
    this.__profileService.saveSkillDetails(skillPayload).then((resData: any) => {
        console.log("Res Data:", resData);
        this.loading = false;
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
    console.log("Value :", this.showMainContent);


    if (this.showMainContent == 1) {
      this.showMainContent = index;

      this.submitted = true;
      // if (this.personalDetails.invalid) {
      //   this.showMainContent = 1;

      //   return;
      // } else {
        this.showMainContent = 2;
      // }


    } else if (this.showMainContent == 2) {
      this.showMainContent = index;

      // this.submitted = true;
      // if (this.qualificationDetails.invalid) {
      //   this.showMainContent = 2;
      //   return;
      // } else {
        console.log("Next btn in 2 page");
        this.showMainContent = 3;
      // }

    } else if (this.showMainContent == 3) {
      this.showMainContent = index;

      this.submitted = true;

      // if (this.workExpDetails.invalid) {
      //   this.showMainContent = 3;
      //   return;
      // } else {
        console.log("Next btn in 3 page");
        this.showMainContent = 4;
      // }
    } else if (this.showMainContent == 4) {
      this.showMainContent = index;

      this.submitted = true;
      // if (this.skillDetails.invalid) {
      //   this.showMainContent = 4
      //   return;
      // } else {
        console.log("Next btn in 4 page");
        this.showMainContent = 4;
      // }

    } else {
      console.log("Nothing to save");
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


  validDate(event){

  }

  /**
 * @name onCancel
 * @description call Cancel the process
 */
  //  onCancel() {
  //   this.employerProfileForm.reset();
  // }

}