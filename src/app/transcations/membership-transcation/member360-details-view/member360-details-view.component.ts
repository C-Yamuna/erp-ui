import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberShipTypesData, CommonStatusData, applicationData } from '../../common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { SavingBankApplicationModel } from '../../savings-bank-transcation/savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application-model';
import { FdCumulativeApplication } from '../../term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-application/shared/fd-cumulative-application.model';
import { MemberClosureDetailsModel } from '../member-closure/shared/member-basic-details.model';
import { Membershiptransactionconstant } from '../membership-transaction-constant';
import { InstitutionBasicDetailsModel } from '../shared/institution-details.model';
import { MemInstitutionService } from '../shared/mem-institution.service';
import { MemberBasicDetails, MemberCommunicationDeatilsModel } from '../shared/member-basic-details.model';
import { MemberGroupBasicDetails } from '../shared/member-group-details-model';
import { MembershipBasicDetailsService } from '../shared/membership-basic-details.service';
import { MembershipGroupDetailsService } from '../shared/membership-group-details.service';

@Component({
  selector: 'app-member360-details-view',
  templateUrl: './member360-details-view.component.html',
  styleUrls: ['./member360-details-view.component.css']
})
export class Member360DetailsViewComponent {
  closureform: FormGroup;
  showForm: boolean = false;
  responseModel!: Responsemodel;
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  memberCommunicationDetailsModel: MemberCommunicationDeatilsModel = new MemberCommunicationDeatilsModel();
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();
  fdCumulativeApplication: FdCumulativeApplication = new FdCumulativeApplication();
  memberGroupBasicDetails: MemberGroupBasicDetails = new MemberGroupBasicDetails();
  institutionBasicDetailsModel: InstitutionBasicDetailsModel = new InstitutionBasicDetailsModel();
  id: any;
  orgnizationSetting: any;
  membreIndividualFlag: boolean = false;
  photoCopyFlag: boolean = false;
  isDisableSubmit: boolean = false;
  applicationList: any[] = [];
  commomCategory: any[] = [];
  statusList: any[] = [];
  memberPhotoCopyZoom: boolean = false;
  admissionNumber: any;
  msgs: any[] = [];
  sbAccountNumber: any;
  sbAccId: any;
  sbTransactions: any[] = [];
  fdCumulativeApplicationList: any[] = [];
  savingBankApplicationList: any[] = [];
  fdNonCumulativeApplicationList: any[] = [];
  RDCumulativeApplicationList: any[] = [];
  siApplicationList: any[] = [];
  saoApplicationList: any[] = [];
  ciApplicationList: any[] = [];
  termApplicationList: any[] = [];
  dailyDepositList: any[] = [];
  agentList: any[] = [];
  memberTypeId: any;
  isKycApproved: any;
  selectedMemberType: any;
  isEdit: Boolean = false;
  memberGroupBasicDetailsFlag: boolean = false;
  memberInstitutionBasicDetailsFlag: boolean = false;
  groupPhotoCopyZoom: boolean = false;
  institutionPhotoCopyZoom: boolean = false;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  today: Date = new Date();
  isCurrentDate: boolean = false;
  isBasicDetails: boolean = false;
  position: string = 'center';
  tableList: any[] = [];
  isSubmitshow: boolean = false;
  pacsId: any;
  branchId: any;
  gridList: any[] = [];
  admissionNumbersList: any[] = [];
  memberTypeName: any;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  temMemberList: any[] = [];
  transactionDetailsDTOList: any[] = [];

  constructor(private router: Router, private formBuilder: FormBuilder, private translate: TranslateService, private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService, private membershipBasicDetailsService: MembershipBasicDetailsService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe, private fileUploadService: FileUploadService,
    private memInistitutionsService: MemInstitutionService, private memberShipGroupDetailsService: MembershipGroupDetailsService,) {
    this.closureform = this.formBuilder.group({

    })
  }
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.individualFlag = true;
    this.getAllAdmissionNumbers(this.pacsId, this.branchId);
  }


  backbutton() {
    this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
  }
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }

  /**
   * @author k.yamuna
   * @implement get MemberDetails By AdmissionNumber
   * @argument admissionNumber
   */
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.memberBasicDetailsModel = this.responseModel.data[0];

        this.admissionNumber = this.memberBasicDetailsModel.admissionNumber;
        this.memberTypeId = this.memberBasicDetailsModel.memberTypeId;
        if (this.memberBasicDetailsModel.admissionDate != null) {
          this.memberBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.memberBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberBasicDetailsModel.dob != null) {
          this.memberBasicDetailsModel.memDobVal = this.datePipe.transform(this.memberBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
        }
        if (this.memberBasicDetailsModel.memClosingDate != null) {
          this.memberBasicDetailsModel.memClosingDateVal = this.datePipe.transform(this.memberBasicDetailsModel.memClosingDate, this.orgnizationSetting.datePipe);
        }
        this.memberBasicDetailsModel.memClosingDateVal = new Date();

        if (this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != null && this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO != undefined) {
          this.memberCommunicationDetailsModel = this.memberBasicDetailsModel.memberShipCommunicationDetailsDTO;
        }
        if (this.memberBasicDetailsModel.photoCopyPath != null && this.memberBasicDetailsModel.photoCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.memberBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.photoCopyPath);
        }
        if (this.memberBasicDetailsModel.signatureCopyPath != null && this.memberBasicDetailsModel.signatureCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.signatureCopyPath);
        }
        if (this.memberBasicDetailsModel.mcrDocumentCopy != null && this.memberBasicDetailsModel.mcrDocumentCopy != undefined) {
          this.memberBasicDetailsModel.multipartFileListForMCRCopyPath = this.fileUploadService.getFile(this.memberBasicDetailsModel.mcrDocumentCopy, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.mcrDocumentCopy);
        }
        if (this.memberBasicDetailsModel.photoCopyPath != null && this.memberBasicDetailsModel.photoCopyPath != undefined) {
          this.memberBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.memberBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.photoCopyPath);
        }
        if (this.memberBasicDetailsModel.isKycApproved != null && this.memberBasicDetailsModel.isKycApproved != undefined && this.memberBasicDetailsModel.isKycApproved) {
          this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
        }
        else {
          this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
        }
        if (this.memberBasicDetailsModel.closureSignedCopyPath != null && this.memberBasicDetailsModel.closureSignedCopyPath != undefined) {
          this.memberBasicDetailsModel.closureSignedCopyPathList = this.fileUploadService.getFile(this.memberBasicDetailsModel.closureSignedCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberBasicDetailsModel.closureSignedCopyPath);
          this.isDisableSubmit = false;
        }
        else {
          this.isDisableSubmit = true;
        }
        this.getSbAccountDetailsByAdmissionNumber();
        this.getFDCummulativeAccountDetailsByAdmissionNumber();
        this.getFDNonCummulativeAccountDetailsByAdmissionNumber();
        this.getRDCummulativeAccountDetailsByAdmissionNumber();
        this.getSILoanDetailsByAdmissionNumber();
        this.getSAOLoanDetailsByAdmissionNumber();
        this.getCILoanDetailsByAdmissionNumber();
        this.getTermLoanDetailsByAdmissionNumber();
        this.getDailyDepositByAdmissionNumber();
        this.getAgentByAdmissionNumber();
        if (this.memberBasicDetailsModel.statusName == CommonStatusData.CLOSED) {
          this.isSubmitshow = true;
        }
        else {
          this.isSubmitshow = false;
        }
      }
    });
  }
  /**
  * @author k.yamuna
  * @implement get GroupDetails By AdmissionNumber
  * @argument admissionNumber
  */
  getMemberGroupByAdmissionNumber(admissionNumber: any) {
    this.memberShipGroupDetailsService.getMemberGroupByAdmissionNumber(admissionNumber).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.memberGroupBasicDetails = this.responseModel.data[0];

        this.admissionNumber = this.memberGroupBasicDetails.admissionNumber;
        this.memberTypeId = this.memberGroupBasicDetails.memberTypeId;

        if (this.memberGroupBasicDetails.resolutionCopyPath != null && this.memberGroupBasicDetails.resolutionCopyPath != undefined) {
          this.memberGroupBasicDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberGroupBasicDetails.resolutionCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.resolutionCopyPath);
        }

        if (this.memberGroupBasicDetails.admissionDate != null) {
          this.memberGroupBasicDetails.admissionDateVal = this.datePipe.transform(this.memberGroupBasicDetails.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.closureDate != null) {
          this.memberGroupBasicDetails.closureDateVal = this.datePipe.transform(this.memberGroupBasicDetails.closureDate, this.orgnizationSetting.datePipe);
        }

        if (this.memberGroupBasicDetails.registrationDate != null) {
          this.memberGroupBasicDetails.registrationDateVal = this.datePipe.transform(this.memberGroupBasicDetails.registrationDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.closureSignedCopyPath != null && this.memberGroupBasicDetails.closureSignedCopyPath != undefined) {
          this.memberGroupBasicDetails.closureSignedCopyPathList = this.fileUploadService.getFile(this.memberGroupBasicDetails.closureSignedCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.closureSignedCopyPath);
          this.isDisableSubmit = false;
        }
        else {
          this.isDisableSubmit = true;
        }
        if (this.memberGroupBasicDetails.isKycCompleted != null && this.memberGroupBasicDetails.isKycCompleted != undefined && this.memberGroupBasicDetails.isKycCompleted) {
          this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
        }
        else {
          this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
        }
        this.getSbAccountDetailsByAdmissionNumber();
        this.getFDCummulativeAccountDetailsByAdmissionNumber();
        this.getFDNonCummulativeAccountDetailsByAdmissionNumber();
        this.getRDCummulativeAccountDetailsByAdmissionNumber();
        this.getSILoanDetailsByAdmissionNumber();
        // this.getSAOLoanDetailsByAdmissionNumber();
        this.getCILoanDetailsByAdmissionNumber();
        this.getTermLoanDetailsByAdmissionNumber();
        this.getDailyDepositByAdmissionNumber();
        // this.getAgentByAdmissionNumber();
        if (this.memberGroupBasicDetails.statusName == CommonStatusData.CLOSED) {
          this.isSubmitshow = true;
        }
        else {
          this.isSubmitshow = false;
        }
      }
    });
  }
  /**
  * @author k.yamuna
  * @implement get IstitutionDetails By AdmissionNumber
  * @argument admissionNumber
  */

  getMemberIstitutionByAdmissionNumber(admissionNumber: any) {
    this.memInistitutionsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();

      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
        this.institutionBasicDetailsModel = this.responseModel.data[0];

        this.admissionNumber = this.institutionBasicDetailsModel.admissionNumber;
        this.memberTypeId = this.institutionBasicDetailsModel.memberTypeId;

        if (this.institutionBasicDetailsModel.resolutionCopyPath != null && this.institutionBasicDetailsModel.resolutionCopyPath != undefined) {
          this.institutionBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.institutionBasicDetailsModel.resolutionCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionBasicDetailsModel.resolutionCopyPath);
        }
        if (this.institutionBasicDetailsModel.closureDate != null) {
          this.institutionBasicDetailsModel.closureDateVal = this.datePipe.transform(this.institutionBasicDetailsModel.closureDate, this.orgnizationSetting.datePipe);
        }
        if (this.institutionBasicDetailsModel.admissionDate != null) {
          this.institutionBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.institutionBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.institutionBasicDetailsModel.registrationDate != null) {
          this.institutionBasicDetailsModel.registrationDateVal = this.datePipe.transform(this.institutionBasicDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
        }
        if (this.institutionBasicDetailsModel.closureSignedCopyPath != null && this.institutionBasicDetailsModel.closureSignedCopyPath != undefined) {
          this.institutionBasicDetailsModel.closureSignedCopyPathList = this.fileUploadService.getFile(this.institutionBasicDetailsModel.closureSignedCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionBasicDetailsModel.closureSignedCopyPath);
          this.isDisableSubmit = false;
        }
        else {
          this.isDisableSubmit = true;
        }
        if (this.institutionBasicDetailsModel.isKycCompleted != null && this.institutionBasicDetailsModel.isKycCompleted != undefined && this.institutionBasicDetailsModel.isKycCompleted) {
          this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
        }
        else {
          this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
        }
        this.getSbAccountDetailsByAdmissionNumber();
        this.getFDCummulativeAccountDetailsByAdmissionNumber();
        this.getFDNonCummulativeAccountDetailsByAdmissionNumber();
        this.getRDCummulativeAccountDetailsByAdmissionNumber();
        this.getSILoanDetailsByAdmissionNumber();
        // this.getSAOLoanDetailsByAdmissionNumber();
        this.getCILoanDetailsByAdmissionNumber();
        this.getTermLoanDetailsByAdmissionNumber();
        this.getDailyDepositByAdmissionNumber();
        // this.getAgentByAdmissionNumber();
        if (this.institutionBasicDetailsModel.statusName == CommonStatusData.CLOSED) {
          this.isSubmitshow = true;
        }
        else {
          this.isSubmitshow = false;
        }
      }
    });

  }
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }
  onChangeShowCards() {
    this.showForm = false
  }
  onChangeTable() {
    this.showForm = true
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
  /**
   * @author k.yamuna
   * @implement get sb account details from sb module by admissionNumber
   * @argument admissionNumber,memberTypeId
   */

  getSbAccountDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getSbAccountDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.savingBankApplicationList = this.responseModel.data;
          this.savingBankApplicationList.filter(obj => obj != null).map(sbAcc => {
            if (sbAcc.accountOpenDate != null && sbAcc.accountOpenDate != undefined) {
              sbAcc.accountOpeningDateVal = this.datePipe.transform(sbAcc.accountOpenDate, this.orgnizationSetting.datePipe);
            }
            if (sbAcc.closureDate != null && sbAcc.closureDate != undefined) {
              sbAcc.closureDateVal = this.datePipe.transform(sbAcc.closureDate, this.orgnizationSetting.datePipe);
            }
            let savingDto = new MemberClosureDetailsModel();
            savingDto.id = sbAcc.id;
            savingDto.accountNumber = sbAcc.accountNumber
            savingDto.application = applicationData.SAVING_BANK;
            savingDto.productName = sbAcc.productName;
            savingDto.accountOpeningDate = sbAcc.accountOpeningDateVal
            savingDto.status = sbAcc.accountStatusName;
            savingDto.accountBalance = sbAcc.balance;
            this.tableList.push(savingDto);

          })

        }
        // this.getTopTransactionsList();
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @author k.yamuna
   * @implement get FD Cummulative account details from fd module by admissionNumber
   * @argument admissionNumber,memberTypeId
   */
  getFDCummulativeAccountDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getFDAccountDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.fdCumulativeApplicationList = this.responseModel.data;
          this.fdCumulativeApplicationList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
              fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let fdCummulative = new MemberClosureDetailsModel();
            fdCummulative.id = fdcumm.id;
            fdCummulative.accountNumber = fdcumm.accountNumber
            fdCummulative.application = applicationData.TERM_DEPOSIT;
            fdCummulative.productName = fdcumm.fdCummulativeProductName;
            fdCummulative.accountOpeningDate = fdcumm.depositDateVal
            fdCummulative.status = fdcumm.accountStatusName;
            fdCummulative.accountBalance = fdcumm.depositAmount;
            this.tableList.push(fdCummulative);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
    * @author k.yamuna
    * @implement get FD non Cummulative account details from fd module by admissionNumber
    * @argument admissionNumber,memberTypeId
    */
  getFDNonCummulativeAccountDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getFDNonAccountDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.fdNonCumulativeApplicationList = this.responseModel.data;
          this.fdNonCumulativeApplicationList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
              fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let fdCummulative = new MemberClosureDetailsModel();
            fdCummulative.id = fdcumm.id;
            fdCummulative.accountNumber = fdcumm.accountNumber
            fdCummulative.application = applicationData.TERM_DEPOSIT;
            fdCummulative.productName = fdcumm.fdNonCummulativeProductName;
            fdCummulative.accountOpeningDate = fdcumm.depositDateVal
            fdCummulative.status = fdcumm.accountStatusName;
            fdCummulative.accountBalance = fdcumm.depositAmount;
            this.tableList.push(fdCummulative);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @author k.yamuna
   * @implement get RD account details from RD module by admissionNumber
   * @argument admissionNumber,memberTypeId
   */
  getRDCummulativeAccountDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getRDAccountDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.RDCumulativeApplicationList = this.responseModel.data;
          this.RDCumulativeApplicationList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
              fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let fdCummulative = new MemberClosureDetailsModel();
            fdCummulative.id = fdcumm.id;
            fdCummulative.accountNumber = fdcumm.accountNumber
            fdCummulative.application = applicationData.TERM_DEPOSIT;
            fdCummulative.productName = fdcumm.productName;
            fdCummulative.accountOpeningDate = fdcumm.depositDateVal
            fdCummulative.status = fdcumm.accountStatusName;
            fdCummulative.accountBalance = fdcumm.depositAmount;
            this.tableList.push(fdCummulative);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  /**
 * @author k.yamuna
 * @implement get SI Loan details from SI module by admissionNumber
 * @argument admissionNumber,memberTypeId
 */
  getSILoanDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getSILoanApplicationDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.siApplicationList = this.responseModel.data;
          this.siApplicationList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
              fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let siLoan = new MemberClosureDetailsModel();
            siLoan.id = fdcumm.id;
            siLoan.accountNumber = fdcumm.accountNumber
            siLoan.application = applicationData.LOANS;
            siLoan.productName = fdcumm.siProductName;
            siLoan.accountOpeningDate = fdcumm.applicationDateVal
            siLoan.status = fdcumm.accountStatusName;
            siLoan.accountBalance = fdcumm.sanctionAmount;
            this.tableList.push(siLoan);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }


  /**
 * @author k.yamuna
 * @implement get SAO Loan details from SI module by admissionNumber
 * @argument admissionNumber,memberTypeId
 */
  getSAOLoanDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getSaoLoanApplicationDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.saoApplicationList = this.responseModel.data;
          this.saoApplicationList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
              fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let saoLoan = new MemberClosureDetailsModel();
            saoLoan.id = fdcumm.id;
            saoLoan.accountNumber = fdcumm.accountNumber
            saoLoan.application = applicationData.LOANS;
            saoLoan.productName = fdcumm.saoProductName;
            saoLoan.accountOpeningDate = fdcumm.applicationDateVal
            saoLoan.status = fdcumm.accountStatusName;
            saoLoan.accountBalance = fdcumm.sanctionAmount;
            this.tableList.push(saoLoan);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @author k.yamuna
   * @implement get CI Loan details from SI module by admissionNumber
   * @argument admissionNumber,memberTypeId
   */
  getCILoanDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getCILoanApplicationDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.ciApplicationList = this.responseModel.data;
          this.ciApplicationList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
              fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let ciLoan = new MemberClosureDetailsModel();
            ciLoan.id = fdcumm.id;
            ciLoan.accountNumber = fdcumm.accountNumber
            ciLoan.application = applicationData.LOANS;
            ciLoan.productName = fdcumm.ciProductName;
            ciLoan.accountOpeningDate = fdcumm.applicationDateVal
            ciLoan.status = fdcumm.accountStatusName;
            ciLoan.accountBalance = fdcumm.sanctionAmount;
            this.tableList.push(ciLoan);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @author k.yamuna
   * @implement get TREM Loan details from SI module by admissionNumber
   * @argument admissionNumber,memberTypeId
   */
  getTermLoanDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getTermLoanApplicationDetailsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.termApplicationList = this.responseModel.data;
          this.termApplicationList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
              fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let termLoan = new MemberClosureDetailsModel();
            termLoan.id = fdcumm.id;
            termLoan.accountNumber = fdcumm.accountNumber
            termLoan.application = applicationData.LOANS;
            termLoan.productName = fdcumm.termProductName;
            termLoan.accountOpeningDate = fdcumm.applicationDateVal
            termLoan.status = fdcumm.accountStatusName;
            termLoan.accountBalance = fdcumm.sanctionAmount;
            this.tableList.push(termLoan);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @author k.yamuna
   * @implement getpigmy details from pigmy module by admissionNumber
   * @argument admissionNumber,memberTypeId
   */
  getDailyDepositByAdmissionNumber() {
    this.membershipBasicDetailsService.getDailyDepositsByAdmissionNumber(this.admissionNumber, this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.dailyDepositList = this.responseModel.data;
          this.dailyDepositList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
              fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let dailyDeposit = new MemberClosureDetailsModel();
            dailyDeposit.id = fdcumm.id;
            dailyDeposit.accountNumber = fdcumm.accountNumber;
            dailyDeposit.application = applicationData.LOANS;
            dailyDeposit.productName = fdcumm.productName;
            dailyDeposit.accountOpeningDate = fdcumm.depositDateVal
            dailyDeposit.status = fdcumm.statusName;
            dailyDeposit.accountBalance = fdcumm.depositAmount;
            dailyDeposit.pacsId = fdcumm.pacsId;
            this.tableList.push(dailyDeposit);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
  /**
* @author k.yamuna
* @implement get agent details from agent module by admissionNumber
* @argument admissionNumber,memberTypeId
*/
  getAgentByAdmissionNumber() {
    this.membershipBasicDetailsService.getAgentDetailsByAdmissionNumber(this.admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.agentList = this.responseModel.data;
          this.agentList.filter(obj => obj != null).map(fdcumm => {
            if (fdcumm.effectiveStartDate != null && fdcumm.effectiveStartDate != undefined) {
              fdcumm.effectiveStartDateVal = this.datePipe.transform(fdcumm.effectiveStartDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.effectiveEndDate != null && fdcumm.effectiveEndDate != undefined) {
              fdcumm.effectiveEndDateVal = this.datePipe.transform(fdcumm.effectiveEndDate, this.orgnizationSetting.datePipe);
            }
            let agentDetails = new MemberClosureDetailsModel();
            agentDetails.id = fdcumm.id;
            agentDetails.accountNumber = fdcumm.accountNumber;
            agentDetails.application = applicationData.AGENT;
            agentDetails.productName = fdcumm.agentTypeName;
            agentDetails.accountOpeningDate = fdcumm.effectiveStartDateVal
            agentDetails.status = fdcumm.statusName;
            agentDetails.accountBalance = fdcumm.totalCollectionAmount;
            this.tableList.push(agentDetails);
          })
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  viewMoreGroupDetails() {
    this.memberGroupBasicDetailsFlag = true;
  }
  //group view more POp up flag
  viewMoreInstitutionDetails() {
    this.memberInstitutionBasicDetailsFlag = true;
  }

  onClickGroupPhotoCopy() {
    this.groupPhotoCopyZoom = true;
  }
  onClickInstitutionPhotoCopy() {
    this.institutionPhotoCopyZoom = true;
  }
  /**
   * @author k.yamuna
   * @implement get member admission Numbers list
   * @argument pacsId,branchId
   */
  getAllAdmissionNumbers(pacsId: any, branchId: any) {
    this.membershipBasicDetailsService.getAllGridList(pacsId, branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.gridList = this.responseModel.data;
            this.admissionNumbersList = this.gridList.filter((obj: any) => obj != null).map(membership => {
              return {
                label: `${membership.name} - ${membership.admissionNumber} - ${membership.memberTypeName}`,
                value: membership.admissionNumber
              };
            });
            this.temMemberList = this.gridList.filter((obj: any) => obj != null).map(membership => {
              return {
                label: membership.memberTypeName,
                value: membership.admissionNumber
              };
            });
          }
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    });
  }

  /**
    * @author k.yamuna
    * @implement onchange admissionNumber
    * @argument admissionNumber
    */
  OnChangeAdmissionNumber(admissionNo: any) {
    this.tableList = [];
    this.memberTypeName = this.temMemberList.filter(obj => obj != null && obj.value == admissionNo)[0].label;
    if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.getMemberDetailsByAdmissionNUmber(admissionNo);
    } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.institutionFlag = false;
      this.individualFlag = false;
      this.getMemberGroupByAdmissionNumber(admissionNo);
    }
    else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.getMemberIstitutionByAdmissionNumber(admissionNo);
    }
  }

  /**
  * @author k.yamuna
  * @implement top 5 sb transaction list by sb account id
  * @argument sbAccId
  */
  getTopTransactionsList(id: any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getTopFiveTransactions(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
   /**
  * @author k.yamuna
  * @implement top 5 sb transaction list by sb account id
  * @argument fdAccountId
  */
   getFdTransactionsList(id: any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllFDCummulativeTransactions(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
  getFdNonCummulativeTransactionsList(id: any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllFdNonCummulativeTransactions(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
  getRDTransactionsList(id: any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllRdTransactions(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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

  getAgentTransactionsList(id: any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllAgentTransactions(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
  getDailyDipositTransactionsList(pacsId: any,accountId:any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllPigmyTransactions(pacsId,accountId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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

  getCiLoanTransactionsList(accountId:any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllCILoanTransactions(accountId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
  getSiLoanTransactionsList(accountId:any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllSILoanTransactions(accountId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
  getSaoLoanTransactionsList(accountId:any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllSAOLoanTransactions(accountId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
  getTermLoanTransactionsList(accountId:any) {
    this.transactionDetailsDTOList = [];
    this.membershipBasicDetailsService.getAllTermLoanTransactions(accountId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.transactionDetailsDTOList = this.responseModel.data.map((sb: any) => {
              if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
                sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
              }
              return sb
            });
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
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
  /**
* @author k.yamuna
* @implement all module transaction list onClick method for each module transaction
* @argument rowData
*/
  getTransactionList(rowData: any) {
    if (rowData.id && rowData.application == applicationData.SAVING_BANK) {
      this.getTopTransactionsList(rowData.id);
    }
    else if (rowData.id && rowData.application == applicationData.TERM_DEPOSIT) {
      this.getFdTransactionsList(rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.TERM_DEPOSIT){
      this.getFdNonCummulativeTransactionsList(rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.TERM_DEPOSIT){
      this.getRDTransactionsList(rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.AGENT){
      this.getAgentTransactionsList(rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.PIGMY){
      this.getDailyDipositTransactionsList(rowData.pacsId,rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.LOANS){
      this.getSiLoanTransactionsList(rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.LOANS){
      this.getCiLoanTransactionsList(rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.LOANS){
      this.getSaoLoanTransactionsList(rowData.id);
    }
    if(rowData.id && rowData.application == applicationData.LOANS){
      this.getTermLoanTransactionsList(rowData.id);
    }
    this.showForm = true;
  }
  minDataCount = 5; // Adjust based on how much data fits in 12rem
}

