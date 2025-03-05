import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdCumulativeApplication } from '../../../fd-cumulative/fd-cumulative-stepper/fd-cumulative-application/shared/fd-cumulative-application.model';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../../../fd-cumulative/fd-cumulative-stepper/new-membership-add/shared/new-membership-add.model';
import { FdNonCummulativeInterestPayment } from '../../fd-non-cumulative-operations/fd-non-cumulative-interest-payment/shared/fd-non-cummulative-interest-payment.model';
import { FdCumulativeAccountTransaction } from '../shared/fd-cumulative-account-transaction.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FdCumulativeApplicationService } from '../../../fd-cumulative/fd-cumulative-stepper/fd-cumulative-application/shared/fd-cumulative-application.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { FdCumulativeAccountTransactionService } from '../shared/fd-cumulative-account-transaction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-fd-cumulative-renewal',
  templateUrl: './fd-cumulative-renewal.component.html',
  styleUrls: ['./fd-cumulative-renewal.component.css']
})
export class FdCumulativeRenewalComponent {
  responseModel!: Responsemodel;
  admissionNumber: any;
  msgs: any[] = [];
  id: any;
  fdCummulativeAccId: any;
  orgnizationSetting: any;
  veiwFalg: boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  addressOne: any;
  addressTwo: any;
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  membershipBasicRequiredDetailsModel: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  interestPaymentModel: FdNonCummulativeInterestPayment = new FdNonCummulativeInterestPayment();
  fdCummulativeTransactionModel: FdCumulativeAccountTransaction = new FdCumulativeAccountTransaction();
  newFdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();

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
  check: boolean = false;
  productId: any;
  renewalForm: FormGroup;
  renewalTypeList: any[] = [];
  renewalFLag: boolean = false;
  //application fields show hide flags
  yearFlag: boolean = false;
  monthFlag: boolean = false;
  daysFlag: boolean = false;
  interestPayoutFlag: boolean = false;
  renewalTypeFlag: boolean = false;

  constructor(private router: Router,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private fdCumulativeAccountTransactionService: FdCumulativeAccountTransactionService,
    private encryptDecryptService: EncryptDecryptService,
    private translate: TranslateService,
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
    this.renewalForm = this.formBuilder.group({
      transactionDate: new FormControl({ value: '', disabled: true }),
      transactionType: new FormControl(''),
      transactionAmount: new FormControl({ value: '', disabled: true }),
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
    //   { field: 'transactionModeName', header: 'TERMDEPOSITSTRANSACTION.PAYMENT_MODE' },
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
        this.fdCummulativeAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getFdCummApplicationById();
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
    this.router.navigate([termdeposittransactionconstant.FD_CUMMULATIVE]);
  }


  getFdCummApplicationById() {
    this.fdCumulativeApplicationService.getFdCummApplicationById(this.fdCummulativeAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.fdCumulativeApplicationModel = this.responseModel.data[0];
          this.tenureCheck();
          this.interestPayoutCheck();
          this.renewalCheck();
          this.fdCummulativeTransactionModel.transactionDate = new Date();
          if (this.fdCumulativeApplicationModel.depositDate != null && this.fdCumulativeApplicationModel.depositDate != undefined) {
            this.fdCumulativeApplicationModel.depositDate = this.datePipe.transform(this.fdCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
          }
          if (this.fdCumulativeApplicationModel.fdCummulativeProductId != null && this.fdCumulativeApplicationModel.fdCummulativeProductId != undefined) {
            this.productId = this.fdCumulativeApplicationModel.fdCummulativeProductId;
          }

          if (this.fdCumulativeApplicationModel.admissionNumber != null && this.fdCumulativeApplicationModel.admissionNumber != undefined) {
            this.admissionNumber = this.fdCumulativeApplicationModel.admissionNumber;
          }
          if (this.fdCumulativeApplicationModel.accountNumber != null && this.fdCumulativeApplicationModel.accountNumber != undefined) {
            this.fdCummulativeTransactionModel.accountNumber = this.fdCumulativeApplicationModel.accountNumber;
            this.accountNumber = this.fdCumulativeApplicationModel.accountNumber;
            this.termAccId = this.fdCummulativeAccId;
            // this.getAllPaymentsByAccountIdAndAccountNumber();
          }
          if (this.fdCumulativeApplicationModel.memberTypeName != null && this.fdCumulativeApplicationModel.memberTypeName != undefined) {
            this.memberTypeName = this.fdCumulativeApplicationModel.memberTypeName;
            this.memberTypeCheck(this.memberTypeName);
            if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.fdCumulativeApplicationModel.accountTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
            }
          }
          if (this.fdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTOList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTOList != undefined) {
            this.accountTransactionList = this.fdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTOList;
            for (let transactionPayment of this.accountTransactionList) {
              if (transactionPayment.transactionDate != null && transactionPayment.transactionDate != undefined) {
                transactionPayment.transactionDate = this.datePipe.transform(transactionPayment.transactionDate, this.orgnizationSetting.datePipe);
              }
            }
          }
          // this.fdCumulativeApplicationModel.foreClosureDate = new Date();
          //membership details
          if (this.fdCumulativeApplicationModel != null && this.fdCumulativeApplicationModel != undefined) {
            this.membershipBasicDetails();//individual
            this.groupDetails();//group
            this.InstitutionDetails();//institution
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
      if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
        if (this.membershipBasicRequiredDetailsModel.isNewMember) {
          this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
        }
        else {
          this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
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

  getAllTransactionModes() {
    this.fdCumulativeAccountTransactionService.getAllTransactionModes().subscribe((res: any) => {
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
  saveAccountOnRenewal(newFdCumulativeApplicationModel: any) {
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTOList = this.setTransactionFields();
    if (newFdCumulativeApplicationModel.depositDate != null && newFdCumulativeApplicationModel.depositDate != undefined) {
      newFdCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(newFdCumulativeApplicationModel.depositDate));
    }
    if (newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.transactionDate != null && newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.transactionDate != undefined) {
      newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.transactionDate));
    }
    this.fdCumulativeApplicationService.saveAccountOnRenewal(this.newFdCumulativeApplicationModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.newFdCumulativeApplicationModel = this.responseModel.data[0];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.getFdCummApplicationById();
        }
      }
      this.router.navigate([termdeposittransactionconstant.FD_CUMMULATIVE]);
    }, (error: any) => {
      this.commonComponent.stopSpinner();
      this.getFdCummApplicationById();
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
    if (this.isEdit && this.fdCummulativeTransactionModel.filesDTOList == null || this.fdCummulativeTransactionModel.filesDTOList == undefined) {
      this.fdCummulativeTransactionModel.filesDTOList = [];
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
        this.fdCummulativeTransactionModel.multipartFileList = [];
        this.fdCummulativeTransactionModel.filesDTOList.push(files);
        this.fdCummulativeTransactionModel.signedCopyPath = null;
        this.fdCummulativeTransactionModel.filesDTOList[this.fdCummulativeTransactionModel.filesDTOList.length - 1].fileName = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.fdCummulativeTransactionModel.signedCopyPath = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.isDisableSubmit = false;
      }
      reader.readAsDataURL(file);
    }
  }

  setTransactionFields() {
    this.newFdCumulativeApplicationModel = new FdCumulativeApplication();
    this.newFdCumulativeApplicationModel = this.fdCumulativeApplicationModel;

    if (this.fdCummulativeTransactionModel.transactionDate != null && this.fdCummulativeTransactionModel.transactionDate != undefined) {
      this.fdCummulativeTransactionModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdCummulativeTransactionModel.transactionDate));
    }
    let fdCummulativeAccountsTransactionDTO = this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTOList[0];
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO = fdCummulativeAccountsTransactionDTO;
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.transactionDate = this.fdCummulativeTransactionModel.transactionDate;
    this.newFdCumulativeApplicationModel.renewalType = this.fdCummulativeTransactionModel.transactionType.value;
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.transactionAmount = this.fdCummulativeTransactionModel.transactionAmount;
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.isVerified = this.fdCummulativeTransactionModel.isVerified.value;
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.signatureCopyPath = this.fdCummulativeTransactionModel.signedCopyPath;
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTO.remarks = this.fdCummulativeTransactionModel.remarks;
    this.newFdCumulativeApplicationModel.fdCummulativeAccountsTransactionDTOList = [];
  }

  onRenewalTypeChange(renewalType: any) {
    if (renewalType.value == 1) {
      this.renewalFLag = false;
      this.fdCummulativeTransactionModel.transactionAmount = this.fdCumulativeApplicationModel.depositAmount;
    } else if (renewalType.value == 2) {
      this.renewalFLag = false;
      this.fdCummulativeTransactionModel.transactionAmount = this.fdCumulativeApplicationModel.maturityAmount;
    } else if (renewalType.value == 3) {
      this.fdCummulativeTransactionModel.transactionAmount = [];
      this.renewalFLag = true;
    }
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
    const renewalType = this.fdCumulativeApplicationModel.renewalType;
    this.renewalTypeFlag = renewalType === 'true' ? true : false;
  }
}
