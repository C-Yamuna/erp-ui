import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CiLoanApplicationsService } from '../shared/ci-loans/ci-loan-applications.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CompoundInterestLoan } from './shared/compound-interest-loan.model';
import { Loantransactionconstant } from '../loan-transaction-constant';
import { MenuItem } from 'primeng/api';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';

@Component({
  selector: 'app-compound-interest-loan',
  templateUrl: './compound-interest-loan.component.html',
  styleUrls: ['./compound-interest-loan.component.css']
})
export class CompoundInterestLoanComponent {
  loans: any[] = [];
  pacsId: any;
  branchId: any;
  gridList: any [] = [];
  msgs: any[] = [];
  gridListLenght: Number | undefined;
  tempGridListData: any[] = [];
  responseModel!: Responsemodel;
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  value: number = 0;
  operationslist:any;
  operations:any;
  activeStatusCount: number = 0;
  inactiveStatusCount: number = 0;
  showForm: boolean=false;
  compoundInterestLoan : CompoundInterestLoan = new CompoundInterestLoan();
  memberPhotoCopyZoom: boolean = false;
  memberphotCopyMultipartFileList: any[] = [];
  inProgressCount:any;
  submissionForApprovalCount:any;
  requestForResubmmissionCount:any;
  approvedCount:any;
  rejectCount:any;
  memberSignatureCopyMultipartFileList: any[] = [];
  constructor(private router: Router, private translate: TranslateService,private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService,private ciLoanApplicationService : CiLoanApplicationsService, private encryptDecryptService: EncryptDecryptService,private fileUploadService : FileUploadService )
  { 
    this.loans = [
      { field: 'memberName', header: 'LOAN_TRANSACTION.NAME' },
      { field: 'accountNumber', header: 'LOAN_TRANSACTION.ACCOUNT_NUMBER' },
      { field: 'admissionNo',header:'LOAN_TRANSACTION.ADMISSION_NUMBER'},
      { field: 'memberTypeName',header:'LOAN_TRANSACTION.MEMBER_TYPE'},
      { field: 'operationTypeName',header:'LOAN_TRANSACTION.ACCOUNT_TYPE'},
      // { field: 'Application ', header: 'APPLICATION' },
      { field: 'ciProductName', header: 'Product Name' },
      { field: 'sanctionAmount',header:'LOAN_TRANSACTION.SANCTION_AMOUNT'},
      { field: 'effectiveRoi', header: 'LOAN_TRANSACTION.ROI' },
      { field: 'accountStatusName', header: 'LOAN_TRANSACTION.STATUS' },
     // { field: 'Action', header: 'ACTION' },
    ];
  }
  ngOnInit() {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    let tabLabels = [
      'Total Accounts',
      'Total Disbursement Amount',     
      'Total Collection Amount',
      'Total SAO Loans',
      'Total Term Loans',
      ' Total Simple Interest Loans ',                   
    ];
    this. operationslist = [
      { label: "Disbursement", value: 1 },
      { label: "Collection", value: 2 },
      { label: "Closure", value: 3 },
    ]
    this.items = tabLabels.map((label, index)=> ({ label: label, value: `${index + 1}` }));
    this.pacsId = 1;
    this.branchId = 1;
    this.getAllCiLoanApplicationDetailsListByPacsIdAndBranchId();
  }
  getAllCiLoanApplicationDetailsListByPacsIdAndBranchId() {
    this.inProgressCount =0;
    this.submissionForApprovalCount =0;
    this.requestForResubmmissionCount=0;
    this.approvedCount =0;
    this.rejectCount =0;
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getCiLoanApplicationDetailsByPacsIdAndBranchId(this.pacsId, this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.gridList = this.responseModel.data.map((ciLoan: any) => {
          if(ciLoan.balance == null || ciLoan.balance == undefined || ciLoan.balance == 0){
            ciLoan.balance = "0.0/-";
          }
          else{
            ciLoan.balance = ciLoan.balance +"/-";
          }
          if((ciLoan.accountStatusName == applicationConstants.SUBMISSION_FOR_APPROVAL) ||  (ciLoan.accountStatusName == applicationConstants.APPROVED)){
            ciLoan.viewButton = true;
            ciLoan.actionButton = false;
          }
          else{
            ciLoan.actionButton = true;
            ciLoan.viewButton = false;
          }
          if(ciLoan.accountStatusName == applicationConstants.APPROVED){
            ciLoan.approved = true;
            ciLoan.actionButton = false;
            this.approvedCount = this.approvedCount +1;
          }
          else if(ciLoan.accountStatusName == applicationConstants.REJECTED){
            ciLoan.rejected = true;
            ciLoan.actionButton = false;
            this.rejectCount = this.rejectCount +1;
          }
          else if(ciLoan.accountStatusName == applicationConstants.SUBMISSION_FOR_APPROVAL){
            ciLoan.submissionForApproval = true;
            ciLoan.actionButton = false; 
            this.submissionForApprovalCount = this.submissionForApprovalCount + 1;
          }
          else if(ciLoan.accountStatusName == applicationConstants.CREATED || ciLoan.accountStatusName == applicationConstants.IN_PROGRESS){
            ciLoan.created = true; 
            ciLoan.viewButton = true;
            ciLoan.actionButton = true;
            this.inProgressCount = this.inProgressCount +1;
          }
          else if(ciLoan.accountStatusName == applicationConstants.REQUEST_FOR_RESUBIMSSION){
            ciLoan.rejected = false;
            ciLoan.approved = false;
            ciLoan.submissionForApproval = false; 
            ciLoan.actionButton = true;
            ciLoan.viewButton = true;
            ciLoan.requestForResubmmission = true;
            this.requestForResubmmissionCount = this.requestForResubmmissionCount +1;
          }
          if(ciLoan.memberPhotoCopyPath != null && ciLoan.memberPhotoCopyPath != undefined && ciLoan.isNewMember){
            ciLoan.multipartFileListForPhotoCopy = this.fileUploadService.getFile(ciLoan.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + ciLoan.memberPhotoCopyPath  );
            ciLoan.photoCopy = true;
          }
          else if(ciLoan.memberPhotoCopyPath != null && ciLoan.memberPhotoCopyPath != undefined){
            ciLoan.multipartFileListForPhotoCopy = this.fileUploadService.getFile(ciLoan.memberPhotoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + ciLoan.memberPhotoCopyPath  );
            ciLoan.photoCopy = true;
          }
          else {
            ciLoan.photoCopy = false;
          }
          if(ciLoan.memberSignatureCopyPath != null && ciLoan.memberSignatureCopyPath != undefined && ciLoan.isNewMember){
            ciLoan.multipartFileListForSignatureCopy = this.fileUploadService.getFile(ciLoan.memberSignatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + ciLoan.memberSignatureCopyPath  );
            ciLoan.signatureCopy = true;
          }
          else if(ciLoan.memberSignatureCopyPath != null && ciLoan.memberSignatureCopyPath != undefined ){
            ciLoan.multipartFileListForSignatureCopy = this.fileUploadService.getFile(ciLoan.memberSignatureCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + ciLoan.memberSignatureCopyPath  );
            ciLoan.signatureCopy = true;
          }
          else {
            ciLoan.signatureCopy = false;
          }
          return ciLoan
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
  
  createaccount(){
    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, false);
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS] ,{ queryParams: { falg: this.encryptDecryptService.encrypt(true)}});
  }


  editCompoundInterestDetails(rowData: any){
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(1) } });
  }

  viewCompoundInterestDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_PREVIEW], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), editbutton: this.encryptDecryptService.encrypt(2) } });
  }

  navigateToOperations(event: any) {
    if (event.value === 1)
    this.router.navigate([Loantransactionconstant.LOANS_DISBURSEMENT]);
    else if (event.value === 2)
    this.router.navigate([Loantransactionconstant.LOANS_COLLECTIONS]);
    else if (event.value === 3)
    this.router.navigate([Loantransactionconstant.LOANS_CLOSURE]);
  }

  onChange(){
    this.showForm = !this.showForm;
  }

  /**
   * 
   * @param sbRowData 
   */
  onClickMemberPhotoCopy(ciLoand : any){
    this.memberPhotoCopyZoom = true;

    this.memberphotCopyMultipartFileList = [];
    this.memberSignatureCopyMultipartFileList = [];

    this.memberphotCopyMultipartFileList = ciLoand.multipartFileListForPhotoCopy ;
    this.memberSignatureCopyMultipartFileList = ciLoand.multipartFileListForSignatureCopy;
  }

  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }

}
