import { Village } from './../../../../configurations/common-config/villages/shared/village.model';
import { District } from './../../../../configurations/common-config/district/shared/district.model';
import { MemberBasicDetails, MemberCommunicationDeatilsModel } from './../../shared/member-basic-details.model';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipBasicDetailsService } from '../../shared/membership-basic-details.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipCommunicationDetailsService } from '../../shared/membership-communication-details.service';

import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MemberBasicDetailsStepperService } from '../shared/membership-individual-stepper.service';
import { DistrictService } from 'src/app/configurations/common-config/district/shared/district.service';
import { VillagesService } from 'src/app/configurations/common-config/villages/shared/villages.service';
import { StatesService } from 'src/app/configurations/common-config/state/shared/states.service';
import { SubDistrictService } from 'src/app/configurations/common-config/sub-district/shared/sub-district.service';
import { Communication } from 'src/app/transcations/agent-details-transaction/agent-registration-stepper/communication/shared/communication.model';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.css']
})
export class CommunicationsComponent {
  cities: any[] | undefined;
  statusList: any[]=[];
  memberCommunicationDetailsModel: MemberCommunicationDeatilsModel = new MemberCommunicationDeatilsModel();
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  responseModel!: Responsemodel;
  msgs: any[]=[];
  checkbox: any;
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[]=[];
  communicationform: any;
  stateList: any[]=[];
  villageList: any[]=[];
  districtList: any[]=[];
  subDistrictList:any[]=[];
  perstateList: any[]=[];
  pervillageList: any[]=[];
  sameAsPermanentAddress: boolean = false;
  perdistrictList: any[]=[];
  persubDistrictList:any[]=[];
  productTypeList: any[]=[];
  blocksList: any;
  divisionList:  any[]=[];

  constructor(private router: Router, private formBuilder: FormBuilder, private membershipBasicDetailsService: MembershipBasicDetailsService,
    private memberBasicDetailsStepperService:MemberBasicDetailsStepperService,
    private commonComponent: CommonComponent,private membershipCommunicationDetailsService:MembershipCommunicationDetailsService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,private datePipe: DatePipe,private statesService:StatesService,
     private commonFunctionsService: CommonFunctionsService,private districtService:DistrictService,private subDistrictService:SubDistrictService,
     private villagesService:VillagesService,
  )
  { 
    this.communicationform = this.formBuilder.group({
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
      'perDivision':new FormControl({ value: '', disabled: true }),
      'perBlock': new FormControl({ value: '', disabled: true }),
    })
  }
  ngOnInit() {
    // Initialize other necessary variables and components
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
    
        if (id != "" && id != null && id != undefined) {
          this.isEdit = true;
          this.getCommunicationDetialsByMembershipId(id);
        }
      } else {
        this.isEdit = false;
        // this.countryModel.isActive = this.statusList[0].value;
      }
    });
  
    this.communicationform.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.communicationform.valid) {
        this.save();
      }
    });
  
    this.getAllStatesList();
    this.getAllPermanentStatesList();
    this.getAllBocksList();
    this.getAllDivisionList();
  }
  save() {
    this.updateData();
  }
  getCommunicationDetialsByMembershipId(id: string) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.memberBasicDetailsModel = this.responseModel.data[0];
        this.memberCommunicationDetailsModel.memberShipId = this.memberBasicDetailsModel.id;
        if (this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != null && this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != undefined) {
          this.memberCommunicationDetailsModel = this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO;
  
          if (this.memberCommunicationDetailsModel.isSameAddress != null && this.memberCommunicationDetailsModel.isSameAddress != undefined) {
            if (this.memberCommunicationDetailsModel.isSameAddress == applicationConstants.TRUE) {
              // this.sameAsPerAddr(this.memberCommunicationDetailsModel.isSameAddress);
              this.communicationform.get('stateName').disable();
              this.communicationform.get('districtId').disable();
              this.communicationform.get('subDistrictId').disable();
              this.communicationform.get('villageId').disable();
              this.communicationform.get('address1').disable();
              this.communicationform.get('pinCode').disable();

            }
          }
          if (this.memberCommunicationDetailsModel.stateId != null) {
            this.getAllDistrictsByStateId(this.memberCommunicationDetailsModel.stateId, false);
          }
          if (this.memberCommunicationDetailsModel.districtId != null) {
            this.getAllSubDistrictsByDistrictId(this.memberCommunicationDetailsModel.districtId, false);
          }
          if (this.memberCommunicationDetailsModel.subDistrictId != null) {
            this.getAllVillagesBySubDistrictId(this.memberCommunicationDetailsModel.subDistrictId, false);
          }
  
          if (this.memberCommunicationDetailsModel.permanentStateId != null) {
            this.getAllperDistrictsByStateId(this.memberCommunicationDetailsModel.permanentStateId, false);
          }
          if (this.memberCommunicationDetailsModel.permanentDistrictId != null) {
            this.getAllPerSubDistrictsByDistrictId(this.memberCommunicationDetailsModel.permanentDistrictId, false);
          }
          if (this.memberCommunicationDetailsModel.permanentSubDistrictId != null) {
            this.getAllPerVillagesBySubDistrictId(this.memberCommunicationDetailsModel.permanentSubDistrictId, false);
          }
          this.updateData();
        }
      }
    });
  }
  getAllStatesList() {
    this.statesService.getAllStates().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
            this.stateList = this.responseModel.data;
            this.stateList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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
  getAllDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationform.get('districtId').reset();
      this.communicationform.get('subDistrictId').reset();
      this.communicationform.get('villageId').reset();
      this.communicationform.get('address1').reset();
      this.communicationform.get('pinCode').reset();
      this.communicationform.get('division').reset();
      this.communicationform.get('block').reset();
      this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.districtService.getDistrictByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
        this.districtList = this.responseModel.data;
        this.districtList = this.districtList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let state=  this.stateList.find((data:any) => null != data && this.memberCommunicationDetailsModel.stateId != null && data.value ==this.memberCommunicationDetailsModel.stateId);
        if(state != null && undefined != state)
        this.memberCommunicationDetailsModel.stateName = state.label;
      }
      // this.sameAsRegisterAddress();
    }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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
  getAllSubDistrictsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationform.get('subDistrictId').reset();
      this.communicationform.get('villageId').reset();
      this.communicationform.get('address1').reset();
      this.communicationform.get('pinCode').reset();
      this.communicationform.get('division').reset();
      this.communicationform.get('block').reset();
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.subDistrictService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
        this.subDistrictList = this.responseModel.data;
        this.subDistrictList = this.subDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let district=  this.districtList.find((data:any) => null != data && data.value === id);
        if(district != null && undefined != district)
         this.memberCommunicationDetailsModel.districtName = district.label;
      }
      // this.sameAsRegisterAddress();
    }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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
  getAllVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationform.get('villageId').reset();
      this.communicationform.get('address1').reset();
      this.communicationform.get('pinCode').reset();
      this.communicationform.get('division').reset();
      this.communicationform.get('block').reset();
      this.villageList = [];
    }
    this.villagesService.getVillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.villageList = this.responseModel.data;
            this.villageList = this.villageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id ,data:relationType};
            });
            let mandal=  this.subDistrictList.find((data:any) => null != data && id != null && data.value === id);
            if(mandal != null && undefined != mandal)
            this.memberCommunicationDetailsModel.subDistrictName = mandal.label;
            if(this.memberCommunicationDetailsModel.villageId != null && this.memberCommunicationDetailsModel.villageId != undefined){
              this.getVillage(this.memberCommunicationDetailsModel.villageId);
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
  getAllBocksList() {
    this.statesService.getAllBlock().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
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
    this.statesService.getAllDivision().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
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
  getVillage(id:any){
    this.memberCommunicationDetailsModel.divisionId = null;;
    this.memberCommunicationDetailsModel.divisionName = null;
    this.memberCommunicationDetailsModel.blockId = null;;
    this.memberCommunicationDetailsModel.blockName = null;
    let Village=  this.villageList.find((data:any) => null != data && id != null && data.value === id);
     if(Village != null && undefined != Village)
    this.memberCommunicationDetailsModel.villageName = Village.label;
    this.getBlock(Village.data.blockId);
    this.getDivision(Village.data.divisionId);
    // this.sameAsRegisterAddress();
  }

  getDivision(id:any){
   let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
   if(division != null && undefined != division)
    this.memberCommunicationDetailsModel.divisionId = division.value
    this.memberCommunicationDetailsModel.divisionName = division.label
  }
  getBlock(id:any){
    let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
    if(block != null && undefined != block)
     this.memberCommunicationDetailsModel.blockId = block.value
     this.memberCommunicationDetailsModel.blockName = block.label
   }

  getAllPermanentStatesList() {
    this.statesService.getAllStates().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
            this.perstateList = this.responseModel.data;
            this.perstateList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: { name: any; id: any; }) => {
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
  
  getAllperDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationform.get('permanentDistrictId').reset();
      this.communicationform.get('permanentSubDistrictId').reset();
      this.communicationform.get('permanentVillageId').reset();
      this.communicationform.get('permanentAddress1').reset();
      this.communicationform.get('permanentPinCode').reset();
      this.communicationform.get('perDivision').reset();
      this.communicationform.get('perBlock').reset();
      
      this.perdistrictList = [];
      this.persubDistrictList = [];
      this.pervillageList = [];
    }
    this.districtService.getDistrictByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
        this.perdistrictList = this.responseModel.data;
        this.perdistrictList = this.perdistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let state=  this.perstateList.find((data:any) => null != data && id != null && data.value === id);
        if(state != null && undefined != state)
        this.memberCommunicationDetailsModel.permanentStateName = state.label;
        }
        
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.sameAsRegisterAddress();
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
  getAllPerSubDistrictsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationform.get('permanentSubDistrictId').reset();
      this.communicationform.get('permanentVillageId').reset();
      this.communicationform.get('permanentAddress1').reset();
      this.communicationform.get('permanentPinCode').reset();
      this.communicationform.get('perDivision').reset();
      this.communicationform.get('perBlock').reset();
      this.persubDistrictList = [];
      this.pervillageList = [];
    }
    this.subDistrictService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
        this.persubDistrictList = this.responseModel.data;
        this.persubDistrictList = this.persubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let district=  this.perdistrictList.find((data:any) => null != data && id != null && data.value === id);
        if(district != null && undefined != district)
        this.memberCommunicationDetailsModel.permanentDistrictName = district.label;
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
 
  getAllPerVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.communicationform.get('permanentVillageId').reset();
      this.communicationform.get('permanentAddress1').reset();
      this.communicationform.get('permanentPinCode').reset();
      this.communicationform.get('perDivision').reset();
      this.communicationform.get('perBlock').reset();
      this.pervillageList = [];
    }
    this.villagesService.getVillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.pervillageList = this.responseModel.data;
            this.pervillageList = this.pervillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id,data:relationType };
            });
            let mandal=  this.persubDistrictList.find((data:any) => null != data && id != null && data.value === id);
            if(mandal != null && undefined != mandal)
            this.memberCommunicationDetailsModel.permanentSubDistrictName = mandal.label;
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
  getPerVillage(id:any){
    this.memberCommunicationDetailsModel.permanentBlockId = null;;
    this.memberCommunicationDetailsModel.permanentDivisionId = null;
    this.memberCommunicationDetailsModel.permanentBlockName = null;;
    this.memberCommunicationDetailsModel.permanentDivisionName = null;
    let village= this.pervillageList.find((obj:any) => null != obj && id != null && obj.value === id);
    if(village != null && undefined != village)
    this.memberCommunicationDetailsModel.permanentVillageName = village.label;
    if(village.data != null && village.data != undefined){
      this.getPerBlock(village.data.blockId);
      this.getPerDivision(village.data.divisionId);
    }
    this.sameAsRegisterAddress();
   }


   getPerDivision(id:any){
    let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
    if(division != null && undefined != division)
     this.memberCommunicationDetailsModel.permanentDivisionId = division.value
     this.memberCommunicationDetailsModel.permanentDivisionName = division.label
   }
   getPerBlock(id:any){
     let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
     if(block != null && undefined != block)
      this.memberCommunicationDetailsModel.permanentBlockId = block.value
     this.memberCommunicationDetailsModel.permanentBlockName = block.label
    }
 
  updateData() {
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.communicationform.valid ,
      data: this.memberCommunicationDetailsModel,
      stepperIndex: 2,
      isDisable: this.communicationform.valid? false : true, 
    });
  }
  sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.memberCommunicationDetailsModel.isSameAddress = applicationConstants.TRUE;
      this.communicationform.get('pinCode').reset();
      this.communicationform.get('stateName').disable();
      this.communicationform.get('districtId').disable();
      this.communicationform.get('subDistrictId').disable();
      this.communicationform.get('villageId').disable();
      this.communicationform.get('address1').disable();
      this.communicationform.get('pinCode').disable();
      
      this.memberCommunicationDetailsModel.stateId = this.memberCommunicationDetailsModel.permanentStateId;
      if (this.memberCommunicationDetailsModel.permanentDistrictId != this.memberCommunicationDetailsModel.districtId) {
        this.memberCommunicationDetailsModel.districtId = null;
        this.getAllDistrictsByStateId(this.memberCommunicationDetailsModel.stateId, false);
        this.memberCommunicationDetailsModel.districtId = this.memberCommunicationDetailsModel.permanentDistrictId;
      }
      if (this.memberCommunicationDetailsModel.permanentSubDistrictId != this.memberCommunicationDetailsModel.subDistrictId) {
        this.memberCommunicationDetailsModel.subDistrictId = null;
        this.getAllSubDistrictsByDistrictId(this.memberCommunicationDetailsModel.districtId, false);
        this.memberCommunicationDetailsModel.subDistrictId = this.memberCommunicationDetailsModel.permanentSubDistrictId;
      }
      if (this.memberCommunicationDetailsModel.permanentVillageId != this.memberCommunicationDetailsModel.villageId) {
        this.memberCommunicationDetailsModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.memberCommunicationDetailsModel.subDistrictId, false);
        this.memberCommunicationDetailsModel.villageId = this.memberCommunicationDetailsModel.permanentVillageId;
        // this.getPerVillage(this.memberCommunicationDetailsModel.permanentVillageId);
      }
      this.memberCommunicationDetailsModel.address1 = this.memberCommunicationDetailsModel.permanentAddress1;
      // this.memberCommunicationDetailsModel.permanentAddress2 = this.memberCommunicationDetailsModel.address2;
      this.memberCommunicationDetailsModel.pinCode = this.memberCommunicationDetailsModel.permanentPinCode;
      this.memberCommunicationDetailsModel.blockId = this.memberCommunicationDetailsModel.permanentBlockId;
      this.memberCommunicationDetailsModel.blockName = this.memberCommunicationDetailsModel.permanentBlockName;

      this.memberCommunicationDetailsModel.divisionId = this.memberCommunicationDetailsModel.permanentDivisionId;
      this.memberCommunicationDetailsModel.divisionName = this.memberCommunicationDetailsModel.permanentDivisionName;


    }
    else {
      this.memberCommunicationDetailsModel.isSameAddress = applicationConstants.FALSE;
      this.communicationform.get('stateName').enable();
      this.communicationform.get('districtId').enable();
      this.communicationform.get('subDistrictId').enable();
      this.communicationform.get('villageId').enable();
      this.communicationform.get('address1').enable();
      this.communicationform.get('pinCode').enable();

      this.communicationform.get('stateName').reset();
      this.communicationform.get('districtId').reset();
      this.communicationform.get('subDistrictId').reset();
      this.communicationform.get('villageId').reset();
      this.communicationform.get('address1').reset();
      this.communicationform.get('pinCode').reset();
      this.communicationform.get('division').reset();
      this.communicationform.get('block').reset();

      this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];

      this.memberCommunicationDetailsModel.stateId = null;
      this.memberCommunicationDetailsModel.districtId = null;
      this.memberCommunicationDetailsModel.subDistrictId = null;
      this.memberCommunicationDetailsModel.villageId = null;
      this.memberCommunicationDetailsModel.address1 = null;
      this.memberCommunicationDetailsModel.pinCode = null;
      this.memberCommunicationDetailsModel.blockId = null;
      this.memberCommunicationDetailsModel.divisionId = null;

    }
    this.updateData();
  }

  RegAddressToComAddress() {
    if (this.memberCommunicationDetailsModel.isSameAddress == applicationConstants.TRUE) {
      this.memberCommunicationDetailsModel.address1 = this.memberCommunicationDetailsModel.permanentAddress1;
      this.memberCommunicationDetailsModel.pinCode = this.memberCommunicationDetailsModel.permanentPinCode;
    }
  }
  sameAsRegisterAddress() {
    if (this.memberCommunicationDetailsModel.isSameAddress ==  applicationConstants.TRUE) {
      this.memberCommunicationDetailsModel.stateId = this.memberCommunicationDetailsModel.permanentStateId;
      if (this.memberCommunicationDetailsModel.permanentDistrictId != this.memberCommunicationDetailsModel.districtId) {
        this.memberCommunicationDetailsModel.districtId = null;
        this.getAllDistrictsByStateId(this.memberCommunicationDetailsModel.stateId,false);
        this.memberCommunicationDetailsModel.districtId = this.memberCommunicationDetailsModel.permanentDistrictId;
      }
      if (this.memberCommunicationDetailsModel.permanentSubDistrictId != this.memberCommunicationDetailsModel.subDistrictId) {
        this.memberCommunicationDetailsModel.subDistrictId = null;
        this.getAllSubDistrictsByDistrictId(this.memberCommunicationDetailsModel.districtId,false);
        this.memberCommunicationDetailsModel.subDistrictId = this.memberCommunicationDetailsModel.permanentSubDistrictId;
      }
      if (this.memberCommunicationDetailsModel.permanentVillageId != this.memberCommunicationDetailsModel.villageId) {
        this.memberCommunicationDetailsModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.memberCommunicationDetailsModel.subDistrictId,false);
        this.memberCommunicationDetailsModel.villageId = this.memberCommunicationDetailsModel.permanentVillageId;
       
      }
      if (this.memberCommunicationDetailsModel.address1 != this.memberCommunicationDetailsModel.permanentAddress1) {
        this.memberCommunicationDetailsModel.address1 = null;
        this.memberCommunicationDetailsModel.address1 = this.memberCommunicationDetailsModel.permanentAddress1;
      }
      if (this.memberCommunicationDetailsModel.pinCode != this.memberCommunicationDetailsModel.permanentPinCode) {
        this.memberCommunicationDetailsModel.pinCode = null;
        this.memberCommunicationDetailsModel.pinCode = this.memberCommunicationDetailsModel.permanentPinCode;
      }

      if (this.memberCommunicationDetailsModel.divisionId != this.memberCommunicationDetailsModel.permanentDivisionId) {
        this.memberCommunicationDetailsModel.divisionId = null;
        this.memberCommunicationDetailsModel.divisionId = this.memberCommunicationDetailsModel.permanentDivisionId;
      }
      if (this.memberCommunicationDetailsModel.blockId != this.memberCommunicationDetailsModel.permanentBlockId) {
        this.memberCommunicationDetailsModel.blockId = null;
        this.memberCommunicationDetailsModel.blockId = this.memberCommunicationDetailsModel.permanentBlockId;
      }
       this.getVillage(this.memberCommunicationDetailsModel.villageId);
    }
  }
}


