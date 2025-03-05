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
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

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
  mandalsList: any[] = [];
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
  permenentStatesList: any[] = [];
  permenentMandalsList: any[] = [];
  permenentVillagesList: any[] = [];
  permenentDistrictList: any[] = [];

  permenentSubDistrictList: any[] = [];
  permenentVillageList: any[] = [];
  permanentStatesList: any[] = [];
  orgnizationSetting: any;
  id: any;
  memberTypeName: any;
  blocksList: any[] = [];
  divisionList: any[] = [];


  constructor(private router: Router, private formBuilder: FormBuilder, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private saoCommunicationService: SaoCommunicationService, private saoLoanApplicationService: SaoLoanApplicationService,
    private membershipBasicDetailsService: MembershipBasicDetailsService, private datePipe: DatePipe, private commonComponent: CommonComponent, private commonFunctionsService: CommonFunctionsService,

  ) {
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
  save() {
    this.updateData();
  }
  getAllStatesList() {
    this.saoCommunicationService.getstatesList().subscribe((response: any) => {
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

  getSaoLoanApplicationDetailsById(id: any) {
    debugger
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
  setAllFields() {
    debugger
    if (this.saoCommunicationModel.isSameAddress != null && this.saoCommunicationModel.isSameAddress != undefined) {
      if (this.saoCommunicationModel.isSameAddress == true) {
        this.communicationForm.get('stateName').disable();
        this.communicationForm.get('districtId').disable();
        this.communicationForm.get('subDistrictId').disable();
        this.communicationForm.get('villageId').disable();
        this.communicationForm.get('address1').disable();
        this.communicationForm.get('pinCode').disable();
        this.RegAddressToComAddress();
      }
    }
    if (this.saoCommunicationModel.stateId != null)
      this.getAllDistrictsByStateId(this.saoCommunicationModel.stateId, false)
    if (this.saoCommunicationModel.districtId != null)
      this.getAllMandalsByDistrictId(this.saoCommunicationModel.districtId, false)
    if (this.saoCommunicationModel.subDistrictId != null)
      this.getAllVillagesByMandalId(this.saoCommunicationModel.subDistrictId, false)

    if (this.saoCommunicationModel.permanentStateId != null)
      this.getAllPermanentDistrictsByStateId(this.saoCommunicationModel.permanentStateId, false)
    if (this.saoCommunicationModel.permanentDistrictId != null)
      this.getAllPermanentMandalsByDistrictId(this.saoCommunicationModel.permanentDistrictId, false)
    if (this.saoCommunicationModel.permanentSubDistrictId != null)
      this.getAllPermanentVillagesByMandalId(this.saoCommunicationModel.permanentSubDistrictId, false)
  }

  RegAddressToComAddress() {
    if (this.saoCommunicationModel.isSameAddress == applicationConstants.TRUE) {
      this.saoCommunicationModel.address1 = this.saoCommunicationModel.permanentAddress1;
      this.saoCommunicationModel.pinCode = this.saoCommunicationModel.permanentPinCode;
    }
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
    this.saoCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.districtsList = this.responseModel.data;
        this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const state = this.statesList.find((item: { value: any; }) => item.value === id);
        this.saoCommunicationModel.stateName = state.label;
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
    this.saoCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.mandalsList = this.responseModel.data;
        this.mandalsList = this.mandalsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.districtsList.find((item: { value: any; }) => item.value === id);
        this.saoCommunicationModel.districtName = perDistrict.label;
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

  sameAsRegisterAddress() {
    if (this.saoCommunicationModel.isSameAddress == applicationConstants.TRUE) {
      this.saoCommunicationModel.stateId = this.saoCommunicationModel.permanentStateId;
      if (this.saoCommunicationModel.permanentDistrictId != this.saoCommunicationModel.districtId) {
        this.saoCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.saoCommunicationModel.stateId, false);
        this.saoCommunicationModel.districtId = this.saoCommunicationModel.permanentDistrictId;
      }
      if (this.saoCommunicationModel.permanentSubDistrictId != this.saoCommunicationModel.subDistrictId) {
        this.saoCommunicationModel.subDistrictId = null;
        this.getAllMandalsByDistrictId(this.saoCommunicationModel.districtId,false);
        this.saoCommunicationModel.subDistrictId = this.saoCommunicationModel.permanentSubDistrictId;
      }
      if (this.saoCommunicationModel.permanentVillageId != this.saoCommunicationModel.villageId) {
        this.saoCommunicationModel.villageId = null;
        this.getAllVillagesByMandalId(this.saoCommunicationModel.subDistrictId,false);
        this.saoCommunicationModel.villageId = this.saoCommunicationModel.permanentVillageId;

      }
      if (this.saoCommunicationModel.address1 != this.saoCommunicationModel.permanentAddress1) {
        this.saoCommunicationModel.address1 = null;
        this.saoCommunicationModel.address1 = this.saoCommunicationModel.permanentAddress1;
      }
      if (this.saoCommunicationModel.pinCode != this.saoCommunicationModel.permanentPinCode) {
        this.saoCommunicationModel.pinCode = null;
        this.saoCommunicationModel.pinCode = this.saoCommunicationModel.permanentPinCode;
      }

      if (this.saoCommunicationModel.divisionId != this.saoCommunicationModel.permanentDivisionId) {
        this.saoCommunicationModel.divisionId = null;
        this.saoCommunicationModel.divisionId = this.saoCommunicationModel.permanentDivisionId;
      }
      if (this.saoCommunicationModel.blockId != this.saoCommunicationModel.permanentBlockId) {
        this.saoCommunicationModel.blockId = null;
        this.saoCommunicationModel.blockId = this.saoCommunicationModel.permanentBlockId;
      }
       this.getVillage(this.saoCommunicationModel.villageId,false);
       this.getPermanentVillage(this.saoCommunicationModel.permanentVillageId,false)
      //  this.getAllPermanentVillagesByMandalId(this.saoCommunicationModel.permanentSubDistrictId, false)

    }
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
      this.permenentDistrictList = [];
      this.permenentSubDistrictList = [];
      this.permenentVillageList = [];
    }
    this.saoCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permenentDistrictList = this.responseModel.data;
        this.permenentDistrictList = this.permenentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
        this.saoCommunicationModel.permanentStateName = perState.label;
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
    this.saoCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.permenentSubDistrictList = this.responseModel.data;
        this.permenentSubDistrictList = this.permenentSubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        const perDistrict = this.permenentDistrictList.find((item: { value: any; }) => item.value === id);
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
  
 
  getAllPermanentVillagesByMandalId(id: any, isResetIds: any) {
      if (isResetIds) {
        this.communicationForm.get('permanentVillageId').reset();
        this.communicationForm.get('permanentAddress1').reset();
        this.communicationForm.get('permanentPinCode').reset();
        this.communicationForm.get('permanentDivision').reset();
        this.communicationForm.get('permanentBlock').reset();
        this.permenentVillageList = [];
      }
      this.saoCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.permenentVillageList = this.responseModel.data;
              this.permenentVillageList = this.permenentVillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id, data: relationType };
              });
              const perMandal = this.permenentSubDistrictList.find((item: { value: any; }) => item.value === id);
              this.saoCommunicationModel.permanentSubDistrictName = perMandal.label;
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

  getPermanentVillage(id: any, isResetIds: any) {
    if(isResetIds){
      this.communicationForm.get('permanentAddress1').reset();
      this.communicationForm.get('permanentPinCode').reset();
    }
    this.saoCommunicationModel.permanentBlockId = null;
    this.saoCommunicationModel.permanentDivisionId = null;
    this.saoCommunicationModel.permanentBlockName = null;
    this.saoCommunicationModel.permanentDivisionName = null;
    let perVillage= this.permenentVillageList.find((obj:any) => null != obj && id != null && obj.value === id);
    if(perVillage != null && undefined != perVillage)
    this.saoCommunicationModel.permanentVillageName = perVillage.label;
    if(perVillage.data != null && perVillage.data != undefined){
      this.getPermanentBlock(perVillage.data.blockId);
      this.getPermanentDivision(perVillage.data.divisionId);
    }
    this.sameAsRegisterAddress();
  }
 
  getPermanentDivision(id:any){
    let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
    if(division != null && undefined != division)
     this.saoCommunicationModel.permanentDivisionId = division.value
     this.saoCommunicationModel.permanentDivisionName = division.label
   }
   getPermanentBlock(id:any){
     let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
     if(block != null && undefined != block)
      this.saoCommunicationModel.permanentBlockId = block.value
     this.saoCommunicationModel.permanentBlockName = block.label
    }
   
    getDivision(id:any){
      let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
      if(division != null && undefined != division)
       this.saoCommunicationModel.divisionId = division.value
       this.saoCommunicationModel.divisionName = division.label
     }
     getBlock(id:any){
       let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
       if(block != null && undefined != block)
        this.saoCommunicationModel.blockId = block.value
        this.saoCommunicationModel.blockName = block.label
      }
  

  getVillage(id: any, isResetIds: any) {
    if(isResetIds){
      this.communicationForm.get('address1').reset();
      this.communicationForm.get('pinCode').reset();
    }
    this.saoCommunicationModel.divisionId = null;;
    this.saoCommunicationModel.divisionName = null;
    this.saoCommunicationModel.blockId = null;;
    this.saoCommunicationModel.blockName = null;
    const village = this.villageList.find((item: { value: any; }) => item.value === id);
    this.saoCommunicationModel.villageName = village.label;
    this.getBlock(village.data.blockId);
    this.getDivision(village.data.divisionId);
    // this.sameAsRegisterAddress();
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
      this.saoCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.villageList = this.responseModel.data;
              this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id, data:relationType};
              });
              const mandal = this.mandalsList.find((item: { value: any; }) => item.value === id);
              this.saoCommunicationModel.subDistrictName = mandal.label;
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

    sameAsPerAddr(isSameAddress: any) {
      debugger
      if (isSameAddress) {
        this.saoCommunicationModel.isSameAddress = applicationConstants.TRUE;
        this.communicationForm.get('pinCode').reset();
        this.communicationForm.get('stateName').disable();
        this.communicationForm.get('districtId').disable();
        this.communicationForm.get('subDistrictId').disable();
        this.communicationForm.get('villageId').disable();
        this.communicationForm.get('address1').disable();
        this.communicationForm.get('pinCode').disable();
        
        this.saoCommunicationModel.stateId = this.saoCommunicationModel.permanentStateId;
        if (this.saoCommunicationModel.permanentDistrictId != this.saoCommunicationModel.districtId) {
          this.saoCommunicationModel.districtId = null;
          this.getAllDistrictsByStateId(this.saoCommunicationModel.stateId, false);
          this.saoCommunicationModel.districtId = this.saoCommunicationModel.permanentDistrictId;
        }
        if (this.saoCommunicationModel.permanentSubDistrictId != this.saoCommunicationModel.subDistrictId) {
          this.saoCommunicationModel.subDistrictId = null;
          this.getAllMandalsByDistrictId(this.saoCommunicationModel.districtId, false);
          this.saoCommunicationModel.subDistrictId = this.saoCommunicationModel.permanentSubDistrictId;
        }
        if (this.saoCommunicationModel.permanentVillageId != this.saoCommunicationModel.villageId) {
          this.saoCommunicationModel.villageId = null;
          this.getAllVillagesByMandalId(this.saoCommunicationModel.subDistrictId, false);
          this.saoCommunicationModel.villageId = this.saoCommunicationModel.permanentVillageId;
          // this.getPerVillage(this.saoCommunicationModel.permanentVillageId);
        }
        this.saoCommunicationModel.address1 = this.saoCommunicationModel.permanentAddress1;
        // this.fdNonCumulativeCommunicationModel.permanentAddress2 = this.fdNonCumulativeCommunicationModel.address2;
        this.saoCommunicationModel.pinCode = this.saoCommunicationModel.permanentPinCode;
        this.saoCommunicationModel.blockId = this.saoCommunicationModel.permanentBlockId;
        this.saoCommunicationModel.blockName = this.saoCommunicationModel.permanentBlockName;
  
        this.saoCommunicationModel.divisionId = this.saoCommunicationModel.permanentDivisionId;
        this.saoCommunicationModel.divisionName = this.saoCommunicationModel.permanentDivisionName;
  
  
      }
      else {
        this.saoCommunicationModel.isSameAddress = applicationConstants.FALSE;
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
  
        this.saoCommunicationModel.stateId = null;
        this.saoCommunicationModel.districtId = null;
        this.saoCommunicationModel.subDistrictId = null;
        this.saoCommunicationModel.villageId = null;
        this.saoCommunicationModel.address1 = null;
        this.saoCommunicationModel.pinCode = null;
        this.saoCommunicationModel.blockId = null;
        this.saoCommunicationModel.divisionId = null;
  
      }
      this.updateData();
    }

    getAllBlockList() {
        this.saoCommunicationService.getAllBlock().subscribe((response: any) => {
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
    
      getAlldivisionList() {
        this.saoCommunicationService.getAllDivision().subscribe((response: any) => {
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
}


