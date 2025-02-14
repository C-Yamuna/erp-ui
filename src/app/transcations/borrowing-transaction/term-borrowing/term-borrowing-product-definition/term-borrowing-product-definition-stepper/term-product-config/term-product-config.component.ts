import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermBorrowingProductDefinition } from '../../shared/term-borrowing-product-definition.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermBorrowingProductDefinitionService } from '../../shared/term-borrowing-product-definition.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-term-product-config',
  templateUrl: './term-product-config.component.html',
  styleUrls: ['./term-product-config.component.css']
})
export class TermProductConfigComponent {
  productionDefinitionForm: any;
  termProductDefinitionModel :TermBorrowingProductDefinition = new TermBorrowingProductDefinition();
  orgnizationSetting:any;
  isEdit: any;
  maxDate = new Date();
  minDate = new Date();
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  isSpecialSchemelist: any[] = [];
  repaymentFrequencyList: any[] = [];
  selectedList: any[]=[];
  id: any;
  collaterals:any;
  statusList: any[] = [];
  borrowingTypeList: any[] = [];
  interestCalculationTypeList: any[] = [];
  linkShareCapitalList: any[] = [];

  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private encryptService: EncryptDecryptService,
    private termBorrowingProductDefinitionService : TermBorrowingProductDefinitionService,
    private changeDetectorRef: ChangeDetectorRef,
  )
  { 
    this.productionDefinitionForm = this.formBuilder.group({
     'name': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
     'effectiveStartDate': new FormControl('', Validators.required),
     'endDate': new FormControl('', Validators.required),
     'minAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'maxAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'minBorrowingPeriodInMonths': new FormControl('',Validators.required),
     'maxBorrowingPeriodInMonths': new FormControl('', Validators.required),
     'borrowingType': new FormControl('', Validators.required),
     'borrowingSchemeType': new FormControl('',),
     'demandAlertDays': new FormControl('',),
     'interestCalculationType': new FormControl('', Validators.required),
     'repaymentFrequency': new FormControl('', Validators.required),
     'defaulterAlertDays': new FormControl('', ),
     'maxBorrowingAccountsAllowed': new FormControl('', ),
     'linkSharecapitalApplicable': new FormControl('', Validators.required),
     'institutionName': new FormControl('', ),
     'minDaysForRenewel': new FormControl(''),
     'isNpaExceptional': new FormControl('', Validators.required),
     'interestType': new FormControl(''),
     'interestCalculationFrequency': new FormControl(''),
     'isForeclosureAllowed': new FormControl('', Validators.required),
     'isGestationPeriodRequired': new FormControl('', Validators.required),
    })    
  }
  /**
    @author vinitha
    @implements Term Borrowings Configuration details 
    @argument ProductId
    @returns Term Borrowings Configuration details  if already exist
   */
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isSpecialSchemelist = this.commonComponent.requiredlist();
      this.repaymentFrequencyList = this.commonComponent.rePaymentFrequency();
      this.borrowingTypeList = this.commonComponent.borrowingTypes();
      this.interestCalculationTypeList = this.commonComponent.interestCalculationType();
      this.linkShareCapitalList =this.commonComponent.mandatoryList();
      this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted!= undefined) {
        this.isEdit = applicationConstants.TRUE;
        this.id = Number(this.encryptService.decrypt(encrypted));
          this.getPreviewByProductId(this.id);
      } else {
        this.isEdit = applicationConstants.FALSE;
      }
      this.updateData();
    });
  
    this.productionDefinitionForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.productionDefinitionForm.valid) {
        this.save();
      }
    });
  }
  getPreviewByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.termBorrowingProductDefinitionService.getPreviewByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.termProductDefinitionModel = this.responseModel.data[0];
        if (this.termProductDefinitionModel != null && this.termProductDefinitionModel != undefined) {

          if(null!=this.termProductDefinitionModel.effectiveStartDate && undefined!=this.termProductDefinitionModel.effectiveStartDate)
            this.termProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe); 

          if(null!=this.termProductDefinitionModel.endDate && undefined!=this.termProductDefinitionModel.endDate)
            this.termProductDefinitionModel.endDate = this.datePipe.transform(this.termProductDefinitionModel.endDate, this.orgnizationSetting.datePipe); 

      }
      this.updateData();
      }else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
 
  /**
    @author vinitha
    @implements Integrating Term Borrowings Configuration details To Main Stepper Component
    @argument termProductDefinitionModel, productionDefinitionform.valid
   */
  updateData() {
    this.termProductDefinitionModel.id = this.id
    this.termBorrowingProductDefinitionService.changeData({
      formValid: this.productionDefinitionForm.valid,
      data: this.termProductDefinitionModel,
      stepperIndex: 0,
      
    });
  }
 
  /**
    @author vinitha
    @implements To Call update Data function to integrate data to main stepper
   */
  save() {
    this.updateData();
  }

  /**
    @author Bhargavi
    @implements effectiveStartDate and endDate validation 
  */
  dateValidation(box: any) {
    if (this.termProductDefinitionModel.effectiveStartDate != undefined && this.termProductDefinitionModel.effectiveStartDate != undefined
      && this.termProductDefinitionModel.endDate != null && this.termProductDefinitionModel.endDate != null) {
      let startDate = new Date(this.termProductDefinitionModel.effectiveStartDate);  
      let endDate = new Date(this.termProductDefinitionModel.endDate);     

      if (startDate > endDate) {
        this.msgs = [];
        if (box == this.termProductDefinitionModel.effectiveStartDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.START_DATE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_END_DATA });
          this.productionDefinitionForm.get('effectiveStartDate').reset();
          this.termProductDefinitionModel.effectiveStartDate = null;
        } else if (box == this.termProductDefinitionModel.endDate) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.END_DATE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE });
          this.productionDefinitionForm.get('endDate').reset();
          this.termProductDefinitionModel.endDate = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }

  /**
    @author Bhargavi
    @implements minAmount and maxAmount validation 
  */
  amountValidation(box: any) {
    if (this.termProductDefinitionModel.minAmount != null && this.termProductDefinitionModel.minAmount != undefined
      && this.termProductDefinitionModel.maxAmount != null && this.termProductDefinitionModel.maxAmount != undefined) {

      if (this.termProductDefinitionModel.minAmount > this.termProductDefinitionModel.maxAmount) {
        this.msgs = [];
        if (box == this.termProductDefinitionModel.minAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
          this.productionDefinitionForm.get('minAmount').reset();
          this.termProductDefinitionModel.minAmount = null;
        } else if (box == this.termProductDefinitionModel.maxAmount) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
          this.productionDefinitionForm.get('maxAmount').reset();
          this.termProductDefinitionModel.maxAmount = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }

  /**
    @author Bhargavi
    @implements minBorrowingPeriodInMonths and maxBorrowingPeriodInMonths validation 
  */
  tenureValidation(box: any) {
    if (this.termProductDefinitionModel.minBorrowingPeriodInMonths != null && this.termProductDefinitionModel.minBorrowingPeriodInMonths != undefined
      && this.termProductDefinitionModel.maxBorrowingPeriodInMonths != null && this.termProductDefinitionModel.maxBorrowingPeriodInMonths != undefined) {

      if (this.termProductDefinitionModel.minBorrowingPeriodInMonths > this.termProductDefinitionModel.maxBorrowingPeriodInMonths) {
        this.msgs = [];
        if (box == this.termProductDefinitionModel.minBorrowingPeriodInMonths) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
          this.productionDefinitionForm.get('minBorrowingPeriodInMonths')?.setValue(null);
          this.termProductDefinitionModel.minBorrowingPeriodInMonths = null;
        } else if (box == this.termProductDefinitionModel.maxBorrowingPeriodInMonths) {
          this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE });
          this.productionDefinitionForm.get('maxBorrowingPeriodInMonths')?.setValue(null);
          this.termProductDefinitionModel.maxBorrowingPeriodInMonths = null;
        }
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      }
    }
    this.updateData();
  }

}
