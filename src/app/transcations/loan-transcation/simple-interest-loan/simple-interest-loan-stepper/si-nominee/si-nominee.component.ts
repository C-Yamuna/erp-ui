import { SiLoanGuardian } from './../../../shared/si-loans/si-loan-guardian.model';
import { SiLoanApplicationService } from './../../../shared/si-loans/si-loan-application.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SiLoanNomineeService } from '../../../shared/si-loans/si-loan-nominee.service';
import { SiLoanNominee } from '../../../shared/si-loans/si-loan-nominee.model';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicRequiredDetails, MemberGroupDetailsModel, MembershipInstitutionDetailsModel } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-basic-required-details';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { savingsbanktransactionconstant } from 'src/app/transcations/savings-bank-transcation/savingsbank-transaction-constant';

@Component({
  selector: 'app-si-nominee',
  templateUrl: './si-nominee.component.html',
  styleUrls: ['./si-nominee.component.css']
})
export class SiNomineeComponent {
   nomineeForm: FormGroup;
    guarantorDetailsForm: any;
    nominee: any;
    nomineeList: any;
    checked: any;
    newNominee: boolean = false;
    sameAsMembershipNominee: boolean = false;
    noNominee: boolean = false;
    responseModel!: Responsemodel;
    msgs: any[] = [];
    siLoanNomineeModel: SiLoanNominee = new SiLoanNominee();
    siLoanGuardianModel: SiLoanGuardian = new SiLoanGuardian();
    membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
    memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
    membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
    siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();

    fileName: any;
    loanAccId: any;
    isEdit: boolean = false;
    age: any;
    guarntorDetailsFalg: boolean = false;
    relationTypesList: any[] = [];
  
    flagForNomineeTypeValue: any;
    accountOpeningDateVal: any;
    applicationType: any;
    accountType: any;
    minBalence: any;
    orgnizationSetting: any;
  
    accountNumber: any;
    siProductName: any;
    statesList: any;
    districtsList: any;
    mandalsList: any;
    villageList: any;
    guadianTypesList: any[] = [];
    guardain :any;
    isMemberCreation: any;
    memberTypeName: any;
    institutionPromoter: any;
    promoterDetails: any;
    admissionNumber: any;
  
    nomineeEdit : Boolean = false;
    nomineeHistoryList : any[] = [];
    nomineeFields: any[] = [];
  
    courtAppointedGuardain :any;
    multipleFilesList: any;
    uploadFileData: any;
    isFileUploadedNominee: boolean = false;
    isFileUploadedGuardina: boolean = false;
    sameAsMemberGuardain: boolean = false;
    noGuardain: boolean = true;
    nomineeTypeDisable: boolean = false;
    guardainTypeDisable: boolean = false;
    historyFLag: boolean = false;
    flag: boolean = false;
    isSaveAndNextEnable : boolean = false;
    today :any;
    fileSizeMsgForImage: any;
    fileSizeMsgForImageGuardiand: any;
    isNewMember :boolean = false;
  
    constructor(private router: Router, private formBuilder: FormBuilder, private siLoanApplicationService: SiLoanApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, 
      private siLoanNomineeService: SiLoanNomineeService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe , private fileUploadService :FileUploadService) {
      this.nomineeForm = this.formBuilder.group({
        "relationName": new FormControl(''),
        "nomineeName": new FormControl('',),
        // age: new FormControl(['', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/), Validators.compose([Validators.required])]],),
        "aadhaar": new FormControl('',),
        "mobileNumber": new FormControl('',),
        "email": new FormControl('',),
        "nomineeDob": new FormControl('', ),
        "age": new FormControl('', ),
        "remarks": new FormControl('', ),
        // 'nomineeAddres': new FormControl('', Validators.required),
        "nomineeType": ['', Validators.required],
  
        //guardian form fields
        "relationNameOfGuardian": new FormControl('',),
        "guardianName": new FormControl('',),
        "guardianAge": new FormControl('',),
        "guardianAadhar": new FormControl('',),
        "guardianMobile": new FormControl('',),
        "guardianEmail": new FormControl('',),
        "guardianAddress": new FormControl('',),
        "guardainType": new FormControl('',),
        "fileUpload" : new FormControl('',),
        "guardianRemarks": new FormControl('', ),
  
      });
      this.nomineeFields = [
        { field: 'name', header: 'Name' },
        { field: 'accountNumber', header: 'Account Number' },
        { field: 'aadharNumber', header: 'Aadhar Number' },
        { field: 'mobileNumber', header: 'Mobile Number' },
        { field: 'nomineeEmail',header:'Email'},
        { field: 'statusName', header: 'Status' },
      ]
      this.today = new Date();//for future date set to disable
    }
  
    // @k.yamuna
    ngOnInit(): void {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.isMemberCreation = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
      if(this.isMemberCreation){
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'No Nominee', value: 3 },
        ]
      }
      else{
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'Same As Membership Nominee', value: 2 },
          { label: 'No Nominee', value: 3 },
        ]
      }
     if(this.isMemberCreation){
      this.guadianTypesList = [
        { label: 'New Guardain', value: 1 },
        { label: 'No Guardain', value: 3 },
      ]
     }else{
      this.guadianTypesList= [
        { label: 'New Guardain', value: 1 },
        { label: 'Same as Member Guardain', value: 2 },
        { label: 'No Guardain', value: 3 },
      ];
     }
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined ) {
         
          if(params['id'] != undefined && params['id'] != null){
            let queryParams = this.encryptDecryptService.decrypt(params['id']);
            this.loanAccId = Number(queryParams);
            this.getSiLoanApplicationById(this.loanAccId);
            this.isEdit = true;
          }
          
          
        } else {
          this.isEdit = false;
        }
      });
      this.nomineeForm.valueChanges.subscribe((data: any) => {
        this.updateData();
        if (this.nomineeForm.valid) {
          this.save();
        }
      });
      this.getAllRelationTypes();
    }
    //update model data to stepper component
    //@k.yamuna
    updateData() {
      this.siLoanNomineeModel.memberTypeName = this.memberTypeName;
      if (this.age <= 18 || this.siLoanNomineeModel.nomineeAge <= 18) {
        let nominee = this.relationTypesList.find((data: any) => null != data && this.siLoanNomineeModel.relationTypeId != null && data.value == this.siLoanNomineeModel.relationTypeId);
        if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
          this.siLoanNomineeModel.relationTypeName = nominee.label;
        }
        let guardain = this.relationTypesList.find((data: any) => null != data && this.siLoanGuardianModel.relationshipTypeId != null && data.value == this.siLoanGuardianModel.relationshipTypeId);
        if (guardain != null && undefined != guardain && guardain.label != null && guardain.label != undefined) {
          this.siLoanGuardianModel.relationshipTypeName = guardain.label;
        }
        this.siLoanGuardianModel.siLoanApplicationId = this.loanAccId ;
        this.siLoanGuardianModel.accountNumber = this.accountNumber;
        this.siLoanNomineeModel.siMemberGuardianDetailsDTO = this.siLoanGuardianModel;
        this.isSaveAndNextEnable = (!this.nomineeForm.valid) || !(this.isFileUploadedNominee && this.isFileUploadedGuardina)
      }
      else {
        this.isSaveAndNextEnable = (!this.nomineeForm.valid) || (!this.isFileUploadedNominee);
      }
      this.siLoanNomineeModel.siLoanApplicationId = this.loanAccId;
      this.siLoanApplicationService.changeData({
        formValid: !this.nomineeForm.valid ? true : false,
        data: this.siLoanNomineeModel,
        isDisable: this.isSaveAndNextEnable,
        // isDisable:false,
        stepperIndex: 5,
      });
    }
    save() {
      this.updateData();
    }
    //on change nominee type need to update validation
    //@k.yamuna
    onChange(event: any ,flag :boolean) {
      if(flag){
        this.siLoanNomineeModel.nomineeSighnedFormMultiPartList = [];
        this.isFileUploadedNominee = false;
        if(this.siLoanNomineeModel.nomineeAge < 18){
          this.guarntorDetailsFalg = false;
            this.guarntorDetailsFalg = false;
            let id = null;
            if(this.siLoanGuardianModel.id != null && this.siLoanGuardianModel.id != undefined){
              let id = this.siLoanGuardianModel.id;
            }
            this.siLoanGuardianModel = new SiLoanGuardian();
            this.siLoanGuardianModel.id = id;
            this.sameAsMemberGuardain = false;
            this.courtAppointedGuardain = false;
              this.resetGuardain();
        }
      }
      if (event == 1) {//new nominee
        this.newNomineeType(flag);
      }
      else if (event == 2) {//same as membership nominee
        this.samAsMemberNimineeType(flag);
      }
      else if (event == 3) {//no nominee
        this.noNimineeType(flag);
      } 
    }
  
    /**
     *  @author k.yamuna
     * @implements onChange Guardain Type 
     * @param event guardain Type
     */
    onChangeGuardain(event: any , flag :boolean) {
      if(flag){
        this.siLoanGuardianModel.guardainSighnedMultipartFiles = [];
        this.isFileUploadedGuardina = false;
        this.resetGuardain();
      }
      if (event == 1) {//new guardain
        this.newGuardainType(flag);
      }
     else if (event == 2) {//same as member guardain
        this.sameAsMemberGuardianType(flag);
      }
      else if (event == 3) {//no guardain
        this.noGuardainaType(flag);
      }
    }
  
    /**
     * @implements memberType Check For Guardian And Nominee typwe List
     * @author k.yamuna
     */
    memberTypeCheck(memberTypeName: any) {
      if (memberTypeName != "Individual") {
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'No Nominee', value: 3 },
        ]
        this.guadianTypesList = [
          { label: 'New Guardain', value: 1 },
          { label: 'No Guardain', value: 3 },
        ]
        this.accountType = applicationConstants.SINGLE_ACCOUNT_TYPE;
      }
    }
  
    //nominee details by sb account id
    //@k.yamuna
    getNomineDetailsBySbId(loanAccId: any) {
      this.siLoanNomineeService.getNomineeDetailsBySILoanLoanAccId(loanAccId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanNomineeModel = this.responseModel.data[0];
              if (this.siLoanNomineeModel.nomineeDob != null && this.siLoanNomineeModel.nomineeDob != undefined) {
                this.siLoanNomineeModel.nomineeDobVal = this.datePipe.transform(this.siLoanNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
              }
              if (this.siLoanNomineeModel.nomineeType!= 0) {
                  this.onChange(this.siLoanNomineeModel.nomineeType, this.flag);
              }
              this.nomineeEdit = true;
            }
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
        // this.getSiLoanApplicationById(loanAccId);
      })
    }
    //get sI account details for header data  
    //@k.yamuna
    getSiLoanApplicationById(id: any) {
      this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanApplicationModel = this.responseModel.data[0];
             
              if ( this.siLoanApplicationModel.siProductName != null &&  this.siLoanApplicationModel.siProductName != undefined) {
                this.siProductName =this.siLoanApplicationModel.siProductName;
              }
              if (this.siLoanApplicationModel.accountTypeName != null && this.siLoanApplicationModel.accountTypeName != undefined) {
                this.accountType = this.siLoanApplicationModel.accountTypeName;
              }
             
              if(this.siLoanApplicationModel.memberTypeName != null && this.siLoanApplicationModel.memberTypeName != undefined){
                this.memberTypeName = this.siLoanApplicationModel.memberTypeName;
                this.memberTypeCheck(this.memberTypeName);
              }
              if(this.siLoanApplicationModel.admissionNo != null && this.siLoanApplicationModel.admissionNo != undefined){
                this.admissionNumber = this.siLoanApplicationModel.admissionNo;
              }
              if(this.siLoanApplicationModel.accountNumber != null && this.siLoanApplicationModel.accountNumber != undefined){
                this.accountNumber = this.siLoanApplicationModel.accountNumber;
                // if(this.historyFLag){
                //   this.getNomineeHistoryBysbAccountNumber(this.accountNumber);
                // }
              }
              if(this.siLoanApplicationModel.individualMemberDetailsDTO.age != null && this.siLoanApplicationModel.individualMemberDetailsDTO.age != undefined){
                this.age = this.siLoanApplicationModel.individualMemberDetailsDTO.age;
                if(this.age < 18){
                  this.guarntorDetailsFalg = true;
                }
              }
              if(this.siLoanApplicationModel.siLoanNomineeDetailsDTO != null && this.siLoanApplicationModel.siLoanNomineeDetailsDTO != undefined){
                this.siLoanNomineeModel = this.siLoanApplicationModel.siLoanNomineeDetailsDTO;
                if(this.siLoanNomineeModel.nomineeDob != null && this.siLoanNomineeModel.nomineeDob != undefined){
                  this.siLoanNomineeModel.nomineeDobVal = this.datePipe.transform(this.siLoanNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
                }
                if(this.siLoanNomineeModel.nomineeFilePath != null && this.siLoanNomineeModel.nomineeFilePath != undefined){
                  if(this.siLoanNomineeModel.nomineeType != null && this.siLoanNomineeModel.nomineeType != undefined){
                    if(this.siLoanNomineeModel.nomineeType != 2){
                      this.siLoanNomineeModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.siLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanNomineeModel.nomineeFilePath);
                    }
                    else {
                      this.siLoanNomineeModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.siLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanNomineeModel.nomineeFilePath);
                    }
                    this.isFileUploadedNominee = applicationConstants.TRUE;
                  }
                }
                if(this.siLoanNomineeModel.nomineeAge < 18){
                  this.guarntorDetailsFalg = true;
                }
              }
              else {
                this.isFileUploadedNominee = applicationConstants.FALSE;
              }
              if(this.siLoanApplicationModel.siMemberGuardianDetailsDTO != null && this.siLoanApplicationModel.siMemberGuardianDetailsDTO != undefined){
                this.siLoanGuardianModel = this.siLoanApplicationModel.siMemberGuardianDetailsDTO;
                if(this.siLoanGuardianModel.uploadFilePath != null && this.siLoanGuardianModel.uploadFilePath != undefined){
                  if(this.siLoanGuardianModel.guardianType != null && this.siLoanGuardianModel.guardianType != undefined){
                    if(this.siLoanGuardianModel.guardianType != 2){
                      this.siLoanGuardianModel.guardainSighnedMultipartFiles =  this.fileUploadService.getFile(this.siLoanGuardianModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanGuardianModel.uploadFilePath);
                    }
                    else {
                      this.siLoanGuardianModel.guardainSighnedMultipartFiles =  this.fileUploadService.getFile(this.siLoanGuardianModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanGuardianModel.uploadFilePath);
                    }
                    this.isFileUploadedGuardina = applicationConstants.TRUE;
                  }
                }
              }
              else{
                this.isFileUploadedGuardina = applicationConstants.FALSE;
              }
              if(this.siLoanNomineeModel.nomineeType != null && this.siLoanNomineeModel.nomineeType != undefined){
                this.onChange(this.siLoanNomineeModel.nomineeType, this.flag);
              }
              if( this.guarntorDetailsFalg && this.siLoanGuardianModel.guardianType != null && this.siLoanGuardianModel.guardianType != undefined){
                this.onChangeGuardain(this.siLoanGuardianModel.guardianType , this.flag);
              }
              else if(this.guarntorDetailsFalg){
                  const controlName = this.nomineeForm.get('guardainType');
                  if (controlName) {
                    controlName.setValidators([
                      Validators.required,
                    ]);
                    controlName.updateValueAndValidity();
                }
              }
            }
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
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  
    //get all relation types list
    //@k.yamuna
    getAllRelationTypes() {
      this.siLoanApplicationService.getAllRelationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.relationTypesList = this.responseModel.data
              this.relationTypesList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
                return { label: count.name, value: count.id }
              });
            let  nominee= this.relationTypesList.find((data: any) => null != data && this.siLoanNomineeModel.relationTypeId  != null && data.value == this.siLoanNomineeModel.relationTypeId);
            if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined){
                  this.siLoanNomineeModel.relationTypeName = nominee.label;
              }
              let  guardain= this.relationTypesList.find((data: any) => null != data && this.siLoanGuardianModel.relationshipTypeId  != null && data.value == this.siLoanGuardianModel.relationshipTypeId);
              if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined){
                  this.siLoanGuardianModel.relationshipTypeName = guardain.label;
              }
            }
          }
        }
      });
    }
  
    //get guardian details by account Number
    //@k.yamuna
    getGuardianDetails(accountNumber: any) {
      this.siLoanNomineeService.getGuardianDetails(accountNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanGuardianModel = this.responseModel.data[0];
              if (this.siLoanGuardianModel.guardianDob != null && this.siLoanGuardianModel.guardianDob != undefined) {
                this.siLoanGuardianModel.guardianDobVal = this.datePipe.transform(this.siLoanGuardianModel.guardianDob, this.orgnizationSetting.datePipe);
              }
              if(this.siLoanGuardianModel.guardianType != null && this.siLoanGuardianModel.guardianType != undefined){
                this.onChangeGuardain(this.siLoanGuardianModel.guardianType , this.flag);
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
        }
      });
    }
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.siLoanApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipBasicRequiredDetails = this.responseModel.data[0];
              if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
                this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
                this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
              }
              if(this.membershipBasicRequiredDetails.age != null && this.membershipBasicRequiredDetails.age != undefined){
                
              }
            }
          }
          else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
    //get group details
    //@k.yamuna
    getGroupByAdmissionNumber(admissionNumber: any) {
      this.siLoanApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.memberGroupDetailsModel = this.responseModel.data[0];
              if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
                this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
                this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.memberGroupDetailsModel.groupPromotersDTOList.length > 0) {
                this.promoterDetails = this.memberGroupDetailsModel.groupPromotersDTOList;
                this.promoterDetails = this.memberGroupDetailsModel.groupPromotersDTOList.map((member: any) => {
                  member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
                  member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
                  return member;
                });
              }
            }
  
          }
          else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
    //get institution details
    //@k.yamuna
    getInstitutionByAdmissionNumber(admissionNumber: any) {
      this.siLoanApplicationService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipInstitutionDetailsModel = this.responseModel.data[0];
              if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
                this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
                this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
                this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
            }
          } else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
    /**
     * @implements load membermodule data
     * @author k.yamuna
     */
    loadMembershipData(){
      if (this.memberTypeName == "Individual") {
        this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
      } else if (this.memberTypeName == "Group") {
        this.getGroupByAdmissionNumber(this.admissionNumber);
      } else if (this.memberTypeName == "Institution") {
        this.getInstitutionByAdmissionNumber(this.admissionNumber);
      }
    }
  
    /**
     * @implements getNominee from member module
     * @param admissionNumber 
     * @author k.yamuna
     */
    getNomineeFromMemberModule(admissionNumber : any){
      this.siLoanNomineeService.getNomineeFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.siLoanNomineeModel = this.responseModel.data[0];
              if (this.siLoanNomineeModel.nomineeDob != null && this.siLoanNomineeModel.nomineeDob != undefined) {
                this.siLoanNomineeModel.nomineeDobVal = this.datePipe.transform(this.siLoanNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
              }
              if(this.siLoanNomineeModel.nomineeEmailId != null && this.siLoanNomineeModel.nomineeEmailId != undefined){
                this.siLoanNomineeModel.nomineeEmailId = this.siLoanNomineeModel.nomineeEmailId;
              }
              if(this.siLoanNomineeModel.relationTypeId != null && this.siLoanNomineeModel.relationTypeId != undefined){
                this.siLoanNomineeModel.relationTypeId = this.siLoanNomineeModel.relationTypeId;
                this.getAllRelationTypes();
              }
              if(this.siLoanNomineeModel.relationTypeName != null && this.siLoanNomineeModel.relationTypeName != undefined){
                this.siLoanNomineeModel.relationTypeName = this.siLoanNomineeModel.relationTypeName;
              }
              if(this.siLoanNomineeModel.nomineeAadharNumber != null && this.siLoanNomineeModel.nomineeAadharNumber != undefined){
                this.siLoanNomineeModel.nomineeAadharNumber = this.siLoanNomineeModel.nomineeAadharNumber;
              }
              if(this.siLoanNomineeModel.nomineeMobileNumber != null && this.siLoanNomineeModel.nomineeMobileNumber != undefined){
                this.siLoanNomineeModel.nomineeMobileNumber = this.siLoanNomineeModel.nomineeMobileNumber;
              }
              if(this.siLoanNomineeModel.nomineeName != null && this.siLoanNomineeModel.nomineeName != undefined){
                this.siLoanNomineeModel.nomineeName = this.siLoanNomineeModel.nomineeName;
              }
              if(this.siLoanNomineeModel.nomineeFilePath != null && this.siLoanNomineeModel.nomineeFilePath != undefined){
                this.siLoanNomineeModel.nomineeFilePath = this.siLoanNomineeModel.nomineeFilePath;
              }
              if (this.siLoanNomineeModel.nomineeFilePath != null && this.siLoanNomineeModel.nomineeFilePath != undefined) {
                this.siLoanNomineeModel.nomineeFilePath = this.siLoanNomineeModel.nomineeFilePath;
                this.siLoanNomineeModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.siLoanNomineeModel.nomineeFilePath  , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanNomineeModel.nomineeFilePath );
                this.isFileUploadedNominee = applicationConstants.TRUE;
              }
              if(this.siLoanNomineeModel.nomineeDob != null && this.siLoanNomineeModel.nomineeDob != undefined){
                this.siLoanNomineeModel.nomineeDob = this.siLoanNomineeModel.nomineeDob;
                this.siLoanNomineeModel.nomineeDobVal = this.datePipe.transform(this.siLoanNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
              }
              this.siLoanNomineeModel.nomineeType = 2;
              this.updateData();
            }
          } else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
  
    /**
     *  @author k.yamuna
     * @implements get guardain from member module
     * @param admissionNumber
     */
    getGaurdainFromMemberModule(admissionNumber : any){
      this.siLoanNomineeService.getGardianFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.data[0].uploadFilePath != null && this.responseModel.data[0].uploadFilePath != undefined) {
                this.siLoanGuardianModel.uploadFilePath = this.responseModel.data[0].uploadFilePath;
                this.siLoanGuardianModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.siLoanGuardianModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanGuardianModel.uploadFilePath);
                this.isFileUploadedGuardina = applicationConstants.TRUE;
              }
              this.updateData();
            }
          } else {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
  
    /**
     * @implements fileUpload service
     * @param event 
     * @param fileUpload 
     * @param filePathName 
     */
    fileUploader(event: any, fileUpload: FileUpload , filePathName:any) {
      this.multipleFilesList = [];
      this.fileSizeMsgForImage = null;
      this.fileSizeMsgForImageGuardiand = null;
      let fileSizeFalg = false;
      if(this.siLoanNomineeModel != null && this.siLoanNomineeModel != undefined && this.isEdit && this.siLoanNomineeModel.filesDTOList == null || this.siLoanNomineeModel.filesDTOList == undefined){
          this.siLoanNomineeModel.filesDTOList = [];
      }
      if(this.isEdit && this.siLoanGuardianModel != null && this.siLoanGuardianModel != undefined && this.siLoanGuardianModel.filesDTOList == null || this.siLoanGuardianModel.filesDTOList == undefined){
        this.siLoanGuardianModel.filesDTOList = [];
      }
      let selectedFiles = [...event.files];
      
      fileUpload.clear();
    
      if (filePathName === "Nominee") {
        this.isFileUploadedNominee = applicationConstants.FALSE;
        this.siLoanNomineeModel.nomineeSighnedFormMultiPartList = [];
        if (selectedFiles[0].size/1024/1024 > 5) {
          this.fileSizeMsgForImage= "file is bigger than 5MB";
          fileSizeFalg = true;
         }
      }
      if (filePathName === "Guardain") {
        this.isFileUploadedGuardina = applicationConstants.FALSE;
        this.siLoanGuardianModel.guardainSighnedMultipartFiles = [];
        if (selectedFiles[0].size/1024/1024 > 5) {
          this.fileSizeMsgForImageGuardiand = "file is bigger than 5MB";
          fileSizeFalg = true;
         }
      }
      let files: FileUploadModel = new FileUploadModel();
      if(!fileSizeFalg){
        for (let file of selectedFiles) {
       
          let reader = new FileReader();
          reader.onloadend = (e) => {
            let files = new FileUploadModel();
            this.uploadFileData = e.currentTarget;
            files.fileName = file.name;
            files.fileType = file.type.split('/')[1];
            files.value = this.uploadFileData.result.split(',')[1];
            files.imageValue = this.uploadFileData.result;
            
              this.multipleFilesList.push(files);
              // Add to filesDTOList array
            let timeStamp = this.commonComponent.getTimeStamp();
            if (filePathName === "Nominee") {
              this.isFileUploadedNominee = applicationConstants.TRUE;
              this.siLoanNomineeModel.filesDTOList.push(files); 
              this.siLoanNomineeModel.nomineeSighnedFormMultiPartList.push(files);
              this.siLoanNomineeModel.nomineeFilePath = null;
              this.siLoanNomineeModel.filesDTOList[this.siLoanNomineeModel.filesDTOList.length-1].fileName = "SI_NOMINEE" + this.loanAccId + "_" + timeStamp + "_" + file.name;
              this.siLoanNomineeModel.nomineeFilePath = "SI_NOMINEE" + this.loanAccId + "_" +timeStamp+"_"+ file.name; 
            }
            if (filePathName === "Guardain") {
              this.isFileUploadedGuardina = applicationConstants.TRUE;
              this.siLoanGuardianModel.filesDTOList.push(files); 
              this.siLoanGuardianModel.guardainSighnedMultipartFiles.push(files);
              this.siLoanGuardianModel.uploadFilePath = null;
              this.siLoanGuardianModel.filesDTOList[this.siLoanGuardianModel.filesDTOList.length-1].fileName = "SI_GUARDAIN" + "_" + timeStamp + "_" + file.name;
              this.siLoanGuardianModel.uploadFilePath = "SI_GUARDAIN" + "_" + timeStamp + "_" + file.name; 
            }
            this.updateData();
          }
          reader.readAsDataURL(file);
        }
      }
      
    }
  /**
   * @implements gurdaind from validation
   * @author k.yamuna
   */
    guardainFormValidation() {
      if (this.age < 18 || this.siLoanNomineeModel.nomineeAge < 18) {
        this.resetGuardain();
        this.nomineeForm.get('relationNameOfGuardian')?.enable();
        this.nomineeForm.get('guardianName')?.enable();
        this.nomineeForm.get('guardianAadhar')?.enable();
        this.nomineeForm.get('guardianMobile')?.enable();
        this.nomineeForm.get('guardianEmail')?.enable();
        this.guarntorDetailsFalg = true;
        const controlName = this.nomineeForm.get('relationNameOfGuardian');
        if (controlName) {
          controlName.setValidators([
            Validators.required,
          ]);
          controlName.updateValueAndValidity();
        }
        const controlTow = this.nomineeForm.get('guardianName');
        if (controlTow) {
          controlTow.setValidators([
            Validators.required,
            Validators.pattern(applicationConstants.NAME_PATTERN)
          ]);
          controlTow.updateValueAndValidity();
        }
        const controlFour = this.nomineeForm.get('guardianAadhar');
        if (controlFour) {
          controlFour.setValidators([
            Validators.required,
          ]);
          controlFour.updateValueAndValidity();
        }
        const controlFive = this.nomineeForm.get('guardianMobile');
        if (controlFive) {
          controlFive.setValidators([
            Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN)
          ]);
          controlFive.updateValueAndValidity();
        }
        const controlSix = this.nomineeForm.get('guardianEmail');
        if (controlSix) {
          controlSix.setValidators([
            Validators.pattern(applicationConstants.EMAIL_PATTERN)
          ]);
          controlSix.updateValueAndValidity();
        }
        const controlHight = this.nomineeForm.get('remarks');
        if(controlHight){
          controlHight.setValidators(null);
          controlHight.updateValueAndValidity();
        }
        this.updateData();
      }
    }
  
  
    /**
     * @author k.yamuna
     * @implements gurdain form validation based on guardain type
     */
    guardaindisable(){
      this.nomineeForm.get('relationNameOfGuardian')?.disable();
      this.nomineeForm.get('guardianName')?.disable();
      this.nomineeForm.get('guardianAadhar')?.disable();
      this.nomineeForm.get('guardianMobile')?.disable();
      this.nomineeForm.get('guardianEmail')?.disable();
      this.updateData();
    }
  
    /**
     * @author k.yamuna
     * @implements nominee form validation
     */
    nomineeFormValidation() {
      this.nomineeForm.get('relationName')?.reset();
      this.nomineeForm.get('nomineeName')?.reset();
      this.nomineeForm.get('aadhaar')?.reset();
      this.nomineeForm.get('mobileNumber')?.reset();
      this.nomineeForm.get('email')?.reset();
      this.nomineeForm.get('fileUpload')?.reset();
      this.nomineeForm.get('age')?.reset();
      this.nomineeForm.get('nomineeDob')?.reset();
  
      this.nomineeForm.get('relationName')?.disable();
      this.nomineeForm.get('nomineeName')?.disable();
      this.nomineeForm.get('aadhaar')?.disable();
      this.nomineeForm.get('mobileNumber')?.disable();
      this.nomineeForm.get('email')?.disable();
      this.nomineeForm.get('age')?.disable();
      this.nomineeForm.get('nomineeDob')?.disable();
      // const controlName = this.nomineeForm.get('relationName');
      // if (controlName) {
      //   controlName.setValidators(null); // Set the required validator null
      //   controlName.updateValueAndValidity();
      // }
  
      // const controlTow = this.nomineeForm.get('nomineeName');
      // if (controlTow) {
      //   controlTow.setValidators(null); // Set the required validator null
      //   controlTow.updateValueAndValidity();
      // }
      // const controlFour = this.nomineeForm.get('aadhaar');
      // if (controlFour) {
      //   controlFour.setValidators(null); // Set the required validator null
      //   controlFour.updateValueAndValidity();
      // }
      // const controlFive = this.nomineeForm.get('mobileNumber');
      // if (controlFive) {
      //   controlFive.setValidators(null); // Set the required validator null
      //   controlFive.updateValueAndValidity();
      // }
      // const controlSix = this.nomineeForm.get('email');
      // if (controlSix) {
      //   controlSix.setValidators(null); // Set the required validator null
      //   controlSix.updateValueAndValidity();
      // }
      this.updateData();
    }
    /**
     * @author k.yamuna
     * @implements nominee required valdation
     */
    nomineeValidatorsRequired(){
      this.nomineeForm.get('relationName')?.reset();
      this.nomineeForm.get('nomineeName')?.reset();
      this.nomineeForm.get('aadhaar')?.reset();
      this.nomineeForm.get('mobileNumber')?.reset();
      this.nomineeForm.get('email')?.reset();
      this.nomineeForm.get('fileUpload')?.reset();
      this.nomineeForm.get('age')?.reset();
      this.nomineeForm.get('nomineeDob')?.reset();
  
      this.nomineeForm.get('relationName')?.enable();
      this.nomineeForm.get('nomineeName')?.enable();
      this.nomineeForm.get('aadhaar')?.enable();
      this.nomineeForm.get('mobileNumber')?.enable();
      this.nomineeForm.get('email')?.enable();
      this.nomineeForm.get('fileUpload')?.enable();
      this.nomineeForm.get('age')?.enable();
      this.nomineeForm.get('nomineeDob')?.enable();
      const controlName = this.nomineeForm.get('relationName');
      if (controlName) {
        controlName.setValidators([
          Validators.required,
        ]);
        controlName.updateValueAndValidity();
      }
      
      const controlTow = this.nomineeForm.get('nomineeName');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.NAME_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      const controlFour = this.nomineeForm.get('aadhaar');
      if (controlFour) {
        controlFour.setValidators([
          Validators.required,
        ]);
        controlFour.updateValueAndValidity();
      }
      const controlFive = this.nomineeForm.get('mobileNumber');
      if (controlFive) {
        controlFive.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.MOBILE_PATTERN)
        ]);
        controlFive.updateValueAndValidity();
      }
      const controlSix = this.nomineeForm.get('email');
      if (controlSix) {
        controlSix.setValidators([
          Validators.pattern(applicationConstants.EMAIL_PATTERN)
        ]);
        controlSix.updateValueAndValidity();
      }
      const controlSeven = this.nomineeForm.get('age');
      if (controlSeven) {
        controlSeven.setValidators([
          Validators.required,
        ]); // Set the required validator null
        controlSeven.updateValueAndValidity();
      }
      const controlEight = this.nomineeForm.get('nomineeDob');
      if (controlEight) {
        controlEight.setValidators([
          Validators.required
          
        ]); // Set the required validator null
        controlEight.updateValueAndValidity();
      }
      const controlHight = this.nomineeForm.get('remarks');
      if(controlHight){
        controlHight.setValidators(null);
        controlHight.updateValueAndValidity();
      }
      this.updateData();
    }
  
    /**
     * @author k.yamuna
     * @implements nominee not required validation 
     */
    nomineeValidatorsFormNotRequired(){
      const controlName = this.nomineeForm.get('relationName');
      if (controlName) {
        controlName.setValidators(null); // Set the required validator null
        controlName.updateValueAndValidity();
      }
  
      const controlTow = this.nomineeForm.get('nomineeName');
      if (controlTow) {
        controlTow.setValidators(null); // Set the required validator null
        controlTow.updateValueAndValidity();
      }
      const controlFour = this.nomineeForm.get('aadhaar');
      if (controlFour) {
        controlFour.setValidators(null); // Set the required validator null
        controlFour.updateValueAndValidity();
      }
      const controlFive = this.nomineeForm.get('mobileNumber');
      if (controlFive) {
        controlFive.setValidators(null); // Set the required validator null
        controlFive.updateValueAndValidity();
      }
      const controlSix = this.nomineeForm.get('age');
      if (controlSix) {
        controlSix.setValidators(null); // Set the required validator null
        controlSix.updateValueAndValidity();
      }
      const controlSeven = this.nomineeForm.get('nomineeDob');
      if (controlSeven) {
        controlSeven.setValidators(null); // Set the required validator null
        controlSeven.updateValueAndValidity();
      }
      const controlHight = this.nomineeForm.get('remarks');
      if(controlHight){
        controlHight.setValidators([
          Validators.required,
        ]);
        controlHight.updateValueAndValidity();
      }
      this.updateData();
    }
  
    /**
     * @implements onFileremove from file value
     * @param fileName 
     * @author k.yamuna
     */
    fileRemoeEvent(fileName :any){
      if(fileName == "Nominee"){
        this.isFileUploadedNominee = applicationConstants.FALSE;
        if(this.siLoanNomineeModel.filesDTOList != null && this.siLoanNomineeModel.filesDTOList != undefined && this.siLoanNomineeModel.filesDTOList.length > 0){
          let removeFileIndex = this.siLoanNomineeModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.siLoanNomineeModel.nomineeFilePath);
          this.siLoanNomineeModel.filesDTOList[removeFileIndex] = null;
          this.siLoanNomineeModel.nomineeFilePath = null;
        }
      }
      if(fileName == "Guardain"){
        this.isFileUploadedGuardina = applicationConstants.FALSE;
        if(this.siLoanGuardianModel.filesDTOList != null && this.siLoanGuardianModel.filesDTOList != undefined && this.siLoanGuardianModel.filesDTOList.length > 0){
          let removeFileIndex = this.siLoanGuardianModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.siLoanGuardianModel.uploadFilePath);
          this.siLoanGuardianModel.filesDTOList[removeFileIndex] = null;
          this.siLoanGuardianModel.uploadFilePath = null;
        }
      }
      this.updateData();//validation update for save and next button
    }
  /**
   * @implements onChange new Nominee
   * @param flag 
   * @author k.yamuna
   */
    newNomineeType(flag:boolean){
      this.newNominee = true;
        this.noNominee = false;
        //onchange on update
        if(flag){
         
          let nomineeId = null;
          if(this.siLoanNomineeModel != null && this.siLoanNomineeModel != undefined && this.siLoanNomineeModel.id  != null && this.siLoanNomineeModel.id  != undefined){
            nomineeId = this.siLoanNomineeModel.id ;
          }
          this.siLoanNomineeModel = new SiLoanNominee();
          if(nomineeId != null && nomineeId != undefined){
            this.siLoanNomineeModel.id = nomineeId;
          }
        }
        this.siLoanNomineeModel.nomineeType = 1;
        this.nomineeValidatorsRequired();
    }
  
    /**
     * @implements sameAsmemberNominee onChange
     * @param flag 
     * @author k.yamuna
     */
    samAsMemberNimineeType(flag:boolean){
      this.newNominee = true;
      this.noNominee = false;
      if(this.siLoanNomineeModel.nomineeAge < 18 ){
        this.guarntorDetailsFalg = false; 
      }
      //onchange on update
      if(flag){
        let nomineeId = null;
        if(this.siLoanNomineeModel != null && this.siLoanNomineeModel != undefined && this.siLoanNomineeModel.id  != null && this.siLoanNomineeModel.id  != undefined){
          nomineeId = this.siLoanNomineeModel.id ;
        }
        this.siLoanNomineeModel = new SiLoanNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.siLoanNomineeModel.id = nomineeId;
        }
        if(this.admissionNumber != null && this.admissionNumber != undefined){
          this.getNomineeFromMemberModule(this.admissionNumber);
        }
      }
      this.siLoanNomineeModel.nomineeType = 2;
      this.nomineeFormValidation();
    }
  
    /**
     * @implements noNimineeType OnChange
     * @param flag 
     * @author k.yamuna
     */
    noNimineeType(flag : boolean){
      this.noNominee = true;
      this.newNominee = false;
      this.sameAsMembershipNominee = false;
      if(this.siLoanNomineeModel.nomineeAge < 18){
        this.guarntorDetailsFalg = false; 
      }
      if(flag){
        let nomineeId = null;//onchange on update
        let remarks = null;
        let nomineeFilePath = null;
        if(this.siLoanNomineeModel != null && this.siLoanNomineeModel != undefined){
          if(this.siLoanNomineeModel.id  != null && this.siLoanNomineeModel.id  != undefined){
            nomineeId = this.siLoanNomineeModel.id ;
          }
          if(this.siLoanNomineeModel.remarks  != null && this.siLoanNomineeModel.remarks  != undefined){
            remarks = this.siLoanNomineeModel.remarks ;
          }
          if(this.siLoanNomineeModel.nomineeFilePath  != null && this.siLoanNomineeModel.nomineeFilePath  != undefined){
            nomineeFilePath = this.siLoanNomineeModel.nomineeFilePath ;
            this.siLoanNomineeModel.nomineeFilePath = this.fileUploadService.getFile(this.siLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanNomineeModel.nomineeFilePath);
          }
        }
        this.siLoanNomineeModel = new SiLoanNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.siLoanNomineeModel.id = nomineeId;
        }
        if(remarks != null && remarks != undefined){
          this.siLoanNomineeModel.remarks = remarks;
        }
        this.siLoanNomineeModel.nomineeType = 3;
        if(nomineeFilePath != null && nomineeFilePath != undefined){
        this.siLoanNomineeModel.nomineeFilePath = nomineeFilePath;
        }
      }
      this.nomineeValidatorsFormNotRequired();
      // this.newNominee = false;
    }
  
    /**
     * @implements new guardain Onchage
     * @param flag 
     * @author k.yamuna
     */
    newGuardainType(flag : boolean){
      this.courtAppointedGuardain = false;
        this.sameAsMemberGuardain = true;
        this.noGuardain  = false;
        //onchange on update
        if(flag){
          let guardainId = null;
          if(this.siLoanGuardianModel != null && this.siLoanGuardianModel != undefined && this.siLoanGuardianModel.id  != null && this.siLoanGuardianModel.id  != undefined){
            guardainId = this.siLoanGuardianModel.id ;
          }
          this.siLoanGuardianModel = new SiLoanGuardian();
          this.siLoanGuardianModel.id = guardainId;
        }
        this.siLoanGuardianModel.guardianType = 1;
        this.guardainFormValidation();
    }
  /**
   * @implements sameAsMember gurdain Onchage
   * @param flag 
   * @author k.yamuna
   */
    sameAsMemberGuardianType(flag:boolean){
      this.sameAsMemberGuardain = true;
      this.courtAppointedGuardain = false;
      this.noGuardain  = false;
      //onchange on update
      if(flag){
        let guardainId = null;
        if(this.siLoanGuardianModel != null && this.siLoanGuardianModel != undefined && this.siLoanGuardianModel.id  != null && this.siLoanGuardianModel.id  != undefined){
          guardainId = this.siLoanGuardianModel.id ;
        }
        this.siLoanGuardianModel = new SiLoanGuardian();
        this.siLoanGuardianModel.id = guardainId;
        this.getGaurdainFromMemberModule(this.admissionNumber);//get from member module
      }
      this.siLoanGuardianModel.guardianType = 2;
      this.guardaindisable();
    }
  
    /**
     * @implements no guardain Type
     * @param flag 
     * @author k.yamuna
     */
    noGuardainaType(flag:boolean){
      this.courtAppointedGuardain = true;
      this.sameAsMemberGuardain = false;
      this.noGuardain  = true;
      //onchange on update
      let guardainId = null;
      let remarks = null;
      if(flag){
        let uploadFilePath = null;
        if(this.siLoanGuardianModel != null && this.siLoanGuardianModel != undefined){
          if(this.siLoanGuardianModel.id  != null && this.siLoanGuardianModel.id  != undefined){
            guardainId = this.siLoanGuardianModel.id ;
          }
          if(this.siLoanGuardianModel.remarks  != null && this.siLoanGuardianModel.remarks  != undefined){
            remarks = this.siLoanGuardianModel.remarks ;
          }
          if(this.siLoanGuardianModel.uploadFilePath  != null && this.siLoanGuardianModel.uploadFilePath  != undefined){
            uploadFilePath = this.siLoanGuardianModel.uploadFilePath ;
            this.siLoanGuardianModel.guardainSighnedMultipartFiles =this.fileUploadService.getFile(this.siLoanGuardianModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanGuardianModel.uploadFilePath);
          }
        }
    
        this.siLoanGuardianModel = new SiLoanGuardian();
        if(guardainId != null && guardainId != undefined){
          this.siLoanGuardianModel.id = guardainId;
        }
        if(remarks != null && remarks != undefined){
          this.siLoanGuardianModel.remarks = remarks;
        }
      }
      this.siLoanGuardianModel.guardianType = 3;
      this.noGuardainValidation();
    }
  
    /**
     * @implements no guardain validation
     * @author k.yamuna
     */
    noGuardainValidation(){
      if (this.age <= 18) {
      this.nomineeForm.get('relationNameOfGuardian')?.enable();
      this.nomineeForm.get('guardianName')?.enable();
      this.nomineeForm.get('guardianAadhar')?.enable();
      this.nomineeForm.get('guardianMobile')?.enable();
      this.nomineeForm.get('guardianEmail')?.enable();

      this.removeValidators('relationNameOfGuardian');
      this.removeValidators('guardianName');
      this.removeValidators('guardianAadhar');
      this.removeValidators('guardianMobile');
      this.removeValidators('guardianDob');
      this.removeValidators('guardianAge');
      this.guarntorDetailsFalg = true;
      const controlName = this.nomineeForm.get('guardianRemarks');
      if (controlName) {
        controlName.setValidators([
          Validators.required,
        ]);
        controlName.updateValueAndValidity();
      }
  
      }
    }
    removeValidators(controlName: string) {
      const control = this.nomineeForm.get(controlName);
      if (control) {
        control.setValidators(null);
        control.updateValueAndValidity();
      }
    }
  
    /**
     * @implements reset guardain
     * @author k.yamuna
     */
    resetGuardain(){
      this.nomineeForm.get('relationNameOfGuardian')?.reset();
      this.nomineeForm.get('guardianName')?.reset();
      this.nomineeForm.get('guardianAadhar')?.reset();
      this.nomineeForm.get('guardianMobile')?.reset();
      this.nomineeForm.get('guardianEmail')?.reset();
      this.nomineeForm.get('relationNameOfGuardian')?.setValidators(null);
      this.nomineeForm.get('guardianName')?.setValidators(null);
      this.nomineeForm.get('guardianAadhar')?.setValidators(null);
      this.nomineeForm.get('guardianMobile')?.setValidators(null);
      this.nomineeForm.get('guardianEmail')?.setValidators(null);
    }  
    /**
     * @implements nominee age calculation
     * @author k.yamuna
     */
   
    ageCaluculation(flag: any) {
      if (flag) {//with age to date convertion
        if (this.siLoanNomineeModel.nomineeAge != null && this.siLoanNomineeModel.nomineeAge != undefined) {
          if (this.siLoanNomineeModel.nomineeAge > 0) {
  
            const currentDate = new Date();  // Get the current date
            const birthYear = currentDate.getFullYear() - this.siLoanNomineeModel.nomineeAge;  // Subtract the entered age from the current year
            const birthMonth = currentDate.getMonth();  // Keep the current month
            const birthDate = currentDate.getDate();   // Keep the current day
  
            // Construct the calculated Date of Birth
            const dob = new Date(birthYear, birthMonth, birthDate);
  
            // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
            // Format the Date of Birth to 'DD/Mon/YYYY'
            const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;
  
            // Format the Date of Birth to YYYY-MM-DD to match the input type="date" format
            this.siLoanNomineeModel.nomineeDob = null;
            this.siLoanNomineeModel.nomineeDobVal = formattedDob;
          }
          else {
            this.nomineeForm.get('age')?.reset();
            this.nomineeForm.get("nomineeDob")?.reset();
            this.msgs = [{ severity: 'error',  detail: savingsbanktransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      }
      else {//with date to age convertion
        this.siLoanNomineeModel.nomineeDobVal = this.datePipe.transform(this.siLoanNomineeModel.nomineeDobVal, this.orgnizationSetting.datePipe);
        if (this.siLoanNomineeModel.nomineeDobVal) {
          const dob = new Date(this.siLoanNomineeModel.nomineeDobVal);  // Parse the date of birth entered by the user
          const currentDate = new Date();  // Get the current date
          let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
          const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
          if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
          }
          this.siLoanNomineeModel.nomineeAge = age;  // Set the calculated age to the class property
        }
      }
      if(this.age >= 18 && this.siLoanNomineeModel.nomineeAge != null && this.siLoanNomineeModel.nomineeAge != undefined){
        if(this.siLoanNomineeModel.nomineeAge < 18){
          this.guarntorDetailsFalg = true;
          this.updateData();
        }  
        else {
          this.guarntorDetailsFalg = false;
        }
      }
      else if(this.age < 18 && this.siLoanNomineeModel.nomineeAge <18){
        this.msgs = [];
        this.siLoanNomineeModel.nomineeAge = null;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Minors Member Account Should Take Major Nominee Only" }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
  
    }
  
    /**
     * @implements guardaina enable based on nominee age
     * @author k.yamuna
     */
    guardainEnableBasedOnNomineeAge(){
      if(this.siLoanNomineeModel.nomineeAge < 18){
          this.guarntorDetailsFalg = true;
      }
    }
  }
  