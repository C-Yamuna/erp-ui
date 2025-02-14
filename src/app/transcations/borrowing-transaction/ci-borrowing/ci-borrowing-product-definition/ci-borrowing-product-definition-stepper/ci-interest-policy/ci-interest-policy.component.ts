import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CiBorrowingProductDefinition } from '../../shared/ci-borrowing-product-definition.model';
import { CiCollectionApportionOrder, CiInterestPolicy } from './shared/ci-interest-policy.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { CiBorrowingProductDefinitionService } from '../../shared/ci-borrowing-product-definition.service';
import { CiInterestPolicyService } from './shared/ci-interest-policy.service';

@Component({
  selector: 'app-ci-interest-policy',
  templateUrl: './ci-interest-policy.component.html',
  styleUrls: ['./ci-interest-policy.component.css']
})
export class CiInterestPolicyComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;
  intrestPolicyList: any[] = [];
  apportionOrderList: any[] = [];
  displayDialog: boolean = applicationConstants.FALSE;
  interestPolicyForm: FormGroup;
  collectionApportionOrderForm: FormGroup;
  newRow: any = null;
  newRowForApportion: any = null;
  editDeleteDisable: boolean = applicationConstants.FALSE;
  editDeleteDisableForApportion: boolean = applicationConstants.FALSE;
  addButton: boolean = applicationConstants.FALSE;
  addButtonForApportion: boolean = applicationConstants.FALSE;
  ciProductDefinitionModel: CiBorrowingProductDefinition = new CiBorrowingProductDefinition();
  ciInterestPolicyConfigModel: CiInterestPolicy = new CiInterestPolicy();
  ciCollectionApportionOrderModel: CiCollectionApportionOrder = new CiCollectionApportionOrder();
  maxDate = new Date();
  minDate = new Date();
  orgnizationSetting: any;
  isEdit: any;
  productId: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  enableSaveAndNextButton: boolean = applicationConstants.FALSE;
  enableSaveAndNextButtonForApportion: boolean = applicationConstants.FALSE;
  collectionApportionList: any[] = [];
  tenureTypeList: any[] = [];
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  constructor(private formBuilder: FormBuilder, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private datePipe: DatePipe, private commonFunctionService: CommonFunctionsService, private encryptService: EncryptDecryptService,
    private ciBorrowingProductDefinitionService: CiBorrowingProductDefinitionService, private ciInterestPolicyService: CiInterestPolicyService
  ) {
    this.interestPolicyForm = this.formBuilder.group({
      'tenureType': new FormControl('', Validators.required),

      'minSlabAmount': new FormControl('', Validators.required),
      'maxSlabAmount': new FormControl('', Validators.required),
      'roi': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_NUMBERS_TWO_DECIMALS), Validators.required]),
      'penalInterest': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_NUMBERS_TWO_DECIMALS), Validators.required]),
      'employeeConcession': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_NUMBERS_TWO_DECIMALS), Validators.required]),
      'seniorCitizenConcession': new FormControl('', [Validators.pattern(applicationConstants.ALLOW_TWO_NUMBERS_TWO_DECIMALS), Validators.required]),

    });

    this.collectionApportionOrderForm = this.formBuilder.group({
      'collectionCompenentId': new FormControl('', Validators.required),
      'order': new FormControl('', Validators.required),

    });
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.tenureTypeList = this.commonComponent.tenureType();
    this.collectionApportionList = this.commonComponent.collectionApportionType();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted != undefined) {
        this.isEdit = applicationConstants.TRUE;

        this.productId = Number(this.encryptService.decrypt(encrypted));
        this.getPreviewByProductId(this.productId);
      } else {
        this.isEdit = applicationConstants.FALSE;
      }
      this.updateData();
    });

    this.interestPolicyForm && this.collectionApportionOrderForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.interestPolicyForm && this.collectionApportionOrderForm.valid) {
        this.save();
      }
    });

  }

  /**
     @author vinitha
     @implements Integrating Ci Borrowings Configuration details To Main Stepper Component
    */
  updateData() {
    this.ciInterestPolicyConfigModel.productId = this.productId,
      this.ciCollectionApportionOrderModel.productId = this.productId,
      this.ciBorrowingProductDefinitionService.changeData({
        formValid: this.enableSaveAndNextButton && this.enableSaveAndNextButtonForApportion,
        data: this.ciInterestPolicyConfigModel && this.ciCollectionApportionOrderModel,
        savedId: this.productId,
        stepperIndex: 1,
        isDisable: !this.interestPolicyForm && !this.collectionApportionOrderForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,


      });

  }

  /**
 @author vinitha
 @implements To Call update Data function to integrate data to main stepper
*/
  save() {
    this.updateData();
  }

  addInlineRow() {
    this.addNewEntry();
    this.editDeleteDisable = applicationConstants.TRUE;
    this.addButton = applicationConstants.TRUE;
    this.dt._first = 0;
    this.dt.value.unshift(this.newRow);
    this.dt.initRowEdit(this.dt.value[0]);
    this.enableSaveAndNextButton = applicationConstants.FALSE;
    this.updateData();
  }


  addInlineRowApportionOrder() {
    this.addNewEntryForApportionOrder();
    this.editDeleteDisableForApportion = applicationConstants.TRUE;
    this.addButtonForApportion = applicationConstants.TRUE;
    this.cv._first = 0;
    this.cv.value.unshift(this.newRowForApportion);
    this.cv.initRowEdit(this.cv.value[0]);
    this.enableSaveAndNextButtonForApportion = applicationConstants.FALSE;
    this.updateData();
  }
  addNewEntry() {
    this.newRow = { tenureType: '', minSlabAmount: '', maxSlabAmount: '', roi: '', employeeConcession: '', seniorCitizenConcession: '', penalInterest: '' }
  }

  addNewEntryForApportionOrder() {
    this.newRowForApportion = { collectionCompenentId: '', order: '' }
  }
  /**
 @author vinitha
 @implementsRow Row Edit Cancel
 
*/
  onRowEditCancel() {
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    this.enableSaveAndNextButton = applicationConstants.TRUE;
    const index = this.dt.value.indexOf(this.newRow);
    if (index > -1) {
      this.dt.value.splice(index, 1);
    }
    this.addNewEntry();
    this.updateData();
  }

  onRowEditCancelForApportionOrder() {
    this.addButtonForApportion = applicationConstants.FALSE;
    this.editDeleteDisableForApportion = applicationConstants.FALSE;
    this.enableSaveAndNextButtonForApportion = applicationConstants.TRUE;
    const index = this.cv.value.indexOf(this.newRowForApportion);
    if (index > -1) {
      this.cv.value.splice(index, 1);
    }

    this.updateData();
  }

  /**
      @author vinitha
      @implements edit inline row
     
     */
  editInlineRow(row: any) {
    this.addButton = applicationConstants.TRUE;
    this.editDeleteDisable = applicationConstants.TRUE;
    this.enableSaveAndNextButton = applicationConstants.FALSE;
    this.updateData();
  }

  editInlineRowForApportionOrder(row: any) {
    this.addButtonForApportion = applicationConstants.TRUE;
    this.editDeleteDisableForApportion = applicationConstants.TRUE;
    this.enableSaveAndNextButtonForApportion = applicationConstants.FALSE;
    this.updateData();
  }


  /**
     @author vinitha
     @implements Ci Borrowings Configuration details 
     @argument ProductId
    */
  getPreviewByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.intrestPolicyList = []
    this.apportionOrderList = []
    this.ciBorrowingProductDefinitionService.getPreviewByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.ciProductDefinitionModel = this.responseModel.data[0];
        if (this.ciProductDefinitionModel != null && this.ciProductDefinitionModel != undefined) {

          if (null != this.ciProductDefinitionModel.effectiveStartDate && undefined != this.ciProductDefinitionModel.effectiveStartDate)
            this.ciProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.ciProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (this.ciProductDefinitionModel.ciInterestPolicyConfigDTO != null && this.ciProductDefinitionModel.ciInterestPolicyConfigDTO != undefined &&
            this.ciProductDefinitionModel.ciInterestPolicyConfigDTO.length > 0) {

            this.enableSaveAndNextButton = applicationConstants.TRUE;

            this.intrestPolicyList = this.ciProductDefinitionModel.ciInterestPolicyConfigDTO;

          }
          else {
            this.enableSaveAndNextButton = applicationConstants.FALSE;
          }

          if (this.ciProductDefinitionModel.ciProductApportionConfigDTO != null && this.ciProductDefinitionModel.ciProductApportionConfigDTO != undefined &&
            this.ciProductDefinitionModel.ciProductApportionConfigDTO.length > 0) {

            this.enableSaveAndNextButtonForApportion = applicationConstants.TRUE;

            this.apportionOrderList = this.ciProductDefinitionModel.ciProductApportionConfigDTO;

          }
          else {
            this.enableSaveAndNextButtonForApportion = applicationConstants.FALSE;
          }
        }
        this.updateData();
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
     @author vinitha
   @implements It Saves the Ci Borrowings Interest Policy data 
     @argument ProductId
    */
  saveInlineRow(rowData: any) {
    if (null != this.ciInterestPolicyConfigModel.productId && undefined != this.ciInterestPolicyConfigModel.productId)
    rowData.productId = this.ciInterestPolicyConfigModel.productId;
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    if (rowData.id != null) {
      this.ciInterestPolicyService.updateCiInterestPolicy(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {
            if (null != rowData.productId && undefined != rowData.productId)
              this.getPreviewByProductId(rowData.productId);
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
          this.getPreviewByProductId(this.productId);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      rowData.status = applicationConstants.ACTIVE;
      this.ciInterestPolicyService.addCiInterestPolicy(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {
            this.intrestPolicyList.unshift(this.responseModel.data[0]);
            this.intrestPolicyList.splice(1, 1);
            if (null != rowData.productId && undefined != rowData.productId)
              this.getPreviewByProductId(rowData.productId);
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
          this.getPreviewByProductId(this.productId);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
  }
  saveInlineRowForApportionOrder(rowData: any) {
    if(null != this.ciCollectionApportionOrderModel.productId && undefined != this.ciCollectionApportionOrderModel.productId)
    rowData.productId = this.ciCollectionApportionOrderModel.productId;
    this.addButtonForApportion = applicationConstants.FALSE;
    this.editDeleteDisableForApportion = applicationConstants.FALSE;
    if (rowData.id != null) {
      this.ciInterestPolicyService.updateCiApportionOrder(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            if (null != rowData.productId && undefined != rowData.productId)
              this.getPreviewByProductId(rowData.productId);
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
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      rowData.status = applicationConstants.ACTIVE;
      this.ciInterestPolicyService.addCiApportionOrder(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {
            this.apportionOrderList.unshift(this.responseModel.data[0]);
            this.apportionOrderList.splice(1, 1);

            if (null != rowData.productId && undefined != rowData.productId)
              this.getPreviewByProductId(rowData.productId);
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
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
  }

  tenuretypeDuplicateCheck(selectedTenureType: any) {
    // Check if there is any row in the list with the same serviceTypeId as the selected one
    const isDuplicate = this.intrestPolicyList.some(row =>
      row.tenureType === selectedTenureType &&
      row.id !== this.ciInterestPolicyConfigModel.id
    );
    if (isDuplicate) {
      this.interestPolicyForm.get('tenureType')?.reset();
      this.msgs = [{ severity: 'error', detail: applicationConstants.TENURE_TYPE_ALREADY_EXIST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      return applicationConstants.TRUE;
    }
    return applicationConstants.FALSE;
  }

  CollectiontypeDuplicateCheck(selectedcollectionType: any) {
    // Check if there is any row in the list with the same serviceTypeId as the selected one
    const isDuplicate = this.apportionOrderList.some(row =>
      row.collectionCompenentId === selectedcollectionType &&
      row.id !== this.ciCollectionApportionOrderModel.id
    );
    if (isDuplicate) {
      this.collectionApportionOrderForm.get('collectionCompenentId')?.reset();
      this.msgs = [{ severity: 'error', detail: applicationConstants.COLLECTION_TYPE_ALREADY_EXIST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      return applicationConstants.TRUE;
    }
    return applicationConstants.FALSE;
  }

  checkForAmount(fieldName : string): void {
    const minSlabAmount = Number(this.interestPolicyForm.get('minSlabAmount')?.value);
    const maxSlabAmount = Number(this.interestPolicyForm.get('maxSlabAmount')?.value);
      if (minSlabAmount && maxSlabAmount && minSlabAmount >= maxSlabAmount) {
        if (fieldName === 'minSlabAmount') {
          this.interestPolicyForm.get('minSlabAmount')?.setValue(null);
      } else if (fieldName === 'maxSlabAmount') {
          this.interestPolicyForm.get('maxSlabAmount')?.setValue(null);
      }
      this.amountAndTenureFlag = applicationConstants.FALSE;
      this.msgs = [{ severity: 'error', detail: applicationConstants.MIN_SLAB_AMOUNT_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 1500);
    } else {
      this.msgs = [];
      this.amountAndTenureFlag = applicationConstants.TRUE;
    }
    this.updateData();
  }
}
