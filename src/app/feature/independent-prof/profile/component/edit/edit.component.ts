import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IndeptProfileService } from '../../shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  // FormGroup object
  public personalDetails: FormGroup;
  public qualificationDetails: FormGroup;
  public workExpDetails: FormGroup;
  public skillDetails: FormGroup;

  // Static Array variables
  public prefixArr = ['Mr', 'Mrs', 'Miss'];
  public yearArr = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
  public gradeArr = ['A', 'B', 'C', 'D', 'E', 'F'];

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

  public fileType: any;
  public fileName: any;
  public fileObj: any;


  // Array's
  public congnitoID: any = [];
  public eduCatArr: any = [];
  public eduArr: any = [];
  public skills: any = [];
  public categ: any = [];

  public countryArr: any = [];
  public stateArr: any = [];
  public cityArr: any = [];
  public stateByIdArr: any = [];
  public cityByIdArr: any = [];
  public freelancerArr: any = [];

  public qualityArray: any = [];
  public freelancerEduArr: any = [];
  public freelancerOrgArr: any = [];
  public freelancerPortArr: any = [];

  public FileArrData: any = [];
  public freelancerDocsArr: any = [];
  public docTypeArr: any = [];
  public documentPersonalArray: any = [];
  public documentQualArray: any = [];
  public documentWorkArray: any = [];

  public freelancerSkillDetailsArr: any = [];
  public skillArr: any = [];
  public skillList: any = [];


  //skill variables.
  keyword = 'skill_cat_name';

  constructor(
    private __fb: FormBuilder,
    private __profileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.__id = this.__activatedRoute.snapshot.params.id;
  }

  ngOnInit() {

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
    this.valPersonalProfile();
    this.valQualificationProfile();
    this.valWorlExpProfile();
    this.valSkillsProfile();

    /**
      * @description Get API call function
      */
    this.getAllCountry();
    this.getFreelancerDetails();
    this.getAllEducationCat();
    this.getAllSkillCategory();
    this.getDocumentsTypeCat(1);

    this.getFreelancerSkillDetails();
    this.getQualitiesById();
    this.getFreelancerDocuments();
    this.getFreelancerOrganization();
    this.getFreelancerPortfolio();
    // this.setAllFreelancerData();
  }

  /**
   * @name valPersonalProfile
   * @description validating the Personal details form fields
   */
  valPersonalProfile() {
    this.personalDetails = this.__fb.group({
      prefix: ['', Validators.required],
      first_name: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      middle_name: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      last_name: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z \-\']+')
      ])],
      address_one: ['', Validators.required],
      address_two: ['', Validators.required],
      country: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ])],
      documents_personal: this.__fb.array([]),
    });
  }

  /**
   * @name valQualificationProfile
   * @description validating the Qualification details form fields
   */
  valQualificationProfile() {
    this.qualificationDetails = this.__fb.group({
      qualification: this.__fb.array([]),
    });
  }

  /**
   * @name valWorlExpProfile
   * @description validating the Work Exp details form fields
   */
  valWorlExpProfile() {
    this.workExpDetails = this.__fb.group({
      org_details: this.__fb.array([]),
      strength: this.__fb.array([]),
      weakness: this.__fb.array([]),
      portfolios: this.__fb.array([]),
      references: ['', Validators.required],
      area_of_expertise: ['', Validators.required],
      psychomatric: ['', Validators.required],
      isFreelancer: ['', Validators.required],
      documents_work: this.__fb.array([])
    });
  }

  /**
   * @name valSkillsProfile
   * @description validating the Skill details form fields
   */
  valSkillsProfile() {
    this.skillDetails = this.__fb.group({
      skills: this.__fb.array([]),
    });
  }


  async getFreelancerDetails() {
    await this.__profileService.getFreelancerByEmail(this.__id).then((data: any) => {
      this.freelancerArr = data[0];
      console.log("Res getFreelancerDetails:", this.freelancerArr);

    });

    this.checkMarked = this.freelancerArr.is_interviewer;
    await this.populateStateList();
    await this.populateCityList();

    this.personalDetails.patchValue({
      prefix: this.freelancerArr.prefix,
      first_name: this.freelancerArr.first_name,
      middle_name: this.freelancerArr.middle_name,
      last_name: this.freelancerArr.last_name,
      address_one: this.freelancerArr.line_1,
      address_two: this.freelancerArr.line_2,
      country: this.freelancerArr.country,
      province: this.freelancerArr.state,
      city: this.freelancerArr.city,
      postal_code: this.freelancerArr.code,
    });

    this.workExpDetails.patchValue({
      references: this.freelancerArr.reference,
      area_of_expertise: this.freelancerArr.area_of_experties,
      psychomatric: this.freelancerArr.psyco_result,
      isFreelancer: this.freelancerArr.is_interviewer
    });

    // this.personalDetails.setControl('documents_personal', this.__fb.array(
    //   this.documentArr.file_name || [],
    //   this.documentArr.file_type || [],
    // ));

  }
  async populateStateList() {
    for (let i = 0; i < this.countryArr.length; i++) {
      if (this.countryArr[i].name == this.freelancerArr.country) {
        let countryID = this.countryArr[i].id;
        await this.getStateListByCountryID(countryID);
      }
    }
  }
  async populateCityList() {
    for (let i = 0; i < this.stateArr.length; i++) {
      if (this.stateArr[i].name == this.freelancerArr.state) {
        let stateID = this.stateArr[i].id;
        this.getCityListByStateID(stateID);
      }
    }
  }

  getFreelancerSkillDetails() {
    this.__profileService.getFreelancerSkillById(this.__id).then((data: any) => {
      this.freelancerSkillDetailsArr = data;
      console.log("Res getFreelancerSkillDetails:", this.freelancerSkillDetailsArr);

      // if (this.freelancerSkillDetailsArr) {

      let skillCat_ID = this.freelancerSkillDetailsArr[0].skill_cat_id;

      this.freelancerSkillDetailsArr.forEach(item => {
        this.skillList.push({
          skillname: item.skill_cat_name,
          rate: item.rate_per_hr
        });

        this.skillArr.push({
          skill_id: item.skill_id,
        });
      });



      this.getSkillsByID(skillCat_ID);


      for (let index = 0; index < this.freelancerSkillDetailsArr.length; index++) {

        this.skillRateArr.push(this.__fb.group(
          {
            skill: this.freelancerSkillDetailsArr[index].skill_name,
            rate_hour: this.freelancerSkillDetailsArr[index].rate_per_hr,
            skill_id: this.freelancerSkillDetailsArr[index].skill_id
          }
        ));
      }
      // }

    });
  }

  getQualitiesById() {
    this.__profileService.getFreelancerQuality(this.__id).then((data: any) => {
      this.qualityArray = data;

      console.log("Res this.qualityArray:", this.qualityArray);


      let strengthQual = this.qualityArray.filter(
        function (item) {
          return item.strengths != null;
        }
      );

      let weaknessQual = this.qualityArray.filter(
        function (item) {
          return item.weaknesses != null;
        }
      );

      strengthQual.forEach(item => {
        this.strengthArr.push(
          this.__fb.group({
            strength: item.strengths,
            quality_id: item.quality_id
          })
        )
      });

      weaknessQual.forEach(item => {
        this.weaknessArr.push(
          this.__fb.group({
            weakness: item.weaknesses,
            quality_id: item.quality_id
          })
        )
      });

    });
  }


  getFreelancerDocuments() {
    this.__profileService.getFreelancerDocumentById(this.__id).then((data: any) => {
      this.freelancerDocsArr = data;
      console.log("Res this.freelancerDocsArr:", this.freelancerDocsArr);
      // personal document
      let isPersonal = this.freelancerDocsArr.filter(item => item.doc_cat_name == 'personal');
      if (isPersonal) {

        console.log("isPersonal", isPersonal);

        isPersonal.forEach(item => {
          this.documentArr.push(
            this.__fb.group({
              file_name: item.doc_name,
              file_type: item.doc_type,
              file_id: item.doc_type_id,
              doc_id: item.doc_id
            })
          )
        });
        console.log("TEST: ", this.documentArr);
        isPersonal.forEach(item => {
          this.documentPersonalArray.push({
            file_name: item.doc_name,
            file_type: item.doc_type,
            file_type_id: item.doc_type_id,
            doc_id: item.doc_id
          });
        });
      }
      console.log("documentassskhjj", this.documentArr.controls[0]);

      // educational document
      let isEducation = this.freelancerDocsArr.filter(item => item.doc_cat_name == 'educational');
      isEducation.forEach(item => {
        this.documentQualArray.push({
          file_name: item.doc_name,
          file_type: item.doc_type,
          file_type_id: item.doc_type_id,
          doc_id: item.doc_id
        });
      });
      this.getFreelancerEducation(isEducation);
      // work exp document
      let isProfessional = this.freelancerDocsArr.filter(item => item.doc_cat_name == 'professional');
      console.log(isProfessional);
      if (isProfessional) {
        isProfessional.forEach(item => {
          this.workdocumentArr.push(
            this.__fb.group({
              file_name: item.doc_name,
              file_type: item.doc_type,
              file_id: item.doc_type_id,
              doc_id: item.doc_id
            })
          )
        });
        isProfessional.forEach(item => {
          this.documentWorkArray.push({
            file_name: item.doc_name,
            file_type: item.doc_type,
            file_type_id: item.doc_type_id,
            doc_id: item.doc_id
          });
        });
      }
    });

  }

  getFreelancerEducation(document) {

    let docName = document;
    this.__profileService.getFreelancerEduById(this.__id).then((data: any) => {
      this.freelancerEduArr = data;

      console.log("Res this.freelancerEduArr:", this.freelancerEduArr);

      for (let index = 0; index < this.freelancerEduArr.length; index++) {
        this.edu_catId = this.freelancerEduArr[index].edu_cat_id;

        this.qualfArr.push(this.__fb.group(
          {
            edu_cat_name: this.freelancerEduArr[index].edu_cat_name,
            edu_type_name: this.freelancerEduArr[index].edu_name,
            edu_cat_id: this.freelancerEduArr[index].edu_cat_id,
            edu_type_id: this.freelancerEduArr[index].edu_type_id,
            university: this.freelancerEduArr[index].university,
            passing_year: this.freelancerEduArr[index].passing_year,
            percentage: this.freelancerEduArr[index].percentage,
            grade: this.freelancerEduArr[index].grade,
            doc_name: docName,
            edu_id: this.freelancerEduArr[index].edu_id
          }
        ));

      }

      this.getAllEducation(this.edu_catId);
    });
  }

  getAllEducation(eduCat_id) {
    this.__profileService.getFreelancerEducname(eduCat_id).then((data: any) => {
      this.eduArr = data;
    })
  }

  getFreelancerOrganization() {
    this.__profileService.getFreelancerOrgById(this.__id).then((data: any) => {
      this.freelancerOrgArr = data;

      console.log("Res this.freelancerOrgArr:", this.freelancerOrgArr);
      for (let index = 0; index < this.freelancerOrgArr.length; index++) {
        this.orgArr.push(this.__fb.group(
          {
            org_name: this.freelancerOrgArr[index].org_name,
            org_designation: this.freelancerOrgArr[index].org_designation,
            start_date: this.freelancerOrgArr[index].start_date,
            end_date: this.freelancerOrgArr[index].end_date,
            responsibilities: this.freelancerOrgArr[index].responsibilities,
            org_id: this.freelancerOrgArr[index].org_id
          }
        ));
      }

    });
  }

  getFreelancerPortfolio() {
    this.__profileService.getFreelancerPortfolioById(this.__id).then((data: any) => {
      this.freelancerPortArr = data;

      console.log("Res this.freelancerPortArr:", this.freelancerPortArr);
      let portflio = this.workExpDetails.get('portfolios') as FormArray;
      for (let index = 0; index < this.freelancerPortArr.length; index++) {
        portflio.push(this.__fb.group({
          portfolio: this.freelancerPortArr[index].port_addr,
          port_id: this.freelancerPortArr[index].port_id
        }));
      }

    });
  }

  setAllFreelancerData() {
    this.personalDetails.get('prefix').setValue(this.freelancerArr.prefix);
    this.personalDetails.get('first_name').setValue(this.freelancerArr.first_name);
    this.personalDetails.get('middle_name').setValue(this.freelancerArr.middle_name);
    this.personalDetails.get('last_name').setValue(this.freelancerArr.last_name);
  }




  /**
   * @name getAllEducationCat
   * @description get API for all education category of independent prof 
   */
  getAllEducationCat() {
    this.__profileService.getFreelancerEduCat().then((resData: any) => {
      this.eduCatArr = resData;
    })
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
   * @name getAllSkillCategory
   * @description get API for all skill category of independent prof 
   */
  getAllSkillCategory() {
    this.__profileService.getFreelancerCategory().then((resData: any) => {
      this.categ = resData;
    })
  }

  /**
   * @method getAllCountry
   * @description get all country values.
   */
  getAllCountry() {
    this.__profileService.getFreelancerCountry().then((resData: any) => {
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

    if (isChecked && skill != null) {

      this.skillRateArr.push(this.__fb.group(
        {
          skill_name: skill,
          skill: skill_id,
          rate_hour: ''
        }
      ));
    }
    else {
      let index = this.skillRateArr.controls.findIndex(x => x.value == skill);
      this.skillRateArr.removeAt(index);
    }

  }

  onSaveSkill() {
    console.log(this.skillRateArr.value)
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
      this.fileName = file.name;
      this.fileObj = file;
    }
  }


  async uploadPersonalFile() {

    await this.__profileService.postDocHashData(this.fileObj, this.congnitoID, this.fileName).then((event) => {
      this.FileArrData = event;
    });

    await this.documentPersonalArray.push(
      {
        'file_name': this.FileArrData.fileId,
        'file_type': this.doc_cat_id
      });
    console.log(this.documentPersonalArray);
  }

  uploadEducationFile() {

    this.__profileService.postDocHashData(this.fileObj, this.congnitoID, this.fileName).then((event) => {
      this.FileArrData = event;
      console.log("File Resp:", this.FileArrData.fileId);
    });

    this.documentQualArray.push(
      {
        'file_name': this.FileArrData.fileId,
        'file_type': 4
      });
    console.log(this.documentQualArray);
  }

  uploadWorkExpFile() {

    this.__profileService.postDocHashData(this.fileObj, this.congnitoID, this.fileName).then((event) => {
      this.FileArrData = event;
      console.log("File Resp:", this.FileArrData.fileId);
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

    let documentArr: any = [
      'file_name',
      'file_type'
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
        skills: this.skillRateArr.value,
        uid: 0
      }
      console.log('Freelancer Payload Value : ', freelancerProfilePayload);
      this.__profileService.createFreelancer(freelancerProfilePayload).then((resData: any) => {
        console.log("Resp Data:", resData);
        if (resData.status == 'success') {
          this.toastr.error(resData.message);
          setTimeout(function () {
            this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view', this.email]);
          }, 2000);

        }
        else if (resData.status == 'error') {
          this.toastr.error(resData.message);
        }
      });
    }
    else {

      const freelancerProfilePayload = {
        cognito_id: this.email,
        email: this.email,
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
        skills: this.skillRateArr.value,
        uid: 0
      }
      console.log('Freelancer Payload Value : ', freelancerProfilePayload);
      this.__profileService.updateFreelancer(this.email, freelancerProfilePayload).then((resData: any) => {
        console.log("Resp Data:", resData);
        if (resData.status == 'success') {
          this.toastr.error(resData.message);
          setTimeout(function () {
            this.__router.navigate(['/feature/feature/full-layout/independent/indp/profile/profile/view', this.email]);
          }, 2000);

        }
        else if (resData.status == 'error') {
          this.toastr.error(resData.message);
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
