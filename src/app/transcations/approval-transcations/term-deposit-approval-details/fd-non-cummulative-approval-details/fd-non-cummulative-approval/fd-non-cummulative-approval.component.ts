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
import { FdNonCumulativeApplication } from 'src/app/transcations/term-deposits-transcation/fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { FdNonCumulativeApplicationService } from 'src/app/transcations/term-deposits-transcation/fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { FdNonCumulativeCommunication } from 'src/app/transcations/term-deposits-transcation/fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-communication/shared/fd-non-cumulative-communication.model';
import { FdNonCumulativeKyc } from 'src/app/transcations/term-deposits-transcation/fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-kyc/shared/fd-non-cumulative-kyc.model';
import { FdNonCumulativeNominee, MemberGuardianDetailsModelDetails } from 'src/app/transcations/term-deposits-transcation/fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-nominee/shared/fd-non-cumulative-nominee.model';
import { GroupPromoterDetailsModel, MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from 'src/app/transcations/term-deposits-transcation/fd-non-cumulative/fd-non-cumulative-stepper/new-membership-add/shared/new-membership-add.model';
import { approvaltransactionsconstant } from '../../../approval-transactions-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonCategoryService } from 'src/app/configurations/loan-config/common-category/shared/common-category.service';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-fd-non-cummulative-approval',
  templateUrl: './fd-non-cummulative-approval.component.html',
  styleUrls: ['./fd-non-cummulative-approval.component.css']
})
export class FdNonCummulativeApprovalComponent {
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
  kycDetailsColumns: any[]= [];
  serviceTypesColumns: any[]= [];
  serviceTypesGridList :any [] = [];
  nomineeMemberFullName: any;
  editOption: boolean = false;
  memberTypeName: any;
  preveiwFalg: any;
  flag: boolean = false;
  gardianFullName: any;
  promoterDetails: any;
  institutionPromoter: any;
  memberBasicDetailsFalg: boolean = false;
  memberGroupFlag:boolean = false;
  memberIntitutionFlag:boolean = false;
  memberPromoterDetails : any
  groupPromoterList : any [] = [];
  isNewMember: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean= false;
  requiredDocumentsList: any [] = [];
  jointHolderDetailsList: any;
  jointHoldersFlag: boolean = false;
  
  groupPrmotersList: any[]=[];
  institutionPrmotersList: any[]=[];
  institutionPrmoters: any[] = [];
  groupPrmoters : any[] = [];
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  memberPhotoCopyZoom: boolean = false;
  membreIndividualFlag: boolean = false;
  isKycApproved : any;
  guardainFormEnable: boolean = false;
  isShowSubmit: boolean = applicationConstants.FALSE;
  amountblock: any[] = [];
  age: any;
  memberTypeList: any[] = [];

  viewButton: boolean = false;
  editFlag: boolean = false;
  isDisableSubmit: boolean = false;
  isStaff: any;
  isFileUploaded: any;
  multipleFilesList: any;
  uploadFileData: any;
  isEdit: any;
  statusList: any[] = [];
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
    private commonStatusService: CommonCategoryService,
    private encryptDecryptService: EncryptDecryptService, private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService: FileUploadService) { 
      this.institutionPrmoters = [
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
      this.getAllStatusList();
    }
  backbutton() {
    this.router.navigate([approvaltransactionsconstant.FD_NON_CUMMULATIVE_APPROVAL_TRANSACTION_DETAILS]);
  }

  submit() {
    // Determine the status name before submission
    if (this.fdNonCumulativeApplicationModel.status != null && this.fdNonCumulativeApplicationModel.status != undefined) {
      const statusName = this.statusList.find((data: any) => data != null && data.value === this.fdNonCumulativeApplicationModel.statusName);
      if (statusName != null && statusName != undefined) {
        this.fdNonCumulativeApplicationModel.statusName = statusName.label;
      }
    } else {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }

    if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined) {
      this.fdNonCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.depositDate));
    }
    if (this.fdNonCumulativeApplicationModel.maturityDate != null && this.fdNonCumulativeApplicationModel.maturityDate != undefined) {
      this.fdNonCumulativeApplicationModel.maturityDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.maturityDate));
    }
  
    this.fdNonCumulativeApplicationService.updateFdNonCummApplication(this.fdNonCumulativeApplicationModel).subscribe(
      (response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
            this.router.navigate([approvaltransactionsconstant.FD_NON_CUMMULATIVE_APPROVAL_TRANSACTION_DETAILS]);
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
      (error) => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    );
  }
  
  getFdNonCummApplicationById() {
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(this.fdNonCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
          if(this.fdNonCumulativeApplicationModel.statusName == CommonStatusData.SUBMISSION_FOR_APPROVAL){
            this.isDisableSubmit = true;
          }
          else{
            this.isDisableSubmit = false;
          }
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
   /**
 * @implements onFileremove from file value
 * @param fileName 
 * @author Bhargavi
 */
   fileRemoveEvent() {
     this.isFileUploaded = applicationConstants.FALSE;
     let removeFileIndex = this.fdNonCumulativeApplicationModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.fdNonCumulativeApplicationModel.signedCopyPath);
     let obj = this.fdNonCumulativeApplicationModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.fdNonCumulativeApplicationModel.signedCopyPath);
     this.fdNonCumulativeApplicationModel.filesDTOList.splice(removeFileIndex, 1);
     this.fdNonCumulativeApplicationModel.signedCopyPath = null;
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
         this.fdNonCumulativeApplicationModel.filesDTOList[this.fdNonCumulativeApplicationModel.filesDTOList.length - 1].fileName = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
         this.fdNonCumulativeApplicationModel.signedCopyPath = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
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
  // for submit button validation based on status
  onStatusChange(event: any) {
    if (this.fdNonCumulativeApplicationModel.statusName != null && this.fdNonCumulativeApplicationModel.statusName != undefined) {
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
            this.statusList = this.statusList.filter((obj: any) => obj != null && obj.name == CommonStatusData.REJECTED || obj.name == CommonStatusData.APPROVED ||
              obj.name == CommonStatusData.REQUEST_FOR_RESUBMISSION).map((status: { name: any; id: any; }) => {
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
