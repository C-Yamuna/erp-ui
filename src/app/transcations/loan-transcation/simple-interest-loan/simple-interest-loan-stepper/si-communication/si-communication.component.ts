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
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-si-communication',
  templateUrl: './si-communication.component.html',
  styleUrls: ['./si-communication.component.css']
})
export class SiCommunicationComponent {
   communicationForm: any;
    communication: any;
    siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
    siLoanCommunicationModel: SiLoanCommunication = new SiLoanCommunication();
    membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
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
      private siLoanApplicationService: SiLoanApplicationService,
      private commonComponent: CommonComponent,
      private activateRoute: ActivatedRoute,
      private encryptDecryptService: EncryptDecryptService,
      private siLoanCommunicationService: SiLoanCommunicationService,
      private commonFunctionsService: CommonFunctionsService,
      private membershipServiceService: MembershipServiceService) {
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
            this.getSILoanApplicationById(this.id);
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
        this.siLoanCommunicationModel.siLoanApplicationId = this.id;
      this.siLoanCommunicationModel.memberTypeName = this.memberTypeName;
      this.siLoanCommunicationModel.admissionNumber = this.admissionNumber; 

      this.siLoanApplicationService.changeData({
        formValid: !this.communicationForm.valid ? true : false,
        data: this.siLoanCommunicationModel,
        isDisable: (!this.communicationForm.valid),
        stepperIndex: 2,
      });
    }
    save() {
      this.updateData();
    }

    /**
   *@author k.yamuna
   * @implements get si application details for getting communication details based on applicationId
   * @param id
   */
    getSILoanApplicationById(id: any) {
      this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((data: any) => {
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
                this.siLoanApplicationModel = this.responseModel.data[0];
                if (this.siLoanApplicationModel != null && this.siLoanApplicationModel != undefined)
                  if (this.siLoanApplicationModel.siLoanCommunicationDTO != null && this.siLoanApplicationModel.siLoanCommunicationDTO != undefined){
                    this.siLoanCommunicationModel = this.siLoanApplicationModel.siLoanCommunicationDTO;
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
 
      /**
     *@author k.yamuna
    * @implements get set all fields
    */
    setAllFields() {
      if (this.siLoanCommunicationModel.isSameAddress != null && this.siLoanCommunicationModel.isSameAddress != undefined) {
        if (this.siLoanCommunicationModel.isSameAddress == true) {
          this.communicationForm.get('stateName').disable();
          this.communicationForm.get('districtId').disable();
          this.communicationForm.get('subDistrictId').disable();
          this.communicationForm.get('villageId').disable();
          this.communicationForm.get('address1').disable();
          this.communicationForm.get('pinCode').disable();
          this.RegAddressToComAddress();
        }
      }
      if (this.siLoanCommunicationModel.stateId != null)
        this.getAllDistrictsByStateId(this.siLoanCommunicationModel.stateId, false)
      if (this.siLoanCommunicationModel.districtId != null)
        this.getAllMandalsByDistrictId(this.siLoanCommunicationModel.districtId, false)
      if (this.siLoanCommunicationModel.subDistrictId != null)
        this.getAllVillagesByMandalId(this.siLoanCommunicationModel.subDistrictId, false)
  
      if (this.siLoanCommunicationModel.permanentStateId != null)
        this.getAllPermanentDistrictsByStateId(this.siLoanCommunicationModel.permanentStateId, false)
      if (this.siLoanCommunicationModel.permanentDistrictId != null)
        this.getAllPermanentMandalsByDistrictId(this.siLoanCommunicationModel.permanentDistrictId, false)
      if (this.siLoanCommunicationModel.permanentSubDistrictId != null)
        this.getAllPermanentVillagesByMandalId(this.siLoanCommunicationModel.permanentSubDistrictId, false)
    }
  
      /**
   *@author k.yamuna
   * @implements Get Member Details from Membership Module by AdmissionNumber
   */
    getMemberDetailsByAdmissionNumber(admissionNumber: any) {
      this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined &&
              this.responseModel.data[0].memberShipCommunicationDetailsDTO != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO != undefined) {
              this.siLoanCommunicationModel = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
              if (this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != null && this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber != undefined)
                this.siLoanCommunicationModel.admissionNumber = this.responseModel.data[0].memberShipCommunicationDetailsDTO.admisionNumber;
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
  
  
      /**
   *@author k.yamuna
   * @implements Get Group Details from Membership Module by AdmissionNumber
   */
    getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
      this.membershipServiceService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGroupDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].groupCommunicationList != null && this.responseModel.data[0].groupCommunicationList != undefined &&
              this.responseModel.data[0].groupCommunicationList[0] != null && this.responseModel.data[0].groupCommunicationList[0] != undefined) {
              this.siLoanCommunicationModel = this.responseModel.data[0].groupCommunicationList[0];
              this.siLoanCommunicationModel.pinCode = this.responseModel.data[0].groupCommunicationList[0].pincode;
              if (this.siLoanCommunicationModel.memberTypeName != null && this.siLoanCommunicationModel.memberTypeName != undefined)
                this.memberTypeName = this.siLoanCommunicationModel.memberTypeName;
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
  
      /**
   *@author k.yamuna
   * @implements Get Institution Details from Membership Module by AdmissionNumber
   */
    getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
      this.membershipServiceService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].institutionCommunicationDTOList != null && this.responseModel.data[0].institutionCommunicationDTOList != undefined &&
              this.responseModel.data[0].institutionCommunicationDTOList[0] != null && this.responseModel.data[0].institutionCommunicationDTOList[0] != undefined) {
              this.siLoanCommunicationModel = this.responseModel.data[0].institutionCommunicationDTOList[0];
              if (this.siLoanCommunicationModel.memberTypeName != null && this.siLoanCommunicationModel.memberTypeName != undefined)
                this.memberTypeName = this.siLoanCommunicationModel.memberTypeName;
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
  
      /**
   *@author k.yamuna
   * @implements get all states list
   */
    getAllStatesList() {
      this.siLoanCommunicationService.getAllStates().subscribe((response: any) => {
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
  
      /**
   *@author k.yamuna
   * @implements get all districts by state id
   */
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
      this.siLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.districtsList = this.responseModel.data;
          this.districtsList = this.districtsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const state = this.statesList.find((item: { value: any; }) => item.value === id);
          this.siLoanCommunicationModel.stateName = state.label;
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
   *@author k.yamuna
   * @implements get all mandals by district id
   */
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
      this.siLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.mandalsList = this.responseModel.data;
          this.mandalsList = this.mandalsList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const district = this.districtsList.find((item: { value: any; }) => item.value === id);
          this.siLoanCommunicationModel.districtName = district.label;
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
   *@author k.yamuna
   * @implements get all villages by mandal id
   */
    getAllVillagesByMandalId(id: any, isResetIds: any) {
      if (isResetIds) {
        this.communicationForm.get('villageId').reset();
        this.communicationForm.get('address1').reset();
        this.communicationForm.get('pinCode').reset();
        this.communicationForm.get('division').reset();
        this.communicationForm.get('block').reset();
        this.villageList = [];
      }
      this.siLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.villageList = this.responseModel.data;
              this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id, data:relationType};
              });
              const mandal = this.mandalsList.find((item: { value: any; }) => item.value === id);
              this.siLoanCommunicationModel.subDistrictName = mandal.label;
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
   *@author k.yamuna
   * @implements this method for set villages 
   * @param id
   */
    getVillage(id: any) {
      this.siLoanCommunicationModel.divisionId = null;;
      this.siLoanCommunicationModel.divisionName = null;
      this.siLoanCommunicationModel.blockId = null;;
      this.siLoanCommunicationModel.blockName = null;
      const village = this.villageList.find((item: { value: any; }) => item.value === id);
      this.siLoanCommunicationModel.villageName = village.label;
      this.getBlock(village.data.blockId);
      this.getDivision(village.data.divisionId);
      // this.sameAsRegisterAddress();
    }
  
  
      /**
   *@author k.yamuna
   * @implements get division and set division name
   * @param id
   */
    getDivision(id:any){
      let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
      if(division != null && undefined != division)
       this.siLoanCommunicationModel.divisionId = division.value
       this.siLoanCommunicationModel.divisionName = division.label
     }

       /**
   *@author k.yamuna
   * @implements get block and set block name
   * @param id
   */
     getBlock(id:any){
       let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
       if(block != null && undefined != block)
        this.siLoanCommunicationModel.blockId = block.value
        this.siLoanCommunicationModel.blockName = block.label
      }
  
        /**
   *@author k.yamuna
   * @implements get all blocks from masters
   */
    getAllBocksList() {
      this.siLoanCommunicationService.getAllBlock().subscribe((response: any) => {
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
  
      /**
   *@author k.yamuna
   * @implements get all division from masters
   */
    getAllDivisionList() {
      this.siLoanCommunicationService.getAllDivision().subscribe((response: any) => {
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
  
      /**
   *@author k.yamuna
   * @implements get all permanent states list from masters
   */
    getAllPermanentStatesList() {
      this.siLoanCommunicationService.getAllStates().subscribe((response: any) => {
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
  
      /**
   *@author k.yamuna
   * @implements get all permanent districts list from masters by stateid
   */
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
      this.siLoanCommunicationService.getDistrictsByStateId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.permenentDistrictList = this.responseModel.data;
          this.permenentDistrictList = this.permenentDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const perState = this.permanentStatesList.find((item: { value: any; }) => item.value === id);
          this.siLoanCommunicationModel.permanentStateName = perState.label;
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
  
      /**
   *@author k.yamuna
   * @implements get all permanent mandals list from masters by districtId
   * @param id
   */
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
      this.siLoanCommunicationService.getMandalsByDistrictId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.permenentSubDistrictList = this.responseModel.data;
          this.permenentSubDistrictList = this.permenentSubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
          const perDistrict = this.permenentDistrictList.find((item: { value: any; }) => item.value === id);
          this.siLoanCommunicationModel.permanentDistrictName = perDistrict.label;
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
   *@author k.yamuna
   * @implements get all permanent villages list from masters by mandalId
   * @param id
   */
    getAllPermanentVillagesByMandalId(id: any, isResetIds: any) {
      if (isResetIds) {
        this.communicationForm.get('permanentVillageId').reset();
        this.communicationForm.get('permanentAddress1').reset();
        this.communicationForm.get('permanentPinCode').reset();
        this.communicationForm.get('permanentDivision').reset();
        this.communicationForm.get('permanentBlock').reset();
        this.permenentVillageList = [];
      }
      this.siLoanCommunicationService.getvillagesByMandalId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.permenentVillageList = this.responseModel.data;
              this.permenentVillageList = this.permenentVillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id, data: relationType };
              });
              const perMandal = this.permenentSubDistrictList.find((item: { value: any; }) => item.value === id);
              this.siLoanCommunicationModel.permanentSubDistrictName = perMandal.label;
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

      /**
   *@author k.yamuna
   * @implements get all villages
   * @param id
   */
    getPermanentVillage(id: any) {
      this.siLoanCommunicationModel.permanentBlockId = null;;
      this.siLoanCommunicationModel.permanentDivisionId = null;
      this.siLoanCommunicationModel.permanentBlockName = null;;
      this.siLoanCommunicationModel.permanentDivisionName = null;
      let perVillage= this.permenentVillageList.find((obj:any) => null != obj && id != null && obj.value === id);
      if(perVillage != null && undefined != perVillage)
      this.siLoanCommunicationModel.permanentVillageName = perVillage.label;
      if(perVillage.data != null && perVillage.data != undefined){
        this.getPermanentBlock(perVillage.data.blockId);
        this.getPermanentDivision(perVillage.data.divisionId);
      }
      this.sameAsRegisterAddress();
    }
  
      /**
   *@author k.yamuna
   * @implements get all permanent division
   * @param id
   */
    getPermanentDivision(id:any){
      let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
      if(division != null && undefined != division)
       this.siLoanCommunicationModel.permanentDivisionId = division.value
       this.siLoanCommunicationModel.permanentDivisionName = division.label
     }

       /**
   *@author k.yamuna
   * @implements get all permanent block
   * @param id
   */
     getPermanentBlock(id:any){
       let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
       if(block != null && undefined != block)
        this.siLoanCommunicationModel.permanentBlockId = block.value
       this.siLoanCommunicationModel.permanentBlockName = block.label
      }
  
        /**
   *@author k.yamuna
   * @implements same as permanent address to communication address population
   * @param isSameAddress
   */
    sameAsPerAddr(isSameAddress: any) {
      if (isSameAddress) {
        this.siLoanCommunicationModel.isSameAddress = applicationConstants.TRUE;
        this.communicationForm.get('pinCode').reset();
        this.communicationForm.get('stateName').disable();
        this.communicationForm.get('districtId').disable();
        this.communicationForm.get('subDistrictId').disable();
        this.communicationForm.get('villageId').disable();
        this.communicationForm.get('address1').disable();
        this.communicationForm.get('pinCode').disable();
        
        this.siLoanCommunicationModel.stateId = this.siLoanCommunicationModel.permanentStateId;
        if (this.siLoanCommunicationModel.permanentDistrictId != this.siLoanCommunicationModel.districtId) {
          this.siLoanCommunicationModel.districtId = null;
          this.getAllDistrictsByStateId(this.siLoanCommunicationModel.stateId, false);
          this.siLoanCommunicationModel.districtId = this.siLoanCommunicationModel.permanentDistrictId;
        }
        if (this.siLoanCommunicationModel.permanentSubDistrictId != this.siLoanCommunicationModel.subDistrictId) {
          this.siLoanCommunicationModel.subDistrictId = null;
          this.getAllMandalsByDistrictId(this.siLoanCommunicationModel.districtId, false);
          this.siLoanCommunicationModel.subDistrictId = this.siLoanCommunicationModel.permanentSubDistrictId;
        }
        if (this.siLoanCommunicationModel.permanentVillageId != this.siLoanCommunicationModel.villageId) {
          this.siLoanCommunicationModel.villageId = null;
          this.getAllVillagesByMandalId(this.siLoanCommunicationModel.subDistrictId, false);
          this.siLoanCommunicationModel.villageId = this.siLoanCommunicationModel.permanentVillageId;
          // this.getPerVillage(this.siLoanCommunicationModel.permanentVillageId);
        }
        this.siLoanCommunicationModel.address1 = this.siLoanCommunicationModel.permanentAddress1;
        // this.siLoanCommunicationModel.permanentAddress2 = this.siLoanCommunicationModel.address2;
        this.siLoanCommunicationModel.pinCode = this.siLoanCommunicationModel.permanentPinCode;
        this.siLoanCommunicationModel.blockId = this.siLoanCommunicationModel.permanentBlockId;
        this.siLoanCommunicationModel.blockName = this.siLoanCommunicationModel.permanentBlockName;
  
        this.siLoanCommunicationModel.divisionId = this.siLoanCommunicationModel.permanentDivisionId;
        this.siLoanCommunicationModel.divisionName = this.siLoanCommunicationModel.permanentDivisionName;
  
  
      }
      else {
        this.siLoanCommunicationModel.isSameAddress = applicationConstants.FALSE;
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
  
        this.siLoanCommunicationModel.stateId = null;
        this.siLoanCommunicationModel.districtId = null;
        this.siLoanCommunicationModel.subDistrictId = null;
        this.siLoanCommunicationModel.villageId = null;
        this.siLoanCommunicationModel.address1 = null;
        this.siLoanCommunicationModel.pinCode = null;
        this.siLoanCommunicationModel.blockId = null;
        this.siLoanCommunicationModel.divisionId = null;
  
      }
      this.updateData();
    }
  

      /**
   *@author k.yamuna
   * @implements address and piccode population permanent to communication address
   */
    RegAddressToComAddress() {
      if (this.siLoanCommunicationModel.isSameAddress == applicationConstants.TRUE) {
        this.siLoanCommunicationModel.address1 = this.siLoanCommunicationModel.permanentAddress1;
        this.siLoanCommunicationModel.pinCode = this.siLoanCommunicationModel.permanentPinCode;
      }
    }

      /**
   *@author k.yamuna
   * @implements this method for same as permanent to communication address to communication address
   */
    sameAsRegisterAddress() {
      if (this.siLoanCommunicationModel.isSameAddress ==  applicationConstants.TRUE) {
        this.siLoanCommunicationModel.stateId = this.siLoanCommunicationModel.permanentStateId;
        if (this.siLoanCommunicationModel.permanentDistrictId != this.siLoanCommunicationModel.districtId) { 
          this.siLoanCommunicationModel.districtId = null;
          this.getAllDistrictsByStateId(this.siLoanCommunicationModel.stateId,false);
          this.siLoanCommunicationModel.districtId = this.siLoanCommunicationModel.permanentDistrictId;
        }
        if (this.siLoanCommunicationModel.permanentSubDistrictId != this.siLoanCommunicationModel.subDistrictId) {
          this.siLoanCommunicationModel.subDistrictId = null;
          this.getAllMandalsByDistrictId(this.siLoanCommunicationModel.districtId,false);
          this.siLoanCommunicationModel.subDistrictId = this.siLoanCommunicationModel.permanentSubDistrictId;
        }
        if (this.siLoanCommunicationModel.permanentVillageId != this.siLoanCommunicationModel.villageId) {
          this.siLoanCommunicationModel.villageId = null;
          this.getAllVillagesByMandalId(this.siLoanCommunicationModel.subDistrictId,false);
          this.siLoanCommunicationModel.villageId = this.siLoanCommunicationModel.permanentVillageId;
         
        }
        if (this.siLoanCommunicationModel.address1 != this.siLoanCommunicationModel.permanentAddress1) {
          this.siLoanCommunicationModel.address1 = null;
          this.siLoanCommunicationModel.address1 = this.siLoanCommunicationModel.permanentAddress1;
        }
        if (this.siLoanCommunicationModel.pinCode != this.siLoanCommunicationModel.permanentPinCode) {
          this.siLoanCommunicationModel.pinCode = null;
          this.siLoanCommunicationModel.pinCode = this.siLoanCommunicationModel.permanentPinCode;
        }
  
        if (this.siLoanCommunicationModel.divisionId != this.siLoanCommunicationModel.permanentDivisionId) {
          this.siLoanCommunicationModel.divisionId = null;
          this.siLoanCommunicationModel.divisionId = this.siLoanCommunicationModel.permanentDivisionId;
        }
        if (this.siLoanCommunicationModel.blockId != this.siLoanCommunicationModel.permanentBlockId) {
          this.siLoanCommunicationModel.blockId = null;
          this.siLoanCommunicationModel.blockId = this.siLoanCommunicationModel.permanentBlockId;
        }
         this.getVillage(this.siLoanCommunicationModel.villageId);
        //  this.getPermanentVillage(this.siLoanCommunicationModel.permanentVillageId)
      }
    }
  }
  