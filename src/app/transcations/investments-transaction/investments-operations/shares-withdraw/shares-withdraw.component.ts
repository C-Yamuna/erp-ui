import { Component, OnInit } from '@angular/core';
import { InvestmentsTransactionConstant } from '../../investments-transaction-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SharesInvestments } from '../../shares-investments/shared/shares-investments.model';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { SharesInvestmentsService } from '../../shares-investments/shared/shares-investments.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-shares-withdraw',
  templateUrl: './shares-withdraw.component.html',
  styleUrls: ['./shares-withdraw.component.css']
})
export class SharesWithdrawComponent implements OnInit {

  orgnizationSetting: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  sharesInvestmentsModel: SharesInvestments = new SharesInvestments();
  msgs: any[] = [];
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private sharesInvestmentsService: SharesInvestmentsService,
    private translate: TranslateService,
    private activateRoute: ActivatedRoute, private fileUploadService: FileUploadService
  ) {

  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
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
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.isEdit = true;
        this.sharesInvestmentsService.getSharesInvestmentsById(id).subscribe(res => {
          this.responseModel = res;
          this.sharesInvestmentsModel = this.responseModel.data[0];
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.sharesInvestmentsModel = this.responseModel.data[0];
            if (this.sharesInvestmentsModel.sharesPurchasedDate != null) {
              this.sharesInvestmentsModel.sharesPurchasedDate = this.datePipe.transform(this.sharesInvestmentsModel.sharesPurchasedDate, this.orgnizationSetting.datePipe);
            }
            setTimeout(() => {
              this.msgs = [];
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
          this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
      } else {
        this.isEdit = false;
      }
    })
  }

  navigateBack() {
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_TRANSACTION]);
  }

}
