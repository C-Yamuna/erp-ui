import { Component } from '@angular/core';
import { SaoLoanDisbursement } from './shared/sao-loan-disbursement.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { SaoProductDefinitionsService } from '../../sao-product-definition/shared/sao-product-definitions.service';
import { SaoProductDetails } from '../../sao-stepper/sao-product-details/shared/sao-product-details.model';

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
  saoProductDetailsModel: SaoProductDetails = new SaoProductDetails();
  loanId: any;
  orgnizationSetting: any;
  photoCopyFlag: boolean = false;
  isKycApproved: any;
  memberPhotoCopyZoom: boolean = false;
  // submitDisable: boolean = false;
  paymentOptions: any;
  // totalDisbursmentAmount: any;
  statusLabel: boolean = false;
  addOrEdit: boolean = false;
  editDisable: boolean = false;
  trueFalseList: any[] = [];
  disbursementScheduleList: any[] = [];
  pacsId: any;
  branchId: any;
  disburmentAmount: any;
  isEditDeleteButtonEnable: boolean = false;
  dueAmount: any;
  totalDisbursement: Number = 0;
  nextDisbursmentDate: any;
  disbursmentDueDate: any;

  constructor(private router: Router, private formBuilder: FormBuilder, private saoDisbursementService: SaoDisbursementService, private saoLoanApplicationService: SaoLoanApplicationService,
    private encryptService: EncryptDecryptService, private commonComponent: CommonComponent, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
    private activateRoute: ActivatedRoute, private datePipe: DatePipe, private fileUploadService: FileUploadService, private saoProductDefinitionsService: SaoProductDefinitionsService
  ) {
    this.loanDisubursementForm = this.formBuilder.group({
      'disbursementAmount': new FormControl('', [Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
      'accountNumber': [{ value: '', disabled: true }],
      'disbursementDate': [{ value: '', disabled: true }],
      'transactionDate': [{ value: '', disabled: true }],
      'isPhotoSignVerfied': new FormControl('', Validators.compose([Validators.required])),
      'paymentModeName': new FormControl(''),
      'sbAccountNumber': new FormControl(''),
      'statusName': new FormControl(''),
    })
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.trueFalseList = this.commonComponent.requiredlist();
    this.disbursement = [
      // { field: 'disbursementOrder', header: 'ERP.DISBURSEMENT_ORDER' },
      // { field: 'typeName', header: 'ERP.DISBURSEMENT_TYPE' },
      // { field: 'disbursementDateVal', header: 'ERP.SCHEDULE_DATE' },
      // { field: 'disbursementAmount', header: 'ERP.MIN_AMOUNT' },
      // { field: 'transactionDateVal', header: 'ERP.TRANSACTION_DATE' },
      // { field: 'statusName', header: 'ERP.STATUS' }
      
      //{ field: 'Units',header:'UNITS'},
      { field: 'disbursementAmount', header: 'LOANS.DISBURSEMENT_AMOUNT' },
      // { field: 'accountNumber', header: 'LOANS.ACCOUNT_NUMBER' },
      { field: 'disbursementDateVal', header: 'LOANS.DISBURSEMENT_DATE' },
      { field: 'transactionDateVal', header: 'LOANS.TRANSACTION_DATE' },
      { field: 'statusName', header: 'LOANS.STATUS' }
      //{ field: 'Action', header: 'ACTION' },

    ];
    this.paymentOptions = [
      { label: 'Cash', value: 1 },
      { label: 'Transfer', value: 2 }
    ];
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.loanId = this.encryptService.decrypt(params['id']);
        if (this.loanId != null && this.loanId != undefined) {
          this.getSaoDisbursmentDetailsByLoanApplicationId(this.loanId);
        }
        this.isEdit = true;

      } else {
        this.isEdit = false;
        this.disbursementModel = new SaoLoanDisbursement();
      }
    });
    this.disbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
    this.disbursementModel.dueDisbursmentDateVal = this.commonFunctionsService.currentDate();
    this.disbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
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
  }
  getApplicationDetailsById(id: any) {
    // this.submitDisable = true;

    this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.getSaoDisbursmentDetailsByLoanApplicationId(id);
        this.getSchedulesByApplicationId();
        this.saoLoanApplicationModel = this.responseModel.data[0];

        if (this.saoLoanApplicationModel.applicationDate != null && this.saoLoanApplicationModel.applicationDate != undefined)
          this.saoLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.saoLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);

        if (this.saoLoanApplicationModel.loanApprovedDate != null && this.saoLoanApplicationModel.loanApprovedDate != undefined)
          this.saoLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.saoLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);

        if (this.saoLoanApplicationModel.loanDueDate != null && this.saoLoanApplicationModel.loanDueDate != undefined)
          this.saoLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.saoLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);

        if (this.saoLoanApplicationModel.saoProductId != null && this.saoLoanApplicationModel.saoProductId != undefined) {
          this.getProductDetailsById(this.saoLoanApplicationModel.saoProductId);
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
        if (this.individualMemberDetailsModel.isKycApproved != null && this.individualMemberDetailsModel.isKycApproved != undefined && this.individualMemberDetailsModel.isKycApproved) {
          this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
        }
        else {
          this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
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
 * @implements getProductDetailsById saoProductId
 * @author akhila
 */
  getProductDetailsById(id: any) {
    this.saoProductDefinitionsService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.saoProductDetailsModel = this.responseModel.data[0];

        if (this.saoProductDetailsModel.purposeName != undefined && this.saoProductDetailsModel.purposeName != null)
          this.saoLoanApplicationModel.purposeName = this.saoProductDetailsModel.purposeName;

        if (this.saoProductDetailsModel.maxLoanPeriod != undefined && this.saoProductDetailsModel.maxLoanPeriod != null)
          this.saoLoanApplicationModel.maxLoanPeriod = this.saoProductDetailsModel.maxLoanPeriod;


        if (this.saoProductDetailsModel.interestPostingFrequencyName != undefined && this.saoProductDetailsModel.interestPostingFrequencyName != null)
          this.saoLoanApplicationModel.repaymentFrequencyName = this.saoProductDetailsModel.interestPostingFrequencyName;

        if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != null && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != undefined) {

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != null)
            this.saoLoanApplicationModel.penalInterest = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != null)
            this.saoLoanApplicationModel.iod = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != null)
            this.saoLoanApplicationModel.effectiveRoi = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi;

        }
      }
    });
  }
/**
 * @implements edit getSaoDisbursmentDetails
 * @author akhila
 */
  edit(rowData: any) {
    this.isEditDeleteButtonEnable = true;
    this.addOrEdit = true;
    this.editDisable = true;
    this.saoDisbursementService.getSaoDisbursementById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.commonComponent.stopSpinner();
          this.disbursementModel = this.responseModel.data[0];
          this.disbursementModel.disbursementDateVal = this.datePipe.transform(this.disbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
          this.disbursementModel.transactionDateVal = this.datePipe.transform(this.disbursementModel.transactionDate, this.orgnizationSetting.datePipe);
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
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 1000);
    });

  }

  showDialog() {
    this.visible = true;
  }
 /**
 * @implements getSaoDisbursmentDetailsByLoanApplicationId
 * @author akhila
 */
  getSaoDisbursmentDetailsByLoanApplicationId(loanId: any) {
    this.dueAmount = 0;
    this.disburmentAmount = 0;
    this.isEditDeleteButtonEnable = false;
    this.saoDisbursementService.getSaoDisbursmentDetailsByLoanApplicationId(loanId).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.gridList = this.responseModel.data;
        this.gridList = this.gridList.filter(data => data.disbursementDate != null && data.transactionDate != null).map(count => {
          count.disbursementDateVal = this.datePipe.transform(count.disbursementDate, this.orgnizationSetting.datePipe);
          count.transactionDateVal = this.datePipe.transform(count.transactionDate, this.orgnizationSetting.datePipe);
          if (count.statusName == applicationConstants.SUBMISSION_FOR_APPROVAL) {
            count.submissionForApproval = true;
            count.actionButton = false;
            count.edit = false;
          }
          else if (count.statusName == applicationConstants.CREATED || count.accountStatusName == applicationConstants.IN_PROGRESS) {
            count.created = true;
            count.edit = true;
          }
          else if (count.statusName == applicationConstants.REQUEST_FOR_RESUBIMSSION) {
            count.requestForResubmmission = true;
          }
          else if (count.statusName == applicationConstants.APPROVED) {
            count.approved = true;
            this.disburmentAmount = this.disburmentAmount + count.disbursementAmount;
          }
          this.totalDisbursement = this.totalDisbursement + count.disbursementAmount;
          if (count.statusName == CommonStatusData.SCHEDULED) {
            count.scheduled = true;
            this.dueAmount = this.dueAmount + count.disbursementAmount;
            this.editDisable = false;
          }
          else {
            this.editDisable = true;
          }
          return count;
        });
        this.nextDisbursmentDate = Math.min(...this.gridList.filter((obj: any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
        this.nextDisbursmentDate = this.datePipe.transform(this.nextDisbursmentDate, this.orgnizationSetting.datePipe);
        this.disbursmentDueDate = Math.max(...this.gridList.filter((obj: any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
        this.disbursmentDueDate = this.datePipe.transform(this.disbursmentDueDate, this.orgnizationSetting.datePipe);

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
  onClickMemberIndividualMoreDetails() {
    this.showForm = true
  }
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }
  /**
 * @implements add disbursemt
 * @author akhila
 */
  addDisbursment() {
    this.disbursementModel.disbursementAmount = null;
    this.disbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
    this.disbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
    this.disbursementModel.isPhotoSignVerfied = null;
    this.disbursementModel.id = null;
    this.addOrEdit = true;
    this.editDisable = true;
  }

  /**
   * @implements close disbursemtn
   * @author akhila
   */
  closeDisbursement() {
    this.addOrEdit = false;
    this.editDisable = false;
  }

  /**
   * @implements get schedule by application 
   * @author akhila
   */
  getSchedulesByApplicationId() {
    this.disburmentAmount = 0;
    this.isEditDeleteButtonEnable = false;
    this.saoDisbursementService.getSaoLoanDisbursementScheduleByLoanApplicationId(this.loanId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.disbursementScheduleList = this.responseModel.data;
            const currentDate = new Date();
          
            this.disbursementScheduleList = this.disbursementScheduleList.map((schedule: { visitNumber: any; tenureTypeName: any;disbursementPercentage: number; visitTenure: number; }) => {
             
        
              const percentage = (schedule.disbursementPercentage / 100) * this.saoLoanApplicationModel.requestedAmount;;
            
              const visitTenure = schedule.visitTenure ?? 0;
          
              const disbursementDate = new Date(currentDate);
              disbursementDate.setDate(disbursementDate.getDate() + visitTenure);
              const formattedDate = `${String(disbursementDate.getDate()).padStart(2, '0')}/${String(disbursementDate.getMonth() + 1).padStart(2, '0')}/${disbursementDate.getFullYear()}`;
          
              return {
                disbursementOrder: schedule.visitNumber,
                typeName: schedule.tenureTypeName,
                disbursementAmount: percentage,
                disbursementDateVal: formattedDate
              };
            });
          }
          else {
            this.addOrEdit = false;
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
  /**
  * @implements add or update disbursment
  * @author akhila
  */
  addOrUpdate() {
    if (this.saoLoanApplicationModel.sanctionAmount != null && this.saoLoanApplicationModel.sanctionAmount != undefined && this.disbursementModel.disbursementAmount != null && this.disbursementModel.disbursementAmount != undefined && this.saoLoanApplicationModel.sanctionAmount < this.disbursementModel.disbursementAmount) {
      this.loanDisubursementForm.get("disbursementAmount")?.reset();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: "Disbursement Amount Should Not be Greater Sanction Amount" }];
      setTimeout(() => {
        this.msgs = [];
        this.getSaoDisbursmentDetailsByLoanApplicationId(this.loanId);
        this.cancelOrRefresh();
      }, 2000);
    }
    else {
      this.commonComponent.startSpinner();
      this.disbursementModel.pacsId = this.pacsId;
      this.disbursementModel.branchId = this.branchId;
      this.disbursementModel.saoLoanApplicationId = this.loanId;
      // this.disbursementModel.accountNumber = this.saoLoanApplicationModel.accountNumber;
      this.disbursementModel.saoProductId = this.saoLoanApplicationModel.saoProductId;
      if (this.disbursementModel.disbursementDateVal != null && this.disbursementModel.disbursementDateVal != undefined) {
        this.disbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.disbursementModel.disbursementDateVal));
      }
      if (this.disbursementModel.transactionDateVal != null && this.disbursementModel.transactionDateVal != undefined) {
        this.disbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.disbursementModel.transactionDateVal));
      }

      if (this.disbursementModel.id != undefined) {
        this.saoDisbursementService.updateSaoDisbursement(this.disbursementModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.addOrEdit = false;
            this.editDisable = false;
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getSaoDisbursmentDetailsByLoanApplicationId(this.loanId);
              this.cancelOrRefresh();
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
        let disbursements = this.gridList.filter((obj: any) => obj.statusName == CommonStatusData.SCHEDULED)
        if (disbursements != null && disbursements != undefined && disbursements.length > 0) {
          this.loanDisubursementForm.reset();
          this.cancelOrRefresh();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: "Please Release The Pending Disbursement" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
          this.addOrEdit = false;
          // this.editDisable = false;
        }
        else {
          this.disbursementModel.statusName = CommonStatusData.SCHEDULED;
          this.saoDisbursementService.addSaoDisbursement(this.disbursementModel).subscribe((response: any) => {
            this.responseModel = response;
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.commonComponent.stopSpinner();
              this.addOrEdit = false;
              this.editDisable = false;
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
                this.getSaoDisbursmentDetailsByLoanApplicationId(this.loanId);
                this.cancelOrRefresh();
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

    }
  }
  /**
    * @implements cancle or refresh
    * @author akhila
    */
  cancelOrRefresh() {
    this.disbursementModel.disbursementAmount = null;
    this.disbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
    this.disbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
    this.disbursementModel.isPhotoSignVerfied = null;
    this.disbursementModel.id = null;
  }

  /**
   * @implements cancle pop up
   * @author akhila
   */
  canclePopUp() {
    this.addOrEdit = false;
    this.editDisable = false;
  }
}
