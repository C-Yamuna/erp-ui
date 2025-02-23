import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SaoProductDefinition } from '../../shared/sao-product-definition.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SaoDisbursmentSchedule } from './shared/sao-disbursment-schedule.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { SaoProductDefinitionsService } from '../../shared/sao-product-definitions.service';
import { SaoDisbursmentScheduleServiceService } from './shared/sao-disbursment-schedule-service.service';

@Component({
  selector: 'app-sao-disbursment-config',
  templateUrl: './sao-disbursment-config.component.html',
  styleUrls: ['./sao-disbursment-config.component.css']
})
export class SaoDisbursmentConfigComponent {
  @ViewChild('dt', { static: applicationConstants.FALSE }) private dt!: Table;
  saoProductDefinitionModel: SaoProductDefinition = new SaoProductDefinition();
  saoLoanDisbursementModel: SaoDisbursmentSchedule = new SaoDisbursmentSchedule();
  disbursmentScheduleList: any[] = [];
  displayDialog: boolean = applicationConstants.FALSE;
  schedulerForm: FormGroup;
  newRow: any = null;
  editDeleteDisable: boolean = applicationConstants.FALSE;
  addButton: boolean = applicationConstants.FALSE;

  maxDate = new Date();
  minDate = new Date();
  orgnizationSetting: any;
  isEdit: any;
  saoProductId: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  enableSaveAndNextButton: boolean = applicationConstants.FALSE;
  tenureTypeList: any[] = [];
  requiredlist: any[] = [];

  constructor(private formBuilder: FormBuilder, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private datePipe: DatePipe, private commonFunctionService: CommonFunctionsService, private encryptService: EncryptDecryptService,
    private saoProductDefinitionsService: SaoProductDefinitionsService,
    private saoDisbursmentScheduleServiceService: SaoDisbursmentScheduleServiceService
  ) {
    this.schedulerForm = this.formBuilder.group({
      'isRequired': new FormControl('', Validators.required),
      'visitNumber': new FormControl('', Validators.required),
      'disbursementPercentage': new FormControl('', Validators.required),
      'tenureTypeName': new FormControl('', Validators.required),
      'tenure': new FormControl('', Validators.required),

    });
  }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.requiredlist = this.commonComponent.mandatoryList();
    this.tenureTypeList = this.commonComponent.rePaymentFrequency();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted != undefined) {
        this.isEdit = applicationConstants.TRUE;
        this.saoProductId = Number(this.encryptService.decrypt(encrypted));
        this.getPreviewDetailsByProductId(this.saoProductId);
      } else {
        this.isEdit = applicationConstants.FALSE;
      }
      this.updateData();
    });

    this.schedulerForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.schedulerForm.valid) {
        this.save();
      }
    });
  }
  /**
    @author akhila
    @implements Integrating SAO Loans Product Definition Configuration details To Main Stepper Component
   */
  updateData() {
    this.saoLoanDisbursementModel.saoProductId = this.saoProductId
    this.saoProductDefinitionsService.changeData({
      formValid: this.enableSaveAndNextButton,
      data: this.saoLoanDisbursementModel,
      savedId: this.saoProductId,
      stepperIndex: 7,
      isDisable: !this.schedulerForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
    });
  }
  /**
   @author akhila
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

  addNewEntry() {
    this.newRow = { documentType: '', isRequired: '' }
  }
  /**
   @author akhila
   @implementsRow Row Edit Cancel
  
  */
  onRowEditCancel() {
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    this.enableSaveAndNextButton = applicationConstants.TRUE;
    this.getPreviewDetailsByProductId(this.saoProductId);
    const index = this.dt.value.indexOf(this.newRow);
    if (index > -1) {
      this.dt.value.splice(index, 1);
    }
    this.addNewEntry();
    this.updateData();
  }
  /**
    @author akhila
    @implements edit inline row
   
   */
  editInlineRow(row: any) {
    this.addButton = applicationConstants.TRUE;
    this.editDeleteDisable = applicationConstants.TRUE;
    this.enableSaveAndNextButton = applicationConstants.FALSE;
    this.updateData();
  }
  /**
   @author akhila
   @implements SAO Loans Product Definition Configuration details 
   @argument ProductId
  */
  getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.disbursmentScheduleList = []
    this.saoProductDefinitionsService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.saoProductDefinitionModel = this.responseModel.data[0];
        if (this.saoProductDefinitionModel != null && this.saoProductDefinitionModel != undefined) {

          if (null != this.saoProductDefinitionModel.effectiveStartDate && undefined != this.saoProductDefinitionModel.effectiveStartDate)
            this.saoProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.saoProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (this.saoProductDefinitionModel.saoLoanDisbursementScheduleDTOList != null && this.saoProductDefinitionModel.saoLoanDisbursementScheduleDTOList != undefined &&
            this.saoProductDefinitionModel.saoLoanDisbursementScheduleDTOList.length > 0) {

            this.enableSaveAndNextButton = applicationConstants.TRUE;

            this.disbursmentScheduleList = this.saoProductDefinitionModel.saoLoanDisbursementScheduleDTOList;


          } else {
            this.enableSaveAndNextButton = applicationConstants.FALSE;
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
   @author akhila
  @implements It Saves the SAO Loans Product Definition Configuration required documents data 
   @argument ProductId
  */
  saveInlineRow(rowData: any) {
    if (null != this.saoLoanDisbursementModel.saoProductId && undefined != this.saoLoanDisbursementModel.saoProductId)
      rowData.saoProductId = this.saoLoanDisbursementModel.saoProductId;
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;

    this.saoLoanDisbursementModel.isRequired = this.saoLoanDisbursementModel.isRequired;
    if (rowData.id != null) {
      this.saoDisbursmentScheduleServiceService.updateSaoLoanDisbursementSchedule(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            if (null != rowData.saoProductId && undefined != rowData.saoProductId)
              this.getPreviewDetailsByProductId(rowData.saoProductId);
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
          this.getPreviewDetailsByProductId(this.saoProductId);
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
      this.saoDisbursmentScheduleServiceService.addSaoLoanDisbursementSchedule(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            this.disbursmentScheduleList.unshift(this.responseModel.data[0]);
            this.disbursmentScheduleList.splice(1, 1);
            if (null != rowData.saoProductId && undefined != rowData.saoProductId)
              this.getPreviewDetailsByProductId(rowData.saoProductId);
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
          this.getPreviewDetailsByProductId(this.saoProductId);
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

}
