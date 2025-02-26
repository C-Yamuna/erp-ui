import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SiLoanKyc } from '../../../shared/si-loans/si-loan-kyc.model';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiLoanKycService } from '../../../shared/si-loans/si-loan-kyc.service';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { DOCUMENT_TYPES, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-si-kyc',
  templateUrl: './si-kyc.component.html',
  styleUrls: ['./si-kyc.component.css']
})
export class SiKycComponent {
  kycForm: any;
  kyc: any;
  checked: any;
  loanAccId: any;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  minBalence: any;
  accountOpeningDateVal: any;
  documentTypeList: any[] = [];

  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanKycModel: SiLoanKyc = new SiLoanKyc();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();

  fileName: any;
  kycModelList: any[] = [];
  adhaarFilesList: any[] = [];
  signFilesList: any[] = [];
  panFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  uploadFlag: boolean = true;
  submitFlag: boolean = false;
  columns: any[] = [];

  documentsData: any[] = [];
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  docFilesList: any[] = [];
  buttonDisabled: boolean = false;
  noKYCData: boolean = false;
  isEdit: any;

  filesList: any[] = [];
  orgnizationSetting: any;
  exerciseFileList: any[] = [];
  lastDot = applicationConstants.LAST_DOT;
  memberId: any;
  kycListByMemberId: any[] = [];
  typeFlag: boolean = false;
  addKycButton: boolean = false;

  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  saveAndNextEnable : boolean = false;

  @ViewChild('cv', { static: false })
  private cv!: Table;
  editIndex: any;
  afterEditCancleFalg: boolean = false;

  editButtonDisable: boolean = false;

  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  admissionNumber: any;
  isMemberCreation: any;
  memberTypeName: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  memberTypeId: any;
  createLoan: any;
  displayDialog: boolean = false;
  deleteId: any;
  isSaveAndNextDisable: boolean = true;
  requiredDocumentsNamesText: any;
  mandatoryDoxsTextShow: boolean = false;
  individualFlag : boolean = false;
  groupFlag : boolean = false;
  institutionFlag : boolean = false;
  promotersList: any [] =[];
  isPanNumber: boolean = false;
  buttonDisabledForKyc :boolean = false;
  isNotmemberkycForm:any;

  constructor(private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
    private siLoanApplicationService: SiLoanApplicationService,
    private siLoanKycService: SiLoanKycService, private membershipServiceService: MembershipServiceService,
    private fileUploadService: FileUploadService) {

    this.kycForm = this.formBuilder.group({
      'documentNumber': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),
      'kycDocumentTypeName': new FormControl('', Validators.required),
      'nameAsPerDocument': new FormControl('', Validators.required),
      'fileUpload': new FormControl(''),
      'promoter': new FormControl('')

      
    });
    this.kycForm = this.formBuilder.group({
      'documentNumber': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),
      'kycDocumentTypeName': new FormControl({ value: '', disabled: true }, Validators.required),
      'nameAsPerDocument': new FormControl('', Validators.required),
      'fileUpload': new FormControl(''),
      'promoter': new FormControl({ value: '', disabled: true }),

      
    });

    
  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.columns = [
      { field: 'kycDocumentTypeName', header: 'MEMBERSHIP.KYC_DOCUMENT_NAME' },
      { field: 'documentNumber', header: 'MEMBERSHIP.KYC_DOCUMENT_NUMBER' },
      { field: 'docPath', header: 'MEMBERSHIP.KYC_DOCUMENT' }
    ];
    this.getAllKycTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        let rowId = this.encryptDecryptService.decrypt(params['id']);
        this.loanAccId = Number(rowId);
        this.isEdit = true;
        this.getSILoanApplicationWithKycDetailsByLoanAccId(this.loanAccId);
      }
      else if (params['createLoanFlag'] != undefined) {
        this.createLoan = params['createLoanFlag'] != undefined;
        this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
        if (this.isMemberCreation)
          this.addKyc();
      }
      else {
        this.isEdit = false;
        this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
        this.updateData();
      }
      // if (!this.isMemberCreation) {
      this.siLoanKycService.currentStep.subscribe((data: any) => {
        this.kycModelList = [];
        this.promotersList =[];
        this.memberTypeName = null;
        if (data != undefined && data != null) {
          // this.buttonDisabled = data.isDisable
          if (data.data != null && data.data != undefined) {

            if (data.data.individualMemberDetailsDTO != undefined && data.data.individualMemberDetailsDTO.memberTypeName != undefined
              && data.data.individualMemberDetailsDTO.memberTypeName === MemberShipTypesData.INDIVIDUAL) {
                this.individualFlag = true;

              this.membershipBasicRequiredDetailsModel = data.data.individualMemberDetailsDTO;
              this.memberTypeName = data.data.individualMemberDetailsDTO.memberTypeName;
              this.admissionNumber = data.data.individualMemberDetailsDTO.admissionNumber;
              if (data.data.individualMemberDetailsDTO.memberShipKycDetailsDTOList != null) {
                this.kycModelList = data.data.individualMemberDetailsDTO.memberShipKycDetailsDTOList;
                if (this.kycModelList != null && this.kycModelList != undefined) {
                  this.editDocumentOfKycFalg = true;
                  for (let kyc of this.kycModelList) {
                    if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                  }
                }
              }
            }

            if (data.data.memberGroupDetailsDTO != undefined && data.data.memberGroupDetailsDTO.memberTypeName != undefined
              && data.data.memberGroupDetailsDTO.memberTypeName === MemberShipTypesData.GROUP) {
                this.individualFlag = false;

              this.memberGroupDetailsModel = data.data.memberGroupDetailsDTO;
              this.memberTypeName = data.data.memberGroupDetailsDTO.memberTypeName;
              this.admissionNumber = data.data.memberGroupDetailsDTO.admissionNumber;
              if (data.data.memberGroupDetailsDTO.groupKycList != null) {

                if(data.data.memberGroupDetailsDTO.groupPromoterList != null && data.data.memberGroupDetailsDTO.groupPromoterList != undefined && data.data.memberGroupDetailsDTO.groupPromoterList.length >0){
                  this.promotersList =data.data.memberGroupDetailsDTO.groupPromoterList.map((promoter: any) => {
                    return { label: promoter.name+" "+promoter.surname +"-"+promoter.aadharNumber, value: promoter.id }
                  });
                  data.data.memberGroupDetailsDTO.groupKycList.filter((obj:any) => obj != null).map((obj:any) =>{
                    if(this.promotersList != null && this.promotersList != undefined && this.promotersList.length > 0){
                      let filteredObj = this.promotersList.find((data: any) => null != data && obj.promoterId != null && data.value == obj.promoterId);
                      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
                        obj.promoterName = filteredObj.label;
                      }
                    }
                  });
                }
                this.kycModelList = data.data.memberGroupDetailsDTO.groupKycList;
                if (this.kycModelList != null && this.kycModelList != undefined) {
                  this.editDocumentOfKycFalg = true;
                  for (let kyc of this.kycModelList) {
                    if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                  }
                }
              }
            }

            if (data.data.memberInstitutionDTO != undefined && data.data.memberInstitutionDTO.memberTypeName != undefined
              && data.data.memberInstitutionDTO.memberTypeName === MemberShipTypesData.INSTITUTION) {
                this.individualFlag = false;

              this.membershipInstitutionDetailsModel = data.data.memberInstitutionDTO;
              this.memberTypeName = data.data.memberInstitutionDTO.memberTypeName;
              this.admissionNumber = data.data.memberInstitutionDTO.admissionNumber;
              if (data.data.memberInstitutionDTO.institutionKycDetailsDTOList != null) {

                if(data.data.memberInstitutionDTO.institutionPrmotersList != null && data.data.memberInstitutionDTO.institutionPrmotersList != undefined && data.data.memberInstitutionDTO.institutionPrmotersList.length >0){
                  this.promotersList =data.data.memberInstitutionDTO.institutionPrmotersList.map((promoter: any) => {
                    return { label: promoter.name+" "+promoter.surname +"-"+promoter.aadharNumber, value: promoter.id }
                  });
                  data.data.memberInstitutionDTO.institutionKycDetailsDTOList.filter((obj:any) => obj != null).map((obj:any) =>{
                    if(this.promotersList != null && this.promotersList != undefined && this.promotersList.length > 0){
                      let filteredObj = this.promotersList.find((data: any) => null != data && obj.promoterId != null && data.value == obj.promoterId);
                      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
                        obj.promoterName = filteredObj.label;
                      }
                    }
                  });
                }
                this.kycModelList = data.data.memberInstitutionDTO.institutionKycDetailsDTOList;
                if (this.kycModelList != null && this.kycModelList != undefined) {
                  this.editDocumentOfKycFalg = true;
                  for (let kyc of this.kycModelList) {
                    if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                  }
                }
              }
            }
          }
        }
        this.updateData();
      });
      // }
    });
    this.updateFieldState();
    this.buttonDisabled = false;
    this.kycForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });
  }

  //update save
  save() {
    this.updateData();
  }

   /**
     * @implements get all kyc types from masters
     * @author k.yamuna
     */
  getAllKycTypes() {
    this.siLoanKycService.getAllKYCTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.name, value: count.id, isMandatory: count.isMandatory };
          });
        let filteredObj = this.documentNameList.find((data: any) =>
          data && this.siLoanKycModel.kycDocumentTypeId != null && data.value == this.siLoanKycModel.kycDocumentTypeId
        );
        if (filteredObj) {
          this.siLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
        let mandatoryDocs = this.documentNameList.filter(doc => doc.isMandatory).map(doc => doc.label); // No quotes here
        if (mandatoryDocs.length > 0) {
          this.requiredDocumentsNamesText = `Please upload the mandatory KYC documents: "${mandatoryDocs.join(", ")}"`;
          this.mandatoryDoxsTextShow = true;
        } else {
          this.requiredDocumentsNamesText = "";
          this.mandatoryDoxsTextShow = false;
        }
      }
    });
  }

   /**
     * @implements get all SI Loan application details for kyc list based on applicationId
     * @author k.yamuna
     */

  getSILoanApplicationWithKycDetailsByLoanAccId(loanAccId: any) {
    this.siLoanKycService.getSILoanApplicationWithKycDetailsByLoanAccId(loanAccId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.data.length > 0) {
            this.siLoanApplicationModel = this.responseModel.data[0];

            if (this.siLoanApplicationModel.admissionNo != null && this.siLoanApplicationModel.admissionNo != undefined)
              this.admissionNumber = this.siLoanApplicationModel.admissionNo;

            if (this.siLoanApplicationModel.memberTypeName != null && this.siLoanApplicationModel.memberTypeName != undefined)
              this.memberTypeName = this.siLoanApplicationModel.memberTypeName;
           

            if (this.siLoanApplicationModel.memberTypeId != null && this.siLoanApplicationModel.memberTypeId != undefined)
              this.memberTypeId = this.siLoanApplicationModel.memberTypeId;

            if (this.siLoanApplicationModel.individualMemberDetailsDTO != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO != null) {
              this.membershipBasicRequiredDetailsModel = this.siLoanApplicationModel.individualMemberDetailsDTO;

              if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

              if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

              if (this.siLoanApplicationModel.individualMemberDetailsDTO.isNewMember != undefined
                && this.siLoanApplicationModel.individualMemberDetailsDTO.isNewMember != null)
                this.isMemberCreation = this.siLoanApplicationModel.individualMemberDetailsDTO.isNewMember;

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
            this.membershipDataFromSbModule();
            if (this.siLoanApplicationModel.siLoanKycDetailsDTOList != undefined && this.siLoanApplicationModel.siLoanKycDetailsDTOList != null) {
              this.kycModelList = this.siLoanApplicationModel.siLoanKycDetailsDTOList;

              if (this.kycModelList != null && this.kycModelList != undefined) {
                this.editDocumentOfKycFalg = true;
                for (let kyc of this.kycModelList) {
                  if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  }
                }
                if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length >0) {
                  let i = 0;
                  for (let doc of this.documentNameList) {
                    if (i == 0)
                      this.requiredDocumentsNamesText = "Please Upload Mandatory KYC Documents ("
                    if (doc.isMandatory) {
                      i = i + 1;
                      this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + "'" + doc.label + "'";
                    }
                  }
                  this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + ")";
                  if (i > 0) {
                    this.mandatoryDoxsTextShow = true;
                  }
                }
              }
              this.buttonDisabled = applicationConstants.FALSE;
              this.noKYCData = false;
            } else {
              this.buttonDisabled = applicationConstants.TRUE;
              this.noKYCData = true;
              if (this.isMemberCreation)
                this.addKyc();
            }
            this.updateData();
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

  /**
     * @implements update data
     * @author k.yamuna
     */
  updateData() {
    if(this.isMemberCreation){
      this.siLoanKycModel.siLoanApplicationId = this.loanAccId;
      this.siLoanKycModel.admissionNumber = this.admissionNumber;
      this.siLoanKycModel.memberTypeName = this.memberTypeName;
      this.siLoanKycModel.memberType = this.memberTypeId;
      this.siLoanKycModel.memberId = this.memberId;
      //for manadatory KYC Documents check
      this.saveAndNextEnable = false;
      if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
        let documentNameList = this.documentNameList.filter((obj: any) => obj.isMandatory);
        if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0 && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) {
          if (this.siLoanKycModel.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
            const missingItems = this.kycModelList.filter(document => !documentNameList.some(mandatoryDocument => document.kycDocumentTypeId === mandatoryDocument.value));
            if ((documentNameList.length != this.kycModelList.length - missingItems.length) || this.buttonDisabled) {
              this.saveAndNextEnable = true;
            }
          }
          else {//group institution promoter kyc mandatory uploads check
            let i = 0;
            this.promotersList.forEach((promoter: any) => {
              let KycList = this.kycModelList.filter((obj: any) => obj.promoterId === promoter.value);
  
              if (this.documentNameList?.length) {
                // Filter only mandatory documents
                let mandatoryDocs = this.documentNameList.filter((doc: any) => doc.isMandatory);
  
                if (KycList.length > 0 && mandatoryDocs.length > 0) {
                  // Check if all mandatory documents are present in KycList
                  const missingItems = mandatoryDocs.filter(
                    (mandatoryDoc) => !KycList.some((kyc) => kyc.kycDocumentTypeId === mandatoryDoc.value)
                  );
  
                  // disable save button if any mandatory document is missing
                  if (missingItems.length > 0 || this.buttonDisabled) {
                    this.saveAndNextEnable = true;
                  }
                } else if ((KycList.length === 0 && mandatoryDocs.length > 0) || this.buttonDisabled) {
                  // If no KYC documents exist but mandatory ones are required
                  this.saveAndNextEnable = true;
                }
              }
            });
          }
        }
        else if (((this.kycModelList == null || this.kycModelList == undefined || this.kycModelList.length === 0) && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) || this.buttonDisabled) {
          this.saveAndNextEnable = true;
        }
      }
      this.siLoanApplicationService.changeData({
        formValid: !this.kycForm.valid ? true : false,
        data: this.siLoanApplicationModel,
        // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
        isDisable: this.saveAndNextEnable,
        stepperIndex: 1,
      });
    }
    else{
      this.siLoanKycModel.siLoanApplicationId = this.loanAccId;
      this.siLoanKycModel.admissionNumber = this.admissionNumber;
      this.siLoanKycModel.memberTypeName = this.memberTypeName;
      this.siLoanKycModel.memberType = this.memberTypeId;
      this.siLoanKycModel.memberId = this.memberId;
      if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
       
      this.siLoanApplicationModel.memberTypeName = this.memberTypeName;
        if(!this.buttonDisabled ){
          this.saveAndNextEnable = false;
        }
        }
        else{
          this.saveAndNextEnable = true;
        }
      }
      this.siLoanApplicationService.changeData({
        formValid: !this.kycForm.valid ? true : false ,
        data: this.siLoanApplicationModel,
        isDisable: this.saveAndNextEnable,
        stepperIndex: 1,
      });
    }

  /**
     * @implements /image upload and document path save
     * @author k.yamuna
     */
   imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.siLoanKycModel.multipartFileList = [];
    this.siLoanKycModel.filesDTOList = [];
    this.siLoanKycModel.kycFilePath = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.siLoanKycModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.siLoanKycModel.filesDTOList[0].fileName = "SI_LOAN_KYC_" + this.loanAccId + "_" + timeStamp + "_" + file.name;
        this.siLoanKycModel.kycFilePath = "SI_LOAN_KYC_" + this.loanAccId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        this.isFileUploaded = applicationConstants.TRUE;
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
  /**
     * @implements delete kyc details 
     * @author k.yamuna
     */
  deletDilogBox(rowData: any) {
    this.displayDialog = true;
    if (rowData.id != null && rowData.id != undefined) {
      this.deleteId = rowData.id;
    }
  }

   /**
     * @implements cancle kyc details 
     * @author k.yamuna
     */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
     * @implements submit method for delete kyc details 
     * @author k.yamuna
     */
  submitDelete() {
    if (this.deleteId != null && this.deleteId != undefined) {
      this.delete(this.deleteId);
    }
    this.displayDialog = false;
  }
   /**
     * @implements getAll kyc details by si loan applicationId 
     * @author k.yamuna
     */
  getAllKycsDetailsSiKycDetails(id: any) {
    this.siLoanKycService.getSILoanKYCDetailsByLoanAccId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
            this.kycModelList = this.responseModel.data;
            if (this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                  if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    
                  }
                }  
                if(this.promotersList != null && this.promotersList != undefined && this.promotersList.length > 0){
                  let filteredObj = this.promotersList.find((data: any) => null != data && kyc.promoterId != null && data.value == kyc.promoterId);
                  if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
                    kyc.promoterName = filteredObj.label;
                  }
                }
              }
              this.buttonDisabled = false;
            }
            this.updateData();
          }
          else{
            this.addDocumentOfKycFalg = true;
            this.buttonDisabled = true;
            this.updateData();
          }
        }
      }
    });
  }

  delete(rowDataId: any) {
    this.siLoanKycService.deleteSILoanKYCDetails(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
          this.getAllKycsDetailsSiKycDetails(this.loanAccId);
          this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      else{
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
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
     * @implements this.method for save kyc details
     * @author k.yamuna
     */
  saveKyc(row: any) {
    this.siLoanKycModel.status = applicationConstants.ACTIVE;
    this.siLoanKycModel.siLoanApplicationId = this.loanAccId;
    this.siLoanKycModel.admissionNumber = this.admissionNumber;
    this.siLoanKycModel.memberTypeName = this.memberTypeName;
    this.siLoanKycModel.memberType = this.memberTypeId;
    this.siLoanKycModel.memberId = this.memberId;
    this.siLoanKycModel.isNewMember = this.isMemberCreation;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.siLoanKycModel.kycDocumentTypeId != null && data.value == this.siLoanKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.siLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.siLoanKycService.addSILoanKYCDetails(this.siLoanKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.siLoanKycModel = this.responseModel.data[0];
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
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getAllKycsDetailsSiKycDetails(this.loanAccId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
    this.addDocumentOfKycFalg = false;
    this.editButtonDisable = false;
  }

    /**
     * @implements this method for get member data from membership module
     * @author k.yamuna
     */
  membershipDataFromSbModule(){
    // this.promotersList =[];
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
    } else if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      if(this.siLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList != null && this.siLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList != undefined && this.siLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList.length >0){
        this.promotersList = this.siLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList.map((promoter: any) => {
          return { label: promoter.name+" "+promoter.surname +"-"+promoter.aadharNumber, value: promoter.id }
        });
        if(this.siLoanApplicationModel.siLoanKycDetailsDTOList != null && this.siLoanApplicationModel.siLoanKycDetailsDTOList.length >0){
          this.siLoanApplicationModel.siLoanKycDetailsDTOList.filter((obj:any) => obj != null).map((obj:any) =>{
            if(this.promotersList != null && this.promotersList != undefined && this.promotersList.length > 0){
              let filteredObj = this.promotersList.find((data: any) => null != data && obj.promoterId != null && data.value == obj.promoterId);
              if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
                obj.promoterName = filteredObj.label;
              }
            }
          });
        }
      }
    } else if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      if(this.siLoanApplicationModel.memberInstitutionDTO.institutionPromoterList != null && this.siLoanApplicationModel.memberInstitutionDTO.institutionPromoterList != undefined && this.siLoanApplicationModel.memberInstitutionDTO.institutionPromoterList.length >0){
        this.promotersList = this.siLoanApplicationModel.memberInstitutionDTO.institutionPromoterList.map((promoter: any) => {
          return { label: promoter.name+" "+promoter.surname+"-"+promoter.aadharNumber, value: promoter.id }
        });
        if(this.siLoanApplicationModel.siLoanKycDetailsDTOList != null && this.siLoanApplicationModel.siLoanKycDetailsDTOList.length >0){
          this.siLoanApplicationModel.siLoanKycDetailsDTOList.filter((obj:any) => obj != null).map((obj:any) =>{
            if(this.promotersList != null && this.promotersList != undefined && this.promotersList.length > 0){
              let filteredObj = this.promotersList.find((data: any) => null != data && obj.promoterId != null && data.value == obj.promoterId);
              if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
                obj.promoterName = filteredObj.label;
              }
            }
          });
        }
      }
    }
    
  }
  
    /**
     * @implements this method for add kyc details
     * @author k.yamuna
     */
  addKyc() {
    this.isFileUploaded = applicationConstants.FALSE;
    this.getAllKycTypes();
    this.kycForm.reset();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.siLoanKycModel = new SiLoanKyc;
    this.updateData();
  }

  //add cancle 
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    if (this.loanAccId != undefined)
      this.getAllKycsDetailsSiKycDetails(this.loanAccId);
    else
      this.memberTypeCheck();

    this.updateData();
  }

  onClick() {
    this.addDocumentOfKycFalg = true;
  }

   //click on edit and populate data on form and save & next disable purpose
   toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.saveAndNextEnable = true;
    if (this.loanAccId != undefined){
      this.getKycById(modelData.id);
    }
    else{
      this.siLoanKycModel = modelData;
      if (this.siLoanKycModel.kycFilePath != undefined) {
        if (this.siLoanKycModel.kycFilePath != null && this.siLoanKycModel.kycFilePath != undefined) {
          this.siLoanKycModel.multipartFileList = this.fileUploadService.getFile(this.siLoanKycModel.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanKycModel.kycFilePath);
          this.isFileUploaded = applicationConstants.TRUE;
        }
      }
    }
    this.updateData();
  }

   /**
     * @implements this method for get kyc details By id
     * @author k.yamuna
     */
  getKycById(id: any) {
    this.siLoanKycService.getSILoanKYCDetails(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanKycModel = this.responseModel.data[0];
              if (this.siLoanKycModel.kycFilePath != undefined) {
                if (this.siLoanKycModel.kycFilePath != null && this.siLoanKycModel.kycFilePath != undefined) {
                  this.siLoanKycModel.multipartFileList = this.fileUploadService.getFile(this.siLoanKycModel.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanKycModel.kycFilePath);
                  this.isFileUploaded = applicationConstants.TRUE;
                }
              }
              if(this.siLoanKycModel.kycDocumentTypeName != null && this.siLoanKycModel.kycDocumentTypeName != undefined){
                this.documentNumberDynamicValidation(this.siLoanKycModel.kycDocumentTypeName );
              }
            }
          }
        }
      }
    });
  }

  //edit cancle
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    if (this.loanAccId != undefined)
      this.getAllKycsDetailsSiKycDetails(this.loanAccId);
    else
      this.memberTypeCheck()

    this.updateData();
  }
  
/**
     * @implements this method for edit kyc details 
     * @author k.yamuna
     */
  editsave(row: any) {
    this.siLoanKycModel.siLoanApplicationId = this.loanAccId;
    this.siLoanKycModel.admissionNumber = this.admissionNumber;
    this.siLoanKycModel.memberTypeName = this.memberTypeName;
    this.siLoanKycModel.memberType = this.memberTypeId;
    this.siLoanKycModel.memberId = this.memberId;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.siLoanKycModel.kycDocumentTypeId != null && data.value == this.siLoanKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.siLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.siLoanKycService.updateSILoanKYCDetails(this.siLoanKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      }
      else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getAllKycsDetailsSiKycDetails(this.loanAccId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
/**
     * @implements this method for documents name setting
     * @author k.yamuna
     */
  onChangeDocument() {
    let filteredObj = this.documentNameList.find((data: any) => null != data && this.siLoanKycModel != null && data.value == this.siLoanKycModel.kycDocumentTypeId);
    if (filteredObj != null && undefined != filteredObj)
      this.siLoanKycModel.kycDocumentTypeName = filteredObj.label;
      if (this.siLoanKycModel.kycDocumentTypeName != null && this.siLoanKycModel != undefined) {
        this.documentNumberDynamicValidation(this.siLoanKycModel.kycDocumentTypeName);
      }
  }
  /**
     * @implements this method for kyc duplicate showing while onchange the documentType
     * @author k.yamuna
     */
  kycModelDuplicateCheck(kycModelList: any) {
    let duplicate = false;
    const uniqueIds = new Set<number>();
    const duplicateIds = new Set<number>();
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      for (let item of this.kycModelList) {
        if (item != null && item != undefined && item.kycDocumentTypeId != null && item.kycDocumentTypeId != undefined) {
          if (uniqueIds.has(item.kycDocumentTypeId)) {
            duplicateIds.add(item.kycDocumentTypeId);
          } else {
            uniqueIds.add(item.kycDocumentTypeId);
          }
        }
        if (duplicateIds.size > 0) {
          duplicate = true;
          this.kycForm.reset();
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
        }
      }
    }
    return duplicate;
  }

//  checkDuplicateSurveyNoInTable(kycModel: any) {
//      if (null != kycModel && undefined != kycModel) {
//        let obj = [];
//        if (this.kycModelList != undefined && this.kycModelList != null && this.kycModelList.length != 0) {
//          obj = this.kycModelList.filter(obj => (obj.kycDocumentTypeId == kycModel.kycDocumentTypeId) && (obj.promoterId == kycModel.promoterId)
//           ).map(object => {
//              return object;
//            });
//        }
//        if (obj.length > 0 ) {
//          this.kycForm.get("kycDocumentTypeName").reset();
//          this.msgs = [];
//          this.msgs = [{ severity: "error", detail: applicationConstants.SURVEY_NUMBER_ALREADY_EXIST }];
//          setTimeout(() => {
//            this.msgs = [];
//          }, 2000);
//      }

  /**
     * @implements this method for kyc duplicate showing while onchange the documentType
     * @author k.yamuna
     */
  kycDplicate(kycModel: any) {
    if (kycModel != null && kycModel != undefined) {
      if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
        for (let item of this.kycModelList) {
          if (item != null && item != undefined && (item.kycDocumentTypeId == kycModel.kycDocumentTypeId) && (item.promoterId == kycModel.promoterId)) {
            this.kycForm.reset();
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
            setTimeout(() => {
              this.msgs = [];
            }, 1500);
          }
        }
      }
    }
    let filteredObj = this.documentNameList.find((data: any) => null != data && this.siLoanKycModel != null && data.value == this.siLoanKycModel.kycDocumentTypeId);
    if (filteredObj != null && undefined != filteredObj)
      this.siLoanKycModel.kycDocumentTypeName = filteredObj.label;
      if (this.siLoanKycModel.kycDocumentTypeName != null && this.siLoanKycModel != undefined) {
        this.documentNumberDynamicValidation(this.siLoanKycModel.kycDocumentTypeName);
      }
    

  }
   
  /**
     * @implements this method for kyc fime remove while uploading file
     * @author k.yamuna
     */
  fileRemoveEvent() {
    if (this.siLoanKycModel.filesDTOList != null && this.siLoanKycModel.filesDTOList != undefined && this.siLoanKycModel.filesDTOList.length > 0) {
      // this.saveButtonDisabled = false;
      let removeFileIndex = this.siLoanKycModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.siLoanKycModel.kycFilePath);
      this.siLoanKycModel.filesDTOList.splice(removeFileIndex, 1);
      this.siLoanKycModel.kycFilePath = null;
      this.updateData();
    }
  }

   /**
     * @implements this method for checking member type
     * @author k.yamuna
     */
  memberTypeCheck() {
    this.kycModelList = [];
    if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.getMembershipBasicDetailsByAdmissionNumber(this.membershipBasicRequiredDetailsModel.admissionNumber);
    } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
      this.getGroupDetailsByAdmissionNumber(this.memberGroupDetailsModel.admissionNumber);
    } else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.getInstitutionDetailsByAdmissionNumber(this.membershipInstitutionDetailsModel.admissionNumber);
    }
  }

    /**
     * @implements this method for getting member basic details by admission number
     * @author k.yamuna
     */
  getMembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
          this.kycModelList = this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList;
          if (this.kycModelList != null && this.kycModelList != undefined) {
            this.editDocumentOfKycFalg = true;
            for (let kyc of this.kycModelList) {
              if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
            this.isFileUploaded = applicationConstants.TRUE;
            this.updateData();
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

    /**
     * @implements this method for getting group basic details by admission number
     * @author k.yamuna
     */
  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.membershipServiceService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
          this.kycModelList = this.memberGroupDetailsModel.groupKycList;
          if (this.kycModelList != null && this.kycModelList != undefined) {
            this.editDocumentOfKycFalg = true;
            for (let kyc of this.kycModelList) {
              if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
            this.isFileUploaded = applicationConstants.TRUE;
            this.updateData();
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

    /**
     * @implements this method for getting instituion basic details by admission number
     * @author k.yamuna
     */
  getInstitutionDetailsByAdmissionNumber(admissionNUmber: any) {
    this.membershipServiceService.getMemberIstitutionByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.kycModelList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
          if (this.kycModelList != null && this.kycModelList != undefined) {
            this.editDocumentOfKycFalg = true;
            for (let kyc of this.kycModelList) {
              if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
            this.isFileUploaded = applicationConstants.TRUE;
            this.updateData();
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

  fileRemoeEvent() {
    this.isFileUploaded = applicationConstants.FALSE; // upload validation
    if (this.siLoanKycModel.filesDTOList != null && this.siLoanKycModel.filesDTOList != undefined && this.siLoanKycModel.filesDTOList.length > 0) {
      let removeFileIndex = this.siLoanKycModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.siLoanKycModel.kycFilePath);
      if (removeFileIndex != null && removeFileIndex != undefined) {
        this.siLoanKycModel.filesDTOList[removeFileIndex] = null;
        this.siLoanKycModel.kycFilePath = null;
      }
    }
  }
  /**
      * @implements document number dynamic Vaildation
      * @author k.yamuna
      */
  documentNumberDynamicValidation(docTypeName: any) {
    if (DOCUMENT_TYPES.AADHAR == this.siLoanKycModel.kycDocumentTypeName) {
      const controlTow = this.kycForm.get('documentNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.AADHAR_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
    else if (DOCUMENT_TYPES.PANNUMBER == this.siLoanKycModel.kycDocumentTypeName) {
      const controlTow = this.kycForm.get('documentNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = true;
    }
    else {
      const controlTow = this.kycForm.get('documentNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
  }

  /**
 * Function to enable or disable form controls based on isMemberCreation
 */
updateFieldState(): void {
  if (this.isMemberCreation) {
      this.kycForm.get('kycDocumentTypeName')?.enable();
      this.kycForm.get('promoter')?.enable();
  } else {
      this.kycForm.get('kycDocumentTypeName')?.disable();
      this.kycForm.get('promoter')?.disable();
  }

  // Ensure validation updates
  this.kycForm.get('kycDocumentTypeName')?.updateValueAndValidity();
  this.kycForm.get('promoter')?.updateValueAndValidity();
}

}