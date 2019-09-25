import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { WorkPackageService } from '../work-package/shared/service/work-package.service';
import { SmartContractService } from '../services/smart-contract.service';
import { EmpProfileService } from '../profile/shared/service/profile.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-smart-contract-payment',
  templateUrl: './smart-contract-payment.component.html',
  styleUrls: ['./smart-contract-payment.component.scss'],
  animations: [
    trigger('bounce', [transition('* => *', useAnimation(bounce, {
      // Set the duration to 5seconds and delay to 2seconds
      params: { timing: 5, delay: 2 }
    }))])
  ],
})

export class SmartContractPaymentComponent implements OnInit {


  //Milestone Related Variables
  milestoneForm: FormGroup;
  scheduleForm: FormGroup;
  fileForm: FormGroup;

  i: any;
  showModal: boolean = false;
  workPackageID: any;
  approvedEmp: boolean = false;
  approvedRev: boolean = false;
  milestoneArr = [];
  projectName: any;
  empId: any;
  uploadedFile: any;

  public loading = false;
  public smartcontractform: any;

  //payment section realated variables

  //Payment Shedule related Variables
  contractAddr: string;
  fileName: string;
  fileObj: string;
  emailId: string;
  payerAcc = "0xDbc71C18Ab38edc4b7E2cd926e2Bd53cA8e8E52E";
  payeeAcc = "0xD4496dA2a4b376fC8Ce4786EB6B71483436077c4";
  paymentMethod = "Crypto";
  teamMemberArr = [
    { memberId: 1, status: 'pending' },
    { memberId: 2, status: 'completed' },
    { memberId: 3, status: 'rejected' }
  ];
  paymentMethodArr = ['paypal', 'net-backing'];
  currencyArr = ['INR', 'USD', 'IDR', 'AUD', 'EUR', 'ETH'];


  contractStatus: string = "";
  searchFreelancer: number;
  constructor(
    private __fb: FormBuilder,
    private __paymentService: SmartContractService,
    private __workService: WorkPackageService,
    private __profileService: EmpProfileService,
    private toastr: ToastrService,

  ) { }

  ngOnInit() {
    this.emailId = localStorage.getItem("email");

    console.log("inside init");
    this.getWorkPackageId();
    this.createMilestoneForm();
    this.createScheduleForm();
    this.getWorkPackageData();
    this.selectFile();
    this.getMilestoneDetails();
    this.getEmployerData();

  }

  getEmployerData() {
    this.__profileService.getEmployerByEmailId(this.emailId).then((resData: any) => {
      this.empId = resData[0].cmp_reprentative;
    });
  }

  getWorkPackageId() {
    this.workPackageID = localStorage.getItem("workpackageId");
  }

  getWorkPackageData() {
    this.__workService.getWorkPackageData(this.workPackageID).then((resData: any) => {
      console.log("response data : ", resData.responseObject);
      this.projectName = resData.responseObject.projectName;
      this.contractStatus = resData.responseObject.contractStatus;
      // this.empId = resData.responseObject.postedByIndividualEmp.user.userId;
    });
  }

  selectFile() {
    this.fileForm = this.__fb.group({
      contractFile: ['', [Validators.required]],
    });
  }

  createMilestoneForm() {
    this.milestoneForm = this.__fb.group({
      milestoneDetails: this.__fb.array([this.__fb.group({
        milestoneName: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        completionCriteria: ['', [Validators.required]],
        freelancerId: ['', [Validators.required]],
        amountPayable: ['', [Validators.required]],
        contractStatus: ['', Validators.required],
        paymentConditionApprovedByEmployer: ['', Validators.required],
        paymentConditionApprovedByReviewer: ['', Validators.required],
        paymentConditionDueDate: ['', Validators.required],
        currencyCd: ['', Validators.required]
      })
      ])
    });
  }

  createScheduleForm() {
    this.scheduleForm = this.__fb.group({
      scheduleDetails: this.__fb.array([this.__fb.group({
        paymentAmount: ['', [Validators.required]],
        payerAccount: ['', [Validators.required]],
        payeeAccount: ['', [Validators.required]],
        payerName: ['', [Validators.required]],
        payeeName: ['', [Validators.required]],
        paymentMethod: ['', [Validators.required]],
        paymentCurrency: ['', [Validators.required]],
        paymentStatus: ['', [Validators.required]],
        paymentDate: ['', [Validators.required]],
        milestoneId: ['', [Validators.required]]
      })
      ])
    });
  }

  get milestoneDetailsArr() {
    return this.milestoneForm.get('milestoneDetails') as FormArray;
  }

  get scheduleDetailsArr() {
    return this.scheduleForm.get('scheduleDetails') as FormArray;
  }

  addMolestone() {
    this.milestoneDetailsArr.push(this.__fb.group(
      {
        milestoneName: '',
        startDate: '',
        endDate: '',
        completionCriteria: '',
        freelancerId: '',
        amountPayable: '',
        contractStatus: '',
        paymentConditionApprovedByEmployer: false,
        paymentConditionApprovedByReviewer: false,
        paymentConditionDueDate: '',
        currencyCd: '',
        uploadedContractDocument: '',
      }))
  }

  addSchedule() {
    this.scheduleDetailsArr.push(this.__fb.group(
      {
        milestoneId: '',
        paymentAmount: '',
        payerAccount: '0xDbc71C18Ab38edc4b7E2cd926e2Bd53cA8e8E52E',
        payeeAccount: '0xD4496dA2a4b376fC8Ce4786EB6B71483436077c4',
        payerName: '',
        payeeName: '',
        paymentMethod: 'Crypto',
        paymentCurrency: '',
        paymentStatus: '',
        paymentDate: '',

      }))
  }

  removeMilestone(index) {
    this.milestoneDetailsArr.removeAt(index);
  }

  removeSchedule(index) {
    this.scheduleDetailsArr.removeAt(index);
  }

  saveMilestones() {

  }

  onDeployContract() {
    this.loading = true;

    const payload = {
      projectId: this.workPackageID
    }

    this.__paymentService.deployContractData(payload).then((workData: any) => {
      console.log("Data is successfully saved", workData);

      this.contractAddr = workData.ContractAddress;




      this.__paymentService.postMilestoneData(this.milestoneForm.controls.milestoneDetails.value, this.workPackageID).then((workData: any) => {
        console.log("Data is successfully saved", workData);
        this.toastr.success('Milestones saved Successfully!!');
        this.milestoneArr = workData.responseObject;
        const addrData = {
          smartContractAddr: this.contractAddr
        }

        this.__workService.updateContractAddress(this.workPackageID, addrData).then((resData: any) => {
          this.loading = false;
        });
      });


    });
  }

  async onDeployMilestone(i: any) {

    this.loading = true;

    console.log("addr " + this.contractAddr);

    const payload = {
      milestoneStr: (this.milestoneForm.controls.milestoneDetails.value)[i].milestoneName,
      reviewAddrs: "0xd15eE84e3308249E178D8Fb8f20BD7A03b358ee5",
      startDate: (this.milestoneForm.controls.milestoneDetails.value)[i].startDate,
      endDate: (this.milestoneForm.controls.milestoneDetails.value)[i].endDate,
      dueDate: (this.milestoneForm.controls.milestoneDetails.value)[i].paymentConditionDueDate,
      amount: (this.milestoneForm.controls.milestoneDetails.value)[i].amountPayable,
      contractAddr: this.contractAddr,
    }

    await this.__paymentService.deployMilestoneData(payload).then((workData: any) => {
      console.log("Data is successfully saved", workData);
      this.loading = false;
    });



    const payloads = {
      milestoneStr: (this.milestoneForm.controls.milestoneDetails.value)[i].milestoneName,
      reviewAddrs: "0xd15eE84e3308249E178D8Fb8f20BD7A03b358ee5",
      startDate: ((this.milestoneForm.controls.milestoneDetails.value)[i].startDate),
      endDate: ((this.milestoneForm.controls.milestoneDetails.value)[i].endDate),
      dueDate: ((this.milestoneForm.controls.milestoneDetails.value)[i].paymentConditionDueDate),
      amount: (this.milestoneForm.controls.milestoneDetails.value)[i].amountPayable,
      currency: (this.milestoneForm.controls.milestoneDetails.value)[i].currencyCd,
      contractAddress: this.contractAddr,
      freeAddr: '0xD4496dA2a4b376fC8Ce4786EB6B71483436077c4',
      empAddr: '0xDbc71C18Ab38edc4b7E2cd926e2Bd53cA8e8E52E'
    }
    this.__paymentService.deployMilestoneData1(payloads).then((workData: any) => {
      console.log("Data is successfully saved", workData);
    });
  }

  onSaveChanges() {
    this.loading = true;

    this.onDeployContract();

  }


  handleFileInput(event) {
    if (event.target.files.length > 0) {

      const file = event.target.files[0];
      this.fileName = file.name;
      console.log("File name:", file.name);

      this.fileObj = file;
    }
  }


  async upoladContractDoument() {
    this.loading = true;

    await this.__profileService.postDocHashData(this.fileObj, this.emailId, this.fileName).then((resData) => {
      this.uploadedFile = resData['fileId'];


      const filepayload = {
        uploadedContractDocument: this.uploadedFile
      }
      this.__workService.updateContractDocument(this.workPackageID, filepayload).then((resData: any) => {
        this.toastr.success('File Uploaded Successfully!!');
        this.loading = false;
      });

    });
  }

  getMilestoneDetails() {

    this.__paymentService.getMilestoneData(this.workPackageID).then((workData: any) => {
      console.log("Data is successfully saved", workData);

      this.milestoneArr = workData.responseObject;
    });

  }

  onClick(event) {
    this.showModal = true;
  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  onSaveSchedule() {

    for (let i = 0; i < (this.milestoneForm.controls.milestoneDetails.value).length; i++) {
      this.onDeployMilestone(i);
    }

    for (let i = 0; i < (this.scheduleForm.controls.scheduleDetails.value).length; i++) {
      this.scheduleDetailMethod(i);
    }

  }

  scheduleDetailMethod(i: any) {
    const scheduleDetailsArr = {
      paymentAmount: (this.scheduleForm.controls.scheduleDetails.value)[i].paymentAmount,
      payerAccount: this.payerAcc,
      payeeAccount: this.payeeAcc,
      payerName: (this.scheduleForm.controls.scheduleDetails.value)[i].payerName,
      payeeName: (this.scheduleForm.controls.scheduleDetails.value)[i].payeeName,
      paymentMethod: this.paymentMethod,
      paymentCurrency: (this.scheduleForm.controls.scheduleDetails.value)[i].paymentCurrency,
      paymentStatus: (this.scheduleForm.controls.scheduleDetails.value)[i].paymentStatus,
      paymentDate: (this.scheduleForm.controls.scheduleDetails.value)[i].paymentDate,
      milestoneId: (this.scheduleForm.controls.scheduleDetails.value)[i].milestoneId
    }

    console.log("Array scheduleDetailsArr", scheduleDetailsArr);

    // this.__paymentService.postScheduleData(this.scheduleForm.controls.scheduleDetails.value).then((workData: any) =>{
    // console.log("Data is successfully saved" ,workData);
    // this.milestoneArr=workData.responseObject;
    this.toastr.success('Payment Details saved Successfully!!');

    // });
  }
}

