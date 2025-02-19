import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanGuarantor } from './shared/term-loan-guarantor.model';
import { TermApplication, TermLoanProductDefinition } from '../term-loan-application-details/shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { TermLoanGuarantorService } from './shared/term-loan-guarantor.service';
import { TermLoanNewMembershipService } from '../term-loan-new-membership/shared/term-loan-new-membership.service';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-term-loans-loan-guarantor',
  templateUrl: './term-loans-loan-guarantor.component.html',
  styleUrls: ['./term-loans-loan-guarantor.component.css']
})
export class TermLoansLoanGuarantorComponent {
  guarantorForm: any;
  isMemberCreation: boolean = false;
  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanGuarantorModel: TermLoanGuarantor = new TermLoanGuarantor();
  termLoanApplicationId: any;
 
  responseModel!: Responsemodel;
  applicationType: any;
  accountType: any;
  msgs: any[] = [];
  isEdit: boolean = false;
  admissionNumber: any;
  selectedAdmissionNumberList: any[] = [];
  accountOpeningDateVal: any;
  orgnizationSetting: any;
  numberOfJointHolders: any;
  termGuarantorDetailsList: any[] = [];
  admissionNumberList: any[] = [];
  productName: any;
  memberTypeName: any;
  membershipList: any;
  pacsId: any;
  branchId: any;
  accountNumber: any;
  tempGuarantorDetailsList: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
    private datePipe: DatePipe,
    private termLoanApplicationsService: TermApplicationService,
    private activateRoute: ActivatedRoute,  private termLoanGuarantorDetailsService: TermLoanGuarantorService,
    private membershipService: TermLoanNewMembershipService,) {

      this.guarantorForm = this.formBuilder.group({
        admissionNumber: [''],
        noOfJointHolders: ['']
      });
    }
    ngOnInit(): void {
      this.pacsId = 1;
      this.branchId = 1;
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
  
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.commonComponent.startSpinner();
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.termLoanApplicationId = Number(id);
          this.isEdit = true;
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
          this.commonComponent.stopSpinner();
        } else {
          this.isEdit = false;
          this.commonComponent.stopSpinner();
        }
      })
      this.updateData();
      this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    }
  
    updateData() {
      this.termLoanGuarantorModel.guarantorDetailsList = this.termGuarantorDetailsList;
      this.termLoanApplicationsService.changeData({
        formValid: !this.guarantorForm.valid ? true : false,
        data: this.termLoanGuarantorModel,
        isDisable: this.termGuarantorDetailsList.length == 0 || (!this.guarantorForm.valid),
        stepperIndex: 6,
      });
    }
  
    save() {
      this.updateData();
    }
  
    onChange() {
      this.isMemberCreation = !this.isMemberCreation;
    }
  
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanApplicationModel = this.responseModel.data[0];
              if (this.termLoanApplicationModel.termProductName != null && this.termLoanApplicationModel.termProductName != undefined) {
                this.productName = this.termLoanApplicationModel.termProductName;
              }
                if(this.termLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL){
                  this.termLoanApplicationModel.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
                }
              if (this.termLoanApplicationModel.accountNumber != null && this.termLoanApplicationModel.accountNumber != undefined) {
                this.accountNumber = this.termLoanApplicationModel.accountNumber;
              }
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
                if(this.membershipList != null && this.membershipList != undefined && this.membershipList.length >0){
                  this.admissionNumberList = this.membershipList.filter((obj: any) => obj != null && obj.memberTypeId == applicationConstants.ACTIVE && obj.statusName == CommonStatusData.APPROVED && obj.admissionNumber != this.admissionNumber).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
                    return {
                      label: relationType.admissionNumber
                    };
                  });
                }

              }
              if (this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList != null) {
                this.termGuarantorDetailsList = this.termLoanApplicationModel.termLoanGuarantorDetailsDTOList;
                this.termGuarantorDetailsList = this.termGuarantorDetailsList.map((model) => {
                  if (model.admissionDate != null) {
                    model.admissionDateVal = this.datePipe.transform(model.admissionDate, this.orgnizationSetting.datePipe);
                  }
                  return model;
                });
                this.getGuarantorAccontMemberDetails(this.termLoanApplicationModel.id);
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
  
    getGuarantorAccontMemberDetails(id: any) {
      this.termLoanGuarantorDetailsService.getTermLoanGuarantorDetailsList(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termGuarantorDetailsList = this.responseModel.data;
            if (this.termGuarantorDetailsList != null && this.termGuarantorDetailsList != undefined && this.termGuarantorDetailsList.length > 0) {
              this.numberOfJointHolders = this.termGuarantorDetailsList.length;
              this.admissionNumberList 
              this.selectedAdmissionNumberList = this.termGuarantorDetailsList.filter((obj: any) => obj != null).map((obj: { id: any; name: any; admissionNo: any }) => {
                return {
                  label: obj.admissionNo
                };
              });
              this.updateData();
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
  
    onSelectionChange(event: any) {
      // this.tempGuarantorDetailsList = [];
      this.numberOfJointHolders = 0;
      this.termGuarantorDetailsList = [];
      this.selectedAdmissionNumberList = [];
      if (null != event.value && undefined != event.value && event.value != "") {
        for (let admissionNumber of event.value) {
          let check = this.selectedAdmissionNumberList.push(admissionNumber);
          this.numberOfJointHolders = this.selectedAdmissionNumberList.length;
          this.getMembershipDetails(admissionNumber.label);
        }
      }
      else{
        this.termGuarantorDetailsList = [];
      }
    }
  
    onClear(admissionNumber: any) {
      // const index = this.admissionNumberList.indexOf(admissionNumber);
      // if (index >= 0) {
      //   this.admissionNumberList.splice(index, 1);
      //   this.termGuarantorDetailsList.push(this.responseModel.data);
      //   const existingIndex = this.termGuarantorDetailsList.findIndex(
      //     promoter => promoter.admissionNumber === admissionNumber);
      //   this.termGuarantorDetailsList[existingIndex] = null;
      this.termGuarantorDetailsList = [];
      this.numberOfJointHolders = 0;
      this.updateData();
      // }
    }
  
    getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
      this.membershipService.getAllTypeOfMemberDetailsListFromMemberModule(pacsId, branchId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipList = this.responseModel.data;
              this.admissionNumberList = this.membershipList.filter((obj: any) => obj != null && obj.memberTypeId == applicationConstants.ACTIVE && obj.statusName == CommonStatusData.APPROVED && obj.admissionNumber != this.admissionNumber).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
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
  
    getMembershipDetails(admissionNumber: any) {
      this.tempGuarantorDetailsList = this.termGuarantorDetailsList;
      this.termGuarantorDetailsList = [];
      this.membershipService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.data[0].admissionDate != null && this.responseModel.data[0].admissionDate != undefined) {
                this.responseModel.data[0].admissionDateVal = this.datePipe.transform(this.responseModel.data[0].admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.termLoanApplicationId != null && this.termLoanApplicationId != undefined) {
                this.responseModel.data[0].termLoanApplicationId = this.termLoanApplicationId;
              }
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                this.responseModel.data[0].accountNumber = this.accountNumber;
              }
              if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
                this.responseModel.data[0].admissionNo = this.admissionNumber;
              }
              this.tempGuarantorDetailsList.push(this.responseModel.data[0]);
              this.termGuarantorDetailsList = this.tempGuarantorDetailsList;
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
 
}
