import { SiLoanDocumentsDetailsService } from './../../../shared/si-loans/si-loan-documents-details.service';
import { SiLoanDocuments } from './../../../shared/si-loans/si-loan-documents.model';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { SiLoanApplicationDetailsComponent } from '../si-loan-application-details/si-loan-application-details.component';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';

@Component({
  selector: 'app-si-loan-documents',
  templateUrl: './si-loan-documents.component.html',
  styleUrls: ['./si-loan-documents.component.css']
})
export class SiLoanDocumentsComponent {

  siDocumentDetailsForm: FormGroup;
    orgnizationSetting: any;
    isMemberCreation: any;
    documentsData: any [] =[];
    loanAccId: any;
    isEdit: boolean = false;
    buttonDisabled: boolean = false;
    saveAndNextEnable : boolean = false;
  
    columns: any[] = [];
    uploadFlag: boolean = false;
    editIndex: any;
    deleteId: any;
    requiredDocumentsNamesText: any;
    mandatoryDoxsTextShow: boolean = false;
  siproductId: any;
  requiredDocumentList: any;
  ;
    kyc: any;
    checked: any;
    accountType: any;
    applicationType: any;
    msgs: any[] = [];
    responseModel!: Responsemodel;
    minBalence: any;
    accountOpeningDateVal: any;
  
    documentTypeList: any[] = [];
    siLoanDocumentsModel: SiLoanDocuments = new SiLoanDocuments();
    siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();

    fileName: any;
    documentModelList: any[] = [];
    adhaarFilesList: any[] = [];
    signFilesList: any[] = [];
    panFilesList: any[] = [];
    uploadFileData: any;
    isFileUploaded: boolean = false;
    
    submitFlag: boolean = false;
   
    
    displayPosition: boolean = false;
    documentNameList: any[] = [];
    position: any;
    docFilesList: any[] = [];
    
    
  
    filesList: any[] = [];
    
    exerciseFileList: any[] = [];
    lastDot = applicationConstants.LAST_DOT;
    memberId: any;
    kycListByMemberId: any[] = [];
    typeFlag: boolean = false;
    addKycButton: boolean = false;
  
    addDocumentOfKycFalg: boolean = false;
  
    editDocumentOfKycFalg: boolean = false;
  
    veiwCardHide: boolean = false;
  
  
    
    afterEditCancleFalg: boolean = false;
  
    editButtonDisable: boolean = false;
  
    multipleFilesList: any[] = [];
    filesDTOList: any[] = [];
    productName: any;
    admissionNumber: any;
   
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
    docPhotoCopyZoom: boolean = false;
  
  
    constructor(private router: Router, private formBuilder: FormBuilder, private siLoanApplicationService: SiLoanApplicationService, private commonComponent: CommonComponent,
       private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
       private siLoanDocumentsDetailsService: SiLoanDocumentsDetailsService,
       private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe ,
        private fileUploadService : FileUploadService) {
      this.siDocumentDetailsForm = this.formBuilder.group({
        'docNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
        'docTypeName': new FormControl('', Validators.required),
        'fileUpload': new FormControl(''),
      });
    }
    
    ngOnInit(): void {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.isMemberCreation = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
      if (this.documentsData.length >= 1) {
        this.uploadFlag = true;
      }
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined ) {
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          this.loanAccId = Number(queryParams);
          this.getSILoanAccountDetailsById(this.loanAccId);
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
      
      this.updateData();
    }
    
    /**
     * @author k.yamuna
     * @implements get kyc types List 
     */
    getAllDocumentTypesByProductId() {
      this.siLoanDocumentsDetailsService.getAllDocumentTypesByProductId(this.siproductId).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.documentTypeName, value: count.documentType }
          });
          this.requiredDocumentList = this.responseModel.data.filter((obj: any) => obj != null && obj.isRequired == applicationConstants.TRUE);
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

   
  /**
     * @author k.yamuna
     * @implements document upload 
     */
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.TRUE;
    this.siLoanDocumentsModel.multipartFileList = [];
    this.siLoanDocumentsModel.filesDTOList = [];
    this.siLoanDocumentsModel.filePath = null;
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
          this.siLoanDocumentsModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.siLoanDocumentsModel.filesDTOList[0].fileName = "SI_LOAN_DOCUMENT_" + this.loanAccId + "_" + timeStamp + "_" + file.name;
        this.siLoanDocumentsModel.filePath = "SI_LOAN_DOCUMENT_" + this.loanAccId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as filePath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
  

    save() {
      this.updateData();
    }
    /**
     * @author k.yamuna
     * @implements set values for data updation to stepper component
     */
    // updateData() {
    //   this.siLoanDocumentsModel.siLoanApplicationId = this.loanAccId;
    //   this.siLoanDocumentsModel.admissionNumber = this.admissionNumber;
    //   this.siLoanDocumentsModel.memberTypeName  = this.memberTypeName;
    //   this.siLoanDocumentsModel.memberType  = this.memberTypeId;
    //   this.siLoanDocumentsModel.memberId  = this.memberId;
    //   //for manadatory Documents check
    //   this.saveAndNextEnable = false;
    //   if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
    //     let documentNameList = this.documentNameList.filter((obj:any)=> obj.isRequired);
    //   if (this.documentModelList != null && this.documentModelList != undefined && this.documentModelList.length > 0 && documentNameList != null && documentNameList != undefined && documentNameList.length >0) {
    //     const missingItems = this.documentModelList.filter(document => !documentNameList.some(mandatoryDocument => document.documentType === mandatoryDocument.value));
    //     if ((documentNameList.length  != this.documentModelList.length - missingItems.length) || this.buttonDisabled) {
    //       this.saveAndNextEnable = true;
    //     }
    //   }
    //   else if (((this.documentModelList == null || this.documentModelList == undefined || this.documentModelList.length === 0) && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) || this.buttonDisabled) {
    //     this.saveAndNextEnable = true;
    //   }
    // }
    // else if(this.buttonDisabled) {
    //   this.saveAndNextEnable = true;
    // }
    //   this.siLoanApplicationService.changeData({
    //     formValid: !this.siDocumentDetailsForm.valid ? true : false,
    //     data: this.siLoanDocumentsModel,
    //     // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
    //     isDisable: this.saveAndNextEnable,
    //     stepperIndex: 8,
    //   });
    // }
    updateData() {
      const mandatoryDocuments = this.requiredDocumentList ? 
          this.requiredDocumentList.filter((doc:any) => doc.isRequired) : [];
  
      const allMandatoryUploaded = mandatoryDocuments.every((doc:any) =>
          this.documentModelList?.some(uploadedDoc => uploadedDoc.documentType === doc.documentType)
      );
      if (mandatoryDocuments.length > 0) {
          this.requiredDocumentsNamesText = "Please Upload Mandatory Documents (";
          this.requiredDocumentsNamesText += mandatoryDocuments.map((doc:any) => `'${doc.documentTypeName}'`).join(", ");
          this.requiredDocumentsNamesText += ")";
          this.mandatoryDoxsTextShow = true;
      } else {
          this.mandatoryDoxsTextShow = false;
      }
      if (mandatoryDocuments.length > 0) {
          this.saveAndNextEnable = allMandatoryUploaded;
      } else {
          this.saveAndNextEnable = this.documentModelList?.length > 0 ;
      }
      this.siLoanDocumentsModel.siLoanApplicationId = this.loanAccId;
      this.siLoanDocumentsModel.admissionNumber = this.admissionNumber;
      this.siLoanDocumentsModel.memberTypeName  = this.memberTypeName;
      this.siLoanDocumentsModel.memberType  = this.memberTypeId;
      this.siLoanDocumentsModel.memberId  = this.memberId;
      this.siLoanApplicationService.changeData({
        formValid: !this.siDocumentDetailsForm.valid ? true : false,
        data: this.siLoanDocumentsModel,
        // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
        isDisable:  this.buttonDisabled,
        stepperIndex: 8,
      });
  }

    delete(rowDataId: any) {
      this.siLoanDocumentsDetailsService.deleteSILoanDocumentsDetails(rowDataId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.documentModelList = this.responseModel.data;
            this.getAllSILoanDocumentDetailsLoanAccId(this.loanAccId);
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.data.statusMsg }];
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
     * @author k.yamuna
     * @implements get all documents by savings accoun application
     * @argument loanAccId:Number
     */
    getAllSILoanDocumentDetailsLoanAccId(loanAccId : any) {
      this.siLoanDocumentsDetailsService.getSILoanDocumentsDetailsByLoanAccId(this.loanAccId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            // this.documentModelList = [];
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
              this.documentModelList = this.responseModel.data;
              if (this.documentModelList.length > 0 &&  this.documentModelList != null && this.documentModelList != undefined) {
                this.editDocumentOfKycFalg = true;
                for (let document of this.documentModelList) {
                  this.buttonDisabled = false;
                  if(document.filePath != null && document.filePath != undefined){
                    document.multipartFileList  = this.fileUploadService.getFile(document.filePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);
                  }
                  this.updateData();
                }
              }
            }
            else{
              this.siLoanDocumentsModel =new  SiLoanDocuments();
              this.isFileUploaded = applicationConstants.FALSE;
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
              this.updateData();
            }
          }
        }
        // this.getSILoanAccountDetailsById(loanAccId);
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    /**
     * @author k.yamuna
     * @implements save docment
     * @argument siLoanDocumentsModel
     */
    saveDocument(row: any) {
      this.siLoanDocumentsModel.siLoanApplicationId = this.loanAccId;
      this.siLoanDocumentsModel.admissionNumber = this.admissionNumber;
      this.siLoanDocumentsModel.memberTypeName = this.memberTypeName;
      this.siLoanDocumentsModel.memberType = this.memberTypeId;
      this.siLoanDocumentsModel.memberId = this.memberId;
      this.siLoanDocumentsModel.status = applicationConstants.ACTIVE;
      if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.siLoanDocumentsModel.documentType);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
          this.siLoanDocumentsModel.documentTypeName = filteredObj.label;
        }
      }
      this.siLoanDocumentsDetailsService.addSILoanDocumentsDetails(this.siLoanDocumentsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.siLoanDocumentsModel = this.responseModel.data[0];
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
        this.getAllSILoanDocumentDetailsLoanAccId(this.loanAccId);
        this.updateData();
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
     * @author k.yamuna
     * @implements get sbAccount details by loanAccId
     * @argument loanAccId
     */
    getSILoanAccountDetailsById(id: any) {
      this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanApplicationModel = this.responseModel.data[0];             
               if (this.responseModel.data[0].accountOpenDate != null && this.responseModel.data[0].accountOpenDate != undefined) {
                this.accountOpeningDateVal = this.datePipe.transform(this.responseModel.data[0].accountOpenDate, this.orgnizationSetting.datePipe);
              }
              if (this.responseModel.data[0].siProductId != null && this.responseModel.data[0].siProductId != undefined) {
                this.siproductId = this.responseModel.data[0].siProductId;
              }
            
              if(this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined){
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
              if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
              }
              if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
                this.memberTypeId = this.responseModel.data[0].memberTypeId;
              }
              // this.getAllDocumentTypesByProductId();
              //required documents
              if(this.responseModel.data[0].siLoanDocumentsDetailsDTOList != null && this.responseModel.data[0].siLoanDocumentsDetailsDTOList != undefined){
                this.documentNameList = this.responseModel.data[0].siLoanDocumentsDetailsDTOList.filter((docs: any) => docs.status == applicationConstants.ACTIVE).map((count: any) => {
                  return { label: count.documentTypeName, value: count.documentType }
                });
              }
              if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
              //kyc list
              if(this.responseModel.data[0].siLoanDocumentsDetailsDTOList != null && this.responseModel.data[0].siLoanDocumentsDetailsDTOList != undefined){
                this.documentModelList = this.responseModel.data[0].siLoanDocumentsDetailsDTOList;
                for (let kyc of this.documentModelList) {
                  if(kyc.filePath != null && kyc.filePath != undefined){
                    kyc.multipartFileList  = this.fileUploadService.getFile(kyc.filePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.filePath);
                  }
                }
              }
              else{
                this.addDocumentOfKycFalg = true;
                this.buttonDisabled = true;
              }
              this.getAllDocumentTypesByProductId();
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
     * @author k.yamuna
     * @implements get sbAccount details by loanAccId
     * @argument loanAccId
     */
    addDocument(event: any) {
      this.getAllDocumentTypesByProductId();
      this.isFileUploaded = applicationConstants.FALSE;
      this.multipleFilesList = [];
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = true;
      this.editButtonDisable = true;
      this.siLoanDocumentsModel = new SiLoanDocuments();
      this.updateData();
    }
  
 
    cancel() {
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.getAllSILoanDocumentDetailsLoanAccId(this.loanAccId);
      this.updateData();
    }

    onClick() {
      this.addDocumentOfKycFalg = true;
    }
  
   /**
     * @author k.yamuna
     * @implements edit document
     * @argument index(position of document card),requiredDocumentModel
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
      this.getDocumentsById(modelData.id);
      this.updateData();
  
    }
 
    editCancle() {
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
        this.getAllSILoanDocumentDetailsLoanAccId(this.loanAccId);
      this.updateData();
    }
  

    editsave(row: any) {
      this.getAllDocumentTypesByProductId();

      this.siLoanDocumentsModel.siLoanApplicationId = this.loanAccId;
      this.siLoanDocumentsModel.admissionNumber = this.admissionNumber;
      this.siLoanDocumentsModel.memberTypeName = this.memberTypeName;
      this.siLoanDocumentsModel.memberType = this.memberTypeId;
      this.siLoanDocumentsModel.memberId = this.memberId;
      this.editDocumentOfKycFalg = true;
      if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.siLoanDocumentsModel.documentType);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
          this.siLoanDocumentsModel.documentTypeName = filteredObj.label;
        }
      }
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.siLoanDocumentsDetailsService.updateSILoanDocumentsDetails(this.siLoanDocumentsModel).subscribe((response: any) => {
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
        this.getAllSILoanDocumentDetailsLoanAccId(this.loanAccId);
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
     * @author k.yamuna
     * @implements get document by loanAccId 
     * @argument loanAccId (Number)
     */
    getDocumentsById(id: any) {
      this.siLoanDocumentsDetailsService.getSILoanDocumentsDetailsById(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siLoanDocumentsModel = this.responseModel.data[0];
                if (this.siLoanDocumentsModel.filePath != undefined) {
                  if(this.siLoanDocumentsModel.filePath != null && this.siLoanDocumentsModel.filePath != undefined){
                    this.siLoanDocumentsModel.multipartFileList  = this.fileUploadService.getFile(this.siLoanDocumentsModel.filePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanDocumentsModel.filePath);
                    this.isFileUploaded = applicationConstants.TRUE;
                  }
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
  
    deletDilogBox(rowData: any) {
      this.displayDialog = true;
      if (rowData.id != null && rowData.id != undefined) {
        this.deleteId = rowData.id;
      }
    }
  
    cancelForDialogBox() {
      this.displayDialog = false;
    }
  
    submitDelete() {
      if (this.deleteId != null && this.deleteId != undefined) {
        this.delete(this.deleteId);
      }
      this.displayDialog = false;
    }
  
    /**
     * @implements onFile remove
     * @author k.yamuna
     */
    fileRemoeEvent(){
      this.isFileUploaded = applicationConstants.FALSE;
     if(this.siLoanDocumentsModel.filesDTOList != null && this.siLoanDocumentsModel.filesDTOList != undefined && this.siLoanDocumentsModel.filesDTOList.length > 0){
      let removeFileIndex = this.siLoanDocumentsModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.siLoanDocumentsModel.filePath);
      if(removeFileIndex != null && removeFileIndex != undefined){
        this.siLoanDocumentsModel.filesDTOList[removeFileIndex] = null;
        this.siLoanDocumentsModel.filePath = null;
      }
     }
    }
    onClickdocPhotoCopy(){
      this.docPhotoCopyZoom = true;
    }
    docclosePhoto(){
      this.docPhotoCopyZoom = false;
    }
    docclosePhotoCopy() {
      this.docPhotoCopyZoom = false;
    }

}