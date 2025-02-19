import { Component } from '@angular/core';
import { DailyDepositTransactionConstants } from '../../daily-deposits-transaction-constants';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Accounts } from '../../shared/accounts.model';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { AcountsTransaction } from '../../shared/acounts-transaction.model';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.css']
})
export class RenewalComponent {

  activeIndex: number = 0;
  data: any;
  operationslist: any;
  options: any;
  sbAccountNumber: string = '';
  showSbAccountNumber: boolean = false;
  showPrincipleform: boolean = false;
  showInterestForm: boolean = false;
  showIntrestOrPrincipleForm: boolean = false;
  showManualRenewalForm: boolean = false;
  isBasicDetails: boolean = false;
  isHistory: boolean = false;
  showForm: boolean = false;

  position: string = 'center';

  actions = [
    { label: "Death", value: "death" },
    { label: "Transfer", value: "transfer" }
  ];

  paymentOptions = [
    { label: 'Cash', value: 'cash' },
    { label: 'To SB Account', value: 'sbAccount' },
  ];

  renewalTypeOptions: SelectItem[];
  selectedRenewalType: string | undefined;
  transactionHistoryList: any[] = [];
  transactionColumns: any[] = [];
  groupPrmoters: any[] = [];
  columns: any[] = [];
  msgs: any[] = [];
  responseModel!: Responsemodel;
  accountsModel: Accounts = new Accounts();
  tempAccountsModel: Accounts = new Accounts();
  membershipBasicRequiredDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  transactionModel: AcountsTransaction = new AcountsTransaction();
  individualFlag: boolean = true;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  membreIndividualFlag: boolean = false;
  pacsId:any;
  branchId:any;
  accId:any;
  orgnizationSetting: any;
  uploadFileData: any;
  isFileUploaded: boolean = false;
  multipleFilesList: any[] = [];
  groupPrmotersList: any[] = [];
  institionPromotersList: any[] = [];
  today: any;

  constructor(private router: Router,
    private dailyDepositsAccountsService: DailyDepositsAccountsService,
    private commonFunctionsService: CommonFunctionsService,
    private commonComponent: CommonComponent,private datePipe: DatePipe, 
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
  ) {
    this.renewalTypeOptions = [
      { label: 'Principle', value: 'Principle' },
      // { label: 'Interest', value: 'Interest' },
      { label: 'Principle + Interest', value: 'Principle And Interest' },
      { label: 'Manual Renewal Amount', value: 'Manual Renewal Amount' }
    ];
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
    this.transactionColumns = [
      { field: 'transactionDate', header: 'Transaction Date' },
      { field: 'transactionModeName', header: 'Transaction Mode' },
      { field: 'transactionTypeName', header: 'Transaction Type' },
      { field: 'transactionAmount', header: 'Transaction Amount' },
      { field: '', header: 'Balance Amount' },
    ];
  }


  ngOnInit() {
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.today= this.commonFunctionsService.currentDate();
    this.activateRoute.queryParams.subscribe(params => {
      if(params['id'] != undefined ) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.accId = Number(queryParams);
        this.getAccountDetails(this.accId);
      }
    });

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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

    this.getTransactionHistoryDetails(this.accId, this.pacsId); 
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

  renewalType(element: any): void {

    this.showPrincipleform = false;
    this.showInterestForm = false;
    this.showIntrestOrPrincipleForm = false;
    this.showManualRenewalForm = false;
    if (element.value === applicationConstants.PRINCIPLE) {
      this.showPrincipleform = true;
    } 
    // else if (element.value === 'Interest') {
    //   this.showInterestForm = true;
    // }
    else if (element.value === applicationConstants.PRINCIPLE_AND_INTEREST) {
      this.showIntrestOrPrincipleForm = true;
    }
    else if (element.value === applicationConstants.MANUAL_RENEWAL_AMOUNT) {
      this.showManualRenewalForm = true;
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
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  // {@code get  account details by id} :
  // @implNote:get  account details by particular  transaction Id
  // @author Jyoshna
  getAccountDetails(id: any) {
    this.dailyDepositsAccountsService.getAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountsModel = this.responseModel.data[0];
            this.tempAccountsModel = this.responseModel.data[0];
            // if(this.tempAccountsModel.accountNumber != null && this.tempAccountsModel.accountNumber != undefined && this.tempAccountsModel.accountNumber != "")
            //   this.tempAccountsModel.accountNumber = null;
            this.accountsModel.closureDate = this.commonFunctionsService.currentDate();
            if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
              this.accountsModel.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined && this.accountsModel.memberTypeName != "")
              this.memberTypeCheck(this.accountsModel.memberTypeName);
          }
        } else {
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

  // {@code get  transaction details List} :
  // @implNote:get  transaction details by particular  pacid and acid
  // @author Jyoshna
  getTransactionHistoryDetails(accId: any, pacsId: any) {
    this.dailyDepositsAccountsService.getTopFiveTransactions(accId, pacsId).subscribe((response: any) => {
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

  // {@code add  account  details by id} :
	// @implNote:add  account details to renwal for same account
	// @author Jyoshna
  addAccountDetails(accountsModel: any) {
    accountsModel.closureDate = this.commonFunctionsService.getUTCEpoch(new Date(accountsModel.closureDate));
    accountsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.today));
    this.mapRenealDetailsToAccTransaction(accountsModel);
    this.dailyDepositsAccountsService.addRenewalData(accountsModel).subscribe((response: any) => {
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
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
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
  mapRenealDetailsToAccTransaction(accModel:any){
    this.transactionModel.admissionNumber=accModel.adminssionNumber;
    this.transactionModel.accountNumber=accModel.accountNumber;
    this.transactionModel.accId=accModel.id;
    this.transactionModel.transactionAmount=accModel.depositAmount;
    this.transactionModel.transactionDate=accModel.depositDate;
    this.transactionModel.transactionType=2;
    this.transactionModel.transactionMode=3
    accModel.accountsTransactionDTO = this.transactionModel;
  }
}
