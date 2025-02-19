import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanDisbursement, TermLoanTransaction } from './shared/term-loan-disbursement.model';
import { MembershipBasicRequiredDetails } from '../../term-loan-stepper/term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermApplication, TermLoanDisbursementScheduleModel } from '../../term-loan-stepper/term-loan-application-details/shared/term-application.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TermLoanDisbursementService } from './shared/term-loan-disbursement.service';
import { TermApplicationService } from '../../term-loan-stepper/term-loan-application-details/shared/term-application.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-term-loan-disbursement',
  templateUrl: './term-loan-disbursement.component.html',
  styleUrls: ['./term-loan-disbursement.component.css']
})
export class TermLoanDisbursementComponent {
  loanDisubursementForm: FormGroup;
  showTable: boolean = true;
  showSaveButton: boolean = false;
  showSubmitButton: boolean = true;
  disbursement: any[] = [];
  visible: boolean = false;
  responseModel!: Responsemodel;
  gridList: any[] = [];
  isEdit: any;
  msgs: any[] = [];
  showForm: boolean = false;
  statusLabel: boolean = false;
  termLoanDisbursementModel: TermLoanDisbursement = new TermLoanDisbursement();
  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  termLoanDisbursementScheduleModel:TermLoanDisbursementScheduleModel = new TermLoanDisbursementScheduleModel();
  termLoanTransactionModel: TermLoanTransaction = new TermLoanTransaction();
  loanId: any;
  orgnizationSetting: any;
  disbursmentDueAmont: any;
  photoCopyFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  submitDisable:boolean = false;
  paymentOptions:any;
  totalDisbursmentAmount: any;
  currentEditableIndex: number = 0;
  isStatus: boolean = false;
  constructor(private router: Router, private formBuilder: FormBuilder, private termLoanDisbursementService: TermLoanDisbursementService,  private termLoanApplicationsService: TermApplicationService,
    private encryptService: EncryptDecryptService, private commonComponent: CommonComponent, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
     private activateRoute: ActivatedRoute, private datePipe: DatePipe,private fileUploadService: FileUploadService,
  ) {
    this.loanDisubursementForm = this.formBuilder.group({
      'disbursementAmount':  new FormControl({ value: '', disabled: true }, [Validators.required]),
      'accountNumber':new FormControl({ value: '', disabled: true }, [Validators.required]),
      'disbursementDate':new FormControl({ value: '', disabled: true }, [Validators.required]),
      'transactionDate':new FormControl({ value: '', disabled: true }, [Validators.required]),
      'paymentModeName': new FormControl('',[Validators.required]),
      'sbAccountNumber': new FormControl(''),
      'statusName': new FormControl(''),
      'isPhotoSignVerfied':  new FormControl('',[Validators.required]),
    })
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.disbursement = [

      { field: 'disbursementAmount', header: 'LOANS.DISBURSEMENT_AMOUNT' },
      { field: 'accountNumber', header: 'LOANS.ACCOUNT_NUMBER' },
      { field: 'disbursementDate', header: 'LOANS.DISBURSEMENT_DATE' },
      { field: 'transactionDate', header: 'LOANS.TRANSACTION_DATE ' },
      { field: 'statusName', header: 'LOANS.STATUS' },

    ];
    this.paymentOptions = [
      { label: 'Cash', value: 1 },
      { label: 'Cheque', value: 2 },
      { label: 'Transfer', value: 3},
    ];

    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.loanId = this.encryptService.decrypt(params['id']);
        this.isEdit = true;
        if (this.loanId != null && this.loanId != undefined) {
          this.getTermDisbursmentDetailsByLoanApplicationId();
        }
      } else {
        this.isEdit = false;
      }
    })
    this.getApplicationDetailsById(this.loanId);
  }

  back() {
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }
  cancel() {
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }
      /**
   * @implements submit for dialog box
   * @author vinitha
   */
  submit() {
    this.showTable = true;
  }
    /**
   * @implements  get application details by termapplication id
   * @author vinitha
   */
  getApplicationDetailsById(id: any) {
    this.submitDisable = true;
    
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termLoanApplicationModel = this.responseModel.data[0];
        if (this.termLoanApplicationModel.loanApprovedDate != null && this.termLoanApplicationModel.loanApprovedDate != undefined)
          this.termLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);
        
        if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined)
          this.termLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
        
        if(this.termLoanApplicationModel.sanctionAmount != null && this.termLoanApplicationModel.sanctionAmount != undefined && 
          this.termLoanApplicationModel.disbursedAmount != null){
          this.disbursmentDueAmont = this.termLoanApplicationModel.sanctionAmount - this.termLoanApplicationModel.disbursedAmount;
        }else{
          this.disbursmentDueAmont = this.termLoanApplicationModel.disbursedAmount;
        }
        this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
        if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
          this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
        }
        if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
          this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
          this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
          this.photoCopyFlag = true;
        }
        if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
          this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
        }
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    });
  }

    /**
   * @implements save for edit
   * @author vinitha
   */
  save() {
    this.submitDisable = false;
    this.showTable = true;
    this.showSubmitButton = true;
    this.showSaveButton = false;
    
    
  }
     /**
   * @implements get data from table to form
   * @author vinitha
   */
  edit(rowData: any) {
    this.showSaveButton = true;
    this.showSubmitButton = false;
    this.termLoanDisbursementModel = rowData;
  
   
    if(this.termLoanDisbursementModel.disbursementDate != null && this.termLoanDisbursementModel.disbursementDate != undefined ){
      this.termLoanDisbursementModel.disbursementDate=this.datePipe.transform(this.termLoanDisbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
     
    }
    if (this.termLoanDisbursementModel.transactionDate != null && this.termLoanDisbursementModel.transactionDate != undefined) {
      this.termLoanDisbursementModel.transactionDate = this.datePipe.transform(this.termLoanDisbursementModel.transactionDate, this.orgnizationSetting.datePipe);
    }
    if(this.termLoanDisbursementModel.transactionDate == null || this.termLoanDisbursementModel.transactionDate == undefined){
      this.termLoanDisbursementModel.transactionDate = this.commonFunctionsService.currentDate();
    }
  
  }
       /**
   * @implements vie dialog box
   * @author vinitha
   */
  view(rowData: any) {
    // this.submitDisable = true;
    this.visible = true;
    this.termLoanDisbursementModel = rowData;
    if (this.termLoanDisbursementModel.disbursementDate != null && this.termLoanDisbursementModel.disbursementDate != undefined) {
      this.termLoanDisbursementModel.disbursementDate = this.datePipe.transform(this.termLoanDisbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
    }
    if (this.termLoanDisbursementModel.transactionDate != null && this.termLoanDisbursementModel.transactionDate != undefined) {
      this.termLoanDisbursementModel.transactionDate = this.datePipe.transform(this.termLoanDisbursementModel.transactionDate, this.orgnizationSetting.datePipe);
    }
  }
  showDialog(){
    this.visible = true;
  }
       /**
   * @implements update data disbursemt to transaction detals
   * @author vinitha
   */
  confirm() {
    if (this.termLoanDisbursementModel.disbursementDate != null && this.termLoanDisbursementModel.disbursementDate != undefined) 
      this.termLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanDisbursementModel.disbursementDate));
   

    if(this.termLoanDisbursementModel.transactionDate != undefined && this.termLoanDisbursementModel.transactionDate != null)
    this.termLoanDisbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanDisbursementModel.transactionDate));
   

    if(this.termLoanDisbursementModel.disbursementAmount != null && this.termLoanDisbursementModel.disbursementAmount != undefined){
      this.termLoanTransactionModel.transactionAmount = this.termLoanDisbursementModel.disbursementAmount;
    }
    if(this.termLoanDisbursementModel.accountNumber != null && this.termLoanDisbursementModel.accountNumber != undefined){
      this.termLoanTransactionModel.accountNumber = this.termLoanDisbursementModel.accountNumber;
    }
    if(this.termLoanDisbursementModel.disbursementDate != null && this.termLoanDisbursementModel.disbursementDate != undefined){
      this.termLoanTransactionModel.disbursementDate = this.termLoanDisbursementModel.disbursementDate;
    }
   
    if(this.termLoanDisbursementModel.transactionDate != null && this.termLoanDisbursementModel.transactionDate != undefined){
      this.termLoanTransactionModel.transactionDate = this.termLoanDisbursementModel.transactionDate;
    }
    if(this.termLoanDisbursementModel.isPhotoSignVerfied != null && this.termLoanDisbursementModel.isPhotoSignVerfied != undefined){
      this.termLoanTransactionModel.isPhotoSignVerfied = this.termLoanDisbursementModel.isPhotoSignVerfied;
    }
    if(this.termLoanDisbursementModel.paymentMode != null && this.termLoanDisbursementModel.paymentMode != undefined){
      this.termLoanTransactionModel.transactionMode = this.termLoanDisbursementModel.paymentMode;
    }
    if(this.termLoanDisbursementModel.sbAccountNumber != null && this.termLoanDisbursementModel.sbAccountNumber != undefined){
      this.termLoanTransactionModel.sbAccountNumber = this.termLoanDisbursementModel.sbAccountNumber;
    }
    if(this.termLoanDisbursementModel.termLoanApplicationId != null && this.termLoanDisbursementModel.termLoanApplicationId != undefined){
      this.termLoanTransactionModel.termLoanApplicationId = this.termLoanDisbursementModel.termLoanApplicationId;
    }
    if(this.termLoanDisbursementModel.id != null && this.termLoanDisbursementModel.id != undefined){
      this.termLoanTransactionModel.disbursementId = this.termLoanDisbursementModel.id;
    }
    this.termLoanTransactionModel.moduleType = applicationConstants.DISBURSEMENT;
    this.termLoanTransactionModel.statusName = applicationConstants.SUBMISSION_FOR_APPROVAL;
    this.termLoanDisbursementService.addTermTransactionDetails(this.termLoanTransactionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
       
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    });
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }
       /**
   * @implements get disbursemnt data by term application id
   * @author vinitha
   */
  getTermDisbursmentDetailsByLoanApplicationId() {
    this.commonComponent.startSpinner();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.termLoanDisbursementService.getTermDisbursmentDetailsByLoanApplicationId(this.loanId).subscribe((data: any) => {
       this.responseModel = data;
    
       if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        if (this.responseModel != null&& this.responseModel.data!= undefined) {
         this.gridList = this.responseModel.data;
    
       }
       if (null != this.gridList && undefined != this.gridList && this.gridList.length > 0) {
        this.totalDisbursmentAmount = 0;
         this.gridList = this.gridList.map(disbursment => {
          disbursment.disbursementDate = this.datePipe.transform(disbursment.disbursementDate, this.orgnizationSetting.datePipe) || '';
          disbursment.transactionDate = this.datePipe.transform(disbursment.transactionDate, this.orgnizationSetting.datePipe) || '';
          disbursment.showEditButton = disbursment.statusName === applicationConstants.SCHEDULED;
          disbursment.showViewButton = disbursment.statusName === applicationConstants.SUBMISSION_FOR_APPROVAL;
          this.totalDisbursmentAmount += disbursment.disbursementAmount || 0;
        
          disbursment.totalDisbursment = this.totalDisbursmentAmount;
        
         
           return disbursment
        
         });
      
       
        }
       }
        this.commonComponent.stopSpinner();
     }, error => {
       this.msgs = [];
       this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
       this.commonComponent.stopSpinner();
     });
  }

 
  isBasicDetails: boolean = false;
  position: string = 'center';
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }
  onClickMemberIndividualMoreDetails(){
    this.showForm = true
  }
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }
}
