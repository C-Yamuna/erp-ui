import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InstituteCommunicationModel, InstitutionBasicDetailsModel } from '../../../shared/institution-details.model';
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { StatesService } from 'src/app/configurations/common-config/state/shared/states.service';
import { SubDistrictService } from 'src/app/configurations/common-config/sub-district/shared/sub-district.service';
import { DistrictService } from 'src/app/configurations/common-config/district/shared/district.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { VillagesService } from 'src/app/configurations/common-config/villages/shared/villages.service';
import { MemInstitutionService } from '../../../shared/mem-institution.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-institution-communication',
  templateUrl: './institution-communication.component.html',
  styleUrls: ['./institution-communication.component.css']
})
export class InstitutionCommunicationComponent implements OnInit {
  responseModel!: Responsemodel;
  msgs: any[] = [];
  institutionBasicDetailsModel: InstitutionBasicDetailsModel = new InstitutionBasicDetailsModel();
  instituteCommunicationModel: InstituteCommunicationModel = new InstituteCommunicationModel()
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[] = [];
  stateList: any[] = [];
  villageList: any[] = [];
  districtList: any[] = [];
  subDistrictList: any[] = [];
  instituteCommunicationForm: any;
  date: any;
  statuList: any[] = [];
  sameAsPermanentAddress: boolean = false;
  perstateList: any[] = [];
  pervillageList: any[] = [];
  perdistrictList: any[] = [];
  persubDistrictList: any[] = [];
  divisionList: any[] = [];
  blocksList: any[] = [];

  constructor(private router: Router, private formBuilder: FormBuilder,
    private memberBasicDetailsStepperService: MemberBasicDetailsStepperService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe, private statesService: StatesService,
    private districtService: DistrictService, private subDistrictService: SubDistrictService,
    private villagesService: VillagesService, private memInstitutionService: MemInstitutionService,
  ) {

    this.instituteCommunicationForm = this.formBuilder.group({
      'stateId': new FormControl('', Validators.required),
      'districtId': new FormControl('', Validators.required),
      'villageId': new FormControl('', Validators.required),
      'subDistrictId': new FormControl('', Validators.required),
      'address1': new FormControl('', Validators.required),
      'address2': new FormControl(''),
      'pinCode': new FormControl('', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.required]),
      'isSameAddress': new FormControl(''),
      'permanentStateId': new FormControl('', Validators.required),
      'permanentDistrictId': new FormControl('', Validators.required),
      'permanentSubDistrictId': new FormControl('', Validators.required),
      'permanentVillageId': new FormControl('', Validators.required),
      'permanentAddress1': new FormControl('', Validators.required),
      'permanentAddress2': new FormControl(''),
      'permanentPinCode': new FormControl('', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.required]),
      'division': new FormControl({ value: '', disabled: true }),
      'block': new FormControl({ value: '', disabled: true }),
      'perDivision': new FormControl({ value: '', disabled: true }),
      'perBlock': new FormControl({ value: '', disabled: true }),

    });
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    // Initialize other necessary variables and components
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);

        if (id != "" && id != null && id != undefined) {
          this.isEdit = true;
          this.getMemInstitutionById(id);
        }
      } else {
        this.isEdit = false;
        // this.countryModel.isActive = this.statusList[0].value;
      }
    });

    this.instituteCommunicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.instituteCommunicationForm.valid) {
        this.save();
      }
    });

    this.getAllStatesList();
    this.getAllPermanentStatesList();
    this.getAllBocksList();
    this.getAllDivisionList();
  }
  save() {
    this.updateData();
  }
  updateData() {
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.instituteCommunicationForm.valid,
      data: this.instituteCommunicationModel,
      stepperIndex: 2,
      isDisable: this.instituteCommunicationForm.valid ? false : true,
    });
  }


  /**
   * @implements get communication by institution id
   * @author k.yamuna
   */
  getMemInstitutionById(id: string) {
    this.memInstitutionService.getMemInstitutionById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.institutionBasicDetailsModel = this.responseModel.data[0];
        if (this.institutionBasicDetailsModel.admissionDate != null && this.institutionBasicDetailsModel.admissionDate != undefined) {
          this.institutionBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.institutionBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        this.instituteCommunicationModel.institutionId = this.institutionBasicDetailsModel.id;
        if (this.institutionBasicDetailsModel.institutionCommunicationDTOList != null && this.institutionBasicDetailsModel.institutionCommunicationDTOList != undefined && this.institutionBasicDetailsModel.institutionCommunicationDTOList.length > 0) {
          this.instituteCommunicationModel = this.institutionBasicDetailsModel.institutionCommunicationDTOList[0];


          if (this.instituteCommunicationModel.isSameAddress != null && this.instituteCommunicationModel.isSameAddress != undefined) {
            if (this.instituteCommunicationModel.isSameAddress == applicationConstants.TRUE) {
              // this.sameAsPerAddr(this.instituteCommunicationModel.isSameAddress);
              this.instituteCommunicationForm.get('pinCode').reset();
              this.instituteCommunicationForm.get('stateId').disable();
              this.instituteCommunicationForm.get('districtId').disable();
              this.instituteCommunicationForm.get('villageId').disable();
              this.instituteCommunicationForm.get('subDistrictId').disable();
              this.instituteCommunicationForm.get('address1').disable();
              this.instituteCommunicationForm.get('pinCode').disable();

            }
          }
          if (this.instituteCommunicationModel.stateId != null) {
            this.getAllDistrictsByStateId(this.instituteCommunicationModel.stateId, applicationConstants.FALSE);
          }
          if (this.instituteCommunicationModel.districtId != null) {
            this.getAllSubDistrictsByDistrictId(this.instituteCommunicationModel.districtId, applicationConstants.FALSE);
          }
          if (this.instituteCommunicationModel.subDistrictId != null) {
            this.getAllVillagesBySubDistrictId(this.instituteCommunicationModel.subDistrictId, applicationConstants.FALSE);
          }

          if (this.instituteCommunicationModel.permanentStateId != null) {
            this.getAllperDistrictsByStateId(this.instituteCommunicationModel.permanentStateId, applicationConstants.FALSE);
          }
          if (this.instituteCommunicationModel.permanentDistrictId != null) {
            this.getAllPerSubDistrictsByDistrictId(this.instituteCommunicationModel.permanentDistrictId, applicationConstants.FALSE);
          }
          if (this.instituteCommunicationModel.permanentSubDistrictId != null) {
            this.getAllPerVillagesBySubDistrictId(this.instituteCommunicationModel.permanentSubDistrictId, applicationConstants.FALSE);

            this.updateData();
          }
        }

      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);

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
  /**
   * @implements get all states
   * @author k.yamuna
   */
  getAllStatesList() {
    this.statesService.getAllStates().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.stateList = this.responseModel.data;
            this.stateList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
            });
            // this.sameAsRegisterAddress();
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
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  /**
  * @implements get all district By state id
  * @author k.yamuna
  */
  getAllDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.instituteCommunicationForm.get('districtId').reset();
      this.instituteCommunicationForm.get('subDistrictId').reset();
      this.instituteCommunicationForm.get('villageId').reset();
      this.instituteCommunicationForm.get('address1').reset();
      this.instituteCommunicationForm.get('pinCode').reset();
      this.instituteCommunicationForm.get('division').reset();
      this.instituteCommunicationForm.get('block').reset();

      this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.districtService.getDistrictByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.districtList = this.responseModel.data;
          this.districtList = this.districtList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          let state = this.stateList.find((data: any) => null != data && this.instituteCommunicationModel.stateId != null && data.value == this.instituteCommunicationModel.stateId);
          if (state != null && undefined != state)
            this.instituteCommunicationModel.stateName = state.label;
        }
        // this.sameAsRegisterAddress();
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
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  /**
  * @implements get all mandal By district  id
  * @author k.yamuna
  */
  getAllSubDistrictsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.instituteCommunicationForm.get('subDistrictId').reset();
      this.instituteCommunicationForm.get('villageId').reset();
      this.instituteCommunicationForm.get('address1').reset();
      this.instituteCommunicationForm.get('pinCode').reset();
      this.instituteCommunicationForm.get('division').reset();
      this.instituteCommunicationForm.get('block').reset();
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.subDistrictService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.subDistrictList = this.responseModel.data;
          this.subDistrictList = this.subDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          let state = this.districtList.find((data: any) => null != data && id != null && data.value === id);
          if (state != null && undefined != state)
            this.instituteCommunicationModel.districtName = state.label;
        }
        // this.sameAsRegisterAddress();
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
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  /**
 * @implements get all villages By mandal id
 * @author k.yamuna
 */
  getAllVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.instituteCommunicationForm.get('villageId').reset();
      this.instituteCommunicationForm.get('address1').reset();
      this.instituteCommunicationForm.get('pinCode').reset();
      this.instituteCommunicationForm.get('division').reset();
      this.instituteCommunicationForm.get('block').reset();
      this.villageList = [];
    }
    this.villagesService.getVillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id,data:relationType };
            });
            let mandal = this.subDistrictList.find((data: any) => null != data && data.value === id);
            if (mandal != null && undefined != mandal)
              this.instituteCommunicationModel.subDistrictName = mandal.label;
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
        // this.sameAsRegisterAddress();
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
  /**
 * @implements get all blocks By village  id
 * @author k.yamuna
 */
  getAllBocksList() {
    this.statesService.getAllBlock().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.blocksList = this.responseModel.data;
            this.blocksList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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
        // this.sameAsRegisterAddress();
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
  /**
* @implements get all divisions By village  id
* @author k.yamuna
*/
  getAllDivisionList() {
    this.statesService.getAllDivision().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.divisionList = this.responseModel.data;
            this.divisionList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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
        // this.sameAsRegisterAddress();
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
  /**
* @implements get village method for set villageName
* @author k.yamuna
*/
  getVillage(id: any,isResetIds:any){
    if(!isResetIds){
      this.instituteCommunicationForm.get('address1').reset();
    }
    this.instituteCommunicationModel.divisionId = null;;
    this.instituteCommunicationModel.divisionName = null;
    this.instituteCommunicationModel.blockId = null;;
    this.instituteCommunicationModel.blockName = null;
    let Village = this.villageList.find((data: any) => null != data && id != null && data.value === id);
    if (Village != null && undefined != Village)
      this.instituteCommunicationModel.villageName = Village.label;
    this.getBlock(Village.data.blockId);
    this.getDivision(Village.data.divisionId);
    // this.sameAsRegisterAddress();
  }
  /**
* @implements get division method for set divisionName
* @author k.yamuna
*/
  getDivision(id: any) {
    let division = this.divisionList.find((data: any) => null != data && id != null && data.value === id);
    if (division != null && undefined != division)
      this.instituteCommunicationModel.divisionId = division.value
    this.instituteCommunicationModel.divisionName = division.label
  }
    /**
* @implements get block method for set blockName
* @author k.yamuna
*/
  getBlock(id: any) {
    let block = this.blocksList.find((data: any) => null != data && id != null && data.value === id);
    if (block != null && undefined != block)
      this.instituteCommunicationModel.blockId = block.value
    this.instituteCommunicationModel.blockName = block.label
  }

    /**
* @implements get all permanent states 
* @author k.yamuna
*/  
  getAllPermanentStatesList() {
    this.statesService.getAllStates().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.perstateList = this.responseModel.data;
            this.perstateList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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
          this.sameAsRegisterAddress();
        }
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
      /**
* @implements get all permanent districts bi stateId 
* @author k.yamuna
*/ 
  getAllperDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.instituteCommunicationForm.get('permanentDistrictId').reset();
      this.instituteCommunicationForm.get('permanentSubDistrictId').reset();
      this.instituteCommunicationForm.get('permanentVillageId').reset();
      this.instituteCommunicationForm.get('permanentAddress1').reset();
      this.instituteCommunicationForm.get('permanentPinCode').reset();
      this.instituteCommunicationForm.get('perDivision').reset();
      this.instituteCommunicationForm.get('perBlock').reset();
      this.perdistrictList = [];
      this.persubDistrictList = [];
      this.pervillageList = [];
    }
    this.districtService.getDistrictByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.perdistrictList = this.responseModel.data;
        this.perdistrictList = this.perdistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let state = this.perstateList.find((data: any) => null != data && data.value === id);
        if (state != null && undefined != state)
          this.instituteCommunicationModel.permanentStateName = state.label;
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.sameAsRegisterAddress();
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
    /**
  * @implements get all permanent sub districts bi disrictId 
  * @author k.yamuna
  */ 
  getAllPerSubDistrictsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.instituteCommunicationForm.get('permanentSubDistrictId').reset();
      this.instituteCommunicationForm.get('permanentVillageId').reset();
      this.instituteCommunicationForm.get('permanentAddress1').reset();
      this.instituteCommunicationForm.get('permanentPinCode').reset();
      this.instituteCommunicationForm.get('perDivision').reset();
      this.instituteCommunicationForm.get('perBlock').reset();
      this.persubDistrictList = [];
      this.pervillageList = [];
    }
    this.subDistrictService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.persubDistrictList = this.responseModel.data;
        this.persubDistrictList = this.persubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let district = this.perdistrictList.find((data: any) => null != data && id != null && data.value === id);
        if (district != null && undefined != district)
          this.instituteCommunicationModel.permanentDistrictName = district.label;
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.sameAsRegisterAddress();
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
      /**
  * @implements get all permanent Villages bi subDisrictId 
  * @author k.yamuna
  */ 
  getAllPerVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.instituteCommunicationForm.get('permanentVillageId').reset();
      this.instituteCommunicationForm.get('permanentAddress1').reset();
      this.instituteCommunicationForm.get('permanentPinCode').reset();
      this.instituteCommunicationForm.get('perDivision').reset();
      this.instituteCommunicationForm.get('perBlock').reset();
      this.pervillageList = [];
    }
    this.villagesService.getVillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.pervillageList = this.responseModel.data;
            this.pervillageList = this.pervillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id,data:relationType };
            });
            let mandal = this.persubDistrictList.find((data: any) => null != data && id != null && data.value === id);
            if (mandal != null && undefined != mandal)
              this.instituteCommunicationModel.permanentSubDistrictName = mandal.label;

          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
        this.sameAsRegisterAddress();
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

  /**
  * @implements get all permanent Villages and setVillage name
  * @author k.yamuna
  */ 
  getPerVillage(id: any,isResetIds:any){
    if(isResetIds){
      this.instituteCommunicationForm.get('permanentAddress1').reset();
    }
    this.instituteCommunicationModel.permanentBlockId = null;;
    this.instituteCommunicationModel.permanentDivisionId = null;
    this.instituteCommunicationModel.permanentBlockName = null;;
    this.instituteCommunicationModel.permanentDivisionName = null;
    let village = this.pervillageList.find((obj: any) => null != obj && id != null && obj.value === id);
    if (village != null && undefined != village)
      this.instituteCommunicationModel.permanentVillageName = village.label;
    if (village.data != null && village.data != undefined) {
      this.getPerBlock(village.data.blockId);
      this.getPerDivision(village.data.divisionId);
    }
    this.sameAsRegisterAddress();
  }

  /**
  * @implements get permanent division and set divisionName
  * @author k.yamuna
  */
  getPerDivision(id: any) {
    let division = this.divisionList.find((data: any) => null != data && id != null && data.value === id);
    if (division != null && undefined != division)
      this.instituteCommunicationModel.permanentDivisionId = division.value
    this.instituteCommunicationModel.permanentDivisionName = division.label
  }
  /**
  * @implements get permanent block and set blockName
  * @author k.yamuna
  */
  getPerBlock(id: any) {
    let block = this.blocksList.find((data: any) => null != data && id != null && data.value === id);
    if (block != null && undefined != block)
      this.instituteCommunicationModel.permanentBlockId = block.value
    this.instituteCommunicationModel.permanentBlockName = block.label
  }

   /**
  * @implements this method for same as permanent to communication address population
  * @author k.yamuna
  */
  sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.instituteCommunicationForm.get('pinCode').reset();
      this.instituteCommunicationForm.get('stateId').disable();
      this.instituteCommunicationForm.get('districtId').disable();
      this.instituteCommunicationForm.get('villageId').disable();
      this.instituteCommunicationForm.get('subDistrictId').disable();
      this.instituteCommunicationForm.get('address1').disable();
      this.instituteCommunicationForm.get('pinCode').disable();

      this.instituteCommunicationModel.stateId = this.instituteCommunicationModel.permanentStateId;
      if (this.instituteCommunicationModel.permanentDistrictId != this.instituteCommunicationModel.districtId) {
        this.instituteCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.instituteCommunicationModel.stateId, false);
        this.instituteCommunicationModel.districtId = this.instituteCommunicationModel.permanentDistrictId;
      }
      if (this.instituteCommunicationModel.permanentSubDistrictId != this.instituteCommunicationModel.subDistrictId) {
        this.instituteCommunicationModel.subDistrictId = null;
        this.getAllSubDistrictsByDistrictId(this.instituteCommunicationModel.districtId, false);
        this.instituteCommunicationModel.subDistrictId = this.instituteCommunicationModel.permanentSubDistrictId;
      }
      if (this.instituteCommunicationModel.permanentVillageId != this.instituteCommunicationModel.villageId) {
        this.instituteCommunicationModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.instituteCommunicationModel.subDistrictId, false);

        this.instituteCommunicationModel.villageId = this.instituteCommunicationModel.permanentVillageId;
        if (this.instituteCommunicationModel.villageId != null && this.instituteCommunicationModel.villageId != undefined) {
          this.instituteCommunicationModel.villageName = this.instituteCommunicationModel.permanentVillageName;
        }
      }

      this.instituteCommunicationModel.address1 = this.instituteCommunicationModel.permanentAddress1;
      // this.instituteCommunicationModel.permanentAddress2 = this.instituteCommunicationModel.address2;
      this.instituteCommunicationModel.pincode = this.instituteCommunicationModel.permanentPinCode;
      this.instituteCommunicationModel.blockId = this.instituteCommunicationModel.permanentBlockId;
      this.instituteCommunicationModel.blockName = this.instituteCommunicationModel.permanentBlockName;

      this.instituteCommunicationModel.divisionId = this.instituteCommunicationModel.permanentDivisionId;
      this.instituteCommunicationModel.divisionName = this.instituteCommunicationModel.permanentDivisionName;
    }
    else {
      this.instituteCommunicationModel.isSameAddress = applicationConstants.FALSE;

      this.instituteCommunicationForm.get('stateId').enable();
      this.instituteCommunicationForm.get('districtId').enable();
      this.instituteCommunicationForm.get('villageId').enable();
      this.instituteCommunicationForm.get('subDistrictId').enable();
      this.instituteCommunicationForm.get('address1').enable();
      this.instituteCommunicationForm.get('pinCode').enable();

      this.instituteCommunicationForm.get('stateId').reset();
      this.instituteCommunicationForm.get('districtId').reset();
      this.instituteCommunicationForm.get('villageId').reset();
      this.instituteCommunicationForm.get('subDistrictId').reset();
      this.instituteCommunicationForm.get('address1').reset();
      this.instituteCommunicationForm.get('pinCode').reset();
      this.instituteCommunicationForm.get('division').reset();
      this.instituteCommunicationForm.get('block').reset();

      this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];

      this.instituteCommunicationModel.stateId = null;
      this.instituteCommunicationModel.districtId = null;
      this.instituteCommunicationModel.subDistrictId = null;
      this.instituteCommunicationModel.villageId = null;
      this.instituteCommunicationModel.address1 = null;
      this.instituteCommunicationModel.pincode = null;
      this.instituteCommunicationModel.blockId = null;
      this.instituteCommunicationModel.divisionId = null;
    }
    this.updateData();
  }

    /**
  * @implements this method for same as permanent to communication address pincode and address population
  * @author k.yamuna
  */
  RegAddressToComAddress() {
    if (this.instituteCommunicationModel.isSameAddress == applicationConstants.TRUE) {
      this.instituteCommunicationModel.address1 = this.instituteCommunicationModel.permanentAddress1;
      this.instituteCommunicationModel.pincode = this.instituteCommunicationModel.permanentPinCode;
    }
  }
    /**
  * @implements this method for same as permanent to communication address while entering data
  * @author k.yamuna
  */
  sameAsRegisterAddress() {
    if (this.instituteCommunicationModel.isSameAddress == applicationConstants.TRUE) {
      this.instituteCommunicationModel.stateId = this.instituteCommunicationModel.permanentStateId;
      if (this.instituteCommunicationModel.permanentDistrictId != this.instituteCommunicationModel.districtId) {
        this.instituteCommunicationModel.districtId = null;
        this.instituteCommunicationModel.districtName = null;
        this.getAllDistrictsByStateId(this.instituteCommunicationModel.stateId, false);
        this.instituteCommunicationModel.districtId = this.instituteCommunicationModel.permanentDistrictId;
      }
      if (this.instituteCommunicationModel.permanentSubDistrictId != this.instituteCommunicationModel.subDistrictId) {
        this.instituteCommunicationModel.subDistrictId = null;
        this.instituteCommunicationModel.subDistrictName = null;
        this.getAllSubDistrictsByDistrictId(this.instituteCommunicationModel.districtId, false);
        this.instituteCommunicationModel.subDistrictId = this.instituteCommunicationModel.permanentSubDistrictId;
      }
      if (this.instituteCommunicationModel.permanentVillageId != this.instituteCommunicationModel.villageId) {
        this.instituteCommunicationModel.villageId = null;
        this.instituteCommunicationModel.villageName = null;
        this.getAllVillagesBySubDistrictId(this.instituteCommunicationModel.subDistrictId, false);
        this.instituteCommunicationModel.villageId = this.instituteCommunicationModel.permanentVillageId;
        
      }
      if (this.instituteCommunicationModel.address1 != this.instituteCommunicationModel.permanentAddress1) {
        this.instituteCommunicationModel.address1 = null;
        this.instituteCommunicationModel.address1 = this.instituteCommunicationModel.permanentAddress1;
      }
      if (this.instituteCommunicationModel.pincode != this.instituteCommunicationModel.permanentPinCode) {
        this.instituteCommunicationModel.pincode = null;
        this.instituteCommunicationModel.pincode = this.instituteCommunicationModel.permanentPinCode;
      }
      if (this.instituteCommunicationModel.divisionId != this.instituteCommunicationModel.permanentDivisionId) {
        this.instituteCommunicationModel.divisionId = null;
        this.instituteCommunicationModel.divisionId = this.instituteCommunicationModel.permanentDivisionId;
      }
      if (this.instituteCommunicationModel.blockId != this.instituteCommunicationModel.permanentBlockId) {
        this.instituteCommunicationModel.blockId = null;
        this.instituteCommunicationModel.blockId = this.instituteCommunicationModel.permanentBlockId;
      }
        this.getVillage(this.instituteCommunicationModel.villageId,true);
    }
  }
}