import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdNonCumulativeApplication } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { GroupPromoterDetailsModel, MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/new-membership-add/shared/new-membership-add.model';
import { FdNonCummulativeInterestPayment, FdNonCummulativeTransaction } from '../fd-non-cumulative-interest-payment/shared/fd-non-cummulative-interest-payment.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FdNonCumulativeApplicationService } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { FdNonCummulativeInterestPaymentService } from '../fd-non-cumulative-interest-payment/shared/fd-non-cummulative-interest-payment.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FdNonCumulativeCommunication } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-communication/shared/fd-non-cumulative-communication.model';
import { FdNonCumulativeKyc } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-kyc/shared/fd-non-cumulative-kyc.model';
import { FdNonCumulativeNominee, MemberGuardianDetailsModelDetails } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-nominee/shared/fd-non-cumulative-nominee.model';

@Component({
  selector: 'app-fd-non-cumulative-renewal',
  templateUrl: './fd-non-cumulative-renewal.component.html',
  styleUrls: ['./fd-non-cumulative-renewal.component.css']
})
export class FdNonCumulativeRenewalComponent {
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
  newFdNonCumulativeApplicationModel: FdNonCumulativeApplication = new FdNonCumulativeApplication();
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
  interestPaymentModel: FdNonCummulativeInterestPayment = new FdNonCummulativeInterestPayment();
  fdNonCummulativeTransactionModel: FdNonCummulativeTransaction = new FdNonCummulativeTransaction();
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
  productId: any;
  transactionModelist: any[] = [];
  showSbAccountNumber: boolean = false;
  position: string = 'center';
  paymentOptions = [
    { label: 'Cash', value: 'cash' },
    // { label: 'To SB Account', value: 'sbAccount' },
  ];
  isBasicDetails: boolean = false;
  isHistory: boolean = false;
  interestPayment: any[] = [];
  interestPaymentList: any[] = [];
  transaction: any[] = [];
  accountTransactionList: any[] = [];
  termAccId: any;
  verifiedList: any[] = [];
  reasonList: any[] = [];
  // transactionForm: FormGroup;
  // closureForm:FormGroup;
  // foreclosureForm:FormGroup;
  currentDate: any;
  isForeclosure: boolean = false;
  isClosure: boolean = false;
  statusTypesList: any[] = [];
  check: boolean = false;
  renewalForm: FormGroup;
  renewalTypeList: any[] = [];
  selectedRenewalType = null;
  renewalFLag: boolean = false;
  //flags for application details
  yearFlag: boolean = false;
  monthFlag: boolean = false;
  daysFlag: boolean = false;
  interestPayoutFlag: boolean = false;
  renewalTypeFlag: boolean = false;
  interestFrequencyFlag: boolean = false;
  maturityFlag: boolean = false;

  constructor(private router: Router,
    private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private interestPaymentService: FdNonCummulativeInterestPaymentService,
    private encryptDecryptService: EncryptDecryptService, private translate: TranslateService,
    private commonFunctionsService: CommonFunctionsService,
    private fileUploadService: FileUploadService) {

    this.kycDetailsColumns = [
      { field: 'effStartDate', header: 'Approved Date' },
      { field: 'statusName', header: 'Status Name' },
      { field: 'docPath', header: 'Documents' },
    ];
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
    this.renewalForm = this.formBuilder.group({
      transactionDate: new FormControl({ value: '', disabled: true }),
      transactionAmount: new FormControl({ value: '', disabled: true }),
      transactionType: new FormControl('',),
      transactionMode: new FormControl('', [Validators.required]),
      accountNumber: new FormControl(''),
      isVerified: new FormControl('', [Validators.required]),
      remarks: new FormControl(''),
    })
  }

  ngOnInit() {
    this.renewalTypeList = [
      { label: "Principal", value: 1 },
      { label: "Principle+Intrest", value: 2 },
      { label: "Manual Renewal Amount", value: 3 },
    ]
    // this.interestPayment = [
    //   { field: 'interestPostingDate', header: 'TERMDEPOSITSTRANSACTION.INTEREST_PAYMENT_DATE' },
    //   { field: 'transactionMode', header: 'TERMDEPOSITSTRANSACTION.PAYMENT_MODE' },
    //   { field: 'interestAmount', header: 'TERMDEPOSITSTRANSACTION.INTEREST_AMOUNT' },
    //   { field: 'transcationDate', header: 'TERMDEPOSITSTRANSACTION.PAID_DATE ' },
    //   { field: 'statusName', header: 'TERMDEPOSITSTRANSACTION.STATUS' },
    // ];
    this.transaction = [
      { field: 'transactionDate', header: 'TERMDEPOSITSTRANSACTION.INTEREST_PAYMENT_DATE' },
      { field: 'transactionType', header: 'TERMDEPOSITSTRANSACTION.PAYMENT_TYPE' },
      { field: 'transactionModeName', header: 'TERMDEPOSITSTRANSACTION.PAYMENT_MODE' },
      { field: 'transactionAmount', header: 'TERMDEPOSITSTRANSACTION.INTEREST_AMOUNT' },
      { field: 'statusName', header: 'TERMDEPOSITSTRANSACTION.STATUS' },
    ];
    this.roleName = this.commonFunctionsService.getStorageValue(applicationConstants.roleName);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.verifiedList = this.commonComponent.requiredlist();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.fdNonCummulativeAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getFdNonCummApplicationById(this.fdNonCummulativeAccId);
      }
      // if (params['flag'] != undefined && params['flag'] != null) {
      //   let isGrid = this.encryptDecryptService.decrypt(params['flag']);
      //   if (isGrid === "0") {
      //     this.isClosure = true;
      //   } else {
      //     this.isForeclosure = true;
      //   }
      // }
      // this.currentDate = new Date();
    });
    this.getAllTransactionModes();
  }

  backbutton() {
    this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE]);
  }


  getFdNonCummApplicationById(id: any) {
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(this.fdNonCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
          this.tenureCheck();
          this.interestFrequencyCheck();
          this.interestPayoutCheck();
          this.renewalCheck();
          this.fdNonCummulativeTransactionModel.transactionDate = new Date();
          if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined) {
            this.fdNonCumulativeApplicationModel.depositDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
          }
          if (this.fdNonCumulativeApplicationModel.maturityDate != null && this.fdNonCumulativeApplicationModel.maturityDate != undefined) {
            this.fdNonCumulativeApplicationModel.maturityDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.maturityDate, this.orgnizationSetting.datePipe);
          }
          if (this.fdNonCumulativeApplicationModel.admissionNumber != null && this.fdNonCumulativeApplicationModel.admissionNumber != undefined) {
            this.admissionNumber = this.fdNonCumulativeApplicationModel.admissionNumber;
          }
          if (this.fdNonCumulativeApplicationModel.accountNumber != null && this.fdNonCumulativeApplicationModel.accountNumber != undefined) {
            this.fdNonCummulativeTransactionModel.accountNumber = this.fdNonCumulativeApplicationModel.accountNumber;
            this.accountNumber = this.fdNonCumulativeApplicationModel.accountNumber;
            this.termAccId = this.fdNonCummulativeAccId;
            // this.getAllPaymentsByAccountIdAndAccountNumber();
          }
          if (this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId != undefined) {
            this.productId = this.fdNonCumulativeApplicationModel.fdNonCummulativeproductId;
          }

          if (this.fdNonCumulativeApplicationModel.memberTypeName != null && this.fdNonCumulativeApplicationModel.memberTypeName != undefined) {
            this.memberTypeName = this.fdNonCumulativeApplicationModel.memberTypeName;
            this.memberTypeCheck(this.memberTypeName);
            if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.fdNonCumulativeApplicationModel.accountTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
            }
          }

          if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList != undefined) {
            this.accountTransactionList = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList;
            for (let transactionPayment of this.accountTransactionList) {
              if (transactionPayment.transactionDate != null && transactionPayment.transactionDate != undefined) {
                transactionPayment.transactionDate = this.datePipe.transform(transactionPayment.transactionDate, this.orgnizationSetting.datePipe);
              }
            }
          }
          // this.fdNonCumulativeApplicationModel.foreClosureDate = new Date();
          //membership details
          if (this.fdNonCumulativeApplicationModel != null && this.fdNonCumulativeApplicationModel != undefined) {
            this.membershipBasicDetails();//individual
            this.groupDetails();//group
            this.InstitutionDetails();//institution
          }

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

  getAllTransactionModes() {
    this.interestPaymentService.getAllTransactionModes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.transactionModelist = this.responseModel.data;
        this.transactionModelist = this.transactionModelist.filter((obj: any) => obj.status == applicationConstants.ACTIVE).map((transactionMode: { name: any; id: any; }) => {
          return { label: transactionMode.name, value: transactionMode.id };
        });
      }
    });
  }

  onPaymentTypeChange(element: any): void {
    // const selectedValue = event.target.value;
    if (element.value.value === 'sbAccount') {
      this.showSbAccountNumber = true;
    } else {
      this.showSbAccountNumber = false;
    }
  }


  // {@code update  application details by id} :
  // @implNote:update  application details by  Id
  // @author bhargavi
  saveAccountOnRenewal(newFdNonCumulativeApplicationModel: any) {
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTO = this.setTransactionFields();
    if (newFdNonCumulativeApplicationModel.depositDate != null && newFdNonCumulativeApplicationModel.depositDate != undefined) {
      newFdNonCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(newFdNonCumulativeApplicationModel.depositDate));
    }
    this.fdNonCumulativeApplicationService.saveAccountOnRenewal(this.newFdNonCumulativeApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.getFdNonCummApplicationById(this.id);
        }
      }
      this.router.navigate([termdeposittransactionconstant.FD_NON_CUMMULATIVE]);
    }, (error: any) => {
      this.commonComponent.stopSpinner();
      this.getFdNonCummApplicationById(this.id);
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  showHistoryDialog(position: string) {
    this.position = position;
    this.isHistory = true;
    if (this.isBasicDetails)
      this.isBasicDetails = false;
  }
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }

  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.fdNonCummulativeTransactionModel.filesDTOList == null || this.fdNonCummulativeTransactionModel.filesDTOList == undefined) {
      this.fdNonCummulativeTransactionModel.filesDTOList = [];
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
        this.fdNonCummulativeTransactionModel.multipartFileList = [];
        this.fdNonCummulativeTransactionModel.filesDTOList.push(files);
        this.fdNonCummulativeTransactionModel.signedCopyPath = null;
        this.fdNonCummulativeTransactionModel.filesDTOList[this.fdNonCummulativeTransactionModel.filesDTOList.length - 1].fileName = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.fdNonCummulativeTransactionModel.signedCopyPath = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.isDisableSubmit = false;
      }
      reader.readAsDataURL(file);
    }
  }

  setTransactionFields() {
    this.newFdNonCumulativeApplicationModel = new FdNonCumulativeApplication();
    this.newFdNonCumulativeApplicationModel = this.fdNonCumulativeApplicationModel;

    if (this.fdNonCummulativeTransactionModel.transactionDate != null && this.fdNonCummulativeTransactionModel.transactionDate != undefined) {
      this.fdNonCummulativeTransactionModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCummulativeTransactionModel.transactionDate));
    }
    let fdNonCummulativeAccountsTransactionDTO = this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList[0]
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTO = fdNonCummulativeAccountsTransactionDTO;
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTO.transactionDate = this.fdNonCummulativeTransactionModel.transactionDate;
    this.newFdNonCumulativeApplicationModel.renewalType = this.fdNonCummulativeTransactionModel.transactionType.value;
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTO.transactionAmount = this.fdNonCummulativeTransactionModel.transactionAmount;
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTO.isVerified = this.fdNonCummulativeTransactionModel.isVerified.value;
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTO.signatureCopyPath = this.fdNonCummulativeTransactionModel.signedCopyPath;
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTO.remarks = this.fdNonCummulativeTransactionModel.remarks;
    this.newFdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList = [];
  }


  onRenewalTypeChange(renewalType: any) {
    if(renewalType.value == 1){
      this.renewalFLag = false;
      this.fdNonCummulativeTransactionModel.transactionAmount = this.fdNonCumulativeApplicationModel.depositAmount; 
    }else if(renewalType.value == 2){
      this.renewalFLag = false;
      this.fdNonCummulativeTransactionModel.transactionAmount = this.fdNonCumulativeApplicationModel.maturityAmount;
    }else if(renewalType.value == 3){
      // this.fdNonCummulativeTransactionModel.transactionAmount; // Allow manual entry
      this.renewalFLag = true;
    }
  }

     /**
 * @implements check for years,months,days to show and hide based on tenuretype
 * @author bhargavi
 */
     tenureCheck() {
      const tenureType = this.fdNonCumulativeApplicationModel.tenureType;
      this.yearFlag = tenureType === 2 || tenureType === 5 || tenureType === 6 || tenureType === 7 ? true : false;
      this.monthFlag = tenureType === 3 || tenureType === 4 || tenureType === 6 || tenureType === 7 ? true : false;
      this.daysFlag = tenureType === 1 || tenureType === 4 || tenureType === 5 || tenureType === 7 ? true : false;
    }
  
    /**
     * @implements check for paymenttype show and hide based on interestPayoutType
     * @author bhargavi
     */
    interestPayoutCheck() {
      const interestPayoutType = this.fdNonCumulativeApplicationModel.interestPayoutType;
      this.interestPayoutFlag = interestPayoutType === 3 ? true : false;
    }
  
    /**
     * @implements check for renewalType show and hide based on autorenewal
     * @author bhargavi
     */
    renewalCheck() {
      const renewalType = this.fdNonCumulativeApplicationModel.isAutoRenewal;
      this.renewalTypeFlag = renewalType === true ? true : false;
    }
  
    /**
  * @implements check for interest payment to show and hide based on interestPaymentFrequency
  * @author bhargavi
  */
    interestFrequencyCheck() {
      const interestPaymentFrequency = this.fdNonCumulativeApplicationModel.interestPaymentFrequencyId;
      this.interestFrequencyFlag = interestPaymentFrequency === 1 || interestPaymentFrequency === 2 || interestPaymentFrequency === 3 || 
      interestPaymentFrequency === 4 || interestPaymentFrequency === 5 ? true : false;
      this.maturityFlag =  interestPaymentFrequency === 6 ? true : false;
    }
  
}
