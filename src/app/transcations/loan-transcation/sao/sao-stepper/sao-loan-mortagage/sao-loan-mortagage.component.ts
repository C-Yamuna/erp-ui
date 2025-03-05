import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { LoanConfigConstants } from 'src/app/configurations/loan-config/loan-config-constants';
import { SaoLoanLandMortageDetailsService } from '../../../shared/sao-loans/sao-loan-land-mortage-details.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Table } from 'primeng/table';
import { CustomerLandSurveyDetails, SaoLoanLandMortageDetailsModel } from './shared/sao-loan-mortgage.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { MembershipBasicDetailsService } from '../membership-basic-details/shared/membership-basic-details.service';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { LandUom } from 'src/app/configurations/membership-config/membership-uom/shared/land-uom.model';

@Component({
  selector: 'app-sao-loan-mortagage',
  templateUrl: './sao-loan-mortagage.component.html',
  styleUrls: ['./sao-loan-mortagage.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class SaoLoanMortagageComponent {

  @ViewChild('dt', { static: false })
  private dt!: Table;
  landForm: FormGroup;
  selectcollateraltype: any;
  showgoldform: boolean = false;
  showlandform: boolean = false;
  showbondform: boolean = false;
  showstorageform: boolean = false;
  showothersform: boolean = false;
  buttonDisabled: boolean = false;
  carrats: any[] | undefined;
  admissionNumber: any;
  mortgageList: any[] = [];
  // gridList: any[] = [];
  msgs: any[] = [];
  addButton: boolean = false;
  editDeleteDisable: boolean = false;
  saveAndNextDisable: boolean = false;
  displayDialog: boolean = false;
  responseModel!: Responsemodel;
  loanId: any;
  isEdit: boolean = false;
  orgnizationSetting: any;
  uploadFileData: any;
  saoLoanApplicatonModel: SaoLoanApplication = new SaoLoanApplication();
  saoLoanLandMortageDetailsModel: SaoLoanLandMortageDetailsModel = new SaoLoanLandMortageDetailsModel();
  customerSurveyDetails: CustomerLandSurveyDetails = new CustomerLandSurveyDetails();
  statusList: any[] = [];
  deleteId: any;
  landMortgagePopUp: boolean = false;
  villagesList: any[] = [];
  landOwnershipsList: any[] = [];
  pacsId: any;
  branchId: any;

  landSurveyDetailsForm: any;
  passbookList: string[] = [];
  khatabookList: string[] = [];
  tempKhatabookList: any[] = [];
  tempPassbookList: any[] = [];
  uniquePassbookList: any[] = [];
  uniqueKhatabookList: any[] = [];
  gridListData: any[] = [];
  duplicatePassbookFlag: any;
  duplicateKhataPassbookFlag: any
  docFilesList: any[] = [];
  isFileUploaded: boolean = false;
  rowId: number = 0;
  totalLand: number = 0;
  totalLandCheck: boolean = false;
  beforeEditTotalLand: number = 0;
  selectedPassbookNumber: any;
  submitButtonDisabled: boolean = true;
  editSurveyData: boolean = false;
  tempSurveyList: any[] = [];
  deletedSurveyList: any[] = [];
  buttonsFlag: boolean = true;
  surveyId: any;
  landFlag: boolean = false;
  isEditDisable :boolean = false;
  uomModel: LandUom = new LandUom();
  measuringUnit: any;
  measuringSubUnit: any;
  columns: any[] = [];
  landSurveyDuplicateDisable: boolean = false;
  soilTypesList:  any[] = [];
  landTypesList: any[] = [];
  irrigationTypesList: any[] = [];


  constructor(private router: Router, private formBuilder: FormBuilder, private saoLoanLandMortageDetailsService: SaoLoanLandMortageDetailsService,
    private commonComponent: CommonComponent, private saoLoanApplicationService: SaoLoanApplicationService, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService, private membershipBasicDetailsService: MembershipBasicDetailsService, private datePipe: DatePipe,
    private fileUploadService: FileUploadService, private commonFunctionsService: CommonFunctionsService
  ) {
    this.landForm = this.formBuilder.group({
      'passbookNumber': new FormControl('', [Validators.required]),
      'khataNumber':new FormControl('', [Validators.required]),
      
    })
    this.landSurveyDetailsForm = this.formBuilder.group({
      'villageId': new FormControl('', Validators.required),
      'surveyNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'passbookNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'titleDeedNumber': new FormControl('', Validators.required),
      'totalLand': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS)]),
      'totalLandInSubUnits': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS)]),
      'cultivableLand': new FormControl('', Validators.required),
      'cultivableLandInSubUnits': new FormControl('', Validators.required),
      'underCultivationLand': new FormControl('', Validators.required),
      'underCultivationLandInSubUnits': new FormControl('', Validators.required),
      'soilType': new FormControl('', Validators.required),
      'landType': new FormControl('', Validators.required),
      'irrigationType': new FormControl('', Validators.required),
      'landOwnership': new FormControl('', Validators.required),
      'eastBoundary': new FormControl(''),
      'westBoundary': new FormControl(''),
      'northBoundary': new FormControl(''),
      'southBoundary': new FormControl(''),
      'acerValue': new FormControl('', Validators.required),
      'khataNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'isLandMortgage': new FormControl('',),
      // 'waterSourceId': new FormControl('', Validators.required),
    })
    this.columns = [
      { field: 'coveredVillagename', header: 'MEMBERSHIP_TRANSACTION.VILLAGE' },
      { field: 'passbookNumber', header: 'MEMBERSHIP_TRANSACTION.PASSBOOK_NO' },
      { field: 'khataNumber', header: 'MEMBERSHIP_TRANSACTION.KHATA_BOOK_NUMBER' },
      { field: 'surveyNumber', header: 'MEMBERSHIP_TRANSACTION.SURVEY_NO' },
      { field: 'totalLand', header: 'MEMBERSHIP_TRANSACTION.LAND_IN_ACRES' },
      { field: 'totalLandInSubUnits', header: 'MEMBERSHIP_TRANSACTION.LAND_IN_ACRES' },
      { field: 'landTypeName', header: 'MEMBERSHIP_TRANSACTION.LAND_TYPE' },
      { field: 'landOwnershipName', header: 'MEMBERSHIP_TRANSACTION.LAND_OWNERSHIP' },
      // { field: 'waterSourceName', header: 'MEMBERSHIP_TRANSACTION.SOURCE' },
    ];
    this.getMeasuringUnit();
  }
  ngOnInit() {
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.getAllandOwnerships();
    this.calculateTotalsCount();
    this.getAllSoilTypes();
    this.getAllLandTypes();
    this.getAllIrrigationTypes();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.statusList = this.commonComponent.status();
    this.mortgageList = [
      { label: "Yes", value: true },
      { label: "No", value: false }
    ];
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined ) {
        this.commonComponent.startSpinner();
        // if (params['admissionNumber'] != undefined) {
        //   this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNumber']);
        //   this.getMemberModuleDataByAdmissionNumber(this.admissionNumber);
        // }
        if (params['id'] != undefined) {
          this.loanId = Number(this.encryptDecryptService.decrypt(params['id']));
          this.isEdit = true;
          this.getSaoLoanApplicationDetailsById(this.loanId);
          this.getSaoLoanLandDetailsByApplicationId(this.loanId);
        }
      } else {
        this.isEdit = false;
      }
    })
    this.updateData();
  }

  updateData() {
    // if( this.gridListData != null &&  this.gridListData != undefined){
    //   this.saveAndNextDisable = false;
    // }else{
    //   this.saveAndNextDisable = true;
    // }

    this.saveAndNextDisable = !this.landForm.valid;
    if (this.isEditDisable != null) {
      this.saveAndNextDisable = this.isEditDisable;
    }

    this.saoLoanApplicationService.changeData({
      formValid: !this.landForm.valid ? true : false,
      data: this.saoLoanLandMortageDetailsModel,
      isDisable: this.saveAndNextDisable,
      // isDisable: (!this.landForm.valid),
      stepperIndex: 6,
    });
  }
  save() {
    this.updateData();
  }
  getSaoLoanApplicationDetailsById(id: any) {
    this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saoLoanApplicatonModel = this.responseModel.data[0];
        this.admissionNumber = this.saoLoanApplicatonModel.admissionNo;
        this.getMemberModuleDataByAdmissionNumber(this.admissionNumber);
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
  getAllIrrigationTypes() {
    //this.commonComponent.startSpinner();
    this.saoLoanLandMortageDetailsService.getAllIrrigationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.IRRIGATION_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.irrigationTypesList = this.responseModel.data.filter((obj: any) => obj.status == true).map((object: any) => {
          return { label: object.name, value: object.id }
        });
        //this.commonComponent.stopSpinner();
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      //this.commonComponent.stopSpinner();
    });
  }
 
  getAllSoilTypes() {
    this.commonComponent.startSpinner();
    this.saoLoanLandMortageDetailsService.getAllSoilTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.SOIL_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.soilTypesList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });

        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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
  getAllLandTypes() {
    this.commonComponent.startSpinner();
    this.saoLoanLandMortageDetailsService.getAllLandTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.LAND_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.landTypesList = this.responseModel.data.filter((obj: any) => obj.status == true).map((object: any) => {
          return { label: object.name, value: object.id }
        });
        this.commonComponent.stopSpinner();
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getAllCoveredVillages() {
    this.commonComponent.startSpinner();
    this.saoLoanLandMortageDetailsService.getAllCoveredVillagesByPacId(this.pacsId).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.COVERD_VILLAGES_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.villagesList = this.responseModel.data.filter((village: any) => village.status == applicationConstants.TRUE).map((count: any) => {
          return { label: count.villageName, value: count.id, villageId: count.villageId }
        });
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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
  getAllandOwnerships() {
    this.commonComponent.startSpinner();
    this.saoLoanLandMortageDetailsService.getAllLandownershipTypes().subscribe(response => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.landOwnershipsList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
          return { label: landType.name, value: landType.id };
        });
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
  }
  getMeasuringUnit() {
    this.saoLoanLandMortageDetailsService.getMeasuringUnit().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.uomModel = this.responseModel.data[0];
        this.measuringUnit = this.uomModel.measuringUnit;
        this.measuringSubUnit = this.uomModel.measuringSubUnit;

      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  //get member details from membership module
  getMemberModuleDataByAdmissionNumber(admissionNumber: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.saoLoanLandMortageDetailsModel = this.responseModel.data[0].memberShipLandDetailsDTO;
          this.saoLoanLandMortageDetailsModel.passbookNumber = this.responseModel.data[0].memberShipLandDetailsDTO.passbookNumber;
          this.saoLoanLandMortageDetailsModel.khataNumber = this.responseModel.data[0].memberShipLandDetailsDTO.khataNumber;
          this.saoLoanLandMortageDetailsModel.uploadFilePath = this.responseModel.data[0].memberShipLandDetailsDTO.uploadFilePath;
         
          this.gridListData = this.saoLoanLandMortageDetailsModel.custLandSurveyDetails;
        }
        this.getSaoLoanLandDetailsByApplicationId(this.loanId);
      }
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });

  }
  getSaoLoanLandDetailsByApplicationId(loanId: any) {
    // this.editDeleteDisable = true;
    this.saoLoanLandMortageDetailsService.getLandDetailsBySaoLoanApplicationId(loanId).subscribe(res => {
      this.responseModel = res;
      this.saoLoanLandMortageDetailsModel = this.responseModel.data;
      // if(this.saoLoanLandMortageDetailsModel.admissionNumber != null && this.saoLoanLandMortageDetailsModel.admissionNumber !=undefined)
      //   this.getMemberModuleDataByAdmissionNumber(this.saoLoanLandMortageDetailsModel.admissionNumber);
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.saoLoanLandMortageDetailsModel.preMemAdmissionDate = this.datePipe.transform(this.saoLoanLandMortageDetailsModel.preMemAdmissionDate, 'dd/MM/yyyy');
        this.saoLoanLandMortageDetailsModel.admissionDate = this.datePipe.transform(this.saoLoanLandMortageDetailsModel.admissionDate, 'dd/MM/yyyy');
        // this.getAllMembershipDetails();
        if (this.saoLoanLandMortageDetailsModel.uploadFilePath != undefined && null != this.saoLoanLandMortageDetailsModel.uploadFilePath) {
          this.isFileUploaded = applicationConstants.FALSE;
          let docFileList = [];
          let file = new FileUploadModel();
          file.imageValue = ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoLoanLandMortageDetailsModel.uploadFilePath;
          let objects = this.saoLoanLandMortageDetailsModel.uploadFilePath.split('.');
          file.fileType = objects[objects.length - 1];
          let name = this.saoLoanLandMortageDetailsModel.uploadFilePath.replace(/ /g, "_");
          file.fileName = name
          docFileList.push(file);
          this.docFilesList = docFileList;
        }
        if (null != this.saoLoanLandMortageDetailsModel.custLandSurveyDetails) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.passbookList = [];
            this.khatabookList = [];
            this.tempPassbookList = [];
            this.uniquePassbookList = [];
            this.uniqueKhatabookList = [];
            this.gridListData = this.saoLoanLandMortageDetailsModel.custLandSurveyDetails;
            this.gridListData.map(object => {
              this.rowId = this.rowId + 1;
              object.rowId = this.rowId;
              this.totalLand = this.totalLand + object.totalLand;
              if (this.uniquePassbookList.length == 0) {
                this.uniquePassbookList.push(object.passbookNumber);
              } else {
                if (this.uniquePassbookList.indexOf(object.passbookNumber) === -1) {
                  this.uniquePassbookList.push(object.passbookNumber);
                }

              }
              if (this.uniqueKhatabookList.length == 0) {
                this.uniqueKhatabookList.push(object.khataNumber);
              } else {
                if (this.uniqueKhatabookList.indexOf(object.khataNumber) === -1) {
                  this.uniqueKhatabookList.push(object.khataNumber);
                }

              }
            });
            if (null != this.uniquePassbookList && undefined != this.uniquePassbookList && this.uniquePassbookList.length > 0) {
              this.selectedPassbookNumber = null;
              this.uniquePassbookList.filter(obj => null != obj).map(object => {
                this.passbookList.push(object);
                this.tempPassbookList.push(object);
              });

              this.uniqueKhatabookList.filter(obj => null != obj).map(object => {
                this.khatabookList.push(object);
                this.tempKhatabookList.push(object);
              });
            }
            // this. checkAddButtonState();
            if (this.totalLand >= 20) {
              this.totalLandCheck = true;
            } else {
              this.totalLandCheck = false;
            }
            this.calculateTotalsCount();
            this.tempSurveyList = this.gridListData.map(x => Object.assign({}, x));
            this.submitButtonDisabled = applicationConstants.FALSE;
          }

        }
      } else {
        this.commonComponent.stopSpinner();
        this.buttonDisabled = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }

    });
  }
   checkDuplicateSurveyNoInTable(customerSurveyDetails: any) {
      if (null != customerSurveyDetails && undefined != customerSurveyDetails) {
        let obj = [];
        if (this.tempSurveyList != undefined && this.tempSurveyList != null && this.tempSurveyList.length != 0) {
          obj = this.tempSurveyList.filter(obj => (obj.khataNumber == customerSurveyDetails.khataNumber) && (obj.surveyNumber == customerSurveyDetails.surveyNumber)
            && (obj.villageId == customerSurveyDetails.villageId)).map(object => {
              return object;
            });
        }
        if (obj.length > 0 && obj[0].rowId != this.surveyId) {
          this.landSurveyDuplicateDisable = true;
          this.landSurveyDetailsForm.get("surveyNumber").reset();
          this.msgs = [];
          this.msgs = [{ severity: "error", detail: applicationConstants.SURVEY_NUMBER_ALREADY_EXIST }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
  
        } else {
          this.landSurveyDuplicateDisable = false;
        }
        this.surveyId = 0;
      }
  
    }
   
  addOrUpdateLandDetails(rowData: any) {
    this.landMortgagePopUp = false;
    this.addButton = false;
    this.editDeleteDisable = false;
    rowData.pacsId = this.pacsId;
    rowData.saoLoanApplicationId = this.loanId;
    rowData.filesDTOList = this.saoLoanLandMortageDetailsModel.filesDTO;
    rowData.documentPath = this.saoLoanLandMortageDetailsModel.uploadFilePath;

    this.saoLoanLandMortageDetailsModel = rowData;
    this.saoLoanLandMortageDetailsModel.admissionNumber = this.saoLoanApplicatonModel.admissionNo;
    // this.saoLoanLandMortageDetailsModel.mortgageDeedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanLandMortageDetailsModel.mortgageDeedDateVal));
    if (rowData.id != undefined) {
      this.saoLoanLandMortageDetailsService.updateSaoLoanLandMortageDetails(this.saoLoanLandMortageDetailsModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.saoLoanLandMortageDetailsModel = this.responseModel.data;
              this.addButton = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getSaoLoanLandDetailsByApplicationId(this.loanId);
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
    } else {
      this.saoLoanLandMortageDetailsModel.status = applicationConstants.ACTIVE;
      this.saoLoanLandMortageDetailsService.addSaoLoanLandMortageDetails(this.saoLoanLandMortageDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.saoLoanLandMortageDetailsModel = this.responseModel.data;
              this.addButton = false;
              this.getSaoLoanLandDetailsByApplicationId(this.loanId);
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
  }
  addData() {
    this.landMortgagePopUp = true;
    this.saoLoanLandMortageDetailsModel = new SaoLoanLandMortageDetailsModel();
    this.addButton = true;
    this.editDeleteDisable = true;
    this.updateData();

  }

  editLandLoanMortgage(rowData: any) {
    this.landMortgagePopUp = true;
    this.addButton = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.saoLoanLandMortageDetailsService.getSaoLoanLandMortageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.saoLoanLandMortageDetailsModel = this.responseModel.data[0];
            // this.saoLoanLandMortageDetailsModel.mortgageDeedDateVal = this.datePipe.transform(this.saoLoanLandMortageDetailsModel.mortgageDeedDate, this.orgnizationSetting.datePipe);
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
 

  deletDilogBox(rowData: any) {
    this.displayDialog = true;
    this.deleteId = rowData.id;
  }
  submitDelete() {
    this.displayDialog = false;
    this.saoLoanLandMortageDetailsService.deleteSaoLoanLandMortageDetails(this.deleteId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.loanId != null && this.loanId != undefined) {
          this.getSaoLoanLandDetailsByApplicationId(this.loanId);
        }

      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  cancelForDialogBox() {
    this.displayDialog = false;
  }
  displayDialogBox() {
      this.getMeasuringUnit();
      this.buttonsFlag = false;
      this.landFlag = false
      this.updateData();
      this.isEditDisable = true;
      this.customerSurveyDetails = new CustomerLandSurveyDetails();
      this.displayDialog = true;
      this.landSurveyDetailsForm.reset();
    }
  
    navigateToLandDetails() {
      this.displayDialog = applicationConstants.FALSE;
      this.isEditDisable = false;
      this.buttonsFlag = true;
      this.landFlag = true;;
      this.updateData();
      this.gridListData = this.tempSurveyList.map(x => Object.assign({}, x));
    }
  handleAdd(event: any) {
    if (null != event.value && undefined != event.value && event.value != "") {
      const check = this.tempPassbookList.includes(event.value);
      if (check) {
        this.passbookList = [];
        this.tempPassbookList.map(object => {
          this.passbookList.push(object);
          this.msgs = [{ severity: 'error', detail: applicationConstants.PASSBOOK_ALREADY_EXITS_IN_SURVEY }];
          setTimeout(() => {
            this.msgs = [];
          }, 2500);
        });

      } else {
        this.tempPassbookList.push(event.value);
        this.checkPassbookNumberInDb(event.value);
      }

    }
  }
  handleKhataNumberAdd(event: any) {
    if (null != event.value && undefined != event.value && event.value != "") {
      const check = this.tempKhatabookList.includes(event.value);
      if (check) {
        this.khatabookList = [];
        this.tempKhatabookList.map(object => {
          this.khatabookList.push(object);
          this.msgs = [{ severity: 'error', detail: applicationConstants.KHATA_ALREADY_EXITS_IN_SURVEY }];
          setTimeout(() => {
            this.msgs = [];
          }, 2500);
        });

      } else {
        this.tempKhatabookList.push(event.value);
        // this.checkKhataNumberInDb(event.value);
      }
    }
    // this.checkAddButtonState();
  }
  checkPassbookNumberInDb(passbookNumber: any) {
    //this.commonComponent.startSpinner();
    this.saoLoanLandMortageDetailsService.checkPassbookNumberInDb(passbookNumber).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

        if (null != this.responseModel.data && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.passbookList = [];
          this.tempPassbookList.map(object => {
            this.passbookList.push(object);
          });
          this.msgs = [{ severity: 'error', detail: applicationConstants.PASSBOOK_ALREADY_EXITS_IN_SURVEY }];
          this.addButton = applicationConstants.TRUE;
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.tempPassbookList.push(passbookNumber);
        }
        //this.commonComponent.stopSpinner();
      }
    },
      error => {
        this.msgs = [];
        //this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  handleRemove(event: any) {
    if (null != event.value && undefined != event.value && event.value != "") {

      this.duplicatePassbookFlag = applicationConstants.FALSE;
      this.gridListData.filter(obj => obj.passbookNumber == event.value).map(object => {
        this.duplicatePassbookFlag = applicationConstants.TRUE;
      });
      if (this.duplicatePassbookFlag) {
        this.passbookList.push(event.value);
        this.msgs = [{ severity: 'error', detail: applicationConstants.PASSBOOK_CANNOT_BE_REMOVED_PASSBOOK_ALREADY_EXITS_IN_SURVEY }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }

      this.tempPassbookList = [];
      this.passbookList.map(object => {
        this.tempPassbookList.push(object);
      });

    }
    this.getSaoLoanLandDetailsByApplicationId(this.loanId);
  }

  handleKhatabookRemove(event: any) {
    if (null != event.value && undefined != event.value && event.value != "") {

      this.duplicateKhataPassbookFlag = applicationConstants.FALSE;
      this.gridListData.filter(obj => obj.khataNumber == event.value).map(object => {
        this.duplicateKhataPassbookFlag = applicationConstants.TRUE;
      });
      if (this.duplicateKhataPassbookFlag) {
        this.khatabookList.push(event.value);
        this.msgs = [{ severity: 'error', detail: applicationConstants.KHATA_NUMBER_CANNOT_BE_REMOVED_KHATA_NUMBER_ALREADY_EXITS_IN_SURVEY }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.tempKhatabookList = [];
      this.khatabookList.map(object => {
        this.tempKhatabookList.push(object);
      });
    }
    this.getSaoLoanLandDetailsByApplicationId(this.loanId);
  }

  /**
  * @implements file upload service
  * @param event
  * @param fileUpload
  * @author akhila.m
  */
  docUploader(event: any, uploader: FileUpload) {
    this.docFilesList = [];
    this.saoLoanLandMortageDetailsModel.filesDTO = null;
    this.saoLoanLandMortageDetailsModel.uploadFilePath = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        let index = this.docFilesList.findIndex(x => x.fileName == files.fileName);
        if (index == -1) {
          this.docFilesList.push(files);
          for (let fileData of this.docFilesList) {
            this.saoLoanLandMortageDetailsModel.filesDTO = fileData;
            this.saoLoanLandMortageDetailsModel.uploadFilePath = this.saoLoanLandMortageDetailsModel.filesDTO.fileName;
          }
        }
        // this.fileFlag = true;
        // this.groupUpdateData();
        this.isFileUploaded = applicationConstants.FALSE;
        let index1 = event.files.findIndex((x: any) => x == file);
        uploader.remove(event, index1);
        uploader.clear();
      }
      reader.readAsDataURL(file);
    }

  }

  /**
   * @implements onFileremove from file value
   * @author akhila.m
   */
  fileRemoeEvent() {
    if (this.saoLoanLandMortageDetailsModel.filesDTO != null && this.saoLoanLandMortageDetailsModel.filesDTO != undefined && this.saoLoanLandMortageDetailsModel.filesDTO.length > 0) {
      let removeFileIndex = this.saoLoanLandMortageDetailsModel.filesDTO.findIndex((obj: any) => obj && obj.fileName === this.saoLoanLandMortageDetailsModel.uploadFilePath);
      this.saoLoanLandMortageDetailsModel.filesDTO[removeFileIndex] = null;
      this.saoLoanLandMortageDetailsModel.uploadFilePath = null;
    }
  }
 
   addOrUpdate(rowData: any) {
      this.commonComponent.startSpinner();
      rowData.statusName = CommonStatusData.CREATED;
      rowData.activeStatus = applicationConstants.TRUE;
      rowData.pacsId = this.pacsId;
      rowData.branchId = this.branchId;
      rowData.saoLoanApplicationId = this.loanId;
      rowData.filesDTOList = this.saoLoanLandMortageDetailsModel.filesDTO;
      rowData.documentPath = this.saoLoanLandMortageDetailsModel.uploadFilePath;
      rowData.status = applicationConstants.ACTIVE;
      this.saoLoanLandMortageDetailsModel = rowData;
      this.saoLoanLandMortageDetailsModel.admissionNumber = this.saoLoanApplicatonModel.admissionNo;
      if (rowData.id != undefined && rowData.id != null) {
        if (null != this.deletedSurveyList && this.deletedSurveyList.length > 0) {
          this.deletedSurveyList.map(object => {
            this.customerSurveyDetails = object;
            this.tempSurveyList.push(this.customerSurveyDetails);
          });
        }
        // rowData.isLandMortgage = applicationConstants.YES;
        rowData.custLandSurveyDetails = this.tempSurveyList;
        this.saoLoanLandMortageDetailsService.updateSaoLoanLandMortageDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          this.buttonsFlag = true;
          this.landFlag = true;;
          this.updateData();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
            setTimeout(() => {
              if (status) {
                // this.navigateToBack();
              } else {
                // this.resetFormData();
              }
              this.msgs = [];
            }, 500);
          } else {
            this.commonComponent.stopSpinner();
            this.submitButtonDisabled = applicationConstants.TRUE;
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
          this.getSaoLoanLandDetailsByApplicationId(this.loanId);
        },
          error => {
            this.submitButtonDisabled = applicationConstants.TRUE;
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          });
      } else {
  
        rowData.capturedBy = this.commonFunctionsService.getStorageValue(applicationConstants.userId);
        rowData.capturedOn = this.commonFunctionsService.getUTCEpoch(new Date());
  
        if (null != this.deletedSurveyList && this.deletedSurveyList.length > 0) {
          this.gridListData.push(this.deletedSurveyList);
        }
        rowData.custLandSurveyDetails = this.gridListData;
        // rowData.isNew = applicationConstants.YES;
        //   this.saoLoanLandMortageDetailsModel.admissionNumber = this.saoLoanLandMortageDetailsModel.concatinatedAdmissionNumber;
        this.saoLoanLandMortageDetailsService.addSaoLoanLandMortageDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.buttonsFlag = true;
            this.landFlag = true;;
            this.updateData();
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              if (status) {
                // this.navigateToBack();
              } else {
                // this.resetFormData();
              }
              this.msgs = [];
            }, 500);
          } else {
            this.submitButtonDisabled = applicationConstants.TRUE;
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
          this.getSaoLoanLandDetailsByApplicationId(this.loanId);
        },
          error => {
            this.commonComponent.stopSpinner();
            this.submitButtonDisabled = applicationConstants.TRUE;
            this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
  
          });
      }
    }
  
    editSurveyLandDetails(rowData: any) {
      this.editSurveyData = true;
      this.displayDialog = true;
      this.isEditDisable = true;
      this.buttonsFlag  = false;
      this.landFlag =false
      this.updateData();
      this.customerSurveyDetails = rowData;
      this.surveyId = this.customerSurveyDetails.rowId;
      this.beforeEditTotalLand = this.customerSurveyDetails.totalLand;
      //  this.customerSurveyDetails = rowData;
    }
  
    deleteSurveyLandDetails(rowData: any) {
      let index = this.gridListData.findIndex(object => object.rowId == rowData.rowId);
      if (null != rowData.id) {
        this.gridListData.filter(obj => obj.rowId == rowData.rowId).map(object => {
          object.status = this.statusList[1].value;
          this.deletedSurveyList.push(object)
        });
        this.gridListData.splice(index, 1);
        this.tempSurveyList = this.gridListData.map(x => Object.assign({}, x));
      } else {
        this.gridListData.splice(index, 1);
        this.tempSurveyList = this.gridListData.map(x => Object.assign({}, x));
      }
      this.calculateTotalsCount();
    }
    calculateTotalsCount() {
      if (null != this.gridListData && this.gridListData.length > 0) {
        this.saoLoanLandMortageDetailsModel.totalLandInAcres = Number(0);
        this.saoLoanLandMortageDetailsModel.totalCultivableLandInAcres = Number(0);
        this.saoLoanLandMortageDetailsModel.totalUnderCultivationLandInAcres = Number(0);
        this.gridListData.filter(obj => null != obj.totalLand && null != obj.cultivableLand && null != obj.underCultivationLand).map(object => {
          this.saoLoanLandMortageDetailsModel.totalLandInAcres = this.saoLoanLandMortageDetailsModel.totalLandInAcres + Number(object.totalLand);
          this.saoLoanLandMortageDetailsModel.totalCultivableLandInAcres = this.saoLoanLandMortageDetailsModel.totalCultivableLandInAcres + Number(object.cultivableLand);
          this.saoLoanLandMortageDetailsModel.totalUnderCultivationLandInAcres = this.saoLoanLandMortageDetailsModel.totalUnderCultivationLandInAcres + Number(object.underCultivationLand);
        });
      } else {
        this.saoLoanLandMortageDetailsModel.totalLandInAcres = Number(0);
        this.saoLoanLandMortageDetailsModel.totalCultivableLandInAcres = Number(0);
        this.saoLoanLandMortageDetailsModel.totalUnderCultivationLandInAcres = Number(0);
      }
      this.totalLand = this.saoLoanLandMortageDetailsModel.totalLandInAcres;
    }
    masterCoveredVillage(coveredVillageId: any) {
      if (this.villagesList != null && this.villagesList != undefined) {
        let village = this.villagesList.find(village => village.value === coveredVillageId);
        if (village) {
          this.customerSurveyDetails.masterVillageId = village.villageId;
          // this.customerSurveyDetails.villageName = village.label;
          // this.customerSurveyDetails.coveredVillagename = village.label;
  
        }
      }
  
    }
    submitsurveyDetails() {
      this.isEditDisable = false;
      this.masterCoveredVillage(this.customerSurveyDetails.villageId);
     
      if (null != this.customerSurveyDetails && null != this.customerSurveyDetails.villageId) {
        this.villagesList.filter(obj => obj.value == this.customerSurveyDetails.villageId).map(object => {
          this.customerSurveyDetails.coveredVillagename = object.label
        });
      }
      if (null != this.saoLoanLandMortageDetailsModel.saoLoanApplicationId) {
        this.customerSurveyDetails.loanId = this.saoLoanLandMortageDetailsModel.saoLoanApplicationId;
      }
      if (this.editSurveyData) {
        this.gridListData.filter(obj => obj.rowId == this.customerSurveyDetails.rowId).map(object => {
          object = this.customerSurveyDetails;
        });
        this.totalLand = (Number(this.totalLand) - Number(this.beforeEditTotalLand)) + Number(this.customerSurveyDetails.totalLand);
        this.tempSurveyList = this.gridListData.map(x => Object.assign({}, x));
        this.editSurveyData = false;
      } else {
        this.rowId = this.rowId + 1;
        this.customerSurveyDetails.rowId = this.rowId;
        this.totalLand = Number(this.totalLand) + Number(this.customerSurveyDetails.totalLand);
        // this.customerSurveyDetails.status = this.statusList[0].value;
        this.gridListData.push(this.customerSurveyDetails);
        // this.tempSurveyList.push(this.customerSurveyDetails);
        this.tempSurveyList = this.gridListData.map(x => Object.assign({}, x));
      }
      this.submitButtonDisabled = applicationConstants.FALSE;
      this.displayDialog = applicationConstants.FALSE;
  
  
      if (this.totalLand >= 20) {
        this.totalLandCheck = true;
      } else {
        this.totalLandCheck = false;
      }
      this.calculateTotalsCount();
      this.addOrUpdate(this.saoLoanLandMortageDetailsModel);
    }
  getLandAndSurveyDetails() {
      let memAdmissionNumber = this.saoLoanLandMortageDetailsModel.concatinatedAdmissionNumber;
      let memberName = this.saoLoanLandMortageDetailsModel.memName;
      let memId = this.saoLoanLandMortageDetailsModel.saoLoanApplicationId;
      let villageName = this.saoLoanLandMortageDetailsModel.villageName;
      let fatherOrSpouseName = this.saoLoanLandMortageDetailsModel.fatherOrSpousename;
      let admDate = this.saoLoanLandMortageDetailsModel.admissionDate;
      //this.commonComponent.startSpinner();
      this.saoLoanLandMortageDetailsService.getLandDetailsByApplicationIdAndPacsId(this.saoLoanLandMortageDetailsModel.saoLoanApplicationId, this.pacsId, this.branchId).subscribe(res => {
        this.responseModel = res;
        //this.commonComponent.stopSpinner();
  
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (null != this.responseModel.data[0]) {
            this.saoLoanLandMortageDetailsModel = this.responseModel.data[0];
            this.saoLoanLandMortageDetailsModel.preMemAdmissionDate = this.datePipe.transform(this.saoLoanLandMortageDetailsModel.preMemAdmissionDate, 'dd/MM/yyyy');
          } else {
            this.saoLoanLandMortageDetailsModel = new SaoLoanLandMortageDetailsModel();
          }
  
          this.loanId = this.saoLoanLandMortageDetailsModel.id;
          this.saoLoanLandMortageDetailsModel.concatinatedAdmissionNumber = memAdmissionNumber;
          this.saoLoanLandMortageDetailsModel.memName = memberName;
          this.saoLoanLandMortageDetailsModel.saoLoanApplicationId = memId;
          this.saoLoanLandMortageDetailsModel.villageName = villageName;
          this.saoLoanLandMortageDetailsModel.fatherOrSpousename = fatherOrSpouseName;
          this.saoLoanLandMortageDetailsModel.admissionDate = admDate;
  
          if (this.saoLoanLandMortageDetailsModel.uploadFilePath != undefined && null != this.saoLoanLandMortageDetailsModel.uploadFilePath) {
            let docFileList = [];
            let file = new FileUploadModel();
            file.imageValue = ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoLoanLandMortageDetailsModel.uploadFilePath;
            let objects = this.saoLoanLandMortageDetailsModel.uploadFilePath.split('.');
            file.fileType = objects[objects.length - 1];
            let name = this.saoLoanLandMortageDetailsModel.uploadFilePath.replace(/ /g, "_");
            file.fileName = name
            docFileList.push(file);
            this.docFilesList = docFileList;
          }
  
          if (null != this.saoLoanLandMortageDetailsModel.custLandSurveyDetails && this.saoLoanLandMortageDetailsModel.custLandSurveyDetails != undefined
            && this.saoLoanLandMortageDetailsModel.custLandSurveyDetails.length > 0) {
            this.gridListData = this.saoLoanLandMortageDetailsModel.custLandSurveyDetails;
            this.passbookList = [];
            this.khatabookList = [];
            this.tempPassbookList = [];
            this.uniquePassbookList = [];
            this.gridListData.map(object => {
              this.rowId = this.rowId + 1;
              object.rowId = this.rowId;
  
              if (this.uniquePassbookList.length == 0) {
                this.uniquePassbookList.push(object.passbookNumber);
              } else {
                if (this.uniquePassbookList.indexOf(object.passbookNumber) === -1) {
                  this.uniquePassbookList.push(object.passbookNumber);
                }
              }
              if (this.uniqueKhatabookList.length == 0) {
                this.uniqueKhatabookList.push(object.khataNumber);
              } else {
                if (this.uniqueKhatabookList.indexOf(object.khataNumber) === -1) {
                  this.uniqueKhatabookList.push(object.khataNumber);
                }
              }
            });
  
            if (null != this.uniquePassbookList && undefined != this.uniquePassbookList && this.uniquePassbookList.length > 0) {
              this.selectedPassbookNumber = null;
              this.uniquePassbookList.filter(obj => null != obj).map(object => {
                this.passbookList.push(object);
                this.tempPassbookList.push(object);
              });
            }
            if (null != this.uniqueKhatabookList && undefined != this.uniqueKhatabookList && this.uniqueKhatabookList.length > 0) {
              this.selectedPassbookNumber = null;
              this.uniqueKhatabookList.filter(obj => null != obj).map(object => {
                this.khatabookList.push(object);
                this.tempKhatabookList.push(object);
              });
            }
            // this.checkAddButtonState();
            this.calculateTotalsCount();
            this.tempSurveyList = this.saoLoanLandMortageDetailsModel.custLandSurveyDetails.map((x: any) => Object.assign({}, x));
            this.submitButtonDisabled = applicationConstants.FALSE;
          } else {
            this.tempSurveyList = [];
            this.gridListData = [];
          }
        } else {
          this.submitButtonDisabled = applicationConstants.TRUE;
          //this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },
        error => {
          //this.commonComponent.stopSpinner();
          this.submitButtonDisabled = applicationConstants.TRUE;
          this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
  
        });
    }
}
