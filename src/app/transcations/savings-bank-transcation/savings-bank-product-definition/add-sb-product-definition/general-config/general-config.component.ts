import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralConfig } from './shared/general-config.model';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { GeneralConfigService } from './shared/general-config.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ProductDefinitionService } from '../shared/product-definition.service';
import { SbProductDefinitionService } from '../../shared/sb-product-definition.service';

@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.css']
})
export class GeneralConfigComponent {
  generalconfigform: any;
  maxDate = new Date();
  minDate = new Date();
  orgnizationSetting:any;
  generalConfigModel :GeneralConfig = new GeneralConfig();
  isEdit: any;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  intPostingRequiredList: any[] = [];
  productId: any;
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  productDefinitionList: any[] = [];
  tempProductDefinitionList: any[] = [];
  constructor(private router: Router, private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,
    private datePipe: DatePipe,private commonComponent: CommonComponent, private generalConfigService:GeneralConfigService,
    private productDefinitionService:ProductDefinitionService,
    private sbProductDefinitionService: SbProductDefinitionService
  )
  { 
    this.generalconfigform = this.formBuilder.group({
      'productname': new FormControl('', Validators.required),
      'mindepositamountforaccountopen': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY),Validators.required]),
      'minmaintainbalanceinaccount':  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY),]),
      'minimumBalancePenalty': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY),Validators.required]),
      'accInactiveDays': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY),Validators.required]),
      'accDormantDays':new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY),Validators.required]),
      'isInterestPostingAllowed': new FormControl(''),
      'isCheckBookIssuingAllowed': new FormControl(''),
      'isChequeBookOperationsAllowed': new FormControl(''),
      'isDebitCardIssuingAllowed': new FormControl('',),
      'minBalMaintainWithCheque': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY),]),
      'minBalMaintainWithoutCheque': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY),]),
      'effectiveStartDate': new FormControl('',Validators.required),
      'effectiveEndDate': new FormControl('',Validators.required)
     
    })
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.intPostingRequiredList = this.commonComponent.requiredlist();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let queryParams = params['id'].split('#');
        let id = this.encryptService.decrypt(params['id']);

        if (id != "" && id != null && id != undefined) {
          this.isEdit = true;
          this.generalConfigService.getGeneralConfigById(id).subscribe(res => {
            this.responseModel = res;
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
              this.generalConfigModel = this.responseModel.data[0];
              if (this.generalConfigModel != null && this.generalConfigModel != undefined) {
                if(this.generalConfigModel.effectiveStartDate != null && this.generalConfigModel.effectiveStartDate != undefined &&this.generalConfigModel.effectiveStartDate!=null&&this.generalConfigModel.effectiveStartDate!= undefined){
                  this.generalConfigModel.effectiveStartDate=this.datePipe.transform(this.generalConfigModel.effectiveStartDate, this.orgnizationSetting.datePipe);
                 
                } 
                if(this.generalConfigModel.effectiveEndDate != null && this.generalConfigModel.effectiveEndDate != undefined ){
                  this.generalConfigModel.effectiveEndDate=this.datePipe.transform(this.generalConfigModel.effectiveEndDate, this.orgnizationSetting.datePipe);
                 
                } 
                
              }
            this.commonComponent.stopSpinner();
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
      } 
    })
    this.generalconfigform.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.generalconfigform.valid) {
        this.save();
      }
    });
    this. getAllProductDefinitions();
  }
  updateData() {
    this.generalConfigModel.productId = this.productId
    this.productDefinitionService.changeData({
      formValid: this.generalconfigform.valid ,
      data: this.generalConfigModel,
      stepperIndex: 0,
      
    });
  }
  save() {
    this.updateData();
  }
  dateValidation(box: any) {
    if (this.generalConfigModel.effectiveStartDate != undefined && this.generalConfigModel.effectiveStartDate != undefined
      && this.generalConfigModel.effectiveEndDate != null && this.generalConfigModel.effectiveEndDate != null) {
      let startDate = new Date(this.generalConfigModel.effectiveStartDate);
      let endDate = new Date(this.generalConfigModel.effectiveEndDate);     

  if (startDate > endDate) {
    this.msgs = [];
    if (box == this.generalConfigModel.effectiveStartDate) {
      this.msgs.push({ severity: 'error',detail: applicationConstants.EFFECTIVE_START_DATE_SHOULD_BE_LESS_THAN_EFFECTIVE_END_DATE });
      this.generalconfigform.get('effectiveStartDate').reset();
      this.generalConfigModel.effectiveStartDate = null;
    } else if (box == this.generalConfigModel.effectiveEndDate) {
      this.msgs.push({ severity: 'error', detail: applicationConstants.EFFECTIVE_END_DATE_SHOULD_BE_GREATER_THAN_EFFECTIVE_START_DATE });
      this.generalconfigform.get('effectiveEndDate').reset();
      this.generalConfigModel.effectiveEndDate = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }

  /**
      @author Dileep_Kumar_G
      @implements get All Product Definitions
    */
  getAllProductDefinitions() {
    this.sbProductDefinitionService.getAllsbProductDefinition().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (null != this.responseModel.data && undefined != this.responseModel.data) {
          this.productDefinitionList = this.responseModel.data;
          this.tempProductDefinitionList = this.productDefinitionList;
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
  
  /**
      @author Dileep_Kumar_G
      @implements product Name Duplicate Check
    */
  productNameDuplicateCheck() {
    let isFlag = applicationConstants.TRUE;
    if (this.isEdit) {
      if (null != this.tempProductDefinitionList && undefined != this.tempProductDefinitionList && this.tempProductDefinitionList.length > 0) {
        const user = this.tempProductDefinitionList.find(user => user.productName === this.generalConfigModel.productName);
        if (user != null && user != undefined) {
          if (user.id === this.generalConfigModel.id) {
            isFlag = applicationConstants.FALSE;
          }
        }
      }
    }
    if (null != this.tempProductDefinitionList && undefined != this.tempProductDefinitionList && this.tempProductDefinitionList.length > 0) {
      this.tempProductDefinitionList.filter((data: any) => null != data.productName).map(product => {
        if (isFlag && product.productName === this.generalConfigModel.productName) {
          this.msgs = [];
          this.msgs.push({ severity: 'warning', detail: applicationConstants.PRODUCT_NAME_ALREADY_EXIST });
          this.generalconfigform.get('productname')?.reset();
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
        }
      });
    }
  }

  
}
