import { Component, ViewChild } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermApplication, TermLoanDisbursementScheduleModel, TermLoanInsuranceDetails, TermLoanInterestPolicy, TermLoanProductDefinition } from './shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { TermApplicationService } from './shared/term-application.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Table } from 'primeng/table';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { TermLoanDisbursementService } from '../../term-loan-operations/term-loan-disbursement/shared/term-loan-disbursement.service';
import { TermLoanDisbursement } from '../../term-loan-operations/term-loan-disbursement/shared/term-loan-disbursement.model';
import { LoanPurposeService } from 'src/app/configurations/loan-config/loan-purpose/shared/loan-purpose.service';
import { TermLoanPurposeService } from '../../term-loan-product-definition/term-loan-product-definition-stepper/term-loan-purpose/shared/term-loan-purpose.service';

@Component({
  selector: 'app-term-loan-application-details',
  templateUrl: './term-loan-application-details.component.html',
  styleUrls: ['./term-loan-application-details.component.css']
})
export class TermLoanApplicationDetailsComponent {
  termLoanapplicationForm: FormGroup;
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
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanInterestPolicyModel: TermLoanInterestPolicy = new TermLoanInterestPolicy();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanInsuranceDetailsModel: TermLoanInsuranceDetails = new TermLoanInsuranceDetails();
  termLoanDisbursementModel: TermLoanDisbursement = new TermLoanDisbursement();
  memberTypeName: any;
  termLoanApplicationId: any;
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
  termLoanDisbursementScheduleList: any[] = [];
  editDeleteDisable: boolean = false;
  disbursementTypesList: any[] = [];
  disableAddButton: boolean = false;
  deleteId: any;
  pacsId: any;
  branchId: any;
  isDisabled:  boolean = false;
  accountNumber: any;
  memberTypeId: any;
  // operationTypeName: any;
  collateralList: any[] = [];
  insurenceFlag: boolean = false;
  termProductId: any;
  isDisbursementsNotMatchedCheck: boolean = true;
  saveAndNextButton:boolean = false;
  temprepaymentList: any[]=[];
  constructor(private router: Router, private formBuilder: FormBuilder,
    private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
   private datePipe: DatePipe, private termLoanPurposeService :TermLoanPurposeService,
    private commonFunction: CommonFunctionsService,  private termLoanApplicationsService: TermApplicationService,
    private activateRoute: ActivatedRoute,  private fileUploadService: FileUploadService,private termLoanDisbursementService: TermLoanDisbursementService,) {

      this.termLoanapplicationForm = this.formBuilder.group({
        termProductId: ['', [Validators.required]],
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
        'type': new FormControl('', Validators.required),
        'disbursementAmount': ['', [Validators.required,Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]],
        'minMonthsForDisbursement':['', [Validators.required,Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]],
        'disbursementOrder': new FormControl('', Validators.required),
        'remarks': new FormControl('', ),
        'disbursementDate':new FormControl('', Validators.required),
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
      // this.getAllRepaymentFrequency();
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
          this.termLoanApplicationId = Number(id);
          this.isEdit = true;
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
          this.commonComponent.stopSpinner();
        } else {
          this.isEdit = false;
          this.commonComponent.stopSpinner();
        }
      })
  
      this.termLoanapplicationForm.valueChanges.subscribe((data: any) => {
        this.updateData();
        // if (this.termLoanapplicationForm.valid) {
        //   this.save();
        // }
      });
      if (this.termLoanApplicationModel != null && this.termLoanApplicationModel != undefined) {
        if (this.termLoanApplicationModel.termProductId != null && this.termLoanApplicationModel.termProductId != undefined) {
          this.getAllLoanPurpose(this.termLoanApplicationModel.termProductId);
        }
      }
    }
  
    save() {
      this.updateData();
    }
  
    updateData() {
      // Ensure the disbursement schedule list has at least one entry and form is valid
      const isDisbursementValid = this.termLoanDisbursementScheduleList && this.termLoanDisbursementScheduleList.length > 0;
      const isFormValid = this.termLoanapplicationForm.valid;
      this.saveAndNextButton = isDisbursementValid && isFormValid;
      this.termLoanApplicationsService.changeData({
        formValid: isFormValid,
        data: this.termLoanApplicationModel,
        stepperIndex: 3,
        isDisable: !this.saveAndNextButton,
      });
    }
  
    getAllProducts() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getActiveProductsBasedOnPacsId(this.pacsId).subscribe(response => {
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
      let productName = this.productsList.find((data: any) => null != data && this.termLoanApplicationModel.termProductId != null && data.value == this.termLoanApplicationModel.termProductId);
        if (productName != null && undefined != productName)
          this.termLoanApplicationModel.termProductName = productName.label;
    }
   
    onChangeAccountType() {
      let accoutTypeName = this.operationTypesList.find((data: any) => null != data && this.termLoanApplicationModel.operationTypeId != null && data.value == this.termLoanApplicationModel.operationTypeId);
      if (accoutTypeName != null && undefined != accoutTypeName)
        this.termLoanApplicationModel.operationTypeName = accoutTypeName.label;
      this.updateData();
    }
  
  


    getAllLoanPurpose(productId: any) {
      this.commonComponent.startSpinner();
      this.termLoanPurposeService.getTermLoanPurposeByProductId(this.termLoanApplicationModel.termProductId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.loanPurposeList = this.responseModel.data;
          this.loanPurposeList = this.loanPurposeList.filter((activity: any) => activity != null).map((act: { loanPurposeName: any; purposeId: any; }) => {
            return { label: act.loanPurposeName, value: act.purposeId };
          });
         
          this.commonComponent.stopSpinner();
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      });
    }
  
    getAllAccountTypes() {
      this.termLoanApplicationsService.getAllAccountTypes().subscribe((res: any) => {
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
          if (this.termLoanApplicationModel.operationTypeId != undefined && this.termLoanApplicationModel.operationTypeId != null) {
            const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === this.termLoanApplicationModel.operationTypeId);
            this.termLoanApplicationModel.operationTypeName = filteredItem.label;
          }
        }
      }, error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
    }
  
   
    getAllInsuranceVendors() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllInsuranceVendors().subscribe(response => {
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
      this.termLoanApplicationsService.getAllOccupationTypes().subscribe(response => {
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
       this.termLoanApplicationsService.getAllGenders().subscribe(response => {
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
      this.termLoanApplicationsService.getAllRelationTypes().subscribe(response => {
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
    getTermApplicationByTermAccId(termLoanApplicationId: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(termLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanApplicationModel = this.responseModel.data[0];
  
  
              if (this.termLoanApplicationModel.termProductId != null && this.termLoanApplicationModel.termProductId != undefined)
                this.isProductDisable = applicationConstants.TRUE;
  
              if (this.termLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
  
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
  
              if (this.termLoanApplicationModel.memberGroupDetailsDTO != undefined && this.termLoanApplicationModel.memberGroupDetailsDTO != null) {
                this.memberGroupDetailsModel = this.termLoanApplicationModel.memberGroupDetailsDTO;
  
                if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
                  this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
                  this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
  
                if (this.termLoanApplicationModel.memberGroupDetailsDTO.isNewMember != undefined
                  && this.termLoanApplicationModel.memberGroupDetailsDTO.isNewMember != null){
                    this.isMemberCreation = this.termLoanApplicationModel.memberGroupDetailsDTO.isNewMember;
                  }
              }
              if (this.termLoanApplicationModel.memberInstitutionDTO != undefined && this.termLoanApplicationModel.memberInstitutionDTO != null) {
                this.membershipInstitutionDetailsModel = this.termLoanApplicationModel.memberInstitutionDTO;
  
                if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
                  this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
  
                if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                  this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                if (this.termLoanApplicationModel.memberInstitutionDTO.isNewMember != undefined
                  && this.termLoanApplicationModel.memberInstitutionDTO.isNewMember != null)
                  this.isMemberCreation = this.termLoanApplicationModel.memberInstitutionDTO.isNewMember;
              }
              if (this.termLoanApplicationModel.applicationDate == null || this.termLoanApplicationModel.applicationDate == undefined) {
                this.termLoanApplicationModel.applicationDateVal = this.commonFunctionsService.currentDate();
  
                if (this.termLoanApplicationModel.applicationDateVal != null && this.termLoanApplicationModel.applicationDateVal != undefined) {
                  this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.applicationDateVal));
                }
              }
              else if (this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != undefined) {
                this.termLoanApplicationModel.applicationDateVal = this.commonFunctionsService.dateConvertionIntoFormate(this.termLoanApplicationModel.applicationDate);
                this.termLoanApplicationModel.applicationDateVal = this.commonFunctionsService.currentDate();
              }
  
              if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined)
                this.termLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.termLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
  
              if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined)
                this.termLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
  
              if (this.termLoanApplicationModel.memberTypeName != null && this.termLoanApplicationModel.memberTypeName != undefined) {
                this.memberTypeName = this.termLoanApplicationModel.memberTypeName;
                if (this.termLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
                  this.isIndividual = true;
              }
              if (this.termLoanApplicationModel.admissionNo != null && this.termLoanApplicationModel.admissionNo != undefined)
                this.admissionNumber = this.termLoanApplicationModel.admissionNo;
  
              if (this.termLoanApplicationModel.operationTypeName != null && this.termLoanApplicationModel.operationTypeName != undefined)
                this.applicationType = true;
  
              if (this.termLoanApplicationModel.termProductName != null && this.termLoanApplicationModel.termProductName != undefined)
                this.productInfoFalg = true;
  
              this.getProductDefinitionByProductIdAndApplicationDate(this.termLoanApplicationModel.termProductId); 
              if(this.termLoanProductDefinitionModel.isInsuranceAppicable == applicationConstants.TRUE){
                if (this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != null && this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != undefined) {
                  this.termLoanInterestPolicyModel = this.termLoanApplicationModel.termLoanInsuranceDetailsDTO;
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
  
              if (this.termLoanApplicationModel.termLoanDisbursementDTOList != null && this.termLoanApplicationModel.termLoanDisbursementDTOList != undefined && this.termLoanApplicationModel.termLoanDisbursementDTOList.length > 0) {
                this.termLoanDisbursementScheduleList = this.termLoanApplicationModel.termLoanDisbursementDTOList;
                this.termLoanDisbursementScheduleList = this.termLoanDisbursementScheduleList.filter((data: any) => data != null && data.disbursementDate != null).map((object: any) => {
                  object.disbursementDateVal = this.datePipe.transform(object.disbursementDate, this.orgnizationSetting.datePipe);
                  return object;
                });
              }
              if (this.termLoanApplicationModel.plannedDisbursements != null && this.termLoanApplicationModel.plannedDisbursements != undefined && this.termLoanApplicationModel.plannedDisbursements > 0) {
                if (this.termLoanApplicationModel.termLoanDisbursementDTOList != null && this.termLoanApplicationModel.termLoanDisbursementDTOList.length > 0) {
                  if (this.termLoanApplicationModel.termLoanDisbursementDTOList.length >= this.termLoanApplicationModel.plannedDisbursements) {
                    this.disableAddButton = true;
                  } else {
                    this.disableAddButton = false;
                  }
                } else {
                  this.disableAddButton = false;
                }
                this.termLoanapplicationForm.get('plannedDisbursements')?.disable();
              } else {
                this.disableAddButton = true;
                this.termLoanapplicationForm.get('plannedDisbursements')?.enable();
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
      if (this.termLoanApplicationModel.applicationDateVal != undefined) {
        this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.applicationDateVal));
  
        if (this.termLoanApplicationModel.sanctionDateVal != undefined)
          this.termLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.sanctionDateVal));
  
        if (this.termLoanApplicationModel.loanDueDateVal != undefined)
          this.termLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.loanDueDateVal));
  
        if (!flag && this.termLoanApplicationModel.individualMemberDetailsDTO.admissionDate > this.termLoanApplicationModel.applicationDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.APPLICATION_DATE_SHOULD_NOT_LESS_THAN_ADMISSION_DATE }];
        } else if (!flag && this.termLoanApplicationModel.sanctionDate != undefined && this.termLoanApplicationModel.sanctionDate < this.termLoanApplicationModel.applicationDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.APPLICATION_DATE_SHOULD_NOT_GREATER_THAN_SANCTION_DATE }];
        } else if (!flag && this.termLoanApplicationModel.loanDueDate != undefined && this.termLoanApplicationModel.loanDueDate < this.termLoanApplicationModel.applicationDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.APPLICATION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
        } else {
          this.getProductDefinitionByProductIdAndApplicationDate(this.termLoanApplicationModel.termProductId);
        }
  
        if(flag){
          this.termLoanapplicationForm.get('applicationDate')?.reset();
          this.termLoanApplicationModel.applicationDate = null;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        
      }
    }
  
    onSelectSanctionDate() {
      let flag = false;
      this.msgs = [];
      if (this.termLoanApplicationModel.sanctionDateVal != undefined) {
        this.termLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.sanctionDateVal));
  
        if (this.termLoanApplicationModel.applicationDateVal != undefined)
          this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.applicationDateVal));
  
        if (this.termLoanApplicationModel.loanDueDateVal != undefined)
          this.termLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.loanDueDateVal));
  
        if (!flag && this.termLoanApplicationModel.individualMemberDetailsDTO.admissionDate != undefined && this.termLoanApplicationModel.individualMemberDetailsDTO.admissionDate > this.termLoanApplicationModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.termLoanApplicationModel.applicationDate != undefined && this.termLoanApplicationModel.applicationDate > this.termLoanApplicationModel.sanctionDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if(!flag && this.termLoanApplicationModel.loanDueDate != undefined && this.termLoanApplicationModel.loanDueDate < this.termLoanApplicationModel.sanctionDate){
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.SANCTION_DATE_SHOULD_NOT_GREATER_THAN_DUE_DATE }];
        }
  
        if(flag){
          this.termLoanapplicationForm.get('sanctionDate')?.reset();
          this.termLoanApplicationModel.sanctionDate = null;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        
      }
    }
  
    onSelectLoanDueDate() {
      let flag = false;
      this.msgs = [];
      if (this.termLoanApplicationModel.loanDueDateVal != undefined) {
        this.termLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.loanDueDateVal));
  
        if (this.termLoanApplicationModel.applicationDateVal != undefined)
          this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.applicationDateVal));
  
        if (this.termLoanApplicationModel.sanctionDateVal != undefined)
          this.termLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.sanctionDateVal));
        
        if (!flag && this.termLoanApplicationModel.individualMemberDetailsDTO.admissionDate != undefined && this.termLoanApplicationModel.individualMemberDetailsDTO.admissionDate > this.termLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.termLoanApplicationModel.applicationDate != undefined && this.termLoanApplicationModel.applicationDate > this.termLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_APPLICATION_DATE }];
        } else if (!flag && this.termLoanApplicationModel.sanctionDate != undefined && this.termLoanApplicationModel.sanctionDate > this.termLoanApplicationModel.loanDueDate) {
          flag = true;
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.DUE_DATE_SHOULD_NOT_LESS_THAN_SANCTION_DATE }];
        }
  
        if(flag){
          this.termLoanapplicationForm.get('loanDueDate')?.reset();
          this.termLoanApplicationModel.loanDueDate = null;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }
  
    getProductDefinitionByProductIdAndApplicationDate(productId: any) {
      if (this.termLoanApplicationModel.applicationDateVal != undefined && this.termLoanApplicationModel.applicationDateVal != null)
        this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanApplicationModel.applicationDateVal));
  
      this.termLoanApplicationsService.getTermProductDefinitionByProductIdAndApplicationDate(this.pacsId, productId, this.termLoanApplicationModel.id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termLoanProductDefinitionModel = this.responseModel.data[0];
  
            if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null) {
              this.termLoanInterestPolicyModel = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0];
            }
            if(this.termLoanProductDefinitionModel.isInsuranceAppicable != null && this.termLoanProductDefinitionModel.isInsuranceAppicable ==applicationConstants.TRUE){
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
    
              if (this.termLoanInterestPolicyModel.roi != undefined && this.termLoanInterestPolicyModel.roi != null)
              this.termLoanApplicationModel.effectiveRoi = this.termLoanInterestPolicyModel.roi;
  
              if (this.termLoanInterestPolicyModel.penalInterest != undefined && this.termLoanInterestPolicyModel.penalInterest != null)
                this.termLoanApplicationModel.penalInterest = this.termLoanInterestPolicyModel.penalInterest;
    
              if (this.termLoanInterestPolicyModel.iod != undefined && this.termLoanInterestPolicyModel.iod != null)
                this.termLoanApplicationModel.iod = this.termLoanInterestPolicyModel.iod;
  
              if (this.termLoanProductDefinitionModel.interestPostingFrequencyName != undefined && this.termLoanProductDefinitionModel.interestPostingFrequencyName != null)
                this.termLoanApplicationModel.repaymentFrequency = this.termLoanProductDefinitionModel.interestPostingFrequency;
  
              this.repaymentFrequencyList = this.temprepaymentList.filter(obj => obj != null && obj.value == this.termLoanApplicationModel.repaymentFrequency);
            
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
    //   this.getProductDefinitionByProductId(this.termLoanApplicationModel.termProductId);
    // }
  
    closeProductDefinition() {
      this.productDefinitionFlag = false;
    }
  
    addTermLoanDisbursementSchedule() {
      this.termLoanDisbursementModel = new TermLoanDisbursement();
      this.disableAddButton = true;
      this.editDeleteDisable = true;
      if (this.termLoanDisbursementScheduleList != null && this.termLoanDisbursementScheduleList != undefined && this.termLoanDisbursementScheduleList.length > 0) {
        this.termLoanDisbursementModel.disbursementOrder = this.termLoanDisbursementScheduleList.length + 1;
      } else {
        this.termLoanDisbursementModel.disbursementOrder = 1;
      }
      /**
       * for update validation
       */
      this.updateData();
      this.disbursement._first = 0;
      this.disbursement.value.unshift({ disbursementOrder: this.termLoanDisbursementModel.disbursementOrder, type: '', disbursementAmount: '', minMonthsForDisbursement: '', remarks: '' , disbursementDate:''});
      this.disbursement.initRowEdit(this.disbursement.value[0]);
    }
  
    saveTermLoanDisbursementSchedule(row: any) {
      this.editDeleteDisable = false;
      this.termLoanDisbursementModel = row;
      this.termLoanDisbursementModel.termLoanApplicationId = this.termLoanApplicationId;

      if (this.termLoanDisbursementModel.disbursementDateVal != null && this.termLoanDisbursementModel.disbursementDateVal != undefined)
        this.termLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(this.termLoanDisbursementModel.disbursementDateVal);
      
      // this.termLoanDisbursementScheduleModel.status = applicationConstants.ACTIVE;
      if (row.id != null && row.id != undefined) {
        this.termLoanDisbursementService.updateTermDisbursement(this.termLoanDisbursementModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanDisbursementModel = this.responseModel.data;
                if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                  this.getTermApplicationByTermAccId(this.responseModel.data[0].termLoanApplicationId);
                }
                this.msgs = [];
                this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
                setTimeout(() => {
                  this.msgs = [];
                }, 2000);
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
        this.termLoanDisbursementModel.statusName =  applicationConstants.SCHEDULED;
        this.termLoanDisbursementService.addTermDisbursement(this.termLoanDisbursementModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.termLoanDisbursementModel = this.responseModel.data;
                if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
                  this.getTermApplicationByTermAccId(this.responseModel.data[0].termLoanApplicationId);
                }
                this.msgs = [];
                this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
                setTimeout(() => {
                  this.msgs = [];
                }, 2000);
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
  
    editTermLoanDisbursementSchedule(rowData: any) {
      this.disableAddButton = true;
      this.editDeleteDisable = true;
      this.termLoanDisbursementService.getTermDisbursementById(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanDisbursementModel = this.responseModel.data[0];
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
  
    cancelTermLoanDisbursementSchedule() {
      this.termLoanDisbursementScheduleList = [];
      this.disableAddButton = false;
      this.editDeleteDisable = false;
      this.getTermApplicationByTermAccId(this.termLoanApplicationId);
    }
  
    deleteTermLoanDisbursementSchedule(rowData: any) {
      this.displayDeleteDialog = true;
      this.deleteId = rowData.id;
    }
  
    delete() {
      this.commonComponent.startSpinner();
      this.termLoanDisbursementService.deleteTermDisbursement(this.deleteId).subscribe((response: any) => {
        this.responseModel = response;
        this.msgs = [];
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.termLoanDisbursementScheduleList = this.responseModel.data;
          this.commonComponent.stopSpinner();
          this.displayDeleteDialog = false;
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
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
      if (this.termLoanApplicationModel.termLoanDisbursementDTOList != null)
        this.termLoanDisbursementScheduleList = this.termLoanApplicationModel.termLoanDisbursementDTOList;
  
      if (this.termLoanapplicationForm.valid && this.termLoanApplicationModel.plannedDisbursements != null && this.termLoanApplicationModel.plannedDisbursements != undefined && this.termLoanApplicationModel.plannedDisbursements > 0) {
        if (this.termLoanApplicationModel.termLoanDisbursementDTOList != null && this.termLoanApplicationModel.termLoanDisbursementDTOList.length > 0) {
          if (this.termLoanApplicationModel.termLoanDisbursementDTOList.length >= this.termLoanApplicationModel.plannedDisbursements) {
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
      saveAndUpdateApplicationDetails(termLoanApplicationModel:any) {
        termLoanApplicationModel.pacsId = this.pacsId;
        // termLoanApplicationModel.pacsCode = this.pacsCode;
       
        termLoanApplicationModel.branchId = this.branchId;
        this.memberTypeId = termLoanApplicationModel.memberTypeId;
        if (termLoanApplicationModel.applicationDateVal != null &&termLoanApplicationModel.applicationDateVal != undefined)
          termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(termLoanApplicationModel.applicationDateVal);
    
        if (termLoanApplicationModel.sanctionDateVal != null && termLoanApplicationModel.sanctionDateVal != undefined)
          termLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpochWithTime(termLoanApplicationModel.sanctionDateVal);
    
        if (termLoanApplicationModel.loanDueDateVal != null && termLoanApplicationModel.loanDueDateVal != undefined)
          termLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpochWithTime(termLoanApplicationModel.loanDueDateVal);
    
        this.loanPurposeList.filter(data => data != null && data.value ==  this.termLoanApplicationModel.purposeId).map(count => {
          this.termLoanApplicationModel.purposeName = count.label;
        }) 
        if (termLoanApplicationModel.id != null) {
          this.termLoanApplicationModel.termLoanInsuranceDetailsDTO = this.termLoanInsuranceDetailsModel;
          this.termLoanApplicationsService.updateTermApplication(termLoanApplicationModel).subscribe((response: any) => {
            this.responseModel = response;
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
                if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
                  this.termLoanApplicationId = this.responseModel.data[0].id;
                  this.memberTypeName = this.responseModel.data[0].memberTypeName;
                  if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                    this.accountNumber = this.responseModel.data[0].accountNumber;
                  }
                  if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                    this.admissionNumber = this.responseModel.data[0].admissionNo;
                  }
                }
              this.termLoanApplicationModel.termLoanInsuranceDetailsDTO = this.termLoanInsuranceDetailsModel;
  
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
            this.getTermApplicationByTermAccId(this.termLoanApplicationId);
          }, error => {
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          });
        } else {
          this.termLoanApplicationModel.termLoanInsuranceDetailsDTO = this.termLoanInsuranceDetailsModel;
          this.termLoanApplicationsService.addTermApplication(termLoanApplicationModel).subscribe((response: any) => {
            this.responseModel = response;
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
                if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null)
                  this.termLoanApplicationId = this.responseModel.data[0].id;
                // if (this.responseModel.data[0].operationTypeName != undefined && this.responseModel.data[0].operationTypeName != null)
                //   this.operationTypeName = this.responseModel.data[0].operationTypeName;
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
            this.getTermApplicationByTermAccId(this.termLoanApplicationId);
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
         */
    getProductDefinitionByProductId(id: any) {
      this.termLoanApplicationsService.getPreviewDetailsByProductId(id).subscribe(res => {
        this.responseModel = res;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.termLoanProductDefinitionModel = this.responseModel.data[0];

          if(this.termLoanProductDefinitionModel.loanLinkedshareCapitalApplicable != null && this.termLoanProductDefinitionModel.loanLinkedshareCapitalApplicable != undefined && this.termLoanProductDefinitionModel.loanLinkedshareCapitalApplicable)
            this.termLoanProductDefinitionModel.loanLinkedshareCapitalApplicable = applicationConstants.YES;
          else 
            this.termLoanProductDefinitionModel.loanLinkedshareCapitalApplicable = applicationConstants.NO;

            // if(this.termLoanProductDefinitionModel.isInsuranceAppicable != null && this.termLoanProductDefinitionModel.isInsuranceAppicable != undefined && this.termLoanProductDefinitionModel.isInsuranceAppicable)
            //   this.termLoanProductDefinitionModel.isInsuranceAppicable = applicationConstants.YES;
            // else 
            //   this.termLoanProductDefinitionModel.isInsuranceAppicable = applicationConstants.NO
          if (null != this.termLoanProductDefinitionModel.effectiveStartDate && undefined != this.termLoanProductDefinitionModel.effectiveStartDate)
            this.termLoanProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termLoanProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
  
          if (this.termLoanProductDefinitionModel.termProdCollateralsConfigList) {
            this.collateralList = this.termLoanProductDefinitionModel.termProdCollateralsConfigList
              .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
              .map((item: { collateralTypeName: string, collateralType: any }) => ({
                label: item.collateralTypeName,
                value: item.collateralType
              }));
          }
  
  
          if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList.length > 0) {
            this.interestPolicyList = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList;
            this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
          if (this.termLoanProductDefinitionModel.termApportionConfigDTOList != null && this.termLoanProductDefinitionModel.termApportionConfigDTOList != undefined && this.termLoanProductDefinitionModel.termApportionConfigDTOList.length > 0) {
            this.collectionOrderList = this.termLoanProductDefinitionModel.termApportionConfigDTOList;
            this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
          if (this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != null && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != undefined && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList.length > 0) {
            this.linkedShareCapitalList = this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList;
            this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
  
          if (this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != null && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != undefined && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList.length > 0) {
            this.chargesList = this.termLoanProductDefinitionModel.termProductChargesConfigDTOList;
            this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
          if (this.termLoanProductDefinitionModel.termProdPurPoseConfgList != null && this.termLoanProductDefinitionModel.termProdPurPoseConfgList != undefined && this.termLoanProductDefinitionModel.termProdPurPoseConfgList.length > 0) {
            this.purposeList = this.termLoanProductDefinitionModel.termProdPurPoseConfgList;
            this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
  
          if (this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != null && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != undefined && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList.length > 0) {
            this.requiredDocumentsList = this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList;
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
      if(this.termLoanApplicationModel.termProductId != null && this.termLoanApplicationModel.termProductId != undefined){
        this.getProductDefinitionByProductId(this.termLoanApplicationModel.termProductId);
      }
      else {
        this.msgs = [];
            this.msgs = [{ severity: 'error', detail: "Please Select Product" }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
      }
      
    }
    onSactionAmountChange(sactionAmount:any){
      this.termLoanApplicationModel.effectiveRoi = null;
      this.termLoanApplicationModel.penalInterest = null;
      this.termLoanApplicationModel.iod= null;
      this.interestPolicyList = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList.filter((obj:any)=>(obj.minSlabAmount <= sactionAmount && obj.maxSlabAmount >= sactionAmount ));
      if( this.interestPolicyList != null &&  this.interestPolicyList != undefined &&  this.interestPolicyList.length >0){
        this.termLoanApplicationModel.effectiveRoi = this.interestPolicyList[0].roi;
        this.termLoanApplicationModel.penalInterest = this.interestPolicyList[0].penalInterest;
        this.termLoanApplicationModel.iod = this.interestPolicyList[0].iod;
      }
      else {
        this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Given Saction Amount is Not in between of any Slabs in Product definition" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
      }
    
    }
    
  /**
   * @implements onChange Loan Period check with product definition
   * @param loanPeriod 
   * @author vinitha
   */
  onSelectPeriodInMonths(months:any) {
    let flag = false;
    if (months != undefined) {
      if ( months != undefined && months >= this.termLoanProductDefinitionModel.minLoanPeriod && 
        months <= this.termLoanProductDefinitionModel.maxLoanPeriod) {
          flag = true;
      } 
      else{
        flag = false;
      }
      if(!flag){
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.LOAN_PERIOD_IN_MOTHS_SHOULD_BE_MIN_AND_MAX_AMOUNT }];
        this.termLoanapplicationForm.get('loanPeriod')?.reset();
        this.termLoanApplicationModel.loanPeriod = null;
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      
    }
}
}
