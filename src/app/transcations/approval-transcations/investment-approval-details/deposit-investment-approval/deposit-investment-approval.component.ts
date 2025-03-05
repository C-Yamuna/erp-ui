import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { InvestmentAccountDocuments } from 'src/app/transcations/investments-transaction/deposit-investments/investment-account-documents/shared/investment-account-documents.model';
import { InvestmentApplicationDetails } from 'src/app/transcations/investments-transaction/deposit-investments/investments-application-details/shared/investment-application-details.model';
import { InvestmentApplicationDetailsService } from 'src/app/transcations/investments-transaction/deposit-investments/investments-application-details/shared/investment-application-details.service';
import { InvestmentsTransactionConstant } from 'src/app/transcations/investments-transaction/investments-transaction-constants';
import { CommonCategoryService } from 'src/app/configurations/investments-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-deposit-investment-approval',
  templateUrl: './deposit-investment-approval.component.html',
  styleUrls: ['./deposit-investment-approval.component.css']
})
export class DepositInvestmentApprovalComponent {

  orgnizationSetting: any;
  msgs: any[] = [];
  buttonDisabled: boolean = false;
  responseModel !: Responsemodel;
  investmentAccountDocumentsList: any[] = [];
  investmentApplicationDetailsModel: InvestmentApplicationDetails = new InvestmentApplicationDetails();
  investmentAccountDocumentsModel: InvestmentAccountDocuments = new InvestmentAccountDocuments();
  id: any;
  isShowSubmit: boolean = applicationConstants.FALSE;
  depositTypeList: any[] = [];
  depositTypeName: any;
  autoRenewalTypeList: any[] = [];
  autoRenewalTypeName: any;
  installmentAmountFlag: boolean = false;
  statusList: any[] = [];
  signedCopyFile: any[] = [];
  status: any;
  remarks: any;
  submitFlag: boolean = true;
  depostiBondFile: any[] = [];
  resolutionCopyFileList: any[]=[];
  constructor(private router: Router,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private fileUploadService: FileUploadService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private commonCategoryService: CommonCategoryService,
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
    });
    this.getAllStatusList();
    this.activateRoute.queryParams.subscribe(params => {
      this.commonComponent.startSpinner();
      if (params['id'] != undefined && params['id'] != null) {
        this.id = this.encryptDecryptService.decrypt(params['id']);
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

        this.investmentApplicationDetailsService.getPreviewByTermAccountId(this.id).subscribe(res => {
          this.responseModel = res;
          if (this.responseModel != null && this.responseModel != undefined && 
            this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.investmentApplicationDetailsModel = this.responseModel.data[0];
            if (this.investmentApplicationDetailsModel != null && this.investmentApplicationDetailsModel != undefined) {
              if (this.investmentApplicationDetailsModel.depositDate != null) {
                this.investmentApplicationDetailsModel.depositDate = this.datePipe.transform(this.investmentApplicationDetailsModel.depositDate, this.orgnizationSetting.datePipe);
              }
              if (this.investmentApplicationDetailsModel.maturityDate != null) {
                this.investmentApplicationDetailsModel.maturityDate = this.datePipe.transform(this.investmentApplicationDetailsModel.maturityDate, this.orgnizationSetting.datePipe);
              }
              if (this.investmentApplicationDetailsModel.resolutionDate != null) {
                this.investmentApplicationDetailsModel.resolutionDate = this.datePipe.transform(this.investmentApplicationDetailsModel.resolutionDate, this.orgnizationSetting.datePipe);
              }
              if (this.investmentApplicationDetailsModel.depositType != undefined && this.investmentApplicationDetailsModel.depositType != null) {
                this.depositTypeList.filter(data => data.value == this.investmentApplicationDetailsModel.depositType).map(count => {
                  this.depositTypeName = count.label;
                });
              }
              if (this.investmentApplicationDetailsModel.isAutoRenewal != null && this.investmentApplicationDetailsModel.isAutoRenewal != undefined) {
                if (this.investmentApplicationDetailsModel.isAutoRenewal)
                  this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.YES;
                else
                  this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.NO;
              }

              this.remarks = this.investmentApplicationDetailsModel.remarks;
              this.status = this.investmentApplicationDetailsModel.status;

              if (this.investmentApplicationDetailsModel.autoRenewalType != null && this.investmentApplicationDetailsModel.autoRenewalType != undefined) {
                this.autoRenewalTypeList.filter(data => data.value == this.investmentApplicationDetailsModel.autoRenewalType).map(count => {
                  this.autoRenewalTypeName = count.label;
                });
              } else
                this.autoRenewalTypeName = "-";

              if (this.investmentApplicationDetailsModel.signedCopyPath != null && this.investmentApplicationDetailsModel.signedCopyPath != undefined) {
                this.signedCopyFile = this.fileUploadService.getFile(this.investmentApplicationDetailsModel.signedCopyPath,
                  ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.investmentApplicationDetailsModel.signedCopyPath);
              }
              if (this.investmentApplicationDetailsModel.depositBondCopyPath != null && this.investmentApplicationDetailsModel.depositBondCopyPath != undefined) {
                this.depostiBondFile = this.fileUploadService.getFile(this.investmentApplicationDetailsModel.depositBondCopyPath,
                  ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.investmentApplicationDetailsModel.depositBondCopyPath);
              }
              if (this.investmentApplicationDetailsModel.resolutionCopyPath != null && this.investmentApplicationDetailsModel.resolutionCopyPath != undefined) {
                this.resolutionCopyFileList = this.fileUploadService.getFile(this.investmentApplicationDetailsModel.resolutionCopyPath,
                  ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.investmentApplicationDetailsModel.resolutionCopyPath);
              }

              if (this.investmentApplicationDetailsModel.depositType != undefined && this.investmentApplicationDetailsModel.depositType != null)
                this.onChangeDepositType(this.investmentApplicationDetailsModel.depositType);

              if (this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO != null && this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO != undefined &&
                this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO.length > 0) {
                this.investmentAccountDocumentsList = this.investmentApplicationDetailsModel.investmentAccountDocumentsDTO;
                this.investmentAccountDocumentsList = this.investmentAccountDocumentsList.filter(obj => null != obj && null != obj.status && obj.status === applicationConstants.ACTIVE).map((document: any) => {
                  document.multipartFileList = this.fileUploadService.getFile(document.requiredDocPath, ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocPath);
                  return document;
                });
              }
            } else {
              this.msgs = [];
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
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
    });
  }
  onChangeStatus(status: any) {
    if (status != null && status != undefined) {
      this.statusList.filter(data => data.value == status).map(count => {
        this.investmentApplicationDetailsModel.statusName = count.label;
      });
      this.submitFlag = false;
    } else
      this.submitFlag = true;
  }
  onChangeDepositType(depositType: any) {
    if (depositType != null && depositType != undefined) {
      if (depositType == 3) {
        this.installmentAmountFlag = applicationConstants.TRUE;
      } else {
        this.installmentAmountFlag = applicationConstants.FALSE;
      }
    }
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

  submit() {
    if (this.investmentApplicationDetailsModel.id != null && this.investmentApplicationDetailsModel.id != undefined) {
      if (this.investmentApplicationDetailsModel.depositDate != null)
        this.investmentApplicationDetailsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.depositDate));

      if (this.investmentApplicationDetailsModel.maturityDate)
        this.investmentApplicationDetailsModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.maturityDate));

      if (this.investmentApplicationDetailsModel.resolutionDate != null)
        this.investmentApplicationDetailsModel.resolutionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.resolutionDate));
      
      if (this.investmentApplicationDetailsModel.isAutoRenewal == applicationConstants.YES)
        this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.TRUE;
      else
        this.investmentApplicationDetailsModel.isAutoRenewal = applicationConstants.FALSE;

      this.investmentApplicationDetailsModel.remarks = this.remarks;

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
}
