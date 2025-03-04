import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InvestmentsTransactionConstant } from '../../investments-transaction-constants';
import { AssociatedBankDetails } from './associated-bank-details/shared/associated-bank-details.model';
import { InterestPolicy } from './interest-policy/shared/interest-policy.model';
import { RequiredDocuments } from './required-documents/shared/required-documents.model';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { InvestmentsProductDefinition } from '../shared/investments-product-definition.model';
import { InvestmentsProductDefinitionService } from '../shared/investments-product-definition.service';

@Component({
  selector: 'app-add-investments-product-definition',
  templateUrl: './add-investments-product-definition.component.html',
  styleUrls: ['./add-investments-product-definition.component.css']
})
export class AddInvestmentsProductDefinitionComponent {

  investmentsProductDefinitionModel:InvestmentsProductDefinition = new InvestmentsProductDefinition();
  associatedBankDetailsModel:AssociatedBankDetails = new AssociatedBankDetails();
  interestPolicyModel:InterestPolicy = new InterestPolicy();
  requiredDocumentsModel: RequiredDocuments = new RequiredDocuments();

  responseModel!: Responsemodel;
  activeIndex: number = 0;
  msgs: any[] = [];
  buttonDisbled: boolean = applicationConstants.FALSE;
  activeItem!: MenuItem;
  items: MenuItem[] = [];
  menuDisabled: boolean = applicationConstants.TRUE;
  nextDisable: boolean = applicationConstants.FALSE;
  serviceUrl: any;
  generalConfig: any;
  interestPolicyDetails: any;
  reqiredDocumentsDetails: any;
  penalityConfig: any;
  savedID: any;
  isEdit: any;
  orgnizationSetting: any;
  saveAndContinueFlag: boolean = applicationConstants.TRUE;
  isSaveContinueEnable: boolean = applicationConstants.FALSE;

  constructor(public messageService: MessageService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private commonFunctionService: CommonFunctionsService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
    private investmentsProductDefinitionService: InvestmentsProductDefinitionService,
    private datePipe: DatePipe) {

  }
  /**
      @author Bhargavi
      @implements Investment Stepper Configuration details 
      @argument ProductId
     */
  ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.savedID = this.encryptDecryptService.decrypt(params['id']);
        this.isEdit = applicationConstants.TRUE;
      } else {
        this.isEdit = applicationConstants.FALSE;
      }
    });

    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionService.getStorageValue('language'));
      }
      this.items = [
        {
          label: 'Product', icon: 'fa fa-id-badge', routerLink: InvestmentsTransactionConstant.INVESTMENTS_PRODUCT,
          command: (event: any) => {
            this.activeIndex = 0;
          }
        },
        {
          label: 'Associated Bank Details', icon: 'fa fa-gg-circle', routerLink: InvestmentsTransactionConstant.INVESTMENTS_AASOCIATED_BANK_DETAILS,
          command: (event: any) => {
            this.activeIndex = 1;
          }
        },
        {
          label: 'Interest Policy', icon: 'fa fa-newspaper-o', routerLink: InvestmentsTransactionConstant.INVESTMENTS_INTEREST_POLICY,
          command: (event: any) => {
            this.activeIndex = 2;
          }
        },
        {
          label: 'Required Documents', icon: 'fa fa-file-text', routerLink: InvestmentsTransactionConstant.INVESTMENTS_REQUIRED_DOCUMENTS,
          command: (event: any) => {
            this.activeIndex = 3;
          }
        }
      ];
    });


    this.currentStepper();
  }
  currentStepper() {
    this.investmentsProductDefinitionService.currentStep.subscribe((data: any) => {
      if (data != undefined || null) {
        this.activeIndex = data.stepperIndex
        this.changeStepperSelector(this.activeIndex);
        this.buttonDisbled = (data.formValid == applicationConstants.FALSE) ? applicationConstants.TRUE : applicationConstants.FALSE;
        if (data.data != null && data.data != undefined) {
          if (this.activeIndex == 0) {
            this.investmentsProductDefinitionModel = data.data;
            this.isSaveContinueEnable = applicationConstants.FALSE;
          } else if (this.activeIndex == 1) {
            this.associatedBankDetailsModel = data.data;
          } else if (this.activeIndex == 2) {
            this.interestPolicyModel = data.data;
          } else if (this.activeIndex == 3) {
            this.requiredDocumentsModel = data.data;
          }
        }
      }
    });
  }

  /**
      @author Bhargavi
      @implements investments details Stepper navigation details 
      @argument ProductId
     */
  navigateTo(activeIndex: any, saveId: any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_PRODUCT], { queryParams: { id: this.encryptDecryptService.encrypt(saveId) } });
        break;
      case 1:
        this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_AASOCIATED_BANK_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(saveId) } });
        break;
      case 2:
        this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_INTEREST_POLICY], { queryParams: { id: this.encryptDecryptService.encrypt(saveId) } });
        break;
      case 3:
        this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_REQUIRED_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(saveId) } });
        break;
    }
  }

  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  /**
      @author Bhargavi
      @implements Previous Step button navigation realated function
      @argument activeIndex
     */
  prevStep(activeIndex: any) {
    this.activeIndex = activeIndex - 1;
    this.navigateTo(this.activeIndex, this.savedID);

  }

  /**
      @author Bhargavi
      @implements Save data and next navigation realated function
      @argument activeIndex
     */

  saveAndNext(activeIndex: number) {
    if (activeIndex == 0) {
      this.addOrUpdateInvestmentsProductDefination(activeIndex, "next");
    } else if (activeIndex == 1) {
      this.activeIndex = activeIndex + 1;
      this.navigateTo(this.activeIndex, this.savedID);
    } else if (activeIndex == 2) {
      this.activeIndex = activeIndex + 1;
      this.navigateTo(this.activeIndex, this.savedID);
    } else if (activeIndex == 3) {
      this.activeIndex = activeIndex + 1;
      this.navigateTo(this.activeIndex, this.savedID);
    }
  }

  /**
      @author Bhargavi
      @implements Saves the data
      @argument activeIndex
     */
  saveContinue(activeIndex: any) {
    this.activeIndex = 0;
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_PRODUCT_DEFINITION]);
  }

  /**
      @author Bhargavi
      @implements It recieves the data from stepper
      @argument activeIndex
     */
  getProductDetailsObservable() {
    this.investmentsProductDefinitionService.currentStep.subscribe((data: any) => {
      if (data != undefined) {
        this.changeStepperSelector(this.activeIndex);
        if (data.isDisable != null) {
          this.nextDisable = data.isDisable;
          this.buttonDisbled = (data.formValid == applicationConstants.FALSE) ? applicationConstants.TRUE : applicationConstants.FALSE;

        }
        this.serviceUrl = data.serviceUrl;
      }
    });
  }

  cancel(activeIndex: any) {
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_PRODUCT_DEFINITION]);
  }

  submit() {
    this.buttonDisbled = applicationConstants.TRUE;
    this.router.navigate([InvestmentsTransactionConstant.VIEW_INVESTMENTS_PRODUCT_DEFINITION], { queryParams: { id: this.encryptDecryptService.encrypt(this.savedID), isGridPage: this.encryptDecryptService.encrypt(1) } });
  }


  save() {
    this.buttonDisbled = applicationConstants.TRUE;
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_PRODUCT_DEFINITION]);
  }
  /**
    @author Bhargavi
    @implements It navigates to grid
   */
  navigateToGrid() {
    this.buttonDisbled = applicationConstants.TRUE;
    this.router.navigate([InvestmentsTransactionConstant.INVESTMENTS_PRODUCT_DEFINITION]);
  }

  changeStepperSelector(item: any) {
    this.activeItem = item;
    this.menuDisabled = applicationConstants.TRUE;
    this.items.map((val, index) => {
      if (this.activeIndex == index) {
        val['disabled'] = applicationConstants.FALSE;
      } else {
        val['disabled'] = applicationConstants.TRUE;
      }
      return val;
    })
  }

  /**
    @author Bhargavi
    @implements It Saves the investments data 
    @argument generalConfigModel,activeIndex,buttonName
    @returns generalConfigModel
   */
  addOrUpdateInvestmentsProductDefination(activeIndex: any, buttonName: any) {
    this.investmentsProductDefinitionModel.pacsId = this.commonFunctionService.getStorageValue(applicationConstants.PACS_ID);
    // this.investmentsProductDefinitionModel.statusName = CommonStatusData.CREATED;
    if (this.investmentsProductDefinitionModel.effectiveStartDate != undefined && this.investmentsProductDefinitionModel.effectiveStartDate != null)
      this.investmentsProductDefinitionModel.effectiveStartDate = this.commonFunctionService.getUTCEpoch(new Date(this.investmentsProductDefinitionModel.effectiveStartDate));

    if (this.investmentsProductDefinitionModel.effectiveEndDate != undefined && this.investmentsProductDefinitionModel.effectiveEndDate != null)
      this.investmentsProductDefinitionModel.effectiveEndDate = this.commonFunctionService.getUTCEpoch(new Date(this.investmentsProductDefinitionModel.effectiveEndDate));

    if (this.investmentsProductDefinitionModel.id != null) {

      this.investmentsProductDefinitionService.updateInvestmentProduct(this.investmentsProductDefinitionModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {
            if (null != this.investmentsProductDefinitionModel.effectiveStartDate && undefined != this.investmentsProductDefinitionModel.effectiveStartDate)
              this.investmentsProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.investmentsProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

            if (null != this.investmentsProductDefinitionModel.effectiveEndDate && undefined != this.investmentsProductDefinitionModel.effectiveEndDate)
              this.investmentsProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.investmentsProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];

            setTimeout(() => {
              this.msgs = [];
            }, 2000);
            if (buttonName == "next") {
              this.activeIndex = activeIndex + 1;
              this.savedID = this.responseModel.data[0].id;
              this.navigateTo(this.activeIndex, this.savedID);
            }
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
    } else {
      this.investmentsProductDefinitionModel.statusName = CommonStatusData.IN_PROGRESS;
      this.investmentsProductDefinitionService.addInvestmentProduct(this.investmentsProductDefinitionModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            if (null != this.investmentsProductDefinitionModel.effectiveStartDate && undefined != this.investmentsProductDefinitionModel.effectiveStartDate)
              this.investmentsProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.investmentsProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

            if (null != this.investmentsProductDefinitionModel.effectiveEndDate && undefined != this.investmentsProductDefinitionModel.effectiveEndDate)
              this.investmentsProductDefinitionModel.effectiveEndDate = this.datePipe.transform(this.investmentsProductDefinitionModel.effectiveEndDate, this.orgnizationSetting.datePipe);

            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
            if (buttonName == "next") {
              this.activeIndex = activeIndex + 1;
              this.savedID = this.responseModel.data[0].id;
              this.navigateTo(this.activeIndex, this.savedID);
            } else if (buttonName == "saveAndContinue") {
              this.activeIndex = 0;
              this.router.navigate([]);
            } else {
              this.router.navigate([]);
            }
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

  }
}
