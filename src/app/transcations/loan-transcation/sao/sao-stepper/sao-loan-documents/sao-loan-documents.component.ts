import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { MembershipBasicDetailsService } from '../membership-basic-details/shared/membership-basic-details.service';
import { DatePipe } from '@angular/common';
import { SaoKycService } from '../sao-kyc/shared/sao-kyc.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { SaoLoanDocument } from './shared/sao-loan-document.model';
import { SaoLoanDocumentsDetailsService } from './shared/sao-loan-documents-details.service';
import { SaoRequiredDocumentsConfigService } from '../../../shared/sao-loans/sao-required-documents-config.service';

@Component({
  selector: 'app-sao-loan-documents',
  templateUrl: './sao-loan-documents.component.html',
  styleUrls: ['./sao-loan-documents.component.css']
})
export class SaoLoanDocumentsComponent {
  @ViewChild('dt', { static: false })
  private dt!: Table;
  documentForm: FormGroup;
  date: Date | undefined;
  documentModelList: any[] = [];
  displayDialog: boolean = false;
  admissionnumber: any;
  addButton: boolean = false;
  gridList: any[] = [];
  carrats: any[] | undefined;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  isEdit: boolean = false;
  buttonDisabled: boolean = false;
  loanId: any;
  docFilesList: any[] = [];
  documentNameList: any[] = [];
  requiredDocumentList: any;
  multipleFilesList: any[] = [];
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  editButtonDisable: boolean = false;
  isFileUploaded: boolean = false;
  addDocumentButton: boolean = false;
  buttonsFlag: boolean = true;
  uploadFileData: any;
  orgnizationSetting: any;
  admissionNumber: any;
  editIndex: any;
  saoLoanDocumentModel: SaoLoanDocument = new SaoLoanDocument();
  saoLoanApplicationModel: SaoLoanApplication = new SaoLoanApplication();
  memberTypeName: any;
  memberTypeId: any;
  memberId: any;
  productId: any;
  requiredDocumentsNamesText: any;
  mandatoryDoxsTextShow: boolean = false;
  saveAndNextEnable: boolean = false;
  isMaximized: boolean = false;
  docPhotoCopyZoom: boolean = false;
  deleteId: any;

  constructor(private router: Router, private formBuilder: FormBuilder, private saoLoanDocumentsDetailsService: SaoLoanDocumentsDetailsService, private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent, private encryptDecryptService: EncryptDecryptService, private saoLoanApplicationService: SaoLoanApplicationService,
    private saoRequiredDocumentsConfigService: SaoRequiredDocumentsConfigService, private datePipe: DatePipe, private fileUploadService: FileUploadService) {
    this.documentForm = this.formBuilder.group({
      'documentTypeName': new FormControl('', Validators.required),
      'documentNo': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'filePath': new FormControl('',),
      'remarks': new FormControl(''),
    });
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        this.loanId = Number(this.encryptDecryptService.decrypt(params['id']));
        this.getApplicationDetailsById(this.loanId);
        this.isEdit = true;

      } else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.updateData();
    // this.getDocumentsByProductDefinition(this.productId);
  }
  updateData() {
    const mandatoryDocuments = this.requiredDocumentList ? 
          this.requiredDocumentList.filter((doc:any) => doc.isRequired) : [];
  
      const allMandatoryUploaded = mandatoryDocuments.every((doc:any) =>
          this.documentModelList?.some(uploadedDoc => uploadedDoc.documentType === doc.documentType)
      );
  
      if (mandatoryDocuments.length > 0) {
        const documentNames = mandatoryDocuments.map((doc:any) => doc.documentTypeName).join(",");
        this.requiredDocumentsNamesText = `Please Upload Mandatory Required Documents: "${documentNames}"`;
        this.mandatoryDoxsTextShow = true;
      } else {
          this.mandatoryDoxsTextShow = false;
      }
      if (mandatoryDocuments.length > 0) {
        this.saveAndNextEnable = allMandatoryUploaded && this.buttonsFlag;
      } else {
        this.saveAndNextEnable = this.documentModelList?.length > 0 && this.buttonsFlag;
      }
    this.saoLoanDocumentModel.saoLoanApplicationId = this.loanId;
    this.saoLoanDocumentModel.admissionNumber = this.admissionNumber;
    this.saoLoanDocumentModel.memberTypeName = this.memberTypeName;
    this.saoLoanApplicationService.changeData({
      formValid: !this.documentForm.valid ? true : false,
      data: this.saoLoanDocumentModel,
      isDisable: !this.saveAndNextEnable,
      // isDisable:false,
      stepperIndex: 4,
    });
  }
  save() {
    this.updateData();
  }
  onClick() {
    this.addDocumentOfKycFalg = true;
  }
  //@akhila
  //add document
  addDocument(event: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.getDocumentsByProductDefinition(this.productId);
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.buttonsFlag = false;
    this.saveAndNextEnable = false;
    this.editButtonDisable = true;
    this.saoLoanDocumentModel = new SaoLoanDocument;
    this.updateData();
  }

  //add cancle 
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.buttonsFlag = true;
    this.saveAndNextEnable = true;
    this.getSaoLoanDocumentsDetailsByApplicationId(this.loanId);
    this.updateData();
  }

  //add save
  saveDocument(row: any) {
    this.saoLoanDocumentModel.saoLoanApplicationId = this.loanId;
    this.saoLoanDocumentModel.admissionNumber = this.admissionNumber;
    this.saoLoanDocumentModel.memberTypeName = this.memberTypeName;
    this.saoLoanDocumentModel.memberType = this.memberTypeId;
    this.saoLoanDocumentModel.memberId = this.memberId;
    this.saoLoanDocumentModel.status = applicationConstants.ACTIVE;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.saoLoanDocumentModel.documentTypeName);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.saoLoanDocumentModel.documentTypeName = filteredObj.label;
      }
      if (filteredObj != null && undefined != filteredObj && filteredObj.value != null && filteredObj.value != undefined) {
        this.saoLoanDocumentModel.documentType = filteredObj.value;
      }
    }

    this.saoLoanDocumentsDetailsService.addSaoLoanDocumentsDetails(this.saoLoanDocumentModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saoLoanDocumentModel = this.responseModel.data[0];
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
      this.buttonsFlag = true;
      this.saveAndNextEnable = true;
      this.addDocumentButton = false;
      this.addDocumentOfKycFalg = false;
      this.buttonDisabled = false;
      this.getSaoLoanDocumentsDetailsByApplicationId(this.loanId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
    // this.addDocumentOfKycFalg = false;
    // this.editButtonDisable = false;
    // this.getSaoLoanDocumentsDetailsByApplicationId(this.loanId);
    this.updateData();
  }
  //get document details by document id for edit purpose
  getDocumentDetailsById(id: any) {
    this.getDocumentsByProductDefinition(this.productId);
    this.saoLoanDocumentsDetailsService.getSaoLoanDocumentsDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.saoLoanDocumentModel = this.responseModel.data[0];
              if (this.saoLoanDocumentModel.filePath != undefined) {
                let multipleFilesListForView = [];
                let file = new FileUploadModel();
                file.imageValue = ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoLoanDocumentModel.filePath;
                let objects = this.saoLoanDocumentModel.filePath.split('.');
                file.fileType = objects[objects.length - 1];
                let name = this.saoLoanDocumentModel.filePath.replace(/ /g, "_");
                file.fileName = name
                multipleFilesListForView.push(file);
                this.saoLoanDocumentModel.multipartFileList = multipleFilesListForView;
                this.isFileUploaded = applicationConstants.TRUE;
              }
            }
          }
          this.updateData();
        }
      }
    });
  }

  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.veiwCardHide = false;
    this.buttonsFlag = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.saveAndNextEnable = false;
    this.getDocumentsByProductDefinition(this.productId);
    this.getDocumentDetailsById(modelData.id);

    this.updateData();

  }
  //delete document
  delete(rowDataId: any) {
    this.saoLoanDocumentsDetailsService.deleteSaoLoanDocumentsDetails(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.documentModelList = this.responseModel.data;
        this.getSaoLoanDocumentsDetailsByApplicationId(this.loanId);
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
  //edit cancle
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.buttonsFlag = true;
    this.saveAndNextEnable = true;
    this.getSaoLoanDocumentsDetailsByApplicationId(this.loanId);
    this.updateData();
  }

  //edit kyc save
  editsave(row: any) {
    this.saoLoanDocumentModel.saoLoanApplicationId = this.loanId;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.saoLoanDocumentModel.documentType != null && data.value == this.saoLoanDocumentModel.documentType);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.saoLoanDocumentModel.documentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.saoLoanDocumentsDetailsService.updateSaoLoanDocumentsDetails(this.saoLoanDocumentModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saveAndNextEnable = true;
        this.buttonsFlag = true;
        this.updateData();
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
      this.addDocumentButton = false;
      this.buttonDisabled = false;
      this.getSaoLoanDocumentsDetailsByApplicationId(this.loanId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  //image upload and document path save
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.saoLoanDocumentModel.filesDTOList = [];
    this.saoLoanDocumentModel.multipartFileList = [];
    this.saoLoanDocumentModel.filePath = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      this.isFileUploaded = applicationConstants.TRUE;
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
          this.saoLoanDocumentModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.saoLoanDocumentModel.filesDTOList[0].fileName = "LOAN_DOCUMENT_" + this.loanId + "_" + timeStamp + "_" + file.name;
        this.saoLoanDocumentModel.filePath = "LOAN_DOCUMENT_" + this.loanId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
  
  /**
   * @implements get documents by product deffinition
   * @param id 
   * @author akhila.m
   */
  getDocumentsByProductDefinition(id: any) {
    this.saoRequiredDocumentsConfigService.getAllSaoRequiredDocumentsConfigsByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
              return { label: count.documentTypeName, value: count.documentType }
            });
            this.requiredDocumentList = this.responseModel.data.filter((obj: any) => obj != null && obj.isRequired == applicationConstants.TRUE);
            this.updateData();
          }
        }
        else {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
        }
      }
    });
  }

  //get all document details by loan application id
  getSaoLoanDocumentsDetailsByApplicationId(loanId: any) {
    this.saoLoanDocumentsDetailsService.getSaoLoanDocumentsDetailsByApplicationId(loanId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.documentModelList = this.responseModel.data;
            if (this.documentModelList != null && this.documentModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let document of this.documentModelList) {
                if (document.filePath != null && document.filePath != undefined) {
                  if (document.filePath != null && document.filePath != undefined) {
                    document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);

                  }
                }
              }
              this.updateData();
            }
            this.buttonDisabled = applicationConstants.FALSE;
            this.isFileUploaded = applicationConstants.FALSE;
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

  getApplicationDetailsById(id: any) {
    this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.saoLoanApplicationModel = this.responseModel.data[0];

            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
            if (this.responseModel.data[0].saoProductId != null && this.responseModel.data[0].saoProductId != undefined) {
              this.productId = this.responseModel.data[0].saoProductId;
              // this.getDocumentsByProductDefinition(this.productId);
            }
            if (this.responseModel.data[0].saoRequiredDocumentsConfigDTOList != null && this.responseModel.data[0].saoRequiredDocumentsConfigDTOList != undefined) {
              this.documentNameList = this.responseModel.data[0].saoRequiredDocumentsConfigDTOList.filter((docs: any) => docs.status == applicationConstants.ACTIVE).map((count: any) => {
                return { label: count.documentTypeName, value: count.documentType, isRequired: count.isRequired }
              });
            }
            // let i = 0;
            // let mandatoryList = this.documentNameList.filter((obj: any) => obj.isRequired == applicationConstants.TRUE);
            // for (let doc of this.documentNameList) {
            //   if (i == 0)
            //     this.requiredDocumentsNamesText = "'Please Upload Mandatory Required Documents "
            //   if (doc.isRequired) {
            //     i = i + 1;
            //     this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + doc.label;
            //     if (i < mandatoryList.length) {
            //       this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + " , "
            //     }
            //   }
            // }
            // if (i > 0) {
            //   this.mandatoryDoxsTextShow = true;
            // }

            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
              this.memberTypeName = this.responseModel.data[0].memberTypeName;

            if (this.responseModel.data[0].saoLoanDocumentsDetailsDTOList != null && this.responseModel.data[0].saoLoanDocumentsDetailsDTOList != undefined) {
              this.documentModelList = this.responseModel.data[0].saoLoanDocumentsDetailsDTOList;

              if (this.documentModelList != null && this.documentModelList != undefined) {
                this.editDocumentOfKycFalg = true;
                for (let document of this.documentModelList) {
                  if (document.filePath != null && document.filePath != undefined) {
                    if (document.filePath != null && document.filePath != undefined) {
                      document.multipartFileList = this.fileUploadService.getFile(document.filePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.filePath);

                    }
                  }
                }
              }

            }
            else {
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
            }
            this.getDocumentsByProductDefinition(this.productId);
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
  fileRemoeEvent() {

    this.saoLoanDocumentModel.multipartFileList = [];
    this.isFileUploaded = applicationConstants.FALSE;
    if (this.saoLoanDocumentModel.filesDTOList != null && this.saoLoanDocumentModel.filesDTOList != undefined && this.saoLoanDocumentModel.filesDTOList.length > 0) {
      let removeFileIndex = this.saoLoanDocumentModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.saoLoanDocumentModel.filePath);
      if (removeFileIndex != null && removeFileIndex != undefined) {
        this.saoLoanDocumentModel.filesDTOList[removeFileIndex] = null;
        this.saoLoanDocumentModel.filePath = null;
      }
    }
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
