import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IndeptProfileService } from '../../shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  // FormGroup object's
  public personalDetailsForm: FormGroup;
  public qualificationDetailsForm: FormGroup;
  public workExpDetailsForm: FormGroup;
  public skillDetailsForm: FormGroup;

  // Static Array variables
  public prefixArr = ['Mr', 'Mrs', 'Miss'];
  public yearArr = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
  public gradeArr = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Loader Variable's
  public editprofilefreelancer: any;
  public loading = false;

  // Variable's
  public showMainContent: number = 1;
  public isUportUser: string;
  public email: string;
  public country: string;
  public doc_cat_id: number;
  public __id: any;
  public uid: any;
  public checkMarked: string;
  public edu_catId: number;

  // Document Variable's
  public fileType: any;
  public fileName: any;
  public fileObj: any;

  //skill variables.
  keyword = 'skill_cat_name';
  skillItem: any = [];

  // Education Array's
  public congnitoID: any = [];
  public eduArr: any = [];
  public eduListArrbyId: any = [];

  // Skill Array's


  // Address Array's
  
  public stateByIdArr: any = [];
  public cityByIdArr: any = [];

  // REST get API's Array's
  public qualityArray: any = [];
  public freelancerEduArr: any = [];
  public freelancerOrgArr: any = [];
  public freelancerPortArr: any = [];

  // Document Array's
  public FileArrData: any = [];
  public freelancerDocsArr: any = [];
  public docTypeArr: any = [];
  public documentPersonalArray: any = [];
  public documentQualArray: any = [];
  public documentWorkArray: any = [];

  // Skill Array's
  public freelancerSkillDetailsFormArr: any = [];
  public skillArr: any = [];
  public skillList: any = [];



  //used by shefali
  public freelancerArr : any = [];
  public freeSkillDetailArr : any = [];
  public freeStrengthArr : any = [];
  public freeWeaknessArr : any = [];
  public freePortfolioArr : any = [];
  public freeWorkDetailArr : any = [];
  public freeEducationArr : any = [];
  public freeDocumentArr : any = [];
  public countryArr : any = [];
  public stateArr : any = [];
  public cityArr : any = [];
  public stateArrByCountryId : any = [];
  public cityArrByStateId : any = [];
  public eduCatArr : any = [];
  public eduTypeArr : any = [];
  public personalAttributeArr : any = [];
  public currencyArr : any = [];
  public skills : any = [];
  public skillCatArr : any = []; 
  public skillArrBySkillCatList : any = [];
  public eduTypeArrByEduCatList : any = [];



  constructor(
    private __fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private __customGlobalService: CustomGlobalService

  ) {
    // this.__id = this.__activatedRoute.snapshot.params.id;
  }

  async ngOnInit() {

    this.isUportUser = localStorage.getItem("uportUser");

    if (this.isUportUser == "false") {

      const user = this.__authService.decode();
      this.congnitoID = user["cognito:username"];
      this.email = user["email"];
      this.uid = user["uid"];
      this.country = user["custom:country"];

    } else {
      this.congnitoID = "TEST";
      this.uid = localStorage.getItem("uid");
      this.email = localStorage.getItem("email");
      this.country = localStorage.getItem("country");
    }

    /**
    * @description validate all form's fileds
    */
    this.validatePersonalProfile();
    this.validateQualificationProfile();
    this.validateWorlExpProfile();
    this.validateSkillsProfile();

    /**
      * @description Get API call function
      */
    // this.getFreelancerDetails();
    // this.getAllEducationCat();
    // this.getAllSkillCategory();
    // this.getDocumentsTypeCat(1);

    // this.getFreelancerSkillDetailsForm();
    // this.getQualitiesById();
    // this.getFreelancerDocuments();
    // this.getFreelancerOrganization();
    // this.getFreelancerPortfolio();
    // this.setAllFreelancerData();
    await this.getEducationCategoryList();
    await this.getEducationTypeList();
    await this.getSkillCategoryList();
    await this.getSkillTypeList();
    await this.getCurrencyList();
    await this.getPersonalAttributes();
    await this.getDocumentsTypeCat(1);

    this.getFreelancerDetails();
  }
  

  validatePersonalProfile() {
    this.personalDetailsForm = this.__fb.group({
      prefix: ['', Validators.required],
      firstName: ['', Validators.compose([
        Validators.required, Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      middleName: ['', Validators.compose([
        Validators.required, Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      lastName: ['', Validators.compose([
        Validators.required, Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      addressLine1: ['', [Validators.required, Validators.maxLength(25)]],
      addressLine2: ['', [Validators.required, Validators.maxLength(25)]],
      country: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.compose([
        Validators.required, Validators.maxLength(8), Validators.minLength(6),
        Validators.pattern("^[0-9]*$")
      ])],
      documents_personal: this.__fb.array([]),
    });
  }
  validateQualificationProfile() {
    this.qualificationDetailsForm = this.__fb.group({
      qualification: this.__fb.array([]),
    });
  }
  validateWorlExpProfile() {
    this.workExpDetailsForm = this.__fb.group({
      org_details: this.__fb.array([]),
      strength: this.__fb.array([]),
      weakness: this.__fb.array([]),
      portfolios: this.__fb.array([]),
      references: ['', [Validators.required, Validators.maxLength(25)]],
      area_of_expertise: ['', [Validators.required, Validators.maxLength(25)]],
      psychomatric: ['', [Validators.required, Validators.maxLength(25)]],
      isFreelancer: ['', Validators.required],
      documents_work: this.__fb.array([])
    });
  }
  validateSkillsProfile() {
    this.skillDetailsForm = this.__fb.group({
      skills: this.__fb.array([]),
    });
  }

  /**
   * @author Shefali Bhavekar ( Date : 10-24-2019 )
   * @method getCountryList()
   * @description get all countries from mysql-database(using SpringBoot-API).
   */
  getCountryList() {
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.countryArr = resData.responseObject;
    })
  }

  /**
   * @author Shefali Bhavekar ( Date : 10-24-2019 )
   * @method getStateList()
   * @description get all states from mysql-database(using SpringBoot-API).
   */
  getStateList() {
    this.__customGlobalService.getStateList().then((resData: any) => {
      this.stateArr = resData.responseObject;
      this.setStateListByCountryId(this.freelancerArr.country.countryId);
    })
  }

   /**
   * @author Shefali Bhavekar ( Date : 10-24-2019 )
   * @method getStateList()
   * @description get all states from mysql-database(using SpringBoot-API).
   */
  getCityList(){
    this.__customGlobalService.getCityList().then((resData: any) => {
      this.cityArr = resData.responseObject;
      this.setCityListByStateId(this.freelancerArr.province.stateId);
    })
  }

  setStateListByCountryId(countryId) {    
    this.stateArrByCountryId[countryId] = this.stateArr.filter((item) => item.masterCountry.countryId == countryId);
    this.personalDetailsForm.patchValue({
      country: this.freelancerArr.country.countryId,
      province: this.freelancerArr.province.stateId,
    });
  }

  

  setCityListByStateId(stateId){
    this.cityArrByStateId[stateId] = this.cityArr.filter((item) => item.masterStates.stateId == stateId);
    this.personalDetailsForm.patchValue({
      city: this.freelancerArr.city.cityId,
    });
  }

  getEducationCategoryList() {
    this.__customGlobalService.getEducationCategoryList().then((resData: any) => {
      this.eduCatArr = resData.responseObject;
    })
  }

  setEduTypeListByEduCategoryId(eduCatId) {
    this.eduTypeArrByEduCatList[eduCatId] = this.eduTypeArr.filter((item) => item.masterEduDomain.eduDomainId == eduCatId); 
  }

  getEducationTypeList() {
    this.__customGlobalService.getEducationTypeList().then((resData: any) => {
      this.eduTypeArr = resData.responseObject;
    })
  }

  getPersonalAttributes(){
    this.__customGlobalService.getPersonalAttributeList().then((resData: any) => {
      this.personalAttributeArr = resData.responseObject;      
    })
  }

  getSkillCategoryList() {
    this.__customGlobalService.getSkillDomainList().then((resData: any) => {
      this.skillCatArr = resData.responseObject;
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

  getCurrencyList(){
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.currencyArr = resData.responseObject;
    })
  }

  async getFreelancerDetails() {

    await this.__profileService.getFreelancerByEmail().then((resData: any) => {    
      console.log("Freelancer Data : " ,resData );
      
      this.freelancerArr = resData.responseObject.freelancerProfile;
      this.freeEducationArr = resData.responseObject.freelancerEdu
      this.freeSkillDetailArr = resData.responseObject.skills,
      this.freePortfolioArr = resData.responseObject.portfolio,
      this.freeWorkDetailArr = resData.responseObject.workExperience,
      this.freeStrengthArr = resData.responseObject.strength,
      this.freeWeaknessArr = resData.responseObject.weakness,
      this.freeDocumentArr = resData.responseObject.freelancerDocument
     
      this.setFreelancerArr();
      this.setFreeEducationArr();
      this.setFreeWorkDetailArr();
      this.setFreeStrengthArr();
      this.setFreeWeaknessArr();
      this.setFreePortfolioArr();
      this.setFreeDocumentArr();
      this.setSkillDetailArr();
    });
  }
 
  async setFreelancerArr(){
    this.checkMarked = this.freelancerArr.is_interviewer;

    if (this.freelancerArr != null) {

      this.personalDetailsForm.patchValue({
        prefix: this.freelancerArr.prefix,
        firstName: this.freelancerArr.firstName,
        middleName: this.freelancerArr.middleName,
        lastName: this.freelancerArr.lastName,
        addressLine1: this.freelancerArr.addressLine1,
        addressLine2: this.freelancerArr.addressLine2,
        postalCode: this.freelancerArr.postalCode,
      });

      this.workExpDetailsForm.patchValue({
        references: this.freelancerArr.reference,
        area_of_expertise: this.freelancerArr.areaOfExpertise,
        psychomatric: this.freelancerArr.psyco_result,
        isFreelancer: this.freelancerArr.is_interviewer
      });

      await this.getCountryList();
      await this.getStateList();
      await this.getCityList();
    }
  }

  async setFreeEducationArr(){
    console.log("freeEducationArr", this.freeEducationArr);
    
    if (this.freeEducationArr.length > 0) {
      for (let index = 0; index < this.freeEducationArr.length; index++) {
;
        this.qualfArr.push(this.__fb.group(
          {
            eduDomainName: this.freeEducationArr[index].masterEduDomain.eduDomainName,
            educationTypeName: this.freeEducationArr[index].masterEduType.educationTypeName,
            eduCatId: this.freeEducationArr[index].masterEduDomain.eduDomainId,
            eduTypeId: this.freeEducationArr[index].masterEduType.educationTypeId,
            university: this.freeEducationArr[index].university,
            passingYear: this.freeEducationArr[index].passingYear,
            percentage: this.freeEducationArr[index].percentage,
            grade: this.freeEducationArr[index].grade,
            // doc_name: docName,
            edu_id: this.freeEducationArr[index].edu_id
          }
        ));
        this.setEduTypeListByEduCategoryId(this.freeEducationArr[index].masterEduDomain.eduDomainId);
      }
    } else {
      this.addQualification();
    }
  }

  setFreeWorkDetailArr(){
    if (this.freeWorkDetailArr.length > 0) {
      for (let index = 0; index < this.freeWorkDetailArr.length; index++) {
        this.orgArr.push(this.__fb.group(
          {
            organization: this.freeWorkDetailArr[index].organization,
            designation: this.freeWorkDetailArr[index].designation,
            startDate: this.freeWorkDetailArr[index].startDate,
            endDate: this.freeWorkDetailArr[index].endDate,
            responsibilities: this.freeWorkDetailArr[index].responsibilities,
            freelancerWorkExperienceId: this.freeWorkDetailArr[index].freelancerWorkExperienceId
          }
        ));
      }
    } else {
      this.addResponsibility()
    }
  }

  setFreeStrengthArr(){
    if (this.freeStrengthArr.length > 0) {
        this.freeStrengthArr.forEach(item => {
          this.strengthArr.push(
            this.__fb.group({
              strength: item.personalAttribute.attributeName,
              strengthId: item.strengthId
            })
          )
        });
    } else {
        this.addStrength();
    }
  }

  setFreeWeaknessArr(){
    if (this.freeWeaknessArr.length > 0) {
      this.freeWeaknessArr.forEach(item => {
        this.weaknessArr.push(
          this.__fb.group({
            weakness: item.personalAttribute.attributeName,
            weaknessId: item.weaknessId
          })
        )
      });
    } else {
      this.addWeakness();
    }

  }

  setFreePortfolioArr(){
    if (this.freePortfolioArr.length > 0) {
      let portflio = this.workExpDetailsForm.get('portfolios') as FormArray;
      for (let index = 0; index < this.freePortfolioArr.length; index++) {
        portflio.push(this.__fb.group({
          portfolio: this.freePortfolioArr[index].portfolioUrl,
          portfolioUrlId: this.freePortfolioArr[index].portfolioUrlId
        }));
      }
    } else {
      this.addPortfolio();
    }
  }

  setFreeDocumentArr(){
    console.log("this.freelancerDocsArr : \n", this.freeDocumentArr);
    
    let isPersonal = this.freeDocumentArr.filter(item => item.masterDocumentType.masterDocDomain.domainName == 'personal');
    if (isPersonal.length > 0) {
      isPersonal.forEach(item => {
            this.documentArr.push(
              this.__fb.group({
                documentUrl: item.documentUrl,
                documentTypeId: item.documentTypeId,
                documentId: item.documentId
              })
            )
        });
    } else {
      this.addDocument();
    }

    let isEducation = this.freelancerDocsArr.filter(item => item.masterDocumentType.masterDocDomain.domainName == 'educational');
    if (isPersonal.length > 0) {  
      isEducation.forEach(item => {
          this.documentQualArray.push({
            documentUrl: item.documentUrl,
            documentTypeId: item.documentTypeId,
            documentId: item.documentId
          });
        });
    } else {
      this.addDocument();
    }

    let isProfessional = this.freelancerDocsArr.filter(item => item.masterDocumentType.masterDocDomain.domainName == 'professional');

      if (isProfessional.length > 0) {
        isProfessional.forEach(item => {
          this.workdocumentArr.push(
            this.__fb.group({
              documentUrl: item.documentUrl,
              documentTypeId: item.documentTypeId,
              documentId: item.documentId
            })
          )
        });
      } else {
        this.addWorkDocument();
      }

  }
  
  setSkillDetailArr(){
    if (this.freeSkillDetailArr.length > 0) {
      let skillCat_ID = this.freeSkillDetailArr[0].skill_cat_id;
      this.setSkillArrBySkillCatList(skillCat_ID);

      for (let index = 0; index < this.freeSkillDetailArr.length; index++) {
        this.skillRateArr.push(this.__fb.group(
          {
            skillName: this.freeSkillDetailArr[index].skillId.skillName,
            rateHour: this.freeSkillDetailArr[index].hourlyRate,
            skillExperience:this.freeSkillDetailArr[index].skillExperience,
            freelancerSkillId: this.freeSkillDetailArr[index].freelancerSkillId
          }
        ));
      }
    } else {
      this.selectEvent(0);
      this.setSkillArrBySkillCatList(1);
    }

  }

  setAllFreelancerData() {
    this.personalDetailsForm.get('prefix').setValue(this.freelancerArr.prefix);
    this.personalDetailsForm.get('firstName').setValue(this.freelancerArr.firstName);
    this.personalDetailsForm.get('middleName').setValue(this.freelancerArr.middleName);
    this.personalDetailsForm.get('lastName').setValue(this.freelancerArr.lastName);
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
    await this.__profileService.getFreelancerStateByID(country_id).then((resData: any) => {
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

    await this.__profileService.getFreelancerCityByID(state_id).then((resData: any) => {
      this.cityArr = resData;
    })
  }

  /**
   * @method setDocTypeCatID
   * @param city_id
   * @description get the zipcode based on selected city id.
   */
  setDocTypeCatID(id) {
    console.log(this.doc_cat_id = id);
  }

  /**
   * @name getDocumentsTypeCat
   * @description get API for all document category type of independent prof 
   */
  getDocumentsTypeCat(index) {
    this.__profileService.getFreelancerDocumentByCat(index).then((resData: any) => {
      this.docTypeArr = resData;
    })

  }

  /**
   * @method selectEvent
   * @param item
   * @description get the selected skill id and pass to getSkillsByID.
   */
  selectEvent(item) {
    console.log("Skill click:", item);

    const skills = item;
    const skill_id = skills.skill_cat_id;
    this.setSkillArrBySkillCatList(skill_id)
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
    return this.qualificationDetailsForm.get('qualification') as FormArray;
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

  /**
  * @description Orgnization FormArray (Dynamicaly create input)
  */

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

  /**
  * @description strength FormArray (Dynamicaly create input)
  */

  get strengthArr() {
    return this.workExpDetailsForm.get('strength') as FormArray;
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
    return this.workExpDetailsForm.get('weakness') as FormArray;
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
    return this.workExpDetailsForm.get('portfolios') as FormArray;
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
    return this.personalDetailsForm.get('documents_personal') as FormArray;
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
    return this.workExpDetailsForm.get('documents_work') as FormArray;
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
    return this.skillDetailsForm.get('skills') as FormArray;
  }

  onChange(skill: string, skill_id: number, isChecked: boolean) {
    console.log("Skill selected:", skill, skill_id, isChecked);
    if (isChecked && skill != null) {
      this.skillRateArr.push(this.__fb.group(
        {
          skillName: skill,
          skillId: skill_id,
          rateHour: '',
          skillExperience: '',
          freelancerSkillId:''
        }
      ));
    }
    else {
      let index = this.skillRateArr.controls.findIndex(x => x.value == skill);
      this.skillItem.removeAt(index);
    }
  }

  /**
 * @description File Handler
 */

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
    await this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;
      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }
    });

    await this.documentPersonalArray.push(
      {
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': this.doc_cat_id
      });
    console.log(this.documentPersonalArray);
  }

  uploadEducationFile() {
    this.loading = true;
    this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
      this.FileArrData = event;
      this.loading = false;
      console.log("File Resp:", this.FileArrData.fileId);
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
    });

    this.documentWorkArray.push(
      {
        'documentUrl': this.FileArrData.fileId,
        'documentTypeId': this.doc_cat_id
      });
    console.log(this.documentWorkArray);
  }



  /**
   * @name onSubmitDetails
   * @description submit the form filed value to serer through REST API
   */

  onSubmitDetails() {

    let documentArr: any = [
      'documentUrl',
      'documentTypeId'
    ];

    let qualitiesArr: any = [
      'strength',
      'weakness'
    ];

    console.log(documentArr.legth);


    documentArr = [...this.documentPersonalArray, ...this.documentWorkArray, ...this.documentQualArray];
    console.log(documentArr);

    qualitiesArr = [
      {
        strengths: this.workExpDetailsForm.controls.strength.value
      },
      {
        weaknesses: this.workExpDetailsForm.controls.weakness.value
      },
    ];
    console.log(qualitiesArr);
    const freelancerProfilePayload = {};
    if (this.isUportUser == "false") {
      const freelancerProfilePayload = {
        cognito_id: this.congnitoID,
        email: this.email,
        prefix: this.personalDetailsForm.controls.prefix.value,
        firstName: this.personalDetailsForm.controls.firstName.value,
        middleName: this.personalDetailsForm.controls.middleName.value,
        lastName: this.personalDetailsForm.controls.lastName.value,
        addressLine1: this.personalDetailsForm.controls.addressLine1.value,
        addressLine2: this.personalDetailsForm.controls.addressLine2.value,
        country: this.personalDetailsForm.controls.country.value,
        province: this.personalDetailsForm.controls.province.value,
        city: this.personalDetailsForm.controls.city.value,
        postalCode: this.personalDetailsForm.controls.postalCode.value,
        documents: documentArr,
        edu_details: this.qualificationDetailsForm.controls.qualification.value,
        org_details: this.workExpDetailsForm.controls.org_details.value,
        qualities: qualitiesArr,
        portfolio: this.workExpDetailsForm.controls.portfolios.value,
        references: this.workExpDetailsForm.controls.references.value,
        area_of_experties: this.workExpDetailsForm.controls.area_of_expertise.value,
        psychomatric: this.workExpDetailsForm.controls.psychomatric.value,
        is_interviewer: this.workExpDetailsForm.controls.isFreelancer.value,
        skills: this.skillRateArr.value,
        uid: 0
      }
      console.log('Freelancer Payload Value : ', freelancerProfilePayload);
      this.__profileService.updateFreelancer(this.email, freelancerProfilePayload).then((resData: any) => {
        console.log("Resp Data:", resData);
        if (resData.status == 'success') {
          this.toastr.success("Profile added Successfully");
          this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view', this.email]);
        }
        else if (resData.status == 'error') {
          this.toastr.error("Profile not saved");
        }
      });
    }
    else {

      const freelancerProfilePayload = {
        cognito_id: this.email,
        email: this.email,
        prefix: this.personalDetailsForm.controls.prefix.value,
        firstName: this.personalDetailsForm.controls.firstName.value,
        middleName: this.personalDetailsForm.controls.middleName.value,
        lastName: this.personalDetailsForm.controls.lastName.value,
        addressLine1: this.personalDetailsForm.controls.addressLine1.value,
        addressLine2: this.personalDetailsForm.controls.addressLine2.value,
        country: this.personalDetailsForm.controls.country.value,
        province: this.personalDetailsForm.controls.province.value,
        city: this.personalDetailsForm.controls.city.value,
        postalCode: this.personalDetailsForm.controls.postalCode.value,
        documents: documentArr,
        edu_details: this.qualificationDetailsForm.controls.qualification.value,
        org_details: this.workExpDetailsForm.controls.org_details.value,
        qualities: qualitiesArr,
        portfolio: this.workExpDetailsForm.controls.portfolios.value,
        references: this.workExpDetailsForm.controls.references.value,
        area_of_experties: this.workExpDetailsForm.controls.area_of_expertise.value,
        psychomatric: this.workExpDetailsForm.controls.psychomatric.value,
        is_interviewer: this.workExpDetailsForm.controls.isFreelancer.value,
        skills: this.skillRateArr.value,
        uid: 0
      }
      console.log('Freelancer Payload Value : ', freelancerProfilePayload);
      this.__profileService.updateFreelancer(this.email, freelancerProfilePayload).then((resData: any) => {
        console.log("Resp Data:", resData);
        if (resData.status == 'success') {
          this.toastr.success("Profile added Successfully");
          this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view', this.email]);
        }
        else if (resData.status == 'error') {
          this.toastr.error("Profile not saved");
        }
      });
    }
  }

  ShowNextButton(index) {
    this.showMainContent = index;
    if (this.showMainContent === 1) {
      this.getDocumentsTypeCat(this.showMainContent);
    } else if (this.showMainContent === 2) {
      this.getDocumentsTypeCat(this.showMainContent);
    } else if (this.showMainContent === 3) {
      this.getDocumentsTypeCat(this.showMainContent);
    } else if (this.showMainContent === 4) {
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

}
