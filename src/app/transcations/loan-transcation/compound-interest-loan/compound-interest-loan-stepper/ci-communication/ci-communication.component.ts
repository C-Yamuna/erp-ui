import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiLoanCommunication } from './shared/ci-communication.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { StatesService } from 'src/app/configurations/common-config/state/shared/states.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { MembershipDetailsService } from '../ci-membership-details/shared/membership-details.service';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-ci-communication',
  templateUrl: './ci-communication.component.html',
  styleUrls: ['./ci-communication.component.css']
})
export class CiCommunicationComponent {
  responseModel!: Responsemodel;
  communicationForm: FormGroup;
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
  ciLoanApplicationId: any
  admissionNumber: any;
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciLoanCommunicationModel: CiLoanCommunication = new CiLoanCommunication();
  orgnizationSetting: any;
  accountNumber: any;
  memberTypeName: any;
  showForm: boolean = false;
  id:any;
  divisionList: any[]=[];
  blockList: any[]=[];




  constructor(private router: Router, private formBuilder: FormBuilder, 
    private ciLoanApplicationService: CiLoanApplicationService,
    private membershipDetailsService: MembershipDetailsService,
    private commonComponent: CommonComponent, 
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService, 
    private statesService: StatesService,
    private commonFunctionsService: CommonFunctionsService, 
    private datePipe: DatePipe) {
    this.communicationForm = this.formBuilder.group({
      "stateName": new FormControl('', Validators.required),
      "districtName": new FormControl('', Validators.required),
      "subDistrictName": new FormControl('', Validators.required),
      "villageName": new FormControl('', Validators.required),
      "address1": new FormControl('', Validators.required),
      "pinCode": new FormControl('', Validators.required),
      "permanentStateName": new FormControl('', Validators.required),
      "permanentDistrictName": new FormControl('', Validators.required),
      "permanentSubDistrictName": new FormControl('', Validators.required),
      "permanentVillageName": new FormControl('', Validators.required),
      "permanentAddress1": new FormControl('', Validators.required),
      "permanentPinCode": new FormControl('', Validators.required),
      "isSameAddress": new FormControl('',),
      "checked": new FormControl('',),
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
          let id = Number(this.encryptDecryptService.decrypt(params['id']));
          this.ciLoanApplicationId = Number(id);
          this.getCiLoanApplicationsById();
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
    this.getAlldivisionList();
    this.getAllBlockList();
  }

  updateData() {
    if (this.ciLoanApplicationId != null && this.ciLoanApplicationId != undefined)
      this.ciLoanCommunicationModel.ciLoanApplicationId = this.ciLoanApplicationId;
    if(this.accountNumber != null && this.accountNumber != undefined)
      this. ciLoanCommunicationModel.accountNumber = this.accountNumber;
    this. ciLoanCommunicationModel.memberType = this.ciLoanApplicationModel.memberTypeId;
    this.ciLoanApplicationService.changeData({
      formValid: !this.communicationForm.valid ? true : false,
      data: this.ciLoanCommunicationModel,
      isDisable: (!this.communicationForm.valid),
      stepperIndex: 2,
    });
  }
  save() {
    this.updateData();
  }


  /**
   * @implements get ci Loan application by id
   * @author jyothi.naidana
   */
  getCiLoanApplicationsById() {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(this.ciLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined)
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined)
                this.accountNumber = this.responseModel.data[0].accountNumber;
              if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined)
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.ciLoanApplicationModel = this.responseModel.data[0];
              if (this.ciLoanApplicationModel != null && this.ciLoanApplicationModel != undefined)
                if (this.ciLoanApplicationModel.ciLoanCommunicationDTO != null && this.ciLoanApplicationModel.ciLoanCommunicationDTO != undefined
                 ) {
                  this.ciLoanCommunicationModel = this.ciLoanApplicationModel.ciLoanCommunicationDTO;
                  this.setAllFields();
                }
                else {
                  if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL)
                    this.getmembershipBasicDetailsByAdmissionNumber(this.admissionNumber);
                  else if (this.memberTypeName == MemberShipTypesData.GROUP)
                    this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
                  else if (this.memberTypeName == MemberShipTypesData.INSTITUTION)
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
    if (this.ciLoanCommunicationModel.isSameAddress != null && this.ciLoanCommunicationModel.isSameAddress != undefined) {
      if (this.ciLoanCommunicationModel.isSameAddress == true) {
        this.communicationForm.get('stateName')?.disable();
        this.communicationForm.get('districtName')?.disable();
        this.communicationForm.get('subDistrictName')?.disable();
        this.communicationForm.get('villageName')?.disable();
        this.communicationForm.get('address1')?.disable();
        this.communicationForm.get('pinCode')?.disable();
        this.RegAddressToComAddress();
      }
    }
    if (this.ciLoanCommunicationModel.stateId != null)
      this.getAllDistrictsByStateId(this.ciLoanCommunicationModel.stateId, false)
    if (this.ciLoanCommunicationModel.districtId != null)
      this.getAllSubDistrictByDistrictId(this.ciLoanCommunicationModel.districtId, false)
    if (this.ciLoanCommunicationModel.subDistrictId != null)
      this.getAllVillagesBySubDistrictId(this.ciLoanCommunicationModel.subDistrictId, false)

    if (this.ciLoanCommunicationModel.permanentStateId != null)
      this.getAllPermanentDistrictsByStateId(this.ciLoanCommunicationModel.permanentStateId, false)
    if (this.ciLoanCommunicationModel.permanentDistrictId != null)
      this.getAllPermanentSubDistrictByDistrictId(this.ciLoanCommunicationModel.permanentDistrictId, false)
    if (this.ciLoanCommunicationModel.permanentSubDistrictId != null)
      this.getAllPermanentVillagesBySubDistrictId(this.ciLoanCommunicationModel.permanentSubDistrictId, false)
    
  }

  getmembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    this.membershipDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined){
              this.ciLoanCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
              this.ciLoanCommunicationModel.memberShipId = null;
              this.ciLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
              // if (this.responseModel.data[0].memberShipCommunicationDetailsDTO.admissionNumber != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO.admissionNumber != undefined)
              //   this.ciLoanCommunicationModel.admissionNumber = this.responseModel.data[0].memberShipCommunicationDetailsDTO.admissionNumber;
              this.setAllFields();
            }
            this.updateData();
          }
        }
      } else {
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

  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.membershipDetailsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipGroupDetailsModel = this.responseModel.data[0];
          if (this.responseModel.data[0].groupCommunicationList != null && this.responseModel.data[0].groupCommunicationList != undefined &&
            this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
            this.ciLoanCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
            this.ciLoanCommunicationModel.memberShipId = null;
            if (this.ciLoanCommunicationModel.memberType != null && this.ciLoanCommunicationModel.memberType != undefined)
              this.memberTypeName = this.ciLoanCommunicationModel.memberType;
            this.ciLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
            this.ciLoanCommunicationModel.pincode = this.responseModel.data[0].groupCommunicationList[0].pincode;
            this.ciLoanCommunicationModel.permanentPinCode = this.responseModel.data[0].groupCommunicationList[0].permanentPincode;
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
    this.membershipDetailsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.ciLoanCommunicationModel.memberShipId = null;
          if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined &&
            this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
            this.ciLoanCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
            if (this.ciLoanCommunicationModel.memberType != null && this.ciLoanCommunicationModel.memberType != undefined)
              this.memberTypeName = this.ciLoanCommunicationModel.memberType;
            this.ciLoanCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
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
    this.ciLoanApplicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.statesList = this.responseModel.data;
            this.statesList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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
    });
  }

  getAllDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('districtName')?.reset();
      this.communicationForm.get('subDistrictName')?.reset();
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('division')?.reset();
      this.communicationForm.get('block')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pinCode')?.reset();
      
      this.districtsList = [];
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.ciLoanApplicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtsList = this.responseModel.data;
        this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const state = this.statesList.find((item: { value: any; }) => item.value === id);
        this.ciLoanCommunicationModel.stateName = state.label;
        // this.sameAsRegisterAddress();
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
      this.communicationForm.get('subDistrictName')?.reset();
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pinCode')?.reset();
      this.communicationForm.get('division')?.reset();
      this.communicationForm.get('block')?.reset();
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.ciLoanApplicationService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.subDistrictList = this.responseModel.data;
        this.subDistrictList = this.subDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const district = this.districtsList.find((item: { value: any; }) => item.value === id);
        this.ciLoanCommunicationModel.districtName = district.label;
        // this.sameAsRegisterAddress();
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
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pinCode')?.reset();
      this.communicationForm.get('division')?.reset();
      this.communicationForm.get('block')?.reset();
      this.villageList = [];
    }
    this.ciLoanApplicationService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; blockId:any; divisionId:any}) => {
              return { label: relationType.name, value: relationType.id,  block:relationType.blockId ,division:relationType.divisionId};
            });
            const subDistrictName = this.subDistrictList.find((item: { value: any; }) => item.value === id);
            if(subDistrictName != null && subDistrictName != undefined)
              this.ciLoanCommunicationModel.subDistrictName = subDistrictName.label;
            // this.sameAsRegisterAddress();

            const villageName = this.villageList.find((item: { value: any; }) => item.value === this.ciLoanCommunicationModel.villageId);
            if(villageName != null && villageName != undefined)
              this.ciLoanCommunicationModel.villageName = villageName.label;

            let object =  this.villageList.find((obj:any)=> obj.value == this.ciLoanCommunicationModel.villageId);
            if(object != null && object != undefined){
              this.ciLoanCommunicationModel.divisionId = object.division;
              this.ciLoanCommunicationModel.divisionName = this.getDivisionName(this.ciLoanCommunicationModel.divisionId);
              this.ciLoanCommunicationModel.blockId = object.block ;
              this.ciLoanCommunicationModel.blockName = this.getBlockName( this.ciLoanCommunicationModel.blockId );
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

  /**
   * @implements filter division name
   * @param divisionId 
   * @returns 
   */
  getDivisionName(divisionId:any){
    let divisionName ;
    let obj = this.divisionList.find((obj:any)=>obj.value == divisionId);
    if(obj != null && obj != undefined){
      divisionName = obj.label;
    }
    return divisionName;
  }

  /**
   * @implements filter block name
   * @param blockId 
   * @returns 
   * @author jyothi.naidana
   */
  getBlockName(blockId :any){
    let blockName ;
    let obj = this.blockList.find((obj:any)=>obj.value == blockId);
    if(obj != null && obj != undefined){
      blockName = obj.label;
    }
    return blockName;
  }

  /**
   * @implements village name 
   * @param id 
   * @author jyothi.naidana
   */
  getVillage(id: any) {
    const villageName = this.villageList.find((item: { value: any; }) => item.value === id);
    if(villageName != null && villageName != undefined)
      this.ciLoanCommunicationModel.villageName = villageName.label;
    
    this.communicationForm.get('address1')?.reset();
    this.communicationForm.get('pinCode')?.reset();
    this.communicationForm.get('division')?.reset();
    this.communicationForm.get('block')?.reset();
    this.sameAsRegisterAddress();
  }

  getAllPermanentStatesList() {
    this.ciLoanApplicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentStatesList = this.responseModel.data;
            this.permanentStatesList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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

  getAllPermanentDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentDistrictName')?.reset();
      this.communicationForm.get('permanentSubDistrictName')?.reset();
      this.communicationForm.get('permanentVillageName')?.reset();
      this.communicationForm.get('permanentDivision')?.reset();
      this.communicationForm.get('permanentBlock')?.reset();
      this.communicationForm.get('permanentAddress1')?.reset();
      this.communicationForm.get('permanentPinCode')?.reset();
      this.ciLoanCommunicationModel.permanentBlockId = null;
      this.ciLoanCommunicationModel.permanentDivisionId = null;
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.ciLoanApplicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentDistrictList = this.responseModel.data;
        this.permanentDistrictList = this.permanentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
        if(perState != null && perState != undefined)
          this.ciLoanCommunicationModel.permanentStateName = perState.label;
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

  getAllPermanentSubDistrictByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentSubDistrictName')?.reset();
      this.communicationForm.get('permanentVillageName')?.reset();
      this.communicationForm.get('permanentDivision')?.reset();
      this.communicationForm.get('permanentBlock')?.reset();
      this.communicationForm.get('permanentAddress1')?.reset();
      this.communicationForm.get('permanentPinCode')?.reset();
      this.ciLoanCommunicationModel.permanentBlockId = null;
      this.ciLoanCommunicationModel.permanentDivisionId = null;
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.ciLoanApplicationService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentSubDistrictList = this.responseModel.data;
        this.permanentSubDistrictList = this.permanentSubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.permanentDistrictList.find((item: { value: any; }) => item.value === id);
        this.ciLoanCommunicationModel.permanentDistrictName = perDistrict.label;
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

  /**
   * @implements get all permanent villages by subdistrict id
   * @param id 
   * @param isResetIds 
   * @author jyothi.naidana
   */
  getAllPermanentVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentVillageName')?.reset();
      this.communicationForm.get('permanentDivision')?.reset();
      this.communicationForm.get('permanentBlock')?.reset();
      this.communicationForm.get('permanentAddress1')?.reset();
      this.communicationForm.get('permanentPinCode')?.reset();
      this.ciLoanCommunicationModel.permanentBlockId = null;
      this.ciLoanCommunicationModel.permanentDivisionId = null;
      this.permanentVillageList = [];
    }
    this.ciLoanApplicationService.getvillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentVillageList = this.responseModel.data;
            this.permanentVillageList = this.permanentVillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; blockId:any; divisionId:any}) => {
              return { label: relationType.name, value: relationType.id,  block:relationType.blockId ,division:relationType.divisionId};
            });
            const persubDistrictName = this.permanentSubDistrictList.find((item: { value: any; }) => item.value === id);
            if(persubDistrictName != null && persubDistrictName != undefined)
              this.ciLoanCommunicationModel.permanentSubDistrictName = persubDistrictName.label;
            let object = this.permanentVillageList.find((obj: any) => obj.value == this.ciLoanCommunicationModel.permanentVillageId);
            if (object != null && object != undefined) {
              this.ciLoanCommunicationModel.permanentDivisionId = object.division;
              this.ciLoanCommunicationModel.permanentDivisionName = this.getDivisionName(this.ciLoanCommunicationModel.divisionId);
              this.ciLoanCommunicationModel.permanentBlockId = object.block;
              this.ciLoanCommunicationModel.permanentBlockName = this.getBlockName(this.ciLoanCommunicationModel.blockId);
            }
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

  /**
   * @implements get permanent Village
   * @param id 
   * @author jyothi.naidana
   */
  getPermanentVillage(id: any) {
    const perVillage = this.permanentVillageList.find((item: { value: any; }) => item.value === id);
    if(perVillage != null && perVillage != undefined)
      this.ciLoanCommunicationModel.permanentVillageName = perVillage.label;
    let object =  this.permanentVillageList.find((obj:any)=> obj.value == id);
    if(object != null && object != undefined){
      this.ciLoanCommunicationModel.permanentDivisionId = object.division;
      this.ciLoanCommunicationModel.permanentDivisionName = this.getDivisionName(this.ciLoanCommunicationModel.permanentDivisionId);
      this.ciLoanCommunicationModel.permanentBlockId = object.block ;
      this.ciLoanCommunicationModel.permanentBlockName = this.getBlockName(this.ciLoanCommunicationModel.permanentBlockId );
    }
    this.sameAsRegisterAddress();
  }

  /**
   * @implements same as pegistrationAddress
   * @author jyothi.naidana
   */
  sameAsRegisterAddress() {
    if (this.ciLoanCommunicationModel.isSameAddress == true) {
      this.ciLoanCommunicationModel.permanentStateId = this.ciLoanCommunicationModel.stateId;
      if (this.ciLoanCommunicationModel.districtId != this.ciLoanCommunicationModel.permanentDistrictId) {
        this.ciLoanCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.ciLoanCommunicationModel.permanentStateId, false);
        this.ciLoanCommunicationModel.districtId = this.ciLoanCommunicationModel.permanentDistrictId;
      }
      if (this.ciLoanCommunicationModel.subDistrictId != this.ciLoanCommunicationModel.permanentSubDistrictId) {
        this.ciLoanCommunicationModel.subDistrictId = null;
        this.getAllSubDistrictByDistrictId(this.ciLoanCommunicationModel.permanentDistrictId, false);
        this.ciLoanCommunicationModel.subDistrictId = this.ciLoanCommunicationModel.permanentSubDistrictId;
        
      }
      if (this.ciLoanCommunicationModel.villageId != this.ciLoanCommunicationModel.permanentVillageId) {
        this.ciLoanCommunicationModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.ciLoanCommunicationModel.permanentSubDistrictId, false);
        this.ciLoanCommunicationModel.villageId = this.ciLoanCommunicationModel.permanentVillageId;
      }
      this.ciLoanCommunicationModel.blockId = this.ciLoanCommunicationModel.permanentBlockId;
      this.ciLoanCommunicationModel.divisionId = this.ciLoanCommunicationModel.permanentDivisionId;
      this.ciLoanCommunicationModel.pincode= this.ciLoanCommunicationModel.permanentPinCode;
      this.ciLoanCommunicationModel.address1= this.ciLoanCommunicationModel.permanentAddress1;
    }
    else {
      let object =  this.villageList.find((obj:any)=> obj.value == this.ciLoanCommunicationModel.villageId);
      if(object != null && object != undefined){
        this.ciLoanCommunicationModel.divisionId = object.division;
        this.ciLoanCommunicationModel.divisionName = this.getDivisionName(this.ciLoanCommunicationModel.divisionId);
        this.ciLoanCommunicationModel.blockId = object.block ;
        this.ciLoanCommunicationModel.blockName = this.getBlockName( this.ciLoanCommunicationModel.blockId );
      }
    }
  }

  /**
   * @implements same as per address
   * @param isSameAddress 
   * @author jyothi.naidana
   */
  sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.ciLoanCommunicationModel.isSameAddress = applicationConstants.TRUE;
      this.communicationForm.get('stateName')?.reset();
      this.communicationForm.get('districtName')?.reset();
      this.communicationForm.get('subDistrictName')?.reset();
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pinCode')?.reset();
      
      this.communicationForm.get('stateName')?.disable();
      this.communicationForm.get('districtName')?.disable();
      this.communicationForm.get('subDistrictName')?.disable();
      this.communicationForm.get('villageName')?.disable();
      this.communicationForm.get('address1')?.disable();
      this.communicationForm.get('pinCode')?.disable();

      this.ciLoanCommunicationModel.stateId = null;
       this.ciLoanCommunicationModel.stateId = this.ciLoanCommunicationModel.permanentStateId ;
      if (this.ciLoanCommunicationModel.districtId != this.ciLoanCommunicationModel.permanentDistrictId) {
        this.ciLoanCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.ciLoanCommunicationModel.permanentStateId, false);
        this.ciLoanCommunicationModel.districtId = this.ciLoanCommunicationModel.permanentDistrictId;
      }
      if (this.ciLoanCommunicationModel.subDistrictId != this.ciLoanCommunicationModel.permanentSubDistrictId) {
        this.ciLoanCommunicationModel.subDistrictId = null;
        this.getAllSubDistrictByDistrictId(this.ciLoanCommunicationModel.permanentDistrictId, false);
        this.ciLoanCommunicationModel.subDistrictId = this.ciLoanCommunicationModel.permanentSubDistrictId;
      }
      if (this.ciLoanCommunicationModel.villageId != this.ciLoanCommunicationModel.permanentVillageId) {
        this.ciLoanCommunicationModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.ciLoanCommunicationModel.permanentSubDistrictId, false);
        this.ciLoanCommunicationModel.villageId = this.ciLoanCommunicationModel.permanentVillageId;
        
      }
      this.ciLoanCommunicationModel.address1 = this.ciLoanCommunicationModel.permanentAddress1;
      this.ciLoanCommunicationModel.pincode = this.ciLoanCommunicationModel.permanentPinCode;
    }
    else {
      this.ciLoanCommunicationModel.isSameAddress = applicationConstants.FALSE;
      this.communicationForm.get('stateName')?.reset();
      this.communicationForm.get('districtName')?.reset();
      this.communicationForm.get('subDistrictName')?.reset();
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pinCode')?.reset();
      this.districtsList = [];
      this.subDistrictList = [];
      this.villageList = [];

      this.communicationForm.get('stateName')?.enable();
      this.communicationForm.get('districtName')?.enable();
      this.communicationForm.get('subDistrictName')?.enable();
      this.communicationForm.get('villageName')?.enable();
      this.communicationForm.get('address1')?.enable();
      this.communicationForm.get('pinCode')?.enable();

      this.ciLoanCommunicationModel.stateId = null;
      this.ciLoanCommunicationModel.districtId= null;
      this.ciLoanCommunicationModel.subDistrictId = null;
      this.ciLoanCommunicationModel.villageId = null;
      this.ciLoanCommunicationModel.address1 = null;
      this.ciLoanCommunicationModel.pincode = null;
      this.ciLoanCommunicationModel.divisionId= null;
      this.ciLoanCommunicationModel.blockId = null;
    }
    this.updateData();
  }

  RegAddressToComAddress() {
    if (this.ciLoanCommunicationModel.isSameAddress == true) {
      this.ciLoanCommunicationModel.address1 = this.ciLoanCommunicationModel.permanentAddress1;
      this.ciLoanCommunicationModel.pincode = this.ciLoanCommunicationModel.permanentPinCode;
    }
  }

  /**
 * @implements get all division List 
 * @author jyothi.naidana
 */
  getAlldivisionList(){
    this.ciLoanApplicationService.getAllDivisionList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.divisionList = this.responseModel.data;
            this.divisionList = this.divisionList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id};
            });
          }
        let division = this.divisionList.find((data: any) => null != data && this.ciLoanCommunicationModel.divisionId != null &&  data.value == this.ciLoanCommunicationModel.divisionId);
          if (division != null && undefined != division)
            this.ciLoanCommunicationModel.divisionName = division.label;

        division = this.divisionList.find((data: any) => null != data && this.ciLoanCommunicationModel.permanentDivisionId != null &&  data.value == this.ciLoanCommunicationModel.permanentDivisionId);
          if (division != null && undefined != division)
            this.ciLoanCommunicationModel.permanentDistrictName = division.label;
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
    this.ciLoanApplicationService.getBlockList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.blockList = this.responseModel.data;
            this.blockList = this.blockList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id};
            });
          }
        let block = this.blockList.find((data: any) => null != data && this.ciLoanCommunicationModel.blockId != null &&  data.value == this.ciLoanCommunicationModel.blockId);
          if (block != null && undefined != block)
            this.ciLoanCommunicationModel.blockName = block.label;
         block = this.blockList.find((data: any) => null != data && this.ciLoanCommunicationModel.permanentBlockId != null &&  data.value == this.ciLoanCommunicationModel.permanentBlockId);
          if (block != null && undefined != block)
            this.ciLoanCommunicationModel.permanentBlockName = block.label;
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
