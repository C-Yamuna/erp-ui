import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Membershiptransactionconstant } from '../../membership-transaction-constant';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemInstitutionService } from '../../shared/mem-institution.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { MemberBasicDetailsStepperService } from '../../individual/shared/membership-individual-stepper.service';

import { InstitutionPromoterDetailsService } from '../../shared/institution-promoter-details.service';
import { InstitutionKycDetailsService } from '../../shared/institution-kyc-details.service';
import { InstitutionCommunicationService } from '../../shared/institution-communication.service';
import { InstiteKycDetailsModel, InstituteCommunicationModel, InstitutePromoterDetails, InstitutionBasicDetailsModel } from '../../shared/institution-details.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-institution-stepper',
  templateUrl: './institution-stepper.component.html',
  styleUrls: ['./institution-stepper.component.css']
})
export class InstitutionStepperComponent implements OnInit {
  institutionBasicDetailsModel: InstitutionBasicDetailsModel = new InstitutionBasicDetailsModel();
  instituteCommunicationModel: InstituteCommunicationModel = new InstituteCommunicationModel()
  institeKycDetailsModel: InstiteKycDetailsModel = new InstiteKycDetailsModel();
  institutePromoterDetails: InstitutePromoterDetails = new InstitutePromoterDetails();
  items: MenuItem[] = [];
  activeIndex: number = 0;
  buttonDisabled: boolean = false;

  completed = 0;
  branchId: number = 1;
  pacsId: number = 1;
  saveAndContinueFlag: boolean = true;
  isEdit: any;
  responseModel!: Responsemodel;

  savedID: any;
  msgs: any[] = [];
  orgnizationSetting: any;
  communication: any;
  kyc: any;
  land: any;
  nominee: any;
  familydetails: any;
  document:any;
  asset: any;
  basicDetails: any;
  buttonDisbled: boolean = true;
  isSaveContinueEnable: boolean = false;
  nextDisable: boolean = false;
  serviceUrl: any;

  // isSaveContinueEnable: boolean = false;

  constructor(public messageService: MessageService, private router: Router, private memInstitutionService: MemInstitutionService,
    private route: Router, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonComponent: CommonComponent, private commonFunctionService: CommonFunctionsService, private translate: TranslateService,
    private memberBasicDetailsStepperService: MemberBasicDetailsStepperService, private ref: ChangeDetectorRef, private institutionCommunicationService: InstitutionCommunicationService,
    private institutionKycDetailsService: InstitutionKycDetailsService, private institutionPromoterDetailsService: InstitutionPromoterDetailsService, private datePipe: DatePipe,
  ) {

  }
  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  ngOnInit() {
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        let qParams = queryParams;
        this.savedID = qParams;
        if (this.institutionBasicDetailsModel != null && this.instituteCommunicationModel != null && this.institeKycDetailsModel != null
          && this.institutePromoterDetails != null
        )
          this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    });
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    // this.commonFunctionService.setStorageValue(applicationConstants.TERM_LOAN_ID, this.savedID);
    // this.getProductDetailsObservable();
    this.completed = this.activeIndex;
    if (this.savedID != undefined) {
      this.saveAndContinueFlag = applicationConstants.FALSE;
      this.commonFunctionService.data.subscribe((res: any) => {
        if (res) {
          this.translate.use(res);
        } else {
          this.translate.use(this.commonFunctionService.getStorageValue('language'));
        }
        this.translate.get('ERP.BASIC_DETAILS').subscribe((text: string) => {
          this.basicDetails = text;
        });
        this.translate.get('ERP.KYC').subscribe((text: string) => {
          this.kyc = text;
        });
        this.translate.get('ERP.COMMUNICATION').subscribe((text: string) => {
          this.communication = text;
        });
        this.translate.get('MEMBERSHIP_TRANSACTION.DOCUMENT_DEATAILS').subscribe((text: string) => {
          this.document = text;
      
          this.items = [
            {
              label: this.basicDetails,icon: 'fa fa-id-badge', routerLink: Membershiptransactionconstant.INSTITUTION_BASIC_DETAILS, queryParams: { id: this.encryptDecryptService.encrypt(this.savedID) },
              command: (event: any) => {
                this.activeIndex = 0;
              }

            },
            {
              label: this.kyc,icon: 'fa fa-podcast',routerLink: Membershiptransactionconstant.INSTITUTION_KYC, queryParams: { id: this.encryptDecryptService.encrypt(this.savedID) },
              command: (event: any) => {
                this.activeIndex = 1;
              }
            },
            {
              label: this.communication,icon: 'fa fa-map-marker', routerLink: Membershiptransactionconstant.INSTITUTION_COMMUNICATION, queryParams: { id: this.encryptDecryptService.encrypt(this.savedID) },
              command: (event: any) => {
                this.activeIndex = 2;
              }
            },
            {
              label: this.document,icon: 'fa fa-file-text', routerLink: Membershiptransactionconstant.INSTITUTION_DOCUMENT, queryParams: { id: this.encryptDecryptService.encrypt(this.savedID) },
              command: (event: any) => {
                this.activeIndex = 3;
              }
            }
           
          ]; this.memberBasicDetailsStepperService.currentStep.subscribe((data: any) => {
            if (data != undefined || null) {
              this.activeIndex = data.stepperIndex
              // this.changeStepperSelector();
              this.buttonDisbled = data.isDisable
              if (data.data != null) {
                if (this.activeIndex == 0) {
                  // this.institutionBasicDetailsModel = data.data;
                  // this.isSaveContinueEnable = false;
                  this.institutePromoterDetails = data.data;
                  this.savedID = data.savedId;
                } else if (this.activeIndex == 1) {
                  this.institeKycDetailsModel = data.data;
                }
                else if (this.activeIndex == 2) {
                  this.instituteCommunicationModel = data.data;
                }
                else {
                  this.institeKycDetailsModel = data.data;
                 
                }
                // if (null != this.memberBasicDetailsModel && undefined != this.memberBasicDetailsModel && null != this.memberBasicDetailsModel.docFilesList && undefined != this.memberBasicDetailsModel.docFilesList) {
                //   this.docFilesList = [];
                //   this.docFilesList = this.memberBasicDetailsModel.docFilesList.map(x => Object.assign({}, x));
                // }
              }
            }
          })
        });
      });
    }
    else {
      this.saveAndContinueFlag = applicationConstants.TRUE;
      this.commonFunctionService.data.subscribe((res: any) => {
        if (res) {
          this.translate.use(res);
        } else {
          this.translate.use(this.commonFunctionService.getStorageValue('language'));
        }
        this.translate.get('ERP.BASIC_DETAILS').subscribe((text: string) => {
          this.basicDetails = text;
        });
        this.translate.get('ERP.KYC').subscribe((text: string) => {
          this.kyc = text;
        });
        this.translate.get('ERP.COMMUNICATION').subscribe((text: string) => {
          this.communication = text;
        });
        this.translate.get('MEMBERSHIP_TRANSACTION.DOCUMENT_DEATAILS').subscribe((text: string) => {
          this.document = text;
          this.items = [
            {
              label: this.basicDetails,icon: 'fa fa-id-badge'
            },
            {
              label: this.kyc,icon: 'fa fa-podcast'
            },
            {
              label: this.communication,icon: 'fa fa-map-marker'
            },
            {
              label: this.document,icon: 'fa fa-file-text'
            },

          ]
          this.memberBasicDetailsStepperService.currentStep.subscribe((data: any) => {
            if (data != undefined || null) {
              this.activeIndex = data.stepperIndex
              this.changeStepperSelector();
              this.buttonDisbled = data.isDisable
              if (data.data != null) {
                if (this.activeIndex == 0) {
                  // this.institutionBasicDetailsModel = data.data;
                  // this.fileUploadShow = data.showFile;
                  this.institutePromoterDetails = data.data;
                  this.savedID = data.savedId;
                  this.isSaveContinueEnable = true;
                } else if (this.activeIndex == 1) {
                  this.institeKycDetailsModel = data.data;
                } else if(this.activeIndex == 2){
                  this.instituteCommunicationModel = data.data;
                }else{
                  this.institeKycDetailsModel = data.data;
                }
                // if (null != this.memberBasicDetailsModel && undefined != this.memberBasicDetailsModel && null != this.memberBasicDetailsModel.docFilesList && undefined != this.memberBasicDetailsModel.docFilesList) {
                //   this.docFilesList = [];
                //   this.docFilesList = this.memberBasicDetailsModel.docFilesList.map(x => Object.assign({}, x));
                // }
              }
            }
          })
        });
      });
    }

    // this.currentStepper();
  }

  changeStepperSelector() {
    this.items.map((val, index) => {
      if (this.activeIndex == index) {
        val['disabled'] = false;
      } else {
        val['disabled'] = true;
      }
      return val;
    })
  }
  getProductDetailsObservable() {
    this.memberBasicDetailsStepperService.currentStep.subscribe((data: any) => {
      if (data != undefined) {
        this.changeStepperSelector();
        if (data.isDisable != null) {
          this.nextDisable = data.isDisable;
          this.buttonDisbled = (data.formValid == false) ? true : false;
        }
        this.serviceUrl = data.serviceUrl;
      }
    });
  }
  navigateTo(activeIndex: number,savedId:any) {
    switch (activeIndex) {
      case 0:
        this.router.navigate([]);
        this.router.navigate([Membershiptransactionconstant.INSTITUTION_BASIC_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(savedId) } });
        break;
      case 1:
        this.router.navigate([Membershiptransactionconstant.INSTITUTION_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(savedId) } });
        break;
      case 2:
        this.router.navigate([Membershiptransactionconstant.INSTITUTION_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(savedId) } });
        break;
      case 3:
        this.router.navigate([Membershiptransactionconstant.INSTITUTION_DOCUMENT], { queryParams: { id: this.encryptDecryptService.encrypt(savedId) } });
        break;
    }
  }
  


  prevStep(activeIndex: any) {
    this.activeIndex = activeIndex - 1;
    this.navigateTo(this.activeIndex,this.savedID);
  }

  nextStep(activeIndex: any) {
    if (activeIndex == 0) {
      this.addOrUpdatePromoterDetails(activeIndex, "next");
    }
    else if (activeIndex == 1) {
      this.addOrUpdateKycDetails(activeIndex, "next")
      
    }
    else if (activeIndex == 2) {
      this.addOrUpdateCommunicationDetails(activeIndex, "next")
    }
    else {
      this.activeIndex = activeIndex + 1;
      this.navigateTo(this.activeIndex,this.savedID);
    }
  }
  back(activeIndex: any) {
    this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
  }
  cancel(activeIndex: any) {
    this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
  }
 
  submit(activeIndex: any) {
    this.addOrUpdateDocumentDetails(activeIndex,"next");
    
  }
  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }
  stepperCreation() {
    this.commonFunctionService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use(this.commonFunctionService.getStorageValue('language'));
      }
      this.translate.get('ERP.BASIC_DETAILS').subscribe((text: string) => {
        this.basicDetails = text;
      });
      this.translate.get('ERP.KYC').subscribe((text: string) => {
        this.kyc = text;
      });
      this.translate.get('ERP.COMMUNICATION').subscribe((text: string) => {
        this.communication = text;

        this.items = [
          {
            label: this.basicDetails
          },
          {
            label: this.kyc
          },
          {
            label: this.communication
          },

        ];
      });
    });
  }

addOrUpdateCommunicationDetails(activeIndex:any,buttonName:any) {
  //saveorupdate code here
  this.instituteCommunicationModel.branchId = 1;
  // remove this line before commit 
  this.instituteCommunicationModel.pacsId = 1;
if (this.instituteCommunicationModel.id != null) {
  this.institutionCommunicationService.updateInstitutionCommunication(this.instituteCommunicationModel).subscribe((response: any) => {
    this.responseModel = response;
    if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
      this.instituteCommunicationModel = this.responseModel.data[0]; 
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      if (buttonName == "next") {
        this.activeIndex = activeIndex + 1;
        this.navigateTo(this.activeIndex,this.instituteCommunicationModel.institutionId);
        // this.router.navigate([Membershiptransactionconstant.VIEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(this.savedID) , type: this.encryptDecryptService.encrypt('Institution') ,editbtn:this.encryptDecryptService.encrypt(2),isGridPage:this.encryptDecryptService.encrypt(applicationConstants.ACTIVE)}});
      } 
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  },
    error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
} else {
  this.institutionCommunicationService.addInstitutionCommunication(this.instituteCommunicationModel).subscribe((response: any) => {
    this.responseModel = response;
    if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.instituteCommunicationModel = this.responseModel.data[0]; 
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      if (buttonName == "next") {
        this.activeIndex = activeIndex + 1;
        this.navigateTo(this.activeIndex,this.instituteCommunicationModel.institutionId);
        // this.savedID = this.responseModel.data[0].id;
        // this.router.navigate([Membershiptransactionconstant.VIEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(this.savedID) , type: this.encryptDecryptService.encrypt('Institution') ,editbtn:this.encryptDecryptService.encrypt(2),isGridPage:this.encryptDecryptService.encrypt(applicationConstants.ACTIVE)}});
      } 
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  },
    error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
}
}
addOrUpdatePromoterDetails(activeIndex:any,buttonName:any) {
  if (buttonName == "next") {
    this.activeIndex = activeIndex + 1;
    this.navigateTo(this.activeIndex,this.savedID)
  } 
  this.commonComponent.startSpinner();
}
addOrUpdateKycDetails(activeIndex:any,buttonName:any) {
  if (buttonName == "next") {
    this.activeIndex = activeIndex + 1;
    this.navigateTo(this.activeIndex,this.savedID)
  } 
  this.commonComponent.startSpinner();
}
addOrUpdateDocumentDetails(activeIndex:any,buttonName:any) {
  if (buttonName == "next") {
    this.activeIndex = activeIndex + 1;
    this.router.navigate([Membershiptransactionconstant.VIEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(this.savedID) , type: this.encryptDecryptService.encrypt('Institution') ,editbtn:this.encryptDecryptService.encrypt(2),isGridPage:this.encryptDecryptService.encrypt(applicationConstants.ACTIVE)}});

  } 
  this.commonComponent.startSpinner();
}

}