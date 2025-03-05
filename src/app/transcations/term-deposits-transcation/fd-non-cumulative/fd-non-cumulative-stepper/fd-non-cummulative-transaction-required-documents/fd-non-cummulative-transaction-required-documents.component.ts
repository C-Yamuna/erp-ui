import { Component, ElementRef, ViewChild } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdNonCumulativeApplication } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { FdNonCummulativeTransactionRequiredDocuments } from './shared/fd-non-cummulative-transaction-required-documents.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FdNonCumulativeApplicationService } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { FdNonCummulativeTransactionRequiredDocumentsService } from './shared/fd-non-cummulative-transaction-required-documents.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-fd-non-cummulative-transaction-required-documents',
  templateUrl: './fd-non-cummulative-transaction-required-documents.component.html',
  styleUrls: ['./fd-non-cummulative-transaction-required-documents.component.css']
})
export class FdNonCummulativeTransactionRequiredDocumentsComponent {
  requiredForm: any;
  orgnizationSetting: any;
  showForm: any;
  documentsData: any[] = [];
  fdNonCummulativeAccId: any;
  isEdit: boolean = false;
  buttonDisabled: boolean = false;
  columns: any[] = [];
  uploadFlag: boolean = false;
  editIndex: any;
  deleteId: any;
  document: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  fdNonCumulativeApplicationModel: FdNonCumulativeApplication = new FdNonCumulativeApplication();
  fdNonCummulativeRequiredDocumentsModel: FdNonCummulativeTransactionRequiredDocuments = new FdNonCummulativeTransactionRequiredDocuments();
  // fdNonCummulativeRequiredDocumentsModel: FdRequiredDocuments = new FdRequiredDocuments();
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
  saveAndPreview: boolean = false;
  productId: any;
  docPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
    private fdNonCummulativeTransactionRequiredDocumentsService: FdNonCummulativeTransactionRequiredDocumentsService,
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
        this.fdNonCummulativeAccId = Number(queryParams);
        this.getFdNonCummApplicationById(this.fdNonCummulativeAccId);
        // this.getRequiredDocumentByFdCummulativeAccountId(this.fdNonCummulativeAccId);
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
    this.fdNonCummulativeTransactionRequiredDocumentsService.getAllRequiredDocumentsFromFdNonCummulativeProductDefinition().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((document: any) => document.status == applicationConstants.ACTIVE && document.fdNonCummProductId == productId).map((count: any) => {
          return { label: count.documentTypeName, value: count.documentTypeId, isMandatory: count.isRequired }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.fdNonCummulativeRequiredDocumentsModel.fdNonCummulativeAccountId != null && data.value == this.fdNonCummulativeRequiredDocumentsModel.fdNonCummulativeAccountId);
        if (filteredObj != null && undefined != filteredObj)
          this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentTypeName = filteredObj.label;
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
    this.fdNonCummulativeRequiredDocumentsModel.multipartFileList = [];
    this.multipleFilesList = [];
    this.fdNonCummulativeRequiredDocumentsModel.filesDTOList = [];
    this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath = null;

    for (let file of event.files) {
      let fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > 5) {
        this.msgs = [{
          severity: 'warning',
          summary: applicationConstants.STATUS_WARN,
          detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_5MB
        }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
        continue;
      }

      let reader = new FileReader();
      reader.onloadend = (e) => {
        this.isFileUploaded = applicationConstants.TRUE;
        if (!e.target || !e.target.result) {
          return;
        }
        let filesDTO = new FileUploadModel();
        this.uploadFileData = e.target as FileReader;
        filesDTO.fileName = `FD_NON_CUM_REQUIRED_DOCUMENT_${this.memberId}_${this.commonComponent.getTimeStamp()}_${file.name}`;
        filesDTO.fileType = file.type.split('/')[1];
        filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
        filesDTO.imageValue = this.uploadFileData.result as string;

        this.fdNonCummulativeRequiredDocumentsModel.filesDTOList.push(filesDTO);
        this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath = filesDTO.fileName;

        let index1 = event.files.indexOf(file);
        if (index1 > -1) {
          fileUpload.remove(event, index1);
        }
        fileUpload.clear();
      };

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
    this.fdNonCummulativeRequiredDocumentsModel.fdNonCummulativeAccountId = this.fdNonCummulativeAccId;
    this.fdNonCummulativeRequiredDocumentsModel.admissionNumber = this.admissionNumber;
    this.fdNonCummulativeRequiredDocumentsModel.memberTypeName = this.memberTypeName;
    this.fdNonCummulativeRequiredDocumentsModel.accountNumber = this.accountNumber;
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
    this.fdNonCumulativeApplicationService.changeData({
      formValid: !this.requiredForm.valid ? true : false,
      data: this.fdNonCummulativeRequiredDocumentsModel,
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
    this.fdNonCummulativeTransactionRequiredDocumentsService.deleteDocuments(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.documentDataList = this.responseModel.data;
        this.getRequiredDocumentByFdCummulativeAccountId(this.fdNonCummulativeAccId);
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
        this.updateData();
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
   * @argument fdNonCummulativeAccId:Number
   */
  getRequiredDocumentByFdCummulativeAccountId(fdNonCummulativeAccId: any) {
    this.fdNonCummulativeTransactionRequiredDocumentsService.getRequiredDocumentByFdNonCummulativeAccountId(fdNonCummulativeAccId).subscribe((response: any) => {
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

  getFdNonCummApplicationById(id: any) {
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
            if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
              this.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].fdNonCummulativeproductId != null && this.responseModel.data[0].fdNonCummulativeproductId != undefined) {
              this.productId = this.responseModel.data[0].fdNonCummulativeproductId;
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
            if (this.responseModel.data[0].fdNonCummulativeRequiredDocumentDetailsDTOList != null && this.responseModel.data[0].fdNonCummulativeRequiredDocumentDetailsDTOList != undefined) {
              this.documentDataList = this.responseModel.data[0].fdNonCummulativeRequiredDocumentDetailsDTOList;
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
            if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
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
   * @argument fdNonCummulativeRequiredDocumentsModel
   */
  saveDocument(row: any) {
    this.fdNonCummulativeRequiredDocumentsModel.fdNonCummulativeAccountId = this.fdNonCummulativeAccId;
    this.fdNonCummulativeRequiredDocumentsModel.admissionNumber = this.admissionNumber;
    this.fdNonCummulativeRequiredDocumentsModel.memberTypeName = this.memberTypeName;
    this.fdNonCummulativeRequiredDocumentsModel.memberType = this.memberTypeId;
    this.fdNonCummulativeRequiredDocumentsModel.memberId = this.memberId;
    this.fdNonCummulativeRequiredDocumentsModel.status = applicationConstants.ACTIVE;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.fdNonCummulativeTransactionRequiredDocumentsService.addDocuments(this.fdNonCummulativeRequiredDocumentsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.fdNonCummulativeRequiredDocumentsModel = this.responseModel.data[0];
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
      this.getRequiredDocumentByFdCummulativeAccountId(this.fdNonCummulativeAccId);
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
 * @implements get rdAccount details by fdNonCummulativeAccId
 * @argument fdNonCummulativeAccId
 */
  addDocument(event: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.getAllDocumentTypes(this.productId);
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.fdNonCummulativeRequiredDocumentsModel = new FdNonCummulativeTransactionRequiredDocuments;
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
    this.getRequiredDocumentByFdCummulativeAccountId(this.fdNonCummulativeAccId);
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
    * @argument index(position of document card),fdNonCummulativeRequiredDocumentsModel
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
    this.getRequiredDocumentByFdCummulativeAccountId(this.fdNonCummulativeAccId);

    this.updateData();
  }

  /**
  * @author bhargavi
  * @implements edit document save
  */
  editsave(row: any) {
    this.getAllDocumentTypes(this.productId);
    this.fdNonCummulativeRequiredDocumentsModel.fdNonCummulativeAccountId = this.fdNonCummulativeAccId;
    this.fdNonCummulativeRequiredDocumentsModel.admissionNumber = this.admissionNumber;
    this.fdNonCummulativeRequiredDocumentsModel.memberTypeName = this.memberTypeName;
    this.fdNonCummulativeRequiredDocumentsModel.memberType = this.memberTypeId;
    this.fdNonCummulativeRequiredDocumentsModel.memberId = this.memberId;
    this.editDocumentOfKycFalg = true;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.fdNonCummulativeTransactionRequiredDocumentsService.updateDocuments(this.fdNonCummulativeRequiredDocumentsModel).subscribe((response: any) => {
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
      this.getRequiredDocumentByFdCummulativeAccountId(this.fdNonCummulativeAccId);
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
     * @implements get document by fdNonCummulativeAccId 
     * @argument fdNonCummulativeAccId (Number)
     */
  getDocumentsById(id: any) {
    this.fdNonCummulativeTransactionRequiredDocumentsService.getDocuments(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.fdNonCummulativeRequiredDocumentsModel = this.responseModel.data[0];
              if (this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath != undefined) {
                if (this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath != null && this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath != undefined) {
                  this.fdNonCummulativeRequiredDocumentsModel.multipartFileList = this.fileUploadService.getFile(this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath);
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
    this.updateData();
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
    this.updateData();
  }
  /**
   * @implements documents duplicate check
   * @author bhargavi
   */
  documentDuplicate(id: any) {
    if (id != null && id != undefined) {
      if (this.documentDataList != null && this.documentDataList != undefined && this.documentDataList.length > 0) {
        for (let item of this.documentDataList) {
          if (item != null && item != undefined && item.requiredDocumentTypeId === id) {
            this.requiredForm.reset();
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Required Document already exists" }];
            setTimeout(() => {
              this.msgs = [];
            }, 1500);
          }
        }
      }
    }
  }
  /**
   * @implements onFile remove
   * @author bhargavi
   */
  fileRemoeEvent() {
    this.isFileUploaded = applicationConstants.FALSE;
    if (this.fdNonCummulativeRequiredDocumentsModel.filesDTOList != null && this.fdNonCummulativeRequiredDocumentsModel.filesDTOList != undefined && this.fdNonCummulativeRequiredDocumentsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.fdNonCummulativeRequiredDocumentsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath);
      if (removeFileIndex != null && removeFileIndex != undefined) {
        this.fdNonCummulativeRequiredDocumentsModel.filesDTOList[removeFileIndex] = null;
        this.fdNonCummulativeRequiredDocumentsModel.requiredDocumentFilePath = null;
      }
    }
  }

  onClickdocPhotoCopy(rowData: any) {
    this.multipleFilesList = [];
    this.docPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  docclosePhoto() {
    this.docPhotoCopyZoom = false;
  }
  docclosePhotoCopy() {
    this.docPhotoCopyZoom = false;
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
