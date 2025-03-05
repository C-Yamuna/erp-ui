import { Component } from '@angular/core';
import { Accounts } from '../../shared/accounts.model';
import { AccountCommunication } from '../../shared/account-communication.model';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
  blockList: any[] = [];
  permanentBlockList:any[]=[];
  division:any[]=[];
  divisionList: any[]=[];
  permanentDivisionList :any[]=[];

  constructor(private router: Router, private formBuilder: FormBuilder,
    private dailyDepositsAccountsService: DailyDepositsAccountsService,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService, private statesService: StatesService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe) {
    this.communicationForm = this.formBuilder.group({
      // stateName: new FormControl('', Validators.required),
      // districtName: new FormControl('', Validators.required),
      // subDistrictName: ['',Validators.required],
      // villageName: ['',Validators.required],
      // address1: ['',Validators.required],
      // pinCode: ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      // permanentStateName: ['',Validators.required],
      // permanentDistrictName: ['',Validators.required],
      // permanentSubDistrictName: ['',Validators.required],
      // permanentVillageName: ['',Validators.required],
      // permanentAddress1: ['',Validators.required],
      // permanentPinCode:['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      // isSameAddress: ['']
      "stateName": new FormControl('', Validators.required),
      "districtName": new FormControl('', Validators.required),
      "subDistrictName": new FormControl('', Validators.required),
      "villageName": new FormControl('', Validators.required),
      "address1": new FormControl('', Validators.required),
      "pinCode": ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      "permanentStateName": new FormControl('', Validators.required),
      "permanentDistrictName": new FormControl('', Validators.required),
      "permanentSubDistrictName": new FormControl('', Validators.required),
      "permanentVillageName": new FormControl('', Validators.required),
      "permanentAddress1": new FormControl('', Validators.required),
      "permanentPinCode": ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      "isSameAddress": new FormControl('',),
      "block": new FormControl({ value: '', disabled: true }),
      "division": new FormControl({ value: '', disabled: true }),
      "permanentBlock": new FormControl({ value: '', disabled: true }),
      "permanentDivision": new FormControl({ value: '', disabled: true })
      
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
    this.getAllBlockList();
    this.getAlldivisionList();
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
      this.getAllPermanentDistrictsByStateId(this.accountCommunicationModel.permanentStateId, false)
    if (this.accountCommunicationModel.districtId != null)
      this.getAllPermanentSubDistrictByDistrictId(this.accountCommunicationModel.permanentDistrictId, false)
    if (this.accountCommunicationModel.subDistrictId != null)
      this.getAllPermanentVillagesBySubDistrictId(this.accountCommunicationModel.permanentSubDistrictId, false)
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
            this.villageList = this.villageList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; divisionId:any;blockId:any}) => {
              return { label: relationType.name, value: relationType.id ,block:relationType.blockId ,division:relationType.divisionId};
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
            this.permanentVillageList = this.permanentVillageList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; divisionId:any;blockId:any }) => {
              return { label: relationType.name, value: relationType.id ,divisionId:relationType.divisionId ,blockId:relationType.blockId};
            });
            const persubDistrictName = this.permanentSubDistrictList.find((item: { value: any; }) => item.value === id);
            this.accountCommunicationModel.permanentSubDistrictName = persubDistrictName.label;
            let object = this.permanentVillageList.find((obj: any) => obj.value == this.accountCommunicationModel.permanentVillageId);
            if (object != null && object != undefined) {
              this.accountCommunicationModel.permanentDivisionId = object.divisionId;
              this.accountCommunicationModel.permanentBlockId = object.blockId;
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
      if (this.accountCommunicationModel.permanentVillageId != null && this.accountCommunicationModel.permanentVillageId != undefined) {
        this.accountCommunicationModel.villageId = this.accountCommunicationModel.permanentVillageId;
        let object = this.villageList.find((obj: any) => obj.value == this.accountCommunicationModel.villageId);
        if (object != null && object != undefined) {
          this.accountCommunicationModel.permanentDivisionId = object.division;
          this.accountCommunicationModel.permanentBlockId = object.block;
        }
        let divesionName = this.divisionList.find((data: any) => null != data && data.value === this.accountCommunicationModel.divisionId)
        this.accountCommunicationModel.permanentDivisionName = divesionName.name;

        let blockName = this.blockList.find((data: any) => null != data && data.value === this.accountCommunicationModel.blockId)
        this.accountCommunicationModel.permanentBlockName = blockName.name;
      }
      this.accountCommunicationModel.permanentAddress1 = this.accountCommunicationModel.address1;
      this.accountCommunicationModel.permanentPincode = this.accountCommunicationModel.pincode;
    }
    else {
      this.accountCommunicationModel.isSameAddress = applicationConstants.FALSE;

      this.communicationForm.get('permanentStateName').enable();
      this.communicationForm.get('permanentDistrictName').enable();
      this.communicationForm.get('permanentSubDistrictName').enable();
      this.communicationForm.get('permanentVillageName').enable();
      this.communicationForm.get('permanentAddress1').enable();
      this.communicationForm.get('permanentPinCode').enable();
      this.communicationForm.get('permanentBlock').enable();
      this.communicationForm.get('permanentDivision').enable();


      this.communicationForm.get('permanentStateName').reset();
      this.communicationForm.get('permanentDistrictName').reset();
      this.communicationForm.get('permanentSubDistrictName').reset();
      this.communicationForm.get('permanentVillageName').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentBlock').reset();
      this.communicationForm.get('permanentDivision').reset();
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];


      this.communicationForm.get('permanentStateName').enable();
      this.communicationForm.get('permanentDistrictName').enable();
      this.communicationForm.get('permanentSubDistrictName').enable();
      this.communicationForm.get('permanentVillageName').enable();
      this.communicationForm.get('permanentAddress1').enable();
      this.communicationForm.get('permanentPinCode').enable();
      this.communicationForm.get('permanentBlock').enable();
      this.communicationForm.get('permanentDivision').enable();

      this.accountCommunicationModel.permanentStateId = null;
      this.accountCommunicationModel.permanentDistrictId = null;
      this.accountCommunicationModel.permanentSubDistrictId = null;
      this.accountCommunicationModel.permanentVillageId = null;
      this.accountCommunicationModel.permanentAddress1 = null;
      this.accountCommunicationModel.permanentPincode = null;
      this.accountCommunicationModel.permanentBlockId = null;
      this.accountCommunicationModel.permanentDivisionId = null;
      this.accountCommunicationModel.permanentDivisionName  = null;
      this.accountCommunicationModel.permanentBlockName = null;
    }
    this.updateData();
  }

  RegAddressToComAddress() {
    if (this.accountCommunicationModel.isSameAddress == true) {
      this.accountCommunicationModel.permanentAddress1 = this.accountCommunicationModel.address1;
      this.accountCommunicationModel.permanentPincode = this.accountCommunicationModel.pincode;
    }
  }

   /**
   * @implements get all block list
   * @author Jyoshna
   *    */
  getAllBlockList(){
    this.dailyDepositsAccountsService.getBlockList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.blockList = this.responseModel.data;
            this.blockList = this.blockList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id};
            });
          }
        let block = this.blockList.find((data: any) => null != data && this.accountCommunicationModel.blockId != null &&  data.value == this.accountCommunicationModel.blockId);
          if (block != null && undefined != block)
            this.accountCommunicationModel.blockName = block.label;
         block = this.blockList.find((data: any) => null != data && this.accountCommunicationModel.permanentBlockId != null &&  data.value == this.accountCommunicationModel.permanentBlockId);
          if (block != null && undefined != block)
            this.accountCommunicationModel.permanentBlockName = block.label;
      }
      else{
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
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
 * @implements get all division List 
 * @author Jyoshna
 */
  getAlldivisionList(){
    this.dailyDepositsAccountsService.getAllDivisionList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.divisionList = this.responseModel.data;
            this.divisionList = this.divisionList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id};
            });
          }
        let division = this.divisionList.find((data: any) => null != data && this.accountCommunicationModel.divisionId != null &&  data.value == this.accountCommunicationModel.divisionId);
          if (division != null && undefined != division)
            this.accountCommunicationModel.divisionName = division.label;

        division = this.divisionList.find((data: any) => null != data && this.accountCommunicationModel.permanentDivisionId != null &&  data.value == this.accountCommunicationModel.permanentDivisionId);
          if (division != null && undefined != division)
            this.accountCommunicationModel.permanentDistrictName = division.label;
      }
      else{
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
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
  onChangeVillageId(villageId:any){
    if(this.accountCommunicationModel.villageId != null && this.accountCommunicationModel.villageId != undefined && this.villageList != null && this.villageList != undefined && this.villageList.length > 0){
      let relationshiptype = this.villageList.find((data: any) => null != data && this.accountCommunicationModel.villageId != null && data.value == this.accountCommunicationModel.villageId);
      if (relationshiptype != null && undefined != relationshiptype){
          this.accountCommunicationModel.villageName = relationshiptype.label;
          this.accountCommunicationModel.divisionId = relationshiptype.division;
          this.accountCommunicationModel.blockId = relationshiptype.block; 
      }
      let divesionName = this.divisionList.find((data:any)=>null != data && data.value === this.accountCommunicationModel.divisionId)
      this.accountCommunicationModel.divisionName = divesionName.name;

      let blockName = this.blockList.find((data:any)=>null != data && data.value === this.accountCommunicationModel.blockId)
      this.accountCommunicationModel.blockName = blockName.name;

      let object =  this.villageList.find((obj:any)=> obj.value == this.accountCommunicationModel.villageId);
      if(object != null && object != undefined){
        this.accountCommunicationModel.divisionId = object.division;
        this.accountCommunicationModel.blockId = object.block ;
      }

    }
    
  }

  /**
   * @implements onChange permenent Village
   * @author Jyoshna
   */
  onChangePermenentVillage(PermVillageId:any){
    this.communicationForm.get('permenentAddressOne')?.reset();
    this.communicationForm.get('permenentPinCode')?.reset();
    if(this.accountCommunicationModel.permanentVillageId != null && this.accountCommunicationModel.permanentVillageId != undefined && this.villageList != null && this.villageList != undefined && this.villageList.length > 0){
      let relationshiptype = this.permanentVillageList.find((data: any) => null != data && this.accountCommunicationModel.permanentVillageId != null && data.value == this.accountCommunicationModel.permanentVillageId);
      if (relationshiptype != null && undefined != relationshiptype){
          this.accountCommunicationModel.permanentVillageName = relationshiptype.label;
          this.accountCommunicationModel.permanentDivisionId = relationshiptype.divisionId;
          this.accountCommunicationModel.permanentBlockId = relationshiptype.blockId; 
      }          
    }
    let divesionName = this.divisionList.find((data:any)=>null != data && data.value === this.accountCommunicationModel.divisionId)
      this.accountCommunicationModel.permanentDivisionName = divesionName.name;

      let blockName = this.blockList.find((data:any)=>null != data && data.value === this.accountCommunicationModel.blockId)
      this.accountCommunicationModel.permanentBlockName = blockName.name;

    // if (this.accountCommunicationModel != null && this.accountCommunicationModel != undefined && this.accountCommunicationModel.isSameAddress != null && this.accountCommunicationModel.isSameAddress != undefined &&  this.accountCommunicationModel.isSameAddress) {
    //   this.accountCommunicationModel.villageId = PermVillageId;
    //   if(this.accountCommunicationModel.subDistrictId != null && this.accountCommunicationModel.subDistrictId != undefined){
    //     this.getAllVillagesBySubDistrictId(this.accountCommunicationModel.subDistrictId,false);
    //   }
    //   this.accountCommunicationModel.pinCode = null;
    //   this.accountCommunicationModel.address1 = null;
    // }
  }

}
