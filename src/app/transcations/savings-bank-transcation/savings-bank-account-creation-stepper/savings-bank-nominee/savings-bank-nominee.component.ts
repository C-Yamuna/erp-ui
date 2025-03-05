import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SavingsBankNomineeService } from './shared/savings-bank-nominee.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MemberGuardianDetailsModelDetaila, SavingsBankNomineeModel } from './shared/savings-bank-nominee-model';
import { SavingBankApplicationService } from '../savings-bank-application/shared/saving-bank-application.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { SavingsBankCommunicationService } from '../savings-bank-communication/shared/savings-bank-communication.service';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../membership-basic-required-details/shared/membership-basic-required-details';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { NomineeDetailsModel } from '../../view-savings-bank/shared/view-saving-bank-model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { savingsbanktransactionconstant } from '../../savingsbank-transaction-constant';

@Component({
  selector: 'app-savings-bank-nominee',
  templateUrl: './savings-bank-nominee.component.html',
  styleUrls: ['./savings-bank-nominee.component.css']
})
export class SavingsBankNomineeComponent implements OnInit {
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
  savingsBankNomineeModel: SavingsBankNomineeModel = new SavingsBankNomineeModel();
  memberGuardianDetailsModelDetail: MemberGuardianDetailsModelDetaila = new MemberGuardianDetailsModelDetaila();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  fileName: any;
  sbAccId: any;
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
  productName: any;
  statesList: any;
  districtsList: any;
  mandalsList: any;
  villageList: any;
  guadianTypesList: any[] = [];
  guardain :any;
  showForm: any;
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

  constructor(private router: Router, private formBuilder: FormBuilder, private savingBankApplicationService: SavingBankApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private savingsBankNomineeService: SavingsBankNomineeService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe , private savingsBankCommunicationService : SavingsBankCommunicationService , private fileUploadService :FileUploadService) {
    this.nomineeForm = this.formBuilder.group({
      "relationName": new FormControl(''),
      "nomineeName": new FormControl('',),
      // age: new FormControl(['', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/), Validators.compose([Validators.required])]],),
      "aadhaar": new FormControl('',),
      "mobileNumber": new FormControl('',),
      "email": new FormControl('',),
      "dateOfBirth": new FormControl('', ),
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

  // @jyothi.naidana
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['preview'] != undefined) {
        if(params['preview'] != undefined && params['preview'] != null){
          let edit = this.encryptDecryptService.decrypt(params['preview']);
          // this.historyFLag = true;
        }
        if(params['id'] != undefined && params['id'] != null){
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          this.sbAccId = Number(queryParams);
          this.getSbAccountDetailsById(this.sbAccId);
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
  //@jyothi.naidana
  updateData() {
    this.savingsBankNomineeModel.memberTypeName = this.memberTypeName;
    if(this.relationTypesList != null && this.relationTypesList != undefined && this.relationTypesList.length > 0){
      let nominee = this.relationTypesList.find((data: any) => null != data && this.savingsBankNomineeModel.relationshipTypeId != null && data.value == this.savingsBankNomineeModel.relationshipTypeId);
      if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
        this.savingsBankNomineeModel.relationshipTypeName = nominee.label;
      }
      let guardain = this.relationTypesList.find((data: any) => null != data && this.memberGuardianDetailsModelDetail.relationshipTypeId != null && data.value == this.memberGuardianDetailsModelDetail.relationshipTypeId);
      if (guardain != null && undefined != guardain && guardain.label != null && guardain.label != undefined) {
        this.memberGuardianDetailsModelDetail.relationshipTypeName = guardain.label;
      }
    }
    if (this.age < 18 || this.savingsBankNomineeModel.age < 18) {
      this.memberGuardianDetailsModelDetail.sbAccId = this.sbAccId ;
      this.memberGuardianDetailsModelDetail.accountNumber = this.accountNumber;
      this.savingsBankNomineeModel.memberGuardianDetailsModelDetaila = this.memberGuardianDetailsModelDetail;
      this.isSaveAndNextEnable = (!this.nomineeForm.valid) || !(this.isFileUploadedNominee && this.isFileUploadedGuardina)
    }
    else {
      this.isSaveAndNextEnable = (!this.nomineeForm.valid) || !(this.isFileUploadedNominee);
    }
    this.savingsBankNomineeModel.accountNumber = this.accountNumber;
    this.savingsBankNomineeModel.sbAccId = this.sbAccId;
    this.savingBankApplicationService.changeData({
      formValid: !this.nomineeForm.valid ? true : false,
      data: this.savingsBankNomineeModel,
      isDisable: this.isSaveAndNextEnable,
      // isDisable:false,
      stepperIndex: 6,
    });
  }
  save() {
    this.updateData();
  }
  //on change nominee type need to update validation
  //@jyothi.naidana
  onChange(event: any ,flag :boolean) {
    if(flag){
      this.savingsBankNomineeModel.nomineeSighnedFormMultiPartList = [];
      this.isFileUploadedNominee = false;
      if(this.savingsBankNomineeModel.age < 18){
        this.guarntorDetailsFalg = false;
          this.guarntorDetailsFalg = false;
          let id = null;
          if(this.memberGuardianDetailsModelDetail.id != null && this.memberGuardianDetailsModelDetail.id != undefined){
            let id = this.memberGuardianDetailsModelDetail.id;
          }
          this.memberGuardianDetailsModelDetail = new MemberGuardianDetailsModelDetaila();
          this.memberGuardianDetailsModelDetail.id = id;
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
   *  @author jyothi.naidana
   * @implements onChange Guardain Type 
   * @param event guardain Type
   */
  onChangeGuardain(event: any , flag :boolean) {
    if(flag){
      this.memberGuardianDetailsModelDetail.guardainSighnedMultipartFiles = [];
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
   * @author jyothi.naidana
   */
  memberTypeCheck(obj: any) {
    if (obj.memberTypeName != "Individual") {
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
    else {
      if (obj.memberShipBasicDetailsDTO != null && obj.memberShipBasicDetailsDTO != undefined && !obj.memberShipBasicDetailsDTO.isNewMember) {
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'Same As Membership Nominee', value: 2 },
          { label: 'No Nominee', value: 3 },
        ]
        this.guadianTypesList = [
          { label: 'New Guardain', value: 1 },
          { label: 'Same as Member Guardain', value: 2 },
          { label: 'No Guardain', value: 3 },
        ];
      }
      else {
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'No Nominee', value: 3 },
        ]
        this.guadianTypesList = [
          { label: 'New Guardain', value: 1 },
          { label: 'No Guardain', value: 3 },
        ];
      }
    }
  }

  //nominee details by sb account id
  //@jyothi.naidana
  getNomineDetailsBySbId(sbAccId: any) {
    this.savingsBankNomineeService.getNomineeDetailsBySbAccId(sbAccId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 &&  this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.savingsBankNomineeModel = this.responseModel.data[0];
            if (this.savingsBankNomineeModel.dateOfBirth != null && this.savingsBankNomineeModel.dateOfBirth != undefined) {
              this.savingsBankNomineeModel.dateOfBirthVal = this.datePipe.transform(this.savingsBankNomineeModel.dateOfBirth, this.orgnizationSetting.datePipe);
            }
            if (this.savingsBankNomineeModel.nomineeType!= 0) {
                this.onChange(this.savingsBankNomineeModel.nomineeType, this.flag);
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
      // this.getSbAccountDetailsById(sbAccId);
    })
  }
  //get sb account details for header data  
  //@jyothi.naidana
  getSbAccountDetailsById(id: any) {
    this.savingBankApplicationService.getSbApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data[0].accountOpenDate != null && this.responseModel.data[0].accountOpenDate != undefined) {
              this.accountOpeningDateVal = this.datePipe.transform(this.responseModel.data[0].accountOpenDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].productName != null && this.responseModel.data[0].productName != undefined) {
              this.productName = this.responseModel.data[0].productName;
            }
            if (this.responseModel.data[0].accountTypeName != null && this.responseModel.data[0].accountTypeName != undefined) {
              this.accountType = this.responseModel.data[0].accountTypeName;
            }
            if (this.responseModel.data[0].minBalance != null && this.responseModel.data[0].minBalance != undefined) {
              this.minBalence = this.responseModel.data[0].minBalance
            }
            if(this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined){
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.memberTypeCheck(this.responseModel.data[0]);
            }
            if(this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined){
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if(this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined){
              this.accountNumber = this.responseModel.data[0].accountNumber;
              // if(this.historyFLag){
              //   this.getNomineeHistoryBysbAccountNumber(this.accountNumber);
              // }
            }
            if(this.responseModel.data[0].age != null && this.responseModel.data[0].age != undefined){
              this.age = this.responseModel.data[0].age;
            }
            if(this.responseModel.data[0].sbNomineeDTO != null && this.responseModel.data[0].sbNomineeDTO != undefined){
              this.savingsBankNomineeModel = this.responseModel.data[0].sbNomineeDTO;
              if(this.savingsBankNomineeModel.dateOfBirth != null && this.savingsBankNomineeModel.dateOfBirth != undefined){
                this.savingsBankNomineeModel.dateOfBirthVal = this.datePipe.transform(this.savingsBankNomineeModel.dateOfBirth, this.orgnizationSetting.datePipe);
              }
              if(this.savingsBankNomineeModel.signedNomineeForm != null && this.savingsBankNomineeModel.signedNomineeForm != undefined){
                if(this.savingsBankNomineeModel.nomineeType != null && this.savingsBankNomineeModel.nomineeType != undefined){
                  if(this.savingsBankNomineeModel.nomineeType != 2){
                    this.savingsBankNomineeModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.savingsBankNomineeModel.signedNomineeForm , ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.savingsBankNomineeModel.signedNomineeForm);
                  }
                  else {
                    this.savingsBankNomineeModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.savingsBankNomineeModel.signedNomineeForm , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.savingsBankNomineeModel.signedNomineeForm);
                  }
                  this.isFileUploadedNominee = applicationConstants.TRUE;
                }
              }
              if(this.savingsBankNomineeModel.age < 18 || this.age < 18){
                this.guarntorDetailsFalg = true;
              }
            }
            else {
              this.isFileUploadedNominee = applicationConstants.FALSE;
            }
            if(this.responseModel.data[0].sbGuardianDetailsDTO != null && this.responseModel.data[0].sbGuardianDetailsDTO != undefined){
              this.memberGuardianDetailsModelDetail = this.responseModel.data[0].sbGuardianDetailsDTO;
              if(this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath != null && this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath != undefined){
                if(this.memberGuardianDetailsModelDetail.guardianType != null && this.memberGuardianDetailsModelDetail.guardianType != undefined){
                  if(this.memberGuardianDetailsModelDetail.guardianType != 2){
                    this.memberGuardianDetailsModelDetail.guardainSighnedMultipartFiles =  this.fileUploadService.getFile(this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath , ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath);
                  }
                  else {
                    this.memberGuardianDetailsModelDetail.guardainSighnedMultipartFiles =  this.fileUploadService.getFile(this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath);
                  }
                  this.isFileUploadedGuardina = applicationConstants.TRUE;
                }
              }
            }
            else{
              this.isFileUploadedGuardina = applicationConstants.FALSE;
            }
            if(this.savingsBankNomineeModel.nomineeType != null && this.savingsBankNomineeModel.nomineeType != undefined){
              this.onChange(this.savingsBankNomineeModel.nomineeType, this.flag);
              // this.nomineeTypeDisable = true;
              // if(this.savingsBankNomineeModel.nomineeType == 1 || this.savingsBankNomineeModel.nomineeType == 2){
              //     this.newNominee = true;
              //     this.noNominee = false;
              //     this.sameAsMemberGuardain = false;
              // }
              // else if(this.savingsBankNomineeModel.nomineeType == 3){
              //   this.newNominee = false;
              //   this.noNominee = true;
              //   this.sameAsMemberGuardain = false;
              // }
            }
            if( this.guarntorDetailsFalg && this.memberGuardianDetailsModelDetail.guardianType != null && this.memberGuardianDetailsModelDetail.guardianType != undefined){
              this.onChangeGuardain(this.memberGuardianDetailsModelDetail.guardianType , this.flag);
              // this.guardainTypeDisable = true;
              // if(this.memberGuardianDetailsModelDetail.guardianType == 1 || this.memberGuardianDetailsModelDetail.guardianType == 2){
              //   this.sameAsMemberGuardain = true;
              //   this.courtAppointedGuardain = false;
              //   this.noGuardain  = false;
              //   this.guardainFormValidation();
              // }
              // else if(this.memberGuardianDetailsModelDetail.guardianType == 3){
              //   this.courtAppointedGuardain = true;
              //   this.sameAsMemberGuardain = false;
              //   this.noGuardain  = true;
              //   this.guardaindisable();
              // }
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
  //@jyothi.naidana
  getAllRelationTypes() {
    this.savingBankApplicationService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationTypesList = this.responseModel.data
            this.relationTypesList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
              return { label: count.name, value: count.id }
            });
          let  nominee= this.relationTypesList.find((data: any) => null != data && this.savingsBankNomineeModel.relationshipTypeId  != null && data.value == this.savingsBankNomineeModel.relationshipTypeId);
          if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined){
                this.savingsBankNomineeModel.relationshipTypeName = nominee.label;
            }
            let  guardain= this.relationTypesList.find((data: any) => null != data && this.memberGuardianDetailsModelDetail.relationshipTypeId  != null && data.value == this.memberGuardianDetailsModelDetail.relationshipTypeId);
            if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined){
                this.memberGuardianDetailsModelDetail.relationshipTypeName = guardain.label;
            }
          }
        }
      }
    });
  }

  //get guardian details by account Number
  //@jyothi.naidana
  getGuardianDetails(accountNumber: any) {
    this.savingsBankNomineeService.getGuardianDetails(accountNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGuardianDetailsModelDetail = this.responseModel.data[0];
            if (this.memberGuardianDetailsModelDetail.dateOfBirth != null && this.memberGuardianDetailsModelDetail.dateOfBirth != undefined) {
              this.memberGuardianDetailsModelDetail.dateOfBirthVal = this.datePipe.transform(this.memberGuardianDetailsModelDetail.dateOfBirth, this.orgnizationSetting.datePipe);
            }
            if(this.memberGuardianDetailsModelDetail.guardianType != null && this.memberGuardianDetailsModelDetail.guardianType != undefined){
              this.onChangeGuardain(this.memberGuardianDetailsModelDetail.guardianType , this.flag);
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
    this.savingBankApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
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
  //@jyothi.naidana
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.savingBankApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
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
  //@jyothi.naidana
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.savingBankApplicationService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
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
   * @author jyothi.naidana
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
   * @author jyothi.naidana
   */
  getNomineeFromMemberModule(admissionNumber : any){
    this.savingsBankNomineeService.getNomineeFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.savingsBankNomineeModel = this.responseModel.data[0];
            if (this.savingsBankNomineeModel.dateOfBirth != null && this.savingsBankNomineeModel.dateOfBirth != undefined) {
              this.savingsBankNomineeModel.dateOfBirthVal = this.datePipe.transform(this.savingsBankNomineeModel.dateOfBirthVal, this.orgnizationSetting.datePipe);
            }
            if (this.savingsBankNomineeModel.nominatedDate != null && this.savingsBankNomineeModel.nominatedDate != undefined) {
              this.savingsBankNomineeModel.nominatedDateVal = this.datePipe.transform(this.savingsBankNomineeModel.nominatedDateVal, this.orgnizationSetting.datePipe);
            }
            if(this.responseModel.data[0].nomineeEmailId != null && this.responseModel.data[0].nomineeEmailId != undefined){
              this.savingsBankNomineeModel.nomineeEmail = this.responseModel.data[0].nomineeEmailId;
            }
            if(this.responseModel.data[0].relationTypeId != null && this.responseModel.data[0].relationTypeId != undefined){
              this.savingsBankNomineeModel.relationshipTypeId = this.responseModel.data[0].relationTypeId;
              this.getAllRelationTypes();
            }
            if(this.responseModel.data[0].relationTypeName != null && this.responseModel.data[0].relationTypeName != undefined){
              this.savingsBankNomineeModel.relationshipTypeName = this.responseModel.data[0].relationTypeName;
            }
            if(this.responseModel.data[0].nomineeAadharNumber != null && this.responseModel.data[0].nomineeAadharNumber != undefined){
              this.savingsBankNomineeModel.aadharNumber = this.responseModel.data[0].nomineeAadharNumber;
            }
            if(this.responseModel.data[0].nomineeMobileNumber != null && this.responseModel.data[0].nomineeMobileNumber != undefined){
              this.savingsBankNomineeModel.mobileNumber = this.responseModel.data[0].nomineeMobileNumber;
            }
            if(this.responseModel.data[0].nomineeName != null && this.responseModel.data[0].nomineeName != undefined){
              this.savingsBankNomineeModel.name = this.responseModel.data[0].nomineeName;
            }
            if(this.responseModel.data[0].nomineeFilePath != null && this.responseModel.data[0].nomineeFilePath != undefined){
              this.savingsBankNomineeModel.addressProofCopyPath = this.responseModel.data[0].nomineeFilePath;
            }
            if (this.responseModel.data[0].nomineeFilePath != null && this.responseModel.data[0].nomineeFilePath != undefined) {
              this.savingsBankNomineeModel.signedNomineeForm = this.responseModel.data[0].nomineeFilePath;
              this.savingsBankNomineeModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.savingsBankNomineeModel.signedNomineeForm  , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.savingsBankNomineeModel.signedNomineeForm );
              this.isFileUploadedNominee = applicationConstants.TRUE;
            }
            if(this.responseModel.data[0].nomineeAge != null && this.responseModel.data[0].nomineeAge != undefined)
              this.savingsBankNomineeModel.age =  this.responseModel.data[0].nomineeAge;
            if(this.responseModel.data[0].nomineeDob != null && this.responseModel.data[0].nomineeDob != undefined){
              this.savingsBankNomineeModel.dateOfBirth = this.responseModel.data[0].nomineeDob;
              this.savingsBankNomineeModel.dateOfBirthVal = this.datePipe.transform(this.responseModel.data[0].nomineeDob, this.orgnizationSetting.datePipe);
            }
            this.savingsBankNomineeModel.nomineeType = 2;
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
   *  @author jyothi.naidana
   * @implements get guardain from member module
   * @param admissionNumber
   */
  getGaurdainFromMemberModule(admissionNumber : any){
    this.savingsBankNomineeService.getGardianFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data[0].guardianDob != null && this.responseModel.data[0].guardianDob != undefined) {
              this.memberGuardianDetailsModelDetail.dateOfBirthVal = this.datePipe.transform(this.responseModel.data[0].guardianDob, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].guardianName != null && this.responseModel.data[0].guardianName != undefined) {
              this.memberGuardianDetailsModelDetail.name = this.responseModel.data[0].guardianName;
            }
            if (this.responseModel.data[0].guardianAadharNumber != null && this.responseModel.data[0].guardianAadharNumber != undefined) {
              this.memberGuardianDetailsModelDetail.aadharNumber = this.responseModel.data[0].guardianAadharNumber;
            }
            if (this.responseModel.data[0].guardianMobileNumber != null && this.responseModel.data[0].guardianMobileNumber != undefined) {
              this.memberGuardianDetailsModelDetail.mobileNumber = this.responseModel.data[0].guardianMobileNumber;
            }
            if (this.responseModel.data[0].guardianEmailId != null && this.responseModel.data[0].guardianEmailId != undefined) {
              this.memberGuardianDetailsModelDetail.email = this.responseModel.data[0].guardianEmailId;
            }
            if (this.responseModel.data[0].relationshipTypeId != null && this.responseModel.data[0].relationshipTypeId != undefined) {
              this.memberGuardianDetailsModelDetail.relationshipTypeId = this.responseModel.data[0].relationshipTypeId;
            }
            if (this.responseModel.data[0].guardianDob != null && this.responseModel.data[0].guardianDob != undefined) {
              this.memberGuardianDetailsModelDetail.dateOfBirth = this.responseModel.data[0].guardianDob;
            }
            if (this.responseModel.data[0].guardianAge != null && this.responseModel.data[0].guardianAge != undefined) {
              this.memberGuardianDetailsModelDetail.age = this.responseModel.data[0].guardianAge;
            }
            if (this.responseModel.data[0].guardianAge != null && this.responseModel.data[0].guardianAge != undefined) {
              this.memberGuardianDetailsModelDetail.age = this.responseModel.data[0].guardianAge;
            }
            if (this.responseModel.data[0].guardianAge != null && this.responseModel.data[0].guardianAge != undefined) {
              this.memberGuardianDetailsModelDetail.age = this.responseModel.data[0].guardianAge;
            }
            if (this.responseModel.data[0].uploadFilePath != null && this.responseModel.data[0].uploadFilePath != undefined) {
              this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath = this.responseModel.data[0].uploadFilePath;
              this.memberGuardianDetailsModelDetail.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath);
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
    if(this.savingsBankNomineeModel != null && this.savingsBankNomineeModel != undefined && this.isEdit && this.savingsBankNomineeModel.filesDTOList == null || this.savingsBankNomineeModel.filesDTOList == undefined){
        this.savingsBankNomineeModel.filesDTOList = [];
    }
    if(this.isEdit && this.memberGuardianDetailsModelDetail != null && this.memberGuardianDetailsModelDetail != undefined && this.memberGuardianDetailsModelDetail.filesDTOList == null || this.memberGuardianDetailsModelDetail.filesDTOList == undefined){
      this.memberGuardianDetailsModelDetail.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    
    fileUpload.clear();
  
    if (filePathName === "Nominee") {
      this.isFileUploadedNominee = applicationConstants.FALSE;
      this.savingsBankNomineeModel.nomineeSighnedFormMultiPartList = [];
      if (selectedFiles[0].size/1024/1024 > 5) {
        this.fileSizeMsgForImage= "file is bigger than 5MB";
        fileSizeFalg = true;
       }
    }
    if (filePathName === "Guardain") {
      this.isFileUploadedGuardina = applicationConstants.FALSE;
      this.memberGuardianDetailsModelDetail.guardainSighnedMultipartFiles = [];
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
            this.savingsBankNomineeModel.filesDTOList.push(files); 
            this.savingsBankNomineeModel.nomineeSighnedFormMultiPartList.push(files);
            this.savingsBankNomineeModel.signedNomineeForm = null;
            this.savingsBankNomineeModel.filesDTOList[this.savingsBankNomineeModel.filesDTOList.length-1].fileName = "SB_NOMINEE" + this.sbAccId + "_" + timeStamp + "_" + file.name;
            this.savingsBankNomineeModel.signedNomineeForm = "SB_NOMINEE" + this.sbAccId + "_" +timeStamp+"_"+ file.name; 
          }
          if (filePathName === "Guardain") {
            this.isFileUploadedGuardina = applicationConstants.TRUE;
            this.memberGuardianDetailsModelDetail.filesDTOList.push(files); 
            this.memberGuardianDetailsModelDetail.guardainSighnedMultipartFiles.push(files);
            this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath = null;
            this.memberGuardianDetailsModelDetail.filesDTOList[this.memberGuardianDetailsModelDetail.filesDTOList.length-1].fileName = "SB_GUARDAIN" + "_" + timeStamp + "_" + file.name;
            this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath = "SB_GUARDAIN" + "_" + timeStamp + "_" + file.name; 
          }
          this.updateData();
        }
        reader.readAsDataURL(file);
      }
    }
    
  }
/**
 * @implements gurdaind from validation
 * @author jyothi.naidana
 */
  guardainFormValidation() {
    if (this.age < 18 || this.savingsBankNomineeModel.age < 18) {
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
      this.updateData();
    }
  }

  /**
   * @implements getNomineeHistory
   * @param accountNumber 
   * @author jyothi.naidana
   */
  getNomineeHistoryBysbAccountNumber(accountNumber: any) {
    this.savingsBankNomineeService.getNomineeDetailsBySbAccountNumber(accountNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.nomineeHistoryList = this.responseModel.data;
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
   * @author jyothi.naidana
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
   * @author jyothi.naidana
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
    this.nomineeForm.get('dateOfBirth')?.reset();

    this.nomineeForm.get('relationName')?.disable();
    this.nomineeForm.get('nomineeName')?.disable();
    this.nomineeForm.get('aadhaar')?.disable();
    this.nomineeForm.get('mobileNumber')?.disable();
    this.nomineeForm.get('email')?.disable();
    this.nomineeForm.get('age')?.disable();
    this.nomineeForm.get('dateOfBirth')?.disable();
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
   * @author jyothi.naidana
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
    this.nomineeForm.get('dateOfBirth')?.reset();

    this.nomineeForm.get('relationName')?.enable();
    this.nomineeForm.get('nomineeName')?.enable();
    this.nomineeForm.get('aadhaar')?.enable();
    this.nomineeForm.get('mobileNumber')?.enable();
    this.nomineeForm.get('email')?.enable();
    this.nomineeForm.get('fileUpload')?.enable();
    this.nomineeForm.get('age')?.enable();
    this.nomineeForm.get('dateOfBirth')?.enable();
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
    const controlEight = this.nomineeForm.get('dateOfBirth');
    if (controlEight) {
      controlEight.setValidators([
        Validators.required
        
      ]); // Set the required validator null
      controlEight.updateValueAndValidity();
    }
    this.updateData();
  }

  /**
   * @author jyothi.naidana
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
    const controlSeven = this.nomineeForm.get('dateOfBirth');
    if (controlSeven) {
      controlSeven.setValidators(null); // Set the required validator null
      controlSeven.updateValueAndValidity();
    }
    // const controlSix = this.nomineeForm.get('remarks');
    // if(controlSix){
    //   controlSix.setValidators([
    //     Validators.required,
    //   ]);
    // controlSix.updateValueAndValidity();
    // }
    this.updateData();
  }

  /**
   * @implements onFileremove from file value
   * @param fileName 
   * @author jyothi.naidana
   */
  fileRemoeEvent(fileName :any){
    if(fileName == "Nominee"){
      this.isFileUploadedNominee = applicationConstants.FALSE;
      if(this.savingsBankNomineeModel.filesDTOList != null && this.savingsBankNomineeModel.filesDTOList != undefined && this.savingsBankNomineeModel.filesDTOList.length > 0){
        let removeFileIndex = this.savingsBankNomineeModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.savingsBankNomineeModel.signedNomineeForm);
        this.savingsBankNomineeModel.filesDTOList[removeFileIndex] = null;
        this.savingsBankNomineeModel.signedNomineeForm = null;
      }
    }
    if(fileName == "Guardain"){
      this.isFileUploadedGuardina = applicationConstants.FALSE;
      if(this.memberGuardianDetailsModelDetail.filesDTOList != null && this.memberGuardianDetailsModelDetail.filesDTOList != undefined && this.memberGuardianDetailsModelDetail.filesDTOList.length > 0){
        let removeFileIndex = this.memberGuardianDetailsModelDetail.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath);
        this.memberGuardianDetailsModelDetail.filesDTOList[removeFileIndex] = null;
        this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath = null;
      }
    }
    this.updateData();//validation update for save and next button
  }
/**
 * @implements onChange new Nominee
 * @param flag 
 * @author jyothi.naidana
 */
  newNomineeType(flag:boolean){
    this.newNominee = true;
      this.noNominee = false;
      //onchange on update
      if(flag){
       
        let nomineeId = null;
        if(this.savingsBankNomineeModel != null && this.savingsBankNomineeModel != undefined && this.savingsBankNomineeModel.id  != null && this.savingsBankNomineeModel.id  != undefined){
          nomineeId = this.savingsBankNomineeModel.id ;
        }
        this.savingsBankNomineeModel = new SavingsBankNomineeModel();
        if(nomineeId != null && nomineeId != undefined){
          this.savingsBankNomineeModel.id = nomineeId;
        }
      }
      this.savingsBankNomineeModel.nomineeType = 1;
      this.nomineeValidatorsRequired();
  }

  /**
   * @implements sameAsmemberNominee onChange
   * @param flag 
   * @author jyothi.naidana
   */
  samAsMemberNimineeType(flag:boolean){
    this.newNominee = true;
    this.noNominee = false;
    if(this.savingsBankNomineeModel.age < 18 || this.age <18){
      this.guarntorDetailsFalg = true; 
    }
    //onchange on update
    if(flag){
      let nomineeId = null;
      if(this.savingsBankNomineeModel != null && this.savingsBankNomineeModel != undefined && this.savingsBankNomineeModel.id  != null && this.savingsBankNomineeModel.id  != undefined){
        nomineeId = this.savingsBankNomineeModel.id ;
      }
      this.savingsBankNomineeModel = new SavingsBankNomineeModel();
      if(nomineeId != null && nomineeId != undefined){
        this.savingsBankNomineeModel.id = nomineeId;
      }
      if(this.admissionNumber != null && this.admissionNumber != undefined){
        this.getNomineeFromMemberModule(this.admissionNumber);
      }
    }
    this.savingsBankNomineeModel.nomineeType = 2;
    this.nomineeFormValidation();
  }

  /**
   * @implements noNimineeType OnChange
   * @param flag 
   * @author jyothi.naidana
   */
  noNimineeType(flag : boolean){
    this.noNominee = true;
    this.newNominee = false;
    this.sameAsMembershipNominee = false;
    if(this.savingsBankNomineeModel.age < 18){
      this.guarntorDetailsFalg = false; 
    }
    if(flag){
      let nomineeId = null;//onchange on update
      let remarks = null;
      let signedNomineeForm = null;
      if(this.savingsBankNomineeModel != null && this.savingsBankNomineeModel != undefined){
        if(this.savingsBankNomineeModel.id  != null && this.savingsBankNomineeModel.id  != undefined){
          nomineeId = this.savingsBankNomineeModel.id ;
        }
        if(this.savingsBankNomineeModel.remarks  != null && this.savingsBankNomineeModel.remarks  != undefined){
          remarks = this.savingsBankNomineeModel.remarks ;
        }
        if(this.savingsBankNomineeModel.signedNomineeForm  != null && this.savingsBankNomineeModel.signedNomineeForm  != undefined){
          signedNomineeForm = this.savingsBankNomineeModel.signedNomineeForm ;
          this.savingsBankNomineeModel.signedNomineeForm = this.fileUploadService.getFile(this.savingsBankNomineeModel.signedNomineeForm , ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.savingsBankNomineeModel.signedNomineeForm);
        }
      }
      this.savingsBankNomineeModel = new SavingsBankNomineeModel();
      if(nomineeId != null && nomineeId != undefined){
        this.savingsBankNomineeModel.id = nomineeId;
      }
      if(remarks != null && remarks != undefined){
        this.savingsBankNomineeModel.remarks = remarks;
      }
      this.savingsBankNomineeModel.nomineeType = 3;
      if(signedNomineeForm != null && signedNomineeForm != undefined){
      this.savingsBankNomineeModel.signedNomineeForm = signedNomineeForm;
      }
    }
    this.nomineeValidatorsFormNotRequired();
    // this.newNominee = false;
  }

  /**
   * @implements new guardain Onchage
   * @param flag 
   * @author jyothi.naidana
   */
  newGuardainType(flag : boolean){
    this.courtAppointedGuardain = false;
      this.sameAsMemberGuardain = true;
      this.noGuardain  = false;
      //onchange on update
      if(flag){
        let guardainId = null;
        if(this.memberGuardianDetailsModelDetail != null && this.memberGuardianDetailsModelDetail != undefined && this.memberGuardianDetailsModelDetail.id  != null && this.memberGuardianDetailsModelDetail.id  != undefined){
          guardainId = this.memberGuardianDetailsModelDetail.id ;
        }
        this.memberGuardianDetailsModelDetail = new MemberGuardianDetailsModelDetaila();
        this.memberGuardianDetailsModelDetail.id = guardainId;
      }
      this.memberGuardianDetailsModelDetail.guardianType = 1;
      this.guardainFormValidation();
  }
/**
 * @implements sameAsMember gurdain Onchage
 * @param flag 
 * @author jyothi.naidana
 */
  sameAsMemberGuardianType(flag:boolean){
    this.sameAsMemberGuardain = true;
    this.courtAppointedGuardain = false;
    this.noGuardain  = false;
    //onchange on update
    if(flag){
      let guardainId = null;
      if(this.memberGuardianDetailsModelDetail != null && this.memberGuardianDetailsModelDetail != undefined && this.memberGuardianDetailsModelDetail.id  != null && this.memberGuardianDetailsModelDetail.id  != undefined){
        guardainId = this.memberGuardianDetailsModelDetail.id ;
      }
      this.memberGuardianDetailsModelDetail = new MemberGuardianDetailsModelDetaila();
      this.memberGuardianDetailsModelDetail.id = guardainId;
      this.getGaurdainFromMemberModule(this.admissionNumber);//get from member module
    }
    this.memberGuardianDetailsModelDetail.guardianType = 2;
    this.guardaindisable();
  }

  /**
   * @implements no guardain Type
   * @param flag 
   * @author jyothi.naidana
   */
  noGuardainaType(flag:boolean){
    this.courtAppointedGuardain = true;
    this.sameAsMemberGuardain = false;
    this.noGuardain  = true;
    //onchange on update
    let guardainId = null;
    let remarks = null;
    if(flag){
      let gaurdianSignedCopyPath = null;
      if(this.memberGuardianDetailsModelDetail != null && this.memberGuardianDetailsModelDetail != undefined){
        if(this.memberGuardianDetailsModelDetail.id  != null && this.memberGuardianDetailsModelDetail.id  != undefined){
          guardainId = this.memberGuardianDetailsModelDetail.id ;
        }
        if(this.memberGuardianDetailsModelDetail.remarks  != null && this.memberGuardianDetailsModelDetail.remarks  != undefined){
          remarks = this.memberGuardianDetailsModelDetail.remarks ;
        }
        if(this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath  != null && this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath  != undefined){
          gaurdianSignedCopyPath = this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath ;
          this.memberGuardianDetailsModelDetail.guardainSighnedMultipartFiles =this.fileUploadService.getFile(this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath , ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetail.gaurdianSignedCopyPath);
        }
      }
  
      this.memberGuardianDetailsModelDetail = new MemberGuardianDetailsModelDetaila();
      if(guardainId != null && guardainId != undefined){
        this.memberGuardianDetailsModelDetail.id = guardainId;
      }
      if(remarks != null && remarks != undefined){
        this.memberGuardianDetailsModelDetail.remarks = remarks;
      }
    }
    this.memberGuardianDetailsModelDetail.guardianType = 3;
    this.noGuardainValidation();
  }

  /**
   * @implements no guardain validation
   * @author jyothi.naidana
   */
  noGuardainValidation(){
    if (this.age < 18) {
    this.nomineeForm.get('relationNameOfGuardian')?.enable();
    this.nomineeForm.get('guardianName')?.enable();
    this.nomineeForm.get('guardianAadhar')?.enable();
    this.nomineeForm.get('guardianMobile')?.enable();
    this.nomineeForm.get('guardianEmail')?.enable();
    this.guarntorDetailsFalg = true;
    // const controlName = this.nomineeForm.get('guardianRemarks');
    // if (controlName) {
    //   controlName.setValidators([
    //     Validators.required,
    //   ]);
    //   controlName.updateValueAndValidity();
    // }

    }
  }

  /**
   * @implements reset guardain
   * @author jyothi.naidana
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

    // const controlName = this.nomineeForm.get('relationNameOfGuardian');
    // if (controlName) {
    //   controlName.setValidators(null); // Set the required validator null
    //   controlName.updateValueAndValidity();
    // }

    // const controlTow = this.nomineeForm.get('guardianName');
    // if (controlTow) {
    //   controlTow.setValidators(null); // Set the required validator null
    //   controlTow.updateValueAndValidity();
    // }
    // const controlFour = this.nomineeForm.get('guardianAadhar');
    // if (controlFour) {
    //   controlFour.setValidators(null); // Set the required validator null
    //   controlFour.updateValueAndValidity();
    // }
    // const controlFive = this.nomineeForm.get('guardianMobile');
    // if (controlFive) {
    //   controlFive.setValidators(null); // Set the required validator null
    //   controlFive.updateValueAndValidity();
    // }
    // const controlSix = this.nomineeForm.get('guardianEmail');
    // if (controlSix) {
    //   controlSix.setValidators(null); // Set the required validator null
    //   controlSix.updateValueAndValidity();
    // }
  }

  /**
   * @implements nominee age calculation
   * @author jyothi.naidana
   */
  /**
   * @implements age caluculation
   * @param age 
   * @author jyothi.naidana
   */
  ageCaluculation(flag: any) {
    if (flag) {//with age to date convertion
      if (this.savingsBankNomineeModel.age != null && this.savingsBankNomineeModel.age != undefined) {
        if (this.savingsBankNomineeModel.age > 0) {

          const currentDate = new Date();  // Get the current date
          const birthYear = currentDate.getFullYear() - this.savingsBankNomineeModel.age;  // Subtract the entered age from the current year
          const birthMonth = currentDate.getMonth();  // Keep the current month
          const birthDate = currentDate.getDate();   // Keep the current day

          // Construct the calculated Date of Birth
          const dob = new Date(birthYear, birthMonth, birthDate);

          // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          // Format the Date of Birth to 'DD/Mon/YYYY'
          const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;

          // Format the Date of Birth to YYYY-MM-DD to match the input type="date" format
          this.savingsBankNomineeModel.dateOfBirth = null;
          this.savingsBankNomineeModel.dateOfBirthVal = formattedDob;
        }
        else {
          this.nomineeForm.get('age')?.reset();
          this.nomineeForm.get("dateOfBirth")?.reset();
          this.msgs = [{ severity: 'error',  detail: savingsbanktransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    }
    else {//with date to age convertion
      this.savingsBankNomineeModel.dateOfBirthVal = this.datePipe.transform(this.savingsBankNomineeModel.dateOfBirthVal, this.orgnizationSetting.datePipe);
      if (this.savingsBankNomineeModel.dateOfBirthVal) {
        const dob = new Date(this.savingsBankNomineeModel.dateOfBirthVal);  // Parse the date of birth entered by the user
        const currentDate = new Date();  // Get the current date
        let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
        const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
        if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
          age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
        }
        this.savingsBankNomineeModel.age = age;  // Set the calculated age to the class property
      }
    }
    if(this.age >= 18 && this.savingsBankNomineeModel.age != null && this.savingsBankNomineeModel.age != undefined){
      if(this.savingsBankNomineeModel.age < 18){
        this.guarntorDetailsFalg = true;
        this.updateData();
      }  
      else {
        this.guarntorDetailsFalg = false;
      }
    }
    else if(this.age < 18 && this.savingsBankNomineeModel.age <18){
      this.msgs = [];
      this.savingsBankNomineeModel.age = null;
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Minors Member Account Should Take Major Nominee Only" }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }

  }

  /**
   * @implements guardaina enable based on nominee age
   * @author jyothi.naidana
   */
  guardainEnableBasedOnNomineeAge(){
    if(this.savingsBankNomineeModel.age < 18){
        this.guarntorDetailsFalg = true;
    }
  }
}
