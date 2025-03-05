import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DistrictService } from 'src/app/configurations/common-config/district/shared/district.service';
import { VillagesService } from 'src/app/configurations/common-config/villages/shared/villages.service';
import { StatesService } from 'src/app/configurations/common-config/state/shared/states.service';
import { SubDistrictService } from 'src/app/configurations/common-config/sub-district/shared/sub-district.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { GroupCommunicationDetailsService } from '../../../shared/group-communication-details.service';
import { MembershipGroupDetailsService } from '../../../shared/membership-group-details.service';
import { GroupKycDetailsService } from '../../../shared/group-kyc-details.service';
import { GroupCommunicationModel, GroupKycDeatilsModel, MemberGroupBasicDetails } from '../../../shared/member-group-details-model';

@Component({
  selector: 'app-group-communication',
  templateUrl: './group-communication.component.html',
  styleUrls: ['./group-communication.component.css']
})
export class GroupCommunicationComponent {

  responseModel!: Responsemodel;
  msgs: any[]=[];
  memberGroupBasicDetails :MemberGroupBasicDetails = new MemberGroupBasicDetails();
  groupCommunicationModel:GroupCommunicationModel = new GroupCommunicationModel()
  groupKycDeatilsModel:GroupKycDeatilsModel = new GroupKycDeatilsModel();
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[]=[];
  stateList: any[]=[];
  villageList: any[]=[];
  districtList: any[]=[];
  subDistrictList:any[]=[];
  groupCommunicationForm:any;
  groupCommunication:any;
  date: any;
  statuList:any[]=[];
  sameAsPermanentAddress: boolean = false;
  perstateList: any[]=[];
  pervillageList: any[]=[];
  perdistrictList: any[]=[];
  persubDistrictList:any[]=[];
  divisionList: any[]=[];
  blocksList:any[]=[];

  constructor(private router: Router, private formBuilder: FormBuilder, private membershipGroupDetailsService: MembershipGroupDetailsService,
    private memberBasicDetailsStepperService:MemberBasicDetailsStepperService,
    private commonComponent: CommonComponent,private droupCommunicationDetailsService:GroupCommunicationDetailsService,private groupKycDetailsService: GroupKycDetailsService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,private datePipe: DatePipe,private statesService:StatesService,
     private commonFunctionsService: CommonFunctionsService,private districtService:DistrictService,private subDistrictService:SubDistrictService,
     private villagesService:VillagesService,
  )
  { 
    this.groupCommunicationForm = this.formBuilder.group({
      'stateName': new FormControl('', Validators.required),
      'districtName': new FormControl('', Validators.required),
      'villageName': new FormControl('', Validators.required),
      'subDistrictName': new FormControl('', Validators.required),
      'address1': new FormControl('', Validators.required),
      'address2': new FormControl(''),
      'pincode':new FormControl('',[Validators.pattern(applicationConstants.PINCODE_PATTERN),Validators.required]),
      'isSameAddress': new FormControl(''),
      'permanentStateId': new FormControl('',Validators.required),
      'permanentDistrictId': new FormControl('',Validators.required),
      'permanentSubDistrictId': new FormControl('',Validators.required),
      'permanentVillageId': new FormControl('',Validators.required),
      'permanentAddress1': new FormControl('',Validators.required),
      'permntAddress2': new FormControl(''),
      'permanentPincode': new FormControl('',[Validators.pattern(applicationConstants.PINCODE_PATTERN),Validators.required]),
      'division': new FormControl({ value: '', disabled: true }),
      'block': new FormControl({ value: '', disabled: true }),
      'perDivision':new FormControl({ value: '', disabled: true }),
      'perBlock': new FormControl({ value: '', disabled: true }),
    });
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    // Initialize other necessary variables and components
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
    
        if (id != "" && id != null && id != undefined) {
          this.isEdit = true;
          this.getMembershipGroupDetailsById(id);
        }
      } else {
        this.isEdit = false;
        // this.countryModel.isActive = this.statusList[0].value;
      }
    });
  
    this.groupCommunicationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.groupCommunicationForm.valid) {
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
  getMembershipGroupDetailsById(id: string) {
    this.membershipGroupDetailsService.getMembershipGroupDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        this.memberGroupBasicDetails = this.responseModel.data[0];
        if (this.memberGroupBasicDetails.admissionDate != null && this.memberGroupBasicDetails.admissionDate != undefined) {
          this.memberGroupBasicDetails.admissionDateVal = this.datePipe.transform(this.memberGroupBasicDetails.admissionDate, this.orgnizationSetting.datePipe);
        }
        this.groupCommunicationModel.groupId = this.memberGroupBasicDetails.id;
        if(this.memberGroupBasicDetails.groupCommunicationList != null && this.memberGroupBasicDetails.groupCommunicationList != undefined && this.memberGroupBasicDetails.groupCommunicationList.length > 0){
            this.groupCommunicationModel = this.memberGroupBasicDetails.groupCommunicationList[0];

  
          if (this.groupCommunicationModel.isSameAddress != null && this.groupCommunicationModel.isSameAddress != undefined) {
            if (this.groupCommunicationModel.isSameAddress == applicationConstants.TRUE) {

              // this.sameAsPerAddr(this.groupCommunicationModel.isSameAddress);
              this.groupCommunicationForm.get('stateName').disable();
              this.groupCommunicationForm.get('districtName').disable();
              this.groupCommunicationForm.get('villageName').disable();
              this.groupCommunicationForm.get('subDistrictName').disable();
              this.groupCommunicationForm.get('address1').disable();
              this.groupCommunicationForm.get('pincode').disable();

            }
          }
          if (this.groupCommunicationModel.stateId != null) {
            this.getAllDistrictsByStateId(this.groupCommunicationModel.stateId, applicationConstants.FALSE);
          }
          if (this.groupCommunicationModel.districtId != null) {
            this.getAllSubDistrictsByDistrictId(this.groupCommunicationModel.districtId, applicationConstants.FALSE);
          }
          if (this.groupCommunicationModel.subDistrictId != null) {
            this.getAllVillagesBySubDistrictId(this.groupCommunicationModel.subDistrictId, applicationConstants.FALSE);
          }
  
          if (this.groupCommunicationModel.permanentStateId != null) {
            this.getAllperDistrictsByStateId(this.groupCommunicationModel.permanentStateId, applicationConstants.FALSE);
          }
          if (this.groupCommunicationModel.permanentDistrictId != null) {
            this.getAllPerSubDistrictsByDistrictId(this.groupCommunicationModel.permanentDistrictId, applicationConstants.FALSE);
          }
          if (this.groupCommunicationModel.permanentSubDistrictId != null) {
            this.getAllPerVillagesBySubDistrictId(this.groupCommunicationModel.permanentSubDistrictId,applicationConstants.FALSE);
          
          this.updateData();
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);

      }
    }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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
    },
    error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getAllDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.groupCommunicationForm.get('districtName').reset();
      this.groupCommunicationForm.get('subDistrictName').reset();
      this.groupCommunicationForm.get('villageName').reset();
      this.groupCommunicationForm.get('address1').reset();
      this.groupCommunicationForm.get('pincode').reset();
      this.groupCommunicationForm.get('division').reset();
      this.groupCommunicationForm.get('block').reset();
      this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];
    }
    this.districtService.getDistrictByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
        this.districtList = this.responseModel.data;
        this.districtList = this.districtList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE ).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let state=  this.stateList.find((data:any) => null != data && this.groupCommunicationModel.stateId !=  null && data.value ==this.groupCommunicationModel.stateId);
        if(state != null && undefined != state)
        this.groupCommunicationModel.stateName = state.label;
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
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getAllSubDistrictsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.groupCommunicationForm.get('subDistrictName').reset();
      this.groupCommunicationForm.get('villageName').reset();
      this.groupCommunicationForm.get('address1').reset();
      this.groupCommunicationForm.get('pincode').reset();
      this.groupCommunicationForm.get('division').reset();
      this.groupCommunicationForm.get('block').reset();
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
        let state=  this.districtList.find((data:any) => null != data  && id != null && data.value === id);
        if(state != null && undefined != state)
         this.groupCommunicationModel.districtName = state.label;
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
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getAllVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.groupCommunicationForm.get('villageName').reset();
      this.groupCommunicationForm.get('address1').reset();
      this.groupCommunicationForm.get('pincode').reset();
      this.groupCommunicationForm.get('division').reset();
      this.groupCommunicationForm.get('block').reset();
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
            let mandal=  this.subDistrictList.find((data:any) => null != data && data.value === id);
            if(mandal != null && undefined != mandal)
            this.groupCommunicationModel.subDistrictName = mandal.label;
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
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
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
    getVillage(id:any,isResetIds:any){
      if(!isResetIds){
        this.groupCommunicationForm.get('address1').reset();
      }
      this.groupCommunicationModel.divisionId = null;;
      this.groupCommunicationModel.divisionName = null;
      this.groupCommunicationModel.blockId = null;;
      this.groupCommunicationModel.blockName = null;
      let Village=  this.villageList.find((data:any) => null != data && id != null && data.value === id);
       if(Village != null && undefined != Village)
      this.groupCommunicationModel.villageName = Village.label;
      this.getBlock(Village.data.blockId);
      this.getDivision(Village.data.divisionId);
      // this.sameAsRegisterAddress();
    }
  
    getDivision(id:any){
     let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
     if(division != null && undefined != division)
      this.groupCommunicationModel.divisionId = division.value
      this.groupCommunicationModel.divisionName = division.label
    }
    getBlock(id:any){
      let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
      if(block != null && undefined != block)
       this.groupCommunicationModel.blockId = block.value
       this.groupCommunicationModel.blockName = block.label
     }
  // getVillage(id:any){
  //  let Village=  this.villageList.find((data:any) => null != data && id != null && data.value === id);
  //  if(Village != null && undefined != Village)
  //  this.groupCommunicationModel.villageName = Village.label;

  // }

  getAllPermanentStatesList() {
    this.statesService.getAllStates().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
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
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getAllperDistrictsByStateId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.groupCommunicationForm.get('permanentDistrictId').reset();
      this.groupCommunicationForm.get('permanentSubDistrictId').reset();
      this.groupCommunicationForm.get('permanentVillageId').reset();
      this.groupCommunicationForm.get('permanentAddress1').reset();
      this.groupCommunicationForm.get('permanentPincode').reset();
      this.groupCommunicationForm.get('perDivision').reset();
      this.groupCommunicationForm.get('perBlock').reset();
      this.perdistrictList = [];
      this.persubDistrictList = [];
      this.pervillageList = [];
    }
    this.districtService.getDistrictByStateId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.perdistrictList = this.responseModel.data;
        this.perdistrictList = this.perdistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let state=  this.perstateList.find((data:any) => null != data && data.value === id);
        if(state != null && undefined != state)
        this.groupCommunicationModel.permanentStateName = state.label;
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
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getAllPerSubDistrictsByDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.groupCommunicationForm.get('permanentSubDistrictId').reset();
      this.groupCommunicationForm.get('permanentVillageId').reset();
      this.groupCommunicationForm.get('permanentAddress1').reset();
      this.groupCommunicationForm.get('permanentPincode').reset();
      this.groupCommunicationForm.get('perDivision').reset();
      this.groupCommunicationForm.get('perBlock').reset();
      this.persubDistrictList = [];
      this.pervillageList = [];
    }
    this.subDistrictService.getSubDistrictByDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.persubDistrictList = this.responseModel.data;
        this.persubDistrictList = this.persubDistrictList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        let district=  this.perdistrictList.find((data:any) => null != data && id != null && data.value === id);
        if(district != null && undefined != district)
        this.groupCommunicationModel.permanentDistrictName = district.label;
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
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getAllPerVillagesBySubDistrictId(id: any, isResetIds: any) {
    if (isResetIds) {
      this.groupCommunicationForm.get('permanentVillageId').reset();
      this.groupCommunicationForm.get('permanentAddress1').reset();
      this.groupCommunicationForm.get('permanentPincode').reset();
      this.groupCommunicationForm.get('perDivision').reset();
      this.groupCommunicationForm.get('perBlock').reset();
      this.pervillageList = [];
    }
    this.villagesService.getVillagesBySubDistrictId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.pervillageList = this.responseModel.data;
            this.pervillageList = this.pervillageList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
              return { label: relationType.name, value: relationType.id,data:relationType};
            });
            let mandal=  this.persubDistrictList.find((data:any) => null != data && id != null && data.value === id);
            if(mandal != null && undefined != mandal)
            this.groupCommunicationModel.permanentSubDistrictName = mandal.label;
           
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
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  getPerVillage(id:any,isResetIds:any){
    if(isResetIds){
      this.groupCommunicationForm.get('permanentAddress1').reset();
    }
    this.groupCommunicationModel.permanentBlockId = null;;
    this.groupCommunicationModel.permanentDivisionId = null;
    this.groupCommunicationModel.permanentBlockName = null;;
    this.groupCommunicationModel.permanentDivisionName = null;
    let village= this.pervillageList.find((obj:any) => null != obj && id != null && obj.value === id);
    if(village != null && undefined != village)
    this.groupCommunicationModel.permanentVillageName = village.label;
    if(village.data != null && village.data != undefined){
      this.getPerBlock(village.data.blockId);
      this.getPerDivision(village.data.divisionId);
    }
    this.sameAsRegisterAddress();
   }


   getPerDivision(id:any){
    let division=  this.divisionList.find((data:any) => null != data && id != null && data.value === id);
    if(division != null && undefined != division)
     this.groupCommunicationModel.permanentDivisionId = division.value
     this.groupCommunicationModel.permanentDivisionName = division.label
   }
   getPerBlock(id:any){
     let block=  this.blocksList.find((data:any) => null != data && id != null && data.value === id);
     if(block != null && undefined != block)
      this.groupCommunicationModel.permanentBlockId = block.value
     this.groupCommunicationModel.permanentBlockName = block.label
    }
  
  updateData() {
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.groupCommunicationForm.valid ,
      data: this.groupCommunicationModel,
      stepperIndex: 2,
      isDisable: this.groupCommunicationForm.valid? false : true, 
    });
  }
  sameAsPerAddr(isSameAddress: any) {
    if (isSameAddress) {
      this.groupCommunicationModel.isSameAddress = applicationConstants.TRUE;
      // this.groupCommunicationForm.get('permanentPincode').reset();
      // this.groupCommunicationForm.get('permanentStateId').disable();
      // this.groupCommunicationForm.get('permanentDistrictId').disable();
      // this.groupCommunicationForm.get('permanentSubDistrictId').disable();
      // this.groupCommunicationForm.get('permanentVillageId').disable();
      // this.groupCommunicationForm.get('permanentAddress1').disable();
      // // this.communicationform.get('permenentAddressTwo').disable();
      // this.groupCommunicationForm.get('permanentPincode').disable();

      this.groupCommunicationForm.get('pincode').reset();
      this.groupCommunicationForm.get('stateName').disable();
      this.groupCommunicationForm.get('districtName').disable();
      this.groupCommunicationForm.get('villageName').disable();
      this.groupCommunicationForm.get('subDistrictName').disable();
      this.groupCommunicationForm.get('address1').disable();
      this.groupCommunicationForm.get('pincode').disable();

      this.groupCommunicationModel.stateId = this.groupCommunicationModel.permanentStateId;
      if (this.groupCommunicationModel.permanentDistrictId != this.groupCommunicationModel.districtId) {
        this.groupCommunicationModel.districtId = null;
        this.getAllDistrictsByStateId(this.groupCommunicationModel.stateId, false);
        this.groupCommunicationModel.districtId = this.groupCommunicationModel.permanentDistrictId;
      }
      if (this.groupCommunicationModel.permanentSubDistrictId != this.groupCommunicationModel.subDistrictId) {
        this.groupCommunicationModel.subDistrictId = null;
        this.getAllSubDistrictsByDistrictId(this.groupCommunicationModel.districtId, false);
        this.groupCommunicationModel.subDistrictId = this.groupCommunicationModel.permanentSubDistrictId;
      }
      if (this.groupCommunicationModel.permanentVillageId != this.groupCommunicationModel.villageId) {
        this.groupCommunicationModel.villageId = null;
        this.getAllVillagesBySubDistrictId(this.groupCommunicationModel.subDistrictId, false);
        this.groupCommunicationModel.villageId = this.groupCommunicationModel.permanentVillageId;
        if(this.groupCommunicationModel.villageId != null && this.groupCommunicationModel.villageId != undefined){
          this.groupCommunicationModel.villageName = this.groupCommunicationModel.permanentVillageName;
          // this.getPerVillage(this.groupCommunicationModel.permanentVillageId);
        }
      }

      this.groupCommunicationModel.address1 = this.groupCommunicationModel.permanentAddress1;
      // this.groupCommunicationModel.permanentAddress2 = this.groupCommunicationModel.address2;
      this.groupCommunicationModel.pincode = this.groupCommunicationModel.permanentPincode;

      this.groupCommunicationModel.blockId = this.groupCommunicationModel.permanentBlockId;
      this.groupCommunicationModel.blockName = this.groupCommunicationModel.permanentBlockName;

      this.groupCommunicationModel.divisionId = this.groupCommunicationModel.permanentDivisionId;
      this.groupCommunicationModel.divisionName = this.groupCommunicationModel.permanentDivisionName;
    }
    else {
      this.groupCommunicationModel.isSameAddress = applicationConstants.FALSE;

      this.groupCommunicationForm.get('stateName').enable();
      this.groupCommunicationForm.get('districtName').enable();
      this.groupCommunicationForm.get('villageName').enable();
      this.groupCommunicationForm.get('subDistrictName').enable();
      this.groupCommunicationForm.get('address1').enable();
      this.groupCommunicationForm.get('pincode').enable();

      // this.groupCommunicationForm.get('permanentStateId').enable();
      // this.groupCommunicationForm.get('permanentDistrictId').enable();
      // this.groupCommunicationForm.get('permanentSubDistrictId').enable();
      // this.groupCommunicationForm.get('permanentVillageId').enable();
      // this.groupCommunicationForm.get('permanentAddress1').enable();
      // // this.communicationform.get('permenentAddressTwo').enable();
      // this.groupCommunicationForm.get('permanentPincode').enable();

      this.groupCommunicationForm.get('stateName').reset();
      this.groupCommunicationForm.get('districtName').reset();
      this.groupCommunicationForm.get('villageName').reset();
      this.groupCommunicationForm.get('subDistrictName').reset();
      this.groupCommunicationForm.get('address1').reset();
      this.groupCommunicationForm.get('pincode').reset();
      this.groupCommunicationForm.get('division').reset();
      this.groupCommunicationForm.get('block').reset();

      // this.groupCommunicationForm.get('permanentStateId').reset();
      // this.groupCommunicationForm.get('permanentDistrictId').reset();
      // this.groupCommunicationForm.get('permanentSubDistrictId').reset();
      // this.groupCommunicationForm.get('permanentVillageId').reset();
      // this.groupCommunicationForm.get('permanentAddress1').reset();
      // // this.communicationform.get('permenentAddressTwo').reset();
      // this.groupCommunicationForm.get('permanentPincode').reset();

      this.districtList = [];
      this.subDistrictList = [];
      this.villageList = [];


      // this.groupCommunicationForm.get('permanentStateId').enable();
      // this.groupCommunicationForm.get('permanentDistrictId').enable();
      // this.groupCommunicationForm.get('permanentSubDistrictId').enable();
      // this.groupCommunicationForm.get('permanentVillageId').enable();
      // this.groupCommunicationForm.get('permanentAddress1').enable();
      // this.groupCommunicationForm.get('permanentPincode').enable();
      // this.communicationform.get('permenentAddressTwo').enable();
      // this.communicationform.get('permanentPincode').enable();

      this.groupCommunicationModel.stateId = null;
      this.groupCommunicationModel.districtId = null;
      this.groupCommunicationModel.subDistrictId = null;
      this.groupCommunicationModel.villageId = null;
      this.groupCommunicationModel.address1 = null;
      // this.groupCommunicationModel.permanentAddress2 = null;
      this.groupCommunicationModel.pincode = null;
      this.groupCommunicationModel.blockId = null;
      this.groupCommunicationModel.divisionId = null;

    }
    this.updateData();
  }

  RegAddressToComAddress() {
    if (this.groupCommunicationModel.isSameAddress == applicationConstants.TRUE) {
      this.groupCommunicationModel.address1 = this.groupCommunicationModel.permanentAddress1;
      // this.groupCommunicationModel.permanentAddress2 = this.groupCommunicationModel.address2;
      this.groupCommunicationModel.pincode = this.groupCommunicationModel.permanentPincode;
    }
  }
  sameAsRegisterAddress() {
    if (this.groupCommunicationModel.isSameAddress == applicationConstants.TRUE) {
      this.groupCommunicationModel.stateId = this.groupCommunicationModel.permanentStateId;
      if (this.groupCommunicationModel.permanentDistrictId != this.groupCommunicationModel.districtId) {
        this.groupCommunicationModel.districtId = null;
        this.groupCommunicationModel.permanentDistrictName = null;
        this.getAllDistrictsByStateId(this.groupCommunicationModel.stateId,false);
        this.groupCommunicationModel.districtId = this.groupCommunicationModel.permanentDistrictId;
      }
      if (this.groupCommunicationModel.permanentSubDistrictId != this.groupCommunicationModel.subDistrictId) {
        this.groupCommunicationModel.subDistrictId = null;
        this.groupCommunicationModel.subDistrictName = null;
        this.getAllSubDistrictsByDistrictId(this.groupCommunicationModel.districtId,false);
        this.groupCommunicationModel.subDistrictId = this.groupCommunicationModel.permanentSubDistrictId;
      }
      if (this.groupCommunicationModel.permanentVillageId != this.groupCommunicationModel.villageId) {
        this.groupCommunicationModel.villageId = null;
        this.groupCommunicationModel.villageName = null;
        this.getAllVillagesBySubDistrictId(this.groupCommunicationModel.subDistrictId,false);
        this.groupCommunicationModel.villageId = this.groupCommunicationModel.permanentVillageId;
       
      }
      if (this.groupCommunicationModel.address1 != this.groupCommunicationModel.permanentAddress1) {
        this.groupCommunicationModel.address1 = null;
        this.groupCommunicationModel.address1 = this.groupCommunicationModel.permanentAddress1;
      }
      if (this.groupCommunicationModel.pincode != this.groupCommunicationModel.permanentPincode) {
        this.groupCommunicationModel.pincode = null;
        this.groupCommunicationModel.pincode = this.groupCommunicationModel.permanentPincode;
      }
      if (this.groupCommunicationModel.divisionId != this.groupCommunicationModel.permanentDivisionId) {
        this.groupCommunicationModel.divisionId = null;
        this.groupCommunicationModel.divisionId = this.groupCommunicationModel.permanentDivisionId;
      }
      if (this.groupCommunicationModel.blockId != this.groupCommunicationModel.permanentBlockId) {
        this.groupCommunicationModel.blockId = null;
        this.groupCommunicationModel.blockId = this.groupCommunicationModel.permanentBlockId;
      }
      this.getVillage(this.groupCommunicationModel.villageId,true);
       
    }
  }

  
}
 
