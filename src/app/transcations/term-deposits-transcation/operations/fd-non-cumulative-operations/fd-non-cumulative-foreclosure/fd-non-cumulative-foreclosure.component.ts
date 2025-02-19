import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdNonCumulativeApplication } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { NewMembershipAdd } from '../../../fd-cumulative/fd-cumulative-stepper/new-membership-add/shared/new-membership-add.model';
import { GroupPromoterDetailsModel, MemberGroupDetailsModel, MembershipInstitutionDetailsModel } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/new-membership-add/shared/new-membership-add.model';
import { FdNonCummulativeInterestPayment, FdNonCummulativeTransaction } from '../fd-non-cumulative-interest-payment/shared/fd-non-cummulative-interest-payment.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { FdNonCumulativeApplicationService } from '../../../fd-non-cumulative/fd-non-cumulative-stepper/fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { FdNonCummulativeInterestPaymentService } from '../fd-non-cumulative-interest-payment/shared/fd-non-cummulative-interest-payment.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';

@Component({
  selector: 'app-fd-non-cumulative-foreclosure',
  templateUrl: './fd-non-cumulative-foreclosure.component.html',
  styleUrls: ['./fd-non-cumulative-foreclosure.component.css']
})
export class FdNonCumulativeForeclosureComponent {
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
  membershipBasicRequiredDetailsModel: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: GroupPromoterDetailsModel = new GroupPromoterDetailsModel();
  interestPaymentModel: FdNonCummulativeInterestPayment = new FdNonCummulativeInterestPayment();
  fdNonCummulativeTransactionModel: FdNonCummulativeTransaction = new FdNonCummulativeTransaction();
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
  transaction: any[]= [];
  accountTransactionList : any[] =[];
  termAccId: any;
  verifiedList: any[] = [];
  reasonList: any[]=[];
  transactionForm: FormGroup;
  // closureForm:FormGroup;
  // foreclosureForm:FormGroup;
  currentDate: any;
  isForeclosure: boolean = false;
  isClosure: boolean = false;
  statusTypesList: any[] = [];
  check: boolean = false;

  constructor(private router: Router,
    private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder:FormBuilder,
    private interestPaymentService: FdNonCummulativeInterestPaymentService,
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
    // this.foreclosureForm = this.formBuilder.group({
    //   foreClosureDate: new FormControl({ value: '', disabled: true }),
    //   reason: new FormControl(''),
    //   penalityAmount: new FormControl({ value: '', disabled: true }),
    //   balanceAmount: new FormControl({ value: '', disabled: true }),
    //   transactionMode: new FormControl({ value: '', disabled: true }),
    //   isVerified: new FormControl(''),
    //   remarks: new FormControl(''),
    //   accountStatusName: new FormControl('')
    // })
    // this.closureForm = this.formBuilder.group({
    //   closureDate: new FormControl({ value: '', disabled: true }),
    //   maturityAmount: new FormControl(''),
    //   transactionMode: new FormControl({ value: '', disabled: true }),
    //   isVerified: new FormControl(''),
    //   remarks: new FormControl(''),
    //   accountStatusName: new FormControl('')
    // })
    this.transactionForm = this.formBuilder.group({
      transactionDate : new FormControl({ value: '', disabled: true }),
      interestPostingDate: new FormControl(''),
      transactionAmount: new FormControl(''),
      transactionMode: new FormControl('', [Validators.required]),
      accountNumber: new FormControl(''),
      isVerified:new FormControl('', [Validators.required]),
      remarks: new FormControl(''),
      // fileUpload: new FormControl('')
    })
  }

  ngOnInit() {
    this.interestPayment = [
      { field: 'interestPostingDate', header: 'TERMDEPOSITSTRANSACTION.INTEREST_PAYMENT_DATE' },
      { field: 'transactionModeName', header: 'TERMDEPOSITSTRANSACTION.PAYMENT_MODE' },
      { field: 'interestAmount', header: 'TERMDEPOSITSTRANSACTION.INTEREST_AMOUNT' },
      { field: 'transcationDate', header: 'TERMDEPOSITSTRANSACTION.PAID_DATE' },
      { field: 'statusName', header: 'TERMDEPOSITSTRANSACTION.STATUS' },
    ];
    this.transaction = [
      { field: 'transactionDate', header: 'TERMDEPOSITSTRANSACTION.INTEREST_PAYMENT_DATE' },
      { field: 'transactionTypeName', header: 'TERMDEPOSITSTRANSACTION.PAYMENT_TYPE' },
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
      this.currentDate = new Date();
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
          const currentDate = new Date();
          let currentDateLong = this.commonFunctionsService.getUTCEpoch(new Date(currentDate));
          if(this.fdNonCumulativeApplicationModel.maturityDate < currentDateLong){
            this.check = false;
          }else{
            this.check = true;
          }
          if (this.fdNonCumulativeApplicationModel.maturityDate != null && this.fdNonCumulativeApplicationModel.maturityDate != undefined) {
            this.fdNonCumulativeApplicationModel.maturityDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.maturityDate, this.orgnizationSetting.datePipe);
          }
          // this.check = this.fdNonCumulativeApplicationModel.maturityDate < this.currentDate? true:false;

          this.fdNonCummulativeTransactionModel.transactionDate = new Date();
          if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined) {
            this.fdNonCumulativeApplicationModel.depositDate = this.datePipe.transform(this.fdNonCumulativeApplicationModel.depositDate, this.orgnizationSetting.datePipe);
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
          if (this.fdNonCumulativeApplicationModel.interestPaymentsList != null && this.fdNonCumulativeApplicationModel.interestPaymentsList != undefined) {
            this.interestPaymentList = this.fdNonCumulativeApplicationModel.interestPaymentsList;
            for( let payment of this.interestPaymentList){
              if(payment.interestPostingDate != null && payment.interestPostingDate != undefined){
                payment.interestPostingDate = this.datePipe.transform(payment.interestPostingDate, this.orgnizationSetting.datePipe);
              }
              if(payment.transactionDate != null && payment.transactionDate != undefined){
                payment.transactionDate = this.datePipe.transform(payment.transactionDate, this.orgnizationSetting.datePipe);
              }
            }
          }

          if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList != undefined) {
            this.accountTransactionList = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList;
            for( let transactionPayment of this.accountTransactionList){
              if(transactionPayment.transactionDate != null && transactionPayment.transactionDate != undefined){
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
  // updateFdNonCummulativeDetails(fdNonCumulativeApplicationModel: any) {
  //   // this.fdNonCumulativeApplicationModel.statusName = CommonStatusData.FORECLOSURE;
  //   if (this.fdNonCumulativeApplicationModel.closureDate != null && this.fdNonCumulativeApplicationModel.closureDate != undefined) {
  //     this.fdNonCumulativeApplicationModel.closureDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.closureDate));
  //   }
  //   if (this.fdNonCumulativeApplicationModel.foreClosureDate != null && this.fdNonCumulativeApplicationModel.foreClosureDate != undefined) {
  //     this.fdNonCumulativeApplicationModel.foreClosureDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.foreClosureDate));
  //   }
  //   if (this.fdNonCumulativeApplicationModel.depositDate != null && this.fdNonCumulativeApplicationModel.depositDate != undefined) {
  //     this.fdNonCumulativeApplicationModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.depositDate));
  //   }
  //   if(this.fdNonCumulativeApplicationModel.interestPaymentsList[0].interestPostingDate != null && this.fdNonCumulativeApplicationModel.interestPaymentsList[0].interestPostingDate != undefined) {
  //     this.fdNonCumulativeApplicationModel.interestPaymentsList.interestPostingDate = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.interestPaymentsList[0].interestPostingDate));
  //   }
  //   if(this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList.transactionDate != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList.transactionDate  != undefined) {
  //     this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList.transactionDate  = this.commonFunctionsService.getUTCEpoch(new Date(this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountsTransactionDTOList.transactionDate ));
  //   }
  //   this.fdNonCumulativeApplicationService.updateFdNonCummApplication(fdNonCumulativeApplicationModel).subscribe((response: any) => {
  //     this.responseModel = response;
  //     if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
  //       if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
  //         this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
  //         this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
  //         setTimeout(() => {
  //           this.msgs = [];
  //         }, 1200);
  //         this.getFdNonCummApplicationById(this.id);
  //       }
  //     }
  //   }, (error: any) => {
  //     this.commonComponent.stopSpinner();
  //     this.getFdNonCummApplicationById(this.id);
  //     this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
  //     setTimeout(() => {
  //       this.msgs = [];
  //     }, 3000);
  //   });
  // }

      saveFdNonCummulativeTransaction(fdNonCummulativeTransactionModel: any) {
      this.termAccId = this.fdNonCummulativeAccId;
      fdNonCummulativeTransactionModel.transcationDate = this.fdNonCummulativeTransactionModel.transactionDate;
      this.fdNonCummulativeTransactionModel.termAccId = this.termAccId;
      if (fdNonCummulativeTransactionModel.interestPostingDate != null && fdNonCummulativeTransactionModel.interestPostingDate != undefined) {
        fdNonCummulativeTransactionModel.interestPostingDate = this.commonFunctionsService.getUTCEpoch(new Date(fdNonCummulativeTransactionModel.interestPostingDate));
      }
      if (fdNonCummulativeTransactionModel.transactionDate != null && fdNonCummulativeTransactionModel.transactionDate != undefined) {
        fdNonCummulativeTransactionModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(fdNonCummulativeTransactionModel.transactionDate));
      }
      this.fdNonCummulativeTransactionModel.transactionMode = this.transactionForm.get('transactionMode')?.value.value;
      this.fdNonCummulativeTransactionModel.isVerified = this.transactionForm.get('isVerified')?.value.value;
      if (fdNonCummulativeTransactionModel.id != null && fdNonCummulativeTransactionModel.id != undefined) {
        this.interestPaymentService.updateFdNonCumTransaction(fdNonCummulativeTransactionModel).subscribe((data: any) => {
          this.responseModel = data;
          if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.fdNonCummulativeTransactionModel = this.responseModel.data[0];
                this.msgs = [];
                this.commonComponent.stopSpinner();
                this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
                setTimeout(() => {
                  this.msgs = [];
                }, 2000);
              }
            }
            this.getFdNonCummApplicationById(this.id);
            this.backbutton();
          }
          else {
            this.msgs = [];
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
      else {
        // fdNonCummulativeTransactionModel.status = applicationConstants.ACTIVE;
        this.interestPaymentService.addFdNonCumTransaction(fdNonCummulativeTransactionModel).subscribe((data: any) => {//create or save
          this.responseModel = data;
          if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.msgs = [];
                this.commonComponent.stopSpinner();
                this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
                setTimeout(() => {
                  this.msgs = [];
                }, 2000);
                // this.getInterestPayment(this.accountNumber);
              }
            }
            this.getFdNonCummApplicationById(this.id);
            this.backbutton();
          }
          else {
            this.msgs = [];
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
    this.fdNonCumulativeApplicationModel.filesDTOList = [];
    this.fdNonCumulativeApplicationModel.foreClosureReqSignedCopy = null;
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        this.isFileUploaded = applicationConstants.TRUE;
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.fdNonCumulativeApplicationModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.fdNonCumulativeApplicationModel.filesDTOList[0].fileName = "FD_NON_KYC_" + this.termAccId + "_" +timeStamp+ "_"+ file.name ;
        this.fdNonCumulativeApplicationModel.foreClosureReqSignedCopy = "FD_NON_KYC_" + this.termAccId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
}
