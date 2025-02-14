import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonCategoryService } from 'src/app/configurations/borrowing-config/common-category/shared/common-category.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermAccountDetails } from 'src/app/transcations/borrowing-transaction/term-borrowing/term-borrowing-stepper/term-account-details/shared/term-account-details.model';
import { TermAccountDetailsService } from 'src/app/transcations/borrowing-transaction/term-borrowing/term-borrowing-stepper/term-account-details/shared/term-account-details.service';
import { TermBorrowingAccountMapping } from 'src/app/transcations/borrowing-transaction/term-borrowing/term-borrowing-stepper/term-borrowing-account-mapping/shared/term-borrowing-account-mapping.model';
import { TermBorrowingDocument } from 'src/app/transcations/borrowing-transaction/term-borrowing/term-borrowing-stepper/term-borrowing-document/shared/term-borrowing-document.model';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-term-borrowing-approval',
  templateUrl: './term-borrowing-approval.component.html',
  styleUrls: ['./term-borrowing-approval.component.css']
})
export class TermBorrowingApprovalComponent {
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
  viewButton: boolean = false;
  editFlag: boolean = false;
  uploadFileData: any;
  isShowSubmit: boolean =applicationConstants.FALSE;
  isFileUploaded: any;
  multipartFileList: any[] = [];
  isDisableSubmit: boolean = false;
  accountNumber: any;
  approvalForm: FormGroup ; 
  constructor(private commonComponent: CommonComponent, private formBuilder: FormBuilder,
    private termAccountDetailsService : TermAccountDetailsService, private translate: TranslateService,

    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,private datePipe: DatePipe,
    private router: Router, private commonFunctionsService: CommonFunctionsService, private commonStatusService: CommonCategoryService,
    private fileUploadService :FileUploadService,) {
      this.approvalForm = this.formBuilder.group({
      
        'remark': new FormControl('',),
        'status': new FormControl('', Validators.required),
      });
    
    }
    ngOnInit() {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined && params['editbtn'] != undefined) {
           let id = this.encryptService.decrypt(params['id']);
          // let type = this.encryptDecryptService.decrypt(params['memType']);
          let idEdit = this.encryptService.decrypt(params['editbtn']);
          this.borrowingAccountId = Number(id);
  
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
            this.viewButton = false;
            this.editFlag = true;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
            this.getPreviewDataByBorrowingAccountId();
        } 
      })
      this.getAllStatusList();
    }
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.TERM_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
  }

  submit() {
    // Determine the status name before submission
    if (this.termAccountDetailsModel.status != null && this.termAccountDetailsModel.status != undefined) {
      const accountStatusName = this.statusList.find((data: any) => data != null && data.value === this.termAccountDetailsModel.accountStatusName);
      if (accountStatusName != null && accountStatusName != undefined) {
        this.termAccountDetailsModel.accountStatusName = accountStatusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }

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
        this.router.navigate([approvaltransactionsconstant.TERM_BORROWING_APPROVAL_TRANSACTION_DETAILS]);
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
    onStatusChange(event: any) {
    const selectedStatus = this.statusList.find((data: any) => data.value === event.value);
    if (selectedStatus) {
      this.termAccountDetailsModel.accountStatusName = selectedStatus.label;
    }
  }
  getPreviewDataByBorrowingAccountId() {
    this.termAccountDetailsService.getPreviewDataByBorrowingAccountId(this.borrowingAccountId).subscribe(res => {
      this.responseModel = res;
      if(this.termAccountDetailsModel.sanctionedDate != undefined && this.termAccountDetailsModel.sanctionedDate != null)
        this.termAccountDetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termAccountDetailsModel.sanctionedDate));
      if (this.responseModel != null && this.responseModel != undefined) {
        this.termAccountDetailsModel = this.responseModel.data[0];


        this.termAccountDetailsModel.accountStatus = null;
        this.termAccountDetailsModel.accountStatusName = null;

        if(null != this.termAccountDetailsModel.sanctionedDate)
       this.termAccountDetailsModel.sanctionedDate=this.datePipe.transform(this.termAccountDetailsModel.sanctionedDate, this.orgnizationSetting.datePipe);

        if(null != this.termAccountDetailsModel.applicationDate)
          this.termAccountDetailsModel.applicationDate=this.datePipe.transform(this.termAccountDetailsModel.applicationDate, this.orgnizationSetting.datePipe);

        if(null != this.termAccountDetailsModel.requestedDate)
          this.termAccountDetailsModel.requestedDate=this.datePipe.transform(this.termAccountDetailsModel.requestedDate, this.orgnizationSetting.datePipe);

        if(null != this.termAccountDetailsModel.borrowingDueDate)
          this.termAccountDetailsModel.borrowingDueDate=this.datePipe.transform(this.termAccountDetailsModel.borrowingDueDate, this.orgnizationSetting.datePipe);

        if(this.termAccountDetailsModel.termFileCopyPath != null && this.termAccountDetailsModel.termFileCopyPath != undefined)
          this.termAccountDetailsModel.multipartFileList = this.fileUploadService.getFile(this.termAccountDetailsModel.termFileCopyPath ,ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termAccountDetailsModel.termFileCopyPath);

        if (this.termAccountDetailsModel.signedCopyPath != null && this.termAccountDetailsModel.signedCopyPath != undefined) 
          this.termAccountDetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.termAccountDetailsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termAccountDetailsModel.signedCopyPath);
         
       
         
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
    }
  }


  getAllStatusList() {
    this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.statusList = this.responseModel.data;
            this.statusList = this.responseModel.data.filter((obj: any) => obj != null && obj.name == CommonStatusData.REJECTED || obj.name == CommonStatusData.APPROVED ||
              obj.name == CommonStatusData.REQUEST_FOR_RESUBMISSION).map((status: { name: any; id: any; }) => {
            return { label: status.name, value: status.id };
            });
          }else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
}
