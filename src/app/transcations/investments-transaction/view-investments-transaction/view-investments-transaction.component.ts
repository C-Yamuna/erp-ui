import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InvestmentApplicationDetails } from '../deposit-investments/investments-application-details/shared/investment-application-details.model';
import { InvestmentAccountDocuments } from '../deposit-investments/investment-account-documents/shared/investment-account-documents.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { InvestmentApplicationDetailsService } from '../deposit-investments/investments-application-details/shared/investment-application-details.service';
import { InvestmentsTransactionConstant } from '../investments-transaction-constants';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-investments-transaction',
  templateUrl: './view-investments-transaction.component.html',
  styleUrls: ['./view-investments-transaction.component.css']
})
export class ViewInvestmentsTransactionComponent implements OnInit {
  orgnizationSetting:any;
  isEdit: boolean = false;
  msgs: any[] = [];
  buttonDisabled: boolean = false;
  responseModel !: Responsemodel;
  investmentAccountDocumentsList: any[] = [];
  investmentApplicationDetailsModel: InvestmentApplicationDetails = new InvestmentApplicationDetails();
  investmentAccountDocumentsModel: InvestmentAccountDocuments = new InvestmentAccountDocuments();
  termAccId: any;
  editbutton: boolean = true;
  isShowSubmit: boolean =applicationConstants.FALSE;
  depositTypeList : any[] = [];
  depositTypeName: any;
  autoRenewalTypeList: any[] = [];
  autoRenewalTypeName: any;
  installmentAmountFlag: boolean = false;
  signedCopyFile: any[] = [];
  uploadFileData: any;
  depostiBondFile: any[] = [];
  fileFlag: boolean = false;
  resolutionCopyFileList: any[] = [];
  isMaximized: boolean = false;
  docPhotoCopyZoom: boolean = false;
  multipleFilesList: any[] = [];
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private fileUploadService: FileUploadService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private investmentApplicationDetailsService: InvestmentApplicationDetailsService) {
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.depositTypeList = this.commonComponent.depositTypeList();
    this.autoRenewalTypeList = this.commonComponent.autoRenewalType();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
    })
    this.activateRoute.queryParams.subscribe(params => {
      this.commonComponent.startSpinner();
      if (params['id'] != undefined && params['id'] != null) {
          this.termAccId = this.encryptDecryptService.decrypt(params['id']);
        if (params['editbutton'] != undefined && params['editbutton'] != null) {
          let isEditParam = this.encryptDecryptService.decrypt(params['editbutton']);
          if (isEditParam == "1") {
            this.editbutton = true;
          } else {
            this.editbutton = false;
          }
          if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
            let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
            if (isGrid === "0") {
              this.isShowSubmit = applicationConstants.FALSE;
            } else {
              this.isShowSubmit = applicationConstants.TRUE;
            }
          }
        }
        this.isEdit = true;
        this.investmentApplicationDetailsService.getPreviewByTermAccountId(this.termAccId).subscribe(res => {
          this.responseModel = res;
          if (this.responseModel != null && this.responseModel != undefined) {
            this.investmentApplicationDetailsModel = this.responseModel.data[0];
            if (this.investmentApplicationDetailsModel.depositDate != null) {
              this.investmentApplicationDetailsModel.depositDate = this.datePipe.transform(this.investmentApplicationDetailsModel.depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.investmentApplicationDetailsModel.maturityDate != null) {
              this.investmentApplicationDetailsModel.maturityDate = this.datePipe.transform(this.investmentApplicationDetailsModel.maturityDate, this.orgnizationSetting.datePipe);
            }
            if(this.investmentApplicationDetailsModel.depositType != undefined && this.investmentApplicationDetailsModel.depositType != null){
              this.depositTypeList.filter(data => data.value == this.investmentApplicationDetailsModel.depositType).map(count =>{
                this.depositTypeName = count.label;
              });
            }
            if (this.investmentApplicationDetailsModel.resolutionDate != null) {
              this.investmentApplicationDetailsModel.resolutionDate = this.datePipe.transform(this.investmentApplicationDetailsModel.resolutionDate, this.orgnizationSetting.datePipe);
            }
            if (this.investmentApplicationDetailsModel.isAutoRenewal != null && this.investmentApplicationDetailsModel.isAutoRenewal != undefined) {
              if(this.investmentApplicationDetailsModel.isAutoRenewal)
                this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.YES;
              else
                this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.NO;
            }else
            this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.NO;
            if(this.investmentApplicationDetailsModel.autoRenewalType != null && this.investmentApplicationDetailsModel.autoRenewalType != undefined){
              this.autoRenewalTypeList.filter(data => data.value == this.investmentApplicationDetailsModel.autoRenewalType).map(count =>{
                this.autoRenewalTypeName = count.label;
              });
            }else
              this.autoRenewalTypeName = "-";

            if(this.investmentApplicationDetailsModel.signedCopyPath != null && this.investmentApplicationDetailsModel.signedCopyPath != undefined){
                this.signedCopyFile = this.fileUploadService.getFile(this.investmentApplicationDetailsModel.signedCopyPath ,
                ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.investmentApplicationDetailsModel.signedCopyPath);
                this.fileFlag = true;
            }
            if(this.investmentApplicationDetailsModel.depositBondCopyPath != null && this.investmentApplicationDetailsModel.depositBondCopyPath != undefined){
              this.investmentApplicationDetailsModel.multipartFileList = this.fileUploadService.getFile(this.investmentApplicationDetailsModel.depositBondCopyPath ,
              ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.investmentApplicationDetailsModel.depositBondCopyPath);
            }
            if (this.investmentApplicationDetailsModel.resolutionCopyPath != null && this.investmentApplicationDetailsModel.resolutionCopyPath != undefined) {
              this.resolutionCopyFileList = this.fileUploadService.getFile(this.investmentApplicationDetailsModel.resolutionCopyPath,
                ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.investmentApplicationDetailsModel.resolutionCopyPath);
            }
            if(this.investmentApplicationDetailsModel.depositType != undefined && this.investmentApplicationDetailsModel.depositType != null)
              this.onChangeDepositType(this.investmentApplicationDetailsModel.depositType);

            if(this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO != null &&  this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO != undefined && 
              this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO.length > 0){
              this.investmentAccountDocumentsList = this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO;
              this.investmentAccountDocumentsList  = this.investmentAccountDocumentsList.filter(obj => null != obj && null !=obj.status && obj.status === applicationConstants.ACTIVE ).map((document:any)=>{
                document.multipartFileList = this.fileUploadService.getFile(document.requiredDocPath ,ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocPath);
                return document;
              });
            }
          }
        });
      } else {
        this.isEdit = false;
      }
    })
  }

  onChangeDepositType(depositType: any) {
      if (depositType != null && depositType != undefined) {
        if (depositType == 3) {
          this.installmentAmountFlag = applicationConstants.TRUE;
        }else{
          this.installmentAmountFlag = applicationConstants.FALSE;
        }
      }
    }

  navigateToBack() {
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_TRANSACTION]);
  }
  submit() {
    if (this.investmentApplicationDetailsModel.id != null && this.investmentApplicationDetailsModel.id != undefined) {
      if (this.investmentApplicationDetailsModel.depositDate != null)
        this.investmentApplicationDetailsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.depositDate));
      
      if (this.investmentApplicationDetailsModel.maturityDate)
        this.investmentApplicationDetailsModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.maturityDate));

      if (this.investmentApplicationDetailsModel.resolutionDate != null)
        this.investmentApplicationDetailsModel.resolutionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.resolutionDate));
      
      if(this.investmentApplicationDetailsModel.isAutoRenewal == applicationConstants.YES)
        this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.TRUE;
      else
        this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.FALSE;

      this.investmentApplicationDetailsModel.statusName = "Submission for Approval";
      this.investmentApplicationDetailsService.updateInvestmentApplicationDetails(this.investmentApplicationDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        this.commonComponent.stopSpinner();
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateToBack();
        } else {
          this.commonComponent.stopSpinner();
          this.buttonDisabled = applicationConstants.FALSE;
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
    }
  }
  editDepositDetails(rowData: any, activeIndex: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_APPLICATION_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(this.termAccId) } });
        break;
      case 1:
        this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_ACCOUNT_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(this.termAccId) } });
        break;
    }
  }

  pdfDownload() {
    this.commonComponent.startSpinner();
    this.investmentApplicationDetailsService.downloadPreviewPDf(this.termAccId).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "Deposit_Investment_filled_document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'Deposit Investment file downloaded successfully' });
      this.commonComponent.stopSpinner();
      setTimeout(() => {
        this.msgs = [];
      }, 2500);
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: "error", detail: 'Unable to download filled document' });
      setTimeout(() => {
        this.msgs = [];
      }, 2500);
    })
  }

    fileUploader(event: any, fileUpload: FileUpload) {
      this.investmentApplicationDetailsModel.filesDTOList = [];
      this.investmentApplicationDetailsModel.signedCopyPath = null;
      this.signedCopyFile = [];
      if (event.files && event.files.length > 0) {
        let file = event.files[0];
        let reader = new FileReader();
        reader.onloadend = (e) => {
          let files = new FileUploadModel();
          this.uploadFileData = e.currentTarget;
          files.fileName = file.name;
          files.fileType = file.type.split('/')[1];
          files.value = this.uploadFileData.result.split(',')[1];
          files.imageValue = this.uploadFileData.result;
          let timeStamp = this.commonComponent.getTimeStamp();
          this.investmentApplicationDetailsModel.filesDTOList.push(files);
          this.investmentApplicationDetailsModel.filesDTOList[this.investmentApplicationDetailsModel.filesDTOList.length - 1].fileName = "Signed_Deposit_Investment_" + timeStamp + "_" + file.name;
          this.investmentApplicationDetailsModel.signedCopyPath = "Signed_Deposit_Investment_" + timeStamp + "_" + file.name;
        }
        reader.readAsDataURL(file);
      } else {
        console.warn("No file uploaded.");
      }
    }
  
    fileRemoveEvent() {
      if (this.investmentApplicationDetailsModel.filesDTOList != null && this.investmentApplicationDetailsModel.filesDTOList != undefined) {
        this.investmentApplicationDetailsModel.signedCopyPath = null;
        this.investmentApplicationDetailsModel.filesDTOList = null;
        this.signedCopyFile = [];
      }
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
