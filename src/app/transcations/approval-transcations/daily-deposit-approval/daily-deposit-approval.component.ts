import { Component } from '@angular/core';
import { DailyDepositTransactionConstants } from '../../daily-deposits-transaction/daily-deposits-transaction-constants';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { approvaltransactionsconstant } from '../approval-transactions-constant';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem, MenuItem } from 'primeng/api';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from '../../common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { DailyDepositsAccountsService } from '../../daily-deposits-transaction/shared/daily-deposits-accounts.service';

@Component({
  selector: 'app-daily-deposit-approval',
  templateUrl: './daily-deposit-approval.component.html',
  styleUrls: ['./daily-deposit-approval.component.css']
})
export class DailyDepositApprovalComponent {
  dailydeposits: any[] = [];
  statuses!: SelectItem[];
  operations: any;
  operationslist: any;
  termdepositlist: any;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  newdepositer: any;
  pacsId: any;
  branchId: any;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  msgs: any[] = [];
  orgnizationSetting: any;
  showForm: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  memberphotCopyMultipartFileList: any[] = [];
  tempGridListData: any[] = [];
  activeStatusCount: any;
  inactiveStatusCount: any;
  gridListLenght: Number | undefined;
  createdCount: any;
  submissionForApprovalCount: any;
  approvedCount: any;
  requestForResubmmissionCount: any;
  rejectCount: any;

  constructor(private router: Router, private translate: TranslateService,
    private commonComponent: CommonComponent, private encryptDecryptService:
      EncryptDecryptService, private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe, private fileUploadService: FileUploadService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService
  ) { }

  ngOnInit() {
    this.pacsId = 5;
    this.branchId = 12;
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
      { label: "Interest Payment", value: 1 },
      { label: "Foreclosure", value: 2 },
      { label: "Closure", value: 3 },
      { label: "Renewal", value: 4 },

    ]
    this.dailydeposits = [
      { field: 'adminssionNumber', header: 'ERP.ADMINSSION_NUMBER' },
      { field: 'accountNumber', header: 'ERP.ACCOUNT_NUMBER' },
      { field: 'accountTypeName', header: 'ERP.ACCOUNT_TYPE' },
      { field: 'memberTypeName', header: 'ERP.MEMBER_TYPE' },
      { field: 'productName', header: 'ERP.PRODUCT_NAME' },
      { field: 'roi', header: 'ERP.ROI' },
      { field: 'statusName', header: 'ERP.STATUS' },
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
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.getGridListData();
  }

  getGridListData() {
    this.commonComponent.startSpinner();
    //  this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.dailyDepositsAccountsService.getAccountsByPacsAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.statusName != CommonStatusData.IN_PROGRESS &&
        obj.statusName != CommonStatusData.CREATED).map((reccuringDeposit: any) => {

          if (reccuringDeposit.depositDate != null && reccuringDeposit.depositDate != undefined) {
            reccuringDeposit.depositDate = this.datePipe.transform(reccuringDeposit.depositDate, this.orgnizationSetting.datePipe);
          }
          if (reccuringDeposit.photoCopyPath != null && reccuringDeposit.photoCopyPath != undefined) {
            reccuringDeposit.multipartFileListForPhotoCopy = this.fileUploadService.getFile(reccuringDeposit.photoCopyPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + reccuringDeposit.photoCopyPath);
          }
          if (reccuringDeposit.statusName == CommonStatusData.APPROVED || reccuringDeposit.statusName == CommonStatusData.REQUEST_FOR_RESUBMISSION
            || reccuringDeposit.statusName == CommonStatusData.REJECTED) {
            reccuringDeposit.viewButton = true;
          } else {
            reccuringDeposit.viewButton = false;
          }
          return reccuringDeposit
        });
      this.activeStatusCount = this.gridListData.filter(AccountApplication => AccountApplication.status != null && AccountApplication.status != undefined && AccountApplication.status === applicationConstants.ACTIVE).length;
      this.inactiveStatusCount = this.gridListData.filter(AccountApplication => AccountApplication.status != null && AccountApplication.status != undefined && AccountApplication.status === applicationConstants.IN_ACTIVE).length;
      this.gridListLenght = this.gridListData.length;
      this.tempGridListData = this.gridListData;
      this.gridListData = this.gridListData.map(membership => {
        this.createdCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.IN_PROGRESS).length;
            this.submissionForApprovalCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL).length;
            this.approvedCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.APPROVED).length;
            this.requestForResubmmissionCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION).length;
            this.rejectCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.REJECTED).length;

          return membership
        });
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }

  view(rowData: any) {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_VIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([approvaltransactionsconstant.DAILY_DEPOSIT_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  onChange() {
    this.showForm = !this.showForm;
  }
  onClickMemberPhotoCopy(rowData: any) {
    this.memberPhotoCopyZoom = true;
    this.memberphotCopyMultipartFileList = [];
    this.memberphotCopyMultipartFileList = rowData.multipartFileListForPhotoCopy;
  }
  closePhoto() {
    this.memberPhotoCopyZoom = false;
  }
}
