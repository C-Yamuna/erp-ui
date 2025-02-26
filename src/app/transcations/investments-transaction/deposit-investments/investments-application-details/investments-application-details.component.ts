import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { InvestmentApplicationDetailsService } from './shared/investment-application-details.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InvestmentApplicationDetails } from './shared/investment-application-details.model';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-investments-application-details',
  templateUrl: './investments-application-details.component.html',
  styleUrls: ['./investments-application-details.component.css']
})
export class InvestmentsApplicationDetailsComponent implements OnInit{
  
  applicationDetailsForm:FormGroup;
  orgnizationSetting:any;
  isEdit:boolean = false;
  responseModel!: Responsemodel;
  investmentApplicationDetailsModel:InvestmentApplicationDetails =  new InvestmentApplicationDetails();
  msgs: any[] = [];
  buttonDisabled: boolean = false;
  checked: Boolean = false ;
  showForm: Boolean = false ;
  depositTypeList: any[] = [];
  interestPaymentFrequencyList: any[] = [];
  productListData: any[]=[];
  pacsId=1;
  isFileUploaded: boolean = false;
  filesDTOList: any[] = [];
  id: any;
  uploadFileData: any;
  autoRenewalTypeList:any []=[];
  installmentAmountFlag: boolean = false;

  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private encryptDecryptService :EncryptDecryptService,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private investmentApplicationDetailsService:InvestmentApplicationDetailsService,
    private activateRoute:ActivatedRoute, private fileUploadService : FileUploadService,
    private commonFunctionsService : CommonFunctionsService,
    private translate: TranslateService,){
    this.applicationDetailsForm = this.formBuilder.group({
      productName: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNumber: ['', [Validators.required]],
      depositAmount: ['', Validators.required],
      roi: ['', Validators.required],
      depositDate: ['', Validators.required],
      depositName: ['', Validators.required],
      tenureInYears: ['', Validators.required],
      tenureInMonths: [''],
      tenureInDays: [''],
      maturityDate: [{ value: '', disabled: true }, Validators.required],
      maturityInterest: [{ value: '', disabled: true }, Validators.required],
      maturityAmount: [{ value: '', disabled: true }, Validators.required],
      interestOrInstallmentFrequencyName: ['', Validators.required],
      isAutoRenewal: [false],
      autoRenewalType: [''],
      installmentAmount: ['']
    })
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.depositTypeList = this.commonComponent.depositTypeList();
    this.autoRenewalTypeList = this.commonComponent.autoRenewalType();
    this.interestPaymentFrequencyList = this.commonComponent.interestPaymentFrequency();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.id = id;
        this.isEdit = true;
        this.investmentApplicationDetailsService.getInvestmentApplicationDetailsById(id).subscribe(res => {
          this.responseModel = res;
          // this.investmentApplicationDetailsModel = this.responseModel.data[0];         
          
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.investmentApplicationDetailsModel = this.responseModel.data[0];
            if (this.investmentApplicationDetailsModel.depositDate != null) {
              this.investmentApplicationDetailsModel.depositDate = this.datePipe.transform(this.investmentApplicationDetailsModel.depositDate, this.orgnizationSetting.datePipe);
              this.investmentApplicationDetailsModel.depositDate = new Date(this.investmentApplicationDetailsModel.depositDate);
            }
            if (this.investmentApplicationDetailsModel.maturityDate != null) {
              this.investmentApplicationDetailsModel.maturityDate = this.datePipe.transform(this.investmentApplicationDetailsModel.maturityDate, this.orgnizationSetting.datePipe);
              this.investmentApplicationDetailsModel.maturityDate = new Date(this.investmentApplicationDetailsModel.maturityDate);
            }
            if(this.investmentApplicationDetailsModel.depositBondCopyPath != null && this.investmentApplicationDetailsModel.depositBondCopyPath != undefined){
              let multipartFileList = this.fileUploadService.getFile(this.investmentApplicationDetailsModel.depositBondCopyPath ,
              ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.investmentApplicationDetailsModel.depositBondCopyPath);
              this.investmentApplicationDetailsModel.multipartFileList = multipartFileList;
            }

            if(this.investmentApplicationDetailsModel.depositType != undefined && this.investmentApplicationDetailsModel.depositType != null)
              this.onChangeDepositType(this.investmentApplicationDetailsModel.depositType);

            // this.onChangeProduct();
            // this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            // setTimeout(() => {
            //   this.msgs = []; 
            // }, 2000);
          } else {
            this.commonComponent.stopSpinner();
            this.buttonDisabled = applicationConstants.FALSE;
            this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        });
      } else {
        this.isEdit = false;
      }
    }) 
    this.applicationDetailsForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.applicationDetailsForm.valid) {
        this.save();
      }
    });
    // this.getAllProductsBasedOnPacsId(this.pacsId);
    this.onAutoRenewalChange();
  }

  updateData() {
    this.investmentApplicationDetailsService.changeData({
      formValid: !this.applicationDetailsForm.valid ? true : false,
      data: this.investmentApplicationDetailsModel,
      isDisable:  (!this.applicationDetailsForm.valid) ,
      stepperIndex: 0,
    });
  }
  save() {
    this.updateData();
  }

  //get all active products based on pacs id  @bhargavi
  getAllProductsBasedOnPacsId(pacsId:any) {
    // this.commonComponent.startSpinner();
    this.investmentApplicationDetailsModel.pacsId = this.pacsId;
    this.investmentApplicationDetailsService.getAllActiveProductsBasedOnPacsId(this.investmentApplicationDetailsModel.pacsId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.productListData = this.responseModel.data;
        this.productListData = this.productListData.filter((productData: any) => productData != null).map((product: { name: any; id: any; }) => {
          return { label: product.name, value: product.id };
        });
        //this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1000);
      } else {
        // this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      //this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

 //update the bankName on onchange by product details based on productId @bhargavi
  onChangeProduct(){
    this.investmentApplicationDetailsService.getProductById(this.investmentApplicationDetailsModel.productId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.investmentApplicationDetailsModel.bankName = this.responseModel.data[0].bankName;
        this.investmentApplicationDetailsModel.roi = this.responseModel.data[0].roi;
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1000);
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.investmentApplicationDetailsModel.multipartFileList = [];
    this.investmentApplicationDetailsModel.filesDTOList = [];
    this.investmentApplicationDetailsModel.depositBondCopyPath = null;
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
        this.investmentApplicationDetailsModel.filesDTOList[this.investmentApplicationDetailsModel.filesDTOList.length - 1].fileName = "INVESTMENT_DEPOSIT_BOND_" + timeStamp + "_" + file.name;
        this.investmentApplicationDetailsModel.depositBondCopyPath = "INVESTMENT_DEPOSIT_BOND_" + timeStamp + "_" + file.name;
        this.updateData();
      }
      reader.readAsDataURL(file);
    } else {
      console.warn("No file uploaded.");
    }
  }
  

  //remove documnet for nominee
  fileRemoveEvent() {
    this.investmentApplicationDetailsModel.multipartFileList = [];
    if (this.investmentApplicationDetailsModel.filesDTOList != null && this.investmentApplicationDetailsModel.filesDTOList != undefined) {
      this.investmentApplicationDetailsModel.depositBondCopyPath = null;
      this.investmentApplicationDetailsModel.filesDTOList = null;
    }
  }

  //method for enable or disable of autoRenewalType based on its value.
  //@bhargavi
  onAutoRenewalChange(): void {
    const autoRenewalControl = this.applicationDetailsForm.get('isAutoRenewal');
    const autoRenewalTypeControl = this.applicationDetailsForm.get('autoRenewalType');
    if (autoRenewalControl && autoRenewalTypeControl) {
      autoRenewalControl.valueChanges.subscribe((isAutoRenewal: boolean) => {
        if (isAutoRenewal) {
          autoRenewalTypeControl.enable();
        } else {
          autoRenewalTypeControl.disable();
        }
      });
    }
  }

  onChangeDepositType(depositType: any) {
    if (depositType != null && depositType != undefined) {
      if (depositType == 3) {
        this.installmentAmountFlag = applicationConstants.TRUE;
        this.applicationDetailsForm.get('installmentAmount')?.setValidators([Validators.required]);
      }else{
        this.investmentApplicationDetailsModel.installmentAmount = null;
        this.installmentAmountFlag = applicationConstants.FALSE;
        this.applicationDetailsForm.get('installmentAmount')?.clearValidators();
      }
      this.applicationDetailsForm.get('installmentAmount')?.updateValueAndValidity();
    }
  }

  amountCheck(flag: any) {
    if (this.investmentApplicationDetailsModel.depositAmount != null && this.investmentApplicationDetailsModel.depositAmount != undefined
      && this.investmentApplicationDetailsModel.maturityAmount != null && this.investmentApplicationDetailsModel.maturityAmount != null
      && this.investmentApplicationDetailsModel.depositAmount != "" && this.investmentApplicationDetailsModel.depositAmount != "") {
      if (flag) {
        if (Number(this.investmentApplicationDetailsModel.depositAmount) > Number(this.investmentApplicationDetailsModel.maturityAmount)) {
          this.applicationDetailsForm.get('depositAmount')?.reset();
          this.msgs = [{ severity: 'warning', detail: "Deposit Amount should not greater than Maturity Amount" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2500);
        }
      } else {
        if (Number(this.investmentApplicationDetailsModel.depositAmount) > Number(this.investmentApplicationDetailsModel.maturityAmount)) {
          this.applicationDetailsForm.get('maturityAmount')?.reset();
          this.msgs = [{ severity: 'warning', detail: "Maturity Amount should be greater than Deposit Amount" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2500);
        }
      }
    }
  }

  dateCheck(flag: any) {
    if (this.investmentApplicationDetailsModel.depositDate != null && this.investmentApplicationDetailsModel.depositDate != undefined
      && this.investmentApplicationDetailsModel.maturityDate != null && this.investmentApplicationDetailsModel.maturityDate != null
      && this.investmentApplicationDetailsModel.depositDate != "" && this.investmentApplicationDetailsModel.depositDate != "") {
      let depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.depositDate));
      let maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.investmentApplicationDetailsModel.maturityDate));
      if (flag) {
        if (depositDate > maturityDate) {
          this.applicationDetailsForm.get('depositDate')?.reset();
          this.msgs = [{ severity: 'warning', detail: "Deposit Date should not greater than Maturity Date" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      } else {
        if (depositDate > maturityDate) {
          this.applicationDetailsForm.get('maturityDate')?.reset();
          this.msgs = [{ severity: 'warning', detail: "Maturity Date should be greater than Deposit Date" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }
  }

  calculateMaturityDetails() {
    if (this.investmentApplicationDetailsModel.tenureInYears != null && this.investmentApplicationDetailsModel.tenureInYears != undefined &&
      this.investmentApplicationDetailsModel.depositAmount != null && this.investmentApplicationDetailsModel.depositAmount != undefined &&
      this.investmentApplicationDetailsModel.depositDate != null && this.investmentApplicationDetailsModel.depositDate != undefined &&
      this.investmentApplicationDetailsModel.roi != null && this.investmentApplicationDetailsModel.roi != undefined) {

      let tenureInMonths;
      let tenureInDays;
      if (this.investmentApplicationDetailsModel.tenureInMonths == null || this.investmentApplicationDetailsModel.tenureInMonths == undefined){
        tenureInMonths = 0;
      }else{
        tenureInMonths = this.investmentApplicationDetailsModel.tenureInMonths;
      }
      if (this.investmentApplicationDetailsModel.tenureInDays == null || this.investmentApplicationDetailsModel.tenureInDays == undefined){
        tenureInDays = 0;
      }else{
        tenureInDays = this.investmentApplicationDetailsModel.tenureInDays;
      }
      const totalMonths = (Number(this.investmentApplicationDetailsModel.tenureInYears )* 12) + Number(tenureInMonths);
      const totalDays = Number(tenureInDays);

      const maturityDate = new Date(this.investmentApplicationDetailsModel.depositDate);
      maturityDate.setMonth(maturityDate.getMonth() + totalMonths);
      maturityDate.setDate(maturityDate.getDate() + totalDays);
      this.investmentApplicationDetailsModel.maturityDate = maturityDate;

      const timeInYears = (Number(this.investmentApplicationDetailsModel.tenureInYears)) + (Number(tenureInMonths) / 12) + (Number(tenureInDays) / 365);

      const interest = (Number(this.investmentApplicationDetailsModel.depositAmount) * Number(this.investmentApplicationDetailsModel.roi) * Number(timeInYears)) / 100;
      this.investmentApplicationDetailsModel.maturityInterest = interest.toFixed(2);

      this.investmentApplicationDetailsModel.maturityAmount = (Number(this.investmentApplicationDetailsModel.depositAmount) + interest).toFixed(2);
    }
  }

}
