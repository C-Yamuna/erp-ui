import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { RequiredDocumentModel } from '../../../shared/required-document-details.model';
import { RequiredDocumentDetailsService } from '../../../shared/required-documents-details.service';
import { MemberGroupBasicDetails } from '../../../shared/member-group-details-model';
import { MembershipGroupDetailsService } from '../../../shared/membership-group-details.service';
import { DocumentTypesService } from 'src/app/configurations/membership-config/document-types/shared/document-types.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-group-document-details',
  templateUrl: './group-document-details.component.html',
  styleUrls: ['./group-document-details.component.css']
})
export class GroupDocumentDetailsComponent {
  documentForm: FormGroup;
  requiredDocumentsList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  uploadFlag: boolean = true;
  submitFlag: boolean = false;
  responseModel!: Responsemodel;
  documentsData: any[] = [];
  displayPosition: boolean = false;
  buttonDisabled: boolean = false;
  isEdit: any;
  msgs: any[] = [];
  exerciseFileList: any[] = [];
  groupId: any;
  memberGroupBasicDetails: MemberGroupBasicDetails = new MemberGroupBasicDetails();
  editIndex: any;
  editButtonDisable: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  addKycButton: boolean = false;
  fileName: any;
  docTypeList: any[] = [];
  multipleFilesList: any[] = [];
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  displayDialog: boolean = false;
  id: any;
  deleteId: any;
  showAddButton: boolean = false;
  orgnizationSetting: any;
  requiredDocumentModel: RequiredDocumentModel = new RequiredDocumentModel();
  requiredDocumentList: any[]=[];
  requiredDocumentsNames: any;
  mandatoryDoxsTextShow: boolean= false;
  mandatoryDocList: any[]=[];
  saveButtonDisable: boolean= false;
  docPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private requiredDocumentDetailsService: RequiredDocumentDetailsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService,
    private documentTypeService: DocumentTypesService,
    private membershipGroupDetailsService: MembershipGroupDetailsService,
    private memberBasicDetailsStepperService: MemberBasicDetailsStepperService,
    private fileUploadService: FileUploadService,private datePipe: DatePipe,) {

    this.documentForm = this.formBuilder.group({
      'requiredDocumentTypeId': new FormControl('', Validators.required),
      'documentNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'requiredDocumentFilePath': new FormControl(''),
    });

  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];

      if (encrypted != undefined) {
        if (encrypted) {
          this.isEdit = true;
          this.groupId = Number(this.encryptService.decrypt(encrypted));
          this.getMembershipGroupDetailsById(this.groupId);
          this.uploadFlag = false;
        } else {
          this.isEdit = false;
        }
      }
      this.updateData();
    });

    this.buttonDisabled = false;

    this.getAllDocumnetsTypes();
    this.updateData();

  }
  getMembershipGroupDetailsById(id: any) {
    this.isEdit = true;
    this.membershipGroupDetailsService.getMembershipGroupDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.showAddButton = false;
        this.memberGroupBasicDetails = this.responseModel.data[0];
        if (this.memberGroupBasicDetails.admissionDate != null && this.memberGroupBasicDetails.admissionDate != undefined) {
          this.memberGroupBasicDetails.admissionDateVal = this.datePipe.transform(this.memberGroupBasicDetails.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails && this.memberGroupBasicDetails.requiredDocumentDetailsDTOList != null && this.memberGroupBasicDetails.requiredDocumentDetailsDTOList != undefined &&
          this.memberGroupBasicDetails.requiredDocumentDetailsDTOList.length > 0) {
          this.requiredDocumentsList = this.memberGroupBasicDetails.requiredDocumentDetailsDTOList;
          this.requiredDocumentsList = this.requiredDocumentsList.filter(obj => null != obj && null != obj.status && obj.status === applicationConstants.ACTIVE).map((document: any) => {
            document.multipleFilesList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
            this.showAddButton = true;
            return document;
          });
        }
        else {
          this.documentForm.reset();
          this.requiredDocumentModel = new RequiredDocumentModel()
          this.addDocumentOfKycFalg = true;
          this.showAddButton = false;
          this.buttonDisabled = true;
          this.landFlag = false
        }

      } else {
        this.showAddButton = false;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
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
  //get all document documnet types 
  getAllDocumnetsTypes() {
    this.documentTypeService.getAllDocumentType().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.docTypeList = this.responseModel.data;
            this.docTypeList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: any) => {
              return { label: state.name, value: state.id };
            });
            this.requiredDocumentList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE && obj.isMandatory == applicationConstants.TRUE);
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
    });
  }
 
  updateData() {
    const mandatoryDocuments = this.requiredDocumentList ? 
        this.requiredDocumentList.filter(doc => doc.isMandatory) : [];

    const allMandatoryUploaded = mandatoryDocuments.every(doc =>
        this.requiredDocumentsList?.some(uploadedDoc => uploadedDoc.requiredDocumentTypeId === doc.id)
    );
    if (mandatoryDocuments.length > 0) {
      const documentNames = mandatoryDocuments.map(doc => doc.name).join(",");
      this.requiredDocumentsNames = `Please Upload Mandatory Required Documents: "${documentNames}"`;
      this.mandatoryDoxsTextShow = true;
    } else {
      this.mandatoryDoxsTextShow = false;
    }
    if (mandatoryDocuments.length > 0) {
        this.landFlag = allMandatoryUploaded && this.buttonsFlag;
    } else {
        this.landFlag = this.requiredDocumentsList?.length > 0 && this.buttonsFlag;
    }
    this.requiredDocumentModel.memberId = this.groupId;
    this.memberBasicDetailsStepperService.changeData({
        formValid: this.documentForm.valid,
        data: this.requiredDocumentModel,
        savedId: this.groupId,
        stepperIndex: 3,
        isDisable: !this.landFlag, 
    });
}
    

  saveKyc(row: any) {
    let documnetTypes = this.docTypeList.find((data: any) => null != data && row.requiredDocumentTypeId != null && data.value == row.requiredDocumentTypeId);
    if (documnetTypes != null && undefined != documnetTypes)
      row.requiredDocumentTypeName = documnetTypes.label;
    if (this.requiredDocumentModel.status == null && this.requiredDocumentModel.status == undefined)
      this.requiredDocumentModel.status = applicationConstants.ACTIVE;
    this.requiredDocumentModel.memberId = this.groupId;
    this.requiredDocumentModel.memberType = this.memberGroupBasicDetails.memberTypeId;
    this.requiredDocumentModel.admissionNumber = this.memberGroupBasicDetails.admissionNumber;
    this.requiredDocumentDetailsService.addRequiredDocumentsDetails(row).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {

        this.requiredDocumentModel = this.responseModel.data[0];
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
      this.landFlag = true;;
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getMembershipGroupDetailsById(this.groupId);
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
    this.updateData();
  }
  editsave(row: any) {
    let documnetTypes = this.docTypeList.find((data: any) => null != data && row.requiredDocumentTypeId != null && data.value == row.requiredDocumentTypeId);
    if (documnetTypes != null && undefined != documnetTypes)
      row.requiredDocumentTypeName = documnetTypes.label;
    if (this.requiredDocumentModel.status == null && this.requiredDocumentModel.status == undefined)
      this.requiredDocumentModel.status = applicationConstants.ACTIVE;
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.requiredDocumentDetailsService.updateRequiredDocumentsDetails(row).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.buttonsFlag = true;
        this.landFlag = true;;
        this.updateData();
        this.requiredDocumentModel = this.responseModel.data;
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
      this.getMembershipGroupDetailsById(this.groupId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  addDocument(event: any) {
    // this.getAllDocumnetsTypes();
    this.documentForm.reset();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.buttonsFlag = false;
    this.landFlag = false;
    this.updateData();
    this.editButtonDisable = true;
    this.requiredDocumentModel = new RequiredDocumentModel;
    this.saveButtonDisable = false;
  }


  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.buttonsFlag = false;
    this.landFlag = false;
    this.updateData();
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.getRequiredDocumentById(modelData.id);
  }
  getRequiredDocumentById(id: any) {
    this.requiredDocumentDetailsService.getRequiredDocumentsDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.requiredDocumentModel = this.responseModel.data[0];
          if (this.requiredDocumentModel.requiredDocumentFilePath != null && this.requiredDocumentModel.requiredDocumentFilePath != undefined) {
            this.requiredDocumentModel.multipleFilesList = this.fileUploadService.getFile(this.requiredDocumentModel.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.requiredDocumentModel.requiredDocumentFilePath);
            this.saveButtonDisable = true;
          }
          else{
            this.saveButtonDisable = false;
          }
        }
      }
    });
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
    }
  }
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
    }
  }
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.buttonsFlag = true;
    this.landFlag = true;
    this.updateData();
    this.getMembershipGroupDetailsById(this.groupId);
  }
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.buttonsFlag = true;
    this.landFlag = true;
    this.updateData();
    this.getMembershipGroupDetailsById(this.groupId);
  }
  backToKyc() {
    this.displayPosition = false;
    this.uploadFlag = false;
    this.submitFlag = false;
    this.updateData();
  }
  fileUploader(event: any, fileUpload: FileUpload) {
    this.saveButtonDisable = true;
    this.isFileUploaded = applicationConstants.FALSE;
    this.requiredDocumentModel.multipleFilesList = [];
    this.multipleFilesList = [];
    this.requiredDocumentModel.filesDTO = null; // Initialize as a single object
    this.requiredDocumentModel.requiredDocumentFilePath = null;
    let file = event.files[0];
    let fileSizeMB = file.size / (1024 * 1024);
   
    if (fileSizeMB > 5) {
      this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_5MB}];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
    let reader = new FileReader();
    reader.onloadend = (e) => {
      if (!e.target || !e.target.result) {
        console.error('FileReader failed to read file:', file.name);
        return;
      }
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "GROUP_DOCUMENT_" + this.groupId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.requiredDocumentModel.filesDTO = filesDTO;
      this.requiredDocumentModel.requiredDocumentFilePath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  RemoveEvent() {
    this.saveButtonDisable = false;
    this.requiredDocumentModel.multipleFilesList = [];
    if (this.requiredDocumentModel.filesDTO != null && this.requiredDocumentModel.filesDTO != undefined) {
      this.requiredDocumentModel.requiredDocumentFilePath = null;
      this.requiredDocumentModel.filesDTO = null;
    }
  }

  requiredDocumentDplicate(id: any) {
    if (id != null && id != undefined) {
      if (this.requiredDocumentsList != null && this.requiredDocumentsList != undefined && this.requiredDocumentsList.length > 0) {
        for (let item of this.requiredDocumentsList) {
          if (item != null && item != undefined && item.requiredDocumentTypeId === id) {
            this.documentForm.reset();
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
  delete(rowDataId: any) {
    this.requiredDocumentDetailsService.deleteRequiredDocumentsDetails(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.requiredDocumentsList = this.responseModel.data;
        this.getMembershipGroupDetailsById(this.groupId);
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
   // Document

   onClickdocPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.docPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipleFilesList;
  }
  docclosePhoto(){
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