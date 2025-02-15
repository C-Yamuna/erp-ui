import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  pacsId: any;
  isEdit: boolean = false;
  msgs: any[] = [];
  savedId: any;
  societyId: any;
  branchId: any;
  id: any;
  rowEdit: boolean = false;
  addButton: boolean = false;
  orgnizationSetting: any;
  saoLoanApplicatonModel: SaoLoanApplication = new SaoLoanApplication();
  saoProductDetailsModel: SaoProductDetails = new SaoProductDetails();
  individualMemberDetailsModel: IndividualMemberDetailsModel = new IndividualMemberDetailsModel();
  saoLoanInsuranceDetailsModel: SaoLoanInsuranceDetailsModel = new SaoLoanInsuranceDetailsModel();
  saoInterestPolicyConfigModel: SaoInterestPolicyConfigModel = new SaoInterestPolicyConfigModel();
  statusList: any[] = [];
  isDisableFlag: boolean = false;
  disbursmentScheduleList: any[] = [];
  collectionTypeList: any[] = [];
  editDeleteDisable: boolean = false;
  saveAndNextDisable: boolean = false;
  scheduleRecordsCount: any;
  
  saoLoanDisbursementModel: SaoLoanDisbursement = new SaoLoanDisbursement();
  // saoLoanDisbursementScheduleModel: SaoLoanDisbursementScheduleModel = new SaoLoanDisbursementScheduleModel();

  insurenceFlag: boolean = false;
  constructor(private router: Router, private formBuilder: FormBuilder, private saoProductDefinitionsService: SaoProductDefinitionsService, private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent, private encryptDecryptService: EncryptDecryptService, private saoLoanApplicationService: SaoLoanApplicationService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private membershipBasicDetailsService: MembershipBasicDetailsService,
    private saoLoanDisbursementService: SaoDisbursementService
  ) {

    this.apllicationdetailsform = this.formBuilder.group({
      saoProductName: ['', [Validators.required]],
      accountNumber: [{ value: '', disabled: true }],
      effectiveRoi: [{ value: '', disabled: true }],
      memberName: ['', [Validators.required, Validators.minLength(3)]],
      applicationDate: [{ value: '', disabled: true }],
      minLoanPeriod: [{ value: '', disabled: true }],
      maxLoanPeriod: [{ value: '', disabled: true }],
      penalInterest: [{ value: '', disabled: true }],
      iod: [{ value: '', disabled: true }],
      repaymentFrequencyName: [{ value: '', disabled: true }],
      purposeName: ['', [Validators.required, Validators.minLength(3)]],
      operationTypeName: ['', [Validators.required, Validators.minLength(3)]],
      requestedAmount: ['', [Validators.required, Validators.minLength(3)]],
      sanctionAmount: ['', [Validators.required, Validators.minLength(3)]],
      loanPeriod: ['',],
      loanDueDate: ['',],
      plannedDisbursements: ['', [Validators.required]],
      disbursedAmount: ['', ],
      // cgstAmount:['', ],
      // sgstAmount: ['', ],
      // igstAmount: ['',],
      // totalCharges: ['', ],
    })

    this.insurencedetailsform = this.formBuilder.group({
      policyName: ['', [Validators.required, Validators.minLength(3)]],
      policyNumber: ['', [Validators.required, Validators.minLength(3)]],
      premium:['', [Validators.required, Validators.minLength(3)]],
    })

    this.schedulerForm = this.formBuilder.group({
      'disbursementOrder': ['', Validators.required],
      'typeName':  ['', Validators.required],
      'disbursementAmount': ['', Validators.required],
      'disbursementLimit':  ['', Validators.required],
      // 'minDaysForDisbursement':  ['', Validators.required],
      'remarks': ['',],
      'statusName': ['',],
    })
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.operationList = [
      { label: 'single', value: 1 },
      { label: 'joint', value: 2 },
    ];
    this.collectionTypeList = [
      { label: 'Amount', value: 1 },
      { label: 'Percentage', value: 2 },
    ];
    this.statusList = this.commonComponent.status();
    this.gender = this.commonComponent.genderList();
    this.maritalstatus = this.commonComponent.maritalStatusList();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['flag'] != undefined) {
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
    this.pacsId = 1;
    this.getAllActiveProductsList();
    this.getAllLoanPurposes();
  }

  getAllActiveProductsList() {
    this.saoProductDefinitionsService.getActiveProductsBasedOnPacsId(this.pacsId).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.productList = this.responseModel.data;
        this.productList = this.productList.filter((obj: any) => obj != null && obj.status == 3).map((product: { name: any; id: any; }) => {
          return { label: product.name, value: product.id };
        });
        //this.productList.unshift({ label: 'select', value: 0 });
      }
    });
  }

  getAllLoanPurposes() {
    this.commonComponent.startSpinner();
    this, this.saoLoanApplicationService.getAllLoanPurposes().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.loanpurposeList = this.responseModel.data.filter((loanPurpose: { status: number; }) => loanPurpose.status == 1).map((loanPurpose: any) => {
          return { label: loanPurpose.name, value: loanPurpose.id };
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
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
                if (this.saoLoanApplicatonModel.loanDueDate != null && this.saoLoanApplicatonModel.loanDueDate != undefined) {
                  this.saoLoanApplicatonModel.loanDueDateVal = this.datePipe.transform(this.saoLoanApplicatonModel.loanDueDate, this.orgnizationSetting.datePipe);
                }
                if (this.saoLoanApplicatonModel.saoProductId != null && this.saoLoanApplicatonModel.saoProductId != undefined) {
                  this.getProductDetailsById(this.saoLoanApplicatonModel.saoProductId);
                }
                if (this.saoLoanApplicatonModel.saoDisbursementDTOList != null) {
                  this.disbursmentScheduleList = this.saoLoanApplicatonModel.saoDisbursementDTOList;
                }
                if (this.saoLoanApplicatonModel.plannedDisbursements != null && this.saoLoanApplicatonModel.plannedDisbursements != undefined) {
                  this.scheduleRecordsCount = this.saoLoanApplicatonModel.plannedDisbursements;
                }else{
                  this.saoLoanApplicatonModel.plannedDisbursements = this.disbursmentScheduleList.length;
                  this.scheduleRecordsCount = this.saoLoanApplicatonModel.plannedDisbursements;
                }
                if(this.saoLoanApplicatonModel.plannedDisbursements == null || this.saoLoanApplicatonModel.plannedDisbursements == 0){
                  this.apllicationdetailsform.get('plannedDisbursements')?.enable();
                  this.addButton = false;
                }else{
                  this.apllicationdetailsform.get('plannedDisbursements')?.disable();
                  if( this.saoLoanApplicatonModel.plannedDisbursements == this.disbursmentScheduleList.length)
                    this.addButton = true;
                }
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
    this.saveAndNextDisable = !(this.apllicationdetailsform.valid && this.insurencedetailsform.valid);
    
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


  getProductDetailsById(id: any) {
    this.saoProductDefinitionsService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.saoProductDetailsModel = this.responseModel.data[0];

        if (this.saoProductDetailsModel.minLoanPeriod != undefined && this.saoProductDetailsModel.minLoanPeriod != null)
          this.saoLoanApplicatonModel.minLoanPeriod = this.saoProductDetailsModel.minLoanPeriod;

        if (this.saoProductDetailsModel.maxLoanPeriod != undefined && this.saoProductDetailsModel.maxLoanPeriod != null)
          this.saoLoanApplicatonModel.maxLoanPeriod = this.saoProductDetailsModel.maxLoanPeriod;
        
        if(this.saoProductDetailsModel.isInsuranceAppicable != null && this.saoProductDetailsModel.isInsuranceAppicable != undefined){
          this.insurenceFlag = false;
        }else{
          this.insurenceFlag = true;
        }
        if (this.saoProductDetailsModel.interestPostingFrequencyName != undefined && this.saoProductDetailsModel.interestPostingFrequencyName != null)
          this.saoLoanApplicatonModel.repaymentFrequencyName = this.saoProductDetailsModel.interestPostingFrequencyName;

        if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != null && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != undefined) {

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != null)
            this.saoLoanApplicatonModel.penalInterest = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != null)
            this.saoLoanApplicatonModel.iod = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != null)
            this.saoLoanApplicatonModel.effectiveRoi = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi;

        }
      }
    });
  }

  // addData() {
  //   this.addButton = true;
  //   this.editDeleteDisable = true;
  //   this.updateData();
  //   this.dt._first = 0;
  //   this.dt.value.unshift({ securityType: '' });
  //   this.dt.initRowEdit(this.dt.value[0]);
  // }
  addData() {
    this.addButton = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.dt._first = 0;
    
    // Generate disbursement number
    const newRow = {
      securityType: '',
      disbursementOrder: this.generateDisbursementNumber(), // Automatically set disbursement number
    };
  
    this.dt.value.unshift(newRow);  // Insert the new row
    this.dt.initRowEdit(this.dt.value[0]); // Initialize the edit mode for the first row
  }
  
  onDisbursementChange() {
    if (this.saoLoanApplicatonModel.plannedDisbursements != null && this.saoLoanApplicatonModel.plannedDisbursements != undefined) {
      this.scheduleRecordsCount = true;
    } else {
      this.scheduleRecordsCount = false;
    }
  }
  disbursementCounter: number = 1;
  generateDisbursementNumber(): string {
    
    return ' '+ this.disbursementCounter++; // Generates unique numbers like DIS-1, DIS-2, etc.
  }
  addOrUpdateSchedulerDetails(rowData: any) {
    this.addButton = false;
    this.editDeleteDisable = false;
    rowData.saoLoanApplicationId = this.savedId;
    if (!rowData.disbursementOrder) {
      rowData.disbursementOrder = this.generateDisbursementNumber();
    }
    this.saoLoanDisbursementModel = rowData;
    if (rowData.id != undefined) {

      this.saoLoanDisbursementService.updateSaoDisbursement(this.saoLoanDisbursementModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getSaoLoanApplicationDetailsById(this.savedId);
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.msgs = [{ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      })
    } else {
      this.saoLoanDisbursementModel.statusName =  CommonStatusData.SCHEDULED;
      this.saoLoanDisbursementService.addSaoDisbursement(this.saoLoanDisbursementModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getSaoLoanApplicationDetailsById(this.savedId);
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.msgs = [({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST })];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      })
    }
  }

  cancelSchedulerDetails() {
    this.disbursmentScheduleList = [];
    this.addButton = false;
    this.editDeleteDisable = false;
    this.getSaoLoanApplicationDetailsById(this.savedId);
    this.updateData();
  }

  editSchedulerDetailsRow(row: any) {
    this.addButton = false;
    this.editDeleteDisable = false;
    this.saoLoanDisbursementModel = row;
    this.saoLoanDisbursementModel.saoLoanApplicationId = this.savedId;
    this.saoLoanDisbursementService.getSaoDisbursementById(this.saoLoanDisbursementModel.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saoLoanDisbursementModel = this.responseModel.data;

      }
      this.getSaoLoanApplicationDetailsById(this.savedId);
    });
    this.updateData();
  }

  updateApplication(){
    this.addButton = false; 
    if(this.saoLoanApplicatonModel.id != null && this.saoLoanApplicatonModel.id != undefined){
      if( this.saoLoanApplicatonModel.saoLoanInsuranceDetailsDTO.id != null &&  this.saoLoanApplicatonModel.saoLoanInsuranceDetailsDTO.id != undefined){
        this.saoLoanApplicatonModel.saoLoanInsuranceDetailsDTO.saoLoanApplicationId = this.savedId;
      }
      if (this.saoLoanApplicatonModel.loanDueDateVal != null && this.saoLoanApplicatonModel.loanDueDateVal != undefined) { 
        this.saoLoanApplicatonModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanApplicatonModel.loanDueDateVal));
      }
      this.saoLoanApplicationService.updateSaoLoanApplication( this.saoLoanApplicatonModel).subscribe((response: any) => {
        this.responseModel = response;
        this.saoLoanApplicatonModel = this.responseModel.data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if(this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null){
            if(this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null)
              this.savedId = this.responseModel.data[0].id;
              
            this.getSaoLoanApplicationDetailsById(this.savedId);
            
              this.apllicationdetailsform.get('plannedDisbursements')?.disable();
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            
          }
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      },);
    }
  }
}
