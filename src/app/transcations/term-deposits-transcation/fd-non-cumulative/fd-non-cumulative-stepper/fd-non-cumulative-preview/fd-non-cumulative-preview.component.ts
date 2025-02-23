import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdNonCumulativeApplication } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { FdNonCumulativeCommunication } from '../fd-non-cumulative-communication/shared/fd-non-cumulative-communication.model';
import { FdNonCumulativeKyc } from '../fd-non-cumulative-kyc/shared/fd-non-cumulative-kyc.model';
import { GroupPromoterDetailsModel, MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { FdNonCumulativeNominee, MemberGuardianDetailsModelDetails } from '../fd-non-cumulative-nominee/shared/fd-non-cumulative-nominee.model';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { FdNonCumulativeApplicationService } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DatePipe } from '@angular/common';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { approvaltransactionsconstant } from 'src/app/transcations/approval-transcations/approval-transactions-constant';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUpload } from 'primeng/fileupload';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-fd-non-cumulative-preview',
  templateUrl: './fd-non-cumulative-preview.component.html',
  styleUrls: ['./fd-non-cumulative-preview.component.css']
})
export class FdNonCumulativePreviewComponent {

  responseModel!: Responsemodel;
  admissionNumber: any;
  msgs: any[] = [];
  id: any;
  fdNonCummulativeAccId: any;
  isView: any;
  kycGridList: any[] = [];
  orgnizationSetting: any;
  veiwFalg: boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  addressOne: any;
  addressTwo: any;
  fdNonCumulativeApplicationModel: FdNonCumulativeApplication = new FdNonCumulativeApplication();
  fdNonCumulativeCommunicationModel: FdNonCumulativeCommunication = new FdNonCumulativeCommunication();
  kycDetailsModel: FdNonCumulativeKyc = new FdNonCumulativeKyc();
  nomineeDetailsModel: FdNonCumulativeNominee = new FdNonCumulativeNominee();
  memberGuardianDetailsModel: MemberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
  membershipBasicRequiredDetailsModel: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  fdNonCumulativeKycModel: FdNonCumulativeKyc = new FdNonCumulativeKyc();
  promoterDetailsModel: GroupPromoterDetailsModel = new GroupPromoterDetailsModel();
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
  institutionPrmotersList: any[] = [];
  institutionPrmoters: any[] = [];
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
  isDisableSubmit: boolean = false;
  viewButton: boolean = false;
  editFlag: boolean = false;
  roleName: any;
  accountNumber: any;
  accountTypeName: any;
  isStaff: any;
  isFileUploaded: any;
  multipleFilesList: any[] = [];
  isEdit: any;
  uploadFileData: any;
  isKycEmpty: boolean = false;
  genderList: any[] = [];
  kycPhotoCopyZoom: boolean = false;
  docPhotoCopyZoom: boolean = false;
  nomineePhotoCopyZoom: boolean = false;
  guardianPhotoCopyZoom: boolean = false;


  constructor(private router: Router,
    private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private encryptDecryptService: EncryptDecryptService, private translate: TranslateService,
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
    this.institutionPrmoters = [
      { field: 'surname', header: 'Surname' },
      { field: 'name', header: 'Name' },
      { field: 'operatorTypeName', header: 'Type Of Operator' },
      { field: 'authorizedSignatoryName', header: 'Authorized Signatory'},
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'Age' },
      { field: 'genderTypeName', header: 'Gender' },
      { field: 'maritalStatusName', header: 'Marital status' },
      { field: 'mobileNumber', header: 'Mobile number' },
      { field: 'emailId', header: 'Email' },
      { field: 'aadharNumber', header: 'Aadhar Name' },
      { field: 'startDateVal', header: 'Joining Date' },
    ];
    this.groupPrmoters = [
      { field: 'surname', header: 'Surname' },
      { field: 'name', header: 'Name' },
      { field: 'operatorTypeName', header: 'Type Of Operator' },
      { field: 'authorizedSignatory', header: 'Authorized Signatory'},
      { field: 'memDobVal', header: 'Date Of Birth' },
      { field: 'age', header: 'Age' },
      { field: 'genderTypeName', header: 'Gender' },
      { field: 'maritalStatusName', header: 'Marital status' },
      { field: 'mobileNumber', header: 'Mobile number' },
      { field: 'emailId', header: 'Email' },
      { field: 'aadharNumber', header: 'Aadhar Name' },
      { field: 'startDateVal', header: 'Joining Date' },
      // { field: 'uploadImage', header: 'Upload Image' },
      // { field: 'uploadSignature', header: 'Upload Signature' }
    ]

  }

  ngOnInit() {
    this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.genderList = this.commonComponent.genderList();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined && params['editbutton'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        // let type = this.encryptDecryptService.decrypt(params['memType']);
        let idEdit = this.encryptDecryptService.decrypt(params['editbutton']);
        this.fdNonCummulativeAccId = Number(id);

        if (idEdit == "1") {
            this.preveiwFalg = true;
            this.isShowSubmit = applicationConstants.TRUE; // Allow Submit
            this.viewButton = false;
            this.editFlag = false;
        } else {
            this.preveiwFalg = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
            let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
            if (isGrid === "0") {
                this.isShowSubmit = applicationConstants.FALSE;
                this.viewButton = true;
                this.editFlag = false;
            } else {
                this.isShowSubmit = applicationConstants.TRUE;
            }
        }
        this.getFdNonCummApplicationById();
      }
    })
  }

  backbutton() {
    if (this.roleName == "Manager") {
      this.router.navigate([approvaltransactionsconstant.FD_NON_CUMMULATIVE_APPROVAL_TRANSACTION_DETAILS]);
    } else {
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE]);
    }
  }

  submit() {
    if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined) {
      this.fdNonCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.depositDate));
    }
    if (this.fdNonCumulativeApplicationModel.maturityDate != null && this.fdNonCumulativeApplicationModel.maturityDate != undefined) {
      this.fdNonCumulativeApplicationModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.maturityDate));
    }
    this.fdNonCumulativeApplicationModel.id = this.fdNonCummulativeAccId ;
    this.fdNonCumulativeApplicationModel.accountStatus = 5;
    this.fdNonCumulativeApplicationModel.accountStatusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.fdNonCumulativeApplicationService.updateFdNonCummApplication(this.fdNonCumulativeApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
          if (this.fdNonCumulativeApplicationModel.id != undefined && this.fdNonCumulativeApplicationModel.id != null)
            this.fdNonCummulativeAccId = this.fdNonCumulativeApplicationModel.id;
          if (this.fdNonCumulativeApplicationModel.accountTypeName != null && this.fdNonCumulativeApplicationModel.accountTypeName != undefined)
            this.accountTypeName = this.fdNonCumulativeApplicationModel.accountTypeName;
          if (this.fdNonCumulativeApplicationModel.memberTypeName != null && this.fdNonCumulativeApplicationModel.memberTypeName != undefined)
            this.memberTypeName = this.fdNonCumulativeApplicationModel.memberTypeName;
          if (this.responseModel.data[0].accountNumber != null && this.fdNonCumulativeApplicationModel.accountNumber != undefined)
            this.accountNumber = this.fdNonCumulativeApplicationModel.accountNumber;
          if (this.fdNonCumulativeApplicationModel.admissionNumber != null && this.fdNonCumulativeApplicationModel.admissionNumber != undefined)
            this.admissionNumber = this.fdNonCumulativeApplicationModel.admissionNumber;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE]);
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

  getFdNonCummApplicationById() {
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(this.fdNonCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
          if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined) {
            this.fdNonCumulativeApplicationModel.depositDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
          }
          if (this.fdNonCumulativeApplicationModel.maturityDate != null && this.fdNonCumulativeApplicationModel.maturityDate != undefined) {
            this.fdNonCumulativeApplicationModel.maturityDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.maturityDate, this.orgnizationSetting.datePipe);
          }
          if (this.fdNonCumulativeApplicationModel.memberTypeName != null && this.fdNonCumulativeApplicationModel.memberTypeName != undefined) {
            this.memberTypeName = this.fdNonCumulativeApplicationModel.memberTypeName;
            this.memberTypeCheck(this.memberTypeName);
            if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.fdNonCumulativeApplicationModel.accountTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
            }
          }
          if (this.responseModel.data[0].memberTypeName == MemberShipTypesData.INDIVIDUAL) {
            if (this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.age != null && this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.age != undefined && this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.age < 18) {
              this.guardainFormEnable = true;
            }
          }

          if (this.fdNonCumulativeApplicationModel.signedCopyPath != null && this.fdNonCumulativeApplicationModel.signedCopyPath != undefined) {
            this.fdNonCumulativeApplicationModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.fdNonCumulativeApplicationModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdNonCumulativeApplicationModel.signedCopyPath);
            this.isDisableSubmit = false;
          }else{
            this.isDisableSubmit = true;
          } 
          //membership details
          if (this.fdNonCumulativeApplicationModel != null && this.fdNonCumulativeApplicationModel != undefined) {
            this.membershipBasicDetails();//individual
            this.groupDetails();//group
            this.InstitutionDetails();//institution

            //required documents
            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeRequiredDocumentDetailsDTOList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeRequiredDocumentDetailsDTOList != undefined && this.fdNonCumulativeApplicationModel.fdNonCummulativeRequiredDocumentDetailsDTOList.length > 0) {
              this.requiredDocumentsList = this.fdNonCumulativeApplicationModel.fdNonCummulativeRequiredDocumentDetailsDTOList;
              for (let document of this.requiredDocumentsList) {
                if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                  document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
                }
              }
            }
            //kyc list
            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList != undefined) {
              this.kycGridList = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList;
              for (let kyc of this.kycGridList) {
                if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                  if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                    if (this.fdNonCumulativeApplicationModel.isNewMember)
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
            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList != undefined &&
              this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList[0] != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList[0] != undefined)
              this.fdNonCumulativeCommunicationModel = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationList[0];


            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountNomineeList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountNomineeList != undefined &&
              this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountNomineeList[0] != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountNomineeList[0] != undefined)
              this.nomineeDetailsModel = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountNomineeList[0];
            if (this.nomineeDetailsModel.nomineeFilePath != null && this.nomineeDetailsModel.nomineeFilePath != undefined) {
              this.nomineeDetailsModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.nomineeDetailsModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.nomineeDetailsModel.nomineeFilePath);
            }
            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountGaurdianList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountGaurdianList != undefined &&
              this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountGaurdianList[0] != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountGaurdianList[0] != undefined)
              this.memberGuardianDetailsModel = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountGaurdianList[0];
            if (this.memberGuardianDetailsModel.uploadFilePath != null && this.memberGuardianDetailsModel.uploadFilePath != undefined) {
              this.memberGuardianDetailsModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModel.uploadFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModel.uploadFilePath);
            }
            //joint holder
            if (this.fdNonCumulativeApplicationModel.accountTypeName != null && this.fdNonCumulativeApplicationModel.accountTypeName != undefined && this.fdNonCumulativeApplicationModel.accountTypeName === "Joint") {
              this.jointHoldersFlag = true;
            }
            //joint holder
            if (this.fdNonCumulativeApplicationModel.fdNonCummulativeJointAccHolderDetailsDTOList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeJointAccHolderDetailsDTOList != undefined && this.fdNonCumulativeApplicationModel.fdNonCummulativeJointAccHolderDetailsDTOList.length > 0) {
              this.jointHoldersFlag = true;
              this.jointHolderDetailsList = this.fdNonCumulativeApplicationModel.fdNonCummulativeJointAccHolderDetailsDTOList;
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
  applicationEdit(rowData: any) {
    if (rowData.accountTypeName == "Joint") {
      this.flag = true;
    }
    else {
      this.flag = false;
    }
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMM_APPLICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  communicationEdit(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMM_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  kycEdit(rowData: any) {
    if (this.isNewMember) {
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMM_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
    else {
      this.router.navigate([termdeposittransactionconstant.MEMBERSHIP_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });

    }
  }

  nomineeEdit(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMM_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), preview: this.encryptDecryptService.encrypt(true) } });
  }


  editMembership(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.NEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editJointHolder(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMM_JOINTACCOUNT], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editRequiredDocuments(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE_REQUIRED_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
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


  pdfDownload() {
    this.commonComponent.startSpinner();
    this.fdNonCumulativeApplicationService.downloadPreviewPDf(this.fdNonCummulativeAccId).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "Fd_Non_cummulative_application_filled_Document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'Fd Non Cummulative application file downloaded successfully' });
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: "error", detail: 'Unable to download filled FHR' });
    })

  }
  
  /**
* @implements onFileremove from file value
* @param fileName 
* @author Bhargavi
*/
  fileRemoveEvent() {
    if (this.fdNonCumulativeApplicationModel.filesDTOList != null && this.fdNonCumulativeApplicationModel.filesDTOList != undefined && this.fdNonCumulativeApplicationModel.filesDTOList.length > 0) {
      let removeFileIndex = this.fdNonCumulativeApplicationModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdNonCumulativeApplicationModel.signedCopyPath);
      this.fdNonCumulativeApplicationModel.filesDTOList.splice(removeFileIndex, 1);
      this.fdNonCumulativeApplicationModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }

  membershipBasicDetails() {
    if (this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined && this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO != null) {
      this.membershipBasicRequiredDetailsModel = this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO;
      if (this.membershipBasicRequiredDetailsModel.isNewMember != null && this.membershipBasicRequiredDetailsModel.isNewMember != undefined) {
        this.isNewMember = this.membershipBasicRequiredDetailsModel.isNewMember;
      }
      if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
        this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
        this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetailsModel.photoPath != null && this.membershipBasicRequiredDetailsModel.photoPath != undefined) {
        if (this.membershipBasicRequiredDetailsModel.isNewMember) {
          this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoPath);
        }
        else {
          this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoPath);
        }
      }
      else {
        this.photoCopyFlag = false;
      }
      if (this.membershipBasicRequiredDetailsModel.signaturePath != null && this.membershipBasicRequiredDetailsModel.signaturePath != undefined) {
        if (this.membershipBasicRequiredDetailsModel.isNewMember) {
          this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signaturePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signaturePath);
        }
        else {
          this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signaturePath);
        }
      }
      else {
        this.signatureCopyFlag = false;
      }
      if (this.membershipBasicRequiredDetailsModel.isStaff != null && this.membershipBasicRequiredDetailsModel.isStaff != undefined && this.membershipBasicRequiredDetailsModel.isStaff) {
        this.isStaff = applicationConstants.YES;
      }
      else {
        this.isStaff = applicationConstants.NO;
      }
      if (this.membershipBasicRequiredDetailsModel.isKycApproved != null && this.membershipBasicRequiredDetailsModel.isKycApproved != undefined && this.membershipBasicRequiredDetailsModel.isKycApproved) {
        this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
      }
      else {
        this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
      }
    }
  }

  groupDetails() {
    if (this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO != undefined && this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO != null) {
      this.memberGroupDetailsModel = this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO;
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
    if (this.fdNonCumulativeApplicationModel.memInstitutionDTO != undefined && this.fdNonCumulativeApplicationModel.memInstitutionDTO != null) {
      this.membershipInstitutionDetailsModel = this.fdNonCumulativeApplicationModel.memInstitutionDTO;
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
        this.institutionPrmotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
        for (let promoter of this.institutionPrmotersList) {
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
  //image upload and document path save
  //@Bhargavi
  fileUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.fdNonCumulativeApplicationModel.filesDTOList == null || this.fdNonCumulativeApplicationModel.filesDTOList == undefined) {
      this.fdNonCumulativeApplicationModel.filesDTOList = [];
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
        this.fdNonCumulativeApplicationModel.multipartFileListsignedCopyPath = [];
        this.fdNonCumulativeApplicationModel.filesDTOList.push(files);
        this.fdNonCumulativeApplicationModel.signedCopyPath = null;
        this.fdNonCumulativeApplicationModel.filesDTOList[this.fdNonCumulativeApplicationModel.filesDTOList.length - 1].fileName = "Fd_non_cumulative_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.fdNonCumulativeApplicationModel.signedCopyPath = "Fd_non_cumulative_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.isDisableSubmit = false;
      }
      reader.readAsDataURL(file);
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
  onClickKycPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  onClickDocPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.docPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  onClickNomineePhotoCopy(){
    this.nomineePhotoCopyZoom = true;
  }
  onClickGuardianPhotoCopy(){
    this.guardianPhotoCopyZoom = true;
  }
}
