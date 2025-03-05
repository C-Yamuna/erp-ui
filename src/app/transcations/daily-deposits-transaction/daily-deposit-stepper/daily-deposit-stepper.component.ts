import { Component } from '@angular/core';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from '../../term-deposits-transcation/shared/membership-basic-detail.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MenuItem } from 'primeng/api';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { AccountTypes, CommonStatusData, MemberShipTypesData } from '../../common-status-data.json';
import { AccountCommunication } from '../shared/account-communication.model';
import { Accounts } from '../shared/accounts.model';
import { AccountKYC } from '../shared/account-kyc.model';
import { AccountNominee } from '../shared/account-nominee.model';
import { AccountGuardian } from '../shared/account-guardian.model';
import { JointAccountHolder } from '../shared/joint-account-holder.model';
import { DailyDepositsAccountsService } from '../shared/daily-deposits-accounts.service';
import { DailyDepositTransactionConstants } from '../daily-deposits-transaction-constants';
import { AccountRequriedDocuments } from '../shared/account-requried-documents.model';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';

@Component({
  selector: 'app-daily-deposit-stepper',
  templateUrl: './daily-deposit-stepper.component.html',
  styleUrls: ['./daily-deposit-stepper.component.css']
})
export class DailyDepositStepperComponent {

  items: MenuItem[] = [];
  activeIndex: number = 0;
  buttonDisabled: boolean = false;
  accId: any;
  activeItem: any;
  societyId: any;
  branchId: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  completed: any;
  flagForLabelName: boolean = false;

  admissionNumber: any;
  previouseButtonDisable: boolean = false;
  surName: any;
  name: any;
  gender: any;
  age: any;
  maritalStatus: any;
  relationshipType: any;
  relativeName: any;
  mobileNumber: any;
  email: any;
  dateOfBirth: any;
  accountType: any;
  flag: Boolean = false;
  isApplicationEdit: boolean = false;
  isCommunicationEdit: boolean = false;
  isJointEdit: boolean = false;
  isKycEdit: boolean = false;
  isNomineeEdit: boolean = false;
  isDocumentEdit: boolean = false;
  flagForNomineeTypeValue: any;
  isPerminentAddressIsSameFalg: boolean = false;
  accountNumber: any;
  memberTypeName: any;
  menuDisabled: boolean = true;
  checked: Boolean = false;
  showForm: boolean = false;
  tabviewButton: boolean = true;
  pacsId: any;
  accountTypeName: any;
  allTypesOfmembershipList: any;

  // memberCard feilds 
  individualFlag: boolean = true;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  isNewMemberCreation: boolean = false;
  permenentAllTypesOfmembershipList: any;
  orgnizationSetting: any;
  memberDropDownDisable: boolean = false;
  membershipBasicRequiredDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  accountCommunicationModel: AccountCommunication = new AccountCommunication();
  accountsModel: Accounts = new Accounts();
  kycModel: AccountKYC = new AccountKYC();
  accountNomineeModel: AccountNominee = new AccountNominee();
  jointHolderModel: JointAccountHolder = new JointAccountHolder();
  accountGuardianModel: AccountGuardian = new AccountGuardian();
  requiredDocumentDetails: AccountRequriedDocuments = new AccountRequriedDocuments();
  memberTypeId: any;
  admissionNumberDropDownDisable: boolean = false;
  previousStepFlag: boolean = false;
  membreIndividualFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  groupPrmotersList: any[] = [];
  groupPrmoters: any[] = [];
  institionPromotersList: any[] = [];
  columns: any[] = [];
  photoCopyFlag: boolean = false;
  memberSignatureCopyZoom: boolean = false;
  memberDetails: any;
  isKycApproved: any;
  jointAccountHolderList: any[] = [];
  memberTypeList: any[] = [];



  constructor(private router: Router,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService) { 
    this.columns = [
      { field: 'surname', header: 'SURNAME' },
      { field: 'name', header: 'NAME' },
      { field: 'operatorTypeName', header: 'TRANSACTION_DATE' },
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender Name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile Number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
    ];

    this.groupPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDate', header: 'start date' },
    ];
  }


  ngOnInit() {
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();

    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);


    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo'] != undefined || params['falg'] != undefined || params['showForm'] != undefined) {
        if (params['id'] != undefined) {
          let queryParams = Number(this.encryptDecryptService.decrypt(params['id']));
          let qParams = queryParams;
          this.accId = qParams;
          this.menuDisabled = false;
          this.getRdAccountById(this.accId);
        }
        if (params['falg'] != undefined || params['showForm'] != undefined) {
          this.refreshTheMemberCardData();
        }

        if (params['admissionNo'] != undefined) {
          let queryParams = Number(this.encryptDecryptService.decrypt(params['admissionNo']));
          let qParams = queryParams;
          this.admissionNumber = qParams;
          this.getMemberDetailsByAdmissionNUmber(this.admissionNumber);
          this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
          this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
        }
        this.isEditCheck(this.activeIndex);
      } else {
        this.isEdit = false;
        this.flagForLabelName = false;
      }
      this.itemList();
    });
    if (this.memberDetails != null && this.memberDetails != undefined) {
      this.membershipBasicRequiredDetailsModel = this.memberDetails
    }
    this.itemList();
    if (!this.showForm) {
      this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    }
    this.appendCurrentStepperData();
   
  }


  refreshTheMemberCardData() {
    this.dailyDepositsAccountsService.resetCurrentStep();
    this.membershipBasicRequiredDetailsModel = new MembershipBasicDetail();
    this.memberGroupDetailsModel = new MemberGroupDetailsModel();
    this.membershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
    this.admissionNumber = null;
  }


  appendCurrentStepperData() {
    this.itemList();
    this.dailyDepositsAccountsService.currentStep.subscribe((data: any) => {
      if (data) {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      } else {
        this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      }

      if (data != undefined) {
        this.activeIndex = data.stepperIndex;
        this.previouseButtonDisable = false;
        this.changeStepperSelector(this.activeIndex);
        this.buttonDisabled = data.isDisable;
        if (data.data != null && data.data != undefined) {
          if (this.activeIndex == 0) {
            this.accountsModel = data.data;
            // if (this.accountsModel != null && this.accountsModel != undefined) {
            //   if (this.accountsModel.isNewMember != null && this.accountsModel.isNewMember != undefined)
            //     this.showForm = this.accountsModel.isNewMember;
            //   if (this.accountsModel.adminssionNumber != null && this.accountsModel.adminssionNumber != undefined)
            //     this.admissionNumber = this.accountsModel.adminssionNumber;
            //   if (this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined)
            //     this.memberTypeName = this.accountsModel.memberTypeName;
            //   this.memberTypeCheck(this.memberTypeName, this.accountsModel);
            // }
            this.itemList();
          }
          else if (this.activeIndex == 1) {
            this.previouseButtonDisable = data.isDisable;
            if (data.data != null && data.data != undefined) {
              this.kycModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 2) {
            if (data.data != null && data.data != undefined) {
              this.accountCommunicationModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 3) {
            if (data.data != null && data.data != undefined) {
              this.accountsModel = data.data;
              
            }
            this.itemList();
          }

          else if (this.activeIndex == 4) {
            if (data.data != null && data.data != undefined) {
              if (data.data.admissionNumber != null && data.data.admissionNumber != undefined) {
                this.accountsModel.adminssionNumber = data.data.admissionNumber;
              }
              
              if (data.data.accId != null && data.data.accId != undefined) {
                this.accId = data.data.accId;
              }
              if (data.data.tdJointAccHolderDetailsDTOList != null && data.data.tdJointAccHolderDetailsDTOList != undefined && data.data.tdJointAccHolderDetailsDTOList.length > 0) {
                this.jointAccountHolderList = data.data.tdJointAccHolderDetailsDTOList;
              }
              this.jointHolderModel = data.data;
            }
            this.itemList();
          }
          else if (this.activeIndex == 5) {
            if (data.data != null && data.data != undefined) {
              this.accountNomineeModel = data.data;
              
              if (this.accountNomineeModel != null && this.accountNomineeModel != undefined) {
                if (this.accountNomineeModel.accountGuardian != null && this.accountNomineeModel.accountGuardian != undefined) {
                  this.accountGuardianModel = this.accountNomineeModel.accountGuardian;
                }
              }
            }
           
            this.itemList();
          } else if (this.activeIndex == 6 ) {
            if (data.data != null && data.data != undefined) {
              this.requiredDocumentDetails = data.data;
            }
            this.itemList();
          }
        }
      }
    });
  }




  itemList() {
    if (this.showForm) {
      if (this.accountsModel.accountTypeName != AccountTypes.JOINT) {
        this.items = [
          {
            label: 'Member Details', icon: 'fa fa-id-badge', routerLink: DailyDepositTransactionConstants.NEW_MEMBER,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_KYC,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 1;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Required Documents', icon: 'fa fa-file-text', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_REQURIED_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          }
        ];
      }
      else {
        this.items = [
          {
            label: 'Member Details', icon: 'fa fa-id-badge', routerLink: DailyDepositTransactionConstants.NEW_MEMBER,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_KYC,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 1;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_JOINTHOLDER_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 4;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Required Documents', icon: 'fa fa-file-text', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_REQURIED_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          }
        ];
      }
    }
    else {
      if (this.accountsModel.accountTypeName != AccountTypes.JOINT) {
        this.items = [
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: DailyDepositTransactionConstants.MEMBERSHIP_BASIC_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Required Documents', icon: 'fa fa-file-text', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_REQURIED_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          }
        ];
      }
      else {
        this.items = [
          {
            label: 'KYC', icon: 'fa fa-podcast', routerLink: DailyDepositTransactionConstants.MEMBERSHIP_BASIC_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 0;
            }
          },
          {
            label: 'Communication', icon: 'fa fa-map-marker', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_COMMUNICATION,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 2;
            }
          },
          {
            label: 'Application', icon: 'fa fa-id-badge', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 3;
            }
          },
          {
            label: 'Joint Account', icon: 'fa fa-handshake-o', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_JOINTHOLDER_DETAILS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 4;
            }
          },
          {
            label: 'Nominee', icon: 'fa fa-user-o', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_NOMINEE,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 5;
            }
          },
          {
            label: 'Required Documents', icon: 'fa fa-file-text', routerLink: DailyDepositTransactionConstants.DAILY_DEPOSIT_REQURIED_DOCUMENTS,
            disabled: this.menuDisabled,
            command: (event: any) => {
              this.activeIndex = 6;
            }
          }
        ];
      }
    }
    this.activeItem = this.items[this.activeIndex];

    this.activeItem = this.items[this.activeIndex];
  }


  memberTypeCheck(memberType: any, data: any) {
    if (memberType == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.membershipBasicRequiredDetailsModel = data.memberShipBasicDetailsDTO;
    }
    else if (memberType == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.memberGroupDetailsModel = data.memberShipGroupDetailsDTO;
    }
    else if (memberType == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.membershipInstitutionDetailsModel = data.memInstitutionDTO;
    }
  }

  isEditCheck(activeIndex: any) {
    if (activeIndex == 0) {
      this.isEdit = true;
    }
    else if (activeIndex == 1) {
      this.isApplicationEdit = true
    }
    else if (activeIndex == 2) {
      this.isJointEdit = true
    }
    else if (activeIndex == 3) {
      this.isCommunicationEdit = true
    }
    else if (activeIndex == 4) {
      this.isKycEdit = true
    }
    else if (activeIndex == 5) {
      this.isNomineeEdit = true
    }
    else if (activeIndex == 6) {
      this.isDocumentEdit = true
    }
  }

  changeStepperSelector(item: any) {
    // if (this.menuDisabled) {
    //   return; // Do nothing if menu is disabled
    // }
    this.activeItem = item;
    this.menuDisabled = true;
    this.items.map((val, index) => {
      if (this.activeIndex == index) {
        val['disabled'] = false;
      } else {
        val['disabled'] = true;
      }
      return val;
    })
  }

  //membership module admissionNumbers 
  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.dailyDepositsAccountsService.getAllMembershipDetailsFromMembership(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.permenentAllTypesOfmembershipList = this.responseModel.data;
            this.allTypesOfmembershipList = this.permenentAllTypesOfmembershipList.filter((obj: any) => obj != null && obj.statusName==CommonStatusData.APPROVED).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
              return {
                label: `${relationType.name} - ${relationType.admissionNumber} - ${relationType.memberTypeName}`,
                value: relationType.admissionNumber
              };
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
    });
  }

  navigateTo(activeIndex: number, accId: any) {
    this.itemList();
    switch (activeIndex) {
      case 0:
        if (!this.showForm) {
          this.router.navigate([DailyDepositTransactionConstants.MEMBERSHIP_BASIC_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        }
        else {
          this.router.navigate([DailyDepositTransactionConstants.NEW_MEMBER], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        }
        break;
      case 1:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        break;
      case 2:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        break;
      case 3:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        break;
      case 4:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_JOINTHOLDER_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        break;
      case 5:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        break;
      case 6:
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_REQURIED_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId) } });
        break;
    }
  }

  prevStep(activeIndex: number) {
    this.activeIndex = activeIndex - 1;
    if (activeIndex == 0) {
      this.navigateTo(this.activeIndex, this.accId);
    }
    else if (activeIndex == 1) {
      this.navigateTo(this.activeIndex, this.accId);
    }
    else if (activeIndex == 2) {
      if (!this.showForm) {
        this.activeIndex = this.activeIndex - 1;
      }
      this.navigateTo(this.activeIndex, this.accId);
    }
    else if (activeIndex == 3) {
      this.navigateTo(this.activeIndex, this.accId);
    }
    else if (activeIndex == 4) {
      this.navigateTo(this.activeIndex, this.accId);
    }
    else if (activeIndex == 5) {
      if (this.accountsModel.accountTypeName != AccountTypes.JOINT) {
        this.flag = false;
        this.activeIndex = this.activeIndex - 1;
      }
      this.navigateTo(this.activeIndex, this.accId);
    }
    else if (activeIndex == 6) {
      this.navigateTo(this.activeIndex, this.accId);
    }
  }
  nextStep(activeIndex: number) {
    if (activeIndex == 0) {
      if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
        this.setMemberDetailsTofdApplicationDetails(this.accountsModel.memberShipBasicDetailsDTO);
      } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
        this.setMemberDetailsTofdApplicationDetails(this.accountsModel.memberShipGroupDetailsDTO);
      } else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
        this.setMemberDetailsTofdApplicationDetails(this.accountsModel.memInstitutionDTO);
      }
      this.addAOrUpdateRdApplicationWithMemberModuleDetails(activeIndex, "next");
    }
    else if (activeIndex == 2) {
      this.addOrUpdateCommunicationDetails(activeIndex, "next");
    } else if (activeIndex == 3) {
      if (!this.isNomineeEdit) {
        this.flagForNomineeTypeValue = 0;
      } else {
        // this.flagForNomineeTypeValue = this.accountNomineeModel.flagForNomineeTypeValue;
      }
      this.addAOrUpdateRdApplicationDetails(activeIndex, "next");
    } else if (activeIndex == 4) {
      this.saveJointHolder();
    } else if (activeIndex == 5) {
      this.addOrUpdateNomineeDetails();
      if (this.accountGuardianModel != null && this.accountGuardianModel != undefined) {
        this.addOrUpdateGurdianetails();
      }
    } else {
      this.activeIndex = activeIndex + 1;
      this.navigateTo(this.activeIndex, this.accId);
    }
  }

  setMemberDetailsTofdApplicationDetails(memeberdetailsObj: any) {
    this.accountsModel.memberType = memeberdetailsObj.memberTypeId;
    // this.accountsModel.memberTypeName = memeberdetailsObj.memberTypeName;
    // this.accountsModel.name = memeberdetailsObj.name;
    // // this.accountsModel.surName = memeberdetailsObj.surName;
    // this.accountsModel.email = memeberdetailsObj.emailId;
    // this.accountsModel.mobileNumber = memeberdetailsObj.mobileNumber;
  }
  back() {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT]);
  }

  cancel() {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT]);
  }

  navigateToPreview() {
    this.buttonDisabled = true;
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_VIEW], { queryParams: { id: this.encryptDecryptService.encrypt(this.accId), editbutton: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE), isGridPage: this.encryptDecryptService.encrypt(applicationConstants.ACTIVE) } });
  }


  onChange() {

    this.commonFunctionsService.setStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION, this.showForm);
    if (this.showForm) {
      this.router.navigate([DailyDepositTransactionConstants.NEW_MEMBER], { queryParams: { showForm: this.encryptDecryptService.encrypt(this.showForm) } });
    }
    else {
      this.router.navigate([DailyDepositTransactionConstants.MEMBERSHIP_BASIC_DETAILS], { queryParams: { showForm: this.encryptDecryptService.encrypt(this.showForm) } });
    }
  }

  getRdAccountById(id: any) {
    this.dailyDepositsAccountsService.getDailyDepositsByacid(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {

        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountsModel = this.responseModel.data[0];
            this.accountNumber = this.responseModel.data[0].accountNumber;
            this.memberDropDownDisable = true;
            this.isNewMemberCreation = true;
            this.admissionNumber = this.accountsModel.adminssionNumber;

            if (this.accountsModel.memberShipBasicDetailsDTO != null && this.accountsModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicRequiredDetailsModel = this.accountsModel.memberShipBasicDetailsDTO;

              if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
                this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
                this.membershipBasicRequiredDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                this.photoCopyFlag = true;
              }
              if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                this.photoCopyFlag = true;
              }
              if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved) {
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              }
              else {
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
              this.individualFlag = true;
              this.groupFlag = false;
              this.institutionFlag = false;
              this.showForm = this.membershipBasicRequiredDetailsModel.isNewMember
            }
            if (this.accountsModel.memberShipGroupDetailsDTO != null && this.accountsModel.memberShipGroupDetailsDTO != undefined) {
              this.groupFlag = true;
              this.institutionFlag = false;
              this.individualFlag = false;
              this.memberGroupDetailsModel = this.accountsModel.memberShipGroupDetailsDTO;
              this.showForm = this.memberGroupDetailsModel.isNewMember;

              if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
                this.memberGroupDetailsModel.registrationDate = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
                this.memberGroupDetailsModel.admissionDate = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined) {
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              }
              else {
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
            }
            if (this.accountsModel.memInstitutionDTO != null && this.accountsModel.memInstitutionDTO != undefined) {
              this.institutionFlag = true;
              this.individualFlag = false;
              this.groupFlag = false;
              this.membershipInstitutionDetailsModel = this.accountsModel.memInstitutionDTO;
              this.showForm = this.membershipBasicRequiredDetailsModel.isNewMember;
              if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined) {
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              }
              else {
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
            }
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
  OnChangeAdmissionNumber(admissionNo: any) {
    const filteredItem = this.allTypesOfmembershipList.find((item: { value: any; }) => item.value === admissionNo);
    const parts = filteredItem.label.split(' - ');
    let label = parts[parts.length - 1].trim();
    this.membershipBasicRequiredDetailsModel.memberTypeName = label;
    const admissionNumber = filteredItem.label.split(' - ');
    let admissionNumberLable = parts[parts.length - 2].trim();
    this.admissionNumber = admissionNumberLable;
    if (this.membershipBasicRequiredDetailsModel.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.getMemberDetailsByAdmissionNUmber(admissionNo);
    } else if (this.membershipBasicRequiredDetailsModel.memberTypeName == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.getGroupDetailsByAdmissionNumber(admissionNo);
    } else if (this.membershipBasicRequiredDetailsModel.memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.getInstitutionDetailsByAdmissionNumber(admissionNo);
    }
    this.router.navigate([DailyDepositTransactionConstants.MEMBERSHIP_BASIC_DETAILS], { queryParams: { admissionNo: this.encryptDecryptService.encrypt(admissionNo) } });

  }
  //get member module data by admissionNUmber
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.dailyDepositsAccountsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
          this.membershipBasicRequiredDetailsModel.rdAccountCommunicationDTO = this.responseModel.data[0].memberShipCommunicationDetailsDTOList;

          if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
            this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
            this.membershipBasicRequiredDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.rdAccountCommunicationDTO[0] != null && this.membershipBasicRequiredDetailsModel.rdAccountCommunicationDTO[0] != undefined) {
            this.accountCommunicationModel = this.membershipBasicRequiredDetailsModel.rdAccountCommunicationDTO[0];
          }
          if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
            this.photoCopyFlag = true;
          }
          if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
          }
          if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.membershipBasicRequiredDetailsModel.admissionNumber;
          this.accountsModel.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
          this.accountsModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetailsModel;
        }
      }
      else {
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

  //get group details from member module data by admissionNumber
  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.dailyDepositsAccountsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];

          this.memberTypeName = this.responseModel.data[0].memberTypeName;
          if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
            this.memberGroupDetailsModel.registrationDate = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
            this.memberGroupDetailsModel.admissionDate = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined) {
            this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;

          }
          if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.accountsModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
          this.accountsModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
        }
      }
      else {
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

  //get member institution details from member module by admissionNumber
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.dailyDepositsAccountsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.accountsModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;

          if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
            this.membershipInstitutionDetailsModel.registrationDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
            this.membershipInstitutionDetailsModel.admissionDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipInstitutionDetailsModel.institutionPromoterList.length && this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined) {
            this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
            
          }
          if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined) {
            this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
          }
          else {
            this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
          }
          this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
        }
      }
      else {
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


  // add or update fd non cumulative account with member/group/institution details
  addAOrUpdateRdApplicationWithMemberModuleDetails(activeIndex: any, buttonName: any) {
    if (this.showForm)
      this.accountsModel.isNewMember = applicationConstants.TRUE;
    else
      this.accountsModel.isNewMember = applicationConstants.FALSE;
    this.accountsModel.pacsId = 1;
    this.accountsModel.pacsCode = 12345;
    this.accountsModel.branchId = 1;
    if (this.accountsModel.id != null) {
      this.isApplicationEdit = true;
    }
    else {
      this.isApplicationEdit = false;
    }
    if (this.accountsModel.memberShipBasicDetailsDTO != null && this.accountsModel.memberShipBasicDetailsDTO)
      this.membershipBasicRequiredDetailsModel = this.accountsModel.memberShipBasicDetailsDTO;
    else if (this.accountsModel.memberShipGroupDetailsDTO != null && this.accountsModel.memberShipGroupDetailsDTO)
      this.memberGroupDetailsModel = this.accountsModel.memberShipGroupDetailsDTO;
    else if (this.accountsModel.memInstitutionDTO != null && this.accountsModel.memInstitutionDTO)
      this.membershipInstitutionDetailsModel = this.accountsModel.memInstitutionDTO;
    // member dates convert
    if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
      this.membershipBasicRequiredDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.dob));
    }
    if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
      this.membershipBasicRequiredDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.admissionDate));
    }
    // group dates convert
    if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
      this.memberGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.registrationDate));
    }
    if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
      this.memberGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.admissionDate));
    }
    // institution dates convert
    if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
      this.membershipInstitutionDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.registrationDate));
    }
    if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
      this.membershipInstitutionDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.admissionDate));
    }
    if (this.isApplicationEdit) {
      this.accountsModel.statusName = applicationConstants.IS_ACTIVE; 
      this.dailyDepositsAccountsService.updatedailyDepositsApplicationWithMemberModuleDetails(this.accountsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
              this.accId = this.responseModel.data[0].id;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                this.accountNumber = this.responseModel.data[0].accountNumber;
              }
              if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNumber;
              }
            }
          }
          // if (activeIndex === 3) {
          //   activeIndex = this.accountTypeBasedActiveIndexInscrement(this.accountTypeName);
          // }
          if (activeIndex === 0) {
            this.activeIndexIncrement();
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.responseModel.data[0].id)
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);

        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    } else {
      this.accountsModel.statusName = applicationConstants.IS_ACTIVE;
      this.accountsModel.statusName = CommonStatusData.IN_PROGRESS;
      this.dailyDepositsAccountsService.addDailyDepositsApplicationWithMemberModuleDetails(this.accountsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            this.accountsModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetailsModel;


            this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null)
              this.accId = this.responseModel.data[0].id;
            if (this.responseModel.data[0].accountTypeName != undefined && this.responseModel.data[0].accountTypeName != null)
              this.accountTypeName = this.responseModel.data[0].accountTypeName;
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
            }
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
            }

            this.isNewMemberCreation = true;
          }

          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          // if (this.activeIndex == 3) {
          //   this.activeIndex = this.accountTypeBasedActiveIndexInscrement(this.accountTypeName);
          // }
          if (this.activeIndex == 0) {
            this.activeIndexIncrement();
          }

          this.navigateTo(this.activeIndex, this.responseModel.data[0].id)
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  // add or update fd non cumulative Communication Details
  addOrUpdateCommunicationDetails(activeIndex: any, buttonName: any) {
    this.accountCommunicationModel.memberType = this.accId;
    this.accountCommunicationModel.admissionNumber = this.admissionNumber;
    this.accountCommunicationModel.accId = this.accId;
    if (this.accountCommunicationModel.isSameAddress == true) {
      this.isPerminentAddressIsSameFalg = true;
    }
    else {
      this.isPerminentAddressIsSameFalg = true;
    }
    if (this.accountCommunicationModel.id == null) {
      this.isCommunicationEdit = false;
    }
    else
      this.isCommunicationEdit = true;
    if (this.isCommunicationEdit) {
      this.dailyDepositsAccountsService.updateDailyDepositsAccountCommunication(this.accountCommunicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
            this.accId = this.responseModel.data[0].accId;
          }
          if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
            this.admissionNumber = this.responseModel.data[0].admissionNumber;
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.accId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      });
    }
    else {
      this.dailyDepositsAccountsService.addDailyDepositsAccountCommunication(this.accountCommunicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
            this.accId = this.responseModel.data[0].accId;
          }
          if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
            this.admissionNumber = this.responseModel.data[0].admissionNumber;
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.activeIndex = this.activeIndex + 1;
          this.navigateTo(this.activeIndex, this.accId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      });
    }
  }

  // add or update fd non cumulative account details
  addAOrUpdateRdApplicationDetails(activeIndex: any, buttonName: any) {
    this.accountsModel.pacsId = 1;
    this.accountsModel.pacsCode = 12345;
    this.accountsModel.branchId = 1;

    if (this.accountsModel.id != null) {
      this.isApplicationEdit = true;
    }
    else {
      this.isApplicationEdit = false;
    }
    if (this.accountsModel.depositDateVal != null && this.accountsModel.depositDateVal != undefined) {
      this.accountsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.accountsModel.depositDateVal));
    }
    if (this.isApplicationEdit) {
      this.accountsModel.statusName = applicationConstants.IS_ACTIVE;
      this.dailyDepositsAccountsService.updateDailyDepositsAccounts(this.accountsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
            this.accountsModel = this.responseModel.data[0];
            if (this.accountsModel.id != undefined && this.accountsModel.id != null)
              this.accId = this.accountsModel.id;
            if (this.accountsModel.accountTypeName != null && this.accountsModel.accountTypeName != undefined)
              this.accountTypeName = this.accountsModel.accountTypeName;
            if (this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined)
              this.memberTypeName = this.accountsModel.memberTypeName;
            if (this.responseModel.data[0].accountNumber != null && this.accountsModel.accountNumber != undefined)
              this.accountNumber = this.accountsModel.accountNumber;
            if (this.accountsModel.adminssionNumber != null && this.accountsModel.adminssionNumber != undefined)
              this.admissionNumber = this.accountsModel.adminssionNumber;
          }
          this.previousStepFlag = true;
          this.memberDropDownDisable = true;

          if (activeIndex === 3) {
            activeIndex = this.accountTypeBasedActiveIndexInscrement(this.accountTypeName);
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.accId)
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    } else {
      this.accountsModel.statusName = applicationConstants.IS_ACTIVE;
      this.accountsModel.statusName = CommonStatusData.IN_PROGRESS;
      this.dailyDepositsAccountsService.addDailyDepositsAccounts(this.accountsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
            this.accountsModel = this.responseModel.data[0];
            if (this.accountsModel.id != undefined && this.accountsModel.id != null)
              this.accId = this.accountsModel.id;
            if (this.accountsModel.accountTypeName != null && this.accountsModel.accountTypeName != undefined)
              this.accountTypeName = this.accountsModel.accountTypeName;
            if (this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined)
              this.memberTypeName = this.accountsModel.memberTypeName;
            if (this.responseModel.data[0].accountNumber != null && this.accountsModel.accountNumber != undefined)
              this.accountNumber = this.accountsModel.accountNumber;
            if (this.accountsModel.adminssionNumber != null && this.accountsModel.adminssionNumber != undefined)
              this.admissionNumber = this.accountsModel.adminssionNumber;

            this.isNewMemberCreation = true;
            this.memberDropDownDisable = true;
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          if (this.activeIndex == 3) {
            this.activeIndex = this.accountTypeBasedActiveIndexInscrement(this.accountTypeName);
          }
          this.navigateTo(this.activeIndex, this.accId)
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  saveJointHolder() {
    this.dailyDepositsAccountsService.addJointHoldersList(this.jointAccountHolderList).subscribe((response: any) => {
    this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != null) {
          this.accId = this.responseModel.data[0].accId;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.activeIndex = this.activeIndex + 1;
        this.navigateTo(this.activeIndex, this.accId);
        console.log("Navigation executed, activeIndex: ", this.activeIndex);
        this.completed = 1;
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  // add or update fd non cumulative Nominee Details
  addOrUpdateNomineeDetails() {
    this.accountNomineeModel.accId = this.accId;
    this.accountNomineeModel.accountNumber = this.accountNumber;
    this.accountNomineeModel.status = applicationConstants.ACTIVE;
    if (this.accountNomineeModel.dateOfBirthVal != null && this.accountNomineeModel.dateOfBirthVal != undefined) {
      this.accountNomineeModel.dateOfBirth = this.commonFunctionsService.getUTCEpoch(new Date(this.accountNomineeModel.dateOfBirthVal));
    }
    // this. fdCumulativeNominee.isNewMember = this.showForm;
    if (this.accountNomineeModel.id == null) {
      this.isNomineeEdit = false;
    }
    else {
      this.isNomineeEdit = true;
    }
    if (this.isNomineeEdit) {
      this.dailyDepositsAccountsService.updateAccountNominees(this.accountNomineeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
            this.activeIndex = this.activeIndex + 1;
            this.navigateTo(this.activeIndex, this.accId);
            this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.dailyDepositsAccountsService.addAccountNominees(this.accountNomineeModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);

            this.activeIndex = this.activeIndex + 1;
            this.navigateTo(this.activeIndex, this.accId);
            this.completed = 1;
          
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  addOrUpdateGurdianetails() {
    this.accountGuardianModel.accId = this.accId;
    this.accountGuardianModel.accountNumber = this.accountNumber;
    // this.accountGuardianModel.isNewMember = this.showForm;
    if (this.accountGuardianModel.id == null) {
      this.isNomineeEdit = false;
    }
    else {
      this.isNomineeEdit = true;
    }
    if (this.isNomineeEdit) {
      this.dailyDepositsAccountsService.updateGuardianDetails(this.accountGuardianModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.accId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.dailyDepositsAccountsService.addGuardianDetails(this.accountGuardianModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.navigateTo(this.activeIndex, this.accId);
          this.completed = 1;
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, (error: any) => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }

  activeIndexIncrement() {
    if (!this.showForm) {
      this.activeIndex = this.activeIndex + 2
    }
    else {
      this.activeIndex = this.activeIndex + 1
    }
    return this.activeIndex;
  }

  accountTypeBasedActiveIndexInscrement(accountType: any) {
    if (accountType == AccountTypes.JOINT) {
      this.activeIndex = this.activeIndex + 1
    }
    else {
      this.activeIndex = this.activeIndex + 2;
    }
    return this.activeIndex;
  }
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  onClickOfGroupMoreDetails() {
    this.groupPromotersPopUpFlag = true;
  }

  onClickInstitutionMoreDetails() {
    this.institutionPromoterFlag = true;
  }

  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }
  close() {
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.memberSignatureCopyZoom = false;
    this.memberPhotoCopyZoom = false;
  }

  
}
