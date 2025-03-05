import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { applicationConstants } from "src/app/shared/applicationConstants";
import { CommonComponent } from "src/app/shared/common.component";
import { CommonFunctionsService } from "src/app/shared/commonfunction.service";
import { EncryptDecryptService } from "src/app/shared/encrypt-decrypt.service";
import { Responsemodel } from "src/app/shared/responsemodel";
import { TRANSACTION_TYPES, CommonStatusData, CardTitles } from "src/app/transcations/common-status-data.json";
import { Loantransactionconstant } from "src/app/transcations/loan-transcation/loan-transaction-constant";
import { CashCountertransactionconstant } from "../../cash-counter-transaction-constant";
import { CashManagement } from "../shared/cash-management.model";
import { CashManagementService } from "../shared/cash-management.service";

@Component({
  selector: 'app-cash-transactions',
  templateUrl: './cash-transactions.component.html',
  styleUrls: ['./cash-transactions.component.css']
})
export class CashTransactionsComponent implements OnInit {

  orgnizationSetting: any;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  gridList: any[] = [];
  columns: any[] = [];
  pacsId: any;
  branchId: any;
  isEdit: any;

  createdCount: any;
  submissionForApprovalCount: any;
  approvedCount: any;
  requestForResubmmissionCount: any;
  rejectCount: any;
  cardTitle: any;

  cashManagementModel: CashManagement = new CashManagement();

  constructor(private translate: TranslateService,
    private router: Router,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private datePipe: DatePipe,
    private commonFunctionsService: CommonFunctionsService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private cashManagementService: CashManagementService) {
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
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

        if (this.cardTitle != null && this.cardTitle != undefined) {
          if (this.cardTitle === CardTitles.MEMBER_SHARES) {
            // this.getAllMemberShareTransactions();
          } else if (this.cardTitle === CardTitles.DEMAND_DEPOSITS) {
            this.getAllDemandDepositTransactions();
          } else if (this.cardTitle === CardTitles.DAILY_DEPOSITS) {
            this.getAllDailyDepositTransactions();
          } else if (this.cardTitle === CardTitles.TERM_DEPOSITS) {
            this.getAllTermDepositTransactions();
          } else if (this.cardTitle === CardTitles.LOANS) {
            this.getAllLoanTransactions();
          } else if (this.cardTitle === CardTitles.LOCKERS) {
            // this.getAllLockerTransactions();
          } else if (this.cardTitle === CardTitles.AGENTS) {
            // this.getAllAgentTransactions();
          }
        }
      } else {
        this.isEdit = false;
      }
    })

    this.columns = [
      { field: 'memberTypeName', header: 'ERP.MEMBER_TYPE' },
      { field: 'admissionNumber', header: 'ERP.ADMISSION_NUMBER' },
      { field: 'accountNumber', header: 'ERP.ACCOUNT_NUMBER' },
      { field: 'transactionTypeName', header: 'CASH_COUNTER_TRANSACTIONS.TRANSACTION_TYPE' },
      { field: 'transactionNumber', header: 'CASH_COUNTER_TRANSACTIONS.TRANSACTION_NUMBER' },
      { field: 'transactionDateVal', header: 'CASH_COUNTER_TRANSACTIONS.TRANSACTION_DATE' },
      { field: 'transactionAmount', header: 'CASH_COUNTER_TRANSACTIONS.TRANSACTION_AMOUNT' },
      { field: 'amountInWords', header: 'ERP.AMOUNT_IN_WORDS' },
      { field: 'statusName', header: 'ERP.STATUS' }
    ];

    this.createdCount = 0;
    this.submissionForApprovalCount = 0;
    this.approvedCount = 0;
    this.requestForResubmmissionCount = 0;
    this.rejectCount = 0;
  }

  // Demand Deposit Transactions
  getAllDemandDepositTransactions() {
    this.cashManagementService.getAllDemandDepositTransactions().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.gridList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.gridList = this.responseModel.data.map((transaction: any) => {
            if (transaction != null && transaction != undefined && transaction.transactionDate != null && transaction.transactionDate != undefined)
              transaction.transactionDateVal = this.datePipe.transform(transaction.transactionDate, this.orgnizationSetting.datePipe);

            if (transaction.transactionTypeName != null && transaction.transactionTypeName != undefined) {
              if (transaction.transactionTypeName === TRANSACTION_TYPES.WITHDRAW)
                totalPaymentAmount += transaction.transactionAmount;
              else if (transaction.transactionTypeName === TRANSACTION_TYPES.DEPOSIT)
                totalReceiptAmount += transaction.transactionAmount;
            }

            if (transaction.transactionAmount != null && transaction.transactionAmount != undefined) {
              if (transaction.statusName != null && transaction.statusName != undefined) {
                if (transaction.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL || transaction.statusName === CommonStatusData.IN_PROGRESS)
                  noOfPendingTransactions++;
                else if (transaction.statusName === CommonStatusData.APPROVED)
                  noOfCompletedTransactions++;
              }
            }

            totalAmount = totalPaymentAmount + totalReceiptAmount;
            totalTransactions = noOfPendingTransactions + noOfCompletedTransactions;

            return transaction;
          });

        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }


  // Daily Deposit Transactions
  getAllDailyDepositTransactions() {
    this.cashManagementService.getAllDailyDepositTransactions().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.gridList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.gridList = this.responseModel.data.map((transaction: any) => {
            if (transaction != null && transaction != undefined && transaction.transactionDate != null && transaction.transactionDate != undefined)
              transaction.transactionDateVal = this.datePipe.transform(transaction.transactionDate, this.orgnizationSetting.datePipe);

            if (transaction.transactionTypeName != null && transaction.transactionTypeName != undefined) {
              if (transaction.transactionTypeName === TRANSACTION_TYPES.WITHDRAW)
                totalPaymentAmount += transaction.transactionAmount;
              else if (transaction.transactionTypeName === TRANSACTION_TYPES.DEPOSIT)
                totalReceiptAmount += transaction.transactionAmount;
            }

            if (transaction.transactionAmount != null && transaction.transactionAmount != undefined) {
              if (transaction.statusName != null && transaction.statusName != undefined) {
                if (transaction.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL || transaction.statusName === CommonStatusData.IN_PROGRESS)
                  noOfPendingTransactions++;
                else if (transaction.statusName === CommonStatusData.APPROVED)
                  noOfCompletedTransactions++;
              }
            }

            totalAmount = totalPaymentAmount + totalReceiptAmount;
            totalTransactions = noOfPendingTransactions + noOfCompletedTransactions;

            return transaction;
          });

        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  // Term Deposit Transactions
  getAllTermDepositTransactions() {
    this.cashManagementService.getAllTermDepositTransactions().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.gridList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.gridList = this.responseModel.data.map((transaction: any) => {
            if (transaction != null && transaction != undefined && transaction.transactionDate != null && transaction.transactionDate != undefined)
              transaction.transactionDateVal = this.datePipe.transform(transaction.transactionDate, this.orgnizationSetting.datePipe);

            if (transaction.transactionTypeName != null && transaction.transactionTypeName != undefined) {
              if (transaction.transactionTypeName === TRANSACTION_TYPES.WITHDRAW)
                totalPaymentAmount += transaction.transactionAmount;
              else if (transaction.transactionTypeName === TRANSACTION_TYPES.DEPOSIT)
                totalReceiptAmount += transaction.transactionAmount;
            }

            if (transaction.transactionAmount != null && transaction.transactionAmount != undefined) {
              if (transaction.statusName != null && transaction.statusName != undefined) {
                if (transaction.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL || transaction.statusName === CommonStatusData.IN_PROGRESS)
                  noOfPendingTransactions++;
                else if (transaction.statusName === CommonStatusData.APPROVED)
                  noOfCompletedTransactions++;
              }
            }

            totalAmount = totalPaymentAmount + totalReceiptAmount;
            totalTransactions = noOfPendingTransactions + noOfCompletedTransactions;

            return transaction;
          });

        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  // Loan Transactions
  getAllLoanTransactions() {
    this.cashManagementService.getAllLoanTransactions().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.gridList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.gridList = this.responseModel.data.map((transaction: any) => {
            if (transaction != null && transaction != undefined && transaction.transactionDate != null && transaction.transactionDate != undefined)
              transaction.transactionDateVal = this.datePipe.transform(transaction.transactionDate, this.orgnizationSetting.datePipe);

            if (transaction.transactionTypeName != null && transaction.transactionTypeName != undefined) {
              if (transaction.transactionTypeName === TRANSACTION_TYPES.WITHDRAW)
                totalPaymentAmount += transaction.transactionAmount;
              else if (transaction.transactionTypeName === TRANSACTION_TYPES.DEPOSIT)
                totalReceiptAmount += transaction.transactionAmount;
            }

            if (transaction.transactionAmount != null && transaction.transactionAmount != undefined) {
              if (transaction.statusName != null && transaction.statusName != undefined) {
                if (transaction.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL || transaction.statusName === CommonStatusData.IN_PROGRESS)
                  noOfPendingTransactions++;
                else if (transaction.statusName === CommonStatusData.APPROVED)
                  noOfCompletedTransactions++;
              }
            }

            totalAmount = totalPaymentAmount + totalReceiptAmount;
            totalTransactions = noOfPendingTransactions + noOfCompletedTransactions;

            return transaction;
          });

        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  createTransactionDenomination() {
    this.router.navigate([CashCountertransactionconstant.CREATE_CASH_DENOMINATIONS], { queryParams: { cardTitle: this.encryptDecryptService.encrypt(this.cardTitle) } });
  }

  view(rowData: any) {
    this.router.navigate([Loantransactionconstant.VIEW_SIMPLE_INTEREST_LOAN], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  navigateToBack() {
    this.router.navigate([CashCountertransactionconstant.CASH_MANAGEMENT]);
  }

}
