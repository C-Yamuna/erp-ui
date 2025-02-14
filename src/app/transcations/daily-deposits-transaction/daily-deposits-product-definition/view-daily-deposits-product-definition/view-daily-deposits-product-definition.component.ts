import { Component } from '@angular/core';
import { DailyDepositsProductDefinition } from '../shared/daily-deposits-product-definition.model';
import { InterestPolicy } from '../add-daily-deposits-product-definition/interest-policy/shared/interest-policy.model';
import { PenalityConfig } from '../add-daily-deposits-product-definition/penality-config/shared/penality-config.model';
import { RequiredDocuments } from '../add-daily-deposits-product-definition/required-documents/shared/required-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { FormBuilder } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { DailyDepositsProductDefinitionService } from '../shared/daily-deposits-product-definition.service';
import { DailyDepositTransactionConstants } from '../../daily-deposits-transaction-constants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-daily-deposits-product-definition',
  templateUrl: './view-daily-deposits-product-definition.component.html',
  styleUrls: ['./view-daily-deposits-product-definition.component.css']
})
export class ViewDailyDepositsProductDefinitionComponent {
  dailyDepositsProductDefinitionModel: DailyDepositsProductDefinition = new DailyDepositsProductDefinition();
  interestPolicyModel: InterestPolicy = new InterestPolicy();
  penalityConfigModel: PenalityConfig = new PenalityConfig();
  requiredDocumentsModel: RequiredDocuments = new RequiredDocuments();
  interestPolicyList: any[] = [];
  penalityConfigList: any[] = [];
  requiredDocumentsList: any[] = [];
  statusList: any[] = [];
  responseModel!: Responsemodel;
  msgs: any[] = [];
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  memberLandDetails: any;
  productId: any;
  editbtn: Boolean = applicationConstants.TRUE;
  isShowSubmit: boolean = applicationConstants.FALSE;
  constructor(private commonComponent: CommonComponent,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService,
    private datePipe: DatePipe,
    private router: Router,
    private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService,
    private dailyDepositsProductDefinitionService: DailyDepositsProductDefinitionService) {

  }
  ngOnInit(): void {
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
          this.productId = this.encryptService.decrypt(params['id']);
          if (params['editbtn'] != undefined && params['editbtn'] != null) {
            let isEditParam = this.encryptService.decrypt(params['editbtn']);
            if (isEditParam == "1") {
              this.editbtn = applicationConstants.TRUE;
            } else {
              this.editbtn = applicationConstants.FALSE;
            }
          }
          if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
            let isGrid = this.encryptService.decrypt(params['isGridPage']);
            if (isGrid === "0") {
              this.isShowSubmit = applicationConstants.FALSE;
            } else {
              this.isShowSubmit = applicationConstants.TRUE;
            }
          }
          this.isEdit = applicationConstants.TRUE;
          this.dailyDepositsProductDefinitionService.getProductOverviewById(this.productId).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel != null && this.responseModel != undefined) {
              this.dailyDepositsProductDefinitionModel = this.responseModel.data[0];

              if (null != this.dailyDepositsProductDefinitionModel.effectiveStartDate && undefined != this.dailyDepositsProductDefinitionModel.effectiveStartDate)
                this.dailyDepositsProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.dailyDepositsProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

              if (null != this.dailyDepositsProductDefinitionModel.effectiveEndDate && undefined != this.dailyDepositsProductDefinitionModel.effectiveEndDate)
                this.dailyDepositsProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.dailyDepositsProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

              if (this.dailyDepositsProductDefinitionModel.intestPolicyConfigList != null && this.dailyDepositsProductDefinitionModel.intestPolicyConfigList != undefined && this.dailyDepositsProductDefinitionModel.intestPolicyConfigList.length > 0) {
                this.interestPolicyList = this.dailyDepositsProductDefinitionModel.intestPolicyConfigList;
                // this.interestPolicyList = this.interestPolicyList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
                //   object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                //   return object;
                // });
              }
              if (this.dailyDepositsProductDefinitionModel.penaltyConfigList != null && this.dailyDepositsProductDefinitionModel.penaltyConfigList != undefined && this.dailyDepositsProductDefinitionModel.penaltyConfigList.length > 0) {
                this.penalityConfigList = this.dailyDepositsProductDefinitionModel.penaltyConfigList;
                // this.penalityConfigList = this.penalityConfigList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
                //   object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                //   return object;
                // });
              }
              if (this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList != null && this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList != undefined && this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList.length > 0) {
                this.requiredDocumentsList = this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList;
                // this.requiredDocumentsList = this.requiredDocumentsList.filter((data:any) => data !=null &&data.effectiveStartDate !=null).map((object:any) => {
                //   object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
                //   return object;
                // });
              }
            }
          });
        } else {
          this.isEdit = applicationConstants.FALSE;
        }
      })
    })
  }
  navigateToBack() {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DEFINITION]);
  }
  submit() {
    this.updateStatus();
    this.msgs = [];
    this.msgs = [{ severity: "success", detail: applicationConstants.DAILY_DEPOSIT_PRODUCT_DEFINITION }];
    setTimeout(() => {
      this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DEFINITION]);
    }, 1500);
  }
  editDailyDepositProductDefinationDetails(rowData: any, activeIndex: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_GENERAL_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.productId) } });
        break;
      case 1:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_INTEREST_POLICY], { queryParams: { id: this.encryptService.encrypt(rowData.productId) } });
        break;
      case 2:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_PENALITY_CONFIG], { queryParams: { id: this.encryptService.encrypt(rowData.productId) } });
        break;
      case 3:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_REQUIRED_DOCUMENTS], { queryParams: { id: this.encryptService.encrypt(rowData.productId) } });
        break;
    }
  }

  updateStatus() {
    if (this.dailyDepositsProductDefinitionModel.effectiveStartDate != undefined && this.dailyDepositsProductDefinitionModel.effectiveStartDate != null)
      this.dailyDepositsProductDefinitionModel.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(this.dailyDepositsProductDefinitionModel.effectiveStartDate));

    if (this.dailyDepositsProductDefinitionModel.effectiveEndDate != undefined && this.dailyDepositsProductDefinitionModel.effectiveEndDate != null)
      this.dailyDepositsProductDefinitionModel.effectiveEndDate = this.commonFunctionsService.getUTCEpoch(new Date(this.dailyDepositsProductDefinitionModel.effectiveEndDate));

    if (this.dailyDepositsProductDefinitionModel.intestPolicyConfigList != null && this.dailyDepositsProductDefinitionModel.intestPolicyConfigList != undefined && this.dailyDepositsProductDefinitionModel.intestPolicyConfigList.length > 0) {
      this.dailyDepositsProductDefinitionModel.intestPolicyConfigList = this.dailyDepositsProductDefinitionModel.intestPolicyConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.dailyDepositsProductDefinitionModel.penaltyConfigList != null && this.dailyDepositsProductDefinitionModel.penaltyConfigList != undefined && this.dailyDepositsProductDefinitionModel.penaltyConfigList.length > 0) {
      this.dailyDepositsProductDefinitionModel.penaltyConfigList = this.dailyDepositsProductDefinitionModel.penaltyConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }
    if (this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList != null && this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList != undefined && this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList.length > 0) {
      this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList = this.dailyDepositsProductDefinitionModel.requiredDocumentsConfigList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
        object.effectiveStartDate = this.commonFunctionsService.getUTCEpoch(new Date(object.effectiveStartDate));
        return object;
      });
    }

    this.dailyDepositsProductDefinitionModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.dailyDepositsProductDefinitionService.updateDailyDepositsProductDefinition(this.dailyDepositsProductDefinitionModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        if (this.responseModel != null && this.responseModel.data != undefined) {
          if (null != this.dailyDepositsProductDefinitionModel.effectiveStartDate && undefined != this.dailyDepositsProductDefinitionModel.effectiveStartDate)
            this.dailyDepositsProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.dailyDepositsProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];

          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

    pdfDownload() {
      this.commonComponent.startSpinner();
      this.dailyDepositsProductDefinitionService.downloadPreviewPDf(this.productId).subscribe((data: any) => {
        var file = new Blob([data], { type: 'application/pdf' });
        saveAs(file, "Daily_Deposit_Product_Definition_filled_document.pdf");
        this.msgs = [];
        this.msgs.push({ severity: "success", detail: 'Daily Deposit Product Definition file downloaded successfully' });
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
}
