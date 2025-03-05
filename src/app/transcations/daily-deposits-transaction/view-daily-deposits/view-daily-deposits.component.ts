import { Component, ElementRef, ViewChild } from '@angular/core';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from '../../term-deposits-transcation/shared/membership-basic-detail.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Accounts } from '../shared/accounts.model';
import { AccountRequriedDocuments } from '../shared/account-requried-documents.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { AccountNominee } from '../shared/account-nominee.model';
import { AccountGuardian } from '../shared/account-guardian.model';
import { AccountKYC } from '../shared/account-kyc.model';
import { AccountCommunication } from '../shared/account-communication.model';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { DailyDepositTransactionConstants } from '../daily-deposits-transaction-constants';
import { CommonStatusData, MemberShipTypesData } from '../../common-status-data.json';
import { DailyDepositsAccountsService } from '../shared/daily-deposits-accounts.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';

@Component({
  selector: 'app-view-daily-deposits',
  templateUrl: './view-daily-deposits.component.html',
  styleUrls: ['./view-daily-deposits.component.css']
})
export class ViewDailyDepositsComponent {
  responseModel!: Responsemodel;
  admissionNumber: any;
  msgs: any[] = [];
  id: any;
  accId: any;
  isView: any;
  kycGridList: any[] = [];
  orgnizationSetting: any;
  veiwFalg: boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  addressOne: any;
  addressTwo: any;
  kycDetailsColumns: any[] = [];
  serviceTypesColumns: any[] = [];
  serviceTypesGridList: any[] = [];
  nomineeMemberFullName: any;
  editOption: boolean = false;
  memberTypeName: any;
  preveiwFalg: any;
  flag: boolean = false;
  gardianFullName: any;
  promoterDetails: any;
  institutionPromoter: any;
  memberBasicDetailsFalg: boolean = false;
  memberGroupFlag: boolean = false;
  memberIntitutionFlag: boolean = false;
  memberPromoterDetails: any
  groupPromoterList: any[] = [];
  isNewMember: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  requiredDocumentsList: any[] = [];
  jointHolderDetailsList: any;
  jointHoldersFlag: boolean = false;
  groupPrmotersList: any[] = [];
  institionPromotersList: any[] = [];
  columns: any[] = [];
  groupPrmoters: any[] = [];
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  memberPhotoCopyZoom: boolean = false;
  membreIndividualFlag: boolean = false;
  isKycApproved: any;
  guardainFormEnable: boolean = false;
  isShowSubmit: boolean = applicationConstants.FALSE;
  amountblock: any[] = [];
  age: any;
  memberTypeList: any[] = [];
  membershipBasicDetail: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  accountCommunicationModel: AccountCommunication = new AccountCommunication();
  accountsModel: Accounts = new Accounts();
  requiredDocumentDetails: AccountRequriedDocuments = new AccountRequriedDocuments();
  kycModel: AccountKYC = new AccountKYC();
  accountNomineeModel: AccountNominee = new AccountNominee();
  accountGuardianModel: AccountGuardian = new AccountGuardian();
  accountTypeName: any;
  accountNumber: any;
  isDisableSubmit: boolean = false;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  isEdit: any;
  uploadFileData: any;
  viewButton: boolean = false;
  editFlag: boolean = false;
  roleName: any;
  isMaximized: boolean = false;
  docPhotoCopyZoom:boolean = false;
  nomineePhotoCopyZoom:boolean = false;
  guardianPhotoCopyZoom:boolean = false;
  submitForApprovalMessage: any;
  submitForApprovalValidation: boolean = true;
  fileSizeMsgForImage: any;
  requiredDocumentsEnable: boolean = false;
  kycPhotoCopyZoom: boolean = false;
  isKycEmpty: boolean = false;

  constructor(private router: Router,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private encryptDecryptService: EncryptDecryptService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService: FileUploadService,
    private dailyDepositsAccountsService: DailyDepositsAccountsService
  ) {
    this.amountblock = [
      { field: 'Service Type', header: 'SERVICE TYPE' },
      { field: 'Service Charges', header: 'SERVICE CHARGES' },
      { field: 'Requested Date', header: 'REQUESTED DATE' },
    ];
    this.kycDetailsColumns = [
      { field: 'effStartDate', header: 'Approved Date' },
      { field: 'statusName', header: 'Status Name' },
      { field: 'docPath', header: 'Documents' },
    ];
    this.serviceTypesColumns = [
      { field: 'serviceTypeName', header: 'ERP.SERVICE_TYPE' },
      { field: 'isChargeApplicableName', header: 'ERP.IS_CHARGE_APPLICAPABLE' },
      { field: 'chargesCollectionFrequencyName', header: 'ERP.FREQUENCY_TYPE' },
      { field: 'serviceCharges', header: 'ERP.SERVICE_CHARGES' },
      { field: 'requestDocPath', header: 'ERP.REQUESTED_DOC_PATH' },
      { field: 'statusName', header: 'ERP.STATUS' },

    ];
    this.columns = [
      { field: 'surname', header: 'SURNAME' },
      { field: 'name', header: 'NAME' },
      { field: 'operatorTypeName', header: 'operation Type Name' },
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
    this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined && params['editbutton'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        // let type = this.encryptDecryptService.decrypt(params['memType']);
        let idEdit = this.encryptDecryptService.decrypt(params['editbutton']);
        this.accId = Number(id);
        if (idEdit == "1")
          this.preveiwFalg = true
        else {
          this.preveiwFalg = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
            this.viewButton = false;
            this.editFlag = true;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
        this.getAccountsById();
      }
    })
  }
  backbutton() {
    if (this.roleName == "Manager") {
      // this.router.navigate([approvaltransactionsconstant.RECCURING_DEPOSIT_APPROVAL_TRANSACTION_DETAILS]);
    } else {
      this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT]);
    }
  }

  submit() {
    if (this.accountsModel.depositDate != null && this.accountsModel.depositDate != undefined) {
      this.accountsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.accountsModel.depositDate));
    }
    this.accountsModel.status = 5;
    this.accountsModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
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
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT]);
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
  getAccountsById() {
    this.dailyDepositsAccountsService.getAccounts(this.accId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.accountsModel = this.responseModel.data[0];
          if (this.accountsModel.depositDate != null && this.accountsModel.depositDate != undefined) {
            this.accountsModel.depositDate = this.datePipe.transform(this.accountsModel.depositDate, this.orgnizationSetting.datePipe);
          }
          if (this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined) {
            this.memberTypeName = this.accountsModel.memberTypeName;
          }
          if (this.accountsModel.signedCopyPath != null && this.accountsModel.signedCopyPath != undefined) {
            this.accountsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.accountsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountsModel.signedCopyPath);
            this.isDisableSubmit = false;
          }
          else {
            this.isDisableSubmit = true;
          }

          if (this.accountsModel != null && this.accountsModel != undefined) {
            if (this.accountsModel.memberShipBasicDetailsDTO != undefined && this.accountsModel.memberShipBasicDetailsDTO != null) {
              this.membershipBasicDetail = this.accountsModel.memberShipBasicDetailsDTO;
              if (this.membershipBasicDetail.isNewMember != null && this.membershipBasicDetail.isNewMember != undefined) {
                this.isNewMember = this.membershipBasicDetail.isNewMember;
              }
              if (this.membershipBasicDetail.dob != null && this.membershipBasicDetail.dob != undefined) {
                this.membershipBasicDetail.dobVal = this.datePipe.transform(this.membershipBasicDetail.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicDetail.admissionDate != null && this.membershipBasicDetail.admissionDate != undefined) {
                this.membershipBasicDetail.admissionDateVal = this.datePipe.transform(this.membershipBasicDetail.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicDetail.photoCopyPath != null && this.membershipBasicDetail.photoCopyPath != undefined) {
                this.membershipBasicDetail.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetail.photoCopyPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.photoCopyPath);
              }
              else {
                this.photoCopyFlag = false;
              }
              if (this.membershipBasicDetail.signatureCopyPath != null && this.membershipBasicDetail.signatureCopyPath != undefined) {
                this.membershipBasicDetail.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetail.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.signatureCopyPath);
              }
              else {
                this.signatureCopyFlag = false;
              }
              if (this.membershipBasicDetail.isStaff != null && this.membershipBasicDetail.isStaff != undefined && this.membershipBasicDetail.isStaff) {
                this.membershipBasicDetail.isStaff = applicationConstants.TRUE;
              }
              else {
                this.membershipBasicDetail.isStaff = applicationConstants.FALSE;
              }
              if (this.membershipBasicDetail.isKycApproved != null && this.membershipBasicDetail.isKycApproved != undefined && this.membershipBasicDetail.isKycApproved) {
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              }
              else {
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
              if (this.responseModel.data[0].memberShipBasicDetailsDTO.age != null && this.responseModel.data[0].memberShipBasicDetailsDTO.age != undefined) {
                this.age = this.responseModel.data[0].memberShipBasicDetailsDTO.age;
                if (this.age < 18) {
                  this.guardainFormEnable = true;
                }
              }
            }
            if (this.accountsModel.memberShipGroupDetailsDTO != undefined && this.accountsModel.memberShipGroupDetailsDTO != null) {
              this.memberGroupDetailsModel = this.accountsModel.memberShipGroupDetailsDTO;
              if (this.memberGroupDetailsModel.isNewMember != null && this.memberGroupDetailsModel.isNewMember != undefined) {
                this.isNewMember = this.memberGroupDetailsModel.isNewMember;
              }
              if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
              }
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
          }
          if (this.accountsModel.memInstitutionDTO != undefined && this.accountsModel.memInstitutionDTO != null) {
            this.membershipInstitutionDetailsModel = this.accountsModel.memInstitutionDTO;
            if (this.membershipInstitutionDetailsModel.isNewMember != null && this.membershipInstitutionDetailsModel.isNewMember != undefined) {
              this.isNewMember = this.membershipInstitutionDetailsModel.isNewMember;
            }
            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDate = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
              this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
            }
            if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined) {
              this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
            }
            else {
              this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
            }
          }
          if (this.accountsModel.accountCommunicationDTOList != null && this.accountsModel.accountCommunicationDTOList != undefined &&
            this.accountsModel.accountCommunicationDTOList[0] != null && this.accountsModel.accountCommunicationDTOList[0] != undefined)
            this.accountCommunicationModel = this.accountsModel.accountCommunicationDTOList[0];

          if (this.accountsModel.accountKycList != null && this.accountsModel.accountKycList != undefined) {
            this.kycGridList = this.accountsModel.accountKycList;
            for (let kyc of this.kycGridList) {
              if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                  if (this.accountsModel.isNewMember)
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  else {
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                  }
                }
              }
            }
          }
          else {
            this.isKycEmpty = true;
          }

          if (this.accountsModel.accountNomineeList != null && this.accountsModel.accountNomineeList != undefined) {
            this.accountNomineeModel = this.accountsModel.accountNomineeList[0];
            if (this.accountNomineeModel.name != null && this.accountNomineeModel.name != undefined && this.accountNomineeModel.surName != null && this.accountNomineeModel.surName != undefined)
              this.nomineeMemberFullName = this.accountNomineeModel.name + this.accountNomineeModel.surName;
            if (this.accountNomineeModel.signedCopyPath != null && this.accountNomineeModel.signedCopyPath != undefined){
              if(this.accountNomineeModel.nomineeType == 2){
                this.accountNomineeModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.accountNomineeModel.signedCopyPath , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountNomineeModel.signedCopyPath);
              }
              else {
                this.accountNomineeModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.accountNomineeModel.signedCopyPath , ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountNomineeModel.signedCopyPath);
              }
              if(this.accountNomineeModel.dateOfBirth != null && this.accountNomineeModel.dateOfBirth != undefined)
               this.accountNomineeModel.dateOfBirthVal = this.datePipe.transform(this.accountNomineeModel.dateOfBirth, this.orgnizationSetting.datePipe);
            }
          }

          if (this.accountsModel.termAccountGaurdianList != null && this.accountsModel.termAccountGaurdianList != undefined) {
            this.accountGuardianModel = this.accountsModel.termAccountGaurdianList[0];
            this.gardianFullName = this.accountGuardianModel.guardianName + this.accountGuardianModel.surName;
            if (this.accountGuardianModel.identityProofDocPath != null && this.accountGuardianModel.identityProofDocPath != undefined) {
              this.accountGuardianModel.guardainMultipartList = this.fileUploadService.getFile(this.accountGuardianModel.identityProofDocPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountGuardianModel.identityProofDocPath);
            }
          }
          if (this.accountsModel.accountTypeName != null && this.accountsModel.accountTypeName != undefined && this.accountsModel.accountTypeName === "Joint") {
            this.jointHoldersFlag = true;
          }
          if (this.accountsModel.tdJointAccHolderDetailsDTOList != null && this.accountsModel.tdJointAccHolderDetailsDTOList != undefined && this.accountsModel.tdJointAccHolderDetailsDTOList.length > 0) {
            this.jointHoldersFlag = true;
            this.jointHolderDetailsList = this.accountsModel.tdJointAccHolderDetailsDTOList;
          }
          
          if (this.accountsModel.requiredDocumentDetailsDTOList != null && this.accountsModel.requiredDocumentDetailsDTOList != undefined && this.accountsModel.requiredDocumentDetailsDTOList.length > 0) {
            this.requiredDocumentsList = this.accountsModel.requiredDocumentDetailsDTOList;
            this.requiredDocumentsEnable = true;
            for (let document of this.requiredDocumentsList) {
              if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                  document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
              }
            }
          }
          // if(this.accountsModel.requiredDocumentsConfigDTOList != null && this.accountsModel.requiredDocumentsConfigDTOList != undefined){
          //   this.requiredDocumentsEnable = true;
          // }
        }
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    
    }, (error: any) => {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });

  }

  applicationEdit(rowData: any) {
    if (rowData.accountTypeName == "Joint") {
      this.flag = true;
    }
    else {
      this.flag = false;
    }
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_PRODUCT_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  communicationEdit(rowData: any) {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  kycEdit(rowData: any) {
    if (this.isNewMember) {
      this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
    else {
      this.router.navigate([DailyDepositTransactionConstants.MEMBERSHIP_BASIC_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
  }
  nomineeEdit(rowData: any) {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), preview: this.encryptDecryptService.encrypt(true) } });
  }
  editMembership(rowData: any) {
    this.router.navigate([DailyDepositTransactionConstants.NEW_MEMBER], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  editJointHolder(rowData: any) {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_JOINTHOLDER_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  editRequiredDocuments(rowData: any) {
    this.router.navigate([DailyDepositTransactionConstants.DAILY_DEPOSIT_REQURIED_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  onClick() {
    this.institutionPromoterFlag = true;
  }
  onClickOfGroupPromotes() {
    this.groupPromotersPopUpFlag = true;
  }
  close() {
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.membreIndividualFlag = false;
  }
  
  closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }
  
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  closePhoto() {
    this.memberPhotoCopyZoom = false;
  }

  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.TRUE;
    this.fileSizeMsgForImage = null;
    let fileSizeFalg = false;
    this.multipleFilesList = [];
    this.accountsModel.filesDTOList = [];
    this.accountsModel.multipartFileList = [];
    this.accountsModel.applicationSignedForm = null;
    let files: FileUploadModel = new FileUploadModel();
    if (event.files[0].size/1024/1024 > 5) {
      this.fileSizeMsgForImage= "file is bigger than 5MB";
      fileSizeFalg = true;
     }
     if(!fileSizeFalg){
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
            this.accountsModel.filesDTOList.push(files); // Add to filesDTOList array
          }
          let timeStamp = this.commonComponent.getTimeStamp();
          this.accountsModel.filesDTOList[0].fileName = "Daily_deposits_signed_copy" + this.accId + "_" +timeStamp+ "_"+ file.name ;
          this.accountsModel.applicationSignedForm = "Daily_deposits_signed_copy" + this.accId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
          let index1 = event.files.findIndex((x: any) => x === file);
          fileUpload.remove(event, index1);
          fileUpload.clear();
        }
        reader.readAsDataURL(file);
      }
     }
  }

  
  fileRemoveEvent() {
    if (this.accountsModel.filesDTOList != null && this.accountsModel.filesDTOList != undefined && this.accountsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.accountsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.accountsModel.signedCopyPath);
      this.accountsModel.filesDTOList.splice(removeFileIndex, 1);
      this.accountsModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }
  pdfDownload() {
    this.commonComponent.startSpinner();
    this.dailyDepositsAccountsService.downloadPreviewPDf(this.accId).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "Daily_Deposit_filled_Document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'Daily Deposit file downloaded successfully' });
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: "error", detail: 'Unable to download filled Daily deposit' });
    })
     
  }

  memberTypeCheck(memberTypeName :any){
    if(memberTypeName == MemberShipTypesData.INDIVIDUAL){
      this.individualFlag = true;
      this.institutionFlag = false;
      this.groupFlag = false;
    }else if(memberTypeName == MemberShipTypesData.GROUP){
      this.individualFlag = false;
      this.institutionFlag = false;
      this.groupFlag = true;

    }else if(memberTypeName == MemberShipTypesData.INSTITUTION){
      this.individualFlag = false;
      this.institutionFlag = true;
      this.groupFlag = false;

    }
  }
  onClickkycPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  onClickdoccPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.docPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  onClicknomineePhotoCopy(){
    this.nomineePhotoCopyZoom = true;
  }
  onClickguardianPhotoCopy(){
    this.guardianPhotoCopyZoom = true;
  }
  // Popup Maximize
    @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
    
      onDialogResize(event: any) {
        this.isMaximized = event.maximized;
    
        if (this.isMaximized) {
          // Restore original image size when maximized
          this.imageElement.nativeElement.style.width = 'auto';
          this.imageElement.nativeElement.style.height = 'auto';
          this.imageElement.nativeElement.style.maxWidth = '100%';
          this.imageElement.nativeElement.style.maxHeight = '100vh';
        } else {
          // Fit image inside the dialog without scrollbars
          this.imageElement.nativeElement.style.width = '100%';
          this.imageElement.nativeElement.style.height = '100%';
          this.imageElement.nativeElement.style.maxWidth = '100%';
          this.imageElement.nativeElement.style.maxHeight = '100%';
          this.imageElement.nativeElement.style.objectFit = 'contain';
        }
      }
}
