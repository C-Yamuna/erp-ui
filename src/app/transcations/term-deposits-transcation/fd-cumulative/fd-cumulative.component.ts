import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem, MenuItem } from 'primeng/api';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { termdeposittransactionconstant } from '../term-deposit-transaction-constant';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { FdCummulativeAccountsService } from '../shared/fd-cummulative-accounts.service';
import { CommonStatusData } from '../../common-status-data.json';

@Component({
  selector: 'app-fd-cumulative',
  templateUrl: './fd-cumulative.component.html',
  styleUrls: ['./fd-cumulative.component.css']
})
export class FdCumulativeComponent implements OnInit {

  termdeposits: any[] = [];
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
  showForm: boolean = false;
  memberPhotoCopyZoom: any;
  memberphotCopyMultipartFileList: any[] = [];
  createdCount: any;
  submissionForApprovalCount: any;
  approvedCount: any;
  requestForResubmmissionCount: any;
  rejectCount: any;
  inProgressCount: any;

  constructor(private router: Router,
    private translate: TranslateService,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private fdCummulativeAccountsService: FdCummulativeAccountsService,
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
      // { label: "Interest Payment", value: 1 },
      // { label: "Closure", value: 3 },
      { label: "Foreclosure/Closure", value: 1 },
      { label: "Renewal", value: 2 },

    ]
    this.termdeposits = [
      { field: 'admissionNumber', header: 'Admision Number' },
      { field: 'accountNumber', header: 'Account Number' },
      { field: 'accountTypeName', header: 'Account Type' },
      { field: 'memberTypeName', header: 'TERMDEPOSITSTRANSACTION.MEMBER_TYPE' },
      { field: 'fdCummulativeProductName', header: 'Product Name' },
      { field: 'depositAmount', header: 'Deposit Amount' },
      { field: 'depositDate', header: 'Deposit Date' },
      { field: 'roi', header: 'ROI' },
      { field: 'statusName', header: 'status' },
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

    this.getAllFdCummulativeByBranchIdPacsId();
  }


  navigateToNewDepositer() {
    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, false);
    this.router.navigate([termdeposittransactionconstant.MEMBERSHIP_DETAIL], { queryParams: { falg: this.encryptDecryptService.encrypt(true) } });
  }
  navigateToOperations(event: any, rowData: any) {
    // if (event.value === 1)
    //   this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_INTEREST_PAYMENT]);
    // else if (event.value === 2)
    //   this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_FORE_CLOSURE]);
    // else if (event.value === 3)
    //   this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_CLOSURE]);
    // else if (event.value === 4)
    //   this.router.navigate([termdeposittransactionconstant.TERMDEPOSIT_RENEWAL]);
    if (event.value === 1)
      this.router.navigate([termdeposittransactionconstant.FD_CUMULATIVE_FORECLOSURE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) }, });
    else if (event.value === 2)
      this.router.navigate([termdeposittransactionconstant.FD_CUMULATIVE_RENEWAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) }, });
  }

  getAllFdCummulativeByBranchIdPacsId() {
    //  this.commonComponent.startSpinner();
    this.fdCummulativeAccountsService.getFdCummulativeAccountsByPacsIdBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      this.gridListLenght = this.gridListData.length;
      this.gridListData = this.gridListData.map(fd => {
        if (fd.depositDate != null && fd.depositDate != undefined) {
          fd.depositDate = this.datePipe.transform(fd.depositDate, this.orgnizationSetting.datePipe);
        }
        // this.createdCount = this.gridListData.filter(fd => fd.statusName === CommonStatusData.CREATED).length;
        this.inProgressCount = this.gridListData.filter(fd => fd.statusName === CommonStatusData.IN_PROGRESS).length;        
        this.submissionForApprovalCount = this.gridListData.filter(fd => fd.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL).length;
        this.approvedCount = this.gridListData.filter(fd => fd.statusName === CommonStatusData.APPROVED).length;
        this.requestForResubmmissionCount = this.gridListData.filter(fd => fd.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION).length;
        this.rejectCount = this.gridListData.filter(fd => fd.statusName === CommonStatusData.REJECTED).length;
        return fd;
      });
      this.tempGridListData = this.gridListData;
      //  this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      // this.commonComponent.stopSpinner();
    });
  }

  editAccount(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.FD_CUMMULATIVE_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  view(rowData: any) {
    let viewScreen = true;
    this.router.navigate([termdeposittransactionconstant.FD_CUMMULATIVE_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), view: this.encryptDecryptService.encrypt(viewScreen), editbutton: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
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