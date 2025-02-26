import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SavingsBankJointAccountService } from '../savings-bank-joint-account/shared/savings-bank-joint-account.service';
import { SavingBankApplicationService } from '../savings-bank-application/shared/saving-bank-application.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SavingBankApplicationModel } from '../savings-bank-application/shared/saving-bank-application-model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SavingsBankCommunicationModel } from './shared/savings-bank-communication-model';
import { SavingsBankCommunicationService } from './shared/savings-bank-communication.service';
import { District } from 'src/app/configurations/common-config/district/shared/district.model';
import { StatesService } from 'src/app/transcations/term-deposits-transcation/shared/states.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { SavingsBankKycModel } from '../savings-bank-kyc/shared/savings-bank-kyc-model';
import { MembershipServiceService } from '../membership-basic-required-details/shared/membership-service.service';
import { unwrapDeep } from 'angular-pipes/utils/utils';

@Component({
  selector: 'app-savings-bank-communication',
  templateUrl: './savings-bank-communication.component.html',
  styleUrls: ['./savings-bank-communication.component.css']
})
export class SavingsBankCommunicationComponent implements OnInit {
  checked: boolean = false;
  communicationForm: FormGroup;
  communication: any;
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();
  savingsBankCommunicationModel: SavingsBankCommunicationModel = new SavingsBankCommunicationModel();
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
  sbAccId: any;
  statesList: any[] = [];
  districtsList: any[] = [];
  mandalsList: any[] = [];
  villageList: any[] = [];
  orgnizationSetting: any;
  productName: any;
  admissionNumber: any;
  memberTypeId: any;
  memberTypeName: any;
  showForm: boolean = false;
  memberName: any;
  mobileNumber: any;
  qualificationName: any;
  aadharNumber: any;
  permenentStatesList: any[]=[];
  permenentMandalsList: any[]=[];
  permenentVillagesList: any[]=[];
  permenentDistrictList : any [] =[];
  flag: boolean = false;
  blockList: any[] = [];
  permanentBlockList:any[]=[];
  division:any[]=[];
  divisionList: any[]=[];
  permanentDivisionList :any[]=[];

  constructor(private router: Router, private formBuilder: FormBuilder, private savingsBankJointAccountService: SavingsBankJointAccountService, private savingBankApplicationService: SavingBankApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private savingsBankCommunicationService: SavingsBankCommunicationService, private statesService: StatesService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private membershipServiceService: MembershipServiceService) {
    this.communicationForm = this.formBuilder.group({
      "states": new FormControl('', Validators.required),
      "districts": new FormControl('', Validators.required),
      "mandal": new FormControl('', Validators.required),
      "village": new FormControl('', Validators.required),
      "regesteredAddressOne": new FormControl('', Validators.required),
      "regesteredAddressTwo": new FormControl('',),
      "pinCode": new FormControl('', Validators.required),
      "permenentState": new FormControl('', Validators.required),
      "permenentDistricts": new FormControl('', Validators.required),
      "permenentMandal": new FormControl('', Validators.required),
      "permenentVillage": new FormControl('', Validators.required),
      "permenentAddressOne": new FormControl('', Validators.required),
      "permenentAddressTwo": new FormControl('',),
      "permenentPinCode": new FormControl('', Validators.required),
      "checked": new FormControl('',),
      "block": new FormControl({ value: '', disabled: true }),
      "division": new FormControl({ value: '', disabled: true }),
      "permanentBlock": new FormControl({ value: '', disabled: true }),
      "permanentDivision": new FormControl({ value: '', disabled: true })
    })
  }

  // @jyothi.naidana
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo']  != undefined ) {
        if(params['id'] != undefined ){
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.sbAccId = Number(id);
          this.getSbAccountDetailsById(this.sbAccId);
        }
        if(params['admissionNo']  != undefined){
          this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNo']);
            this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
            this.getMemberGroupDetailsByGroupAdmissionNumber(this.admissionNumber);
            this.getMemberInstitutionDetailsByAdmissionNumber(this.admissionNumber);
        }
        this.isEdit = true;
        if (this.savingBankApplicationModel != null && this.savingBankApplicationModel != null)
          this.flagForLabelName = true;
      } else {
        this.isEdit = false;
        this.flagForLabelName = false;
      }
      
    });
    this.communicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.communicationForm.valid) {
        this.save();
      }
    });
    this.getStatesList();
    this.getAllBlockList();
    this.getAlldivisionList();
  }

  /**
   *@author jyothi.naidana
   * @implements update data to parent component
   */
  updateData() {
    if(this.statesList != null && this.statesList != undefined && this.statesList.length > 0){
      let permenentStateName = this.statesList.find((data: any) => null != data && this.savingsBankCommunicationModel.stateId != null && data.value == this.savingsBankCommunicationModel.permanentStateId);
      if (permenentStateName != null && undefined != permenentStateName){
      this.savingsBankCommunicationModel.permanentStateName = permenentStateName.label;
      }
    }
    this.savingsBankCommunicationModel.sbAccId = this.sbAccId;
    this.savingsBankCommunicationModel.admissionNumber = this.admissionNumber; 
    this.savingBankApplicationService.changeData({
      formValid: !this.communicationForm.valid ? true : false,
      data: this.savingsBankCommunicationModel,
      isDisable: (!this.communicationForm.valid),
      // isDisable:false,
      stepperIndex: 2,
    });
  }
  // @jyothi.naidana
  // update model data to main stepper component 
  save() {
    this.updateData();
  }
  
  /**
   * @implements validation as per is same  permanentAddress and temparory address
   * @param flag 
   * @implements jyothi.naidana
   */
  sameAsPerAddr(flag :any) {
    if (this.savingsBankCommunicationModel.isSameAddress) {
      if(flag){
        this.communicationForm.get('regesteredAddressOne')?.reset();
        this.communicationForm.get('pinCode')?.reset();
      }
      this.communicationForm.get('states')?.disable();
      this.communicationForm.get('districts')?.disable();
      this.communicationForm.get('mandal')?.disable();
      this.communicationForm.get('village')?.disable();
      this.communicationForm.get('regesteredAddressOne')?.disable();
      this.communicationForm.get('regesteredAddressTwo')?.disable();
      this.communicationForm.get('pinCode')?.disable();
      
      if(this.savingsBankCommunicationModel != null && this.savingsBankCommunicationModel != undefined){
        if(this.savingsBankCommunicationModel.permanentAddress1 != null && this.savingsBankCommunicationModel.permanentAddress1 != undefined)
          this.savingsBankCommunicationModel.address1 = this.savingsBankCommunicationModel.permanentAddress1;
    
          if (this.savingsBankCommunicationModel.permanentStateId != null && this.savingsBankCommunicationModel.permanentStateId != undefined) {
            this.savingsBankCommunicationModel.stateId = this.savingsBankCommunicationModel.permanentStateId;
            this.getDistrictByStateId(this.savingsBankCommunicationModel.stateId);
          }
          if (this.savingsBankCommunicationModel.permanentDistrictId != null && this.savingsBankCommunicationModel.permanentDistrictId != undefined) {
            this.savingsBankCommunicationModel.districtId = this.savingsBankCommunicationModel.permanentDistrictId;
            this.getMandalsByByDistrctId(this.savingsBankCommunicationModel.districtId);
          }
          if (this.savingsBankCommunicationModel.permanentSubDistrictId != null && this.savingsBankCommunicationModel.permanentSubDistrictId != undefined) {
            this.savingsBankCommunicationModel.subDistrictId = this.savingsBankCommunicationModel.permanentSubDistrictId;
            this.getAllVilagesByMandalId(this.savingsBankCommunicationModel.subDistrictId);
          }
          if(this.savingsBankCommunicationModel.permanentVillageId != null && this.savingsBankCommunicationModel.permanentVillageId != undefined){
            this.savingsBankCommunicationModel.villageId = this.savingsBankCommunicationModel.permanentVillageId;
            let object =  this.permenentVillagesList.find((obj:any)=> obj.value == this.savingsBankCommunicationModel.villageId);
            if(object != null && object != undefined){
              this.savingsBankCommunicationModel.divisionId = object.divisionId;
              this.savingsBankCommunicationModel.blockId = object.blockId ;
            }
          }
          if (this.savingsBankCommunicationModel.permanentPinCode!= null && this.savingsBankCommunicationModel.permanentPinCode != undefined) {
            this.savingsBankCommunicationModel.pincode = this.savingsBankCommunicationModel.permanentPinCode;
          }
      }
    }
    else {
      this.communicationForm.get('states')?.enable();
      this.communicationForm.get('districts')?.enable();
      this.communicationForm.get('mandal')?.enable();
      this.communicationForm.get('village')?.enable();
      this.communicationForm.get('regesteredAddressOne')?.enable();
      this.communicationForm.get('regesteredAddressTwo')?.enable();
      this.communicationForm.get('pinCode')?.enable();
      let object =  this.permenentVillagesList.find((obj:any)=> obj.value == this.savingsBankCommunicationModel.villageId);
      if(object != null && object != undefined){
        this.savingsBankCommunicationModel.divisionId = object.divisionId;
        this.savingsBankCommunicationModel.blockId = object.blockId ;
      }
      if(flag){
        this.communicationForm.get('regesteredAddressOne')?.reset();
        this.communicationForm.get('pinCode')?.reset();
        this.savingsBankCommunicationModel.stateId = null;
        this.savingsBankCommunicationModel.districtId = null;
        this.savingsBankCommunicationModel.subDistrictId = null;
        this.savingsBankCommunicationModel.villageId = null;
        this.savingsBankCommunicationModel.divisionId = null;
        this.savingsBankCommunicationModel.blockId = null;
        this.savingsBankCommunicationModel.address1 = null;
        this.savingsBankCommunicationModel.pincode = null;
        this.districtsList = [];
        this.mandalsList = [];
        this.villageList = [];
      }
      
    }
  }
 
  //member module data by member admission Number
  getMemberDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.responseModel.data[0].memberShipCommunicationDetailsDTOList;
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined ) {
            this.savingsBankCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
          }
          if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
            this.savingsBankCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNumber;
          }
          if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
            this.savingsBankCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
          }
          if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
            this.savingsBankCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
          }
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined ) {
            this.loadMasterDataListMemberModule(this.savingsBankCommunicationModel);
          }
          this.savingsBankCommunicationModel.id = null;
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

  //member module data by member admissionNumber
  getMemberGroupDetailsByGroupAdmissionNumber(admissionNumber: any) {
    this.membershipServiceService.getMemberGroupByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.responseModel.data[0].groupCommunicationList;
          if (this.responseModel.data[0].groupCommunicationList.length > 0 && this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
            this.savingsBankCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
            this.loadMasterDataListMemberModule(this.savingsBankCommunicationModel);
          }
          if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
            this.savingsBankCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNumber;
          }
          if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
            this.savingsBankCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
          }
          if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
            this.savingsBankCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
          }
          
          this.savingsBankCommunicationModel.id = null;
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
            this.savingsBankCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
            this.loadMasterDataListMemberModule(this.savingsBankCommunicationModel);
          }
          if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
            this.savingsBankCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNumber;
          }
          if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
            this.savingsBankCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
          }
          if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
            this.savingsBankCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
          }
          this.savingsBankCommunicationModel.id = null;
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

  //get all states list from common master
  // @jyothi.naidana
  getStatesList() {
    this.savingsBankCommunicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.statesList = this.responseModel.data;
            this.statesList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
            let relationshiptype = this.statesList.find((data: any) => null != data && this.savingsBankCommunicationModel.stateId != null && data.value == this.savingsBankCommunicationModel.stateId);
            if (relationshiptype != null && undefined != relationshiptype)
              this.savingsBankCommunicationModel.stateName = relationshiptype.label;
            
            this.sameAsPerAddr(this.flag);
          }
        }
      }
      // this.getAllDistrcts();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  
  //get districts by state id
  // @jyothi.naidana
  getDistrictByStateId(id: any) {
    this.savingsBankCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.districtsList = this.responseModel.data;
          this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          let district = this.districtsList.find((data: any) => null != data && this.savingsBankCommunicationModel.districtId != null && data.value == this.savingsBankCommunicationModel.districtId);
          if (district != null && undefined != district && district.label != null && district.label != undefined) {
            this.savingsBankCommunicationModel.stateName = district.label;
          }
          // this.sameAsPerAddr(this.flag);
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
   * @implements get permanent Disctrict By State Id
   * @param id 
   * @author jyothi.naidana
   */
  getPermenentDistrictByPermenetStateId(id: any) {
    this.savingsBankCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined ) {
          this.permenentDistrictList = this.responseModel.data;
          this.permenentDistrictList = this.permenentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          let permenentdistrictName = this.permenentDistrictList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentDistrictId != null && data.value == this.savingsBankCommunicationModel.permanentDistrictId);
          if (permenentdistrictName != null && undefined != permenentdistrictName) {
            this.savingsBankCommunicationModel.permanentDistrictName = permenentdistrictName.label;
            this.sameAsPerAddr(this.flag);
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

  /**
   * @implements get all distrcts List
   * @author jyothi.naidana
   */
  getAllDistrcts() {
    this.savingsBankCommunicationService.getDistrictsList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.districtsList = this.responseModel.data;
            this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
          let district = this.districtsList.find((data: any) => null != data && this.savingsBankCommunicationModel.districtId  != null && data.value == this.savingsBankCommunicationModel.districtId);
            if (district != null && undefined != district && district.label != null && district.label != undefined)
              this.savingsBankCommunicationModel.stateName = district.label;
        }
      }
      // this.getAllMandal();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  
  /**
   * @implements get mandals by District Id
   * @param id 
   * @author jyothi.naidana
   */
  getMandalsByByDistrctId(id: any) {
    this.savingsBankCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
        this.mandalsList = this.responseModel.data;
        this.mandalsList = this.mandalsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let subDistrict = this.mandalsList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentSubDistrictId  != null && data.value == this.savingsBankCommunicationModel.subDistrictId);
          if (subDistrict != null && undefined != subDistrict)
              this.savingsBankCommunicationModel.subDistrictName = subDistrict.label;
            // this.sameAsPerAddr(this.flag);
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
   * @implements get permenent Mandals By disctrict Id
   * @param id 
   * @author jyothi.naidana
   */
  getPermenentMandalsByByPermenentDistrctId(id: any) {
    this.savingsBankCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
        this.permenentMandalsList = this.responseModel.data;
        this.permenentMandalsList = this.permenentMandalsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
          let permenentdistrictName = this.permenentMandalsList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentSubDistrictId  != null && data.value == this.savingsBankCommunicationModel.permanentSubDistrictId);
          if (permenentdistrictName != null && undefined != permenentdistrictName)
              this.savingsBankCommunicationModel.permanentSubDistrictName = permenentdistrictName.label;
          this.sameAsPerAddr(this.flag);
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
  
  /**
   * @implements get all mandals 
   * @author jyothi.naidana
   */
  getAllMandal() {
    this.savingsBankCommunicationService.getMandalsList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.mandalsList = this.responseModel.data;
            this.mandalsList = this.mandalsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
          let subDistrict = this.mandalsList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentSubDistrictId  != null && data.value == this.savingsBankCommunicationModel.subDistrictId);
          if (subDistrict != null && undefined != subDistrict)
              this.savingsBankCommunicationModel.subDistrictName = subDistrict.label;
          let permenentdistrictName = this.mandalsList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentSubDistrictId  != null && data.value == this.savingsBankCommunicationModel.permanentSubDistrictId);
          if (permenentdistrictName != null && undefined != permenentdistrictName)
              this.savingsBankCommunicationModel.permanentSubDistrictName = permenentdistrictName.label;
        }
      }
      this.getAllVillages();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  /**
   * @implements get all villages by Mandal
   * @param id \
   * @author jyothi.naidana
   */
  getAllVilagesByMandalId(id: any) {
    this.savingsBankCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; blockId:any; divisionId:any}) => {
              return { label: relationType.name, value: relationType.id,  block:relationType.blockId ,division:relationType.divisionId};
            });
          let subDistrict = this.villageList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentVillageId != null &&  data.value == this.savingsBankCommunicationModel.villageId);
            if (subDistrict != null && undefined != subDistrict)
              this.savingsBankCommunicationModel.villageName = subDistrict.label;
            // this.sameAsPerAddr(this.flag);
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

  /**
   * @implements get permenent Villages by Mandal Id
   * @param id 
   * @author jyothi.naidana
   */
  getPermenentVilagesByPermenetMandalId(id: any) {
    this.savingsBankCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
            this.permenentVillagesList = this.responseModel.data;
            this.permenentVillagesList = this.permenentVillagesList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; divisionId:any,blockId:any}) => {
              return { label: relationType.name, value: relationType.id, divisionId:relationType.divisionId ,blockId:relationType.blockId};
            });
          let permenentdistrictName = this.permenentVillagesList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentVillageId != null && data.value == this.savingsBankCommunicationModel.permanentVillageId);
            if (permenentdistrictName != null && undefined != permenentdistrictName)
              this.savingsBankCommunicationModel.permanentVillageName = permenentdistrictName.label;

            let object = this.permenentVillagesList.find((obj: any) => obj.value == this.savingsBankCommunicationModel.permanentVillageId);
            if (object != null && object != undefined) {
              this.savingsBankCommunicationModel.permanentDivisionId = object.divisionId;
              this.savingsBankCommunicationModel.permanentBlockId = object.blockId;
            }
            this.sameAsPerAddr(this.flag);
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
  /**
   * @implements get all villages
   * @author jyothi.naidana
   */
  getAllVillages() {
    this.savingsBankCommunicationService.getVillageList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; blockId:any; divisionId:any}) => {
              return { label: relationType.name, value: relationType.id,  block:relationType.blockId ,division:relationType.divisionId};
            });
          }
        let subDistrict = this.villageList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentVillageId != null &&  data.value == this.savingsBankCommunicationModel.villageId);
          if (subDistrict != null && undefined != subDistrict)
            this.savingsBankCommunicationModel.subDistrictName = subDistrict.label;
        let permenentdistrictName = this.villageList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentVillageId != null && data.value == this.savingsBankCommunicationModel.permanentVillageId);
          if (permenentdistrictName != null && undefined != permenentdistrictName)
            this.savingsBankCommunicationModel.permanentVillageName = permenentdistrictName.label;
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
   * @implements get sb application details by Id
   * @param id 
   * @author jyothi.naidana
   */
  getSbAccountDetailsById(id: any) {
    this.savingBankApplicationService.getSbApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.savingBankApplicationModel = this.responseModel.data[0];
              if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
                this.savingsBankCommunicationModel.admissionNumber  =  this.responseModel.data[0].admissionNumber;
                this.admissionNumber  =  this.responseModel.data[0].admissionNumber;
              }
              if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
                this.savingsBankCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
              }
              if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined){
                this.savingsBankCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
              }
              if(this.responseModel.data[0].id != null && this.responseModel.data[0].id != undefined){
                this.sbAccId = this.responseModel.data[0].id;
              }
              if (this.savingBankApplicationModel.sbCommunicationDTO != null && this.savingBankApplicationModel.sbCommunicationDTO != undefined) {
                this.savingsBankCommunicationModel = this.savingBankApplicationModel.sbCommunicationDTO;
              if(this.savingsBankCommunicationModel.isSameAddress != null && this.savingsBankCommunicationModel.isSameAddress != undefined){
                 this.sameAsPerAddr(this.flag);
                 this.loadMasterAddressDetails(this.savingsBankCommunicationModel);
              }
                this.updateData();
              }
              else{
                if(this.admissionNumber != null && this.admissionNumber != undefined){
                  this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
                  this.getMemberGroupDetailsByGroupAdmissionNumber(this.admissionNumber);
                  this.getMemberInstitutionDetailsByAdmissionNumber(this.admissionNumber);
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
  /**
   * @implements onChange states
   * @param stateId 
   * @author jyothi.naidana
   */
  onChangeStates(stateId: any) {
    if(this.savingsBankCommunicationModel.stateId != null && this.savingsBankCommunicationModel.stateId != undefined && this.statesList != null && this.statesList != undefined && this.statesList.length > 0){
      let relationshiptype = this.statesList.find((data: any) => null != data && this.savingsBankCommunicationModel.stateId != null && data.value == this.savingsBankCommunicationModel.stateId);
      if (relationshiptype != null && undefined != relationshiptype)
          this.savingsBankCommunicationModel.stateName = relationshiptype.label;
    }
    this.getDistrictByStateId(stateId);
  }

  /**
   * @implements onChange District
   * @param districtId 
   * @author jyothi.naidana
   */
  onChangeDistricts(districtId: any) {
    if(this.savingsBankCommunicationModel.districtId != null && this.savingsBankCommunicationModel.districtId != undefined && this.districtsList != null && this.districtsList != undefined && this.districtsList.length > 0){
      let relationshiptype = this.districtsList.find((data: any) => null != data && this.savingsBankCommunicationModel.districtId != null && data.value == this.savingsBankCommunicationModel.districtId);
      if (relationshiptype != null && undefined != relationshiptype)
          this.savingsBankCommunicationModel.districtName = relationshiptype.label;
    }
    this.getMandalsByByDistrctId(districtId);
    this.savingsBankCommunicationModel.subDistrictId = null;
    this.savingsBankCommunicationModel.villageId = null;
    this.savingsBankCommunicationModel.pincode = null;
    this.savingsBankCommunicationModel.address1 = null;
    this.mandalsList = [];
    this.villageList = [];
  }

  /**
   *@author jyothi.naidana
   * @implements on change mandal 
   * @param madalId
   */
  onChangeMandals(mandalId: any) {
    if(this.savingsBankCommunicationModel.subDistrictId != null && this.savingsBankCommunicationModel.subDistrictId != undefined && this.mandalsList != null && this.mandalsList != undefined && this.mandalsList.length > 0){
      let relationshiptype = this.mandalsList.find((data: any) => null != data && this.savingsBankCommunicationModel.subDistrictId != null && data.value == this.savingsBankCommunicationModel.subDistrictId);
      if (relationshiptype != null && undefined != relationshiptype)
          this.savingsBankCommunicationModel.subDistrictName = relationshiptype.label;
    }
    this.getAllVilagesByMandalId(mandalId);
    this.savingsBankCommunicationModel.villageId = null;
    this.savingsBankCommunicationModel.villageName = null;
    this.savingsBankCommunicationModel.pincode = null;
    this.savingsBankCommunicationModel.address1 = null;
    this.villageList = [];
  }

  /**
   * @implements onChange permenent District
   * @param stateId
   * @author jyothi.naidana
   */
  onChangePermenentDistricts(stateId : any){
    this.savingsBankCommunicationModel.permanentDistrictId = null;
    this.savingsBankCommunicationModel.permanentDistrictName = null;
    this.savingsBankCommunicationModel.permanentSubDistrictId = null;
    this.savingsBankCommunicationModel.permanentSubDistrictName = null;
    this.savingsBankCommunicationModel.permanentVillageId = null;
    this.savingsBankCommunicationModel.permanentVillageName = null;
    this.savingsBankCommunicationModel.permanentPinCode = null;
    this.savingsBankCommunicationModel.permanentAddress1 = null;
    this.permenentDistrictList = [];
    this.permenentMandalsList = [];
    this.permenentVillagesList = [];
      this.getPermenentDistrictByPermenetStateId(stateId);

  }

  /**
   * @implements onChange Permenent Mandal
   * @param districtId 
   * @author jyothi.naidana
   */
  onChangePermenentMandals(districtId : any){
    this.savingsBankCommunicationModel.permanentSubDistrictId = null;
    this.savingsBankCommunicationModel.permanentVillageId = null;
    this.savingsBankCommunicationModel.permanentPinCode = null;
    this.savingsBankCommunicationModel.permanentAddress1 = null;
    this.permenentMandalsList = [];
    this.permenentVillagesList = [];
    this.getPermenentMandalsByByPermenentDistrctId(districtId);

    this.onChangeDistricts(districtId);
    
  }

  /**
   * @implements onChange permenent Village 
   * @param mandalId 
   * @author jyothi.naidana
   */
  onChangePermenentVillagesByPermenentMandals(mandalId : any){
    this.savingsBankCommunicationModel.permanentPinCode = null;
    this.savingsBankCommunicationModel.permanentAddress1 = null;
    this.permenentVillagesList = [];
    this.getPermenentVilagesByPermenetMandalId(mandalId);
    this.onChangeMandals(mandalId);
  }
  
  /**
   * @implements loan master address data
   * @param obj 
   * @author jyothi.naidana
   */
  loadMasterAddressDetails(obj: any) {
    this.getDistrictByStateId(obj.stateId);
    this.getMandalsByByDistrctId(obj.districtId);
    this.getAllVilagesByMandalId(obj.villageId);
    if(obj != null && obj != undefined){
      if (obj.permanentStateId != null && obj.permanentStateId != undefined) {
        this.getPermenentDistrictByPermenetStateId(obj.permanentStateId);
      }
      if (obj.permanentDistrictId != null && obj.permanentDistrictId != undefined) {
        this.getPermenentMandalsByByPermenentDistrctId(obj.permanentDistrictId);
      }
      if (obj.permanentSubDistrictId != null && obj.permanentSubDistrictId != undefined) {
        this.getPermenentVilagesByPermenetMandalId(obj.permanentSubDistrictId);
      }
    }
  }

  /**
   *@author jyothi.naidana
   * @implements set member communication details to sb communication details  
   * @param obj membercommunicationmodel
   */
  loadMasterDataListMemberModule(obj: any) {
    this.getAllDistrcts();
    this.getAllMandal();
    this.getAllVillages();
    if (obj != null && obj != undefined) {
      if (obj.permanentStateId != null && obj.permanentStateId != undefined) {
        this.savingsBankCommunicationModel.permanentStateId = obj.permanentStateId;
        this.getPermenentDistrictByPermenetStateId(obj.permanentStateId);
      }
      if (obj.permanentDistrictId != null && obj.permanentDistrictId != undefined) {
        this.savingsBankCommunicationModel.permanentDistrictId = obj.permanentDistrictId;
        this.getPermenentMandalsByByPermenentDistrctId(obj.permanentDistrictId);
      }
      if (obj.permanentSubDistrictId != null && obj.permanentSubDistrictId != undefined) {
        this.savingsBankCommunicationModel.permanentSubDistrictId = obj.permanentSubDistrictId;
        this.getPermenentVilagesByPermenetMandalId(obj.permanentSubDistrictId);
      }
      if (obj.permanentVillageId != null && obj.permanentVillageId != undefined) {
        this.savingsBankCommunicationModel.permanentVillageId = obj.permanentVillageId;
       
      }
      if (obj.permanentPinCode != null && obj.permanentPinCode != undefined) {
        this.savingsBankCommunicationModel.permanentPinCode = obj.permanentPinCode;
      }
      if (obj.pinCode != null && obj.pinCode != undefined) {
        this.savingsBankCommunicationModel.pincode = obj.pinCode;
      }
      if (obj.permanentAddress1 != null) {
        this.savingsBankCommunicationModel.permanentAddress1 = obj.permanentAddress1;
      }
    }
  }

  /**
   * @implements append pincode
   * @author jyothi.naidana
   */
  appendPinCodeToPermenent() {
    if (this.savingsBankCommunicationModel != null && this.savingsBankCommunicationModel != undefined && this.savingsBankCommunicationModel.isSameAddress != null && this.savingsBankCommunicationModel.isSameAddress != undefined && this.savingsBankCommunicationModel.isSameAddress) {
      if(this.savingsBankCommunicationModel.permanentPinCode != null && this.savingsBankCommunicationModel.permanentPinCode != undefined){
        this.savingsBankCommunicationModel.pincode = this.savingsBankCommunicationModel.permanentPinCode;
      }
      if(this.savingsBankCommunicationModel.permanentAddress1 != null && this.savingsBankCommunicationModel.permanentAddress1 != undefined){
        this.savingsBankCommunicationModel.address1 = this.savingsBankCommunicationModel.permanentAddress1;
      }
    }
  }
/**
   *@author jyothi.naidana
   * @implements on change Villages 
   * @param villageId
   */
  onChangeVillageId(villageId:any){
    if(this.savingsBankCommunicationModel.villageId != null && this.savingsBankCommunicationModel.villageId != undefined && this.villageList != null && this.villageList != undefined && this.villageList.length > 0){
      let relationshiptype = this.villageList.find((data: any) => null != data && this.savingsBankCommunicationModel.villageId != null && data.value == this.savingsBankCommunicationModel.villageId);
      if (relationshiptype != null && undefined != relationshiptype){
          this.savingsBankCommunicationModel.villageName = relationshiptype.label;
          this.savingsBankCommunicationModel.permanentDivisionId = relationshiptype.division;
          this.savingsBankCommunicationModel.permanentBlockId = relationshiptype.block; 
      }
      let object =  this.permenentVillagesList.find((obj:any)=> obj.value == this.savingsBankCommunicationModel.villageId);
      if(object != null && object != undefined){
        this.savingsBankCommunicationModel.divisionId = object.divisionId;
        this.savingsBankCommunicationModel.blockId = object.blockId ;
      }

    }
    
  }

  /**
   * @implements onChange permenent Village
   * @author jyothi.naidana
   */
  onChangePermenentVillage(PermVillageId:any){
    this.communicationForm.get('permenentAddressOne')?.reset();
    this.communicationForm.get('permenentPinCode')?.reset();
    if(this.savingsBankCommunicationModel.permanentVillageId != null && this.savingsBankCommunicationModel.permanentVillageId != undefined && this.villageList != null && this.villageList != undefined && this.villageList.length > 0){
      let relationshiptype = this.villageList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentVillageId != null && data.value == this.savingsBankCommunicationModel.permanentVillageId);
      if (relationshiptype != null && undefined != relationshiptype){
          this.savingsBankCommunicationModel.permanentVillageName = relationshiptype.label;
          this.savingsBankCommunicationModel.permanentDivisionId = relationshiptype.division;
          this.savingsBankCommunicationModel.permanentBlockId = relationshiptype.block; 
      }          
    }
    
    if (this.savingsBankCommunicationModel != null && this.savingsBankCommunicationModel != undefined && this.savingsBankCommunicationModel.isSameAddress != null && this.savingsBankCommunicationModel.isSameAddress != undefined &&  this.savingsBankCommunicationModel.isSameAddress) {
      this.savingsBankCommunicationModel.villageId = PermVillageId;
      if(this.savingsBankCommunicationModel.subDistrictId != null && this.savingsBankCommunicationModel.subDistrictId != undefined){
        this.getAllVilagesByMandalId(this.savingsBankCommunicationModel.subDistrictId);
      }
      this.savingsBankCommunicationModel.pincode = null;
      this.savingsBankCommunicationModel.address1 = null;
    }
  }

/**
 * @implements get all division List 
 * @author jyothi.naidana
 */
  getAlldivisionList(){
    this.savingsBankCommunicationService.getAllDivisionList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.divisionList = this.responseModel.data;
            this.divisionList = this.divisionList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id};
            });
          }
        let division = this.divisionList.find((data: any) => null != data && this.savingsBankCommunicationModel.divisionId != null &&  data.value == this.savingsBankCommunicationModel.divisionId);
          if (division != null && undefined != division)
            this.savingsBankCommunicationModel.divisionName = division.label;

        division = this.divisionList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentDivisionId != null &&  data.value == this.savingsBankCommunicationModel.permanentDivisionId);
          if (division != null && undefined != division)
            this.savingsBankCommunicationModel.permanentDistrictName = division.label;
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
   * @implements get all block list
   * @author jyothi.naidana
   *    */
  getAllBlockList(){
    this.savingsBankCommunicationService.getBlockList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.blockList = this.responseModel.data;
            this.blockList = this.blockList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id};
            });
          }
        let block = this.blockList.find((data: any) => null != data && this.savingsBankCommunicationModel.blockId != null &&  data.value == this.savingsBankCommunicationModel.blockId);
          if (block != null && undefined != block)
            this.savingsBankCommunicationModel.blockName = block.label;
         block = this.blockList.find((data: any) => null != data && this.savingsBankCommunicationModel.permanentBlockId != null &&  data.value == this.savingsBankCommunicationModel.permanentBlockId);
          if (block != null && undefined != block)
            this.savingsBankCommunicationModel.permanentBlockName = block.label;
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
}
