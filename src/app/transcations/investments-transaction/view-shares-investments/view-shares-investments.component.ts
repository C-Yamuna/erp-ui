import { Component, OnInit } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SharesInvestments } from '../shares-investments/shared/shares-investments.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FormBuilder } from '@angular/forms';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { SharesInvestmentsService } from '../shares-investments/shared/shares-investments.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { InvestmentsTransactionConstant } from '../investments-transaction-constants';
import { TranslateService } from '@ngx-translate/core';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-shares-investments',
  templateUrl: './view-shares-investments.component.html',
  styleUrls: ['./view-shares-investments.component.css']
})
export class ViewSharesInvestmentsComponent implements OnInit {

  orgnizationSetting: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  sharesInvestmentsModel: SharesInvestments = new SharesInvestments();
  msgs: any[] = [];
  buttonDisabled: boolean = false;
  editbutton: boolean = true;
  isShowSubmit: boolean = applicationConstants.FALSE;
  shareCertificateCopyFile: any[] = [];
  uploadFileData: any;
  id: any;
  signedCopyFile: any[] = [];
  fileFlag: boolean = false;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private sharesInvestmentsService: SharesInvestmentsService,
    private translate: TranslateService,
    private activateRoute: ActivatedRoute,
    private fileUploadService: FileUploadService) {

  }
  //view shares investments details based on id
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
    })
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        this.id = this.encryptDecryptService.decrypt(params['id']);
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
        this.isEdit = true;
        this.sharesInvestmentsService.getSharesInvestmentsById(this.id).subscribe(res => {
          this.responseModel = res;
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.sharesInvestmentsModel = this.responseModel.data[0];
            if (this.sharesInvestmentsModel.sharesPurchasedDate != null) {
              this.sharesInvestmentsModel.sharesPurchasedDate = this.datePipe.transform(this.sharesInvestmentsModel.sharesPurchasedDate, this.orgnizationSetting.datePipe);
            }
            if (this.sharesInvestmentsModel.shareCertificateCopyPath != null && this.sharesInvestmentsModel.shareCertificateCopyPath != undefined) {
              this.shareCertificateCopyFile = this.fileUploadService.getFile(this.sharesInvestmentsModel.shareCertificateCopyPath,
                ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.sharesInvestmentsModel.shareCertificateCopyPath);
            }
            if (this.sharesInvestmentsModel.signedCopyPath != null && this.sharesInvestmentsModel.signedCopyPath != undefined) {
              this.signedCopyFile = this.fileUploadService.getFile(this.sharesInvestmentsModel.signedCopyPath,
                ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.sharesInvestmentsModel.signedCopyPath);
                this.fileFlag = true;
            }
            // this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          } else {
            this.commonComponent.stopSpinner();
            this.buttonDisabled = applicationConstants.FALSE;
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        });
      } else {
        this.isEdit = false;
      }
    })
  }

  navigateToBack() {
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_TRANSACTION]);
  }
  submit() {
    if (this.sharesInvestmentsModel.sharesPurchasedDate != null) {
      this.sharesInvestmentsModel.sharesPurchasedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.sharesInvestmentsModel.sharesPurchasedDate));
    }
    if (this.sharesInvestmentsModel.id != undefined) {
      this.sharesInvestmentsModel.accountStatusName = "Submission for Approval";
      this.sharesInvestmentsService.updateSharesInvestments(this.sharesInvestmentsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          this.buttonDisabled = applicationConstants.FALSE;
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.buttonDisabled = applicationConstants.FALSE;
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
    }
  }

  editSharesDetails(rowData: any) {
    this.router.navigate([InvestmentsTransactionConstant.SHARES_INVESTMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  pdfDownload() {
    this.commonComponent.startSpinner();
    this.sharesInvestmentsService.downloadPreviewPDf(this.id).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "Shares_Investment_filled_document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'Shares Investment file downloaded successfully' });
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
    this.sharesInvestmentsModel.filesDTOList = [];
    this.sharesInvestmentsModel.signedCopyPath = null;
    this.signedCopyFile = [];
    let file = event.files[0];
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "Signed_Shares_Investment_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.sharesInvestmentsModel.filesDTOList.push(filesDTO);
      this.sharesInvestmentsModel.signedCopyPath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  fileRemoveEvent() {
    if (this.sharesInvestmentsModel.filesDTOList != null && this.sharesInvestmentsModel.filesDTOList != undefined) {
      this.sharesInvestmentsModel.signedCopyPath = null;
      this.sharesInvestmentsModel.filesDTOList = null;
      this.signedCopyFile = [];
    }
  }
}
