import { Component } from '@angular/core';
import { FdNonCumulativeApplication } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { FdNonCumulativeCommunication } from './shared/fd-non-cumulative-communication.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FdNonCumulativeCommunicationService } from './shared/fd-non-cumulative-communication.service';
import { FdNonCumulativeApplicationService } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { NewMembershipAddService } from '../new-membership-add/shared/new-membership-add.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';

@Component({
  selector: 'app-fd-non-cumulative-communication',
  templateUrl: './fd-non-cumulative-communication.component.html',
  styleUrls: ['./fd-non-cumulative-communication.component.css']
})
export class FdNonCumulativeCommunicationComponent {

  communicationForm: any;
  communication: any;
  fdNonCumulativeApplicationModel: FdNonCumulativeApplication = new FdNonCumulativeApplication();
  fdNonCumulativeCommunicationModel: FdNonCumulativeCommunication = new FdNonCumulativeCommunication();
  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  sameAsPermanentAddress: boolean = false;
  responseModel!: Responsemodel;
  statesList: any[] = [];
  districtsList: any[] = [];
  mandalsList: any[] = [];
  villageList: any[] = [];
  permanentStatesList: any[] = [];
  permenentDistrictList: any[] = [];
  permenentSubDistrictList: any[] = [];
  permenentVillageList: any[] = [];
  id: any;
  orgnizationSetting: any;
  showForm: boolean = false;
  admissionNumber: any;
  msgs: any[] = [];
  memberTypeName: any;
  memberTypeId: any;
  accountNumber: any;
  flagForLabelName: any;
  blocksList: any[] = [];
  divisionList: any[] = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private fdNonCumulativeCommunicationService: FdNonCumulativeCommunicationService,
    private commonFunctionsService: CommonFunctionsService,
    private membershipServiceService: NewMembershipAddService) {
    this.communicationForm = this.formBuilder.group({
      'stateName': new FormControl('', Validators.required),
      'districtId': new FormControl('', Validators.required),
      'villageId': new FormControl('', Validators.required),
      'subDistrictId': new FormControl('', Validators.required),
      'address1': new FormControl('', [Validators.required]),
      'address2': new FormControl(''),
      'pinCode': new FormControl('', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.required]),
      'isSameAddress': new FormControl(''),
      'permanentStateId': new FormControl('', Validators.required),
      'permanentDistrictId': new FormControl('', Validators.required),
      'permanentSubDistrictId': new FormControl('', Validators.required),
      'permanentVillageId': new FormControl('', Validators.required),
      'permanentAddress1': new FormControl('', [Validators.required]),
      'permanentAddress2': new FormControl(''),
      'permanentPinCode': new FormControl('', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.required]),
      'division': new FormControl({ value: '', disabled: true }),
      'block': new FormControl({ value: '', disabled: true }),
      'permanentDivision': new FormControl({ value: '', disabled: true }),
      'permanentBlock': new FormControl({ value: '', disabled: true }),
    });
  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['id'] != undefined) {
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.id = Number(id);
          this.getFdNonCummApplicationById(this.id);
        }
      }
    });
    this.communicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.communicationForm.valid) {
        this.save();
      }
    });
    this.getAllStatesList();
    this.getAllPermanentStatesList();
    this.getAllBocksList();
    this.getAllDivisionList();
  }

  updateData() {
    if (this.id != null && this.id != undefined)
      this.fdNonCumulativeCommunicationModel.fdNonCummulativeAccId = this.id;
    if (this.accountNumber != null && this.accountNumber != undefined)
      this.fdNonCumulativeCommunicationModel.accountNumber = this.accountNumber;
    this.fdNonCumulativeCommunicationModel.memberTypeName = this.memberTypeName;
    this.fdNonCumulativeApplicationService.changeData({
      formValid: !this.communicationForm.valid ? true : false,
      data: this.fdNonCumulativeCommunicationModel,
      isDisable: (!this.communicationForm.valid),
      stepperIndex: 2,
    });
  }
  save() {
    this.updateData();
  }

  // get call from fd non cummulative account by id
  getFdNonCummApplicationById(id: any) {
    debugger
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined)
                this.admissionNumber = this.responseModel.data[0].admissionNumber;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined)
                this.accountNumber = this.responseModel.data[0].accountNumber;
              if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
              if (this.fdNonCumulativeApplicationModel != null && this.fdNonCumulativeApplicationModel != undefined)
                if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList != undefined &&
                  this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList[0] != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList[0] != undefined) {
                  this.fdNonCumulativeCommunicationModel = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList[0];
                  this.setAllFields();
                }
                else {
                  if (this.memberTypeName == "Individual")
                    this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
                  else if (this.memberTypeName == "Group")
                    this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
                  else if (this.memberTypeName == "Institution")
                    this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
                }
              this.updateData();
            }
          }
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

  setAllFields() {
    debugger
    if (this.fdNonCumulativeCommunicationModel.isSameAddress != null && this.fdNonCumulativeCommunicationModel.isSameAddress != undefined) {
      if (this.fdNonCumulativeCommunicationModel.isSameAddress == true) {
        this.communicationForm.get('stateName').disable();
        this.communicationForm.get('districtId').disable();
        this.communicationForm.get('subDistrictId').disable();
        this.communicationForm.get('villageId').disable();
        this.communicationForm.get('address1').disable();
        this.communicationForm.get('pinCode').disable();
        this.RegAddressToComAddress();
      }
    }
    if (this.fdNonCumulativeCommunicationModel.stateId != null)
      this.getAllDistrictsByStateId(this.fdNonCumulativeCommunicationModel.stateId, false)
    if (this.fdNonCumulativeCommunicationModel.districtId != null)
      this.getAllMandalsByDistrictId(this.fdNonCumulativeCommunicationModel.districtId, false)
    if (this.fdNonCumulativeCommunicationModel.subDistrictId != null)
      this.getAllVillagesByMandalId(this.fdNonCumulativeCommunicationModel.subDistrictId, false)

    if (this.fdNonCumulativeCommunicationModel.permanentStateId != null)
      this.getAllPermanentDistrictsByStateId(this.fdNonCumulativeCommunicationModel.permanentStateId, false)
    if (this.fdNonCumulativeCommunicationModel.permanentDistrictId != null)
      this.getAllPermanentMandalsByDistrictId(this.fdNonCumulativeCommunicationModel.permanentDistrictId, false)
    if (this.fdNonCumulativeCommunicationModel.permanentSubDistrictId != null)
      this.getAllPermanentVillagesByMandalId(this.fdNonCumulativeCommunicationModel.permanentSubDistrictId, false)
  }

  //Get Member Details from Membership Module by AdmissionNumber
  getMemberDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetails = this.responseModel.data[0];
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined &&
            this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined) {
            this.fdNonCumulativeCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
            if (this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != undefined)
              this.fdNonCumulativeCommunicationModel.admissionNumber = this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber;
            this.setAllFields();
          }
          this.updateData();
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

  //Get Group Details from Membership Module by AdmissionNumber
  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.membershipServiceService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].groupCommunicationList != null && this.responseModel.data[0].groupCommunicationList != undefined &&
            this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
            this.fdNonCumulativeCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
            this.fdNonCumulativeCommunicationModel.pinCode = this.responseModel.data[0].groupCommunicationList[0].pincode;
            if (this.fdNonCumulativeCommunicationModel.memberTypeName != null && this.fdNonCumulativeCommunicationModel.memberTypeName != undefined)
              this.memberTypeName = this.fdNonCumulativeCommunicationModel.memberTypeName;
            this.setAllFields();
          }
          this.updateData();
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

  //Get Institution Details from Membership Module by AdmissionNumber
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined &&
            this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
            this.fdNonCumulativeCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
            if (this.fdNonCumulativeCommunicationModel.memberTypeName != null && this.fdNonCumulativeCommunicationModel.memberTypeName != undefined)
              this.memberTypeName = this.fdNonCumulativeCommunicationModel.memberTypeName;
            this.setAllFields();
          }
          this.updateData();
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

  getAllStatesList() {
    this.fdNonCumulativeCommunicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.statesList = this.responseModel.data;
            this.statesList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
            });
            this.sameAsRegisterAddress();
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
    });
  }

  getAllDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('districtId').reset();
      this.communicationForm.get('subDistrictId').reset();
      this.communicationForm.get('villageId').reset();
      this.communicationForm.get('address1').reset();
      this.communicationForm.get('pinCode').reset();
      this.communicationForm.get('division').reset();
      this.communicationForm.get('block').reset();
      this.districtsList = [];
      this.mandalsList = [];
      this.villageList = [];
    }
    this.fdNonCumulativeCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtsList = this.responseModel.data;
        this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const state = this.statesList.find((item: { value: any; }) => item.value === id);
        this.fdNonCumulativeCommunicationModel.stateName = state.label;
        this.sameAsRegisterAddress();
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

  getAllMandalsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('subDistrictId').reset();
      this.communicationForm.get('villageId').reset();
      this.communicationForm.get('address1').reset();
      this.communicationForm.get('pinCode').reset();
      this.communicationForm.get('division').reset();
      this.communicationForm.get('block').reset();
      this.mandalsList = [];
      this.villageList = [];
    }
    this.fdNonCumulativeCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.mandalsList = this.responseModel.data;
        this.mandalsList = this.mandalsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const district = this.districtsList.find((item: { value: any; }) => item.value === id);
        this.fdNonCumulativeCommunicationModel.districtName = district.label;
        this.sameAsRegisterAddress();
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

  getAllVillagesByMandalId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('villageId').reset();
      this.communicationForm.get('address1').reset();
      this.communicationForm.get('pinCode').reset();
      this.communicationForm.get('division').reset();
      this.communicationForm.get('block').reset();
      this.villageList = [];
    }
    this.fdNonCumulativeCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id, data:relationType};
            });
            const mandal = this.mandalsList.find((item: { value: any; }) => item.value === id);
            this.fdNonCumulativeCommunicationModel.subDistrictName = mandal.label;
            this.sameAsRegisterAddress();
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
    });
  }

  getVillage(id: any) {
    this.fdNonCumulativeCommunicationModel.divisionId = null;;
    this.fdNonCumulativeCommunicationModel.divisionName = null;
    this.fdNonCumulativeCommunicationModel.blockId = null;;
    this.fdNonCumulativeCommunicationModel.blockName = null;
    const village = this.villageList.find((item: { value: any; }) => item.value === id);
    this.fdNonCumulativeCommunicationModel.villageName = village.label;
    this.getBlock(village.data.blockId);
    this.getDivision(village.data.divisionId);
    // this.sameAsRegisterAddress();
  }


  getDivision(id:any){
    let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
    if(division != null && undefined != division)
     this.fdNonCumulativeCommunicationModel.divisionId = division.value
     this.fdNonCumulativeCommunicationModel.divisionName = division.label
   }
   getBlock(id:any){
     let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
     if(block != null && undefined != block)
      this.fdNonCumulativeCommunicationModel.blockId = block.value
      this.fdNonCumulativeCommunicationModel.blockName = block.label
    }

  getAllBocksList() {
    this.fdNonCumulativeCommunicationService.getAllBlock().subscribe((response: any) => {
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
        this.sameAsRegisterAddress();
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

  getAllDivisionList() {
    this.fdNonCumulativeCommunicationService.getAllDivision().subscribe((response: any) => {
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

  getAllPermanentStatesList() {
    this.fdNonCumulativeCommunicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentStatesList = this.responseModel.data;
            this.permanentStatesList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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
    });
  }

  getAllPermanentDistrictsByStateId(id: any, isResetIds: any) {
    debugger
    if (isResetIds) {
      this.communicationForm.get('permanentDistrictId').reset();
      this.communicationForm.get('permanentSubDistrictId').reset();
      this.communicationForm.get('permanentVillageId').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentDivision').reset();
      this.communicationForm.get('permanentBlock').reset();
      this.permenentDistrictList = [];
      this.permenentSubDistrictList = [];
      this.permenentVillageList = [];
    }
    this.fdNonCumulativeCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permenentDistrictList = this.responseModel.data;
        this.permenentDistrictList = this.permenentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
        this.fdNonCumulativeCommunicationModel.permanentStateName = perState.label;
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.sameAsRegisterAddress();
    });
  }

  getAllPermanentMandalsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentSubDistrictId').reset();
      this.communicationForm.get('permanentVillageId').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentDivision').reset();
      this.communicationForm.get('permanentBlock').reset();
      this.permenentSubDistrictList = [];
      this.permenentVillageList = [];
    }
    this.fdNonCumulativeCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permenentSubDistrictList = this.responseModel.data;
        this.permenentSubDistrictList = this.permenentSubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.permenentDistrictList.find((item: { value: any; }) => item.value === id);
        this.fdNonCumulativeCommunicationModel.permanentDistrictName = perDistrict.label;
        this.sameAsRegisterAddress();
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
  getAllPermanentVillagesByMandalId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentVillageId').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentDivision').reset();
      this.communicationForm.get('permanentBlock').reset();
      this.permenentVillageList = [];
    }
    this.fdNonCumulativeCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permenentVillageList = this.responseModel.data;
            this.permenentVillageList = this.permenentVillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id, data: relationType };
            });
            const perMandal = this.permenentSubDistrictList.find((item: { value: any; }) => item.value === id);
            this.fdNonCumulativeCommunicationModel.permanentSubDistrictName = perMandal.label;
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
    });
  }
  getPermanentVillage(id: any) {
    debugger
    this.fdNonCumulativeCommunicationModel.permanentBlockId = null;;
    this.fdNonCumulativeCommunicationModel.permanentDivisionId = null;
    this.fdNonCumulativeCommunicationModel.permanentBlockName = null;;
    this.fdNonCumulativeCommunicationModel.permanentDivisionName = null;
    let perVillage= this.permenentVillageList.find((obj:any) => null != obj && id != null && obj.value === id);
    if(perVillage != null && undefined != perVillage)
    this.fdNonCumulativeCommunicationModel.permanentVillageName = perVillage.label;
    if(perVillage.data != null && perVillage.data != undefined){
      this.getPermanentBlock(perVillage.data.blockId);
      this.getPermanentDivision(perVillage.data.divisionId);
    }
    this.sameAsRegisterAddress();
  }

  getPermanentDivision(id:any){
    let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
    if(division != null && undefined != division)
     this.fdNonCumulativeCommunicationModel.permanentDivisionId = division.value
     this.fdNonCumulativeCommunicationModel.permanentDivisionName = division.label
   }
   getPermanentBlock(id:any){
     let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
     if(block != null && undefined != block)
      this.fdNonCumulativeCommunicationModel.permanentBlockId = block.value
     this.fdNonCumulativeCommunicationModel.permanentBlockName = block.label
    }


  sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.fdNonCumulativeCommunicationModel.isSameAddress = applicationConstants.TRUE;
      this.communicationForm.get('pinCode').reset();
      this.communicationForm.get('stateName').disable();
      this.communicationForm.get('districtId').disable();
      this.communicationForm.get('subDistrictId').disable();
      this.communicationForm.get('villageId').disable();
      this.communicationForm.get('address1').disable();
      this.communicationForm.get('pinCode').disable();
      
      this.fdNonCumulativeCommunicationModel.stateId = this.fdNonCumulativeCommunicationModel.permanentStateId;
      if (this.fdNonCumulativeCommunicationModel.permanentDistrictId != this.fdNonCumulativeCommunicationModel.districtId) {
        this.fdNonCumulativeCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.fdNonCumulativeCommunicationModel.stateId, false);
        this.fdNonCumulativeCommunicationModel.districtId = this.fdNonCumulativeCommunicationModel.permanentDistrictId;
      }
      if (this.fdNonCumulativeCommunicationModel.permanentSubDistrictId != this.fdNonCumulativeCommunicationModel.subDistrictId) {
        this.fdNonCumulativeCommunicationModel.subDistrictId = null;
        this.getAllMandalsByDistrictId(this.fdNonCumulativeCommunicationModel.districtId, false);
        this.fdNonCumulativeCommunicationModel.subDistrictId = this.fdNonCumulativeCommunicationModel.permanentSubDistrictId;
      }
      if (this.fdNonCumulativeCommunicationModel.permanentVillageId != this.fdNonCumulativeCommunicationModel.villageId) {
        this.fdNonCumulativeCommunicationModel.villageId = null;
        this.getAllVillagesByMandalId(this.fdNonCumulativeCommunicationModel.subDistrictId, false);
        this.fdNonCumulativeCommunicationModel.villageId = this.fdNonCumulativeCommunicationModel.permanentVillageId;
        // this.getPerVillage(this.fdNonCumulativeCommunicationModel.permanentVillageId);
      }
      this.fdNonCumulativeCommunicationModel.address1 = this.fdNonCumulativeCommunicationModel.permanentAddress1;
      // this.fdNonCumulativeCommunicationModel.permanentAddress2 = this.fdNonCumulativeCommunicationModel.address2;
      this.fdNonCumulativeCommunicationModel.pinCode = this.fdNonCumulativeCommunicationModel.permanentPinCode;
      this.fdNonCumulativeCommunicationModel.blockId = this.fdNonCumulativeCommunicationModel.permanentBlockId;
      this.fdNonCumulativeCommunicationModel.blockName = this.fdNonCumulativeCommunicationModel.permanentBlockName;

      this.fdNonCumulativeCommunicationModel.divisionId = this.fdNonCumulativeCommunicationModel.permanentDivisionId;
      this.fdNonCumulativeCommunicationModel.divisionName = this.fdNonCumulativeCommunicationModel.permanentDivisionName;


    }
    else {
      this.fdNonCumulativeCommunicationModel.isSameAddress = applicationConstants.FALSE;
      this.communicationForm.get('stateName').enable();
      this.communicationForm.get('districtId').enable();
      this.communicationForm.get('subDistrictId').enable();
      this.communicationForm.get('villageId').enable();
      this.communicationForm.get('address1').enable();
      this.communicationForm.get('pinCode').enable();

      this.communicationForm.get('stateName').reset();
      this.communicationForm.get('districtId').reset();
      this.communicationForm.get('subDistrictId').reset();
      this.communicationForm.get('villageId').reset();
      this.communicationForm.get('address1').reset();
      this.communicationForm.get('pinCode').reset();
      this.communicationForm.get('division').reset();
      this.communicationForm.get('block').reset();

      this.districtsList = [];
      this.mandalsList = [];
      this.villageList = [];

      this.fdNonCumulativeCommunicationModel.stateId = null;
      this.fdNonCumulativeCommunicationModel.districtId = null;
      this.fdNonCumulativeCommunicationModel.subDistrictId = null;
      this.fdNonCumulativeCommunicationModel.villageId = null;
      this.fdNonCumulativeCommunicationModel.address1 = null;
      this.fdNonCumulativeCommunicationModel.pinCode = null;
      this.fdNonCumulativeCommunicationModel.blockId = null;
      this.fdNonCumulativeCommunicationModel.divisionId = null;

    }
    this.updateData();
  }

  RegAddressToComAddress() {
    if (this.fdNonCumulativeCommunicationModel.isSameAddress == applicationConstants.TRUE) {
      this.fdNonCumulativeCommunicationModel.address1 = this.fdNonCumulativeCommunicationModel.permanentAddress1;
      this.fdNonCumulativeCommunicationModel.pinCode = this.fdNonCumulativeCommunicationModel.permanentPinCode;
    }
  }
  sameAsRegisterAddress() {
    if (this.fdNonCumulativeCommunicationModel.isSameAddress ==  applicationConstants.TRUE) {
      this.fdNonCumulativeCommunicationModel.stateId = this.fdNonCumulativeCommunicationModel.permanentStateId;
      if (this.fdNonCumulativeCommunicationModel.permanentDistrictId != this.fdNonCumulativeCommunicationModel.districtId) {
        this.fdNonCumulativeCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.fdNonCumulativeCommunicationModel.stateId,false);
        this.fdNonCumulativeCommunicationModel.districtId = this.fdNonCumulativeCommunicationModel.permanentDistrictId;
      }
      if (this.fdNonCumulativeCommunicationModel.permanentSubDistrictId != this.fdNonCumulativeCommunicationModel.subDistrictId) {
        this.fdNonCumulativeCommunicationModel.subDistrictId = null;
        this.getAllMandalsByDistrictId(this.fdNonCumulativeCommunicationModel.districtId,false);
        this.fdNonCumulativeCommunicationModel.subDistrictId = this.fdNonCumulativeCommunicationModel.permanentSubDistrictId;
      }
      if (this.fdNonCumulativeCommunicationModel.permanentVillageId != this.fdNonCumulativeCommunicationModel.villageId) {
        this.fdNonCumulativeCommunicationModel.villageId = null;
        this.getAllVillagesByMandalId(this.fdNonCumulativeCommunicationModel.subDistrictId,false);
        this.fdNonCumulativeCommunicationModel.villageId = this.fdNonCumulativeCommunicationModel.permanentVillageId;
       
      }
      if (this.fdNonCumulativeCommunicationModel.address1 != this.fdNonCumulativeCommunicationModel.permanentAddress1) {
        this.fdNonCumulativeCommunicationModel.address1 = null;
        this.fdNonCumulativeCommunicationModel.address1 = this.fdNonCumulativeCommunicationModel.permanentAddress1;
      }
      if (this.fdNonCumulativeCommunicationModel.pinCode != this.fdNonCumulativeCommunicationModel.permanentPinCode) {
        this.fdNonCumulativeCommunicationModel.pinCode = null;
        this.fdNonCumulativeCommunicationModel.pinCode = this.fdNonCumulativeCommunicationModel.permanentPinCode;
      }

      if (this.fdNonCumulativeCommunicationModel.divisionId != this.fdNonCumulativeCommunicationModel.permanentDivisionId) {
        this.fdNonCumulativeCommunicationModel.divisionId = null;
        this.fdNonCumulativeCommunicationModel.divisionId = this.fdNonCumulativeCommunicationModel.permanentDivisionId;
      }
      if (this.fdNonCumulativeCommunicationModel.blockId != this.fdNonCumulativeCommunicationModel.permanentBlockId) {
        this.fdNonCumulativeCommunicationModel.blockId = null;
        this.fdNonCumulativeCommunicationModel.blockId = this.fdNonCumulativeCommunicationModel.permanentBlockId;
      }
       this.getVillage(this.fdNonCumulativeCommunicationModel.villageId);
       this.getPermanentVillage(this.fdNonCumulativeCommunicationModel.permanentVillageId)
    }
  }
}
