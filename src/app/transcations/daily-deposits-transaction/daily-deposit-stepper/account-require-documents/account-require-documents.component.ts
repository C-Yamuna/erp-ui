import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Accounts } from '../../shared/accounts.model';
import { RequiredDocuments } from '../../daily-deposits-product-definition/add-daily-deposits-product-definition/required-documents/shared/required-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { AccountRequriedDocuments } from '../../shared/account-requried-documents.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-account-require-documents',
  templateUrl: './account-require-documents.component.html',
  styleUrls: ['./account-require-documents.component.css']
})
export class AccountRequireDocumentsComponent {
  requiredForm: any;
  orgnizationSetting: any;
  showForm: any;
  documentsData: any [] =[];
  accId: any;
  isEdit: boolean = false;
  buttonDisabled: boolean = false;
  columns: any[] = [];
  uploadFlag: boolean = false;
  editIndex: any;
  deleteId: any;
  kyc: any;
  checked: any;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  minBalence: any;
  accountOpeningDateVal: any;
  documentTypeList: any[] = [];
  requiredDocumentDetails: AccountRequriedDocuments = new AccountRequriedDocuments();
  accountsModel:Accounts = new Accounts();
  fileName: any;
  kycModelList: any[] = [];
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
  accountNumber: any;
  depositDate: any;
  depositAmount: any;
  mandatoryDoxsTextShow: boolean = false;
  requiredDocumentsNamesText: any;

  constructor(private router: Router, 
    private formBuilder: FormBuilder, 
    private commonComponent: CommonComponent, 
    private activateRoute: ActivatedRoute, 
    private encryptDecryptService: EncryptDecryptService, 
    private commonFunctionsService: CommonFunctionsService, 
    private datePipe: DatePipe , 
    private fileUploadService : FileUploadService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService) {
    this.requiredForm = this.formBuilder.group({
      'documentNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'requiredDocumentTypeName': new FormControl('', Validators.required),
      'requiredDocumentFilePath': new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if(params['id'] != undefined ) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.accId = Number(queryParams);
        this.getRdRequiredDocsByaccId(this.accId);
        this.isEdit = true;      
      }else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.columns = [
      { field: 'requiredDocumentTypeName', header: 'TERMDEPOSITS.KYC_DOCUMENT_NAME' },
      { field: 'documentNumber', header: 'TERMDEPOSITS.KYC_DOCUMENT_NUMBER' },
      { field: 'requiredDocumentFilePath', header: 'TERMDEPOSITS.KYC_DOCUMENT' }
    ];
    
    this.getRdAccountDetailsById(this.accId);
    this.updateData();
  }

  getAllKycTypes() {
    this.dailyDepositsAccountsService.getAllRequiredDocuments(this.accountsModel.productId).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((document: any) => document.status == applicationConstants.ACTIVE && document.productId == this.accountsModel.productId).map((count: any) => {
          return { label: count.documentTypeName, value: count.documentTypeId, isMandatory:count.isRequired  }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.requiredDocumentDetails.accId != null && data.value == this.requiredDocumentDetails.accId);
        if (filteredObj != null && undefined != filteredObj)
          this.requiredDocumentDetails.requiredDocumentTypeName = filteredObj.label;
        let i = 0;
        for (let doc of this.documentNameList) {
          if (i == 0)
            this.requiredDocumentsNamesText = "Please Upload Mandatory Required Documents ("
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
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  save() {
    this.updateData();
  }
  updateData() {
    this.requiredDocumentDetails.accId = this.accId;
    this.requiredDocumentDetails.admissionNumber = this.admissionNumber;
    this.requiredDocumentDetails.memberTypeName  = this.memberTypeName;
    this.requiredDocumentDetails.memberType  = this.memberTypeId;
    this.requiredDocumentDetails.memberId  = this.memberId;
    this.requiredDocumentDetails.accountNumber = this.accountNumber;
    this.dailyDepositsAccountsService.changeData({
      formValid: !this.requiredForm.valid ? true : false,
      data: this.requiredDocumentDetails,
      isDisable: this.buttonDisabled,
      stepperIndex: 6,
    });
  }
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.requiredDocumentDetails.filesDTOList = [];
    this.requiredDocumentDetails.requiredDocumentFilePath = null;
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
          this.requiredDocumentDetails.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.requiredDocumentDetails.filesDTOList[0].fileName = "DAILY_DEPOSITS_REQUIRED_DOCUMENTS" + this.accId + "_" +timeStamp+ "_"+ file.name ;
        this.requiredDocumentDetails.requiredDocumentFilePath = "DAILY_DEPOSITS_REQUIRED_DOCUMENTS" + this.accId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as requiredDocumentFilePath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
  delete(id: any) {
    this.dailyDepositsAccountsService.deleteRequiredDocument(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
          this.getRdRequiredDocsByaccId(this.accId);
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
  getRdRequiredDocsByaccId(accId : any) {
    this.dailyDepositsAccountsService.getRequiredDocsByAccId(accId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.kycModelList = this.responseModel.data;
            if (this.kycModelList.length > 0 &&  this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                this.buttonDisabled = false;
                if(kyc.requiredDocumentFilePath != null && kyc.requiredDocumentFilePath != undefined){
                  kyc.multipartFileList  = this.fileUploadService.getFile(kyc.requiredDocumentFilePath ,ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.requiredDocumentFilePath);
                }
                this.updateData();
              }
            }
            else{
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
              this.updateData();
            }
            if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length >0) {
              let i = 0;
              for (let doc of this.documentNameList) {
                if (i == 0)
                  this.requiredDocumentsNamesText = "Please Upload Mandatory Required Documents ("
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
        }
      }
      // this.getRdAccountById(accId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  getRdAccountDetailsById(id: any) {
    this.dailyDepositsAccountsService.getAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
              this.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].productName != null && this.responseModel.data[0].productName != undefined) {
              this.productName = this.responseModel.data[0].productName;
            }
            if (this.responseModel.data[0].adminssionNumber != null && this.responseModel.data[0].adminssionNumber != undefined) {
              this.admissionNumber = this.responseModel.data[0].adminssionNumber;
            }
            if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
            
            if (this.responseModel.data[0].depositAmount != null && this.responseModel.data[0].depositAmount != undefined) {
              this.depositAmount = this.responseModel.data[0].depositAmount;
            }
            this.getAllKycTypes()
            if(this.responseModel.data[0].rdRequiredDocumentDetailsDTOList != null && this.responseModel.data[0].rdRequiredDocumentDetailsDTOList != undefined){
              this.kycModelList = this.responseModel.data[0].rdRequiredDocumentDetailsDTOList;
              for (let kyc of this.kycModelList) {
                if(kyc.requiredDocumentFilePath != null && kyc.requiredDocumentFilePath != undefined){
                  kyc.multipartFileList  = this.fileUploadService.getFile(kyc.requiredDocumentFilePath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.requiredDocumentFilePath);
                }
              }
            }
            else{
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
            }
             
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
  saveDocument(row: any) {
    this.requiredDocumentDetails.accId = this.accId;
    this.requiredDocumentDetails.admissionNumber = this.admissionNumber;
    this.requiredDocumentDetails.memberTypeName  = this.memberTypeName;
    this.requiredDocumentDetails.memberType  = this.memberTypeId;
    this.requiredDocumentDetails.memberId  = this.memberId;
    this.requiredDocumentDetails.status  = applicationConstants.ACTIVE;
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.requiredDocumentDetails.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.requiredDocumentDetails.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.dailyDepositsAccountsService.saveRequiredDocument(this.requiredDocumentDetails).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.requiredDocumentDetails = this.responseModel.data[0];
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
      this.getRdRequiredDocsByaccId(this.accId);
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
   * @author bhargavi
   * @implements get rdAccount details by accId
   * @argument accId
   */
  addDocument(event: any) {
    this.getAllKycTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.requiredDocumentDetails = new AccountRequriedDocuments();
    this.updateData();
  }

   /**
   * @author bhargavi
   * @implements cancle document add/update
   */
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getRdRequiredDocsByaccId(this.accId);
    this.updateData();
  }
  
  /**
   * @author bhargavi
   * @implements onclick event for add document
   */
  onClick() {
    this.addDocumentOfKycFalg = true;
  }

 /**
   * @author bhargavi
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
  /**
   * @author bhargavi
   * @implements edit  document cancel
   */
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
      this.getRdRequiredDocsByaccId(this.accId);
    
    this.updateData();
  }

   /**
   * @author bhargavi
   * @implements edit document save
   */
  editsave(row: any) {
    this.getAllKycTypes();
    this.requiredDocumentDetails.accId = this.accId;
    this.requiredDocumentDetails.admissionNumber = this.admissionNumber;
    this.requiredDocumentDetails.memberTypeName  = this.memberTypeName;
    this.requiredDocumentDetails.memberType  = this.memberTypeId;
    this.requiredDocumentDetails.memberId  = this.memberId;
    this.editDocumentOfKycFalg = true;
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.requiredDocumentDetails.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.requiredDocumentDetails.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.dailyDepositsAccountsService.updateRequiredDocument(this.requiredDocumentDetails).subscribe((response: any) => {
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
      this.getRdRequiredDocsByaccId(this.accId);
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
   * @author bhargavi
   * @implements get document by accId 
   * @argument accId (Number)
   */
  getDocumentsById(id: any) {
    this.dailyDepositsAccountsService.getDocuments(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.requiredDocumentDetails = this.responseModel.data[0];
              if (this.requiredDocumentDetails.requiredDocumentFilePath != undefined) {
                if(this.requiredDocumentDetails.requiredDocumentFilePath != null && this.requiredDocumentDetails.requiredDocumentFilePath != undefined){
                  this.requiredDocumentDetails.multipartFileList  = this.fileUploadService.getFile(this.requiredDocumentDetails.requiredDocumentFilePath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.requiredDocumentDetails.requiredDocumentFilePath);

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

  /**
   * @author bhargavi
   * @implements on click delete
   */
  deletDilogBox(rowData:any){
    this.displayDialog = true;
    if(rowData.id != null && rowData.id != undefined){
      this.deleteId = rowData.id;
    }
  }

  /**
   * @author bhargavi
   * @implements cancle delete dialog box
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
   * @author bhargavi
   * @implements submit delete diloge 
   */
  submitDelete(){
    if(this.deleteId != null && this.deleteId != undefined){
      this.delete(this.deleteId);
    }
    
    this.displayDialog = false;
  }

  /**
   * @implements onFile remove
   * @author bhargavi
   */
  fileRemoeEvent(){
   if(this.requiredDocumentDetails.filesDTOList != null && this.requiredDocumentDetails.filesDTOList != undefined && this.requiredDocumentDetails.filesDTOList.length > 0){
    let removeFileIndex = this.requiredDocumentDetails.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.requiredDocumentDetails.requiredDocumentFilePath);
    if(removeFileIndex != null && removeFileIndex != undefined){
      this.requiredDocumentDetails.filesDTOList[removeFileIndex] = null;
      this.requiredDocumentDetails.requiredDocumentFilePath = null;
    }
   }
  }
}
