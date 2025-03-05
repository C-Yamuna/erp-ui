import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DatePipe } from '@angular/common';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';
import { FdCumulativeNominee, MemberGuardianDetailsModelDetails } from '../fd-cumulative-nominee/shared/fd-cumulative-nominee.model';
import { FdCumulativeKyc } from '../fd-cumulative-kyc/shared/fd-cumulative-kyc.model';
import { FdCumulativeCommunication } from '../fd-cumulative-communication/shared/fd-cumulative-communication.model';
import { FdCumulativeApplication } from '../fd-cumulative-application/shared/fd-cumulative-application.model';
import { FdCumulativeApplicationService } from '../fd-cumulative-application/shared/fd-cumulative-application.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { approvaltransactionsconstant } from 'src/app/transcations/approval-transcations/approval-transactions-constant';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-fd-cumulative-preview',
  templateUrl: './fd-cumulative-preview.component.html',
  styleUrls: ['./fd-cumulative-preview.component.css']
})
export class FdCumulativePreviewComponent {

  responseModel!: Responsemodel;
  admissionNumber: any;
  msgs: any[] = [];
  id: any;
  fdCummulativeAccId: any;
  isView: any;
  kycGridList: any[] = [];
  orgnizationSetting: any;
  veiwFalg: boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  addressOne: any;
  addressTwo: any;
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  fdCumulativeCommunicationModel: FdCumulativeCommunication = new FdCumulativeCommunication();
  kycDetailsModel: FdCumulativeKyc = new FdCumulativeKyc();
  nomineeDetailsModel: FdCumulativeNominee = new FdCumulativeNominee();
  memberGuardianDetailsModel: MemberGuardianDetailsModelDetails = new MemberGuardianDetailsModelDetails();
  membershipBasicRequiredDetailsModel: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();

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
  roleName: any;
  isFileUploaded: any;
  multipartFileList: any;
  uploadFileData: any;
  multipleFilesList: any;
  isEdit: any;
  isDisableSubmit: boolean = false;
  viewButton: boolean = false;
  editFlag: boolean = false;
  accountTypeName: any;
  accountNumber: any;
  isStaff: boolean = false;
  isKycEmpty: boolean = false;
  genderList: any[] = [];
  kycPhotoCopyZoom: boolean =false;
  docPhotoCopyZoom: boolean = false;
  nomineePhotoCopyZoom: boolean = false;
  guardianPhotoCopyZoom: boolean = false;
  renewalList:any[] = [];
  interestPaymentFrequencyList: any[] = [];
  tenureTypeList: any[]=[];
  yearFlag: boolean = false;
  monthFlag: boolean = false;
  daysFlag: boolean = false;
  interestPayoutFlag: boolean = false;
  renewalFlag: boolean = false;

  constructor(private router: Router,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
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
    this.institutionPrmoters = [
      { field: 'surname', header: 'surname' },
      { field: 'name', header: 'name' },
      { field: 'operatorTypeName', header: 'operation type name' },
      { field: 'memDobVal', header: 'member Date Of Birth' },
      { field: 'age', header: 'age' },
      { field: 'genderTypeName', header: 'gender name' },
      { field: 'maritalStatusName', header: 'marital status' },
      { field: 'mobileNumber', header: 'mobile number' },
      { field: 'emailId', header: 'email' },
      { field: 'aadharNumber', header: 'aadhar' },
      { field: 'startDateVal', header: 'start date' },
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
      { field: 'startDateVal', header: 'start date' },
    ];

  }

  ngOnInit() {
    this.genderList = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 2 },
    ]
    this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.renewalList = this.commonComponent.requiredlist();
    this.interestPaymentFrequencyList = this.commonComponent.interestPaymentFrequency();
    this.tenureTypeList = this.commonComponent.tenureType();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined && params['editbutton'] != undefined) {
        let id = this.encryptDecryptService.decrypt(params['id']);
        // let type = this.encryptDecryptService.decrypt(params['memType']);
        let idEdit = this.encryptDecryptService.decrypt(params['editbutton']);
        this.fdCummulativeAccId = Number(id);

         if (idEdit == "1") {
             this.preveiwFalg = true;
             this.viewButton = false;
         } else {
             this.preveiwFalg = false;
             this.viewButton = true;
         }
         if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
             let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
             if (isGrid === "0") {
                 this.isShowSubmit = applicationConstants.FALSE;
                //  this.viewButton = true;
                 this.editFlag = true;
             } else {
                 this.isShowSubmit = applicationConstants.TRUE;
             }
         }
        this.getFdCummApplicationById();
      }
    })
  }

  backbutton() {
    if (this.roleName == "Manager") {
      this.router.navigate([approvaltransactionsconstant.FD_CUMMULATIVE_APPROVAL_TRANSACTION_DETAILS]);
    } else {
      this.router.navigate([termdeposittransactionconstant.FD_CUMMULATIVE]);
    }
  }
  submit() {
    if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined) {
      this.fdCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdCumulativeApplicationModel.depositDate));
    }
    if (this.fdCumulativeApplicationModel.maturityDate != null && this.fdCumulativeApplicationModel.maturityDate != undefined) {
      this.fdCumulativeApplicationModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdCumulativeApplicationModel.maturityDate));
    }
    this.fdCumulativeApplicationModel.status = 5;
    this.fdCumulativeApplicationModel.statusName = CommonStatusData.SUBMISSION_FOR_APPROVAL;
    this.fdCumulativeApplicationService.updateFdCummApplication(this.fdCumulativeApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.fdCumulativeApplicationModel = this.responseModel.data[0];
          if (this.fdCumulativeApplicationModel.id != undefined && this.fdCumulativeApplicationModel.id != null)
            this.fdCummulativeAccId = this.fdCumulativeApplicationModel.id;
          if (this.fdCumulativeApplicationModel.accountTypeName != null && this.fdCumulativeApplicationModel.accountTypeName != undefined)
            this.accountTypeName = this.fdCumulativeApplicationModel.accountTypeName;
          if (this.fdCumulativeApplicationModel.memberTypeName != null && this.fdCumulativeApplicationModel.memberTypeName != undefined)
            this.memberTypeName = this.fdCumulativeApplicationModel.memberTypeName;
          if (this.responseModel.data[0].accountNumber != null && this.fdCumulativeApplicationModel.accountNumber != undefined)
            this.accountNumber = this.fdCumulativeApplicationModel.accountNumber;
          if (this.fdCumulativeApplicationModel.admissionNumber != null && this.fdCumulativeApplicationModel.admissionNumber != undefined)
            this.admissionNumber = this.fdCumulativeApplicationModel.admissionNumber;
        }
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
        this.router.navigate([termdeposittransactionconstant.FD_CUMMULATIVE]);
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

  getFdCummApplicationById() {
    this.fdCumulativeApplicationService.getFdCummApplicationById(this.fdCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.fdCumulativeApplicationModel = this.responseModel.data[0];
          if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined) {
            this.fdCumulativeApplicationModel.depositDate = this.datePipe.transform(this.fdCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
          }
          if (this.fdCumulativeApplicationModel.maturityDate != null && this.fdCumulativeApplicationModel.maturityDate != undefined) {
            this.fdCumulativeApplicationModel.maturityDate = this.datePipe.transform(this.fdCumulativeApplicationModel.maturityDate, this.orgnizationSetting.datePipe);
          }
          this.tenureCheck();
          this.interestPayoutCheck();
          this.renewalCheck();
          if (this.fdCumulativeApplicationModel.memberTypeName != null && this.fdCumulativeApplicationModel.memberTypeName != undefined) {
            this.memberTypeName = this.fdCumulativeApplicationModel.memberTypeName;
            this.memberTypeCheck(this.memberTypeName);
            if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.fdCumulativeApplicationModel.accountTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
            }
          }
          if (this.responseModel.data[0].memberTypeName == MemberShipTypesData.INDIVIDUAL) {
            if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.age != null && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.age != undefined && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.age < 18) {
              this.guardainFormEnable = true;
            }
          }
          if (this.fdCumulativeApplicationModel.signedCopyPath != null && this.fdCumulativeApplicationModel.signedCopyPath != undefined) {
            this.fdCumulativeApplicationModel.multipartFileListsignedCopyPath = this.fileUploadService.getFile(this.fdCumulativeApplicationModel.signedCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeApplicationModel.signedCopyPath);
            this.isDisableSubmit = false;
          }else{
            this.isDisableSubmit = true;
          } 
          //membership details
          if (this.fdCumulativeApplicationModel != null && this.fdCumulativeApplicationModel != undefined) {
            this.membershipBasicDetails();//individual
            this.groupDetails();//group
            this.InstitutionDetails();//institution

            //required documents
            if (this.fdCumulativeApplicationModel.fdCummulativeRequiredDocumentDetailsDTOList != null && this.fdCumulativeApplicationModel.fdCummulativeRequiredDocumentDetailsDTOList != undefined && this.fdCumulativeApplicationModel.fdCummulativeRequiredDocumentDetailsDTOList.length > 0) {
              this.requiredDocumentsList = this.fdCumulativeApplicationModel.fdCummulativeRequiredDocumentDetailsDTOList;
              for (let document of this.requiredDocumentsList) {
                if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                  document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
                }
              }
            }
            //kyc list
            if (this.fdCumulativeApplicationModel.fdCummulativeAccountKycList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountKycList != undefined) {
              this.kycGridList = this.fdCumulativeApplicationModel.fdCummulativeAccountKycList;
              for (let kyc of this.kycGridList) {
                if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                  if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                    if (this.fdCumulativeApplicationModel.isNewMember)
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
            if (this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList != undefined &&
              this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList[0] != undefined)
              this.fdCumulativeCommunicationModel = this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationList[0];

            //nominee details
            if (this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList != undefined &&
              this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0] != undefined)
              this.nomineeDetailsModel = this.fdCumulativeApplicationModel.fdCummulativeAccountNomineeList[0];
              if (this.nomineeDetailsModel.nomineeDob != null && this.nomineeDetailsModel.nomineeDob != undefined) {
                this.nomineeDetailsModel.nomineeDobVal = this.datePipe.transform(this.nomineeDetailsModel.nomineeDob, this.orgnizationSetting.datePipe);
              }
            if (this.nomineeDetailsModel.nomineeFilePath != null && this.nomineeDetailsModel.nomineeFilePath != undefined) {
              this.nomineeDetailsModel.nomineeSighnedFormMultiPartList = this.fileUploadService.getFile(this.nomineeDetailsModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.nomineeDetailsModel.nomineeFilePath);
            }
            if (this.nomineeDetailsModel.nomineeAge < 18) {
              this.guardainFormEnable = true;
            }
            //guardian
            if (this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList != undefined &&
              this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0] != null && this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0] != undefined)
              this.memberGuardianDetailsModel = this.fdCumulativeApplicationModel.fdCummulativeAccountGaurdianList[0];
            if (this.memberGuardianDetailsModel.uploadFilePath != null && this.memberGuardianDetailsModel.uploadFilePath != undefined) {
              this.memberGuardianDetailsModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModel.uploadFilePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModel.uploadFilePath);
            }
            //joint holder
            if (this.fdCumulativeApplicationModel.accountTypeName != null && this.fdCumulativeApplicationModel.accountTypeName != undefined && this.fdCumulativeApplicationModel.accountTypeName === "Joint") {
              this.jointHoldersFlag = true;
            }
            //joint holder
            if (this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList != null && this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList != undefined && this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList.length > 0) {
              this.jointHoldersFlag = true;
              this.jointHolderDetailsList = this.fdCumulativeApplicationModel.fdCummulativeJointAccHolderDetailsDTOList;
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
    this.router.navigate([termdeposittransactionconstant.FD_CUMM_APPLICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  communicationEdit(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.FD_CUMM_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  kycEdit(rowData: any) {
    if (this.isNewMember) {
      this.router.navigate([termdeposittransactionconstant.FD_CUMM_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
    else {
      this.router.navigate([termdeposittransactionconstant.MEMBERSHIP_DETAIL], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });

    }
  }

  nomineeEdit(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.TERMDEPOST_FD_CUMULATIVE_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id), preview: this.encryptDecryptService.encrypt(true) } });
  }


  editMembership(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.NEW_MEMBERSHIPS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editJointHolder(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.TERMDEPOST_FD_CUMULATIVE_JOINTHOLDERDETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editRequiredDocuments(rowData: any) {
    this.router.navigate([termdeposittransactionconstant.TERMDEPOST_FD_CUMULATIVE_REQUIRED_DOCUMENT], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
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
    if (this.isEdit && this.fdCumulativeApplicationModel.filesDTOList == null || this.fdCumulativeApplicationModel.filesDTOList == undefined) {
      this.fdCumulativeApplicationModel.filesDTOList = [];
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
        this.fdCumulativeApplicationModel.multipartFileListsignedCopyPath = [];
        this.fdCumulativeApplicationModel.filesDTOList.push(files);
        this.fdCumulativeApplicationModel.signedCopyPath = null;
        this.fdCumulativeApplicationModel.filesDTOList[this.fdCumulativeApplicationModel.filesDTOList.length - 1].fileName = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.fdCumulativeApplicationModel.signedCopyPath = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
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
    if (this.fdCumulativeApplicationModel.filesDTOList != null && this.fdCumulativeApplicationModel.filesDTOList != undefined && this.fdCumulativeApplicationModel.filesDTOList.length > 0) {
      let removeFileIndex = this.fdCumulativeApplicationModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdCumulativeApplicationModel.signedCopyPath);
      this.fdCumulativeApplicationModel.filesDTOList.splice(removeFileIndex, 1);
      this.fdCumulativeApplicationModel.signedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }
  pdfDownload() {
    this.commonComponent.startSpinner();
    this.fdCumulativeApplicationService.downloadPreviewPDf(this.fdCummulativeAccId).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "Fd_cummulative_application_filled_Document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'Fd Cummulative application file downloaded successfully' });
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: "error", detail: 'Unable to download filled FHR' });
    })

  }

  membershipBasicDetails() {
    if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != null) {
      this.membershipBasicRequiredDetailsModel = this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO;
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
        this.isStaff = applicationConstants.TRUE;
      }
      else {
        this.isStaff = applicationConstants.FALSE;
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
    if (this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO != undefined && this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO != null) {
      this.memberGroupDetailsModel = this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO;
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
    if (this.fdCumulativeApplicationModel.memInstitutionDTO != undefined && this.fdCumulativeApplicationModel.memInstitutionDTO != null) {
      this.membershipInstitutionDetailsModel = this.fdCumulativeApplicationModel.memInstitutionDTO;
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
    /**
   * @implements check for years,months,days to show and hide based on tenuretype
   * @author bhargavi
   */
    tenureCheck() {
      const tenureType = this.fdCumulativeApplicationModel.tenureType;
      this.yearFlag = tenureType === 2 || tenureType === 5 || tenureType === 6 || tenureType === 7 ? true : false;
      this.monthFlag = tenureType === 3 || tenureType === 4 || tenureType === 6 || tenureType === 7 ? true : false;
      this.daysFlag = tenureType === 1 || tenureType === 4 || tenureType === 5 || tenureType === 7 ? true : false;
    }
  
    /**
     * @implements check for paymenttype show and hide based on interestPayoutType
     * @author bhargavi
     */
    interestPayoutCheck() {
      const interestPayoutType = this.fdCumulativeApplicationModel.interestPayoutType;
      this.interestPayoutFlag = interestPayoutType === 3 ? true : false;
    }
    
    /**
     * @implements check for autorenewal show and hide based on renewalType
     * @author bhargavi
     */
    renewalCheck() {
      const renewalType = this.fdCumulativeApplicationModel.isAutoRenewal;
      this.renewalFlag = renewalType === true ? true : false;
    }
}
