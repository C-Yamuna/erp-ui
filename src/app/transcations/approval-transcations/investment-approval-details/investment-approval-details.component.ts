import { Component } from '@angular/core';
import { InvestmentApplicationDetailsService } from '../../investments-transaction/deposit-investments/investments-application-details/shared/investment-application-details.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InvestmentsTransactionConstant } from '../../investments-transaction/investments-transaction-constants';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from '../../common-status-data.json';

@Component({
  selector: 'app-investment-approval-details',
  templateUrl: './investment-approval-details.component.html',
  styleUrls: ['./investment-approval-details.component.css']
})
export class InvestmentApprovalDetailsComponent {

  orgnizationSetting: any;
  columns: any[] = [];
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  msgs: any[] = [];
  pacsId: any;
  branchId: any;
  showForm: boolean = false;
  operations: any;
  investmentOperationsList: any[] = [];
  sharesOperationsList: any[] = [];
  constructor(private router: Router,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private investmentApplicationDetailsService: InvestmentApplicationDetailsService) {

      this.columns = [
        { field: 'accountNumber', header: 'INVESTMENTS_TRANSACTIONS.ACCOUNT_NUMBER_SHARES_CERTIFICATE_NO' },
        { field: 'productName', header: 'INVESTMENTS_TRANSACTIONS.PRODUCT' },
        { field: 'bankName', header: 'INVESTMENTS_TRANSACTIONS.BANK_NAME' },
        { field: 'depositName', header: 'INVESTMENTS_TRANSACTIONS.DEPOSIT_TYPE' },
        { field: 'depositAmount', header: 'INVESTMENTS_TRANSACTIONS.DEPOSIT_AMOUNT_EACH_SHARE_AMOUNT' },
        { field: 'roi', header: 'INVESTMENTS_TRANSACTIONS.ROI' },
        { field: 'depositDate', header: 'INVESTMENTS_TRANSACTIONS.DEPOSIT_DATE_PURCHASE_DATE' },
        { field: 'statusName', header: 'INVESTMENTS_TRANSACTIONS.STATUS' },
      ];

      // this.investmentOperationsList = [
      //   { label: "Interest Received", value: 1 },
      //   { label: "Foreclosure", value: 2 },
      //   { label: "Closure", value: 3 }
      // ];
  
      // this.sharesOperationsList = [
      //   { label: "Share Withdraw", value: 1 }
      // ];
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.pacsId = 1;
    this.branchId = 1;
    this.getAll();
  }

  getAll() {
    this.commonComponent.startSpinner();
    this.investmentApplicationDetailsService.getAllGrid(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.gridListData = this.responseModel.data;
        this.gridListData = this.responseModel.data.filter((data: any) => data.statusName == CommonStatusData.SUBMISSION_FOR_APPROVAL ||
          data.statusName == CommonStatusData.APPROVED ||  data.statusName == CommonStatusData.REJECTED || data.statusName == CommonStatusData.CLOSURE_REQUEST ||
          data.statusName == CommonStatusData.CLOSED ||  data.statusName == CommonStatusData.FORECLOSURE_REQUEST ).map((item: any) => {
            item.depositDate = this.datePipe.transform(item.depositDate, this.orgnizationSetting.datePipe);
            item.maturityDate = this.datePipe.transform(item.maturityDate, this.orgnizationSetting.datePipe);
            //defaualt values as false
          item.isSubmissionForApproval = false;
          item.isApproved = false;
          item.isRejected = false;
          item.isRequestForResubmission = false;
          item.isRequestForClosure = false;
          item.isRequestForForeClosure = false;
          item.isClosed = false;

          if (item.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
            item.isSubmissionForApproval = true;
          } else if (item.statusName === CommonStatusData.APPROVED) {
            item.isApproved = true;
          } else if (item.statusName === CommonStatusData.REJECTED) {
            item.isRejected = true;
          } else if (item.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
            item.isRequestForResubmission = true;
          } else if (item.statusName === CommonStatusData.FORECLOSURE_REQUEST) {
            item.isRequestForForeClosure = true;
          } else if (item.statusName === CommonStatusData.CLOSURE_REQUEST) {
            item.isRequestForClosure = true;
          } else if (item.statusName === CommonStatusData.CLOSED) {
            item.isClosed = true;
          }
            if(item.roi == null || item.roi == undefined)
              item.roi = "--"
            return item;
          });
        this.commonComponent.stopSpinner();
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

  navigateToView(rowData: any) {
    if (rowData.depositType != null && rowData.depositType != undefined) {
      this.router.navigate([InvestmentsTransactionConstant.DEPOSIT_INVESTMENT_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),view: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
    } else {
      this.router.navigate([InvestmentsTransactionConstant.SHARES_INVESTMENT_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),view: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
    }
  }

  navigateToApprove(rowData: any){
    if (rowData.depositType != null && rowData.depositType != undefined) {
      this.router.navigate([InvestmentsTransactionConstant.DEPOSIT_INVESTMENT_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),approve: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE)} });
    } else {
      this.router.navigate([InvestmentsTransactionConstant.SHARES_INVESTMENT_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),approve: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE) } });
    }
  }

  onChange() {
    this.showForm = !this.showForm;
  }
}
