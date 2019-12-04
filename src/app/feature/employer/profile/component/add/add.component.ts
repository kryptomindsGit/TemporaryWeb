import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { EmpProfileService } from '../../shared/service/profile.service';
import { IndeptProfileService } from '../../../../independent-prof/profile/shared/service/profile.service';
import { AuthService } from 'src/app/auth/shared/service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomGlobalService } from 'src/app/feature/shared/service/custom-global.service';

//Custome global validation
import { GlobalValidationDirective } from '../../../../../shared/global-validation.directive';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  submitted = false;

  // FormGroup object's
  public employerProfileForm: FormGroup;

  //Variable's
  public addprofileemployer: any;
  public loading = false;

  public uid: any;
  public email_id: any;
  public country: any;
  public congnitoId: string;
  public fileName: string;
  public fileObj: any;
  public doc_cat_id: any;
  public FileArrData: any;
  public error: any;
  public docTypeArr: any = [];
  //Static Array's
  prefixArr = ['Mr', 'Mrs', 'Miss'];

  //Array's
  public documentFileArr: any = [];
  public stateArr: any = [];
  public countryArr: any = [];
  public cityArr: any = [];
  public fileType: any;

  public stateArrByCountryId=[];
  public cityArrByStateId = [];

  
  registrationForm = this.__fb.group({
    file: [null]
  });

  constructor(
    private __fb: FormBuilder,
    private __profileService: EmpProfileService,
    private __freelancerProfileService: IndeptProfileService,
    private __authService: AuthService,
    private __router: Router,
    private toastr: ToastrService,
    private __customGlobalService: CustomGlobalService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

    let isUportUser = localStorage.getItem("uportUser");

    if (isUportUser == "false") {
      const user = this.__authService.decode();
      console.log(" decode \n" , user);
      this.congnitoId = user["cognito:username"];
      this.email_id = user["email"];
      this.uid = localStorage.getItem("uid");
    } else {
      this.congnitoId = "TEST"
      this.uid = localStorage.getItem("uid");
      this.email_id = localStorage.getItem("email");
      this.country = localStorage.getItem("country");
    }


    //Calling Function's
    this.valEmpProfile();
    this.getCountryList();
    this.getStateList();
    this.getCityList();
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
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(6)]],
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
  get formValidation() { return this.employerProfileForm.controls; }
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
    if (this.documentArr.length > 0) {
      this.documentArr.removeAt(index);
    } else {

    }
  }
  getCountryList() {
    this.__customGlobalService.getCountryList().then((resData: any) => {
      this.countryArr = resData.responseObject;
      console.log("Countries: ", this.countryArr);
      
    })
  }
  getStateList() {
    this.__customGlobalService.getStateList().then((resData: any) => {
      this.stateArr = resData.responseObject;
      console.log("State: ", this.stateArr);
      
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
  setDocTypeCatType(inputValue) {
    console.log(inputValue);
    this.fileType = inputValue
  }
  setDocTypeCatID(id) {
    console.log(this.doc_cat_id = id);
  }
  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name.replace(" ", "");
      this.fileObj = file;
    }
  }
  async uploadFile() {
    this.loading = true;
    await this.__profileService.postDocHashData(this.fileObj, this.email_id, this.fileName).then((resData) => {
      this.loading = false;
      this.FileArrData = resData,
        (error) => this.error = error
      if (this.FileArrData) {
        this.toastr.success(this.fileName, "Successfully uploaded");
        this.documentFileArr.push( {
          'documentUrl': this.FileArrData.fileId,
          'docTypeId': this.doc_cat_id
        });
      } else {
        this.toastr.error(this.fileName, "File not uploaded");
      }
    });
  }

  onSubmit() {
    this.loading = true;
    const employerProfileVal = {
      emailId: this.email_id,
      companyName: this.employerProfileForm.controls.comapany_name.value,
      website: this.employerProfileForm.controls.website_addr.value,
      addressOne: this.employerProfileForm.controls.address_line_one.value,
      addressTwo: this.employerProfileForm.controls.address_line_two.value,
      country: this.employerProfileForm.controls.country.value,
      stateProvince: this.employerProfileForm.controls.state.value,
      city: this.employerProfileForm.controls.city.value,
      zipCode: this.employerProfileForm.controls.zipcode.value,
      companyProfile: this.employerProfileForm.controls.company_profile.value,
      businessCategory: this.employerProfileForm.controls.business_cat.value,
      companyRepresentativeName: this.employerProfileForm.controls.company_rep_det.value,
      employerDocuments: this.documentFileArr,
      logo:this.registrationForm.value.file
    }
    console.log(" Submit values:", employerProfileVal);

    this.__profileService.createEmployer(employerProfileVal).then((resData: any) => {
      console.log(resData);
      this.loading = false;
      if (resData.status == 'success') {
        this.toastr.success("Profile added Successfully");
        this.__router.navigate(['/feature/feature/full-layout/employer/emp/profile/profile/view']);
      }
      else if (resData.status == 'error') {
        this.toastr.error("Profile not saved");
      }
      console.log(" Submit values:", employerProfileVal);
    });
  }

  getDocumentsTypeCat(index) {
    this.__freelancerProfileService.getFreelancerDocumentByCat(index).then((resData: any) => {
      this.docTypeArr = resData.responseObject;
    });
  }

  onLogout() {
    this.__authService.logout();
    this.__router.navigate(['/auth/auth/login']);
  }

  onCancel() {
    this.employerProfileForm.reset();
  }

    // @ViewChild('fileInput') el: ElementRef;
    imageUrl: any = 'src/';
    editFile: boolean = true;
    removeUpload: boolean = false;
  
    uploadPhotoFile(event) {
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
    onPhotoSubmit() {
      if(!this.registrationForm.valid) {
        alert('Please fill all the required fields to create a super hero!')
        return false;
      } else {
        console.log(this.registrationForm.value)
      }
    }
  
}
