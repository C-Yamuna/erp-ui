import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';

import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUpload } from 'primeng/fileupload';
import { Responsemodel } from 'src/app/shared/responsemodel';

import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FdCumulativeApplicationService } from '../fd-cumulative-application/shared/fd-cumulative-application.service';
import { FdCummulativeAccountCommunicationService } from '../../../shared/fd-cummulative-account-communication.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FdRequiredDocuments } from './shared/fd-required-documents';
import { FdRequiredDocumentsService } from './shared/fd-required-documents.service';
import { FdCumulativeApplication } from '../fd-cumulative-application/shared/fd-cumulative-application.model';

@Component({
  selector: 'app-required-documents',
  templateUrl: './fd-required-documents.component.html',
  styleUrls: ['./fd-required-documents.component.css']
})
export class FdRequiredDocumentsComponent implements OnInit {
  requiredForm: any;
  orgnizationSetting: any;
  showForm: any;
  documentsData: any[] = [];
  fdCummulativeAccountId: any;
  isEdit: boolean = false;
  buttonDisabled: boolean = false;
  columns: any[] = [];
  uploadFlag: boolean = false;
  editIndex: any;
  deleteId: any;
  document: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  fdRequiredDocumentModel: FdRequiredDocuments = new FdRequiredDocuments();
  fileName: any;
  documentDataList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  documentNameList: any[] = [];
  memberId: any;
  addKycButton: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  editButtonDisable: boolean = false;
  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  admissionNumber: any;
  memberTypeName: any;
  memberTypeId: any;
  displayDialog: boolean = false;
  accountNumber: any;
  depositDate: any;
  depositAmount: any;
  mandatoryDoxsTextShow: boolean = false;
  requiredDocumentsNamesText: any;
  saveAndPreview : boolean = false;
  productId: any;
  docPhotoCopyZoom: boolean = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private fdRequiredDocumentsService: FdRequiredDocumentsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService) {
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
    // this.getAllDocumentTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.fdCummulativeAccountId = Number(queryParams);
        this.getFdCummApplicationById(this.fdCummulativeAccountId);
        // this.getRequiredDocumentByFdCummulativeAccountId(this.fdCummulativeAccountId);
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.columns = [
      { field: 'requiredDocumentTypeName', header: 'TERMDEPOSITS.KYC_DOCUMENT_NAME' },
      { field: 'documentNumber', header: 'TERMDEPOSITS.KYC_DOCUMENT_NUMBER' },
      { field: 'requiredDocumentFilePath', header: 'TERMDEPOSITS.KYC_DOCUMENT' }
    ];

    this.updateData();
  }

  /**
   * @author bhargavi
   * @implements get document types List 
   */
  getAllDocumentTypes(productId: any) {
    this.fdRequiredDocumentsService.getAllRequiredDocumentsFromProductDefinition().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((document: any) => document.status == applicationConstants.ACTIVE && document.fdCummProductId == productId).map((count: any) => {
          return { label: count.documentTypeName, value: count.documentTypeId, isMandatory:count.isRequired  }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.fdRequiredDocumentModel.fdCummulativeAccountId != null && data.value == this.fdRequiredDocumentModel.fdCummulativeAccountId);
        if (filteredObj != null && undefined != filteredObj)
          this.fdRequiredDocumentModel.requiredDocumentTypeName = filteredObj.label;
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
     * @implements document upload 
     */
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.fdRequiredDocumentModel.filesDTOList = [];
    this.fdRequiredDocumentModel.multipartFileList =[];
    this.fdRequiredDocumentModel.requiredDocumentFilePath = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
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
          this.fdRequiredDocumentModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.fdRequiredDocumentModel.filesDTOList[0].fileName = "FD_CUMM_DOC_" + this.fdCummulativeAccountId + "_" +timeStamp+ "_"+ file.name ;
        this.fdRequiredDocumentModel.requiredDocumentFilePath = "FD_CUMM_DOC_" + this.fdCummulativeAccountId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        this.fdRequiredDocumentModel.multipartFileList = this.fdRequiredDocumentModel.filesDTOList;
        let index1 = event.files.findIndex((x: any) => x === file);
        // this.addOrEditKycTempList(this.fdRequiredDocumentModel);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @author bhargavi
   * @implements from data updation to stepper component
   */
  save() {
    this.updateData();
  }
  /**
   * @author bhargavi
   * @implements set values for data updation to stepper component
   */
  updateData() {
    this.fdRequiredDocumentModel.fdCummulativeAccountId = this.fdCummulativeAccountId;
    this.fdRequiredDocumentModel.admissionNumber = this.admissionNumber;
    this.fdRequiredDocumentModel.memberTypeName = this.memberTypeName;
    this.fdRequiredDocumentModel.memberType = this.memberTypeId;
    this.fdRequiredDocumentModel.memberId = this.memberId;
    this.fdRequiredDocumentModel.accountNumber = this.accountNumber;
    //for manadatory KYC Documents check
    this.saveAndPreview = false;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let documentNameList = this.documentNameList.filter((obj: any) => obj.isMandatory);
      if (this.documentDataList != null && this.documentDataList != undefined && this.documentDataList.length > 0 && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) {
        const missingItems = this.documentDataList.filter(document => !documentNameList.some(mandatoryDocument => document.requiredDocumentTypeId === mandatoryDocument.value));
        if ((documentNameList.length != this.documentDataList.length - missingItems.length) || this.buttonDisabled) {
          this.saveAndPreview = true;
        }
      }
      else if (((this.documentDataList == null || this.documentDataList == undefined || this.documentDataList.length === 0) && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) || this.buttonDisabled) {
        this.saveAndPreview = true;
      }
    }
    this.fdCumulativeApplicationService.changeData({
      formValid: !this.requiredForm.valid ? true : false,
      data: this.fdRequiredDocumentModel,
      // isDisable: this.buttonDisabled,
      isDisable: this.saveAndPreview,
      stepperIndex: 6,
    });
  }

  /**
   * @author bhargavi
   * @implements remove documents
   */
  delete(id: any) {
    this.fdRequiredDocumentsService.deleteDocuments(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.documentDataList = this.responseModel.data;
        this.getRequiredDocumentByFdCummulativeAccountId(this.fdCummulativeAccountId);
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
   * @author bhargavi
   * @implements get all documents
   * @argument fdCummulativeAccountId:Number
   */
  getRequiredDocumentByFdCummulativeAccountId(fdCummulativeAccountId: any) {
    this.fdRequiredDocumentsService.getRequiredDocumentByFdCummulativeAccountId(fdCummulativeAccountId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.documentDataList = this.responseModel.data;
            if (this.documentDataList.length > 0 && this.documentDataList != null && this.documentDataList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let document of this.documentDataList) {
                this.buttonDisabled = false;
                if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                  document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
                }
                this.updateData();
              }
            }
            else {
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
              this.updateData();
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

  getFdCummApplicationById(id: any) {
    this.fdCumulativeApplicationService.getFdCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.fdCumulativeApplicationModel = this.responseModel.data[0];
            if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
              this.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].fdCummulativeProductId != null && this.responseModel.data[0].fdCummulativeProductId != undefined) {
              this.productId = this.responseModel.data[0].fdCummulativeProductId;
            }
            this.getAllDocumentTypes(this.productId);
            if (this.responseModel.data[0].productName != null && this.responseModel.data[0].productName != undefined) {
              this.productName = this.responseModel.data[0].productName;
            }
            if (this.responseModel.data[0].adminssionNumber != null && this.responseModel.data[0].adminssionNumber != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
              this.memberTypeName = this.responseModel.data[0].memberTypeName;

            if (this.responseModel.data[0].depositAmount != null && this.responseModel.data[0].depositAmount != undefined) {
              this.depositAmount = this.responseModel.data[0].depositAmount;
            }
            //need to add list in backend
            if (this.responseModel.data[0].fdCummulativeRequiredDocumentDetailsDTOList != null && this.responseModel.data[0].fdCummulativeRequiredDocumentDetailsDTOList != undefined) {
              this.documentDataList = this.responseModel.data[0].fdCummulativeRequiredDocumentDetailsDTOList;
              for (let document of this.documentDataList) {
                if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                  document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
                }
              }
            }
            else {
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
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
            this.updateData();
          }
        } else {
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
   * @author bhargavi
   * @implements save docment
   * @argument fdRequiredDocumentModel
   */
  saveDocument(row: any) {
    this.fdRequiredDocumentModel.fdCummulativeAccountId = this.fdCummulativeAccountId;
    this.fdRequiredDocumentModel.admissionNumber = this.admissionNumber;
    this.fdRequiredDocumentModel.memberTypeName = this.memberTypeName;
    this.fdRequiredDocumentModel.memberType = this.memberTypeId;
    this.fdRequiredDocumentModel.memberId = this.memberId;
    this.fdRequiredDocumentModel.status = applicationConstants.ACTIVE;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.fdRequiredDocumentModel.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.fdRequiredDocumentModel.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.fdRequiredDocumentsService.addDocuments(this.fdRequiredDocumentModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.fdRequiredDocumentModel = this.responseModel.data[0];
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
      this.getRequiredDocumentByFdCummulativeAccountId(this.fdCummulativeAccountId);
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
 * @implements get rdAccount details by fdCummulativeAccountId
 * @argument fdCummulativeAccountId
 */
  addDocument(event: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.getAllDocumentTypes(this.productId);
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.fdRequiredDocumentModel = new FdRequiredDocuments();
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
    this.getRequiredDocumentByFdCummulativeAccountId(this.fdCummulativeAccountId);
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
    this.getRequiredDocumentByFdCummulativeAccountId(this.fdCummulativeAccountId);

    this.updateData();
  }

  /**
  * @author bhargavi
  * @implements edit document save
  */
  editsave(row: any) {
    this.getAllDocumentTypes(this.productId);
    this.fdRequiredDocumentModel.fdCummulativeAccountId = this.fdCummulativeAccountId;
    this.fdRequiredDocumentModel.admissionNumber = this.admissionNumber;
    this.fdRequiredDocumentModel.memberTypeName = this.memberTypeName;
    this.fdRequiredDocumentModel.memberType = this.memberTypeId;
    this.fdRequiredDocumentModel.memberId = this.memberId;
    this.editDocumentOfKycFalg = true;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.fdRequiredDocumentModel.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.fdRequiredDocumentModel.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.fdRequiredDocumentsService.updateDocuments(this.fdRequiredDocumentModel).subscribe((response: any) => {
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
      this.getRequiredDocumentByFdCummulativeAccountId(this.fdCummulativeAccountId);
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
     * @implements get document by fdCummulativeAccountId 
     * @argument fdCummulativeAccountId (Number)
     */
  getDocumentsById(id: any) {
    this.fdRequiredDocumentsService.getDocuments(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.fdRequiredDocumentModel = this.responseModel.data[0];
              if (this.fdRequiredDocumentModel.requiredDocumentFilePath != undefined) {
                if (this.fdRequiredDocumentModel.requiredDocumentFilePath != null && this.fdRequiredDocumentModel.requiredDocumentFilePath != undefined) {
                  this.fdRequiredDocumentModel.multipartFileList = this.fileUploadService.getFile(this.fdRequiredDocumentModel.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdRequiredDocumentModel.requiredDocumentFilePath);
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

  /**
   * @author bhargavi
   * @implements on click delete
   */
  deletDilogBox(rowData: any) {
    this.displayDialog = true;
    if (rowData.id != null && rowData.id != undefined) {
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
  submitDelete() {
    if (this.deleteId != null && this.deleteId != undefined) {
      this.delete(this.deleteId);
    }

    this.displayDialog = false;
  }

  /**
   * @implements onFile remove
   * @author bhargavi
   */
  fileRemoeEvent() {
    if (this.fdRequiredDocumentModel.filesDTOList != null && this.fdRequiredDocumentModel.filesDTOList != undefined && this.fdRequiredDocumentModel.filesDTOList.length > 0) {
      let removeFileIndex = this.fdRequiredDocumentModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdRequiredDocumentModel.requiredDocumentFilePath);
      if (removeFileIndex != null && removeFileIndex != undefined) {
        this.fdRequiredDocumentModel.filesDTOList[removeFileIndex] = null;
        this.fdRequiredDocumentModel.requiredDocumentFilePath = null;
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
