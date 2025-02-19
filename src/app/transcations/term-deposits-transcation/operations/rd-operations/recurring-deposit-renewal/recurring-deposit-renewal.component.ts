import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel, RdAccountGuardian, RdAccountNominee, RdKycModel } from '../../../shared/membership-basic-detail.model';
import { RdAccountCommunication, RdAccountsModel, RdRequiredDocuments } from '../../../shared/term-depost-model.model';
import { RdAccountTransaction } from '../shared/rd-account-transaction.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RdAccountsService } from '../../../shared/rd-accounts.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { RdAccountTransactionService } from '../shared/rd-account-transaction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-recurring-deposit-renewal',
  templateUrl: './recurring-deposit-renewal.component.html',
  styleUrls: ['./recurring-deposit-renewal.component.css']
})
export class RecurringDepositRenewalComponent {
  responseModel!: Responsemodel;
  adminssionNumber: any;
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
    newrdAccountsModel: RdAccountsModel = new RdAccountsModel();
    requiredDocumentDetails: RdRequiredDocuments = new RdRequiredDocuments();
    rdKycModel: RdKycModel = new RdKycModel();
    rdAccountNomineeModel: RdAccountNominee = new RdAccountNominee();
    rdAccountGuardianModel: RdAccountGuardian = new RdAccountGuardian();
    rdAccountTransactionModel:RdAccountTransaction = new RdAccountTransaction();
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
  isKycEmpty: boolean = false;
  isStaff: any;
  genderList: any[] = [];
  installmentfrequencyList: any[] =[];
  check: boolean = false;
  currentDate: any;
  termAccId: any;
  accountTransactionList: any[]=[];
  interestPaymentList: any[]=[];
  productId: any;
  interestPayment: any[] = [];
  transaction: any[]=[];
  // transactionForm: FormGroup;
  position: any;
  transactionModelist: any[] = [];
  showSbAccountNumber: boolean = false;
  paymentOptions = [
    { label: 'Cash', value: 'cash' },
    // { label: 'To SB Account', value: 'sbAccount' },
  ];
  isBasicDetails: boolean = false;
  isHistory: boolean = false;
  verifiedList: any[] = [];
  reasonList: any[] = [];
  renewalForm: FormGroup;
  renewalTypeList: any[] =[];
  renewalFLag: boolean = false;

  constructor(private router: Router,
    private rdAccountsService: RdAccountsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private rdAccountTransactionService:RdAccountTransactionService,
    private formBuilder:FormBuilder,
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
    this.renewalForm = this.formBuilder.group({
      transactionDate : new FormControl({ value: '', disabled: true }),
      transactionType: new FormControl(''), 
      transactionAmount: new FormControl({ value: '', disabled: true }),
      transactionMode: new FormControl('', [Validators.required]),
      accountNumber: new FormControl(''),
      isVerified:new FormControl('',[Validators.required]),
      remarks: new FormControl(''),
    })
  }

  ngOnInit() {
    this.renewalTypeList=[
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
        this.rdAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getRdAccountById(this.rdAccId);
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
    this.router.navigate([termdeposittransactionconstant.RECCURING_DEPOSITS]);
  }


  getRdAccountById(id: any) {
    this.rdAccountsService.getRdAccounts(this.rdAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.rdAccountsModel = this.responseModel.data[0];
          this.rdAccountTransactionModel.transactionDate = new Date();
          if (this.rdAccountsModel.depositDate != null && this.rdAccountsModel.depositDate != undefined) {
            this.rdAccountsModel.depositDate = this.datePipe.transform(this.rdAccountsModel.depositDate, this.orgnizationSetting.datePipe);
          }
          if (this.rdAccountsModel.adminssionNumber != null && this.rdAccountsModel.adminssionNumber != undefined) {
            this.adminssionNumber = this.rdAccountsModel.adminssionNumber;
          }
          if (this.rdAccountsModel.accountNumber != null && this.rdAccountsModel.accountNumber != undefined) {
            this.rdAccountTransactionModel.accountNumber = this.rdAccountsModel.accountNumber;
            this.accountNumber = this.rdAccountsModel.accountNumber;
            this.termAccId = this.rdAccId;
            // this.getAllPaymentsByAccountIdAndAccountNumber();
          }
          if (this.rdAccountsModel.rdProductId != null && this.rdAccountsModel.rdProductId != undefined) {
            this.productId = this.rdAccountsModel.rdProductId;
          }

          if (this.rdAccountsModel.memberTypeName != null && this.rdAccountsModel.memberTypeName != undefined) {
            this.memberTypeName = this.rdAccountsModel.memberTypeName;
            this.memberTypeCheck(this.memberTypeName);
            if (this.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
              this.rdAccountsModel.accountTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
            }
          }
          // if (this.rdAccountsModel.interestPaymentsList != null && this.rdAccountsModel.interestPaymentsList != undefined) {
          //   this.interestPaymentList = this.rdAccountsModel.interestPaymentsList;
          //   for( let payment of this.interestPaymentList){
          //     if(payment.interestPostingDate != null && payment.interestPostingDate != undefined){
          //       payment.interestPostingDate = this.datePipe.transform(payment.interestPostingDate, this.orgnizationSetting.datePipe);
          //     }
          //     if(payment.transactionDate != null && payment.transactionDate != undefined){
          //       payment.transactionDate = this.datePipe.transform(payment.transactionDate, this.orgnizationSetting.datePipe);
          //     }
          //   }
          // }

          if (this.rdAccountsModel.termAccountsTransactionDTOList != null && this.rdAccountsModel.termAccountsTransactionDTOList != undefined) {
            this.accountTransactionList = this.rdAccountsModel.termAccountsTransactionDTOList;
            for( let transactionPayment of this.accountTransactionList){
              if(transactionPayment.transactionDate != null && transactionPayment.transactionDate != undefined){
                transactionPayment.transactionDate = this.datePipe.transform(transactionPayment.transactionDate, this.orgnizationSetting.datePipe);
              }
            }
          }
          // this.rdAccountsModel.foreClosureDate = new Date();
          //membership details
          if (this.rdAccountsModel != null && this.rdAccountsModel != undefined) {
            this.membershipBasicDetails();//individual
            this.groupDetails();//group
            this.InstitutionDetails();//institution
          }
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
    let removeFileIndex = this.rdAccountsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.rdAccountsModel.signedCopyPath);
    let obj = this.rdAccountsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.rdAccountsModel.signedCopyPath);
    this.rdAccountsModel.filesDTOList.splice(removeFileIndex, 1);
    this.rdAccountsModel.signedCopyPath = null;
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



  fileUploader(event: any, fileUpload: any) {
    this.isFileUploaded = applicationConstants.TRUE;
    this.multipleFilesList = [];
    this.rdAccountsModel.filesDTOList = [];
    this.rdAccountsModel.multipartFileList = [];
    this.rdAccountsModel.signedCopyPath = null;
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
          this.rdAccountsModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.rdAccountsModel.filesDTOList[0].fileName = "RD_Application_signed_copy" + this.rdAccId + "_" + timeStamp + "_" + file.name;
        this.rdAccountsModel.signedCopyPath = "RD_Application_signed_copy" + this.rdAccId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        this.isDisableSubmit = false;
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
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
    this.rdAccountsService.getAllTransactionModes().subscribe((res: any) => {
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
  saveAccountOnRenewal(newrdAccountsModel: any) {
    this.newrdAccountsModel.rdAccountsTransactionDTO = this.setTransactionFields();
    if (newrdAccountsModel.depositDate != null && newrdAccountsModel.depositDate != undefined) {
      newrdAccountsModel.depositDate = this.commonFunctionsService.getUTCEpoch(new Date(newrdAccountsModel.depositDate));
    }    
    // if (newrdAccountsModel.rdAccountsTransactionDTO[0].transactionDate != null && newrdAccountsModel.rdAccountsTransactionDTO[0].transactionDate  != undefined) {
    //   newrdAccountsModel.rdAccountsTransactionDTO[0].transactionDate  = this.commonFunctionsService.getUTCEpoch(new Date(newrdAccountsModel.rdAccountsTransactionDTO[0].transactionDate ));
    // }
    this.rdAccountsService.saveAccountOnRenewal(this.newrdAccountsModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != undefined && this.responseModel.data[0] != null && this.responseModel.data.length > 0) {
          this.rdAccountsModel = this.responseModel.data[0];
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.getRdAccountById(this.id);
        }
      }
      this.router.navigate([termdeposittransactionconstant.RECCURING_DEPOSITS]);
    }, (error: any) => {
      this.commonComponent.stopSpinner();
      this.getRdAccountById(this.id);
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
    if (this.isEdit && this.rdAccountTransactionModel.filesDTOList == null || this.rdAccountTransactionModel.filesDTOList == undefined) {
      this.rdAccountTransactionModel.filesDTOList = [];
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
        this.rdAccountTransactionModel.multipartFileList = [];
        this.rdAccountTransactionModel.filesDTOList.push(files);
        this.rdAccountTransactionModel.signedCopyPath = null;
        this.rdAccountTransactionModel.filesDTOList[this.rdAccountTransactionModel.filesDTOList.length - 1].fileName = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.rdAccountTransactionModel.signedCopyPath = "FD_Filled_pdf" + "_" + timeStamp + "_" + file.name;
        this.isDisableSubmit = false;
      }
      reader.readAsDataURL(file);
    }
  }

  setTransactionFields() {
    this.newrdAccountsModel = new RdAccountsModel();
    this.newrdAccountsModel = this.rdAccountsModel; 

    if (this.rdAccountTransactionModel.transactionDate != null && this.rdAccountTransactionModel.transactionDate != undefined) {
      this.rdAccountTransactionModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.rdAccountTransactionModel.transactionDate));
    }
    let rdAccountsTransactionDTO = this.newrdAccountsModel.termAccountsTransactionDTOList[0]
    this.newrdAccountsModel.rdAccountsTransactionDTO = rdAccountsTransactionDTO;
    this.newrdAccountsModel.rdAccountsTransactionDTO.transactionDate = this.rdAccountTransactionModel.transactionDate;
    this.newrdAccountsModel.renewalType = this.rdAccountTransactionModel.transactionType.value;
    this.newrdAccountsModel.rdAccountsTransactionDTO.transactionAmount = this.rdAccountTransactionModel.transactionAmount;
    this.newrdAccountsModel.rdAccountsTransactionDTO.isVerified = this.rdAccountTransactionModel.isVerified.value;
    this.newrdAccountsModel.rdAccountsTransactionDTO.signatureCopyPath = this.rdAccountTransactionModel.signedCopyPath;
    this.newrdAccountsModel.rdAccountsTransactionDTO.remarks = this.rdAccountTransactionModel.remarks;
    this.newrdAccountsModel.termAccountsTransactionDTOList = [];
}
onRenewalTypeChange(renewalType: any) {
  if(renewalType.value == 1){
    this.renewalFLag = false;
    this.rdAccountTransactionModel.transactionAmount = this.rdAccountsModel.depositAmount; 
  }else if(renewalType.value == 2){
    this.renewalFLag = false;
    this.rdAccountTransactionModel.transactionAmount =  this.rdAccountsModel.maturityAmount;
  }else if(renewalType.value == 3){
    // this.fdNonCummulativeTransactionModel.transactionAmount; // Allow manual entry
    this.renewalFLag = true;
  }
}
}
