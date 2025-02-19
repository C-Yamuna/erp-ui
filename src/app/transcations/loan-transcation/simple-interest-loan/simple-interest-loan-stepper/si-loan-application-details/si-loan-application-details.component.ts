import { DatePipe } from '@angular/common';
import { ApplicationModule, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SiTransactionDetailsService } from '../../../shared/si-loans/si-transaction-details.service';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { SiLoanInterestPolicy, SiLoanProductDefinition } from '../../../shared/si-loans/si-loan-product-definition.model';
import { SiProductDefinitionService } from '../../../shared/si-loans/si-product-definition.service';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { SiLoanInsuranceDetails } from '../../../shared/si-loans/si-loan-insurance-details.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { SiDisbursement } from 'src/app/transcations/borrowing-transaction/si-borrowing/si-operations/si-disbursement/shared/si-disbursement.model';
import { Table } from 'primeng/table';
import { SiLoanDisbursementSchedule } from '../../../shared/si-loans/si-loan-disbursement-schedule.model';
import { SiLoanDisbursementScheduleService } from '../../../shared/si-loans/si-loan-disbursement-schedule.service';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { SimpleInterestProductDefinitionService } from '../../simple-interest-product-definition/shared/simple-interest-product-definition.service';
import { SimpleInterestProductDefinition } from '../../simple-interest-product-definition/shared/simple-interest-product-definition.model';
import { SiInterestPolicy } from '../../simple-interest-product-definition/simple-interest-product-definition-stepper/si-interest-policy/shared/si-interest-policy.model';
import { SiLinkedShareCapital } from '../../simple-interest-product-definition/simple-interest-product-definition-stepper/si-linked-share-capital/shared/si-linked-share-capital.model';
import { SiDisbursementService } from '../../../shared/si-loans/si-disbursement.service';
import { SiLoanDisbursement } from '../../../shared/si-loans/si-loan-disbursement.model';

@Component({
  selector: 'app-si-loan-application-details',
  templateUrl: './si-loan-application-details.component.html',
  styleUrls: ['./si-loan-application-details.component.css']
})
export class SiLoanApplicationDetailsComponent {
  siLoanapplicationForm: any;
  chargesDetailsForm: FormGroup;
  insurenceDetailsForm: FormGroup;
  disbursementForm: FormGroup;
  gender: any[] | undefined;
  maritalstatus: any[] | undefined;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  operationTypesList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  interestPolicyList: any[] = [];
  requiredDocumentsList: any[] = [];
  chargesList: any[] = [];
  purposeList: any[] = [];
  linkedShareCapitalList: any[] = [];
  statusList: any[] = [];
  interestPostingFrequencyList: any[] = [];
  collectionOrderList: any[] = [];

  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanProductDefinitionModel: SiLoanProductDefinition = new SiLoanProductDefinition();
  siLoanInterestPolicyModel: SiLoanInterestPolicy = new SiLoanInterestPolicy();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  siLoanInsuranceDetailsModel: SiLoanInsuranceDetails = new SiLoanInsuranceDetails();
  // siLoanDisbursement: SiLoanDisbursementSchedule = new SiLoanDisbursementSchedule();
  siLoanDisbursement: SiLoanDisbursement = new SiLoanDisbursement();
  simpleInterestProductDefinitionModel :SimpleInterestProductDefinition = new SimpleInterestProductDefinition();
  siInterestPolicyModel :SiInterestPolicy = new SiInterestPolicy();
  siLoanLinkedShareCapitalModel :SiLinkedShareCapital = new SiLinkedShareCapital();

  memberTypeName: any;
  loanAccId: any;
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
  @ViewChild('disbursement', { static: false }) private disbursement!: Table;
  siLoanDisbursementScheduleList: any[] = [];
  editDeleteDisable: boolean = false;
  disbursementTypesList: any[] = [];
  disableAddButton: boolean = false;
  deleteId: any;
  pacsId: any;
  branchId: any;
  isDisabled:  boolean = false;
  accountNumber: any;
  memberTypeId: any;
  operationTypeName: any;
  collateralList: any[] = [];
  insurenceFlag: boolean = false;
  saveAndNextButton:boolean = false;
  temprepaymentList: any[]=[];


  constructor(private router: Router, private formBuilder: FormBuilder,
    private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private siTransactionDetailsService: SiTransactionDetailsService, private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService, private siLoanApplicationService: SiLoanApplicationService,
    private activateRoute: ActivatedRoute, private siProductDefinitionService: SiProductDefinitionService,
    private fileUploadService: FileUploadService, private siDisbursementService: SiDisbursementService,
    private simpleInterestProductDefinitionService : SimpleInterestProductDefinitionService,) {

    this.siLoanapplicationForm = this.formBuilder.group({
      siProductId: ['', [Validators.required]],
      accountNumber: new FormControl({ value: '', disabled: true }, [Validators.required]),
      roi: new FormControl({ value: '', disabled: true }, [Validators.required]),
      // applicationDate: ['', [Validators.required]],
      applicationDate: [{ value: '', disabled: true }],
      applicationNumber: ['', [Validators.required]],
      penalRoi: new FormControl({ value: '', disabled: true }, [Validators.required]),
      iod: new FormControl({ value: '', disabled: true }, [Validators.required]),
      repaymentFrequency: [{ value: '', disabled: true },[Validators.required]],
      monthlyIncome: ['', [Validators.required]],
      purposeId: ['', [Validators.required]],
      requestedAmount: ['', [Validators.required]],
      sanctionAmount: ['', [Validators.required]],
      sanctionDate: ['', [Validators.required]],
      plannedDisbursements: ['', [Validators.required]],
      loanPeriod: ['', [Validators.required]],
      loanDueDate: ['', [Validators.required]],
      operationTypeId: ['', [Validators.required]],
    })
    this.chargesDetailsForm = this.formBuilder.group({

    })
    this.insurenceDetailsForm = this.formBuilder.group({
      vendorId: ['', Validators.required],
      policyName: ['', [Validators.pattern(applicationConstants.NAME_PATTERN), Validators.compose([Validators.required])]],
      policyNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      sumInsured:['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      premium: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      // insuranceType: ['', [Validators.required]],
    })
    this.disbursementForm = this.formBuilder.group({
      'disbursementNumber': new FormControl('', Validators.required),
      'type': new FormControl('', Validators.required),
      'disbursementLimit': new FormControl('', Validators.required),
      'disbursementDateVal':new FormControl('', Validators.required),
      'disbursementAmount': new FormControl('', Validators.required),
      'disbursementOrder': new FormControl('', Validators.required),
      'remarks': new FormControl('', Validators.required)
    })

  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.gender = [
      { status: 'Select', code: '0' },
      { status: 'Male', code: '1' },
      { status: 'Female', code: '2' },
    ];
    this.maritalstatus = [
      { status: 'Select', code: '0' },
      { status: 'Married', code: '1' },
      { status: 'UnMarried', code: '2' }
    ];
    this.disbursementTypesList = [
      // { label: 'Select', value: '0' },
      { label: 'Amount', value: '1' },
      { label: 'Percentage', value: '2' },
    ];
    this.getAllProducts();
    this.getAllRepaymentFrequency();
    // this.getAllLoanPurpose();
    this.getAllAccountTypes();
    this.getAllInsuranceVendors();
    // this.getAllOccupationTypes();
    // this.getAllGenders();
    //  this.getAllSchemeTypes();

    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.loanAccId = Number(id);
        this.isEdit = true;
        this.getSILoanApplicationById(this.loanAccId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })

    this.siLoanapplicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.siLoanapplicationForm.valid) {
      //   this.save();
      // }
    });
  }

  save() {
    this.updateData();
  }

  // updateData() {
  //   // if(this.siLoanapplicationForm.valid){
  //   //   this.disableAddButton = applicationConstants.FALSE;
  //   // } else {
  //   //   this.disableAddButton = applicationConstants.TRUE;
  //   // }
    
  //   // this.siLoanApplicationModel.siLoanInsuranceDetailsDTO = this.siLoanInsuranceDetailsModel;
  //   this.siLoanApplicationService.changeData({
  //     formValid: !this.siLoanapplicationForm.valid ? true : false,
  //     data: this.siLoanApplicationModel,
  //     isDisable: (!this.siLoanapplicationForm.valid),
  //     stepperIndex: 3,
  //   });
  // }
  updateData() {
    // Ensure the disbursement schedule list has at least one entry and form is valid
    const isDisbursementValid = this.siLoanDisbursementScheduleList && this.siLoanDisbursementScheduleList.length > 0;
    const isFormValid = this.siLoanapplicationForm.valid;
    this.saveAndNextButton = isDisbursementValid && isFormValid;
    this.siLoanApplicationService.changeData({
      formValid: isFormValid,
      data: this.siLoanApplicationModel,
      stepperIndex: 3,
      isDisable: !this.saveAndNextButton,
    });
  }
  getAllProducts() {
    this.commonComponent.startSpinner();
    this, this.siTransactionDetailsService.getAllApprovedProducts().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.productsList = this.responseModel.data.filter((product: { status: number; }) => product.status == 3).map((product: any) => {
          return { label: product.name, value: product.id };
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }
  onChangeQualificationChange() {
    let productName = this.productsList.find((data: any) => null != data && this.siLoanApplicationModel.siProductId != null && data.value == this.siLoanApplicationModel.siProductId);
      if (productName != null && undefined != productName)
        this.siLoanApplicationModel.siProductName = productName.label;
  }
 
  onChangeAccountType() {
    let accoutTypeName = this.operationTypesList.find((data: any) => null != data && this.siLoanApplicationModel.operationTypeId != null && data.value == this.siLoanApplicationModel.operationTypeId);
      if (accoutTypeName != null && undefined != accoutTypeName)
        this.siLoanApplicationModel.operationTypeName = accoutTypeName.label;
      this.updateData();
  }

  getAllRepaymentFrequency() {
    this.commonComponent.startSpinner();
    this, this.siTransactionDetailsService.getAllRepaymentFrequency().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.repaymentFrequencyList = this.responseModel.data.filter((repaymentFrequency: { status: number; }) => repaymentFrequency.status == 1).map((repaymentFrequency: any) => {
          return { label: repaymentFrequency.name, value: repaymentFrequency.id };
        });
        this.temprepaymentList = this.repaymentFrequencyList;
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  getAllLoanPurpose() {
    this.commonComponent.startSpinner();
     this.siTransactionDetailsService.getAllLoanPurpose().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.loanPurposeList = this.responseModel.data.filter((loanPurpose: { status: number; }) => loanPurpose.status == 1).map((loanPurpose: any) => {
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

  getAllAccountTypes() {
    this.siTransactionDetailsService.getAllAccountTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.operationTypesList = this.responseModel.data;
            this.operationTypesList = this.operationTypesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };

            });
          }
        }
        if (this.siLoanApplicationModel.operationTypeId != undefined) {
          const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === this.siLoanApplicationModel.operationTypeId);
          this.siLoanApplicationModel.operationTypeName = filteredItem.label;
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    })
  }

  // getAllSchemeTypes() {
  //   this.commonComponent.startSpinner();
  //   this, this.siTransactionDetailsService.getAllSchemeTypes().subscribe(response => {
  //     this.responseModel = response;
  //     if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
  //       this.commonComponent.stopSpinner();
  //       this.schemeTypesList = this.responseModel.data.filter((schemeType: { status: number; }) => schemeType.status == 1).map((schemeType: any) => {
  //         let newObj = { status: schemeType.name, code: schemeType.id };
  //         return newObj;
  //       });
  //     }
  //   },
  //     error => {
  //       this.msgs = [];
  //       this.commonComponent.stopSpinner();
  //       this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
  //     })
  // }

  getAllInsuranceVendors() {
    this.commonComponent.startSpinner();
    this, this.siTransactionDetailsService.getAllInsuranceVendors().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.insuranceVendorDetailsList = this.responseModel.data.filter((insuranceVendor: { status: number; }) => insuranceVendor.status == 1).map((insuranceVendor: any) => {
          let newObj = { label: insuranceVendor.name, value: insuranceVendor.id };
          return newObj;
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  getAllOccupationTypes() {
    this.commonComponent.startSpinner();
    this, this.siTransactionDetailsService.getAllOccupationTypes().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.occupationTypesList = this.responseModel.data.filter((occupationType: { status: number; }) => occupationType.status == 1).map((occupationType: any) => {
          let newObj = { status: occupationType.name, code: occupationType.id };
          return newObj;
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  getAllGenders() {
    this.commonComponent.startSpinner();
    this, this.siTransactionDetailsService.getAllGenders().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.gendersList = this.responseModel.data.filter((gender: { status: number; }) => gender.status == 1).map((gender: any) => {
          let newObj = { status: gender.name, code: gender.id };
          return newObj;
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  getAllRelationShipTypes() {
    this.commonComponent.startSpinner();
    this, this.siTransactionDetailsService.getAllRelationShipTypes().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.relationshipTypesList = this.responseModel.data.filter((relationShipType: { status: number; }) => relationShipType.status == 1).map((relationShipType: any) => {
          let newObj = { status: relationShipType.name, code: relationShipType.id };
          return newObj;
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }

  onChangeProduct(event: any) {
    this.displayDialog = true;
    this.productInfoFalg = true;
    if (event.value != null && event.value != undefined) {
      this.getProductDefinitionByProductIdAndApplicationDate(event.value);
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

  //get account details by admissionNumber list
  getSILoanApplicationById(loanAccId: any) {
    this.siLoanApplicationService.getSILoanApplicationById(loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.siLoanApplicationModel = this.responseModel.data[0];


            if (this.siLoanApplicationModel.siProductId != null && this.siLoanApplicationModel.siProductId != undefined)
              this.isProductDisable = applicationConstants.TRUE;

            if (this.siLoanApplicationModel.individualMemberDetailsDTO != undefined) {
              this.membershipBasicRequiredDetailsModel = this.siLoanApplicationModel.individualMemberDetailsDTO;

              if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
              }
              if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
              }
            }

            if (this.siLoanApplicationModel.memberGroupDetailsDTO != undefined && this.siLoanApplicationModel.memberGroupDetailsDTO != null) {
              this.memberGroupDetailsModel = this.siLoanApplicationModel.memberGroupDetailsDTO;

              if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
                this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

              if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
                this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

              if (this.siLoanApplicationModel.memberGroupDetailsDTO.isNewMember != undefined
                && this.siLoanApplicationModel.memberGroupDetailsDTO.isNewMember != null){
                  this.isMemberCreation = this.siLoanApplicationModel.memberGroupDetailsDTO.isNewMember;
                }
            }
            if (this.siLoanApplicationModel.memberInstitutionDTO != undefined && this.siLoanApplicationModel.memberInstitutionDTO != null) {
              this.membershipInstitutionDetailsModel = this.siLoanApplicationModel.memberInstitutionDTO;

              if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
                this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

              if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

              if (this.siLoanApplicationModel.memberInstitutionDTO.isNewMember != undefined
                && this.siLoanApplicationModel.memberInstitutionDTO.isNewMember != null)
                this.isMemberCreation = this.siLoanApplicationModel.memberInstitutionDTO.isNewMember;
            }
            if (this.siLoanApplicationModel.applicationDate == null || this.siLoanApplicationModel.applicationDate == undefined) {
              this.siLoanApplicationModel.applicationDateVal = this.commonFunctionsService.currentDate();

              if (this.siLoanApplicationModel.applicationDateVal != null && this.siLoanApplicationModel.applicationDateVal != undefined) {
                this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.applicationDateVal));
              }
            }
            else if (this.siLoanApplicationModel.applicationDate != null && this.siLoanApplicationModel.applicationDate != undefined) {
              this.siLoanApplicationModel.applicationDateVal = this.commonFunctionsService.dateConvertionIntoFormate(this.siLoanApplicationModel.applicationDate);
              this.siLoanApplicationModel.applicationDateVal = this.commonFunctionsService.currentDate();
            }

            if (this.siLoanApplicationModel.sanctionDate != null && this.siLoanApplicationModel.sanctionDate != undefined)
              this.siLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.siLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);

            if (this.siLoanApplicationModel.loanDueDate != null && this.siLoanApplicationModel.loanDueDate != undefined)
              this.siLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.siLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);

            if (this.siLoanApplicationModel.memberTypeName != null && this.siLoanApplicationModel.memberTypeName != undefined) {
              this.memberTypeName = this.siLoanApplicationModel.memberTypeName;
              if (this.siLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
                this.isIndividual = true;
            }
            if (this.siLoanApplicationModel.admissionNo != null && this.siLoanApplicationModel.admissionNo != undefined)
              this.admissionNumber = this.siLoanApplicationModel.admissionNo;

            if (this.siLoanApplicationModel.operationTypeName != null && this.siLoanApplicationModel.operationTypeName != undefined)
              this.applicationType = true;

            if (this.siLoanApplicationModel.siProductName != null && this.siLoanApplicationModel.siProductName != undefined)
              this.productInfoFalg = true;

            this.getProductDefinitionByProductIdAndApplicationDate(this.siLoanApplicationModel.siProductId); 
            if(this.siLoanProductDefinitionModel.isInsuranceAppicable == applicationConstants.TRUE){
              if (this.siLoanApplicationModel.siLoanInsuranceDetailsDTO != null && this.siLoanApplicationModel.siLoanInsuranceDetailsDTO != undefined) {
                this.siLoanInsuranceDetailsModel = this.siLoanApplicationModel.siLoanInsuranceDetailsDTO;
                this.insurenceFlag = true;
                const vendorId = this.insurenceDetailsForm.get('vendorId');
                if (vendorId) {
                  vendorId.setValidators([Validators.required]);
                  vendorId.updateValueAndValidity();
                }
                const policyName = this.insurenceDetailsForm.get('policyName');
                if (policyName) {
                  policyName.setValidators([Validators.required]);
                  policyName.updateValueAndValidity();
                }
                const policyNumber = this.insurenceDetailsForm.get('policyNumber');
                if (policyNumber) {
                  policyNumber.setValidators([Validators.required]);
                  policyNumber.updateValueAndValidity();
                }
                const sumInsured = this.insurenceDetailsForm.get('sumInsured');
                if (sumInsured) {
                  sumInsured.setValidators([Validators.required]);
                  sumInsured.updateValueAndValidity();
                }
                const premium = this.insurenceDetailsForm.get('premium');
                if (premium) {
                  premium.setValidators([Validators.required]);
                  premium.updateValueAndValidity();
                }
    
              }
            }else{
              this.insurenceFlag = false;
              this.removeValidators('vendorId');
              this.removeValidators('policyName');
              this.removeValidators('policyNumber');
              this.removeValidators('sumInsured');
              this.removeValidators('premium');
            }

           
            // if (this.siLoanApplicationModel.siProductDefinitionDTO != null && this.siLoanApplicationModel.siProductDefinitionDTO != undefined) {
            //   this.siLoanProductDefinitionModel = this.siLoanApplicationModel.siProductDefinitionDTO;
            //   if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != null)
            //     this.siLoanInterestPolicyModel = this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0];
            // }
            // if (this.siLoanApplicationModel.siLoanDisbursementScheduleDTOList != null)
            //   this.siLoanDisbursementScheduleList = this.siLoanApplicationModel.siLoanDisbursementScheduleDTOList;

            if (this.siLoanApplicationModel.siDisbursementDTOList != null)
              this.siLoanDisbursementScheduleList = this.siLoanApplicationModel.siDisbursementDTOList;

            this.siLoanDisbursementScheduleList.map((obj: any) => {
              if (obj.disbursementDate != null && obj.disbursementDate != undefined)
                obj.disbursementDateVal = this.datePipe.transform(obj.disbursementDate, this.orgnizationSetting.datePipe);

            });
            if (this.siLoanApplicationModel.plannedDisbursements != null && this.siLoanApplicationModel.plannedDisbursements != undefined && this.siLoanApplicationModel.plannedDisbursements > 0) {
              if (this.siLoanApplicationModel.siDisbursementDTOList != null && this.siLoanApplicationModel.siDisbursementDTOList.length > 0) {
                if (this.siLoanApplicationModel.siDisbursementDTOList.length >= this.siLoanApplicationModel.plannedDisbursements) {
                  this.disableAddButton = true;
                } else {
                  this.disableAddButton = false;
                }
              } else {
                this.disableAddButton = false;
              }
              this.siLoanapplicationForm.get('plannedDisbursements')?.disable();
            } else {
              this.disableAddButton = true;
              this.siLoanapplicationForm.get('plannedDisbursements')?.enable();
            }
           

          
          }
          this.updateData();
        }
      }
    });
  }
 
  onSelectApplicationDate() {
    this.msgs = [];
    let flag = false;
    if (this.siLoanApplicationModel.applicationDateVal != undefined) {
      this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.applicationDateVal));

      if (this.siLoanApplicationModel.sanctionDateVal != undefined)
        this.siLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.sanctionDateVal));

      if (this.siLoanApplicationModel.loanDueDateVal != undefined)
        this.siLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.loanDueDateVal));

      if (!flag && this.siLoanApplicationModel.individualMemberDetailsDTO.admissionDate > this.siLoanApplicationModel.applicationDate) {
        flag = true;
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.APPLICATION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
      } else if (!flag && this.siLoanApplicationModel.sanctionDate != undefined && this.siLoanApplicationModel.sanctionDate < this.siLoanApplicationModel.applicationDate) {
        flag = true;
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.APPLICATION_DATE_SHOULD_NOT_GREATER_THAN_SANCTION_DATE }];
      } else if (!flag && this.siLoanApplicationModel.loanDueDate != undefined && this.siLoanApplicationModel.loanDueDate < this.siLoanApplicationModel.applicationDate) {
        flag = true;
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.APPLICATION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
      } else {
        this.getProductDefinitionByProductIdAndApplicationDate(this.siLoanApplicationModel.siProductId);
      }

      if(flag){
        this.siLoanapplicationForm.get('applicationDate')?.reset();
        this.siLoanApplicationModel.applicationDate = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      
    }
  }

  onSelectSanctionDate() {
    let flag = false;
    this.msgs = [];
    if (this.siLoanApplicationModel.sanctionDateVal != undefined) {
      this.siLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.sanctionDateVal));

      if (this.siLoanApplicationModel.applicationDateVal != undefined)
        this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.applicationDateVal));

      if (this.siLoanApplicationModel.loanDueDateVal != undefined)
        this.siLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.loanDueDateVal));
      if(this.siLoanApplicationModel.individualMemberDetailsDTO != null){
        if (!flag && this.siLoanApplicationModel.individualMemberDetailsDTO.admissionDate != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO.admissionDate > this.siLoanApplicationModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else 
        if (!flag && this.siLoanApplicationModel.applicationDate != undefined && this.siLoanApplicationModel.applicationDate > this.siLoanApplicationModel.sanctionDate
        ) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_BE_IN_BETWEEN_MIN_AND_MAX_DATES }];
        } else if(this.siLoanApplicationModel.sanctionDate >= this.siLoanProductDefinitionModel.endDate  && this.siLoanApplicationModel.sanctionDate <= this.siLoanProductDefinitionModel.effectiveStartDate){
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
  
        }
        else if(!flag && this.siLoanApplicationModel.loanDueDate != undefined && this.siLoanApplicationModel.loanDueDate < this.siLoanApplicationModel.sanctionDate){
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
        }
      }else if(this.siLoanApplicationModel.memberGroupDetailsDTO != null){
        if (!flag && this.siLoanApplicationModel.memberGroupDetailsDTO.admissionDate != undefined && this.siLoanApplicationModel.memberGroupDetailsDTO.admissionDate > this.siLoanApplicationModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else 
        if (!flag && this.siLoanApplicationModel.applicationDate != undefined && this.siLoanApplicationModel.applicationDate > this.siLoanApplicationModel.sanctionDate
        ) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_BE_IN_BETWEEN_MIN_AND_MAX_DATES }];
        } else if(this.siLoanApplicationModel.sanctionDate >= this.siLoanProductDefinitionModel.endDate  && this.siLoanApplicationModel.sanctionDate <= this.siLoanProductDefinitionModel.effectiveStartDate){
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
  
        }
        else if(!flag && this.siLoanApplicationModel.loanDueDate != undefined && this.siLoanApplicationModel.loanDueDate < this.siLoanApplicationModel.sanctionDate){
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
        }
      }else{
        if (!flag && this.siLoanApplicationModel.memberInstitutionDTO.admissionDate != undefined && this.siLoanApplicationModel.memberInstitutionDTO.admissionDate > this.siLoanApplicationModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else 
        if (!flag && this.siLoanApplicationModel.applicationDate != undefined && this.siLoanApplicationModel.applicationDate > this.siLoanApplicationModel.sanctionDate
        ) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_BE_IN_BETWEEN_MIN_AND_MAX_DATES }];
        } else if(this.siLoanApplicationModel.sanctionDate >= this.siLoanProductDefinitionModel.endDate  && this.siLoanApplicationModel.sanctionDate <= this.siLoanProductDefinitionModel.effectiveStartDate){
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
  
        }
        else if(!flag && this.siLoanApplicationModel.loanDueDate != undefined && this.siLoanApplicationModel.loanDueDate < this.siLoanApplicationModel.sanctionDate){
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
        }
      }

      

      if(flag){
        this.siLoanapplicationForm.get('sanctionDate')?.reset();
        this.siLoanApplicationModel.sanctionDate = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      
    }
  }

  onSelectLoanDueDate() {
    let flag = false;
    this.msgs = [];
    if (this.siLoanApplicationModel.loanDueDateVal != undefined) {
      this.siLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.loanDueDateVal));

      if (this.siLoanApplicationModel.applicationDateVal != undefined)
        this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.applicationDateVal));

      if (this.siLoanApplicationModel.sanctionDateVal != undefined)
        this.siLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.sanctionDateVal));
      if(this.siLoanApplicationModel.individualMemberDetailsDTO != null){
        if (!flag && this.siLoanApplicationModel.individualMemberDetailsDTO.admissionDate != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO.admissionDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else if (!flag && this.siLoanApplicationModel.applicationDate != undefined && this.siLoanApplicationModel.applicationDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.siLoanApplicationModel.sanctionDate != undefined && this.siLoanApplicationModel.sanctionDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_SANCTION_DATE }];
        }
      }else if(this.siLoanApplicationModel.memberGroupDetailsDTO != null){
        if (!flag && this.siLoanApplicationModel.memberGroupDetailsDTO.admissionDate != undefined && this.siLoanApplicationModel.memberGroupDetailsDTO.admissionDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else if (!flag && this.siLoanApplicationModel.applicationDate != undefined && this.siLoanApplicationModel.applicationDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.siLoanApplicationModel.sanctionDate != undefined && this.siLoanApplicationModel.sanctionDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_SANCTION_DATE }];
        }
      }else{
        if (!flag && this.siLoanApplicationModel.memberInstitutionDTO.admissionDate != undefined && this.siLoanApplicationModel.memberInstitutionDTO.admissionDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else if (!flag && this.siLoanApplicationModel.applicationDate != undefined && this.siLoanApplicationModel.applicationDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.siLoanApplicationModel.sanctionDate != undefined && this.siLoanApplicationModel.sanctionDate > this.siLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_SANCTION_DATE }];
        }
      }
     

      if(flag){
        this.siLoanapplicationForm.get('loanDueDate')?.reset();
        this.siLoanApplicationModel.loanDueDate = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
  }

  getProductDefinitionByProductIdAndApplicationDate(productId: any) {
    // this.siLoanapplicationForm.get('applicationNumber').reset();
    // this.siLoanapplicationForm.get('operationTypeId').reset();
    // this.siLoanapplicationForm.get('roi').reset();
    // this.siLoanapplicationForm.get('penalRoi').reset();
    // this.siLoanapplicationForm.get('iod').reset();
    // this.siLoanapplicationForm.get('repaymentFrequency').reset();
    // this.siLoanapplicationForm.get('monthlyIncome').reset();
    // this.siLoanapplicationForm.get('purposeId').reset();
    // this.siLoanapplicationForm.get('requestedAmount').reset();
    // this.siLoanapplicationForm.get('sanctionAmount').reset();
    // this.siLoanapplicationForm.get('sanctionDate').reset();
    // this.siLoanapplicationForm.get('plannedDisbursements').reset();
    // this.siLoanapplicationForm.get('loanPeriod').reset();
    // this.siLoanapplicationForm.get('loanDueDate').reset();


    if (this.siLoanApplicationModel.applicationDateVal != undefined && this.siLoanApplicationModel.applicationDateVal != null)
      this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.applicationDateVal));

    this.siProductDefinitionService.getSIProductDefinitionByProductIdAndApplicationDate(this.pacsId, productId, this.siLoanApplicationModel.id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.siLoanProductDefinitionModel = this.responseModel.data[0];

          if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != null) {
            this.siLoanInterestPolicyModel = this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0];
          }
          if(this.siLoanProductDefinitionModel.isInsuranceAppicable != null && this.siLoanProductDefinitionModel.isInsuranceAppicable ==applicationConstants.TRUE){
            this.insurenceFlag = true;

          
            const vendorId = this.insurenceDetailsForm.get('vendorId');
            if (vendorId) {
              vendorId.setValidators([Validators.required]);
              vendorId.updateValueAndValidity();
            }
            const policyName = this.insurenceDetailsForm.get('policyName');
            if (policyName) {
              policyName.setValidators([Validators.required]);
              policyName.updateValueAndValidity();
            }
            const policyNumber = this.insurenceDetailsForm.get('policyNumber');
            if (policyNumber) {
              policyNumber.setValidators([Validators.required]);
              policyNumber.updateValueAndValidity();
            }
            const sumInsured = this.insurenceDetailsForm.get('sumInsured');
            if (sumInsured) {
              sumInsured.setValidators([Validators.required]);
              sumInsured.updateValueAndValidity();
            }
            const premium = this.insurenceDetailsForm.get('premium');
            if (premium) {
              premium.setValidators([Validators.required]);
              premium.updateValueAndValidity();
            }

          }else{
            this.insurenceFlag = false;
            this.removeValidators('vendorId');
            this.removeValidators('policyName');
            this.removeValidators('policyNumber');
            this.removeValidators('sumInsured');
            this.removeValidators('premium');
          }
          this.loanPurposeList = this.siLoanProductDefinitionModel.siProdPurposeConfigDTOList;
          if(this.loanPurposeList != null && this.loanPurposeList != undefined){
            this.loanPurposeList =this.loanPurposeList.filter((loanPurpose: { status: number; }) => loanPurpose!= null).map((loanPurpose: any) => {
              return { label:loanPurpose.loanPurposeName, value: loanPurpose.purposeId };
            });
          }
  
            if (this.siLoanInterestPolicyModel.roi != undefined && this.siLoanInterestPolicyModel.roi != null)
            this.siLoanApplicationModel.effectiveRoi = this.siLoanInterestPolicyModel.roi;

            if (this.siLoanInterestPolicyModel.penalInterest != undefined && this.siLoanInterestPolicyModel.penalInterest != null)
              this.siLoanApplicationModel.penalInterest = this.siLoanInterestPolicyModel.penalInterest;
  
            if (this.siLoanInterestPolicyModel.iod != undefined && this.siLoanInterestPolicyModel.iod != null)
              this.siLoanApplicationModel.iod = this.siLoanInterestPolicyModel.iod;

            if (this.siLoanProductDefinitionModel.interestPostingFrequencyName != undefined && this.siLoanProductDefinitionModel.interestPostingFrequencyName != null)
              this.siLoanApplicationModel.repaymentFrequency = this.siLoanProductDefinitionModel.interestPostingFrequency;

            this.repaymentFrequencyList = this.temprepaymentList.filter(obj => obj != null && obj.value == this.siLoanApplicationModel.repaymentFrequency);
          
        }
      }
      this.onChangeQualificationChange();
    });
  }

  removeValidators(controlName: string) {
    const control = this.insurenceDetailsForm.get(controlName);
    if (control) {
      control.setValidators(null);
      control.updateValueAndValidity();
    }
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
  //   this.getProductDefinitionByProductId(this.siLoanApplicationModel.siProductId);
  // }

  closeProductDefinition() {
    this.productDefinitionFlag = false;
  }

  addSILoanDisbursementSchedule() {
    this.siLoanDisbursement = new SiLoanDisbursement();
    this.disableAddButton = true;
    this.editDeleteDisable = true;
    if (this.siLoanDisbursementScheduleList != null && this.siLoanDisbursementScheduleList != undefined && this.siLoanDisbursementScheduleList.length > 0) {
      this.siLoanDisbursement.disbursementNumber = this.siLoanDisbursementScheduleList.length + 1;
    } else {
      this.siLoanDisbursement.disbursementNumber = 1;
    }
    /**
     * for update validation
     */
    this.updateData();
    this.disbursement._first = 0;
    this.disbursement.value.unshift({ disbursementNumber: this.siLoanDisbursement.disbursementNumber, type: '', disbursementLimit: '', disbursementAmount: '', disbursementOrder: '', remarks: '' });
    this.disbursement.initRowEdit(this.disbursement.value[0]);
  }

  // saveSILoanDisbursementSchedule(row: any) {
  //   this.editDeleteDisable = false;
  //   this.siLoanDisbursement = row;
  //   this.siLoanDisbursement.siLoanApplicationId = this.loanAccId;
  //   this.siLoanDisbursement.status = applicationConstants.ACTIVE;
  //   if (row.id != null && row.id != undefined) {
  //     this.siDisbursementService.u(this.siLoanDisbursement).subscribe((response: any) => {
  //       this.responseModel = response;
  //       if (this.responseModel != null && this.responseModel != undefined) {
  //         if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
  //           if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
  //             this.siLoanDisbursement = this.responseModel.data;
  //             if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
  //               // this.getSILoanApplicationById(this.responseModel.data[0].siLoanApplicationId);
  //             }
  //             this.msgs = [];
  //             this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
  //             setTimeout(() => {
  //               this.msgs = [];
  //             }, 2000);
  //           }
  //           this.updateData();
  //         }
  //         else {
  //           this.msgs = [];
  //           this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
  //           setTimeout(() => {
  //             this.msgs = [];
  //           }, 2000);
  //         }
  //       }
  //     }, error => {
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
  //       setTimeout(() => {
  //         this.msgs = [];
  //       }, 2000);
  //     });
  //   }
  //   else {
  //     this.siLoanDisbursementScheduleService.addSILoanDisbursementSchedule(this.siLoanDisbursement).subscribe((response: any) => {
  //       this.responseModel = response;
  //       if (this.responseModel != null && this.responseModel != undefined) {
  //         if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
  //           if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
  //             this.siLoanDisbursement = this.responseModel.data;
  //             if (this.responseModel.data[0].siLoanApplicationId != null && this.responseModel.data[0].siLoanApplicationId != undefined) {
  //               // this.getSILoanApplicationById(this.responseModel.data[0].siLoanApplicationId);
  //             }
  //             this.msgs = [];
  //             this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
  //             setTimeout(() => {
  //               this.msgs = [];
  //             }, 2000);
  //           }
  //           this.updateData();
  //         }
  //         else {
  //           this.msgs = [];
  //           this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
  //           setTimeout(() => {
  //             this.msgs = [];
  //           }, 2000);
  //         }
  //       }
  //     }, error => {
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
  //       setTimeout(() => {
  //         this.msgs = [];
  //       }, 3000);
  //     });
  //   }
  // }
  saveSILoanDisbursementSchedule(row: any) {
    this.editDeleteDisable = false;
    this.siLoanDisbursement = row;
    this.siLoanDisbursement.siLoanApplicationId = this.loanAccId;
    this.siLoanDisbursement.statusName = applicationConstants.SCHEDULED;
    this.siLoanDisbursement.accountNumber = this.accountNumber

    if (this.siLoanDisbursement.disbursementDateVal != null && this.siLoanDisbursement.disbursementDateVal != undefined)
      this.siLoanDisbursement.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanDisbursement.disbursementDateVal));

    if (row.id != null && row.id != undefined) {
      this.siDisbursementService.updateSIDisbursement(this.siLoanDisbursement).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanDisbursement = this.responseModel.data[0];
              this.loanAccId = this.siLoanDisbursement.siLoanApplicationId;
             
              this.msgs = [];
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
            if ( this.loanAccId != null &&  this.loanAccId != undefined) {
              this.getAllDisbusementByLoanApplicationId( this.loanAccId);
            }
            this.updateData();
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
          
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
    }
    else {
      this.siDisbursementService.addSIDisbursement(this.siLoanDisbursement).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanDisbursement = this.responseModel.data[0];
              this.loanAccId = this.siLoanDisbursement.siLoanApplicationId;
              this.msgs = [];
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
            if ( this.loanAccId != null &&  this.loanAccId != undefined) {
              this.getAllDisbusementByLoanApplicationId( this.loanAccId);
            }
            this.updateData();
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  editSILoanDisbursement(rowData: any) {
    this.disableAddButton = true;
    this.editDeleteDisable = true;
    this.siDisbursementService.getSIDisbursementById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.siLoanDisbursement = this.responseModel.data[0];
            if (this.siLoanDisbursement.disbursementDate != null && this.siLoanDisbursement.disbursementDate != undefined)
              this.siLoanDisbursement.disbursementDateVal = this.datePipe.transform(this.siLoanDisbursement.disbursementDate, this.orgnizationSetting.datePipe);
          }
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.updateData();
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  cancelSILoanDisbursementSchedule() {
    this.siLoanDisbursementScheduleList = [];
    this.disableAddButton = false;
    this.editDeleteDisable = false;
    this.getSILoanApplicationById(this.loanAccId);
  }

  deleteSILoanDisbursementSchedule(rowData: any) {
    this.displayDeleteDialog = true;
    this.deleteId = rowData.id;
  }

  delete() {
    this.commonComponent.startSpinner();
    this.siDisbursementService.deleteSIDisbursement(this.deleteId).subscribe((response: any) => {
      this.responseModel = response;
      this.msgs = [];
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.siLoanDisbursementScheduleList = this.responseModel.data;
        this.commonComponent.stopSpinner();
        this.displayDeleteDialog = false;
        this.getSILoanApplicationById(this.loanAccId);
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      } else {
        this.displayDeleteDialog = false;
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
  }

  noDelete() {
    this.displayDeleteDialog = applicationConstants.FALSE;
  }

  checkPlannedDisbursement() {
    if (this.siLoanApplicationModel.siDisbursementDTOList != null)
      this.siLoanDisbursementScheduleList = this.siLoanApplicationModel.siDisbursementDTOList;

    if (this.siLoanapplicationForm.valid && this.siLoanApplicationModel.plannedDisbursements != null && this.siLoanApplicationModel.plannedDisbursements != undefined && this.siLoanApplicationModel.plannedDisbursements > 0) {
      if (this.siLoanApplicationModel.siDisbursementDTOList != null && this.siLoanApplicationModel.siDisbursementDTOList.length > 0) {
        if (this.siLoanApplicationModel.siDisbursementDTOList.length >= this.siLoanApplicationModel.plannedDisbursements) {
          this.disableAddButton = applicationConstants.TRUE;
        } else {
          this.disableAddButton = applicationConstants.FALSE;
        }
      } else {
        this.disableAddButton = applicationConstants.FALSE;
      }
    } else {
      this.disableAddButton = applicationConstants.TRUE;
    }
  }
  //save and update application details
    saveAndUpdateApplicationDetails(siLoanApplicationModel:any) {
      siLoanApplicationModel.pacsId = this.pacsId;
      // siLoanApplicationModel.pacsCode = this.pacsCode;
     
      siLoanApplicationModel.branchId = this.branchId;
      this.memberTypeId = siLoanApplicationModel.memberTypeId;
      if (siLoanApplicationModel.applicationDateVal != null &&siLoanApplicationModel.applicationDateVal != undefined)
        siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(siLoanApplicationModel.applicationDateVal));
  
      if (siLoanApplicationModel.sanctionDateVal != null && siLoanApplicationModel.sanctionDateVal != undefined)
        siLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(siLoanApplicationModel.sanctionDateVal));
  
      if (siLoanApplicationModel.loanDueDateVal != null && siLoanApplicationModel.loanDueDateVal != undefined)
        siLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(siLoanApplicationModel.loanDueDateVal));
  
      this.operationTypesList.filter(data => data != null && data.value ==  this.siLoanApplicationModel.operationTypeId).map(count => {
        this.siLoanApplicationModel.operationTypeName = count.label;
        this.operationTypeName =  this.siLoanApplicationModel.operationTypeName
      }) 
      if (siLoanApplicationModel.id != null) {
        this.siLoanApplicationModel.siLoanInsuranceDetailsDTO = this.siLoanInsuranceDetailsModel;
        this.siLoanApplicationService.updateSILoanApplication(siLoanApplicationModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
              if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
                this.loanAccId = this.responseModel.data[0].id;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
                if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                  this.accountNumber = this.responseModel.data[0].accountNumber;
                }
                if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                  this.admissionNumber = this.responseModel.data[0].admissionNo;
                }
              }
            this.siLoanApplicationModel.siLoanInsuranceDetailsDTO = this.siLoanInsuranceDetailsModel;

            }
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
          this.getSILoanApplicationById(this.loanAccId);
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      } else {
        this.siLoanApplicationModel.siLoanInsuranceDetailsDTO = this.siLoanInsuranceDetailsModel;
        this.siLoanApplicationService.addSILoanApplication(siLoanApplicationModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null)
                this.loanAccId = this.responseModel.data[0].id;
              if (this.responseModel.data[0].operationTypeName != undefined && this.responseModel.data[0].operationTypeName != null)
                this.operationTypeName = this.responseModel.data[0].operationTypeName;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                this.accountNumber = this.responseModel.data[0].accountNumber;
              }
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
            }
          } else {
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
          this.getSILoanApplicationById(this.loanAccId);
        }, error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
      }
    }

    /**
       * @implements get product details
       * @param id 
       * @author k.yamuna
       */
  getProductDefinitionByProductId(id: any) {
    this.simpleInterestProductDefinitionService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        this.simpleInterestProductDefinitionModel = this.responseModel.data[0];
        if (null != this.simpleInterestProductDefinitionModel.effectiveStartDate && undefined != this.simpleInterestProductDefinitionModel.effectiveStartDate)
          this.simpleInterestProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.simpleInterestProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

        if (this.simpleInterestProductDefinitionModel.siProdCollateralsConfigDTOList) {
          this.collateralList = this.simpleInterestProductDefinitionModel.siProdCollateralsConfigDTOList
            .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
            .map((item: { collateralTypeName: string, collateralType: any }) => ({
              label: item.collateralTypeName,
              value: item.collateralType
            }));
        }


        if (this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList != null && this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList.length > 0) {
          this.interestPolicyList = this.simpleInterestProductDefinitionModel.siInterestPolicyConfigDTOList;
          this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }
        if (this.simpleInterestProductDefinitionModel.siApportionConfigDTOList != null && this.simpleInterestProductDefinitionModel.siApportionConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siApportionConfigDTOList.length > 0) {
          this.collectionOrderList = this.simpleInterestProductDefinitionModel.siApportionConfigDTOList;
          this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }
        if (this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != null && this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList.length > 0) {
          this.linkedShareCapitalList = this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList;
          this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }

        if (this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList != null && this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList.length > 0) {
          this.chargesList = this.simpleInterestProductDefinitionModel.siProductChargesConfigDTOList;
          this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }
        if (this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList != null && this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList.length > 0) {
          this.purposeList = this.simpleInterestProductDefinitionModel.siProdPurposeConfigDTOList;
          this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }

        if (this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList != null && this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList != undefined && this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList.length > 0) {
          this.requiredDocumentsList = this.simpleInterestProductDefinitionModel.siRequiredDocumentsConfigDTOList;
          this.requiredDocumentsList = this.requiredDocumentsList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
            object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
            return object;
          });
        }
      }
    });
  }
  productViewPopUp(){
    this.displayDialog = true;
    if(this.siLoanApplicationModel.siProductId != null && this.siLoanApplicationModel.siProductId != undefined){
      this.getProductDefinitionByProductId(this.siLoanApplicationModel.siProductId);
    }
    else {
      this.msgs = [];
          this.msgs = [{ severity: 'error', detail: "Please Select Product" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
    }
    
  }
 getAllDisbusementByLoanApplicationId(loanAccId:any) {
    this.siDisbursementService.getSIDisbursementListByApplicationId(loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.siLoanDisbursementScheduleList = this.responseModel.data;
          this.siLoanDisbursementScheduleList.map(obj =>{
            if (obj.disbursementDate != null && obj.disbursementDate != undefined)
              obj.disbursementDateVal = this.datePipe.transform(obj.disbursementDate, this.orgnizationSetting.datePipe);
          })
          
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
   /**
     * @implements SanctionAmount in between min and max amount for product definition
     * @author k.yamuna
     */
  onSelectSanctionAmountCailculation(sanctionAmount:any) {
    let flag = false;
    if (sanctionAmount != undefined) {
      if ( sanctionAmount != undefined && this.siLoanApplicationModel.sanctionAmount >= this.siLoanProductDefinitionModel.eligibleMInAmount && 
        sanctionAmount <= this.siLoanProductDefinitionModel.eligibleMaxAmount) {
          flag = true;
      } 
      else{
        flag = false;
      }
      if(!flag){
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_AMOUNT_SHOULD_BE_MIN_AND_MAX_AMOUNT }];
        this.siLoanapplicationForm.get('sanctionAmount')?.reset();
        this.siLoanApplicationModel.sanctionAmount = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      
    }
  }
    /**
     * @implements PeriodInMonths in between min and max PeriodInMonths for product definition
     * @author k.yamuna
     */
  onSelectPeriodInMonths(months:any) {
    let flag = false;
    if (months != undefined) {
      if ( months != undefined && months >= this.siLoanProductDefinitionModel.minLoanPeriod && 
        months <= this.siLoanProductDefinitionModel.maxLoanPeriod) {
          flag = true;
      } 
      else{
        flag = false;
      }
      if(!flag){
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.LOAN_PERIOD_IN_MOTHS_SHOULD_BE_MIN_AND_MAX_AMOUNT }];
        this.siLoanapplicationForm.get('loanPeriod')?.reset();
        this.siLoanApplicationModel.loanPeriod = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      
    }
  }

 
}

