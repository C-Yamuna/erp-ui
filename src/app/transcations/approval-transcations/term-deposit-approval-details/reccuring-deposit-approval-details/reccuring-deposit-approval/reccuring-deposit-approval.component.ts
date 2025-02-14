import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel, RdAccountNominee, RdKycModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { RdAccountsService } from 'src/app/transcations/term-deposits-transcation/shared/rd-accounts.service';
import { RdAccountCommunication, RdAccountGuardian, RdAccountsModel, RdRequiredDocuments } from 'src/app/transcations/term-deposits-transcation/shared/term-depost-model.model';
import { termdeposittransactionconstant } from 'src/app/transcations/term-deposits-transcation/term-deposit-transaction-constant';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';

@Component({
  selector: 'app-reccuring-deposit-approval',
  templateUrl: './reccuring-deposit-approval.component.html',
  styleUrls: ['./reccuring-deposit-approval.component.css']
})
export class ReccuringDepositApprovalComponent {
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
  rdAccountCommunicationModel: RdAccountCommunication = new RdAccountCommunication();
  rdAccountsModel: RdAccountsModel = new RdAccountsModel();
  requiredDocumentDetails: RdRequiredDocuments = new RdRequiredDocuments();
  rdKycModel: RdKycModel = new RdKycModel();
  rdAccountNomineeModel: RdAccountNominee = new RdAccountNominee();
  rdAccountGuardianModel: RdAccountGuardian = new RdAccountGuardian();
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
  isStaff: any;
  isKycEmpty: any;
  genderList: any[] = [];

  constructor(private router: Router,
    private rdAccountsService: RdAccountsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private commonStatusService: CommonCategoryService,
    private encryptDecryptService: EncryptDecryptService,
    private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService: FileUploadService) {
      this.columns = [
        { field: 'surname', header: 'TERMDEPOSITSTRANSACTION.SURNAME' },
        { field: 'name', header: 'TERMDEPOSITSTRANSACTION.NAME' },
        { field: 'operatorTypeName', header: 'TERMDEPOSITSTRANSACTION.ACCOUNT_TYPE' },
        { field: 'memDobVal', header: 'TERMDEPOSITSTRANSACTION.DATE_OF_BIRTH' },
        { field: 'age', header: 'TERMDEPOSITSTRANSACTION.AGE' },
        { field: 'genderTypeName', header: 'TERMDEPOSITSTRANSACTION.GENDER' },
        { field: 'maritalStatusName', header: 'TERMDEPOSITSTRANSACTION.MARITAL_STATUS' },
        { field: 'mobileNumber', header: 'TERMDEPOSITSTRANSACTION.CONTACT' },
        { field: 'emailId', header: 'TERMDEPOSITSTRANSACTION.EMAIL' },
        { field: 'aadharNumber', header: 'TERMDEPOSITSTRANSACTION.AADHAR' },
        { field: 'startDateVal', header: 'TERMDEPOSITSTRANSACTION.START_DATE' },
      ];
      this.groupPrmoters = [
        { field: 'surname', header: 'TERMDEPOSITSTRANSACTION.SURNAME' },
        { field: 'name', header: 'TERMDEPOSITSTRANSACTION.NAME' },
        { field: 'operatorTypeName', header: 'TERMDEPOSITSTRANSACTION.ACCOUNT_TYPE' },
        { field: 'memDobVal', header: 'TERMDEPOSITSTRANSACTION.DATE_OF_BIRTH' },
        { field: 'age', header: 'TERMDEPOSITSTRANSACTION.AGE' },
        { field: 'genderName', header: 'TERMDEPOSITSTRANSACTION.GENDER' },
        { field: 'maritalStatusName', header: 'TERMDEPOSITSTRANSACTION.MARITAL_STATUS' },
        { field: 'mobileNumber', header: 'TERMDEPOSITSTRANSACTION.CONTACT' },
        { field: 'emailId', header: 'TERMDEPOSITSTRANSACTION.EMAIL' },
        { field: 'aadharNumber', header: 'TERMDEPOSITSTRANSACTION.AADHAR' },
        { field: 'startDateVal', header: 'TERMDEPOSITSTRANSACTION.START_DATE' },
      ];
  
  }

  ngOnInit() {
    this.genderList = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 2 },
    ]
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined && params['editbutton'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        // let type = this.encryptDecryptService.decrypt(params['memType']);
        let idEdit = this.encryptDecryptService.decrypt(params['editbutton']);
        this.rdAccId = Number(id);
        if (idEdit == "1"){
          this.preveiwFalg = true;
          this.viewButton = false;
        }else {
          this.preveiwFalg = false;
          this.viewButton = true;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
            // this.viewButton = false;
            this.editFlag = true;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
            this.preveiwFalg = false;
          }
        }
        this.getRdAccountById();
      }
    })
    this.getAllStatusList();
  }
  
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.RECCURING_DEPOSIT_APPROVAL_TRANSACTION_DETAILS]);
  }
  submit() {
    // Determine the status name before submission
    if (this.rdAccountsModel.accountStatus != null && this.rdAccountsModel.accountStatus != undefined) {
      const accountStatusName = this.statusList.find((data: any) => data != null && data.value === this.rdAccountsModel.accountStatusName);
      if (accountStatusName != null && accountStatusName != undefined) {
        this.rdAccountsModel.accountStatusName = accountStatusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    if (this.rdAccountsModel.depositDate != null && this.rdAccountsModel.depositDate != undefined) {
      this.rdAccountsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.rdAccountsModel.depositDate));
    }
    this.rdAccountsService.updateRbAccounts(this.rdAccountsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.rdAccountsModel = this.responseModel.data[0];
          if (this.rdAccountsModel.id != undefined && this.rdAccountsModel.id != null)
            this.rdAccId = this.rdAccountsModel.id;
          if (this.rdAccountsModel.accountTypeName != null && this.rdAccountsModel.accountTypeName != undefined)
            this.accountTypeName = this.rdAccountsModel.accountTypeName;
          if (this.rdAccountsModel.memberTypeName != null && this.rdAccountsModel.memberTypeName != undefined)
            this.memberTypeName = this.rdAccountsModel.memberTypeName;
          if (this.responseModel.data[0].accountNumber != null && this.rdAccountsModel.accountNumber != undefined)
            this.accountNumber = this.rdAccountsModel.accountNumber;
          if (this.rdAccountsModel.adminssionNumber != null && this.rdAccountsModel.adminssionNumber != undefined)
            this.admissionNumber = this.rdAccountsModel.adminssionNumber;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.router.navigate([approvaltransactionsconstant.RECCURING_DEPOSIT_APPROVAL_TRANSACTION_DETAILS]);
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
    this.rdAccountsService.getRdAccounts(this.rdAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.rdAccountsModel = this.responseModel.data[0];
          if(this.rdAccountsModel.accountStatusName == CommonStatusData.SUBMISSION_FOR_APPROVAL){
            this.isDisableSubmit = true;
          }
          else{
            this.isDisableSubmit = false;
          }
          if (this.rdAccountsModel.depositDate != null && this.rdAccountsModel.depositDate != undefined) {
            this.rdAccountsModel.depositDate = this.datePipe.transform(this.rdAccountsModel.depositDate, this.orgnizationSetting.datePipe);
          }

          if (this.rdAccountsModel.memberTypeName != null && this.rdAccountsModel.memberTypeName != undefined) {
            this.memberTypeName = this.rdAccountsModel.memberTypeName;
            this.memberTypeCheck(this.memberTypeName);
            if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.rdAccountsModel.accountTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
            }
          }
          if (this.responseModel.data[0].memberTypeName == MemberShipTypesData.INDIVIDUAL) {
            if (this.rdAccountsModel.memberShipBasicDetailsDTO.age != null && this.rdAccountsModel.memberShipBasicDetailsDTO.age != undefined && this.rdAccountsModel.memberShipBasicDetailsDTO.age < 18) {
              this.guardainFormEnable = true;
            }
          }

          if (this.rdAccountsModel.signedCopyPath != null && this.rdAccountsModel.signedCopyPath != undefined) {
            this.rdAccountsModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.rdAccountsModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.rdAccountsModel.signedCopyPath);
            // this.isDisableSubmit = false;
          }else{
            // this.isDisableSubmit = true;
          }
          //membership details
          if (this.rdAccountsModel != null && this.rdAccountsModel != undefined) {
            this.membershipBasicDetails();//individual
            this.groupDetails();//group
            this.InstitutionDetails();//institution

            //required documents
            if (this.rdAccountsModel.rdRequiredDocumentDetailsDTOList != null && this.rdAccountsModel.rdRequiredDocumentDetailsDTOList != undefined && this.rdAccountsModel.rdRequiredDocumentDetailsDTOList.length > 0) {
              this.requiredDocumentsList = this.rdAccountsModel.rdRequiredDocumentDetailsDTOList;
              for (let document of this.requiredDocumentsList) {
                if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                  document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
                }
              }
            }
            //kyc list
            if (this.rdAccountsModel.rdAccountKycList != null && this.rdAccountsModel.rdAccountKycList != undefined) {
              this.kycGridList = this.rdAccountsModel.rdAccountKycList;
              for (let kyc of this.kycGridList) {
                if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                  if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                    if (this.rdAccountsModel.isNewMember)
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
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
            //communication
            if (this.rdAccountsModel.rdAccountCommunicationDTOList != null && this.rdAccountsModel.rdAccountCommunicationDTOList != undefined &&
              this.rdAccountsModel.rdAccountCommunicationDTOList[0] != null && this.rdAccountsModel.rdAccountCommunicationDTOList[0] != undefined)
              this.rdAccountCommunicationModel = this.rdAccountsModel.rdAccountCommunicationDTOList[0];

            //nominee details
            if (this.rdAccountsModel.termAccountNomineeList != null && this.rdAccountsModel.termAccountNomineeList != undefined &&
              this.rdAccountsModel.termAccountNomineeList[0] != null && this.rdAccountsModel.termAccountNomineeList[0] != undefined)
              this.rdAccountNomineeModel = this.rdAccountsModel.termAccountNomineeList[0];
            if (this.rdAccountNomineeModel.nomineeFilePath != null && this.rdAccountNomineeModel.nomineeFilePath != undefined) {
              this.rdAccountNomineeModel.nomineeMultiPartList = this.fileUploadService.getFile(this.rdAccountNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.rdAccountNomineeModel.nomineeFilePath);
            }
            //guardian
            if (this.rdAccountsModel.termAccountGaurdianList != null && this.rdAccountsModel.termAccountGaurdianList != undefined &&
              this.rdAccountsModel.termAccountGaurdianList[0] != null && this.rdAccountsModel.termAccountGaurdianList[0] != undefined)
              this.rdAccountGuardianModel = this.rdAccountsModel.termAccountGaurdianList[0];
            if (this.rdAccountGuardianModel.uploadFilePath != null && this.rdAccountGuardianModel.uploadFilePath != undefined) {
              this.rdAccountGuardianModel.guardainMultipartList = this.fileUploadService.getFile(this.rdAccountGuardianModel.uploadFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.rdAccountGuardianModel.uploadFilePath);
            }
            //joint holder
            if (this.rdAccountsModel.accountTypeName != null && this.rdAccountsModel.accountTypeName != undefined && this.rdAccountsModel.accountTypeName === "Joint") {
              this.jointHoldersFlag = true;
            }
            //joint holder
            if (this.rdAccountsModel.tdJointAccHolderDetailsDTOList != null && this.rdAccountsModel.tdJointAccHolderDetailsDTOList != undefined && this.rdAccountsModel.tdJointAccHolderDetailsDTOList.length > 0) {
              this.jointHoldersFlag = true;
              this.jointHolderDetailsList = this.rdAccountsModel.tdJointAccHolderDetailsDTOList;
              this.jointHolderDetailsList.map((joint: any) => {
                joint.admissionDateVal = this.datePipe.transform(joint.admissionDate, this.orgnizationSetting.datePipe);
              });
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
    if (this.isEdit && this.rdAccountsModel.filesDTOList == null || this.rdAccountsModel.filesDTOList == undefined) {
      this.rdAccountsModel.filesDTOList = [];
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
        this.rdAccountsModel.multipartFileListsignedCopyPath = [];
        this.rdAccountsModel.filesDTOList.push(files);
        this.rdAccountsModel.signedCopyPath = null;
        this.rdAccountsModel.filesDTOList[this.rdAccountsModel.filesDTOList.length - 1].fileName = "RD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.rdAccountsModel.signedCopyPath = "RD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.isDisableSubmit = false;
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
    if (this.rdAccountsModel.filesDTOList != null && this.rdAccountsModel.filesDTOList != undefined && this.rdAccountsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.rdAccountsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.rdAccountsModel.signedCopyPath);
      this.rdAccountsModel.filesDTOList.splice(removeFileIndex, 1);
      this.rdAccountsModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }

  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.rdAccountsModel.accountStatusName != null && this.rdAccountsModel.accountStatusName != undefined) {
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

    pdfDownload() {
      this.commonComponent.startSpinner();
      this.rdAccountsService.downloadPreviewPDf(this.rdAccId).subscribe((data: any) => {
        var file = new Blob([data], { type: 'application/pdf' });
        saveAs(file, "Recurring_Deposit_filled_Document.pdf");
        this.msgs = [];
        this.msgs.push({ severity: "success", detail: 'Recurring Deposit file downloaded successfully' });
        this.commonComponent.stopSpinner();
      }, error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: "error", detail: 'Unable to download filled FHR' });
      })
  
    }
  
    membershipBasicDetails() {
      if (this.rdAccountsModel.memberShipBasicDetailsDTO != undefined && this.rdAccountsModel.memberShipBasicDetailsDTO != null) {
        this.membershipBasicDetail = this.rdAccountsModel.memberShipBasicDetailsDTO;
        if (this.membershipBasicDetail.isNewMember != null && this.membershipBasicDetail.isNewMember != undefined) {
          this.isNewMember = this.membershipBasicDetail.isNewMember;
        }
        if (this.membershipBasicDetail.dob != null && this.membershipBasicDetail.dob != undefined) {
          this.membershipBasicDetail.dobVal = this.datePipe.transform(this.membershipBasicDetail.dob, this.orgnizationSetting.datePipe);
        }
        if (this.membershipBasicDetail.admissionDate != null && this.membershipBasicDetail.admissionDate != undefined) {
          this.membershipBasicDetail.admissionDateVal = this.datePipe.transform(this.membershipBasicDetail.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.membershipBasicDetail.photoPath != null && this.membershipBasicDetail.photoPath != undefined) {
          if (this.membershipBasicDetail.isNewMember) {
            this.membershipBasicDetail.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetail.photoPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.photoPath);
          }
          else {
            this.membershipBasicDetail.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetail.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.photoPath);
          }
        }
        else {
          this.photoCopyFlag = false;
        }
        if (this.membershipBasicDetail.signaturePath != null && this.membershipBasicDetail.signaturePath != undefined) {
          if (this.membershipBasicDetail.isNewMember) {
            this.membershipBasicDetail.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetail.signaturePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.signaturePath);
          }
          else {
            this.membershipBasicDetail.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetail.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetail.signaturePath);
          }
        }
        else {
          this.signatureCopyFlag = false;
        }
        if (this.membershipBasicDetail.isStaff != null && this.membershipBasicDetail.isStaff != undefined && this.membershipBasicDetail.isStaff) {
          this.isStaff = applicationConstants.YES;
        }
        else {
          this.isStaff = applicationConstants.NO;
        }
        if (this.membershipBasicDetail.isKycApproved != null && this.membershipBasicDetail.isKycApproved != undefined && this.membershipBasicDetail.isKycApproved) {
          this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
        }
        else {
          this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
        }
      }
    }
  
    groupDetails() {
      if (this.rdAccountsModel.memberShipGroupDetailsDTO != undefined && this.rdAccountsModel.memberShipGroupDetailsDTO != null) {
        this.memberGroupDetailsModel = this.rdAccountsModel.memberShipGroupDetailsDTO;
        if (this.memberGroupDetailsModel.isNewMember != null && this.memberGroupDetailsModel.isNewMember != undefined) {
          this.isNewMember = this.memberGroupDetailsModel.isNewMember;
        }
        if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
          this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
          for (let promoter of this.groupPrmotersList) {
            if (promoter.dob != null && promoter.dob != undefined) {
              promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
            }
            if (promoter.startDate != null && promoter.startDate != undefined) {
              promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
            }
            if (promoter.genderId != null && promoter.genderId != undefined) {
              let gender = this.genderList.filter((obj: any) => obj.value == promoter.genderId);
              if (gender != null && gender != undefined && gender.length > 0)
                promoter.genderName = gender[0].label;
            }
          }
        }
        if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
          this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
          this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined) {
          this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
        }
        else {
          this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
        }
      }
    }
    InstitutionDetails() {
      if (this.rdAccountsModel.memInstitutionDTO != undefined && this.rdAccountsModel.memInstitutionDTO != null) {
        this.membershipInstitutionDetailsModel = this.rdAccountsModel.memInstitutionDTO;
        if (this.membershipInstitutionDetailsModel.isNewMember != null && this.membershipInstitutionDetailsModel.isNewMember != undefined) {
          this.isNewMember = this.membershipInstitutionDetailsModel.isNewMember;
        }
        if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
          this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
        }
        if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
          this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
          this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
          for (let promoter of this.institionPromotersList) {
            if (promoter.dob != null && promoter.dob != undefined) {
              promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
            }
            if (promoter.startDate != null && promoter.startDate != undefined) {
              promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
            }
            if (promoter.genderId != null && promoter.genderId != undefined) {
              let gender = this.genderList.filter((obj: any) => obj.value == promoter.genderId);
              if (gender != null && gender != undefined && gender.length > 0)
                promoter.genderName = gender[0].label;
            }
          }
        }
        if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined) {
          this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
        }
        else {
          this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
        }
      }
    }

  
    /**
     * @implements memberType Check
     * @author bhargavi
     */
    memberTypeCheck(memberTypeName: any) {
      if (memberTypeName == MemberShipTypesData.INDIVIDUAL) {
        this.individualFlag = true;
        this.institutionFlag = false;
        this.groupFlag = false;
      } else if (memberTypeName == MemberShipTypesData.GROUP) {
        this.individualFlag = false;
        this.institutionFlag = false;
        this.groupFlag = true;
  
      } else if (memberTypeName == MemberShipTypesData.INSTITUTION) {
        this.individualFlag = false;
        this.institutionFlag = true;
        this.groupFlag = false;
  
      }
    }
}
