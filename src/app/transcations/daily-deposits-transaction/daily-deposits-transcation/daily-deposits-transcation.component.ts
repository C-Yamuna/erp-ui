import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { DailyDepositsAccountsService } from '../shared/daily-deposits-accounts.service';
import { Accounts } from '../shared/accounts.model';
import { AcountsTransaction } from '../shared/acounts-transaction.model';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DailyDepositTransactionConstants } from '../daily-deposits-transaction-constants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { AccountsChequeDetails } from '../shared/accounts-cheque-details.model';
import { AccountsTransferTransactionDetails } from '../shared/accounts-transfer-transaction-details.model';


@Component({
  selector: 'app-daily-deposits-transcation',
  templateUrl: './daily-deposits-transcation.component.html',
  styleUrls: ['./daily-deposits-transcation.component.css']
})
export class DailyDepositsTranscationComponent {
  transactionTypeOptions: any[] = [];
  paymentMethodOptions: any[] = [];
  selectedTransactionType: any;
  selectedPaymentMethod: any;
  showCashForm: boolean = false;
  showChequeForm: boolean = false;
  transactionFrom: any;
  orgnizationSetting: any;
  responseModel!: Responsemodel;
  accId: any;
  isEdit: any;
  accountsModel: Accounts = new Accounts();
  membershipBasicRequiredDetails: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  transactionModel: AcountsTransaction = new AcountsTransaction();
  chequeDetails : AccountsChequeDetails = new AccountsChequeDetails();
  transferTransactionDetails : AccountsTransferTransactionDetails = new AccountsTransferTransactionDetails();
  transactions: any[] = [];
  memberTypeName: any;
  paymentMethodOptionsForDepositType: any[] = [];
  depositFlag: boolean = false;
  paymentMethodOptionsForWithDrawalType: any[] = [];
  msgs: any[] = [];
  transactionColumns: any[] = [];
  columns: { field: string; header: string; }[];
  subColumns: { field: string; header: string; }[];
  pacsId: any;
  branchId: any;
  withDrawalFlag: boolean = false;
  transferForShow: boolean = false;
  addDenominationDetailsPopUp: boolean = false;
  currencyList: any[] = [];
  coinList: any[] = [];

  notesDenominationList: any[] = [];
  coinsDenominationList: any[] = [];
  confirmDialog: boolean = false;
  voucherDeiloge: boolean = false;
  transactionModelList: any[] = [];
  accountNumber: any;
  minBalence: any;
  accountType : any;
  transactionDateVal: any;
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  isKycApproved: any; 
  institionPromotersList: any[] = [];
  membreIndividualFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  institutionPromoterFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;

  admissionNumber : any;
  groupPrmoters: any[] = [];
  groupPrmotersList: any [] = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private dailyDepositsAccountsService:DailyDepositsAccountsService,
    private commonComponent: CommonComponent, 
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, 
    private datePipe: DatePipe, 
    private fileUploadService :FileUploadService,private translate: TranslateService) {
    this.transactionFrom = this.formBuilder.group({
        'trnsactionType': new FormControl('', Validators.required),
        "transactionMode": new FormControl('', Validators.required),
        "accountNumber":new FormControl({ value: '', disabled: true }, Validators.required),
        "accountHolderName": new FormControl('', Validators.required),
        "amountInWords": new FormControl({ value: '', disabled: true }, Validators.required),
        "accountType": new FormControl({ value: '', disabled: true }, Validators.required),
        "amount": new FormControl('', Validators.required),
        "transactionDate": new FormControl({ value: '', disabled: true },Validators.required),
        //cheque
        "chequeHolderName": new FormControl('',Validators.required),
        "branch": new FormControl('',Validators.required),
        "chequeNumber": new FormControl('',Validators.required),
        "chequeValidDate": new FormControl('',Validators.required),
        "chequeAmount": new FormControl('',Validators.required),
        "narration": new FormControl('',Validators.required),

        //transaction
        "transferAccountHolderName": new FormControl('',Validators.required),
        "transferAmount": new FormControl('',Validators.required),
        "transaferBranch": new FormControl('',Validators.required),
        "transferNarration": new FormControl('',Validators.required),
    });
    this.transactionColumns = [
      { field: 'trnasactionDateVal', header: 'ERP.TRANSACTION_DATE' },
      { field: 'particulars', header: 'ERP.PARTICULARS' },
      { field: 'transactionModeName', header: 'ERP.TRANSACTION_MODE' },
      { field: 'transactionTypeName', header: 'ERP.TRANSACTION_TYPE' },
      { field: 'transactionAmount', header: 'ERP.TRANSACTION_AMOUNT' },
      { field: 'balance', header: 'ERP.BALENCE_AMOUNT' }
    ];
    this.transactionTypeOptions = [
      { label: 'Credit', value: 1 },
      { label: 'Debit', value: 2 }
    ];

    this.paymentMethodOptionsForDepositType = [
      { label: 'Cash', value: 1 },
      // { label: 'Cheque', value: 2 },
    ];
    this.paymentMethodOptionsForWithDrawalType = [
      { label: 'Cash', value: 1 },
      // { label: 'Cheque', value: 2 },
      { label: 'transafer', value: 3 }
    ];

    this.columns = [
      { field: 'transactionModeName', header: 'ERP.TRANSACTION_MODE' },
      { field: 'transactionTypeName', header: 'ERP.TRANSACTION_TYPE' },
      { field: 'trnasactionDateVal', header: 'ERP.TRANSACTION_DATE' },
      { field: 'transactionAmount', header: 'ERP.TRANSACTION_AMOUNT' },
      { field: 'statusName', header: 'ERP.STATUS' },
    ];
    this.subColumns = [
      { field: 'coins', header: 'Coins' },
      { field: '', header: 'Count' },
      { field: '', header: 'Amount' },
    ];

    this.groupPrmoters = [ //promoter grid feilds for group and institution
      { field: 'surname', header: 'DEMANDDEPOSITS.SURNAME' },
      { field: 'name', header: 'DEMANDDEPOSITS.NAME' },
      { field: 'operatorTypeName', header: 'DEMANDDEPOSITS.OPERATION_TYPE_NAME' },
      { field: 'memDobVal', header: 'DEMANDDEPOSITS.MEMBER_DATE_OF_BIRTH' },
      { field: 'age', header: 'DEMANDDEPOSITS.AGE' },
      { field: 'genderName', header: 'DEMANDDEPOSITS.GENDER' },
      { field: 'maritalStatusName', header: 'DEMANDDEPOSITS.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'DEMANDDEPOSITS.MOBILE_NUMBER' },
      { field: 'emailId', header: 'DEMANDDEPOSITS.EMAIL' },
      { field: 'aadharNumber', header: 'DEMANDDEPOSITS.AADHAR' },
      { field: 'startDate', header: 'DEMANDDEPOSITS.START_DATE' }, 
    ];
  }

  ngOnInit(): void {
    this.pacsId = 1;
    this.branchId = 1;
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.accountType = applicationConstants.DAILY_DEPOSITS;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    // this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['id'] != undefined) {
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.accId = Number(id);
          this.getAccountDetailsById(this.accId);
        }
      }
    });
    this.transactionModel.transactionDate= this.commonFunctionsService.currentDate();
    this.getTopTransactionsList();
  }

  transactionType(event: any) {
    if (event == 1) {
      this.depositFlag = true;
      this.withDrawalFlag = false;
      this.paymentMethodOptions = [
        { label: 'Cash', value: 1 },
        // { label: 'Cheque', value: 2 }
        { label: 'transafer', value: 3 }
      ];
      this.transactionModel.transactionTypeName = 'Credit';
    } else if (event == 2) {
      this.depositFlag = false;
      this.withDrawalFlag = true;
      this.paymentMethodOptions = [
        { label: 'Cash', value: 1 },
        // { label: 'Cheque', value: 2 },
        { label: 'transafer', value: 3 }
      ];
      this.transactionModel.transactionTypeName = 'Debit';
    } else {
      this.showCashForm = false;
      this.showChequeForm = false;
    }
  }

  toggleCashForm(element: any) {
    if (element == 1) {
      this.showCashForm = true;
      this.showChequeForm = false;
      this.transferForShow = false;
      this.paymentMethodOptions = this.paymentMethodOptionsForDepositType;
      this.transactionModel.transactionModeName = "Cash";
    } else if (element == 2) {
      this.showCashForm = false;
      this.showChequeForm = true;
      this.transferForShow = false;
      this.paymentMethodOptions = this.paymentMethodOptionsForWithDrawalType;
      this.transactionModel.transactionModeName = "Cheque";
    } else {
      this.transferForShow = true;
      this.showCashForm = false;
      this.showChequeForm = false;
      this.transactionModel.transactionModeName = "transafer";
    }
  }

  back() {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT]);
  }

  // {@code get Account details} :
	// @implNote:getAccount details of a particular  account Id
	// @author Jyoshna
  getAccountDetailsById(id: any) {
    this.dailyDepositsAccountsService.getAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.accountsModel = this.responseModel.data[0];
              if (this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined) {
                this.memberTypeName = this.accountsModel.memberTypeName;
              }
              if (this.accountsModel.adminssionNumber != null && this.accountsModel.adminssionNumber != undefined) {
                this.admissionNumber = this.accountsModel.adminssionNumber;
              }
              //member individual
              if (this.accountsModel.memberShipBasicDetailsDTO != null && this.accountsModel.memberShipBasicDetailsDTO != undefined) {
                this.membershipBasicRequiredDetails = this.accountsModel.memberShipBasicDetailsDTO;
                if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
                  this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
                }
                if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
                  this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
                }
                if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
                  this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
                  
                }
                else{
                  this.photoCopyFlag = false;
                }
                if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
                    this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
                }
                else{
                  this.signatureCopyFlag = false;
                }
                if (this.membershipBasicRequiredDetails.isStaff != null && this.membershipBasicRequiredDetails.isStaff != undefined && this.membershipBasicRequiredDetails.isStaff) {
                  this.membershipBasicRequiredDetails.isStaff = applicationConstants.YES;
                }
                else{
                  this.membershipBasicRequiredDetails.isStaff = applicationConstants.NO;
                }
                if (this.membershipBasicRequiredDetails.isKycApproved != null && this.membershipBasicRequiredDetails.isKycApproved != undefined && this.membershipBasicRequiredDetails.isKycApproved) {
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                }
                else {
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
                }
              }
              //group
              if (this.accountsModel.memberShipGroupDetailsDTO != null && this.accountsModel.memberShipGroupDetailsDTO != undefined) {
                this.memberGroupDetailsModel = this.accountsModel.memberShipGroupDetailsDTO;
                if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
                  this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
                }
                if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
                  this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                }
                if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined) {
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                }
                else {
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
                }
                if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                  this.groupPrmotersList=this.memberGroupDetailsModel.groupPromoterList ;
                }
              }
              //institution
              if (this.accountsModel.memInstitutionDTO != null && this.accountsModel.memInstitutionDTO != undefined) {
                this.membershipInstitutionDetailsModel = this.accountsModel.memInstitutionDTO;
                if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
                  this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
                }
                if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
                  this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                }
                if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
                  this.institionPromotersList=this.membershipInstitutionDetailsModel.institutionPromoterList ;
                }
                if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined) {
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                }
                else {
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
                }
              }
              if (this.accountsModel.accountNumber != null && this.accountsModel.accountNumber != undefined) {
                this.transactionModel.accountNumber = this.accountsModel.accountNumber;
              }
              // if (this.accountsModel.minBalance != null && this.accountsModel.minBalance != undefined) {
              //   this.minBalence = this.accountsModel.minBalance;
              // }
              
              this.getTopTransactionsList();
            }
          }
          else{
            this.msgs = [];
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
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

    // {@code update  transaction details} :
	// @implNote:update transaction details 
	// @author Jyoshna
  saveOrUpdateTransactionDetails() {
    this.confirmDialog = false;
    this.transactionModel.accId = this.accId;
    this.transactionModel.pacsId = this.pacsId;
    // this.transactionModel.branchId = this.branchId;
    if (this.transactionModel.transactionMode != null && this.transactionModel.transactionMode != undefined && this.transactionModel.transactionMode === 2) {
      if (this.chequeDetails != null && this.chequeDetails != undefined) {
        this.transactionModel.chequeTransactionDetails = this.chequeDetails;
        if(this.chequeDetails.amount != null && this.chequeDetails.amount != undefined){
          this.transactionModel.transactionAmount = this.chequeDetails.amount;
        }
        // if(this.chequeDetails.beneficiaryName != null && this.chequeDetails.beneficiaryName != undefined){
        //   this.transactionModel.particulars = this.chequeDetails.beneficiaryName;
        // }
      }
    }
    if(this.transactionModel.transactionMode != null && this.transactionModel.transactionMode != undefined && this.transactionModel.transactionMode === 3){
      if(this.transferTransactionDetails != null && this.transferTransactionDetails != undefined){
        this.transactionModel.transferTransactionDetailsDTO = this.transferTransactionDetails;
        if(this.transferTransactionDetails.transactionAmount != null && this.transferTransactionDetails.transactionAmount != undefined){
          this.transactionModel.transactionAmount = this.transferTransactionDetails.transactionAmount;
        }
        // if(this.transferTransactionDetails.beneficiaryName != null && this.transferTransactionDetails.beneficiaryName != undefined){
        //   this.transactionModel.particulars = this.transferTransactionDetails.beneficiaryName;
        // }
      }
    }
    if (this.transactionModel.transactionDate != null && this.transactionModel.transactionDate != undefined) {
      this.transactionModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.transactionModel.transactionDate));
    }
    if (this.transactionModel.id != null && this.transactionModel.id != undefined) {
      this.dailyDepositsAccountsService.updateTransaction(this.transactionModel).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.voucherDeiloge = true;
          }
          this.transactionModelList.push(this.responseModel.data[0]);
          
        }
        this.getTopTransactionsList();
        this.cancel();
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
    else {
      this.dailyDepositsAccountsService.addTransaction(this.transactionModel).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.voucherDeiloge = true;
            this.transactionModelList.push(this.responseModel.data[0]);
          }
        }
        this.getTopTransactionsList();
        
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
  submit() {
    if (this.transactionModel != null && this.transactionModel != undefined && this.transactionModel.transactionType != null && this.transactionModel.transactionType != undefined && this.transactionModel.transactionType == 2) {
      if (this.accountsModel.depositAmount == null || this.accountsModel.depositAmount == undefined) {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: "Insuffiecient Balence In your Account" }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      else if (this.transactionModel != null && this.transactionModel != undefined && this.transactionModel.transactionAmount > this.accountsModel.depositAmount) {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: "Insuffiecient Balence In your Account" }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      else {
        this.confirmDialog = true;
      }
    } else {
      this.confirmDialog = true;
    }
  }

  // {@code get top five transaction details} :
	// @implNote:get to five transaction details of a particular  account Id
	// @author Jyoshna
  getTopTransactionsList() {
    this.transactions = [];
    this.dailyDepositsAccountsService.getTopFiveTransactions(this.accId,this.pacsId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactions = this.responseModel.data.map((daily: any) => {
              if (daily != null && daily != undefined && daily.transactionDate != null && daily.transactionDate != undefined) {
                daily.trnasactionDateVal = this.datePipe.transform(daily.transactionDate, this.orgnizationSetting.datePipe);
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

  cancleTransaction(){

  }
  
  close(){
      this.voucherDeiloge = false;
      this.memberPhotoCopyZoom = false;
      this.membreIndividualFlag = false;
      this.cancel();
      this.refreshAllforms();
  }

  onClickMemberIndividualMoreDetails(){
    this.membreIndividualFlag = true;
  }

  onClick(){
    this.institutionPromoterFlag = true;
  }
  onClickOfGroupPromotes(){
    this.groupPromotersPopUpFlag = true;
  }

  closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }

  onClickMemberPhotoCopy(){
    this.memberPhotoCopyZoom = true;
  }

  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }

  // {@code get  transaction details by id} :
	// @implNote:get  transaction details by particular  transaction Id
	// @author Jyoshna
  getTranasactionById(rowData : any){
    this.dailyDepositsAccountsService.getTransaction(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionModel = this.responseModel.data[0];
            if(this.transactionModel.transactionMode != null && this.transactionModel.transactionMode != undefined){
              this.toggleCashForm(this.transactionModel.transactionMode);
            }
            if(this.transactionModel.transactionType != null && this.transactionModel.transactionType != undefined){
              this.transactionType(this.transactionModel.transactionType);
            }
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

  // {@code delete  transaction details by id} :
	// @implNote:delete  transaction details by particular  transaction Id
	// @author Jyoshna
  deleteTransaction(rowData : any){
    this.dailyDepositsAccountsService.deleteTransaction(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.msgs = [];
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
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

  cancel(){
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT]);
    this.transactionModel = new AcountsTransaction();
    this.transactionModel.transactionDate= this.commonFunctionsService.currentDate();
    if(this.accId != null && this.accId != undefined){
      this.getAccountDetailsById(this.accId);
    }
  }
  
  refreshAllforms(){
    this.showCashForm = false;
    this.showChequeForm = false;
    this.transferForShow = false;
    this.depositFlag = false;
    this.withDrawalFlag = false;
  }

  isBasicDetails: boolean = false;
  position: string = 'center';
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }

  onAmountChange() {
    if (this.transactionModel.transactionAmount !== null && this.transactionModel.transactionAmount >= 0 && this.transactionModel.transactionAmount != "") {
      this.transactionModel.transactionAmountInWords = this.commonFunctionsService.convertToWords(this.transactionModel.transactionAmount);
    } else {
      this.transactionModel.transactionAmountInWords = '';
    }

    if (this.transferTransactionDetails.transactionAmount !== null && this.transferTransactionDetails.transactionAmount >= 0 && this.transferTransactionDetails.transactionAmount != "") {
      this.transferTransactionDetails.amountInWords = this.commonFunctionsService.convertToWords(this.transferTransactionDetails.transactionAmount);
    } else {
      this.transferTransactionDetails.amountInWords = '';
    }
  }
}
