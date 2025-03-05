import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InvestmentApplicationDetails } from '../../deposit-investments/investments-application-details/shared/investment-application-details.model';
import { InvestmentApplicationDetailsService } from '../../deposit-investments/investments-application-details/shared/investment-application-details.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvestmentsTransactionConstant } from '../../investments-transaction-constants';
import { InterestPaymentService } from '../investments-interest-payment/shared/interest-payment.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-investments-foreclosure',
  templateUrl: './investments-foreclosure.component.html',
  styleUrls: ['./investments-foreclosure.component.css']
})
export class InvestmentsForeclosureComponent {

  orgnizationSetting: any;
  isEdit: boolean = false;
  msgs: any[] = [];
  responseModel !: Responsemodel;
  investmentApplicationDetailsModel: InvestmentApplicationDetails = new InvestmentApplicationDetails();
  termAccId: any;
  depositTypeList: any[] = [];
  depositTypeName: any;
  interestPaymentList: any[] = [];
  foreClosureForm: FormGroup;
  amountTransferList: any[] = [];
  penaltyAmount: any;
  chequeNumber: any;
  acNumberShow: boolean = false;
  chequeNumberShow: boolean = false;
  isFileUploaded: boolean = false;
  uploadFileData: any;
  foreClosureAmount: any;
  currentDate: any;
  totalInterestPaid: number = 0;
  closeAmount: any;
  closureForm: FormGroup;
  foreClosureShow: boolean = true;
  reason: any;
  reasonList: any[] = [];
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
    this.foreClosureForm = this.formBuilder.group({
      foreClosureDate: [{ value: '', disabled: true }, Validators.required],
      reason: ['', Validators.required],
      penaltyAmount: ['', Validators.required],
      foreClosureMaturityAmount: [{ value: '', disabled: true }, Validators.required],
      transactionMode: ['', Validators.required],
      societyAccountNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]],
      chequeNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]],
      remarks: [''],
    });

    this.closureForm = this.formBuilder.group({
      closureDate: [{ value: '', disabled: true }, Validators.required],
      maturityAmount: [{ value: '', disabled: true }, Validators.required],
      transactionMode: ['', Validators.required],
      societyAccountNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]],
      chequeNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]],
      remarks: [''],
    });


    this.amountTransferList = [
      { label: "Cash", value: 1 },
      { label: "To PACS DCCB Account", value: 2 },
      { label: "Cheque", value: 3 }
    ];

    this.reasonList = [
      { label: "Financial Crisis", value: 1 },
    ];
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
           
            this.currentDate = new Date();
            if(this.investmentApplicationDetailsModel.maturityDate > this.currentDate){
              this.foreClosureShow = applicationConstants.TRUE;
              this.investmentApplicationDetailsModel.foreClosureDate = this.datePipe.transform(this.currentDate, this.orgnizationSetting.datePipe);
            }else{
              this.foreClosureShow = applicationConstants.FALSE;
             this.investmentApplicationDetailsModel.closureDate = this.datePipe.transform(this.currentDate, this.orgnizationSetting.datePipe);
            }

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
            if (item.statusName == 'Approved') {
              this.totalInterestPaid = Number(this.totalInterestPaid) + Number(item.interestAmount);
            }
            return item;
          });
          this.closeAmount = Number(this.investmentApplicationDetailsModel.maturityAmount) - Number(this.totalInterestPaid);
        }
        this.commonComponent.stopSpinner();
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

  navigateBack() {
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_TRANSACTION]);
  }

  foreClosureFileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.investmentApplicationDetailsModel.multipartFileList = [];
    this.investmentApplicationDetailsModel.filesDTOList = [];
    this.investmentApplicationDetailsModel.foreClosureReqSignedCopy = null;
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
        this.investmentApplicationDetailsModel.filesDTOList[this.investmentApplicationDetailsModel.filesDTOList.length - 1].fileName = "INVESTMENT_FORECLOSURE_COPY_" + timeStamp + "_" + file.name;
        this.investmentApplicationDetailsModel.foreClosureReqSignedCopy = "INVESTMENT_FORECLOSURE_COPY_" + timeStamp + "_" + file.name;
      }
      reader.readAsDataURL(file);
    } else {
      console.warn("No file uploaded.");
    }
  }

  fileRemoveEvent() {
    this.isFileUploaded = applicationConstants.TRUE;
    this.investmentApplicationDetailsModel.multipartFileList = [];
    if (this.investmentApplicationDetailsModel.filesDTOList != null && this.investmentApplicationDetailsModel.filesDTOList != undefined) {
      this.investmentApplicationDetailsModel.foreClosureReqSignedCopy = null;
      this.investmentApplicationDetailsModel.filesDTOList = null;
    }
  }

  saveInvestmentForeClosure() {
    this.commonComponent.startSpinner();
    if (this.investmentApplicationDetailsModel.depositDate != null) {
      this.investmentApplicationDetailsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.depositDate));
    }
    if (this.investmentApplicationDetailsModel.maturityDate) {
      this.investmentApplicationDetailsModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.maturityDate));
    }
    if (this.investmentApplicationDetailsModel.resolutionDate != null) {
      this.investmentApplicationDetailsModel.resolutionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.resolutionDate));
    }
    if (this.investmentApplicationDetailsModel.foreClosureDate != null) {
      this.investmentApplicationDetailsModel.foreClosureDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.foreClosureDate));
    }
    this.investmentApplicationDetailsModel.isForeClosure = applicationConstants.TRUE;
    this.investmentApplicationDetailsModel.statusName = "Request for Foreclosure";
    if (this.investmentApplicationDetailsModel.id != null && this.investmentApplicationDetailsModel.id != undefined) {
      this.investmentApplicationDetailsService.updateInvestmentApplicationDetails(this.investmentApplicationDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateBack();
        } else {
          this.commonComponent.stopSpinner();
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

  onChangeTransactionMode(transactionMode: any) {
    if (transactionMode != null && transactionMode != undefined) {
      if (transactionMode.value == 2) {
        this.acNumberShow = applicationConstants.TRUE;
        this.chequeNumberShow = applicationConstants.FALSE;
        this.chequeNumber = null;
        this.foreClosureForm.get('societyAccountNumber')?.setValidators([Validators.required]);
        this.foreClosureForm.get('chequeNumber')?.clearValidators();
      } else if (transactionMode.value == 3) {
        this.chequeNumberShow = applicationConstants.TRUE;
        this.acNumberShow = applicationConstants.FALSE;
        this.investmentApplicationDetailsModel.societyAccountNumber = null;
        this.foreClosureForm.get('chequeNumber')?.setValidators([Validators.required]);
        this.foreClosureForm.get('societyAccountNumber')?.clearValidators();
      } else {
        this.acNumberShow = applicationConstants.FALSE;
        this.chequeNumberShow = applicationConstants.FALSE;
      }
      this.foreClosureForm.get('societyAccountNumber')?.updateValueAndValidity();
      this.foreClosureForm.get('chequeNumber')?.updateValueAndValidity();
    }
  }


  // closure service
  closureFileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.investmentApplicationDetailsModel.multipartFileList = [];
    this.investmentApplicationDetailsModel.filesDTOList = [];
    this.investmentApplicationDetailsModel.closureReqSignedCopy = null;
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
        this.investmentApplicationDetailsModel.filesDTOList[this.investmentApplicationDetailsModel.filesDTOList.length - 1].fileName = "INVESTMENT_CLOSURE_COPY_" + timeStamp + "_" + file.name;
        this.investmentApplicationDetailsModel.closureReqSignedCopy = "INVESTMENT_CLOSURE_COPY_" + timeStamp + "_" + file.name;
      }
      reader.readAsDataURL(file);
    } else {
      console.warn("No file uploaded.");
    }
  }

  closeFileRemoveEvent() {
    this.isFileUploaded = applicationConstants.TRUE;
    this.investmentApplicationDetailsModel.multipartFileList = [];
    if (this.investmentApplicationDetailsModel.filesDTOList != null && this.investmentApplicationDetailsModel.filesDTOList != undefined) {
      this.investmentApplicationDetailsModel.closureReqSignedCopy = null;
      this.investmentApplicationDetailsModel.filesDTOList = null;
    }
  }

  saveInvestmentClosure() {
    this.commonComponent.startSpinner();
    if (this.investmentApplicationDetailsModel.depositDate != null) {
      this.investmentApplicationDetailsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.depositDate));
    }
    if (this.investmentApplicationDetailsModel.maturityDate) {
      this.investmentApplicationDetailsModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.maturityDate));
    }
    if (this.investmentApplicationDetailsModel.resolutionDate != null) {
      this.investmentApplicationDetailsModel.resolutionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.resolutionDate));
    }
    if (this.investmentApplicationDetailsModel.closureDate != null) {
      this.investmentApplicationDetailsModel.closureDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.closureDate));
    }
    this.investmentApplicationDetailsModel.statusName = "Request for Closure";
    if (this.investmentApplicationDetailsModel.id != null && this.investmentApplicationDetailsModel.id != undefined) {
      this.investmentApplicationDetailsService.updateInvestmentApplicationDetails(this.investmentApplicationDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateBack();
        } else {
          this.commonComponent.stopSpinner();
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

  onChangeClosureTransactionMode(transactionMode: any) {
    if (transactionMode != null && transactionMode != undefined) {
      if (transactionMode.value == 2) {
        this.acNumberShow = applicationConstants.TRUE;
        this.chequeNumberShow = applicationConstants.FALSE;
        this.chequeNumber = null;
        this.closureForm.get('societyAccountNumber')?.setValidators([Validators.required]);
        this.closureForm.get('chequeNumber')?.clearValidators();
      } else if (transactionMode.value == 3) {
        this.chequeNumberShow = applicationConstants.TRUE;
        this.acNumberShow = applicationConstants.FALSE;
        this.investmentApplicationDetailsModel.societyAccountNumber = null;
        this.closureForm.get('chequeNumber')?.setValidators([Validators.required]);
        this.closureForm.get('societyAccountNumber')?.clearValidators();
      } else {
        this.acNumberShow = applicationConstants.FALSE;
        this.chequeNumberShow = applicationConstants.FALSE;
      }
      this.closureForm.get('societyAccountNumber')?.updateValueAndValidity();
      this.closureForm.get('chequeNumber')?.updateValueAndValidity();
    }
  }
}
