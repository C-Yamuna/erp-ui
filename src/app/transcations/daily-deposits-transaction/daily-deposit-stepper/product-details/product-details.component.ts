import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Accounts } from '../../shared/accounts.model';
import { MembershipBasicDetail } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { AccountInterestPolicy } from '../../shared/account-interest-policy.model';
import { AccountProductDefinition } from '../../shared/account-product-definition.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  applicationForm: FormGroup;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  accountList: any[] = [];
  schemeTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  accountModel: Accounts = new Accounts();
  membershipBasicDetail: MembershipBasicDetail = new MembershipBasicDetail();
  productDefinitionModel: AccountProductDefinition = new AccountProductDefinition();
  interestPolicyModel: AccountInterestPolicy = new AccountInterestPolicy();
  memberTypeName: any;
  fdNonCummulativeAccId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  visible: boolean = false;
  applicationType: boolean = false;
  isIndividual: Boolean = false;
  productInfoFalg: boolean = false;
  isProductDisable: boolean = false;
  productDefinitionFlag: boolean = false;
  displayDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  siLoanDisbursementScheduleList: any[] = [];
  editDeleteDisable: boolean = false;
  disableAddButton: boolean = false;
  deleteId: any;
  pacsId: any;
  branchId: any;
  interestPolicyList: any[] = [];
  penalityConfigList: any[] = [];
  requiredDocumentsList: any[] = [];
  agentList:any[]=[];

  constructor(private router: Router, private datePipe: DatePipe, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private ref: ChangeDetectorRef,
    private translate: TranslateService, private fileUploadService: FileUploadService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService,
  ) {
    this.applicationForm = this.formBuilder.group({
      'productId': new FormControl('', Validators.required),
      'accountNumber': [{ value: '', disabled: true }],
      'roi': [{ value: '', disabled: true }],
      'depositDate': new FormControl('', Validators.required),
      'penalRoi': [{ value: '', disabled: true }],
      'depositAmount':  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS), Validators.required]),
      'accountType': new FormControl('', Validators.required),
      'tenureInMonths':new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS)]),
      'tenureInYears':new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS)]),
      'agent':new FormControl('', Validators.required),
    })
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.getAllProducts();
    this.getAllAccountTypes();
    this.getAllAgentDetails();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.fdNonCummulativeAccId = Number(id);
        this.isEdit = true;
        this.getAccounts(this.fdNonCummulativeAccId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })

    this.applicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      // if (this.applicationForm.valid) {
      //   this.save();
      // }
    });
  }
  save() {
    this.updateData();
  }

  updateData() {
    this.dailyDepositsAccountsService.changeData({
      formValid: !this.applicationForm.valid ? true : false,
      data: this.accountModel,
      isDisable: (!this.applicationForm.valid),
      stepperIndex: 3,
    });
  }


  getAllProducts() {
    this.dailyDepositsAccountsService.getAllProductDefinitionList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.productsList = this.responseModel.data;
            this.accountModel.requiredDocumentsConfigDTOList = this.responseModel.data[0].requiredDocumentsConfigList;
            this.productsList = this.productsList.filter((obj: any) => obj != null).map((product: { name: any; id: any; }) => {
              return { label: product.name, value: product.id };
            });
          }
        }
      }
    });
  }

  getAllAccountTypes() {
    this.dailyDepositsAccountsService.getAllAccountTypesList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountList = this.responseModel.data;
            this.accountList = this.accountList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };

            });
            // this.accountList.unshift({ label: 'select', value: 0 });
          }
        }
        if (this.accountModel.accountType != undefined) {
          const filteredItem = this.accountList.find((item: { value: any; }) => item.value === this.accountModel.accountType);
          this.accountModel.accountTypeName = filteredItem.label;
        }
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    })
  }

  onChangeProduct(event: any) {
    // this.displayDialog = true;
    this.productInfoFalg = true;
    if (event.value != null && event.value != undefined) {
      this.getProductDefinitionByProductId(event.value);
    }
  }

  onChangeAccountType(event: any) {
    if (event.value != null && event.value != undefined) {
      const filteredItem = this.accountList.find((item: { value: any; }) => item.value === event.value);
      this.accountModel.accountTypeName = filteredItem.label;
      this.updateData();
    }
  }




  //get account details by admissionNumber list
  getAccounts(accid: any) {
    this.dailyDepositsAccountsService.getDailyDepositsByacid(accid).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountModel = this.responseModel.data[0];
            if (this.accountModel.productId != null && this.accountModel.productId != undefined)
              this.isProductDisable = applicationConstants.TRUE;

            if (this.accountModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicDetail = this.accountModel.memberShipBasicDetailsDTO;

              if (this.membershipBasicDetail.dob != null && this.membershipBasicDetail.dob != undefined)
                this.membershipBasicDetail.dobVal = this.datePipe.transform(this.membershipBasicDetail.dob, this.orgnizationSetting.datePipe);

              if (this.membershipBasicDetail.admissionDate != null && this.membershipBasicDetail.admissionDate != undefined)
                this.membershipBasicDetail.admissionDateVal = this.datePipe.transform(this.membershipBasicDetail.admissionDate, this.orgnizationSetting.datePipe);

              if (this.membershipBasicDetail.signaturePath != null && this.membershipBasicDetail.signaturePath != undefined) {
                this.membershipBasicDetail.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetail.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.signaturePath);
              }
            }

            if (this.accountModel.depositDate != null && this.accountModel.depositDate != undefined)
              this.accountModel.depositDateVal = this.datePipe.transform(this.accountModel.depositDate, this.orgnizationSetting.datePipe);


            if (this.accountModel.memberTypeName != null && this.accountModel.memberTypeName != undefined) {
              this.memberTypeName = this.accountModel.memberTypeName;
              if (this.accountModel.memberTypeName == "Individual")
                this.isIndividual = true;
            }
            if (this.accountModel.adminssionNumber != null && this.accountModel.adminssionNumber != undefined)
              this.admissionNumber = this.accountModel.adminssionNumber;

            if (this.accountModel.accountTypeName != null && this.accountModel.accountTypeName != undefined)
              this.applicationType = true;

            if (this.accountModel.productName != null && this.accountModel.productName != undefined)
              this.productInfoFalg = true;


            if (this.accountModel.productDefinitionDTO != null && this.accountModel.productDefinitionDTO != undefined) {
              this.productDefinitionModel = this.accountModel.productDefinitionDTO;
              if (this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList != null)
                this.interestPolicyModel = this.productDefinitionModel.intestPolicyConfigList[0];
              if (this.productDefinitionModel.effectiveStartDate != null && this.productDefinitionModel.effectiveStartDate != undefined)
                this.productDefinitionModel.effectiveStartDateVal = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

            }

          }
          this.updateData();
        }
      }
    });
  }

  onSelectdepositDate(depositDateVal:any) {
    this.dateValidation(depositDateVal);
  }

  getProductDefinitionByProductIdAndDepositDate(productId: any) {
    this.accountModel.productId = productId.value;
    if (this.accountModel.depositDateVal != undefined && this.accountModel.depositDateVal != null)
      this.accountModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.accountModel.depositDateVal));

    this.dailyDepositsAccountsService.getProductDefinitionByProductIdAndDepositDate(this.pacsId, productId.value, this.accountModel.id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.productDefinitionModel = this.responseModel.data[0];
          if (this.productDefinitionModel.effectiveStartDate != null && this.productDefinitionModel.effectiveStartDate != undefined)
            this.productDefinitionModel.effectiveStartDate = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          if (this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList != null) {
            this.interestPolicyModel = this.productDefinitionModel.intestPolicyConfigList[0];
          }
          if (null != this.productDefinitionModel.effectiveEndDate && undefined != this.productDefinitionModel.effectiveEndDate)
            this.productDefinitionModel.effectiveEndDate = this.datePipe.transform(this.productDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

          if (this.productDefinitionModel.intestPolicyConfigList != null && this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList.length > 0) {
            this.interestPolicyList = this.productDefinitionModel.intestPolicyConfigList;
          }
          if (this.productDefinitionModel.penaltyConfigList != null && this.productDefinitionModel.penaltyConfigList != undefined && this.productDefinitionModel.penaltyConfigList.length > 0) {
            this.penalityConfigList = this.productDefinitionModel.penaltyConfigList;
          }
          if (this.productDefinitionModel.requiredDocumentsConfigList != null && this.productDefinitionModel.requiredDocumentsConfigList != undefined && this.productDefinitionModel.requiredDocumentsConfigList.length > 0) {
            this.requiredDocumentsList = this.productDefinitionModel.requiredDocumentsConfigList;
          }
          if(this.accountModel.depositDate != null && this.accountModel.depositDate != undefined)
            this.dateValidation(this.accountModel.depositDate);
        }
      }
    });
  }
  onChange() {
    this.checked = !this.checked;
    if (this.checked) {
      this.isMemberCreation = true;
    }
    else {
      this.isMemberCreation = false;
    }
  }
  showDialog() {
    this.visible = true;
  }
  closeProductDefinition() {
    this.productDefinitionFlag = false;
  }

  dateValidation(depositeDate: any) {
    if (this.productDefinitionModel.effectiveStartDate != undefined && this.productDefinitionModel.effectiveStartDate != undefined
      && this.productDefinitionModel.effectiveEndDate != null && this.productDefinitionModel.effectiveEndDate != null) {
      let startDate = this.commonFunctionsService.getUTCEpoch(new Date(this.productDefinitionModel.effectiveStartDate));
      let endDate = this.commonFunctionsService.getUTCEpoch(new Date(this.productDefinitionModel.effectiveEndDate));
      let date = this.commonFunctionsService.getUTCEpoch(new Date(depositeDate));
      if (date >= endDate) {
        this.msgs = [];
          this.msgs.push({ severity: 'warning', detail: applicationConstants.DEPOSITE_DATE_SHOULD_BE_LESSTHAN_PRODUCT_EFF_END_DATE });
          this.accountModel.depositDate = null;
        
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      } else if (date <= startDate) {
        this.msgs = [];
          this.msgs.push({ severity: 'warning', detail: applicationConstants.DEPOSITE_DATE_SHOULD_BE_GRATERTHAN_PRODUCT_EFF_START_DATE });
          this.accountModel.depositDate = null;
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
      }
    }
    this.updateData();
  }

  amountValidation(depositeAmount: any) {
    if (this.productDefinitionModel.minDepositAmount != null && this.productDefinitionModel.minDepositAmount != undefined
      && this.productDefinitionModel.maxDepositAmount != null && this.productDefinitionModel.maxDepositAmount != undefined) {
      if (depositeAmount > this.productDefinitionModel.maxDepositAmount) {
        this.msgs = [];
          this.msgs.push({ severity: 'warning', detail: applicationConstants.DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
          this.accountModel.depositAmount = null;
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }else if(depositeAmount < this.productDefinitionModel.minDepositAmount){
        this.msgs = [];
          this.msgs.push({ severity: 'warning', detail: applicationConstants.DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
          this.accountModel.depositAmount = null;
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }

  getProductDefinitionByProductId(id: any) {
    this.productDefinitionModel == null;
    this.dailyDepositsAccountsService.getDailyDepositProductDefinitionOverviewDetailsById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.productDefinitionModel = this.responseModel.data[0];

          if (null != this.productDefinitionModel.effectiveStartDate)
            this.productDefinitionModel.effectiveStartDate = this.datePipe.transform(this.productDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (null != this.productDefinitionModel.effectiveEndDate)
            this.productDefinitionModel.effectiveEndDate = this.datePipe.transform(this.productDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

          if (this.productDefinitionModel.intestPolicyConfigList != null && this.productDefinitionModel.intestPolicyConfigList != undefined && this.productDefinitionModel.intestPolicyConfigList.length > 0) {
            this.interestPolicyList = this.productDefinitionModel.intestPolicyConfigList;
           
          }
          if (this.productDefinitionModel.intestPolicyConfigList != null && this.productDefinitionModel.intestPolicyConfigList != undefined) {
            if (this.productDefinitionModel.intestPolicyConfigList[0].roi != undefined && this.productDefinitionModel.intestPolicyConfigList[0].roi != null)
              this.accountModel.roi = this.productDefinitionModel.intestPolicyConfigList[0].roi;
  
            if (this.productDefinitionModel.intestPolicyConfigList[0].penaltyRoi != undefined && this.productDefinitionModel.intestPolicyConfigList[0].penaltyRoi != null)
              this.accountModel.penalRoi = this.productDefinitionModel.intestPolicyConfigList[0].penaltyRoi;
          }
         
          if (this.productDefinitionModel.requiredDocumentsConfigList != null && this.productDefinitionModel.requiredDocumentsConfigList != undefined && this.productDefinitionModel.requiredDocumentsConfigList.length > 0) {
            this.requiredDocumentsList = this.productDefinitionModel.requiredDocumentsConfigList;
           
          }

        }
      }
    });
  }
  productViewPopUp(){
    this.displayDialog = true;
    if(this.accountModel.productId != null && this.accountModel.productId != undefined){
      this.getProductDefinitionByProductId(this.accountModel.productId);
    }
    else {
      this.msgs = [];
          this.msgs = [{ severity: 'error', detail: "Please Select Product" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
    }
    
  }
  getAllAgentDetails(){
    this.commonComponent.startSpinner();
    this.dailyDepositsAccountsService.getAllAgentDetails().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.agentList = this.responseModel.data;
        this.agentList = this.agentList.filter((obj: any) => obj != null).map((product: { name: any; id: any; }) => {
          return { label: product.name, value: product.id };
        });
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
}
