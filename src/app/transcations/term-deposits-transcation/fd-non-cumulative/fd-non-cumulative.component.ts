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
import { FdNonCummulativeAccountsService } from '../shared/fd-non-cummulative-accounts.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fd-non-cumulative',
  templateUrl: './fd-non-cumulative.component.html',
  styleUrls: ['./fd-non-cumulative.component.css']
})
export class FdNonCumulativeComponent implements OnInit {

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
  memberPhotoCopyZoom: any;
  memberphotCopyMultipartFileList: any[] = [];

  constructor(private router: Router,
    private translate: TranslateService,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
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
      { field: 'accountStatusName', header: 'status' },
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

  navigateToNewDepositer() {
    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, false);
    this.router.navigate([termdeposittransactionconstant.MEMBERSHIP_DETAILS],{ queryParams: { falg: this.encryptDecryptService.encrypt(true)}});
  }
  navigateToOperations(event: any,rowData : any) {
    if (event.value === 1)
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_INTEREST_PAYMENT],{ queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) }, });
    else if (event.value === 2)
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_FORECLOSURE],{ queryParams: { id: this.encryptDecryptService.encrypt(rowData.id)}});
    // else if (event.value === 3)
      // this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_FORECLOSURE],{ queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), flag: this.encryptDecryptService.encrypt(0) } });    
    else if (event.value === 3)
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMULATIVE_RENEWAL],{ queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  getAllFdNonCummulativeByBranchIdPacsId() {
    //  this.commonComponent.startSpinner();
    this.fdNonCummulativeAccountsService.getFdNonCummulativeByBranchIdPacsId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      this.gridListLenght = this.gridListData.length;
      this.gridListData = this.gridListData.map(fd => {
        if (fd.depositDate != null && fd.depositDate != undefined) {
          fd.depositDate = this.datePipe.transform(fd.depositDate,this.orgnizationSetting.datePipe);
        }
        this.activeStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status === applicationConstants.ACTIVE).length;
        this.inactiveStatusCount = this.gridListData.filter(fdAccountApplication => fdAccountApplication.status === applicationConstants.IN_ACTIVE).length;
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

   editAccount(rowData: any){
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),editbutton: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) } });
  }

  view(rowData: any) {
    let viewScreen = true;
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id),view: this.encryptDecryptService.encrypt(viewScreen), editbutton: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE),isGridPage: this.encryptDecryptService.encrypt(applicationConstants.IN_ACTIVE) }});
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
}