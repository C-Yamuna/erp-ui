import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SaoProductDefinition } from '../../shared/sao-product-definition.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { SaoProductDefinitionsService } from '../../shared/sao-product-definitions.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { SaoRequiredDocumentsService } from '../sao-required-documents-config/shared/sao-required-documents.service';
import { SaoRequiredDocuments } from '../sao-required-documents-config/shared/sao-required-documents.model';
import { SaoFieldVisit } from './shared/sao-field-visit.model';
import { SaoFieldVisitServiceService } from './shared/sao-field-visit-service.service';

@Component({
  selector: 'app-sao-field-visit-config',
  templateUrl: './sao-field-visit-config.component.html',
  styleUrls: ['./sao-field-visit-config.component.css']
})
export class SaoFieldVisitConfigComponent {
  @ViewChild('dt', { static: applicationConstants.FALSE }) private dt!: Table;
  saoProductDefinitionModel: SaoProductDefinition = new SaoProductDefinition();
  saoFieldVisitModel: SaoFieldVisit = new SaoFieldVisit();
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
  saoProductId: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  enableSaveAndNextButton: boolean = applicationConstants.FALSE;
  docTypeList: any[] = [];
  requiredlist: any[] = [];
  tenureTypeList: any[] = [];
  visiRoleList: any[] = [];

  constructor(private formBuilder: FormBuilder, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private datePipe: DatePipe, private commonFunctionService: CommonFunctionsService, private encryptService: EncryptDecryptService,
    private saoProductDefinitionsService: SaoProductDefinitionsService,
    private saoFieldVisitServiceService: SaoFieldVisitServiceService
  ) {
    this.fieldVisitForm = this.formBuilder.group({
      'visitNumber': new FormControl('', Validators.required),
      'tenureTypeName': new FormControl('', Validators.required),
      'visitTenure': new FormControl('', Validators.required),
      'isMandatory': new FormControl('', Validators.required),
      'visitRoleNames': new FormControl('', Validators.required),

    });
  }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.requiredlist = this.commonComponent.mandatoryList();
    this.tenureTypeList = this.commonComponent.rePaymentFrequency();
    this.visiRoleList = [
      { label: "Manager", value: 1 },
      { label: "Cleark", value: 2 }
    ]
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

    this.fieldVisitForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.fieldVisitForm.valid) {
        this.save();
      }
    });
  }
  /**
    @author akhila
    @implements Integrating SAO Loans Product Definition Configuration details To Main Stepper Component
   */
  updateData() {
    this.saoFieldVisitModel.saoProductId = this.saoProductId
    this.saoProductDefinitionsService.changeData({
      formValid: this.enableSaveAndNextButton,
      data: this.saoFieldVisitModel,
      savedId: this.saoProductId,
      stepperIndex: 6,
      isDisable: !this.fieldVisitForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
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
    this.selectedRoles = [];
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
    this.saoFieldVisitServiceService.getSaoFieldVisitById(row.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saoFieldVisitModel = this.responseModel.data[0];
        let rolesSelected = this.saoFieldVisitModel.visitRole.split(',');
        if (rolesSelected.length > 0) {
          for (let id of rolesSelected) {
            this.saoFieldVisitModel.visitRoleNames = this.saoFieldVisitModel.visitRoleNames || [];
            
            this.selectedRoles.push(Number(id));
            for (let id of rolesSelected) {

              let matchedRole = this.visiRoleList.find(role => role.value === Number(id));

              if (matchedRole) {
                this.saoFieldVisitModel.visitRoleNames.push(matchedRole.label);
              }
            }
          }
        }
        

      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    });
    this.updateData();
  }
  
  /**
   @author akhila
   @implements SAO Loans Product Definition Configuration details 
   @argument ProductId
  */
  getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.fieldVisitList = [];
    this.selectedRoles = [];
    this.saoProductDefinitionsService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.saoProductDefinitionModel = this.responseModel.data[0];
        if (this.saoProductDefinitionModel != null && this.saoProductDefinitionModel != undefined) {

          if (null != this.saoProductDefinitionModel.effectiveStartDate && undefined != this.saoProductDefinitionModel.effectiveStartDate)
            this.saoProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.saoProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          if (this.saoProductDefinitionModel.saoLoanFieldVisitConfigDTOList != null && this.saoProductDefinitionModel.saoLoanFieldVisitConfigDTOList != undefined &&
            this.saoProductDefinitionModel.saoLoanFieldVisitConfigDTOList.length > 0) {
            this.enableSaveAndNextButton = applicationConstants.TRUE;
            this.fieldVisitList = this.saoProductDefinitionModel.saoLoanFieldVisitConfigDTOList;

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
   @author akhila
    @implements It Saves the SAO Loans Product Definition Configuration required documents data 
   @argument ProductId
  */
  saveInlineRow(rowData: any) {
    if (null != this.saoFieldVisitModel.saoProductId && undefined != this.saoFieldVisitModel.saoProductId)
      rowData.saoProductId = this.saoFieldVisitModel.saoProductId;
    rowData.visitRole = this.selectedRoles.join(',');
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;

    this.saoFieldVisitModel.isMandatory = this.saoFieldVisitModel.isMandatory;
    if (rowData.id != null) {
      this.saoFieldVisitServiceService.updateSaoFieldVisit(rowData).subscribe((response: any) => {
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
      this.saoFieldVisitServiceService.addSaoFieldVisit(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
          if (this.responseModel != null && this.responseModel.data != undefined) {

            this.fieldVisitList.unshift(this.responseModel.data[0]);
            this.fieldVisitList.splice(1, 1);
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
