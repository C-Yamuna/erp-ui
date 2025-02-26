import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Loantransactionconstant } from '../../loan-transaction-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from './term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermLoanKyc } from './term-loans-kyc/shared/term-loan-kyc.model';
import { TermLoanCommunication } from './term-loans-communication/shared/term-loan-communication.model';
import { TermApplication } from './term-loan-application-details/shared/term-application.model';
import { TermLoanJointHolder } from './term-loan-joint-account/shared/term-loan-joint-holder.model';
import { TermLoanGuardianDetails, TermLoanNominee } from './term-loans-nominee/shared/term-loan-nominee.model';
import { TermLoanGuarantor } from './term-loans-loan-guarantor/shared/term-loan-guarantor.model';
import { TermBondLoanMortgage, TermGoldLoanMortgage, TermLandLoanMortgage, TermOtherLoanMortgage, TermPropertyMortgageLoan, TermStorageLoanMortgage, TermVehicleLoanMortgage } from './term-loan-mortgage/shared/term-loan-mortgage.model';
import { TermLoanDocuments } from './term-loan-documents/shared/term-loan-documents.model';
import { TermLoanGenealogyTree } from './term-loan-genealogy-tree/shared/term-loan-genealogy-tree.model';
import { FormBuilder } from '@angular/forms';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TermLoanKycService } from './term-loans-kyc/shared/term-loan-kyc.service';
import { TermLoanCommunicationService } from './term-loans-communication/shared/term-loan-communication.service';
import { TermLoanJointHolderService } from './term-loan-joint-account/shared/term-loan-joint-holder.service';
import { TermLoanNomineeService } from './term-loans-nominee/shared/term-loan-nominee.service';
import { TermLoanGenealogyTreeService } from './term-loan-genealogy-tree/shared/term-loan-genealogy-tree.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { DatePipe } from '@angular/common';
import { TermApplicationService } from './term-loan-application-details/shared/term-application.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { TermLoanGuarantorService } from './term-loans-loan-guarantor/shared/term-loan-guarantor.service';
import { TermLoanNewMembershipService } from './term-loan-new-membership/shared/term-loan-new-membership.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountTypes, CollateralTypes, CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { TermLoanMortgageService } from './term-loan-mortgage/shared/term-loan-mortgage.service';

@Component({
  selector: 'app-term-loan-stepper',
  templateUrl: './term-loan-stepper.component.html',
  styleUrls: ['./term-loan-stepper.component.css']
})
export class TermLoanStepperComponent {
  items: MenuItem[] = [];
  activeIndex: number = 0;
  buttonDisabled: boolean = false;
  termLoanApplicationId: any;
  activeItem: any;
  societyId: any;
  branchId: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  completed: any;
  flagForLabelName: boolean = false;
  admissionNumber: any;
  previouseButtonDisable: boolean = false;
  surName: any;
  name: any;
  gender: any;
  age: any;
  maritalStatus: any;
  relationshipType: any;
  relativeName: any;
  mobileNumber: any;
  email: any;
  dateOfBirth: any;
  accountType: any;
  flag: Boolean = false;
  isApplicationEdit: boolean = false;
  isCommunicationEdit: boolean = false;
  isJointEdit: boolean = false;
  isKycEdit: boolean = false;
  isNomineeEdit: boolean = false;
  isDocumentEdit: boolean = false;
  flagForNomineeTypeValue: any;
  isPerminentAddressIsSameFalg: boolean = false;
  accountNumber: any;
  memberTypeName: any;
  menuDisabled: boolean = true;
  checked: Boolean = false;
  showForm: boolean = false;
  tabviewButton: boolean = true;
  pacsId: any;
  operationTypeName: any;
  operationTypeId: any;
  allTypesOfmembershipList: any;
  // memberCard feilds 
  individualFlag: boolean = true;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  isNewMemberCreation: boolean = false;
  permenentAllTypesOfmembershipList: any;
  orgnizationSetting: any;
  memberDropDownDisable: boolean = false;
  rdJointHolderList: any[] = [];
  memberTypeId: any;
  admissionNumberDropDownDisable: boolean = false;
  previousStepFlag: boolean = false;
  membreIndividualFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  groupPrmotersList: any[] = [];
  groupPrmoters: any[] = [];
  institionPromotersList: any[] = [];
  institutionPrmoters: any[] = [];
  columns: any[] = [];
  photoCopyFlag: boolean = false;
  memberSignatureCopyZoom: boolean = false;
  memberDetails: any;
  isKycApproved: any;
  jointAccountHolderList: any[] = [];
  memberTypeList: any[] = [];
  guarantorDetailsList: any;
  isGuarantorEdit: boolean = false;
  isMortgageEdit: boolean = false;
  isGenealogyEdit: boolean = false;
  pacsCode: any;
  
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanJointHolderModel: TermLoanJointHolder = new TermLoanJointHolder();
  termLoanNomineeModel: TermLoanNominee = new TermLoanNominee();
  termLoanGuarantorModel: TermLoanGuarantor = new TermLoanGuarantor();
  termGoldLoanMortgageModel: TermGoldLoanMortgage = new TermGoldLoanMortgage();
  termLandLoanMortgageModel: TermLandLoanMortgage = new TermLandLoanMortgage();
  termBondLoanMortgageModel: TermBondLoanMortgage = new TermBondLoanMortgage();
  termVehicleLoanMortgageModel: TermVehicleLoanMortgage = new TermVehicleLoanMortgage();
  termStorageLoanMortgageModel: TermStorageLoanMortgage = new TermStorageLoanMortgage();
  termOtherLoanMortgageModel: TermOtherLoanMortgage = new TermOtherLoanMortgage();
  termLoanDocumentsModel: TermLoanDocuments = new TermLoanDocuments();
  termLoanGenealogyTreeModel: TermLoanGenealogyTree = new TermLoanGenealogyTree();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  termLoanGuardianDetailsModel: TermLoanGuardianDetails = new TermLoanGuardianDetails()
  termPropertyMortgageLoanModel: TermPropertyMortgageLoan = new TermPropertyMortgageLoan();
  constructor(private router: Router, private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private ref: ChangeDetectorRef,
    private termLoanKycService: TermLoanKycService, private termLoanCommunicationService: TermLoanCommunicationService,
    private termLoanApplicationsService: TermApplicationService, private termLoanJointHolderService: TermLoanJointHolderService,
    private termLoanNomineeService: TermLoanNomineeService, private termLoanGuarantorDetailsService: TermLoanGuarantorService,
    private termLoanGenealogyTreeService: TermLoanGenealogyTreeService,
    private membershipService: TermLoanNewMembershipService, private formBuilder: FormBuilder, private datePipe: DatePipe,
    private fileUploadService: FileUploadService, private translate: TranslateService, private termLoanMortgageService: TermLoanMortgageService,) {
    this.institutionPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderTypeName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDateVal', header: 'start date' },
    ];
    this.groupPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDateVal', header: 'start date' },
    ];
  }


  ngOnInit() {
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();

    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);

    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo'] != undefined || params['falg'] != undefined || params['showForm'] != undefined) {
        if (params['id'] != undefined) {
          let queryParams = Number(this.encryptDecryptService.decrypt(params['id']));
          let qParams = queryParams;
          this.termLoanApplicationId = qParams;
          this.menuDisabled = false;
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
        }
        if (params['falg'] != undefined || params['showForm'] != undefined) {
          this.refreshTheMemberCardData();
        }

        if (params['admissionNo'] != undefined) {
          let queryParams = Number(this.encryptDecryptService.decrypt(params['admissionNo']));
          let qParams = queryParams;
          this.admissionNumber = qParams;
          this.getMemberDetailsByAdmissionNUmber(this.admissionNumber);
          this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
          this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
        }
        this.isEditCheck(this.activeIndex);
      } else {
        this.isEdit = false;
        this.flagForLabelName = false;
      }
      this.itemList();
    });
    if (this.memberDetails != null && this.memberDetails != undefined) {
      this.membershipBasicRequiredDetailsModel = this.memberDetails
    }
    if (!this.showForm) {
      this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    }
    this.appendCurrentStepperData();
  }

  refreshTheMemberCardData() {
    this.termLoanApplicationsService.resetCurrentStep();
    this.membershipBasicRequiredDetailsModel = new MembershipBasicRequiredDetails();
    this.memberGroupDetailsModel = new MemberGroupDetailsModel();
    this.membershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
    this.admissionNumber = null;
  }


  appendCurrentStepperData() {
    this.termLoanApplicationsService.currentStep.subscribe((data: any) => {
      if (data) {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
      if (data != undefined) {
        this.itemList();
        this.activeIndex = data.stepperIndex;
        this.previouseButtonDisable = false;
        this.changeStepperSelector(this.activeIndex);
        this.buttonDisabled = data.isDisable;
        if (data.data != null && data.data != undefined) {
          if (this.activeIndex == 0) {
            this.termLoanApplicationModel = data.data;
            if (this.termLoanApplicationModel != null && this.termLoanApplicationModel != undefined) {
              if (this.termLoanApplicationModel.isNewMember != null && this.termLoanApplicationModel.isNewMember != undefined)
                this.showForm = this.termLoanApplicationModel.isNewMember;
              if (this.termLoanApplicationModel.admissionNo != null && this.termLoanApplicationModel.admissionNo != undefined)
                this.admissionNumber = this.termLoanApplicationModel.admissionNo;
              if (this.termLoanApplicationModel.memberTypeName != null && this.termLoanApplicationModel.memberTypeName != undefined)
                this.memberTypeName = this.termLoanApplicationModel.memberTypeName;
              this.memberTypeCheck(this.memberTypeName, this.termLoanApplicationModel);
            }
          }
          else if (this.activeIndex == 1) {
            this.previouseButtonDisable = data.isDisable;
            if (data.data != null && data.data != undefined) {
              this.termLoanKycModel = data.data;
            }
          }
          else if (this.activeIndex == 2) {
            if (data.data != null && data.data != undefined) {
              this.termLoanCommunicationModel = data.data;
            }
          }
          else if (this.activeIndex == 3) {
            if (data.data != null && data.data != undefined) {
              this.termLoanApplicationModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 4) {
            if (data.data != null && data.data != undefined) {
              if (data.data.accountTypeId != null && data.data.accountTypeId != undefined) {
                this.operationTypeId = data.data.accountTypeId;
              }
              if (data.data.admissionNumber != null && data.data.admissionNumber != undefined) {
                this.termLoanApplicationModel.admissionNo = data.data.admissionNumber;
              }
              if (data.data.termLoanApplicationId != null && data.data.termLoanApplicationId != undefined) {
                this.termLoanApplicationId = data.data.termLoanApplicationId;
              }
              if(data.data.memberTypeName != null && data.data.memberTypeName != undefined){
                this.memberTypeName = data.data.memberTypeName;
              }
              if (data.data.jointHolderList != null && data.data.jointHolderList != undefined && data.data.jointHolderList.length > 0) {
                this.jointAccountHolderList = data.data.jointHolderList;
              }
              this.termLoanJointHolderModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 5) {
            if (data.data != null && data.data != undefined) {
              this.termLoanGuardianDetailsModel = new TermLoanGuardianDetails();
              if (data.data.termLoanGuardian != null && data.data.termLoanGuardian != undefined) {
                this.termLoanGuardianDetailsModel = data.data.termLoanGuardian;
              }
              this.termLoanNomineeModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 6) {
            if (data.data != null && data.data != undefined) {
            
              if (data.data.admissionNumber != null && data.data.admissionNumber != undefined) {
                this.termLoanGuarantorModel.admissionNumber = data.data.admissionNumber;
              }
              if (data.data.termLoanApplicationId != null && data.data.termLoanApplicationId != undefined) {
                this.termLoanApplicationId = data.data.termLoanApplicationId;
              }
              if (data.data.guarantorDetailsList != null && data.data.guarantorDetailsList != undefined && data.data.guarantorDetailsList.length > 0) {
                this.guarantorDetailsList = data.data.guarantorDetailsList;
              }
            }
            this.itemList();
          }
          else if (this.activeIndex == 7) {
            if (data.data.collateralType == 1) {
              this.termGoldLoanMortgageModel = data.data;
            } else if (data.data.collateralType == 2) {
              this.termGoldLoanMortgageModel = data.data;
            } else if (data.data.collateralType == 3) {
              this.termGoldLoanMortgageModel = data.data;
            } else if (data.data.collateralType == 4) {
              this.termGoldLoanMortgageModel = data.data;
              this.termVehicleLoanMortgageModel = data.data;
            } else if (data.data.collateralType == 5) {
              this.termGoldLoanMortgageModel = data.data;
            } else if (data.data.collateralType == 6) {
              this.termGoldLoanMortgageModel = data.data;
            }
            else if (data.data.collateralType == 7) {
              this.termGoldLoanMortgageModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 8) {
            this.termLoanDocumentsModel = data.data;
            this.itemList();
          }
          
          else if (this.activeIndex == 9) {
            this.termLoanGenealogyTreeModel = data.data;
          }
        }
      }
    });
  }

  itemList() {
    this.items = [];
    if(this.memberTypeName != MemberShipTypesData.INDIVIDUAL){
      this.itemListWithParamGroupInstitution();
    }else {
    if(this.termLoanApplicationId != null && this.termLoanApplicationId != undefined){
      if (this.showForm) {
        if (this.termLoanApplicationModel.operationTypeName !=AccountTypes.JOINT) {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP, queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
      else {
        if (this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 5;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
    }
    else {
      this.itemListWithoutParams();
    }
  }
    this.activeItem = this.items[this.activeIndex];
    
  }


  memberTypeCheck(memberType: any, data: any) {
    if (memberType == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.membershipBasicRequiredDetailsModel = data.individualMemberDetailsDTO;
      if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
        this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
        this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if(this.membershipBasicRequiredDetailsModel.isNewMember){
        this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
      }
      else {
        this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
      }
      this.membershipBasicRequiredDetailsModel.tempAdmissionNumber = this.membershipBasicRequiredDetailsModel.admissionNumber;
      // this.getMultiPartFileList();
    }
    else if (memberType == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.memberGroupDetailsModel = data.memberGroupDetailsDTO;
      if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
        this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
      }
      if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
        this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if(this.memberGroupDetailsModel.admissionNumber != null && this.memberGroupDetailsModel.admissionNumber != undefined){
        this.memberGroupDetailsModel.tempAdmissionNumber = this.memberGroupDetailsModel.admissionNumber;
      }
      if (this.memberGroupDetailsModel.isNewMember) {
            this.groupPrmotersList=this.memberGroupDetailsModel.groupPromoterList ;
          //   for(let promoter of this.groupPrmotersList){
          //   if (promoter.dob != null && promoter.dob != undefined) {
          //     promoter.memberDobVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          //   }
          //   if (promoter.startDate != null && promoter.startDate != undefined) {
          //     promoter.startDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          //   }
          // }
      }
    }
    else if (memberType == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.groupFlag = false;
      this.individualFlag = false;
      this.membershipInstitutionDetailsModel = data.memberInstitutionDTO;
      if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
        this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
        this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.isNewMember ) {
        this.institionPromotersList=this.membershipInstitutionDetailsModel.institutionPromoterList ;
      }
      if(this.membershipInstitutionDetailsModel.admissionNumber != null && this.membershipInstitutionDetailsModel.admissionNumber != undefined){
        this.membershipInstitutionDetailsModel.tempAdmissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
      }
    }
  }

  isEditCheck(activeIndex: any) {
    if (activeIndex == 0) {
      this.isEdit = true;
    } else if (activeIndex == 1) {
      this.isApplicationEdit = true
    } else if (activeIndex == 2) {
      this.isJointEdit = true
    } else if (activeIndex == 3) {
      this.isCommunicationEdit = true
    } else if (activeIndex == 4) {
      this.isKycEdit = true
    } else if (activeIndex == 4) {
      this.isJointEdit = true
    } else if (activeIndex == 6) {
      this.isNomineeEdit = true
    } else if (activeIndex == 7) {
      this.isGuarantorEdit = true
    } else if (activeIndex == 8) {
      this.isMortgageEdit = true
    } else if (activeIndex == 9) {
      this.isGenealogyEdit = true
    }
  }

  changeStepperSelector(item: any) {
    if (this.menuDisabled) {
      return; // Do nothing if menu is disabled
    }
    this.activeItem = item;
    // this.menuDisabled = !this.menuDisabled;
  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }


  //membership module admissionNumbers 
  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.membershipService.getAllTypeOfMemberDetailsListFromMemberModule(pacsId, branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permenentAllTypesOfmembershipList = this.responseModel.data;
            this.allTypesOfmembershipList = this.permenentAllTypesOfmembershipList.filter((obj: any) => obj != null && obj.statusName == CommonStatusData.APPROVED).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
              return {
                label: `${relationType.name} - ${relationType.admissionNumber} - ${relationType.memberTypeName}`,
                value: relationType.admissionNumber
              };
            });
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    });
  }

  navigateTo(activeIndex: any, termLoanApplicationId: any) {
    this.itemList();
    switch (activeIndex) {
      case 0:
        if (!this.showForm) {
          this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        }
        else {
          this.router.navigate([Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        }
        break;
      case 1:
        this.router.navigate([Loantransactionconstant.TERMLOANS_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 2:
        this.router.navigate([Loantransactionconstant.TERMLOANS_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 3:
        this.router.navigate([Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 4:
        this.router.navigate([Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 5:
        this.router.navigate([Loantransactionconstant.TERMLOANS_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 6:
        this.router.navigate([Loantransactionconstant.TERMLOANS_GUARANTOR], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 7:
        this.router.navigate([Loantransactionconstant.TERMLOANS_MORTAGAGE], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 8:
        this.router.navigate([Loantransactionconstant.TERM_LOAN_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
      case 9:
        this.router.navigate([Loantransactionconstant.TERMLOANS_GENEALOGY_TREE], { queryParams: { id: this.encryptDecryptService.encrypt(termLoanApplicationId) } });
        break;
    }
  }

  prevStep(activeIndex: number) {
    this.activeIndex = activeIndex - 1;
    if (activeIndex == 0) {
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 1) {
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 2) {
      if (!this.showForm) {
        this.activeIndex = this.activeIndex - 1;
      }
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 3) {
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 4) {
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 5) {
      if (this.termLoanApplicationModel.operationTypeName !=AccountTypes.JOINT) {
        this.flag = false;
        this.activeIndex = this.activeIndex - 1;
      }
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    
    }
    else if (activeIndex == 6) {
      if (!this.individualFlag) {
        if (this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {
          this.flag = false;
          this.activeIndex = this.activeIndex -2;
        }
        else {
          this.activeIndex = this.activeIndex - 1;
        }
      }    
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 7) {
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 8) {
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
    else if (activeIndex == 9) {
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
  }

  nextStep(activeIndex: number) {
    if (activeIndex == 0) {
      if (this.memberTypeName == "Individual") {
        this.setMemberDetailsToTermApplicationDetails(this.termLoanApplicationModel.individualMemberDetailsDTO);
      } else if (this.memberTypeName == "Group") {
        this.setMemberDetailsToTermApplicationDetails(this.termLoanApplicationModel.memberGroupDetailsDTO);
      } else if (this.memberTypeName == "Institution") {
        this.setMemberDetailsToTermApplicationDetails(this.termLoanApplicationModel.memberInstitutionDTO);
      }
      this.addAOrUpdateTermApplicationDetails(activeIndex, "next");
    }
    else if (activeIndex == 2) {
      this.addOrUpdateCommunicationDetails(activeIndex, "next");
    } else if (activeIndex == 3) {
      if (!this.isNomineeEdit) {
        this.flagForNomineeTypeValue = 0;
      } else {
        this.flagForNomineeTypeValue = this.termLoanNomineeModel.flagForNomineeTypeValue;
      }
      this.addAOrUpdateTermApplicationDetails(activeIndex, "next");
    } else if (activeIndex == 4) {
      this.saveJointHolder();
    } else if (activeIndex == 5) {
      // this.activeIndex = activeIndex + 1;
      // this.navigateTo(this.activeIndex, this.termLoanApplicationId);
      if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.addOrUpdateNomineeDetails();
      if (this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined  && Object.keys(this.termLoanGuardianDetailsModel).length > 0) {
        this.addOrUpdateGuardianDetails();
      }
    } else {
      this.activeIndex += 1;
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    } 
    } else if (activeIndex == 6) {
      this.saveOrUpdateGuarantorDetails();
    } else if (activeIndex == 7) {
      if (this.termGoldLoanMortgageModel.collateralType == CollateralTypes.GOLD_MORTGAGE) {
        this.saveOrUpdateGoldLoanMortagageDetails(activeIndex, "next");
      } else if (this.termLandLoanMortgageModel.collateralType === CollateralTypes.LAND_MORTGAGE) {
        this.saveOrUpdateLandLoanMortagageDetails(activeIndex, "next");
      } else if (this.termBondLoanMortgageModel.collateralType=== CollateralTypes.BONDS_MORTGAGE) {
        this.saveOrUpdateBondLoanMortagageDetails(activeIndex, "next");
      } else if (this.termVehicleLoanMortgageModel.collateralType === CollateralTypes.VEHICLE_MORTGAGE) {
        this.saveOrUpdateVehicleLoanMortagageDetails(activeIndex, "next");
      } else if (this.termStorageLoanMortgageModel.collateralType === CollateralTypes.STORAGE_MORTGAGE) {
        this.saveOrUpdateStorageLoanMortagageDetails(activeIndex, "next");
      } else if (this.termPropertyMortgageLoanModel.collateralType === CollateralTypes.PROPERTY_MORTGAGE) {
          this.saveOrUpdatePropertyMortgageDetails(activeIndex, "next");
      }else if (this.termOtherLoanMortgageModel.collateralType === CollateralTypes.OTHER_MORTGAGE) {
        this.saveOrUpdateOtherLoanMortagageDetails(activeIndex, "next");
      }
      else {
        this.saveOrUpdateOtherLoanMortagageDetails(activeIndex, "next");
      }
    } else if (activeIndex == 8) {
      this.saveOrUpdateDocumentDetails(activeIndex, "next");
    } else if (activeIndex == 9) {
      this.saveOrUpdateGenealogyDetails(activeIndex, "next");
    } else {
      this.activeIndex = activeIndex + 1;
      this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    }
  }

  setMemberDetailsToTermApplicationDetails(memeberdetailsObj: any) {
    this.termLoanApplicationModel.memberTypeId = memeberdetailsObj.memberTypeId;
    // this.termLoanApplicationModel.memberTypeName = memeberdetailsObj.memberTypeName;
    // this.termLoanApplicationModel.name = memeberdetailsObj.name;
    // // this.termLoanApplicationModel.surName = memeberdetailsObj.surName;
    // this.termLoanApplicationModel.email = memeberdetailsObj.emailId;
    // this.termLoanApplicationModel.mobileNumber = memeberdetailsObj.mobileNumber;
  }
  back() {
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }

  cancel() {
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }

  navigateToPreview() {
    this.buttonDisabled = true;
    this.router.navigate([Loantransactionconstant.PREVIEW_TERM_LOAN], { queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId), editbutton: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE) } });
  }


  onChange() {
    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, this.showForm);
    // this.itemList();
    if (this.showForm) {
      this.router.navigate([Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP], { queryParams: { showForm: this.encryptDecryptService.encrypt(this.showForm) } });
    }
    else {
      this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP], { queryParams: { showForm: this.encryptDecryptService.encrypt(this.showForm) } });
    }
  }

  getTermApplicationByTermAccId(id: any) {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.memberDropDownDisable = true;
              this.termLoanApplicationModel = this.responseModel.data[0];
              this.admissionNumberDropDownDisable = true;
              this.isNewMemberCreation = true;
              this.admissionNumber = this.termLoanApplicationModel.admissionNo;

              if (this.termLoanApplicationModel.individualMemberDetailsDTO != null && this.termLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;

                if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                  if(this.membershipBasicRequiredDetailsModel.isNewMember){
                    this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                  }
                  else {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                  }
                  this.photoCopyFlag = true;
                }
                if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                  if(this.membershipBasicRequiredDetailsModel.isNewMember){
                    this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                  }
                  else {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                  }
                }

                if (this.termLoanApplicationModel.memberTypeId != null && this.termLoanApplicationModel.memberTypeId != undefined)
                  this.memberTypeId = this.membershipBasicRequiredDetailsModel.memberTypeId;

                if (this.termLoanApplicationModel.memberTypeName != null && this.termLoanApplicationModel.memberTypeName != undefined)
                  this.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;

                if (this.membershipBasicRequiredDetailsModel.isNewMember != undefined && this.membershipBasicRequiredDetailsModel.isNewMember != null) {
                  this.showForm = this.membershipBasicRequiredDetailsModel.isNewMember;
                  this.itemList();
                }

                if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                  this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                  this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved)
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                else
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

                this.individualFlag = true;
                this.groupFlag = false;
                this.institutionFlag = false;
                this.admissionNumber = this.termLoanApplicationModel.admissionNo;
                
              }
              if (this.termLoanApplicationModel.memberGroupDetailsDTO != null && this.termLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                this.memberGroupDetailsModel = this.termLoanApplicationModel.memberGroupDetailsDTO;
                this.memberGroupDetailsModel.admissionNumber = this.termLoanApplicationModel.memberGroupDetailsDTO.tempAdmissionNumber;
                if (this.memberGroupDetailsModel.memberTypeId != null && this.memberGroupDetailsModel.memberTypeId != undefined)
                  this.memberTypeId = this.memberGroupDetailsModel.memberTypeId;

                if (this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined)
                  this.memberTypeName = this.memberGroupDetailsModel.memberTypeName;

                if (this.memberGroupDetailsModel.isNewMember != undefined && this.memberGroupDetailsModel.isNewMember != null) {
                  this.showForm = this.memberGroupDetailsModel.isNewMember;
                  this.itemList();
                }

                if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
                  this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

                if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
                  this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined && this.memberGroupDetailsModel.isKycApproved)
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                else
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

                if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined)
                  this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
                for(let promoter of this.groupPrmotersList){
                    promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                    promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
                }

                this.individualFlag = false;
                this.groupFlag = true;
                this.institutionFlag = false;
                this.admissionNumber = this.termLoanApplicationModel.admissionNo;
              }
              if (this.termLoanApplicationModel.memberInstitutionDTO != null && this.termLoanApplicationModel.memberInstitutionDTO != undefined) {
                this.membershipInstitutionDetailsModel = this.termLoanApplicationModel.memberInstitutionDTO;

                if (this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined)
                  this.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;

                if (this.membershipInstitutionDetailsModel.memberTypeName != null && this.membershipInstitutionDetailsModel.memberTypeName != undefined)
                  this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;

                if (this.membershipInstitutionDetailsModel.isNewMember != undefined && this.membershipInstitutionDetailsModel.isNewMember != null) {
                  this.showForm = this.membershipInstitutionDetailsModel.isNewMember;
                  this.itemList();
                }

                if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
                  this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

                if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                  this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined && this.membershipInstitutionDetailsModel.isKycApproved)
                  this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
                else
                  this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

                if (this.membershipInstitutionDetailsModel.institutionPromoterList.length && this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined)
                  this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
                for(let promoter of this.institionPromotersList){
                  promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                  promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
                }

                this.individualFlag = false;
                this.groupFlag = false;
                this.institutionFlag = true;
                this.admissionNumber = this.termLoanApplicationModel.admissionNo;
              }
            }
          }
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
  OnChangeAdmissionNumber(admissionNo: any) {
    const filteredItem = this.allTypesOfmembershipList.find((item: { value: any; }) => item.value === admissionNo);
    const parts = filteredItem.label.split(' - ');
    let label = parts[parts.length - 1].trim();
    this.membershipBasicRequiredDetailsModel.memberTypeName = label;
    const admissionNumber = filteredItem.label.split(' - ');
    let admissionNumberLable = parts[parts.length - 2].trim();
    this.admissionNumber = admissionNumberLable;
    if (this.membershipBasicRequiredDetailsModel.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.getMemberDetailsByAdmissionNUmber(admissionNo);
    } else if (this.membershipBasicRequiredDetailsModel.memberTypeName ==  MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.getGroupDetailsByAdmissionNumber(admissionNo);
    } else if (this.membershipBasicRequiredDetailsModel.memberTypeName ==  MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.getInstitutionDetailsByAdmissionNumber(admissionNo);
    }
    this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP], { queryParams: { admissionNo: this.encryptDecryptService.encrypt(admissionNo) } });

  }
  //get member module data by admissionNUmber
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.membershipService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
          this.membershipBasicRequiredDetailsModel.memberShipCommunicationDetailsDTOList = this.responseModel.data[0].memberShipCommunicationDetailsDTO;

          if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
            this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
            this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.memberShipCommunicationDetailsDTOList != null && this.membershipBasicRequiredDetailsModel.memberShipCommunicationDetailsDTOList != undefined) {
            this.termLoanCommunicationModel = this.membershipBasicRequiredDetailsModel.memberShipCommunicationDetailsDTOList;
          }
          if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
            this.photoCopyFlag = true;
          }
          if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
          }
          if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.membershipBasicRequiredDetailsModel.admissionNumber;
          this.membershipBasicRequiredDetailsModel.tempAdmissionNumber = this.membershipBasicRequiredDetailsModel.admissionNumber;
          this.termLoanApplicationModel.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
          this.termLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicRequiredDetailsModel;
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

  //get group details from member module data by admissionNumber
  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.membershipService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];

          this.memberTypeName = this.responseModel.data[0].memberTypeName;
          if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
            this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
            this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined) {
            this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
            for(let promoter of this.groupPrmotersList){
              promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
              promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
            }
          }
          if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.memberGroupDetailsModel.tempAdmissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.termLoanApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
          this.termLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
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

  //get member institution details from member module by admissionNumber
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.termLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;

          if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
            this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
            this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.institutionPromoterList.length && this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined) {
            this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
            for(let promoter of this.institionPromotersList){
              promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
              promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
            }
          }
          if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
          this.membershipInstitutionDetailsModel.tempAdmissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
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


  addAOrUpdateTermApplicationDetails(activeIndex: any, buttonName: any) {
    this.termLoanApplicationModel.pacsId = this.pacsId;
    this.termLoanApplicationModel.pacsCode = this.pacsCode;
    this.termLoanApplicationModel.branchId = this.branchId;
    this.memberTypeId = this.termLoanApplicationModel.memberTypeId;
   
    if (this.termLoanApplicationModel.id != null) {
      this.isApplicationEdit = true;
    } else {
      this.isApplicationEdit = false;
    }
    if(activeIndex != 3){
      if (this.termLoanApplicationModel.individualMemberDetailsDTO != null && this.termLoanApplicationModel.individualMemberDetailsDTO)
        this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
      else if (this.termLoanApplicationModel.memberGroupDetailsDTO != null && this.termLoanApplicationModel.memberGroupDetailsDTO)
        this. memberGroupDetailsModel = this.termLoanApplicationModel.memberGroupDetailsDTO;
      else if (this.termLoanApplicationModel.memberInstitutionDTO != null && this.termLoanApplicationModel.memberInstitutionDTO)
        this.membershipInstitutionDetailsModel = this.termLoanApplicationModel.memberInstitutionDTO;
      // member dates convert
      if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
        this.membershipBasicRequiredDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.dob));
      }
      if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
        this.membershipBasicRequiredDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.admissionDate));
      }
      // group dates convert
      if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
        this.memberGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.registrationDate));
      }
      if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
        this.memberGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.admissionDate));
      }
      // institution dates convert
      if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
        this.membershipInstitutionDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.registrationDate));
      }
      if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
        this.membershipInstitutionDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.admissionDate));
      }
    }
    if (this.termLoanApplicationModel.applicationDateVal != null && this.termLoanApplicationModel.applicationDateVal != undefined)
      this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(this.termLoanApplicationModel.applicationDateVal);

    if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined)
      this.termLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpochWithTime(this.termLoanApplicationModel.sanctionDate);

    if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined)
      this.termLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpochWithTime(this.termLoanApplicationModel.loanDueDate);

    if (this.isApplicationEdit) {
      this.termLoanApplicationsService.updateTermApplication(this.termLoanApplicationModel).subscribe((response: any) => {
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
          }
          this.previousStepFlag = true;
          this.admissionNumberDropDownDisable = true;
          this.memberDropDownDisable = true;
          if (this.activeIndex === 0 || this.activeIndex === 1) {
            this.activeIndexIncrement();
          }
          else if (this.activeIndex === 3) {
            this.activeIndex = this.accountTypeBasedActiveIndexInscrement(this.termLoanApplicationModel.operationTypeName);
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.responseModel.data[0].id)
          this.completed = 1;
        } else {
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
    } else {
      this.termLoanApplicationModel.statusName =  applicationConstants.IN_PROGRESS;
      if(activeIndex != 3){
      if (this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != undefined && this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != null)
        this.termLoanApplicationModel.termLoanInsuranceDetailsDTO.statusName = applicationConstants.IS_ACTIVE;
      if (this.memberTypeName == "Individual") {
        this.termLoanApplicationModel.individualMemberDetailsDTO.memStatusName=  applicationConstants.IN_PROGRESS;
        if (this.termLoanApplicationModel.individualMemberDetailsDTO != undefined && this.termLoanApplicationModel.individualMemberDetailsDTO != null) {
          if (this.termLoanApplicationModel.individualMemberDetailsDTO.age != undefined && this.termLoanApplicationModel.individualMemberDetailsDTO.age != null) {
            this.age = this.termLoanApplicationModel.individualMemberDetailsDTO.age;
            if (this.termLoanApplicationModel.individualMemberDetailsDTO.age <= 18)
              this.termLoanApplicationModel.individualMemberDetailsDTO.isMinor = applicationConstants.TRUE;
            else
              this.termLoanApplicationModel.individualMemberDetailsDTO.isMinor = applicationConstants.FALSE;
          }
          if (this.termLoanApplicationModel.individualMemberDetailsDTO.id != undefined && this.termLoanApplicationModel.individualMemberDetailsDTO.id != null)
            this.termLoanApplicationModel.individualMemberDetailsDTO.id = null;

          if (this.termLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList != null && this.termLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList != undefined) {
            for (let kyc of this.termLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList) {
              kyc.id = null;
            }
            this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.termLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList;
          }
        }
      } else if (this.memberTypeName == "Group") {
        this.termLoanApplicationModel.memberGroupDetailsDTO.groupStatusName =  applicationConstants.IN_PROGRESS;
        if (this.termLoanApplicationModel.memberGroupDetailsDTO != undefined && this.termLoanApplicationModel.memberGroupDetailsDTO != null) {
          if (this.termLoanApplicationModel.memberGroupDetailsDTO.age != undefined && this.termLoanApplicationModel.memberGroupDetailsDTO.age != null)
            this.termLoanApplicationModel.memberGroupDetailsDTO.id = null;

          if (this.termLoanApplicationModel.memberGroupDetailsDTO.groupKycList != null && this.termLoanApplicationModel.memberGroupDetailsDTO.groupKycList != undefined) {
            for (let kyc of this.termLoanApplicationModel.memberGroupDetailsDTO.groupKycList) {
              kyc.id = null;
            }
            this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.termLoanApplicationModel.memberGroupDetailsDTO.groupKycList;
          }
        }
      } else if (this.memberTypeName == "Institution") {
        this.termLoanApplicationModel.memberInstitutionDTO.institutionStatusName =  applicationConstants.IN_PROGRESS;
        if (this.termLoanApplicationModel.memberInstitutionDTO != undefined && this.termLoanApplicationModel.memberInstitutionDTO != null) {
          if (this.termLoanApplicationModel.memberInstitutionDTO.age != undefined && this.termLoanApplicationModel.memberInstitutionDTO.age != null)
            this.termLoanApplicationModel.memberInstitutionDTO.id = null;

          if (this.termLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList != null && this.termLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList != undefined) {
            for (let kyc of this.termLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList) {
              kyc.id = null;
            }
            this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.termLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList;
          }
        }
      }
    }
      this.termLoanApplicationsService.addTermApplication(this.termLoanApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null)
              this.termLoanApplicationId = this.responseModel.data[0].id;
            if (this.responseModel.data[0].operationTypeName != undefined && this.responseModel.data[0].operationTypeName != null)
              this.operationTypeName = this.responseModel.data[0].operationTypeName;
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
            this.isNewMemberCreation = true;
            this.admissionNumberDropDownDisable = true;
            
          }
          this.memberDropDownDisable = true;
          this.previousStepFlag = false;
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          if (this.activeIndex === 0 || this.activeIndex === 1) {
            this.activeIndexIncrement();
          }
          else if (this.activeIndex === 3) {
            this.activeIndex = this.accountTypeBasedActiveIndexInscrement(this.termLoanApplicationModel.operationTypeName );
          }
          this.navigateTo(this.activeIndex, this.responseModel.data[0].id)
          this.completed = 1;
        } else {
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
  }

  // add or update fd non cumulative Communication Details
  addOrUpdateCommunicationDetails(activeIndex: any, buttonName: any) {
    this.termLoanCommunicationModel.admissionNumber = this.admissionNumber;
    this.termLoanCommunicationModel.termLoanApplicationId = this.termLoanApplicationId;
    if (this.termLoanCommunicationModel.isSameAddress == true) {
      this.isPerminentAddressIsSameFalg = true;
    }
    else {
      this.isPerminentAddressIsSameFalg = true;
    }
    if (this.termLoanCommunicationModel.id == null) {
      this.isCommunicationEdit = false;
    }
    else
      this.isCommunicationEdit = true;
    if (this.isCommunicationEdit) {
      this.termLoanCommunicationService.updateTermLoanCommunication(this.termLoanCommunicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
            this.termLoanApplicationId = this.responseModel.data[0].termLoanApplicationId;
          }
          if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
            this.admissionNumber = this.responseModel.data[0].admissionNumber;
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      });
    }
    else {
      this.termLoanCommunicationService.addTermLoanCommunication(this.termLoanCommunicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
            this.termLoanApplicationId = this.responseModel.data[0].termLoanApplicationId;
          }
          if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
            this.admissionNumber = this.responseModel.data[0].admissionNumber;
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      });
    }
  }

  saveJointHolder() {
    this.termLoanJointHolderService.saveJointHolderListSave(this.jointAccountHolderList).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
          this.termLoanApplicationId = this.responseModel.data[0].termLoanApplicationId;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        if(this.activeIndex == 4){
          if(this.memberTypeName == MemberShipTypesData.INDIVIDUAL){
            this.activeIndex = this.activeIndex + 1;
            this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          }else{
            this.activeIndex = this.activeIndex + 2;
            this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          }
        }
        // this.activeIndex = this.activeIndex + 1;
        // this.navigateTo(this.activeIndex, this.termLoanApplicationId);
        // console.log("Navigation executed, activeIndex: ", this.activeIndex);
        this.completed = 1;
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  // add or update fd non cumulative Nominee Details
  addOrUpdateNomineeDetails() {
    this.termLoanNomineeModel.termLoanApplicationId = this.termLoanApplicationId;
    // this.termLoanNomineeModel.accountNumber = this.accountNumber;
    // this. fdCumulativeNominee.isNewMember = this.showForm;
    if (this.termLoanNomineeModel.id == null) {
      this.isNomineeEdit = false;
    }
    else {
      this.isNomineeEdit = true;
    }
    if (this.isNomineeEdit) {
      this.termLoanNomineeService.updateNomineeDetails(this.termLoanNomineeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.termLoanNomineeService.addNomineeDetails(this.termLoanNomineeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  addOrUpdateGuardianDetails() {
    this.termLoanGuardianDetailsModel.termLoanApplicationId = this.termLoanApplicationId;
    // this.termLoanGuardianDetailsModel.accountNumber = this.accountNumber;
    // this.termLoanGuardianDetailsModel.isNewMember = this.showForm;
    if (this.termLoanGuardianDetailsModel.id == null) {
      this.isNomineeEdit = false;
    }
    else {
      this.isNomineeEdit = true;
    }
    if (this.isNomineeEdit) {
      this.termLoanNomineeService.updateGuardainDetails(this.termLoanGuardianDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.termLoanNomineeService.addGuardinaDetails(this.termLoanGuardianDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  saveOrUpdateGuarantorDetails() {
    this.termLoanGuarantorDetailsService.saveGuarantorDetailsList(this.guarantorDetailsList).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
          this.termLoanApplicationId = this.responseModel.data[0].termLoanApplicationId;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.activeIndex = this.activeIndex + 1;
        this.navigateTo(this.activeIndex, this.termLoanApplicationId);
        console.log("Navigation executed, activeIndex: ", this.activeIndex);
        this.completed = 1;
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  saveOrUpdateGoldLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: "Gold Mortgage Details Updated Successfully" }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateLandLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS,  detail: "Land Mortgage Details Updated Successfully"  }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateBondLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: "Bond Mortgage Details Updated Successfully"  }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateVehicleLoanMortagageDetails(activeIndex: any, buttonName: any) {
    if (this.termVehicleLoanMortgageModel.id != null && this.termVehicleLoanMortgageModel.id != undefined) {
      this.termLoanMortgageService.updateTermVehicleLoanMortagageDetails(this.termVehicleLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termVehicleLoanMortgageModel = this.responseModel.data[0];
            }
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.activeIndex = this.activeIndex + 1;
            this.navigateTo(this.activeIndex, this.termLoanApplicationId);
            console.log("Navigation executed, activeIndex: ", this.activeIndex);
            this.completed = 1;
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
    else {
      this.termLoanMortgageService.addTermVehicleLoanMortagageDetails(this.termVehicleLoanMortgageModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termVehicleLoanMortgageModel = this.responseModel.data[0];
              if (this.responseModel.data[0].termLoanApplicationId != null && this.responseModel.data[0].termLoanApplicationId != undefined) {
              }
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.activeIndex = this.activeIndex + 1;
            this.navigateTo(this.activeIndex, this.termLoanApplicationId);
            console.log("Navigation executed, activeIndex: ", this.activeIndex);
            this.completed = 1;
            }
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

  saveOrUpdateStorageLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: "Storage Mortgage Details Updated Successfully"  }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateOtherLoanMortagageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: "Land Mortgage Details Updated Successfully" }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  

  saveOrUpdateDocumentDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: "Loan Documents Update Succussfully" }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdatePropertyMortgageDetails(activeIndex: any, buttonName: any) {
    this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
    setTimeout(() => {
      this.msgs = [];
    }, 1200);
    this.activeIndex = this.activeIndex + 1;
    this.navigateTo(this.activeIndex, this.termLoanApplicationId);
    console.log("Navigation executed, activeIndex: ", this.activeIndex);
    this.completed = 1;
  }

  saveOrUpdateGenealogyDetails(activeIndex: any, buttonName: any) {
    // this.termLoanGenealogyTreeModel.pacsId = this.pacsId;
    // this.termLoanGenealogyTreeModel.pacsCode = this.pacsCode;
    // this.termLoanGenealogyTreeModel.branchId = this.branchId;
    this.termLoanGenealogyTreeModel.id = this.termLoanApplicationId;
    // this.termLoanGenealogyTreeModel.accountNumber = this.accountNumber;
    this.termLoanGenealogyTreeModel.applicantAdmissionNo = this.admissionNumber;
    if (this.termLoanGenealogyTreeModel.id == null) {
      this.isGenealogyEdit = false;
    } else {
      this.isGenealogyEdit = true;
    }
    if (this.isGenealogyEdit) {
      this.termLoanGenealogyTreeService.updateTermLoanGenealogyTree(this.termLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          console.log("Navigation executed, activeIndex: ", this.activeIndex);
          this.completed = 1;
        } else {
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
    } else {
      this.termLoanGenealogyTreeService.addTermLoanGenealogyTree(this.termLoanGenealogyTreeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.termLoanApplicationId);
          console.log("Navigation executed, activeIndex: ", this.activeIndex);
          this.completed = 1;
        } else {
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
  }

  activeIndexIncrement() {
    if (!this.showForm) {
      this.activeIndex = this.activeIndex + 2
    }
    else {
      this.activeIndex = this.activeIndex + 1
    }
    return this.activeIndex;
  }

  accountTypeBasedActiveIndexInscrement(operationTypeName: any) {
    if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      if (operationTypeName == AccountTypes.JOINT) {
        this.activeIndex = this.activeIndex + 1
      }
      else {
        this.activeIndex = this.activeIndex + 2;
      }
      return this.activeIndex;
    } else {
      if (operationTypeName == AccountTypes.JOINT) {
        this.activeIndex = this.activeIndex + 1
      }
      else {
        this.activeIndex = this.activeIndex + 3;
      }
      return this.activeIndex;
    }
  }
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  onClickOfGroupMoreDetails() {
    this.groupPromotersPopUpFlag = true;
  }

  onClickInstitutionMoreDetails() {
    this.institutionPromoterFlag = true;
  }

  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }
  close() {
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.memberSignatureCopyZoom = false;
    this.memberPhotoCopyZoom = false;
  }

  itemListWithoutParams(){
    if (this.showForm) {
      if (this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {
        this.items = [
          {
            label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP, 
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 1;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
      }
      else {
        this.items = [
          {
            label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 1;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 4;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
      }
      if(this.activeIndex == 0 && (this.admissionNumber == null || this.admissionNumber == undefined))
        this.router.navigate([Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP]);
    }
    else {
      if (this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {
        this.items = [
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
        if(this.activeIndex == 0&& (this.admissionNumber == null || this.admissionNumber == undefined))
        this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP]);
      }
      else {
        this.items = [
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 4;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: Loantransactionconstant.TERMLOANS_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
        // if(this.activeIndex == 0&& (this.admissionNumber == null || this.admissionNumber == undefined))
        // this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP]);
      }
     
    }
   
}

  itemListWithoutParamsForGroupInstitution(){
    if (this.showForm) {
      if (this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {

        this.items = [
          {
            label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP, 
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 1;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
         
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
      }
      else {
        this.items = [
          {
            label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 1;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 4;
            }
          },
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
      }
    }
    else {
      if(this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {        
        this.items = [
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
      }
      else {
        this.items = [
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 4;
            }
          },
 
          {
            label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          },
          {
            label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 7;
            }
          },
          {
            label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 8;
            }
          },
          {
            label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 9;
            }
          }
        ];
      }
    }
  }

  itemListWithParamGroupInstitution(){
    this.items = [];
    if(this.termLoanApplicationId != null && this.termLoanApplicationId != undefined ){
      if (this.showForm) {
        if (this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP, queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'Member Details', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_KYC,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
      else {
        if (this.termLoanApplicationModel.operationTypeName != AccountTypes.JOINT) {        
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
        else {
          this.items = [
            {
              label: 'KYC', icon: 'fa fa-podcast', routerLink: Loantransactionconstant.TERMLOANS_MEMBERSHIP,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 0;
              }
            },
            {
              label: 'Communication', icon: 'fa fa-map-marker', routerLink: Loantransactionconstant.TERMLOANS_COMMUNICATION,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: 'Application', icon: 'fa fa-id-badge', routerLink: Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 3;
              }
            },
            {
              label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 4;
              }
            },
            {
              label: 'Loan Guarantor', icon: 'fa fa-male', routerLink: Loantransactionconstant.TERMLOANS_GUARANTOR,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 6;
              }
            },
            {
              label: 'Loan Mortagage', icon: 'fa fa-puzzle-piece', routerLink: Loantransactionconstant.TERMLOANS_MORTAGAGE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 7;
              }
            },
            {
              label: 'Loan Documents', icon: 'fa fa-files-o', routerLink: Loantransactionconstant.TERM_LOAN_DOCUMENTS,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 8;
              }
            },
            {
              label: 'Loan Genealogy Tree', icon: 'fa fa-sitemap', routerLink: Loantransactionconstant.TERMLOANS_GENEALOGY_TREE,queryParams: { id: this.encryptDecryptService.encrypt(this.termLoanApplicationId)},
              disabled: this.menuDisabled,
              command: (event: any) => {
                this.activeIndex = 9;
              }
            }
          ];
        }
      }
    }
    else {
      this.itemListWithoutParamsForGroupInstitution();
    }
  }
}
