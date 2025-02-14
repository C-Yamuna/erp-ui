import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Loantransactionconstant } from 'src/app/transcations/loan-transcation/loan-transaction-constant';
import { SaoProductDefinitionsService } from 'src/app/transcations/loan-transcation/sao/sao-product-definition/shared/sao-product-definitions.service';
import { IndividualMemberDetailsModel, MemInstitutionModel, MemberShipGroupDetailsModel } from 'src/app/transcations/loan-transcation/sao/sao-stepper/membership-basic-details/shared/membership-basic-details.model';
import { SaoCommunication } from 'src/app/transcations/loan-transcation/sao/sao-stepper/sao-communication/shared/sao-communication.model';
import { SaoLoanDocument } from 'src/app/transcations/loan-transcation/sao/sao-stepper/sao-loan-documents/shared/sao-loan-document.model';
import { SaoNominee } from 'src/app/transcations/loan-transcation/sao/sao-stepper/sao-nominee/shared/sao-nominee.model';
import { SaoProductDetails } from 'src/app/transcations/loan-transcation/sao/sao-stepper/sao-product-details/shared/sao-product-details.model';
import { SaoLoanApplication, SaoLoanGenealogyTreeModel, SaoLoanGuarantorDetailsModel, SaoLoanInsuranceDetailsModel, SaoLoanLandMortageDetailsModel, SaoOtherLoanDetailsModel } from 'src/app/transcations/loan-transcation/sao/shared/sao-loan-application.model';
import { SaoLoanApplicationService } from 'src/app/transcations/loan-transcation/shared/sao-loans/sao-loan-application.service';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';

@Component({
  selector: 'app-sao-loan-approval',
  templateUrl: './sao-loan-approval.component.html',
  styleUrls: ['./sao-loan-approval.component.css']
})
export class SaoLoanApprovalComponent {
  saoOtherLoansDetailsList: any[] = [];
  saoOtherLoansDetails: any;
  loanGuarantorDetails: any;
  landMortagageDetails: any;
  loansDocuments: any;
  saoLoanDocumentList: any[] = [];
  loanGeneologyTree: any;
  saoLoanGeneologyTreeList: any[] = [];
  responseModel!: Responsemodel;
  id: any;
  msgs: any[] = [];
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  statusList: any[] = [];
  loanGuarantorDetailsList: any[] = [];
  flag: boolean = false;
  
  memberTypeName: any;
  viewSaoLoanApplicatonModel: SaoLoanApplication = new SaoLoanApplication();
  saoOtherLoanDetailsModel: SaoOtherLoanDetailsModel = new SaoOtherLoanDetailsModel();
  saoLoanInsuranceDetailsModel: SaoLoanInsuranceDetailsModel = new SaoLoanInsuranceDetailsModel();
  saoLoanCommunicationModel: SaoCommunication = new SaoCommunication();
  saoLoanDocumentsDetailsModel: SaoLoanDocument = new SaoLoanDocument();
  saoLoanGuarantorDetailsModel: SaoLoanGuarantorDetailsModel = new SaoLoanGuarantorDetailsModel();
  saoLoanNomineeDetailsModel: SaoNominee = new SaoNominee();
  saoLoanGenealogyTreeModel: SaoLoanGenealogyTreeModel = new SaoLoanGenealogyTreeModel();
  individualMemberDetailsModel: IndividualMemberDetailsModel = new IndividualMemberDetailsModel();
  memberShipGroupDetailsModel : MemberShipGroupDetailsModel = new MemberShipGroupDetailsModel();
  memInstitutionModel : MemInstitutionModel = new MemInstitutionModel();
  saoLoanLandMortageDetailsModel: SaoLoanLandMortageDetailsModel = new SaoLoanLandMortageDetailsModel();
  saoProductDetailsModel: SaoProductDetails = new SaoProductDetails();
  admissionNumber: any;
  addressOne: any;
  addressTwo: any;
  kycGridList: any[] = [];
  groupPrmoters : any[] = [];
  groupPrmotersList: any[]=[];
  institionPromotersList: any[]=[];
  jointHoldersFlag: boolean = false;
  jointHolderDetailsList: any[] = [];
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  membreIndividualFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  loanId: any;
  isKycApproved : any;
  columns: any[] = [];
  saoLoanLandMortageDetailsDTOList: any[] = [];
  memberTypeId: any;
  isShowSubmit: boolean =applicationConstants.FALSE;
  uploadFileData: any;
  isDisableSubmit: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any;
  preveiwFalg:  boolean = false;
  editOpt: Boolean = true;
  constructor(private router: Router, private activateRoute: ActivatedRoute,private commonStatusService:CommonCategoryService,
    private encryptService: EncryptDecryptService, private saoLoanApplicationService: SaoLoanApplicationService, private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private encryptDecryptService: EncryptDecryptService,
    private saoProductDefinitionsService: SaoProductDefinitionsService,private translate: TranslateService,private fileUploadService :FileUploadService,) {
    this.saoOtherLoansDetails = [
      { field: 'bankName', header: 'BANK NAME' },
      { field: 'acNo', header: 'ACCOUNT NUMBER' },
      { field: 'loanAmount', header: 'LOAN AMOUNT' },
      { field: 'Outstanding Amount()', header: 'OUTSTANDING AMOUNT' },
      { field: 'Loan Date', header: 'LOAN DATE' },
      { field: 'dueDate', header: 'LOAN DUE DATE' },

    ];
    this.loanGuarantorDetails = [
      //{ field: 'admissionNo', header: 'ADMISSION NUMBER' },
      { field: 'name', header: 'NAME' },
     // { field: 'fatherSpouseName', header: 'FATHER/SPOUSE NAME' },
      { field: 'aadharNumber', header: 'AADHAR NUMBER' },
     // { field: 'panNo', header: 'PAN NUMBER' },
      { field: 'mobileNumber', header: 'MOBILE NUMBER' },
      { field: 'email', header: 'EMAIL' },
     // { field: 'occupation', header: 'OCCUPATION' },
     // { field: 'income', header: 'INCOME' },
     // { field: 'Address', header: 'ADDRESS' },
     // { field: 'Upload', header: 'UPLOAD' },
    ];
    this.loansDocuments = [
      { field: 'documentType', header: 'DOCUMENT TYPE' },
      { field: 'documentNo', header: 'DOCUMENT NO' },
      { field: 'filePath', header: 'FILE PATH' },
      { field: 'remarks', header: 'REMARKS' },
    ];
    this.loanGeneologyTree = [
      { field: 'name', header: 'NAME' },
      { field: 'relationWithApplicantName', header: 'RELATION WITH APPLICANT' },
      { field: 'remarks', header: 'REMARKS' },
    ];
    this.landMortagageDetails = [
      // { field: 'villageName', header: 'Village' },
      { field: 'passbookNumber', header: 'Passbook No' },
      { field: 'khataNumber', header: 'Khata Book No' },
      { field: 'surveyNumber', header: 'Survey No.' },
      { field: 'totalLandInUnits', header: 'Total Land In Units' },
      { field: 'totalLandInSubUnits', header: 'Total Land In Sub Units' },
      { field: 'landValuePerUnit', header: 'Land Value Per Unit' },
      // { field: 'totalLandValue', header: ' Total Land Value' },
      { field: 'mortgageLandInUnits', header: 'Mortgage Land In Units' },
      { field: 'mortgageLandInSubUnits', header: 'Mortgage Land In SubUnits' },
      { field: 'mortgageLandValuePerUnit', header: 'Mortgage Land Value Per Unit' },
      // { field: 'totalMortgageLandValue', header: 'Total Mortgage Land Value' },
      { field: 'mortgageDeedNumber', header: ' Mortgage Deed Number' },
      // { field: 'mortgageDeedDateVal', header: 'Mortgage Deed Date' },
      // { field: 'landOwnershipName', header: 'Land Ownership' },
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
      { field: 'startDate', header: 'start date' },
    ];
    this.columns = [
      { field: 'surname', header: 'SURNAME' },
      { field: 'name', header: 'NAME' },
      { field: 'operatorTypeName', header: 'operation Type Name' },
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender Name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile Number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
    ];
  }
  ngOnInit() {
    this.getAllStatusList();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['editOpt'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        let idEdit = this.encryptDecryptService.decrypt(params['editOpt']);
        this.loanId = Number(id);

        if (idEdit == "1"){
          this.preveiwFalg = true;
          this.editOpt = true;
        }else if(idEdit == "2"){
          this.editOpt = false;
          this.preveiwFalg = true;
        }else{
          this.preveiwFalg = false;
          this.editOpt = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        this.getPreviewDetails();
      } 
    })

  }

  getPreviewDetails(){
    this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(this.loanId).subscribe(res => {
      this.responseModel = res;
      this.viewSaoLoanApplicatonModel = this.responseModel.data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if(this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined){
        this.admissionNumber = this.responseModel.data[0].admissionNo;
        this.id = this.responseModel.data[0].id;
        this.memberTypeName = this.responseModel.data[0].memberTypeName;
        this.memberTypeId = this.responseModel.data[0].memberTypeId;
      }
      }
     
      this.commonComponent.stopSpinner();
      if (this.viewSaoLoanApplicatonModel.applicationDateVal != undefined && this.viewSaoLoanApplicatonModel.applicationDateVal != null)
        this.viewSaoLoanApplicatonModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.viewSaoLoanApplicatonModel.applicationDateVal));

      if (this.viewSaoLoanApplicatonModel.loanDueDateVal != undefined && this.viewSaoLoanApplicatonModel.loanDueDateVal != null)
        this.viewSaoLoanApplicatonModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.viewSaoLoanApplicatonModel.loanDueDateVal));

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.viewSaoLoanApplicatonModel = this.responseModel.data[0];

        this.getProductDetailsById(this.viewSaoLoanApplicatonModel.saoProductId);

        if (null != this.viewSaoLoanApplicatonModel.applicationDate)
          this.viewSaoLoanApplicatonModel.applicationDateVal = this.datePipe.transform(this.viewSaoLoanApplicatonModel.applicationDate, this.orgnizationSetting.datePipe);

        if (null != this.viewSaoLoanApplicatonModel.loanDueDate)
          this.viewSaoLoanApplicatonModel.loanDueDateVal = this.datePipe.transform(this.viewSaoLoanApplicatonModel.loanDueDate, this.orgnizationSetting.datePipe);

        if (this.viewSaoLoanApplicatonModel.saoLoanLandMortageDetailsDTOList!= null && this.viewSaoLoanApplicatonModel.saoLoanLandMortageDetailsDTOList!= undefined) {
            this.saoLoanLandMortageDetailsDTOList = this.viewSaoLoanApplicatonModel.saoLoanLandMortageDetailsDTOList;
            this.saoLoanLandMortageDetailsDTOList = this.viewSaoLoanApplicatonModel.saoLoanLandMortageDetailsDTOList.map((land: any) => {
              if (land != null && land != undefined && land.documentPath != null && land.documentPath != undefined) {
                land.requestedDocPathMultipartFileList = this.fileUploadService.getFile(land.documentPath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + land.documentPath);
              }
               return land
            });
        }

        if (this.viewSaoLoanApplicatonModel.saoLoanInsuranceDetailsDTO != null && this.viewSaoLoanApplicatonModel.saoLoanInsuranceDetailsDTO != undefined) {
          this.saoLoanInsuranceDetailsModel = this.viewSaoLoanApplicatonModel.saoLoanInsuranceDetailsDTO;
        }

        if (this.viewSaoLoanApplicatonModel.saoOtherLoanDetailsDTOList != null && this.viewSaoLoanApplicatonModel.saoOtherLoanDetailsDTOList.length > 0) {
          this.saoOtherLoansDetailsList = this.viewSaoLoanApplicatonModel.saoOtherLoanDetailsDTOList;
        }

        if (this.viewSaoLoanApplicatonModel.saoLoanGuarantorDetailsDTOList != null && this.viewSaoLoanApplicatonModel.saoLoanGuarantorDetailsDTOList.length > 0) {
          this.loanGuarantorDetailsList = this.viewSaoLoanApplicatonModel.saoLoanGuarantorDetailsDTOList;
        }

        if (this.viewSaoLoanApplicatonModel.saoLoanDocumentsDetailsDTOList != null && this.viewSaoLoanApplicatonModel.saoLoanDocumentsDetailsDTOList.length > 0) {
          this.saoLoanDocumentList = this.viewSaoLoanApplicatonModel.saoLoanDocumentsDetailsDTOList;
          for (let document of this.saoLoanDocumentList) {
            if(document.filePath != null && document.filePath != undefined){
              document.multipartFileList  = this.fileUploadService.getFile(document.filePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
            }
          } 
        }

        if (this.viewSaoLoanApplicatonModel.saoLoanGenealogyTreeDTOList != null && this.viewSaoLoanApplicatonModel.saoLoanGenealogyTreeDTOList.length > 0) {
          this.saoLoanGeneologyTreeList = this.viewSaoLoanApplicatonModel.saoLoanGenealogyTreeDTOList;
        }
        if (this.viewSaoLoanApplicatonModel.saoLoanNomineeDetailsDTO != null && this.viewSaoLoanApplicatonModel.saoLoanNomineeDetailsDTO != undefined) {
          this.saoLoanNomineeDetailsModel = this.viewSaoLoanApplicatonModel.saoLoanNomineeDetailsDTO;

            if(this.saoLoanNomineeDetailsModel.nomineeFilePath != null && this.saoLoanNomineeDetailsModel.nomineeFilePath != undefined){
              this.saoLoanNomineeDetailsModel.nomineeFilePathList =  this.fileUploadService.getFile(this.saoLoanNomineeDetailsModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoLoanNomineeDetailsModel.nomineeFilePath);
            }
        }

        if (this.viewSaoLoanApplicatonModel.individualMemberDetailsDTO != null && this.viewSaoLoanApplicatonModel.individualMemberDetailsDTO != undefined) {
          this.individualMemberDetailsModel = this.viewSaoLoanApplicatonModel.individualMemberDetailsDTO;
          if (this.individualMemberDetailsModel.admissionDate != null && this.individualMemberDetailsModel.admissionDate != undefined) {
            this.individualMemberDetailsModel.admissionDateVal = this.datePipe.transform(this.individualMemberDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.individualMemberDetailsModel.dob != null && this.individualMemberDetailsModel.dob != undefined) {
            this.individualMemberDetailsModel.dobVal = this.datePipe.transform(this.individualMemberDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.individualMemberDetailsModel.photoCopyPath != null && this.individualMemberDetailsModel.photoCopyPath != undefined) {
            this.individualMemberDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.individualMemberDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.individualMemberDetailsModel.photoCopyPath  );
          }
          else{
            this.photoCopyFlag = false;
          }
          if (this.individualMemberDetailsModel.signatureCopyPath != null && this.individualMemberDetailsModel.signatureCopyPath != undefined) {
              this.individualMemberDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.individualMemberDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.individualMemberDetailsModel.signatureCopyPath  );
          }
          else{
            this.signatureCopyFlag = false;
          }
          
          if (this.individualMemberDetailsModel.isKycApproved != null && this.individualMemberDetailsModel.isKycApproved != undefined && this.individualMemberDetailsModel.isKycApproved) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
        }
        if (this.viewSaoLoanApplicatonModel.memberGroupDetailsDTO != null && this.viewSaoLoanApplicatonModel.memberGroupDetailsDTO != undefined) {
          this.memberShipGroupDetailsModel = this.viewSaoLoanApplicatonModel.memberGroupDetailsDTO;
          
          if (this.memberShipGroupDetailsModel.groupPromoterList != null && this.memberShipGroupDetailsModel.groupPromoterList != undefined && this.memberShipGroupDetailsModel.groupPromoterList.length > 0) {
            this.groupPrmotersList=this.memberShipGroupDetailsModel.groupPromoterList ;
          }
          if (this.memberShipGroupDetailsModel.registrationDate != null && this.memberShipGroupDetailsModel.registrationDate != undefined) {
            this.memberShipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberShipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberShipGroupDetailsModel.admissionDate != null && this.memberShipGroupDetailsModel.admissionDate != undefined) {
            this.memberShipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberShipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberShipGroupDetailsModel.isKycApproved != null && this.memberShipGroupDetailsModel.isKycApproved != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
        }

        if (this.viewSaoLoanApplicatonModel.memberInstitutionDTO != null && this.viewSaoLoanApplicatonModel.memberInstitutionDTO != undefined) {
          this.memInstitutionModel = this.viewSaoLoanApplicatonModel.memberInstitutionDTO;
          
          if (this.memInstitutionModel.registrationDate != null && this.memInstitutionModel.registrationDate != undefined) {
            this.memInstitutionModel.registrationDateVal = this.datePipe.transform(this.memInstitutionModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.memInstitutionModel.admissionDate != null && this.memInstitutionModel.admissionDate != undefined) {
            this.memInstitutionModel.admissionDateVal = this.datePipe.transform(this.memInstitutionModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.memInstitutionModel.institutionPromoterDetailsDTOList != null && this.memInstitutionModel.institutionPromoterDetailsDTOList != undefined && this.memInstitutionModel.institutionPromoterDetailsDTOList.length > 0) {
            this.institionPromotersList=this.memInstitutionModel.institutionPromoterDetailsDTOList ;
          }
          if (this.memInstitutionModel.isKycCompleted != null && this.memInstitutionModel.isKycCompleted != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
        }

        if(this.viewSaoLoanApplicatonModel.saoLoanKycDetailsDTOList != null && this.viewSaoLoanApplicatonModel.saoLoanKycDetailsDTOList != undefined){
          this.kycGridList = this.viewSaoLoanApplicatonModel.saoLoanKycDetailsDTOList;
          for (let kyc of this.kycGridList) {
            if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
              if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);

              }
            }  
          }
        }

        if(this.viewSaoLoanApplicatonModel.saoLoanCommunicationDTO != null && this.viewSaoLoanApplicatonModel.saoLoanCommunicationDTO != undefined)
          this.saoLoanCommunicationModel= this.viewSaoLoanApplicatonModel.saoLoanCommunicationDTO;
        //this.communicationDetailsFormateToAddressDetails( this.saoLoanCommunicationModel);
        if(this.viewSaoLoanApplicatonModel.saoLoanJointMemsDetailsDTOList != null && this.viewSaoLoanApplicatonModel.saoLoanJointMemsDetailsDTOList != undefined){
          this.jointHoldersFlag = true;
          this.jointHolderDetailsList = this.viewSaoLoanApplicatonModel.saoLoanJointMemsDetailsDTOList;
          if(this.jointHolderDetailsList != null && this.jointHolderDetailsList != undefined){
            this.jointHolderDetailsList = this.jointHolderDetailsList;
            for(let joint of this.jointHolderDetailsList){
              joint.admissionDateVal = this.datePipe.transform(this.jointHolderDetailsList[0].admissionDate, this.orgnizationSetting.datePipe);
            }  
          }
        }

        if(this.viewSaoLoanApplicatonModel.applicationPath != null && this.viewSaoLoanApplicatonModel.applicationPath != undefined){
          this.viewSaoLoanApplicatonModel.multipartFileList = this.fileUploadService.getFile(this.viewSaoLoanApplicatonModel.applicationPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.viewSaoLoanApplicatonModel.applicationPath);
          this.isDisableSubmit = false;
        }
        else{
          this.isDisableSubmit = true;
        }

      }

    });
  }
  
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.viewSaoLoanApplicatonModel.multipartFileList = [];
    this.multipleFilesList = [];
    this.viewSaoLoanApplicatonModel.filesDTO = null; // Initialize as a single object
    this.viewSaoLoanApplicatonModel.applicationPath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "SAO_LOAN_DETAILS_" + this.loanId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.viewSaoLoanApplicatonModel.filesDTO = filesDTO;
      this.viewSaoLoanApplicatonModel.applicationPath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
  fileRemoveEvent() {
    if (this.viewSaoLoanApplicatonModel.filesDTO != null && this.viewSaoLoanApplicatonModel.filesDTO != undefined) {
        let removeFileIndex = this.viewSaoLoanApplicatonModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.viewSaoLoanApplicatonModel.applicationPath);
        this.viewSaoLoanApplicatonModel.filesDTO.splice(removeFileIndex, 1);
        // this.viewSaoLoanApplicatonModel.signedCopyPath = null;
        this.isDisableSubmit = true;
      }
    }
  getProductDetailsById(id: any) {
    this.saoProductDefinitionsService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.saoProductDetailsModel = this.responseModel.data[0];

        if (this.saoProductDetailsModel.minLoanPeriod != undefined && this.saoProductDetailsModel.minLoanPeriod != null)
          this.viewSaoLoanApplicatonModel.minLoanPeriod = this.saoProductDetailsModel.minLoanPeriod;

        if (this.saoProductDetailsModel.maxLoanPeriod != undefined && this.saoProductDetailsModel.maxLoanPeriod != null )
          this.viewSaoLoanApplicatonModel.maxLoanPeriod = this.saoProductDetailsModel.maxLoanPeriod;

        if (this.saoProductDetailsModel.interestPostingFrequencyName != undefined && this.saoProductDetailsModel.interestPostingFrequencyName != null)
          this.viewSaoLoanApplicatonModel.repaymentFrequencyName = this.saoProductDetailsModel.interestPostingFrequencyName;

        if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != null && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList != undefined) {
          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest != null)
            this.viewSaoLoanApplicatonModel.penalInterest = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].penalInterest;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod != null)
            this.viewSaoLoanApplicatonModel.iod = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].iod;

          if (this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != undefined && this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi != null)
            this.viewSaoLoanApplicatonModel.effectiveRoi = this.saoProductDetailsModel.saoInterestPolicyConfigDtoList[0].roi;
        }
        
      }
    });
  }
  back() {
    this.router.navigate([approvaltransactionsconstant.SAO_LOAN_APPROVAL_DETAILS]);
  }
  submit() {
    this.msgs = [];
    this.viewSaoLoanApplicatonModel.accountStatusName =null;
    this.viewSaoLoanApplicatonModel.loanApprovedDateVal = new Date();
    if (this.viewSaoLoanApplicatonModel.loanApprovedDateVal != undefined && this.viewSaoLoanApplicatonModel.loanApprovedDateVal != null)
      this.viewSaoLoanApplicatonModel.loanApprovedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.viewSaoLoanApplicatonModel.loanApprovedDateVal));

    // this.saoLoanApplicationService.saoLoanApplicationApproval(this.viewSaoLoanApplicatonModel).subscribe(response => {
    this.saoLoanApplicationService.updateSaoLoanApplication(this.viewSaoLoanApplicatonModel).subscribe(response => {
      this.responseModel = response;
      this.viewSaoLoanApplicatonModel =response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([approvaltransactionsconstant.SAO_LOAN_APPROVAL_DETAILS]);
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
  applicationEdit(rowData: any) {
    if(rowData.operationTypeName == "joint"){
    this.flag = true;
  }
  else {
    this.flag = false;
  }
    this.router.navigate([Loantransactionconstant.SAO_PRODUCT_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id)} });
  }

  onClick(){
    this.institutionPromoterFlag = true;
  }
  
  close(){
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.membreIndividualFlag = false;
  }

  onClickMemberIndividualMoreDetails(){
    this.membreIndividualFlag = true;
  }
  onClickOfGroupPromotes(){
    this.groupPromotersPopUpFlag = true;
  }

  communicationEdit(rowData: any) {
    this.router.navigate([Loantransactionconstant.SAO_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  kycEdit(rowData: any) {
    this.router.navigate([Loantransactionconstant.MEMBERSHIP_BASIC_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  nomineeEdit(rowData: any) {
    this.router.navigate([Loantransactionconstant.SAO_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  loanDocumentEdit(rowData: any){
    this.router.navigate([Loantransactionconstant.SAO_LOAN_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  loanGurantorEdit(rowData: any){
    this.router.navigate([Loantransactionconstant.SAO_LOAN_GUARANTOR], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  loanMortagageEdit(rowData: any){
    this.router.navigate([Loantransactionconstant.SAO_LOAN_MORTAGAGE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  loanGenologyEdit(rowData: any){
    this.router.navigate([Loantransactionconstant.SAO_LOAN_GENEALOGY_TREE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  jointHolderEdit(rowData: any){
    this.router.navigate([Loantransactionconstant.SAO_LOAN_JOINT_MEM_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  

  /**
   * @implement Image Zoom POp up
   * @author akhila.m
   */
  onClickMemberPhotoCopy(){
    this.memberPhotoCopyZoom = true;
  }
   /**
   * @author akhila.m
   * @implement onclose popup
   */
   closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }
  /**
   * @author akhila.m
   * @implements close photo dialogue
   */
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }
  getAccountStatus(){
    if(this.viewSaoLoanApplicatonModel.accountStatus != null && this.viewSaoLoanApplicatonModel.accountStatus != undefined){
       this.isDisableSubmit = false;
    }
    else{
      this.isDisableSubmit = true;
    }
  }
  getAllStatusList() {
    this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
            this.statusList = this.responseModel.data;
            this.statusList = this.responseModel.data.filter((obj: any) => obj != null && obj.name != CommonStatusData.CREATED && obj.name != CommonStatusData.SUBMISSION_FOR_APPROVAL).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
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
    },
    error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

}
