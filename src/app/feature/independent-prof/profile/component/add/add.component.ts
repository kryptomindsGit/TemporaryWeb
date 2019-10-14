import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { IndeptProfileService } from '../../shared/service/profile.service';
import { ToastrService } from 'ngx-toastr';
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
  keyword = 'skill_cat_name';
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

  constructor(
    /* Constructor variable's */
    private __fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
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
    this.getEducationCat();
    this.getEducationList();
    this.getSkillCategory();
    this.getCountry();
    this.getDocumentsTypeCat(1);
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
          file_name: [''],
          file_type: ['']
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
        edu_cat_id: ['', Validators.required],
        edu_type_id: ['', Validators.required],
        university: ['', [Validators.required, Validators.maxLength(25)]],
        passing_year: ['', Validators.required],
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
        org_name: ['', [Validators.required, Validators.maxLength(25)]],
        org_designation: ['', [Validators.required, Validators.maxLength(25)]],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        responsibilities: ['', [Validators.required, Validators.maxLength(25)]]
      })]),
      strength: this.__fb.array([this.__fb.group({ strength: '' })]),
      weakness: this.__fb.array([this.__fb.group({ weakness: '' })]),
      portfolios: this.__fb.array([this.__fb.group({ portfolio: '' })]),
      references: ['', [Validators.required, Validators.maxLength(25)]],
      area_of_expertise: ['', [Validators.required, Validators.maxLength(25)]],
      psychomatric: ['', [Validators.required, Validators.maxLength(25)]],
      isFreelancer: ['', Validators.required],
      documents_work: this.__fb.array([this.__fb.group({ file_type: ['', Validators.required], file_name: ['', Validators.required] })]),
    });
  }

  /**
   * @name valSkillsProfile
   * @description validating the Skill details form fields
   */
  validateSkillsProfile() {
    this.skillDetails = this.__fb.group({
      skills: this.__fb.array([]),
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
  getEducationCat() {
    this.__profileService.getFreelancerEduCat().then((resData: any) => {
      this.eduCatArr = resData;
    })
  }

  /**
   * @name getEducationList
   * @description get API for all education data in List
   */
  getEducationList() {
    this.__profileService.getFreelancerEduList().then((resData: any) => {
      this.eduList = resData;
      console.log('eduList: ', this.eduList);
    })
  }

  // /**
  //  * @method setEduCatByID
  //  * @param eduCat_id
  //  * @description get the education category id and pass it to getAllEducation method.
  //  */
  // setEduCatByID(eduCat_id) {
  //   this.getAllEducation(eduCat_id);
  // }

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
    this.eduListbyId[eduCat_id] = this.eduList.filter((item) => item.edu_cat_id == eduCat_id);
    this.qualificationDetails.get('qualification')['controls'][i].patchValue({ edu_cat_id: eduCat_id, edu_type_id: '' });

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
   * @name getSkillCategory
   * @description get API for all skill category of independent prof 
   */
  getSkillCategory() {
    this.__profileService.getFreelancerCategory().then((resData: any) => {
      this.categ = resData;
    })
  }

  /**
   * @method getCountry
   * @description get all country values.
   */
  getCountry() {
    this.__profileService.getFreelancerCountry().then((resData: any) => {
      this.countryArr = resData;
    });
  }

  /**
   * @method setCountryID
   * @param country_id
   * @description get the selected country id and pass to getStateByID method.
   */
  setCountryID(country_id) {
    console.log("country_id", country_id);

    this.getStateByID(country_id)
  }

  /**
   * @method getStateByID
   * @param country_id
   * @description get the all state values based on selected country id.
   */
  getStateByID(country_id) {

    this.__profileService.getFreelancerStateByID(country_id).then((resData: any) => {
      this.stateArr = resData;
      console.log("this.stateArr", this.stateArr);

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
    this.__profileService.getFreelancerCityByID(state_id).then((resData: any) => {
      this.cityArr = resData;
      console.log(this.cityArr)
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
    const skills = item;
    const skill_id = skills.skill_cat_id;
    this.getSkillsByID(skill_id)
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
        edu_cat_id: '',
        edu_type_id: '',
        university: '',
        passing_year: '',
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
        org_name: '',
        org_designation: '',
        start_date: '',
        end_date: '',
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
        file_name: '',
        file_type: ''
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
        file_name: '',
        file_type: ''
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
          skill_name: skill,
          skill: skill_id,
          rate_hour: '',
          skill_exp: ''
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

    await this.documentPersonalArray.push(
      {
        'file_name': this.FileArrData.fileId,
        'file_type': this.doc_cat_id
      });
    console.log(this.documentPersonalArray);
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
        'file_name': this.FileArrData.fileId,
        'file_type': 4
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
        'file_name': this.FileArrData.fileId,
        'file_type': this.doc_cat_id
      });
    console.log(this.documentWorkArray);
  }


  /**
   * @name onSubmitDetails
   * @description submit the form filed value to serer through REST API
   */

  onSubmitDetails() {

    this.loading = true;

    let documentArr: any = [
      'file_name',
      'file_type'
    ];

    let qualitiesArr: any = [
      'strength',
      'weakness'
    ];



    documentArr = [...this.documentPersonalArray, ...this.documentWorkArray, ...this.documentQualArray];
    console.log(documentArr);

    qualitiesArr = [
      {
        strengths: this.workExpDetails.controls.strength.value
      },
      {
        weaknesses: this.workExpDetails.controls.weakness.value
      },
    ];
    console.log(qualitiesArr);
    const freelancerProfilePayload = {};
    if (this.isUportUser == "false") {
      const freelancerProfilePayload = {
        cognito_id: this.congnitoID,
        email: this.email,
        uid: this.uid,
        prefix: this.personalDetails.controls.prefix.value,
        first_name: this.personalDetails.controls.first_name.value,
        middle_name: this.personalDetails.controls.middle_name.value,
        last_name: this.personalDetails.controls.last_name.value,
        address_one: this.personalDetails.controls.address_one.value,
        address_two: this.personalDetails.controls.address_two.value,
        country: this.personalDetails.controls.country.value,
        province: this.personalDetails.controls.province.value,
        city: this.personalDetails.controls.city.value,
        postal_code: this.personalDetails.controls.postal_code.value,
        documents: documentArr,
        edu_details: this.qualificationDetails.controls.qualification.value,
        org_details: this.workExpDetails.controls.org_details.value,
        qualities: qualitiesArr,
        portfolio: this.workExpDetails.controls.portfolios.value,
        references: this.workExpDetails.controls.references.value,
        area_of_experties: this.workExpDetails.controls.area_of_expertise.value,
        psychomatric: this.workExpDetails.controls.psychomatric.value,
        is_interviewer: this.workExpDetails.controls.isFreelancer.value,
        skills: this.skillRateArr.value
      }
      console.log('Freelancer Payload Value : ', freelancerProfilePayload);
      this.__profileService.createFreelancer(freelancerProfilePayload).then((resData: any) => {
        console.log("Res Data:", resData);

        this.loading = false;

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
        cognito_id: this.congnitoID,
        email: this.email,
        uid: this.uid,
        prefix: this.personalDetails.controls.prefix.value,
        first_name: this.personalDetails.controls.first_name.value,
        middle_name: this.personalDetails.controls.middle_name.value,
        last_name: this.personalDetails.controls.last_name.value,
        address_one: this.personalDetails.controls.address_one.value,
        address_two: this.personalDetails.controls.address_two.value,
        country: this.personalDetails.controls.country.value,
        province: this.personalDetails.controls.province.value,
        city: this.personalDetails.controls.city.value,
        postal_code: this.personalDetails.controls.postal_code.value,
        documents: documentArr,
        edu_details: this.qualificationDetails.controls.qualification.value,
        org_details: this.workExpDetails.controls.org_details.value,
        qualities: qualitiesArr,
        portfolio: this.workExpDetails.controls.portfolios.value,
        references: this.workExpDetails.controls.references.value,
        area_of_experties: this.workExpDetails.controls.area_of_expertise.value,
        psychomatric: this.workExpDetails.controls.psychomatric.value,
        is_interviewer: this.workExpDetails.controls.isFreelancer.value,
        skills: this.skillRateArr.value
      }
      console.log('Freelancer Payload Value : ', freelancerProfilePayload);
      this.__profileService.createFreelancer(freelancerProfilePayload).then((resData: any) => {
        console.log(resData);
        this.loading = false;

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
    console.log("Value :", this.showMainContent);

    if (this.showMainContent == 1) {
      this.showMainContent = index;

      this.submitted = true;
      if (this.personalDetails.invalid) {
        console.log("dhfkjhdkshk");
        this.showMainContent = 1;

        return;
      } else {
        console.log("Next btn in 1 page");
        this.showMainContent = 2;
      }


    } else if (this.showMainContent == 2) {
      this.showMainContent = index;

      this.submitted = true;
      if (this.qualificationDetails.invalid) {
        this.showMainContent = 2;
        return;
      } else {
        console.log("Next btn in 2 page");
        this.showMainContent = 3;
      }

    } else if (this.showMainContent == 3) {
      this.showMainContent = index;

      this.submitted = true;

      if (this.workExpDetails.invalid) {
        this.showMainContent = 3;
        return;
      } else {
        console.log("Next btn in 3 page");
        this.showMainContent = 4;
      }
    } else if (this.showMainContent == 4) {
      this.showMainContent = index;

      this.submitted = true;
      if (this.skillDetails.invalid) {
        this.showMainContent = 4
        return;
      } else {
        console.log("Next btn in 4 page");
        this.showMainContent = 4;
      }

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
