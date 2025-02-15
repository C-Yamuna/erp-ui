import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { savingsbanktransactionconstant } from '../../savingsbank-transaction-constant';
import { MembershipBasicRequiredDetails, MemberGroupDetailsModel, MembershipInstitutionDetailsModel } from '../../savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-basic-required-details';
import { SavingBankApplicationModel } from '../../savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application-model';
import { SavingBankApplicationService } from '../../savings-bank-account-creation-stepper/savings-bank-application/shared/saving-bank-application.service';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { StatesService } from 'src/app/transcations/term-deposits-transcation/shared/states.service';
import { MembershipServiceService } from '../../savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { SavingsBankCommunicationService } from '../../savings-bank-account-creation-stepper/savings-bank-communication/shared/savings-bank-communication.service';
import { SbTransactionService } from '../../sb-transactions/shared/sb-transaction.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { StandingInstruction } from './shared/standing-instruction.model';
import { StandingInstructionsService } from './shared/standing-instructions.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonStatusData, Frequency, SbOperationConstantValue } from 'src/app/transcations/common-status-data.json';
import { ServiceTypesService } from 'src/app/configurations/sb-config/service-types/shared/service-types.service';

@Component({
  selector: 'app-standing-instruction',
  templateUrl: './standing-instruction.component.html',
  styleUrls: ['./standing-instruction.component.css']
})
export class StandingInstructionComponent {
  statuses!: SelectItem[];
  destination:any;
  transaction:any;
  transactionlist:any [] =[];
  destinationlist:any [] =[];
  standingform: FormGroup;
  standinginstructions: any[] = [];
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  standingInstruction: StandingInstruction = new StandingInstruction();
  sbAccId: any;

  savingsbank: any[] = [];
  
  operations:any;
  operationslist:any;
  responseModel!: Responsemodel;
  gridListData: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  tempGridListData: any[] = [];
  gridListLenght: Number | undefined;
  pacsId : any;
  branchId : any;
  gridList: any [] = [];
 
  memberTypeName: any;
  admissionNumber: any;
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  isKycApproved: any;
  institionPromotersList: any[] = [];
  groupPrmotersList: any[]=[];
 
  minBalence: any;

  membreIndividualFlag: boolean = false;
  groupPromotersPopUpFlag: boolean = false;
  institutionPromoterFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  columns: any[]= [];
  groupPrmoters: any[] =[];

  serviceCharges: any;
  accountNumber :any;
  productId: any;
  serviceCofigDetailsList: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;
  
  isEditDeleteButtonEnable : boolean = false;
  servicetypeList: any[] = [];
  serviceTypeId: any;

  deleteDialouge :boolean = false;
  standaerInstructionId :any;
  
  

  constructor(private router: Router, private formBuilder: FormBuilder, private savingBankApplicationService: SavingBankApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private savingsBankCommunicationService: SavingsBankCommunicationService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private standingInstructionsService: StandingInstructionsService, private translate: TranslateService, 
    private fileUploadService: FileUploadService, private serviceTypesService:ServiceTypesService) {
    {
      this.standingform = this.formBuilder.group({
        'destinationAccountType': new FormControl('', Validators.required),
        "destinationAccountNumber": new FormControl('', Validators.required),
        "transactionAmount": new FormControl( ['', [Validators.pattern(applicationConstants.AMOUNT_DECIMAL), Validators.compose([Validators.required])]]),
        "paymentFreaquency": new FormControl('', Validators.required),
        "transactionDateMonthlyDate": new FormControl('', Validators.required),
        "requestedDate": new FormControl({ value: '', disabled: true }, Validators.required),
        "serviceDate": new FormControl('', Validators.required),
        "serviceCharges": new FormControl({ value: '', disabled: true }, Validators.required),
        "serviceChargesDebitedFrom": new FormControl({ value: '', disabled: true }),
        "remarks":new FormControl('', ),
      });
      this.groupPrmoters = [
        { field: 'surname', header: 'Surname' },
        { field: 'name', header: 'Name' },
        { field: 'operatorTypeName', header: 'Operation Type' },
        { field: 'memDobVal', header: 'Date of Birth' },
        { field: 'age', header: 'Age' },
        { field: 'genderTypeName', header: 'Gender' },
        { field: 'maritalStatusName', header: 'Marital Status' },
        { field: 'mobileNumber', header: 'Mobile Number' },
        { field: 'emailId', header: 'Email' },
        { field: 'aadharNumber', header: 'Aadhar Number' },
        { field: 'startDateVal', header: 'Start Date' },
      ];
    }
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this. destinationlist = [
      { label: "To Recurring Deposit", value: 1 },
      { label: "To Term Loan", value: 2 },
      // { label: " To Other SB Account", value: 3 },
      // { label: "To Transfer", value: 4 },
    ];
    this. transactionlist = [
      { label: "Monthly", value: 1 },
      { label: "Quarterly", value: 2 },
      { label: "Half Yearly", value: 3 },
      { label: "Yearly", value: 4 },
    ];
    this.standinginstructions = [
      { field: 'destinationAccountTypeName', header: 'DEMANDDEPOSITS.DESTINATION_ACCOUNT_TYPE'},
      { field: 'destinationAccountNumber', header: 'DEMANDDEPOSITS.DESTINATION_ACCOUNT_NUMBER' },
      { field: 'transactionAmount', header: 'DEMANDDEPOSITS.TRANSACTION_AMOUNT' },
      { field: 'transactionDateVal', header: 'DEMANDDEPOSITS.TRANSACTION_DATE' },
      { field: 'numberOfInstallments',header:'DEMANDDEPOSITS.NO_OF_MONTHS'},
      { field: 'startDate', header: 'DEMANDDEPOSITS.REQUESTED_DATE' },
      { field: 'endDate', header: 'DEMANDDEPOSITS.REQUESTED_CANCELLATION_DATE' },
      { field: 'signedCopyPath', header: 'DEMANDDEPOSITS.DOCUMENT' },
      { field: 'statusName', header: 'DEMANDDEPOSITS.STATUS' },
    ];
   
    this.getAllservicetypes();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        if (params['id'] != undefined) {
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.sbAccId = Number(id);
          this.getSbAccountDetailsById(this.sbAccId);
        }
      }
    });
    this.standingInstruction.startDateVal = this.commonFunctionsService.currentDate();
}
/**
 * @implements back Navigation
 * @author jyothi.naidana
 */
backbutton(){
  this.router.navigate([savingsbanktransactionconstant.SB_TRANSACTION]);
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
            if (this.savingBankApplicationModel.accountOpenDate != null && this.savingBankApplicationModel.accountOpenDate != undefined) {
              // this.accountOpeningDateVal = this.datePipe.transform(this.savingBankApplicationModel.accountOpenDate, this.orgnizationSetting.datePipe);
            }
            if (this.savingBankApplicationModel.memberTypeName != null && this.savingBankApplicationModel.memberTypeName != undefined) {
              this.memberTypeName = this.savingBankApplicationModel.memberTypeName;
            }
            if (this.savingBankApplicationModel.admissionNumber != null && this.savingBankApplicationModel.admissionNumber != undefined) {
              this.admissionNumber = this.savingBankApplicationModel.admissionNumber;
            }
            if (this.savingBankApplicationModel.accountNumber != null && this.savingBankApplicationModel.accountNumber != undefined) {
              this.standingInstruction.accountNumber = this.savingBankApplicationModel.accountNumber;
              this.accountNumber = this.savingBankApplicationModel.accountNumber;
              this.getStanderedInstructionsByAccountNumber(this.standingInstruction.accountNumber);
            }
            if (this.savingBankApplicationModel.balance == null || this.savingBankApplicationModel.balance == undefined) {
              this.savingBankApplicationModel.balance = 0;
            }

            if (this.savingBankApplicationModel.productId != null && this.savingBankApplicationModel.productId != undefined) {
              this.getProductDefinitionByProductId(this.savingBankApplicationModel.productId); //get service Charges
            }
            //member individual
            if (this.savingBankApplicationModel.memberShipBasicDetailsDTO != null && this.savingBankApplicationModel.memberShipBasicDetailsDTO != undefined) {
              this.membershipBasicRequiredDetails = this.savingBankApplicationModel.memberShipBasicDetailsDTO;
              if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
                this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
                this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
                if(this.membershipBasicRequiredDetails.isNewMember){
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
                if(this.membershipBasicRequiredDetails.isNewMember){
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
                this.membershipBasicRequiredDetails.isStaff = applicationConstants.YES;
              }
              else {
                this.membershipBasicRequiredDetails.isStaff = applicationConstants.NO;
              }
              if (this.membershipBasicRequiredDetails.isKycApproved != null && this.membershipBasicRequiredDetails.isKycApproved != undefined && this.membershipBasicRequiredDetails.isKycApproved) {
                this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
              }
              else {
                this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
              }
            }
            //group
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
                this.groupPrmotersList = this.savingBankApplicationModel.groupDetailsDTO.groupPromoterList;
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
            //institution
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
 * @implements getStandaredInstructionById
 * @param row 
 * @author jyothi.naidana
 */
getStandardInstructionsById(row:any){
  this.isEditDeleteButtonEnable = true;
  this.standingInstructionsService.getSbStandarEdeInstructions(row.id).subscribe((data: any) => {
    this.responseModel = data;
    if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
      if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0]!= null && this.responseModel.data[0] != undefined) {
        this.standingInstruction = this.responseModel.data[0];
        if (this.standingInstruction.startDate != null && this.standingInstruction.startDate != undefined) {
          this.standingInstruction.startDateVal = this.datePipe.transform(this.standingInstruction.startDate, this.orgnizationSetting.datePipe);
        }
        if (this.standingInstruction.transactionDate != null && this.standingInstruction.transactionDate != undefined) {
          this.standingInstruction.transactionDateVal = this.datePipe.transform(this.standingInstruction.transactionDate, this.orgnizationSetting.datePipe);
        }
        if (this.standingInstruction.endDate != null && this.standingInstruction.endDate != undefined) {
          this.standingInstruction.endDateVal = this.datePipe.transform(this.standingInstruction.endDate, this.orgnizationSetting.datePipe);
        }
        if (this.standingInstruction.signedCopyPath != null && this.standingInstruction.signedCopyPath != undefined) {
          this.standingInstruction.multipartFileListForDocument = this.fileUploadService.getFile(this.standingInstruction.signedCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.standingInstruction.signedCopyPath);
        }
      }
    }
    else {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
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
 * @implements remove standardinstruction
 * @param row 
 * @author jyothi.naidana
 */
deleteStandardInstructions(row:any){
  this.standingInstructionsService.deleteSbStandarEdeInstructions(row.id).subscribe((data: any) => {
    this.responseModel = data;
    if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.msgs = [];
        this.deleteDialouge= false;
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
        if(this.accountNumber != null && this.accountNumber != undefined){
          this.getStanderedInstructionsByAccountNumber(this.accountNumber);
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
 * @implements delete dielogueActivate
 * @author jyothi.naidana
 */
deleteDialogueActivate(){
  this.deleteDialouge= true;
}

/**
 * @implements cancle
 * @author jyothi.naidana
 */
cancelForDialogBox(){
  this.deleteDialouge= false;
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
   * @implements save sbStanderdInstructions
   * @param id 
   * @author jyothi.naidana
   */
  saveStandaeredInstructions(obj: any) {
    this.isEditDeleteButtonEnable = false;
    obj.accontNumber = this.accountNumber;
    obj.sbAccId = this.sbAccId;
    if(this.destinationlist != null && this.destinationlist != undefined && this.destinationlist.length > 0){
      let filteredObj = this.destinationlist.find((data: any) => null != data && data.value == obj.destinationAccountType);
      if (filteredObj != null && undefined != filteredObj){
        obj.destinationAccountTypeName = filteredObj.label;//destination account Type Mapping
      }
    }
    if (obj.startDateVal != null && obj.startDateVal != undefined) {
      obj.startDateVal = this.datePipe.transform(obj.startDateVal, this.orgnizationSetting.datePipe);//startDate converstion
    }
    if (obj.endDateVal != null && obj.endDateVal != undefined) {
      obj.endDateVal = this.datePipe.transform(obj.endDateVal, this.orgnizationSetting.datePipe);;//startDate converstion
    }
    if (obj.startDateVal != null && obj.startDateVal != undefined) {
      obj.startDate = this.commonFunctionsService.getUTCEpoch(new Date(obj.startDateVal));//startDate converstion
    }
    if (obj.endDateVal != null && obj.endDateVal != undefined) {
      obj.endDate = this.commonFunctionsService.getUTCEpoch(new Date(obj.endDateVal));//startDate converstion
    }
    if (obj.transactionDateVal != null && obj.transactionDateVal != undefined) {
      obj.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(obj.transactionDateVal));//startDate converstion
    }
    if(obj.paymentFrequency != null && obj.paymentFrequency != undefined){
      let frequency = this.transactionlist.find((freq:any) => freq.value === obj.paymentFrequency);
      
      if(frequency != null && frequency != undefined){
        let enddateParts: string[] = obj.endDateVal.split("/");//end date
        // Extract parts
        let endDateday: string = enddateParts[0];   // "12"
        let endDatemonth = this.months(enddateParts[1]); // "08"
        let endDateyear: string = enddateParts[2];  // "2025"

        let startdateParts: string[] = obj.startDateVal.split("/");//end date
        // Extract parts
        let startdateDay: string = startdateParts[0];   // "12"
        let startdateMonth = this.months(startdateParts[1]) ; // "08"
        let startdateYear: string = startdateParts[2];  // "2025"

        if(frequency.label == Frequency.MONTHLY ){//total payble months for service Charges
          obj.numberOfInstallments  = (Number(endDateyear) - Number(startdateYear)) * 12 + (Number(endDatemonth) - Number(startdateMonth));
        }
        else if(frequency.label == Frequency.YEARLY ){//total payble years
          obj.numberOfInstallments =  Number(endDateyear) - Number(startdateYear) ;
        } 
        else if(frequency.label === Frequency.HALF_YEARLY ){//total payble halfyearly
          obj.numberOfInstallments  = (((Number(endDateyear) - Number(startdateYear)) * 12 + (Number(endDatemonth) - Number(startdateMonth)))/12)*2;
        }
        else if(frequency.label == Frequency.QUATERLY ){//total payble quaterly
          obj.numberOfInstallments  = (((Number(endDateyear) - Number(startdateYear)) * 12 + (Number(endDatemonth) - Number(startdateMonth)))/12)*4;
        }
        else if(frequency.label == Frequency.DAYS ){//total payble days
          obj.numberOfInstallments  = ((Number(endDateyear) - Number(startdateYear)) * 12 + (Number(endDatemonth) - Number(startdateMonth)))/4;
        }
      }
    }
    if (obj.id != null && obj.id != undefined) {//update
      this.standingInstructionsService.updateSbStandarEdeInstructions(obj).subscribe((data: any) => {
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
              this.cancelOrRefresh();//for refresh the form
              if(this.accountNumber != null && this.accountNumber != undefined){//for grid list
                this.getStanderedInstructionsByAccountNumber(this.accountNumber);
              }
            }
          }
        }
        else {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          this.cancelOrRefresh();
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
      obj.status = applicationConstants.ACTIVE;
      this.standingInstructionsService.addSbStandarEdeInstructions(obj).subscribe((data: any) => {//create or save
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
              this.cancelOrRefresh();//for refresh the form
              if(this.accountNumber != null && this.accountNumber != undefined){//for grid list
                this.getStanderedInstructionsByAccountNumber(this.accountNumber);
              }
            }
          }
        }
        else {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          this.cancelOrRefresh();
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

  /**
 * @implements get standered instruction by account Number
 * @param id 
 * @author jyothi.naidana
 */
  getStanderedInstructionsByAccountNumber(accounNumber: any) {
    this.standingInstructionsService.getSbStandaredeInstructionsByAccountNumber(accounNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined && this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.gridList = this.responseModel.data;
          this.gridList = this.responseModel.data.map((sb: any) => {
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
              sb.multipartFileListForDocument = this.fileUploadService.getFile(sb.signedCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + sb.signedCopyPath);
            }
            if(sb.statusName ==CommonStatusData.ACTIVE){
              sb.active = true;
            }
            else {
              sb.active = false;
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
   * @implements cancle standared instructions saveOrUpdate
   * @author jyothi.naidana
   */
    cancelOrRefresh(){
      // this.router.navigate([savingsbanktransactionconstant.SB_TRANSACTION]);
      let startDate = this.standingInstruction.startDate ;
      let startDateVal = this.standingInstruction.startDateVal;
      let serviceChanrgesDebitedFrom = this.standingInstruction.accountNumber;
      let serviceCharges = this.standingInstruction.serviceCharges;
      
      this.standingInstruction = new StandingInstruction();

      // constant Data;
      this.standingInstruction.accountNumber = serviceChanrgesDebitedFrom;
      this.standingInstruction.serviceCharges = serviceCharges ;

      this.standingInstruction.startDateVal = this.commonFunctionsService.currentDate();
      if(this.accountNumber != null && this.accountNumber != undefined){
        this.standingInstruction.accountNumber = this.accountNumber;
      }
     this.isEditDeleteButtonEnable = false;
    }

    /**
     * @implements file upload service
     * @param event
     * @param fileUpload
     * @implements jyothi.naidana
     */
    fileUploader(event: any, fileUpload: FileUpload) {
      this.multipleFilesList = [];
      this.standingInstruction.filesDTOList = [];
      this.standingInstruction.signedCopyPath = null;
      this.standingInstruction.multipartFileListForDocument = [];
      let files: FileUploadModel = new FileUploadModel();

      let selectedFiles = [...event.files];
        // Clear file input before processing files
      fileUpload.clear();

      for (let file of selectedFiles) {
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
            this.standingInstruction.filesDTOList.push(files); // Add to filesDTOList array
            this.standingInstruction.multipartFileListForDocument.push(files);
          }
          let timeStamp = this.commonComponent.getTimeStamp();
          this.standingInstruction.filesDTOList[0].fileName = "SB_STANADERED_INSTRUCTIONS" + this.sbAccId + "_" +timeStamp+ "_"+ file.name ;
          this.standingInstruction.signedCopyPath = "SB_STANADERED_INSTRUCTIONS" + this.sbAccId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
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
    let removeFileIndex = this.standingInstruction.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.standingInstruction.signedCopyPath);
    let obj = this.standingInstruction.filesDTOList.find((obj: any) => obj && obj.fileName === this.standingInstruction.signedCopyPath);
    this.standingInstruction.filesDTOList.splice(removeFileIndex, 1);
    this.standingInstruction.signedCopyPath = null;
  }
  isBasicDetails: boolean = false;
  position: string = 'center';
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }

  /**
   * @implements get product details
   * @param id 
   * @author jyothi.naidana
   */
  getProductDefinitionByProductId(id: any) {
    this.savingBankApplicationService.getProductByProductId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          if (this.responseModel.data[0].accServiceConfigChargesList != null && this.responseModel.data[0].accServiceConfigChargesList != undefined && this.responseModel.data[0].accServiceConfigChargesList.length > 0) {
            let serviceChargesList = this.responseModel.data[0].accServiceConfigChargesList.filter((data: any) => data != null && data.serviceTypeId == this.serviceTypeId);
              if(serviceChargesList != null && serviceChargesList != undefined && serviceChargesList.length >0){
                this.standingInstruction.serviceCharges = serviceChargesList[0].serviceCharges;
              }
          }
        }
      }
    });
  }

  /**
   * @implements get all service Types master for compare service Type Id
   * @author jyothi.naidana
   */
  getAllservicetypes() {
    this.commonComponent.startSpinner();
    this.servicetypeList =[];
    this.serviceTypesService.getAllServiceTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }else{
          this.servicetypeList = this.responseModel.data.filter((documenttype:any) => documenttype.status == applicationConstants.ACTIVE).map((count:any) => {
            return { label: count.name, value: count.id }
          });
          let serviceType =  this.servicetypeList.find((data:any) => null != data && data.label == SbOperationConstantValue.STANDING_INSTRUCTIONS);
          if(serviceType != null && undefined != serviceType )
             this.serviceTypeId = serviceType.value;
          this.commonComponent.stopSpinner();
        }
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
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
   * @implements month Number comparison for number of months for srevice charges
   * @param month 
   * @returns monthNumber
   * @author jyothi.naidana
   */
  months(month :any){
    let monthNumber ;
    if(month == "Jan"){
      monthNumber = 1;
    }
    else if(month == "Feb"){
      monthNumber = 2;
    }else if(month == "Mar"){
      monthNumber = 3;
    }else if(month == "Apr"){
      monthNumber = 4;
    }else if(month == "May"){
      monthNumber = 5;
    }else if(month == "Jun"){
      monthNumber = 6;
    }else if(month == "Jul"){
      monthNumber = 7;
    }
    else if(month == "Aug"){
      monthNumber = 8;
    }
    else if(month == "Sep"){
      monthNumber = 9;
    }
    else if(month == "Oct"){
      monthNumber = 10;
    }
    else if(month == "Nov "){
      monthNumber = 11;
    }
    else if(month == "Dec"){
      monthNumber = 12;
    }
    return monthNumber;
  }

}



