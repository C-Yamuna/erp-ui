import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { StatesService } from '../../../shared/states.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { RdAccountCommunication, RdAccountsModel } from '../../../shared/term-depost-model.model';
import { RdAccountsService } from '../../../shared/rd-accounts.service';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from '../../../shared/membership-basic-detail.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { RdAccountCommunicationService } from '../../../shared/rd-account-communication.service';

@Component({
  selector: 'app-recurring-deposit-communication',
  templateUrl: './recurring-deposit-communication.component.html',
  styleUrls: ['./recurring-deposit-communication.component.css']
})
export class RecurringDepositCommunicationComponent {


  communicationForm: any;
  rdAccountModel: RdAccountsModel = new RdAccountsModel();
  rdAccountCommunicationModel: RdAccountCommunication = new RdAccountCommunication();
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
  rdAccId: any
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
  divisionList: any;
  blocksList: any;




  constructor(private router: Router, private formBuilder: FormBuilder, private rdAccountsService: RdAccountsService,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService, private statesService: StatesService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe) {
    this.communicationForm = this.formBuilder.group({
      'stateName': new FormControl('', Validators.required),
      'districtId': new FormControl('',Validators.required),
      'villageId': new FormControl('',Validators.required),
      'subDistrictId': new FormControl('',Validators.required),
      'address1': new FormControl('',[Validators.required]),
      'address2': new FormControl(''),
      'pinCode': new FormControl('',[Validators.pattern(applicationConstants.PINCODE_PATTERN),Validators.required]),
      'isSameAddress': new FormControl(''),
      'permanentStateId': new FormControl('',Validators.required),
      'permanentDistrictId': new FormControl('',Validators.required),
      'permanentSubDistrictId': new FormControl('',Validators.required),
      'permanentVillageId': new FormControl('',Validators.required),
      'permanentAddress1': new FormControl('',[Validators.required]),
      'permanentAddress2': new FormControl(''),
      'permanentPinCode': new FormControl('',[Validators.pattern(applicationConstants.PINCODE_PATTERN),Validators.required]),
      'division': new FormControl({ value: '', disabled: true }),
      'block': new FormControl({ value: '', disabled: true }),
      'permanentDivision': new FormControl({ value: '', disabled: true }),
      'permanentBlock': new FormControl({ value: '', disabled: true }),
    })
  }

  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['id'] != undefined) {
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.rdAccId = Number(id);
          this.getRdAccountById();
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
    if (this.rdAccId != null && this.rdAccId != undefined)
      this.rdAccountCommunicationModel.rdAccId = this.rdAccId;
    if(this.accountNumber != null && this.accountNumber != undefined)
      this. rdAccountCommunicationModel.accountNumber = this.accountNumber;
    this.rdAccountCommunicationModel.memberTypeName = this.memberTypeName;
    this.rdAccountsService.changeData({
      formValid: !this.communicationForm.valid ? true : false,
      data: this.rdAccountCommunicationModel,
      isDisable: (!this.communicationForm.valid),
      stepperIndex: 2,
    });
  }
  save() {
    this.updateData();
  }


  getRdAccountById() {
    this.rdAccountsService.getRdAccounts(this.rdAccId).subscribe((data: any) => {
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
              this.rdAccountModel = this.responseModel.data[0];
              if (this.rdAccountModel != null && this.rdAccountModel != undefined)
                if (this.rdAccountModel.rdAccountCommunicationDTOList != null && this.rdAccountModel.rdAccountCommunicationDTOList != undefined &&
                  this.rdAccountModel.rdAccountCommunicationDTOList[0] != null && this.rdAccountModel.rdAccountCommunicationDTOList[0] != undefined) {
                  this.rdAccountCommunicationModel = this.rdAccountModel.rdAccountCommunicationDTOList[0];
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
    if (this.rdAccountCommunicationModel.isSameAddress != null && this.rdAccountCommunicationModel.isSameAddress != undefined) {
      if (this.rdAccountCommunicationModel.isSameAddress == true) {
        this.communicationForm.get('stateName').disable();
        this.communicationForm.get('districtId').disable();
        this.communicationForm.get('subDistrictId').disable();
        this.communicationForm.get('villageId').disable();
        this.communicationForm.get('address1').disable();
        this.communicationForm.get('pinCode').disable();
        this.RegAddressToComAddress();
      }
    }
    if (this.rdAccountCommunicationModel.stateId != null)
      this.getAllDistrictsByStateId(this.rdAccountCommunicationModel.stateId, false)
    if (this.rdAccountCommunicationModel.districtId != null)
      this.getAllSubDistrictByDistrictId(this.rdAccountCommunicationModel.districtId, false)
    if (this.rdAccountCommunicationModel.subDistrictId != null)
      this.getAllVillagesBySubDistrictId(this.rdAccountCommunicationModel.subDistrictId, false)

    if (this.rdAccountCommunicationModel.permanentStateId != null)
      this.getAllPermanentDistrictsByStateId(this.rdAccountCommunicationModel.permanentStateId, false)
    if (this.rdAccountCommunicationModel.permanentDistrictId != null)
      this.getAllPermanentSubDistrictByDistrictId(this.rdAccountCommunicationModel.permanentDistrictId, false)
    if (this.rdAccountCommunicationModel.permanentSubDistrictId != null)
      this.getAllPermanentVillagesBySubDistrictId(this.rdAccountCommunicationModel.permanentSubDistrictId, false)
  }

  getMembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    this.rdAccountsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicDetail = this.responseModel.data[0];
          this.membershipBasicDetail.photoPath = this.responseModel.data[0].photoCopyPath;
          this.membershipBasicDetail.signaturePath = this.responseModel.data[0].signatureCopyPath;
          this.membershipBasicDetail.subProductName = this.responseModel.data[0].subProductName;
          this.memberTypeName = this.responseModel.data[0].memberTypeName;
          this.membershipBasicDetail.resolutionCopy = this.responseModel.data[0].mcrDocumentCopy;
          this.membershipBasicDetail.mcrNumber = this.responseModel.data[0].mcrNumber;
          if (this.membershipBasicDetail.resolutionDate != null && this.membershipBasicDetail.resolutionDate != undefined) {
            this.membershipBasicDetail.resolutionDateVal = this.datePipe.transform(this.membershipBasicDetail.resolutionDate, this.orgnizationSetting.datePipe);
          }
          this.membershipBasicDetail.fdNonCummCommunicationDto = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined &&
            this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined) {
            this.rdAccountCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
            if (this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != undefined)
              this.rdAccountCommunicationModel.admissionNumber = this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber;
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
    this.rdAccountsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].groupCommunicationList != null && this.responseModel.data[0].groupCommunicationList != undefined &&
            this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
            this.rdAccountCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
            this.rdAccountCommunicationModel.pinCode = this.responseModel.data[0].groupCommunicationList[0].pincode;
            if (this.rdAccountCommunicationModel.memberType != null && this.rdAccountCommunicationModel.memberType != undefined)
              this.memberTypeName = this.rdAccountCommunicationModel.memberType;
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
    this.rdAccountsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined &&
            this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
            this.rdAccountCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
            if (this.rdAccountCommunicationModel.memberType != null && this.rdAccountCommunicationModel.memberType != undefined)
              this.memberTypeName = this.rdAccountCommunicationModel.memberType;
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
    this.rdAccountsService.getstatesList().subscribe((response: any) => {
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
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.rdAccountsService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtsList = this.responseModel.data;
        this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const state = this.statesList.find((item: { value: any; }) => item.value === id);
        this.rdAccountCommunicationModel.stateName = state.label;
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
      this.communicationForm.get('subDistrictId').reset();
      this.communicationForm.get('villageId').reset();
      this.communicationForm.get('address1').reset();
      this.communicationForm.get('pinCode').reset();
      this.communicationForm.get('division').reset();
      this.communicationForm.get('block').reset();
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.rdAccountsService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.subDistrictList = this.responseModel.data;
        this.subDistrictList = this.subDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const district = this.districtsList.find((item: { value: any; }) => item.value === id);
        this.rdAccountCommunicationModel.districtName = district.label;
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
      this.communicationForm.get('villageId').reset();
      this.communicationForm.get('address1').reset();
      this.communicationForm.get('pinCode').reset();
      this.communicationForm.get('division').reset();
      this.communicationForm.get('block').reset();
      this.villageList = [];
    }
    this.rdAccountsService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id,data:relationType };
            });
            const subDistrictName = this.subDistrictList.find((item: { value: any; }) => item.value === id);
            this.rdAccountCommunicationModel.subDistrictName = subDistrictName.label;
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
      this.rdAccountCommunicationModel.divisionId = null;;
      this.rdAccountCommunicationModel.divisionName = null;
      this.rdAccountCommunicationModel.blockId = null;;
      this.rdAccountCommunicationModel.blockName = null;
      const village = this.villageList.find((item: { value: any; }) => item.value === id);
      this.rdAccountCommunicationModel.villageName = village.label;
      this.getBlock(village.data.blockId);
      this.getDivision(village.data.divisionId);
      // this.sameAsRegisterAddress();
    }

    getDivision(id:any){
      let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
      if(division != null && undefined != division)
       this.rdAccountCommunicationModel.divisionId = division.value
       this.rdAccountCommunicationModel.divisionName = division.label
     }
     getBlock(id:any){
       let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
       if(block != null && undefined != block)
        this.rdAccountCommunicationModel.blockId = block.value
        this.rdAccountCommunicationModel.blockName = block.label
      }
    getAllBocksList() {
      this.rdAccountsService.getAllBlock().subscribe((response: any) => {
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
      this.rdAccountsService.getAllDivision().subscribe((response: any) => {
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
    this.rdAccountsService.getstatesList().subscribe((response: any) => {
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
        }
      }
      this.sameAsRegisterAddress();
    });
  }

  getAllPermanentDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentDistrictId').reset();
      this.communicationForm.get('permanentSubDistrictId').reset();
      this.communicationForm.get('permanentVillageId').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentDivision').reset();
      this.communicationForm.get('permanentBlock').reset();
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.rdAccountsService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentDistrictList = this.responseModel.data;
        this.permanentDistrictList = this.permanentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
        this.rdAccountCommunicationModel.permanentStateName = perState.label;
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

  getAllPermanentSubDistrictByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentSubDistrictId').reset();
      this.communicationForm.get('permanentVillageId').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentDivision').reset();
      this.communicationForm.get('permanentBlock').reset();
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.rdAccountsService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentSubDistrictList = this.responseModel.data;
        this.permanentSubDistrictList = this.permanentSubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.permanentDistrictList.find((item: { value: any; }) => item.value === id);
        this.rdAccountCommunicationModel.permanentDistrictName = perDistrict.label;
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

  getAllPermanentVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentVillageId').reset();
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentDivision').reset();
      this.communicationForm.get('permanentBlock').reset();
      this.permanentVillageList = [];
    }
    this.rdAccountsService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentVillageList = this.responseModel.data;
            this.permanentVillageList = this.permanentVillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id,data: relationType };
            });
            const persubDistrictName = this.permanentSubDistrictList.find((item: { value: any; }) => item.value === id);
            this.rdAccountCommunicationModel.permanentSubDistrictName = persubDistrictName.label;
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
      this.sameAsRegisterAddress();
    });
  }

  getPermanentVillage(id: any) {
    this.rdAccountCommunicationModel.permanentBlockId = null;;
    this.rdAccountCommunicationModel.permanentDivisionId = null;
    this.rdAccountCommunicationModel.permanentBlockName = null;;
    this.rdAccountCommunicationModel.permanentDivisionName = null;
    let perVillage= this.permanentVillageList.find((obj:any) => null != obj && id != null && obj.value === id);
    if(perVillage != null && undefined != perVillage)
    this.rdAccountCommunicationModel.permanentVillageName = perVillage.label;
    if(perVillage.data != null && perVillage.data != undefined){
      this.getPermanentBlock(perVillage.data.blockId);
      this.getPermanentDivision(perVillage.data.divisionId);
    }
    this.sameAsRegisterAddress();
  }
  getPermanentDivision(id:any){
    let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
    if(division != null && undefined != division)
     this.rdAccountCommunicationModel.permanentDivisionId = division.value
     this.rdAccountCommunicationModel.permanentDivisionName = division.label
   }
   getPermanentBlock(id:any){
     let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
     if(block != null && undefined != block)
      this.rdAccountCommunicationModel.permanentBlockId = block.value
     this.rdAccountCommunicationModel.permanentBlockName = block.label
    }

    sameAsPerAddr(isSameAddress: any) {
      if (isSameAddress) {
        this.rdAccountCommunicationModel.isSameAddress = applicationConstants.TRUE;
        this.communicationForm.get('pinCode').reset();
        this.communicationForm.get('stateName').disable();
        this.communicationForm.get('districtId').disable();
        this.communicationForm.get('subDistrictId').disable();
        this.communicationForm.get('villageId').disable();
        this.communicationForm.get('address1').disable();
        this.communicationForm.get('pinCode').disable();
        
        this.rdAccountCommunicationModel.stateId = this.rdAccountCommunicationModel.permanentStateId;
        if (this.rdAccountCommunicationModel.permanentDistrictId != this.rdAccountCommunicationModel.districtId) {
          this.rdAccountCommunicationModel.districtId = null;
          this.getAllDistrictsByStateId(this.rdAccountCommunicationModel.stateId, false);
          this.rdAccountCommunicationModel.districtId = this.rdAccountCommunicationModel.permanentDistrictId;
        }
        if (this.rdAccountCommunicationModel.permanentSubDistrictId != this.rdAccountCommunicationModel.subDistrictId) {
          this.rdAccountCommunicationModel.subDistrictId = null;
          this.getAllSubDistrictByDistrictId(this.rdAccountCommunicationModel.districtId, false);
          this.rdAccountCommunicationModel.subDistrictId = this.rdAccountCommunicationModel.permanentSubDistrictId;
        }
        if (this.rdAccountCommunicationModel.permanentVillageId != this.rdAccountCommunicationModel.villageId) {
          this.rdAccountCommunicationModel.villageId = null;
          this.getAllVillagesBySubDistrictId(this.rdAccountCommunicationModel.subDistrictId, false);
          this.rdAccountCommunicationModel.villageId = this.rdAccountCommunicationModel.permanentVillageId;
          // this.getPerVillage(this.rdAccountCommunicationModel.permanentVillageId);
        }
        this.rdAccountCommunicationModel.address1 = this.rdAccountCommunicationModel.permanentAddress1;
        // this.rdAccountCommunicationModel.permanentAddress2 = this.rdAccountCommunicationModel.address2;
        this.rdAccountCommunicationModel.pinCode = this.rdAccountCommunicationModel.permanentPinCode;
        this.rdAccountCommunicationModel.blockId = this.rdAccountCommunicationModel.permanentBlockId;
        this.rdAccountCommunicationModel.blockName = this.rdAccountCommunicationModel.permanentBlockName;
  
        this.rdAccountCommunicationModel.divisionId = this.rdAccountCommunicationModel.permanentDivisionId;
        this.rdAccountCommunicationModel.divisionName = this.rdAccountCommunicationModel.permanentDivisionName;
  
  
      }
      else {
        this.rdAccountCommunicationModel.isSameAddress = applicationConstants.FALSE;
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
        this.subDistrictList = [];
        this.villageList = [];
  
        this.rdAccountCommunicationModel.stateId = null;
        this.rdAccountCommunicationModel.districtId = null;
        this.rdAccountCommunicationModel.subDistrictId = null;
        this.rdAccountCommunicationModel.villageId = null;
        this.rdAccountCommunicationModel.address1 = null;
        this.rdAccountCommunicationModel.pinCode = null;
        this.rdAccountCommunicationModel.blockId = null;
        this.rdAccountCommunicationModel.divisionId = null;
  
      }
      this.updateData();
    }
  
    RegAddressToComAddress() {
      if (this.rdAccountCommunicationModel.isSameAddress == applicationConstants.TRUE) {
        this.rdAccountCommunicationModel.address1 = this.rdAccountCommunicationModel.permanentAddress1;
        this.rdAccountCommunicationModel.pinCode = this.rdAccountCommunicationModel.permanentPinCode;
      }
    }
    sameAsRegisterAddress() {
      if (this.rdAccountCommunicationModel.isSameAddress ==  applicationConstants.TRUE) {
        this.rdAccountCommunicationModel.stateId = this.rdAccountCommunicationModel.permanentStateId;
        if (this.rdAccountCommunicationModel.permanentDistrictId != this.rdAccountCommunicationModel.districtId) {
          this.rdAccountCommunicationModel.districtId = null;
          this.getAllDistrictsByStateId(this.rdAccountCommunicationModel.stateId,false);
          this.rdAccountCommunicationModel.districtId = this.rdAccountCommunicationModel.permanentDistrictId;
        }
        if (this.rdAccountCommunicationModel.permanentSubDistrictId != this.rdAccountCommunicationModel.subDistrictId) {
          this.rdAccountCommunicationModel.subDistrictId = null;
          this.getAllSubDistrictByDistrictId(this.rdAccountCommunicationModel.districtId,false);
          this.rdAccountCommunicationModel.subDistrictId = this.rdAccountCommunicationModel.permanentSubDistrictId;
        }
        if (this.rdAccountCommunicationModel.permanentVillageId != this.rdAccountCommunicationModel.villageId) {
          this.rdAccountCommunicationModel.villageId = null;
          this.getAllVillagesBySubDistrictId(this.rdAccountCommunicationModel.subDistrictId,false);
          this.rdAccountCommunicationModel.villageId = this.rdAccountCommunicationModel.permanentVillageId;
         
        }
        if (this.rdAccountCommunicationModel.address1 != this.rdAccountCommunicationModel.permanentAddress1) {
          this.rdAccountCommunicationModel.address1 = null;
          this.rdAccountCommunicationModel.address1 = this.rdAccountCommunicationModel.permanentAddress1;
        }
        if (this.rdAccountCommunicationModel.pinCode != this.rdAccountCommunicationModel.permanentPinCode) {
          this.rdAccountCommunicationModel.pinCode = null;
          this.rdAccountCommunicationModel.pinCode = this.rdAccountCommunicationModel.permanentPinCode;
        }
  
        if (this.rdAccountCommunicationModel.divisionId != this.rdAccountCommunicationModel.permanentDivisionId) {
          this.rdAccountCommunicationModel.divisionId = null;
          this.rdAccountCommunicationModel.divisionId = this.rdAccountCommunicationModel.permanentDivisionId;
        }
        if (this.rdAccountCommunicationModel.blockId != this.rdAccountCommunicationModel.permanentBlockId) {
          this.rdAccountCommunicationModel.blockId = null;
          this.rdAccountCommunicationModel.blockId = this.rdAccountCommunicationModel.permanentBlockId;
        }
         this.getVillage(this.rdAccountCommunicationModel.villageId);
         this.getPermanentVillage(this.rdAccountCommunicationModel.permanentVillageId)
      }
    }


}
