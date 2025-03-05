import { Component, ElementRef, ViewChild } from '@angular/core';
import { BorrowingTransactionConstant } from '../../borrowing-transaction-constants';
import { TermAccountDetails } from '../term-borrowing-stepper/term-account-details/shared/term-account-details.model';
import { TermBorrowingAccountMapping } from '../term-borrowing-stepper/term-borrowing-account-mapping/shared/term-borrowing-account-mapping.model';
import { TermBorrowingDocument } from '../term-borrowing-stepper/term-borrowing-document/shared/term-borrowing-document.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { TermAccountDetailsService } from '../term-borrowing-stepper/term-account-details/shared/term-account-details.service';
import { TermBorrowingAccountMappingService } from '../term-borrowing-stepper/term-borrowing-account-mapping/shared/term-borrowing-account-mapping.service';
import { TermBorrowingDocumentService } from '../term-borrowing-stepper/term-borrowing-document/shared/term-borrowing-document.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { approvaltransactionsconstant } from 'src/app/transcations/approval-transcations/approval-transactions-constant';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-term-view-borrowing',
  templateUrl: './term-view-borrowing.component.html',
  styleUrls: ['./term-view-borrowing.component.css']
})
export class TermViewBorrowingComponent {
  termAccountDetailsModel :TermAccountDetails = new TermAccountDetails();
  termBorrowingAccountMappingModel:TermBorrowingAccountMapping = new TermBorrowingAccountMapping();
  termBorrowingDocumentModel:TermBorrowingDocument = new TermBorrowingDocument();

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
  termborrowingMappingList: any[]=[];
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
  isMaximized: boolean = false;
  docPhotoCopyZoom: boolean = false;
  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
   
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService,
    private termAccountDetailsService : TermAccountDetailsService,private termBorrowingAccountMappingService:TermBorrowingAccountMappingService,
    private termBorrowingDocumentService :TermBorrowingDocumentService,private translate: TranslateService,
    private fileUploadService :FileUploadService) {

      this.borrowingaccountmapping = [
        { field: 'loanMemberAdmissionNumber', header: 'BORROWINGSTRANSACTIONS.ADMISSION_NUMBER' },
        { field: 'loanAccountNumber', header: 'BORROWINGSTRANSACTIONS.LOAN_ACCOUNT_NUMBER' },
        { field: '', header: 'BORROWINGSTRANSACTIONS.NAME' },
        { field: '', header: 'BORROWINGSTRANSACTIONS.DATE_OF_BIRTH' },
        { field: '',header:'BORROWINGSTRANSACTIONS.AADHAR_NUMBER'},
        { field: '',header:'BORROWINGSTRANSACTIONS.PURPOSE'},
        { field: 'loanAmount',header:'BORROWINGSTRANSACTIONS.REQUESTED_AMOUNT'},
       
      ];
      // this.borrowingdocument = [
      //   { field: 'documentTypeName', header: 'BORROWINGSTRANSACTIONS.DOCUMENT_TYPE' },
      //   { field: 'documentNumber', header: 'BORROWINGSTRANSACTIONS.DOCUMENT_NO' },
      //   { field: '', header: 'BORROWINGSTRANSACTIONS.FILE_PATH' },
      //   { field: '', header: 'BORROWINGSTRANSACTIONS.REMARKS' },
        
       
      // ];
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
      this.termAccountDetailsService.getPreviewDataByBorrowingAccountId(this.borrowingAccountId).subscribe(res => {
        this.responseModel = res;
        if(this.termAccountDetailsModel.sanctionedDate != undefined && this.termAccountDetailsModel.sanctionedDate != null)
          this.termAccountDetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termAccountDetailsModel.sanctionedDate));
        if (this.responseModel != null && this.responseModel != undefined) {
          this.termAccountDetailsModel = this.responseModel.data[0];
  
          if(null != this.termAccountDetailsModel.sanctionedDate)
         this.termAccountDetailsModel.sanctionedDate=this.datePipe.transform(this.termAccountDetailsModel.sanctionedDate, this.orgnizationSetting.datePipe);
  
          if(null != this.termAccountDetailsModel.applicationDate)
            this.termAccountDetailsModel.applicationDate=this.datePipe.transform(this.termAccountDetailsModel.applicationDate, this.orgnizationSetting.datePipe);
  
  
          if(null != this.termAccountDetailsModel.requestedDate)
            this.termAccountDetailsModel.requestedDate=this.datePipe.transform(this.termAccountDetailsModel.requestedDate, this.orgnizationSetting.datePipe);
  
  
          if(null != this.termAccountDetailsModel.borrowingDueDate)
            this.termAccountDetailsModel.borrowingDueDate=this.datePipe.transform(this.termAccountDetailsModel.borrowingDueDate, this.orgnizationSetting.datePipe);

          if(null != this.termAccountDetailsModel.borrowingDueDate)
            this.termAccountDetailsModel.borrowingDueDate=this.datePipe.transform(this.termAccountDetailsModel.borrowingDueDate, this.orgnizationSetting.datePipe);

          if(this.termAccountDetailsModel.termFileCopyPath != null && this.termAccountDetailsModel.termFileCopyPath != undefined)
            this.termAccountDetailsModel.multipartFileList = this.fileUploadService.getFile(this.termAccountDetailsModel.termFileCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termAccountDetailsModel.termFileCopyPath);
  
          if (this.termAccountDetailsModel.signedCopyPath != null && this.termAccountDetailsModel.signedCopyPath != undefined) {
            this.termAccountDetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.termAccountDetailsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termAccountDetailsModel.signedCopyPath);
            this.isDisableSubmit = false;
          }
          else {
            this.isDisableSubmit = true;
          }
          
          if (this.termAccountDetailsModel.borrowingAccountMappedLoansDTOList != null && this.termAccountDetailsModel.borrowingAccountMappedLoansDTOList.length > 0) {
            this.termborrowingMappingList = this.termAccountDetailsModel.borrowingAccountMappedLoansDTOList;
          }
          if (this.termAccountDetailsModel.borrowingAccountDocumentsDTOList != null && this.termAccountDetailsModel.borrowingAccountDocumentsDTOList.length > 0) {
            this.borrowingdocumentlist = this.termAccountDetailsModel.borrowingAccountDocumentsDTOList;

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
    if (this.termAccountDetailsModel.applicationDate != null && this.termAccountDetailsModel.applicationDate != undefined) {
      this.termAccountDetailsModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termAccountDetailsModel.applicationDate));
    }
    if (this.termAccountDetailsModel.sanctionedDate != null && this.termAccountDetailsModel.sanctionedDate != undefined) {
      this.termAccountDetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termAccountDetailsModel.sanctionedDate));
    }
    if (this.termAccountDetailsModel.requestedDate != null && this.termAccountDetailsModel.requestedDate != undefined) {
      this.termAccountDetailsModel.requestedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termAccountDetailsModel.requestedDate));
    }
    if (this.termAccountDetailsModel.borrowingDueDate != null && this.termAccountDetailsModel.borrowingDueDate != undefined) {
      this.termAccountDetailsModel.borrowingDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termAccountDetailsModel.borrowingDueDate));
    }

    
    this.termAccountDetailsModel.accountStatus = 5;
    this.termAccountDetailsModel.accountStatusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.termAccountDetailsService.updateTermAccountDetails(this.termAccountDetailsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.termAccountDetailsModel = this.responseModel.data[0];
          if (this.termAccountDetailsModel.id != undefined && this.termAccountDetailsModel.id != null)
            this.borrowingAccountId = this.termAccountDetailsModel.id;
        
          if (this.responseModel.data[0].accountNumber != null && this.termAccountDetailsModel.accountNumber != undefined)
            this.accountNumber = this.termAccountDetailsModel.accountNumber;         
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.router.navigate([BorrowingTransactionConstant.TERM_BORROWINGS]);
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
    this.router.navigate([approvaltransactionsconstant.TERM_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
  } else {
    this.router.navigate([BorrowingTransactionConstant.TERM_BORROWINGS]);
  }
}
editTermBorrowingDetails(rowData: any, activeIndex: any) {
  switch (activeIndex) {
    case 0:
      this.router.navigate([BorrowingTransactionConstant.TERM_ACCOUNT_DETAILS], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
      break;
    case 1:
      this.router.navigate([BorrowingTransactionConstant.TERM_BORROWING_ACCOUNT_MAPPING], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
      break;
    case 2:
      this.router.navigate([BorrowingTransactionConstant.TERM_BORROWING_DOCUMENT], { queryParams: { id: this.encryptService.encrypt(rowData.id) } });
      break;
  }
}

fileUploader(event: any, fileUpload: FileUpload) {
  this.isFileUploaded = applicationConstants.FALSE;
  this.termAccountDetailsModel.multipartFileList = [];
  this.multipartFileList = [];
  this.termAccountDetailsModel.filesDTO = null; // Initialize as a single object
  this.termAccountDetailsModel.signedCopyPath = null;
  let file = event.files[0]; // Only one file
  let reader = new FileReader();
  reader.onloadend = (e) => {
    let filesDTO = new FileUploadModel();
    this.uploadFileData = e.target as FileReader;
    filesDTO.fileName = "TERM_Borrowing_Filled_pdf"+ this.commonComponent.getTimeStamp() + "_" + file.name;
    filesDTO.fileType = file.type.split('/')[1];
    filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
    filesDTO.imageValue = this.uploadFileData.result as string;
    // this.filesDTOList = [filesDTO]

    this.termAccountDetailsModel.filesDTO = filesDTO;
    this.termAccountDetailsModel.signedCopyPath = filesDTO.fileName;
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
  if (this.termAccountDetailsModel.filesDTO != null && this.termAccountDetailsModel.filesDTO != undefined && this.termAccountDetailsModel.filesDTO.length > 0) {
    let removeFileIndex = this.termAccountDetailsModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.termAccountDetailsModel.signedCopyPath);
    this.termAccountDetailsModel.filesDTO.splice(removeFileIndex, 1);
    this.termAccountDetailsModel.signedCopyPath = null;
    this.isDisableSubmit = true;
  }
}

pdfDownload() {
  this.commonComponent.startSpinner();
  this.termAccountDetailsService.downloadPreviewPDf(this.borrowingAccountId).subscribe((data: any) => {
    var file = new Blob([data], { type: 'application/pdf' });
    saveAs(file, "TERM_Borrowing_application_filled_Document.pdf");
    this.msgs = [];
    this.msgs.push({ severity: "success", detail: 'TERM Borrowing application file downloaded successfully' });
    this.commonComponent.stopSpinner();
  }, error => {
    this.msgs = [];
    this.commonComponent.stopSpinner();
    this.msgs.push({ severity: "error", detail: 'Unable to download filled Term Borrowing Application' });
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
