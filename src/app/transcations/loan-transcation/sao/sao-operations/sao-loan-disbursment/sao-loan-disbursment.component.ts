import { Component } from '@angular/core';
import { SaoLoanDisbursement } from './shared/sao-loan-disbursement.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaoDisbursementService } from '../../../shared/sao-loans/sao-disbursement.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { DatePipe } from '@angular/common';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { IndividualMemberDetailsModel } from '../../sao-stepper/membership-basic-details/shared/membership-basic-details.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-sao-loan-disbursment',
  templateUrl: './sao-loan-disbursment.component.html',
  styleUrls: ['./sao-loan-disbursment.component.css']
})
export class SaoLoanDisbursmentComponent {
  loanDisubursementForm: FormGroup;
  showTable: boolean = true;
  showSaveButton: boolean = false;
  showSubmitButton: boolean = true;
  disbursement: any[] = [];
  visible: boolean = false;
  confirmDisable: boolean = false;
  responseModel!: Responsemodel;
  gridList: any[] = [];
  isEdit: any;
  msgs: any[] = [];
  showForm: boolean = false;
  disbursementModel: SaoLoanDisbursement = new SaoLoanDisbursement();
  saoLoanApplicationModel: SaoLoanApplication = new SaoLoanApplication();
  individualMemberDetailsModel: IndividualMemberDetailsModel = new IndividualMemberDetailsModel();
  loanId: any;
  orgnizationSetting: any;
  disbursmentDueAmont: any;
  photoCopyFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  submitDisable:boolean = false;
  paymentOptions:any;
  totalDisbursmentAmount: any;
  statusLabel: boolean = false;
  constructor(private router: Router, private formBuilder: FormBuilder, private saoDisbursementService: SaoDisbursementService, private saoLoanApplicationService: SaoLoanApplicationService,
    private encryptService: EncryptDecryptService, private commonComponent: CommonComponent, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
     private activateRoute: ActivatedRoute, private datePipe: DatePipe,private fileUploadService: FileUploadService,
  ) {
    this.loanDisubursementForm = this.formBuilder.group({
      'disbursementAmount': [{ value: '', disabled: true }],
      'accountNumber': [{ value: '', disabled: true }],
      'disbursementDate': [{ value: '', disabled: true }],
      'transactionDate': [{ value: '', disabled: true }],
      'paymentModeName': new FormControl(''),
      'sbAccountNumber': new FormControl(''),
      'statusName': new FormControl(''),
    })
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.disbursement = [
      //{ field: 'Units',header:'UNITS'},
      { field: 'disbursementAmount', header: 'DISBURSEMENT AMOUNT' },
      { field: 'accountNumber', header: 'ACCOUNT NUMBER' },
      { field: 'disbursementDate', header: 'DISBURSEMENT DATE' },
      { field: 'transactionDate', header: 'TRANSACTION DATE ' },
      { field: 'statusName', header: 'STATUS' },
      //{ field: 'Action', header: 'ACTION' },

    ];
    this.paymentOptions = [
      { label: 'Cash', value: 1 },
      { label: 'Transfer', value: 2 }
    ];
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        // this.commonComponent.startSpinner();
        this.loanId = this.encryptService.decrypt(params['id']);
        this.isEdit = true;
        if (this.loanId != null && this.loanId != undefined) {
          this.getSaoDisbursmentDetailsByLoanApplicationId(this.loanId);
        }
      } else {
        this.isEdit = false;
        //this.disbursementModel.statusName = this.statusList[0].value;
      }
    })

    this.getApplicationDetailsById(this.loanId);
  }

  back() {
    this.router.navigate([Loantransactionconstant.SAO_LOAN]);
  }
  cancel() {
    this.router.navigate([Loantransactionconstant.SAO_LOAN]);
  }
  submit() {
    this.showTable = true;
    // this.submitDisable = false;
  }
  getApplicationDetailsById(id: any) {
    this.submitDisable = true;
    
    this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saoLoanApplicationModel = this.responseModel.data[0];
        if (this.saoLoanApplicationModel.loanApprovedDate != null && this.saoLoanApplicationModel.loanApprovedDate != undefined)
          this.saoLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.saoLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);
        
        if (this.saoLoanApplicationModel.loanDueDate != null && this.saoLoanApplicationModel.loanDueDate != undefined)
          this.saoLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.saoLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
        
        if(this.saoLoanApplicationModel.sanctionAmount != null && this.saoLoanApplicationModel.sanctionAmount != undefined && 
          this.saoLoanApplicationModel.totalDisbursedAmount != null){
          this.disbursmentDueAmont = this.saoLoanApplicationModel.sanctionAmount - this.saoLoanApplicationModel.totalDisbursedAmount;
        }else{
          this.disbursmentDueAmont = this.saoLoanApplicationModel.totalDisbursedAmount;
        }
        this.individualMemberDetailsModel = this.saoLoanApplicationModel.individualMemberDetailsDTO;
        if (this.individualMemberDetailsModel.dob != null && this.individualMemberDetailsModel.dob != undefined) {
          this.individualMemberDetailsModel.dobVal = this.datePipe.transform(this.individualMemberDetailsModel.dob, this.orgnizationSetting.datePipe);
        }
        if (this.individualMemberDetailsModel.admissionDate != null && this.individualMemberDetailsModel.admissionDate != undefined) {
          this.individualMemberDetailsModel.admissionDateVal = this.datePipe.transform(this.individualMemberDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.individualMemberDetailsModel.photoCopyPath != null && this.individualMemberDetailsModel.photoCopyPath != undefined) {
          this.individualMemberDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.individualMemberDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.individualMemberDetailsModel.photoCopyPath);
          this.photoCopyFlag = true;
        }
        if (this.individualMemberDetailsModel.signatureCopyPath != null && this.individualMemberDetailsModel.signatureCopyPath != undefined) {
          this.individualMemberDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.individualMemberDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.individualMemberDetailsModel.signatureCopyPath);
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
  save() {
    this.submitDisable = false;
    this.showTable = true;
    this.showSubmitButton = true;
    this.showSaveButton = false;
    
    
  }
  edit(rowData: any) {
    //this.showTable = false;
    this.showSaveButton = true;
    this.showSubmitButton = false;
    this.disbursementModel = rowData;
    if (this.disbursementModel.disbursementDate != null && this.disbursementModel.disbursementDate != undefined) {
      this.disbursementModel.disbursementDateVal = this.datePipe.transform(this.disbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
    }
    if (this.disbursementModel.transactionDate != null && this.disbursementModel.transactionDate != undefined) {
      this.disbursementModel.transactionDateVal = this.datePipe.transform(this.disbursementModel.transactionDate, this.orgnizationSetting.datePipe);
    }
   
  }
  view(rowData: any) {
    this.confirmDisable = true;
    this.visible = true;
    this.disbursementModel = rowData;
    if (this.disbursementModel.disbursementDate != null && this.disbursementModel.disbursementDate != undefined) {
      this.disbursementModel.disbursementDateVal = this.datePipe.transform(this.disbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
    }
    if (this.disbursementModel.transactionDate != null && this.disbursementModel.transactionDate != undefined) {
      this.disbursementModel.transactionDateVal = this.datePipe.transform(this.disbursementModel.transactionDate, this.orgnizationSetting.datePipe);
    }
  }
  showDialog(){
    this.visible = true;
  }
  confirm() {
    if (this.disbursementModel.disbursementDateVal != null && this.disbursementModel.disbursementDateVal != undefined) {
      this.disbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpochWithTime(this.disbursementModel.disbursementDateVal);
    }
    if (this.disbursementModel.transactionDateVal != null && this.disbursementModel.transactionDateVal != undefined) {
      this.disbursementModel.transactionDate = this.commonFunctionsService.getUTCEpochWithTime(this.disbursementModel.transactionDateVal);
    }
    this.disbursementModel.statusName = applicationConstants.SUBMISSION_FOR_APPROVAL;
    this.disbursementModel.status = 5;
    this.saoDisbursementService.updateSaoDisbursement(this.disbursementModel).subscribe((response: any) => {
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
    this.router.navigate([Loantransactionconstant.SAO_LOAN]);
  }
  getSaoDisbursmentDetailsByLoanApplicationId(loanId: any) {
    this.saoDisbursementService.getSaoDisbursmentDetailsByLoanApplicationId(loanId).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.gridList = this.responseModel.data;
        this.disbursementModel = this.responseModel.data;
        if(this.disbursementModel.statusName != null && this.disbursementModel.statusName != null ){
         if( this.disbursementModel.statusName == applicationConstants.SUBMISSION_FOR_APPROVAL)
            this.statusLabel = false;
          else{
            this.statusLabel = true;
          }
        }
        
        if (null != this.gridList && undefined != this.gridList && this.gridList.length > 0) {
          this.totalDisbursmentAmount = 0; 
          this.gridList = this.gridList.filter((data: any) => null != data.disbursementDate && null != data.transactionDate).map(disbursment => {
            disbursment.disbursementDate = this.datePipe.transform(disbursment.disbursementDate, this.orgnizationSetting.datePipe) || '';
            disbursment.transactionDate = this.datePipe.transform(disbursment.transactionDate, this.orgnizationSetting.datePipe) || '';
            this.totalDisbursmentAmount += disbursment.disbursementAmount || 0;

            disbursment.totalDisbursment = this.totalDisbursmentAmount;
            return disbursment
          });
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      } else {
        this.commonComponent.stopSpinner();
        // this.buttonDisabled = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
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
