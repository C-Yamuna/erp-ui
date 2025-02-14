import { Component, ViewChild } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InvestmentApplicationDetails } from '../../deposit-investments/investments-application-details/shared/investment-application-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { InvestmentApplicationDetailsService } from '../../deposit-investments/investments-application-details/shared/investment-application-details.service';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentsTransactionConstant } from '../../investments-transaction-constants';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { InterestPayment } from './shared/interest-payment.model';
import { InterestPaymentService } from './shared/interest-payment.service';

@Component({
  selector: 'app-investments-interest-payment',
  templateUrl: './investments-interest-payment.component.html',
  styleUrls: ['./investments-interest-payment.component.css']
})
export class InvestmentsInterestPaymentComponent {

  @ViewChild('dt', { static: applicationConstants.FALSE }) private dt!: Table;
  orgnizationSetting: any;
  isEdit: boolean = false;
  msgs: any[] = [];
  responseModel !: Responsemodel;
  investmentApplicationDetailsModel: InvestmentApplicationDetails = new InvestmentApplicationDetails();
  termAccId: any;
  depositTypeList: any[] = [];
  depositTypeName: any;
  interestPaymentForm: FormGroup;
  newRow: any;
  addButton: boolean = false;
  interestPaymentModel: InterestPayment = new InterestPayment();
  interestPaymentList: any[] = [];
  statusList: any[] = [];
  displayDialog: boolean = false;
  deleteId: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private commonComponent: CommonComponent,
    private encryptDecryptService: EncryptDecryptService,
    private fileUploadService: FileUploadService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private investmentApplicationDetailsService: InvestmentApplicationDetailsService,
    private interestPaymentService: InterestPaymentService) {

    this.interestPaymentForm = this.formBuilder.group({
      interestAmount: ['', Validators.required],
      interestPostingDate: ['', Validators.required],
      status: [{ value: '', disabled: true }],
    });
    this.statusList = [
      { label: 'Submission for Approval', value: 5 }
    ]
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.depositTypeList = this.commonComponent.depositTypeList();
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
        this.isEdit = true;
        this.investmentApplicationDetailsService.getPreviewByTermAccountId(this.termAccId).subscribe(res => {
          this.responseModel = res;
          if (this.responseModel != null && this.responseModel != undefined) {
            this.commonComponent.stopSpinner();
            this.investmentApplicationDetailsModel = this.responseModel.data[0];
            if (this.investmentApplicationDetailsModel.depositDate != null) {
              this.investmentApplicationDetailsModel.depositDate = this.datePipe.transform(this.investmentApplicationDetailsModel.depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.investmentApplicationDetailsModel.maturityDate != null) {
              this.investmentApplicationDetailsModel.maturityDate = this.datePipe.transform(this.investmentApplicationDetailsModel.maturityDate, this.orgnizationSetting.datePipe);
            }
            if (this.investmentApplicationDetailsModel.depositType != undefined && this.investmentApplicationDetailsModel.depositType != null) {
              this.depositTypeList.filter(data => data.value == this.investmentApplicationDetailsModel.depositType).map(count => {
                this.depositTypeName = count.label;
              });
            }
            this.getInterestPaymentsByInvestmentAcId();
          }
        });
      } else {
        this.isEdit = false;
      }
    })
  }

  navigateBack() {
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_TRANSACTION]);
  }

  getInterestPaymentsByInvestmentAcId() {
    this.commonComponent.startSpinner();
    this.interestPaymentService.getInterestPaymentsByInvestmentAcId(this.termAccId).subscribe(res => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          this.commonComponent.stopSpinner();
          this.interestPaymentList = this.responseModel.data;
          this.interestPaymentList = this.interestPaymentList.filter(data => data.interestPostingDate != null).map((item: any) => {
            item.interestPostingDate = this.datePipe.transform(item.interestPostingDate, this.orgnizationSetting.datePipe);
            return item;
          });
        }
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  addInlineRow() {
    this.addNewEntry();
    this.addButton = applicationConstants.TRUE;
    this.dt._first = 0;
    this.dt.value.unshift(this.newRow);
    this.dt.initRowEdit(this.dt.value[0]);
  }
  addNewEntry() {
    this.newRow = { interestAmount: '', interestPostingDate: '', status: '' }
  }

  editInlineRow() {
    this.addButton = applicationConstants.TRUE;
  }

  onRowEditCancel() {
    this.addButton = applicationConstants.FALSE;
    this.getInterestPaymentsByInvestmentAcId();
    const index = this.dt.value.indexOf(this.newRow);
    if (index > -1) {
      this.dt.value.splice(index, 1);
    }
    this.addNewEntry();
  }

  deleteInlineRow(rowData: any) {
    this.displayDialog = applicationConstants.TRUE;
    this.addButton = applicationConstants.TRUE;
    if (rowData.id != null && rowData.id != undefined) {
      this.deleteId = rowData.id;
    }
  }
  delete() {
    this.displayDialog = applicationConstants.FALSE;
    this.addButton = applicationConstants.FALSE;
    this.commonComponent.startSpinner();
    this.interestPaymentService.deleteInterestPayment(this.deleteId).subscribe(response => {
      this.responseModel = response;
      this.msgs = [];
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.displayDialog = false;
        this.msgs = [];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
          this.getInterestPaymentsByInvestmentAcId();
        }, 2000);
      } else {
        this.displayDialog = false;
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
  }
  cancel() {
    this.displayDialog = applicationConstants.FALSE;
    this.addButton = applicationConstants.FALSE;
    this.getInterestPaymentsByInvestmentAcId();
  }

  addOrUpdate(rowData: any) {
    this.addButton = applicationConstants.FALSE;
    this.interestPaymentModel = rowData;
    this.interestPaymentModel.termAccId = this.termAccId;
    this.interestPaymentModel.status = 5;
    this.interestPaymentModel.interestPostingDate = this.commonFunctionsService.getUTCEpoch(new Date(this.interestPaymentModel.interestPostingDate));
    if (rowData.id != null) {
      this.interestPaymentService.updateInterestPayment(this.interestPaymentModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {
            this.getInterestPaymentsByInvestmentAcId();
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);

        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      this.interestPaymentService.addInterestPayment(this.interestPaymentModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {
            this.getInterestPaymentsByInvestmentAcId();
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
  }
}
