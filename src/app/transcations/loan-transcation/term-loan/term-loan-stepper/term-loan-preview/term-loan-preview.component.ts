import { Component } from '@angular/core';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { TermLoanCommunication } from '../term-loans-communication/shared/term-loan-communication.model';
import { TermApplication, TermLoanInterestPolicy, TermLoanProductDefinition } from '../term-loan-application-details/shared/term-application.model';
import { TermLoanJointHolder } from '../term-loan-joint-account/shared/term-loan-joint-holder.model';
import { TermLoanGuardianDetails, TermLoanNominee } from '../term-loans-nominee/shared/term-loan-nominee.model';
import { TermLoanGuarantor } from '../term-loans-loan-guarantor/shared/term-loan-guarantor.model';
import { TermBondLoanMortgage, TermGoldLoanMortgage, TermLandLoanMortgage, TermOtherLoanMortgage, TermStorageLoanMortgage, TermVehicleLoanMortgage } from '../term-loan-mortgage/shared/term-loan-mortgage.model';
import { TermLoanGenealogyTree } from '../term-loan-genealogy-tree/shared/term-loan-genealogy-tree.model';
import { TermLoanDocuments } from '../term-loan-documents/shared/term-loan-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TranslateService } from '@ngx-translate/core';
import { TermLoanKycService } from '../term-loans-kyc/shared/term-loan-kyc.service';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CollateralTypes } from 'src/app/transcations/common-status-data.json';
import { approvaltransactionsconstant } from 'src/app/transcations/approval-transcations/approval-transactions-constant';

@Component({
  selector: 'app-term-loan-preview',
  templateUrl: './term-loan-preview.component.html',
  styleUrls: ['./term-loan-preview.component.css']
})
export class TermLoanPreviewComponent {
  admissionNo: any;
  id: any;

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
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanInterestPolicyModel: TermLoanInterestPolicy = new TermLoanInterestPolicy();

  amountblock: any[] = [];
  admissionNumber: any;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  admissionDetails: FormGroup;
  kycDetailsColumns: any[] = [];
  kycGridList: any[] = []
  termLoanGuarantorDetailsList: any[] = [];
  goldLoanMortgageColumns: any[] = [];
  termLoanDocumentsDetailsList: any[] = [];
  termLoanGenealogyTreeList: any[] = [];
  termGoldLoanMortgageDetailsList: any[] = [];
  nomineeMemberFullName: any;
  editOption: boolean = false;
  memberTypeName: any;
  editbtn: boolean = true;;
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
  relationshipTypesList: any [] =[];
  isFileUploaded: boolean = false;
  multipleFilesList: any[] = [];
  uploadFileData: any;
  landLoanMortgageColumns: { field: string; header: string; }[];
  bondLoanMortgageColumns: { field: string; header: string; }[];
  vehicleLoanMortgageColumns: { field: string; header: string; }[];
  storageLoanMortgageColumns: { field: string; header: string; }[];
  otherLoanMortgageColumns: { field: string; header: string; }[];
  collateralList: any;
  repaymentFrequencyList: any [] =[];
  loanPurposeList: any [] =[];
  termLoanApplicationId: any;
  isDisableSubmit: boolean = false;
  viewButton: boolean = false;
  editFlag: boolean = false;
  roleName: any;
  propertyColumns: { field: string; header: string; }[];
  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private datePipe: DatePipe, private termLoanApplicationsService: TermApplicationService,
    private fileUploadService: FileUploadService, private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService, private termLoanKycService: TermLoanKycService) {
   
   
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
        admissionNumber: ['', [Validators.required, Validators.minLength(3)]],
        templatepath: ['', [Validators.required, Validators.email]],
        description: ['', [Validators.required, Validators.minLength(18)]],
        statusName: ['', [Validators.required, Validators.min(18)]]
      });
  
      this.columns = [
        { field: 'surname', header: 'surname' },
        { field: 'name', header: 'name' },
        { field: 'operatorTypeName', header: 'operation type name' },
        { field: 'memDobVal', header: 'Date Of Birth' },
        { field: 'age', header: 'age' },
        { field: 'genderTypeName', header: 'gender Name' },
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
        { field: 'genderTypeName', header: 'gender name' },
        { field: 'maritalStatusName', header: 'marital status' },
        { field: 'mobileNumber', header: 'mobile number' },
        { field: 'emailId', header: 'email' },
        { field: 'aadharNumber', header: 'aadhar' },
        { field: 'startDateVal', header: 'start date' },
      ];
  
  
  
    }
  
    ngOnInit() {
      this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
      this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.getAllRelationshipTypes();
      this.getAllRepaymentFrequency();
      this.getAllLoanPurpose();
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined && params['id'] != null) {
          let termLoanApplicationId = this.encryptDecryptService.decrypt(params['id']);
          if (params['editbtn'] != undefined && params['editbtn'] != null) {
            let isEditParam = this.encryptDecryptService.decrypt(params['editbtn']);
            if (isEditParam == "1") {
              this.editbtn = true;
              this.viewButton = false;
              
            } else {
              this.editbtn = false;
              this.viewButton = true;
            }
          }
          if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
            let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
            if (isGrid === "0") {
              this.isShowSubmit = applicationConstants.FALSE;
              // this.viewButton = false;
              this.editFlag = true;
            } else {
              this.isShowSubmit = applicationConstants.TRUE;
            }
          }
          this.termLoanApplicationsService.getTermApplicationById(termLoanApplicationId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
                this.id = this.responseModel.data[0].id;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
                this.getTermApplicationByTermAccId();
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
     */
    getAllRepaymentFrequency() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllRepaymentFrequency().subscribe(response => {
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
   */
    getAllLoanPurpose() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllLoanPurpose().subscribe(response => {
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
  
    // backbutton() {
    //   this.termLoanApplicationsService.resetCurrentStep();
    //   // this.ciKycService.resetCurrentStep();
    //   this.router.navigate([Loantransactionconstant.TERM_LOAN]);
    // }
    navigateToBack() {
      if (this.roleName == "Manager") {
        this.router.navigate([approvaltransactionsconstant.TERM_LOAN_APPROVAL_DETAILS]);
      } else {
        this.router.navigate([Loantransactionconstant.TERM_LOAN]);
      }
    }
    submit(){
      this.termLoanApplicationModel.statusName = applicationConstants.SUBMISSION_FOR_APPROVAL;
      this.termLoanApplicationsService.updateTermApplication(this.termLoanApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.router.navigate([Loantransactionconstant.TERM_LOAN]);
            }, 2000);
            
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
  
    getTermApplicationByTermAccId() {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(this.id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.termLoanApplicationModel = this.responseModel.data[0];
          this.termLoanApplicationModel = this.responseModel.data[0];
          this.collateralListSet(this.termLoanApplicationModel);
          if (this.termLoanApplicationModel != null && this.termLoanApplicationModel != undefined) {
            if (this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != undefined)
              this.termLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.termLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
  
            if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined)
              this.termLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.termLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
  
            if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined)
              this.termLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
            
              //frequency name
            if(this.repaymentFrequencyList != null && this.repaymentFrequencyList != undefined && this.repaymentFrequencyList.length >0 && this.termLoanApplicationModel.repaymentFrequency != null && this.termLoanApplicationModel.repaymentFrequency !+ undefined){
              let repaymentFrequencyName = this.repaymentFrequencyList.filter((obj:any)=>obj.value == this.termLoanApplicationModel.repaymentFrequency);//set repayment frequency name 
              this.termLoanApplicationModel.repaymentFrequencyName = repaymentFrequencyName[0].label;
            }
            //purpose name
             if(this.loanPurposeList != null && this.loanPurposeList != undefined && this.loanPurposeList.length >0 && this.termLoanApplicationModel.purposeId != null && this.termLoanApplicationModel.purposeId != undefined){
              let purposeName = this.loanPurposeList.filter((obj:any)=>obj.value == this.termLoanApplicationModel.purposeId);//set purpose name 
              this.termLoanApplicationModel.purposeName = purposeName[0].label;
             } 
  
            if (this.termLoanApplicationModel.memberTypeName != null && this.termLoanApplicationModel.memberTypeName != undefined)
              this.memberTypeName = this.termLoanApplicationModel.memberTypeName;
  
            if (this.termLoanApplicationModel.applicationPath != null && this.termLoanApplicationModel.applicationPath != undefined) {
              this.termLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.termLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanApplicationModel.applicationPath);
            } 
  
            if (this.termLoanApplicationModel.operationTypeName != null && this.termLoanApplicationModel.operationTypeName != undefined ){
              if(this.termLoanApplicationModel.operationTypeName === "Joint")
                this.jointHoldersFlag = true;
            }
            else {
              // this.termLoanApplicationModel.operationTypeName = "Single";
            }
            if (this.termLoanApplicationModel.applicationPath != null && this.termLoanApplicationModel.applicationPath != undefined) {
              this.termLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.termLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanApplicationModel.applicationPath);
              this.isDisableSubmit = false;
            }
            else {
              this.isDisableSubmit = true;
            }
            
  
            if (this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList != null && this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList != undefined && this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList.length > 0) {
              this.jointHoldersFlag = true;
              this.jointHolderDetailsList = this.termLoanApplicationModel.termLoanCoApplicantDetailsDTOList;
              this.jointHolderDetailsList = this.jointHolderDetailsList.map((model) => {
                if (model.admissionDate != null) {
                  model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
                }
                return model;
              });
            }
            //individual
            if (this.termLoanApplicationModel.individualMemberDetailsDTO != undefined && this.termLoanApplicationModel.individualMemberDetailsDTO != null) {
              this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
  
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
                this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                this.photoCopyFlag = true;
              }
              if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
              }
  
            }
            //group
            if (this.termLoanApplicationModel.memberGroupDetailsDTO != undefined && this.termLoanApplicationModel.memberGroupDetailsDTO != null) {
              this.memberGroupDetailsModel = this.termLoanApplicationModel.memberGroupDetailsDTO;
  
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
                for(let promoter of this.groupPrmotersList){
                  promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
                  promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
                }
  
              if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined && this.memberGroupDetailsModel.isKycApproved)
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              else
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
            }
            //institution
            if (this.termLoanApplicationModel.memberInstitutionDTO != undefined && this.termLoanApplicationModel.memberInstitutionDTO != null) {
              this.membershipInstitutionDetailsModel = this.termLoanApplicationModel.memberInstitutionDTO;
  
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
              if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined && this.membershipInstitutionDetailsModel.isKycApproved)
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              else
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
            }
            //communication
            if (this.termLoanApplicationModel.termLoanCommunicationDTO != null && this.termLoanApplicationModel.termLoanCommunicationDTO != undefined)
              this.termLoanCommunicationModel = this.termLoanApplicationModel.termLoanCommunicationDTO;
            //kyc details
            if (this.termLoanApplicationModel.termLoanKycDetailsDTOList != null && this.termLoanApplicationModel.termLoanKycDetailsDTOList != undefined) {
              this.kycGridList = this.termLoanApplicationModel.termLoanKycDetailsDTOList;
              for (let kyc of this.kycGridList) {
                if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                  if (this.termLoanApplicationModel.isNewMember)
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  else {
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  }
                }
  
              }
            }
            //nominee Details
            if (this.termLoanApplicationModel.termLoanNomineeDetailsDTO != null && this.termLoanApplicationModel.termLoanNomineeDetailsDTO != undefined){
              this.termLoanNomineeModel = this.termLoanApplicationModel.termLoanNomineeDetailsDTO;
            if(this.termLoanNomineeModel.nomineeFilePath != null && this.termLoanNomineeModel.nomineeFilePath != undefined)
              this.termLoanNomineeModel.multipartFileList = this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
            }
            //guardain
            if (this.termLoanApplicationModel.termMemberGuardianDetailsDTO != null && this.termLoanApplicationModel.termMemberGuardianDetailsDTO != undefined){
              this.termLoanGuardianDetailsModel = this.termLoanApplicationModel.termMemberGuardianDetailsDTO;
              if(this.termLoanGuardianDetailsModel.uploadFilePath != null && this.termLoanGuardianDetailsModel.uploadFilePath != undefined)
                this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.termLoanGuardianDetailsModel.uploadFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanGuardianDetailsModel.uploadFilePath);
             
            }
  
            if (this.termLoanApplicationModel.termLoanGoldMortgageDetailsDTOList != null && this.termLoanApplicationModel.termLoanGoldMortgageDetailsDTOList != undefined)
              this.termGoldLoanMortgageDetailsList = this.termLoanApplicationModel.termLoanGoldMortgageDetailsDTOList;
  
            if (this.termLoanApplicationModel.termLoanDocumentsDetailsDTOList != null && this.termLoanApplicationModel.termLoanDocumentsDetailsDTOList != undefined) {
              this.termLoanDocumentsDetailsList = this.termLoanApplicationModel.termLoanDocumentsDetailsDTOList;
              for (let document of this.termLoanDocumentsDetailsList) {
                if (document.filePath != null && document.filePath != undefined) {
                  document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
                }
              }
            }
  
            if (this.termLoanApplicationModel.termLoanGenealogyTreeDTOList != null && this.termLoanApplicationModel.termLoanGenealogyTreeDTOList != undefined)
              this.termLoanGenealogyTreeList = this.termLoanApplicationModel.termLoanGenealogyTreeDTOList;
            for(let tree of this.termLoanGenealogyTreeList){
               this.relationshipTypesList.filter((obj:any) =>(obj.value == tree.relationWithApplicant)).map((obj) => {
                if (obj.label != null) {
                  tree.relationWithApplicantName = obj.label;
                }
                return obj;
              });
            }
  
            if (this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList != null && this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList != undefined) {
              this.termLoanGuarantorDetailsList = this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList;
              this.termLoanGuarantorDetailsList = this.termLoanGuarantorDetailsList.map((model) => {
                if (model.admissionDate != null) {
                  model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
                }
                return model;
              });
            }
           
            this.getProductDefinitionByProductId(this.termLoanApplicationModel.termProductId);
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
     */
    collateralListSet(obj :any){
      this.collateralList = [];
      if(obj.collateralType == CollateralTypes.BONDS_MORTGAGE){
        this.collateralList =obj.termBondsMortgageDetailsDTOList;
        this.collateralList = this.collateralList.map((bond: any) => {
          bond.maturityDateVal =  this.datePipe.transform(bond.maturityDate, this.orgnizationSetting.datePipe);
          return bond;
        });
        this.goldLoanMortgageColumns = this.bondLoanMortgageColumns;
      }else if(obj.collateralType == CollateralTypes.GOLD_MORTGAGE){
        this.collateralList = obj.termLoanGoldMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.goldLoanMortgageColumns;
      }else if(obj.collateralType == CollateralTypes.LAND_MORTGAGE){
        this.collateralList = obj.termLoanLandMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.landLoanMortgageColumns;
      }else if(obj.collateralType == CollateralTypes.OTHER_MORTGAGE){
        this.collateralList = obj.termOtherMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.otherLoanMortgageColumns;
      }else if(obj.collateralType == CollateralTypes.STORAGE_MORTGAGE){
        this.collateralList = obj.termStorageMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.storageLoanMortgageColumns;
      }else if(obj.collateralType == CollateralTypes.VEHICLE_MORTGAGE){
        this.collateralList = obj.termLoanVehicleMortgageDetailsDTOList;
        this.goldLoanMortgageColumns = this.vehicleLoanMortgageColumns;
      }
      else if(obj.collateralType == CollateralTypes.PROPERTY_MORTGAGE){
        this.collateralList = obj.termLoanPropertyList;
        this.goldLoanMortgageColumns = this.propertyColumns;
      }
    }
  
    getProductDefinitionByProductId(id: any) {
      this.termLoanApplicationsService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
                if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                  this.termLoanProductDefinitionModel = this.responseModel.data[0];
                  if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null) {
                    this.termLoanInterestPolicyModel = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0];
                    this.termLoanApplicationModel.effectiveRoi =  this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].roi;
                    this.termLoanApplicationModel.penalInterest =  this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].penalInterest;
                    this.termLoanApplicationModel.iod =  this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].iod;
                  }
                }
              }
            }
          }
        }
      });
    }
  
  
    getAllRelationshipTypes() {
      this.termLoanApplicationsService.getAllRelationTypes().subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.relationshipTypesList = this.responseModel.data;
              this.relationshipTypesList = this.responseModel.data.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id };
              });
              let relationshiptype = this.relationshipTypesList.find((data: any) => null != data && data.value == this.termLoanGenealogyTreeModel.relationWithApplicant);
              if (relationshiptype != null && undefined != relationshiptype)
                this.termLoanGenealogyTreeModel.relationWithApplicantName = relationshiptype.label;
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
  
  
    editMembership(rowData: any) {
      this.router.navigate([Loantransactionconstant.TERMLOANS_NEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editApplicationDetails(rowData: any) {
      if (rowData.operationTypeName == "Joint") {
        this.flag = true;
      }
      else {
        this.flag = false;
      }
      this.router.navigate([Loantransactionconstant.TERMLOANS_APPLICATION_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editCommunicationDetails(rowData: any) {
  
      this.router.navigate([Loantransactionconstant.TERMLOANS_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editKYCDetails(rowData: any) {
      if(this.isNewMember){
        this.router.navigate([Loantransactionconstant.TERMLOANS_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        }
        else{
          this.router.navigate([Loantransactionconstant.TERMLOANS_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    
        }
    }
  
    editJointHolderDetails(rowData: any) {
      this.router.navigate([Loantransactionconstant.TERMLOANS_JOINT_ACCOUNT], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editNomineeDetails(rowData: any) {
      this.router.navigate([Loantransactionconstant.TERMLOANS_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editGuarantorDetails(rowData: any) {
      this.router.navigate([Loantransactionconstant.TERMLOANS_GUARANTOR], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editMortgageDetails(rowData: any) {
  
      this.router.navigate([Loantransactionconstant.TERMLOANS_MORTAGAGE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editDocumentDetails(rowData: any) {
      this.router.navigate([Loantransactionconstant.TERM_LOAN_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  
    editGenealogyTreeDetails(rowData: any) {
      this.router.navigate([Loantransactionconstant.TERMLOANS_GENEALOGY_TREE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
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
      this.termLoanApplicationModel.multipartFileList = [];
      this.multipleFilesList = [];
      this.termLoanApplicationModel.filesDTO = null; // Initialize as a single object
      this.termLoanApplicationModel.applicationPath = null;
      let file = event.files[0]; // Only one file
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let filesDTO = new FileUploadModel();
        this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "TERM_LOAN_DETAILS_" + this.id + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
        filesDTO.fileType = file.type.split('/')[1];
        filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
        filesDTO.imageValue = this.uploadFileData.result as string;
        this.termLoanApplicationModel.filesDTO = filesDTO;
        this.termLoanApplicationModel.applicationPath = filesDTO.fileName;
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
      if (this.termLoanApplicationModel.filesDTO != null && this.termLoanApplicationModel.filesDTO != undefined) {
        let removeFileIndex = this.termLoanApplicationModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.termLoanApplicationModel.applicationPath);
        this.termLoanApplicationModel.filesDTO.splice(removeFileIndex, 1);
        // this.termLoanApplicationModel.signedCopyPath = null;
        this.isDisableSubmit = true;
      }
    }
    pdfDownload() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.downloadPDf(this.id).subscribe((data: any) => {
        var file = new Blob([data], { type: 'application/pdf' });
        saveAs(file, "Loan_application_filled_Document.pdf");
        this.msgs = [];
        this.msgs.push({ severity: "success", detail: 'Loan Application Downloaded Successfully' });
        this.commonComponent.stopSpinner();
      }, error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: "error", detail: 'Unable to Download Application' });
      })
       
    }
}
