import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonCategoryService } from 'src/app/configurations/investments-config/common-category/shared/common-category.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { InvestmentsTransactionConstant } from 'src/app/transcations/investments-transaction/investments-transaction-constants';
import { SharesInvestments } from 'src/app/transcations/investments-transaction/shares-investments/shared/shares-investments.model';
import { SharesInvestmentsService } from 'src/app/transcations/investments-transaction/shares-investments/shared/shares-investments.service';

@Component({
  selector: 'app-shares-investment-approval',
  templateUrl: './shares-investment-approval.component.html',
  styleUrls: ['./shares-investment-approval.component.css']
})
export class SharesInvestmentApprovalComponent {

  orgnizationSetting: any;
  responseModel!: Responsemodel;
  sharesInvestmentsModel: SharesInvestments = new SharesInvestments();
  msgs: any[] = [];
  isShowSubmit: boolean = applicationConstants.FALSE;
  shareCertificateCopyFile: any[] = [];
  signedCopyFile: any[] = [];
  status: any;
  remarks: any;
  submitFlag: boolean = true;
  statusList: any[] = [];
  constructor(private router: Router,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private sharesInvestmentsService: SharesInvestmentsService,
    private translate: TranslateService,
    private activateRoute: ActivatedRoute,
    private fileUploadService: FileUploadService,
    private commonCategoryService: CommonCategoryService) {

  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }
    })
    this.getAllStatusList();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        if (params['view'] != undefined && params['view'] != null) {
          let isview = Number(this.encryptDecryptService.decrypt(params['view']));
          if (isview == applicationConstants.IN_ACTIVE) {
            this.isShowSubmit = applicationConstants.FALSE;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        else if (params['approve'] != undefined && params['approve'] != null) {
          let approve = Number(this.encryptDecryptService.decrypt(params['approve']));
          if (approve == applicationConstants.ACTIVE) {
            this.isShowSubmit = applicationConstants.TRUE;
          } else {
            this.isShowSubmit = applicationConstants.FALSE;
          }
        }
        this.sharesInvestmentsService.getSharesInvestmentsById(id).subscribe(res => {
          this.responseModel = res;
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel != null && this.responseModel != undefined && 
              this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.sharesInvestmentsModel = this.responseModel.data[0];
              if (this.sharesInvestmentsModel != null && this.sharesInvestmentsModel != undefined) {
                if (this.sharesInvestmentsModel.sharesPurchasedDate != null) {
                  this.sharesInvestmentsModel.sharesPurchasedDate = this.datePipe.transform(this.sharesInvestmentsModel.sharesPurchasedDate, this.orgnizationSetting.datePipe);
                }
                this.remarks = this.sharesInvestmentsModel.remarks;
                this.status = this.sharesInvestmentsModel.status;
                if (this.sharesInvestmentsModel.shareCertificateCopyPath != null && this.sharesInvestmentsModel.shareCertificateCopyPath != undefined) {
                  this.shareCertificateCopyFile = this.fileUploadService.getFile(this.sharesInvestmentsModel.shareCertificateCopyPath,
                    ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.sharesInvestmentsModel.shareCertificateCopyPath);
                }
                if (this.sharesInvestmentsModel.signedCopyPath != null && this.sharesInvestmentsModel.signedCopyPath != undefined) {
                  this.signedCopyFile = this.fileUploadService.getFile(this.sharesInvestmentsModel.signedCopyPath,
                    ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.sharesInvestmentsModel.signedCopyPath);
                }
              }
              else {
                this.msgs = [];
                this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
                setTimeout(() => {
                  this.msgs = [];
                }, 2000);
              }
            }
          } else {
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        });
      }
    })
  }

  navigateToBack() {
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_APPROVAL]);
  }

  getAllStatusList() {
    this.commonCategoryService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.statusList = this.responseModel.data;
            this.statusList = this.statusList.filter((obj: any) => obj != null && obj.name == CommonStatusData.REJECTED || obj.name == CommonStatusData.APPROVED ||
              obj.name == CommonStatusData.REQUEST_FOR_RESUBMISSION).map((status: { name: any; id: any; }) => {
                return { label: status.name, value: status.id };
              });
          } else {
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

  onChangeStatus(status: any) {
    if (status != null && status != undefined) {
      this.statusList.filter(data => data.value == status).map(count => {
        this.sharesInvestmentsModel.statusName = count.label;
      });
      this.submitFlag = false;
    } else
      this.submitFlag = true;
  }

  submit() {
    this.commonComponent.startSpinner();
    if (this.sharesInvestmentsModel.sharesPurchasedDate != null) {
      this.sharesInvestmentsModel.sharesPurchasedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.sharesInvestmentsModel.sharesPurchasedDate));
    }
    this.sharesInvestmentsModel.remarks = this.remarks;
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
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

}
