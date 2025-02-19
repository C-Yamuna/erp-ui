import { SiLoanGuarantorDetailsService } from './../../../shared/si-loans/si-loan-guarantor-details.service';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicRequiredDetails, MemberGroupDetailsModel, MembershipInstitutionDetailsModel } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-basic-required-details';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiLoanProductDefinition } from '../../../shared/si-loans/si-loan-product-definition.model';
import { SiLoanGuarantor } from '../../../shared/si-loans/si-loan-guarantor.model';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { MembershipBasicDetailsService } from '../../../sao/sao-stepper/membership-basic-details/shared/membership-basic-details.service';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-si-loan-guarantor',
  templateUrl: './si-loan-guarantor.component.html',
  styleUrls: ['./si-loan-guarantor.component.css']
})
export class SiLoanGuarantorComponent {
  siLoanGuarantorForm: FormGroup;
  gender: any[] | undefined;
  msgs: any[] = [];
  selectedList: any[] = [];
  selectedMembers: any[] = [];
  allTypesOfmembershipList: any;
  responseModel!: Responsemodel;
  admissionNumber: any;
  loanId: any;
  pacsId: any;
  branchId: any;
  isEdit: boolean = false;
  individualFlag: boolean = true;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  orgnizationSetting: any;
  guarantorDetailsList: any[] = [];


  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
  siLoanProductDefinitionModel: SiLoanProductDefinition = new SiLoanProductDefinition();
  siLoanGuarantorModel: SiLoanGuarantor = new SiLoanGuarantor();
  memberTypeName: any;
  saveAndNextButton: boolean = false;

    constructor(private router: Router, private formBuilder: FormBuilder,private siLoanApplicationService : SiLoanApplicationService,private activateRoute: ActivatedRoute,
      private commonComponent: CommonComponent ,private encryptDecryptService: EncryptDecryptService,private membershipBasicDetailsService: MembershipBasicDetailsService,private datePipe: DatePipe,
      private siLoanGuarantorDetailsService : SiLoanGuarantorDetailsService
    )
    { 
      this.siLoanGuarantorForm = this.formBuilder.group({
           admissionNo: ['',[Validators.required]],
  
      })
    }
    ngOnInit() {
     
      this.pacsId = 1;
      this.branchId = 1;
      this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined ||  params['admissionNumber'] != undefined) {
          if (params['admissionNumber'] != undefined) {
            this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNumber']);
          }
          this.commonComponent.startSpinner();
         // if(params['id'] != undefined && params['id'] != null){
          this.loanId = Number(this.encryptDecryptService.decrypt(params['id']));
          this.isEdit = true;
          this.getSILoanApplicationDetailsById(this.loanId);
         // }
        } else {
          this.isEdit = false;
        }
      }) 
      this.updateData();
      this.siLoanGuarantorForm.valueChanges.subscribe((data: any) => {
        this.updateData();
        if (this.siLoanGuarantorForm.valid) {
          this.save();
        }
      });
     
      
    }
    updateData() {
      this.siLoanGuarantorModel.siLoanApplicationId = this.loanId;
      // this.siLoanGuarantorModel.memberTypeName = this.memberTypeName;
      this.siLoanGuarantorModel.admissionNumber = this.admissionNumber;
      this.siLoanGuarantorModel.siLoanGuarantorDetailsDTOList = this.selectedList;
      // if(this.siLoanGuarantorModel.siLoanGuarantorDetailsDTOList != null && this.siLoanGuarantorModel.siLoanGuarantorDetailsDTOList.length > 0){
      //   this.saveAndNextButton = true;
      // }
      // else{
      //   this.saveAndNextButton = false;
      // }
      this.siLoanApplicationService.changeData({
        formValid: !this.siLoanGuarantorForm.valid ? true : false,
        data: this.siLoanGuarantorModel,
        isDisable: this.siLoanGuarantorModel.siLoanGuarantorDetailsDTOList.length == 0 || (!this.siLoanGuarantorForm.valid),
        
        // isDisable:false,
        stepperIndex: 6,
      });
    }
    save() {
      this.updateData();
    }
    
       // Method triggered on multiSelect change
  OnChangeAdmissionNumber(selectedAdmissionNumbers: any[]) {
    // Clear existing selected details
    this.selectedList = [];
    const newlySelectedIds = selectedAdmissionNumbers;
    this.selectedMembers = newlySelectedIds;
    this.siLoanGuarantorForm.get('admissionNo')?.setValue(this.selectedMembers);
    // Loop through selected admission numbers
    selectedAdmissionNumbers.forEach(admissionNumber => {
      const selectedMember = this.allTypesOfmembershipList.find((item: any) => item.value === admissionNumber);
      if (selectedMember) {
        this.selectedList.push({
          admissionNumber: selectedMember.data.admissionNumber,
          name: selectedMember.data.name,
          memberTypeName: selectedMember.data.memberTypeName,
          admissionDate: selectedMember.data.admissionDate,
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
      this.siLoanGuarantorForm.get('admissionNo')?.setValue(this.selectedMembers);
    }
   
    // get all members from membership module data 
    
    getAllTypeOfMembershipDetails (pacsId: any, branchId: any) {
      this.membershipBasicDetailsService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data && this.responseModel.data.length > 0) {
              this.allTypesOfmembershipList = this.responseModel.data.filter((data: any) => data.memberTypeName == "Individual" && data.statusName == CommonStatusData.APPROVED &&
              data.admissionNumber != this.admissionNumber).map((relationType: any) => {
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
              if(this.siLoanApplicationModel.memberTypeName != null && this.siLoanApplicationModel.memberTypeName != undefined)
              this.memberTypeName = this.siLoanApplicationModel.memberTypeName;
              if (this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList != null) {
                this.guarantorDetailsList = this.siLoanApplicationModel.siLoanGuarantorDetailsDTOList;
                this.getSiLoanGuarantorDetailsByApplicationId(this.loanId);
              }
            }
            this.updateData();
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
  
    getSiLoanGuarantorDetailsByApplicationId(loanId: any){
      this.siLoanGuarantorDetailsService.getSILoanGuarantorDetailsByLoanAccId(loanId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.selectedList = this.responseModel.data;
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
  