import { Component, ViewChild } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanCommunication } from '../term-loans-communication/shared/term-loan-communication.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';
import { TermLoanCommunicationService } from '../term-loans-communication/shared/term-loan-communication.service';
import { TermLoanKycService } from '../term-loans-kyc/shared/term-loan-kyc.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-term-loan-membership',
  templateUrl: './term-loan-membership.component.html',
  styleUrls: ['./term-loan-membership.component.css']
})
export class TermLoanMembershipComponent {
  msgs: any[] = [];
  kycForm: any;
  pacsId: any;
  branchId: any;
  orgnizationSetting: any;
  documentsData: any[] = [];
  uploadFlag: boolean = true;
  termLoanApplicationId: any;
  admissionNumber: any;
  disableMemberType: boolean = false;
  isEdit: boolean = false;
  showForm: Boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  responseModel!: Responsemodel;
  memberTypeName: any;
  memberTypeId: any;
  isDisableFlag: boolean = false;
  documentNameList: any[] = [];
  editIndex: any;
  isFileUploaded: boolean = false;
  uploadFileData: any;
  
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();

  editButtonDisable: boolean = false;
  buttonDisabled: boolean = false;
  kycDuplicate: boolean = false;
  multipleFilesList:any[]=[];
  editDocumentOfKycFalg: boolean = false;
  termLoanKycDetailsList: any[] = [];
  veiwCardHide: boolean = false;
  promotersList: any [] =[];
  
  
  constructor(private router: Router, 
    private formBuilder: FormBuilder,  private termLoanApplicationsService: TermApplicationService,
     private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
      private encryptDecryptService: EncryptDecryptService,
       private commonFunctionsService: CommonFunctionsService, 
       private datePipe: DatePipe, private termLoanCommunicationService: TermLoanCommunicationService,
       private membershipService: TermLoanNewMembershipService, private termLoanKycService: TermLoanKycService, 
        private fileUploadService : FileUploadService) {
          this.kycForm = this.formBuilder.group({
            'documentNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
            'kycDocumentTypeName': new FormControl('', Validators.required),
            'nameAsPerDocument' : new FormControl('', Validators.required),
            'fileUpload': new FormControl('')
          });
  }
  
  ngOnInit(): void {
    this.termLoanKycDetailsList =[] ;
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo'] ) {
        this.commonComponent.startSpinner();
        
        if(params['admissionNo'] != undefined){
            this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNo']);
        }
        
      if(this.admissionNumber != null && this.admissionNumber != undefined){
          this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
          this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
          this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
      }
      else {
        if(params['id'] != undefined){
          this.termLoanApplicationId = Number(this.encryptDecryptService.decrypt(params['id']));
            this.getTermApplicationByTermAccId(this.termLoanApplicationId);
        }
      }
        this.disableMemberType = true;
        this.isEdit = true;
      }
      else {
        let val = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
        this.updateData();
      }
    });
      // this.kycForm.valueChanges.subscribe((data: any) => {
      //   this.updateData();
      //   if (this.kycForm.valid) {
      //     this.save();
      //   }
      // });
      this.getAllKycTypes();
  }

  /**
   * @implements getfdAccountApplicationdetails By AccountId
   * @param id 
   */
  getTermApplicationByTermAccId(id:any) {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.admissionNumber = this.responseModel.data[0].adminssionNumber;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;;
                this.termLoanApplicationModel = this.responseModel.data[0];
                if(this.termLoanApplicationModel.termLoanKycDetailsDTOList != null &&  this.termLoanApplicationModel.termLoanKycDetailsDTOList != undefined && this.termLoanApplicationModel.termLoanKycDetailsDTOList.length>0 ){
                    this.termLoanKycDetailsList = this.termLoanApplicationModel.termLoanKycDetailsDTOList;
                    for(let kyc of this.termLoanKycDetailsList){
                        kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                }
                this.memberTypeCheckForPromotersKyc(this.termLoanApplicationModel.memberTypeId);
                this.membershipDataFromSbModule(this.termLoanApplicationModel.memberGroupDetailsDTO);
                this.updateData();
              }
            }
        }
        else{
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
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
  * @implements updateData To parent component'
  */
  updateData() {
    if(this.termLoanKycDetailsList != null && this.termLoanKycDetailsList != undefined && this.termLoanKycDetailsList.length > 0){
      this.kycDuplicate = this.termLoanKycModelDuplicateCheck(this.termLoanKycDetailsList);
      if(this.kycDuplicate){
        this.isDisableFlag = true;
      }
      else{
        this.isDisableFlag = false;
      }
    }else{
      this.isDisableFlag = true;
    }
    this.termLoanApplicationsService.changeData({
      formValid: !this.kycForm.valid ? true : false ,
      data: this.termLoanApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  save() {
    this.updateData();
  }

 
  //get member module institution details
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.termLoanKycDetailsList = [];
    this.membershipService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.termLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.termLoanApplicationModel.memberInstitutionDTO  = this.membershipInstitutionDetailsModel;
            if(this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != null && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != undefined && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.length > 0){
              this.termLoanKycDetailsList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
              this.termLoanKycModelDuplicateCheck(this.termLoanKycDetailsList);
              for(let kyc of this.termLoanKycDetailsList){
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
              this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.memberGroupDetailsModel.groupKycList;
            }
            if (this.membershipInstitutionDetailsModel.memberTypeId == null ||  this.membershipInstitutionDetailsModel.memberTypeId == undefined) {
              this.membershipInstitutionDetailsModel.memberTypeId = applicationConstants.INSTITUTION_MEMBER_TYPE_ID;
            }
            this.memberTypeCheckForPromotersKyc(this.membershipBasicRequiredDetails.memberTypeId);
            this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
            this.termLoanApplicationModel.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;
            this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
            this.termLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
            this.membershipDataFromSbModule(this.termLoanApplicationModel.memberInstitutionDTO);
            this.updateData();
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
  //get group details from member module
  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.termLoanKycDetailsList = [];
    this.membershipService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGroupDetailsModel = this.responseModel.data[0];
            this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
              this.memberGroupDetailsModel.registrationDate = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
              this.memberGroupDetailsModel.admissionDate = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.memberGroupDetailsModel.memberTypeId == null ||  this.memberGroupDetailsModel.memberTypeId == undefined) {
              this.memberGroupDetailsModel.memberTypeId = applicationConstants.GROUP_MEMBER_TYPE_ID;
            }
            this.memberTypeCheckForPromotersKyc(this.membershipBasicRequiredDetails.memberTypeId);
            if(this.memberGroupDetailsModel.groupKycList != null && this.memberGroupDetailsModel. groupKycList != undefined){
              this.termLoanKycDetailsList = this.memberGroupDetailsModel. groupKycList;
              for(let kyc of this.termLoanKycDetailsList){
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }              
               this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.memberGroupDetailsModel. groupKycList;
            }
            this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
            this.memberGroupDetailsModel.isNewMember = this.showForm;
            this.termLoanApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
            this.termLoanApplicationModel.memberTypeId = this.memberGroupDetailsModel.memberTypeId;
            this.termLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
            this.membershipDataFromSbModule(this.termLoanApplicationModel.memberGroupDetailsDTO);
            this.updateData();
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

  
  //member module data by member admission Number
  getMemberDetailsByAdmissionNumber(admissionNumber: any) {
    this.termLoanKycDetailsList = [];
    this.membershipService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetails = this.responseModel.data[0];
          this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList = this.responseModel.data[0].termLoanCommunicationDTO;
         
          if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
            this.membershipBasicRequiredDetails.dob = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetails.admissionNumber != null && this.membershipBasicRequiredDetails.admissionNumber != undefined) {
            this.admissionNumber = this.membershipBasicRequiredDetails.admissionNumber;
          }
          if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
            this.membershipBasicRequiredDetails.admissionDate = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
          }
          if(this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList!= null && this.membershipBasicRequiredDetails. memberShipCommunicationDetailsDTOList != undefined){
            this.termLoanCommunicationModel = this.membershipBasicRequiredDetails. memberShipCommunicationDetailsDTOList;
            this.termLoanApplicationModel.termLoanCommunicationDTO = this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList;
          }
          if (this.membershipBasicRequiredDetails.memberTypeId == null ||  this.membershipBasicRequiredDetails.memberTypeId == undefined) {
            this.membershipBasicRequiredDetails.memberTypeId = applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID;
          }
          this.memberTypeCheckForPromotersKyc(this.membershipBasicRequiredDetails.memberTypeId);
          if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
            this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
          }
          if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
            this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
          }
          if(this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != null && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != undefined && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList.length > 0){
            this.termLoanKycDetailsList = this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList;
           this.termLoanKycDetailsList  = this.termLoanKycDetailsList.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE ).map((kyc:any)=>{
            kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            return kyc;
          });
            this.termLoanApplicationModel.termLoanKycDetailsDTOList = this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList;
          }
          this.termLoanApplicationModel.memberTypeName = this.membershipBasicRequiredDetails.memberTypeName;
          this.membershipBasicRequiredDetails.isNewMember = this.showForm;
          this.termLoanApplicationModel.individualMemberDetailsDTO  = this.membershipBasicRequiredDetails;
          this.updateData();
          // this.savingCommuncationDetailsSet(this.membershipBasicRequiredDetails. termLoanCommunicationDTO[0]);
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

  //get all kyc types 
  getAllKycTypes() {
    this.termLoanKycService.getAllKYCTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this. termLoanKycModel.kycDocumentTypeId);
            if (filteredObj != null && undefined != filteredObj)
              this. termLoanKycModel.kycDocumentTypeName = filteredObj.label;
      }
    });
  }

  OnChangeMemberType(documentTypeId :any){
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
    let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == documentTypeId);
    if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
          this. termLoanKycModel.kycDocumentTypeName = filteredObj.label;
    }
  }
  if(this.termLoanKycDetailsList != null && this.termLoanKycDetailsList != undefined && this.termLoanKycDetailsList.length > 0){
    this.kycDuplicate = this.termLoanKycModelDuplicateCheck(this.termLoanKycDetailsList);
  }
    this.updateData();
  }
  //image upload and document path save
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.termLoanKycModel.filesDTOList = [];
    this.termLoanKycModel.kycFilePath = null;
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
          this.termLoanKycModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.termLoanKycModel.filesDTOList[0].fileName = "TERM_KYC_" + this.termLoanApplicationId + "_" +timeStamp+ "_"+ file.name ;
        this.termLoanKycModel.kycFilePath = "TERM_KYC_" + this.termLoanApplicationId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as kycFilePath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

  fileRemoveEvent() {
    this.termLoanKycModel.multipartFileList = [];
    if (this.termLoanKycModel.filesDTOList != null && this.termLoanKycModel.filesDTOList != undefined) {
      this.termLoanKycModel.kycFilePath = null;
      this.termLoanKycModel.filesDTOList = null;
    }
  }

//delete kyc 
  delete(rowData: any) {
    this.termLoanKycService.deleteTermLoanKYCDetails(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.termLoanKycDetailsList = this.responseModel.data;
          this.getAllKycsDetailsTermKycDetails(this.admissionNumber);
      }
    });
  }

  //get all kyc details by fd acc id
  getAllKycsDetailsTermKycDetails(admissionNumber: any) {
    this.termLoanKycDetailsList = [];
    this.termLoanKycService.getKycBytermAccId(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termLoanKycDetailsList = this.responseModel.data;

            if(this.termLoanKycModel.kycFilePath != null && this.termLoanKycModel.kycFilePath != undefined){
              this.termLoanKycModel.multipartFileList = this.fileUploadService.getFile(this.termLoanKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanKycModel.kycFilePath);
  
            }
            if (this.termLoanKycDetailsList != null && this.termLoanKycDetailsList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.termLoanKycDetailsList) {
                let multipleFilesList = [];
                let file = new FileUploadModel();
                file.imageValue = ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath;
                let objects = kyc.kycFilePath.split('.');
                file.fileType = objects[objects.length - 1];
                let name = kyc.kycFilePath.replace(/ /g, "_");
                file.fileName = name
                multipleFilesList.push(file);
                kyc.multipartFileList = multipleFilesList;
              }
            }
          }
        }
      }
      // this.getSbAccountDetailsById(termLoanApplicationId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  
  //add kyc cancle
  cancelKyc() {
    this.termLoanKycDetailsList = [];
    // this.addKycButton = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsTermKycDetails(this.admissionNumber);
  }

   //add cancle 
  cancel() {
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.updateData();
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
    this.getAllKycTypes();
    this.addOrEditKycTempList(modelData);
    this.updateData();
  }
  //edit cancle
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.updateData();
  }
 
  editsave(row: any) {
      this.termLoanKycModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanKycModel.admissionNumber = this.admissionNumber;
      this.termLoanKycModel.memberTypeName = this.memberTypeName;
      this.termLoanKycModel.memberType = this.memberTypeId;
      // this.termLoanKycModel.memberId = this.m;
      if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.termLoanKycModel.kycDocumentTypeId != null && data.value == this.termLoanKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
          this.termLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
      }
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.termLoanKycService.updateTermLoanKYCDetails(this.termLoanKycModel).subscribe((response: any) => {
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
        // this.addKycButton = false;
        this.buttonDisabled = false;
        if(this.termLoanApplicationId != null && this.termLoanApplicationId != undefined)
        {
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);

        }
        this.updateData();
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    // }
    
  }

  //get kyc details by kyc id for edit purpose
  getKycById(id: any) {
    this.termLoanKycDetailsList = [];
    this.termLoanKycService.getKycBytermAccId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this. termLoanKycModel = this.responseModel.data[0];
              if (this. termLoanKycModel.kycFilePath != undefined) {
                for(let kyc of this.termLoanKycDetailsList){
                  this. termLoanKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                 }
              }
            }
          }
        }
      }
    });
  }

  addOrEditKycTempList(rowData : any){
    const kyc = this.termLoanKycDetailsList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    this. termLoanKycModel = kyc;
  }

  termLoanKycModelDuplicateCheck(termLoanKycDetailsList: any) {
    let duplicate = false;
    // const uniqueIds = new Set<number>();
    // const duplicateIds = new Set<number>();
    // if (this.termLoanKycDetailsList != null && this.termLoanKycDetailsList != undefined && this.termLoanKycDetailsList.length > 0) {
    //   for (let item of this.termLoanKycDetailsList) {
    //     if (item != null && item != undefined && item.kycDocumentTypeId != null && item.kycDocumentTypeId != undefined) {
    //       if (uniqueIds.has(item.kycDocumentTypeId)) {
    //         duplicateIds.add(item.kycDocumentTypeId);
    //       } else {
    //         uniqueIds.add(item.kycDocumentTypeId);
    //       }
    //     }
    //     if (duplicateIds.size > 0) {
    //       duplicate = true;
    //       this.kycForm.reset();
    //       this.msgs = [];
    //       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
    //       setTimeout(() => {
    //         this.msgs = [];
    //       }, 1500);
    //     }
    //   }
    // }
    return duplicate;
  }

  memberTypeCheckForPromotersKyc(memberType :any){
    if(memberType == applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID){
      this.individualFlag = true;
    }
    else {
      this.individualFlag = false;
    //  const controlName = this.promoterDetailsForm.get('promoter');
    //  if (controlName) {
    //   controlName.setValidators([
    //     Validators.required,
    //   ]);
    //   controlName.updateValueAndValidity();
    // }
    
    }
  }

  /**
   * @implements membership data from sb module

   */
membershipDataFromSbModule(obj :any){
  if (obj.memberTypeName == "Individual") {
    this.individualFlag = true;
  } else if (obj.memberTypeName == "Group") {
    this.groupFlag = true;
    if(this.termLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList != null && this.termLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList != undefined && this.termLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList.length >0){
      this.promotersList = this.termLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
        return { label: promoter.name+" "+promoter.surname, value: promoter.id }
      });
    }
  
  } else if (obj.memberTypeName == "Institution") {
    this.institutionFlag = true;
    if(this.termLoanApplicationModel.memberInstitutionDTO.institutionPromoterList != null && this.termLoanApplicationModel.memberInstitutionDTO.institutionPromoterList != undefined && this.termLoanApplicationModel.memberInstitutionDTO.institutionPromoterList.length >0){
      this.promotersList = this.termLoanApplicationModel.memberInstitutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
        return { label: promoter.name+" "+promoter.surname, value: promoter.id }
      });
    }
   
  }
  
}
  
}
