import { Component, ViewChild } from '@angular/core';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SaoLoanHistory } from './shared/sao-loan-history.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { SaoLoanHistoryService } from './shared/sao-loan-history.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-sao-loan-history',
  templateUrl: './sao-loan-history.component.html',
  styleUrls: ['./sao-loan-history.component.css']
})
export class SaoLoanHistoryComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;

  saoHistoryForm: FormGroup;

  checked: boolean = false;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  saoLoanApplicationId: any;
  isEdit: boolean = false;
  visible: boolean = false;
  isFormValid: Boolean = false;
  addButton: boolean = false;
  newRow: any;
  EditDeleteDisable: boolean = false;
  promoterColumns: any[] = [];

  addButtonService: boolean = false;
  editDeleteDisable: boolean = false;

  productName: any;
  accountType: any;
  minBalence: any;
  accountOpeningDateVal: any;

  
  saoLoanApplicatonModel: SaoLoanApplication = new SaoLoanApplication();
  saoLoanHistory: SaoLoanHistory = new SaoLoanHistory();

  admissionNumber: any;
  saveAndNextDisable: boolean = false;
  grenealogyTreeId: any;
  displayDialog: boolean = false;
  historyColumns: { field: string; header: string; }[];
  loanExistedId: any;
  saoLoanHistoryList: any[] = [];
  collateralList:any[]=[];
  trueFalseList: any[] = [];
  moduleTypes: any[] = [];
  historyId: any;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private activateRoute: ActivatedRoute,
    private saoLoanHistoryService: SaoLoanHistoryService, private saoLoanApplicationService: SaoLoanApplicationService
  ) {

    this.historyColumns = [
      { field: 'accountNumber', header: 'ERP.NAME' },
      // { field: 'admissionNumber', header: 'ERP.ADMISSION_NUMBER' },
      { field: 'bankName', header: 'ERP.BANKNAME' },
      { field: 'loanAmount', header: 'ERP.LOAN_AMOUNT' },
      { field: 'collateralType', header: 'ERP.COLLATERAL_TYPE' },
      { field: 'openingDate', header: 'ERP.OPENING_DATE' },
      { field: 'closingDate', header: 'ERP.CLOSING_dATE' },
      { field: 'isNPA', header: 'ERP.ISNPA' },
      { field: 'moduleType', header: 'ERP.MODULE_TYPE' },
    ];

    this.saoHistoryForm = this.formBuilder.group({
      "accountNumber": new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),
      // "admissionNumber": new FormControl('', Validators.required),
      "bankName": new FormControl('', [Validators.required, Validators.pattern(applicationConstants.NAME_PATTERN)]),
      "loanAmount": new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES)]),
      "collateralType": new FormControl('', [Validators.required]),
      "openingDate": new FormControl('', Validators.required),
      "closingDate": new FormControl('', ),
      "isNPA": new FormControl('', ),
      "moduleType": new FormControl('', Validators.required),
    })
  }
  ngOnInit() {
    this.moduleTypes  = [
      { label: "Compound Interest Loan", value:1 },
      { label: "Simple Interest Loan", value:2 },
      { label: "Term Loan", value:3 },
      { label: "SAO Loan", value:4 }
    ]
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.trueFalseList = this.commonComponent.requiredlist();
    this.getAllCollaterals();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.saoLoanApplicationId = Number(id);
        this.isEdit = true;
        
        this.getSaoLoanApplicationDetailsById(this.saoLoanApplicationId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    });
    this.saoHistoryForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.saoHistoryForm.valid) {
        this.save();
      }
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    // if (this.saoLoanHistoryList == null || this.saoLoanHistoryList == undefined || this.saoLoanHistoryList.length == 0) {
    //   this.saveAndNextDisable = true;
    // }
    // else {
    //   this.saveAndNextDisable = false;
    // }
    if (this.addButtonService) {
      this.saveAndNextDisable = true;
    }
    this.saoLoanHistory.saoLoanApplicationId = this.saoLoanApplicationId;
    this.saoLoanApplicationService.changeData({
      formValid: this.saoHistoryForm.valid,
      data: this.saoLoanHistory,
      isDisable: this.saveAndNextDisable,
      stepperIndex: 7,
    });
  }


  /**
   * @implements get sao Loan History by Application Id
   * @param saoLoanApplicationId 
   * @author akhila
   */
  getSaoLoanExistedDetailsByApplicationId(saoLoanApplicationId: any) {
    this.commonFunctionsService
    this.saoLoanHistoryService.getSaoLoanExistedDetailsByApplicationId(saoLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.saoLoanHistoryList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((history: any) => {
              history.closingDateVal = this.datePipe.transform(history.closingDate, this.orgnizationSetting.datePipe);
              history.openingDateVal = this.datePipe.transform(history.openingDate, this.orgnizationSetting.datePipe);
              if (history.isNPA != null && history.isNPA != undefined && history.isNPA)
                history.isNpaName = "Yes";
              else
                history.isNpaName = "No";
                history.moduleTypeName = this.moduleTypes.find((obj: any) => obj.value == history.moduleType)?.label;
                history.collateralTypeName = this.collateralList.find((obj: any) => obj.value == history.collateralType)?.label;
              return history;
            });
          }
          this.updateData();
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @implements get sao Loan application by id
   * @param saoLoanApplicationId 
   * @author akhila
   */
  getSaoLoanApplicationDetailsById(id: any) {
    this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saoLoanApplicatonModel = this.responseModel.data[0];
       
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    });
  }

  /**
   * @implements add History
   * @author akhila
   */
  addHistory() {
    this.saoLoanHistory = new SaoLoanHistory();
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.dt._first = 0;
    this.dt.value.unshift({ relationWithApplicant: '' });
    this.dt.initRowEdit(this.dt.value[0]);

  }

  /**
   * @implements save Loan history
   * @param row 
   * @author akhila
   */
  saveLoanHistory(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.saoLoanHistory = row;
    this.saoLoanHistoryList = [];
    row.saoLoanApplicationId = this.saoLoanApplicationId;
    row.admissionNumber = this.saoLoanApplicatonModel.admissionNo;
    if(row.openingDateVal != null && row.openingDateVal != undefined){
      this.saoLoanHistory.openingDate = this.saoLoanApplicatonModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.openingDateVal);
    }
    if(row.closingDateVal != null && row.closingDateVal != undefined){
      this.saoLoanHistory.closingDate = this.saoLoanApplicatonModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.closingDateVal);
    }
    this.saoLoanHistory.status = applicationConstants.ACTIVE;
    if (row.id != null && row.id != undefined) {
      this.saoLoanHistoryService.updateSaoLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.saoLoanHistory = this.responseModel.data;
              if (this.responseModel.data[0].saoLoanApplicationId != null && this.responseModel.data[0].saoLoanApplicationId != undefined) {
                this.getSaoLoanExistedDetailsByApplicationId(this.responseModel.data[0].saoLoanApplicationId);
              }
              this.msgs = [];
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            this.getSaoLoanExistedDetailsByApplicationId(this.saoLoanApplicationId);
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.saoLoanHistoryService.addSaoLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.saoLoanHistory = this.responseModel.data;
              if (this.responseModel.data[0].saoLoanApplicationId != null && this.responseModel.data[0].saoLoanApplicationId != undefined) {
                this.getSaoLoanExistedDetailsByApplicationId(this.responseModel.data[0].saoLoanApplicationId);
              }
              this.msgs = [];
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            this.getSaoLoanExistedDetailsByApplicationId(this.saoLoanApplicationId);
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  /**
   * @implements cancle History
   * @author akhila
   */
  cancelHistory() {
    this.saoLoanHistoryList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getSaoLoanExistedDetailsByApplicationId(this.saoLoanApplicationId);
  }

  /**
   * @implements edit History
   * @param rowData 
   * @author akhila
   */
  editHistory(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.saoLoanHistoryService.getSaoLoanExistedDetails(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.saoLoanHistory = this.responseModel.data[0];
          }
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @implements delete confirm enble
   * @param row 
   * @author akhila
   */
  delete(row: any) {
    this.historyId = row.id;
    this.displayDialog = true;
  }


  /**
   * @implements submit delete
   * @author akhila
   */
  submitDelete() {
    this.saoLoanHistoryService.deleteSaoLoanExistedDetails(this.historyId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.displayDialog = false;
        this.getSaoLoanExistedDetailsByApplicationId(this.saoLoanApplicationId);
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      this.commonComponent.stopSpinner();
    });
  }


  /**
   * @implements cancle
   * @author akhila
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
   * @implements get all collateral
   * @author akhila
   */
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.saoLoanHistoryService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.collateralList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
          return { label: collateral.name, value: collateral.id }
      });
      this.getSaoLoanExistedDetailsByApplicationId(this.saoLoanApplicationId);
      this.commonComponent.stopSpinner();
    }
    else {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      this.commonComponent.stopSpinner();
    });
  }
}
