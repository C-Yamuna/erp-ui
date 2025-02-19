import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyDepositTransactionConstants } from '../../daily-deposits-transaction-constants';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Accounts } from '../../shared/accounts.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonStatusData, CommonStatusDataValue, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-foreclosure',
  templateUrl: './foreclosure.component.html',
  styleUrls: ['./foreclosure.component.css']
})
export class ForeclosureComponent {
  activeIndex: number = 0;
  data: any;
  operationslist: any;
  options: any;
  membreIndividualFlag: boolean = false;
  sbAccountNumber: string = '';
  showSbAccountNumber: boolean = false;
  actions = [
    { label: "Death", value: "death" },
    { label: "Transfer", value: "transfer" }
  ];

  paymentOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'To SB Account', value: 'sbAccount' },
  ];

  statusTypesList = [
    { label: 'Closure', value: 'Closure' },
    { label: 'Foreclosure', value: 'Foreclosure' },
  ];
  isBasicDetails: boolean = false;
  isHistory: boolean = false;
  position: string = 'center';
  pacsId:any;
  branchId:any;
  accId:any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  accountsModel:Accounts = new Accounts();
  membershipBasicRequiredDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  photoCopyFlag: boolean = false;
  isKycApproved: any;
  admissionNumber:any
  groupPrmotersList: any[] = [];
  institionPromotersList: any[] = [];
  memberTypeName:any;
  individualFlag: boolean = true;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  groupPrmoters: any[] = [];
  columns: any[] = [];
  memberPhotoCopyZoom: boolean = false;
  applicationType: any;
  transactionDialogBox: boolean = false;
  transactionHistoryList:any[]=[];
  transactionColumns: any[] = [];
  clouserForm: FormGroup;
  uploadFileData: any;
  isFileUploaded: boolean = false;
  multipleFilesList: any[] = [];

  constructor(private router: Router,private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService,
    private commonComponent: CommonComponent,private datePipe: DatePipe , 
    private fileUploadService: FileUploadService,
    private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService
   ) {
    this.columns = [
      { field: 'surname', header: 'SURNAME' },
      { field: 'name', header: 'NAME' },
      { field: 'operatorTypeName', header: 'TRANSACTION_DATE' },
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender Name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile Number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
    ];

    this.groupPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
    ];
    this.transactionColumns=[
      { field: 'transactionDate', header: 'Transaction Date' },
      { field: 'transactionModeName', header: 'Transaction Mode' },
      { field: 'transactionTypeName', header: 'Transaction Type' },
      { field: 'transactionAmount', header: 'Transaction Amount' },
      { field: '', header: 'Balance Amount' },
    ];
    this.clouserForm = this.formBuilder.group({
      'clouserDate': new FormControl({ value: '', disabled: true },Validators.required),
      'penalityAmount': new FormControl({ value: '', disabled: true },),
      'balanceAmount': new FormControl({ value: '', disabled: true },),
      'transactionMode':['',],
      'acNumber':['',],
      'fileUpload':['',],
      'status':['',],
      'remarks':['',]
    });
    }

  ngOnInit() {
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.accountsModel.closureDate= this.commonFunctionsService.currentDate();
    this.applicationType = applicationConstants.DAILY_DEPOSITS;
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.activateRoute.queryParams.subscribe(params => {
      if(params['id'] != undefined ) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.accId = Number(queryParams);
        this.getAccountDetails(this.accId);
      }
    });

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          tension: 0.4
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
    
  }

  onPaymentTypeChange(element: any): void {
    if (element.value.value === applicationConstants.SB_ACCOUNT) {
      this.showSbAccountNumber = true;
      this.accountsModel.transactionMode=2;
    } else if(element.value.value === applicationConstants.CASH){
      this.showSbAccountNumber = false;
      this.accountsModel.transactionMode=1;
    }
  }


  back() {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT]);
  }

  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
    if (this.isHistory)
      this.isHistory = false
  }
  showHistoryDialog(position: string) {
    this.position = position;
    this.isHistory = true;
    if (this.isBasicDetails)
      this.isBasicDetails = false;
  }

  // {@code get  account details by id} :
	// @implNote:get  account details by particular  transaction Id
	// @author Jyoshna
  getAccountDetails(id:any){
    this.dailyDepositsAccountsService.getAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountsModel = this.responseModel.data[0];
            this.accountsModel.closureDate= this.commonFunctionsService.currentDate();
            if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
              this.accountsModel.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
            }
            if(this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined && this.accountsModel.memberTypeName != "")
              this.memberTypeCheck(this.accountsModel.memberTypeName);
            if(this.accountsModel.sbAccountNumber != null && this.accountsModel.sbAccountNumber != undefined){
              this.showSbAccountNumber = false;
            }
          }
        }else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }

      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  memberTypeCheck(memberType: any) {
    if (memberType == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.membershipBasicRequiredDetailsModel = this.accountsModel.memberShipBasicDetailsDTO;
    }
    else if (memberType == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.memberGroupDetailsModel = this.accountsModel.memberShipGroupDetailsDTO;
      if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined) {
        this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
      }
    }
    else if (memberType == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.membershipInstitutionDetailsModel = this.accountsModel.memInstitutionDTO;
      if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined) {
        this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
      }
    }
  }
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }
  onClickOfGroupMoreDetails() {
    this.groupPromotersPopUpFlag = true;
  }

  onClickInstitutionMoreDetails() {
    this.institutionPromoterFlag = true;
  }
  close() {
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
  }
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  // {@code update  account  details by id} :
	// @implNote:update  account details by particular  account Id
	// @author Jyoshna
  updateAccountDetails(accountsModel: any) {
    accountsModel.closureDate = this.commonFunctionsService.getUTCEpoch(new Date(accountsModel.closureDate));
    accountsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(accountsModel.depositDateVal));
    this.dailyDepositsAccountsService.updateDailyDepositsAccounts(accountsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.accountsModel = this.responseModel.data[0];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.back();
            this.msgs = [];
          }, 1200);
        }
      }
      else{
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, (error: any) => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  transactionHistory(){
    this.transactionDialogBox = true;
    this.getTransactionHistoryDetails(this.accId,this.pacsId);
  }
  closeTransaction(){
    this.transactionDialogBox = false;
  }
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.accountsModel.filesDTOList = [];
    this.accountsModel.signaturePath = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.accountsModel.filesDTOList.push(files); 
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.accountsModel.filesDTOList[0].fileName = "DAILY_DEPOSITS_KYC_" + this.accId + "_" + timeStamp + "_" + file.name;
        this.accountsModel.signaturePath = "DAILY_DEPOSITS_KYC_" + this.accId + "_" + timeStamp + "_" + file.name; 
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
  onstatusSelection(element: any): void {
    if (element.value.value === applicationConstants.CLOSURE) {
      this.accountsModel.status = CommonStatusDataValue.CLOSED;
      this.accountsModel.statusName = CommonStatusData.CLOSED;
    } else if(element.value.value === applicationConstants.FORECLOSURE){
      this.accountsModel.status = CommonStatusDataValue.FORCLOSURE;
      this.accountsModel.statusName =  CommonStatusData.FORECLOSURE;
      this.accountsModel.isForeClosure = applicationConstants.TRUE;
    }
  }
  // {@code get  transaction details List} :
	// @implNote:get  transaction details by particular  pacid and acid
	// @author Jyoshna
  getTransactionHistoryDetails(accId: any,pacsId: any){
  this.dailyDepositsAccountsService.getTopFiveTransactions(accId,pacsId).subscribe((response: any) => {
    this.responseModel = response;
    if (this.responseModel != null && this.responseModel != undefined) {
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.transactionHistoryList = this.responseModel.data.map((daily: any) => {
            if (daily != null && daily != undefined && daily.transactionDate != null && daily.transactionDate != undefined) {
              daily.trnasactionDate = this.datePipe.transform(daily.transactionDate, this.orgnizationSetting.datePipe);
            }
            return daily;
          });
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
  },
    error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
}
