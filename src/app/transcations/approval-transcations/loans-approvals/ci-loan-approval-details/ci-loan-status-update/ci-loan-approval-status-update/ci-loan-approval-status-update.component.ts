import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CollateralTypes, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CiLoanCommunication } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-communication/shared/ci-communication.model';
import { CiKycService } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-kyc/shared/ci-kyc.service';
import { CiLoanDocumentsDetails } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-loan-documents/shared/ci-loan-documents-details.model';
import { CiLoanGenealogyTree } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-loan-genealogy-tree/shared/ci-loan-genealogy-tree.model';
import { CiLoanGenealogyTreeService } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-loan-genealogy-tree/shared/ci-loan-genealogy-tree.service';
import { CiLoanGuarantor } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-loan-guarantor/shared/ci-loan-guarantor.model';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-membership-details/shared/membership-details.model';
import { CiLoanGuardian } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-nominee/shared/ci-loan-guardian.model';
import { CiLoanNominee } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-nominee/shared/ci-loan-nominee.model';
import { CiLoanApplication } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.model';
import { CiLoanApplicationService } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.service';
import { CiInterestPolicy } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-product-definition/compound-interest-product-definition-stepper/ci-interest-policy/shared/ci-interest-policy.model';
import { CompoundInterestProductDefinition } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-product-definition/shared/compound-interest-product-definition.model';
import { CompoundInterestProductDefinitionService } from 'src/app/transcations/loan-transcation/compound-interest-loan/compound-interest-product-definition/shared/compound-interest-product-definition.service';
import { Loantransactionconstant } from 'src/app/transcations/loan-transcation/loan-transaction-constant';

@Component({
  selector: 'app-ci-loan-approval-status-update',
  templateUrl: './ci-loan-approval-status-update.component.html',
  styleUrls: ['./ci-loan-approval-status-update.component.css']
})
export class CiLoanApprovalStatusUpdateComponent {
  amountblock: any[] = [];
  admissionNumber: any;
  id: any;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  admissionDetails: FormGroup;
  kycDetailsColumns: any[] = [];
  kycGridList: any[] = []
  ciLoanGuarantorDetailsList: any[] = [];
  goldLoanMortgageColumns: any[] = [];
  ciLoanDocumentsDetailsList: any[] = [];
  ciLoanGenealogyTreeList: any[] = [];
  ciGoldLoanMortgageDetailsList: any[] = [];
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

  repaymentFrequencyList: any [] =[];
  loanPurposeList: any [] =[];

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciLoanCommunicationModel: CiLoanCommunication = new CiLoanCommunication();
  ciLoanNomineeModel: CiLoanNominee = new CiLoanNominee();
  ciLoanGuardianModel: CiLoanGuardian = new CiLoanGuardian();
  ciLoanGuarantorModel: CiLoanGuarantor = new CiLoanGuarantor();
  ciLoanDocumentsDetailsModel: CiLoanDocumentsDetails = new CiLoanDocumentsDetails();
  ciLoanGenealogyTreeModel: CiLoanGenealogyTree = new CiLoanGenealogyTree();
  ciProductDefinitionModel: CompoundInterestProductDefinition = new CompoundInterestProductDefinition();
  ciLoanInterestPolicyModel: CiInterestPolicy = new CiInterestPolicy();
  statusList: any [] =[];
  landLoanMortgageColumns: any[] = [];
  bondLoanMortgageColumns: any[] = [];
  vehicleLoanMortgageColumns: any[] = [];
  storageLoanMortgageColumns: any[] = [];
  otherLoanMortgageColumns: any[] = [];
  collateralList: any[] = [];
  relationshipTypesList: any [] = [];
  propertyColumns:any[] = [];
  indvidualFalg: boolean = true;
  

  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, 
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private datePipe: DatePipe, 
     private fileUploadService: FileUploadService, 
     private commonFunctionsService: CommonFunctionsService,
     private translate: TranslateService,
     private ciProductDefinitionService: CompoundInterestProductDefinitionService,
     private ciLoanApplicationService: CiLoanApplicationService,
     private ciKycService:CiKycService , private ciLoanGenealogyTreeService: CiLoanGenealogyTreeService) {
    this.amountblock = [
      { field: 'Service Type', header: 'SERVICE TYPE' },
      { field: 'Service Charges', header: 'SERVICE CHARGES' },
      { field: 'Requested Date', header: 'REQUESTED DATE' },
    ];
    this.kycDetailsColumns = [
      { field: 'effStartDate', header: 'Approved Date' },
      { field: 'statusName', header: 'Status Name' },
      { field: 'docPath', header: 'Documents' },
    ];
    this.guarantorColumns = [
      { field: 'memberTypeName', header: 'LOAN_TRANSACTION.MEMBER_TYPE' },
      { field: 'admissionNumber', header: 'LOAN_TRANSACTION.ADMISSION_NO' },
      { field: 'admissionDate', header: 'LOAN_TRANSACTION.ADMISSION_DATE' },
      { field: 'name', header: 'LOAN_TRANSACTION.NAME' },
      { field: 'aadharNumber', header: 'LOAN_TRANSACTION.AADHAR_NUMBER' },
      { field: 'mobileNumber', header: 'LOAN_TRANSACTION.MOBILE_NUMBER' },
      { field: 'emailId', header: 'LOAN_TRANSACTION.EMAIL' },
    ];
    this.jointHolderColumns = [
      // { field: 'memberTypeName', header: 'LOAN_TRANSACTION.MEMBER_TYPE' },
      { field: 'admissionNumber', header: 'LOAN_TRANSACTION.ADMISSION_NO' },
      { field: 'admissionDate', header: 'LOAN_TRANSACTION.ADMISSION_DATE' },
      { field: 'name', header: 'LOAN_TRANSACTION.NAME' },
      { field: 'aadharNumber', header: 'LOAN_TRANSACTION.AADHAR_NUMBER' },
      { field: 'mobileNumber', header: 'LOAN_TRANSACTION.MOBILE_NUMBER' },
      { field: 'emailId', header: 'LOAN_TRANSACTION.EMAIL' },
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
      { field: 'bondTypeName', header: 'Bond Types' },
      { field: 'bondNumber', header: 'Bond Number' },
      { field: 'bondIssuedDateVal', header: 'Bond Issued Date' },
      { field: 'bondIssuedBy', header: 'Bond Issued By' },
      { field: 'bondMaturityDateVal', header: 'Bond Maturity Date' },
      { field: 'bondMaturityValueInRs', header: 'Bond Maturity Value' },
      { field: 'bondPrincipleAmount', header: 'Bond Principal Amount' },
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
      { field: 'commodity', header: 'Commodity' },
      { field: 'nwrStorageReceiptNumber', header: 'NWR Storage Receipt Number' },
      { field: 'dateOfIssueVal', header: 'Date Of Issue' },
      { field: 'numberOfUnitsStored', header: 'Number Of Units Stored' },
      { field: 'perUnitCostInRs', header: 'Per Unit Cost' },
      { field: 'netValueInRs', header: 'Net Value' },
    ];

    //other
    this.otherLoanMortgageColumns = [
      { field: 'name', header: 'ITEM NAME' },
      { field: 'noOfUnits', header: 'NET WEIGHT IN GRAMS' },
      { field: 'value', header: 'GROSS WEIGHT IN GRAMS' },
      { field: 'remarks', header: 'VALUE' },
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
      { field: 'documentTypeName', header: 'LOAN_TRANSACTION.DOCUMENT_TYPE' },
      { field: 'documentNo', header: 'LOAN_TRANSACTION.DOCUMENT_NUMBER' },
      { field: 'filePath', header: 'LOAN_TRANSACTION.UPLOAD_DOCUMENT' },
      // { field: 'remarks', header: 'LOAN_TRANSACTION.REMARKS' },
      // { field: 'Action', header: 'LOAN_TRANSACTION.ACTION' },
    ];
    this.genealogyTreeDetails = [
      { field: 'relationWithApplicantName', header: 'LOAN_TRANSACTION.RELATIONSHIP_WITH_MEMBER' },
      { field: 'name', header: 'LOAN_TRANSACTION.RELATION_NAME' },
      // { field: 'remarks', header: 'LOAN_TRANSACTION.REMARKS' },
      // { field: 'Action', header: 'LOAN_TRANSACTION.ACTION' },
    ];
    this.admissionDetails = this.formBuilder.group({
      description: ['', Validators.required],
      statusName: ['', Validators.required],
    });

    this.columns = [
      { field: 'surname', header: 'SURNAME' },
      { field: 'name', header: 'NAME' },
      { field: 'operatorTypeName', header: 'TRANSACTION_DATE' },
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender Name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile Number' },
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
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.statusList = this.commonComponent.approvalStatus();
    this.getAllRelationshipTypes();
    this.getAllRepaymentFrequency();
    this.getAllLoanPurpose();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['editbutton'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        if (params['editbutton'] != undefined)
          this.idEdit = this.encryptDecryptService.decrypt(params['editbutton']);

        if (this.idEdit == "1"){
          this.preveiwFalg = true
        this.isShowSubmit = applicationConstants.TRUE;
        }
        else{
          this.preveiwFalg = false;
          this.isShowSubmit = applicationConstants.FALSE;
        }

        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        this.ciLoanApplicationService.getCiLoanApplicationsById(id).subscribe(res => {
          this.responseModel = res;
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
              this.id = this.responseModel.data[0].id;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.getCiLoanApplicationByCiAccId();
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
  }
  /**
   * @implements repayment frequency name
   * @author jyothi.naidana
   */
  getAllRepaymentFrequency() {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getAllRepaymentFrequency().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.repaymentFrequencyList = this.responseModel.data.filter((repaymentFrequency: { status: number; }) => repaymentFrequency.status == applicationConstants.ACTIVE).map((repaymentFrequency: any) => {
          return { label: repaymentFrequency.name, value: repaymentFrequency.id };
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
 * @implements get all loan purpose
 * @author jyothi.naidana
 */
  getAllLoanPurpose() {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getAllLoanPurpose().subscribe(response => {
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

  /**
   * @implements get all relationships
   * @author jyothi.naidana
   */
  getAllRelationshipTypes() {
    this.ciLoanGenealogyTreeService.getAllRelationshipTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationshipTypesList = this.responseModel.data;
            this.relationshipTypesList = this.responseModel.data.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            let relationshiptype = this.relationshipTypesList.find((data: any) => null != data && data.value == this.ciLoanGenealogyTreeModel.relationWithApplicant);
            if (relationshiptype != null && undefined != relationshiptype)
              this.ciLoanGenealogyTreeModel.relationWithApplicantName = relationshiptype.label;
          } else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
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


  backbutton() {
    this.ciLoanApplicationService.resetCurrentStep();
    // this.ciKycService.resetCurrentStep();
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_APPROVAL]);
  }
  submit() {
  //  let id =  this.ciLoanApplicationModel.id;
  //   let accountStatus = this.ciLoanApplicationModel.accountStatusName;
  //   this.ciLoanApplicationModel = new CiLoanApplication();
  //   this.ciLoanApplicationModel.id = id;
    // this.ciLoanApplicationModel.accountStatusName = accountStatus;
    this.ciLoanApplicationService.approve(this.ciLoanApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
          this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_APPROVAL]);
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

 getCiLoanApplicationByCiAccId() {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(this.id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.ciLoanApplicationModel = this.responseModel.data[0];
        this.collateralListSet(this.ciLoanApplicationModel);
        if (this.ciLoanApplicationModel != null && this.ciLoanApplicationModel != undefined) {
          if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined)
            this.ciLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.ciLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);

          if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined)
            this.ciLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.ciLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);

          if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined)
            this.ciLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.ciLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
          if(this.ciLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
              this.indvidualFalg = true;
            else {
              this.indvidualFalg = false;
            }
            //frequency name
          if(this.repaymentFrequencyList != null && this.repaymentFrequencyList != undefined && this.repaymentFrequencyList.length >0 && this.ciLoanApplicationModel.repaymentFrequency != null && this.ciLoanApplicationModel.repaymentFrequency !+ undefined){
            let repaymentFrequencyName = this.repaymentFrequencyList.filter((obj:any)=>obj.value == this.ciLoanApplicationModel.repaymentFrequency);//set repayment frequency name 
            this.ciLoanApplicationModel.repaymentFrequencyName = repaymentFrequencyName[0].label;
          }
          //purpose name
           if(this.loanPurposeList != null && this.loanPurposeList != undefined && this.loanPurposeList.length >0 && this.ciLoanApplicationModel.purposeId != null && this.ciLoanApplicationModel.purposeId != undefined){
            let purposeName = this.loanPurposeList.filter((obj:any)=>obj.value == this.ciLoanApplicationModel.purposeId);//set purpose name 
            this.ciLoanApplicationModel.purposeName = purposeName[0].label;
           } 

          if (this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined)
            this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;

          if (this.ciLoanApplicationModel.applicationPath != null && this.ciLoanApplicationModel.applicationPath != undefined) {
            this.ciLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.ciLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanApplicationModel.applicationPath);
          } 

          if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined ){
            if(this.ciLoanApplicationModel.operationTypeName === "Joint")
              this.jointHoldersFlag = true;
          }
          else {
            // this.ciLoanApplicationModel.operationTypeName = "Single";
          }
            

          if (this.ciLoanApplicationModel.ciLoanCoApplicantDetailsDTOList != null && this.ciLoanApplicationModel.ciLoanCoApplicantDetailsDTOList != undefined && this.ciLoanApplicationModel.ciLoanCoApplicantDetailsDTOList.length > 0) {
            this.jointHoldersFlag = true;
            this.jointHolderDetailsList = this.ciLoanApplicationModel.ciLoanCoApplicantDetailsDTOList;
            this.jointHolderDetailsList = this.jointHolderDetailsList.map((model) => {
              if (model.admissionDate != null) {
                model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
              }
              return model;
            });
          }
          //individual
          if (this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined && this.ciLoanApplicationModel.individualMemberDetailsDTO != null) {
            this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;

            if (this.membershipBasicDetailsModel.admissionNumber != undefined && this.membershipBasicDetailsModel.admissionNumber != null)
              this.admissionNumber = this.membershipBasicDetailsModel.admissionNumber;

            if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined)
              this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined)
              this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);

            if (this.membershipBasicDetailsModel.isNewMember != null && this.membershipBasicDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipBasicDetailsModel.isNewMember;

            if (this.membershipBasicDetailsModel.isKycApproved != null && this.membershipBasicDetailsModel.isKycApproved != undefined && this.membershipBasicDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;

            if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
              this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
              this.photoCopyFlag = true;
            }
            if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
              this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath);
            }

          }
          //group
          if (this.ciLoanApplicationModel.memberGroupDetailsDTO != undefined && this.ciLoanApplicationModel.memberGroupDetailsDTO != null) {
            this.membershipGroupDetailsModel = this.ciLoanApplicationModel.memberGroupDetailsDTO;

            if (this.membershipGroupDetailsModel.admissionNumber != undefined && this.membershipGroupDetailsModel.admissionNumber != null)
              this.admissionNumber = this.membershipGroupDetailsModel.admissionNumber;

            if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined)
              this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined)
              this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            if (this.membershipGroupDetailsModel.isNewMember != null && this.membershipGroupDetailsModel.isNewMember != undefined)
              this.isNewMember = this.membershipGroupDetailsModel.isNewMember;

            if (this.membershipGroupDetailsModel.groupPromoterList != null && this.membershipGroupDetailsModel.groupPromoterList != undefined && this.membershipGroupDetailsModel.groupPromoterList.length > 0)
              this.groupPrmotersList = this.membershipGroupDetailsModel.groupPromoterList;
              for(let promoter of this.groupPrmotersList){
                promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
              }

            if (this.membershipGroupDetailsModel.isKycApproved != null && this.membershipGroupDetailsModel.isKycApproved != undefined && this.membershipGroupDetailsModel.isKycApproved)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          //institution
          if (this.ciLoanApplicationModel.memberInstitutionDTO != undefined && this.ciLoanApplicationModel.memberInstitutionDTO != null) {
            this.membershipInstitutionDetailsModel = this.ciLoanApplicationModel.memberInstitutionDTO;

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
            for(let promoter of this.institionPromotersList){
              promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
              promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.isKycCompleted != null && this.membershipInstitutionDetailsModel.isKycCompleted != undefined && this.membershipInstitutionDetailsModel.isKycCompleted)
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            else
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          //communication
          if (this.ciLoanApplicationModel.ciLoanCommunicationDTO != null && this.ciLoanApplicationModel.ciLoanCommunicationDTO != undefined)
            this.ciLoanCommunicationModel = this.ciLoanApplicationModel.ciLoanCommunicationDTO;
          //kyc details
          if (this.ciLoanApplicationModel.ciLoanKycDetailsList != null && this.ciLoanApplicationModel.ciLoanKycDetailsList != undefined) {
            this.kycGridList = this.ciLoanApplicationModel.ciLoanKycDetailsList;
            for (let kyc of this.kycGridList) {
              if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
          }
          //nominee Details
          if (this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList != null && this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList != undefined){
            this.ciLoanNomineeModel = this.ciLoanApplicationModel.ciLoanNomineeDetailsDTOList;
          if(this.ciLoanNomineeModel.nomineeFilePath != null && this.ciLoanNomineeModel.nomineeFilePath != undefined)
            this.ciLoanNomineeModel.nomineeMultiPartList = this.fileUploadService.getFile(this.ciLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanNomineeModel.nomineeFilePath);
          }
          //guardain
          if (this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO != null && this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO != undefined){
            this.ciLoanGuardianModel = this.ciLoanApplicationModel.ciMemberGuardianDetailsDTO;
            if(this.ciLoanGuardianModel.uploadFilePath != null && this.ciLoanGuardianModel.uploadFilePath != undefined)
              this.ciLoanGuardianModel.guardainMultipartList = this.fileUploadService.getFile(this.ciLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanNomineeModel.nomineeFilePath);
           
          }

          if (this.ciLoanApplicationModel.ciLoanGoldMortgageDetailsDTOList != null && this.ciLoanApplicationModel.ciLoanGoldMortgageDetailsDTOList != undefined)
            this.ciGoldLoanMortgageDetailsList = this.ciLoanApplicationModel.ciLoanGoldMortgageDetailsDTOList;

          if (this.ciLoanApplicationModel.ciLoanDocumentsDetailsDTOList != null && this.ciLoanApplicationModel.ciLoanDocumentsDetailsDTOList != undefined) {
            this.ciLoanDocumentsDetailsList = this.ciLoanApplicationModel.ciLoanDocumentsDetailsDTOList;
            for (let document of this.ciLoanDocumentsDetailsList) {
              if (document.filePath != null && document.filePath != undefined) {
                document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
              }
            }
          }

          if (this.ciLoanApplicationModel.ciLoanGenealogyTreeDTOList != null && this.ciLoanApplicationModel.ciLoanGenealogyTreeDTOList != undefined)
            this.ciLoanGenealogyTreeList = this.ciLoanApplicationModel.ciLoanGenealogyTreeDTOList;
          for(let tree of this.ciLoanGenealogyTreeList){
             this.relationshipTypesList.filter((obj:any) =>(obj.value == tree.relationWithApplicant)).map((obj) => {
              if (obj.label != null) {
                tree.relationWithApplicantName = obj.label;
              }
              return obj;
            });
          }

          if (this.ciLoanApplicationModel.ciLoanGuarantorDetailsDTOList != null && this.ciLoanApplicationModel.ciLoanGuarantorDetailsDTOList != undefined) {
            this.ciLoanGuarantorDetailsList = this.ciLoanApplicationModel.ciLoanGuarantorDetailsDTOList;
            this.ciLoanGuarantorDetailsList = this.ciLoanGuarantorDetailsList.map((model) => {
              if (model.admissionDate != null) {
                model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
              }
              return model;
            });
          }

         
          this.getProductDefinitionByProductId(this.ciLoanApplicationModel.ciProductId);
        }
        this.msgs = [];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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
   * @author jyothi.naidana
   */
   collateralListSet(obj :any){
    this.collateralList = [];
    if(obj.collateralType == CollateralTypes.BONDS_MORTGAGE){
      this.collateralList =obj.ciBondsMortgageDetailsDTOList;
      this.collateralList = this.collateralList.map((bond: any) => {
        bond.maturityDateVal =  this.datePipe.transform(bond.maturityDate, this.orgnizationSetting.datePipe);
        return bond;
      });
      this.goldLoanMortgageColumns = this.bondLoanMortgageColumns;
    }else if(obj.collateralType == CollateralTypes.GOLD_MORTGAGE){
      this.collateralList = obj.ciLoanGoldMortgageDetailsDTOList;
      this.goldLoanMortgageColumns = this.goldLoanMortgageColumns;
    }else if(obj.collateralType == CollateralTypes.LAND_MORTGAGE){
      this.collateralList = obj.ciLoanLandMortgageDetailsDTOList;
      this.goldLoanMortgageColumns = this.landLoanMortgageColumns;
    }else if(obj.collateralType == CollateralTypes.OTHER_MORTGAGE){
      this.collateralList = obj.ciOtherMortgageDetailsDTOList;
      this.goldLoanMortgageColumns = this.otherLoanMortgageColumns;
    }else if(obj.collateralType == CollateralTypes.STORAGE_MORTGAGE){
      this.collateralList = obj.ciStorageMortgageDetailsDTOList;
      this.goldLoanMortgageColumns = this.storageLoanMortgageColumns;
    }else if(obj.collateralType == CollateralTypes.VEHICLE_MORTGAGE){
      this.collateralList = obj.ciLoanVehicleMortgageDetailsDTOList;
      this.goldLoanMortgageColumns = this.vehicleLoanMortgageColumns;
    }
  }

  getProductDefinitionByProductId(id: any) {
    this.ciProductDefinitionService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.ciProductDefinitionModel = this.responseModel.data[0];
                if (this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList != undefined && this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList != null) {
                  this.ciLoanInterestPolicyModel = this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList[0];
                  this.ciLoanApplicationModel.effectiveRoi =  this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList[0].roi;
                  this.ciLoanApplicationModel.penalInterest =  this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList[0].penalInterest;
                  this.ciLoanApplicationModel.iod =  this.ciProductDefinitionModel.ciInterestPolicyConfigDTOList[0].iod;
                }
              }
            }
          }
        }
      }
    });
  }

  editMembership(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_NEW_MEMBERSHIP_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editApplicationDetails(rowData: any) {
    if (rowData.operationTypeName == "Joint") {
      this.flag = true;
    }
    else {
      this.flag = false;
    }
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_APPLICATIOIN_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editCommunicationDetails(rowData: any) {

    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_COMMUNICATON], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editKYCDetails(rowData: any) {
    if(this.isNewMember){
      this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
      }
      else{
        this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_MEMBERSHIP_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  
      }
  }

  editJointHolderDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_CO_APPLICANT_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editNomineeDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editGuarantorDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_GUARANTOR], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editMortgageDetails(rowData: any) {

    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_MORTAGAGE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editDocumentDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editGenealogyTreeDetails(rowData: any) {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOANS_GENEALOGY_TREE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
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
}
