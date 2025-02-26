import { Component, ViewChild } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermLoanProductDefinition } from '../../../term-loan-stepper/term-loan-application-details/shared/term-application.model';
import { TermLoanFieldVisit } from './shared/term-loan-field-visit.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TermLoanProductDefinitionService } from '../../shared/term-loan-product-definition.service';
import { TermLoanFieldVisitService } from './shared/term-loan-field-visit.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-term-loan-field-visit-config',
  templateUrl: './term-loan-field-visit-config.component.html',
  styleUrls: ['./term-loan-field-visit-config.component.css']
})
export class TermLoanFieldVisitConfigComponent {
  @ViewChild('dt', { static: applicationConstants.FALSE }) private dt!: Table;
  termLoanProductDefinitionModel :TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanFieldVisitModel : TermLoanFieldVisit = new TermLoanFieldVisit();
  fieldVisitList: any[] = [];
  displayDialog: boolean = applicationConstants.FALSE;
  fieldVisitForm: FormGroup;
  newRow: any = null;
  selectedRoles: any[] = [];
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
  requiredlist: any[] = [];
  visiRoleList: any[] = [];
  tenureTypeList: any[] = [];
  constructor(private formBuilder: FormBuilder, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private datePipe: DatePipe, private commonFunctionService: CommonFunctionsService, private encryptService: EncryptDecryptService,
    private termLoanProductDefinitionService : TermLoanProductDefinitionService,
    private termLoanFieldVisitService: TermLoanFieldVisitService
  ) {
    this.fieldVisitForm = this.formBuilder.group({
      'visitNumber':new FormControl({ value: '', disabled: true }, [Validators.required]),
      'visitTenure': new FormControl('', [Validators.required, ]),
      'tenureTypeName': new FormControl('', Validators.required),
      'isMandatory': new FormControl('', Validators.required),
      'visitRoleNames': new FormControl('', Validators.required),

    });
  }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.requiredlist = this.commonComponent.requiredlist();

    this.tenureTypeList=[
      { label: "Days", value: 1 },
      { label: "Months", value: 2 },
    ]
    this.visiRoleList = [
      { label: "Manager", value: 1 },
      { label: "Clerk", value: 2 },
    ]
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

    this.fieldVisitForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.fieldVisitForm.valid) {
        this.save();
      }
    });
    this.fieldVisitForm.get('visitTenure')?.valueChanges.subscribe((tenureValue) => {
      this.validateVisitTenure(tenureValue);
    });
  
    this.fieldVisitForm.get('tenureTypeName')?.valueChanges.subscribe(() => {
      this.validateVisitTenure(this.fieldVisitForm.get('visitTenure')?.value);
    });
  }

  validateVisitTenure(tenureValue: any) {
    const tenureType = this.fieldVisitForm.get('tenureTypeName')?.value;
  
    if (tenureType === 1 && tenureValue > 30) { // If "Days" is selected and tenure exceeds 30
      this.msgs = [{ severity: 'error', summary: applicationConstants.VISIT_TENURE_CANNOT_EXCEED_30_DAYS, detail: this.responseModel.statusMsg }];
      this.fieldVisitForm.patchValue({ visitTenure: '' }); // Reset field
      setTimeout(() => { this.msgs = []; }, 2000);
    }
  }
  /**
    @author vinitha
    @implements Integrating term Loans Product Definition Configuration details To Main Stepper Component
   */
  updateData() {
    this.termLoanFieldVisitModel.termProductId = this.termProductId
    this.termLoanProductDefinitionService.changeData({
      // formValid: this.enableSaveAndNextButton,
      data: this.termLoanFieldVisitModel,
      savedId: this.termProductId,
      stepperIndex: 6,
      // isDisable: !this.fieldVisitForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
    });
  }
  /**
   @implements To Call update Data function to integrate data to main stepper
      @author Vinitha
  */
  save() {
    this.updateData();
  }

  addInlineRow() {
    this.selectedRoles = [];
    if (this.fieldVisitList != null && this.fieldVisitList != undefined && this.fieldVisitList.length > 0) {
      this.termLoanFieldVisitModel.visitNumber = this.fieldVisitList.length + 1;
    } else {
      this.termLoanFieldVisitModel.visitNumber = 1;
    }
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
    this.newRow = { visitNumber: this.termLoanFieldVisitModel.visitNumber,tenureType: '', visitTenure: '' ,isMandatory:'',visitRole:'' }
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
    @implements edit inline row
        @author vinitha
   
   */

  editInlineRow(row: any) {
    this.addButton = true;
    this.editDeleteDisable = true;
    this.enableSaveAndNextButton = false;

    this.termLoanFieldVisitService.getTermLoanFieldVisitById(row.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.termLoanFieldVisitModel = this.responseModel.data[0];      
            this.termLoanFieldVisitModel.isMandatory = this.termLoanFieldVisitModel.isMandatory;
            this.selectedRoles = this.termLoanFieldVisitModel.visitRole ? this.termLoanFieldVisitModel.visitRole.split(',').map(Number) : [];

        this.termLoanFieldVisitModel.visitRoleNames = this.visiRoleList.filter(role => this.selectedRoles.includes(role.value)).map(role => role.label);
        } else {
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => { this.msgs = []; }, 2000);
        }
    });

    this.updateData();
}


  
  /**
   @implements term Loans Product Definition Configuration details 
   @argument ProductId
      @author Vinitha
  */
  getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.fieldVisitList = [];
    this.selectedRoles = [];
    this.termLoanProductDefinitionService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.termLoanProductDefinitionModel = this.responseModel.data[0];
        if (this.termLoanProductDefinitionModel != null && this.termLoanProductDefinitionModel != undefined) {

          if (null != this.termLoanProductDefinitionModel.effectiveStartDate && undefined != this.termLoanProductDefinitionModel.effectiveStartDate)
            this.termLoanProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termLoanProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          if (this.termLoanProductDefinitionModel.termLoanFieldVisitConfigDTOList != null && this.termLoanProductDefinitionModel.termLoanFieldVisitConfigDTOList != undefined &&
            this.termLoanProductDefinitionModel.termLoanFieldVisitConfigDTOList.length > 0) {
            this.enableSaveAndNextButton = applicationConstants.TRUE;
            this.fieldVisitList = this.termLoanProductDefinitionModel.termLoanFieldVisitConfigDTOList;
          
            for (let fieldVisit of this.fieldVisitList) {
              if (fieldVisit.visitRole != null) {
                let rolesSelected = fieldVisit.visitRole.split(',');

                if (rolesSelected.length > 0) {

                  fieldVisit.visitRoleNames = fieldVisit.visitRoleNames || [];

                  for (let id of rolesSelected) {

                    let matchedRole = this.visiRoleList.find(role => role.value === Number(id));

                    if (matchedRole) {
                      fieldVisit.visitRoleNames.push(matchedRole.label);
                    }
                  }
                }
              }
            }


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
    @implements It Saves the term Loans Product Definition Configuration field visit data 
   @argument ProductId
      @author Vinitha
  */
  saveInlineRow(rowData: any) {
    if (null != this.termLoanFieldVisitModel.termProductId && undefined != this.termLoanFieldVisitModel.termProductId)
      rowData.termProductId = this.termLoanFieldVisitModel.termProductId;
    rowData.visitRole = this.selectedRoles.join(',');
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    rowData.visitRoleNames = null; 
    this.termLoanFieldVisitModel.isMandatory = this.termLoanFieldVisitModel.isMandatory;
    if (rowData.id != null) {
      this.termLoanFieldVisitService.updateTermLoanFieldVisit(rowData).subscribe((response: any) => {
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
      this.termLoanFieldVisitService.addTermLoanFieldVisit(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            this.fieldVisitList.unshift(this.responseModel.data[0]);
            this.fieldVisitList.splice(1, 1);
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
