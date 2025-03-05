import { Component, ViewChild } from '@angular/core';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../../../compound-interest-loan/compound-interest-loan-stepper/ci-membership-details/shared/membership-details.model';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { CiLoanHistory } from '../../../compound-interest-loan/compound-interest-loan-stepper/ci-loan-history/shared/ci-loan-history';
import { CiLoanHistoryService } from '../../../compound-interest-loan/compound-interest-loan-stepper/ci-loan-history/shared/ci-loan-history.service';
import { CiLoanApplicationService } from '../../../compound-interest-loan/compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.service';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { SiLoanHistory } from '../../../shared/si-loans/si-loan-history.model';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiLoanHistoryService } from '../../../shared/si-loans/si-loan-history.service';

@Component({
  selector: 'app-si-loan-history',
  templateUrl: './si-loan-history.component.html',
  styleUrls: ['./si-loan-history.component.css']
})
export class SiLoanHistoryComponent {
 @ViewChild('dt', { static: false }) private dt!: Table;

  siHistoryForm: FormGroup;

  checked: boolean = false;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  siLoanApplicationId: any;
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

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanHistory: SiLoanHistory = new SiLoanHistory();

  admissionNumber: any;
  saveAndNextDisable: boolean = false;
  grenealogyTreeId: any;
  displayDialog: boolean = false;
  historyColumns: { field: string; header: string; }[];
  loanExistedId: any;
  siLoanHistoryList: any[] = [];
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
    private siLoanHistoryService: SiLoanHistoryService, private siLoanApplicationService: SiLoanApplicationService
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

    this.siHistoryForm = this.formBuilder.group({
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
        this.siLoanApplicationId = Number(id);
        this.isEdit = true;
        
        this.getCiLoanApplicationsById(this.siLoanApplicationId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    });
    this.siHistoryForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.siHistoryForm.valid) {
        this.save();
      }
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    if (this.siLoanHistoryList == null || this.siLoanHistoryList == undefined || this.siLoanHistoryList.length == 0) {
      this.saveAndNextDisable = true;
    }
    else {
      this.saveAndNextDisable = false;
    }
    if (this.addButtonService) {
      this.saveAndNextDisable = true;
    }
    this.siLoanHistory.accId = this.siLoanApplicationId;
    this.siLoanApplicationService.changeData({
      formValid: this.siHistoryForm.valid,
      data: this.siLoanHistory,
      isDisable: this.addButtonService,
      stepperIndex: 9,
    });
  }


  /**
   * @implements get si Loan History by Application Id
   * @param siLoanApplicationId 
   * @author k.yamuna
   */
  getSiLoanHistoryByApplicationId(siLoanApplicationId: any) {
    this.commonFunctionsService
    this.siLoanHistoryService.getSiLoanExistedDetailsByApplicationId(siLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.siLoanHistoryList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((history: any) => {
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
   * @implements get si Loan application by id
   * @param siLoanApplicationId 
   * @author k.yamuna
   */
  getCiLoanApplicationsById(siLoanApplicationId: any) {
    this.commonFunctionsService
    this.siLoanApplicationService.getSILoanApplicationById(siLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.siLoanApplicationModel = this.responseModel.data[0];
            this.admissionNumber = this.responseModel.data[0].admissionNo;
            if (this.siLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.siLoanApplicationModel.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
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
      }, 3000);
    });
  }

  /**
   * @implements add History
   * @author k.yamuna
   */
  addHistory() {
    this.siLoanHistory = new CiLoanHistory();
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
   * @author k.yamuna
   */
  saveLoanHistory(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.siLoanHistory = row;
    this.siLoanHistoryList = [];
    row.accId = this.siLoanApplicationId;
    row.admissionNumber = this.siLoanApplicationModel.admissionNo;
    if(row.openingDateVal != null && row.openingDateVal != undefined){
      this.siLoanHistory.openingDate = this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.openingDateVal);
    }
    if(row.closingDateVal != null && row.closingDateVal != undefined){
      this.siLoanHistory.closingDate = this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.closingDateVal);
    }
    this.siLoanHistory.status = applicationConstants.ACTIVE;
    if (row.id != null && row.id != undefined) {
      this.siLoanHistoryService.updateSiLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.siLoanHistory = this.responseModel.data;
              if (this.responseModel.data[0].accId != null && this.responseModel.data[0].accId != undefined) {
                this.getSiLoanHistoryByApplicationId(this.responseModel.data[0].accId);
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
            this.getSiLoanHistoryByApplicationId(this.siLoanApplicationId);
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
      this.siLoanHistoryService.addSiLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.siLoanHistory = this.responseModel.data;
              if (this.responseModel.data[0].accId != null && this.responseModel.data[0].accId != undefined) {
                this.getSiLoanHistoryByApplicationId(this.responseModel.data[0].accId);
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
            this.getSiLoanHistoryByApplicationId(this.siLoanApplicationId);
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
   * @author k.yamuna
   */
  cancelHistory() {
    this.siLoanHistoryList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getSiLoanHistoryByApplicationId(this.siLoanApplicationId);
  }

  /**
   * @implements edit History
   * @param rowData 
   * @author k.yamuna
   */
  editHistory(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.siLoanHistoryService.getSiLoanExistedDetails(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.siLoanHistory = this.responseModel.data[0];
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
   * @author k.yamuna
   */
  delete(row: any) {
    this.historyId = row.id;
    this.displayDialog = true;
  }


  /**
   * @implements submit delete
   * @author k.yamuna
   */
  submitDelete() {
    this.siLoanHistoryService.deleteSiLoanExistedDetails(this.historyId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.displayDialog = false;
        this.getSiLoanHistoryByApplicationId(this.siLoanApplicationId);
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
   * @author k.yamuna
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
   * @implements get all collateral
   * @author k.yamuna
   */
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.siLoanHistoryService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.collateralList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
          return { label: collateral.name, value: collateral.id }
      });
      this.getSiLoanHistoryByApplicationId(this.siLoanApplicationId);
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


