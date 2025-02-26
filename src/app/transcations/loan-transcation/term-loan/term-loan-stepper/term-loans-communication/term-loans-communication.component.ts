import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanCommunicationService } from './shared/term-loan-communication.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { TermLoanCommunication } from './shared/term-loan-communication.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';

@Component({
  selector: 'app-term-loans-communication',
  templateUrl: './term-loans-communication.component.html',
  styleUrls: ['./term-loans-communication.component.css']
})
export class TermLoansCommunicationComponent {
  communicationForm: any;
  communication: any;
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
  termLoanApplicationModel: TermApplication = new TermApplication();
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
    private termLoanApplicationsService: TermApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private termLoanCommunicationService: TermLoanCommunicationService,
    private commonFunctionsService: CommonFunctionsService,
    private membershipService: TermLoanNewMembershipService,) {
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
            this.getTermApplicationByTermAccId(this.id);
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
        this.termLoanCommunicationModel.termLoanApplicationId = this.id;
      if (this.accountNumber != null && this.accountNumber != undefined)
      this.termLoanCommunicationModel.memberTypeName = this.memberTypeName;
      this.termLoanApplicationsService.changeData({
        formValid: !this.communicationForm.valid ? true : false,
        data: this.termLoanCommunicationModel,
        isDisable: (!this.communicationForm.valid),
        stepperIndex: 2,
      });
    }
    save() {
      this.updateData();
    }
  
    // get call term loan account by id
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
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
                this.termLoanApplicationModel = this.responseModel.data[0];
                if (this.termLoanApplicationModel != null && this.termLoanApplicationModel != undefined)
                  if (this.termLoanApplicationModel.termLoanCommunicationDTO != null && this.termLoanApplicationModel.termLoanCommunicationDTO != undefined &&
                    this.termLoanApplicationModel.termLoanCommunicationDTO[0] != null && this.termLoanApplicationModel.termLoanCommunicationDTO[0] != undefined) {
                    this.termLoanCommunicationModel = this.termLoanApplicationModel.termLoanCommunicationDTO[0];
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
      if (this.termLoanCommunicationModel.isSameAddress != null && this.termLoanCommunicationModel.isSameAddress != undefined) {
        if (this.termLoanCommunicationModel.isSameAddress == true) {
          this.communicationForm.get('stateName').disable();
          this.communicationForm.get('districtId').disable();
          this.communicationForm.get('subDistrictId').disable();
          this.communicationForm.get('villageId').disable();
          this.communicationForm.get('address1').disable();
          this.communicationForm.get('pinCode').disable();
          this.RegAddressToComAddress();
        }
      }
      if (this.termLoanCommunicationModel.stateId != null)
        this.getAllDistrictsByStateId(this.termLoanCommunicationModel.stateId, false)
      if (this.termLoanCommunicationModel.districtId != null)
        this.getAllMandalsByDistrictId(this.termLoanCommunicationModel.districtId, false)
      if (this.termLoanCommunicationModel.subDistrictId != null)
        this.getAllVillagesByMandalId(this.termLoanCommunicationModel.subDistrictId, false)
  
      if (this.termLoanCommunicationModel.permanentStateId != null)
        this.getAllPermanentDistrictsByStateId(this.termLoanCommunicationModel.permanentStateId, false)
      if (this.termLoanCommunicationModel.permanentDistrictId != null)
        this.getAllPermanentMandalsByDistrictId(this.termLoanCommunicationModel.permanentDistrictId, false)
      if (this.termLoanCommunicationModel.permanentSubDistrictId != null)
        this.getAllPermanentVillagesByMandalId(this.termLoanCommunicationModel.permanentSubDistrictId, false)
    }
  
    //Get Member Details from Membership Module by AdmissionNumber
    getMemberDetailsByAdmissionNumber(admissionNumber: any) {
      this.membershipService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined &&
              this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined) {
              this.termLoanCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
              if (this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != undefined)
                this.termLoanCommunicationModel.admissionNumber = this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber;
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
      this.membershipService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGroupDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].groupCommunicationList != null && this.responseModel.data[0].groupCommunicationList != undefined &&
              this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
              this.termLoanCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
              this.termLoanCommunicationModel.pinCode = this.responseModel.data[0].groupCommunicationList[0].pincode;
              if (this.termLoanCommunicationModel.memberTypeName != null && this.termLoanCommunicationModel.memberTypeName != undefined)
                this.memberTypeName = this.termLoanCommunicationModel.memberTypeName;
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
      this.membershipService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined &&
              this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
              this.termLoanCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
              if (this.termLoanCommunicationModel.memberTypeName != null && this.termLoanCommunicationModel.memberTypeName != undefined)
                this.memberTypeName = this.termLoanCommunicationModel.memberTypeName;
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
      this.termLoanCommunicationService.getstatesList().subscribe((response: any) => {
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
      this.termLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.districtsList = this.responseModel.data;
          this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const state = this.statesList.find((item: { value: any; }) => item.value === id);
          this.termLoanCommunicationModel.stateName = state.label;
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
      this.termLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.mandalsList = this.responseModel.data;
          this.mandalsList = this.mandalsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const district = this.districtsList.find((item: { value: any; }) => item.value === id);
          this.termLoanCommunicationModel.districtName = district.label;
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
  
    getAllVillagesByMandalId(id: any, isResetIds: any) {
      if (isResetIds) {
        this.communicationForm.get('villageId').reset();
        this.communicationForm.get('address1').reset();
        this.communicationForm.get('pinCode').reset();
        this.communicationForm.get('division').reset();
        this.communicationForm.get('block').reset();
        this.villageList = [];
      }
      this.termLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.villageList = this.responseModel.data;
              this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id, data:relationType};
              });
              const mandal = this.mandalsList.find((item: { value: any; }) => item.value === id);
              this.termLoanCommunicationModel.subDistrictName = mandal.label;
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
  
    getVillage(id: any) {
      this.termLoanCommunicationModel.divisionId = null;;
      this.termLoanCommunicationModel.divisionName = null;
      this.termLoanCommunicationModel.blockId = null;;
      this.termLoanCommunicationModel.blockName = null;
      const village = this.villageList.find((item: { value: any; }) => item.value === id);
      this.termLoanCommunicationModel.villageName = village.label;
      this.getBlock(village.data.blockId);
      this.getDivision(village.data.divisionId);
      // this.sameAsRegisterAddress();
    }
  
  
    getDivision(id:any){
      let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
      if(division != null && undefined != division)
       this.termLoanCommunicationModel.divisionId = division.value
       this.termLoanCommunicationModel.divisionName = division.label
     }
     getBlock(id:any){
       let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
       if(block != null && undefined != block)
        this.termLoanCommunicationModel.blockId = block.value
        this.termLoanCommunicationModel.blockName = block.label
      }
  
    getAllBocksList() {
      this.termLoanCommunicationService.getAllBlock().subscribe((response: any) => {
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
  
    getAllDivisionList() {
      this.termLoanCommunicationService.getAllDivision().subscribe((response: any) => {
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
      this.termLoanCommunicationService.getstatesList().subscribe((response: any) => {
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
      this.termLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.permenentDistrictList = this.responseModel.data;
          this.permenentDistrictList = this.permenentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
          this.termLoanCommunicationModel.permanentStateName = perState.label;
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
      this.termLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.permenentSubDistrictList = this.responseModel.data;
          this.permenentSubDistrictList = this.permenentSubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const perDistrict = this.permenentDistrictList.find((item: { value: any; }) => item.value === id);
          this.termLoanCommunicationModel.permanentDistrictName = perDistrict.label;
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
      this.termLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.permenentVillageList = this.responseModel.data;
              this.permenentVillageList = this.permenentVillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id, data: relationType };
              });
              const perMandal = this.permenentSubDistrictList.find((item: { value: any; }) => item.value === id);
              this.termLoanCommunicationModel.permanentSubDistrictName = perMandal.label;
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
      this.termLoanCommunicationModel.permanentBlockId = null;;
      this.termLoanCommunicationModel.permanentDivisionId = null;
      this.termLoanCommunicationModel.permanentBlockName = null;;
      this.termLoanCommunicationModel.permanentDivisionName = null;
      let perVillage= this.permenentVillageList.find((obj:any) => null != obj && id != null && obj.value === id);
      if(perVillage != null && undefined != perVillage)
      this.termLoanCommunicationModel.permanentVillageName = perVillage.label;
      if(perVillage.data != null && perVillage.data != undefined){
        this.getPermanentBlock(perVillage.data.blockId);
        this.getPermanentDivision(perVillage.data.divisionId);
      }
      this.sameAsRegisterAddress();
    }
  
    getPermanentDivision(id:any){
      let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
      if(division != null && undefined != division)
       this.termLoanCommunicationModel.permanentDivisionId = division.value
       this.termLoanCommunicationModel.permanentDivisionName = division.label
     }
     getPermanentBlock(id:any){
       let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
       if(block != null && undefined != block)
        this.termLoanCommunicationModel.permanentBlockId = block.value
       this.termLoanCommunicationModel.permanentBlockName = block.label
      }
    // sameAsRegisterAddress() {
    //   if (this.termLoanCommunicationModel.isSameAddress == true) {
    //     this.termLoanCommunicationModel.permanentStateId = this.termLoanCommunicationModel.stateId;
    //     if (this.termLoanCommunicationModel.districtId != this.termLoanCommunicationModel.permanentDistrictId) {
    //       this.termLoanCommunicationModel.permanentDistrictId = null;
    //       this.getAllPermanentDistrictsByStateId(this.termLoanCommunicationModel.permanentStateId, false);
    //       this.termLoanCommunicationModel.permanentDistrictId = this.termLoanCommunicationModel.districtId;
    //     }
    //     if (this.termLoanCommunicationModel.subDistrictId != this.termLoanCommunicationModel.permanentSubDistrictId) {
    //       this.termLoanCommunicationModel.permanentSubDistrictId = null;
    //       this.getAllPermanentMandalsByDistrictId(this.termLoanCommunicationModel.permanentDistrictId, false);
    //       this.termLoanCommunicationModel.permanentSubDistrictId = this.termLoanCommunicationModel.subDistrictId;
    //     }
    //     if (this.termLoanCommunicationModel.villageId != this.termLoanCommunicationModel.permanentVillageId) {
    //       this.termLoanCommunicationModel.permanentVillageId = null;
    //       this.getAllPermanentVillagesByMandalId(this.termLoanCommunicationModel.permanentSubDistrictId, false);
    //       this.termLoanCommunicationModel.permanentVillageId = this.termLoanCommunicationModel.villageId;
    //     }
    //   }
    // }
  
    // sameAsPerAddr(isSameAddress: any) {
    //   if (isSameAddress) {
    //     this.termLoanCommunicationModel.isSameAddress = applicationConstants.TRUE;
    //     this.communicationForm.get('permanentStateId').disable();
    //     this.communicationForm.get('permanentDistrictId').disable();
    //     this.communicationForm.get('permanentSubDistrictId').disable();
    //     this.communicationForm.get('permanentVillageId').disable();
    //     this.communicationForm.get('permanentAddress1').disable();
    //     this.communicationForm.get('permanentPinCode').disable();
  
    //     this.termLoanCommunicationModel.permanentStateId = this.termLoanCommunicationModel.stateId;
    //     if (this.termLoanCommunicationModel.districtId != this.termLoanCommunicationModel.permanentDistrictId) {
    //       this.termLoanCommunicationModel.permanentDistrictId = null;
    //       this.getAllPermanentDistrictsByStateId(this.termLoanCommunicationModel.permanentStateId, false);
    //       this.termLoanCommunicationModel.permanentDistrictId = this.termLoanCommunicationModel.districtId;
    //     }
    //     if (this.termLoanCommunicationModel.subDistrictId != this.termLoanCommunicationModel.permanentSubDistrictId) {
    //       this.termLoanCommunicationModel.permanentSubDistrictId = null;
    //       this.getAllPermanentMandalsByDistrictId(this.termLoanCommunicationModel.permanentDistrictId, false);
    //       this.termLoanCommunicationModel.permanentSubDistrictId = this.termLoanCommunicationModel.subDistrictId;
    //     }
    //     if (this.termLoanCommunicationModel.villageId != this.termLoanCommunicationModel.permanentVillageId) {
    //       this.termLoanCommunicationModel.permanentVillageId = null;
    //       this.getAllPermanentVillagesByMandalId(this.termLoanCommunicationModel.permanentSubDistrictId, false);
    //       this.termLoanCommunicationModel.permanentVillageId = this.termLoanCommunicationModel.villageId;
    //     }
    //     this.termLoanCommunicationModel.permanentAddress1 = this.termLoanCommunicationModel.address1;
    //     this.termLoanCommunicationModel.permanentPinCode = this.termLoanCommunicationModel.pinCode;
    //   }
    //   else {
    //     this.termLoanCommunicationModel.isSameAddress = applicationConstants.FALSE;
  
    //     this.communicationForm.get('permanentStateId').enable();
    //     this.communicationForm.get('permanentDistrictId').enable();
    //     this.communicationForm.get('permanentSubDistrictId').enable();
    //     this.communicationForm.get('permanentVillageId').enable();
    //     this.communicationForm.get('permanentAddress1').enable();
    //     this.communicationForm.get('permanentPinCode').enable();
  
    //     this.communicationForm.get('permanentStateId').reset();
    //     this.communicationForm.get('permanentDistrictId').reset();
    //     this.communicationForm.get('permanentSubDistrictId').reset();
    //     this.communicationForm.get('permanentVillageId').reset();
    //     this.communicationForm.get('permanentAddress1').reset();
    //     this.communicationForm.get('permanentPinCode').reset();
    //     this.permenentDistrictList = [];
    //     this.permenentSubDistrictList = [];
    //     this.permenentVillageList = [];
  
    //     this.communicationForm.get('permanentStateId').enable();
    //     this.communicationForm.get('permanentDistrictId').enable();
    //     this.communicationForm.get('permanentSubDistrictId').enable();
    //     this.communicationForm.get('permanentVillageId').enable();
    //     this.communicationForm.get('permanentAddress1').enable();
    //     this.communicationForm.get('permanentPinCode').enable();
  
    //     this.termLoanCommunicationModel.permanentStateId = null;
    //     this.termLoanCommunicationModel.permanentDistrictId = null;
    //     this.termLoanCommunicationModel.permanentSubDistrictId = null;
    //     this.termLoanCommunicationModel.permanentVillageId = null;
    //     this.termLoanCommunicationModel.permanentAddress1 = null;
    //     this.termLoanCommunicationModel.permanentPinCode = null;
    //   }
    //   this.updateData();
    // }
  
    // RegAddressToComAddress() {
    //   if (this.termLoanCommunicationModel.isSameAddress == true) {
    //     this.termLoanCommunicationModel.permanentAddress1 = this.termLoanCommunicationModel.address1;
    //     this.termLoanCommunicationModel.permanentPinCode = this.termLoanCommunicationModel.pinCode;
    //   }
    // }
  
    sameAsPerAddr(isSameAddress: any) {
      if (isSameAddress) {
        this.termLoanCommunicationModel.isSameAddress = applicationConstants.TRUE;
        this.communicationForm.get('pinCode').reset();
        this.communicationForm.get('stateName').disable();
        this.communicationForm.get('districtId').disable();
        this.communicationForm.get('subDistrictId').disable();
        this.communicationForm.get('villageId').disable();
        this.communicationForm.get('address1').disable();
        this.communicationForm.get('pinCode').disable();
        
        this.termLoanCommunicationModel.stateId = this.termLoanCommunicationModel.permanentStateId;
        if (this.termLoanCommunicationModel.permanentDistrictId != this.termLoanCommunicationModel.districtId) {
          this.termLoanCommunicationModel.districtId = null;
          this.getAllDistrictsByStateId(this.termLoanCommunicationModel.stateId, false);
          this.termLoanCommunicationModel.districtId = this.termLoanCommunicationModel.permanentDistrictId;
        }
        if (this.termLoanCommunicationModel.permanentSubDistrictId != this.termLoanCommunicationModel.subDistrictId) {
          this.termLoanCommunicationModel.subDistrictId = null;
          this.getAllMandalsByDistrictId(this.termLoanCommunicationModel.districtId, false);
          this.termLoanCommunicationModel.subDistrictId = this.termLoanCommunicationModel.permanentSubDistrictId;
        }
        if (this.termLoanCommunicationModel.permanentVillageId != this.termLoanCommunicationModel.villageId) {
          this.termLoanCommunicationModel.villageId = null;
          this.getAllVillagesByMandalId(this.termLoanCommunicationModel.subDistrictId, false);
          this.termLoanCommunicationModel.villageId = this.termLoanCommunicationModel.permanentVillageId;
          // this.getPerVillage(this.termLoanCommunicationModel.permanentVillageId);
        }
        this.termLoanCommunicationModel.address1 = this.termLoanCommunicationModel.permanentAddress1;
        // this.termLoanCommunicationModel.permanentAddress2 = this.termLoanCommunicationModel.address2;
        this.termLoanCommunicationModel.pinCode = this.termLoanCommunicationModel.permanentPinCode;
        this.termLoanCommunicationModel.blockId = this.termLoanCommunicationModel.permanentBlockId;
        this.termLoanCommunicationModel.blockName = this.termLoanCommunicationModel.permanentBlockName;
  
        this.termLoanCommunicationModel.divisionId = this.termLoanCommunicationModel.permanentDivisionId;
        this.termLoanCommunicationModel.divisionName = this.termLoanCommunicationModel.permanentDivisionName;
  
  
      }
      else {
        this.termLoanCommunicationModel.isSameAddress = applicationConstants.FALSE;
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
  
        this.termLoanCommunicationModel.stateId = null;
        this.termLoanCommunicationModel.districtId = null;
        this.termLoanCommunicationModel.subDistrictId = null;
        this.termLoanCommunicationModel.villageId = null;
        this.termLoanCommunicationModel.address1 = null;
        this.termLoanCommunicationModel.pinCode = null;
        this.termLoanCommunicationModel.blockId = null;
        this.termLoanCommunicationModel.divisionId = null;
  
      }
      this.updateData();
    }
  
    RegAddressToComAddress() {
      if (this.termLoanCommunicationModel.isSameAddress == applicationConstants.TRUE) {
        this.termLoanCommunicationModel.address1 = this.termLoanCommunicationModel.permanentAddress1;
        this.termLoanCommunicationModel.pinCode = this.termLoanCommunicationModel.permanentPinCode;
      }
    }
    sameAsRegisterAddress() {
      if (this.termLoanCommunicationModel.isSameAddress ==  applicationConstants.TRUE) {
        this.termLoanCommunicationModel.stateId = this.termLoanCommunicationModel.permanentStateId;
        if (this.termLoanCommunicationModel.permanentDistrictId != this.termLoanCommunicationModel.districtId) {
          this.termLoanCommunicationModel.districtId = null;
          this.getAllDistrictsByStateId(this.termLoanCommunicationModel.stateId,false);
          this.termLoanCommunicationModel.districtId = this.termLoanCommunicationModel.permanentDistrictId;
        }
        if (this.termLoanCommunicationModel.permanentSubDistrictId != this.termLoanCommunicationModel.subDistrictId) {
          this.termLoanCommunicationModel.subDistrictId = null;
          this.getAllMandalsByDistrictId(this.termLoanCommunicationModel.districtId,false);
          this.termLoanCommunicationModel.subDistrictId = this.termLoanCommunicationModel.permanentSubDistrictId;
        }
        if (this.termLoanCommunicationModel.permanentVillageId != this.termLoanCommunicationModel.villageId) {
          this.termLoanCommunicationModel.villageId = null;
          this.getAllVillagesByMandalId(this.termLoanCommunicationModel.subDistrictId,false);
          this.termLoanCommunicationModel.villageId = this.termLoanCommunicationModel.permanentVillageId;
         
        }
        if (this.termLoanCommunicationModel.address1 != this.termLoanCommunicationModel.permanentAddress1) {
          this.termLoanCommunicationModel.address1 = null;
          this.termLoanCommunicationModel.address1 = this.termLoanCommunicationModel.permanentAddress1;
        }
        if (this.termLoanCommunicationModel.pinCode != this.termLoanCommunicationModel.permanentPinCode) {
          this.termLoanCommunicationModel.pinCode = null;
          this.termLoanCommunicationModel.pinCode = this.termLoanCommunicationModel.permanentPinCode;
        }
  
        if (this.termLoanCommunicationModel.divisionId != this.termLoanCommunicationModel.permanentDivisionId) {
          this.termLoanCommunicationModel.divisionId = null;
          this.termLoanCommunicationModel.divisionId = this.termLoanCommunicationModel.permanentDivisionId;
        }
        if (this.termLoanCommunicationModel.blockId != this.termLoanCommunicationModel.permanentBlockId) {
          this.termLoanCommunicationModel.blockId = null;
          this.termLoanCommunicationModel.blockId = this.termLoanCommunicationModel.permanentBlockId;
        }
         this.getVillage(this.termLoanCommunicationModel.villageId);
         this.getPermanentVillage(this.termLoanCommunicationModel.permanentVillageId)
      }
    }
}
