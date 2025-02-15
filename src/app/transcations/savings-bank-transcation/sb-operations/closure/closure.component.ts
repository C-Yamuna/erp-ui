import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { savingsbanktransactionconstant } from '../../savingsbank-transaction-constant';
import { SbConfigComponent } from 'src/app/configurations/sb-config/sb-config.component';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { SavingBankApplicationService } from '../../savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application.service';
import { AmountBlockService } from '../amount-block/shared/amount-block.service';
import { SavingBankApplicationModel } from '../../savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application-model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-basic-required-details';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonStatusData, MemberShipTypesData, sbStandingDestitnationAccountType } from 'src/app/transcations/common-status-data.json';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { SavingsAccountService } from '../../shared/savings-account.service';
import { StandingInstructionsService } from '../standing-instruction/shared/standing-instructions.service';
import { RdAccountsModel } from 'src/app/transcations/term-deposits-transcation/shared/term-depost-model.model';
import { TermApplication } from 'src/app/transcations/loan-transcation/term-loan/term-loan-stepper/term-loan-application-details/shared/term-application.model';

@Component({
  selector: 'app-closure',
  templateUrl: './closure.component.html',
  styleUrls: ['./closure.component.css']
})
export class ClosureComponent {

  //model classes
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  rdAccountModel:RdAccountsModel = new RdAccountsModel();
  termApplication :TermApplication = new TermApplication();
  
  closureform: FormGroup;
  orgnizationSetting: any;
  sbAccId: any;
  isKycApproved: any;
  responseModel!: Responsemodel;
  memberTypeName: any;
  uploadFileData: any;

// lists
  groupPrmotersList: any[] =[];
  institionPromotersList: any[] =[];
  msgs: any[] = [];
  groupPrmoters: { field: string; header: string; }[];
  multipleFilesList: any[] = [];
  standingInstructionsList: any [] =[];
  rdLinkedAccountList :any[]=[];
  termLoanLinkedAccountsList : any []=[];

// flags
  membreIndividualFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  institutionPromoterFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  showForm: boolean = false;
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  individualFalg: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  rdAccountFlag :boolean = false;
  termLoanFlag :boolean = false;
  isStanderedInstrctionsActive: boolean = false;;
  

  constructor(private router: Router, private formBuilder: FormBuilder, private commonFunctionsService: CommonFunctionsService,
    private translate: TranslateService, private savingBankApplicationService: SavingBankApplicationService,
    private datePipe: DatePipe, private fileUploadService: FileUploadService, private commonComponent: CommonComponent,
     private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService , private savingsAccountService :SavingsAccountService , private standingInstructionsService :StandingInstructionsService) {
    this.closureform = this.formBuilder.group({
      'closureDate': new FormControl('', Validators.required),
      'closureChargs': new FormControl('', Validators.required),
      'fainalBalence': new FormControl('', Validators.required),
      'remarks': new FormControl('',),
    })
    this.groupPrmoters = [ //promoter grid feilds for group and institution
      { field: 'surname', header: 'ERP.SURNAME' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'operatorTypeName', header: 'ERP.OPERATION_TYPE' },
      { field: 'memDobVal', header: 'ERP.DATE_OF_BIRTH' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'genderTypeName', header: 'ERP.GENDER' },
      { field: 'maritalStatusName', header: 'ERP.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'ERP.MOBILE_NUMBER' },
      { field: 'emailId', header: 'ERP.EMAIL' },
      { field: 'aadharNumber', header: 'ERP.AADHAR' },
      { field: 'startDateVal', header: 'ERP.START_DATE' },
    ];
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['id'] != undefined) {
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.sbAccId = Number(id);
          this.getSbAccountDetailsById(this.sbAccId);
        }
      }
    });
  }

  isBasicDetails: boolean = false;
  position: string = 'center';

  backbutton() {
    this.router.navigate([savingsbanktransactionconstant.SB_TRANSACTION]);
  }
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }
/**
* @author jyothi.naidana
* @implements close photo dialogue
*/
close(){
  this.memberPhotoCopyZoom = false;
  this.membreIndividualFlag = false;
}

onClickMemberIndividualMoreDetails(){
this.membreIndividualFlag = true;
}

onClick(){
this.institutionPromoterFlag = true;

}
onClickOfGroupPromotes(){
this.groupPromotersPopUpFlag = true;
}

/**
* @author jyothi.naidana
* @implement onclose popup
*/
closePhotoCopy() {
this.memberPhotoCopyZoom = false;
}

/**
* @implement Image Zoom POp up
* @author jyothi.naidana
*/
onClickMemberPhotoCopy(){
this.memberPhotoCopyZoom = true;
}


closePhoto(){
this.memberPhotoCopyZoom = false;
}



  /**
   * @implements get by sbAccountId
   * @param id 
   * @author jyothi.naidana
   */
  getSbAccountDetailsById(id: any) {
    this.savingBankApplicationService.getSbApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {

          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.savingBankApplicationModel = this.responseModel.data[0];
            if(this.savingBankApplicationModel.closureDate != null && this.savingBankApplicationModel.closureDate != undefined){
              this.savingBankApplicationModel.closureDateVal  = this.datePipe.transform(this.savingBankApplicationModel.closureDate, this.orgnizationSetting.datePipe);
            }
            else {
              this.savingBankApplicationModel.closureDateVal = this.commonFunctionsService.currentDate();
            }
            if (this.savingBankApplicationModel.memberTypeName != null && this.savingBankApplicationModel.memberTypeName != undefined) {
              this.memberTypeCheck(this.savingBankApplicationModel.memberTypeName);
            }
            if (this.savingBankApplicationModel.balance == null || this.savingBankApplicationModel.balance == undefined) {
              this.savingBankApplicationModel.balance = 0;
            }
            if (this.savingBankApplicationModel.closureSignedCopy != null && this.savingBankApplicationModel.closureSignedCopy != undefined) {
              this.savingBankApplicationModel.multipartFileList = this.fileUploadService.getFile(this.savingBankApplicationModel.closureSignedCopy ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.savingBankApplicationModel.closureSignedCopy);
            }
            if(this.savingBankApplicationModel.accountNumber != null && this.savingBankApplicationModel.accountNumber != undefined){
              this.getStanderedInstructionsByAccountNumber(this.savingBankApplicationModel.accountNumber);
            }
          }
        }
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

  /**
   * @implements membership type check 
   * @param memberTypeName 
   * @author jyothi.naidana
   */
  memberTypeCheck(memberTypeName: any) {
    if (memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFalg = true;
      this.groupFlag = false;
      this.institutionFlag = false;
      this.membershipIndividualDetails();
    } else if (memberTypeName == MemberShipTypesData.GROUP) {
      this.individualFalg = false;
      this.groupFlag = true;
      this.institutionFlag = false;
      this.membershipGroupDetails();
    } else if (memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.individualFalg = false;
      this.groupFlag = false;
      this.institutionFlag = true;
      this.membershipInstitutionDetails();
    }
  }

  /**
   * @implements membership data mapping to membership model from sb details
   * @author jyothi.naidana
   */
  membershipIndividualDetails() {
    if (this.savingBankApplicationModel.memberShipBasicDetailsDTO != null && this.savingBankApplicationModel.memberShipBasicDetailsDTO != undefined) {
      this.membershipBasicRequiredDetails = this.savingBankApplicationModel.memberShipBasicDetailsDTO;
      if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
        this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
        this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
        if (this.membershipBasicRequiredDetails.isNewMember) {
          this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath);
        }
        else {
          this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath);
        }
      }
      else {
        this.photoCopyFlag = false;
      }
      if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
        if (this.membershipBasicRequiredDetails.isNewMember) {
          this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath);
        }
        else {
          this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath);
        }
      }
      else {
        this.signatureCopyFlag = false;
      }
      if (this.membershipBasicRequiredDetails.isStaff != null && this.membershipBasicRequiredDetails.isStaff != undefined && this.membershipBasicRequiredDetails.isStaff) {
        this.membershipBasicRequiredDetails.isStaffName = applicationConstants.YES;
      }
      else {
        this.membershipBasicRequiredDetails.isStaffName = applicationConstants.NO;
      }
      if (this.membershipBasicRequiredDetails.isKycApproved != null && this.membershipBasicRequiredDetails.isKycApproved != undefined && this.membershipBasicRequiredDetails.isKycApproved) {
        this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
      }
      else {
        this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
      }
    }
  }

  /**
   * @implements group data mapping to membership model from sb details
   * @author jyothi.naidana
   */
  membershipGroupDetails() {
    if (this.savingBankApplicationModel.groupDetailsDTO != null && this.savingBankApplicationModel.groupDetailsDTO != undefined) {
      this.memberGroupDetailsModel = this.savingBankApplicationModel.groupDetailsDTO;
      if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
        this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
      }
      if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
        this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.memberGroupDetailsModel.isKycApproved != null && this.memberGroupDetailsModel.isKycApproved != undefined && this.memberGroupDetailsModel.isKycApproved) {
        this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
      }
      else {
        this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
      }
      if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
        this.groupPrmotersList = this.memberGroupDetailsModel.groupPromoterList;
        for( let groupPromoters of this.groupPrmotersList){
          if(groupPromoters.dob != null && groupPromoters.dob != undefined){
            groupPromoters.memDobVal = this.datePipe.transform(groupPromoters.dob, this.orgnizationSetting.datePipe);
          }
          if(groupPromoters.startDate != null && groupPromoters.startDate != undefined){
            groupPromoters.startDateVal = this.datePipe.transform(groupPromoters.startDate, this.orgnizationSetting.datePipe);
          }
        }
      }
    }
  }
  /**
   * @implements institution data mapping to membership model from sb details
   * @author jyothi.naidana
   */
  membershipInstitutionDetails() {
    if (this.savingBankApplicationModel.institutionDTO != null && this.savingBankApplicationModel.institutionDTO != undefined) {
      this.membershipInstitutionDetailsModel = this.savingBankApplicationModel.institutionDTO;
      if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
        this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
        this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
        this.institionPromotersList = this.membershipInstitutionDetailsModel.institutionPromoterList;
        for( let institution of this.institionPromotersList){
          if(institution.dob != null && institution.dob != undefined){
            institution.memDobVal = this.datePipe.transform(institution.dob, this.orgnizationSetting.datePipe);
          }
          if(institution.startDate != null && institution.startDate != undefined){
            institution.startDateVal = this.datePipe.transform(institution.startDate, this.orgnizationSetting.datePipe);
          }
        }
      }
      if (this.membershipInstitutionDetailsModel.isKycApproved != null && this.membershipInstitutionDetailsModel.isKycApproved != undefined && this.membershipInstitutionDetailsModel.isKycApproved) {
        this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
      }
      else {
        this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
      }
    }
  }

  /**
     * @implements file upload service
     * @param event
     * @param fileUpload
     * @implements jyothi.naidana
     */
  fileUploader(event: any, fileUpload: FileUpload) {
    this.multipleFilesList = [];
    this.savingBankApplicationModel.filesDTOList = [];
    this.savingBankApplicationModel.closureSignedCopy = null;
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
          this.savingBankApplicationModel.multipartFileList.push(files);
          this.savingBankApplicationModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.savingBankApplicationModel.filesDTOList[0].fileName = "SB_CLOSURE" + this.sbAccId + "_" + timeStamp + "_" + file.name;
        this.savingBankApplicationModel.closureSignedCopy = "SB_CLOSURE" + this.sbAccId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
  * @implements onFile remove
  * @author jyothi.naidana
  */
  fileRemoeEvent() {
    let removeFileIndex = this.savingBankApplicationModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.savingBankApplicationModel.closureSignedCopy);
    let obj = this.savingBankApplicationModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.savingBankApplicationModel.closureSignedCopy);
    this.savingBankApplicationModel.filesDTOList.splice(removeFileIndex, 1);
    this.savingBankApplicationModel.closureSignedCopy = null;
  }

  /**
   * @implements savings Account update
   * @author jyothi.naidana
   */
  savingsAccountClosureUpdate(){
      this.savingBankApplicationModel.accountStatusName = savingsbanktransactionconstant.CLOSURE;
      this.savingBankApplicationModel.closureDate =this.commonFunctionsService.getUTCEpoch(new Date(this.savingBankApplicationModel.closureDateVal));//closure date converstion
      this.savingsAccountService.updateSavingsAccountDetails(this.savingBankApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              // this.router.navigate([savingsbanktransactionconstant.SB_TRANSACTION]);
            }, 2000);
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
  * @implements get standered instruction by account Number
  * @param id 
  * @author jyothi.naidana
  */
  getStanderedInstructionsByAccountNumber(accounNumber: any) {
    this.rdLinkedAccountList = [];
    this.termLoanLinkedAccountsList = [];
    this.standingInstructionsService.getSbStandaredeInstructionsByAccountNumber(accounNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.standingInstructionsList = this.responseModel.data;
          this.standingInstructionsList = this.responseModel.data.filter((obj:any)=> obj.status = applicationConstants.ACTIVE).map((sb: any) => {
            this.isStanderedInstrctionsActive = true;
            if (sb != null && sb != undefined && sb.startDate != null && sb.startDate != undefined) {
              sb.startDate = this.datePipe.transform(sb.startDate, this.orgnizationSetting.datePipe);
            }
            if (sb != null && sb != undefined && sb.endDate != null && sb.endDate != undefined) {
              sb.endDate = this.datePipe.transform(sb.endDate, this.orgnizationSetting.datePipe);
            }
            if (sb.transactionDate != null && sb.transactionDate != undefined) {
              sb.transactionDateVal = this.datePipe.transform(sb.transactionDate, this.orgnizationSetting.datePipe);
            }
            if (sb.signedCopyPath != null && sb.signedCopyPath != undefined) {
              sb.multipartFileListForDocument = this.fileUploadService.getFile(sb.signedCopyPath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + sb.signedCopyPath);
            }
            if (sb.statusName == CommonStatusData.ACTIVE) {
              sb.active = true;
            }
            else {
              sb.active = false;
            }
            if (sb.destinationAccountTypeName != null && sb.destinationAccountTypeName != undefined) {
              if (sb.destinationAccountTypeName == sbStandingDestitnationAccountType.TO_RECURRING_DEPOSIT) {
                this.getRdAccountDetailsByAccountNumber(sb.destinationAccountNumber);
              }
              else if (sb.sbStandingDestitnationAccountType == sbStandingDestitnationAccountType.TO_TERM_LOAN) {
                this.getTermAccountDetailsByAccountNumber(sb.destinationAccountNumber);
              }
            }
            return sb
          });
        }
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

  /**
   * @implements rd account Details By Account Number
   * @author jyothi.naidana
   */
  getRdAccountDetailsByAccountNumber(accounNumber: any) {
    this.standingInstructionsService.getRDAccountByAccountNumber(accounNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          if(this.responseModel.data[0] != null && this.responseModel.data[0] != undefined){
            this.rdAccountModel = this.responseModel.data[0];
            this.rdLinkedAccountList.push(this.rdAccountModel);
            this.rdAccountFlag = true;
          }
        }
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


   /**
   * @implements Term Loan account Details By Account Number
   * @author jyothi.naidana
   */
   getTermAccountDetailsByAccountNumber(accounNumber: any) {
    this.standingInstructionsService.getTermLoanAccountByAccountNumber(accounNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          if(this.responseModel.data[0] != null && this.responseModel.data[0] != undefined){
            this.termApplication = this.responseModel.data[0];
            this.termLoanLinkedAccountsList.push(this.termApplication);
            this.termLoanFlag = true;
          }
        }
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
