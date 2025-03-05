import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemInstitutionDetails, MembershipBasicDetails, MembershipGroupDetails } from '../../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../../ci-product-details/shared/ci-loan-application.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { CiLoanGenealogyTree } from '../../ci-loan-genealogy-tree/shared/ci-loan-genealogy-tree.model';
import { CiLoanApplicationService } from '../../ci-product-details/shared/ci-loan-application.service';
import { CiLoanHistory } from '../shared/ci-loan-history';
import { CiLoanHistoryService } from '../shared/ci-loan-history.service';

@Component({
  selector: 'app-ci-loan-history',
  templateUrl: './ci-loan-history.component.html',
  styleUrls: ['./ci-loan-history.component.css']
})
export class CiLoanHistoryComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;

  ciHistoryForm: FormGroup;

  checked: boolean = false;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  relationshipTypesList: any[] = [];
  isMemberCreation: boolean = false;
  ciLoanApplicationId: any;
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
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciLoanHistory: CiLoanHistory = new CiLoanHistory();

  admissionNumber: any;
  saveAndNextDisable: boolean = false;
  grenealogyTreeId: any;
  displayDialog: boolean = false;
  historyColumns: { field: string; header: string; }[];
  loanExistedId: any;
  ciLoanHistoryList: any[] = [];
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
    private ciLoanHistoryService: CiLoanHistoryService, private ciLoanApplicationService: CiLoanApplicationService
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

    this.ciHistoryForm = this.formBuilder.group({
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
        this.ciLoanApplicationId = Number(id);
        this.isEdit = true;
        
        this.getCiLoanApplicationsById(this.ciLoanApplicationId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    });
    this.ciHistoryForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.ciHistoryForm.valid) {
        this.save();
      }
    });
  }

  save() {
    this.updateData();
  }

  updateData() {
    //list check if list empty save next should be in desable mode
    if (this.ciLoanHistoryList == null || this.ciLoanHistoryList == undefined || this.ciLoanHistoryList.length == 0) {
      this.saveAndNextDisable = true;
    }
    else {
      this.saveAndNextDisable = false;
    }
    if (this.addButtonService) {
      this.saveAndNextDisable = true;
    }
    this.ciLoanHistory.accId = this.ciLoanApplicationId;
    this.ciLoanApplicationService.changeData({
      formValid: this.ciHistoryForm.valid,
      data: this.ciLoanHistory,
      // isDisable: this.saveAndNextDisable,
      isDisable: this.addButtonService,
      stepperIndex: 9,
    });
  }


  /**
   * @implements get ci Loan History by Application Id
   * @param ciLoanApplicationId 
   * @author jyothi.naidana
   */
  getCiLoanHistoryByApplicationId(ciLoanApplicationId: any) {
    this.commonFunctionsService
    this.ciLoanHistoryService.getCiLoanExistedDetailsByApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciLoanHistoryList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((history: any) => {
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
   * @implements get ci Loan application by id
   * @param ciLoanApplicationId 
   * @author jyothi.naidana
   */
  getCiLoanApplicationsById(ciLoanApplicationId: any) {
    this.commonFunctionsService
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciLoanApplicationModel = this.responseModel.data[0];
            this.admissionNumber = this.responseModel.data[0].admissionNo;
            if (this.ciLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.ciLoanApplicationModel.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
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
   * @author jyothi.naidana
   */
  addHistory() {
    this.ciLoanHistory = new CiLoanHistory();
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
   * @author jyothi.naidana
   */
  saveLoanHistory(row: any) {
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.ciLoanHistory = row;
    this.ciLoanHistoryList = [];
    row.accId = this.ciLoanApplicationId;
    row.admissionNumber = this.ciLoanApplicationModel.admissionNo;
    if(row.openingDateVal != null && row.openingDateVal != undefined){
      this.ciLoanHistory.openingDate = this.ciLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.openingDateVal);
    }
    if(row.closingDateVal != null && row.closingDateVal != undefined){
      this.ciLoanHistory.closingDate = this.ciLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpochWithTime(row.closingDateVal);
    }
    this.ciLoanHistory.status = applicationConstants.ACTIVE;
    if (row.id != null && row.id != undefined) {
      this.ciLoanHistoryService.updateCiLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.ciLoanHistory = this.responseModel.data;
              if (this.responseModel.data[0].accId != null && this.responseModel.data[0].accId != undefined) {
                this.getCiLoanHistoryByApplicationId(this.responseModel.data[0].accId);
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
            this.getCiLoanHistoryByApplicationId(this.ciLoanApplicationId);
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
      this.ciLoanHistoryService.addCiLoanExistedDetails(row).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.ciLoanHistory = this.responseModel.data;
              if (this.responseModel.data[0].accId != null && this.responseModel.data[0].accId != undefined) {
                this.getCiLoanHistoryByApplicationId(this.responseModel.data[0].accId);
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
            this.getCiLoanHistoryByApplicationId(this.ciLoanApplicationId);
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
   * @author jyothi.naidana
   */
  cancelHistory() {
    this.ciLoanHistoryList = [];
    this.addButtonService = false;
    this.editDeleteDisable = false;
    this.getCiLoanHistoryByApplicationId(this.ciLoanApplicationId);
  }

  /**
   * @implements edit History
   * @param rowData 
   * @author jyothi.naidana
   */
  editHistory(rowData: any) {
    this.addButtonService = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.ciLoanHistoryService.getCiLoanExistedDetails(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.ciLoanHistory = this.responseModel.data[0];
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
   * @author jyothi.naidana
   */
  delete(row: any) {
    this.historyId = row.id;
    this.displayDialog = true;
  }


  /**
   * @implements submit delete
   * @author jyothi.naidana
   */
  submitDelete() {
    this.ciLoanHistoryService.deleteCiLoanExistedDetails(this.historyId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.displayDialog = false;
        this.getCiLoanHistoryByApplicationId(this.ciLoanApplicationId);
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
   * @author jyothi.naidana
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**
   * @implements get all collateral
   * @author jyothi.naidana
   */
  getAllCollaterals() {
    this.msgs = [];
    this.commonComponent.startSpinner();
    this.ciLoanHistoryService.getAllCollateralTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null&& this.responseModel.data!= undefined) {
        this.collateralList = this.responseModel.data.filter((data: any) => data.status == applicationConstants.ACTIVE).map((collateral: any) => {
          return { label: collateral.name, value: collateral.id }
      });
      this.getCiLoanHistoryByApplicationId(this.ciLoanApplicationId);
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
