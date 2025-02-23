import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FdNonCummProductDefinitionModel, FdNonCumulativeApplication } from './shared/fd-non-cumulative-application.model';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FdNonCumulativeApplicationService } from './shared/fd-non-cumulative-application.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FdNonCumulativeInterestPolicy } from '../../../fd-non-cumulative-product-definition/add-fd-non-cumulative-product-definition/fd-non-cumulative-interest-policy/shared/fd-non-cumulative-interest-policy.model';
import { FdNonCumulativeRequiredDocuments } from '../../../fd-non-cumulative-product-definition/add-fd-non-cumulative-product-definition/fd-non-cumulative-required-documents/shared/fd-non-cumulative-required-documents.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-fd-non-cumulative-application',
  templateUrl: './fd-non-cumulative-application.component.html',
  styleUrls: ['./fd-non-cumulative-application.component.css']
})
export class FdNonCumulativeApplicationComponent {

  applicationForm: FormGroup;

  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  accountList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  fdNonCumulativeApplicationModel: FdNonCumulativeApplication = new FdNonCumulativeApplication();
  productDefinitionModel: FdNonCummProductDefinitionModel = new FdNonCummProductDefinitionModel();
  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  fdNonCumulativeInterestPolicyModel :FdNonCumulativeInterestPolicy = new FdNonCumulativeInterestPolicy();
  fdNonCumulativeRequiredDocumentsModel: FdNonCumulativeRequiredDocuments = new FdNonCumulativeRequiredDocuments();
  memberTypeName: any;
  fdNonCummulativeAccId: any;
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
  displayDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  siLoanDisbursementScheduleList: any[] = [];
  editDeleteDisable: boolean = false;

  disableAddButton: boolean = false;
  deleteId: any;
  pacsId: any;
  branchId: any;
  interestPolicyList: any[] =[];
  requireddocumentlist: any[] =[];
  interestPaymentFrequencyList: any[] = [];
  renewalList: any[] = [];
  accountTypeDropDownHide: boolean = false;
  tenureTypeList: any[] = [];
  paymentTypeList: any[] = [];
  renewalTypeList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,private fileUploadService: FileUploadService,
    private datePipe: DatePipe) {

      this.applicationForm = this.formBuilder.group({
      'fdNonCummulativeproductId':['', [Validators.required]],
      'accountNumber': [{ value: '', disabled: true }],
      'roi': [{ value: '', disabled: true },[Validators.required]],
      'depositDate': [{ value: '', disabled: true }],
      'penalRoi': [{ value: '', disabled: true }],
      'monthlyIncome': ['', ],
      'tenureInDays': ['',],
      'tenureInMonths':['',],
      'tenureInYears':['',],
      'depositAmount': ['', [Validators.required]],
      'accountType': ['', [Validators.required]],
      'interestPaymentFrequency': ['', [Validators.required]],
      'maturityDate':[{ value: '', disabled: true }],
      'maturityAmount':[{ value: '', disabled: true }],
      'interestPayoutAmount': ['',],
      'totalInterestAmount': ['',],
      'tenureType': [{ value: '', disabled: true }],
      'interestPayoutType': ['',],
      'interestPayoutTransferAccount': ['',],
      'isRenewal': [''],
      'renewalType': ['']
      
      })
  }
  // interestPaymentFrequency
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.tenureTypeList = this.commonComponent.tenureType();
    this.interestPaymentFrequencyList = this.commonComponent.interestPaymentFrequency();
    this.renewalList = this.commonComponent.requiredlist();
    
    this.renewalTypeList =  [
      { label: "Deposit", value: 1 },
      { label: "Maturity Amount", value: 2 },
    ]

    this.paymentTypeList = [
      { label: "Cash", value: 1 },
      { label: "Standing Instructions", value: 2 }
    ]
    this.getAllAccountTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.fdNonCummulativeAccId = Number(id);
        this.isEdit = true;
        this.getFdNonCummApplicationById(this.fdNonCummulativeAccId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })

    this.applicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.applicationForm.valid) {
      //   this.save();
      // }
    });
    this.getAllProducts();
  }

  save() {
    this.updateData();
  }

  updateData() {
    this.fdNonCumulativeApplicationService.changeData({
      formValid: !this.applicationForm.valid ? true : false,
      data: this.fdNonCumulativeApplicationModel,
      isDisable: (!this.applicationForm.valid),
      stepperIndex: 3,
    });
  }


  getAllProducts() {
    this.fdNonCumulativeApplicationService.getActiveProductsById(this.pacsId).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.productsList = this.responseModel.data;
            this.productsList = this.productsList.filter((obj: any) => obj != null && obj.statusName == applicationConstants.APPROVED).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
        }
      }
    });
  }



  getAllAccountTypes() {
    this.fdNonCumulativeApplicationService.getAllAccountTypesList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountList = this.responseModel.data;
            this.accountList = this.accountList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };

            });
            // this.accountList.unshift({ label: 'select', value: 0 });
          }
        }
        if (this.fdNonCumulativeApplicationModel.accountType != undefined) {
          const filteredItem = this.accountList.find((item: { value: any; }) => item.value === this.fdNonCumulativeApplicationModel.accountType);
          this.fdNonCumulativeApplicationModel.accountTypeName = filteredItem.label;
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    })
  }

  onChangeProduct(event: any) {
    this.productInfoFalg = true;
    if (event.value != null && event.value != undefined) {
      this.getProductDefinitionByProductId(event.value);
    }
  }
  productViewPopUp(){
    this.displayDialog = true;
    if(this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != undefined){
      this.getProductDefinitionByProductId(this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId);
    }
    else {
      this.msgs = [];
          this.msgs = [{ severity: 'error', detail: "Please Select Product" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
    }
    
  }

  onChangeAccountType(event: any) {
    if (event.value != null && event.value != undefined) {
      const filteredItem = this.accountList.find((item: { value: any; }) => item.value === event.value);
      this.fdNonCumulativeApplicationModel.accountTypeName = filteredItem.label;
      this.updateData();
    }
  }




  //get account details by admissionNumber list
  getFdNonCummApplicationById(fdNonCummulativeAccId: any) {
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(fdNonCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.fdNonCumulativeApplicationModel = this.responseModel.data[0];

            if(this.fdNonCumulativeApplicationModel.depositDate == null || this.fdNonCumulativeApplicationModel.depositDate == undefined){
              this.fdNonCumulativeApplicationModel.depositDateVal = this.commonFunctionsService.currentDate();

              if (this.fdNonCumulativeApplicationModel.depositDateVal != null && this.fdNonCumulativeApplicationModel.depositDateVal != undefined) {
                this.fdNonCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpochWithTimedateConversionToLong(this.fdNonCumulativeApplicationModel.depositDateVal);
              }
            }
            else if(this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined){
              this.fdNonCumulativeApplicationModel.depositDateVal = this.commonFunctionsService.dateConvertionIntoFormate(this.fdNonCumulativeApplicationModel.depositDate);
            }

            // if (this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != undefined)
            //   this.isProductDisable = applicationConstants.TRUE;
            
            if (this.fdNonCumulativeApplicationModel.maturityDate != null && this.fdNonCumulativeApplicationModel.maturityDate != undefined) {
              this.fdNonCumulativeApplicationModel.maturityDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.maturityDate, this.orgnizationSetting.datePipe);
            }
            if (this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicRequiredDetails = this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO;

              if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined)
                this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined)
                this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetails.signaturePath != null && this.membershipBasicRequiredDetails.signaturePath != undefined) {
                this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signaturePath);
              }
            }

            // if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined)
            //   this.fdNonCumulativeApplicationModel.depositDateVal = this.datePipe.transform(this.fdNonCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
            
            if (this.fdNonCumulativeApplicationModel.memberTypeName != null && this.fdNonCumulativeApplicationModel.memberTypeName != undefined) {
              this.memberTypeName = this.fdNonCumulativeApplicationModel.memberTypeName;
              if (this.fdNonCumulativeApplicationModel.memberTypeName == "Individual")
                this.isIndividual = true;
              if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {  // account type entry resitricted because group institution have only single account type
                this.accountTypeDropDownHide = true;
                const controlName = this.applicationForm.get('accountType');
                if (controlName) {
                  controlName.setValidators(null); // Set the required validator null
                  controlName.updateValueAndValidity();
                }
              }
              else {
                const controlName = this.applicationForm.get('accountType');
                if (controlName) {
                  controlName.setValidators([
                    Validators.required,
                  ]);
                  controlName.updateValueAndValidity();
                }
              }
            }
            if (this.fdNonCumulativeApplicationModel.admissionNumber != null && this.fdNonCumulativeApplicationModel.admissionNumber != undefined)
              this.admissionNumber = this.fdNonCumulativeApplicationModel.admissionNumber;

            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != undefined)
              this.isProductDisable = true;

            if (this.fdNonCumulativeApplicationModel.accountTypeName != null && this.fdNonCumulativeApplicationModel.accountTypeName != undefined)
              this.applicationType = true;

            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeProductName != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeProductName != undefined)
              this.productInfoFalg = true;

            if(this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId!= null && this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != undefined){
              this.getProductDefinitionByProductId(this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId);
              
            }
            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeProductDefinitionDTO != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeProductDefinitionDTO != undefined) {
              this.productDefinitionModel = this.fdNonCumulativeApplicationModel.fdNonCummulativeProductDefinitionDTO;
              if (this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList != undefined && this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList != null)
                this.fdNonCumulativeInterestPolicyModel = this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList[0];
              if (this.productDefinitionModel.effectiveStartDate != null && this.productDefinitionModel.effectiveStartDate != undefined)
                this.productDefinitionModel.effectiveStartDateVal = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
  
            }
          }
          this.updateData();
        }
      }
    });
  }


  getProductDefinitionByProductId(id: any) {
    this.productDefinitionModel == null;
    this.productDefinitionModel.isAutoRenewal == null;
    this.productDefinitionModel.isSpecialScheme == null;
    this.fdNonCumulativeApplicationService.getFdNonCumulativeProductDefinitionOverviewDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.productDefinitionModel = this.responseModel.data[0];

          if (null != this.productDefinitionModel.effectiveStartDate)
            this.productDefinitionModel.effectiveStartDate = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.productDefinitionModel.effectiveEndDate)
            this.productDefinitionModel.effectiveEndDate = this.datePipe.transform(this.productDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

          if (this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList != null && this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList != undefined && this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList.length > 0) {
            this.interestPolicyList = this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList;
           
          }
          if (this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList != null && this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList != undefined) {
            if (this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList[0].generalRoi != undefined && this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList[0].generalRoi != null)
              this.fdNonCumulativeApplicationModel.roi = this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList[0].generalRoi;
  
            if (this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList[0].penaltyRoi != undefined && this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList[0].penaltyRoi != null)
              this.fdNonCumulativeApplicationModel.penalRoi = this.productDefinitionModel.fdNonCummulativeInterestPolicyConfigList[0].penaltyRoi;
          }
         
          if (this.productDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList != null && this.productDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList != undefined && this.productDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList.length > 0) {
            this.requireddocumentlist = this.productDefinitionModel.fdNonCummulativeRequiredDocumentsConfigList;
           
          }
          if (this.productDefinitionModel.tenureType != null && this.productDefinitionModel.tenureType != undefined) {
            this.fdNonCumulativeApplicationModel.tenureType = this.productDefinitionModel.tenureType;
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

  closeProductDefinition() {
    this.productDefinitionFlag = false;
  }

  // calculateMaturity() {
  //   let depositAmount = parseFloat(this.applicationForm.get('depositAmount')?.value) || 0;
  //   let roi = parseFloat(this.applicationForm.get('roi')?.value) || 0;
  //   let tenureInDays = parseInt(this.applicationForm.get('tenureInDays')?.value) || 0;
  //   let tenureInMonths = parseInt(this.applicationForm.get('tenureInMonths')?.value) || 0;
  //   let tenureInYears = parseInt(this.applicationForm.get('tenureInYears')?.value) || 0;
  //   let depositDate = this.applicationForm.get('depositDate')?.value;
  //   if (!depositAmount || !roi || (tenureInDays === 0 && tenureInMonths === 0 && tenureInYears === 0)) {
  //     return;
  //   }
  //   let tenureInYearsTotal = tenureInYears + (tenureInMonths / 12) + (tenureInDays / 365);
  //   let maturityAmount = depositAmount * Math.pow((1 + roi / 100), tenureInYearsTotal);
  //   this.applicationForm.get('maturityAmount')?.setValue(maturityAmount.toFixed(2));
  //   if (depositDate) {
  //     let maturityDate = new Date(depositDate);
  //     if (isNaN(maturityDate.getTime())) {
  //       return;
  //     }
  //     maturityDate.setFullYear(maturityDate.getFullYear() + tenureInYears);
  //     maturityDate.setMonth(maturityDate.getMonth() + tenureInMonths);
  //     maturityDate.setDate(maturityDate.getDate() + tenureInDays);
      
  //     const maturityDateFormatted = this.datePipe.transform(maturityDate, this.orgnizationSetting.datePipe);
  //     this.applicationForm.get('maturityDate')?.setValue(maturityDateFormatted);
  //   }
  // }

  maturityDateAndInterestAmountCalculation() {
    let depositAmount = parseFloat(this.applicationForm.get('depositAmount')?.value) || 0;
    let roi = parseFloat(this.applicationForm.get('roi')?.value) || 0;
    let tenureInDays = parseInt(this.applicationForm.get('tenureInDays')?.value) || 0;
    let tenureInMonths = parseInt(this.applicationForm.get('tenureInMonths')?.value) || 0;
    let tenureInYears = parseInt(this.applicationForm.get('tenureInYears')?.value) || 0;
    let depositDate = this.applicationForm.get('depositDate')?.value;
    let interestPaymentFrequency = this.applicationForm.get('interestPaymentFrequency')?.value;
    let tenureType = this.applicationForm.get('tenureType')?.value;
  
    if (!depositAmount || !roi || (tenureInDays === 0 && tenureInMonths === 0 && tenureInYears === 0)) {
      return;
    }
  
    let totalTenureInDays = tenureInYears * 365 + tenureInMonths * 30 + tenureInDays;
    let totalInterestAmount = (depositAmount * roi * totalTenureInDays) / (365 * 100);
    let maturityAmount = depositAmount + totalInterestAmount;
  
    this.applicationForm.get('maturityAmount')?.setValue(maturityAmount.toFixed(2));
    this.applicationForm.get('totalInterestAmount')?.setValue(totalInterestAmount.toFixed(2));
  
    // Calculate Maturity Date
    if (depositDate) {
      let maturityDate = new Date(depositDate);
      if (!isNaN(maturityDate.getTime())) {
        maturityDate.setDate(maturityDate.getDate() + totalTenureInDays);
        const maturityDateFormatted = this.datePipe.transform(maturityDate, this.orgnizationSetting.datePipe);
        this.applicationForm.get('maturityDate')?.setValue(maturityDateFormatted);
      }
    }
  
    // Calculate Interest Payout Amount
    let interestPayoutAmount = 0;
    if (interestPaymentFrequency === 1) { 
      interestPayoutAmount = totalInterestAmount / totalTenureInDays;
    } else if (interestPaymentFrequency === 2) { 
      interestPayoutAmount = totalInterestAmount / (totalTenureInDays / 30);
    } else if (interestPaymentFrequency === 3) { 
      interestPayoutAmount = totalInterestAmount / (totalTenureInDays / 90);
    } else if (interestPaymentFrequency === 4) { 
      interestPayoutAmount = totalInterestAmount / (totalTenureInDays / 180);
    } else if (interestPaymentFrequency === 5) { 
      interestPayoutAmount = totalInterestAmount / (totalTenureInDays / 365);
    } else if (interestPaymentFrequency === 6) { 
      interestPayoutAmount = totalInterestAmount;
    }
  
    this.applicationForm.get('interestPayoutAmount')?.setValue(interestPayoutAmount.toFixed(2));
  }

}
