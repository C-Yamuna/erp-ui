import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SaoLoanApplication, SaoLoanInsuranceDetailsModel } from '../../shared/sao-loan-application.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { SaoInterestPolicyConfigModel, SaoLoanDisbursementScheduleModel, SaoProductDetails } from './shared/sao-product-details.model';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { SaoProductDefinitionsService } from '../../sao-product-definition/shared/sao-product-definitions.service';
import { IndividualMemberDetailsModel } from '../membership-basic-details/shared/membership-basic-details.model';
import { MembershipBasicDetailsService } from '../membership-basic-details/shared/membership-basic-details.service';
import { SaoLoanDisbursementScheduleService } from '../../../shared/sao-loans/sao-loan-disbursement-schedule.service';
import { SaoLoanDisbursement } from '../../sao-operations/sao-loan-disbursment/shared/sao-loan-disbursement.model';
import { SaoDisbursementService } from '../../../shared/sao-loans/sao-disbursement.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { SaoProductDefinition } from '../../sao-product-definition/shared/sao-product-definition.model';
import { SaoProductPurposeService } from '../../sao-product-definition/sao-product-definition-stepper/sao-prod-purpose-config/shared/sao-product-purpose.service';

@Component({
  selector: 'app-sao-product-details',
  templateUrl: './sao-product-details.component.html',
  styleUrls: ['./sao-product-details.component.css']
})
export class SaoProductDetailsComponent {
  @ViewChild('dt', { static: false })
  private dt!: Table;
  apllicationdetailsform: FormGroup;
  insurencedetailsform: FormGroup;
  schedulerForm: FormGroup;
  gender: any[] = [];
  maritalstatus: any[] | undefined;
  product: any;
  loanpurposeList: any[] = [];
  operationtype: any[] | undefined;
  admissionnumber: any;
  responseModel!: Responsemodel;
  productList: any[] = [];
  cropAndLandDEtailsList: any[] = [];
  coveredVillagesList: any[] = [];
  seasonTypesList: any[] = [];
  cropTypesList: any[] = [];
  soilTypeList: any[] = [];
  operationList: any[] = [];
  repaymentFrequencyList: any[] = [];
  pacsId: any;
  isEdit: boolean = false;
  msgs: any[] = [];
  requestedAmount: any;
  savedId: any;
  societyId: any;
  branchId: any;
  id: any;
  rowEdit: boolean = false;
  addButton: boolean = false;
  orgnizationSetting: any;
  saoLoanApplicatonModel: SaoLoanApplication = new SaoLoanApplication();
  saoProductDetailsModel: SaoProductDefinition = new SaoProductDefinition();
  individualMemberDetailsModel: IndividualMemberDetailsModel = new IndividualMemberDetailsModel();
  saoLoanInsuranceDetailsModel: SaoLoanInsuranceDetailsModel = new SaoLoanInsuranceDetailsModel();
  saoInterestPolicyConfigModel: SaoInterestPolicyConfigModel = new SaoInterestPolicyConfigModel();
  statusList: any[] = [];
  isDisableFlag: boolean = false;
  disbursmentScheduleList: any[] = [];
  fieldVisitList: any[] = [];
  collectionTypeList: any[] = [];
  editDeleteDisable: boolean = false;
  saveAndNextDisable: boolean = false;
  displayDialog: boolean = false;
  productInfoFalg: boolean = false;
  isProductDisable: boolean = false;
  scheduleRecordsCount: any;
  collateralList: any[] = [];
  interestPolicyList: any[] = [];
  collectionOrderList: any[] = [];
  linkedShareCapitalList: any[] = [];
  chargesList: any[] = [];
  purposeList: any[] = [];
  requiredDocumentsList: any[] = [];
  disbursmentFlag: boolean = false;

  saoLoanDisbursementModel: SaoLoanDisbursement = new SaoLoanDisbursement();
  // saoLoanDisbursementScheduleModel: SaoLoanDisbursementScheduleModel = new SaoLoanDisbursementScheduleModel();

  insurenceFlag: boolean = false;
  constructor(private router: Router, private formBuilder: FormBuilder, private saoProductDefinitionsService: SaoProductDefinitionsService, private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent, private encryptDecryptService: EncryptDecryptService, private saoLoanApplicationService: SaoLoanApplicationService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
    private saoLoanDisbursementService: SaoDisbursementService,
  ) {

    this.apllicationdetailsform = this.formBuilder.group({
      saoProductName: ['', [Validators.required]],
      accountNumber: [{ value: '', disabled: true }],
      effectiveRoi: [{ value: '', disabled: true }],
      societyAccountNumber: ['', [Validators.required, Validators.minLength(3)]],
      applicationDate: [{ value: '', disabled: true }],
      // minLoanPeriod: [{ value: '', disabled: true }],
      // maxLoanPeriod: [{ value: '', disabled: true }],
      penalInterest: [{ value: '', disabled: true }],
      iod: [{ value: '', disabled: true }],
      repaymentFrequency: [, [Validators.required]],
      purposeName: [{ value: '', disabled: true }],
      operationTypeName: ['', [Validators.required, Validators.minLength(3)]],
      requestedAmount: ['', [Validators.required, Validators.minLength(3)]],
      sanctionAmount: ['', [Validators.required]],
      loanPeriod: ['', [Validators.required]],
      loanDueDate: ['', [Validators.required]],
      sanctionDate: ['', [Validators.required]],
      // plannedDisbursements: ['', [Validators.required]],
      applicationNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      annualIncome: ['', [Validators.required]],
      // cgstAmount:['', ],
      // sgstAmount: ['', ],
      // igstAmount: ['',],
      // totalCharges: ['', ],
    })

    this.insurencedetailsform = this.formBuilder.group({
      policyName: new FormControl('', [Validators.required, Validators.pattern(applicationConstants.NEW_NAME_PATTERN)]),
      policyNumber: new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      premium: ['', [Validators.required, Validators.minLength(3)]],
    })

    this.schedulerForm = this.formBuilder.group({
      'disbursementOrder': ['', Validators.required],
      'typeName': ['', Validators.required],
      'disbursementAmount': ['', Validators.required],
      'disbursementLimit': ['', Validators.required],
      // 'minDaysForDisbursement':  ['', Validators.required],
      'remarks': ['',],
      'statusName': ['',],
    })
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.getAllOperationTypes();
    this.getAllRepaymentFrequency();
    this.collectionTypeList = [
      { label: 'Amount', value: 1 },
      { label: 'Percentage', value: 2 },
    ];
    this.statusList = this.commonComponent.status();
    this.gender = this.commonComponent.genderList();
    this.maritalstatus = this.commonComponent.maritalStatusList();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.savedId = id;
        this.isEdit = true;
        this.getSaoLoanApplicationDetailsById(this.savedId);
        this.getInsurenceDetailsByApplicationId(this.savedId);

        this.commonComponent.stopSpinner();

      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })
    this.apllicationdetailsform.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.apllicationdetailsform.valid) {
        this.save();
      }
    });
    this.insurencedetailsform.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.insurencedetailsform.valid) {
        this.save();
      }
    });
    this.apllicationdetailsform.get('requestedAmount')?.valueChanges.subscribe(amount => {
      this.requestedAmount = amount;
      if (this.saoProductDetailsModel?.saoLoanDisbursementScheduleDTOList) {
        this.calculateDisbursement();
      }
    });
    this.pacsId = 1;
    this.getAllActiveProductsList();
  }

  getAllActiveProductsList() {
    this.saoProductDefinitionsService.getActiveProductsBasedOnPacsId(this.pacsId).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.productList = this.responseModel.data;
        this.productList = this.productList.filter((obj: any) => obj != null && obj.status == 3).map((product: { name: any; id: any; }) => {
          return { label: product.name, value: product.id };
        });
      }
    });
  }


  onSelectLoanDueDate() {
    let flag = false;
    this.msgs = [];
    if (this.saoLoanApplicatonModel.loanDueDateVal != undefined) {
      this.saoLoanApplicatonModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanApplicatonModel.loanDueDateVal));

      if (this.saoLoanApplicatonModel.applicationDateVal != undefined)
        this.saoLoanApplicatonModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanApplicatonModel.applicationDateVal));

      if (this.saoLoanApplicatonModel.sanctionDateVal != undefined)
        this.saoLoanApplicatonModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanApplicatonModel.sanctionDateVal));
      if (this.saoLoanApplicatonModel.individualMemberDetailsDTO != null) {
        if (!flag && this.saoLoanApplicatonModel.individualMemberDetailsDTO.admissionDate != undefined && this.saoLoanApplicatonModel.individualMemberDetailsDTO.admissionDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else if (!flag && this.saoLoanApplicatonModel.applicationDate != undefined && this.saoLoanApplicatonModel.applicationDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.saoLoanApplicatonModel.sanctionDate != undefined && this.saoLoanApplicatonModel.sanctionDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_SANCTION_DATE }];
        }
      } else if (this.saoLoanApplicatonModel.memberGroupDetailsDTO != null) {
        if (!flag && this.saoLoanApplicatonModel.memberGroupDetailsDTO.admissionDate != undefined && this.saoLoanApplicatonModel.memberGroupDetailsDTO.admissionDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else if (!flag && this.saoLoanApplicatonModel.applicationDate != undefined && this.saoLoanApplicatonModel.applicationDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.saoLoanApplicatonModel.sanctionDate != undefined && this.saoLoanApplicatonModel.sanctionDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_SANCTION_DATE }];
        }
      } else {
        if (!flag && this.saoLoanApplicatonModel.memberInstitutionDTO.admissionDate != undefined && this.saoLoanApplicatonModel.memberInstitutionDTO.admissionDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else if (!flag && this.saoLoanApplicatonModel.applicationDate != undefined && this.saoLoanApplicatonModel.applicationDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.saoLoanApplicatonModel.sanctionDate != undefined && this.saoLoanApplicatonModel.sanctionDate > this.saoLoanApplicatonModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_SANCTION_DATE }];
        }
      }


      if (flag) {
        this.apllicationdetailsform.get('loanDueDate')?.reset();
        this.saoLoanApplicatonModel.loanDueDate = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
  }
  onSelectSanctionDate() {
    let flag = false;
    this.msgs = [];
    if (this.saoLoanApplicatonModel.sanctionDateVal != undefined) {
      this.saoLoanApplicatonModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanApplicatonModel.sanctionDateVal));

      if (this.saoLoanApplicatonModel.applicationDateVal != undefined)
        this.saoLoanApplicatonModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanApplicatonModel.applicationDateVal));

      if (this.saoLoanApplicatonModel.loanDueDateVal != undefined)
        this.saoLoanApplicatonModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanApplicatonModel.loanDueDateVal));
      if (this.saoLoanApplicatonModel.individualMemberDetailsDTO != null) {
        if (!flag && this.saoLoanApplicatonModel.individualMemberDetailsDTO.admissionDate != undefined && this.saoLoanApplicatonModel.individualMemberDetailsDTO.admissionDate > this.saoLoanApplicatonModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else
          if (!flag && this.saoLoanApplicatonModel.applicationDate != undefined && this.saoLoanApplicatonModel.applicationDate > this.saoLoanApplicatonModel.sanctionDate
          ) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_BE_IN_BETWEEN_MIN_AND_MAX_DATES }];
          } else if (this.saoLoanApplicatonModel.sanctionDate >= this.saoProductDetailsModel.endDate && this.saoLoanApplicatonModel.sanctionDate <= this.saoProductDetailsModel.effectiveStartDate) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];

          }
          else if (!flag && this.saoLoanApplicatonModel.loanDueDate != undefined && this.saoLoanApplicatonModel.loanDueDate < this.saoLoanApplicatonModel.sanctionDate) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
          }
      } else if (this.saoLoanApplicatonModel.memberGroupDetailsDTO != null) {
        if (!flag && this.saoLoanApplicatonModel.memberGroupDetailsDTO.admissionDate != undefined && this.saoLoanApplicatonModel.memberGroupDetailsDTO.admissionDate > this.saoLoanApplicatonModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else
          if (!flag && this.saoLoanApplicatonModel.applicationDate != undefined && this.saoLoanApplicatonModel.applicationDate > this.saoLoanApplicatonModel.sanctionDate
          ) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_BE_IN_BETWEEN_MIN_AND_MAX_DATES }];
          } else if (this.saoLoanApplicatonModel.sanctionDate >= this.saoProductDetailsModel.endDate && this.saoLoanApplicatonModel.sanctionDate <= this.saoProductDetailsModel.effectiveStartDate) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];

          }
          else if (!flag && this.saoLoanApplicatonModel.loanDueDate != undefined && this.saoLoanApplicatonModel.loanDueDate < this.saoLoanApplicatonModel.sanctionDate) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
          }
      } else {
        if (!flag && this.saoLoanApplicatonModel.memberInstitutionDTO.admissionDate != undefined && this.saoLoanApplicatonModel.memberInstitutionDTO.admissionDate > this.saoLoanApplicatonModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else
          if (!flag && this.saoLoanApplicatonModel.applicationDate != undefined && this.saoLoanApplicatonModel.applicationDate > this.saoLoanApplicatonModel.sanctionDate
          ) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_BE_IN_BETWEEN_MIN_AND_MAX_DATES }];
          } else if (this.saoLoanApplicatonModel.sanctionDate >= this.saoProductDetailsModel.endDate && this.saoLoanApplicatonModel.sanctionDate <= this.saoProductDetailsModel.effectiveStartDate) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];

          }
          else if (!flag && this.saoLoanApplicatonModel.loanDueDate != undefined && this.saoLoanApplicatonModel.loanDueDate < this.saoLoanApplicatonModel.sanctionDate) {
            flag = true;
            this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
          }
        this.calculateLoanDueDate();
      }
      if (flag) {
        this.apllicationdetailsform.get('sanctionDate')?.reset();
        this.saoLoanApplicatonModel.sanctionDate = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }

    }
    this.calculateLoanDueDate();
  }

  getAllRepaymentFrequency() {

    this.saoLoanApplicationService.getAllRepaymentFrequency().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {

        this.repaymentFrequencyList = this.responseModel.data.filter((repaymentFrequency: { status: number; }) => repaymentFrequency.status == applicationConstants.ACTIVE).map((repaymentFrequency: any) => {
          return { label: repaymentFrequency.name, value: repaymentFrequency.id };
        });
      }
    },
      error => {
        this.msgs = [];

        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  /**
     * @implements PeriodInMonths in between min and max PeriodInMonths for product definition
     * @author akhila
     */
  onSelectPeriodInMonths(months: any) {
    let flag = false;
    if (months != undefined) {
      if (months != undefined && months >= this.saoProductDetailsModel.minLoanPeriod &&
        months <= this.saoProductDetailsModel.maxLoanPeriod) {
        flag = true;
      }
      else {
        flag = false;
      }
      if (!flag) {
        this.msgs = [{
          severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: "Loan period in months should be in between minLoanPeriod and maxLoanPeriod" + this.saoProductDetailsModel.minLoanPeriod
            + "," + this.saoProductDetailsModel.maxLoanPeriod
        }];
        this.apllicationdetailsform.get('loanPeriod')?.reset();
        this.saoLoanApplicatonModel.loanPeriod = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }

    }
    this.calculateLoanDueDate();
  }
  /**
  * @implements loan due date based on sanction date and loan period in months
  * @author akhila
  */
  calculateLoanDueDate() {
    if (this.saoLoanApplicatonModel.sanctionDateVal && this.saoLoanApplicatonModel.loanPeriod) {
      let sanctionDate = new Date(this.saoLoanApplicatonModel.sanctionDateVal);
      let loanPeriodMonths = parseInt(this.saoLoanApplicatonModel.loanPeriod, 10);
      if (!isNaN(loanPeriodMonths) && loanPeriodMonths > 0) {
        sanctionDate.setMonth(sanctionDate.getMonth() + loanPeriodMonths);
        this.saoLoanApplicatonModel.loanDueDateVal = new Date(sanctionDate);
      }
    }
  }

  /**
      * @implements SanctionAmount in between min and max amount for product definition
      * @author m.akhila
   */
  onSelectSanctionAmountCailculation(sanctionAmount: any) {
    let flag = false;
    if (sanctionAmount != undefined) {
      if (sanctionAmount != undefined && this.saoLoanApplicatonModel.sanctionAmount >= this.saoProductDetailsModel.eligibleMInAmount &&
        sanctionAmount <= this.saoProductDetailsModel.eligibleMaxAmount) {
        flag = true;
      }
      else {
        flag = false;
      }
      if (!flag) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: "Sanction amount should be in between Min and Max Amounts" + this.saoProductDetailsModel.eligibleMInAmount + "," + this.saoProductDetailsModel.eligibleMaxAmount }];
        this.apllicationdetailsform.get('sanctionAmount')?.reset();
        this.saoLoanApplicatonModel.sanctionAmount = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }

    }
  }

  getSaoLoanApplicationDetailsById(id: any) {
    this.commonFunctionsService
    this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(this.savedId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {

            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.saoLoanApplicatonModel = this.responseModel.data[0];

                if (this.saoLoanApplicatonModel.applicationDate == null || this.saoLoanApplicatonModel.applicationDate == undefined) {
                  this.saoLoanApplicatonModel.applicationDateVal = this.commonFunctionsService.currentDate();

                  if (this.saoLoanApplicatonModel.applicationDateVal != null && this.saoLoanApplicatonModel.applicationDateVal != undefined) {
                    this.saoLoanApplicatonModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTimedateConversionToLong(this.saoLoanApplicatonModel.applicationDateVal);
                  }
                }
                else if (this.saoLoanApplicatonModel.applicationDate != null && this.saoLoanApplicatonModel.applicationDate != undefined) {
                  this.saoLoanApplicatonModel.applicationDateVal = this.commonFunctionsService.dateConvertionIntoFormate(this.saoLoanApplicatonModel.applicationDate);
                }
                if (this.saoLoanApplicatonModel.sanctionDate != null && this.saoLoanApplicatonModel.sanctionDate != undefined)
                  this.saoLoanApplicatonModel.sanctionDateVal = this.datePipe.transform(this.saoLoanApplicatonModel.sanctionDate, this.orgnizationSetting.datePipe);

                if (this.saoLoanApplicatonModel.loanDueDate != null && this.saoLoanApplicatonModel.loanDueDate != undefined) {
                  this.saoLoanApplicatonModel.loanDueDateVal = this.datePipe.transform(this.saoLoanApplicatonModel.loanDueDate, this.orgnizationSetting.datePipe);
                }
                if (this.saoLoanApplicatonModel.saoProductId != null && this.saoLoanApplicatonModel.saoProductId != undefined) {

                  this.productInfoFalg = true;
                  this.getProductDetailsById(this.saoLoanApplicatonModel.saoProductId);
                  this.isProductDisable = applicationConstants.TRUE;
                }
                // if (this.saoLoanApplicatonModel.saoDisbursementDTOList != null) {
                //   this.disbursmentScheduleList = this.saoLoanApplicatonModel.saoDisbursementDTOList;
                // }
                if (this.saoLoanApplicatonModel.plannedDisbursements != null && this.saoLoanApplicatonModel.plannedDisbursements != undefined) {
                  this.scheduleRecordsCount = this.saoLoanApplicatonModel.plannedDisbursements;
                } else {
                  // this.saoLoanApplicatonModel.plannedDisbursements = this.disbursmentScheduleList.length;
                  this.scheduleRecordsCount = this.saoLoanApplicatonModel.plannedDisbursements;
                }
                // if (this.saoLoanApplicatonModel.plannedDisbursements == null || this.saoLoanApplicatonModel.plannedDisbursements == 0) {
                //   this.apllicationdetailsform.get('plannedDisbursements')?.enable();
                //   this.addButton = false;
                // } else {
                //   this.apllicationdetailsform.get('plannedDisbursements')?.disable();
                //   if (this.saoLoanApplicatonModel.plannedDisbursements == this.disbursmentScheduleList.length)
                //     this.addButton = true;
                // }
              }
            }
          }
        }
      }
    });

  }
  getInsurenceDetailsByApplicationId(id: any) {
    this.saoLoanApplicationService.getInsurenceDetailsByApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {

            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.saoLoanInsuranceDetailsModel = this.responseModel.data[0];
              }
            }
          }
        }
      }
    });
  }

  updateData() {
    if (this.insurenceFlag) {
      this.saveAndNextDisable = (!((this.apllicationdetailsform.valid) && (this.insurencedetailsform.valid))) || this.editDeleteDisable;
    }
    else {
      this.saveAndNextDisable = (!(this.apllicationdetailsform.valid)) || this.editDeleteDisable;
    }
    // this.saveAndNextDisable = !(this.apllicationdetailsform.valid && this.insurencedetailsform.valid);
    this.saoLoanApplicatonModel.saoLoanInsuranceDetailsDTO = this.saoLoanInsuranceDetailsModel;
    this.saoLoanApplicationService.changeData({
      formValid: !this.apllicationdetailsform.valid ? true : false,
      data: this.saoLoanApplicatonModel,
      isDisable: this.saveAndNextDisable,
      stepperIndex: 2,
    });
  }

  save() {
    this.updateData();
  }
  onChangeProduct(event: any) {
    this.displayDialog = true;
    this.productInfoFalg = true;
    if (event.value != null && event.value != undefined) {
      this.getProductDetailsById(event.value);
    }
  }
  productViewPopUp() {
    this.displayDialog = true;
    if (this.saoLoanApplicatonModel.saoProductId != null && this.saoLoanApplicatonModel.saoProductId != undefined) {
      this.getProductDetailsById(this.saoLoanApplicatonModel.saoProductId);
    }
    else {
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: "Please Select Product" }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }

  }
  /**
     * @implements get operation Types 
     * @author akhila
     */
  getAllOperationTypes() {
    this.saoLoanApplicationService.getAllOperationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.operationList = this.responseModel.data;
            this.operationList = this.operationList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
        }
        if (this.saoLoanApplicatonModel.operationTypeId != undefined) {
          const filteredItem = this.operationList.find((item: { value: any; }) => item.value === this.saoLoanApplicatonModel.operationTypeId);
          this.saoLoanApplicatonModel.operationTypeName = filteredItem.label;
        }
      }
    }, error => {
      this.msgs = [];

      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    })
  }
  calculateDisbursement() {
    if (!this.saoLoanApplicatonModel.requestedAmount || !this.disbursmentScheduleList) {
      this.disbursmentScheduleList = []; // Reset list if data is incomplete
      return;
    }

    const requestedAmount = this.saoLoanApplicatonModel.requestedAmount;
    const currentDate = new Date();

    this.disbursmentScheduleList = this.saoProductDetailsModel.saoLoanDisbursementScheduleDTOList.map((schedule: { visitNumber: any; tenureTypeName: any; disbursementPercentage: number; visitTenure: number; }) => {
      const percentage = (schedule.disbursementPercentage / 100) * this.requestedAmount;

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
  getProductDetailsById(id: any) {
    this.saoProductDefinitionsService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.saoProductDetailsModel = this.responseModel.data[0];
        if (null != this.saoProductDetailsModel.effectiveStartDate && undefined != this.saoProductDetailsModel.effectiveStartDate)
          this.saoProductDetailsModel.effectiveStartDate = this.datePipe.transform(this.saoProductDetailsModel.effectiveStartDate, this.orgnizationSetting.datePipe);

        if (this.saoProductDetailsModel.saoProdCollateralsConfigList) {
          this.collateralList = this.saoProductDetailsModel.saoProdCollateralsConfigList
            .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
            .map((item: { collateralTypeName: string, collateralType: any }) => ({
              label: item.collateralTypeName,
              value: item.collateralType
            }));
        }

        if (this.saoProductDetailsModel.purposeName != undefined && this.saoProductDetailsModel.purposeName != null)
          this.saoLoanApplicatonModel.purposeName = this.saoProductDetailsModel.purposeName;

        if (this.saoProductDetailsModel.maxLoanPeriod != undefined && this.saoProductDetailsModel.maxLoanPeriod != null)
          this.saoLoanApplicatonModel.maxLoanPeriod = this.saoProductDetailsModel.maxLoanPeriod;

        this.insurenceFlag = this.saoProductDetailsModel.isInsuranceAppicable;
        if (this.insurenceFlag) {
          if (this.saoLoanApplicatonModel.saoLoanInsuranceDetailsDTO != null && this.saoLoanApplicatonModel.saoLoanInsuranceDetailsDTO != undefined)
            this.saoLoanInsuranceDetailsModel = this.saoLoanApplicatonModel.saoLoanInsuranceDetailsDTO;
        }

        if (this.saoProductDetailsModel.isInsuranceAppicable != null && this.saoProductDetailsModel.isInsuranceAppicable != undefined && this.saoProductDetailsModel.isInsuranceAppicable)
          this.saoProductDetailsModel.isInsuranceAppicable = applicationConstants.YES;
        else
          this.saoProductDetailsModel.isInsuranceAppicable = applicationConstants.NO

        if (this.saoProductDetailsModel.interestPostingFrequency != undefined && this.saoProductDetailsModel.interestPostingFrequency != null)
          this.saoLoanApplicatonModel.repaymentFrequency = this.saoProductDetailsModel.interestPostingFrequency;

        if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != null && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != undefined) {

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != null)
            this.saoLoanApplicatonModel.penalInterest = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != null)
            this.saoLoanApplicatonModel.iod = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != null)
            this.saoLoanApplicatonModel.effectiveRoi = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi;

          this.interestPolicyList = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList;
          this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });

        }
        if (this.saoProductDetailsModel.saoApportionConfigDTOList != null && this.saoProductDetailsModel.saoApportionConfigDTOList != undefined && this.saoProductDetailsModel.saoApportionConfigDTOList.length > 0) {
          this.collectionOrderList = this.saoProductDetailsModel.saoApportionConfigDTOList;
          this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }
        if (this.saoProductDetailsModel.saoLoanLinkedSharecapitalConfigList != null && this.saoProductDetailsModel.saoLoanLinkedSharecapitalConfigList != undefined && this.saoProductDetailsModel.saoLoanLinkedSharecapitalConfigList.length > 0) {
          this.linkedShareCapitalList = this.saoProductDetailsModel.saoLoanLinkedSharecapitalConfigList;
          this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }

        if (this.saoProductDetailsModel.saoProductChargesConfigDTOList != null && this.saoProductDetailsModel.saoProductChargesConfigDTOList != undefined && this.saoProductDetailsModel.saoProductChargesConfigDTOList.length > 0) {
          this.chargesList = this.saoProductDetailsModel.saoProductChargesConfigDTOList;
          this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }
        // if (this.saoProductDetailsModel.saoProdPurPoseConfgList != null && this.saoProductDetailsModel.saoProdPurPoseConfgList != undefined && this.saoProductDetailsModel.saoProdPurPoseConfgList.length > 0) {
        //   this.purposeList = this.saoProductDetailsModel.saoProdPurPoseConfgList;
        //   this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        //     object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
        //     return object;
        //   });
        // }

        if (this.saoProductDetailsModel.saoRequiredDocumentsConfigDTOList != null && this.saoProductDetailsModel.saoRequiredDocumentsConfigDTOList != undefined && this.saoProductDetailsModel.saoRequiredDocumentsConfigDTOList.length > 0) {
          this.requiredDocumentsList = this.saoProductDetailsModel.saoRequiredDocumentsConfigDTOList;
          this.requiredDocumentsList = this.requiredDocumentsList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }
        if (this.saoProductDetailsModel.saoLoanFieldVisitConfigDTOList != null && this.saoProductDetailsModel.saoLoanFieldVisitConfigDTOList != undefined && this.saoProductDetailsModel.saoLoanFieldVisitConfigDTOList.length > 0) {
          this.fieldVisitList = this.saoProductDetailsModel.saoLoanFieldVisitConfigDTOList;
        }

        if (this.saoProductDetailsModel.saoLoanDisbursementScheduleDTOList != null && this.saoProductDetailsModel.saoLoanDisbursementScheduleDTOList != undefined && this.saoProductDetailsModel.saoLoanDisbursementScheduleDTOList.length > 0) {
          this.disbursmentScheduleList = this.saoProductDetailsModel.saoLoanDisbursementScheduleDTOList;
          this.calculateDisbursement();
          this.disbursmentFlag = true;
        } else {
          this.disbursmentFlag = false;
        }
      }
    });
  }

}
