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
import { SaoAccountDetailsService } from 'src/app/transcations/borrowing-transaction/sao-borrowing/sao-borrowing-stepper/sao-account-details/shared/sao-account-details.service';
import { SaoAccountdetails } from 'src/app/transcations/borrowing-transaction/sao-borrowing/sao-borrowing-stepper/sao-account-details/shared/sao-accountdetails.model';
import { SaoBorrowingAccountMapping } from 'src/app/transcations/borrowing-transaction/sao-borrowing/sao-borrowing-stepper/sao-borrowing-account-mapping/shared/sao-borrowing-account-mapping.model';
import { SaoBorrowingDocuments } from 'src/app/transcations/borrowing-transaction/sao-borrowing/sao-borrowing-stepper/sao-borrowing-documents/shared/sao-borrowing-documents.model';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-sao-borrowing-approval',
  templateUrl: './sao-borrowing-approval.component.html',
  styleUrls: ['./sao-borrowing-approval.component.css']
})
export class SaoBorrowingApprovalComponent {
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
    private saoAccountDetailsService : SaoAccountDetailsService, private translate: TranslateService,

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
            this.getPreviewDataBySaoBorrowingAccountId();
        } 
      })
      this.getAllStatusList();
    }
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.SAO_BORROWING_TRANSACTION_DETAILS]);
  }

  submit() {
    // Determine the status name before submission
    if (this.saoAccountdetailsModel.status != null && this.saoAccountdetailsModel.status != undefined) {
      const accountStatusName = this.statusList.find((data: any) => data != null && data.value === this.saoAccountdetailsModel.accountStatusName);
      if (accountStatusName != null && accountStatusName != undefined) {
        this.saoAccountdetailsModel.accountStatusName = accountStatusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }

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
        this.router.navigate([approvaltransactionsconstant.SAO_BORROWING_TRANSACTION_DETAILS]);
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
      this.saoAccountdetailsModel.accountStatusName = selectedStatus.label;
    }
  }
  getPreviewDataBySaoBorrowingAccountId() {
    this.saoAccountDetailsService.getPreviewDataBySaoBorrowingAccountId(this.borrowingAccountId).subscribe(res => {
      this.responseModel = res;
      if(this.saoAccountdetailsModel.sanctionedDate != undefined && this.saoAccountdetailsModel.sanctionedDate != null)
        this.saoAccountdetailsModel.sanctionedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoAccountdetailsModel.sanctionedDate));
      if (this.responseModel != null && this.responseModel != undefined) {
        this.saoAccountdetailsModel = this.responseModel.data[0];

        this.saoAccountdetailsModel.accountStatus = null;
        this.saoAccountdetailsModel.accountStatusName = null;

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

        if (this.saoAccountdetailsModel.signedCopyPath != null && this.saoAccountdetailsModel.signedCopyPath != undefined) 
          this.saoAccountdetailsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.saoAccountdetailsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.BORROWINGS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoAccountdetailsModel.signedCopyPath);
          this.isDisableSubmit = false;
       
       
         
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
    }
  }

  // for submit button validation based on status
 


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
