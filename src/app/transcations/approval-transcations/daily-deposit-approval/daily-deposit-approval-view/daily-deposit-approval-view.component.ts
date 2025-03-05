import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { AccountCommunication } from 'src/app/transcations/daily-deposits-transaction/shared/account-communication.model';
import { AccountGuardian } from 'src/app/transcations/daily-deposits-transaction/shared/account-guardian.model';
import { AccountKYC } from 'src/app/transcations/daily-deposits-transaction/shared/account-kyc.model';
import { AccountNominee } from 'src/app/transcations/daily-deposits-transaction/shared/account-nominee.model';
import { AccountRequriedDocuments } from 'src/app/transcations/daily-deposits-transaction/shared/account-requried-documents.model';
import { Accounts } from 'src/app/transcations/daily-deposits-transaction/shared/accounts.model';
import { DailyDepositsAccountsService } from 'src/app/transcations/daily-deposits-transaction/shared/daily-deposits-accounts.service';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { approvaltransactionsconstant } from '../../approval-transactions-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-daily-deposit-approval-view',
  templateUrl: './daily-deposit-approval-view.component.html',
  styleUrls: ['./daily-deposit-approval-view.component.css']
})
export class DailyDepositApprovalViewComponent {
  responseModel!: Responsemodel;
  admissionNumber: any;
  msgs: any[] = [];
  id: any;
  rdAccId: any;
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
  rdKycModel: AccountKYC = new AccountKYC();
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
  statusList: any[] = [];
  kycPhotoCopyZoom: boolean = false;
  docPhotoCopyZoom:boolean = false;
  nomineePhotoCopyZoom:boolean = false;
  guardianPhotoCopyZoom:boolean = false;
  isKycEmpty: boolean = false;

  constructor(private router: Router,
    private dailyDepositsAccountsService: DailyDepositsAccountsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private commonStatusService: CommonCategoryService,
    private encryptDecryptService: EncryptDecryptService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService: FileUploadService) {
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
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined && params['editbutton'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        // let type = this.encryptDecryptService.decrypt(params['memType']);
        let idEdit = this.encryptDecryptService.decrypt(params['editbutton']);
        this.rdAccId = Number(id);
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
        this.getRdAccountById();
      }
    })
    this.getAllStatusList();
  }
  
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.DAILY_DEPOSIT_APPROVAL]);
  }
  submit() {
    // Determine the status name before submission
    if (this.accountsModel.status != null && this.accountsModel.status != undefined) {
      const statusName = this.statusList.find((data: any) => data != null && data.value === this.accountsModel.statusName);
      if (statusName != null && statusName != undefined) {
        this.accountsModel.statusName = statusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    if (this.accountsModel.depositDate != null && this.accountsModel.depositDate != undefined) {
      this.accountsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.accountsModel.depositDate));
    }
    this.dailyDepositsAccountsService.updateDailyDepositsAccounts(this.accountsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.accountsModel = this.responseModel.data[0];
          if (this.accountsModel.id != undefined && this.accountsModel.id != null)
            this.rdAccId = this.accountsModel.id;
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
        this.router.navigate([approvaltransactionsconstant.DAILY_DEPOSIT_APPROVAL]);
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
  getRdAccountById() {
    this.dailyDepositsAccountsService.getAccounts(this.rdAccId).subscribe((data: any) => {
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
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              if (kyc.multipartFileList != null && kyc.multipartFileList != undefined) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              }
            }
          }else {
            this.isKycEmpty = true;
          }

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
          if (this.accountsModel.accountTypeName != null && this.accountsModel.accountTypeName != undefined && this.accountsModel.accountTypeName === "Joint") {
            this.jointHoldersFlag = true;
          }
          if (this.accountsModel.tdJointAccHolderDetailsDTOList != null && this.accountsModel.tdJointAccHolderDetailsDTOList != undefined && this.accountsModel.tdJointAccHolderDetailsDTOList.length > 0) {
            this.jointHoldersFlag = true;
            this.jointHolderDetailsList = this.accountsModel.tdJointAccHolderDetailsDTOList;
          }
          if (this.accountsModel.requiredDocumentDetailsDTOList != null && this.accountsModel.requiredDocumentDetailsDTOList != undefined && this.accountsModel.requiredDocumentDetailsDTOList.length > 0) {
            this.requiredDocumentsList = this.accountsModel.requiredDocumentDetailsDTOList;
            for (let document of this.requiredDocumentsList) {
              if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
              }
            }
          }
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
  /**
   * @author bhargavi
   * @implement onclose popup
   */
  closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }

  /**
   * @implement Image Zoom POp up
   * @author bhargavi
   */
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  /**
   * @author bhargavi
   * @implements close photo dialogue
   */
  closePhoto() {
    this.memberPhotoCopyZoom = false;
  }

  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  //image upload and document path save
  //@Bhargavi
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.accountsModel.filesDTOList == null || this.accountsModel.filesDTOList == undefined) {
      this.accountsModel.filesDTOList = [];
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
        let timeStamp = this.commonComponent.getTimeStamp();
        this.accountsModel.multipartFileListsignedCopyPath = [];
        this.accountsModel.filesDTOList.push(files);
        this.accountsModel.signedCopyPath = null;
        this.accountsModel.filesDTOList[this.accountsModel.filesDTOList.length - 1].fileName = "RD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.accountsModel.signedCopyPath = "RD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
      }
      reader.readAsDataURL(file);
    }
  }

  /**
* @implements onFileremove from file value
* @param fileName 
* @author Bhargavi
*/
  fileRemoveEvent() {
    if (this.accountsModel.filesDTOList != null && this.accountsModel.filesDTOList != undefined && this.accountsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.accountsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.accountsModel.signedCopyPath);
      this.accountsModel.filesDTOList.splice(removeFileIndex, 1);
      this.accountsModel.signedCopyPath = null;
    }
  }

  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.accountsModel.statusName != null && this.accountsModel.statusName != undefined) {
      this.isDisableSubmit = false;
    }
    else {
      this.isDisableSubmit = true;
    }
  }
  

  getAllStatusList() {
    this.commonStatusService.getAllCommonStatus().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.statusList = this.responseModel.data;
            this.statusList = this.statusList.filter((obj: any) => obj != null && obj.name === CommonStatusData.REJECTED || obj.name === CommonStatusData.APPROVED ||
              obj.name === CommonStatusData.REQUEST_FOR_RESUBMISSION).map((status: { name: any; id: any; }) => {
            return { label: status.name, value: status.id };
            });
          }else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
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
}
