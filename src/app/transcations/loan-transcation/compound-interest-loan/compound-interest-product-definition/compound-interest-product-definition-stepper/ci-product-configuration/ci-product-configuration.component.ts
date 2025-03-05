import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CompoundInterestProductDefinition } from '../../shared/compound-interest-product-definition.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CompoundInterestProductDefinitionService } from '../../shared/compound-interest-product-definition.service';
import { CollateralTypesService } from 'src/app/configurations/loan-config/collateral-types/shared/collateral-types.service';
import { BoxNumber } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-ci-product-configuration',
  templateUrl: './ci-product-configuration.component.html',
  styleUrls: ['./ci-product-configuration.component.css']
})
export class CiProductConfigurationComponent {
  productionDefinitionForm: any;
  compoundInterestProductDefinitionModel :CompoundInterestProductDefinition = new CompoundInterestProductDefinition();
  orgnizationSetting:any;
  isEdit: any;
  maxDate = new Date();
  minDate = new Date();
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  isSpecialSchemelist: any[] = [];
  interestPostingFrequencyList: any[] = [];
  ciProdCollateralsConfigDTOList: any[] = [];
  selectedList: any[]=[];
  ciProductId: any;
  collaterals:any;
  statusList: any[] = [];
  selectedPurposeTypes:any[]=[];
  productDefinitionList: any[] = [];
  tempProductDefinitionList: any[] = [];

  selectedCollateralIds: number[] = [];
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  purposeTypeList: any[] = [];
  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private encryptService: EncryptDecryptService,
    private compoundInterestProductDefinitionService : CompoundInterestProductDefinitionService, private collateralTypesService : CollateralTypesService,
    private changeDetectorRef: ChangeDetectorRef,
  )
  { 
    this.productionDefinitionForm = this.formBuilder.group({
     'name': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
     'eligibleMInAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'eligibleMaxAmount': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_DECIMALS),Validators.required]),
     'minLoanPeriod': new FormControl('',Validators.required),
     'maxLoanPeriod': new FormControl('', Validators.required),
     'effectiveStartDate': new FormControl('', Validators.required),
     'endDate':new FormControl('', Validators.required),
     'demandAlertDays': new FormControl('',),
     'defaulterAlertDays': new FormControl('', ),
     'maxLoanAccountsAllowed': new FormControl('', ),
     'loanLinkedshareCapitalApplicable': new FormControl('', Validators.required),
     'noOfGuarantorsRequired': new FormControl('', ),
     'isInsuranceAppicable': new FormControl('', Validators.required),
     'minDaysForRenewel': new FormControl('', Validators.required),
     'interestPostingFrequency': new FormControl('', Validators.required),
     'nomineeRequired': new FormControl('', Validators.required),
     'collateraltypes':new FormControl('',Validators.required),
     'purposeType':new FormControl('',Validators.required)
    })    
  }
  /**
    @author vinitha
    @implements CI Loans Configuration details 
    @argument ProductId
    @returns CI Loans Configuration details  if already exist
   */
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isSpecialSchemelist = this.commonComponent.requiredlist();
    this.interestPostingFrequencyList = this.commonComponent.rePaymentFrequency();
    this.getAllCollaterals();
    this.getAllPurposeTypes();
    this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted != undefined) {
        this.isEdit = applicationConstants.TRUE;
        this.ciProductId = Number(this.encryptService.decrypt(encrypted));
        this.getPreviewDetailsByProductId(this.ciProductId);
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
    
    this.getAllCiProductDefinitions();
  }
  /**
   * @implements get preview details by product id
   * @param id 
   * @author jyothi.naidana
   */
  getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.ciProdCollateralsConfigDTOList=[]
    this.compoundInterestProductDefinitionService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.compoundInterestProductDefinitionModel = this.responseModel.data[0];
        if (this.compoundInterestProductDefinitionModel != null && this.compoundInterestProductDefinitionModel != undefined) {
          //pusepose type ids
          if (this.compoundInterestProductDefinitionModel.purposeTypeIds != null && this.compoundInterestProductDefinitionModel.purposeTypeIds != undefined) {
            let contentSelected = this.compoundInterestProductDefinitionModel.purposeTypeIds.split(',');
            if (contentSelected.length > 0) {
              for (let id of contentSelected) {
                this.selectedPurposeTypes.push(Number(id));
              }
              if (this.selectedPurposeTypes?.length) {
                this.selectedPurposeTypes = [...this.selectedPurposeTypes]; // Trigger change detection
              }
            }
          }
          //collateral type ids
          if (this.compoundInterestProductDefinitionModel.collateralTypeIds != null && this.compoundInterestProductDefinitionModel.collateralTypeIds != undefined) {
            let contentSelected = this.compoundInterestProductDefinitionModel.collateralTypeIds.split(',');
            if (contentSelected.length > 0) {
              for (let id of contentSelected) {
                this.selectedCollateralIds.push(Number(id));
              }
              if (this.selectedCollateralIds?.length) {
                this.selectedCollateralIds = [...this.selectedCollateralIds]; // Trigger change detection
              }
            }
          }
          if(null!=this.compoundInterestProductDefinitionModel.effectiveStartDate && undefined!=this.compoundInterestProductDefinitionModel.effectiveStartDate)
            this.compoundInterestProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.compoundInterestProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if(null!=this.compoundInterestProductDefinitionModel.endDate && undefined!=this.compoundInterestProductDefinitionModel.endDate)
            this.compoundInterestProductDefinitionModel.endDate = this.datePipe.transform(this.compoundInterestProductDefinitionModel.endDate, this.orgnizationSetting.datePipe);
          if(this.compoundInterestProductDefinitionModel.ciProdCollateralsConfigDTOList != null && this.compoundInterestProductDefinitionModel.ciProdCollateralsConfigDTOList != undefined && this.compoundInterestProductDefinitionModel.ciProdCollateralsConfigDTOList.length >0)
              // this.initializeFormWithCollaterals(this.compoundInterestProductDefinitionModel.ciProdCollateralsConfigDTOList);
          this.productionDefinitionForm.patchValue(this.compoundInterestProductDefinitionModel);
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
   * @implements  get all purpose types
   * @author jyothi.naidana
   */
  getAllPurposeTypes() {
    this.commonComponent.startSpinner();
    this.purposeTypeList = [];
    this.compoundInterestProductDefinitionService.getAllLoanPurpose().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.purposeTypeList = this.responseModel.data.filter((documenttype: any) => documenttype.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.name, value: count.id }
          });

          // let purposeType = this.purposeTypeList.find((data: any) => null != data && data.value == this.ciPurposeModel.purposeId);
          // if (purposeType != null && undefined != purposeType)
          //   this.ciPurposeModel.loanPurposeName = purposeType.label;
          this.commonComponent.stopSpinner();
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
 
  /**
    @author vinitha
    @implements Integrating CI Loans Configuration details To Main Stepper Component
    @argument compoundInterestProductDefinitionModel, productionDefinitionform.valid
   */
  updateData() {
    this.compoundInterestProductDefinitionModel.ciProductId = this.ciProductId
    this.compoundInterestProductDefinitionService.changeData({
      formValid: this.productionDefinitionForm.valid,
      data: this.compoundInterestProductDefinitionModel,
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
   * @implements get all collateral list 
   * @author jyothi.naidana
   */
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.collateralTypesService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.ciProdCollateralsConfigDTOList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
          return { label: collateral.name, value: collateral.id }
      });
      this.commonComponent.stopSpinner();
    }
    else {
      this.msgs = [];
      this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      this.commonComponent.stopSpinner();
    });
  }
  /**
   * @implements initializeFormWithCollaterals
   * @param collaterals 
   * @author jyothi.naidana
   */
  initializeFormWithCollaterals(collaterals: any[]) {
    this.selectedCollateralIds =collaterals.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => collateral.collateralType);
    this.productionDefinitionForm.get('collateraltypes')?.setValue(this.selectedCollateralIds);
  }

  /**
   * @implements on Collateral Changes
   * @param event 
   * @author jyothi.naidana
   */
  onCollateralChange(event: any) {
    const newlySelectedIds = event.value;
    this.selectedCollateralIds = newlySelectedIds;
    const collateralIds: number[] = this.selectedCollateralIds;
    const collateralIdsString :string= collateralIds.join(',');
    this.compoundInterestProductDefinitionModel.collateralTypeIds = collateralIdsString
    // this.productionDefinitionForm.get('collateraltypes')?.setValue(this.selectedCollateralIds);
    this.compoundInterestProductDefinitionModel.ciProdCollateralsConfigDTOList = this.selectedCollateralIds.map((id: any) => ({
      ciProductId: this.ciProductId,
      collateralType: id,
      status: this.statusList[0].value, 
      statusName: this.statusList[0].label,
      collateralTypeName: this.ciProdCollateralsConfigDTOList.find(item => item.value === id)?.label
    }));
    this.updateData();
  }

  /**
   * @implements on Collateral Change
   * @param event 
   * @author jyothi.naidana
   */
  onChangePurPoseTypes(event: any) {
    const newlySelectedIds = event.value;
    this.selectedPurposeTypes = newlySelectedIds;
    const purposeIds: number[] = this.selectedPurposeTypes;
    const pacsIdString :string= purposeIds.join(',');
    this.compoundInterestProductDefinitionModel.purposeTypeIds = pacsIdString
    // this.productionDefinitionForm.get('purposeType')?.setValue(this.selectedPurposeTypes);
    this.compoundInterestProductDefinitionModel.ciProdPurposeConfigDTOList = this.selectedPurposeTypes.map((id: any) => ({
      ciProductId: this.ciProductId,
      purposeId: id,
      status: this.statusList[0].value, 
      statusName: this.statusList[0].label,
    }));
    this.updateData();
  }

  amountValidation(box: any) {
    if (this.compoundInterestProductDefinitionModel.eligibleMInAmount != null && this.compoundInterestProductDefinitionModel.eligibleMInAmount != undefined
      && this.compoundInterestProductDefinitionModel.eligibleMaxAmount != null && this.compoundInterestProductDefinitionModel.eligibleMaxAmount != undefined) {

  if (this.compoundInterestProductDefinitionModel.eligibleMInAmount > this.compoundInterestProductDefinitionModel.eligibleMaxAmount) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_DEPOSIT_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_DEPOSIT_AMOUNT });
      this.productionDefinitionForm.get('eligibleMInAmount').reset();
      this.compoundInterestProductDefinitionModel.eligibleMInAmount = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_DEPOSIT_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_DEPOSIT_AMOUNT });
      this.productionDefinitionForm.get('eligibleMaxAmount').reset();
      this.compoundInterestProductDefinitionModel.eligibleMaxAmount = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }

  tenureValidation(box: any) {
    if (this.compoundInterestProductDefinitionModel.minLoanPeriod != null && this.compoundInterestProductDefinitionModel.minLoanPeriod != undefined
      && this.compoundInterestProductDefinitionModel.maxLoanPeriod != null && this.compoundInterestProductDefinitionModel.maxLoanPeriod != undefined) {

  if (Number(this.compoundInterestProductDefinitionModel.minLoanPeriod) > Number(this.compoundInterestProductDefinitionModel.maxLoanPeriod)) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_TENURE_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_TENURE });
      this.productionDefinitionForm.get('minLoanPeriod').reset();
      this.compoundInterestProductDefinitionModel.minLoanPeriod = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_TENURE_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_TENURE});
      this.productionDefinitionForm.get('maxLoanPeriod').reset();
      this.compoundInterestProductDefinitionModel.maxLoanPeriod = null;
    }
    setTimeout(() => {
      this.msgs = [];
    }, 1500);
  }
}
this.updateData();
  }



  dateValidation(box: any) {
    if (this.compoundInterestProductDefinitionModel.effectiveStartDate != undefined && this.compoundInterestProductDefinitionModel.effectiveStartDate != undefined
      && this.compoundInterestProductDefinitionModel.endDate != null && this.compoundInterestProductDefinitionModel.endDate != null) {
      let startDate = new Date(this.compoundInterestProductDefinitionModel.effectiveStartDate);
      let endDate = new Date(this.compoundInterestProductDefinitionModel.endDate);     

  if (startDate > endDate) {
    this.msgs = [];
    if (box == BoxNumber.BOX_ONE) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_START_DATE_SHOULD_BE_LESS_THAN_EFFECTIVE_END_DATE });
      this.productionDefinitionForm.get('effectiveStartDate').reset();
      this.compoundInterestProductDefinitionModel.effectiveStartDate = null;
    } else if (box == BoxNumber.BOX_TWO) {
      this.msgs.push({ severity: 'warning', detail: applicationConstants.EFFECTIVE_END_DATE_SHOULD_BE_GREATER_THAN_EFFECTIVE_START_DATE });
      this.productionDefinitionForm.get('endDate').reset();
      this.compoundInterestProductDefinitionModel.endDate = null;
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
  getAllCiProductDefinitions() {
    this.compoundInterestProductDefinitionService.getAllCompoundInterestProductDefinition().subscribe((data: any) => {
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
        const user = this.tempProductDefinitionList.find(user => user.name === this.compoundInterestProductDefinitionModel.name);
        if (user != null && user != undefined) {
          if (user.id === this.compoundInterestProductDefinitionModel.id) {
            isFlag = applicationConstants.FALSE;
          }
        }
      }
    }
    if (null != this.tempProductDefinitionList && undefined != this.tempProductDefinitionList && this.tempProductDefinitionList.length > 0) {
      this.tempProductDefinitionList.filter((data: any) => null != data.name).map(product => {
        if (isFlag && product.name === this.compoundInterestProductDefinitionModel.name) {
          this.msgs = [];
          this.msgs.push({ severity: 'warning', detail: applicationConstants.PRODUCT_NAME_ALREADY_EXIST });
          this.productionDefinitionForm.get('name')?.reset();
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
        }
      });
    }
  }
}
