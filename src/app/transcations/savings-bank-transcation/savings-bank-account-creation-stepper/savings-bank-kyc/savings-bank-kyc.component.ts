import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SavingBankApplicationService } from '../savings-bank-application/shared/saving-bank-application.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SavingsBankCommunicationService } from '../savings-bank-communication/shared/savings-bank-communication.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SavingsBankKycModel } from './shared/savings-bank-kyc-model';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { SavingsBankKycService } from './shared/savings-bank-kyc.service';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../membership-basic-required-details/shared/membership-basic-required-details';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { SavingBankApplicationModel } from '../savings-bank-application/shared/saving-bank-application-model';
import { DOCUMENT_TYPES, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-savings-bank-kyc',
  templateUrl: './savings-bank-kyc.component.html',
  styleUrls: ['./savings-bank-kyc.component.css']
})
export class SavingsBankKycComponent implements OnInit {

  kycForm: FormGroup;
  kyc: any;
  checked: any;
  sbAccId: any;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  minBalence: any;
  accountOpeningDateVal: any;

  documentTypeList: any[] = [];

  savingsBankKycModel: SavingsBankKycModel = new SavingsBankKycModel();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  savingBankApplicationModel:SavingBankApplicationModel = new SavingBankApplicationModel();
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


  @ViewChild('cv', { static: false })
  private cv!: Table;
  editIndex: any;
  afterEditCancleFalg: boolean = false;

  editButtonDisable: boolean = false;

  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  admissionNumber: any;
  showForm: any;
  individualFlag : boolean = false;
  groupFlag : boolean = false;
  institutionFlag : boolean = false;
  memberTypeName: any;
  promoterDetails: any[]= [];
  institutionPromoter: any[]= [];
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  memberTypeId: any;
  displayDialog: boolean = false;
  deleteId: any;
  promotersList: any [] =[];
  requiredDocumentsNamesText: any;
  mandatoryDoxsTextShow: boolean = false;
  saveAndNextEnable : boolean = false;
  kycPhotoCopyZoom: boolean = false;
  isPanNumber: boolean = false;
  isMaximized: boolean = false;
  fileSizeMsgForImage: any;


  constructor(private router: Router, private formBuilder: FormBuilder, private savingBankApplicationService: SavingBankApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private savingsBankCommunicationService: SavingsBankCommunicationService, private savingsBankKycService: SavingsBankKycService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe , private fileUploadService :FileUploadService) {
    this.kycForm = this.formBuilder.group({
     'docNumber': new FormControl('', Validators.required),
        'docTypeName': new FormControl('', Validators.required),
        'fileUpload': new FormControl('',),
        'nameAsPerDocument':  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        'promoter': ['', ],
    });
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined ) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.sbAccId = Number(queryParams);
        this.getSbAccountDetailsById(this.sbAccId);
        this.isEdit = true;
        
      } else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.columns = [
      { field: 'docTypeName', header: 'MEMBERSHIP.KYC_DOCUMENT_NAME' },
      { field: 'docNumber', header: 'MEMBERSHIP.KYC_DOCUMENT_NUMBER' },
      { field: 'docPath', header: 'MEMBERSHIP.KYC_DOCUMENT' }
    ];
    // this.getAllKycsDetailsBySbId(this.sbAccId);
    this.getAllKycTypes();
    this.updateData();
  }
  
  /**
   * @implements get all kyc types
   * @author jyothi.naidana
   */
  getAllKycTypes() {
    this.savingsBankKycService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id, isMandatory: count.isMandatory }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.savingsBankKycModel.kycDocumentTypeId != null && data.value == this.savingsBankKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj) {
          this.savingsBankKycModel.kycDocumentTypeName = filteredObj.label;
        }
        let mandatoryList = this.documentNameList.filter((obj: any) => obj.isMandatory == applicationConstants.TRUE);
        let i = 0;
        for (let doc of this.documentNameList) {
          if (i == 0)
            this.requiredDocumentsNamesText = "'Please Upload Mandatory KYC Documents "
          if (doc.isMandatory) {
            i = i + 1;
            this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + doc.label;
            if (i < mandatoryList.length) {
              this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + " , "
            }
          }
        }
        this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + "'";
        if (i > 0) {
          this.mandatoryDoxsTextShow = true;
        }
      }
    });
  }

 
/**
 * @implements image uploader for Kyc document
 * @param event 
 * @param fileUpload 
 * @author jyothi.naidana
 */
  imageUploader(event: any, fileUpload: FileUpload) {
    let fileSizeFalg= false;
    this.fileSizeMsgForImage = null;
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.savingsBankKycModel.filesDTOList = [];
    this.savingsBankKycModel.kycFilePath = null;
    this.savingsBankKycModel.multipartFileList = [];
    let files: FileUploadModel = new FileUploadModel();

    let selectedFiles = [...event.files];
    if(selectedFiles[0].fileType != ".pdf"){
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForImage= "file is bigger than 2MB";
        fileSizeFalg = true;
       }
    }
    else if(selectedFiles[0].fileType == ".pdf"){
      if (selectedFiles[0].size/1024/1024 > 5) {
        this.fileSizeMsgForImage= "file is bigger than 5MB";
        fileSizeFalg = true;
       }
    }
    
    // Clear file input before processing files
    fileUpload.clear();
     if(!fileSizeFalg){
      for (let file of selectedFiles) {
        let reader = new FileReader();
        reader.onloadend = (e) => {
          this.isFileUploaded = applicationConstants.TRUE;
          let files = new FileUploadModel();
          this.uploadFileData = e.currentTarget;
          files.fileName = file.name;
          files.fileType = file.type.split('/')[1];
          files.value = this.uploadFileData.result.split(',')[1];
          files.imageValue = this.uploadFileData.result;
          let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
          if (index === -1) {
            this.multipleFilesList.push(files);
            this.savingsBankKycModel.filesDTOList.push(files); // Add to filesDTOList array
            this.savingsBankKycModel.multipartFileList.push(files);
          }
          let timeStamp = this.commonComponent.getTimeStamp();
          this.savingsBankKycModel.filesDTOList[0].fileName = "SB_KYC_" + this.sbAccId + "_" +timeStamp+ "_"+ file.name ;
          this.savingsBankKycModel.kycFilePath = "SB_KYC_" + this.sbAccId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
          let index1 = event.files.findIndex((x: any) => x === file);
          fileUpload.remove(event, index1);
          fileUpload.clear();
          
        }
        reader.readAsDataURL(file);
      }
     }
  
  }

  
  save() {
    this.updateData();
  }
  /**
   * @implements update data to parent compenent
   * @author jyothi.naidana
   */
  updateData() {
    this.savingsBankKycModel.sbAccId = this.sbAccId;
    this.savingsBankKycModel.admissionNumber = this.admissionNumber;
    this.savingsBankKycModel.memberTypeName  = this.memberTypeName;
    this.savingsBankKycModel.memberType  = this.memberTypeId;
    this.savingsBankKycModel.memberId  = this.memberId;
    //for manadatory KYC Documents check
    this.saveAndNextEnable = false;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let documentNameList = this.documentNameList.filter((obj: any) => obj.isMandatory);
      if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0 && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) {
        if (this.savingsBankKycModel.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
          const missingItems = this.kycModelList.filter(document => !documentNameList.some(mandatoryDocument => document.kycDocumentTypeId === mandatoryDocument.value));
          if ((documentNameList.length != this.kycModelList.length - missingItems.length) || this.buttonDisabled) {
            this.saveAndNextEnable = true;
          }
        }
        else {//group institution promoter kyc mandatory uploads check
          let i = 0 ;
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
    this.savingBankApplicationService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.savingsBankKycModel,
      // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
      isDisable: this.saveAndNextEnable,
      stepperIndex: 1,
    });
  }

  /**
   * @implements delete kyc
   * @param rowDataId 
   * @author jyothi.naidana
   */
  delete(rowDataId: any) {
    this.savingsBankKycService.deleteSbKyc(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
          this.getAllKycsDetailsSbKycDetails(this.sbAccId);
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
  * @implements get all kyc by sb id
  * @param id 
  * @author jyothi.naidana
  */
  getAllKycsDetailsSbKycDetails(id: any) {
    this.savingsBankKycService.getSbKycBySbAccId(id).subscribe((response: any) => {
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
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);

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
      // this.getSbAccountDetailsById(sbAccId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @implements save kyc 
   * @param row 
   * @author jyothi.naidana
   */
  saveKyc(row: any) {
    this.savingsBankKycModel.sbAccId = this.sbAccId;
    this.savingsBankKycModel.admissionNumber = this.admissionNumber;
    this.savingsBankKycModel.memberTypeName  = this.memberTypeName;
    this.savingsBankKycModel.memberType  = this.memberTypeId;
    this.savingsBankKycModel.memberId  = this.memberId;
    // document name mapping
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.savingsBankKycModel.kycDocumentTypeId != null && data.value == this.savingsBankKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.savingsBankKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
     // promoter name mapping
     let promoter = this.promotersList.filter((obj:any) => obj.value == this.savingsBankKycModel.promoterId);
     if(promoter != null && promoter != undefined && promoter.length >0){
       this.savingsBankKycModel.promoterName = promoter[0].label;
     }
    this.savingsBankKycModel.status  = applicationConstants.ACTIVE;
    this.savingsBankKycService.addSbKyc(this.savingsBankKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.savingsBankKycModel = this.responseModel.data[0];
        this.kycForm.reset();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      }else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getAllKycsDetailsSbKycDetails(this.sbAccId);
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
   * @implements cancle kyc
   * @author jyothi.naidana
   */
  cancelKyc() {
    this.savingsBankKycModel = new SavingsBankKycModel();
    this.kycModelList = [];
    this.addKycButton = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsSbKycDetails(this.sbAccId);
  }
  /**
   * @implements get sb account details by sb id
   * @param id 
   * @author jyothi.naidana
   */
  getSbAccountDetailsById(id: any) {
    this.savingBankApplicationService.getSbApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.savingBankApplicationModel = this.responseModel.data[0]
            if (this.savingBankApplicationModel.accountOpenDate != null && this.savingBankApplicationModel.accountOpenDate != undefined) {
              this.accountOpeningDateVal = this.datePipe.transform(this.savingBankApplicationModel.accountOpenDate, this.orgnizationSetting.datePipe);
            }
            if (this.savingBankApplicationModel.productName != null && this.savingBankApplicationModel.productName != undefined) {
              this.productName = this.savingBankApplicationModel.productName;
            }
            if (this.savingBankApplicationModel.accountTypeName != null && this.savingBankApplicationModel.accountTypeName != undefined) {
              this.accountType = this.savingBankApplicationModel.accountTypeName;
            }
            if (this.savingBankApplicationModel.minBalance != null && this.savingBankApplicationModel.minBalance != undefined) {
              this.minBalence = this.savingBankApplicationModel.minBalance;
            } 
            if(this.savingBankApplicationModel.admissionNumber != null && this.savingBankApplicationModel.admissionNumber != undefined){
              this.admissionNumber = this.savingBankApplicationModel.admissionNumber;
            }
            if(this.savingBankApplicationModel.memberTypeName != null && this.savingBankApplicationModel.memberTypeName != undefined){
              this.memberTypeName = this.savingBankApplicationModel.memberTypeName;
              this.membershipDataFromSbModule();
              /**
               * get required member details for kyc
               */
              // this.membershipDataFromSbModule();
            }
            //required documents
            if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length >0) {
              let mandatoryList = this.documentNameList.filter((obj:any) => obj.isMandatory== applicationConstants.TRUE);
              let i = 0;
              for (let doc of this.documentNameList) {
                if (i == 0)
                  this.requiredDocumentsNamesText = "'Please Upload Mandatory KYC Documents "
                if (doc.isMandatory) {
                  i = i + 1;
                  this.requiredDocumentsNamesText = this.requiredDocumentsNamesText +doc.label ;
                  if(i <mandatoryList.length){
                    this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + " , "
                  }
                }
              }
              this.requiredDocumentsNamesText = this.requiredDocumentsNamesText;
              if (i > 0) {
                this.mandatoryDoxsTextShow = true;
              }
            }
            if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined)
              this.memberTypeId = this.responseModel.data[0].memberTypeId;
            this.getAllKycsDetailsSbKycDetails(this.sbAccId);
            this.updateData();
          }
        }else {
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
  * @implements add kyc
  * @param event 
  * @author jyothi.naidana
  */
  addKyc(event: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.getAllKycTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.savingsBankKycModel = new SavingsBankKycModel;
    this.updateData();
  }

  /**
   * @implements cancle kyc
   * @author jyothi.naidana
   */
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsSbKycDetails(this.sbAccId);
    this.updateData();
  }
  
  onClick() {
    this.addDocumentOfKycFalg = true;
  }
 /**
  * @implements edit card data
  * @param index 
  * @param modelData 
  * @author jyothi.naidana
  */
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
    this.getKycById(modelData.id);
    this.updateData();

  }
  /**
   * @implements edit cancle
   * @author jyothi.naidana
   */
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
      this.getAllKycsDetailsSbKycDetails(this.sbAccId);
    
    this.updateData();
  }

   /**
    * @implements edit save
    * @param row 
    * @author jyothi.naidana
    */
  editsave(row: any) {
    this.savingsBankKycModel.sbAccId = this.sbAccId;
    this.savingsBankKycModel.admissionNumber = this.admissionNumber;
    this.savingsBankKycModel.memberTypeName  = this.memberTypeName;
    this.savingsBankKycModel.memberType  = this.memberTypeId;
    this.savingsBankKycModel.memberId  = this.memberId;
    //document Type name Mapping
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.savingsBankKycModel.kycDocumentTypeId != null && data.value == this.savingsBankKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.savingsBankKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }

    // promoter name mapping
    let promoter = this.promotersList.filter((obj:any) => obj.value == this.savingsBankKycModel.promoterId);
    if(promoter != null && promoter != undefined && promoter.length >0){
      this.savingsBankKycModel.promoterName = promoter[0].label;

    }

    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.savingsBankKycService.updateSbKyc(this.savingsBankKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        // this.kycModelList = this.responseModel.data;
        this.kycForm.reset();
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
      this.getAllKycsDetailsSbKycDetails(this.sbAccId);
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
  * @implements get kyc by Id
  * @param id 
  * @author jyothi.naidana
  */
  getKycById(id: any) {
    this.savingsBankKycService.getSbKyc(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.savingsBankKycModel = this.responseModel.data[0];
              if (this.savingsBankKycModel.kycFilePath != undefined) {
                if(this.savingsBankKycModel.kycFilePath != null && this.savingsBankKycModel.kycFilePath != undefined){
                  this.savingsBankKycModel.multipartFileList = this.fileUploadService.getFile(this.savingsBankKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.savingsBankKycModel.kycFilePath);
                  this.isFileUploaded = applicationConstants.TRUE;
                }
                if(this.savingsBankKycModel.kycDocumentTypeName != null && this.savingsBankKycModel.kycDocumentTypeName != undefined){
                  this.documentNumberDynamicValidation(this.savingsBankKycModel.kycDocumentTypeName );
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * @implements get mememberDetails by Admission Number
   * @param admisionNumber 
   * @author jyothi.naidana
   */
  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.savingBankApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetails = this.responseModel.data[0];
            if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
              this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
              this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
            }
            this.memberId = this.membershipBasicRequiredDetails.id;
            
          }
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
  /**
   * @implements get group admission Number
   * @param admissionNumber 
   * @author jyothi.naidana
   */
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.savingBankApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGroupDetailsModel = this.responseModel.data[0];
            if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
              this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
            }
            if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
              this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
              this.memberId = this.memberGroupDetailsModel.id;
          }
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
  /**
   * @implements get institution by admission Number
   * @param admissionNumber 
   * @author jyothi.naidana
   */
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.savingBankApplicationService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
            this.memberId = this.membershipInstitutionDetailsModel.id;
          }
        } else {
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

  /**
   * @implements membership data from sb module
   * @author jyothi.naidana
   */
  membershipDataFromSbModule(){
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
    } else if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      if(this.savingBankApplicationModel.groupDetailsDTO.groupPromoterList != null && this.savingBankApplicationModel.groupDetailsDTO.groupPromoterList != undefined && this.savingBankApplicationModel.groupDetailsDTO.groupPromoterList.length >0){
        this.promotersList = this.savingBankApplicationModel.groupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name+" "+promoter.surname +"-"+promoter.aadharNumber, value: promoter.id }
        });
      }
    } else if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      if(this.savingBankApplicationModel.institutionDTO.institutionPromoterList != null && this.savingBankApplicationModel.institutionDTO.institutionPromoterList != undefined && this.savingBankApplicationModel.institutionDTO.institutionPromoterList.length >0){
        this.promotersList = this.savingBankApplicationModel.institutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name+" "+promoter.surname+"-"+promoter.aadharNumber, value: promoter.id }
        });
      }
    }
    
  }

  /**
   * @implements kyc module deuplicate
   * @param kycDocTypeId 
   * @author jyothi.naidana
   */
  kycModelDuplicateCheck(rowData:any){
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.savingsBankKycModel.kycDocumentTypeId != null && data.value == this.savingsBankKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.savingsBankKycModel.kycDocumentTypeName = filteredObj.label;
        this.documentNumberDynamicValidation(this.savingsBankKycModel.kycDocumentTypeName );
      }
    }
    if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
      let duplicate :any
      if(this.savingsBankKycModel.memberTypeName != MemberShipTypesData.INDIVIDUAL){
        duplicate = this.kycModelList.filter((obj:any) => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId && obj.promoterId ===  rowData.promoterId);
      }
      else {
        duplicate = this.kycModelList.filter((obj:any) => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
      }
    if ( this.addDocumentOfKycFalg && duplicate != null && duplicate != undefined && duplicate.length ==1) {
      this.kycForm.reset();
      this.savingsBankKycModel = new SavingsBankKycModel();
      if(rowData.id != null && rowData != undefined)
        this.savingsBankKycModel.id = rowData.id;
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types"}];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
    else if(!this.addDocumentOfKycFalg && duplicate != null && duplicate != undefined && duplicate.length ==1 && duplicate[0].id != rowData.id){
      this.kycForm.reset();
      this.savingsBankKycModel = new SavingsBankKycModel();
      if(rowData.id != null && rowData != undefined)
        this.savingsBankKycModel.id = rowData.id;
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types"}];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } 
  }
  }

   /**
   * @author jyothi.naidana
   * @implements on click delete
   */
   deletDilogBox(rowData:any){
    this.displayDialog = true;
    if(rowData.id != null && rowData.id != undefined){
      this.deleteId = rowData.id;
    }
   
  }

  /**
   * @author jyothi.naidana
   * @implements cancle delete dialog box
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
   * @author jyothi.naidana
   * @implements submit delete diloge 
   */
  submitDelete(){
    if(this.deleteId != null && this.deleteId != undefined){
      this.delete(this.deleteId);
    }
    this.savingsBankKycModel = new SavingsBankKycModel();
      this.displayDialog = false;
  }

  /**
   * @implements onFile remove
   * @author jyothi.naidana
   */
  fileRemoeEvent(){
    this.isFileUploaded = applicationConstants.FALSE; // upload validation
    if(this.savingsBankKycModel.filesDTOList != null && this.savingsBankKycModel.filesDTOList != undefined && this.savingsBankKycModel.filesDTOList.length > 0){
     let removeFileIndex = this.savingsBankKycModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.savingsBankKycModel.kycFilePath);
     if(removeFileIndex != null && removeFileIndex != undefined){
       this.savingsBankKycModel.filesDTOList[removeFileIndex] = null;
       this.savingsBankKycModel.kycFilePath = null;
     }
    }
   }
   /**
    * @implements onClick Photo Copy
    * @param rowData 
    * @author jyothi.naidana
    */
   onClickkycPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  kycclosePhoto(){
    this.kycPhotoCopyZoom = false;
  }
  kycclosePhotoCopy() {
    this.kycPhotoCopyZoom = false;
  }

   /**
   * @implements document number dynamic Vaildation
   * @author jyothi.naidana
   */
   documentNumberDynamicValidation(docTypeName: any) {
    if (DOCUMENT_TYPES.AADHAR == this.savingsBankKycModel.kycDocumentTypeName) {
      const controlTow = this.kycForm.get('docNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.AADHAR_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
    else if (DOCUMENT_TYPES.PANNUMBER == this.savingsBankKycModel.kycDocumentTypeName) {
      const controlTow = this.kycForm.get('docNumber');
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
      const controlTow = this.kycForm.get('docNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
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

}
