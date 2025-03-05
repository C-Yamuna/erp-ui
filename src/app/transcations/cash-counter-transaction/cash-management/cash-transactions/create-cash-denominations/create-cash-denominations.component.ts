import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CashManagementService } from '../../shared/cash-management.service';
import { CashManagement } from '../../shared/cash-management.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Transaction } from '../../shared/transaction.model';
import { CashCountertransactionconstant } from '../../../cash-counter-transaction-constant';
import { CardTitles, CommonStatusData, MemberShipTypesData, TRANSACTION_MODES, TRANSACTION_TYPES } from 'src/app/transcations/common-status-data.json';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from 'src/app/transcations/loan-transcation/shared/si-loans/si-loan-membership-details.model';
import { SavingBankApplicationModel } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application-model';
import { DenominationTypesService } from 'src/app/configurations/common-config/denomination-types/shared/denomination-types.service';

@Component({
  selector: 'app-create-cash-denominations',
  templateUrl: './create-cash-denominations.component.html',
  styleUrls: ['./create-cash-denominations.component.css']
})
export class CreateCashDenominationsComponent implements OnInit {

  cashTransactionForm!: FormGroup;
  cashManagementModel: CashManagement = new CashManagement();
  transactionModel: Transaction = new Transaction();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();

  orgnizationSetting: any;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  pacsId: any;
  branchId: any;
  maxDate = new Date();
  transactionTypeOptions: any[] = [];
  admissionNumbersList: any[] = [];
  demadDeposistAccountsList: any[] = [];
  accountNumbersList: any[] = [];
  admissionNumber: any;
  memberType: any;
  memberTypeName: any;
  isEdit: any;
  cardTitle: any;
  currencyList: any[] = [];
  denominationList: any[] = [];
  coinList: any[] = [];
  columns: any[] = [];
  subColumns: any[] = [];
  noteAmount: any
  coinAmount: any;

  // notesAmountList: any[] = [];
  // coinsAmountList: any[] = [];
  amountList: any[] = [];
  totalAmount: any;
  totalNotesAmount: any;
  totalCoinsAmount: any;
  totalAmountInWords: any;
  isTotalAmountMatched: Boolean = false;

  constructor(private translate: TranslateService,
    private router: Router,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private datePipe: DatePipe,
    private commonFunctionsService: CommonFunctionsService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private cashManagementService: CashManagementService,
    private denominationService: DenominationTypesService) {
    this.totalAmount = 0;
    this.totalNotesAmount = 0;
    this.totalCoinsAmount = 0;
  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.transactionModel.transactionDateVal = this.commonFunctionsService.currentDate();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });

    this.activateRoute.queryParams.subscribe(params => {
      if (params['cardTitle'] != undefined) {
        this.cardTitle = this.encryptDecryptService.decrypt(params['cardTitle']);
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    })

    this.cashTransactionForm = this.formBuilder.group({
      "memberTypeName": new FormControl({ value: '', disabled: true }, Validators.required),
      "admissionNumber": new FormControl('', Validators.required),
      "accountNumber": new FormControl('', Validators.required),
      "transactionDateVal": new FormControl({ value: '', disabled: true }, Validators.required),
      "transactionModeName": new FormControl({ value: '', disabled: true }, Validators.required),
      "transactionTypeName": new FormControl({ value: '', disabled: true }, Validators.required),
      "transactionAmount": new FormControl('', Validators.required),
      "amountInWords": new FormControl({ value: '', disabled: true }, Validators.required)
    })

    this.transactionTypeOptions = [
      { label: 'Deposit', value: 1 },
      { label: 'Withdraw', value: 2 }
    ];

    this.columns = [
      { field: 'note', header: 'CASH_COUNTER_TRANSACTIONS.NOTES' },
      { field: 'noteCount', header: 'CASH_COUNTER_TRANSACTIONS.COUNT' },
      { field: 'noteAmount', header: 'CASH_COUNTER_TRANSACTIONS.AMOUNTS' },

    ];
    this.subColumns = [
      { field: 'coin', header: 'CASH_COUNTER_TRANSACTIONS.NOTES' },
      { field: 'coinCount', header: 'CASH_COUNTER_TRANSACTIONS.COUNT' },
      { field: 'coinAmount', header: 'CASH_COUNTER_TRANSACTIONS.AMOUNTS' },
    ];

    this.transactionModel.pacsId = this.pacsId;
    this.transactionModel.branchId = this.branchId;
    this.transactionModel.transactionMode = 1;
    this.transactionModel.transactionModeName = TRANSACTION_MODES.CASH;
    this.transactionModel.transactionType = 1;
    this.transactionModel.transactionTypeName = TRANSACTION_TYPES.DEPOSIT;

    this.getAllDenomination();
    this.getAllApprovedMembersFromMembershipModule();
  }

  getAllDenomination() {
    this.commonComponent.startSpinner();
    this.denominationService.getAllDenomination().subscribe((data: any) => {
      this.responseModel = data;
      this.denominationList = this.responseModel.data;
      for (let obj of this.denominationList) {
        if (obj.isCoin) {
          this.coinList.push(obj)
        } else {
          this.currencyList.push(obj)
        }
      }
      this.commonComponent.stopSpinner();
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      });
  }

  getAllApprovedMembersFromMembershipModule() {
    this.cashManagementService.getAllApprovedMembersFromMembershipModule(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.admissionNumbersList = this.responseModel.data;
            this.admissionNumbersList = this.admissionNumbersList.filter((obj: any) => obj != null && obj.statusName == CommonStatusData.APPROVED).map((member: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
              return {
                label: `${member.name} - ${member.admissionNumber} - ${member.memberTypeName}`,
                value: member.admissionNumber
              };
            });
          }
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    });
  }

  OnChangeAdmissionNumber(admissionNo: any) {
    const filteredItem = this.admissionNumbersList.find((item: { value: any; }) => item.value === admissionNo);
    const parts = filteredItem.label.split(' - ');
    let label = parts[parts.length - 1].trim();
    this.transactionModel.memberTypeName = label;
    const admissionNumber = filteredItem.label.split(' - ');
    let admissionNumberLable = parts[parts.length - 2].trim();
    this.admissionNumber = admissionNumberLable;

    if (this.transactionModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
      this.getMemberBasicDetailsByAdmissionNumber(admissionNo);
    else if (this.transactionModel.memberTypeName == MemberShipTypesData.GROUP)
      this.getGroupDetailsByAdmissionNumber(admissionNo);
    else if (this.transactionModel.memberTypeName == MemberShipTypesData.INSTITUTION)
      this.getInstitutionDetailsByAdmissionNumber(admissionNo);
  }

  getMemberBasicDetailsByAdmissionNumber(admissionNumber: any) {
    this.cashManagementService.getMemberBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetails = this.responseModel.data[0];

          if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined)
            this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);

          this.admissionNumber = this.membershipBasicRequiredDetails.admissionNumber;
          this.memberType = this.membershipBasicRequiredDetails.memberTypeId;
          this.memberTypeName = this.membershipBasicRequiredDetails.memberTypeName;
        }
        if (this.cardTitle != null && this.cardTitle != undefined) {
          this.getAccountDetailsBasedOnCardTitle();
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.cashManagementService.getGroupDetailsByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
          if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
            this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

          if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
            this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

          this.memberType = this.memberGroupDetailsModel.memberTypeId;
          this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
          if (this.cardTitle != null && this.cardTitle != undefined) {
            this.getAccountDetailsBasedOnCardTitle();
          }
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.cashManagementService.getInstitutionDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];

          if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
            this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

          if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
            this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

          this.memberType = this.membershipInstitutionDetailsModel.memberTypeId;
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
          if (this.cardTitle != null && this.cardTitle != undefined) {
            this.getAccountDetailsBasedOnCardTitle();
          }
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }


  getAccountDetailsBasedOnCardTitle() {
    if (this.cardTitle != null && this.cardTitle != undefined) {
      if (this.cardTitle === CardTitles.MEMBER_SHARES) {
        // this.getMemberSharesByAdmissionNumberAndMemberType();
      } else if (this.cardTitle === CardTitles.DEMAND_DEPOSITS) {
        this.getDemandDepositsByAdmissionNumberAndMemberType();
      } else if (this.cardTitle === CardTitles.DAILY_DEPOSITS) {
        // this.getDailyDepositsByAdmissionNumberAndMemberType();
      } else if (this.cardTitle === CardTitles.TERM_DEPOSITS) {
        // this.getTermDepositsByAdmissionNumberAndMemberType();
      } else if (this.cardTitle === CardTitles.LOANS) {
        // this.getLoansByAdmissionNumberAndMemberType();
      } else if (this.cardTitle === CardTitles.LOCKERS) {
        // this.getLockersByAdmissionNumberAndMemberType();
      } else if (this.cardTitle === CardTitles.AGENTS) {
        // this.getAgentsByAdmissionNumberAndMemberType();
      }
    }
  }

  onAmountChange() {
    if (this.transactionModel.transactionAmount !== null && this.transactionModel.transactionAmount >= 0 && this.transactionModel.transactionAmount != "")
      this.transactionModel.amountInWords = this.commonFunctionsService.convertToWords(this.transactionModel.transactionAmount);
    else
      this.transactionModel.amountInWords = '';
  }

  navigateToBack() {
    // this.router.navigate([CashCountertransactionconstant.CASH_TRANSACTIONS]);
    this.router.navigate([CashCountertransactionconstant.CASH_TRANSACTIONS], { queryParams: { cardTitle: this.encryptDecryptService.encrypt(this.cardTitle) } });
  }

  addOrUpdateDemandDepositTransaction() {
    this.commonComponent.startSpinner();
    this.transactionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    // this.transactionModel.isInternalTransaction = "No";

    if (this.transactionModel.transactionDateVal != null && this.transactionModel.transactionDateVal != undefined)
      this.transactionModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.transactionModel.transactionDateVal));
    if (this.isEdit) {
      this.cashManagementService.updateTransaction(this.transactionModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          // this.buttonDisabled = applicationConstants.FALSE;
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        // this.buttonDisabled = applicationConstants.FALSE;
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
    } else {
      this.cashManagementService.addTransaction(this.transactionModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          this.commonComponent.stopSpinner();
          // this.buttonDisabled = applicationConstants.FALSE;
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        // this.buttonDisabled = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
        // this.buttonDisabled = applicationConstants.FALSE;
      });
    }
  }


  getDemandDepositsByAdmissionNumberAndMemberType() {
    this.cashManagementService.getDemandDepositsByAdmissionNumberAndMemberType(this.admissionNumber, this.memberType).subscribe((data: any) => {
      this.responseModel = data;
      this.accountNumbersList = [];
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.demadDeposistAccountsList = this.responseModel.data;

          this.demadDeposistAccountsList = this.responseModel.data.map((demandDepositAccount: any) => {
            if (demandDepositAccount != null && demandDepositAccount != undefined && demandDepositAccount.accountOpenDate != null && demandDepositAccount.accountOpenDate != undefined)
              demandDepositAccount.accountOpeningDateVal = this.datePipe.transform(demandDepositAccount.accountOpenDate, this.orgnizationSetting.datePipe);

            // Push accountNumber to the list (after clearing it above)
            this.accountNumbersList.push(demandDepositAccount.accountNumber);

            return demandDepositAccount;
          });

        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  // onNoteDenominationChange(rowData: { noteAmount: number; name: number; noteCount: number; }) {
  //   // Check if the values are valid numbers
  //   const noteValue = isNaN(rowData.name) || rowData.name === null || rowData.name === undefined ? 0 : rowData.name;
  //   const noteCount = isNaN(rowData.noteCount) || rowData.noteCount === null || rowData.noteCount === undefined ? 0 : rowData.noteCount;

  //   // Update note amount
  //   rowData.noteAmount = noteValue * noteCount;

  //   // Update total amount
  //   this.totalNotesAmount = this.denominationList.reduce((sum, obj) => {
  //     if (obj.noteAmount) {
  //       return sum + obj.noteAmount; // Accumulate note amounts
  //     }
  //     return sum;
  //   }, 0);

  //   this.calculateTotalAmount();
  // }

  // onCoinDenominationChange(rowData: { coinAmount: number; name: number; coinCount: number; }) {
  //   // Check if the values are valid numbers
  //   const coinValue = isNaN(rowData.name) || rowData.name === null || rowData.name === undefined ? 0 : rowData.name;
  //   const coinCount = isNaN(rowData.coinCount) || rowData.coinCount === null || rowData.coinCount === undefined ? 0 : rowData.coinCount;

  //   // Update coin amount
  //   rowData.coinAmount = coinValue * coinCount;

  //   // Update total amount
  //   this.totalCoinsAmount = this.denominationList.reduce((sum, obj) => {
  //     if (obj.coinAmount) {
  //       return sum + obj.coinAmount; // Accumulate coin amounts
  //     }
  //     return sum;
  //   }, 0);

  //   this.calculateTotalAmount();
  // }

  // calculateTotalAmount() {
  //   this.totalAmount = this.totalNotesAmount + this.totalCoinsAmount;
  //   this.totalAmountInWords = '';

  //   if (this.totalAmount !== null && !isNaN(this.totalAmount) && this.totalAmount >= 0) {
  //     this.totalAmountInWords = this.commonFunctionsService.convertToWords(this.totalAmount);
  //   }
  // }

  // Method to check if transactionAmount matches the totalAmount
  checkIfAmountsMatch() {
    if (this.transactionModel.transactionAmount === this.totalAmount) {
      this.isTotalAmountMatched = true;
    } else {
      this.isTotalAmountMatched = false;
    }
  }

  // Update the method to handle denomination change and check for amount match
  onNoteDenominationChange(rowData: { noteAmount: number; name: number; noteCount: number; }) {
    const noteValue = isNaN(rowData.name) || rowData.name === null || rowData.name === undefined ? 0 : rowData.name;
    const noteCount = isNaN(rowData.noteCount) || rowData.noteCount === null || rowData.noteCount === undefined ? 0 : rowData.noteCount;

    rowData.noteAmount = noteValue * noteCount;

    this.totalNotesAmount = this.denominationList.reduce((sum, obj) => {
      if (obj.noteAmount) {
        return sum + obj.noteAmount;
      }
      return sum;
    }, 0);

    this.calculateTotalAmount();
    this.checkIfAmountsMatch(); // Call to check if amounts match after calculation
  }

  onCoinDenominationChange(rowData: { coinAmount: number; name: number; coinCount: number; }) {
    const coinValue = isNaN(rowData.name) || rowData.name === null || rowData.name === undefined ? 0 : rowData.name;
    const coinCount = isNaN(rowData.coinCount) || rowData.coinCount === null || rowData.coinCount === undefined ? 0 : rowData.coinCount;

    rowData.coinAmount = coinValue * coinCount;

    this.totalCoinsAmount = this.denominationList.reduce((sum, obj) => {
      if (obj.coinAmount) {
        return sum + obj.coinAmount;
      }
      return sum;
    }, 0);

    this.calculateTotalAmount();
    this.checkIfAmountsMatch(); // Call to check if amounts match after calculation
  }

  calculateTotalAmount() {
    this.totalAmount = this.totalNotesAmount + this.totalCoinsAmount;
    this.totalAmountInWords = '';

    if (this.totalAmount !== null && !isNaN(this.totalAmount) && this.totalAmount >= 0) {
      this.totalAmountInWords = this.commonFunctionsService.convertToWords(this.totalAmount);
    }
  }

}
