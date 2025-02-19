import { SiLoanJointHolder } from './../../../shared/si-loans/si-loan-joint-holder.model';
import { SiLoanApplicationService } from './../../../shared/si-loans/si-loan-application.service';
import { SiLoanApplication } from './../../../shared/si-loans/si-loan-application.model';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { MembershipBasicRequiredDetails, MemberGroupDetailsModel, MembershipInstitutionDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { SiLoanCoApplicantDetailsService } from '../../../shared/si-loans/si-loan-co-applicant-details.service';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-si-loan-joint-account',
  templateUrl: './si-loan-joint-account.component.html',
  styleUrls: ['./si-loan-joint-account.component.css']
})
export class SiLoanJointAccountComponent {
  jointAccountForm: any;
  jointAccount: any;
  checked: any;
  isMemberCreation: boolean = false;
  loanAccId: any;

  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanJointHolderModel: SiLoanJointHolder = new SiLoanJointHolder();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  rowEdit: any;
  responseModel!: Responsemodel;
  applicationType: any;
  accountType: any;
  minBalence: any;
  accountOpeningDate: any;
  msgs: any[] = [];
  isEdit: boolean = false;
  admissionNumber: any;
  allFruits: any[] = [];
  selectedFruits: any[] = [];
  selectedAdmissionNumberList: string[] = [];
  previousAdmissionNumber: String[] = [];
  duplicateKhataPassbookFlag: boolean = false;
  gridListData: any[] = [];
  accountOpeningDateVal: any;
  orgnizationSetting: any;
  numberOfJointHolders: any;
  jointHolderDetailsList: any[] = [];
  productName: any;
  memberTypeName: any;
  membershipList: any;
  pacsId: any;
  branchId: any;
  accountNumber: any;
  tempJointHolderDetailsList: any[] = [];
    gender: any[] | undefined;
    selectedList: any[] = [];
    selectedMembers: any[] = [];
    allTypesOfmembershipList: any[] = [];
    loanId: any;
    individualFlag: boolean = true;
    groupFlag: boolean = false;
    institutionFlag: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private siLoanCoApplicantDetailsService: SiLoanCoApplicantDetailsService,
    private siLoanApplicationService: SiLoanApplicationService, private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private datePipe: DatePipe,
    private commonFunctionsService: CommonFunctionsService, private membershipServiceService: MembershipServiceService) {

 
    this.jointAccountForm = this.formBuilder.group({
      admissionNo: ['',[Validators.required]],

    })
  }

  ngOnInit() {
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined ||  params['admissionNumber'] != undefined) {
        if (params['admissionNumber'] != undefined) {
          this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNumber']);
        }
        this.commonComponent.startSpinner();
        let id = this.encryptDecryptService.decrypt(params['id']);
        this.loanAccId = Number(id);
        this.isEdit = true;
        this.getSILoanApplicationDetailsById(this.loanAccId);
       // }
      } else {
        this.isEdit = false;
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
    this.siLoanJointHolderModel.siLoanApplicationId = this.loanAccId;
    this.siLoanJointHolderModel.admissionNumber = this.admissionNumber;
    this.siLoanJointHolderModel.jointHolderList = this.selectedList;
    for(let joint of this.siLoanJointHolderModel.jointHolderList){
      joint.siLoanApplicationId = this.loanAccId;
      if (joint.admissionDateVal != undefined && joint.admissionDateVal != null)
        joint.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(joint.admissionDateVal));
    }
    this.siLoanApplicationService.changeData({
      formValid: !this.jointAccountForm.valid ? true : false,
      data: this.siLoanJointHolderModel,
      isDisable: (!this.jointAccountForm.valid),
      // isDisable:false,
      stepperIndex: 4,
    });
  }
  save() {
    this.updateData();
  }

    OnChangeAdmissionNumber(selectedAdmissionNumbers: any[]) {
      // Clear existing selected details
      this.selectedList = [];
      const newlySelectedIds = selectedAdmissionNumbers;
      this.selectedMembers = newlySelectedIds;
      this.jointAccountForm.get('admissionNo')?.setValue(this.selectedMembers);
      // Loop through selected admission numbers
      selectedAdmissionNumbers.forEach(admissionNumber => {
        const selectedMember = this.allTypesOfmembershipList.find((item: any) => item.value === admissionNumber);
        if (selectedMember) {
          this.selectedList.push({
            admissionNumber: selectedMember.data.admissionNumber,
            name: selectedMember.data.name,
            memberTypeName: selectedMember.data.memberTypeName,
            classTypeName: selectedMember.data.subProductName,
            admissionDate: selectedMember.data.admissionDate,
            admissionDateVal: selectedMember.data.admissionDate = this.datePipe.transform(selectedMember.data.admissionDate, this.orgnizationSetting.datePipe),

            aadharNumber: selectedMember.data.aadharNumber,
            panNumber: selectedMember.data.panNumber,
            siLoanApplicationId : this.loanId,
            status:applicationConstants.ACTIVE,
            mobileNumber: selectedMember.data.mobileNumber,
            emailId: selectedMember.data.emailId,
            // Add more fields as needed
          });
          this.updateData();
        }
        // console.log('Selected members:', selectedMember);
      });
    }
      onClear(admissionNumber: any) {
        const index = this.allTypesOfmembershipList.indexOf(admissionNumber);
        if (index >= 0) {
          this.allTypesOfmembershipList.splice(index, 1);
          this.selectedList.push(this.responseModel.data);
          const existingIndex = this.selectedList.findIndex(
            promoter => promoter.admissionNumber === admissionNumber);
          this.selectedList[existingIndex] = null;
          this.updateData();
        }
      }
      initializeFormWithadmissionNumber(admissionNumber: any[]) {
        this.selectedMembers = admissionNumber.map((collateral: any) => collateral.admissionNumber);
        this.jointAccountForm.get('admissionNo')?.setValue(this.selectedMembers);
      }
     
      // get all members from membership module data 
      
      getAllTypeOfMembershipDetails (pacsId: any, branchId: any) {
        this.membershipServiceService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data && this.responseModel.data.length > 0) {
                this.allTypesOfmembershipList = this.responseModel.data.filter((data: any) => data.memberTypeName == "Individual" && data.statusName == CommonStatusData.APPROVED).map((relationType: any) => {
                  return {
                    label: `${relationType.name} - ${relationType.admissionNumber} - ${relationType.memberTypeName}`,
                    value: relationType.admissionNumber,
                    data: relationType // Optional: Include entire data object for further details
                  };
                });
              }
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
      
     
      getSILoanApplicationDetailsById(id: any) {
        this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.siLoanApplicationModel = this.responseModel.data[0];
                this.loanAccId =  this.siLoanApplicationModel.id;
                if (this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList != null) {
                  this.jointHolderDetailsList = this.siLoanApplicationModel.siLoanCoApplicantDetailsDTOList;
                  this.getSiLoanJointHoderDetailsByApplicationId(this.siLoanApplicationModel.id);
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
    
      getSiLoanJointHoderDetailsByApplicationId(loanId: any){
        this.siLoanCoApplicantDetailsService.getSILoanCoApplicantByLoanApplicationId(loanId).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.selectedList = this.responseModel.data;
            this.selectedList.map(obj =>{
              obj.admissionDateVal = this.datePipe.transform(obj.admissionDate, this.orgnizationSetting.datePipe)
            });

            this.initializeFormWithadmissionNumber(this.selectedList);
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
      
    }
