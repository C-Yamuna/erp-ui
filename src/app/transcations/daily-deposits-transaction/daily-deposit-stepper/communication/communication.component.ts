import { Component } from '@angular/core';
import { Accounts } from '../../shared/accounts.model';
import { AccountCommunication } from '../../shared/account-communication.model';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { StatesService } from 'src/app/transcations/term-deposits-transcation/shared/states.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent {
  communicationForm: any;
  accountModel: Accounts = new Accounts();
  accountCommunicationModel: AccountCommunication = new AccountCommunication();
  sameAsPermanentAddress: boolean = false;
  subDistrictList: any[] = [];
  villageList: any[] = [];
  districtsList: any[] = [];
  statesList: any[] = [];
  permanentStatesList: any[] = [];
  permanentDistrictList: any[] = [];
  permanentSubDistrictList: any[] = [];
  permanentVillageList: any[] = [];
  msgs: any[] = [];
  checked: Boolean = false;
  isEdit: Boolean = false;
  accountId: any;
  accId: any
  admissionNumber: any;
  membershipBasicDetail: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  accountNumber: any;
  memberTypeName: any;
  showForm: boolean = false;
  id:any;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private dailyDepositsAccountsService: DailyDepositsAccountsService,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService, private statesService: StatesService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe) {
    this.communicationForm = this.formBuilder.group({
      stateName: ['',Validators.required],
      districtName: ['',Validators.required],
      subDistrictName: ['',Validators.required],
      villageName: ['',Validators.required],
      address1: ['',Validators.required],
      pinCode: ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      permanentStateName: ['',Validators.required],
      permanentDistrictName: ['',Validators.required],
      permanentSubDistrictName: ['',Validators.required],
      permanentVillageName: ['',Validators.required],
      permanentAddress1: ['',Validators.required],
      permanentPinCode:['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      isSameAddress: ['']
    })
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['id'] != undefined) {
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.accId = Number(id);
          this.getAccountById();
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
  }

  updateData() {
    if (this.accId != null && this.accId != undefined)
      this.accountCommunicationModel.accId = this.accId;
    if(this.accountNumber != null && this.accountNumber != undefined)
      this. accountCommunicationModel.accountNumber = this.accountNumber;
    this.dailyDepositsAccountsService.changeData({
      formValid: !this.communicationForm.valid ? true : false,
      data: this.accountCommunicationModel,
      isDisable: (!this.communicationForm.valid),
      stepperIndex: 2,
    });
  }
  save() {
    this.updateData();
  }

  getAccountById() {
    this.dailyDepositsAccountsService.getDailyDepositsByacid(this.accId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0].adminssionNumber != null && this.responseModel.data[0].adminssionNumber != undefined)
                this.admissionNumber = this.responseModel.data[0].adminssionNumber;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined)
                this.accountNumber = this.responseModel.data[0].accountNumber;
              if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.accountModel = this.responseModel.data[0];
              if (this.accountModel != null && this.accountModel != undefined)
                if (this.accountModel.accountCommunicationDTOList != null && this.accountModel.accountCommunicationDTOList != undefined &&
                  this.accountModel.accountCommunicationDTOList[0] != null && this.accountModel.accountCommunicationDTOList[0] != undefined) {
                  this.accountCommunicationModel = this.accountModel.accountCommunicationDTOList[0];
                  this.setAllFields();
                }
                else {
                  if (this.memberTypeName == "Individual")
                    this.getMembershipBasicDetailsByAdmissionNumber(this.admissionNumber);
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
    if (this.accountCommunicationModel.isSameAddress != null && this.accountCommunicationModel.isSameAddress != undefined) {
      if (this.accountCommunicationModel.isSameAddress == true) {
        this.communicationForm.get('permanentStateName').disable();
        this.communicationForm.get('permanentDistrictName').disable();
        this.communicationForm.get('permanentSubDistrictName').disable();
        this.communicationForm.get('permanentVillageName').disable();
        this.communicationForm.get('permanentAddress1').disable();
        this.communicationForm.get('permanentPinCode').disable();
        this.RegAddressToComAddress();
      }
    }
    if (this.accountCommunicationModel.stateId != null)
      this.getAllDistrictsByStateId(this.accountCommunicationModel.stateId, false)
    if (this.accountCommunicationModel.districtId != null)
      this.getAllSubDistrictByDistrictId(this.accountCommunicationModel.districtId, false)
    if (this.accountCommunicationModel.subDistrictId != null)
      this.getAllVillagesBySubDistrictId(this.accountCommunicationModel.subDistrictId, false)

    if (this.accountCommunicationModel.stateId != null)
      this.getAllPermanentDistrictsByStateId(this.accountCommunicationModel.stateId, false)
    if (this.accountCommunicationModel.districtId != null)
      this.getAllPermanentSubDistrictByDistrictId(this.accountCommunicationModel.districtId, false)
    if (this.accountCommunicationModel.mandalId != null)
      this.getAllPermanentVillagesBySubDistrictId(this.accountCommunicationModel.mandalId, false)
  }

  getMembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    this.dailyDepositsAccountsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicDetail = this.responseModel.data[0];
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined &&
            this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined){
            this. accountCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
            if(this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != undefined)
              this. accountCommunicationModel.admissionNumber = this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber;
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

  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.dailyDepositsAccountsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].groupCommunicationList != null && this.responseModel.data[0].groupCommunicationList != undefined &&
            this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
            this.accountCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
            if (this.accountCommunicationModel.memberType != null && this.accountCommunicationModel.memberType != undefined)
              this.memberTypeName = this.accountCommunicationModel.memberType;
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
    this.dailyDepositsAccountsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined &&
            this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
            this.accountCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
            if (this.accountCommunicationModel.memberType != null && this.accountCommunicationModel.memberType != undefined)
              this.memberTypeName = this.accountCommunicationModel.memberType;
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
    this.dailyDepositsAccountsService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.statesList = this.responseModel.data;
            this.statesList = this.responseModel.data.filter((obj: any) => obj != null).map((state: { name: any; id: any; }) => {
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
      this.communicationForm.get('districtName').reset();
      this.communicationForm.get('subDistrictName').reset();
      this.communicationForm.get('villageName').reset();
      this.districtsList = [];
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.dailyDepositsAccountsService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtsList = this.responseModel.data;
        this.districtsList = this.districtsList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const state = this.statesList.find((item: { value: any; }) => item.value === id);
        this.accountCommunicationModel.stateName = state.label;
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

  getAllSubDistrictByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('subDistrictName').reset();
      this.communicationForm.get('villageName').reset();
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.dailyDepositsAccountsService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.subDistrictList = this.responseModel.data;
        this.subDistrictList = this.subDistrictList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const district = this.districtsList.find((item: { value: any; }) => item.value === id);
        this.accountCommunicationModel.districtName = district.label;
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

  getAllVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('villageName').reset();
      this.villageList = [];
    }
    this.dailyDepositsAccountsService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            const subDistrictName = this.subDistrictList.find((item: { value: any; }) => item.value === id);
            this.accountCommunicationModel.subDistrictName = subDistrictName.label;
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
    const villageName = this.villageList.find((item: { value: any; }) => item.value === id);
    this.accountCommunicationModel.villageName = villageName.label;
    this.sameAsRegisterAddress();
  }

  getAllPermanentStatesList() {
    this.dailyDepositsAccountsService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentStatesList = this.responseModel.data;
            this.permanentStatesList = this.responseModel.data.filter((obj: any) => obj != null).map((state: { name: any; id: any; }) => {
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
    });
  }

  getAllPermanentDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentDistrictName').reset();
      this.communicationForm.get('permanentSubDistrictName').reset();
      this.communicationForm.get('permanentVillageName').reset();
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.dailyDepositsAccountsService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentDistrictList = this.responseModel.data;
        this.permanentDistrictList = this.permanentDistrictList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
        this.accountCommunicationModel.permanentStateName = perState.label;
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

  getAllPermanentSubDistrictByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentSubDistrictName').reset();
      this.communicationForm.get('permanentVillageName').reset();
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.dailyDepositsAccountsService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentSubDistrictList = this.responseModel.data;
        this.permanentSubDistrictList = this.permanentSubDistrictList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.permanentDistrictList.find((item: { value: any; }) => item.value === id);
        this.accountCommunicationModel.permanentDistrictName = perDistrict.label;
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

  getAllPermanentVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentVillageName').reset();
      this.permanentVillageList = [];
    }
    this.dailyDepositsAccountsService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentVillageList = this.responseModel.data;
            this.permanentVillageList = this.permanentVillageList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            const persubDistrictName = this.permanentSubDistrictList.find((item: { value: any; }) => item.value === id);
            this.accountCommunicationModel.permanentSubDistrictName = persubDistrictName.label;
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

  getPermanentVillage(id: any) {
    const perVillage = this.permanentVillageList.find((item: { value: any; }) => item.value === id);
    this.accountCommunicationModel.permanentVillageName = perVillage.label;
  }

  sameAsRegisterAddress() {
    if (this.accountCommunicationModel.isSameAddress == true) {
      this.accountCommunicationModel.permanentStateId = this.accountCommunicationModel.stateId;
      if (this.accountCommunicationModel.districtId != this.accountCommunicationModel.permanentDistrictId) {
        this.accountCommunicationModel.permanentDistrictId = null;
        this.getAllPermanentDistrictsByStateId(this.accountCommunicationModel.permanentStateId, false);
        this.accountCommunicationModel.permanentDistrictId = this.accountCommunicationModel.districtId;
      }
      if (this.accountCommunicationModel.subDistrictId != this.accountCommunicationModel.permanentSubDistrictId) {
        this.accountCommunicationModel.permanentSubDistrictId = null;
        this.getAllPermanentSubDistrictByDistrictId(this.accountCommunicationModel.permanentDistrictId, false);
        this.accountCommunicationModel.permanentSubDistrictId = this.accountCommunicationModel.subDistrictId;
      }
      if (this.accountCommunicationModel.villageId != this.accountCommunicationModel.permanentVillageId) {
        this.accountCommunicationModel.permanentVillageId = null;
        this.getAllPermanentVillagesBySubDistrictId(this.accountCommunicationModel.permanentSubDistrictId, false);
        this.accountCommunicationModel.permanentVillageId = this.accountCommunicationModel.villageId;
      }
      this.getVillage(this.accountCommunicationModel.villageId);
    }
  }

  sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.accountCommunicationModel.isSameAddress = applicationConstants.TRUE;
      this.communicationForm.get('permanentStateName').disable();
      this.communicationForm.get('permanentDistrictName').disable();
      this.communicationForm.get('permanentSubDistrictName').disable();
      this.communicationForm.get('permanentVillageName').disable();
      this.communicationForm.get('permanentAddress1').disable();
      this.communicationForm.get('permanentPinCode').disable();


      this.accountCommunicationModel.permanentStateId = this.accountCommunicationModel.stateId;
      if (this.accountCommunicationModel.districtId != this.accountCommunicationModel.permanentDistrictId) {
        this.accountCommunicationModel.permanentDistrictId = null;
        this.getAllPermanentDistrictsByStateId(this.accountCommunicationModel.permanentStateId, false);
        this.accountCommunicationModel.permanentDistrictId = this.accountCommunicationModel.districtId;
      }
      if (this.accountCommunicationModel.subDistrictId != this.accountCommunicationModel.permanentSubDistrictId) {
        this.accountCommunicationModel.permanentSubDistrictId = null;
        this.getAllPermanentSubDistrictByDistrictId(this.accountCommunicationModel.permanentDistrictId, false);
        this.accountCommunicationModel.permanentSubDistrictId = this.accountCommunicationModel.subDistrictId;
      }
      if (this.accountCommunicationModel.villageId != this.accountCommunicationModel.permanentVillageId) {
        this.accountCommunicationModel.permanentVillageId = null;
        this.getAllPermanentVillagesBySubDistrictId(this.accountCommunicationModel.permanentSubDistrictId, false);
        this.accountCommunicationModel.permanentVillageId = this.accountCommunicationModel.villageId;
      }

      this.accountCommunicationModel.permanentAddress1 = this.accountCommunicationModel.address1;
      this.accountCommunicationModel.permanentPinCode = this.accountCommunicationModel.pinCode;
    }
    else {
      this.accountCommunicationModel.isSameAddress = applicationConstants.FALSE;

      this.communicationForm.get('permanentStateName').enable();
      this.communicationForm.get('permanentDistrictName').enable();
      this.communicationForm.get('permanentSubDistrictName').enable();
      this.communicationForm.get('permanentVillageName').enable();
      this.communicationForm.get('permanentAddress1').enable();
      this.communicationForm.get('permanentPinCode').enable();

      this.communicationForm.get('permanentStateName').reset();
      this.communicationForm.get('permanentDistrictName').reset();
      this.communicationForm.get('permanentSubDistrictName').reset();
      this.communicationForm.get('permanentVillageName').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];


      this.communicationForm.get('permanentStateName').enable();
      this.communicationForm.get('permanentDistrictName').enable();
      this.communicationForm.get('permanentSubDistrictName').enable();
      this.communicationForm.get('permanentVillageName').enable();
      this.communicationForm.get('permanentAddress1').enable();
      this.communicationForm.get('permanentPinCode').enable();

      this.accountCommunicationModel.permanentStateId = null;
      this.accountCommunicationModel.permanentDistrictId = null;
      this.accountCommunicationModel.permanentSubDistrictId = null;
      this.accountCommunicationModel.permanentVillageId = null;
      this.accountCommunicationModel.permanentAddress1 = null;
      this.accountCommunicationModel.permanentPinCode = null;
    }
    this.updateData();
  }

  RegAddressToComAddress() {
    if (this.accountCommunicationModel.isSameAddress == true) {
      this.accountCommunicationModel.permanentAddress1 = this.accountCommunicationModel.address1;
      this.accountCommunicationModel.permanentPinCode = this.accountCommunicationModel.pinCode;
    }
  }
}
