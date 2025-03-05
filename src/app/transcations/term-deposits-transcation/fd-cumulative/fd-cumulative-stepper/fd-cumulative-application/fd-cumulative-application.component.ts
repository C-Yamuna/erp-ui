import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FdCummProductDefinitionModel, FdCumulativeApplication } from './shared/fd-cumulative-application.model';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FdCumulativeApplicationService } from './shared/fd-cumulative-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { InterestPolicy } from '../../../term-deposit-product-definition/add-td-product-definition/interest-policy/shared/interest-policy.model';
import { RequiredDocuments } from '../../../term-deposit-product-definition/add-td-product-definition/required-documents/shared/required-documents.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-fd-cumulative-application',
  templateUrl: './fd-cumulative-application.component.html',
  styleUrls: ['./fd-cumulative-application.component.css']
})
export class FdCumulativeApplicationComponent {

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
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  productDefinitionModel: FdCummProductDefinitionModel = new FdCummProductDefinitionModel();
  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  interestPolicyModel: InterestPolicy = new InterestPolicy();
  requiredDocumentsModel: RequiredDocuments = new RequiredDocuments();
  memberTypeName: any;
  fdCummulativeAccId: any;
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
  interestPolicyList: any[] = [];
  requireddocumentlist: any[] = [];
  renewalList: any[] = [];
  accountTypeDropDownHide: boolean = false;
  interestPaymentFrequencyList: any[] = [];
  tenureTypeList: any[] = [];
  renewalTypeList: any[] = [];
  paymentTypeList: any[] = [];
  yearFlag: boolean = false;
  monthFlag: boolean = false;
  daysFlag: boolean = false;
  interestPayoutFlag: boolean = false;
  renewalFlag: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe, private fileUploadService: FileUploadService) {

    this.applicationForm = this.formBuilder.group({
      'fdCummulativeProductId': ['', [Validators.required]],
      'accountNumber': [{ value: '', disabled: true }],
      'roi': [{ value: '', disabled: true }, [Validators.required]],
      'depositDate': [{ value: '', disabled: true }],
      'penalRoi': [{ value: '', disabled: true }],
      'monthlyIncome': ['',],
      'tenureInDays': ['',],
      'tenureInMonths': ['',],
      'tenureInYears': ['',],
      'depositAmount': ['', [Validators.required]],
      'accountType': ['', [Validators.required]],
      'isRenewal': ['',],
      'renewalType': ['',],
      'maturityDate': [{ value: '', disabled: true }],
      'maturityAmount': [{ value: '', disabled: true }],
      'tenureType': ['',],
      'interestPayoutType': ['',],
      'interestPayoutTransferAccount': ['',],
      'staffRoi': [{ value: '', disabled: true }],
      'seniorCitizenRoi': [{ value: '', disabled: true }]

    })
  }


  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.renewalList = this.commonComponent.requiredlist();
    this.interestPaymentFrequencyList = this.commonComponent.interestPaymentFrequency();
    this.tenureTypeList = this.commonComponent.tenureType();
    this.paymentTypeList = this.commonComponent.transactionModeType().filter((obj: any) => obj != null).map((tenure: { label: any; value: any }) => {
      return { label: tenure.label, value: tenure.value };
    });
    this.renewalTypeList = this.commonComponent.renewalType().filter((obj: any) => obj != null && obj.label != "Manual Renewal Amount").map((tenure: { label: any; value: any }) => {
      return { label: tenure.label, value: tenure.value };
    });
    // this.renewalTypeList =  [
    //   { label: "Deposit", value: 1 },
    //   { label: "Maturity Amount", value: 2 },
    // ]

    // this.paymentTypeList = [
    //   { label: "Cash", value: 1 },
    //   { label: "To SB", value: 2 }
    // ]
    this.getAllAccountTypes();


    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.fdCummulativeAccId = Number(id);
        this.isEdit = true;
        this.getFdCummApplicationById(this.fdCummulativeAccId);
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
    // this.tenureCheck();

  }

  save() {
    this.updateData();
  }

  updateData() {
    this.fdCumulativeApplicationService.changeData({
      formValid: !this.applicationForm.valid ? true : false,
      data: this.fdCumulativeApplicationModel,
      isDisable: (!this.applicationForm.valid),
      stepperIndex: 3,
    });
  }


  getAllProducts() {
    this.fdCumulativeApplicationService.getActiveProductsById(this.pacsId).subscribe((res: any) => {
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
    this.fdCumulativeApplicationService.getAllAccountTypesList().subscribe((res: any) => {
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
        if (this.fdCumulativeApplicationModel.accountType != undefined) {
          const filteredItem = this.accountList.find((item: { value: any; }) => item.value === this.fdCumulativeApplicationModel.accountType);
          this.fdCumulativeApplicationModel.accountTypeName = filteredItem.label;
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
  productViewPopUp() {
    this.displayDialog = true;
    if (this.fdCumulativeApplicationModel.fdCummulativeProductId != null && this.fdCumulativeApplicationModel.fdCummulativeProductId != undefined) {
      this.getProductDefinitionByProductId(this.fdCumulativeApplicationModel.fdCummulativeProductId);
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
      this.fdCumulativeApplicationModel.accountTypeName = filteredItem.label;
      this.updateData();
    }
  }

  //get account details by admissionNumber list
  getFdCummApplicationById(fdCummulativeAccId: any) {
    this.fdCumulativeApplicationService.getFdCummApplicationById(fdCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.fdCumulativeApplicationModel = this.responseModel.data[0];
            this.interestPayoutCheck();
            this.renewalCheck();
            this.tenureCheck();
            if (this.fdCumulativeApplicationModel.depositDate == null || this.fdCumulativeApplicationModel.depositDate == undefined) {
              this.fdCumulativeApplicationModel.depositDateVal = this.commonFunctionsService.currentDate();

              if (this.fdCumulativeApplicationModel.depositDateVal != null && this.fdCumulativeApplicationModel.depositDateVal != undefined) {
                this.fdCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpochWithTimedateConversionToLong(this.fdCumulativeApplicationModel.depositDateVal);
              }
            }
            else if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined) {
              this.fdCumulativeApplicationModel.depositDateVal = this.commonFunctionsService.dateConvertionIntoFormate(this.fdCumulativeApplicationModel.depositDate);
            }
            // if (this.fdCumulativeApplicationModel.fdNonCummulativeproductId != null && this.fdCumulativeApplicationModel.fdNonCummulativeproductId != undefined)
            //   this.isProductDisable = applicationConstants.TRUE;

            if (this.fdCumulativeApplicationModel.maturityDate != null && this.fdCumulativeApplicationModel.maturityDate != undefined) {
              this.fdCumulativeApplicationModel.maturityDate = this.commonFunctionsService.dateConvertionIntoFormate(this.fdCumulativeApplicationModel.maturityDate);
            }
            if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicRequiredDetails = this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO;

              if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined)
                this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined)
                this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetails.signaturePath != null && this.membershipBasicRequiredDetails.signaturePath != undefined) {
                this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signaturePath);
              }
            }

            // if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined)
            //   this.fdCumulativeApplicationModel.depositDateVal = this.datePipe.transform(this.fdCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);


            if (this.fdCumulativeApplicationModel.memberTypeName != null && this.fdCumulativeApplicationModel.memberTypeName != undefined) {
              this.memberTypeName = this.fdCumulativeApplicationModel.memberTypeName;
              if (this.fdCumulativeApplicationModel.memberTypeName == "Individual")
                this.isIndividual = true;
              if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
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
            if (this.fdCumulativeApplicationModel.admissionNumber != null && this.fdCumulativeApplicationModel.admissionNumber != undefined)
              this.admissionNumber = this.fdCumulativeApplicationModel.admissionNumber;

            if (this.fdCumulativeApplicationModel.fdCummulativeProductId != null && this.fdCumulativeApplicationModel.fdCummulativeProductId != undefined)
              this.isProductDisable = true;


            if (this.fdCumulativeApplicationModel.accountTypeName != null && this.fdCumulativeApplicationModel.accountTypeName != undefined)
              this.applicationType = true;

            if (this.fdCumulativeApplicationModel.fdCummulativeProductName != null && this.fdCumulativeApplicationModel.fdCummulativeProductName != undefined)
              this.productInfoFalg = true;

            if (this.fdCumulativeApplicationModel.fdCummulativeProductId != null && this.fdCumulativeApplicationModel.fdCummulativeProductId != undefined) {
              this.getProductDefinitionByProductId(this.fdCumulativeApplicationModel.fdCummulativeProductId);

            }
            if (this.fdCumulativeApplicationModel.fdCummulativeProductDefinitionDTO != null && this.fdCumulativeApplicationModel.fdCummulativeProductDefinitionDTO != undefined) {
              this.productDefinitionModel = this.fdCumulativeApplicationModel.fdCummulativeProductDefinitionDTO;
              if (this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList != null)
                this.interestPolicyModel = this.productDefinitionModel.intestPolicyConfigList[0];
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
    this.fdCumulativeApplicationService.getFdCumulativeProductDefinitionOverviewDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.productDefinitionModel = this.responseModel.data[0];

          if (null != this.productDefinitionModel.effectiveStartDate)
            this.productDefinitionModel.effectiveStartDate = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.productDefinitionModel.effectiveEndDate)
            this.productDefinitionModel.effectiveEndDate = this.datePipe.transform(this.productDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

          if (this.productDefinitionModel.intestPolicyConfigList != null && this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList.length > 0) {
            this.interestPolicyList = this.productDefinitionModel.intestPolicyConfigList;

          }
          if (this.productDefinitionModel.intestPolicyConfigList != null && this.productDefinitionModel.intestPolicyConfigList != undefined) {
            if (this.productDefinitionModel.intestPolicyConfigList[0].roi != undefined && this.productDefinitionModel.intestPolicyConfigList[0].roi != null)
              this.fdCumulativeApplicationModel.roi = this.productDefinitionModel.intestPolicyConfigList[0].roi;

            if (this.productDefinitionModel.intestPolicyConfigList[0].penaltyRoi != undefined && this.productDefinitionModel.intestPolicyConfigList[0].penaltyRoi != null)
              this.fdCumulativeApplicationModel.penalRoi = this.productDefinitionModel.intestPolicyConfigList[0].penaltyRoi;

            if (this.productDefinitionModel.intestPolicyConfigList[0].staffRoi != undefined && this.productDefinitionModel.intestPolicyConfigList[0].staffRoi != null)
              this.fdCumulativeApplicationModel.staffRoi = this.productDefinitionModel.intestPolicyConfigList[0].staffRoi;

            if (this.productDefinitionModel.intestPolicyConfigList[0].seniorCitizenRoi != undefined && this.productDefinitionModel.intestPolicyConfigList[0].seniorCitizenRoi != null)
              this.fdCumulativeApplicationModel.seniorCitizenRoi = this.productDefinitionModel.intestPolicyConfigList[0].seniorCitizenRoi;

          }

          if (this.productDefinitionModel.requiredDocumentsConfigList != null && this.productDefinitionModel.requiredDocumentsConfigList != undefined && this.productDefinitionModel.requiredDocumentsConfigList.length > 0) {
            this.requireddocumentlist = this.productDefinitionModel.requiredDocumentsConfigList;

          }
          if (this.productDefinitionModel.tenureType != null && this.productDefinitionModel.tenureType != undefined) {
            this.fdCumulativeApplicationModel.tenureType = this.productDefinitionModel.tenureType;
          }
          this.tenureCheck();
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

  maturityDateAndInterestAmountCalculation() {
    let depositAmount = parseFloat(this.applicationForm.get('depositAmount')?.value) || 0;
    let roi = parseFloat(this.applicationForm.get('roi')?.value) || 0;
    let tenureInDays = parseInt(this.applicationForm.get('tenureInDays')?.value) || 0;
    let tenureInMonths = parseInt(this.applicationForm.get('tenureInMonths')?.value) || 0;
    let tenureInYears = parseInt(this.applicationForm.get('tenureInYears')?.value) || 0;
    let depositDate = this.applicationForm.get('depositDate')?.value;
    if (!depositAmount || !roi || (tenureInDays === 0 && tenureInMonths === 0 && tenureInYears === 0)) {
      return;
    }
    let totalTenureInDays = tenureInYears * 365 + tenureInMonths * 30 + tenureInDays;
    let totalInterestAmount = (depositAmount * roi * totalTenureInDays) / (365 * 100);
    let maturityAmount = depositAmount + totalInterestAmount;

    this.applicationForm.get('maturityAmount')?.setValue(maturityAmount.toFixed(2));
    if (depositDate) {
      let maturityDate = new Date(depositDate);
      if (!isNaN(maturityDate.getTime())) {
        maturityDate.setDate(maturityDate.getDate() + totalTenureInDays);
        const maturityDateFormatted = this.datePipe.transform(maturityDate, this.orgnizationSetting.datePipe);
        this.applicationForm.get('maturityDate')?.setValue(maturityDateFormatted);
      }
    }
  }

  /**
   * @implements check for years,months,days to show and hide based on tenuretype
   * @author bhargavi
   */
  tenureCheck() {
    const tenureType = this.fdCumulativeApplicationModel.tenureType;
    this.yearFlag = tenureType === 2 || tenureType === 5 || tenureType === 6 || tenureType === 7 ? true : false;
    this.monthFlag = tenureType === 3 || tenureType === 4 || tenureType === 6 || tenureType === 7 ? true : false;
    this.daysFlag = tenureType === 1 || tenureType === 4 || tenureType === 5 || tenureType === 7 ? true : false;
  }

  /**
   * @implements check for paymenttype show and hide based on interestPayoutType
   * @author bhargavi
   */
  interestPayoutCheck() {
    const interestPayoutType = this.fdCumulativeApplicationModel.interestPayoutType;
    this.interestPayoutFlag = interestPayoutType === 3 ? true : false;
  }
  
  /**
   * @implements check for autorenewal show and hide based on renewalType
   * @author bhargavi
   */
  renewalCheck() {
    const renewalType = this.fdCumulativeApplicationModel.isAutoRenewal;
    this.renewalFlag = renewalType === true ? true : false;
  }
}
