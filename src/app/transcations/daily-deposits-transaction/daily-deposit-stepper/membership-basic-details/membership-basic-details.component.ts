import { Component } from '@angular/core';
import { Accounts } from '../../shared/accounts.model';
import { AccountKYC } from '../../shared/account-kyc.model';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { AccountCommunication } from '../../shared/account-communication.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-membership-basic-details',
  templateUrl: './membership-basic-details.component.html',
  styleUrls: ['./membership-basic-details.component.css']
})
export class MembershipBasicDetailsComponent {
  msgs: any[] = [];
  kycForm: any;
  kycModelList: any[] = [];
  pacsId: any;
  branchId: any;
  orgnizationSetting: any;
  documentsData: any[] = [];
  uploadFlag: boolean = true;
  accId: any;
  admissionNumber: any;
  disableMemberType: boolean = false;
  isEdit: boolean = false;
  showForm: Boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  responseModel!: Responsemodel;
  memberTypeName: any;
  memberTypeId: any;
  isDisableFlag: boolean = false;
  documentNameList: any[] = [];
  editIndex: any;
  isFileUploaded: boolean = false;
  uploadFileData: any;
  accountsModel: Accounts = new Accounts();
  kycModel: AccountKYC = new AccountKYC();
  membershipBasicRequiredDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  accountCommunication: AccountCommunication = new AccountCommunication();
  editButtonDisable: boolean = false;
  buttonDisabled: boolean = false;
  kycDuplicate: boolean = false;
  multipleFilesList: any[] = [];
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  kycPhotoCopyZoom: boolean = false;
  displayDialog: boolean  = false;
  deleteId: any;
  saveButtonDisable: boolean= false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService
  ) {
    this.kycForm = this.formBuilder.group({
      'docNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'requiredDocTypeName': new FormControl('', Validators.required),
      'nameAsPerDocument': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'fileUpload': new FormControl('')
    });
  }

  ngOnInit(): void {
    this.kycModelList = [];
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo']) {
        this.commonComponent.startSpinner();

        if (params['admissionNo'] != undefined) {
          this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNo']);
        }

        if (this.admissionNumber != null && this.admissionNumber != undefined) {
          this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
          this.getGroupDetailsByAdmissionNumber(this.admissionNumber);
          this.getInstitutionDetailsByAdmissionNumber(this.admissionNumber);
        }
        else {
          if (params['id'] != undefined) {
            this.accId = Number(this.encryptDecryptService.decrypt(params['id']));
            this.getRdAccountById(this.accId);
          }
        }
        this.disableMemberType = true;
        this.isEdit = true;
      }
      else {
        let val = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
        this.updateData();
        if (!this.showForm) {
          this.individualFlag = true;
        }
      }
    });
    this.kycForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.kycForm.valid) {
        this.save();
      }
    });
    this.getAllKycTypes();
  }

  getRdAccountById(id: any) {
    this.dailyDepositsAccountsService.getAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admissionNumber = this.responseModel.data[0].adminssionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;;
              this.accountsModel = this.responseModel.data[0];
              if (this.accountsModel.accountKycList != null && this.accountsModel.accountKycList != undefined && this.accountsModel.accountKycList.length > 0) {
                this.kycModelList = this.accountsModel.accountKycList;
                if(this.kycModel.kycFilePath != null && this.kycModel.kycFilePath != undefined){
                  this.kycModel.multipartFileList = this.fileUploadService.getFile(this.kycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.kycModel.kycFilePath);
                  this.saveButtonDisable = true;
                }
                else{
                  this.saveButtonDisable = false;
                }
                for (let kyc of this.kycModelList) {
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  if (kyc.multipartFileList != null && kyc.multipartFileList != undefined) {
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  }
                }
              }
              this.updateData();
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

  updateData() {
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      this.kycDuplicate = this.kycModelDuplicateCheck(this.kycModelList);
      if (this.kycDuplicate) {
        this.isDisableFlag = true;
      }
      else {
        this.isDisableFlag = false;
      }
    } else {
      this.isDisableFlag = true;
    }
    this.dailyDepositsAccountsService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.accountsModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  save() {
    this.updateData();
  }


  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    this.kycModelList = [];
    this.dailyDepositsAccountsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.accountsModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.accountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          if (this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != null && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != undefined && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
            this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              this.kycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            }
            this.accountsModel.accountKycList = this.memberGroupDetailsModel.groupKycList;
          }
          if (this.membershipInstitutionDetailsModel.memberTypeId == null || this.membershipInstitutionDetailsModel.memberTypeId == undefined) {
            this.membershipInstitutionDetailsModel.memberTypeId = applicationConstants.INSTITUTION_MEMBER_TYPE_ID;
          }
          this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
          this.accountsModel.memberType = this.membershipInstitutionDetailsModel.memberTypeId;
          this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
          this.accountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          this.updateData();
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

  getGroupDetailsByAdmissionNumber(admissionNUmber: any) {
    this.kycModelList = [];
    this.dailyDepositsAccountsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
          this.memberTypeName = this.responseModel.data[0].memberTypeName;
          if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
            this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
            this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.memberTypeId == null || this.memberGroupDetailsModel.memberTypeId == undefined) {
            this.memberGroupDetailsModel.memberTypeId = applicationConstants.GROUP_MEMBER_TYPE_ID;
          }
          if (this.memberGroupDetailsModel.groupKycList != null && this.memberGroupDetailsModel.groupKycList != undefined) {
            this.kycModelList = this.memberGroupDetailsModel.groupKycList;
            for (let kyc of this.kycModelList) {
              this.kycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            }
            this.accountsModel.accountKycList = this.memberGroupDetailsModel.groupKycList;
          }
          this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.memberGroupDetailsModel.isNewMember = this.showForm;
          this.accountsModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
          this.accountsModel.memberType = this.memberGroupDetailsModel.memberTypeId;
          this.accountsModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
          this.updateData();
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


  //member module data by member admission Number
  getMemberDetailsByAdmissionNumber(admissionNumber: any) {
    this.kycModelList = [];
    this.dailyDepositsAccountsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
          this.membershipBasicRequiredDetailsModel.accountCommunicationDTO = this.responseModel.data[0].accountCommunicationDTO;

          if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
            this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.admissionNumber != null && this.membershipBasicRequiredDetailsModel.admissionNumber != undefined) {
            this.admissionNumber = this.membershipBasicRequiredDetailsModel.admissionNumber;
          }
          if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
            this.membershipBasicRequiredDetailsModel.admissionDate = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.accountCommunicationDTO != null && this.membershipBasicRequiredDetailsModel.accountCommunicationDTO != undefined) {
            this.accountCommunication = this.membershipBasicRequiredDetailsModel.accountCommunicationDTO;
            this.accountsModel.accountCommunicationDTO = this.membershipBasicRequiredDetailsModel.accountCommunicationDTO;
          }
          if (this.membershipBasicRequiredDetailsModel.memberTypeId == null || this.membershipBasicRequiredDetailsModel.memberTypeId == undefined) {
            this.membershipBasicRequiredDetailsModel.memberTypeId = applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID;
          }
          if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
          }
          if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
          }
          if (this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList != null && this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList != undefined && this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList;
            this.kycModelList = this.kycModelList.filter(obj => null != obj && null != obj.status && obj.status === applicationConstants.ACTIVE).map((kyc: any) => {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              return kyc;
            });
            this.accountsModel.accountKycList = this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList;
          }
          this.accountsModel.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
          this.membershipBasicRequiredDetailsModel.isNewMember = this.showForm;
          this.accountsModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetailsModel;
          this.updateData();
          // this.savingCommuncationDetailsSet(this.membershipBasicRequiredDetailsModel. accountCommunicationDTO[0]);
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

  getAllKycTypes() {
    this.dailyDepositsAccountsService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.kycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj)
          this.kycModel.kycDocumentTypeName = filteredObj.label;
        
      }
    });
  }

  OnChangeMemberType(documentTypeId: any) {
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == documentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.kycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      this.kycDuplicate = this.kycModelDuplicateCheck(this.kycModelList);
    }
    this.updateData();
  }
  imageUploader(event: any, fileUpload: FileUpload) {
    this.saveButtonDisable = true;
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.kycModel.filesDTOList = [];
    this.kycModel.kycFilePath = null;
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

        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.kycModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.kycModel.filesDTOList[0].fileName = "DAILY_DEPOSITS_KYC_" + this.accId + "_" + timeStamp + "_" + file.name;
        this.kycModel.kycFilePath = "DAILY_DEPOSITS_KYC_" + this.accId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as kycFilePath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
  fileRemoveEvent() {
    this.kycModel.multipartFileList = [];
    if (this.kycModel.filesDTOList != null && this.kycModel.filesDTOList != undefined) {
      this.kycModel.kycFilePath = null;
      this.kycModel.filesDTOList = null;
    }
  }

  
  delete(rowData: any) {
    this.dailyDepositsAccountsService.deleteRdAccountKyc(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
        this.getAllKycsDetailsRdKycDetails(this.admissionNumber);
      }
    });
  }


  getAllKycsDetailsRdKycDetails(admissionNumber: any) {
    this.kycModelList = [];
    this.dailyDepositsAccountsService.getKycDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.kycModelList = this.responseModel.data;

            if (this.kycModel.kycFilePath != null && this.kycModel.kycFilePath != undefined) {
              this.kycModel.multipartFileList = this.fileUploadService.getFile(this.kycModel.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.kycModel.kycFilePath);

            }
            if (this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                let multipleFilesList = [];
                let file = new FileUploadModel();
                file.imageValue = ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath;
                let objects = kyc.kycFilePath.split('.');
                file.fileType = objects[objects.length - 1];
                let name = kyc.kycFilePath.replace(/ /g, "_");
                file.fileName = name
                multipleFilesList.push(file);
                kyc.multipartFileList = multipleFilesList;
              }
            }
          }
        }
      }
      // this.getSbAccountDetailsById(accId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }


  cancelKyc() {
    this.kycModelList = [];
    // this.addKycButton = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.admissionNumber);
  }

  cancel() {
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.updateData();
  }

  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    if(modelData.kycFilePath != null){
      this.saveButtonDisable=true;
    }else{
      this.saveButtonDisable=false;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.getAllKycTypes();
    this.addOrEditKycTempList(modelData);
    this.updateData();
  }

  
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.updateData();
  }

  editsave(row: any) {
    this.kycModel.accId = this.accId;
    this.kycModel.admissionNumber = this.admissionNumber;
    // this.kycModel.memberTypeName = this.memberTypeName;
    this.kycModel.memberType = this.memberTypeId;
    // this.kycModel.memberId = this.m;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.kycModel.kycDocumentTypeId != null && data.value == this.kycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.kycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.dailyDepositsAccountsService.updateAccountKyc(this.kycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      }
      else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      // this.addKycButton = false;
      this.buttonDisabled = false;
      if (this.accId != null && this.accId != undefined) {
        this.getRdAccountById(this.accId);

      }
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
    // }

  }


  getKycById(id: any) {
    this.kycModelList = [];
    this.dailyDepositsAccountsService.getKycDetailsByAccountId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.kycModel = this.responseModel.data[0];
              if (this.kycModel.kycFilePath != undefined) {
                for (let kyc of this.kycModelList) {
                  this.kycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                }
              }
            }
          }
        }
      }
    });
  }

  addOrEditKycTempList(rowData: any) {
    const kyc = this.kycModelList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId);
    this.kycModel = kyc;
  }

  kycModelDuplicateCheck(kycModelList: any) {
    let duplicate = false;
    const uniqueIds = new Set<number>();
    const duplicateIds = new Set<number>();
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      for (let item of this.kycModelList) {
        if (item != null && item != undefined && item.kycDocumentTypeId != null && item.kycDocumentTypeId != undefined) {
          if (uniqueIds.has(item.kycDocumentTypeId)) {
            duplicateIds.add(item.kycDocumentTypeId);
          } else {
            uniqueIds.add(item.kycDocumentTypeId);
          }
        }
        if (duplicateIds.size > 0) {
          duplicate = true;
          this.kycForm.reset();
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
        }
      }
    }
    return duplicate;
  }
  onClickkycPhotoCopy(){
    this.kycPhotoCopyZoom = true;
  }
  kycclosePhoto(){
    this.kycPhotoCopyZoom = false;
  }
  kycclosePhotoCopy() {
    this.kycPhotoCopyZoom = false;
  }
  deletDilogBox(rowData:any){
    this.displayDialog = true;
    if(rowData.id != null && rowData.id != undefined){
      this.deleteId = rowData.id;
    }
  }
  cancelForDialogBox() {
    this.displayDialog = false;
  }
  submitDelete(){
    if(this.deleteId != null && this.deleteId != undefined){
      this.delete(this.deleteId);
    }
    
    this.displayDialog = false;
  }
  
}
