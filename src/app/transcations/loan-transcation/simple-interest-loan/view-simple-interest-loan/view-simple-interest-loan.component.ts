import { SiLoanGuardian } from './../../shared/si-loans/si-loan-guardian.model';
import { SiLoanGenealogyTree } from './../../shared/si-loans/si-loan-genealogy-tree.model';
import { SiLoanDocuments } from './../../shared/si-loans/si-loan-documents.model';
import { SiLoanGuarantor } from './../../shared/si-loans/si-loan-guarantor.model';
import { SiLoanCommunication } from './../../shared/si-loans/si-loan-communication.model';
import { SiLoanApplication } from './../../shared/si-loans/si-loan-application.model';
import { SiLoanApplicationService } from './../../shared/si-loans/si-loan-application.service';
import { Component } from '@angular/core';
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
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { SiLoanMortagageDetailsService } from '../../shared/si-loans/si-loan-mortagage-details.service';
import { VillagesService } from 'src/app/configurations/common-config/villages/shared/villages.service';
import { SiVehicleLoanMortgage } from '../../shared/si-loans/si-loan-mortgage.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../shared/si-loans/si-loan-membership-details.model';

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


  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private siLoanApplicationService: SiLoanApplicationService, private datePipe: DatePipe, private siProductDefinitionService: SiProductDefinitionService,
    private fileUploadService: FileUploadService, private commonFunctionsService: CommonFunctionsService, private villageService : VillagesService,
    private translate: TranslateService, private siLoanKycService: SiLoanKycService, private siLoanMortagageDetailsService:SiLoanMortagageDetailsService,) {
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
    { field: 'ornamentDescription', header: 'Ornament Description' },
    { field: 'ornamentsCount', header: 'Ornaments Count' },
    { field: 'ornamentQualityInKdm', header: 'Ornament Quality In Kdm' },
    { field: 'ornamentGrossWeightInGm', header: 'Ornament Net Weight In Gm' },
    { field: 'ornamentNetWeightInGm', header: 'Ornament Gross Weight In Gm' },
    { field: 'valuePerGramInRs', header: 'Value Per Gram' },
    { field: 'ornamentNetValueInRs', header: 'Ornament Net Value' },
  ];

    //land
    this.landLoanMortgageColumns = [
      { field: 'villageName', header: 'Village' },
      { field: 'passbookNumber', header: 'Passbook No' },
      { field: 'khataNumber', header: 'Khata Book No' },
      { field: 'surveyNumber', header: 'Survey No.' },
      { field: 'totalLandInUnits', header: 'Total Land In Units' },
      { field: 'totalLandInSubUnits', header: 'Total Land In Sub Units' },
      { field: 'landValuePerUnit', header: 'Land Value Per Unit' },
      { field: 'totalLandValue', header: ' Total Land Value' },
      { field: 'mortgageLandInUnits', header: 'Mortgage Land In Units' },
      { field: 'mortgageLandInSubUnits', header: 'Mortgage Land In SubUnits' },
      { field: 'mortgageLandValuePerUnit', header: 'Mortgage Land Value Per Unit' },
      { field: 'totalMortgageLandValue', header: 'Total Mortgage Land Value' },
      { field: 'mortgageDeedNumber', header: ' Mortgage Deed Number' },
      { field: 'mortgageDeedDateVal', header: 'Mortgage Deed Date' },
      { field: 'landOwnershipName', header: 'Land Ownership' },
    ];

   //Bond
   this.bondLoanMortgageColumns = [
    { field: 'bondTypeName', header: 'Bond Types	' },
    { field: 'bondNumber', header: 'Bond Number	' },
    { field: 'bondIssuedDateVal', header: 'Bond Issued Date' },
    { field: 'bondIssuedBy', header: 'Bond Issued By	' },
    { field: 'bondMaturityDateVal', header: 'Bond Maturity Date	' },
    { field: 'bondMaturityValueInRs', header: 'Bond Maturity Value		' },
    { field: 'bondPrincipleAmount', header: 'Bond Principal Amount	' },
    // { field: 'Action', header: 'ACTION' },
  ];

  //vehicle
  //vehicla status master 
  //used unused
  this.vehicleLoanMortgageColumns = [
    { field: 'vehicleMakerOrBrand', header: 'Vehicle Maker Or Brand' },
    { field: 'vehicleModel', header: 'Vehicle Model' },
    { field: 'vehicleRegNumber', header: 'Vehicle RegNumber' },
    { field: 'vehicleCost', header: 'Vehicle Cost' },
    { field: 'hypothecation', header: 'Hypothecation' },
    { field: 'insuranceNumber', header: 'Insurance Number' },
    { field: 'insuranceAmount', header: 'Sum Insured (₹)' },
    { field: 'vehicleStatus', header: 'Vehicle Status' },
  ];

 //storage
  this.storageLoanMortgageColumns = [
    { field: 'Commodity', header: 'Commodity' },
    { field: 'NWR Storage Receipt Number', header: 'NWR Storage Receipt Number' },
    { field: 'dateOfIssue', header: 'Date Of Issue' },
    { field: 'Number Of Units Stored', header: 'Number Of Units Stored' },
    { field: 'Per Unit Cost', header: 'Per Unit Cost' },
    { field: 'Net Value', header: 'Net Value' },
  ];


  //other
  this.otherLoanMortgageColumns = [
    { field: 'itemName', header: 'ITEM NAME' },
    { field: 'netWeight', header: 'NET WEIGHT IN GRAMS' },
    { field: 'grossWeight', header: 'GROSS WEIGHT IN GRAMS' },
    { field: 'value', header: 'VALUE' },
    { field: 'remarks', header: 'REMARKS' },
  ];

  //property
  this.propertyColumns = [
    { field: 'site', header: 'Site Name' },
    { field: 'location', header: 'Location' },
    { field: 'squareYards', header: 'Square Yards' },
    { field: 'propertySurveyNumber', header: 'Survey Number' },
    { field: 'valueOfProperty', header: 'Value Of Property' },
    { field: 'nameOfProperty', header: 'Name Of Property' },
    { field: 'extentOfProperty', header: 'Extent Of Property' },
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
      { field: 'operatorTypeName', header: 'ERP.TRANSACTION_DATE' },
      { field: 'memDobVal', header: 'ERP.DOB' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'genderName', header: 'ERP.GENDER' },
      { field: 'maritalStatusName', header: 'ERP.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'ERP.MOBILE' },
      { field: 'emailId', header: 'ERP.EMAIL' },
      { field: 'aadharNumber', header: 'ERP.AADHAR' },
      { field: 'startDate', header: 'ERP.START_DATE' },
    ];

    this.groupPrmoters = [
      { field: 'surname', header: 'ERP.SURNAME' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'operatorTypeName', header: 'ERP.OPERATION_TYPE' },
      { field: 'memDobVal', header: 'ERP.DOB' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'genderName', header: 'ERP.GENDER' },
      { field: 'maritalStatusName', header: 'ERP.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'ERP.MOBILE' },
      { field: 'emailId', header: 'ERP.EMAIL' },
      { field: 'aadharNumber', header: 'ERP.AADHAR' },
      { field: 'startDate', header: 'ERP.START_DATE' },
    ];

  }

  ngOnInit() {
    this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['editOpt'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        if (params['editOpt'] != undefined)
          this.idEdit = this.encryptDecryptService.decrypt(params['editOpt']);

        if (this.idEdit == "1")
          this.preveiwFalg = true
        else
          this.preveiwFalg = false;

        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
            this.viewButton =false;
            this.editFlag = true;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
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

            if (this.memberGroupDetailsModel.isNewMember != null && this.memberGroupDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;

            if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0)
              this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;

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

            if (this.membershipInstitutionDetailsModel.isNewMember != null && this.membershipInstitutionDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;

            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
              this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;

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

          if (this.siLoanApplicationModel.siLoanNomineeDetailsDTO != null && this.siLoanApplicationModel.siLoanNomineeDetailsDTO != undefined)
            this.siLoanNomineeModel = this.siLoanApplicationModel.siLoanNomineeDetailsDTO;

          if (this.siLoanApplicationModel.siMemberGuardianDetailsDTO != null && this.siLoanApplicationModel.siMemberGuardianDetailsDTO != undefined)
            this.siLoanGuardianModel = this.siLoanApplicationModel.siMemberGuardianDetailsDTO;

          if (this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList != null && this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList != undefined) {
            this.siLoanGuarantorDetailsList = this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList;
            this.siLoanGuarantorDetailsList = this.siLoanGuarantorDetailsList.map((model) => {
              if (model.admissionDate != null) {
                model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
              }
              return model;
            });
          }


          if (this.siLoanApplicationModel.siLoanGoldMortgageDetailsDTOList != null && this.siLoanApplicationModel.siLoanGoldMortgageDetailsDTOList != undefined)
            this.siGoldLoanMortgageDetailsList = this.siLoanApplicationModel.siLoanGoldMortgageDetailsDTOList;
          if (this.siGoldLoanMortgageDetailsList != null && this.siGoldLoanMortgageDetailsList.length > 0) {
            this.goldFlag = true;
          }
          else {
            this.goldFlag = false;
          }

          if (this.siLoanApplicationModel.siBondsMortgageDetailsDTOList != null && this.siLoanApplicationModel.siBondsMortgageDetailsDTOList != undefined)
            this.siBondLoanMortgageDetailsList = this.siLoanApplicationModel.siBondsMortgageDetailsDTOList;
          if (this.siBondLoanMortgageDetailsList != null && this.siBondLoanMortgageDetailsList.length > 0) {

            this.BondFlag = true;
            this.siBondLoanMortgageDetailsList.map((bond: any) => {
              bond.bondIssuedDateVal = this.datePipe.transform(bond.bondIssuedDate, this.orgnizationSetting.datePipe);
              bond.bondMaturityDateVal = this.datePipe.transform(bond.bondMaturityDate, this.orgnizationSetting.datePipe);
              let bondTypeName = this.bondTypesList.filter((obj: any) => obj.value == bond.bondType);//bond type name
              if (bondTypeName != null && bondTypeName != undefined && bondTypeName.length > 0)
                bond.bondTypeName = bondTypeName[0].label;
            }
            );
          }
          else {
            this.BondFlag = false;
          }

          if (this.siLoanApplicationModel.siLoanLandMortgageDetailsDTOList != null && this.siLoanApplicationModel.siLoanLandMortgageDetailsDTOList != undefined)
            this.siLandLoanMortgageList = this.siLoanApplicationModel.siLoanLandMortgageDetailsDTOList;
          if (this.siLandLoanMortgageList != null && this.siLandLoanMortgageList.length > 0) {
            this.landFlag = true;
          this.siLandLoanMortgageList.map((obj: any) => {
              if (obj.villageId != null && obj.villageId != undefined) {
                let villageName = this.villagesList.filter((village: any) => village.value == obj.villageId);
                obj.villageName = villageName[0].label;
              }
            });
          } else {
            this.landFlag = false;
          }

          if (this.siLoanApplicationModel.siStorageMortgageDetailsDTOList != null && this.siLoanApplicationModel.siStorageMortgageDetailsDTOList != undefined)
            this.siStorageLoanMortgageList = this.siLoanApplicationModel.siStorageMortgageDetailsDTOList;
          if (this.siStorageLoanMortgageList != null && this.siStorageLoanMortgageList.length > 0) {
            this.storageFlag = true
            this.siStorageLoanMortgageList.map((obj: any) => {
              if (obj.dateOfIssue != null && obj.dateOfIssue != undefined) {
                obj.dateOfIssueVal = this.datePipe.transform(obj.dateOfIssue, this.orgnizationSetting.datePipe);
              }
            });
          } else {
            this.storageFlag = false;
          }
          if (this.siLoanApplicationModel.siPropertyMortgageDTOList != null && this.siLoanApplicationModel.siPropertyMortgageDTOList != undefined)
            this.siPropertyMortgageList = this.siLoanApplicationModel.siPropertyMortgageDTOList;
          if (this.siPropertyMortgageList != null && this.siPropertyMortgageList.length > 0) {
            this.propertyFlag = true;
          } else {
            this.propertyFlag = false;
          }

          if (this.siLoanApplicationModel.siOtherMortgageDetailsDTOList != null && this.siLoanApplicationModel.siOtherMortgageDetailsDTOList != undefined)
            this.siOtherLoanMortgageList = this.siLoanApplicationModel.siOtherMortgageDetailsDTOList;
          if (this.siOtherLoanMortgageList != null && this.siOtherLoanMortgageList.length > 0) {
            this.otherFlag = true;
          } else {
            this.otherFlag = false;
          }
          if(this.siLoanApplicationModel.siLoanVehicleMortgageDetailsDTO != null && this.siLoanApplicationModel.siLoanVehicleMortgageDetailsDTO != undefined){
            this.siVehicleLoanMortgageModel = this.siLoanApplicationModel.siLoanVehicleMortgageDetailsDTO;
            this.vahicalFlag = true;
          } else {
            this.vahicalFlag = false;
          }

          if (this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList != null && this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList != undefined) {
            this.siLoanDocumentsDetailsList = this.siLoanApplicationModel.siLoanDocumentsDetailsDTOList;
            for (let document of this.siLoanDocumentsDetailsList) {
              if (document.filePath != null && document.filePath != undefined) {
                document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
              }
            }
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
    this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_GENEALOGY_TREE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
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
}
