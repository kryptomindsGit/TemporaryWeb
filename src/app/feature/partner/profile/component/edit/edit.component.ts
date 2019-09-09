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

  //Array's
  public congnitoId: any = [];
  public documentFileArr: any = [];
  public partnerArr: any = [];
  public partnerFileArr: any = [];

  //static Array's


  constructor(
    private __fb: FormBuilder,
    private __profileService: PartProfileService,
    private __authService: AuthService,
    private __router: Router,
    private __activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    let isUportUser = localStorage.getItem("uportUser");

    this.id = this.__activatedRoute.snapshot.params.id;
    if (isUportUser == "false") {
      const user = this.__authService.decode();
      this.congnitoId = user["cognito:username"];
      this.email = user["email"];
    } else {
      this.email = localStorage.getItem("email");
      this.country = localStorage.getItem("country");
    }

    //Call function

    this.getPartnerDetails();
    // this.getPartnerFile();
  }

  /**
   * @name valEmpProfile
   * @description validating the form fields
   */
  valPartProfile() {
    this.partnerProfileForm = this.__fb.group({
      jo: 'test',
      comapany_name: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      website_addr: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      address_line_one: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      address_line_two: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      country: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      state: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      city: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      zipcode: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, [Validators.required, Validators.pattern('^[0-9]*$')]],
      business_cat: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      company_profile: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      company_rep_det: [(this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
        this.partnerArr.cmp_website, Validators.required],
      documents: this.__fb.array([this.__fb.group({
        chooseFile: (this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
          this.partnerArr.cmp_website,
        docType: (this.partnerArr == null || this.partnerArr.cmp_website == null) ? "test" :
          this.partnerArr.cmp_website
      })])

    })
    console.log(" Val test:", this.partnerProfileForm.value);

  }

  /**
   * @name getPartnerDetails
   * @description call get API for partner details 
   */
  getPartnerDetails() {
    this.__profileService.getPartnerByEmailId(this.emailId).then((resData: any) => {
      this.partnerArr = resData[0];
      this.valPartProfile();
      console.log(this.partnerArr);
    });

    this.__profileService.getPartnerFileById(this.id).then((resData: any) => {
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
      uid: 35,
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
