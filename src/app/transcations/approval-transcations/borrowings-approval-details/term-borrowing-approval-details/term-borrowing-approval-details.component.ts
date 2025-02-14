import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { BorrowingTransactionConstant } from 'src/app/transcations/borrowing-transaction/borrowing-transaction-constants';
import { TermAccountDetailsService } from 'src/app/transcations/borrowing-transaction/term-borrowing/term-borrowing-stepper/term-account-details/shared/term-account-details.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MenuItem, SelectItem } from 'primeng/api';
import { Responsemodel } from 'src/app/shared/responsemodel';

@Component({
  selector: 'app-term-borrowing-approval-details',
  templateUrl: './term-borrowing-approval-details.component.html',
  styleUrls: ['./term-borrowing-approval-details.component.css']
})
export class TermBorrowingApprovalDetailsComponent {
  termborrowings: any[] = [];
  statuses!: SelectItem[];
  operations: any;
  operationslist: any;
  termdepositlist: any;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  newdepositer: any;
  pacsId: Number = 1;
  branchId: Number = 1;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  msgs: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  orgnizationSetting: any;
  gridListLenght: Number | undefined;
  showForm: boolean=false;
  memberPhotoCopyZoom: boolean =false;
  memberphotCopyMultipartFileList: any[] = [];

  constructor(private router: Router,
    private translate: TranslateService,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService :FileUploadService,
    private termAccountDetailsService : TermAccountDetailsService,
    private datePipe: DatePipe) { }

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

    this.operationslist = [
      { label: "Disbursement", value: 1},
      { label: "Collection", value: 2 },
      { label: "Closure ", value: 3},
      { label: "Charges Collection ", value: 4 },

    ]
    this.termborrowings = [
      { field: 'accountNumber', header: 'BORROWINGSTRANSACTIONS.DCCB_BORROWING_ACCOUNT_NO' },
      { field: 'financiarBankTypeName', header: 'BORROWINGSTRANSACTIONS.FINANCIAL_BANK_TYPE' },
      { field: 'productName', header: 'BORROWINGSTRANSACTIONS.PRODUCT' },
      { field: 'applicationDate', header: 'BORROWINGSTRANSACTIONS.APPLICATION_DATE' },
      { field: 'sanctionedAmount',header:'BORROWINGSTRANSACTIONS.SANCTIONED_AMOUNT'},
      { field: 'sanctionedDate',header:'BORROWINGSTRANSACTIONS.SANCTIONED_DATE'},
      { field: 'roi', header: 'BORROWINGSTRANSACTIONS.ROI' },
      { field: 'accountStatusName', header: 'BORROWINGSTRANSACTIONS.STATUS' },
    ];

    let tabLabels = [
      'Total Accounts',
      'Total Deposit Amount',
      'Total Maturity Amount',
      'Cumulative Accounts',
      'Non-Cumulative Accounts',
      'Recurring Deposit Accounts',
      'Total Deposit Amount',
      'Forclosure Accounts',
      'Closure Accounts',
    ];
    this.items = tabLabels.map((label, index) => ({ label: label, value: `${index + 1}` }));
    //  tabLabels = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
    this.getAllBorrowingsAccountDetailsListByPacsIdAndBranchId();
  }

  getAllBorrowingsAccountDetailsListByPacsIdAndBranchId() {
    this.commonComponent.startSpinner();
   this.orgnizationSetting = this.commonComponent.orgnizationSettings();
   this.termAccountDetailsService.getBorrowingAccountsListByPacsIdAndBranchId(this.pacsId,this.branchId).subscribe((data: any) => {
    this.responseModel = data;
    this.gridListData = this.responseModel.data;
    this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.accountStatusName != CommonStatusData.IN_PROGRESS &&
      obj.accountStatusName != CommonStatusData.CREATED).map((termborrowing: any) => {

        if (termborrowing.applicationDate != null && termborrowing.applicationDate != undefined) {
          termborrowing.applicationDate = this.datePipe.transform(termborrowing.applicationDate, this.orgnizationSetting.datePipe);
        }
        if (termborrowing.sanctionedDate != null && termborrowing.sanctionedDate != undefined) {
          termborrowing.sanctionedDate = this.datePipe.transform(termborrowing.sanctionedDate, this.orgnizationSetting.datePipe);
        }
        //defaualt values as false
        termborrowing.isSubmissionForApproval = false;
        termborrowing.isApproved = false;
        termborrowing.isRejected = false;
        termborrowing.isRequestForResubmission = false;
        termborrowing.viewButton = false;

        if (termborrowing.accountStatusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
          termborrowing.isSubmissionForApproval = true;
          termborrowing.isApproved = true;
        } else if (termborrowing.accountStatusName === CommonStatusData.APPROVED) {
          termborrowing.isApproved = true;
          termborrowing.viewButton = true;
        } else if (termborrowing.accountStatusName === CommonStatusData.REJECTED) {
          termborrowing.isRejected = true;
          termborrowing.viewButton = true;
        } else if (termborrowing.accountStatusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
          termborrowing.isRequestForResubmission = true;
          termborrowing.viewButton = true;
        }
        return termborrowing
      });
    this.activeStatusCount = this.gridListData.filter(termAccountApplication => termAccountApplication.status != null && termAccountApplication.status != undefined && termAccountApplication.status === applicationConstants.ACTIVE).length;
    this.inactiveStatusCount = this.gridListData.filter(termAccountApplication => termAccountApplication.status != null && termAccountApplication.status != undefined && termAccountApplication.status === applicationConstants.IN_ACTIVE).length;
    this.gridListLenght = this.gridListData.length;
    this.tempGridListData = this.gridListData;
    this.commonComponent.stopSpinner();
 }, error => {
   this.msgs = [];
   this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
   // this.commonComponent.stopSpinner();
 });
 }

  view(rowData: any) {
    this.router.navigate([BorrowingTransactionConstant.TERM_VIEW_BORROWING], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([approvaltransactionsconstant.TERM_BORROWING_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  onChange(){
    this.showForm = !this.showForm;
  }
  onClickMemberPhotoCopy(rowData : any){
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = rowData.multipartFileListForPhotoCopy ;
  }
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }
}
