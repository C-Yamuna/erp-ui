import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { productDefinitionApprovalConstant } from '../../product-definition-approval-constant';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanProductDefinitionService } from 'src/app/transcations/loan-transcation/term-loan/term-loan-product-definition/shared/term-loan-product-definition.service';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';

@Component({
  selector: 'app-term-loan-product-definition-approval',
  templateUrl: './term-loan-product-definition-approval.component.html',
  styleUrls: ['./term-loan-product-definition-approval.component.css']
})
export class TermLoanProductDefinitionApprovalComponent {
  responseModel!: Responsemodel;
  termLoanproductdefinition: any[] = [];
  showForm: boolean = applicationConstants.FALSE;
  editViewButton: boolean = applicationConstants.FALSE;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];

  constructor(private router: Router, private translate: TranslateService, 
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, 
    private termLoanProductDefinitionService: TermLoanProductDefinitionService,
    private datePipe: DatePipe,
    private commonComponent: CommonComponent) {
  }
  ngOnInit() {
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.termLoanproductdefinition = [
      { field: 'name', header: 'LOANS.PRODUCT_NAME' },
      { field: '', header: 'LOANS.RATE_OF_INTEREST' },
      { field: 'eligibleMInAmount', header: 'LOANS.MINIMUM_AMOUNT' },
      { field: 'eligibleMaxAmount', header: 'LOANS.MAXIMUM_AMOUNT' },
      { field: 'effectiveStartDate', header: 'LOANS.EFFECTIVE_START_DATE' },
      { field: 'statusName', header: 'LOANS.STATUS' }
    ];
    this.getAllTermLoanProductDefinition();
  }

  viewTermproductdefinition(rowData: any) {
    this.router.navigate([productDefinitionApprovalConstant.TERM_LOAN_PRODUCT_DEFINITION_APPROVAL_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.termProductId), editbtn: this.encryptDecryptService.encrypt(0) } });
  }

  getAllTermLoanProductDefinition() {
    this.termLoanProductDefinitionService.getAllTermLoanProductDefinition().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (null != this.responseModel.data && undefined != this.responseModel.data) {
          this.gridListData = this.responseModel.data;
          if (null != this.gridListData && undefined != this.gridListData && this.gridListData.length > 0) {
            this.gridListData = this.gridListData.filter((data: any) => null != data.effectiveStartDate).map(termLoan => {
              termLoan.effectiveStartDate = this.datePipe.transform(termLoan.effectiveStartDate, this.orgnizationSetting.datePipe) || '';
              if (termLoan.statusName === CommonStatusData.IN_PROGRESS || termLoan.statusName === CommonStatusData.REQUEST_FOR_RESUBMISSION) {
                termLoan.showEdit = true;
              } else if (termLoan.statusName === CommonStatusData.SUBMISSION_FOR_APPROVAL || termLoan.statusName === CommonStatusData.REJECTED ||
                termLoan.statusName === CommonStatusData.CLOSED || termLoan.statusName === CommonStatusData.APPROVED) {
                termLoan.showEdit = false;
              }
              return termLoan
            });
          }
        }
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }

  onChange() {
    this.showForm = !this.showForm;
  }
}
