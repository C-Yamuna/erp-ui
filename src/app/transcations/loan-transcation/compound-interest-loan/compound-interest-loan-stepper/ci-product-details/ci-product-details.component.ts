import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication, CiLoanDisbursementModel, CiLoanDisbursementScheduleModel, CiLoanInsuranceDetails } from './shared/ci-loan-application.model';
import { CompoundInterestProductDefinition } from '../../compound-interest-product-definition/shared/compound-interest-product-definition.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { CiInterestPolicy } from '../../compound-interest-product-definition/compound-interest-product-definition-stepper/ci-interest-policy/shared/ci-interest-policy.model';
import { CiLoanApplicationService } from './shared/ci-loan-application.service';
import { CompoundInterestProductDefinitionService } from '../../compound-interest-product-definition/shared/compound-interest-product-definition.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Table } from 'primeng/table';
import { AccountTypes, CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { CiLoanDisbursement } from '../../ci-loan-operations/shared/ci-loan-disbursement.model';

@Component({
  selector: 'app-ci-product-details',
  templateUrl: './ci-product-details.component.html',
  styleUrls: ['./ci-product-details.component.css']
})
export class CiProductDetailsComponent {
  ciLoanApplicationForm: FormGroup;
  insuranceForm: FormGroup;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  operationTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  isMemberCreation: boolean = false;
  memberTypeName: any;
  ciLoanApplicationId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  visible: boolean = false;
  applicationType: boolean = false;
  isIndividual: Boolean = false;
  productInfoFalg: boolean = false;
  isProductDisable: boolean = false;
  productDefinitionFlag: boolean = false;
  @ViewChild('dt', { static: false })
  private dt!: Table;
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciProductDefinitionModel: CompoundInterestProductDefinition = new CompoundInterestProductDefinition();
  ciLoanInsuranceDetailsModel: CiLoanInsuranceDetails = new CiLoanInsuranceDetails();
  ciLoanInterestPolicyModel: CiInterestPolicy = new CiInterestPolicy();
  ciLoanDisbursementModel:CiLoanDisbursement = new CiLoanDisbursement()
  addButton: boolean = true;
  displayDialog: boolean = false;
  interestConfigList: any[]=[];
  collateralList: any[]=[];
  interestPolicyList: any[]=[];
  collectionOrderList: any[]=[];
  linkedShareCapitalList: any[]=[];
  chargesList: any[]=[];
  purposeList: any[]=[];
  statusList: any[] = [];
  requiredDocumentsList: any[]=[];
  editDeleteDisable: boolean = false;
  scheduleRecordsCount: any;
  disbursmentScheduleList: any[] = [];
  collectionTypeList: any[] = [];
  schedulerForm: FormGroup;
  insuranceDetailsFlag: boolean = false;
  saveAndNextEnableDisable: boolean = false;
  isDisbursementsNotMatchedCheck: boolean = true;
  applicationSubmitEnable : boolean = false;
  today :any;
  pacsId: any;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciProductDefinitionService: CompoundInterestProductDefinitionService) {

    this.ciLoanApplicationForm = this.formBuilder.group({
      ciProductId: ['', [Validators.required]],
      accountNumber: [{ value: '', disabled: true }],
      applicationDate:  [{ value: '', disabled: true }],
      operationTypeId: ['', ],
      effectiveRoi: [{ value: '', disabled: true }],
      penalRoi: [{ value: '', disabled: true }],
      iod: [{ value: '', disabled: true }],
      repaymentFrequency:  [{ value: '', disabled: true }],
      monthlyIncome: ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
      purposeId:['', [Validators.required]],
      requestedAmount:  ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
      sanctionAmount:  ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
      sanctionDate:['', [Validators.required]],
      // plannedDisbursements: ['', [Validators.required]],
      loanPeriod:  ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      loanDueDate: ['', [Validators.required]],
    })

    this.insuranceForm = this.formBuilder.group({
      vendorId: ['', Validators.required],
      policyName: ['', [Validators.pattern(applicationConstants.NAME_PATTERN), Validators.compose([Validators.required])]],
      policyNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      sumInsured:['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      premium: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
    })
    this.schedulerForm = this.formBuilder.group({
      'disbursementNumber': new FormControl('', Validators.required),
      'disbursementDate': new FormControl('', Validators.required),
      'disbursementAmount': new FormControl('', Validators.required),
      'transactionDate': new FormControl('', Validators.required),
    })
    this.today = new Date();//for future date set to disable
  }
  ngOnInit() {
    this.pacsId =1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.statusList = this.commonComponent.status();
    this.collectionTypeList = [
      { label: 'Amount', value: 1 },
      { label: 'Percentage', value: 2 },
    ];
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.getAllProducts();
    this.getAllRepaymentFrequency();
    // this.getAllLoanPurpose();
    this.getAllAccountTypes();
    this.getAllInsuranceVendors();

    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
       
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.ciLoanApplicationId = Number(id);
        this.isEdit = true;
        this.getCiLoanApplicationById(this.ciLoanApplicationId);
       
      } else {
        this.isEdit = false;
      }
    })
    this.ciLoanApplicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });
    this.insuranceForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    if(this.insuranceDetailsFlag){
      // this.saveAndNextEnableDisable = (!((this.ciLoanApplicationForm.valid) && (this.insuranceForm.valid) && this.isDisbursementsNotMatchedCheck))||this.editDeleteDisable;
      this.saveAndNextEnableDisable = (!((this.ciLoanApplicationForm.valid) && (this.insuranceForm.valid)))||this.editDeleteDisable;

    }
    else {
      // this.saveAndNextEnableDisable = (!(this.ciLoanApplicationForm.valid && this.isDisbursementsNotMatchedCheck))||this.editDeleteDisable;
      this.saveAndNextEnableDisable = (!(this.ciLoanApplicationForm.valid))||this.editDeleteDisable;

    }
    // if(this.isDisbursementsNotMatchedCheck){
    //   this.saveAndNextEnableDisable = 
    // }
    this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO = this.ciLoanInsuranceDetailsModel;
    this.ciLoanApplicationService.changeData({
      formValid: (!this.ciLoanApplicationForm.valid && !this.insuranceForm.valid )? true : false,
      data: this.ciLoanApplicationModel,
      isDisable: this.saveAndNextEnableDisable,
      stepperIndex: 3,
    });
  }

  /**
   * @implements get all product details
   * @author jyothi.naidana
   */
  getAllProducts() {
    this.ciProductDefinitionService.getActiveProductsBasedOnPacsId(this.pacsId).subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {

        this.productsList = this.responseModel.data.filter((product: { status: number; }) => product.status == 3).map((product: any) => {
          return { label: product.name, value: product.id };
        });
      }
    },
      error => {
        this.msgs = [];

        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }


  
  /**
   * @implements get product details for product pop up
   * @param id 
   * @author jyothi.naidana
   */
  getProductDefinitionByProductId(id: any) {
    this.ciProductDefinitionService.getCompoundInterestProductDefinitionById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciProductDefinitionModel = this.responseModel.data[0];
            if(this.ciProductDefinitionModel.loanLinkedshareCapitalApplicable != null && this.ciProductDefinitionModel.loanLinkedshareCapitalApplicable != undefined && this.ciProductDefinitionModel.loanLinkedshareCapitalApplicable)
              this.ciProductDefinitionModel.loanLinkedshareCapitalApplicable = applicationConstants.YES;
            else 
              this.ciProductDefinitionModel.loanLinkedshareCapitalApplicable = applicationConstants.NO;

              if(this.ciProductDefinitionModel.isInsuranceAppicable != null && this.ciProductDefinitionModel.isInsuranceAppicable != undefined && this.ciProductDefinitionModel.isInsuranceAppicable)
                this.ciProductDefinitionModel.isInsuranceAppicable = applicationConstants.YES;
              else 
                this.ciProductDefinitionModel.isInsuranceAppicable = applicationConstants.NO

            if (null != this.ciProductDefinitionModel.effectiveStartDate && undefined != this.ciProductDefinitionModel.effectiveStartDate)
                this.ciProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.ciProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

            if (null != this.ciProductDefinitionModel.interestPostingFrequency && undefined != this.ciProductDefinitionModel.interestPostingFrequency)
              this.ciLoanApplicationModel.repaymentFrequency = this.ciProductDefinitionModel.interestPostingFrequency;

            let repamentFrequency = this.repaymentFrequencyList.filter((obj:any)=> obj.value == this.ciProductDefinitionModel.interestPostingFrequency );
            if(repamentFrequency != null && repamentFrequency != undefined){
              this.ciProductDefinitionModel.interestPostingFrequencyName = repamentFrequency[0].label;
              this.ciLoanApplicationModel.repaymentFrequencyName = repamentFrequency[0].label;
            }
              
              //insurance details
              this.insuranceDetailsFlag = this.ciProductDefinitionModel.isInsuranceAppicable;
              if(this.insuranceDetailsFlag){
                if(this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != null && this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != undefined)
                  this.ciLoanInsuranceDetailsModel= this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO;
              }

            if (this.ciProductDefinitionModel.ciProdCollateralsConfigDTOList) {
              this.collateralList = this.ciProductDefinitionModel.ciProdCollateralsConfigDTOList
                .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
                .map((item: { collateralTypeName: string, collateralType: any }) => ({
                  label: item.collateralTypeName,
                  value: item.collateralType
                }));
            }
            if (this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList != null && this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList != undefined && this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList.length > 0) {
              this.interestPolicyList = this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList;
              this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                return object;
              });
            }
            if (this.ciProductDefinitionModel.ciApportionConfigDTOList != null && this.ciProductDefinitionModel.ciApportionConfigDTOList != undefined && this.ciProductDefinitionModel.ciApportionConfigDTOList.length > 0) {
              this.collectionOrderList = this.ciProductDefinitionModel.ciApportionConfigDTOList;
              this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                return object;
              });
            }
            if (this.ciProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList != null && this.ciProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList != undefined && this.ciProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList.length > 0) {
              this.linkedShareCapitalList = this.ciProductDefinitionModel.ciLoanLinkedShareCapitalConfigDTOList;
              this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                return object;
              });
            }

            if (this.ciProductDefinitionModel.ciProductChargesConfigDTOList != null && this.ciProductDefinitionModel.ciProductChargesConfigDTOList != undefined && this.ciProductDefinitionModel.ciProductChargesConfigDTOList.length > 0) {
              this.chargesList = this.ciProductDefinitionModel.ciProductChargesConfigDTOList;
              this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                return object;
              });
            }
            if (this.ciProductDefinitionModel.ciProdPurposeConfigDTOList != null && this.ciProductDefinitionModel.ciProdPurposeConfigDTOList != undefined && this.ciProductDefinitionModel.ciProdPurposeConfigDTOList.length > 0) {
              this.purposeList = this.ciProductDefinitionModel.ciProdPurposeConfigDTOList;
              this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                return object;
              });
              this.loanPurposeList = this.responseModel.data[0].ciProdPurposeConfigDTOList.filter((docs: any) => docs.status == applicationConstants.ACTIVE).map((count: any) => {
                return { label: count.loanPurposeName, value: count.purposeId }
              });
            }
            

            if (this.ciProductDefinitionModel.ciRequiredDocumentsConfigDTOList != null && this.ciProductDefinitionModel.ciRequiredDocumentsConfigDTOList != undefined && this.ciProductDefinitionModel.ciRequiredDocumentsConfigDTOList.length > 0) {
              this.requiredDocumentsList = this.ciProductDefinitionModel.ciRequiredDocumentsConfigDTOList;
              this.requiredDocumentsList = this.requiredDocumentsList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
                object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                return object;
              });
            }
            this.updateData();
          }
        }
        else {
          this.msgs = [];
         
          this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
        }
      }
    });
  }

  getAllRepaymentFrequency() {
    
    this.ciLoanApplicationService.getAllRepaymentFrequency().subscribe(response => {
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
   * @implements get all purpose Types
   * @author jyothi.naidana
   */
  getAllLoanPurpose() {
    this.ciLoanApplicationService.getAllLoanPurpose().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.loanPurposeList = this.responseModel.data.filter((loanPurpose: { status: number; }) => loanPurpose.status == 1).map((loanPurpose: any) => {
          return { label: loanPurpose.name, value: loanPurpose.id };
        });
      }
    },
      error => {
        this.msgs = [];
       
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  /**
   * @implements get account Types 
   * @author jyothi.naidana
   */
  getAllAccountTypes() {
    this.ciLoanApplicationService.getAllAccountTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.operationTypesList = this.responseModel.data;
            this.operationTypesList = this.operationTypesList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
        }
        if (this.ciLoanApplicationModel.operationTypeId != undefined) {
          const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === this.ciLoanApplicationModel.operationTypeId);
          this.ciLoanApplicationModel.operationTypeName = filteredItem.label;
        }
      }
    }, error => {
      this.msgs = [];
     
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    })
  }

  getAllInsuranceVendors() {
    this.ciLoanApplicationService.getAllInsuranceVendors().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
       
        this.insuranceVendorDetailsList = this.responseModel.data.filter((insuranceVendor: { status: number; }) => insuranceVendor.status == 1).map((insuranceVendor: any) => {
          let newObj = { label: insuranceVendor.name, value: insuranceVendor.id };
          return newObj;
        });
      }
    },
      error => {
        this.msgs = [];
       
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  /**
   * @implements product change
   * @param event 
   * @author jyothi.naidana
   */
  productOnChange(productId: any) {
    this.displayDialog = true;
    this.productInfoFalg = true;
    if (productId != null && productId != undefined) {
      this.getProductDefinitionByProductId(productId);
    }
    else {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "please select product" }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  }

  onChangeAccountType(event: any) {
    if (event.value != null && event.value != undefined) {
      const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === event.value);
      this.ciLoanApplicationModel.operationTypeName = filteredItem.label;
      this.updateData();
    }
  }

  onChangeRepayment(event: any) {
    //  if (event.value != null && event.value != undefined) {
    //   this.getProductDefinitionByProductId(event.value);
    // }
  }

  onChangePurpose(event: any) {
    //  if (event.value != null && event.value != undefined) {
    //   this.getProductDefinitionByProductId(event.value);
    // }
  }

  /**
   * @implements get ci Loand application details by Id
   * @param ciLoanApplicationId 
   * @author jyothi.naidana
   */
  getCiLoanApplicationById(ciLoanApplicationId: any) {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.ciLoanApplicationModel = this.responseModel.data[0];
                if (this.ciLoanApplicationModel.ciProductId != null && this.ciLoanApplicationModel.ciProductId != undefined)
                  this.isProductDisable = applicationConstants.TRUE;
                // if (this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                //   this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;
                //   if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined)
                //     this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);

                //   if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined)
                //     this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                // }
                if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined) {
                  this.ciLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.ciLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
                }
                if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined) {
                  this.ciLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.ciLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
                }
                if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined) {
                  this.ciLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.ciLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                }
                if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined) {
                  this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;
                  if (this.ciLoanApplicationModel.memberTypeName == "Individual")
                    this.isIndividual = true;
                  else 
                    this.ciLoanApplicationModel.operationTypeName = AccountTypes.SINGLE;
                  
                }
                if (this.ciLoanApplicationModel.admissionNo != null && this.ciLoanApplicationModel.admissionNo != undefined) {
                  this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
                }
                if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined) {
                  this.applicationType = true;
                }
                if (this.ciLoanApplicationModel.ciProductName != null && this.ciLoanApplicationModel.ciProductName != undefined) {
                  this.productInfoFalg = true;
                }
                if(this.ciLoanApplicationModel.applicationDate == null || this.ciLoanApplicationModel.applicationDate == undefined){
                  this.ciLoanApplicationModel.applicationDateVal = this.commonFunctionsService.currentDate();
                  if (this.ciLoanApplicationModel.applicationDateVal != null && this.ciLoanApplicationModel.applicationDateVal != undefined) {
                    this.ciLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTimedateConversionToLong(this.ciLoanApplicationModel.applicationDateVal);
                  }
                }
                else if(this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined){
                  this.ciLoanApplicationModel.applicationDateVal = this.commonFunctionsService.dateConvertionIntoFormate(this.ciLoanApplicationModel.applicationDate);
                }
                this.commonComponent.stopSpinner();
                if (this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != null && this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO != undefined) {
                  this.ciLoanInsuranceDetailsModel = this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO;
                }
                this.getProductDefinitionByProductId(this.ciLoanApplicationModel.ciProductId);
                if (this.ciLoanApplicationModel.ciDisbursementDTOList != null) {
                  this.disbursmentScheduleList = this.ciLoanApplicationModel.ciDisbursementDTOList.map((count:any) => {
                    count.disbursementDateVal = this.datePipe.transform(count.disbursementDate, this.orgnizationSetting.datePipe);
                    count.transactionDateVal = this.datePipe.transform(count.transactionDate, this.orgnizationSetting.datePipe);
                    return count;
                  });
                }
                this.onChangePlannedDisbursements(this.ciLoanApplicationModel.plannedDisbursements);
                if(this.ciLoanApplicationForm.valid && this.insuranceForm.valid){
                  this.applicationSubmitEnable = false;
                }
                if(this.ciLoanApplicationModel.plannedDisbursements != null && this.ciLoanApplicationModel.plannedDisbursements != undefined){
                  this.ciLoanApplicationForm.get("plannedDisbursements")?.disable();
                  const controlTow = this.ciLoanApplicationForm.get('plannedDisbursements');
                  if (controlTow) {
                    controlTow.setValidators(null); // Set the required validator null
                    controlTow.updateValueAndValidity();
                  }
                }
                this.updateData();
              }
            }
          }
        }
      }
    });
  }

  onChange() {
    this.checked = !this.checked;
    if (this.checked) {
      this.isMemberCreation = true;
    }
    else {
      this.isMemberCreation = false;
    }
  }

  showDialog() {
    this.visible = true;
  }

  // getProductDefinition() {
  //   this.productDefinitionFlag = true;
  //   this.getProductDefinitionByProductId(this.ciLoanApplicationModel.ciProductId);
  // }

  closeProductDefinition() {
    this.productDefinitionFlag = false;
  }

  /**
   * @implements onSaction amount entry
   * @param sactionAmount 
   * @author jyothi.naidana
   */
  onSactionAmountChange(sactionAmount:any){
    this.ciLoanApplicationModel.effectiveRoi = null;
    this.ciLoanApplicationModel.penalInterest = null;
    this.ciLoanApplicationModel.iod= null;
    this.interestConfigList = this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList.filter((obj:any)=>(obj.minSlabAmount <= sactionAmount && obj.maxSlabAmount >= sactionAmount ));
    if( this.interestConfigList != null &&  this.interestConfigList != undefined &&  this.interestConfigList.length >0){
      this.ciLoanApplicationModel.effectiveRoi = this.interestConfigList[0].roi;
      this.ciLoanApplicationModel.penalInterest = this.interestConfigList[0].penalInterest;
      this.ciLoanApplicationModel.iod = this.interestConfigList[0].iod;
    }
    else {
      this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Given Saction Amount is Not in between of any Slabs in Product definition" }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
    }
  
  }
  addData() {
    this.applicationSubmitEnable = true;
    this.addButton = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.dt._first = 0;
    this.dt.value.unshift({ securityType: '' });
    this.dt.initRowEdit(this.dt.value[0]);
  }
  onDisbursementChange() {
    if (this.ciLoanApplicationModel.plannedDisbursements != null && this.ciLoanApplicationModel.plannedDisbursements != undefined) {
      this.scheduleRecordsCount = true;
    } else {
      this.scheduleRecordsCount = false;
    }
  }

  /**
   * @implements addOrUpdateDisbursementList
   * @param rowData 
   */
  addOrUpdateSchedulerDetails(rowData: any) {
    this.disbursmentScheduleList = [];
    rowData.ciLoanApplicationId = this.ciLoanApplicationId;
    
    this.ciLoanDisbursementModel = rowData;
    this.ciLoanDisbursementModel.accountNumber = this.ciLoanApplicationModel.accountNumber;
    if (this.ciLoanDisbursementModel.disbursementDateVal != null && this.ciLoanDisbursementModel.disbursementDateVal != undefined) {
      this.ciLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanDisbursementModel.disbursementDateVal));
    }
    if (this.ciLoanDisbursementModel.transactionDateVal != null && this.ciLoanDisbursementModel.transactionDateVal != undefined) {
      this.ciLoanDisbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanDisbursementModel.transactionDateVal));
    }
    if (rowData.id != undefined) {
      this.ciLoanApplicationService.updateCiDisbursements(this.ciLoanDisbursementModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getCiLoanApplicationById(this.ciLoanApplicationModel.id);
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            
            this.msgs = [];
          }, 2000);
        } else {
          this.getCiLoanApplicationById(this.ciLoanApplicationModel.id);
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.applicationSubmitEnable = false;
        this.editDeleteDisable = false;
      }, error => {
        this.msgs = [{ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      })
    } else {
      rowData.statusName = CommonStatusData.SCHEDULED;
      this.ciLoanApplicationService.addCiDisbursements(this.ciLoanDisbursementModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.getCiLoanApplicationById(this.ciLoanApplicationModel.id);
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.getCiLoanApplicationById(this.ciLoanApplicationModel.id);
            this.msgs = [];
          }, 2000);
        }
        this.applicationSubmitEnable = false;
        this.editDeleteDisable = false;
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
    this.applicationSubmitEnable = false;
    this.addButton = false;
    this.editDeleteDisable = false;
    this.getCiLoanApplicationById(this.ciLoanApplicationId);
    this.updateData();
  }

  /**
   * @implements edit schedulerDetails
   * @param row 
   */
  editSchedulerDetailsRow(row: any) {
    this.applicationSubmitEnable = true;
    this.addButton = true;
    this.editDeleteDisable = true;
    this.ciLoanDisbursementModel = row;
    this.ciLoanDisbursementModel.ciLoanApplicationId = this.ciLoanApplicationId;
    this.ciLoanApplicationService.getCiLoanDisbursementScheduleById(this.ciLoanDisbursementModel.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciLoanDisbursementModel = this.responseModel.data;
      }
    });
    this.updateData();
  }

  /**
   * @implements application submit
   * @param obj 
   * @author jyothi.naidana
   */
  applicationSubmit(obj: any) {
    this.editDeleteDisable = false;
    this.ciLoanApplicationModel.ciLoanInsuranceDetailsDTO = this.ciLoanInsuranceDetailsModel;
    this.ciLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanApplicationModel.sanctionDateVal));
    this.ciLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanApplicationModel.loanDueDateVal));
    this.ciLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanApplicationModel.applicationDate));
    if (this.ciLoanApplicationModel.id != undefined) {
      this.ciLoanApplicationService.updateCiLoanApplication(this.ciLoanApplicationModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.getCiLoanApplicationById(this.ciLoanApplicationModel.id);
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
    }
  }

  /**
   * @implements onChangePlanned Disbursements need to validate disbursement table
   * @author jyothi.naidana
   * @param disbursementsNumber 
   */
  onChangePlannedDisbursements(disbursementsNumber: any) {
    if (this.ciLoanApplicationModel.plannedDisbursements != null && this.ciLoanApplicationModel.plannedDisbursements != null && this.ciLoanApplicationModel.plannedDisbursements != "") {
      if (this.disbursmentScheduleList.length == this.ciLoanApplicationModel.plannedDisbursements) {
        this.isDisbursementsNotMatchedCheck =true;
        this.addButton = true;
      }
      else {
        this.isDisbursementsNotMatchedCheck =false;
        this.addButton = false;
      }
    }
    else {
      this.isDisbursementsNotMatchedCheck =true;
      this.addButton = true;
    }
  }

   /**
   * @implements on ApplicationDate Change saction date due date checks
   * @param applicationDate 
   * @author jyothi.naidana
   */
  onSactionDateSelect(sactionDate: any) {
    this.ciLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(sactionDate));
    if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined && this.ciLoanApplicationModel.sanctionDate < this.ciLoanApplicationModel.applicationDate) {
      this.msgs = [{ severity: 'error', detail: "Saction Date Should Be Greater Than Application Date"}];
      this.ciLoanApplicationModel.sanctionDate = null;
      this.ciLoanApplicationModel.sanctionDateVal = null;
      this.ciLoanApplicationForm.get("sanctionDate")?.reset;
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined && this.ciLoanApplicationModel.sanctionDate > this.ciLoanApplicationModel.loanDueDate) {
      this.msgs = [{ severity: 'error', detail: "Saction Date Should Be Greater Than Loan Due Date"}];
      this.ciLoanApplicationModel.sanctionDate = null;
      this.ciLoanApplicationModel.sanctionDateVal = null;
      this.ciLoanApplicationModel.loanDueDate = null;
      this.ciLoanApplicationModel.loanDueDateVal = null;
      this.ciLoanApplicationForm.get("loanDueDate")?.reset;
      this.ciLoanApplicationForm.get("sanctionDate")?.reset;
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  }

  /**
    * @implements on ApplicationDate Change saction date due date checks
   * @param applicationDate 
   * @author jyothi.naidana
   */
  onLoanDeuDateSelect(loanDueDate: any) {
    this.ciLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(loanDueDate));
    if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined && this.ciLoanApplicationModel.loanDueDate < this.ciLoanApplicationModel.applicationDate) {
      this.msgs = [{ severity: 'error', detail: "Due Date Should Be Greater Than Application Date"}];
      this.ciLoanApplicationModel.loanDueDate = null;
      this.ciLoanApplicationModel.loanDueDateVal = null;
      this.ciLoanApplicationForm.get("loanDueDate")?.reset;
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined && this.ciLoanApplicationModel.sanctionDate > this.ciLoanApplicationModel.loanDueDate) {
      this.msgs = [{ severity: 'error', detail: "Due Date Should Be Greater Than Saction Due Date"}];
      this.ciLoanApplicationModel.sanctionDate = null;
      this.ciLoanApplicationModel.sanctionDateVal = null;
      this.ciLoanApplicationModel.loanDueDate = null;
      this.ciLoanApplicationModel.loanDueDateVal = null;
      this.ciLoanApplicationForm.get("loanDueDate")?.reset;
      this.ciLoanApplicationForm.get("sanctionDate")?.reset;
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }

  }

  /**
   * @implements onChange Loan Period check with product definition
   * @param loanPeriod 
   * @author jyothi.naidana
   */
  onChangeLoanPeriod(loanPeriod:any){
    if(this.ciProductDefinitionModel.minLoanPeriod > loanPeriod || this.ciProductDefinitionModel.maxLoanPeriod < loanPeriod){
      this.msgs = [{ severity: 'error', detail: "Loan Period Should Be in Between "+this.ciProductDefinitionModel.minLoanPeriod +" , "+ this.ciProductDefinitionModel.maxLoanPeriod}];
      this.ciLoanApplicationModel.loanPeriod = null;
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  }

}
