import { Component, ViewChild } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermLoanProductDefinition } from '../../../term-loan-stepper/term-loan-application-details/shared/term-application.model';
import { TermLoanDisbursementSchedule } from './shared/term-loan-disbursement-schedule.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Table } from 'primeng/table';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { TermLoanProductDefinitionService } from '../../shared/term-loan-product-definition.service';
import { TermLoanDisbursementScheduleService } from 'src/app/transcations/loan-transcation/shared/term-loans/term-loan-disbursement-schedule.service';

@Component({
  selector: 'app-term-loan-disbursement-schedule',
  templateUrl: './term-loan-disbursement-schedule.component.html',
  styleUrls: ['./term-loan-disbursement-schedule.component.css']
})
export class TermLoanDisbursementScheduleComponent {
  @ViewChild('dt', { static: applicationConstants.FALSE }) private dt!: Table;
  termLoanProductDefinitionModel :TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanDisbursementScheduleModel: TermLoanDisbursementSchedule = new TermLoanDisbursementSchedule();
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
  termProductId: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  enableSaveAndNextButton: boolean = applicationConstants.FALSE;
  tenureTypeList: any[] = [];
  requiredlist: any[] = [];

  constructor(private formBuilder: FormBuilder, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private datePipe: DatePipe, private commonFunctionService: CommonFunctionsService, private encryptService: EncryptDecryptService,
    private termLoanProductDefinitionService: TermLoanProductDefinitionService,
    private termLoanDisbursementScheduleService: TermLoanDisbursementScheduleService
  ) {
    this.schedulerForm = this.formBuilder.group({
      'isMandatory': new FormControl('', Validators.required),
      'visitNumber': new FormControl('', Validators.required),
      'disbursementPercentage': new FormControl('', Validators.required),
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
        this.termProductId = Number(this.encryptService.decrypt(encrypted));
        this.getPreviewDetailsByProductId(this.termProductId);
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
    @author vinitha
    @implements Integrating term Loans Product Definition Configuration details To Main Stepper Component
   */
  updateData() {
    this.termLoanDisbursementScheduleModel.termProductId = this.termProductId
    this.termLoanProductDefinitionService.changeData({
      formValid: this.enableSaveAndNextButton,
      data: this.termLoanDisbursementScheduleModel,
      savedId: this.termProductId,
      stepperIndex: 7,
      isDisable: !this.schedulerForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
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

  addNewEntry() {
    this.newRow = { visitNumber: '', isMandatory: '' , disbursementPercentage:'' , tenure:''}
  }
  /**
   @author vinitha
   @implementsRow Row Edit Cancel
  
  */
  onRowEditCancel() {
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    this.enableSaveAndNextButton = applicationConstants.TRUE;
    this.getPreviewDetailsByProductId(this.termProductId);
    const index = this.dt.value.indexOf(this.newRow);
    if (index > -1) {
      this.dt.value.splice(index, 1);
    }
    this.addNewEntry();
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
  /**
   @author vinitha
   @implements term Loans Product Definition Configuration details 
   @argument ProductId
  */
  getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.disbursmentScheduleList = []
    this.termLoanProductDefinitionService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.termLoanProductDefinitionModel = this.responseModel.data[0];
        if (this.termLoanProductDefinitionModel != null && this.termLoanProductDefinitionModel != undefined) {

          if (null != this.termLoanProductDefinitionModel.effectiveStartDate && undefined != this.termLoanProductDefinitionModel.effectiveStartDate)
            this.termLoanProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termLoanProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);

          if (this.termLoanProductDefinitionModel.termLoanDisbursementScheduleDTOList != null && this.termLoanProductDefinitionModel.termLoanDisbursementScheduleDTOList != undefined &&
            this.termLoanProductDefinitionModel.termLoanDisbursementScheduleDTOList.length > 0) {

            this.enableSaveAndNextButton = applicationConstants.TRUE;

            this.disbursmentScheduleList = this.termLoanProductDefinitionModel.termLoanDisbursementScheduleDTOList;


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
   @author vinitha
  @implements It Saves the term Loans Product Definition Configuration required documents data 
   @argument ProductId
  */
  saveInlineRow(rowData: any) {
    if (null != this.termLoanDisbursementScheduleModel.termProductId && undefined != this.termLoanDisbursementScheduleModel.termProductId)
      rowData.termProductId = this.termLoanDisbursementScheduleModel.termProductId;
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;

    this.termLoanDisbursementScheduleModel.isMandatory = this.termLoanDisbursementScheduleModel.isMandatory;
    if (rowData.id != null) {
      this.termLoanDisbursementScheduleService.updateTermLoanDisbursementSchedule(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            if (null != rowData.termProductId && undefined != rowData.termProductId)
              this.getPreviewDetailsByProductId(rowData.termProductId);
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
          this.getPreviewDetailsByProductId(this.termProductId);
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
      this.termLoanDisbursementScheduleService.addTermLoanDisbursementSchedule(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            this.disbursmentScheduleList.unshift(this.responseModel.data[0]);
            this.disbursmentScheduleList.splice(1, 1);
            if (null != rowData.termProductId && undefined != rowData.termProductId)
              this.getPreviewDetailsByProductId(rowData.termProductId);
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
          this.getPreviewDetailsByProductId(this.termProductId);
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
