import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { savingsbanktransactionconstant } from '../../savings-bank-transcation/savingsbank-transaction-constant';
import { Membershiptransactionconstant } from '../membership-transaction-constant';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberBasicDetails, MemberCommunicationDeatilsModel } from '../shared/member-basic-details.model';
import { MembershipBasicDetailsService } from '../shared/membership-basic-details.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { SavingBankApplicationService } from '../../savings-bank-transcation/savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application.service';
import { SavingBankApplicationModel } from '../../savings-bank-transcation/savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application-model';
import { SbTransactionService } from '../../savings-bank-transcation/sb-transactions/shared/sb-transaction.service';
import { FdCumulativeApplicationService } from '../../term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-application/shared/fd-cumulative-application.service';
import { FdCumulativeApplication } from '../../term-deposits-transcation/fd-cumulative/fd-cumulative-stepper/fd-cumulative-application/shared/fd-cumulative-application.model';
import { SiLoanApplicationService } from '../../loan-transcation/shared/si-loans/si-loan-application.service';
import { DailyDepositsAccountsService } from '../../daily-deposits-transaction/shared/daily-deposits-accounts.service';
import { applicationData, CommonStatusData, MemberShipTypesData } from '../../common-status-data.json';
import { MemInstitutionService } from '../shared/mem-institution.service';
import { MembershipGroupDetailsService } from '../shared/membership-group-details.service';
import { MemberGroupBasicDetails } from '../shared/member-group-details-model';
import { InstitutionBasicDetailsModel } from '../shared/institution-details.model';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUpload } from 'primeng/fileupload';
import { MemberClosureDetailsModel } from './shared/member-basic-details.model';

@Component({
  selector: 'app-member-closure',
  templateUrl: './member-closure.component.html',
  styleUrls: ['./member-closure.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class MemberClosureComponent {
 closureform: FormGroup;
  showForm: boolean = false;
  responseModel!: Responsemodel;
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  memberCommunicationDetailsModel: MemberCommunicationDeatilsModel = new MemberCommunicationDeatilsModel();
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();
  fdCumulativeApplication:FdCumulativeApplication = new FdCumulativeApplication();
  memberGroupBasicDetails: MemberGroupBasicDetails = new MemberGroupBasicDetails();
  institutionBasicDetailsModel: InstitutionBasicDetailsModel = new InstitutionBasicDetailsModel();
  id: any;
  orgnizationSetting: any;
  membreIndividualFlag: boolean = false;
  photoCopyFlag:boolean= false;
  isDisableSubmit: boolean= false;
  applicationList: any[] =[];
  commomCategory:any[]=[];
  statusList:any[]=[];
  memberPhotoCopyZoom: boolean = false;
  groupPhotoCopyZoom: boolean = false;
  institutionPhotoCopyZoom: boolean = false;
  admissionNumber: any;
  msgs: any[]=[];
  sbAccountNumber: any;
  sbAccId: any;
  sbTransactions: any[] = [];
  fdCumulativeApplicationList: any[] = [];
  savingBankApplicationList:any[] = [];
  fdNonCumulativeApplicationList:any[] = [];
  RDCumulativeApplicationList: any[] = [];
  siApplicationList: any[] = [];
  saoApplicationList:any[] = [];
  ciApplicationList:any[] = [];
  termApplicationList:any[] = [];
  dailyDepositList:any[] = [];
  agentList:any[] = [];
  memberTypeId: any;
  isKycApproved: any;
  selectedMemberType: any;
  isEdit:Boolean= false;
  memberGroupBasicDetailsFlag: boolean= false;
  memberInstitutionBasicDetailsFlag: boolean= false;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  today: Date = new Date();
  isCurrentDate: boolean = false;
  isBasicDetails: boolean = false;
  position: string = 'center';
  tableList:any[] = [];
  isSubmitshow:boolean = false;
  
  constructor(private router: Router, private formBuilder: FormBuilder, private translate: TranslateService, private commonComponent: CommonComponent,
    private commonFunctionsService: CommonFunctionsService, private membershipBasicDetailsService: MembershipBasicDetailsService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private datePipe: DatePipe, private fileUploadService: FileUploadService,
    private memInistitutionsService: MemInstitutionService,private memberShipGroupDetailsService: MembershipGroupDetailsService,) {
    this.closureform = this.formBuilder.group({

    })
  }
  ngOnInit(): void {
    // Auto-populate with current date
    this.memberBasicDetailsModel.memClosingDateVal = new Date();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.commonFunctionsService.setStorageValue('language', 'en');
    this.commonFunctionsService.data.subscribe((res: any) => {
      if (res) {
        this.translate.use(res);
      } else {
        this.translate.use('en');
      }
    });
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        this.id = id;
        if (params['type'] != undefined) {
          let type = this.encryptService.decrypt(params['type']);
          this.selectedMemberType = type;
          if (this.selectedMemberType === MemberShipTypesData.INDIVIDUAL)
            this.getMembershipDetails(id);
          else if (this.selectedMemberType === MemberShipTypesData.GROUP) {
            this.getGroupDetails(id);
          }
          else if (this.selectedMemberType === MemberShipTypesData.INSTITUTION) {
            this.getInstitutionDetails(id);
          }
        }
        this.isEdit = true;
      }
    });


    this.applicationList = [
      { label: 'ALL', value: 0 },
      { label: 'Saving Bank', value: 1 },
      { label: 'Term Deposit', value: 2 },
      { label: 'Loans', value: 3 },
      { label: 'Agent Details', value: 4 },
      { label: 'Pigmy Details', value: 5 }

    ];
    this.statusList = [
      { label: "Active", value: true },
      { label: "In-Active", value: false }
    ]

  }
 
  backbutton(){
    this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
  }
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
}

  getMembershipDetails(id: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
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
        if( this.memberBasicDetailsModel.statusName == CommonStatusData.CLOSED){
          this.isSubmitshow = true;
        }
        else{
          this.isSubmitshow = false;
        }
      }
    });
  }
   getGroupDetails(id: any) {
      this.memberShipGroupDetailsService.getMembershipGroupDetailsById(id).subscribe(res => {
        this.responseModel = res;
        this.commonComponent.stopSpinner();
  
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
          this.memberGroupBasicDetails = this.responseModel.data[0];

          this.admissionNumber = this.memberGroupBasicDetails.admissionNumber;
          this.memberTypeId = this.memberGroupBasicDetails.memberTypeId;
  
          if (this.memberGroupBasicDetails.resolutionCopyPath != null && this.memberGroupBasicDetails.resolutionCopyPath != undefined) {
            this.memberGroupBasicDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberGroupBasicDetails.resolutionCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.resolutionCopyPath);
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
            this.memberGroupBasicDetails.closureSignedCopyPathList = this.fileUploadService.getFile(this.memberGroupBasicDetails.closureSignedCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.closureSignedCopyPath  );
            this.isDisableSubmit = false;
          }
          else{
            this.isDisableSubmit = true;
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
          if( this.memberGroupBasicDetails.statusName == CommonStatusData.CLOSED){
            this.isSubmitshow = true;
          }
          else{
            this.isSubmitshow = false;
          }
        }
      });
    }
  
    getInstitutionDetails(id: any) {
      if(id != undefined && id != null){
      this.memInistitutionsService.getMemInstitutionById(id).subscribe(res => {
        this.responseModel = res;
        this.commonComponent.stopSpinner();
  
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data && this.responseModel.data.length > 0) {
          this.institutionBasicDetailsModel = this.responseModel.data[0];

          this.admissionNumber = this.institutionBasicDetailsModel.admissionNumber;
          this.memberTypeId = this.institutionBasicDetailsModel.memberTypeId;
 
          if (this.institutionBasicDetailsModel.resolutionCopyPath != null && this.institutionBasicDetailsModel.resolutionCopyPath != undefined) {
            this.institutionBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.institutionBasicDetailsModel.resolutionCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionBasicDetailsModel.resolutionCopyPath);
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
            this.institutionBasicDetailsModel.closureSignedCopyPathList = this.fileUploadService.getFile(this.institutionBasicDetailsModel.closureSignedCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionBasicDetailsModel.closureSignedCopyPath  );
            this.isDisableSubmit = false;
          }
          else{
            this.isDisableSubmit = true;
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
          if( this.institutionBasicDetailsModel.statusName == CommonStatusData.CLOSED){
            this.isSubmitshow = true;
          }
          else{
            this.isSubmitshow = false;
          }
        }
      });
    }
    }
  onClickMemberIndividualMoreDetails(){
    this.membreIndividualFlag = true;
  }
  onChangeShowCards(){
    this.showForm = false
  }
  onChangeTable(){
    this.showForm = true
  }

  closePhotoCopy() {
    this.memberPhotoCopyZoom = false;
  }
  groupclosePhotoCopy() {
    this.groupPhotoCopyZoom = false;
  }
  institutionclosePhotoCopy() {
    this.institutionPhotoCopyZoom = false;
  }
  onClickMemberPhotoCopy(){
    this.memberPhotoCopyZoom = true;
  }
  onClickGroupPhotoCopy(){
    this.groupPhotoCopyZoom = true;
  }
  onClickInstitutionPhotoCopy(){
    this.institutionPhotoCopyZoom = true;
  }
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }

  //get sb account details from sb module by admissionNumber
  getSbAccountDetailsByAdmissionNumber() {
      this.membershipBasicDetailsService.getSbAccountDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            this.savingBankApplicationList = this.responseModel.data;
            this.savingBankApplicationList.filter(obj =>obj != null).map(sbAcc =>{
              if (sbAcc.accountOpenDate != null && sbAcc.accountOpenDate != undefined) {
                sbAcc.accountOpeningDateVal = this.datePipe.transform(sbAcc.accountOpenDate, this.orgnizationSetting.datePipe);
              }
              if (sbAcc.closureDate != null && sbAcc.closureDate != undefined) {
                sbAcc.closureDateVal = this.datePipe.transform(sbAcc.closureDate, this.orgnizationSetting.datePipe);
              }
                let savingDto = new MemberClosureDetailsModel();
                savingDto.accountNumber = sbAcc.accountNumber
                savingDto.application = applicationData.SAVING_BANK;
                savingDto.productName = sbAcc.productName;
                savingDto.accountOpeningDate = sbAcc.accountOpeningDateVal
                savingDto.accountClosingDate = sbAcc.closureDateVal;
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
    //  getTopTransactionsList() {
    //     this.sbTransactions = [];
    //     this.sbTransactionService.getTopFiveTransactions(this.sbAccId).subscribe((response: any) => {
    //       this.responseModel = response;
    //       if (this.responseModel != null && this.responseModel != undefined) {
    //         if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
    //           if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
    //             this.sbTransactions = this.responseModel.data.map((sb: any) => {
    //               if (sb != null && sb != undefined && sb.transactionDate != null && sb.transactionDate != undefined) {
    //                 sb.trnasactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
    //               }
    //               return sb
    //             });
    //           }
    //         }
    //         else {
    //           this.commonComponent.stopSpinner();
    //           this.msgs = [];
    //           this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
    //           setTimeout(() => {
    //             this.msgs = [];
    //           }, 2000);
    //         }
    //       }
    //     },
    //       error => {
    //         this.msgs = [];
    //         this.commonComponent.stopSpinner();
    //         this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
    //         setTimeout(() => {
    //           this.msgs = [];
    //         }, 2000);
    //       });
    //   }
    //get FD Cummulative account details from fd module by admissionNumber
  getFDCummulativeAccountDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getFDAccountDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.fdCumulativeApplicationList = this.responseModel.data;
          this.fdCumulativeApplicationList.filter(obj => obj != null).map(fdcumm =>{
            if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
              fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let fdCummulative = new MemberClosureDetailsModel();
              fdCummulative.accountNumber = fdcumm.accountNumber
              fdCummulative.application = applicationData.TERM_DEPOSIT;
              fdCummulative.productName = fdcumm.fdCummulativeProductName;
              fdCummulative.accountOpeningDate = fdcumm.depositDateVal
              fdCummulative.accountClosingDate = fdcumm.closureDateVal;
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
      //get FD non Cummulative account details from fd module by admissionNumber

  getFDNonCummulativeAccountDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getFDNonAccountDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.fdNonCumulativeApplicationList = this.responseModel.data;
          this.fdNonCumulativeApplicationList.filter(obj => obj != null).map(fdcumm =>{
            if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
              fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let fdCummulative = new MemberClosureDetailsModel();
              fdCummulative.accountNumber = fdcumm.accountNumber
              fdCummulative.application = applicationData.TERM_DEPOSIT;
              fdCummulative.productName = fdcumm.fdNonCummulativeProductName;
              fdCummulative.accountOpeningDate = fdcumm.depositDateVal
              fdCummulative.accountClosingDate = fdcumm.closureDateVal;
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
      //get RD account details from RD module by admissionNumber
  getRDCummulativeAccountDetailsByAdmissionNumber() {
    this.membershipBasicDetailsService.getRDAccountDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
          this.RDCumulativeApplicationList = this.responseModel.data;
          this.RDCumulativeApplicationList.filter(obj => obj != null).map(fdcumm =>{
            if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
              fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
            }
            if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
              fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
            }
            let fdCummulative = new MemberClosureDetailsModel();
              fdCummulative.accountNumber = fdcumm.accountNumber
              fdCummulative.application = applicationData.TERM_DEPOSIT;
              fdCummulative.productName = fdcumm.productName;
              fdCummulative.accountOpeningDate = fdcumm.depositDateVal
              fdCummulative.accountClosingDate = fdcumm.closureDateVal;
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
     //get SI Loan details from SI module by admissionNumber
     getSILoanDetailsByAdmissionNumber() {
      this.membershipBasicDetailsService.getSILoanApplicationDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            this.siApplicationList = this.responseModel.data;
            this.siApplicationList.filter(obj => obj != null).map(fdcumm =>{
              if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
                fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
              }
              if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
                fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
              }
              let siLoan = new MemberClosureDetailsModel();
              siLoan.accountNumber = fdcumm.accountNumber
              siLoan.application = applicationData.LOANS;
              siLoan.productName = fdcumm.siProductName;
              siLoan.accountOpeningDate = fdcumm.applicationDateVal
              siLoan.accountClosingDate = fdcumm.closureDateVal;
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

     //get SAO Loan details from SI module by admissionNumber
     getSAOLoanDetailsByAdmissionNumber() {
      this.membershipBasicDetailsService.getSaoLoanApplicationDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            this.saoApplicationList = this.responseModel.data;
            this.saoApplicationList.filter(obj => obj != null).map(fdcumm =>{
              if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
                fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
              }
              if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
                fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
              }
              let saoLoan = new MemberClosureDetailsModel();
              saoLoan.accountNumber = fdcumm.accountNumber
              saoLoan.application = applicationData.LOANS;
              saoLoan.productName = fdcumm.saoProductName;
              saoLoan.accountOpeningDate = fdcumm.applicationDateVal
              saoLoan.accountClosingDate = fdcumm.closureDateVal;
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

     //get CI Loan details from SI module by admissionNumber
     getCILoanDetailsByAdmissionNumber() {
      this.membershipBasicDetailsService.getCILoanApplicationDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            this.ciApplicationList = this.responseModel.data;
            this.ciApplicationList.filter(obj => obj != null).map(fdcumm =>{
              if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
                fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
              }
              if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
                fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
              }
              let ciLoan = new MemberClosureDetailsModel();
              ciLoan.accountNumber = fdcumm.accountNumber
              ciLoan.application = applicationData.LOANS;
              ciLoan.productName = fdcumm.ciProductName;
              ciLoan.accountOpeningDate = fdcumm.applicationDateVal
              ciLoan.accountClosingDate = fdcumm.closureDateVal;
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

     //get TREM Loan details from SI module by admissionNumber
     getTermLoanDetailsByAdmissionNumber() {
      this.membershipBasicDetailsService.getTermLoanApplicationDetailsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            this.termApplicationList = this.responseModel.data;
            this.termApplicationList.filter(obj => obj != null).map(fdcumm =>{
              if (fdcumm.applicationDate != null && fdcumm.applicationDate != undefined) {
                fdcumm.applicationDateVal = this.datePipe.transform(fdcumm.applicationDate, this.orgnizationSetting.datePipe);
              }
              if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
                fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
              }
              let termLoan = new MemberClosureDetailsModel();
              termLoan.accountNumber = fdcumm.accountNumber
              termLoan.application = applicationData.LOANS;
              termLoan.productName = fdcumm.termProductName;
              termLoan.accountOpeningDate = fdcumm.applicationDateVal
              termLoan.accountClosingDate = fdcumm.closureDateVal;
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

     //getpigmy details from pigmy module by admissionNumber
     getDailyDepositByAdmissionNumber() {
      this.membershipBasicDetailsService.getDailyDepositsByAdmissionNumber(this.admissionNumber,this.memberTypeId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined) {
            this.dailyDepositList = this.responseModel.data;
            this.dailyDepositList.filter(obj => obj != null).map(fdcumm =>{
              if (fdcumm.depositDate != null && fdcumm.depositDate != undefined) {
                fdcumm.depositDateVal = this.datePipe.transform(fdcumm.depositDate, this.orgnizationSetting.datePipe);
              }
              if (fdcumm.closureDate != null && fdcumm.closureDate != undefined) {
                fdcumm.closureDateVal = this.datePipe.transform(fdcumm.closureDate, this.orgnizationSetting.datePipe);
              }
              let dailyDeposit = new MemberClosureDetailsModel();
              dailyDeposit.accountNumber = fdcumm.accountNumber
              dailyDeposit.application = applicationData.LOANS;
              dailyDeposit.productName = fdcumm.productName;
              dailyDeposit.accountOpeningDate = fdcumm.depositDateVal
              dailyDeposit.accountClosingDate = fdcumm.closureDateVal;
              dailyDeposit.status = fdcumm.statusName;
              dailyDeposit.accountBalance = fdcumm.depositAmount;
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
      //get agent details from agent module by admissionNumber
      getAgentByAdmissionNumber() {
        this.membershipBasicDetailsService.getAgentDetailsByAdmissionNumber(this.admissionNumber).subscribe((data: any) => {
          this.responseModel = data;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined) {
              this.agentList = this.responseModel.data;
              this.agentList.filter(obj => obj != null).map(fdcumm =>{
                if (fdcumm.effectiveStartDate != null && fdcumm.effectiveStartDate != undefined) {
                  fdcumm.effectiveStartDateVal = this.datePipe.transform(fdcumm.effectiveStartDate, this.orgnizationSetting.datePipe);
                }
                if (fdcumm.effectiveEndDate != null && fdcumm.effectiveEndDate != undefined) {
                  fdcumm.effectiveEndDateVal = this.datePipe.transform(fdcumm.effectiveEndDate, this.orgnizationSetting.datePipe);
                }
                let agentDetails = new MemberClosureDetailsModel();
                agentDetails.accountNumber = fdcumm.accountNumber
                agentDetails.application = applicationData.AGENT;
                agentDetails.productName = fdcumm.agentTypeName;
                agentDetails.accountOpeningDate = fdcumm.effectiveStartDateVal
                agentDetails.accountClosingDate = fdcumm.effectiveEndDateVal;
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
  //individual file uploader
   fileUploader(event: any, fileUpload: FileUpload) {
      this.isFileUploaded = applicationConstants.FALSE;
      this.multipleFilesList = [];
      if (this.isEdit && this.memberBasicDetailsModel.filesDTOList == null || this.memberBasicDetailsModel.filesDTOList == undefined) {
        this.memberBasicDetailsModel.filesDTOList = [];
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
          this.memberBasicDetailsModel.closureSignedCopyPathList = [];
          this.memberBasicDetailsModel.filesDTOList.push(files);
          this.memberBasicDetailsModel.closureSignedCopyPath = null;
          this.memberBasicDetailsModel.filesDTOList[this.memberBasicDetailsModel.filesDTOList.length - 1].fileName = "Member_closure_pdf" + "_" + timeStamp + "_" + file.name;
          this.memberBasicDetailsModel.closureSignedCopyPath = "Member_closure_pdf" + "_" + timeStamp + "_" + file.name;
          this.isDisableSubmit = false;
        }
        reader.readAsDataURL(file);
      }
    }
      /**
   * @implements onFileremove from file value
   * @param fileName 
   * @author k.yamuna
   */
  fileRemoveEvent() {
    if (this.memberBasicDetailsModel.filesDTOList != null && this.memberBasicDetailsModel.filesDTOList != undefined && this.memberBasicDetailsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.memberBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.memberBasicDetailsModel.closureSignedCopyPath);
      this.memberBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
      this.memberBasicDetailsModel.closureSignedCopyPath = null;
      this.isDisableSubmit = true;
    }
  }

  //group file uploader
  fileUploaderForGroup(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.memberGroupBasicDetails.filesDTOList == null || this.memberGroupBasicDetails.filesDTOList == undefined) {
      this.memberGroupBasicDetails.filesDTOList = [];
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
        this.memberGroupBasicDetails.closureSignedCopyPathList = [];
        this.memberGroupBasicDetails.filesDTOList.push(files);
        this.memberGroupBasicDetails.closureSignedCopyPath = null;
        this.memberGroupBasicDetails.filesDTOList[this.memberGroupBasicDetails.filesDTOList.length - 1].fileName = "group_closure_pdf" + "_" + timeStamp + "_" + file.name;
        this.memberGroupBasicDetails.closureSignedCopyPath = "group_closure_pdf" + "_" + timeStamp + "_" + file.name;
        this.isDisableSubmit = false;
      }
      reader.readAsDataURL(file);
    }
  }
    /**
 * @implements onFileremove from file value
 * @param fileName 
 * @author k.yamuna
 */
fileRemoveEventForGroup() {
  if (this.memberGroupBasicDetails.filesDTOList != null && this.memberGroupBasicDetails.filesDTOList != undefined && this.memberGroupBasicDetails.filesDTOList.length > 0) {
    let removeFileIndex = this.memberGroupBasicDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.memberGroupBasicDetails.closureSignedCopyPath);
    this.memberGroupBasicDetails.filesDTOList.splice(removeFileIndex, 1);
    this.memberGroupBasicDetails.closureSignedCopyPath = null;
    this.isDisableSubmit = true;
  }
}

 //institution file uploader
fileUploaderForInstitution(event: any, fileUpload: FileUpload) {
  this.isFileUploaded = applicationConstants.FALSE;
  this.multipleFilesList = [];
  if (this.isEdit && this.institutionBasicDetailsModel.filesDTOList == null || this.institutionBasicDetailsModel.filesDTOList == undefined) {
    this.institutionBasicDetailsModel.filesDTOList = [];
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
      this.institutionBasicDetailsModel.closureSignedCopyPathList = [];
      this.institutionBasicDetailsModel.filesDTOList.push(files);
      this.institutionBasicDetailsModel.closureSignedCopyPath = null;
      this.institutionBasicDetailsModel.filesDTOList[this.institutionBasicDetailsModel.filesDTOList.length - 1].fileName = "Institution_closure_pdf" + "_" + timeStamp + "_" + file.name;
      this.institutionBasicDetailsModel.closureSignedCopyPath = "Institution_closure_pdf" + "_" + timeStamp + "_" + file.name;
      this.isDisableSubmit = false;
    }
    reader.readAsDataURL(file);
  }
}
  /**
* @implements onFileremove from file value
* @param fileName 
* @author k.yamuna
*/
fileRemoveEventForInstitution() {
if (this.institutionBasicDetailsModel.filesDTOList != null && this.institutionBasicDetailsModel.filesDTOList != undefined && this.institutionBasicDetailsModel.filesDTOList.length > 0) {
  let removeFileIndex = this.institutionBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.institutionBasicDetailsModel.closureSignedCopyPath);
  this.institutionBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
  this.institutionBasicDetailsModel.closureSignedCopyPath = null;
  this.isDisableSubmit = true;
}
}

  submit() {
    this.msgs = [];
    if(this.memberBasicDetailsModel.memClosingDateVal != undefined && this.memberBasicDetailsModel.memClosingDateVal != null)
      this.memberBasicDetailsModel.memClosingDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberBasicDetailsModel.memClosingDateVal));
       this.memberBasicDetailsModel.status = 7;
       this.membershipBasicDetailsService.submitForApproval(this.memberBasicDetailsModel).subscribe(response => {
      this.responseModel = response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.memberBasicDetailsModel = response;
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        setTimeout(() => {
          this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
          }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });

  }
  submitForGroup() {
    this.msgs = [];
    if(this.memberGroupBasicDetails.closureDateVal != undefined && this.memberGroupBasicDetails.closureDateVal != null)
      this.memberGroupBasicDetails.closureDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupBasicDetails.closureDateVal));
    this.memberGroupBasicDetails.status = 7;
    this.memberShipGroupDetailsService.submitForApproval(this.memberGroupBasicDetails).subscribe(response => {
      this.responseModel = response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.memberGroupBasicDetails = response;
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
          // }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });
  }

  submitForInstitution() {
    this.msgs = [];
    if(this.institutionBasicDetailsModel.closureDateVal != undefined && this.institutionBasicDetailsModel.closureDateVal != null)
      this.institutionBasicDetailsModel.closureDate = this.commonFunctionsService.getUTCEpoch(new Date(this.institutionBasicDetailsModel.closureDateVal));
    this.institutionBasicDetailsModel.status = 7;
    this.memInistitutionsService.submitForApproval(this.institutionBasicDetailsModel).subscribe(response => {
      this.responseModel = response;
      this.msgs = [];
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.institutionBasicDetailsModel =response;
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'success', detail: this.responseModel.statusMsg });
        // setTimeout(() => {
          this.router.navigate([Membershiptransactionconstant.MEMBERSHIP_TRANSACTION]);
          // }, 300);
      } else {
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: this.responseModel.statusMsg });
      }
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    });

  }
// 1024 Responsive Popup 
  individualBasicDetails: boolean = false;
  groupBasicDetails: boolean = false;
  institutionBasicDetails: boolean = false;
  // position: string = 'center';
  showindividualBasicDetailsDialog(position: string) {
    this.position = position;
    this.individualBasicDetails = true;
  }
  showgroupBasicDetailsDialog(position: string) {
    this.position = position;
    this.groupBasicDetails = true;
  }
  showinstitutionBasicDetailsDialog(position: string) {
    this.position = position;
    this.institutionBasicDetails = true;
  }

}
