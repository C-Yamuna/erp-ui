import { Component, ElementRef, ViewChild } from '@angular/core';
import { SaoAccountdetails } from '../sao-borrowing-stepper/sao-account-details/shared/sao-accountdetails.model';
import { SaoBorrowingAccountMapping } from '../sao-borrowing-stepper/sao-borrowing-account-mapping/shared/sao-borrowing-account-mapping.model';
import { SaoBorrowingDocuments } from '../sao-borrowing-stepper/sao-borrowing-documents/shared/sao-borrowing-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { CiAccountDetailsService } from '../../ci-borrowing/ci-borrowing-stepper/ci-account-details/shared/ci-account-details.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FormBuilder } from '@angular/forms';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SaoBorrowingAccountMappingService } from '../sao-borrowing-stepper/sao-borrowing-account-mapping/shared/sao-borrowing-account-mapping.service';
import { SaoBorrowingDocumentsService } from '../sao-borrowing-stepper/sao-borrowing-documents/shared/sao-borrowing-documents.service';
import { SaoAccountDetailsService } from '../sao-borrowing-stepper/sao-account-details/shared/sao-account-details.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { BorrowingTransactionConstant } from '../../borrowing-transaction-constants';
import { TranslateService } from '@ngx-translate/core';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { approvaltransactionsconstant } from 'src/app/transcations/approval-transcations/approval-transactions-constant';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-sao-view-borrowing',
  templateUrl: './sao-view-borrowing.component.html',
  styleUrls: ['./sao-view-borrowing.component.css']
})
export class SaoViewBorrowingComponent {
  saoAccountdetailsModel :SaoAccountdetails = new SaoAccountdetails();
  saoBorrowingAccountMappingModel:SaoBorrowingAccountMapping = new SaoBorrowingAccountMapping();
  saoBorrowingDocumentsModel:SaoBorrowingDocuments = new SaoBorrowingDocuments();
  borrowingaccountmapping: any[] = [];
  borrowingdocument: any[] = [];
  statusList: any[]=[];
 
  responseModel!: Responsemodel;
  msgs: any[]=[];
  editbtn: boolean = true;
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[]=[];
  memberLandDetails: any;
  saoborrowingMappingList: any[]=[];
  borrowingAccountId:any;
  borrowingdocumentlist: any[]=[];
  isShowSubmit: boolean =applicationConstants.FALSE;
  isDisableSubmit: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;
  roleName: any;
  accountNumber: any;
  viewButton: boolean = false;
  editFlag: boolean = false;
  multipartFileList: any[] = [];
  docPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;
  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private saoAccountDetailsService : SaoAccountDetailsService, private translate: TranslateService,

    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService,
    private fileUploadService :FileUploadService,) {
    this.borrowingaccountmapping = [
      { field: 'loanMemberAdmissionNumber', header: 'BORROWINGSTRANSACTIONS.ADMISSION_NUMBER' },
      { field: 'loanAccountNumber', header: 'BORROWINGSTRANSACTIONS.LOAN_ACCOUNT_NUMBER' },
      { field: '', header: 'BORROWINGSTRANSACTIONS.NAME' },
      { field: '', header: 'BORROWINGSTRANSACTIONS.DATE_OF_BIRTH' },
      { field: '',header:'BORROWINGSTRANSACTIONS.AADHAR_NUMBER'},
      { field: '',header:'BORROWINGSTRANSACTIONS.PURPOSE'},
      { field: 'loanAmount',header:'BORROWINGSTRANSACTIONS.REQUESTED_AMOUNT'},
     
    ];
}
ngOnInit(): void {
  this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
this.orgnizationSetting = this.commonComponent.orgnizationSettings()
this.commonFunctionsService.data.subscribe((res: any) => {
  if (res) {
    this.translate.use(res);
  } else {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
  }
this.activateRoute.queryParams.subscribe(params => {
  this.commonComponent.startSpinner();
  if (params['id'] != undefined && params['id'] != null) {
      this.borrowingAccountId = this.encryptService.decrypt(params['id']);
    if (params['editbtn'] != undefined && params['editbtn'] != null) {
      let isEditParam = this.encryptService.decrypt(params['editbtn']);
      if (isEditParam == "1") {
        this.editbtn = true;
        this.viewButton = false;
      } else {
        this.editbtn = false;
        this.viewButton = true;
      }
    }
    if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
      let isGrid = this.encryptService.decrypt(params['isGridPage']);
      if (isGrid === "0") {
        this.isShowSubmit = applicationConstants.FALSE;
        // this.viewButton = false;
        this.editFlag = true;
      } else {
        this.isShowSubmit = applicationConstants.TRUE;
      }
    }
    this.isEdit = true;
    this.saoAccountDetailsService.getPreviewDataBySaoBorrowingAccountId(this.borrowingAccountId).subscribe(res => {
      this.responseModel = res;
      if(this.saoAccountdetailsModel.sanctionedDate != undefined && this.saoAccountdetailsModel.sanctionedDate != null)
        this.saoAccountdetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoAccountdetailsModel.sanctionedDate));
      if (this.responseModel != null && this.responseModel != undefined) {
        this.saoAccountdetailsModel = this.responseModel.data[0];

        if(null != this.saoAccountdetailsModel.sanctionedDate)
       this.saoAccountdetailsModel.sanctionedDate=this.datePipe.transform(this.saoAccountdetailsModel.sanctionedDate, this.orgnizationSetting.datePipe);

        if(null != this.saoAccountdetailsModel.applicationDate)
          this.saoAccountdetailsModel.applicationDate=this.datePipe.transform(this.saoAccountdetailsModel.applicationDate, this.orgnizationSetting.datePipe);


        if(null != this.saoAccountdetailsModel.requestedDate)
          this.saoAccountdetailsModel.requestedDate=this.datePipe.transform(this.saoAccountdetailsModel.requestedDate, this.orgnizationSetting.datePipe);


        if(null != this.saoAccountdetailsModel.borrowingDueDate)
          this.saoAccountdetailsModel.borrowingDueDate=this.datePipe.transform(this.saoAccountdetailsModel.borrowingDueDate, this.orgnizationSetting.datePipe);

        if(this.saoAccountdetailsModel.saoFileCopyPath != null && this.saoAccountdetailsModel.saoFileCopyPath != undefined)
          this.saoAccountdetailsModel.multipartFileList = this.fileUploadService.getFile(this.saoAccountdetailsModel.saoFileCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoAccountdetailsModel.saoFileCopyPath);


        if (this.saoAccountdetailsModel.signedCopyPath != null && this.saoAccountdetailsModel.signedCopyPath != undefined) {
          this.saoAccountdetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.saoAccountdetailsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoAccountdetailsModel.signedCopyPath);
          this.isDisableSubmit = false;
        }
        else {
          this.isDisableSubmit = true;
        }
        if (this.saoAccountdetailsModel.saoBorrowingAccountMappedLoansDTOList != null && this.saoAccountdetailsModel.saoBorrowingAccountMappedLoansDTOList.length > 0) {
          this.saoborrowingMappingList = this.saoAccountdetailsModel.saoBorrowingAccountMappedLoansDTOList;
        }
        if (this.saoAccountdetailsModel.saoBorrowingAccountDocumentsDTOList != null && this.saoAccountdetailsModel.saoBorrowingAccountDocumentsDTOList.length > 0) {
          this.borrowingdocumentlist = this.saoAccountdetailsModel.saoBorrowingAccountDocumentsDTOList;

          this.borrowingdocumentlist  = this.borrowingdocumentlist.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE ).map((kyc:any)=>{
            kyc.multipartFileList = this.fileUploadService.getFile(kyc.documentPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.documentPath);
            return kyc;
          });
        }
      }
    });
  } else {
    this.isEdit = false;
  }
})
})
}


submit() {
  if (this.saoAccountdetailsModel.applicationDate != null && this.saoAccountdetailsModel.applicationDate != undefined) {
    this.saoAccountdetailsModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoAccountdetailsModel.applicationDate));
  }
  if (this.saoAccountdetailsModel.sanctionedDate != null && this.saoAccountdetailsModel.sanctionedDate != undefined) {
    this.saoAccountdetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoAccountdetailsModel.sanctionedDate));
  }
  if (this.saoAccountdetailsModel.requestedDate != null && this.saoAccountdetailsModel.requestedDate != undefined) {
    this.saoAccountdetailsModel.requestedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoAccountdetailsModel.requestedDate));
  }
  if (this.saoAccountdetailsModel.borrowingDueDate != null && this.saoAccountdetailsModel.borrowingDueDate != undefined) {
    this.saoAccountdetailsModel.borrowingDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoAccountdetailsModel.borrowingDueDate));
  }
  this.saoAccountdetailsModel.accountStatus = 5;
  this.saoAccountdetailsModel.accountStatusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
  this.saoAccountDetailsService.updateSaoAccountDetails(this.saoAccountdetailsModel).subscribe((response: any) => {
    this.responseModel = response;
    if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
      if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
        this.saoAccountdetailsModel = this.responseModel.data[0];
        if (this.saoAccountdetailsModel.id != undefined && this.saoAccountdetailsModel.id != null)
          this.borrowingAccountId = this.saoAccountdetailsModel.id;
      
        if (this.responseModel.data[0].accountNumber != null && this.saoAccountdetailsModel.accountNumber != undefined)
          this.accountNumber = this.saoAccountdetailsModel.accountNumber;         
      }
      this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 1200);
      this.router.navigate([BorrowingTransactionConstant.SAO_BORROWINGS]);
    } else {
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
  }, (error: any) => {
    this.commonComponent.stopSpinner();
    this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
    setTimeout(() => {
      this.msgs = [];
    }, 3000);
  });

}
navigateToBack() {
if (this.roleName == "Manager") {
  this.router.navigate([approvaltransactionsconstant.SAO_BORROWING_TRANSACTION_DETAILS]);
} else {
  this.router.navigate([BorrowingTransactionConstant.SAO_BORROWINGS]);
}
}
editSaoBorrowingDetails(rowData: any, activeIndex: any) {
switch (activeIndex) {
  case 0:
    this.router.navigate([BorrowingTransactionConstant.SAO_ACCOUNT_DETAILS], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
    break;
  case 1:
    this.router.navigate([BorrowingTransactionConstant.SAO_BORROWING_ACCOUNT_MAPPING], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
    break;
  case 2:
    this.router.navigate([BorrowingTransactionConstant.SAO_BORROWING_DOCUMENT], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
    break;
}
}

fileUploader(event: any, fileUpload: FileUpload) {
this.isFileUploaded = applicationConstants.FALSE;
this.saoAccountdetailsModel.multipartFileList = [];
this.multipartFileList = [];
this.saoAccountdetailsModel.filesDTO = null; // Initialize as a single object
this.saoAccountdetailsModel.signedCopyPath = null;
let file = event.files[0]; // Only one file
let reader = new FileReader();
reader.onloadend = (e) => {
  let filesDTO = new FileUploadModel();
  this.uploadFileData = e.target as FileReader;
  filesDTO.fileName = "SAO_Borrowing_Filled_pdf"+ this.commonComponent.getTimeStamp() + "_" + file.name;
  filesDTO.fileType = file.type.split('/')[1];
  filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
  filesDTO.imageValue = this.uploadFileData.result as string;
  // this.filesDTOList = [filesDTO]

  this.saoAccountdetailsModel.filesDTO = filesDTO;
  this.saoAccountdetailsModel.signedCopyPath = filesDTO.fileName;
  this.isDisableSubmit = false;
  let index1 = event.files.indexOf(file);
  if (index1 > -1) {
    fileUpload.remove(event, index1);
  }
  fileUpload.clear();
};

reader.readAsDataURL(file);
}

fileRemoveEvent() {
if (this.saoAccountdetailsModel.filesDTO != null && this.saoAccountdetailsModel.filesDTO != undefined && this.saoAccountdetailsModel.filesDTO.length > 0) {
  let removeFileIndex = this.saoAccountdetailsModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.saoAccountdetailsModel.signedCopyPath);
  this.saoAccountdetailsModel.filesDTO.splice(removeFileIndex, 1);
  this.saoAccountdetailsModel.signedCopyPath = null;
  this.isDisableSubmit = true;
}
}

pdfDownload() {
  this.commonComponent.startSpinner();
  this.saoAccountDetailsService.downloadPreviewPDf(this.borrowingAccountId).subscribe((data: any) => {
    var file = new Blob([data], { type: 'application/pdf' });
    saveAs(file, "SAO_Borrowing_application_filled_Document.pdf");
    this.msgs = [];
    this.msgs.push({ severity: "success", detail: 'SAO Borrowing application file downloaded successfully' });
    this.commonComponent.stopSpinner();
  }, error => {
    this.msgs = [];
    this.commonComponent.stopSpinner();
    this.msgs.push({ severity: "error", detail: 'Unable to download filled SAO Borrowing Application' });
  })
 
}

onClickdoccPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.docPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
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
