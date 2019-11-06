import { Component, OnInit,ViewChild,ElementRef,ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import { IndeptProfileService } from '../../shared/service/profile.service';
import { ToastrService } from 'ngx-toastr';
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';
import Swal from 'sweetalert2';


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
  public availabilityArr = ['Full Time', "Part Time"];
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
  public countryArr: any = [];
  public stateArr: any = [];
  public cityArr: any = [];
  public stateArrByCountryId: any = [];
  public cityArrByStateId: any = [];
  public eduCatArr: any = [];
  public eduTypeList: any = [];
  public eduTypeArrByEduCatList: any = [];
  public skills: any = [];
  public skillArrBySkillCatList: any = [];
  public personalAttributes: any = [];
  public currencyList: any = [];
  public docTypeArr: any = [];
  public languageArr: any = [];
  ProfilePhoto: any;

  constructor(
    /* Constructor variable's */
    private __fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
    private __customGlobalService: CustomGlobalService,
    private cd: ChangeDetectorRef
  ) {

  }

  registrationForm = this.__fb.group({
    file: [null]
  }) 

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
    this.getDocumentList();
    this.getCurrencyList();
    this.getLanguageList();
  }

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
      preferredPaymentMethod: ['', Validators.required],
      availabilityForWork: ['', Validators.required],
      languagePreferred: ['', Validators.required],
      documents_personal: this.__fb.array([this.__fb.group(
        {
          documentUrl: [''],
          documentTypeId: ['']
        })]),
    });
  }

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
        documentTypeId: ['', Validators.required],
        grade: ['', Validators.required],
        doc_name: ['', Validators.required]
      })]),
    });
  }

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

  validateSkillsProfile() {
    this.skillDetailsForm = this.__fb.group({
      skills: this.__fb.array([])
    });
  }

  get personalFormValidation() { return this.personalDetailForm.controls; }
  get qualifFormValidation() { return this.qualificationDetailForm.get('qualification') as FormArray; }
  get workExpFormValidation() { return this.workExpDetailsForm.controls; }
  get skillMangFormValidation() { return this.skillDetailsForm.controls; }

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
  setEduTypeListByEduCategoryId(eduCatId, i) {
    this.eduTypeArrByEduCatList[eduCatId] = this.eduTypeList.filter((item) => item.masterEduDomain.eduDomainId == eduCatId);
  }

  getDocumentList() {
    this.__customGlobalService.getDocumentList().then((resData: any) => {
      this.docTypeArr = resData.responseObject;
    })
  }
  getSkillCategoryList() {
    this.__customGlobalService.getSkillDomainList().then((resData: any) => {
      this.categ = resData.responseObject;
    })
  }
  getSkillTypeList() {
    this.__customGlobalService.getSkillTypeList().then((resData: any) => {
      this.skills = resData.responseObject;
    })
  }
  setSkillArrBySkillCatList(skillDomainId) {
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
  getCurrencyList() {
    this.__customGlobalService.getCurrencyList().then((resData: any) => {
      this.currencyList = resData.responseObject;
    })
  }
  getPersonalAttributes() {
    this.__customGlobalService.getPersonalAttributeList().then((resData: any) => {
      this.personalAttributes = resData.responseObject;
    })
  }
  getLanguageList() {
    this.__customGlobalService.getLanguageList().then((resData: any) => {
      this.languageArr = resData.responseObject;
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

  // Auto complete methods 
  selectEvent(item) {
    this.setSkillArrBySkillCatList(item.domainId)
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
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
        documentTypeId: '',
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
    this.strengthArr.push(this.__fb.group({ strength: '', strengthId: 0 }));
  }

  deleteStrength(index) {
    this.strengthArr.removeAt(index);
  }

  get weaknessArr() {
    return this.workExpDetailsForm.get('weakness') as FormArray;
  }

  addWeakness() {
    this.weaknessArr.push(this.__fb.group({ weakness: '', weaknessId: 0 }));
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
          expertiseLevel: '',
          currency: ''
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

    this.documentPersonalArray.push({
      'documentUrl': this.fileName,
      'documentTypeId': this.doc_cat_id
    });
    // this.loading = true;
    // this.fileUploadProgress = '0%';
    // await this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
    //     this.FileArrData = event;
    //     this.loading = false;
    //     if (this.FileArrData) {
    //       this.toastr.success(this.fileName, "Successfully uploaded");
    //       this.documentPersonalArray.push({
    //         'documentUrl': this.FileArrData.fileId,
    //         'documentTypeId': this.doc_cat_id
    //       });
    //     } else {
    //       this.toastr.error(this.fileName, "File not uploaded");
    //     }
    // });
  }

  uploadEducationFile() {

    this.documentQualArray.push({
      'documentUrl': this.fileName,
      'documentTypeId': this.doc_cat_id
    });

    // this.loading = true;
    // this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
    //   this.FileArrData = event;
    //   this.loading = false;
    //   if (this.FileArrData) {
    //     this.toastr.success(this.fileName, "Successfully uploaded");
    //     this.documentQualArray.push({
    //       'documentUrl': this.FileArrData.fileId,
    //       'documentTypeId': this.doc_cat_id
    //     });
    //   } else {
    //     this.toastr.error(this.fileName, "File not uploaded");
    //   }
    // });
  }

  uploadWorkExpFile() {
    this.documentWorkArray.push({
      'documentUrl': this.fileName,
      'documentTypeId': this.doc_cat_id
    });
    // this.loading = true;
    // this.__profileService.postDocHashData(this.fileObj, this.email, this.fileName).then((event) => {
    //   this.FileArrData = event;
    //   this.loading = false;
    //   if (this.FileArrData) {
    //     this.toastr.success(this.fileName, "Successfully uploaded");
    //     this.documentWorkArray.push( {
    //       'documentUrl': this.FileArrData.fileId,
    //       'documentTypeId': this.doc_cat_id
    //     });
    //   } else {
    //     this.toastr.error(this.fileName, "File not uploaded");
    //   }
    // });
  }

  savePersonalDetailForm() { 
   
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
      preferredPaymentMethod: this.personalDetailForm.controls.preferredPaymentMethod.value,
      availabilityForWork: this.personalDetailForm.controls.availabilityForWork.value,
      languagePreferred: this.personalDetailForm.controls.languagePreferred.value,
      freelancerDocuments: this.documentPersonalArray,
      photo:this.registrationForm.value.file
    }
    console.log("in personal : ", personalData);

    // this.__profileService.savePersonalDetails(personalData).then((resData: any) => {
    //   this.loading = false;
    // });
  }


  saveEducationDetails() {
    const eductionPayload = {
      educationDetails: this.qualificationDetailForm.controls.qualification.value,
      freelancerDocuments: this.documentQualArray
    }
    console.log("in education : ", eductionPayload);

    this.__profileService.saveEducationDetails(eductionPayload).then((resData: any) => {
      this.loading = false;
    });
  }

  saveWorkDetails() {
    const orgDetailsPayload = {
      emailId: this.email,
      freelancerOrgDetails: this.workExpDetailsForm.controls.org_details.value,
      portfolio: this.workExpDetailsForm.controls.portfolios.value,
      freelancerDocument: this.documentWorkArray,
      areaOfExpertise: this.workExpDetailsForm.controls.area_of_expertise.value,
      personalAttributeStrength: this.workExpDetailsForm.controls.strength.value,
      personalAttributeWeakness: this.workExpDetailsForm.controls.weakness.value,
    }
    console.log("in org : ", orgDetailsPayload);

    this.__profileService.saveWorkDetails(orgDetailsPayload).then((resData: any) => {
      this.loading = false;
    });
  }

  onSaveSkills() {
    const skillPayload = {
      freelancerSkills: this.skillRateArr.value,
    }
    console.log("in skill : ", skillPayload);

    this.__profileService.saveSkillDetails(skillPayload).then((resData: any) => {
      this.loading = false;
      this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view']);
    });
  }

  ShowPreviousButton(index) {
    this.showMainContent = --index;
  }

  onLogout() {
    this.__authService.logout();
    this.__router.navigate(['/auth/auth/login']);
  }

  clickMethod(i: any) {
    Swal.fire({
      title: 'Save and Proceed',
      text: "You won't be able to revert this",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then(async (result) => {
      if (result.value) {
        await Swal.fire(
          'Saved!',
          'Your data has been saved.',
          'success'
        )
        this.showMainContent = i + 1;

        if (i == 1)
          this.savePersonalDetailForm();
        else if (i == 2)
          this.saveEducationDetails();
        else if (i == 3)
          this.saveWorkDetails();
        else if (i == 4)
          this.onSaveSkills();
        else
          ;
      } else {
        this.showMainContent = i;
      }
    })
  }
  showPrevious(i: any) {
    this.showMainContent = i;
  }

  // @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = 'src/';
  editFile: boolean = true;
  removeUpload: boolean = false;

  uploadFile(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.registrationForm.patchValue({
          file: reader.result
        });
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();     
      // reader.readAsBinaryString(file);   
    }
  }

  // Function to remove uploaded file
  removeUploadedFile() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
    this.editFile = true;
    this.removeUpload = false;
    this.registrationForm.patchValue({
      file: [null]
    });
  }
  
  // Submit Registration Form
  onSubmit() {
    this.submitted = true;
    if(!this.registrationForm.valid) {
      alert('Please fill all the required fields to create a super hero!')
      return false;
    } else {
      console.log(this.registrationForm.value)
    }
  }

}