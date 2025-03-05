import { SiLoanGuardian } from './../../shared/si-loans/si-loan-guardian.model';
import { SiLoanGenealogyTree } from './../../shared/si-loans/si-loan-genealogy-tree.model';
import { SiLoanDocuments } from './../../shared/si-loans/si-loan-documents.model';
import { SiLoanGuarantor } from './../../shared/si-loans/si-loan-guarantor.model';
import { SiLoanCommunication } from './../../shared/si-loans/si-loan-communication.model';
import { SiLoanApplication } from './../../shared/si-loans/si-loan-application.model';
import { SiLoanApplicationService } from './../../shared/si-loans/si-loan-application.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberGuardianDetailsModelDetaila, SiLoanNominee } from '../../shared/si-loans/si-loan-nominee.model';
import { Loantransactionconstant } from '../../loan-transaction-constant';
import { DatePipe } from '@angular/common';
import { SiProductDefinitionService } from '../../shared/si-loans/si-product-definition.service';
import { SiLoanInterestPolicy, SiLoanProductDefinition } from '../../shared/si-loans/si-loan-product-definition.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { SiLoanKycService } from '../../shared/si-loans/si-loan-kyc.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { approvaltransactionsconstant } from 'src/app/transcations/approval-transcations/approval-transactions-constant';
import { TruncatePipe } from 'angular-pipes';
import { CollateralTypes, CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { SiLoanMortagageDetailsService } from '../../shared/si-loans/si-loan-mortagage-details.service';
import { VillagesService } from 'src/app/configurations/common-config/villages/shared/villages.service';
import { SiVehicleLoanMortgage } from '../../shared/si-loans/si-loan-mortgage.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../shared/si-loans/si-loan-membership-details.model';
import { SiLoanHistoryService } from '../../shared/si-loans/si-loan-history.service';

@Component({
  selector: 'app-view-simple-interest-loan',
  templateUrl: './view-simple-interest-loan.component.html',
  styleUrls: ['./view-simple-interest-loan.component.css']
})
export class ViewSimpleInterestLoanComponent {
  amountblock: any[] = [];
  admissionNumber: any;
  id: any;

  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanCommunicationModel: SiLoanCommunication = new SiLoanCommunication();
  siLoanNomineeModel: SiLoanNominee = new SiLoanNominee();
  siLoanGuardianModel: SiLoanGuardian = new SiLoanGuardian();
  siLoanGuarantorModel: SiLoanGuarantor = new SiLoanGuarantor();
  siLoanDocumentsModel: SiLoanDocuments = new SiLoanDocuments();
  siLoanGenealogyTreeModel: SiLoanGenealogyTree = new SiLoanGenealogyTree();
  siVehicleLoanMortgageModel: SiVehicleLoanMortgage = new SiVehicleLoanMortgage();



  siLoanProductDefinitionModel: SiLoanProductDefinition = new SiLoanProductDefinition();
  siLoanInterestPolicyModel: SiLoanInterestPolicy = new SiLoanInterestPolicy();

  responseModel!: Responsemodel;
  msgs: any[] = [];
  admissionDetails: FormGroup;
  kycDetailsColumns: any[] = [];
  kycGridList: any[] = []
  siLoanGuarantorDetailsList: any[] = [];
  goldLoanMortgageColumns: any[] = [];
  siLoanDocumentsDetailsList: any[] = [];
  siLoanGenealogyTreeList: any[] = [];
  siGoldLoanMortgageDetailsList: any[] = [];
  siBondLoanMortgageDetailsList: any[] = [];
  siLandLoanMortgageList:any[] = [];

  nomineeMemberFullName: any;
  editOption: boolean = false;
  memberTypeName: any;
  preveiwFalg: any;
  flag: boolean = false;
  addressOne: any;
  addressTwo: any;
  gardianFullName: any;
  orgnizationSetting: any;
  promoterDetails: any;
  institutionPromoter: any;
  memberBasicDetailsFalg: boolean = false;
  memberGroupFlag: boolean = false;
  memberIntitutionFlag: boolean = false;
  memberPromoterDetails: any
  groupPromoterList: any[] = []
  registeredAddress: any;
  permanentAddress: any;

  documentDetails: any[] = [];
  genealogyTreeDetails: any[] = [];
  guarantorColumns: any = [];
  jointHolderColumns: any[] = [];

  idEdit: any;
  jointHoldersFlag: boolean = false;
  jointHolderDetailsList: any[] = [];

  isNewMember: boolean = false;
  membreIndividualFlag: boolean = false;
  isKycApproved: any;
  memberPhotoCopyZoom: boolean = false;
  photoCopyFlag: boolean = false;
  groupPrmoters: any[] = [];
  columns: any[] = [];
  groupPrmotersList: any[] = [];
  institionPromotersList: any[] = [];
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  isShowSubmit: boolean = applicationConstants.FALSE;
  isDisableSubmit: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any;
  uploadFileData: any;
  roleName: any;
  isFileUploadDisabled: boolean = false;
  viewButton:boolean = false;
  editFlag: boolean = false;
  landLoanMortgageColumns: any[]=[];
  bondLoanMortgageColumns: any[]=[];
  vehicleLoanMortgageColumns: any[]=[];
  storageLoanMortgageColumns:any[]=[];
  otherLoanMortgageColumns: any[]=[];
  propertyColumns: any[]=[];
  goldFlag: boolean = false;
  BondFlag:  boolean = false;
  landFlag:  boolean = false;
  storageFlag: boolean = false;
  propertyFlag: boolean = false;
  otherFlag: boolean = false;
  vahicalFlag: boolean = false;

  
  bondTypesList: any;
  villagesList:any[]=[];
  siStorageLoanMortgageList:any[]=[];
  siPropertyMortgageList: any[]=[];
  siOtherLoanMortgageList:  any[]=[];
  collateralList:  any[]=[];
  loanAccId: any;
  isMaximized: boolean = false;
  kycPhotoCopyZoom: boolean = false;
  nomineeflag: boolean = false;
  documentsFlag:  boolean = false;
  historyColumns:any[]=[];
  siLoanHistoryList: any[] = [];
  moduleTypes: any[] = [];
  mastercollateralList: any[]=[];
  docPhotoCopyZoom: boolean = false;
  nomineePhotoCopyZoom: boolean = false;
  guardianPhotoCopyZoom: boolean = false;


  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private siLoanApplicationService: SiLoanApplicationService, private datePipe: DatePipe, private siProductDefinitionService: SiProductDefinitionService,
    private fileUploadService: FileUploadService, private commonFunctionsService: CommonFunctionsService, private villageService : VillagesService,
    private translate: TranslateService, private siLoanKycService: SiLoanKycService, private siLoanMortagageDetailsService:SiLoanMortagageDetailsService,
  private siLoanHistoryService :SiLoanHistoryService) {
    this.amountblock = [
      { field: 'Service Type', header: 'ERP.SERVICE_TYPE' },
      { field: 'Service Charges', header: 'ERP.SERVICE_CHANRGES' },
      { field: 'Requested Date', header: 'ERP.REQUESTED_DATE' },
    ];
    this.kycDetailsColumns = [
      { field: 'effStartDate', header: 'ERP.APPROVED_DATE' },
      { field: 'statusName', header: 'ERP.STATUS_NAME' },
      { field: 'docPath', header: 'ERP.DOCUMENT' },
    ];
    this.guarantorColumns = [
      { field: 'memberTypeName', header: 'ERP.MEMBER_TYPE' },
      { field: 'admissionNumber', header: 'ERP.ADMISSION_NO' },
      { field: 'admissionDateVal', header: 'ERP.ADMISSION_DATE' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'aadharNumber', header: 'ERP.AADHAR' },
      { field: 'mobileNumber', header: 'ERP.MOBILE' },
      { field: 'emailId', header: 'ERP.EMAIL' },
    ];
    this.jointHolderColumns = [
      { field: 'memberTypeName', header: 'ERP.MEMBER_TYPE' },
      { field: 'admissionNumber', header: 'ERP.ADMISSION_NO' },
      { field: 'admissionDateVal', header: 'ERP.ADMISSION_DATE' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'aadharNumber', header: 'ERP.AADHAR' },
      { field: 'mobileNumber', header: 'ERP.MOBILE' },
      { field: 'emailId', header: 'ERP.EMAIL' },
    ];
   //gold
   this.goldLoanMortgageColumns = [
    { field: 'ornamentDescription', header: 'LOANS.ORNAMENT_DESCRIPTION' },
    { field: 'ornamentsCount', header: 'LOANS.ORNAMENTS_COUNT' },
    { field: 'ornamentQualityInKdm', header: 'LOANS.ORNAMENT_QUALITY_IN_KDM' },
    { field: 'ornamentGrossWeightInGm', header: 'LOANS.ORNAMENT_NET_WEIGHT_IN_GM' },
    { field: 'ornamentNetWeightInGm', header: 'LOANS.ORNAMNET_GROSS_WEIGHT_IN_GM' },
    { field: 'valuePerGramInRs', header: 'LOANS.VALUE_PER_GRAM' },
    { field: 'ornamentNetValueInRs', header: 'LOANS.ORNAMENT_NET_VALUE' }
  ];

    //land
    this.landLoanMortgageColumns = [
      { field: 'villageName', header: 'LOANS.VILLAGE' },
      { field: 'passbookNumber', header: 'LOANS.PASSBOOK_NO' },
      { field: 'khataNumber', header: 'LOANS.KHATA_BOOK_NO' },
      { field: 'surveyNumber', header: 'LOANS.SURVEY_NO' },
      { field: 'totalLandInUnits', header: 'LOANS.TOTAL_LAND_IN_UNITS' },
      { field: 'totalLandInSubUnits', header: 'LOANS.TOTAL_LAND_IN_SUB_UNITS' },
      { field: 'landValuePerUnit', header: 'LOANS.LAND_VALUE_PER_UNIT' },
      { field: 'totalLandValue', header: ' LOANS.TOTAL_AND_VALUE' },
      { field: 'mortgageLandInUnits', header: 'LOANS.MORTGAGE_LAND_IN_UNITS' },
      { field: 'mortgageLandInSubUnits', header: 'LOANS.MORTGAGE_LAND_IN_SUBUNITS' },
      { field: 'mortgageLandValuePerUnit', header: 'LOANS.MORTGAGE_LAND_VALUE_PER_UNIT' },
      { field: 'totalMortgageLandValue', header: 'LOANS.TOTAL_MORTGAGE_LAND_VALUE' },
      { field: 'mortgageDeedNumber', header: 'LOANS.MORTGAGE_DEED_NUMBER' },
      { field: 'mortgageDeedDateVal', header: 'LOANS.MORTGAGE_DEED_DATE' },
      { field: 'landOwnershipName', header: 'LOANS.LAND_OWNERSHIP' },
    ];
 
   //Bond
   this.bondLoanMortgageColumns = [
    { field: 'bondTypeName', header: 'LOANS.BOND_TYPES' },
    { field: 'bondNumber', header: 'LOANS.BOND_NUMBER' },
    { field: 'bondIssuedDateVal', header: 'LOANS.BOND_ISSUED_DATE' },
    { field: 'bondIssuedBy', header: 'LOANS.BOND_ISSUED_BY' },
    { field: 'bondMaturityDateVal', header: 'LOANS.BOND_MATURITY_DATE' },
    { field: 'bondMaturityValueInRs', header: 'LOANS.BOND_MATURITY_VALUE' },
    { field: 'bondPrincipleAmount', header: 'LOANS.BOND_PRINCIPAL_MOUNT' },
    // { field: 'Action', header: 'ACTION' },
  ];

  //vehicle
  //vehicla status master 
  //used unused
  this.vehicleLoanMortgageColumns = [
    { field: 'vehicleMakerOrBrand', header: 'LOANS.VEHICLE_MAKER_OR_BRAND' },
    { field: 'vehicleModel', header: 'LOANS.VEHICLE_MODEL' },
    { field: 'vehicleRegNumber', header: 'LOANS.VEHICLE_REGNUMBER' },
    { field: 'vehicleCost', header: 'LOANS.VEHICLE_COST' },
    { field: 'hypothecation', header: 'LOANS.HYPOTHECATION' },
    { field: 'insuranceNumber', header: 'LOANS.INSURANCE_NUMBER' },
    { field: 'insuranceAmount', header: 'LOANS.SUM_INSURED(₹)' },
    { field: 'vehicleStatus', header: 'LOANS.VEHICLE_STATUS' },
  ];

  this.storageLoanMortgageColumns = [
    { field: 'Commodity', header: 'LOANS.COMMODITY' },
    { field: 'NWR Storage Receipt Number', header: 'LOANS.NWR_STORAGE_RECEIPT_UMBER' },
    { field: 'dateOfIssue', header: 'LOANS.DATE_OF_ISSUE' },
    { field: 'Number Of Units Stored', header: 'LOANS.NUMBER_OF_UNITS_STORED' },
    { field: 'Per Unit Cost', header: 'LOANS.PER_UNIT_COST' },
    { field: 'Net Value', header: 'LOANS.NET_VALUE' },
    { field: 'Action', header: 'LOANS.ACTION' },
  ];

  //other
  this.otherLoanMortgageColumns = [
    { field: 'itemName', header: 'LOANS.ITEM_NAME' },
    { field: 'netWeight', header: 'LOANS.NET_WEIGHT_IN_GRAMS' },
    { field: 'grossWeight', header: 'LOANS.GROSS_WEIGHT_IN_GRAMS' },
    { field: 'value', header: 'LOANS.VALUE' },
    { field: 'remarks', header: 'LOANS.REMARKS' },
  ];

  //property
  this.propertyColumns = [
    { field: 'site', header: 'LOANS.SITE_NAMES' },
    { field: 'location', header: 'LOANS.LOCATION' },
    { field: 'squareYards', header: 'LOANS.SQUARE_YARDS' },
    { field: 'propertySurveyNumber', header: 'LOANS.SURVEY_NUMBER' },
    { field: 'valueOfProperty', header: 'LOANS.VALUE_OF_PROPERTY' },
    { field: 'nameOfProperty', header: 'LOANS.NAME _OF_PROPERTY' },
    { field: 'extentOfProperty', header: 'LOANS.EXTENT_OF_PROPERTY' },
  ];

  this.historyColumns = [
    { field: 'accountNumber', header: 'LOANS.NAME' },
    // { field: 'admissionNumber', header: 'ERP.ADMISSION_NUMBER' },
    { field: 'bankName', header: 'LOANS.BANKNAME' },
    { field: 'loanAmount', header: 'LOANS.LOAN_AMOUNT' },
    { field: 'collateralTypeName', header: 'LOANS.COLLATERAL_TYPE' },
    { field: 'openingDateVal', header: 'LOANS.OPENINGDATE' },
    { field: 'closingDateVal', header: 'LOANS.CLOSINGDATE' },
    { field: 'isNpaName', header: 'LOANS.ISNPA' },
    { field: 'moduleTypeName', header: 'LOANS.MODULE_TYPE' },
  ];

    this.documentDetails = [
      { field: 'documentTypeName', header: 'ERP.DOCUMENT_TYPE' },
      { field: 'documentNo', header: 'ERP.DOCUMENT_NUMBER' },
      { field: 'filePath', header: 'ERP.FILE_PATH' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];
    this.genealogyTreeDetails = [
      { field: 'relationWithApplicantName', header: 'ERP.RELATION_WITH_MEMBER' },
      { field: 'name', header: 'ERP.RELATION_NAME' },
      // { field: 'remarks', header: 'REMARKS' },
      // { field: 'Action', header: 'ACTION' },
    ];
    this.admissionDetails = this.formBuilder.group({
      admissionNumber: ['', [Validators.required, Validators.minLength(3)]],
      templatepath: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required, Validators.minLength(18)]],
      statusName: ['', [Validators.required, Validators.min(18)]]
    });
   
    this.columns = [
      { field: 'surname', header: 'ERP.SURNAME' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'isPocName', header: 'ERP.POC' },
      // { field: 'operatorTypeName', header: 'Operation Type' },
      { field: 'memDobVal', header: 'ERP.DOB' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'genderTypeName', header: 'ERP.GENDER' },
      { field: 'maritalStatusName', header: 'ERP.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'ERP.MOBILE' },
      { field: 'emailId', header: 'ERP.EMAIL' },
      { field: 'aadharNumber', header: 'ERP.AADHAR' },
      { field: 'startDateVal', header: 'ERP.START_DATE' },
      { field: 'endDateVal', header: 'ERP.END_DATE' },
    ];

    this.groupPrmoters = [
      { field: 'surname', header: 'ERP.SURNAME' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'isPocName', header: 'ERP.POC' },
      // { field: 'operatorTypeName', header: 'Operation Type' },
      { field: 'memDobVal', header: 'ERP.DOB' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'genderTypeName', header: 'ERP.GENDER' },
      { field: 'maritalStatusName', header: 'ERP.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'ERP.MOBILE' },
      { field: 'emailId', header: 'ERP.EMAIL' },
      { field: 'aadharNumber', header: 'ERP.AADHAR' },
      { field: 'startDateVal', header: 'ERP.START_DATE' },
      { field: 'endDateVal', header: 'ERP.END_DATE' },
    ];

  }

  ngOnInit() {
    this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['editOpt'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.loanAccId = id;
        if (params['editOpt'] != undefined)
          this.idEdit = this.encryptDecryptService.decrypt(params['editOpt']);

       
        if (this.idEdit == "1") {
          this.preveiwFalg = true;
          this.viewButton = false;
        } else {
          this.preveiwFalg = false;
          this.viewButton = true;
        }

        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
            // this.preveiwFalg = false;
            this.editFlag = true;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
            this.preveiwFalg = true;
          }
        }
        
        this.siLoanApplicationService.getSILoanApplicationById(id).subscribe(res => {
          this.responseModel = res;
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
              this.id = this.responseModel.data[0].id;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.getSILoanPreviewDetails();
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
    }),
      (error: any) => {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.getAllBondTypes();
      this.getAllVaillages();
  }
  backbutton() {
    this.siLoanApplicationService.resetCurrentStep();
    this.siLoanKycService.resetCurrentStep();
      if (this.roleName == applicationConstants.CEO_ROLE) {
      this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_TRANSACTION]);
    } else if (this.roleName === applicationConstants.MANAGER) {
      this.router.navigate([approvaltransactionsconstant.SI_LOANS_APPROVAL_TRANSACTION_DETAILS]);
    }
  }
  submit() {
    this.msgs = [];
    this.siLoanApplicationModel.accountStatusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
   
    this.siLoanApplicationService.updateSILoanApplication(this.siLoanApplicationModel).subscribe(response => {
      this.responseModel = response;
      this.siLoanApplicationModel =response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_TRANSACTION]);
          // }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });

  }
   /**
     * @implements get all BondTypes
     */
   getAllBondTypes() {
    this.commonComponent.startSpinner();
    this.siLoanMortagageDetailsService.getAllLandTypes().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.bondTypesList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
          return { label: landType.name, value: landType.id };
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }
      /**
     * @implements get all villages
     * @author k.yamuna
     */
      getAllVaillages(){
        this.villageService.getAllVillages().subscribe((data: any) => {
          this.responseModel = data;
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.villagesList = this.responseModel.data.filter((obj:any) => obj.status == applicationConstants.ACTIVE).map((obj: any) => {
              return { label: obj.name, value: obj.id };
            });
          } else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          }
        });
      }
    

  getSILoanPreviewDetails() {
    this.siLoanApplicationService.getSILoanPreviewDetails(this.id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.siLoanApplicationModel = this.responseModel.data[0];
        if (this.siLoanApplicationModel != null && this.siLoanApplicationModel != undefined) {
          if (this.siLoanApplicationModel.applicationDate != null && this.siLoanApplicationModel.applicationDate != undefined)
            this.siLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.siLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);

          if (this.siLoanApplicationModel.sanctionDate != null && this.siLoanApplicationModel.sanctionDate != undefined)
            this.siLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.siLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);

          if (this.siLoanApplicationModel.loanDueDate != null && this.siLoanApplicationModel.loanDueDate != undefined)
            this.siLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.siLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);

          if (this.siLoanApplicationModel.memberTypeName != null && this.siLoanApplicationModel.memberTypeName != undefined)
            this.memberTypeName = this.siLoanApplicationModel.memberTypeName;

          if (this.siLoanApplicationModel.operationTypeName != null && this.siLoanApplicationModel.operationTypeName != undefined && this.siLoanApplicationModel.operationTypeName === "Joint")
            this.jointHoldersFlag = true;

          if (this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList != null && this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList != undefined && this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList.length > 0) {
            this.jointHoldersFlag = true;
            this.jointHolderDetailsList = this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList;
            this.jointHolderDetailsList = this.jointHolderDetailsList.map((model) => {
              if (model.admissionDate != null) {
                model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
              }
              return model;
            });
          }

          if (this.siLoanApplicationModel.individualMemberDetailsDTO != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO != null) {
            this.membershipBasicRequiredDetailsModel = this.siLoanApplicationModel.individualMemberDetailsDTO;

            if (this.membershipBasicRequiredDetailsModel.admissionNumber != undefined && this.membershipBasicRequiredDetailsModel.admissionNumber != null)
              this.admissionNumber = this.membershipBasicRequiredDetailsModel.admissionNumber;

            if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
              this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
              this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

            if (this.membershipBasicRequiredDetailsModel.isNewMember != null && this.membershipBasicRequiredDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;

            if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

            if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
              this.photoCopyFlag = true;
            }
            if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
            }
             if (this.membershipBasicRequiredDetailsModel.mcrDocumentCopy != null && this.membershipBasicRequiredDetailsModel.mcrDocumentCopy != undefined) {
                  this.membershipBasicRequiredDetailsModel.multipartFileListForMCRCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.mcrDocumentCopy ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.mcrDocumentCopy  );
             }
          }

          if (this.siLoanApplicationModel.memberGroupDetailsDTO != undefined && this.siLoanApplicationModel.memberGroupDetailsDTO != null) {
            this.memberGroupDetailsModel = this.siLoanApplicationModel.memberGroupDetailsDTO;

            if (this.memberGroupDetailsModel.admissionNumber != undefined && this.memberGroupDetailsModel.admissionNumber != null)
              this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;

            if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
              this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
              this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

            if (this.memberGroupDetailsModel.isNewMember != null && this.memberGroupDetailsModel.isNewMember != undefined)
              this.isNewMember = this.memberGroupDetailsModel.isNewMember;

            if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0)
              this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
            for (let promoter of this.groupPrmotersList) {
              if (promoter.dob != null && promoter.dob != undefined) {
                promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
              }
              if (promoter.startDate != null && promoter.startDate != undefined) {
                promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
              }
              if (promoter.endDate != null && promoter.endDate != undefined) {
                promoter.endDateVal = this.datePipe.transform(promoter.endDate, this.orgnizationSetting.datePipe);
              }
              if (promoter.isPoc != null && promoter.isPoc != undefined && promoter.isPoc == applicationConstants.TRUE) {
                promoter.isPocName = applicationConstants.YES;
              }
              else {
                promoter.isPocName = applicationConstants.NO;
              }
            
            }

            if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined && this.memberGroupDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }

          if (this.siLoanApplicationModel.memberInstitutionDTO != undefined && this.siLoanApplicationModel.memberInstitutionDTO != null) {
            this.membershipInstitutionDetailsModel = this.siLoanApplicationModel.memberInstitutionDTO;

            if (this.membershipInstitutionDetailsModel.admissionNumber != undefined && this.membershipInstitutionDetailsModel.admissionNumber != null)
              this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;

            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

            if (this.membershipInstitutionDetailsModel.isNewMember != null && this.membershipInstitutionDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipInstitutionDetailsModel.isNewMember;

            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
              this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
            for (let promoter of this.institionPromotersList) {
              if (promoter.dob != null && promoter.dob != undefined) {
                promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
              }
              if (promoter.startDate != null && promoter.startDate != undefined) {
                promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
              }
              if (promoter.endDate != null && promoter.endDate != undefined) {
                promoter.endDateVal = this.datePipe.transform(promoter.endDate, this.orgnizationSetting.datePipe);
              }
              if (promoter.isPoc != null && promoter.isPoc != undefined && promoter.isPoc == applicationConstants.TRUE) {
                promoter.isPocName = applicationConstants.YES;
              }
              else {
                promoter.isPocName = applicationConstants.NO;
              }
            
            }

            if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined && this.membershipInstitutionDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }

          if (this.siLoanApplicationModel.siLoanCommunicationDTO != null && this.siLoanApplicationModel.siLoanCommunicationDTO != undefined)
            this.siLoanCommunicationModel = this.siLoanApplicationModel.siLoanCommunicationDTO;

          if (this.siLoanApplicationModel.siLoanKycDetailsDTOList != null && this.siLoanApplicationModel.siLoanKycDetailsDTOList != undefined) {
            this.kycGridList = this.siLoanApplicationModel.siLoanKycDetailsDTOList;
            for (let kyc of this.kycGridList) {
              if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
          }

          // if (this.siLoanApplicationModel.siLoanNomineeDetailsDTO != null && this.siLoanApplicationModel.siLoanNomineeDetailsDTO != undefined)
          //   this.siLoanNomineeModel = this.siLoanApplicationModel.siLoanNomineeDetailsDTO;

          // if (this.siLoanApplicationModel.siMemberGuardianDetailsDTO != null && this.siLoanApplicationModel.siMemberGuardianDetailsDTO != undefined)
          //   this.siLoanGuardianModel = this.siLoanApplicationModel.siMemberGuardianDetailsDTO;

          //nominee Details
          if (this.siLoanApplicationModel.siLoanNomineeDetailsDTO != null && this.siLoanApplicationModel.siLoanNomineeDetailsDTO != undefined) {
            this.siLoanNomineeModel = this.siLoanApplicationModel.siLoanNomineeDetailsDTO;
              if (this.siLoanNomineeModel.nomineeFilePath != null && this.siLoanNomineeModel.nomineeFilePath != undefined)
                this.siLoanNomineeModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.siLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanNomineeModel.nomineeFilePath);
              this.nomineeflag = true;
          }
          else{
            this.nomineeflag = false;
          }
          //guardain
          if (this.siLoanApplicationModel.siMemberGuardianDetailsDTO != null && this.siLoanApplicationModel.siMemberGuardianDetailsDTO != undefined) {
            this.siLoanGuardianModel = this.siLoanApplicationModel.siMemberGuardianDetailsDTO;
            if (this.siLoanGuardianModel.uploadFilePath != null && this.siLoanGuardianModel.uploadFilePath != undefined)
              this.siLoanGuardianModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.siLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanNomineeModel.nomineeFilePath);

          }

          if (this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList != null && this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList != undefined) {
            this.siLoanGuarantorDetailsList = this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList;
            this.siLoanGuarantorDetailsList = this.siLoanGuarantorDetailsList.map((model) => {
              if (model.admissionDate != null) {
                model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
              }
              return model;
            });
          }
          this.collateralListSet(this.siLoanApplicationModel);
          if (this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList != null && this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList != undefined &&
            this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList.length > 0
          ) {
            this.siLoanDocumentsDetailsList = this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList;
            for (let document of this.siLoanDocumentsDetailsList) {
              if (document.filePath != null && document.filePath != undefined) {
                document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
              }
            }
            this.documentsFlag = true;
          }
          else{
            this.documentsFlag = false;
          }
          if(this.siLoanApplicationModel.applicationPath != null && this.siLoanApplicationModel.applicationPath != undefined){
            this.siLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.siLoanApplicationModel.applicationPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanApplicationModel.applicationPath);
            this.isDisableSubmit = false;
          }
          else{
            this.isDisableSubmit = true;
          }

          if (this.siLoanApplicationModel.siLoanGenealogyTreeDTOList != null && this.siLoanApplicationModel.siLoanGenealogyTreeDTOList != undefined)
            this.siLoanGenealogyTreeList = this.siLoanApplicationModel.siLoanGenealogyTreeDTOList;

        
          if (this.siLoanApplicationModel.siProductDefinitionDTO != null && this.siLoanApplicationModel.siProductDefinitionDTO != undefined) {
            this.siLoanProductDefinitionModel = this.siLoanApplicationModel.siProductDefinitionDTO;
            if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != null)
              this.siLoanInterestPolicyModel = this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0];
          }
          this.getAllCollaterals();
        }
        // this.msgs = [];
        // this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        // setTimeout(() => {
        //   this.msgs = [];
        // }, 2000);
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, (error: any) => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  /**
     * @implements set collateral list data
     * @param obj 
     * @author k.yamuna
     */
    collateralListSet(obj :any){
      this.collateralList = [];
      if(obj.collateralType == CollateralTypes.BONDS_MORTGAGE){
        this.collateralList =obj.siBondsMortgageDetailsDTOList;
        this.collateralList = this.collateralList.map((bond: any) => {
          bond.maturityDateVal =  this.datePipe.transform(bond.maturityDate, this.orgnizationSetting.datePipe);
          return bond;
        });
        this.goldLoanMortgageColumns = this.bondLoanMortgageColumns;
      }
      else if(obj.collateralType == CollateralTypes.GOLD_MORTGAGE){
        this.collateralList = obj.siLoanGoldMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.goldLoanMortgageColumns;
        this.collateralList.map((bond: any) => {
          bond.bondIssuedDateVal = this.datePipe.transform(bond.bondIssuedDate, this.orgnizationSetting.datePipe);
          bond.bondMaturityDateVal = this.datePipe.transform(bond.bondMaturityDate, this.orgnizationSetting.datePipe);
          let bondTypeName = this.bondTypesList.filter((obj: any) => obj.value == bond.bondType);//bond type name
          if (bondTypeName != null && bondTypeName != undefined && bondTypeName.length > 0)
            bond.bondTypeName = bondTypeName[0].label;
        });
      }
      else if(obj.collateralType == CollateralTypes.LAND_MORTGAGE){
        this.collateralList = obj.siLoanLandMortgageDetailsDTOList;
        this.collateralList.map((obj: any) => {
              if (obj.villageId != null && obj.villageId != undefined) {
                let villageName = this.villagesList.filter((village: any) => village.value == obj.villageId);
                obj.villageName = villageName[0].label;
              }
            });
        this.goldLoanMortgageColumns = this.landLoanMortgageColumns;
      }
      else if(obj.collateralType == CollateralTypes.OTHER_MORTGAGE){
        this.collateralList = obj.siOtherMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.otherLoanMortgageColumns;
      }
      else if(obj.collateralType == CollateralTypes.STORAGE_MORTGAGE){
        this.collateralList = obj.siStorageMortgageDetailsDTOList;
        this.collateralList.map((obj: any) => {
          if (obj.dateOfIssue != null && obj.dateOfIssue != undefined) {
            obj.dateOfIssueVal = this.datePipe.transform(obj.dateOfIssue, this.orgnizationSetting.datePipe);
          }
        });
        this.goldLoanMortgageColumns = this.storageLoanMortgageColumns;
      }
      else if(obj.collateralType == CollateralTypes.VEHICLE_MORTGAGE){
        this.collateralList = obj.siLoanVehicleMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.vehicleLoanMortgageColumns;
      }
      else if(obj.collateralType == CollateralTypes.PROPERTY_MORTGAGE){
        this.collateralList = obj.siPropertyMortgageDTOList;
        this.goldLoanMortgageColumns = this.propertyColumns;
      }
    }
    

  getProductDefinitionByProductId(id: any) {
    this.siProductDefinitionService.getSIProductDefinitionPreviewByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siLoanProductDefinitionModel = this.responseModel.data[0];
                if (this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != undefined && this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList != null) {
                  this.siLoanInterestPolicyModel = this.siLoanProductDefinitionModel.siInterestPolicyConfigDTOList[0];
                }
              }
            }
          }
        }
      }
    });
  }

  editMembership(rowData: any) {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_MEMBERSHIP_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editApplicationDetails(rowData: any) {
    if (rowData.operationTypeName == "Joint") {
      this.flag = true;
    }
    else {
      this.flag = false;
    }
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_APPLICATION_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editCommunicationDetails(rowData: any) {

    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editKYCDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editJointHolderDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_JOINT_ACCOUNT], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editNomineeDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editGuarantorDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_GUARANTOR], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editMortgageDetails(rowData: any) {

    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_MORTAGAGE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editDocumentDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editGenealogyTreeDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_HISTORY], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  onClickOfGroupPromotes() {
    this.groupPromotersPopUpFlag = true;
  }

  onClickOfInstitutionPromotes() {
    this.institutionPromoterFlag = true;
  }

  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.siLoanApplicationModel.multipartFileList = [];
    this.multipleFilesList = [];
    this.siLoanApplicationModel.filesDTO = null; // Initialize as a single object
    this.siLoanApplicationModel.applicationPath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "SI_LOAN_DETAILS_" + this.id + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.siLoanApplicationModel.filesDTO = filesDTO;
      this.siLoanApplicationModel.applicationPath = filesDTO.fileName;
      this.isDisableSubmit = false;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
  fileRemoveEvent() {
    if (this.siLoanApplicationModel.filesDTO != null && this.siLoanApplicationModel.filesDTO != undefined) {
        let removeFileIndex = this.siLoanApplicationModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.siLoanApplicationModel.applicationPath);
        this.siLoanApplicationModel.filesDTO.splice(removeFileIndex, 1);
        this.isDisableSubmit = true;
      }
    }
      pdfDownload() {
        this.commonComponent.startSpinner();
        this.siLoanApplicationService.downloadPreviewPDf(this.loanAccId).subscribe((data: any) => {
          var file = new Blob([data], { type: 'application/pdf' });
          saveAs(file, "Si_loan_application_filled_Document.pdf");
          this.msgs = [];
          this.msgs.push({ severity: "success", detail: 'Si Loan application file downloaded successfully' });
          this.commonComponent.stopSpinner();
        }, error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: "error", detail: 'Unable to download filled FHR' });
        })
    
      }

  onClickkycPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }

  onClickdoccPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.docPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }

  onClicknomineePhotoCopy(){
    this.nomineePhotoCopyZoom = true;
  }
  onClickguardianPhotoCopy(){
    this.guardianPhotoCopyZoom = true;
  }
  
  // Popup Maximize
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  onDialogResize(event: any) {
    this.isMaximized = event.maximized;

    if (this.isMaximized) {
      // Restore original image size when maximized
      this.imageElement.nativeElement.style.width = 'auto';
      this.imageElement.nativeElement.style.height = 'auto';
      this.imageElement.nativeElement.style.maxWidth = '100%';
      this.imageElement.nativeElement.style.maxHeight = '100vh';
    } else {
      // Fit image inside the dialog without scrollbars
      this.imageElement.nativeElement.style.width = '100%';
      this.imageElement.nativeElement.style.height = '100%';
      this.imageElement.nativeElement.style.maxWidth = '100%';
      this.imageElement.nativeElement.style.maxHeight = '100%';
      this.imageElement.nativeElement.style.objectFit = 'contain';
    }
  }
 /**
   * @implements get all collateral
   * @author K.yamuna
   */
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.siLoanHistoryService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.mastercollateralList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
          return { label: collateral.name, value: collateral.id }
      });
      this.getSiLoanHistoryByApplicationId(this.id);
      this.commonComponent.stopSpinner();
    }
    else {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      this.commonComponent.stopSpinner();
    });
  }
  /**
     * @implements get si Loan History by Application Id
     * @param siLoanApplicationId 
     * @author K.yamuna
     */
  getSiLoanHistoryByApplicationId(siLoanApplicationId: any) {
    this.commonFunctionsService
    this.siLoanHistoryService.getSiLoanExistedDetailsByApplicationId(siLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.siLoanHistoryList = this.responseModel.data.filter((obj: any) => obj != null).map((history: any) => {
              history.closingDateVal = this.datePipe.transform(history.closingDate, this.orgnizationSetting.datePipe);
              history.openingDateVal = this.datePipe.transform(history.openingDate, this.orgnizationSetting.datePipe);
              if (history.isNPA != null && history.isNPA != undefined && history.isNPA)
                history.isNpaName = "Yes";
              else
                history.isNpaName = "No";
              history.moduleTypeName = this.moduleTypes.find((obj: any) => obj.value == history.moduleType)?.label;
              history.collateralTypeName = this.mastercollateralList.find((obj: any) => obj.value == history.collateralType)?.label;
              return history;
            });
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
