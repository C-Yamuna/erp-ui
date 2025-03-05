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
import { TRANSACTION_TYPES, CommonStatusData, CardTitles } from "../../common-status-data.json";
import { CashCountertransactionconstant } from "../cash-counter-transaction-constant";
import { CashManagement } from "./shared/cash-management.model";
import { CashManagementService } from "./shared/cash-management.service";

@Component({
  selector: 'app-cash-management',
  templateUrl: './cash-management.component.html',
  styleUrls: ['./cash-management.component.css']
})
export class CashManagementComponent implements OnInit {

  orgnizationSetting: any;
  responseModel!: Responsemodel;

  memberShareCashManagementModel: CashManagement = new CashManagement();
  demandDepositCashManagementModel: CashManagement = new CashManagement();
  dailyDepositCashManagementModel: CashManagement = new CashManagement();
  termDepositCashManagementModel: CashManagement = new CashManagement();
  loanCashManagementModel: CashManagement = new CashManagement();
  agentCashManagementModel: CashManagement = new CashManagement();
  lockerCashManagementModel: CashManagement = new CashManagement();

  pacsId: any;
  branchId: any;
  msgs: any[] = [];

  memberSahreTransactionsList: any[] = [];
  demandDepositTransactionsList: any[] = [];
  dailyDepositTransactionsList: any[] = [];
  termDepositTransactionsList: any[] = [];
  loanTransactionsList: any[] = [];
  agentTransactionsList: any[] = [];
  lockerTransactionsList: any[] = [];

  cardsList: any[] = [];
  cardTitle: any;

  constructor(private translate: TranslateService,
    private router: Router,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private commonFunctionsService: CommonFunctionsService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
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

    this.getAllDemandDepositTransactions();
    // this.getAllDailyDepositTransactions();
    // this.getAllTermDepositTransactions();
    // this.getAllLoanTransactions();
  }

  // Demand Deposit Transactions
  getAllDemandDepositTransactions() {
    this.cashManagementService.getAllDemandDepositTransactions().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.demandDepositTransactionsList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.demandDepositTransactionsList = this.responseModel.data.map((transaction: any) => {
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

          this.demandDepositCashManagementModel.cardTitle = CardTitles.DEMAND_DEPOSITS;
          this.demandDepositCashManagementModel.totalReceiptAmount = totalReceiptAmount;
          this.demandDepositCashManagementModel.totalPaymentAmount = totalPaymentAmount;
          this.demandDepositCashManagementModel.totalAmount = totalAmount;
          this.demandDepositCashManagementModel.noOfPendingTransactions = noOfPendingTransactions;
          this.demandDepositCashManagementModel.noOfCompletedTransactions = noOfCompletedTransactions;
          this.demandDepositCashManagementModel.totalTransactions = totalTransactions;

          this.cardsList.push(this.demandDepositCashManagementModel);
        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.getAllDailyDepositTransactions();
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
          this.dailyDepositTransactionsList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.dailyDepositTransactionsList = this.responseModel.data.map((transaction: any) => {
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

          this.dailyDepositCashManagementModel.cardTitle = CardTitles.DAILY_DEPOSITS;
          this.dailyDepositCashManagementModel.totalReceiptAmount = totalReceiptAmount;
          this.dailyDepositCashManagementModel.totalPaymentAmount = totalPaymentAmount;
          this.dailyDepositCashManagementModel.totalAmount = totalAmount;
          this.dailyDepositCashManagementModel.noOfPendingTransactions = noOfPendingTransactions;
          this.dailyDepositCashManagementModel.noOfCompletedTransactions = noOfCompletedTransactions;
          this.dailyDepositCashManagementModel.totalTransactions = totalTransactions;

          this.cardsList.push(this.dailyDepositCashManagementModel);
        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.getAllTermDepositTransactions();
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
          this.termDepositTransactionsList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.termDepositTransactionsList = this.responseModel.data.map((transaction: any) => {
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

          this.termDepositCashManagementModel.cardTitle = CardTitles.TERM_DEPOSITS;
          this.termDepositCashManagementModel.totalReceiptAmount = totalReceiptAmount;
          this.termDepositCashManagementModel.totalPaymentAmount = totalPaymentAmount;
          this.termDepositCashManagementModel.totalAmount = totalAmount;
          this.termDepositCashManagementModel.noOfPendingTransactions = noOfPendingTransactions;
          this.termDepositCashManagementModel.noOfCompletedTransactions = noOfCompletedTransactions;
          this.termDepositCashManagementModel.totalTransactions = totalTransactions;

          this.cardsList.push(this.termDepositCashManagementModel);
        } else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.getAllLoanTransactions();
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
          this.loanTransactionsList = this.responseModel.data;

          let totalPaymentAmount = 0;
          let totalReceiptAmount = 0;
          let totalAmount = 0;
          let noOfPendingTransactions = 0;
          let noOfCompletedTransactions = 0;
          let totalTransactions = 0;

          this.loanTransactionsList = this.responseModel.data.map((transaction: any) => {
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

          this.loanCashManagementModel.cardTitle = CardTitles.LOANS;
          this.loanCashManagementModel.totalReceiptAmount = totalReceiptAmount;
          this.loanCashManagementModel.totalPaymentAmount = totalPaymentAmount;
          this.loanCashManagementModel.totalAmount = totalAmount;
          this.loanCashManagementModel.noOfPendingTransactions = noOfPendingTransactions;
          this.loanCashManagementModel.noOfCompletedTransactions = noOfCompletedTransactions;
          this.loanCashManagementModel.totalTransactions = totalTransactions;

          this.cardsList.push(this.loanCashManagementModel);
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
  // Method to handle card click event
  onCardClick(card: any): void {
    this.router.navigate([CashCountertransactionconstant.CASH_TRANSACTIONS], { queryParams: { cardTitle: this.encryptDecryptService.encrypt(card.cardTitle) } });
  }

}
