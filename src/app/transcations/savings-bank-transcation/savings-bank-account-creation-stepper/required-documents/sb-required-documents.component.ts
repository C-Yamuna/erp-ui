import { ApplicationInitStatus, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SavingBankApplicationService } from '../savings-bank-application/shared/saving-bank-application.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SavingsBankCommunicationService } from '../savings-bank-communication/shared/savings-bank-communication.service';
import { SavingsBankKycService } from '../savings-bank-kyc/shared/savings-bank-kyc.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUpload } from 'primeng/fileupload';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SbRequiredDocuments } from './shared/sb-required-documents';
import { SbRequiredDocumentsService } from './shared/sb-required-documents.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { RequiredDocumentConfigService } from '../../shared/required-document-config.service';
import { RequiredDocumentModel } from 'src/app/transcations/membership-transcation/shared/required-document-details.model';
import { DOCUMENT_TYPES, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-required-documents',
  templateUrl: './sb-required-documents.component.html',
  styleUrls: ['./sb-required-documents.component.css']
})
export class SbRequiredDocumentsComponent implements OnInit {
  requiredForm: FormGroup;
  orgnizationSetting: any;
  showForm: any;
  documentsData: any[] = [];
  sbAccId: any;
  isEdit: boolean = false;
  buttonDisabled: boolean = false;
  saveAndNextEnable: boolean = false;

  columns: any[] = [];
  uploadFlag: boolean = false;
  editIndex: any;
  deleteId: any;
  requiredDocumentsNamesText: any;
  mandatoryDoxsTextShow: boolean = false;
  multipartFileList: any[] = [];
  accountNumber: any;
  isPanNumber: boolean = false;
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
  requiredDocumentsModel: SbRequiredDocuments = new SbRequiredDocuments();
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

  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  memberTypeName: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  memberTypeId: any;
  displayDialog: boolean = false;
  docPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;


  constructor(private router: Router, private formBuilder: FormBuilder, private savingBankApplicationService: SavingBankApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private savingsBankCommunicationService: SavingsBankCommunicationService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private sbRequiredDocumentsService: SbRequiredDocumentsService, private fileUploadService: FileUploadService) {
    this.requiredForm = this.formBuilder.group({
      'docNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'docTypeName': new FormControl('', Validators.required),
      'fileUpload': new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    // this.getAllKycTypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
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

    this.updateData();
  }

  /**
   * @author jyothi.naidana
   * @implements get kyc types List 
   */
  getAllKycTypes() {
    this.sbRequiredDocumentsService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });

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
     * @author jyothi.naidana
     * @implements document upload 
     */
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.requiredDocumentsModel.filesDTOList = [];
    this.requiredDocumentsModel.multipartFileList = [];
    this.requiredDocumentsModel.requiredDocumentFilePath = null;

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
          this.requiredDocumentsModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.requiredDocumentsModel.filesDTOList[0].fileName = "SB_REQUIRED_DOCUMENTS" + this.sbAccId + "_" + timeStamp + "_" + file.name;
        this.requiredDocumentsModel.requiredDocumentFilePath = "SB_REQUIRED_DOCUMENTS" + this.sbAccId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();

      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @author jyothi.naidana
   * @implements from data updation to stepper component
   */
  save() {
    this.updateData();
  }
  /**
   * @author jyothi.naidana
   * @implements set values for data updation to stepper component
   */
  updateData() {
    this.requiredDocumentsModel.sbAccId = this.sbAccId;
    this.requiredDocumentsModel.admissionNumber = this.admissionNumber;
    this.requiredDocumentsModel.memberTypeName = this.memberTypeName;
    this.requiredDocumentsModel.memberType = this.memberTypeId;
    this.requiredDocumentsModel.memberId = this.memberId;
    //for manadatory Documents check
    this.saveAndNextEnable = false;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let documentNameList = this.documentNameList.filter((obj: any) => obj.isRequired);
      if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0 && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) {
        const missingItems = this.kycModelList.filter(document => !documentNameList.some(mandatoryDocument => document.requiredDocumentTypeId === mandatoryDocument.value));
        if ((documentNameList.length != this.kycModelList.length - missingItems.length) || this.buttonDisabled) {
          this.saveAndNextEnable = true;
        }
      }
      else if (((this.kycModelList == null || this.kycModelList == undefined || this.kycModelList.length === 0) && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) || this.buttonDisabled) {
        this.saveAndNextEnable = true;
      }
    }
    else if (this.buttonDisabled) {
      this.saveAndNextEnable = true;
    }
    this.savingBankApplicationService.changeData({
      formValid: !this.requiredForm.valid ? true : false,
      data: this.requiredDocumentsModel,
      // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
      isDisable: this.saveAndNextEnable,
      stepperIndex: 5,
    });
  }

  /**
   * @author jyothi.naidana
   * @implements remove documents
   */
  delete(rowDataId: any) {
    this.sbRequiredDocumentsService.deleteDocuments(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
        this.getAllSbDocumentDetailsSbAccId(this.sbAccId);
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
   * @author jyothi.naidana
   * @implements get all documents by savings accoun application
   * @argument sbAccId:Number
   */
  getAllSbDocumentDetailsSbAccId(sbAccId: any) {
    this.sbRequiredDocumentsService.getDocumentsBySbAccId(this.sbAccId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.kycModelList = [];
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.kycModelList = this.responseModel.data;
            if (this.kycModelList.length > 0 && this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                this.buttonDisabled = false;
                if (kyc.requiredDocumentFilePath != null && kyc.requiredDocumentFilePath != undefined) {
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.requiredDocumentFilePath);
                }
                this.updateData();
              }
            }
          }
          else {
            this.requiredDocumentsModel = new SbRequiredDocuments();
            this.isFileUploaded = applicationConstants.FALSE;
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
   * @author jyothi.naidana
   * @implements save docment
   * @argument requiredDocumentsModel
   */
  saveDocument(row: any) {
    this.requiredDocumentsModel.sbAccId = this.sbAccId;
    this.requiredDocumentsModel.admissionNumber = this.admissionNumber;
    this.requiredDocumentsModel.memberTypeName = this.memberTypeName;
    this.requiredDocumentsModel.memberType = this.memberTypeId;
    this.requiredDocumentsModel.memberId = this.memberId;
    this.requiredDocumentsModel.status = applicationConstants.ACTIVE;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.requiredDocumentsModel.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.requiredDocumentsModel.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.sbRequiredDocumentsService.addDocuments(this.requiredDocumentsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.requiredDocumentsModel = this.responseModel.data[0];
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
      this.getAllSbDocumentDetailsSbAccId(this.sbAccId);
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
   * @author jyothi.naidana
   * @implements get sbAccount details by sbAccId
   * @argument sbAccId
   */
  getSbAccountDetailsById(id: any) {
    this.savingBankApplicationService.getSbApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            //header card data
            if (this.responseModel.data[0].accountOpenDate != null && this.responseModel.data[0].accountOpenDate != undefined) {
              this.accountOpeningDateVal = this.datePipe.transform(this.responseModel.data[0].accountOpenDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].productName != null && this.responseModel.data[0].productName != undefined) {
              this.productName = this.responseModel.data[0].productName;
            }
            if (this.responseModel.data[0].accountTypeName != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountType = this.responseModel.data[0].accountTypeName;
            }
            if (this.responseModel.data[0].minBalance != null && this.responseModel.data[0].minBalance != undefined) {
              this.minBalence = this.responseModel.data[0].minBalance;
            }
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
                this.accountType = applicationConstants.SINGLE_ACCOUNT_TYPE;
              }
            }
            //required documents
            if (this.responseModel.data[0].requiredDocumentsConfigDetailsDTOList != null && this.responseModel.data[0].requiredDocumentsConfigDetailsDTOList != undefined) {
              this.documentNameList = this.responseModel.data[0].requiredDocumentsConfigDetailsDTOList.filter((docs: any) => docs.status == applicationConstants.ACTIVE).map((count: any) => {
                return { label: count.documentTypeName, value: count.documentTypeId, isRequired: count.isRequired }
              });
            }
            let i = 0;
            let mandatoryList = this.documentNameList.filter((obj: any) => obj.isRequired == applicationConstants.TRUE);
            for (let doc of this.documentNameList) {
              if (i == 0)
                this.requiredDocumentsNamesText = "Please Upload Mandatory Required Documents "
              if (doc.isRequired) {
                i = i + 1;
                this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + doc.label;
                if (i < mandatoryList.length) {
                  this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + " , "
                }
              }
            }
            // this.requiredDocumentsNamesText = this.requiredDocumentsNamesText+")";
            if (i > 0) {
              this.mandatoryDoxsTextShow = true;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
            //kyc list
            if (this.responseModel.data[0].requiredDocumentDetailsDTOList != null && this.responseModel.data[0].requiredDocumentDetailsDTOList != undefined) {
              this.kycModelList = this.responseModel.data[0].requiredDocumentDetailsDTOList;
              for (let kyc of this.kycModelList) {
                if (kyc.requiredDocumentFilePath != null && kyc.requiredDocumentFilePath != undefined) {
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.requiredDocumentFilePath);
                }
              }
            }
            else {
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
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
 * @author jyothi.naidana
 * @implements get sbAccount details by sbAccId
 * @argument sbAccId
 */
  addDocument(event: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    // this.getAllKycTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.requiredDocumentsModel = new SbRequiredDocuments();
    this.updateData();
  }

  /**
  * @author jyothi.naidana
  * @implements cancle document add/update
  */
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllSbDocumentDetailsSbAccId(this.sbAccId);
    this.updateData();
  }

  /**
   * @author jyothi.naidana
   * @implements onclick event for add document
   */
  onClick() {
    this.addDocumentOfKycFalg = true;
  }

  /**
    * @author jyothi.naidana
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
   * @author jyothi.naidana
   * @implements edit  document cancel
   */
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllSbDocumentDetailsSbAccId(this.sbAccId);

    this.updateData();
  }

  /**
  * @author jyothi.naidana
  * @implements edit document save
  */
  editsave(row: any) {
    // this.getAllKycTypes();
    this.requiredDocumentsModel.sbAccId = this.sbAccId;
    this.requiredDocumentsModel.admissionNumber = this.admissionNumber;
    this.requiredDocumentsModel.memberTypeName = this.memberTypeName;
    this.requiredDocumentsModel.memberType = this.memberTypeId;
    this.requiredDocumentsModel.memberId = this.memberId;
    this.editDocumentOfKycFalg = true;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.requiredDocumentsModel.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.requiredDocumentsModel.requiredDocumentTypeName = filteredObj.label;
      }
    }
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.sbRequiredDocumentsService.updateDocuments(this.requiredDocumentsModel).subscribe((response: any) => {
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
      this.getAllSbDocumentDetailsSbAccId(this.sbAccId);
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
     * @author jyothi.naidana
     * @implements get document by sbAccId 
     * @argument sbAccId (Number)
     */
  getDocumentsById(id: any) {
    this.sbRequiredDocumentsService.getDocuments(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.requiredDocumentsModel = this.responseModel.data[0];
              if (this.requiredDocumentsModel.requiredDocumentFilePath != undefined) {
                if (this.requiredDocumentsModel.requiredDocumentFilePath != null && this.requiredDocumentsModel.requiredDocumentFilePath != undefined) {
                  this.requiredDocumentsModel.multipartFileList = this.fileUploadService.getFile(this.requiredDocumentsModel.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.requiredDocumentsModel.requiredDocumentFilePath);
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
   * @author jyothi.naidana
   * @implements on click delete
   */
  deletDilogBox(rowData: any) {
    this.displayDialog = true;
    if (rowData.id != null && rowData.id != undefined) {
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
  submitDelete() {
    if (this.deleteId != null && this.deleteId != undefined) {
      this.delete(this.deleteId);
    }

    this.displayDialog = false;
  }

  /**
   * @implements onFile remove
   * @author jyothi.naidana
   */
  fileRemoeEvent() {
    this.isFileUploaded = applicationConstants.FALSE;
    if (this.requiredDocumentsModel.filesDTOList != null && this.requiredDocumentsModel.filesDTOList != undefined && this.requiredDocumentsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.requiredDocumentsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.requiredDocumentsModel.requiredDocumentFilePath);
      if (removeFileIndex != null && removeFileIndex != undefined) {
        this.requiredDocumentsModel.filesDTOList[removeFileIndex] = null;
        this.requiredDocumentsModel.requiredDocumentFilePath = null;
      }
    }
  }
  onClickdocPhotoCopy(rowData: any) {
    this.multipartFileList = [];
    this.docPhotoCopyZoom = true;
    this.multipartFileList = rowData.multipartFileList;
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

  /**
  * @implements duplicate kyc type
  * @param kycDocType 
  * @returns 
  * @author jyothi.naidana
  */
  requiredDocumentsDuplicateCheck(rowData: any) {
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.requiredDocumentsModel.requiredDocumentTypeId != null && data.value == this.requiredDocumentsModel.requiredDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.requiredDocumentsModel.requiredDocumentTypeName = filteredObj.label;
        this.documentNumberDynamicValidation(this.requiredDocumentsModel.requiredDocumentTypeName);
      }
    }
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      let duplicate: any
      duplicate = this.kycModelList.filter((obj: any) => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId && rowData.id != obj.id);
      if (this.addDocumentOfKycFalg && duplicate != null && duplicate != undefined && duplicate.length == 1) {
        this.requiredForm.reset();
        this.requiredDocumentsModel = new SbRequiredDocuments();
        if (rowData.id != null && rowData != undefined)
          this.requiredDocumentsModel.id = rowData.id;
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Document Types" }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }
  }


   /**
   * @implements document number dynamic Vaildation
   * @author jyothi.naidana
   */
   documentNumberDynamicValidation(docTypeName: any) {
    if (DOCUMENT_TYPES.AADHAR == this.requiredDocumentsModel.requiredDocumentTypeId) {
      const controlTow = this.requiredForm.get('docNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.AADHAR_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
    else if (DOCUMENT_TYPES.PANNUMBER == this.requiredDocumentsModel.requiredDocumentTypeId) {
      const controlTow = this.requiredForm.get('docNumber');
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
      const controlTow = this.requiredForm.get('docNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
  }
}
