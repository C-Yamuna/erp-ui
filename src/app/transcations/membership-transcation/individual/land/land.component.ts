import { MembershipLandDetailsService } from './../../shared/membership-land-details.service';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Table } from "primeng/table";
import { SoilTypesService } from "src/app/configurations/membership-config/membership-soil-types/shared/soil-types.service";
import { applicationConstants } from "src/app/shared/applicationConstants";
import { CommonComponent } from "src/app/shared/common.component";
import { EncryptDecryptService } from "src/app/shared/encrypt-decrypt.service";
import { Responsemodel } from "src/app/shared/responsemodel";
import { MemberLandDetailsModel, MemberBasicDetails, CustomerLandSurvyDetailsModel } from "../../shared/member-basic-details.model";
import { MembershipBasicDetailsService } from "../../shared/membership-basic-details.service";
import { MemberBasicDetailsStepperService } from "../shared/membership-individual-stepper.service";
import { OperatorTypeService } from 'src/app/configurations/common-config/operator-type/shared/operator-type.service';
import { WaterSourceTypesService } from 'src/app/configurations/membership-config/membership-water-source-types/shared/water-source-types.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { LandUom } from 'src/app/configurations/membership-config/membership-uom/shared/land-uom.model';
import { DatePipe } from '@angular/common';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { DistrictService } from 'src/app/configurations/common-config/district/shared/district.service';
import { StatesService } from 'src/app/configurations/common-config/state/shared/states.service';
import { VillagesService } from 'src/app/configurations/common-config/villages/shared/villages.service';
import { CoveredVillagesService } from 'src/app/configurations/common-config/covered-villages/shared/covered-villages.service';
import { SubDistrictService } from 'src/app/configurations/common-config/sub-district/shared/sub-district.service';

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class LandComponent {
  customerLandDetailsForm: FormGroup;
  landSurveyDetailsForm: any;
  customerLandDetails: MemberLandDetailsModel = new MemberLandDetailsModel();
  customerSurveyDetails: CustomerLandSurvyDetailsModel = new CustomerLandSurvyDetailsModel();
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  displayDialog: boolean = false;
  landSurveySubmitDisable: boolean = false;
  analyzerCount: number = 0;
  visibleAnalayserSideBar: boolean = false;
  msgs: any[] = [];
  columns: any[] = [];
  statesList: any[] = [];
  soilTypesList: any[] = [];
  landTypesList: any[] = [];
  irrigationTypesList: any[] = [];
  landOwnershipsList: any[] = [];
  villagesList: any[] = [];
  subDistrictsList: any[] = [];
  districtsList: any[] = [];
  gridListData: any[] = [];
  membershipList: any[] = [];
  admissionNumberList: any[] = [];
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  submitButtonDisabled: boolean = true;
  editSurveyData: boolean = false;
  tempSurveyList: any[] = [];
  statusList: any[] = [];
  isEdit: any;
  rowId: number = 0;
  deletedSurveyList: any[] = [];
  deletedIndex: number = 1;
  societyId: any;
  societyCode: any;
  landDetailsListData: any[] = [];
  memberId: any;
  surveyId: any;
  addBtnDisable: boolean = true;
  landSurveyDuplicateDisable: boolean = false;
  editButtonDisabled: boolean = true;
  totalLand: number = 0;
  totalLandCheck: boolean = false;
  beforeEditTotalLand: number = 0;
  branchId: any;

  passbookList: string[] = [];
  khatabookList: string[] = [];
  tempKhatabookList: any[] = [];
  tempPassbookList: any[] = [];
  uniquePassbookList: any[] = [];
  uniqueKhatabookList: any[] = [];
  analyzerColumns: any[] = [];
  selectedPassbookNumber: any;
  uomModel: LandUom = new LandUom();

  formCaliculatedTotalLand: any;
  formCaliculatedCultivableLand: any;
  formCaliculatedUnderCultivationLand: any;
  docFilesList: any[] = [];
  uploadFileData: any;
  duplicatePassbookFlag: any;
  duplicateKhataPassbookFlag: any
  isFileUploaded: boolean = false;
  fileUploadRequire: boolean = true;
  fileUploadShow: boolean = true;
  displayDialogland: boolean = false;
  rowData: any;
  buttonsFlag: boolean = true;
  landFlag: boolean = false;
  isEditDisable :boolean = false;


  // @ViewChild('passbook', { static: true }) passbook: InputText;
  @ViewChild('passbook', { static: false }) private passbook!: Table;

  position: any;
  displayPosition: any;
  pacsId: any;
  waterSourceTypeList: any[] = [];
  measuringUnit: any;
  measuringSubUnit: any;
  

  constructor(private router: Router,
    private el: ElementRef,
    private commonComponent: CommonComponent,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private encryptService: EncryptDecryptService,
    private encryptDecryptService: EncryptDecryptService,
    private customerLandDetailsService: MembershipLandDetailsService,
    private datePipe: DatePipe,
    private customerPersonalDetailsService: MembershipBasicDetailsService
    , private statesService: StatesService,
    private commonFunctionsService: CommonFunctionsService, private districtService: DistrictService, private subDistrictService: SubDistrictService,
    private villagesService: VillagesService, private coveredVillagesService: CoveredVillagesService,
    private soilTypesService: SoilTypesService, private waterSourceTypesService: WaterSourceTypesService,
    private memberBasicDetailsStepperService: MemberBasicDetailsStepperService) {

    this.customerLandDetailsForm = this.formBuilder.group({
      'passbookNumber': new FormControl('', [Validators.required]),
      'khataNumber': new FormControl('', [Validators.required]),
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
    this.statusList = this.commonComponent.status();
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings;

    this.getAllSoilTypes();
    this.getAllLandTypes();
    this.getAllIrrigationTypes();
    this.getAllandOwnerships();
    // this.getAllCrops();
    this.getAllWaterSoruceType();
    this.calculateTotalsCount();
    this.getAllCoveredVillages();

    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        let id = this.encryptService.decrypt(params['id']);
        this.memberId = id;
        this.isEdit = true;
        this.getMembershipDetailsById(this.memberId);
      } else {
        this.isEdit = false;

      }
      this.updateData();
    })
  }

  updateData() {
    if (this.gridListData != null && this.gridListData != undefined &&
      this.gridListData.length > 0 && this.buttonsFlag) {
      this.landFlag = true;
    }
    this.customerLandDetails.memberId = this.memberBasicDetailsModel.id
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.landSurveyDetailsForm.valid,
      data: this.customerLandDetails,
      savedId: this.memberId,
      stepperIndex: 3,
      isDisable: !this.landFlag ? true : false,
    });
  }

  getMembershipDetailsById(id: any) {
    this.isEdit = true;
    this.customerPersonalDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.memberBasicDetailsModel = this.responseModel.data[0];
        this.customerLandDetails.memberId = this.memberBasicDetailsModel.id;
        if (this.memberBasicDetailsModel.memberShipLandDetailsDTO != null && this.memberBasicDetailsModel.memberShipLandDetailsDTO != undefined) {
          this.customerLandDetails = this.memberBasicDetailsModel.memberShipLandDetailsDTO;
          this.customerLandDetails.preMemAdmissionDate = this.datePipe.transform(this.customerLandDetails.preMemAdmissionDate, 'dd/MM/yyyy');
          this.customerLandDetails.admissionDate = this.datePipe.transform(this.customerLandDetails.admissionDate, 'dd/MM/yyyy');
          // this.getAllMembershipDetails();
          if (this.customerLandDetails.uploadFilePath != undefined && null != this.customerLandDetails.uploadFilePath) {
            this.isFileUploaded = applicationConstants.FALSE;
            let docFileList = [];
            let file = new FileUploadModel();
            file.imageValue = ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.customerLandDetails.uploadFilePath;
            let objects = this.customerLandDetails.uploadFilePath.split('.');
            file.fileType = objects[objects.length - 1];
            let name = this.customerLandDetails.uploadFilePath.replace(/ /g, "_");
            file.fileName = name
            docFileList.push(file);
            this.docFilesList = docFileList;
          }
          if (null != this.customerLandDetails.custLandSurveyDetails) {
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
              this.passbookList = [];
              this.khatabookList = [];
              this.tempPassbookList = [];
              this.uniquePassbookList = [];
              this.uniqueKhatabookList = [];
              this.gridListData = this.customerLandDetails.custLandSurveyDetails;
              if(this.gridListData != null && this.gridListData.length > 0){
                this.buttonsFlag = true;
                this.landFlag = true
                this.updateData();
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
              }
              else{
                this.buttonsFlag = false;
                this.landFlag = false
                this.updateData();
              }
          
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
        }
      }
      this.updateData();
    });
  }

  getMeasuringUnit() {
    this.customerLandDetailsService.getMeasuringUnit().subscribe((res: any) => {
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


  getAllSoilTypes() {
    this.commonComponent.startSpinner();
    this.soilTypesService.getAllSoilTypes().subscribe((res: any) => {
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

  getAllWaterSoruceType() {
    this.commonComponent.startSpinner();
    this.waterSourceTypesService.getAllWaterSourceTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.WATER_SOURCE_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.waterSourceTypeList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
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



  getAllStatesList() {
    this.statesService.getAllStates().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.statesList = this.responseModel.data;
            this.statesList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
            });
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
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
  getAllDistrictsByStateId(id: any) {
    this.districtService.getDistrictByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.districtsList = this.responseModel.data;
          this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
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
  getAllSubDistrictsByDistrictId(id: any) {
    this.subDistrictService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.subDistrictsList = this.responseModel.data;
          this.subDistrictsList = this.subDistrictsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
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
  }

  getAllCoveredVillages() {
    this.commonComponent.startSpinner();
    // this.customerPersonalDetailsService.getAllVillages().subscribe((res: any) => {
    this.coveredVillagesService.getAllCoveredVillagesByPacId(this.pacsId).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.COVERD_VILLAGES_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.villagesList = this.responseModel.data.filter((village: any) => village.status == applicationConstants.ACTIVE).map((count: any) => {
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


  getAllLandTypes() {
    this.commonComponent.startSpinner();
    this.customerLandDetailsService.getAllLandTypes().subscribe((res: any) => {
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

  getAllIrrigationTypes() {
    //this.commonComponent.startSpinner();
    this.customerLandDetailsService.getAllIrrigationTypes().subscribe((res: any) => {
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

  getAllandOwnerships() {
    //this.commonComponent.startSpinner();
    this.customerLandDetailsService.getAllandOwnerships().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.LAND_OWNERSHIP_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.landOwnershipsList = this.responseModel.data.filter((obj: any) => obj.status == true).map((object: any) => {
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

  displayDialogBox() {
    this.getMeasuringUnit();
    this.buttonsFlag = false;
    this.landFlag = false
    this.updateData();
    this.isEditDisable = true;
    this.customerSurveyDetails = new CustomerLandSurvyDetailsModel();
    this.displayDialog = true;
    this.landSurveyDetailsForm.reset();
  }

  navigateToLandDetails() {
    this.displayDialog = applicationConstants.FALSE;
    this.isEditDisable = false;
    this.getMembershipDetailsById(this.memberId);
    this.updateData();
    this.gridListData = this.tempSurveyList.map(x => Object.assign({}, x));
  }

  submitsurveyDetails() {
    // document.getElementById("addButtonFocus").focus();
    this.isEditDisable = false;
    this.masterCoveredVillage(this.customerSurveyDetails.villageId);
    // if (null != this.customerSurveyDetails && null != this.customerSurveyDetails.soilType) {
    //   this.soilTypesList.filter(obj => obj.value == this.customerSurveyDetails.soilType).map(object => {
    //     this.customerSurveyDetails.soilTypeName = object.label
    //   });
    // }
    // if (null != this.customerSurveyDetails && null != this.customerSurveyDetails.landType) {
    //   this.landTypesList.filter(obj => obj.value == this.customerSurveyDetails.landType).map(object => {
    //     this.customerSurveyDetails.landTypeName = object.label
    //   });
    // }
    // if (null != this.customerSurveyDetails && null != this.customerSurveyDetails.irrigationType) {
    //   this.irrigationTypesList.filter(obj => obj.value == this.customerSurveyDetails.irrigationType).map(object => {
    //     this.customerSurveyDetails.irrigationTypeName = object.label
    //   });
    // }
    // if (null != this.customerSurveyDetails && null != this.customerSurveyDetails.landOwnership) {
    //   this.landOwnershipsList.filter(obj => obj.value == this.customerSurveyDetails.landOwnership).map(object => {
    //     this.customerSurveyDetails.landOwnershipName = object.label
    //   });
    // }
    if (null != this.customerSurveyDetails && null != this.customerSurveyDetails.villageId) {
      this.villagesList.filter(obj => obj.value == this.customerSurveyDetails.villageId).map(object => {
        this.customerSurveyDetails.coveredVillagename = object.label
      });
    }
    if (null != this.customerLandDetails.memberId) {
      this.customerSurveyDetails.memberId = this.customerLandDetails.memberId;
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
    this.addOrUpdate(this.customerLandDetails);
  }


  // handleAdd(event: any) {
  //   if (null != event.value && undefined != event.value && event.value != "") {
  //     const check = this.tempPassbookList.includes(event.value);
  //     if (check) {
  //       this.passbookList = [];
  //       this.tempPassbookList.map(object => {
  //         this.passbookList.push(object);
  //         this.msgs = [{ severity: 'error', detail: applicationConstants.PASSBOOK_ALREADY_EXITS_IN_SURVEY }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 2500);
  //       });

  //     } else {
  //       this.checkPassbookNumberInDb(event.value);
  //     }

  //   }
  // }



  checkPassbookNumberInDb(passbookNumber: any) {
    //this.commonComponent.startSpinner();
    this.customerLandDetailsService.checkPassbookNumberInDb(passbookNumber).subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

        if (null != this.responseModel.data && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.passbookList = [];
          this.tempPassbookList.map(object => {
            this.passbookList.push(object);
          });
          this.msgs = [{ severity: 'error', detail: applicationConstants.PASSBOOK_ALREADY_EXITS_IN_SURVEY }];
          this.addBtnDisable = applicationConstants.TRUE;
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

  // checkKhataNumberInDb(khataNumber){
  //   this.commonComponent.startSpinner();
  //   this.customerLandDetailsService.checkKhataNumberInDb(khataNumber,this.customerSurveyDetails.villageId).subscribe((res: any) => {
  //     this.responseModel = res;
  //     if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

  //       if(null!=this.responseModel.data && this.responseModel.data!=undefined && this.responseModel.data.length>0){
  //         this.khatabookList=[];
  //         this.tempKhatabookList.map(object => {
  //           this.khatabookList.push(object);
  //         });
  //         this.msgs = [{ severity: 'error', detail: applicationConstants.KHATA_ALREADY_EXITS_IN_SURVEY }];
  //         this.addBtnDisable = applicationConstants.TRUE;
  //         setTimeout(() => {
  //           this.msgs = [];  
  //         }, 2000);
  //       }else{
  //         this.tempKhatabookList.push(khataNumber);
  //       }
  //       this.commonComponent.stopSpinner();
  //     } else {
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [];
  //       this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
  //       setTimeout(() => {
  //         this.msgs = [];  
  //       }, 2000);
  //     }
  //   },
  //     error => {
  //       this.msgs = [];
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
  //       setTimeout(() => {
  //         this.msgs = [];  
  //       }, 2000);
  //     });
  // }

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
    this.getMembershipDetailsById(this.memberId);
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
    this.getMembershipDetailsById(this.memberId);
  }

  addOrUpdate(rowData: any) {
    this.commonComponent.startSpinner();
    rowData.statusName = CommonStatusData.CREATED;
    rowData.activeStatus = applicationConstants.TRUE;
    rowData.pacsId = this.pacsId;
    rowData.branchId = this.branchId;
    if (rowData.id != undefined && rowData.id != null) {
      if (null != this.deletedSurveyList && this.deletedSurveyList.length > 0) {
        this.deletedSurveyList.map(object => {
          this.customerSurveyDetails = object;
          this.tempSurveyList.push(this.customerSurveyDetails);
        });
      }
      rowData.custLandSurveyDetails = this.tempSurveyList;
      this.customerLandDetailsService.updateMembershipLandDetails(rowData).subscribe((response: any) => {
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
        this.getMembershipDetailsById(this.memberId);
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
      //   this.customerLandDetails.admissionNumber = this.customerLandDetails.concatinatedAdmissionNumber;
      this.customerLandDetailsService.addMembershipLandDetails(rowData).subscribe((response: any) => {
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
        this.getMembershipDetailsById(this.memberId);
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

  checkLandInAcres(data: any) {
    // if(null!=data && null!=this.customerSurveyDetails.cultivableLand && data<this.customerSurveyDetails.cultivableLand){
    if (null != Number(data) && null != Number(this.customerSurveyDetails.cultivableLand) && Number(data) < Number(this.customerSurveyDetails.cultivableLand)) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.LAND_VALUE_IS_LESSER_THAN_CULTIVABLE_LAND }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else {
      this.landSurveySubmitDisable = applicationConstants.FALSE
    }
  }

  checkLand(data: any) {
    // if(null!=data && null!=this.customerSurveyDetails.cultivableLand && data<this.customerSurveyDetails.cultivableLand){
    if (null != Number(data) && Number(data) > 20) {
      this.landSurveyDetailsForm.get('totalLand').reset();
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.LAND_SHOULD_NOT_EXCEED }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else {
      let landInTotal = 0;
      let landInRow = 0;
      if (this.editSurveyData) {
        for (let land of this.gridListData) {
          if (this.customerSurveyDetails.rowId == land.rowId) {
            landInTotal = (Number(landInTotal) - Number(landInRow)) + Number(data);
            landInRow = Number(data);
          } else {
            landInTotal = Number(landInTotal) + Number(land.totalLand);
          }
        }
      } else {
        landInTotal = Number(this.totalLand);
        landInTotal = Number(landInTotal) + Number(data);
      }

      if (landInTotal > 20) {
        this.landSurveyDetailsForm.get('totalLand').reset();
        this.msgs = [];
        this.msgs = [{ severity: 'warn', detail: applicationConstants.Overall_LAND_SHOULD_NOT_EXCEED }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
  }

  checkCultivableland(data: any) {
    if (null != Number(data) && null != Number(this.customerSurveyDetails.totalLand) && Number(data) > Number(this.customerSurveyDetails.totalLand)) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.CULTIVABLE_LAND_VALUE_IS_GREATER_THAN_LAND_VALUE }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else if (null != Number(data) && null != Number(this.customerSurveyDetails.underCultivationLand) && Number(data) < Number(this.customerSurveyDetails.underCultivationLand)) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.CULTIVABLE_LAND_VALUE_IS_LESSER_THAN_UNDER_CULTIVATION_LAND }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else {
      this.landSurveySubmitDisable = applicationConstants.FALSE
    }
  }
  checkUnderCultivationland(data: any) {
    if (null != Number(data) && null != Number(this.customerSurveyDetails.cultivableLand) && Number(data) > Number(this.customerSurveyDetails.cultivableLand)) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.UNDER_CULTIVATION_LAND_VALUE_IS_GREATER_THAN_LAND_VALUE }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else if (null != Number(this.customerSurveyDetails.cultivableLand) && null != Number(this.customerSurveyDetails.totalLand) && Number(this.customerSurveyDetails.cultivableLand) > Number(this.customerSurveyDetails.totalLand)) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.CULTIVABLE_LAND_VALUE_IS_GREATER_THAN_LAND_VALUE }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else {
      this.landSurveySubmitDisable = applicationConstants.FALSE
    }
  }

  calculateTotalsCount() {
    if (null != this.gridListData && this.gridListData.length > 0) {
      this.customerLandDetails.totalLandInAcres = Number(0);
      this.customerLandDetails.totalCultivableLandInAcres = Number(0);
      this.customerLandDetails.totalUnderCultivationLandInAcres = Number(0);
      this.gridListData.filter(obj => null != obj.totalLand && null != obj.cultivableLand && null != obj.underCultivationLand).map(object => {
        this.customerLandDetails.totalLandInAcres = this.customerLandDetails.totalLandInAcres + Number(object.totalLand);
        this.customerLandDetails.totalCultivableLandInAcres = this.customerLandDetails.totalCultivableLandInAcres + Number(object.cultivableLand);
        this.customerLandDetails.totalUnderCultivationLandInAcres = this.customerLandDetails.totalUnderCultivationLandInAcres + Number(object.underCultivationLand);
      });
    } else {
      this.customerLandDetails.totalLandInAcres = Number(0);
      this.customerLandDetails.totalCultivableLandInAcres = Number(0);
      this.customerLandDetails.totalUnderCultivationLandInAcres = Number(0);
    }
    this.totalLand = this.customerLandDetails.totalLandInAcres;
  }

  getLandAndSurveyDetails() {
    let memAdmissionNumber = this.customerLandDetails.concatinatedAdmissionNumber;
    let memberName = this.customerLandDetails.memName;
    let memId = this.customerLandDetails.memberId;
    let villageName = this.customerLandDetails.villageName;
    let fatherOrSpouseName = this.customerLandDetails.fatherOrSpousename;
    let admDate = this.customerLandDetails.admissionDate;
    //this.commonComponent.startSpinner();
    this.customerLandDetailsService.getMembershipLandDetailsByMemberIdAndPacsId(this.customerLandDetails.memberId, this.pacsId, this.branchId).subscribe(res => {
      this.responseModel = res;
      //this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (null != this.responseModel.data[0]) {
          this.customerLandDetails = this.responseModel.data[0];
          this.customerLandDetails.preMemAdmissionDate = this.datePipe.transform(this.customerLandDetails.preMemAdmissionDate, 'dd/MM/yyyy');
        } else {
          this.customerLandDetails = new MemberLandDetailsModel();
        }

        this.memberId = this.customerLandDetails.id;
        this.customerLandDetails.concatinatedAdmissionNumber = memAdmissionNumber;
        this.customerLandDetails.memName = memberName;
        this.customerLandDetails.memberId = memId;
        this.customerLandDetails.villageName = villageName;
        this.customerLandDetails.fatherOrSpousename = fatherOrSpouseName;
        this.customerLandDetails.admissionDate = admDate;

        if (this.customerLandDetails.uploadFilePath != undefined && null != this.customerLandDetails.uploadFilePath) {
          let docFileList = [];
          let file = new FileUploadModel();
          file.imageValue = ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.customerLandDetails.uploadFilePath;
          let objects = this.customerLandDetails.uploadFilePath.split('.');
          file.fileType = objects[objects.length - 1];
          let name = this.customerLandDetails.uploadFilePath.replace(/ /g, "_");
          file.fileName = name
          docFileList.push(file);
          this.docFilesList = docFileList;
        }

        if (null != this.customerLandDetails.custLandSurveyDetails && this.customerLandDetails.custLandSurveyDetails != undefined
          && this.customerLandDetails.custLandSurveyDetails.length > 0) {
          this.gridListData = this.customerLandDetails.custLandSurveyDetails;
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
          this.tempSurveyList = this.customerLandDetails.custLandSurveyDetails.map((x: any) => Object.assign({}, x));
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
 

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }

  caliculatelandDetails() {
    let calculatedSubUnits = 41;
    let totalLand = Number(0);
    let cultivableLand = Number(0);
    let underCultivationLand = Number(0);
    let totalLandInSubUnits = Number(0);
    let cultivableLandInSubUnits = Number(0);
    let underCultivationLandInSubUnits = Number(0);
    let caliculatedTotalLand = Number(0);
    let caliculatedCultivableLand = Number(0);
    let caliculatedUnderCultivationLand = Number(0);

    if (this.customerSurveyDetails.totalLand != undefined && this.customerSurveyDetails.totalLand != null && this.customerSurveyDetails.totalLand != '') {
      totalLand = this.customerSurveyDetails.totalLand;
      totalLand = totalLand * calculatedSubUnits;
    }
    if (this.customerSurveyDetails.totalLandInSubUnits != undefined && this.customerSurveyDetails.totalLandInSubUnits != null && this.customerSurveyDetails.totalLandInSubUnits != '') {
      totalLandInSubUnits = this.customerSurveyDetails.totalLandInSubUnits;
    }

    if (this.customerSurveyDetails.cultivableLand != undefined && this.customerSurveyDetails.cultivableLand != null && this.customerSurveyDetails.cultivableLand != '') {
      cultivableLand = this.customerSurveyDetails.cultivableLand;
      cultivableLand = cultivableLand * calculatedSubUnits;
    }

    if (this.customerSurveyDetails.cultivableLandInSubUnits != undefined && this.customerSurveyDetails.cultivableLandInSubUnits != null && this.customerSurveyDetails.cultivableLandInSubUnits != '') {
      cultivableLandInSubUnits = this.customerSurveyDetails.cultivableLandInSubUnits;
    }

    if (this.customerSurveyDetails.underCultivationLand != undefined && this.customerSurveyDetails.underCultivationLand != null && this.customerSurveyDetails.underCultivationLand != '') {
      underCultivationLand = this.customerSurveyDetails.underCultivationLand;
      underCultivationLand = underCultivationLand * calculatedSubUnits;
    }

    if (this.customerSurveyDetails.underCultivationLandInSubUnits != undefined && this.customerSurveyDetails.underCultivationLandInSubUnits != null && this.customerSurveyDetails.underCultivationLandInSubUnits != '') {
      underCultivationLandInSubUnits = this.customerSurveyDetails.underCultivationLandInSubUnits;
    }

    caliculatedTotalLand += totalLand + totalLandInSubUnits;
    caliculatedCultivableLand += cultivableLand + cultivableLandInSubUnits;
    caliculatedUnderCultivationLand += underCultivationLand + underCultivationLandInSubUnits;


    this.formCaliculatedTotalLand = caliculatedTotalLand;
    this.formCaliculatedCultivableLand = caliculatedCultivableLand;
    this.formCaliculatedUnderCultivationLand = caliculatedUnderCultivationLand;

    if (caliculatedTotalLand != 0 && caliculatedCultivableLand != 0 && caliculatedTotalLand < caliculatedCultivableLand) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.LAND_VALUE_IS_LESSER_THAN_CULTIVABLE_LAND }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else {
      this.landSurveySubmitDisable = applicationConstants.FALSE
    }

    if (caliculatedTotalLand != 0 && caliculatedCultivableLand != 0 && caliculatedTotalLand < caliculatedCultivableLand) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.CULTIVABLE_LAND_VALUE_IS_GREATER_THAN_LAND_VALUE }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else if (caliculatedUnderCultivationLand != 0 && caliculatedCultivableLand != 0 && caliculatedCultivableLand < caliculatedUnderCultivationLand) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.CULTIVABLE_LAND_VALUE_IS_LESSER_THAN_UNDER_CULTIVATION_LAND }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else {
      this.landSurveySubmitDisable = applicationConstants.FALSE
    }


    if (caliculatedCultivableLand != 0 && caliculatedUnderCultivationLand != 0 && caliculatedCultivableLand < caliculatedUnderCultivationLand) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.UNDER_CULTIVATION_LAND_VALUE_IS_GREATER_THAN_LAND_VALUE }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else if (caliculatedTotalLand != 0 && caliculatedUnderCultivationLand != 0 && caliculatedTotalLand < caliculatedUnderCultivationLand) {
      this.landSurveySubmitDisable = applicationConstants.TRUE
      this.msgs = [];
      this.msgs = [{ severity: 'warn', detail: applicationConstants.CULTIVABLE_LAND_VALUE_IS_GREATER_THAN_LAND_VALUE }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    } else {
      this.landSurveySubmitDisable = applicationConstants.FALSE
    }

  }

  docUploader(event: any, uploader: FileUpload) {
    this.docFilesList = [];
    this.customerLandDetails.filesDTO = null;
    this.customerLandDetails.uploadFilePath = null;
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
            this.customerLandDetails.filesDTO = fileData;
            this.customerLandDetails.uploadFilePath = this.customerLandDetails.filesDTO.fileName;
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


  checkAdmoissionNumber() {
    let number = this.admissionNumberList.filter(num => num == this.customerLandDetails.concatinatedAdmissionNumber);
    if (number == null || number == undefined || number.length == 0)
      this.customerLandDetailsForm.reset();
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

 

  showDeleteDialogBox(rowData: any) {
    this.displayDialogland = true;
    this.rowData = rowData;
    this.buttonsFlag = false;
    this.landFlag = false
    this.updateData();
  }

  noDelete() {
    this.displayDialogland = false;
  }

  // delete(){
  //   //this.commonComponent.startSpinner();
  //   let index = this.gridListData.findIndex(object => object.rowId == this.rowData.rowId);
  //   if(null != this.rowData.id)
  //   {
  //     this.customerLandDetailsService.deleteCustomerLandDetails(this.rowData.id).subscribe(response=>{
  //       this.responseModel = response;
  //       if(this.responseModel.status == applicationConstants.STATUS_SUCCESS){
  //         //this.commonComponent.stopSpinner();
  //         this.msgs = [];
  //         this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];  
  //         }, 2000);
  //         this.displayDialogland = false;
  //         this.getMemberLandDetails(this.memberId);
  //       }else{
  //         this.displayDialogland = false;
  //         //this.commonComponent.stopSpinner();
  //         this.msgs = [];
  //         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 2000);
  //       }

  //     },error=>{
  //       //this.commonComponent.stopSpinner();
  //       this.msgs = [];
  //       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
  //       setTimeout(() => {
  //         this.msgs = [];
  //       }, 2000);
  //     })
  //   }else
  //   {
  //     this.displayDialogland = false;
  //     this.gridListData.splice(index, 1);
  //     this.tempSurveyList = this.gridListData.map(x => Object.assign({}, x));
  //   }
  //   //this.commonComponent.stopSpinner();
  // }  
}
