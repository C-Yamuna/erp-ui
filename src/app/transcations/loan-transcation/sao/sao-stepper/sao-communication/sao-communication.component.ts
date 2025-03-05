import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaoCommunication } from './shared/sao-communication.model';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SaoCommunicationService } from './shared/sao-communication.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { MembershipBasicDetailsService } from '../membership-basic-details/shared/membership-basic-details.service';
import { GroupPromotersModel, IndividualMemberDetailsModel, InstitutionPromoterDetailsModel, MemInstitutionModel, MemberShipGroupDetailsModel } from '../membership-basic-details/shared/membership-basic-details.model';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';

@Component({
  selector: 'app-sao-communication',
  templateUrl: './sao-communication.component.html',
  styleUrls: ['./sao-communication.component.css']
})
export class SaoCommunicationComponent {
  communicationForm: any;
  gender: any[] | undefined;
  admissionNumber: any;
  statesList: any[] = [];
  districtsList: any[] = [];
  subDistrictList: any[] = [];
  villageList: any[] = [];
  msgs: any[] = [];
  savedId: any;
  isEdit: any;
  flagForLabelName: any;
  responseModel!: Responsemodel;
  checked: any;
  sameAsPermanentAddress: boolean = false;
  saoCommunicationModel: SaoCommunication = new SaoCommunication;
  saoLoanApplicatonModel: SaoLoanApplication = new SaoLoanApplication();
  individualMemberDetailsModel: IndividualMemberDetailsModel = new IndividualMemberDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  groupPromotersModel: GroupPromotersModel = new GroupPromotersModel();
  memberShipGroupDetailsModel: MemberShipGroupDetailsModel = new MemberShipGroupDetailsModel();
  memInstitutionModel: MemInstitutionModel = new MemInstitutionModel();
  loanId: any;
  accountNumber: any;
  requstedAmount: any;
  memberTypeId: any;
  flag: boolean = false;
  permanentStatesList: any[] = [];
  permanentSubDistrictList: any[] = [];
  permanentVillageList: any[] = [];
  permanentDistrictList: any[] = [];
  blockList: any[] = [];
  permanentBlockList: any[] = [];
  divisionList: any[] = [];
  permanentDivisionList: any[] = [];
  constructor(private router: Router, private formBuilder: FormBuilder, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private saoCommunicationService: SaoCommunicationService, private saoLoanApplicationService: SaoLoanApplicationService,
    private membershipBasicDetailsService: MembershipBasicDetailsService, private datePipe: DatePipe, private commonComponent: CommonComponent
  ) {
    this.communicationForm = this.formBuilder.group({
      stateName: ['', [Validators.required]],
      districtName: ['', [Validators.required]],
      subDistrictName: ['', [Validators.required]],
      villageName: ['', [Validators.required]],
      pincode: new FormControl('', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.required]),
      address1: ['', [Validators.required]],
      isSameAddress: [''],
      permanentStateName: ['', [Validators.required]],
      permanentDistrictName: ['', [Validators.required]],
      permanentSubDistrictName: ['', [Validators.required]],
      permanentVillageName: ['', [Validators.required]],
      permanentAddress1: ['', [Validators.required]],
      permanentPinCode: new FormControl('', [Validators.pattern(applicationConstants.PINCODE_PATTERN), Validators.required]),
      divisionName: new FormControl({ value: '', disabled: true }),
      blockName: new FormControl({ value: '', disabled: true }),
      permanentDivisionName: new FormControl({ value: '', disabled: true }),
      permanentBlockName: new FormControl({ value: '', disabled: true }),
    })
  }
  ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNumber'] != undefined) {

        if (params['id'] != undefined) {
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          let qParams = queryParams;
          this.savedId = qParams;
          // this.getCommunicationDetailsByLoanApplicationId(this.savedId);
          this.getSaoLoanApplicationDetailsById(this.savedId);
        }

        if (params['admissionNumber'] != undefined) {
          this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNumber']);
          this.getMemberDetailsByAdmissionNumber(this.admissionNumber);

        }
        this.isEdit = true;

        if (this.saoCommunicationModel != null && this.saoCommunicationModel != null)
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
    this.getAllStatesList();
    this.getAllPermanentStatesList();
    this.getAllBlockList();
    this.getAlldivisionList();
  }
  updateData() {
    if (this.statesList != null && this.statesList != undefined && this.statesList.length > 0) {
      let permanentState = this.statesList.find((data: any) => null != data && this.saoCommunicationModel.stateId != null && data.value == this.saoCommunicationModel.permanentStateId);
      if (permanentState != null && undefined != permanentState) {
        this.saoCommunicationModel.permanentStateName = permanentState.label;
      }
    }
    this.saoCommunicationModel.saoLoanApplicationId = this.loanId;
    this.saoCommunicationModel.admissionNumber = this.admissionNumber;
    this.saoLoanApplicationService.changeData({
      formValid: !this.communicationForm.valid ? true : false,
      data: this.saoCommunicationModel,
      isDisable: (!this.communicationForm.valid),
      // isDisable:false,
      stepperIndex: 1,
    });
  }
  save() {
    this.updateData();
  }
  getSaoLoanApplicationDetailsById(id: any) {
    this.saoLoanApplicationService.getSaoLoanApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.saoLoanApplicatonModel = this.responseModel.data[0];
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.saoCommunicationModel.admissionNumber = this.responseModel.data[0].admissionNo;
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
              this.saoCommunicationModel.memberTypeName = this.responseModel.data[0].memberTypeName;
            }
            if (this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined) {
              this.saoCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
            }
            if (this.responseModel.data[0].id != null && this.responseModel.data[0].id != undefined) {
              this.loanId = this.responseModel.data[0].id;
            }
            if (this.saoLoanApplicatonModel.saoLoanCommunicationDTO != null && this.saoLoanApplicatonModel.saoLoanCommunicationDTO != undefined) {
              this.saoCommunicationModel = this.saoLoanApplicatonModel.saoLoanCommunicationDTO;

              // this.loadMasterAddressDetails(this.saoCommunicationModel);
              // this.sameAsPerAddr(this.flag);
              this.setAllFields();
              this.updateData();
            }
            else {
              if (this.admissionNumber != null && this.admissionNumber != undefined) {
                this.getMemberDetailsByAdmissionNumber(this.admissionNumber);

              }
            }
          }
        }
      }
    });
  }
  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.individualMemberDetailsModel = this.responseModel.data[0];
          // if (this.responseModel.data[0].memberShipCommunicationDetailsDTOList[0] != null && this.responseModel.data[0].memberShipCommunicationDetailsDTOList[0] != undefined)
          //   this.saoCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTOList[0];
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined)
            this.saoCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;

          if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
            this.saoCommunicationModel.admissionNumber = this.responseModel.data[0].admissionNumber;
          }
          if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
            this.saoLoanApplicatonModel.memberTypeName = this.responseModel.data[0].memberTypeName;
          }
          if (this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined) {
            this.saoCommunicationModel.memberType = this.responseModel.data[0].memberTypeId;
          }
          if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined) {
            // this.loadMasterDataListMemberModule(this.saoCommunicationModel);
          }
          this.saoCommunicationModel.id = null;
          this.setAllFields();
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
   /**
   * @implements same as per address
   * @param isSameAddress 
   * @author jyothi.naidana
   */
   sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.saoCommunicationModel.isSameAddress = applicationConstants.TRUE;
      this.communicationForm.get('stateName')?.reset();
      this.communicationForm.get('districtName')?.reset();
      this.communicationForm.get('subDistrictName')?.reset();
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pincode')?.reset();
      
      this.communicationForm.get('stateName')?.disable();
      this.communicationForm.get('districtName')?.disable();
      this.communicationForm.get('subDistrictName')?.disable();
      this.communicationForm.get('villageName')?.disable();
      this.communicationForm.get('address1')?.disable();
      this.communicationForm.get('pincode')?.disable();

      this.saoCommunicationModel.stateId = null;
       this.saoCommunicationModel.stateId = this.saoCommunicationModel.permanentStateId ;
      if (this.saoCommunicationModel.districtId != this.saoCommunicationModel.permanentDistrictId) {
        this.saoCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.saoCommunicationModel.permanentStateId, false);
        this.saoCommunicationModel.districtId = this.saoCommunicationModel.permanentDistrictId;
      }
      if (this.saoCommunicationModel.subDistrictId != this.saoCommunicationModel.permanentSubDistrictId) {
        this.saoCommunicationModel.subDistrictId = null;
        this.getAllSubDistrictByDistrictId(this.saoCommunicationModel.permanentDistrictId, false);
        this.saoCommunicationModel.subDistrictId = this.saoCommunicationModel.permanentSubDistrictId;
      }
      if (this.saoCommunicationModel.villageId != this.saoCommunicationModel.permanentVillageId) {
        this.saoCommunicationModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.saoCommunicationModel.permanentSubDistrictId, false);
        this.saoCommunicationModel.villageId = this.saoCommunicationModel.permanentVillageId;
        
      }
      this.saoCommunicationModel.address1 = this.saoCommunicationModel.permanentAddress1;
      this.saoCommunicationModel.pincode = this.saoCommunicationModel.permanentPinCode;
    }
    else {
      this.saoCommunicationModel.isSameAddress = applicationConstants.FALSE;
      this.communicationForm.get('stateName')?.reset();
      this.communicationForm.get('districtName')?.reset();
      this.communicationForm.get('subDistrictName')?.reset();
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pincode')?.reset();
      this.districtsList = [];
      this.subDistrictList = [];
      this.villageList = [];

      this.communicationForm.get('stateName')?.enable();
      this.communicationForm.get('districtName')?.enable();
      this.communicationForm.get('subDistrictName')?.enable();
      this.communicationForm.get('villageName')?.enable();
      this.communicationForm.get('address1')?.enable();
      this.communicationForm.get('pincode')?.enable();

      this.saoCommunicationModel.stateId = null;
      this.saoCommunicationModel.districtId= null;
      this.saoCommunicationModel.subDistrictId = null;
      this.saoCommunicationModel.villageId = null;
      this.saoCommunicationModel.address1 = null;
      this.saoCommunicationModel.pincode = null;
      this.saoCommunicationModel.divisionId= null;
      this.saoCommunicationModel.blockId = null;
    }
    this.updateData();
  }
  sameAsRegisterAddress() {
    if (this.saoCommunicationModel.isSameAddress == true) {
      this.saoCommunicationModel.permanentStateId = this.saoCommunicationModel.stateId;
      if (this.saoCommunicationModel.districtId != this.saoCommunicationModel.permanentDistrictId) {
        this.saoCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.saoCommunicationModel.permanentStateId, false);
        this.saoCommunicationModel.districtId = this.saoCommunicationModel.permanentDistrictId;
      }
      if (this.saoCommunicationModel.subDistrictId != this.saoCommunicationModel.permanentSubDistrictId) {
        this.saoCommunicationModel.subDistrictId = null;
        this.getAllSubDistrictByDistrictId(this.saoCommunicationModel.permanentDistrictId, false);
        this.saoCommunicationModel.subDistrictId = this.saoCommunicationModel.permanentSubDistrictId;

      }
      if (this.saoCommunicationModel.villageId != this.saoCommunicationModel.permanentVillageId) {
        this.saoCommunicationModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.saoCommunicationModel.permanentSubDistrictId, false);
        this.saoCommunicationModel.villageId = this.saoCommunicationModel.permanentVillageId;
      }
      this.saoCommunicationModel.blockId = this.saoCommunicationModel.permanentBlockId;
      this.saoCommunicationModel.divisionId = this.saoCommunicationModel.permanentDivisionId;
      this.saoCommunicationModel.pincode = this.saoCommunicationModel.permanentPinCode;
      this.saoCommunicationModel.address1 = this.saoCommunicationModel.permanentAddress1;
    }
    else {
      let object = this.villageList.find((obj: any) => obj.value == this.saoCommunicationModel.villageId);
      if (object != null && object != undefined) {
        this.saoCommunicationModel.divisionId = object.divisionId;
        this.saoCommunicationModel.divisionName = this.getDivisionName(this.saoCommunicationModel.divisionId);
        this.saoCommunicationModel.blockId = object.blockId;
        this.saoCommunicationModel.blockName = this.getBlockName(this.saoCommunicationModel.blockId);
      }
    }
  }
  RegAddressToComAddress() {
    if (this.saoCommunicationModel.isSameAddress == true) {
      this.saoCommunicationModel.address1 = this.saoCommunicationModel.permanentAddress1;
      this.saoCommunicationModel.pincode = this.saoCommunicationModel.permanentPinCode;
    }
  }
  setAllFields() {
    if (this.saoCommunicationModel.isSameAddress != null && this.saoCommunicationModel.isSameAddress != undefined) {
      if (this.saoCommunicationModel.isSameAddress == true) {
        this.communicationForm.get('stateName')?.disable();
        this.communicationForm.get('districtName')?.disable();
        this.communicationForm.get('subDistrictName')?.disable();
        this.communicationForm.get('villageName')?.disable();
        this.communicationForm.get('address1')?.disable();
        this.communicationForm.get('pincode')?.disable();
        this.RegAddressToComAddress();
      }
    }
    if (this.saoCommunicationModel.stateId != null)
      this.getAllDistrictsByStateId(this.saoCommunicationModel.stateId, false)
    if (this.saoCommunicationModel.districtId != null)
      this.getAllSubDistrictByDistrictId(this.saoCommunicationModel.districtId, false)
    if (this.saoCommunicationModel.subDistrictId != null)
      this.getAllVillagesBySubDistrictId(this.saoCommunicationModel.subDistrictId, false)

    if (this.saoCommunicationModel.permanentStateId != null)
      this.getAllPermanentDistrictsByStateId(this.saoCommunicationModel.permanentStateId, false)
    if (this.saoCommunicationModel.permanentDistrictId != null)
      this.getAllPermanentSubDistrictByDistrictId(this.saoCommunicationModel.permanentDistrictId, false)
    if (this.saoCommunicationModel.permanentSubDistrictId != null)
      this.getAllPermanentVillagesBySubDistrictId(this.saoCommunicationModel.permanentSubDistrictId, false)

  }
  getAllStatesList() {
    this.saoCommunicationService.getstatesList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
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
    });
  }
  getAllPermanentStatesList() {
    this.saoCommunicationService.getstatesList().subscribe((response: any) => {
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
  /**
  * @implements get all divisionId List 
  * @author akhila
  */
  getAlldivisionList() {
    this.saoCommunicationService.getAllDivisionList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.divisionList = this.responseModel.data;
            this.divisionList = this.divisionList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
          let divisionId = this.divisionList.find((data: any) => null != data && this.saoCommunicationModel.divisionId != null && data.value == this.saoCommunicationModel.divisionId);
          if (divisionId != null && undefined != divisionId)
            this.saoCommunicationModel.divisionName = divisionId.label;

          divisionId = this.divisionList.find((data: any) => null != data && this.saoCommunicationModel.permanentDivisionId != null && data.value == this.saoCommunicationModel.permanentDivisionId);
          if (divisionId != null && undefined != divisionId)
            this.saoCommunicationModel.permanentDivisionName = divisionId.label;
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

  /**
   * @implements get all blockId list
   * @author akhila
   *    */
  getAllBlockList() {
    this.saoCommunicationService.getBlockList().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.blockList = this.responseModel.data;
            this.blockList = this.blockList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id };
            });
          }
          let blockId = this.blockList.find((data: any) => null != data && this.saoCommunicationModel.blockId != null && data.value == this.saoCommunicationModel.blockId);
          if (blockId != null && undefined != blockId)
            this.saoCommunicationModel.blockName = blockId.label;
          blockId = this.blockList.find((data: any) => null != data && this.saoCommunicationModel.permanentBlockId != null && data.value == this.saoCommunicationModel.permanentBlockId);
          if (blockId != null && undefined != blockId)
            this.saoCommunicationModel.permanentBlockName = blockId.label;
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
  /**
      * @implements filter divisionId name
      * @param divisionId 
      * @returns 
      */
  getDivisionName(divisionId: any) {
    let divisionName;
    let obj = this.divisionList.find((obj: any) => obj.value == divisionId);
    if (obj != null && obj != undefined) {
      divisionName = obj.label;
    }
    return divisionName;
  }

  /**
   * @implements filter blockId name
   * @param blockId 
   * @returns 
   * @author akhila
   */
  getBlockName(blockId: any) {
    let blockName;
    let obj = this.blockList.find((obj: any) => obj.value == blockId);
    if (obj != null && obj != undefined) {
      blockName = obj.label;
    }
    return blockName;
  }
  getAllDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('districtName')?.reset();
      this.communicationForm.get('subDistrictName')?.reset();
      this.communicationForm.get('villageName')?.reset();
      this.communicationForm.get('divisionId')?.reset();
      this.communicationForm.get('blockId')?.reset();
      this.communicationForm.get('address1')?.reset();
      this.communicationForm.get('pincode')?.reset();

      this.districtsList = [];
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.saoCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtsList = this.responseModel.data;
        this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const state = this.statesList.find((item: { value: any; }) => item.value === id);
        this.saoCommunicationModel.stateName = state.label;
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
      this.communicationForm.get('pincode')?.reset();
      this.communicationForm.get('divisionId')?.reset();
      this.communicationForm.get('blockId')?.reset();
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.saoCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.subDistrictList = this.responseModel.data;
        this.subDistrictList = this.subDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const district = this.districtsList.find((item: { value: any; }) => item.value === id);
        this.saoCommunicationModel.districtName = district.label;
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
      this.communicationForm.get('pincode')?.reset();
      this.communicationForm.get('divisionId')?.reset();
      this.communicationForm.get('blockId')?.reset();
      this.villageList = [];
    }
    this.saoCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; blockId: any; divisionId: any }) => {
              return { label: relationType.name, value: relationType.id, blockId: relationType.blockId, divisionId: relationType.divisionId };
            });
            const subDistrictName = this.subDistrictList.find((item: { value: any; }) => item.value === id);
            if (subDistrictName != null && subDistrictName != undefined)
              this.saoCommunicationModel.subDistrictName = subDistrictName.label;
            // this.sameAsRegisterAddress();

            const villageName = this.villageList.find((item: { value: any; }) => item.value === this.saoCommunicationModel.villageId);
            if (villageName != null && villageName != undefined)
              this.saoCommunicationModel.villageName = villageName.label;

            let object = this.villageList.find((obj: any) => obj.value == this.saoCommunicationModel.villageId);
            if (object != null && object != undefined) {
              this.saoCommunicationModel.divisionId = object.divisionId;
              this.saoCommunicationModel.divisionName = this.getDivisionName(this.saoCommunicationModel.divisionId);
              this.saoCommunicationModel.blockId = object.blockId;
              this.saoCommunicationModel.blockName = this.getBlockName(this.saoCommunicationModel.blockId);
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
  getAllPermanentDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentDistrictName')?.reset();
      this.communicationForm.get('permanentSubDistrictName')?.reset();
      this.communicationForm.get('permanentVillageName')?.reset();
      this.communicationForm.get('permanentDivisionName')?.reset();
      this.communicationForm.get('permanentBlockName')?.reset();
      this.communicationForm.get('permanentAddress1')?.reset();
      this.communicationForm.get('permanentPinCode')?.reset();
      this.saoCommunicationModel.permanentBlockId = null;
      this.saoCommunicationModel.permanentDivisionId = null;
      this.permanentDistrictList = [];
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.saoCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentDistrictList = this.responseModel.data;
        this.permanentDistrictList = this.permanentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
        if (perState != null && perState != undefined)
          this.saoCommunicationModel.permanentStateName = perState.label;
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
      this.communicationForm.get('permanentDivisionName')?.reset();
      this.communicationForm.get('permanentBlockName')?.reset();
      this.communicationForm.get('permanentAddress1')?.reset();
      this.communicationForm.get('permanentPinCode')?.reset();
      this.saoCommunicationModel.permanentBlockId = null;
      this.saoCommunicationModel.permanentDivisionId = null;
      this.permanentSubDistrictList = [];
      this.permanentVillageList = [];
    }
    this.saoCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permanentSubDistrictList = this.responseModel.data;
        this.permanentSubDistrictList = this.permanentSubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.permanentDistrictList.find((item: { value: any; }) => item.value === id);
        this.saoCommunicationModel.permanentDistrictName = perDistrict.label;
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
   * @author akhila
   */
  getAllPermanentVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationForm.get('permanentVillageName')?.reset();
      this.communicationForm.get('permanentDivisionName')?.reset();
      this.communicationForm.get('permanentBlockName')?.reset();
      this.communicationForm.get('permanentAddress1')?.reset();
      this.communicationForm.get('permanentPinCode')?.reset();
      this.saoCommunicationModel.permanentBlockId = null;
      this.saoCommunicationModel.permanentDivisionId = null;
      this.permanentVillageList = [];
    }
    this.saoCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permanentVillageList = this.responseModel.data;
            this.permanentVillageList = this.permanentVillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; blockId: any; divisionId: any }) => {
              return { label: relationType.name, value: relationType.id, blockId: relationType.blockId, divisionId: relationType.divisionId };
            });
            const persubDistrictName = this.permanentSubDistrictList.find((item: { value: any; }) => item.value === id);
            if (persubDistrictName != null && persubDistrictName != undefined)
              this.saoCommunicationModel.permanentSubDistrictName = persubDistrictName.label;
            let object = this.permanentVillageList.find((obj: any) => obj.value == this.saoCommunicationModel.permanentVillageId);
            if (object != null && object != undefined) {
              this.saoCommunicationModel.permanentDivisionId = object.divisionId;
              this.saoCommunicationModel.permanentDivisionName = this.getDivisionName(this.saoCommunicationModel.divisionId);
              this.saoCommunicationModel.permanentBlockId = object.blockId;
              this.saoCommunicationModel.permanentBlockName = this.getBlockName(this.saoCommunicationModel.blockId);
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
   * @author akhila
   */
  getPermanentVillage(id: any) {
    const perVillage = this.permanentVillageList.find((item: { value: any; }) => item.value === id);
    if(perVillage != null && perVillage != undefined)
      this.saoCommunicationModel.permanentVillageName = perVillage.label;
    let object =  this.permanentVillageList.find((obj:any)=> obj.value == id);
    if(object != null && object != undefined){
      this.saoCommunicationModel.permanentDivisionId = object.divisionId;
      this.saoCommunicationModel.permanentDivisionName = this.getDivisionName(this.saoCommunicationModel.permanentDivisionId);
      this.saoCommunicationModel.permanentBlockId = object.blockId ;
      this.saoCommunicationModel.permanentBlockName = this.getBlockName(this.saoCommunicationModel.permanentBlockId );
    }
    this.sameAsRegisterAddress();
  }
  /**
   * @implements village name 
   * @param id 
   * @author akhila
   */
  getVillage(id: any) {
    const villageName = this.villageList.find((item: { value: any; }) => item.value === id);
    if(villageName != null && villageName != undefined)
      this.saoCommunicationModel.villageName = villageName.label;
    
    this.communicationForm.get('address1')?.reset();
    this.communicationForm.get('pincode')?.reset();
    this.communicationForm.get('divisionId')?.reset();
    this.communicationForm.get('blockId')?.reset();
    this.sameAsRegisterAddress();
  }

  getCommunicationDetailsByLoanApplicationId(id: any) {
    this.saoCommunicationService.getCommunicationDetailsByLoanApplicationId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.saoCommunicationModel = this.responseModel.data[0];
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














}
