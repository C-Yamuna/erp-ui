import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FdNonCummulativeAccountsService } from 'src/app/transcations/term-deposits-transcation/shared/fd-non-cummulative-accounts.service';
import { termdeposittransactionconstant } from 'src/app/transcations/term-deposits-transcation/term-deposit-transaction-constant';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';

@Component({
  selector: 'app-fd-non-cummulative-approval-details',
  templateUrl: './fd-non-cummulative-approval-details.component.html',
  styleUrls: ['./fd-non-cummulative-approval-details.component.css']
})
export class FdNonCummulativeApprovalDetailsComponent {
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
  showForm: boolean=false;
  memberPhotoCopyZoom: boolean =false;
  memberphotCopyMultipartFileList: any[] = [];
  submissionForApprovalCount: any;
  approvedCount: any;
  requestForResubmmissionCount: any;
  rejectCount: any;
  
  constructor(private router: Router,
    private translate: TranslateService,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService :FileUploadService,
    private fdNonCummulativeAccountsService: FdNonCummulativeAccountsService,
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
      { label: "Interest Payment", value: 1 },
      { label: "Foreclosure", value: 2 },
      { label: "Closure", value: 3 },
      { label: "Renewal", value: 4 },

    ]
    this.termdeposits = [
      { field: 'admissionNumber', header: 'Admision Number' },
      { field: 'accountNumber', header: 'Account Number' },
      { field: 'accountTypeName', header: 'Account Type' },
      { field: 'memberTypeName', header: 'TERMDEPOSITSTRANSACTION.MEMBER_TYPE' },
      { field: 'fdNonCummulativeProductName', header: 'Product Name' },
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
    this.getAllFdNonCummulativeByBranchIdPacsId();
  }

  getAllFdNonCummulativeByBranchIdPacsId() {
    //  this.commonComponent.startSpinner();
    this.fdNonCummulativeAccountsService.getFdNonCummulativeByBranchIdPacsId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
       this.gridListData = this.responseModel.data;
       this.gridListData = this.gridListData.filter((obj: any) => obj != null && obj.statusName != CommonStatusData.IN_PROGRESS &&
       obj.statusName != CommonStatusData.CREATED).map((fdNonCummulative: any) => {

         if (fdNonCummulative.depositDate != null && fdNonCummulative.depositDate != undefined) {
           fdNonCummulative.depositDate = this.datePipe.transform(fdNonCummulative.depositDate,this.orgnizationSetting.datePipe);
         }
         if (fdNonCummulative.photoPath != null && fdNonCummulative.photoPath != undefined) {
           fdNonCummulative.multipartFileListForPhotoCopy = this.fileUploadService.getFile(fdNonCummulative.photoPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + fdNonCummulative.photoPath);
         }
         if (fdNonCummulative.statusName == CommonStatusData.APPROVED || fdNonCummulative.statusName == CommonStatusData.REQUEST_FOR_RESUBMISSION
            || fdNonCummulative.statusName == CommonStatusData.REJECTED ) {
           fdNonCummulative.viewButton = true; 
         } else {
           fdNonCummulative.viewButton = false;
         }
         this.submissionForApprovalCount = this.gridListData.filter(fdNonCummulative => fdNonCummulative.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL).length;
         this.approvedCount = this.gridListData.filter(fdNonCummulative => fdNonCummulative.statusName === CommonStatusData.APPROVED).length;
         this.requestForResubmmissionCount = this.gridListData.filter(fdNonCummulative => fdNonCummulative.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION).length;
         this.rejectCount = this.gridListData.filter(fdNonCummulative => fdNonCummulative.statusName === CommonStatusData.REJECTED).length;
         return fdNonCummulative 
       });
      //  this.activeStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.ACTIVE).length;
      //  this.inactiveStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status != null && fdAccountApplication.status != undefined && fdAccountApplication.status === applicationConstants.IN_ACTIVE).length;
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
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(0), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }
  approve(rowData: any) {
    this.router.navigate([approvaltransactionsconstant.FD_NON_CUMMULATIVE_APPROVAL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
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
