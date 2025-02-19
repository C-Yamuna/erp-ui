import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CiLoanApplicationService } from '../../compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.service';
import { CiLoanApplication } from '../../compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.model';
import { CiDisbursementsService } from '../../../shared/ci-loans/ci-disbursements.service';
import { CiLoanDisbursement } from '../shared/ci-loan-disbursement.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails } from '../../compound-interest-loan-stepper/ci-membership-details/shared/membership-details.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Loantransactionconstant } from '../../../loan-transaction-constant';

@Component({
  selector: 'app-ci-loan-disbursement',
  templateUrl: './ci-loan-disbursement.component.html',
  styleUrls: ['./ci-loan-disbursement.component.css']
})
export class CiLoanDisbursementComponent {

  orgnizationSetting: any;
  disbursementForm: FormGroup;
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciLoanDisbursementModel: CiLoanDisbursement = new CiLoanDisbursement();
  membershipBasicRequiredDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  ciLoanDisbursementColumns: any[] = [];
  pacsId: any;
  branchId: any;
  loanAccId: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  ciLoanDisbursementList: any[] = [];
  msgs: any[] = [];
  isKycApproved: any;
  photoCopyFlag: boolean = false;
  membreIndividualFlag: boolean = false;
  totalDisbursement: Number = 0;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private translate: TranslateService,
    private fileUploadService: FileUploadService,
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciDisbursementsService: CiDisbursementsService) {

    this.ciLoanDisbursementColumns = [
      { field: 'disbursementDateVal', header: 'LOANS.DISBURSEMENT_DATE' },
      { field: 'disbursementAmount', header: 'LOANS.DISBURSEMENT_AMOUNT' },
      { field: 'transactionDateVal', header: 'LOANS.TRANSACTION_DATE' },
      { field: 'statusName', header: 'LOANS.STATUS' }
    ];

    this.disbursementForm = this.formBuilder.group({
      'accountNumber': new FormControl({ value: '', disabled: true }),
      'disbursementDate': new FormControl('', Validators.required),
      'disbursementAmount': new FormControl('', Validators.required),
      'transactionDate': new FormControl('', Validators.required)
    });

  }

  ngOnInit() {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.loanAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getCILoanApplicationById(this.loanAccId);
        this.isEdit = true;
      } else {
        this.isEdit = false;
        this.ciLoanDisbursementModel = new CiLoanDisbursement();
      }
    });
  }

  getCILoanApplicationById(loanAccId: any) {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLoanApplicationModel = this.responseModel.data[0];
              this.getCILoanDisbursementsByCIApplicationId();
              if (this.ciLoanApplicationModel.accountNumber != null && this.ciLoanApplicationModel.accountNumber != undefined) {
                this.ciLoanDisbursementModel.accountNumber = this.ciLoanApplicationModel.accountNumber;
              }
              if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined) {
                this.ciLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.ciLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
              }
              if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined) {
                this.ciLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.ciLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
              }
              if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined) {
                this.ciLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.ciLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
              }
              // if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined) {
              //   this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;
              //   if (this.ciLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
              //     this.isIndividual = true;
              // }
              // if (this.ciLoanApplicationModel.admissionNo != null && this.ciLoanApplicationModel.admissionNo != undefined) {
              //   this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
              // }
              // if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined) {
              //   this.applicationType = true;
              // }

              if (this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined && this.ciLoanApplicationModel.individualMemberDetailsDTO != null) {
                this.membershipBasicRequiredDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;

                if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                  this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                  this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                  this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                  this.photoCopyFlag = true;
                }
                if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                  this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                }

                if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved)
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                else
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
              // if (this.ciLoanApplicationModel.siProductDefinitionDTO != null && this.ciLoanApplicationModel.siProductDefinitionDTO != undefined)
              //   this.siLoanProductDefinitionModel = this.ciLoanApplicationModel.siProductDefinitionDTO;
            }
          }
        }
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  getCILoanDisbursementsByCIApplicationId() {
    this.ciDisbursementsService.getCILoanDisbursementsByCIApplicationId(this.loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciLoanDisbursementList = this.responseModel.data;
            this.ciLoanDisbursementList = this.ciLoanDisbursementList.filter(data => data.disbursementDate != null && data.transactionDate != null).map(count => {
              count.disbursementDate = this.datePipe.transform(count.disbursementDate, this.orgnizationSetting.datePipe);
              count.transactionDate = this.datePipe.transform(count.transactionDate, this.orgnizationSetting.datePipe);
              this.totalDisbursement = this.totalDisbursement + count.disbursementAmount;
              return count;
            });
          }
        }
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  addOrUpdate() {
    this.commonComponent.startSpinner();
    this.ciLoanDisbursementModel.pacsId = this.pacsId;
    this.ciLoanDisbursementModel.branchId = this.branchId;
    this.ciLoanDisbursementModel.statusName = 'Created'
    this.ciLoanDisbursementModel.ciLoanApplicationId = this.loanAccId;
    this.ciLoanDisbursementModel.ciProductId = this.ciLoanApplicationModel.ciProductId;
    if (this.ciLoanDisbursementModel.disbursementDate != null && this.ciLoanDisbursementModel.disbursementDate != undefined) {
      this.ciLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanDisbursementModel.disbursementDate));
    }
    if (this.ciLoanDisbursementModel.transactionDate != null && this.ciLoanDisbursementModel.transactionDate != undefined) {
      this.ciLoanDisbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanDisbursementModel.transactionDate));
    }

    if (this.ciLoanDisbursementModel.id != undefined) {
      this.ciDisbursementsService.updateCiDisbursements(this.ciLoanDisbursementModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.getCILoanDisbursementsByCIApplicationId();
            this.resetDisbrusmentFormData();
          }, 2000);
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
    } else {
      this.ciDisbursementsService.addCiDisbursements(this.ciLoanDisbursementModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.getCILoanDisbursementsByCIApplicationId();
            this.resetDisbrusmentFormData();
          }, 1000);
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1000);
      });
    }
  }

  resetDisbrusmentFormData() {
    this.ciLoanDisbursementModel.accountNumber = null;
    this.ciLoanDisbursementModel.disbursementDate = null;
    this.ciLoanDisbursementModel.disbursementAmount = null;
    this.ciLoanDisbursementModel.transactionDate = null;

    // this.enableForm();
  }

  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  onClickMemberPhotoCopy() {
    // this.memberPhotoCopyZoom = true;
  }

  navigateToBack() {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOAN]);
  }

}
