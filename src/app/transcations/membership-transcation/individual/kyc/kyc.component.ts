import { MemberBasicDetails, MemberKycDetailsModel } from './../../shared/member-basic-details.model';
import { MembershipKycDetailsService } from './../../shared/membership-kyc-details.service';
import { MemberBasicDetailsStepperService } from './../shared/membership-individual-stepper.service';
import { Component, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MembershipBasicDetailsService } from '../../shared/membership-basic-details.service';
import { DocumentTypesService } from 'src/app/configurations/membership-config/document-types/shared/document-types.service';
import { KycDocumentTypesService } from 'src/app/configurations/common-config/kyc-document-types/shared/kyc-document-types.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';


@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KYCComponent  implements OnInit {
  kycForm: FormGroup;
  kycModel: MemberKycDetailsModel = new MemberKycDetailsModel();
  kycModelList: any[] = [];
  adhaarFilesList: any[] = [];
  signFilesList: any[] = [];
  panFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  uploadFlag: boolean = true;
  submitFlag: boolean = false;
  columns: any[]=[];
  responseModel!: Responsemodel;
  documentsData: any[] = [];
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  docFilesList: any[] = [];
  buttonDisabled: boolean =false;
  isEdit: any;
  msgs: any[]=[];
  filesList: any[] = [];
  orgnizationSetting: any;
  exerciseFileList: any[] = [];
  lastDot = applicationConstants.LAST_DOT;
  memberId: any;
  pacsId =1;
  branchId = 1;
  kycListByMemberId: any[] = [];
  memberModel: MemberBasicDetails = new MemberBasicDetails();
  typeFlag: boolean = false;
  editIndex: any;
  afterEditCancleFalg: boolean = false;

  editButtonDisable : boolean = false ;
  addDocumentOfKycFalg: boolean = false;

  editDocumentOfKycFalg: boolean = false;

  veiwCardHide : boolean = false;
  addKycButton: boolean =false;
  fileName: any;
  docTypeList: any[]=[];

  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  displayDialog: boolean  = false;
  id: any;
  deleteId: any;
  showAddButton: boolean = false;
  kycPhotoCopyZoom: boolean = false;
  requiredDocumentList: any[]=[];
  requiredDocumentsNames: any;
  mandatoryDoxsTextShow: boolean= false;
  mandatoryDocList: any[]=[];
  saveButtonDisable: boolean= false;
  isMaximized: boolean = false;


  constructor(private formBuilder: FormBuilder,
    private kycService: MembershipKycDetailsService,
    private kycDocumentTypesService:KycDocumentTypesService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService,
    private documentTypeService:DocumentTypesService,
    private membershipBasicDetailsService: MembershipBasicDetailsService,
    private memberBasicDetailsStepperService: MemberBasicDetailsStepperService,
    private fileUploadService : FileUploadService) {

      this.kycForm = this.formBuilder.group({
        'kycDocumentTypeId': new FormControl('', Validators.required),
        'documentNumber': new FormControl('',[Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
        'nameAsPerDocument': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
        'kycFilePath': new FormControl(''),
      });
  
    }
    ngOnInit(): void {
      this.getAllDocumnetsTypes();
      if (this.documentsData.length >= 1) {
        this.uploadFlag = true;
      }
      this.activateRoute.queryParams.subscribe(params => {
        let encrypted = params['id'];
  
        if (encrypted != undefined) {
          if (encrypted) {
            this.isEdit = true;
            this.memberId = Number(this.encryptService.decrypt(encrypted));
            this.getMembershipDetailsById(this.memberId);
            // this.getGroupDetailsById(this.memberId);
            this.uploadFlag = false;
          } else {
            this.isEdit = false;
          }
        }
        this.updateData();
      });
  
      this.buttonDisabled = false;
    
      
      this.updateData();
  
    }
    getMembershipDetailsById(id: any) {
      this.isEdit = true;
      this.membershipBasicDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
        this.responseModel = res;
        this.commonComponent.stopSpinner();
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          this.showAddButton = false;
          this.memberModel = this.responseModel.data[0];
          if (this.memberModel && this.memberModel.memberShipKycDetailsDTOList != null && this.memberModel.memberShipKycDetailsDTOList != undefined &&
            this.memberModel.memberShipKycDetailsDTOList.length > 0) {
              this.kycModelList = this.memberModel.memberShipKycDetailsDTOList;
              this.kycModelList  = this.kycModelList.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE ).map((kyc:any)=>{
                kyc.multipleFilesList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                this.showAddButton = true;
                return kyc;
              });
          }
          else{
            this.kycForm.reset();
            this.kycModel = new MemberKycDetailsModel()
            this.addDocumentOfKycFalg = true;
            this.showAddButton = false;
            this.buttonDisabled = true;
            this.landFlag = false
          }
           
        }else {
          this.showAddButton = false;
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        // this.buttonDisabled = true;
        this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
   
    //get all kyc documnet types 
    getAllDocumnetsTypes() {
      this.kycDocumentTypesService.getAllKycDocumentType().subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if ( this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.docTypeList = this.responseModel.data;
              this.docTypeList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: any) => {
                return { label: state.name, value: state.id };
              });
              this.requiredDocumentList = this.responseModel.data.filter((obj: any) => obj != null && obj.isMandatory == applicationConstants.TRUE);

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
  
  // set document name
    onChangeDocumnetTypesChange() {
      let documnetTypes = this.docTypeList.find((data: any) => null != data && this.kycModel.kycDocumentTypeId != null &&  data.value == this.kycModel.kycDocumentTypeId);
      if (documnetTypes != null && undefined != documnetTypes)
      this.kycModel.kycDocumentTypeName = documnetTypes.label;
    }
 
    updateData() {
      const mandatoryDocuments = this.requiredDocumentList ? 
          this.requiredDocumentList.filter(doc => doc.isMandatory) : [];
  
      const allMandatoryUploaded = mandatoryDocuments.every(doc =>
          this.kycModelList?.some(kyc => kyc.kycDocumentTypeId === doc.id)
      );
      if (mandatoryDocuments.length > 0) {
          this.requiredDocumentsNames = "Please Upload Mandatory KYC Documents (";
          this.requiredDocumentsNames += mandatoryDocuments.map(doc => `'${doc.name}'`).join(", ");
          this.requiredDocumentsNames += ")";
          this.mandatoryDoxsTextShow = true;
      } else {
          this.mandatoryDoxsTextShow = false;
      }
      if (mandatoryDocuments.length > 0) {
          this.landFlag = allMandatoryUploaded && this.buttonsFlag;
      } else {
          this.landFlag = this.kycModelList?.length > 0 && this.buttonsFlag;
      }
      this.kycModel.membershipId = this.memberId;
      this.memberBasicDetailsStepperService.changeData({
          formValid: this.kycForm.valid,
          data: this.kycModel,
          savedId: this.memberId,
          stepperIndex: 1,
          isDisable: !this.landFlag, 
      });
  }
    // navigateToBack(){
    //   this.router.navigate([]);
    // }
  
    saveKyc(row : any){
      let documnetTypes = this.docTypeList.find((data: any) => null != data && row.kycDocumentTypeId != null &&  data.value == row.kycDocumentTypeId);
      if (documnetTypes != null && undefined != documnetTypes)
        row.kycDocumentTypeName = documnetTypes.label;
      if(this.kycModel.status == null && this.kycModel.status == undefined)
        this.kycModel.status = applicationConstants.ACTIVE;
        this.kycModel.membershipId = this.memberId;
        this.kycModel.admissionNumber = this.memberModel.admissionNumber;
        this.kycModel.pacsId = 1;
        this.kycModel.branchId =1;
        this.kycService.addMembershipKycDetails(row).subscribe((response : any ) => {
        this.responseModel = response;
        if(this.responseModel.status == applicationConstants.STATUS_SUCCESS){
         
          this.kycModel = this.responseModel.data[0];
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
        this.buttonsFlag  = true;
        this.landFlag =true;;
        this.addKycButton = false;
        this.buttonDisabled = false;
        this.getMembershipDetailsById(this.memberId);
        this.updateData();
        
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
        this.addDocumentOfKycFalg  = false;
        this.editButtonDisable = false;
        this.updateData();
    }
    editsave(row:any){
      let documnetTypes = this.docTypeList.find((data: any) => null != data && row.kycDocumentTypeId != null &&  data.value == row.kycDocumentTypeId);
      if (documnetTypes != null && undefined != documnetTypes)
        row.kycDocumentTypeName = documnetTypes.label;
      if(this.kycModel.status == null && this.kycModel.status == undefined)
        this.kycModel.status = applicationConstants.ACTIVE;
        this.editDocumentOfKycFalg = true;
        this.buttonDisabled = false;
        this.editButtonDisable  = false;
        this.kycService.updateMembershipKycDetails(row).subscribe((response : any ) => {
        this.responseModel = response;
        if(this.responseModel.status == applicationConstants.STATUS_SUCCESS){
          this.buttonsFlag  = true;
          this.landFlag =true;;
          this.updateData();
          this.kycModel = this.responseModel.data;
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
        this.getMembershipDetailsById(this.memberId);
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    addKyc(event : any){
      // this.getAllDocumnetsTypes();
      this.kycForm.reset();
      this.multipleFilesList = [];
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = true;
      this.buttonsFlag  = false;
      this.landFlag =false;
      this.updateData();
      this.editButtonDisable  = true;
      this.kycModel = new MemberKycDetailsModel;
      this.saveButtonDisable = false;
    }
  
    
    toggleEditForm(index: number , modelData :any): void {
      if (this.editIndex === index) {
        this.editIndex = index;
      } else {
        this.editIndex = index;
      }
      this.editButtonDisable  = true;
      this.buttonDisabled = true;
      this.buttonsFlag  = false;
      this.landFlag =false;
      this.updateData();
      this.veiwCardHide = false;
      this.editDocumentOfKycFalg = false;
      this.addDocumentOfKycFalg = false;
      this.getKycById(modelData.id);
    }
    getKycById(id : any){
      this.kycService.getMembershipKycDetailsById(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.kycModel = this.responseModel.data[0];
            if(this.kycModel.kycFilePath != null && this.kycModel.kycFilePath != undefined){
              this.kycModel.multipleFilesList = this.fileUploadService.getFile(this.kycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.kycModel.kycFilePath);
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
    cancel(){
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.buttonsFlag  = true;
      this.landFlag =true;
      this.updateData();
      this.getMembershipDetailsById(this.memberId);
    }
    editCancle(){
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable  = false;
      this.buttonsFlag  = true;
      this.landFlag =true;
      this.updateData();
      this.getMembershipDetailsById(this.memberId);
    }
    backToKyc() {
      this.displayPosition = false;
      this.uploadFlag = false;
      this.submitFlag = false;
      this.updateData();
    }
    imageUploader(event: any, fileUpload: FileUpload) {
      this.saveButtonDisable = true;
      this.isFileUploaded = applicationConstants.FALSE;
      this.kycModel.multipleFilesList = [];
      this.multipleFilesList = [];
      this.kycModel.filesDTO = null; // Initialize as a single object
      this.kycModel.kycFilePath = null;
      if (event.files.length !== 1) {
        console.error('Exactly one file must be selected.');
        return;
      }
      let file = event.files[0]; // Only one file
      let reader = new FileReader();
      reader.onloadend = (e) => {
        if (!e.target || !e.target.result) {
          console.error('FileReader failed to read file:', file.name);
          return;
        }
        let filesDTO = new FileUploadModel();
        this.uploadFileData = e.target as FileReader;
        filesDTO.fileName = "MEMBER_KYC_" + this.memberId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
        filesDTO.fileType = file.type.split('/')[1];
        filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
        filesDTO.imageValue = this.uploadFileData.result as string;
        this.kycModel.filesDTO = filesDTO;
        this.kycModel.kycFilePath = filesDTO.fileName;
        let index1 = event.files.indexOf(file);
        if (index1 > -1) {
          fileUpload.remove(event, index1);
        }
        fileUpload.clear();
      };
  
      reader.readAsDataURL(file);
     
    }
  fileRemoveEvent() {
    this.saveButtonDisable = false;
    this.kycModel.multipleFilesList = [];
    if (this.kycModel.filesDTO != null && this.kycModel.filesDTO != undefined) {
      this.kycModel.kycFilePath = null;
      this.kycModel.filesDTO = null;
    }
  }
  kycDplicate(id: any) {
    if (id != null && id != undefined) {
      if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
        for (let item of this.kycModelList) {
          if (item != null && item != undefined && item.kycDocumentTypeId === id) {
            this.kycForm.reset();
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Kyc Document already exists" }];
            setTimeout(() => {
              this.msgs = [];
            }, 1500);
          }
        }
      }
    }

  }
    delete(rowDataId: any) {
      this.kycService.deleteMembershipKycDetails(rowDataId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.kycModelList = this.responseModel.data;
            this.getMembershipDetailsById(this.memberId);
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
    deletDilogBox(rowData:any){
      this.displayDialog = true;
      if(rowData.id != null && rowData.id != undefined){
        this.deleteId = rowData.id;
      }
    }
    cancelForDialogBox() {
      this.displayDialog = false;
    }
    submitDelete(){
      if(this.deleteId != null && this.deleteId != undefined){
        this.delete(this.deleteId);
      }
      
      this.displayDialog = false;
    }
    // KYC

  onClickkycPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipleFilesList;
  }
  kycclosePhoto(){
    this.kycPhotoCopyZoom = false;
  }
  kycclosePhotoCopy() {
    this.kycPhotoCopyZoom = false;
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