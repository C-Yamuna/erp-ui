import { CommunicationDetailsModel } from './../../../../savings-bank-transcation/view-savings-bank/shared/view-saving-bank-model';
import { SiLoanCommunicationService } from './../../../shared/si-loans/si-loan-communication.service';
import { SiLoanCommunication } from './../../../shared/si-loans/si-loan-communication.model';
import { SiLoanApplication } from './../../../shared/si-loans/si-loan-application.model';
import { SiLoanApplicationService } from './../../../shared/si-loans/si-loan-application.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MemberGroupDetailsModel, promoterDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, InstitutionPromoterDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';

@Component({
  selector: 'app-si-communication',
  templateUrl: './si-communication.component.html',
  styleUrls: ['./si-communication.component.css']
})
export class SiCommunicationComponent {
  checked: boolean = false;
  communicationForm: any;
  communication: any;

  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanCommunicationModel: SiLoanCommunication = new SiLoanCommunication();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();

  sameAsPermanentAddress: boolean = false;
  responseModel!: Responsemodel;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  accountOpeningDateVal: any;
  savedId: any;
  isEdit: any;
  flagForLabelName: any;
  accountOpeningDate: any;
  minBalence: any;
  loanAccId: any;
  statesList: any[] = [];
  districtsList: any[] = [];
  mandalsList: any[] = [];
  villageList: any[] = [];
  orgnizationSetting: any;
  productName: any;
  admissionNumber: any;
  memberTypeId: any;
  memberTypeName: any;
  memberName: any;
  mobileNumber: any;
  qualificationName: any;
  aadharNumber: any;

  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  mobileNumer: any;
  panNumber: any;

  permanentStatesList: any[] = [];
  permanentDistrictList: any[] = [];
  permanentMandalsList: any[] = [];
  permanentVillagesList: any[] = [];
  flag: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService, private siLoanApplicationService: SiLoanApplicationService,
    private siLoanCommunicationService: SiLoanCommunicationService, private membershipServiceService: MembershipServiceService) {

    this.communicationForm = this.formBuilder.group({
      state: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      mandal: new FormControl('', Validators.required),
      village: new FormControl('', Validators.required),
      pinCode: ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      regesteredAddressOne: [{ value: '' }],
      permanentState: new FormControl('', Validators.required),
      permanentDistrict: new FormControl('', Validators.required),
      permanentSubDistrict: new FormControl('', Validators.required),
      permanentVillage: new FormControl('', Validators.required),
      permanentPinCode: ['', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.compose([Validators.required])]],
      permanentAddressOne: [{ value: '' }],
      checked: [{ value: '' }],
    })
  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNumber'] != undefined) {
        if (params['id'] != undefined) {
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.loanAccId = Number(id);
          if (params['admissionNumber'] != undefined) {
            this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNumber']);
          }
          this.getSILoanApplicationById(this.loanAccId);
        }
        // this.isEdit = true;
        if (this.siLoanApplicationModel != null && this.siLoanApplicationModel != null)
          this.flagForLabelName = true;
      } else {
        this.isEdit = false;
        this.flagForLabelName = false;
      }

    });
    this.communicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
    });
    this.getAllStates();
  }

  save() {
    this.updateData();
  }

  updateData() {
    if (this.statesList != null && this.statesList != undefined && this.statesList.length > 0) {
      let permanentState = this.statesList.find((data: any) => null != data && this.siLoanCommunicationModel.stateId != null && data.value == this.siLoanCommunicationModel.permanentStateId);
      if (permanentState != null && undefined != permanentState) {
        this.siLoanCommunicationModel.permanentStateName = permanentState.label;
      }
    }
    this.siLoanCommunicationModel.siLoanApplicationId = this.loanAccId;
    this.siLoanCommunicationModel.admissionNumber = this.admissionNumber; 
    this.siLoanApplicationService.changeData({
      formValid: this.communicationForm.valid,
      data: this.siLoanCommunicationModel,
      isDisable: !this.communicationForm.valid ? applicationConstants.TRUE : applicationConstants.FALSE,
      stepperIndex: 2,
    });
  }

 
  
   //member module data by member admission Number
   getMemberDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.responseModel.data[0].memberShipCommunicationDetailsDTOList;
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined ) {
            this.siLoanCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
          }
          if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
            this.siLoanCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNumber;
          }
          if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
            this.siLoanCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
          }
          if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
            this.siLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
          }
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined ) {
            this.loadMasterDataListMemberModule(this.siLoanCommunicationModel);
          }
          this.siLoanCommunicationModel.id = null;
          this.sameAsPerAddr(this.flag);
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

  ///member module data by member admissionNumber
  getMemberGroupDetailsByGroupAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMemberGroupByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.responseModel.data[0].groupCommunicationList;
          if (this.responseModel.data[0].groupCommunicationList.length > 0 && this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
            this.siLoanCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
            this.loadMasterDataListMemberModule(this.siLoanCommunicationModel);
          }
          if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
            this.siLoanCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNumber;
          }
          if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
            this.siLoanCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
          }
          if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
            this.siLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
          }
          
          this.siLoanCommunicationModel.id = null;
          this.sameAsPerAddr(this.flag);
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

  //member module data by member admission Number
  getMemberInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if ( this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.responseModel.data[0].institutionCommunicationDTOList;
          if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined && this.responseModel.data[0].institutionCommunicationDTOList.length > 0 && this.responseModel.data[0].institutionCommunicationDTOList.length > 0 && this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
            this.siLoanCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
            this.loadMasterDataListMemberModule(this.siLoanCommunicationModel);
          }
          if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
            this.siLoanCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNumber;
          }
          if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
            this.siLoanCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
          }
          if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
            this.siLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
          }
          this.siLoanCommunicationModel.id = null;
          this.sameAsPerAddr(this.flag);
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


  getSILoanApplicationById(id: any) {
    this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.siLoanApplicationModel = this.responseModel.data[0];

            if (this.siLoanApplicationModel.siLoanCommunicationDTO != null && this.siLoanApplicationModel.siLoanCommunicationDTO != undefined) {
              this.isEdit = true;
              this.siLoanCommunicationModel = this.siLoanApplicationModel.siLoanCommunicationDTO;

              if (this.siLoanCommunicationModel.admissionNumber != null && this.siLoanCommunicationModel.admissionNumber != undefined) {
                this.admissionNumber = this.siLoanCommunicationModel.admissionNumber;
              }
              if (this.siLoanCommunicationModel.memberTypeName != null && this.siLoanCommunicationModel.memberTypeName != undefined)
                this.siLoanCommunicationModel.memberTypeName = this.siLoanCommunicationModel.memberTypeName;

              if (this.siLoanCommunicationModel.memberShipId != null && this.siLoanCommunicationModel.memberShipId != undefined)
                this.siLoanCommunicationModel.memberType = this.siLoanCommunicationModel.memberShipId;

              if (this.siLoanCommunicationModel.isSameAddress != null && this.siLoanCommunicationModel.isSameAddress != undefined) {
                this.sameAsPerAddr(this.flag);
              }

              this.loadMasterAddressDetails(this.siLoanCommunicationModel);
              this.updateData();
            }
            else {
              this.isEdit = false;
              if (this.siLoanApplicationModel.admissionNo != null && this.siLoanApplicationModel.admissionNo) {
                this.getMemberDetailsByAdmissionNumber(this.siLoanApplicationModel.admissionNo);
                this.getMemberGroupDetailsByGroupAdmissionNumber(this.siLoanApplicationModel.admissionNo);
                this.getMemberInstitutionDetailsByAdmissionNumber(this.siLoanApplicationModel.admissionNo);
              }
            }
          }
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

  sameAsPerAddr(flag :any) {
    if (this.siLoanCommunicationModel.isSameAddress) {
      this.communicationForm.get('permanentState').disable();
      this.communicationForm.get('permanentDistrict').disable();
      this.communicationForm.get('permanentSubDistrict').disable();
      this.communicationForm.get('permanentVillage').disable();
      this.communicationForm.get('permanentAddressOne').disable();
      this.communicationForm.get('permanentPinCode').reset();
      this.communicationForm.get('permanentPinCode').disable();
     
      
      if(this.siLoanCommunicationModel != null && this.siLoanCommunicationModel != undefined){
        if(this.siLoanCommunicationModel.address1 != null && this.siLoanCommunicationModel.address1 != undefined)
          this.siLoanCommunicationModel.permanentAddress1 = this.siLoanCommunicationModel.address1;
    
          if (this.siLoanCommunicationModel.stateId != null && this.siLoanCommunicationModel.stateId != undefined) {
            this.siLoanCommunicationModel.permanentStateId = this.siLoanCommunicationModel.stateId;
            this.getPermenentDistrictByPermenetStateId(this.siLoanCommunicationModel.stateId);
          }
          if (this.siLoanCommunicationModel.districtId != null && this.siLoanCommunicationModel.districtId != undefined) {
            this.siLoanCommunicationModel.permanentDistrictId = this.siLoanCommunicationModel.districtId;
            this.getPermenentMandalsByByPermenentDistrctId(this.siLoanCommunicationModel.districtId);
          }
          if (this.siLoanCommunicationModel.subDistrictId != null && this.siLoanCommunicationModel.subDistrictId != undefined) {
            this.siLoanCommunicationModel.permanentSubDistrictId = this.siLoanCommunicationModel.subDistrictId;
            this.getPermenentVilagesByPermenetMandalId(this.siLoanCommunicationModel.subDistrictId);
          }
          if(this.siLoanCommunicationModel.villageId != null && this.siLoanCommunicationModel.villageId != undefined){
            this.siLoanCommunicationModel.permanentVillageId = this.siLoanCommunicationModel.villageId;
          }
          if (this.siLoanCommunicationModel.pinCode!= null && this.siLoanCommunicationModel.pinCode != undefined) {
            this.siLoanCommunicationModel.permanentPinCode = this.siLoanCommunicationModel.pinCode;
          }
      }
    }
    else {
      this.communicationForm.get('permanentState').enable();
      this.communicationForm.get('permanentDistrict').enable();
      this.communicationForm.get('permanentSubDistrict').enable();
      this.communicationForm.get('permanentVillage').enable();
      this.communicationForm.get('permanentAddressOne').enable();
      this.communicationForm.get('permanentPinCode').enable();
      if(flag){
        this.siLoanCommunicationModel.permanentStateId = null;
        this.siLoanCommunicationModel.permanentDistrictId = null;
        this.siLoanCommunicationModel.permanentSubDistrictId = null;
        this.siLoanCommunicationModel.permanentVillageId = null;
        this.siLoanCommunicationModel.permanentAddress1 = null;
        this.siLoanCommunicationModel.permanentPinCode = null;
        this.permanentDistrictList = [];
        this.permanentMandalsList = [];
        this.permanentVillagesList = [];
      }
      
    }
  }
 

  getAllStates() {
    this.siLoanCommunicationService.getAllStates().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.statesList = this.responseModel.data;
            this.statesList = this.responseModel.data.filter((obj: any) => obj != null).map((state: { name: any; id: any; }) => {
              return { label: state.name, value: state.id };
            });
          }
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

  getAllDisttricts() {
    this.siLoanCommunicationService.getAllDisttricts().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.districtsList = this.responseModel.data;
            this.districtsList = this.districtsList.filter((obj: any) => obj != null).map((district: { name: any; id: any; }) => {
              return { label: district.name, value: district.id };
            });
          }
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

  getAllMandals() {
    this.siLoanCommunicationService.getAllMandals().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.mandalsList = this.responseModel.data;
            this.mandalsList = this.mandalsList.filter((obj: any) => obj != null).map((mandal: { name: any; id: any; }) => {
              return { label: mandal.name, value: mandal.id };
            });
          }
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

  getAllVillages() {
    this.siLoanCommunicationService.getAllVillages().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null).map((village: { name: any; id: any; }) => {
              return { label: village.name, value: village.id };
            });
          }
        }
        else {
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

  getDistrictsByStateId(id: any) {
    this.siLoanCommunicationModel.districtId = null;
    this.siLoanCommunicationModel.subDistrictId = null;
    this.siLoanCommunicationModel.villageId = null;

    this.districtsList = [];
    this.mandalsList = [];
    this.villageList = [];
    this.siLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.districtsList = this.responseModel.data;
          this.districtsList = this.districtsList.filter((obj: any) => obj != null).map((district: { name: any; id: any; }) => {
            return { label: district.name, value: district.id };
          });
          let state = this.statesList.find((data: any) => null != data && this.siLoanCommunicationModel.stateId != null && data.value == this.siLoanCommunicationModel.stateId);
          if (state != null && undefined != state && state.label != null && state.label != undefined) {
            this.siLoanCommunicationModel.stateName = state.label;
          }
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

  getMandalsByDistrctId(id: any) {
    this.siLoanCommunicationModel.villageId = null;
    this.siLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.mandalsList = this.responseModel.data;
          this.mandalsList = this.mandalsList.filter((obj: any) => obj != null).map((mandal: { name: any; id: any; }) => {
            return { label: mandal.name, value: mandal.id };
          });
          let district = this.districtsList.find((data: any) => null != data && this.siLoanCommunicationModel.districtId != null && data.value == this.siLoanCommunicationModel.districtId);
          if (district != null && undefined != district && district.label != null && district.label != undefined)
            this.siLoanCommunicationModel.districtName = district.label;
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

  getAllVillagesByMandalId(id: any) {
    this.siLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null).map((village: { name: any; id: any; }) => {
              return { label: village.name, value: village.id };
            });
            let subDistrict = this.mandalsList.find((data: any) => null != data && this.siLoanCommunicationModel.subDistrictId != null && data.value == this.siLoanCommunicationModel.subDistrictId);
            if (subDistrict != null && undefined != subDistrict)
              this.siLoanCommunicationModel.subDistrictName = subDistrict.label;
          }
        }
        else {
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

  getPermenentDistrictByPermenetStateId(id: any) {
    this.siLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined ) {
          this.permanentDistrictList = this.responseModel.data;
          this.permanentDistrictList = this.permanentDistrictList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          let permanentDistrictName = this.permanentDistrictList.find((data: any) => null != data && this.siLoanCommunicationModel.permanentDistrictId != null && data.value == this.siLoanCommunicationModel.permanentDistrictId);
          if (permanentDistrictName != null && undefined != permanentDistrictName) {
            this.siLoanCommunicationModel.permanentDistrictName = permanentDistrictName.label;
          }
        }
      }
      else{
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });

  }
 
  getPermenentMandalsByByPermenentDistrctId(id: any) {
    this.siLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
        this.permanentMandalsList = this.responseModel.data;
        this.permanentMandalsList = this.permanentMandalsList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
          let permanentDistrictName = this.permanentMandalsList.find((data: any) => null != data && this.siLoanCommunicationModel.permanentSubDistrictId  != null && data.value == this.siLoanCommunicationModel.permanentSubDistrictId);
          if (permanentDistrictName != null && undefined != permanentDistrictName)
              this.siLoanCommunicationModel.permanentSubDistrictName = permanentDistrictName.label;

      }
    }
    else{
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  //

  getPermenentVilagesByPermenetMandalId(id: any) {
    this.siLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
            this.permanentVillagesList = this.responseModel.data;
            this.permanentVillagesList = this.permanentVillagesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          let permanentDistrictName = this.permanentVillagesList.find((data: any) => null != data && this.siLoanCommunicationModel.permanentVillageId != null && data.value == this.siLoanCommunicationModel.permanentVillageId);
            if (permanentDistrictName != null && undefined != permanentDistrictName)
              this.siLoanCommunicationModel.permanentVillageName = permanentDistrictName.label;
          }
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

  onChangeStates(stateId: any) {
    if(this.siLoanCommunicationModel.stateId != null && this.siLoanCommunicationModel.stateId != undefined && this.statesList != null && this.statesList != undefined && this.statesList.length > 0){
      let relationshiptype = this.statesList.find((data: any) => null != data && this.siLoanCommunicationModel.stateId != null && data.value == this.siLoanCommunicationModel.stateId);
      if (relationshiptype != null && undefined != relationshiptype)
          this.siLoanCommunicationModel.stateName = relationshiptype.label;
    }
    
    this.getDistrictsByStateId(stateId);
    if (this.siLoanCommunicationModel != null && this.siLoanCommunicationModel != undefined && this.siLoanCommunicationModel.isSameAddress != null && this.siLoanCommunicationModel.isSameAddress != undefined &&  this.siLoanCommunicationModel.isSameAddress) {
      this.siLoanCommunicationModel.permanentStateId = stateId;
      this.onChangePermenentDistricts(stateId);
      this.siLoanCommunicationModel.permanentDistrictId = null;
      this.siLoanCommunicationModel.permanentSubDistrictId = null;
      this.siLoanCommunicationModel.permanentVillageId = null;
      this.siLoanCommunicationModel.permanentPinCode = null;
      this.siLoanCommunicationModel.permanentAddress1 = null;
      this.permanentDistrictList = [];
      this.permanentMandalsList = [];
      this.permanentVillagesList = [];
    }
    this.siLoanCommunicationModel.districtId = null;
    
    this.siLoanCommunicationModel.subDistrictId = null;
   
    this.siLoanCommunicationModel.villageId = null;
    
    this.siLoanCommunicationModel.pinCode = null;
    this.siLoanCommunicationModel.address1 = null;
    this.districtsList = [];
    this.mandalsList = [];
    this.villageList = [];
    
  }

  onChangeDistricts(districtId: any) {
    if(this.siLoanCommunicationModel.districtId != null && this.siLoanCommunicationModel.districtId != undefined && this.districtsList != null && this.districtsList != undefined && this.districtsList.length > 0){
      let relationshiptype = this.districtsList.find((data: any) => null != data && this.siLoanCommunicationModel.districtId != null && data.value == this.siLoanCommunicationModel.districtId);
      if (relationshiptype != null && undefined != relationshiptype)
          this.siLoanCommunicationModel.districtName = relationshiptype.label;
    }
    this.getMandalsByDistrctId(districtId);
    if (this.siLoanCommunicationModel != null && this.siLoanCommunicationModel != undefined && this.siLoanCommunicationModel.isSameAddress != null && this.siLoanCommunicationModel.isSameAddress != undefined &&  this.siLoanCommunicationModel.isSameAddress) {
      this.onChangePermenentMandals(districtId);
      this.siLoanCommunicationModel.permanentDistrictId = districtId;
    }
    this.siLoanCommunicationModel.subDistrictId = null;
    this.siLoanCommunicationModel.villageId = null;
    this.siLoanCommunicationModel.address1 = null;
    this.siLoanCommunicationModel.pinCode = null;
    this.mandalsList = [];
    this.villageList = [];
  }

  /**
   *@author k.yamuna
   * @implements on change mandal 
   * @param madalId
   */
  onChangeMandals(mandalId: any) {
    if(this.siLoanCommunicationModel.subDistrictId != null && this.siLoanCommunicationModel.subDistrictId != undefined && this.mandalsList != null && this.mandalsList != undefined && this.mandalsList.length > 0){
      let relationshiptype = this.mandalsList.find((data: any) => null != data && this.siLoanCommunicationModel.subDistrictId != null && data.value == this.siLoanCommunicationModel.subDistrictId);
      if (relationshiptype != null && undefined != relationshiptype)
          this.siLoanCommunicationModel.subDistrictName = relationshiptype.label;
    }
    this.getAllVillagesByMandalId(mandalId);
    if (this.siLoanCommunicationModel != null && this.siLoanCommunicationModel != undefined && this.siLoanCommunicationModel.isSameAddress != null && this.siLoanCommunicationModel.isSameAddress != undefined &&  this.siLoanCommunicationModel.isSameAddress) {
      this.siLoanCommunicationModel.permanentSubDistrictId = this.siLoanCommunicationModel.subDistrictId;
      this.onChangePermenentVillagesByPermenentMandals(mandalId);
     
    }
    this.siLoanCommunicationModel.villageId = null;
    this.siLoanCommunicationModel.villageName = null;

    this.villageList = [];
  }


  onChangePermenentDistricts(stateId : any){
    this.siLoanCommunicationModel.permanentDistrictId = null;
    this.siLoanCommunicationModel.permanentDistrictName = null;
    this.siLoanCommunicationModel.permanentSubDistrictId = null;
    this.siLoanCommunicationModel.permanentSubDistrictName = null;
    this.siLoanCommunicationModel.permanentVillageId = null;
    this.siLoanCommunicationModel.permanentVillageName = null;
    this.siLoanCommunicationModel.permanentPinCode = null;
    this.siLoanCommunicationModel.permanentAddress1 = null;
    this.permanentDistrictList = [];
    this.permanentMandalsList = [];
    this.permanentVillagesList = [];
      this.getPermenentDistrictByPermenetStateId(stateId);

  }

  onChangePermenentMandals(districtId : any){
    this.siLoanCommunicationModel.permanentSubDistrictId = null;
    
    this.siLoanCommunicationModel.permanentVillageId = null;
    
    this.siLoanCommunicationModel.permanentPinCode = null;
    this.siLoanCommunicationModel.permanentAddress1 = null;
    this.permanentMandalsList = [];
    this.permanentVillagesList = [];
    this.getPermenentMandalsByByPermenentDistrctId(districtId);
    
  }

  onChangePermenentVillagesByPermenentMandals(mandalId : any){
    this.siLoanCommunicationModel.permanentPinCode = null;
    this.siLoanCommunicationModel.permanentAddress1 = null;
    this.permanentVillagesList = [];
    this.getPermenentVilagesByPermenetMandalId(mandalId);
  }
  

  onChangePermanentState(stateId : any){
    this.siLoanCommunicationModel.permanentDistrictId = null;
    this.siLoanCommunicationModel.permanentDistrictName = null;
    this.siLoanCommunicationModel.permanentSubDistrictId = null;
    this.siLoanCommunicationModel.permanentSubDistrictName = null;
    this.siLoanCommunicationModel.permanentVillageId = null;
    this.siLoanCommunicationModel.permanentVillageName = null;
    this.siLoanCommunicationModel.permanentPinCode = null;
    this.siLoanCommunicationModel.permanentAddress1 = null;
    this.permanentDistrictList = [];
    this.permanentMandalsList = [];
    this.permanentVillagesList = [];
      this.getPermenentDistrictByPermenetStateId(stateId);

  }

  onChangePermanentDistrict(permanentDistrictId: any) {
    this.permanentMandalsList = [];
    this.permanentVillagesList = [];
    this.siLoanCommunicationModel.permanentSubDistrictId = null;
    this.siLoanCommunicationModel.permanentVillageId = null;
    this.getPermenentMandalsByByPermenentDistrctId(permanentDistrictId);
  }

  onChangePermanentSubDistrict(permanentSubDistrictId: any) {
    this.permanentVillagesList = [];
    this.siLoanCommunicationModel.permanentVillageId = null;
    this.getPermenentVilagesByPermenetMandalId(permanentSubDistrictId);
  }

  onChangePermanentVillage(permanentVillageId: any) {
    let permanentVillage = this.permanentVillagesList.find((data: any) => null != data && permanentVillageId != null && data.value == permanentVillageId);
    if (permanentVillage != null && undefined != permanentVillage) {
      this.siLoanCommunicationModel.permanentVillageName = permanentVillage.label;
    }
  }

  loadMasterAddressDetails(obj: any) {
    this.getAllDisttricts();
    this.getAllMandals();
    this.getAllVillages();
    if(obj != null && obj != undefined){
      if (obj.permntStateId != null && obj.permntStateId != undefined) {
        this.getPermenentDistrictByPermenetStateId(obj.permntStateId);
      }
      if (obj.permntDistrictId != null && obj.permntDistrictId != undefined) {
        this.getPermenentMandalsByByPermenentDistrctId(obj.permntDistrictId);
      }
      if (obj.permntSubDistrictId != null && obj.permntSubDistrictId != undefined) {
        this.getPermenentVilagesByPermenetMandalId(obj.permntSubDistrictId);
      }
    }
  }

  loadMasterDataListMemberModule(obj: any) {
    this.getAllDisttricts();
    this.getAllMandals();
    this.getAllVillages();
    if (obj != null && obj != undefined) {
      if (obj.permanentStateId != null && obj.permanentStateId != undefined) {
        this.siLoanCommunicationModel.permanentStateId = obj.permanentStateId;
        this.getPermenentDistrictByPermenetStateId(obj.permanentStateId);
      }
      if (obj.permanentDistrictId != null && obj.permanentDistrictId != undefined) {
        this.siLoanCommunicationModel.permanentDistrictId = obj.permanentDistrictId;
        this.getPermenentVilagesByPermenetMandalId(obj.permanentDistrictId);
      }
      if (obj.permanentSubDistrictId != null && obj.permanentSubDistrictId != undefined) {
        this.siLoanCommunicationModel.permanentSubDistrictId = obj.permanentSubDistrictId;
        this.getPermenentVilagesByPermenetMandalId(obj.permanentSubDistrictId);
      }
      if (obj.permanentVillageId != null && obj.permanentVillageId != undefined) {
        this.siLoanCommunicationModel.permanentVillageId = obj.permanentVillageId;
        this.onChangePermanentVillage(obj.permanentVillageId);
      }
      if (obj.permanentPinCode != null && obj.permanentPinCode != undefined)
        this.siLoanCommunicationModel.permanentPinCode = obj.permanentPinCode;

      if (obj.pinCode != null && obj.pinCode != undefined)
        this.siLoanCommunicationModel.pinCode = obj.pinCode;

      if (obj.permanentAddress1 != null)
        this.siLoanCommunicationModel.permanentAddress1 = obj.permanentAddress1;
    }
  }
  appendPinCodeToPermanent() {
    if (this.siLoanCommunicationModel != null && this.siLoanCommunicationModel != undefined && this.siLoanCommunicationModel.isSameAddress != null && this.siLoanCommunicationModel.isSameAddress != undefined && this.siLoanCommunicationModel.isSameAddress) {
      if (this.siLoanCommunicationModel.pinCode != null && this.siLoanCommunicationModel.pinCode != undefined) {
        this.siLoanCommunicationModel.permanentPinCode = this.siLoanCommunicationModel.pinCode;
      }
      if (this.siLoanCommunicationModel.address1 != null && this.siLoanCommunicationModel.address1 != undefined) {
        this.siLoanCommunicationModel.permanentAddress1 = this.siLoanCommunicationModel.address1;
      }
    }
  }
  onChangeVillageId(villageId:any){
    if(this.siLoanCommunicationModel.villageId != null && this.siLoanCommunicationModel.villageId != undefined && this.villageList != null && this.villageList != undefined && this.villageList.length > 0){
      let relationshiptype = this.villageList.find((data: any) => null != data && this.siLoanCommunicationModel.villageId != null && data.value == this.siLoanCommunicationModel.villageId);
      if (relationshiptype != null && undefined != relationshiptype)
          this.siLoanCommunicationModel.villageName = relationshiptype.label;
    }
    if (this.siLoanCommunicationModel != null && this.siLoanCommunicationModel != undefined && this.siLoanCommunicationModel.isSameAddress != null && this.siLoanCommunicationModel.isSameAddress != undefined &&  this.siLoanCommunicationModel.isSameAddress) {
      this.siLoanCommunicationModel.permanentVillageId = villageId;
      if(this.siLoanCommunicationModel.permanentSubDistrictId != null && this.siLoanCommunicationModel.permanentSubDistrictId != undefined){
        this.getPermenentVilagesByPermenetMandalId(this.siLoanCommunicationModel.permanentSubDistrictId);
      }
    }
  }

}
