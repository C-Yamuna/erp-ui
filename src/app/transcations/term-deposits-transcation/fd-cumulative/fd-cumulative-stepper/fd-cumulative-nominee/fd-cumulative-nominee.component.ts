import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdCumulativeNominee, MemberGuardianDetailsModelDetails } from './shared/fd-cumulative-nominee.model';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { FdCumulativeNomineeService } from './shared/fd-cumulative-nominee.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FdCumulativeApplicationService } from '../fd-cumulative-application/shared/fd-cumulative-application.service';
import { FdCumulativeApplication } from '../fd-cumulative-application/shared/fd-cumulative-application.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';

@Component({
  selector: 'app-fd-cumulative-nominee',
  templateUrl: './fd-cumulative-nominee.component.html',
  styleUrls: ['./fd-cumulative-nominee.component.css']
})
export class FdCumulativeNomineeComponent implements OnInit {

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
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  fdCumulativeNomineeModel: FdCumulativeNominee = new FdCumulativeNominee();
  memberGuardianDetailsModelDetails: MemberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  fileName: any;
  fdCummulativeAccId: any;
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
  guardain: any;
  showForm: any;
  memberTypeName: any;
  institutionPromoter: any;
  promoterDetails: any;
  admissionNumber: any;
  depositDateVal: any;
  depositAmount: any;
  nomineeEdit: Boolean = false;
  nomineeHistoryList: any[] = [];
  nomineeFields: any[] = [];

  courtAppointedGuardain: any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  sameAsMemberGuardain: boolean = false;
  noGuardain: boolean = true;
  nomineeTypeDisable: boolean = false;
  guardainTypeDisable: boolean = false;
  historyFLag: boolean = false;
  flag: boolean = false;
  filesDTOList: any[] = [];
  isFileUploadedNominee: boolean = false;
  isFileUploadedGuardian: boolean = false;
  isSaveAndNextEnable: boolean = false;
  depositDate: any;
  today: any;
  constructor(private router: Router, private formBuilder: FormBuilder,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private fdCumulativeNomineeService: FdCumulativeNomineeService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService) {
    this.nomineeForm = this.formBuilder.group({
      relationName: ['',],
      nomineeName: ['',],
      aadhaar: ['',],
      mobileNumber: ['',],
      email: ['',],
      nomineeType: ['', Validators.required],
      dateOfBirth: new FormControl('',),
      nomineeAge: [''],
      remarks: new FormControl('',),
      //guardian form fields
      relationNameOfGuardian: ['',],
      guardianName: ['',],
      guardianAge: ['',],
      guardianAadhar: ['',],
      guardianMobile: ['',],
      guardianEmail: ['',],
      guardianAddress: ['',],
      guardainType: [''],
      fileUpload: ['',],
      guardianRemarks: new FormControl('',),
    });
    this.nomineeFields = [
      { field: 'name', header: 'Name' },
      { field: 'accountNumber', header: 'Account Number' },
      { field: 'aadharNumber', header: 'Aadhar Number' },
      { field: 'mobileNumber', header: 'Mobile Number' },
      { field: 'nomineeEmail', header: 'Email' },
      { field: 'statusName', header: 'Status' },
    ]

  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if (this.showForm) {
      this.nomineeList = [
        { label: 'New Nominee', value: 1 },
        { label: 'No Nominee', value: 3 },
      ]
    }
    else {
      this.nomineeList = [
        { label: 'New Nominee', value: 1 },
        { label: 'Same As Membership Nominee', value: 2 },
        { label: 'No Nominee', value: 3 },
      ]
    }
    if (this.showForm) {
      this.guadianTypesList = [
        { label: 'New Guardain', value: 1 },
        { label: 'No Guardain', value: 3 },
      ]
    } else {
      this.guadianTypesList = [
        { label: 'New Guardain', value: 1 },
        { label: 'Same as Member Guardain', value: 2 },
        { label: 'No Guardain', value: 3 },
      ];
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['preview'] != undefined) {
        if (params['preview'] != undefined && params['preview'] != null) {
          let edit = this.encryptDecryptService.decrypt(params['preview']);
          this.historyFLag = true;
        }
        if (params['id'] != undefined && params['id'] != null) {
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          this.fdCummulativeAccId = Number(queryParams);
          this.getFdCummApplicationById(this.fdCummulativeAccId);
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
  updateData() {
    if (this.relationTypesList != null && this.relationTypesList != undefined && this.relationTypesList.length > 0) {
      let nominee = this.relationTypesList.find((data: any) => null != data && this.fdCumulativeNomineeModel.relationTypeId != null && data.value == this.fdCumulativeNomineeModel.relationTypeId);
      if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
        this.fdCumulativeNomineeModel.relationTypeName = nominee.label;
      }
      let guardain = this.relationTypesList.find((data: any) => null != data && this.memberGuardianDetailsModelDetails.relationshipTypeId != null && data.value == this.memberGuardianDetailsModelDetails.relationshipTypeId);
      if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined) {
        this.memberGuardianDetailsModelDetails.relationshipTypeName = guardain.label;
      }
    }
    if (this.age <= 18 || this.fdCumulativeNomineeModel.nomineeAge < 18) {
      this.memberGuardianDetailsModelDetails.fdCummulativeAccId = this.fdCummulativeAccId;
      this.memberGuardianDetailsModelDetails.accountNumber = this.accountNumber;
      this.fdCumulativeNomineeModel.memberGuardianDetailsModelDetails = this.memberGuardianDetailsModelDetails;
      this.isSaveAndNextEnable = (!this.nomineeForm.valid) || !(this.isFileUploadedNominee && this.isFileUploadedGuardian)
    }
    else {
      this.isSaveAndNextEnable = (!this.nomineeForm.valid) || (!this.isFileUploadedNominee);
    }
    this.fdCumulativeNomineeModel.accountNumber = this.accountNumber;
    this.fdCumulativeNomineeModel.fdCummulativeAccId = this.fdCummulativeAccId;
    this.fdCumulativeNomineeModel.memberTypeName = this.memberTypeName;
    this.fdCumulativeApplicationService.changeData({
      formValid: !this.nomineeForm.valid ? true : false,
      data: this.fdCumulativeNomineeModel,
      // isDisable: (!this.nomineeForm.valid),
      isDisable: this.isSaveAndNextEnable,
      // isDisable:false,
      stepperIndex: 5,
    });
  }
  save() {
    this.updateData();
  }
  //on change nominee type need to update validation
  onChange(event: any, flag: boolean) {
    this.nomineeForm.get('relationName')?.reset();
    this.nomineeForm.get('nomineeName')?.reset();
    this.nomineeForm.get('aadhaar')?.reset();
    this.nomineeForm.get('mobileNumber')?.reset();
    this.nomineeForm.get('email')?.reset();
    // if (flag) {
    //   this.fdCumulativeNomineeModel.nomineeSighnedFormMultiPartList = [];
    //   this.isFileUploadedNominee = false;
    // }
    if (flag) {
      this.fdCumulativeNomineeModel.nomineeSighnedFormMultiPartList = [];
      this.isFileUploadedNominee = false;
      if (this.fdCumulativeNomineeModel.nomineeAge < 18) {
        this.guarntorDetailsFalg = true;
        let id = null;
        if (this.memberGuardianDetailsModelDetails.id != null && this.memberGuardianDetailsModelDetails.id != undefined) {
          let id = this.memberGuardianDetailsModelDetails.id;
        }
        this.memberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
        this.memberGuardianDetailsModelDetails.id = id;
        this.sameAsMemberGuardain = false;
        this.courtAppointedGuardain = false;
        this.resetGuardain();
      }
    }
    if (event == 1) {//new nominee
      this.newNomineeType(flag);
    }
    else if (event == 2) {//same as membership nominee
      this.samAsMemberNomineeType(flag);
    }
    else if (event == 3) {//no nominee
      this.noNomineeType(flag);
    }
  }

  /**
   * @implements onChange Guardain Type 
   * @param event guardain Type
   */
  onChangeGuardain(event: any, flag: boolean) {
    // this.nomineeForm.get('relationNameOfGuardian')?.reset();
    // this.nomineeForm.get('guardianName')?.reset();
    // this.nomineeForm.get('guardianAadhar')?.reset();
    // this.nomineeForm.get('guardianMobile')?.reset();
    // this.nomineeForm.get('guardianEmail')?.reset();
    if (flag) {
      this.memberGuardianDetailsModelDetails.guardainSighnedMultipartFiles = [];
      this.isFileUploadedGuardian = false;
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
 * @author bhargavi
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

  //nominee details by fd account id

  getNomineDetailsByFdId(fdCummulativeAccId: any) {
    this.fdCumulativeNomineeService.getNomineeDetailsByFdAccId(fdCummulativeAccId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.fdCumulativeNomineeModel = this.responseModel.data[0];
            if (this.fdCumulativeNomineeModel.nomineeDob != null && this.fdCumulativeNomineeModel.nomineeDob != undefined) {
              this.fdCumulativeNomineeModel.nomineeDob = this.datePipe.transform(this.fdCumulativeNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
            }
            if (this.fdCumulativeNomineeModel.nomineeType != 0) {
              this.onChange(this.fdCumulativeNomineeModel.nomineeType, this.flag);
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
    })
  }




  //get fd account details for header data  
  getFdCummApplicationById(id: any) {
    this.fdCumulativeApplicationService.getFdCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
              this.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
            }
            if (this.responseModel.data[0].admissionNumber != null && this.responseModel.data[0].admissionNumber != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
            }
            if (this.responseModel.data[0].depositAmount != null && this.responseModel.data[0].depositAmount != undefined) {
              this.depositAmount = this.responseModel.data[0].depositAmount;
            }

            if (this.responseModel.data[0].productName != null && this.responseModel.data[0].productName != undefined) {
              this.productName = this.responseModel.data[0].productName;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
              if (this.historyFLag) {
                // this.getNomineeHistoryByfdAccountNumber(this.accountNumber);
              }
            }
            if (this.responseModel.data[0].memberTypeName == MemberShipTypesData.INDIVIDUAL) {
              if (this.responseModel.data[0].memberShipBasicDetailsDTO.age != null && this.responseModel.data[0].memberShipBasicDetailsDTO.age != undefined) {
                this.age = this.responseModel.data[0].memberShipBasicDetailsDTO.age;
                if (this.age < 18) {
                  this.guarntorDetailsFalg = true;
                }
              }
            }
            this.fdCumulativeApplicationModel = this.responseModel.data[0];
            if (this.fdCumulativeApplicationModel != null && this.fdCumulativeApplicationModel != undefined) {
              if (this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0] != undefined) {
                this.fdCumulativeNomineeModel = this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0];
                if (this.fdCumulativeNomineeModel.nomineeDob != null && this.fdCumulativeNomineeModel.nomineeDob != undefined) {
                  this.fdCumulativeNomineeModel.nomineeDobVal = this.datePipe.transform(this.fdCumulativeNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
                }
                if (this.fdCumulativeNomineeModel.nomineeFilePath != null && this.fdCumulativeNomineeModel.nomineeFilePath != undefined) {
                  this.fdCumulativeNomineeModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.fdCumulativeNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeNomineeModel.nomineeFilePath);
                  if (this.fdCumulativeNomineeModel.nomineeType != null && this.fdCumulativeNomineeModel.nomineeType != undefined) {
                    if (this.fdCumulativeNomineeModel.nomineeType != 2) {
                      this.fdCumulativeNomineeModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.fdCumulativeNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeNomineeModel.nomineeFilePath);
                    }
                    else {
                      this.fdCumulativeNomineeModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.fdCumulativeNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeNomineeModel.nomineeFilePath);
                    }
                    this.isFileUploadedNominee = applicationConstants.TRUE;
                  }
                }
                if (this.fdCumulativeNomineeModel.nomineeAge < 18) {
                  this.guarntorDetailsFalg = true;
                }
              }
              else {
                this.isFileUploadedNominee = applicationConstants.FALSE;
              }
              if (this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0] != undefined) {
                this.memberGuardianDetailsModelDetails = this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0];

                if (this.memberGuardianDetailsModelDetails.uploadFilePath != null && this.memberGuardianDetailsModelDetails.uploadFilePath != undefined) {
                  if (this.memberGuardianDetailsModelDetails.guardianType != null && this.memberGuardianDetailsModelDetails.guardianType != undefined) {
                    if (this.memberGuardianDetailsModelDetails.guardianType != 2) {
                      this.memberGuardianDetailsModelDetails.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModelDetails.uploadFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetails.uploadFilePath);
                    }
                    else {
                      this.memberGuardianDetailsModelDetails.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModelDetails.uploadFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetails.uploadFilePath);
                    }
                    this.isFileUploadedGuardian = applicationConstants.TRUE;
                  }
                }
                else {
                  this.isFileUploadedGuardian = applicationConstants.FALSE;
                }
              }
              if (this.fdCumulativeNomineeModel.nomineeType != null && this.fdCumulativeNomineeModel.nomineeType != undefined) {
                this.onChange(this.fdCumulativeNomineeModel.nomineeType, this.flag);
              }
              if (this.guarntorDetailsFalg && this.memberGuardianDetailsModelDetails.guardianType != null && this.memberGuardianDetailsModelDetails.guardianType != undefined) {
                this.onChangeGuardain(this.memberGuardianDetailsModelDetails.guardianType, this.flag);
              }
            }
            else if (this.guarntorDetailsFalg) {
              const controlName = this.nomineeForm.get('guardainType');
              if (controlName) {
                  controlName.setValidators([Validators.required]);
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
  getAllRelationTypes() {
    this.fdCumulativeApplicationService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationTypesList = this.responseModel.data
            this.relationTypesList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
              return { label: count.name, value: count.id }
            });
            let nominee = this.relationTypesList.find((data: any) => null != data && this.fdCumulativeNomineeModel.relationTypeId != null && data.value == this.fdCumulativeNomineeModel.relationTypeId);
            if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
              this.fdCumulativeNomineeModel.relationTypeName = nominee.label;
            }
            let guardain = this.relationTypesList.find((data: any) => null != data && this.memberGuardianDetailsModelDetails.relationshipTypeId != null && data.value == this.memberGuardianDetailsModelDetails.relationshipTypeId);
            if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined) {
              this.memberGuardianDetailsModelDetails.relationshipTypeName = guardain.label;
            }
          }
        }
      }
    });
  }

  //get guardian details by account Number
  getGuardianDetails(accountNumber: any) {
    this.fdCumulativeNomineeService.getGuardianDetails(accountNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGuardianDetailsModelDetails = this.responseModel.data[0];
            if (this.memberGuardianDetailsModelDetails.guardianDob != null && this.memberGuardianDetailsModelDetails.guardianDob != undefined) {
              this.memberGuardianDetailsModelDetails.guardianDob = this.datePipe.transform(this.memberGuardianDetailsModelDetails.guardianDob, this.orgnizationSetting.datePipe);
            }
            if (this.memberGuardianDetailsModelDetails.guardianType != null && this.memberGuardianDetailsModelDetails.guardianType != undefined) {
              this.onChangeGuardain(this.memberGuardianDetailsModelDetails.guardianType, this.flag);
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
    this.fdCumulativeApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
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
            if (this.membershipBasicRequiredDetails.age != null && this.membershipBasicRequiredDetails.age != undefined) {

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
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.fdCumulativeApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
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
            if (this.memberGroupDetailsModel.groupPromoterList.length > 0) {
              this.promoterDetails = this.memberGroupDetailsModel.groupPromoterList;
              this.promoterDetails = this.memberGroupDetailsModel.groupPromoterList.map((member: any) => {
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
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.fdCumulativeApplicationService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
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
   */
  loadMembershipData() {
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
   */
  getNomineeFromMemberModule(admissionNumber: any) {
    this.fdCumulativeNomineeService.getNomineeFromMembeshipByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetails = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList != undefined &&
              this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != undefined) {
              this.fdCumulativeNomineeModel = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0];
            }
            if (this.responseModel.data[0].relationId != null && this.responseModel.data[0].relationId != undefined) {
              this.fdCumulativeNomineeModel.relationTypeId = this.responseModel.data[0].relationId;
              this.getAllRelationTypes();
            }
            if (this.responseModel.data[0].relationTypeName != null && this.responseModel.data[0].relationTypeName != undefined) {
              this.fdCumulativeNomineeModel.relationTypeName = this.responseModel.data[0].relationTypeName;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != undefined) {
              this.fdCumulativeNomineeModel.nomineeName = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != undefined) {
              this.fdCumulativeNomineeModel.nomineeAadharNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != undefined) {
              this.fdCumulativeNomineeModel.nomineeMobileNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != undefined) {
              this.fdCumulativeNomineeModel.nomineeEmailId = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeDob != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeDob != undefined) {
              this.fdCumulativeNomineeModel.nomineeDob = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeDob;
              this.fdCumulativeNomineeModel.nomineeDobVal = this.datePipe.transform(this.fdCumulativeNomineeModel.nomineeDob, this.orgnizationSetting.datePipe);
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != undefined) {
              this.fdCumulativeNomineeModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath,
                ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath);
              this.isFileUploadedNominee = applicationConstants.TRUE;
            }
            this.fdCumulativeNomineeModel.nomineeType = 2;
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
   * @implements get guardain from member module
   * @param admissionNumber
   */
  getGaurdainFromMemberModule(admissionNumber: any) {
    this.fdCumulativeNomineeService.getNomineeFromMembeshipByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetails = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList != undefined &&
              this.responseModel.data[0].memberShipGuadianDetailsDTOList[0] != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0] != undefined) {
              this.memberGuardianDetailsModelDetails = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0];
            }
            if (this.responseModel.data[0].relationshipTypeId != null && this.responseModel.data[0].relationshipTypeId != undefined) {
              this.memberGuardianDetailsModelDetails.relationshipTypeId = this.responseModel.data[0].relationshipTypeId;
              this.getAllRelationTypes();
            }
            if (this.responseModel.data[0].relationshipTypeName != null && this.responseModel.data[0].relationshipTypeName != undefined) {
              this.memberGuardianDetailsModelDetails.relationshipTypeName = this.responseModel.data[0].relationshipTypeName;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianName != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianName != undefined) {
              this.memberGuardianDetailsModelDetails.guardianName = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianName;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianAadharNumber != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianAadharNumber != undefined) {
              this.memberGuardianDetailsModelDetails.guardianAadharNumber = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianAadharNumber;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianMobileNumber != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianMobileNumber != undefined) {
              this.memberGuardianDetailsModelDetails.guardianMobileNumber = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianMobileNumber;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianEmailId != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianEmailId != undefined) {
              this.memberGuardianDetailsModelDetails.guardianEmailId = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianEmailId;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath != undefined) {
              this.memberGuardianDetailsModelDetails.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath,
                ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath);
              this.isFileUploadedGuardian = applicationConstants.TRUE;
            }
            this.memberGuardianDetailsModelDetails.guardianType = 2;
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
  fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.fdCumulativeNomineeModel.filesDTOList == null || this.fdCumulativeNomineeModel.filesDTOList == undefined) {
      this.fdCumulativeNomineeModel.filesDTOList = [];
    }
    if (this.isEdit && this.memberGuardianDetailsModelDetails != null && this.memberGuardianDetailsModelDetails != undefined && this.memberGuardianDetailsModelDetails.filesDTOList == null || this.memberGuardianDetailsModelDetails.filesDTOList == undefined) {
      this.memberGuardianDetailsModelDetails.filesDTOList = [];
    }
    let selectedFiles = [...event.files];

    if (filePathName === "Nominee") {
      this.fdCumulativeNomineeModel.nomineeSighnedFormMultiPartList = [];
      if (selectedFiles[0].size / 1024 / 1024 > 5) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_5MB }];
        setTimeout(() => {
          this.msgs = [];
          fileUpload.clear();
        }, 2000);
      }
    }
    if (filePathName === "Guardain") {
      this.memberGuardianDetailsModelDetails.guardainSighnedMultipartFiles = [];
      if (selectedFiles[0].size / 1024 / 1024 > 5) {
        fileUpload.clear();
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_5MB }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
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
        let timeStamp = this.commonComponent.getTimeStamp();
        // Add to filesDTOList array
        if (filePathName === "Nominee") {
          this.isFileUploadedNominee = applicationConstants.TRUE;
          this.fdCumulativeNomineeModel.filesDTOList.push(files);
          this.fdCumulativeNomineeModel.nomineeFilePath = null;
          this.fdCumulativeNomineeModel.filesDTOList[this.fdCumulativeNomineeModel.filesDTOList.length - 1].fileName = "FD_NON_CUMMULATIVE_NOMINEE" + this.fdCummulativeAccId + "_" + timeStamp + "_" + file.name;
          this.fdCumulativeNomineeModel.nomineeFilePath = "FD_NON_CUMMULATIVE_NOMINEE" + this.fdCummulativeAccId + "_" + timeStamp + "_" + file.name;
        }
        if (filePathName === "Guardain") {
          this.isFileUploadedGuardian = applicationConstants.TRUE;
          this.memberGuardianDetailsModelDetails.filesDTOList.push(files);
          this.memberGuardianDetailsModelDetails.uploadFilePath = null;
          this.memberGuardianDetailsModelDetails.filesDTOList[this.memberGuardianDetailsModelDetails.filesDTOList.length - 1].fileName = "FD_NON_CUMMULATIVE_GUARDAIN" + "_" + timeStamp + "_" + file.name;
          this.memberGuardianDetailsModelDetails.uploadFilePath = "FD_NON_CUMMULATIVE_GUARDAIN" + "_" + timeStamp + "_" + file.name;
        }
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
    }
  }
  /**
   * @implements gurdaind from validation
   */
  guardainFormValidation() {
    if (this.age <= 18 || this.fdCumulativeNomineeModel.nomineeDob < 18) {
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
          Validators.pattern(applicationConstants.AADHAR_PATTERN)
        ]);
        controlFour.updateValueAndValidity();
      }
      const controlFive = this.nomineeForm.get('guardianMobile');
      if (controlFive) {
        controlFive.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.MOBILE_PATTERN)
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
   */
  // getNomineeHistoryByfdAccountNumber(accountNumber: any) {
  //   this.fdCumulativeNomineeService.getNomineeDetailsByFdAccId(accountNumber).subscribe((response: any) => {
  //     this.responseModel = response;
  //     if (this.responseModel != null && this.responseModel != undefined) {
  //       if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
  //         if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
  //           this.nomineeHistoryList = this.responseModel.data;
  //         }
  //       }
  //       else {
  //         this.msgs = [];
  //         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 2000);
  //       }
  //     }
  //   },
  //     error => {
  //       this.msgs = [];
  //       this.commonComponent.stopSpinner();
  //       this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
  //       setTimeout(() => {
  //         this.msgs = [];
  //       }, 2000);
  //     });
  // }

  /**
   * @implements gurdain form validation based on guardain type
   */
  guardaindisable() {
    this.nomineeForm.get('relationNameOfGuardian')?.disable();
    this.nomineeForm.get('guardianName')?.disable();
    this.nomineeForm.get('guardianAadhar')?.disable();
    this.nomineeForm.get('guardianMobile')?.disable();
    this.nomineeForm.get('guardianEmail')?.disable();
    this.updateData();
  }

  /**
   * @implements nominee form validation
   */
  nomineeFormValidation() {
    this.nomineeForm.get('relationName')?.disable();
    this.nomineeForm.get('nomineeName')?.disable();
    this.nomineeForm.get('dateOfBirth')?.disable();
    this.nomineeForm.get('nomineeAge')?.disable();
    this.nomineeForm.get('aadhaar')?.disable();
    this.nomineeForm.get('mobileNumber')?.disable();
    this.nomineeForm.get('email')?.disable();
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
    const controlSix = this.nomineeForm.get('email');
    if (controlSix) {
      controlSix.setValidators(null); // Set the required validator null
      controlSix.updateValueAndValidity();
    }
    const controlSeven = this.nomineeForm.get('remarks');
    if (controlSeven) {
      controlSeven.setValidators(null);
      controlSeven.updateValueAndValidity();
    }
    this.updateData();
  }
  /**
   * @implements nominee required valdation
     */
  nomineeValidatorsRequired() {
    this.nomineeForm.get('relationName')?.enable();
    this.nomineeForm.get('nomineeName')?.enable();
    this.nomineeForm.get('aadhaar')?.enable();
    this.nomineeForm.get('mobileNumber')?.enable();
    this.nomineeForm.get('email')?.enable();
    this.nomineeForm.get('fileUpload')?.enable();
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
        Validators.pattern(applicationConstants.AADHAR_PATTERN)
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
    const controlSeven = this.nomineeForm.get('remarks');
    if (controlSeven) {
      controlSeven.setValidators(null);
      controlSeven.updateValueAndValidity();
    }
    this.updateData();
  }

  /**
   * @implements nominee not required validation 
   */
  nomineeValidatorsFormNotRequired() {
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
   */
  fileRemoeEvent(fileName: any) {
    if (fileName == "Nominee") {
      this.isFileUploadedNominee = applicationConstants.FALSE;
      if (this.fdCumulativeNomineeModel.filesDTOList != null && this.fdCumulativeNomineeModel.filesDTOList != undefined && this.fdCumulativeNomineeModel.filesDTOList.length > 0) {
        let removeFileIndex = this.fdCumulativeNomineeModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdCumulativeNomineeModel.nomineeFilePath);
        this.fdCumulativeNomineeModel.filesDTOList[removeFileIndex] = null;
        this.fdCumulativeNomineeModel.nomineeFilePath = null;
      }
    }
    if (fileName == "Guardain") {
      this.isFileUploadedGuardian = applicationConstants.FALSE;
      if (this.memberGuardianDetailsModelDetails.filesDTOList != null && this.memberGuardianDetailsModelDetails.filesDTOList != undefined && this.memberGuardianDetailsModelDetails.filesDTOList.length > 0) {
        let removeFileIndex = this.memberGuardianDetailsModelDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.memberGuardianDetailsModelDetails.uploadFilePath);
        this.memberGuardianDetailsModelDetails.filesDTOList[removeFileIndex] = null;
        this.memberGuardianDetailsModelDetails.uploadFilePath = null;
      }
    }
    this.updateData();//validation update for save and next button
  }
  /**
   * @implements onChange new Nominee
   * @param flag 
   */
  newNomineeType(flag: boolean) {
    this.newNominee = true;
    this.noNominee = false;
    //onchange on update
    if (flag) {
      let nomineeId = null;
      if (this.fdCumulativeNomineeModel != null && this.fdCumulativeNomineeModel != undefined && this.fdCumulativeNomineeModel.id != null && this.fdCumulativeNomineeModel.id != undefined) {
        nomineeId = this.fdCumulativeNomineeModel.id;
      }
      this.fdCumulativeNomineeModel = new FdCumulativeNominee();
      if (nomineeId != null && nomineeId != undefined) {
        this.fdCumulativeNomineeModel.id = nomineeId;
      }
    }
    this.fdCumulativeNomineeModel.nomineeType = 1;
    this.nomineeValidatorsRequired();
  }

  /**
   * @implements sameAsmemberNominee onChange
   * @param flag 
   */
  samAsMemberNomineeType(flag: boolean) {
    this.newNominee = true;
    this.noNominee = false;
    //onchange on update
    if (flag) {
      let nomineeId = null;
      if (this.fdCumulativeNomineeModel != null && this.fdCumulativeNomineeModel != undefined && this.fdCumulativeNomineeModel.id != null && this.fdCumulativeNomineeModel.id != undefined) {
        nomineeId = this.fdCumulativeNomineeModel.id;
      }
      this.fdCumulativeNomineeModel = new FdCumulativeNominee();
      if (nomineeId != null && nomineeId != undefined) {
        this.fdCumulativeNomineeModel.id = nomineeId;
      }
      if (this.admissionNumber != null && this.admissionNumber != undefined) {
        this.getNomineeFromMemberModule(this.admissionNumber);
      }
    }
    this.fdCumulativeNomineeModel.nomineeType = 2;
    this.nomineeFormValidation();
  }

  /**
   * @implements noNomineeType OnChange
   * @param flag 
   */
  noNomineeType(flag: boolean) {
    this.noNominee = true;
    this.newNominee = false;
    this.sameAsMembershipNominee = false;
    if (this.fdCumulativeNomineeModel.nomineeAge < 18) {
      this.guarntorDetailsFalg = false;
    }
    if (flag) {
      let nomineeId = null;//onchange on update

      let nomineeFilePath = null;
      if (this.fdCumulativeNomineeModel != null && this.fdCumulativeNomineeModel != undefined) {
        if (this.fdCumulativeNomineeModel.id != null && this.fdCumulativeNomineeModel.id != undefined) {
          nomineeId = this.fdCumulativeNomineeModel.id;
        }
        if (this.fdCumulativeNomineeModel.nomineeFilePath != null && this.fdCumulativeNomineeModel.nomineeFilePath != undefined) {
          nomineeFilePath = this.fdCumulativeNomineeModel.nomineeFilePath;
          this.fdCumulativeNomineeModel.nomineeFilePath = this.fileUploadService.getFile(this.fdCumulativeNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeNomineeModel.nomineeFilePath);
        }
      }
      this.fdCumulativeNomineeModel = new FdCumulativeNominee();
      if (nomineeId != null && nomineeId != undefined) {
        this.fdCumulativeNomineeModel.id = nomineeId;
      }
      this.fdCumulativeNomineeModel.nomineeType = 3;
      if (nomineeFilePath != null && nomineeFilePath != undefined) {
        this.fdCumulativeNomineeModel.nomineeFilePath = nomineeFilePath;
      }
    }
    const controlSix = this.nomineeForm.get('remarks');
    if (controlSix) {
      controlSix.setValidators([
        Validators.required,
      ]);
      controlSix.updateValueAndValidity();
    }

    // this.updateData();
    this.nomineeValidatorsFormNotRequired();
    this.updateData();
    // this.newNominee = false;
  }

  /**
   * @implements new guardain Onchage
   * @param flag 
   */
  newGuardainType(flag: boolean) {
    this.courtAppointedGuardain = false;
    this.sameAsMemberGuardain = true;
    this.noGuardain = false;
    //onchange on update
    if (flag) {
      let guardainId = null;
      if (this.memberGuardianDetailsModelDetails != null && this.memberGuardianDetailsModelDetails != undefined && this.memberGuardianDetailsModelDetails.id != null && this.memberGuardianDetailsModelDetails.id != undefined) {
        guardainId = this.memberGuardianDetailsModelDetails.id;
      }
      this.memberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
      this.memberGuardianDetailsModelDetails.id = guardainId;
    }
    this.memberGuardianDetailsModelDetails.guardianType = 1;
    this.guardainFormValidation();
  }
  /**
   * @implements sameAsMember gurdain Onchage
   * @param flag 
   */
  sameAsMemberGuardianType(flag: boolean) {
    this.sameAsMemberGuardain = true;
    this.courtAppointedGuardain = false;
    this.noGuardain = false;
    //onchange on update
    if (flag) {
      let guardainId = null;
      if (this.memberGuardianDetailsModelDetails != null && this.memberGuardianDetailsModelDetails != undefined && this.memberGuardianDetailsModelDetails.id != null && this.memberGuardianDetailsModelDetails.id != undefined) {
        guardainId = this.memberGuardianDetailsModelDetails.id;
      }
      this.memberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
      this.memberGuardianDetailsModelDetails.id = guardainId;
      this.getGaurdainFromMemberModule(this.admissionNumber);//get from member module
    }
    this.memberGuardianDetailsModelDetails.guardianType = 2;
    this.guardaindisable();
  }

  noGuardainaType(flag: boolean) {

    this.courtAppointedGuardain = true;
    this.sameAsMemberGuardain = false;
    this.noGuardain = true;
    this.isFileUploadedNominee = applicationConstants.FALSE
    //onchange on update
    let guardainId = null;
    if (flag) {
      let uploadFilePath = null;
      if (this.memberGuardianDetailsModelDetails != null && this.memberGuardianDetailsModelDetails != undefined) {
        if (this.memberGuardianDetailsModelDetails.id != null && this.memberGuardianDetailsModelDetails.id != undefined) {
          guardainId = this.memberGuardianDetailsModelDetails.id;
        }

        if (this.memberGuardianDetailsModelDetails.uploadFilePath != null && this.memberGuardianDetailsModelDetails.uploadFilePath != undefined) {
          uploadFilePath = this.memberGuardianDetailsModelDetails.uploadFilePath;
          this.memberGuardianDetailsModelDetails.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModelDetails.uploadFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetails.uploadFilePath);
        }
      }

      this.memberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
      if (guardainId != null && guardainId != undefined) {
        this.memberGuardianDetailsModelDetails.id = guardainId;
      }

    }
    this.memberGuardianDetailsModelDetails.guardianType = 3;
    this.guardaindisable();
  }
  /**
 * @implements no guardain validation
 * @author bhargavi
 */
  noGuardainValidation() {
    if (this.age <= 18) {
      this.nomineeForm.get('relationNameOfGuardian')?.enable();
      this.nomineeForm.get('guardianName')?.enable();
      this.nomineeForm.get('guardianAadhar')?.enable();
      this.nomineeForm.get('guardianMobile')?.enable();
      this.nomineeForm.get('guardianEmail')?.enable();
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

    /**
     * @implements reset guardain
     * @author bhargavi
     */
    resetGuardain() {
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
     * @implements age caluculation
     * @param age 
     * @author bhargavi
     */
    ageCalculation(flag: any) {
      if (flag) {
        if (this.fdCumulativeNomineeModel.nomineeAge != null && this.fdCumulativeNomineeModel.nomineeAge != undefined) {
          if (this.fdCumulativeNomineeModel.nomineeAge > 0) {
  
            const currentDate = new Date();
            const birthYear = currentDate.getFullYear() - this.fdCumulativeNomineeModel.nomineeAge;
            const birthMonth = currentDate.getMonth();
            const birthDate = currentDate.getDate();
  
            const dob = new Date(birthYear, birthMonth, birthDate);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;
            this.fdCumulativeNomineeModel.nomineeDob = null;
            this.fdCumulativeNomineeModel.nomineeDobVal = formattedDob;
          }
          else {
            this.nomineeForm.get('age')?.reset();
            this.nomineeForm.get("dateOfBirth")?.reset();
            this.msgs = [{ severity: 'error', detail: termdeposittransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      }
      else {
        this.fdCumulativeNomineeModel.nomineeDobVal = this.datePipe.transform(this.fdCumulativeNomineeModel.nomineeDobVal, this.orgnizationSetting.datePipe);
        if (this.fdCumulativeNomineeModel.nomineeDobVal) {
          const dob = new Date(this.fdCumulativeNomineeModel.nomineeDobVal);
          const currentDate = new Date();
          let age = currentDate.getFullYear() - dob.getFullYear();  
          const m = currentDate.getMonth() - dob.getMonth(); 
          if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;
          }
          this.fdCumulativeNomineeModel.nomineeAge = age;  
        }
      }
      if (this.age >= 18 && this.fdCumulativeNomineeModel.nomineeAge != null && this.fdCumulativeNomineeModel.nomineeAge != undefined) {
        if (this.fdCumulativeNomineeModel.nomineeAge < 18) {
          this.guarntorDetailsFalg = true;
          this.updateData();
        }
        else {
          this.guarntorDetailsFalg = false;
        }
      }
      else if (this.age < 18 && this.fdCumulativeNomineeModel.nomineeAge < 18) {
        this.msgs = [];
        this.fdCumulativeNomineeModel.nomineeAge = null;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail:applicationConstants.MINOR_ACCOUNT_MEMBERS_SHOULD_TAKE_ONLY_MAJOR_MEMBER_AS_NOMINEE }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
  
    }
  
  
  
    /**
     * @implements guardaina enable based on nominee age
     * @author bhargavi
     */
    guardainEnableBasedOnNomineeAge() {
      if (this.fdCumulativeNomineeModel.nomineeAge < 18) {
        this.guarntorDetailsFalg = true;
      }
    }
}
