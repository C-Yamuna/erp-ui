import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermLoanHistory } from './shared/term-loan-history.model';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermLoanHistoryService } from './shared/term-loan-history.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-term-loan-history',
  templateUrl: './term-loan-history.component.html',
  styleUrls: ['./term-loan-history.component.css']
})
export class TermLoanHistoryComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;

  termLoanHistoryForm: FormGroup;

  checked: boolean = false;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  termLoanApplicationId: any;
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

  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanHistoryModel: TermLoanHistory = new TermLoanHistory();

  admissionNumber: any;
  saveAndNextDisable: boolean = false;
  grenealogyTreeId: any;
  displayDialog: boolean = false;
  historyColumns: { field: string; header: string; }[];
  loanExistedId: any;
  termLoanHistoryList: any[] = [];
  collateralList:any[]=[];
  trueFalseList: any[] = [];
  moduleTypes: any[] = [];
  historyId: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,
    private activateRoute: ActivatedRoute,
    private termLoanHistoryService: TermLoanHistoryService,  private termLoanApplicationsService: TermApplicationService,
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

    this.termLoanHistoryForm = this.formBuilder.group({
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
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.trueFalseList = this.commonComponent.requiredlist();
    this.getAllCollaterals();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.termLoanApplicationId = Number(id);
        this.isEdit = true;
        
        this.getTermApplicationByTermAccId(this.termLoanApplicationId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    });
    this.termLoanHistoryForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.termLoanHistoryForm.valid) {
        this.save();
      }
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    if (this.termLoanHistoryList == null || this.termLoanHistoryList == undefined || this.termLoanHistoryList.length == 0) {
      this.saveAndNextDisable = true;
    }
    else {
      this.saveAndNextDisable = false;
    }
    if (this.addButtonService) {
      this.saveAndNextDisable = true;
    }
    this.termLoanHistoryModel.accId = this.termLoanApplicationId;
    this.termLoanApplicationsService.changeData({
      formValid: this.termLoanHistoryForm.valid,
      data: this.termLoanHistoryModel,
      isDisable: this.addButtonService,
      stepperIndex: 9,
    });
  }


  /**
   * @implements get term Loan History by Application Id
   * @param termLoanApplicationId 
   * @author vinitha
   */
  getTermLoanExistedDetailsByApplicationId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanHistoryService.getTermLoanExistedDetailsByApplicationId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termLoanHistoryList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((history: any) => {
              history.closingDateVal = this.datePipe.transform(history.closingDate, this.orgnizationSetting.datePipe);
              history.openingDateVal = this.datePipe.transform(history.openingDate, this.orgnizationSetting.datePipe);
              if (history.isNPA != null && history.isNPA != undefined && history.isNPA)
                history.isNpaName = applicationConstants.YES;
              else
                history.isNpaName = applicationConstants.NO;
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
      }, 2000);
    });
  }

  /**
   * @implements get term Loan application by id
   * @param termLoanApplicationId 
   * @author vinitha
   */
  getTermApplicationByTermAccId(termLoanApplicationId: any) {
    this.commonFunctionsService
    this.termLoanApplicationsService.getTermApplicationByTermAccId(termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termLoanApplicationModel = this.responseModel.data[0];
            this.admissionNumber = this.responseModel.data[0].admissionNo;
            if (this.termLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.termLoanApplicationModel.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
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
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  /**
   * @implements add History
   * @author vinitha
   */
  addHistory() {
    this.termLoanHistoryModel = new TermLoanHistory();
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
   * @author vinitha
   */
  saveLoanHistory(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.termLoanHistoryModel = row;
    this.termLoanHistoryList = [];
    row.accId = this.termLoanApplicationId;
    row.admissionNumber = this.termLoanApplicationModel.admissionNo;
    if(row.openingDateVal != null && row.openingDateVal != undefined){
      this.termLoanHistoryModel.openingDate = this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.openingDateVal);
    }
    if(row.closingDateVal != null && row.closingDateVal != undefined){
      this.termLoanHistoryModel.closingDate = this.termLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.closingDateVal);
    }
    this.termLoanHistoryModel.status = applicationConstants.ACTIVE;
    if (row.id != null && row.id != undefined) {
      this.termLoanHistoryService.updateTermLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.termLoanHistoryModel = this.responseModel.data;
              if (this.responseModel.data[0].accId != null && this.responseModel.data[0].accId != undefined) {
                this.getTermLoanExistedDetailsByApplicationId(this.responseModel.data[0].accId);
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
            this.getTermLoanExistedDetailsByApplicationId(this.termLoanApplicationId);
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
        }, 2000);
      });
    }
    else {
      this.termLoanHistoryService.addTermLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.termLoanHistoryModel = this.responseModel.data;
              if (this.responseModel.data[0].accId != null && this.responseModel.data[0].accId != undefined) {
                this.getTermLoanExistedDetailsByApplicationId(this.responseModel.data[0].accId);
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
            this.getTermLoanExistedDetailsByApplicationId(this.termLoanApplicationId);
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
        }, 2000);
      });
    }
  }

  /**
   * @implements cancle History
   * @author vinitha
   */
  cancelHistory() {
    this.termLoanHistoryList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getTermLoanExistedDetailsByApplicationId(this.termLoanApplicationId);
  }

  /**
   * @implements edit History
   * @param rowData 
   * @author vinitha
   */
  editHistory(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.termLoanHistoryService.getTermLoanExistedDetails(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.termLoanHistoryModel = this.responseModel.data[0];
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
      }, 2000);
    });
  }

  /**
   * @implements delete confirm enble
   * @param row 
   * @author vinitha
   */
  delete(row: any) {
    this.historyId = row.id;
    this.displayDialog = true;
  }


  /**
   * @implements submit delete
   * @author vinitha
   */
  submitDelete() {
    this.termLoanHistoryService.deleteTermLoanExistedDetails(this.historyId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.displayDialog = false;
        this.getTermLoanExistedDetailsByApplicationId(this.termLoanApplicationId);
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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
   * @author vinitha
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
   * @implements get all collateral
   * @author vinitha
   */
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.termLoanHistoryService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.collateralList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
          return { label: collateral.name, value: collateral.id }
      });
      this.getTermLoanExistedDetailsByApplicationId(this.termLoanApplicationId);
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
