import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DailyDepositsAccountsService } from './shared/daily-deposits-accounts.service';
import { DailyDepositTransactionConstants } from './daily-deposits-transaction-constants';
import { CommonStatusData } from '../common-status-data.json';

@Component({
  selector: 'app-daily-deposits-transaction',
  templateUrl: './daily-deposits-transaction.component.html',
  styleUrls: ['./daily-deposits-transaction.component.css']
})
export class DailyDepositsTransactionComponent {
  dailydeposits: any[] = [];
  statuses!: SelectItem[];
  operations: any;
  operationslist: any;
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
  memberphotCopyMultipartFileList: any[] = [];
  memberPhotoCopyZoom: any;
  createdCount: any;
  submissionForApprovalCount: any;
  approvedCount: any;
  requestForResubmmissionCount: any; 
  rejectCount: any;

  constructor(private router: Router, private translate: TranslateService,
    private commonComponent: CommonComponent, private encryptDecryptService:
    EncryptDecryptService, private commonFunctionsService: CommonFunctionsService,
    private dailyDepositsAccountsService:DailyDepositsAccountsService) {

  }
  ngOnInit(): void {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });

    this.operationslist = [
      { label: "Closure/Foreclosure", value: 1},
      { label: "Renewal", value: 2},

    ]

    this.dailydeposits = [
      { field: 'adminssionNumber', header: 'ERP.ADMINSSION_NUMBER' },
      { field: 'accountNumber', header: 'ERP.ACCOUNT_NUMBER' },
      { field: 'accountTypeName', header: 'ERP.ACCOUNT_TYPE' },
      { field: 'memberTypeName', header: 'ERP.MEMBER_TYPE' },
      { field: 'productName', header: 'ERP.PRODUCT_NAME' },
      { field: 'statusName', header: 'ERP.STATUS' },
    ];

    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.getGridListData();
  }

  getGridListData() {
    this.branchId=1;
    this.pacsId=1;
    this.commonComponent.startSpinner();
    //  this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.dailyDepositsAccountsService.getAccountsByPacsAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.gridListData = this.responseModel.data;
        this.gridListData = this.gridListData.map(membership => {
        this.createdCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.IN_PROGRESS).length;
            this.submissionForApprovalCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL).length;
            this.approvedCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.APPROVED).length;
            this.requestForResubmmissionCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION).length;
            this.rejectCount = this.gridListData.filter(membership => membership.statusName === CommonStatusData.REJECTED).length;

          return membership
        });
      } else {
        this.msgs = [];
        this.msgs = [{ severity: "error", summary: 'Failed', detail: this.responseModel.statusMsg }];
        this.commonComponent.stopSpinner();
      }
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }

  addNewDeposit() {
    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, false);
    this.router.navigate([DailyDepositTransactionConstants.MEMBERSHIP_BASIC_DETAILS]);
  }
  editDepositDetails(rowData: any){
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_VIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),editbutton: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  viewDepositDetails(rowData: any) {
    let viewScreen = true;
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_VIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),view: this.encryptDecryptService.encrypt(viewScreen), editbutton: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) }});
   }
  onChange(){
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
  navigateToOperations(event: any, accId:any) {
    if (event.value === 1)
      this.router.navigate([DailyDepositTransactionConstants.FORECLOSURE], { queryParams: { id: this.encryptDecryptService.encrypt(accId) } });
    // else if (event.value === 2)
    // this.router.navigate([DailyDepositTransactionConstants.CLOSURE], { queryParams: { id: this.encryptDecryptService.encrypt(accId) } });
    else if (event.value === 2)
      this.router.navigate([DailyDepositTransactionConstants.RENEWAL], { queryParams: { id: this.encryptDecryptService.encrypt(accId) } });
  }
  transaction(rowData : any){
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_TRANSACTIONS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id)}});
  }
}
