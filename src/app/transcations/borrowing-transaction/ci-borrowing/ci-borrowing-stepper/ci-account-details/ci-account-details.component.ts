import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { CiAccountDetails } from './shared/ci-account-details.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CiAccountDetailsService } from './shared/ci-account-details.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { InterestPostingFrequencyService } from 'src/app/configurations/common-config/interest-posting-frequency/shared/interest-posting-frequency.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-ci-account-details',
  templateUrl: './ci-account-details.component.html',
  styleUrls: ['./ci-account-details.component.css']
})
export class CiAccountDetailsComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;
  
 
  accountdetailsform:FormGroup;

  date: any;
  addButton: boolean = false;
  id: any;
  groupBasic: any;
  statusList: any[]=[];
  maxDate = new Date();
  minDate = new Date();
  orgnizationSetting:any;
  ciborrowingAccountDetailsModel :CiAccountDetails = new CiAccountDetails();
  EditDeleteDisable:boolean = false;
  activeIndex: number = 0;
  buttonDisabled: boolean=false;
  completed = 0;
  branchId: any;
  pacsId: any;
  saveAndContinueFlag: boolean = true;
  isEdit: any;
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  communication: any;
  kyc: any;
  land: any;
  nominee: any;
  familydetails: any;
  asset: any;
  basicDetails: any;
  buttonDisbled: boolean =true;
  isSaveContinueEnable: boolean = false;
  nextDisable: boolean = false;
  serviceUrl: any;
  financiarbanktypeList: any[] = [];
  productList: any[] = [];
  purposeList:any []=[];
  repaymentlist:any[]=[];
  // productId=2;
  fileName: any;
  isFileUploaded: boolean = false;
  multipartFileList: any[] = [];
  uploadFileData: any;
  filesDTOList: any[] = [];
  currentDate :any;

  constructor(private commonComponent: CommonComponent,private router:Router, private formBuilder:FormBuilder,
    private ciAccountDetailsService : CiAccountDetailsService,private commonFunctionsService: CommonFunctionsService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,
    private interestpostingfrequencyService: InterestPostingFrequencyService,private fileUploadService : FileUploadService,
    private datePipe: DatePipe
  ){
    this.accountdetailsform = this.formBuilder.group({
      'financiarBank': new FormControl('', Validators.required),
      'product':new FormControl('',Validators.required),
      'accountNumber': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ACCOUNT_NUMBER_PATTERN)]),
      'applicationDate':[{ value: '', disabled: true }],
      'roi': new FormControl('', [ Validators.pattern(applicationConstants.ALLOW_TWO_NUMBERS_TWO_DECIMALS)]),
      'penalRoi': new FormControl('', [ Validators.pattern(applicationConstants.ALLOW_TWO_NUMBERS_TWO_DECIMALS)]),
      'iodRate':new FormControl('', [ Validators.pattern(applicationConstants.ALLOW_TWO_NUMBERS_TWO_DECIMALS)]),
      'requestedDate':new FormControl('', Validators.required),
      'repaymentFrequency':new FormControl(''),
      'borrowingPeriodInMonths':new FormControl('', [ Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),
      'requestedAmount': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
      'sanctionedAmount':new FormControl('', [ Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
      'sanctionedDate': new FormControl('',Validators.required),
      'borrowingDueDate': new FormControl(''),
      'installmentAmount': new FormControl('', [ Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
      'cgstAmount': new FormControl('', [ Validators.pattern(applicationConstants.RATE_OF_INTERST)]),
      'totalInterest': new FormControl('', [ Validators.pattern(applicationConstants.RATE_OF_INTERST)]),
      'totalPayout': new FormControl('', [ Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
      'remarks':new FormControl(''),
      'processingFee':new FormControl('', [ Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
      'fileUpload': new FormControl(''),
      
     
    })
   

  }
 /**
   * @author vinitha
   * @implements get account details data by borrowing accountId 
   */
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.statusList = this.commonComponent.status();
    this.financiarbanktypeList=this.commonComponent.financialBankType();
    this.repaymentlist = this.commonComponent.rePaymentFrequency();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let queryParams = params['id'].split('#');
        let id = this.encryptService.decrypt(params['id']);

        if (id != "" && id != null && id != undefined) {
          this.isEdit = true;
          this.ciAccountDetailsService.getPreviewDataByCiBorrowingAccountId(id).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
              this.ciborrowingAccountDetailsModel = this.responseModel.data[0];
              if (this.ciborrowingAccountDetailsModel != null && this.ciborrowingAccountDetailsModel != undefined) {
                if(this.ciborrowingAccountDetailsModel.sanctionedDate != null && this.ciborrowingAccountDetailsModel.sanctionedDate != undefined &&this.ciborrowingAccountDetailsModel.sanctionedDate!=null&&this.ciborrowingAccountDetailsModel.sanctionedDate!= undefined){
                  this.ciborrowingAccountDetailsModel.sanctionedDate=this.datePipe.transform(this.ciborrowingAccountDetailsModel.sanctionedDate, this.orgnizationSetting.datePipe);
                 
                }
                if(this.ciborrowingAccountDetailsModel.applicationDate != null && this.ciborrowingAccountDetailsModel.applicationDate != undefined ){
                  this.ciborrowingAccountDetailsModel.applicationDateVal=this.datePipe.transform(this.ciborrowingAccountDetailsModel.applicationDate, this.orgnizationSetting.datePipe);
                 
                }
                if(this.ciborrowingAccountDetailsModel.applicationDate == null || this.ciborrowingAccountDetailsModel.applicationDate == undefined){
                  this.ciborrowingAccountDetailsModel.applicationDateVal = this.commonFunctionsService.currentDate();
                }
                if(this.ciborrowingAccountDetailsModel.requestedDate != null && this.ciborrowingAccountDetailsModel.requestedDate != undefined &&this.ciborrowingAccountDetailsModel.requestedDate!=null&&this.ciborrowingAccountDetailsModel.requestedDate!= undefined){
                  this.ciborrowingAccountDetailsModel.requestedDate=this.datePipe.transform(this.ciborrowingAccountDetailsModel.requestedDate, this.orgnizationSetting.datePipe);
                 
                }
                if(this.ciborrowingAccountDetailsModel.borrowingDueDate != null && this.ciborrowingAccountDetailsModel.borrowingDueDate != undefined &&this.ciborrowingAccountDetailsModel.borrowingDueDate!=null&&this.ciborrowingAccountDetailsModel.borrowingDueDate!= undefined){
                  this.ciborrowingAccountDetailsModel.borrowingDueDate=this.datePipe.transform(this.ciborrowingAccountDetailsModel.borrowingDueDate, this.orgnizationSetting.datePipe);
                 
                }
                if(this.ciborrowingAccountDetailsModel.ciFileCopyPath != null && this.ciborrowingAccountDetailsModel.ciFileCopyPath != undefined)
                  this.ciborrowingAccountDetailsModel.multipartFileList = this.fileUploadService.getFile(this.ciborrowingAccountDetailsModel.ciFileCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciborrowingAccountDetailsModel.ciFileCopyPath);
                // this.onChangeProduct();
              }
            this.commonComponent.stopSpinner();
            }else {
              this.commonComponent.stopSpinner();
              this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
            
          }, error => {
            this.msgs = [];
            this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
            this.commonComponent.stopSpinner();
          });
        }
      } 
    })
    this.accountdetailsform.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.accountdetailsform.valid) {
        this.save();
      }
    });
    this.ciborrowingAccountDetailsModel.applicationDateVal = this.commonFunctionsService.currentDate();
    this.pacsId =1;
   
    // this.getAllproducts();
    
  }
  updateData() {
    this.ciAccountDetailsService.changeData({
      formValid: this.accountdetailsform.valid ,
      data: this.ciborrowingAccountDetailsModel,
      stepperIndex: 0,
      
    });
  }
  save() {
    this.updateData();
  }
  

  onRowEditInit() {
    this.addButton=true; 
  }

  /**
   * @author vinitha
   * @implements get active products based in pacsId 
   */
  getAllproducts() {
    this.commonComponent.startSpinner();
    this.ciAccountDetailsService.getAllActiveProductsBasedOnPacsId(this.pacsId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        if (this.responseModel != null&& this.responseModel.data!= undefined && this.responseModel.data.length>0)
        this.productList = this.responseModel.data;
        this.productList = this.productList.filter((activity: any) => activity != null).map((act: { name: any; id: any; }) => {
          return { label: act.name, value: act.id };
        });
       
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1000);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }
  onChangeProduct(){
    this.ciAccountDetailsService.getProductById(this.ciborrowingAccountDetailsModel.productId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciborrowingAccountDetailsModel.roi = this.responseModel.data[0].roi;
        this.ciborrowingAccountDetailsModel.penalRoi = this.responseModel.data[0].penalInterest;
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1000);
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
    }
  }
//upload documnet 
fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.ciborrowingAccountDetailsModel.multipartFileList = [];
    this.multipartFileList = [];
    this.ciborrowingAccountDetailsModel.filesDTO = null; // Initialize as a single object
    this.ciborrowingAccountDetailsModel.ciFileCopyPath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "CI_BORROWINGS" + this.id + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      // this.filesDTOList = [filesDTO]

      this.ciborrowingAccountDetailsModel.filesDTO = filesDTO;
      this.ciborrowingAccountDetailsModel.ciFileCopyPath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
  //remove documnet 
  fileRemoveEvent() {
  this.ciborrowingAccountDetailsModel.multipartFileList = [];
  if (this.ciborrowingAccountDetailsModel.filesDTO != null && this.ciborrowingAccountDetailsModel.filesDTO != undefined) {
    this.ciborrowingAccountDetailsModel.ciFileCopyPath = null;
    this.ciborrowingAccountDetailsModel.filesDTO = null;
  }
}
dateConversion() {
  const requestedDate = this.accountdetailsform.get('requestedDate')?.value;
  const applicationDate = this.accountdetailsform.get('applicationDate')?.value;

  // Check if requestedDate is before applicationDate
  if (requestedDate && applicationDate && new Date(requestedDate) < new Date(applicationDate)) {
    this.accountdetailsform.get('requestedDate')?.reset();
    this.accountdetailsform.updateValueAndValidity();
    this.msgs = [{ severity: 'warning', detail: applicationConstants.REQUESTED_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_APPLICATION_DATE }];
    setTimeout(() => {
      this.msgs = [];
    }, 2000);
  }

  const sanctionDate = this.accountdetailsform.get('sanctionedDate')?.value;

  // Check if sanctionDate is before requestedDate
  if (sanctionDate && requestedDate && new Date(sanctionDate) < new Date(requestedDate)) {
    this.accountdetailsform.get('sanctionedDate')?.reset();
    this.accountdetailsform.updateValueAndValidity();
    this.msgs = [{ severity: 'warning',  detail: applicationConstants.SANCTION_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_REQUESTED_DATE }];
    setTimeout(() => {
      this.msgs = [];
    }, 2000);
  }

  const dueDate = this.accountdetailsform.get('borrowingDueDate')?.value;

  // Check if dueDate is before sanctionDate
  if (dueDate && sanctionDate && new Date(dueDate) < new Date(sanctionDate)) {
    this.accountdetailsform.get('borrowingDueDate')?.reset();
    this.accountdetailsform.updateValueAndValidity();
    this.msgs = [{ severity: 'warning', detail: applicationConstants.DUE_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_SANCTION_DATE }];
    setTimeout(() => {
      this.msgs = [];
    }, 2000);
  }
}
}
