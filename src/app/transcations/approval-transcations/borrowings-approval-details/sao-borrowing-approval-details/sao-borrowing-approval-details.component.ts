import { Component } from '@angular/core';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';
import { BorrowingTransactionConstant } from 'src/app/transcations/borrowing-transaction/borrowing-transaction-constants';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { MenuItem, SelectItem } from 'primeng/api';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { SaoAccountDetailsService } from 'src/app/transcations/borrowing-transaction/sao-borrowing/sao-borrowing-stepper/sao-account-details/shared/sao-account-details.service';

@Component({
  selector: 'app-sao-borrowing-approval-details',
  templateUrl: './sao-borrowing-approval-details.component.html',
  styleUrls: ['./sao-borrowing-approval-details.component.css']
})
export class SaoBorrowingApprovalDetailsComponent {
  saoborrowings: any[] = [];
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
    private saoAccountDetailsService : SaoAccountDetailsService,
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
    this.saoborrowings = [
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
   this.saoAccountDetailsService.getBorrowingAccountsListByPacsIdAndBranchId(this.pacsId,this.branchId).subscribe((data: any) => {
    this.responseModel = data;
    this.gridListData = this.responseModel.data;
    this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.accountStatusName != CommonStatusData.IN_PROGRESS &&
      obj.accountStatusName != CommonStatusData.CREATED).map((saoborrowing: any) => {

        if (saoborrowing.applicationDate != null && saoborrowing.applicationDate != undefined) {
          saoborrowing.applicationDate = this.datePipe.transform(saoborrowing.applicationDate, this.orgnizationSetting.datePipe);
        }
        if (saoborrowing.sanctionedDate != null && saoborrowing.sanctionedDate != undefined) {
          saoborrowing.sanctionedDate = this.datePipe.transform(saoborrowing.sanctionedDate, this.orgnizationSetting.datePipe);
        }
        //defaualt values as false
        saoborrowing.isSubmissionForApproval = false;
        saoborrowing.isApproved = false;
        saoborrowing.isRejected = false;
        saoborrowing.isRequestForResubmission = false;
        saoborrowing.viewButton = false;

        if (saoborrowing.accountStatusName === CommonStatusData.SUBMISSION_FOR_APPROVAL) {
          saoborrowing.isSubmissionForApproval = true;
          saoborrowing.isApproved = true;
        } else if (saoborrowing.accountStatusName === CommonStatusData.APPROVED) {
          saoborrowing.isApproved = true;
          saoborrowing.viewButton = true;
        } else if (saoborrowing.accountStatusName === CommonStatusData.REJECTED) {
          saoborrowing.isRejected = true;
          saoborrowing.viewButton = true;
        } else if (saoborrowing.accountStatusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
          saoborrowing.isRequestForResubmission = true;
          saoborrowing.viewButton = true;
        }
        return saoborrowing
      });
    this.activeStatusCount = this.gridListData.filter(saoAccountApplication => saoAccountApplication.status != null && saoAccountApplication.status != undefined && saoAccountApplication.status === applicationConstants.ACTIVE).length;
    this.inactiveStatusCount = this.gridListData.filter(saoAccountApplication => saoAccountApplication.status != null && saoAccountApplication.status != undefined && saoAccountApplication.status === applicationConstants.IN_ACTIVE).length;
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
    this.router.navigate([BorrowingTransactionConstant.SAO_VIEW_BORROWING], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([approvaltransactionsconstant.SAO_BORROWING_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbtn: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
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
