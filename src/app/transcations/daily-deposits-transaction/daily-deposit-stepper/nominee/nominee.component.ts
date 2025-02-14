import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Accounts } from '../../shared/accounts.model';
import { AccountNominee } from '../../shared/account-nominee.model';
import { AccountGuardian } from '../../shared/account-guardian.model';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-nominee',
  templateUrl: './nominee.component.html',
  styleUrls: ['./nominee.component.css']
})
export class NomineeComponent {
  nomineeForm: FormGroup;
  guarantorDetailsForm: any;
  nominee: any;
  nomineeList: any[] = [];
  checked: any;
  newNominee: boolean = false;
  sameAsMembershipNominee: boolean = false;
  noNominee: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  accountsModel: Accounts = new Accounts();
  accountNomineeModel: AccountNominee = new AccountNominee();
  accountGuardianModel: AccountGuardian = new AccountGuardian();
  membershipBasicDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

  fileName: any;
  accId: any;
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
  depositAmount: any;
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
  relationshipTypeName: any;
  relationshipTypeId: any;
  guardianName: any;
  guardianAadharNumber: any;
  guardianMobileNumber: any;
  guardianEmailId: any;
  memberFilePath: any;
  depositDate: any;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService,
    private dailyDepositsAccountsService:DailyDepositsAccountsService
  ) {
    this.nomineeForm = this.formBuilder.group({
      relationName: ['',],
      nomineeName: ['',],
      aadhaar: ['',],
      mobileNumber: ['',],
      email: ['',],
      dateOfBirth: new FormControl('',),
      // remarks: new FormControl('',),
      nomineeType: ['', Validators.required],

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
          this.accId = Number(queryParams);
          this.getAccountApplicationById(this.accId);
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
  updateData() {
    if(this.relationTypesList != null && this.relationTypesList != undefined && this.relationTypesList.length > 0){
      let nominee = this.relationTypesList.find((data: any) => null != data && this.accountNomineeModel.relationType != null && data.value == this.accountNomineeModel.relationType);
      if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
        this.accountNomineeModel.relationTypeName = nominee.label;
      }
      let guardain = this.relationTypesList.find((data: any) => null != data && this.accountGuardianModel.relationType != null && data.value == this.accountGuardianModel.relationType);
      if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined) {
        this.accountGuardianModel.relationTypeName = guardain.label;
      }
    }
    if (this.age <= 18) {
      this.accountGuardianModel.accId = this.accId ;
      this.accountGuardianModel.accountNumber = this.accountNumber;
      // this.accountNomineeModel.accountGuardian = this.accountGuardianModel;
    }
    this.accountNomineeModel.accountNumber = this.accountNumber;
    this.accountNomineeModel.accId = this.accId;
    this.dailyDepositsAccountsService.changeData({
      formValid: !this.nomineeForm.valid ? true : false,
      data: this.accountNomineeModel,
      isDisable: (!this.nomineeForm.valid),
      // isDisable:false,
      stepperIndex: 5,
    });
  }
  save() {
    this.updateData();
  }
  //on change nominee type need to update validation
  onChange(event: any ,flag :boolean) {
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
  onChangeGuardain(event: any , flag :boolean) {
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

  //get fd account details for header data  
  getAccountApplicationById(id: any) {
    this.dailyDepositsAccountsService.getDailyDepositsByacid(id).subscribe((data: any) => {
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
            if (this.responseModel.data[0].adminssionNumber != null && this.responseModel.data[0].adminssionNumber != undefined) {
              this.admissionNumber = this.responseModel.data[0].adminssionNumber;
            }

            if (this.responseModel.data[0].depositAmount != null && this.responseModel.data[0].depositAmount != undefined) {
              this.depositAmount = this.responseModel.data[0].depositAmount;
            }
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
              if (this.historyFLag) {
                this.getNomineeHistoryByRdAccountNumber(this.accountNumber);
              }
            }
            if (this.responseModel.data[0].memberShipBasicDetailsDTO.age != null && this.responseModel.data[0].memberShipBasicDetailsDTO.age != undefined) {
              this.age = this.responseModel.data[0].memberShipBasicDetailsDTO.age;
              if (this.age < 18) {
                this.guarntorDetailsFalg = true;
              }
            }
            this.accountsModel = this.responseModel.data[0];
            if (this.accountsModel != null && this.accountsModel != undefined) {
              if (this.accountsModel.accountNomineeList != null && this.accountsModel.accountNomineeList != undefined &&
                this.accountsModel.accountNomineeList[0] != null && this.accountsModel.accountNomineeList[0] != undefined)
                this.accountNomineeModel = this.accountsModel.accountNomineeList[0];
              if (this.accountNomineeModel.identityProofDocPath != null && this.accountNomineeModel.identityProofDocPath != undefined) {
                this.accountNomineeModel.nomineeMultiPartList = this.fileUploadService.getFile(this.accountNomineeModel.identityProofDocPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountNomineeModel.identityProofDocPath);
              }
              if (this.accountsModel.termAccountGaurdianList != null && this.accountsModel.termAccountGaurdianList != undefined &&
                this.accountsModel.termAccountGaurdianList[0] != null && this.accountsModel.termAccountGaurdianList[0] != undefined)
                this.accountGuardianModel = this.accountsModel.termAccountGaurdianList[0];

              if (this.accountGuardianModel.identityProofDocPath != null && this.accountGuardianModel.identityProofDocPath != undefined) {
                this.accountGuardianModel.guardainMultipartList = this.fileUploadService.getFile(this.accountGuardianModel.identityProofDocPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountGuardianModel.identityProofDocPath);
              }

              if (this.accountNomineeModel.nomineeType != null && this.accountNomineeModel.nomineeType != undefined) {
                this.onChange(this.accountNomineeModel.nomineeType, this.flag);
              }
              if (this.guarntorDetailsFalg && this.accountGuardianModel.gaurdianType != null && this.accountGuardianModel.gaurdianType != undefined) {
                this.onChangeGuardain(this.accountGuardianModel.gaurdianType, this.flag);
              }

            }
            else if (this.guarntorDetailsFalg) {
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
  getAllRelationTypes() {
    this.dailyDepositsAccountsService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationTypesList = this.responseModel.data
            this.relationTypesList = this.responseModel.data.filter((nominee: any) => nominee.status == applicationConstants.ACTIVE).map((count: any) => {
              return { label: count.name, value: count.id }
            });
          let  nominee= this.relationTypesList.find((data: any) => null != data && this.accountNomineeModel.relationType  != null && data.value == this.accountNomineeModel.relationType);
          if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined){
                this.accountNomineeModel.relationTypeName = nominee.label;
            }
            let  guardain= this.relationTypesList.find((data: any) => null != data && this.accountGuardianModel.relationType  != null && data.value == this.accountGuardianModel.relationType);
            if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined){
                this.accountGuardianModel.relationTypeName = guardain.label;
            }
          }
        }
      }
    });
  }

  //get guardian details by account Number
  getGuardianDetails(accountNumber: any) {
    this.dailyDepositsAccountsService.getGuardianDetails(accountNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountGuardianModel = this.responseModel.data[0];
            if (this.accountGuardianModel.dateOfBirth != null && this.accountGuardianModel.dateOfBirth != undefined) {
              this.accountGuardianModel.dateOfBirth = this.datePipe.transform(this.accountGuardianModel.dateOfBirth, this.orgnizationSetting.datePipe);
            }
            if(this.accountGuardianModel.gaurdianType != null && this.accountGuardianModel.gaurdianType != undefined){
              this.onChangeGuardain(this.accountGuardianModel.gaurdianType , this.flag);
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

  /**
   * @implements getNominee from member module
   * @param admissionNumber 
   */
  getMemberNomineDetailsByAdmissionNumber(admissionNumber : any){
    this.dailyDepositsAccountsService.getNomineeFromMembeshipByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList != undefined &&
              this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != undefined) {
              this.accountNomineeModel = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0];
            }
            if(this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId != undefined){
              this.accountNomineeModel.relationType = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId;
              // this.getAllRelationTypes();
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeName != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeName != undefined) {
              this.accountNomineeModel.relationTypeName = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeName;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != undefined) {
              this.accountNomineeModel.name = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != undefined) {
              this.accountNomineeModel.aadharNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != undefined) {
              this.accountNomineeModel.mobileNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != undefined) {
              this.accountNomineeModel.nomineeEmail = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId;
            }
            if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != undefined) {
              this.accountNomineeModel.nomineeMultiPartList = this.fileUploadService.getFile(this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath , 
                ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath );
            }
            this.accountNomineeModel.nomineeType = 2;
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
  getGaurdainFromMemberModule(admissionNumber : any){
    this.dailyDepositsAccountsService.getNomineeFromMembeshipByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetailsModel = this.responseModel.data[0];
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList != undefined &&
              this.responseModel.data[0].memberShipGuadianDetailsDTOList[0] != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0] != undefined) {
              this.accountGuardianModel = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0];
            }
            if (this.responseModel.data[0].relationshipTypeId != null && this.responseModel.data[0].relationshipTypeId != undefined) {
              this.accountGuardianModel.relationType = this.responseModel.data[0].relationshipTypeId;
              this.getAllRelationTypes();
            }
            if (this.responseModel.data[0].relationshipTypeName != null && this.responseModel.data[0].relationshipTypeName != undefined) {
              this.accountGuardianModel.relationTypeName = this.responseModel.data[0].relationshipTypeName;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianName != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianName != undefined) {
              this.accountGuardianModel.name = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianName;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianAadharNumber != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianAadharNumber != undefined) {
              this.accountGuardianModel.aadharNumber = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianAadharNumber;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianMobileNumber != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianMobileNumber != undefined) {
              this.accountGuardianModel.mobileNumber = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianMobileNumber;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianEmailId != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianEmailId != undefined) {
              this.accountGuardianModel.email = this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].guardianEmailId;
            }
            if (this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath != null && this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath != undefined) {
              this.accountGuardianModel.guardainMultipartList = this.fileUploadService.getFile(this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath , 
                ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].memberShipGuadianDetailsDTOList[0].uploadFilePath );
            }
            this.accountGuardianModel.gaurdianType = 2;
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
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.accountNomineeModel != null && this.accountNomineeModel != undefined && this.isEdit && this.accountNomineeModel.filesDTOList == null || this.accountNomineeModel.filesDTOList == undefined){
        this.accountNomineeModel.filesDTOList = [];
    }
    if(this.isEdit && this.accountGuardianModel != null && this.accountGuardianModel != undefined && this.accountGuardianModel.filesDTOList == null || this.accountGuardianModel.filesDTOList == undefined){
      this.accountGuardianModel.filesDTOList = [];
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
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
          this.accountNomineeModel.filesDTOList.push(files); 
          this.accountNomineeModel.identityProofDocPath = null;
          this.accountNomineeModel.filesDTOList[this.accountNomineeModel.filesDTOList.length-1].fileName = "NOMINEE" + this.accId + "_" + timeStamp + "_" + file.name;
          this.accountNomineeModel.identityProofDocPath = "NOMINEE" + this.accId + "_" +timeStamp+"_"+ file.name; 
        }
        if (filePathName === "Guardain") {
          this.accountGuardianModel.filesDTOList.push(files); 
          this.accountGuardianModel.identityProofDocPath = null;
          this.accountGuardianModel.filesDTOList[this.accountGuardianModel.filesDTOList.length-1].fileName = "GUARDAIN" + "_" + timeStamp + "_" + file.name;
          this.accountGuardianModel.identityProofDocPath = "GUARDAIN" + "_" + timeStamp + "_" + file.name; 
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
    if (this.age <= 18) {
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
      this.updateData();
    }
  }

  /**
   * @implements getNomineeHistory
   * @param accountNumber 
   */
  getNomineeHistoryByRdAccountNumber(accountNumber: any) {
    this.dailyDepositsAccountsService.getNomineeByAccountNumber(accountNumber).subscribe((response: any) => {
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
   * @implements nominee form validation
   */
  nomineeFormValidation() {
    this.nomineeForm.get('relationName')?.disable();
    this.nomineeForm.get('nomineeName')?.disable();
    this.nomineeForm.get('aadhaar')?.disable();
    this.nomineeForm.get('mobileNumber')?.disable();
    this.nomineeForm.get('email')?.disable();
    this.nomineeForm.get('fileUpload')?.disable();
    this.updateData();
  }
  /**
   * @implements nominee required valdation
   */
  nomineeValidatorsRequired(){
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
    this.updateData();
  }

  /**
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
    this.updateData();
  }

  /**
   * @implements onFileremove from file value
   * @param fileName 
   */
  fileRemoeEvent(fileName :any){
    if(fileName == "Nominee"){
      if(this.accountNomineeModel.filesDTOList != null && this.accountNomineeModel.filesDTOList != undefined && this.accountNomineeModel.filesDTOList.length > 0){
        let removeFileIndex = this.accountNomineeModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.accountNomineeModel.identityProofDocPath);
        this.accountNomineeModel.filesDTOList[removeFileIndex] = null;
        this.accountNomineeModel.identityProofDocPath = null;
      }
    }
    if(fileName == "Guardain"){
      if(this.accountGuardianModel.filesDTOList != null && this.accountGuardianModel.filesDTOList != undefined && this.accountGuardianModel.filesDTOList.length > 0){
        let removeFileIndex = this.accountGuardianModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.accountGuardianModel.identityProofDocPath);
        this.accountGuardianModel.filesDTOList[removeFileIndex] = null;
        this.accountGuardianModel.identityProofDocPath = null;
      }
    }
  }
/**
 * @implements onChange new Nominee
 * @param flag 
 */
  newNomineeType(flag:boolean){
    this.newNominee = true;
      this.noNominee = false;
      //onchange on update
      if(flag){
        let nomineeId = null;
        if(this.accountNomineeModel != null && this.accountNomineeModel != undefined && this.accountNomineeModel.id  != null && this.accountNomineeModel.id  != undefined){
          nomineeId = this.accountNomineeModel.id ;
        }
        this.accountNomineeModel = new AccountNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.accountNomineeModel.id = nomineeId;
        }
      }
      this.accountNomineeModel.nomineeType = 1;
      this.nomineeValidatorsRequired();
  }

  /**
   * @implements sameAsmemberNominee onChange
   * @param flag 
   */
  samAsMemberNomineeType(flag:boolean){
    this.newNominee = true;
    this.noNominee = false;
    //onchange on update
    if(flag){
      let nomineeId = null;
      if(this.accountNomineeModel != null && this.accountNomineeModel != undefined && this.accountNomineeModel.id  != null && this.accountNomineeModel.id  != undefined){
        nomineeId = this.accountNomineeModel.id ;
      }
      this.accountNomineeModel = new AccountNominee();
      if(nomineeId != null && nomineeId != undefined){
        this.accountNomineeModel.id = nomineeId;
      }
      if(this.admissionNumber != null && this.admissionNumber != undefined){
        this.getMemberNomineDetailsByAdmissionNumber(this.admissionNumber);
      }
    }
    this.accountNomineeModel.nomineeType = 2;
    this.nomineeFormValidation();
  }

  /**
   * @implements noNomineeType OnChange
   * @param flag 
   */
  noNomineeType(flag : boolean){
    this.noNominee = true;
    this.newNominee = false;
    this.sameAsMembershipNominee = false;
    if(flag){
      let nomineeId = null;//onchange on update

      let signedCopyPath = null;
      if(this.accountNomineeModel != null && this.accountNomineeModel != undefined){
        if(this.accountNomineeModel.id  != null && this.accountNomineeModel.id  != undefined){
          nomineeId = this.accountNomineeModel.id ;
        }
        if(this.accountNomineeModel.identityProofDocPath  != null && this.accountNomineeModel.identityProofDocPath  != undefined){
          signedCopyPath = this.accountNomineeModel.identityProofDocPath ;
          this.accountNomineeModel.identityProofDocPath = this.fileUploadService.getFile(this.accountNomineeModel.identityProofDocPath , ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountNomineeModel.identityProofDocPath);
        }
      }
      this.accountNomineeModel = new AccountNominee();
      if(nomineeId != null && nomineeId != undefined){
        this.accountNomineeModel.id = nomineeId;
      }
      this.accountNomineeModel.nomineeType = 3;
      if(signedCopyPath != null && signedCopyPath != undefined){
      this.accountNomineeModel.signedCopyPath = signedCopyPath;
      }
    }
    this.nomineeValidatorsFormNotRequired();
    // this.newNominee = false;
  }

  /**
   * @implements new guardain Onchage
   * @param flag 
   */
  newGuardainType(flag : boolean){
    this.courtAppointedGuardain = false;
      this.sameAsMemberGuardain = true;
      this.noGuardain  = false;
      //onchange on update
      if(flag){
        let guardainId = null;
        if(this.accountGuardianModel != null && this.accountGuardianModel != undefined && this.accountGuardianModel.id  != null && this.accountGuardianModel.id  != undefined){
          guardainId = this.accountGuardianModel.id ;
        }
        this.accountGuardianModel = new AccountGuardian();
        this.accountGuardianModel.id = guardainId;
      }
      this.accountGuardianModel.gaurdianType = 1;
      this.guardainFormValidation();
  }
/**
 * @implements sameAsMember gurdain Onchage
 * @param flag 
 */
  sameAsMemberGuardianType(flag:boolean){
    this.sameAsMemberGuardain = true;
    this.courtAppointedGuardain = false;
    this.noGuardain  = false;
    //onchange on update
    if(flag){
      let guardainId = null;
      if(this.accountGuardianModel != null && this.accountGuardianModel != undefined && this.accountGuardianModel.id  != null && this.accountGuardianModel.id  != undefined){
        guardainId = this.accountGuardianModel.id ;
      }
      this.accountGuardianModel = new AccountGuardian();
      this.accountGuardianModel.id = guardainId;
      this.getGaurdainFromMemberModule(this.admissionNumber);//get from member module
    }
    this.accountGuardianModel.gaurdianType = 2;
    this.guardaindisable();
  }

  noGuardainaType(flag:boolean){
    this.courtAppointedGuardain = true;
    this.sameAsMemberGuardain = false;
    this.noGuardain  = true;
    //onchange on update
    let guardainId = null;
    if(flag){
      let uploadFilePath = null;
      if(this.accountGuardianModel != null && this.accountGuardianModel != undefined){
        if(this.accountGuardianModel.id  != null && this.accountGuardianModel.id  != undefined){
          guardainId = this.accountGuardianModel.id ;
        }
       
        if(this.accountGuardianModel.identityProofDocPath  != null && this.accountGuardianModel.identityProofDocPath  != undefined){
          uploadFilePath = this.accountGuardianModel.identityProofDocPath ;
          this.accountGuardianModel.guardainMultipartList =this.fileUploadService.getFile(this.accountGuardianModel.identityProofDocPath , ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountGuardianModel.identityProofDocPath);
        }
      } 
      this.accountGuardianModel = new AccountGuardian();
      if(guardainId != null && guardainId != undefined){
        this.accountGuardianModel.id = guardainId;
      }
     
    }
    this.accountGuardianModel.gaurdianType = 3;
    this.guardaindisable();
  }
}
