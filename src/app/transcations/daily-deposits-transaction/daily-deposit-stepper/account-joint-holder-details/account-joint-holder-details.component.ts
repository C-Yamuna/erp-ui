import { Component } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Accounts } from '../../shared/accounts.model';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { JointAccountHolder } from '../../shared/joint-account-holder.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';

@Component({
  selector: 'app-account-joint-holder-details',
  templateUrl: './account-joint-holder-details.component.html',
  styleUrls: ['./account-joint-holder-details.component.css']
})
export class AccountJointHolderDetailsComponent {
  jointAccountForm: any;
  isMemberCreation: boolean = false;
  accId: any;
  accountModel: Accounts = new Accounts();
  membershipBasicDetail: MembershipBasicDetail = new MembershipBasicDetail();
  jointHolderModel: JointAccountHolder = new JointAccountHolder();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  responseModel!: Responsemodel;
  accountType: any;
  depositAmount: any;
  msgs: any[] = [];
  isEdit: boolean = false;
  admissionNumber: any;
  selectedAdmissionNumberList: any[] = [];
  depositDateVal: any;
  orgnizationSetting: any;
  numberOfJointHolders: any;
  jointHolderDetailsList: any[] = [];
  admissionNumberList: any[] = [];
  productName: any;
  memberTypeName: any;
  membershipList: any;
  pacsId: any;
  branchId: any;
  accountNumber: any;
  tempJointHolderDetailsList: any[] = [];

  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute, private datePipe: DatePipe,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, 
    private membershipServiceService: MembershipServiceService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService,
  ) {

    this.jointAccountForm = this.formBuilder.group({
      admissionNumber: [''],
      noOfJointHolders: ['']
    });
  }

  ngOnInit(): void {
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.accId = Number(id);
        this.isEdit = true;
        this.getRdAccounts(this.accId);
        this.commonComponent.stopSpinner();
      } else {
        this.isEdit = false;
        this.commonComponent.stopSpinner();
      }
    })
    this.updateData();
    this.jointAccountForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.jointAccountForm.valid) {
        this.save();
      }
    });
  }
  updateData() {
    this.accountModel.tdJointAccHolderDetailsDTOList = this.jointHolderDetailsList;
    this.dailyDepositsAccountsService.changeData({
      formValid: !this.jointAccountForm.valid ? true : false,
      data: this.accountModel,
      isDisable: (!this.jointAccountForm.valid),
      // isDisable:false,
      stepperIndex: 4,
    });
  }

  save() {
    this.updateData();
  }

  onChange() {
    this.isMemberCreation = !this.isMemberCreation;
  }

  getRdAccounts(id: any) {
    this.dailyDepositsAccountsService.getAccounts(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountModel = this.responseModel.data[0];
            if (this.accountModel.productName != null && this.accountModel.productName != undefined) {
              this.productName = this.accountModel.productName;
            }
            if (this.accountModel.accountTypeName != null && this.accountModel.accountTypeName != undefined) {
              this.accountType = this.accountModel.accountTypeName;
            }
            if (this.accountModel.depositAmount != null && this.accountModel.depositAmount != undefined) {
              this.depositAmount = this.accountModel.depositAmount;
            }
            if (this.accountModel.depositDate != null && this.accountModel.depositDate != undefined) {
              this.depositDateVal = this.datePipe.transform(this.accountModel.depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.accountModel.accountNumber != null && this.accountModel.accountNumber != undefined) {
              this.accountNumber = this.accountModel.accountNumber;
            }
            if (this.accountModel.tdJointAccHolderDetailsDTOList != null && this.accountModel.tdJointAccHolderDetailsDTOList != undefined) {
              this.jointHolderDetailsList = this.accountModel.tdJointAccHolderDetailsDTOList;
              if (this.jointHolderDetailsList != null && this.jointHolderDetailsList != undefined && this.jointHolderDetailsList.length > 0) {
                this.numberOfJointHolders = this.jointHolderDetailsList.length;
                this.selectedAdmissionNumberList = this.jointHolderDetailsList.filter((obj: any) => obj != null).map((obj: { id: any; name: any; admissionNumber: any }) => {
                  return {
                    label: obj.admissionNumber
                  };
                });
                this.jointHolderDetailsList.map((joint: any) => {
                  joint.admissionDateVal = this.datePipe.transform(joint.admissionDate, this.orgnizationSetting.datePipe);
                });
                this.updateData();
              }
            }
          }
        }
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
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

  onSelectionChange(event: any) {
    this.tempJointHolderDetailsList = [];
    this.numberOfJointHolders = 0;
    this.selectedAdmissionNumberList = [];
    if (null != event.value && undefined != event.value && event.value != "") {
      for (let admissionNumber of event.value) {
        let check = this.selectedAdmissionNumberList.push(admissionNumber);
        this.numberOfJointHolders = this.selectedAdmissionNumberList.length;
        this.getMembershipDetails(admissionNumber.label);
      }
    }
    else {
      this.jointHolderDetailsList = [];
    }
  }

  onClear(admissionNumber: any) {
    // const index = this.admissionNumberList.indexOf(admissionNumber);
    // if (index >= 0) {
    //   this.admissionNumberList.splice(index, 1);
    //   this.jointHolderDetailsList.push(this.responseModel.data);
    //   const existingIndex = this.jointHolderDetailsList.findIndex(
    //     promoter => promoter.admissionNumber === admissionNumber);
    //   this.jointHolderDetailsList[existingIndex] = null;
    this.jointHolderDetailsList = [];
    this.updateData();
    // }
  }

  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.membershipServiceService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipList = this.responseModel.data;
            this.admissionNumberList = this.membershipList.filter((obj: any) => obj != null && obj.memberTypeId == 1).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
              return {
                label: relationType.admissionNumber

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
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });

  }

  getMembershipDetails(admisionNumber: any) {
    this.jointHolderDetailsList = [];
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            // this.jointHolderModel = this.responseModel.data[0];
            if (this.accId != null && this.accId != undefined) {
              this.responseModel.data[0].accId = this.accId;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.responseModel.data[0].accountNumber = this.accountNumber;
            }
            this.responseModel.data[0].dateOfBirth = this.responseModel.data[0].dob;
            this.responseModel.data[0].gender = this.responseModel.data[0].genderId;
            this.responseModel.data[0].maritalStatus = this.responseModel.data[0].martialId;
            this.responseModel.data[0].email = this.responseModel.data[0].emailId;
            this.responseModel.data[0].memberClass = this.responseModel.data[0].subProductName;
            this.responseModel.data[0].admissionDateVal = this.datePipe.transform(this.responseModel.data[0].admissionDate, this.orgnizationSetting.datePipe);
            this.tempJointHolderDetailsList.push(this.responseModel.data[0]);
            this.jointHolderDetailsList = this.tempJointHolderDetailsList;
            this.updateData();
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
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  onHide(event: any) {
    console.log("Dropdown Closed:", event);
  }
  
  onShow(event: any) {
    console.log("Dropdown Opened:", event);
  }
  
  onPanelClick(event: any) {
    console.log("Dropdown Panel Clicked:", event);
  }

}
