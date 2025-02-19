import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { savingsbanktransactionconstant } from '../savingsbank-transaction-constant';
import { SavingsAccountService } from '../shared/savings-account.service';
import { CommunicationDetailsModel, KycDetailsModel, NomineeDetailsModel, ViewSavingBankModel } from './shared/view-saving-bank-model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-basic-required-details';
import { MemberGuardianDetailsModelDetaila } from '../savings-bank-account-creation-stepper/savings-bank-nominee/shared/savings-bank-nominee-model';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { MemberShipTypesData } from '../../common-status-data.json';
import { MemberGuardianDetailsModel, MemberNomineeDetails } from '../../membership-transcation/shared/member-basic-details.model';

@Component({
  selector: 'app-view-savings-bank',
  templateUrl: './view-savings-bank.component.html',
  styleUrls: ['./view-savings-bank.component.css']
})
export class ViewSavingsBankComponent {
  amountblock: any[] = [];
  admissionNumber: any;
  id: any;
  viewSavingBankModel : ViewSavingBankModel = new ViewSavingBankModel();
  communicationDetailsModel : CommunicationDetailsModel = new CommunicationDetailsModel();
  kycDetailsModel : KycDetailsModel = new KycDetailsModel();
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGuardianDetailsModelDetails: MemberGuardianDetailsModelDetaila = new MemberGuardianDetailsModelDetaila();
  memberNomineeDetailsModel: MemberNomineeDetails = new MemberNomineeDetails();
  memberGuardianDetailsDetailsModel: MemberGuardianDetailsModel = new MemberGuardianDetailsModel();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  responseModel!: Responsemodel;
  msgs: any[] = [];
  admissionDetails: FormGroup ; 
  kycDetailsColumns: any[]= [];
  kycGridList : any [] = []
  serviceTypesColumns: any[]= [];
  serviceTypesGridList :any [] = [];
  nomineeDetailsModel : NomineeDetailsModel = new NomineeDetailsModel();
  nomineeMemberFullName: any;
  editOption: boolean = false;
  memberTypeName: any;
  preveiwFalg: any;
  flag: boolean = false;
  addressOne: any;
  addressTwo: any;
  gardianFullName: any;
  orgnizationSetting: any;
  promoterDetails: any;
  institutionPromoter: any;
  memberBasicDetailsFalg: boolean = false;
  memberGroupFlag:boolean = false;
  memberIntitutionFlag:boolean = false;
  memberPromoterDetails : any
  groupPromoterList : any [] = [];
  sbAccId: any;
  isNewMember: boolean = false;
  institutionPromoterFlag: boolean = false;
  groupPromotersPopUpFlag: boolean= false;
  requiredDocumentsList: any [] = [];
  jointHolderDetailsList: any;
  jointHoldersFlag: boolean = false;
  
  groupPrmotersList: any[]=[];
  institionPromotersList: any[]=[];
  columns: any[] = [];
  groupPrmoters : any[] = [];
  photoCopyFlag: boolean = true;
  signatureCopyFlag: boolean = true;
  memberPhotoCopyZoom: boolean = false;
  membreIndividualFlag: boolean = false;
  isKycApproved : any;
  guardainFormEnable: boolean = false;
  isShowSubmit: boolean =applicationConstants.FALSE;
  isKycEmpty: boolean = false;
  isStaff: any;
  isFileUploaded: boolean = false;
  multipleFilesList: any[] = [];
  uploadFileData: any;
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  individualFlag: boolean = false;
  institutionFlag: boolean = false;
  groupFlag: boolean = false;
  kycPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;
  docPhotoCopyZoom:boolean = false;
  nomineePhotoCopyZoom:boolean = false;
  guardianPhotoCopyZoom:boolean = false;
  submitForApprovalMessage: any;
  submitForApprovalValidation: boolean = true;
;
  constructor(private router: Router, private formBuilder:FormBuilder , private savingsAccountService: SavingsAccountService ,private commonComponent : CommonComponent  ,private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService , private commonFunctionsService :CommonFunctionsService ,private datePipe: DatePipe ,private fileUploadService :FileUploadService , private translate: TranslateService) { 
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
    this.serviceTypesColumns = [
      { field: 'serviceTypeName', header: 'ERP.SERVICE_TYPE' },
      { field: 'isChargeApplicableName', header: 'ERP.IS_CHARGE_APPLICAPABLE' },
      { field: 'chargesCollectionFrequencyName', header: 'ERP.FREQUENCY_TYPE' },
      { field: 'serviceCharges', header: 'ERP.SERVICE_CHARGES'},
      { field: 'requestDocPath', header: 'ERP.FILE' },
      // { field: 'statusName', header: 'ERP.STATUS' },
      
    ];
    this.columns = [
      { field: 'surname', header: 'Surname' },
      { field: 'name', header: 'Name' },
      { field: 'operatorTypeName', header: 'Operation Type' },
      { field: 'memDobVal', header: 'Date of Birth' },
      { field: 'age', header: 'Age' },
      { field: 'genderName', header: 'Gender' },
      { field: 'maritalStatusName', header: 'Marital Status' },
      { field: 'mobileNumber', header: 'Mobile Number' },
      { field: 'emailId', header: 'Email' },
      { field: 'aadharNumber', header: 'Aadhar Number' },
      { field: 'startDateVal', header: 'Start Date' },
    ];
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
    this.admissionDetails = this.formBuilder.group({
      admissionNumber: ['', [Validators.required, Validators.minLength(3)]],
      templatepath: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required, Validators.minLength(18)]],
      statusName: ['', [Validators.required, Validators.min(18)]]
    });
  }

  ngOnInit() {
    this.genderList = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 2 },
    ]
   
    this.maritalstatusList = [
      { label: 'Married', value: 1 },
      { label: 'Un-Married', value: 2 }
    ]
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined && params['editOpt'] != undefined) {
         let id = this.encryptDecryptService.decrypt(params['id']);
        // let type = this.encryptDecryptService.decrypt(params['memType']);
        let idEdit = this.encryptDecryptService.decrypt(params['editOpt']);
        this.sbAccId = Number(id);

        if (idEdit == "1")
          this.preveiwFalg = true
        else{
          this.preveiwFalg = false;
        }
        if (params['isGridPage'] != undefined && params['isGridPage'] != null) {
          let isGrid = this.encryptDecryptService.decrypt(params['isGridPage']);
          if (isGrid === "0") {
            this.isShowSubmit = applicationConstants.FALSE;
          } else {
            this.isShowSubmit = applicationConstants.TRUE;
          }
        }
          this.getSavingBankPreviewDetails();
      } 
    })
  }
  
  backbutton() {
      this.router.navigate([savingsbanktransactionconstant.SB_TRANSACTION]);
  }
  /**
   * @implements submit for approval
   * @author jyothi.naidana
   */
  submit() {
    this.submitForApprovalCheck();
    if (this.submitForApprovalValidation) {
      this.viewSavingBankModel.accountStatusName = savingsbanktransactionconstant.SUBMISSION_FOR_APPROVAL;
      this.savingsAccountService.updateSavingsAccountDetails(this.viewSavingBankModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.router.navigate([savingsbanktransactionconstant.SB_TRANSACTION]);
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
  }
  /**
   * @implements get savings application details by account id
   * @author jyothi.naidana
   */
  getSavingBankPreviewDetails() {
    this.savingsAccountService.getSavingsAccountDetailsById(this.sbAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.viewSavingBankModel = this.responseModel.data[0];
          if (this.viewSavingBankModel.accountOpenDate != null && this.viewSavingBankModel.accountOpenDate != undefined) {
            this.viewSavingBankModel.accountOpenDateVal = this.datePipe.transform(this.viewSavingBankModel.accountOpenDate, this.orgnizationSetting.datePipe);
          }
          if (this.viewSavingBankModel.memberTypeName != null && this.viewSavingBankModel.memberTypeName != undefined) {
            this.memberTypeName = this.viewSavingBankModel.memberTypeName;
            this.memberTypeCheck(this.memberTypeName);
            if(this.memberTypeName != MemberShipTypesData.INDIVIDUAL){
              this.viewSavingBankModel.accountTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
            }
          }
          if (this.viewSavingBankModel.age != null && this.viewSavingBankModel.age != undefined && this.viewSavingBankModel.age < 18) {
            this.guardainFormEnable = true;
          }
          //membership details
          if (this.viewSavingBankModel != null && this.viewSavingBankModel != undefined) {
            this.membershipBasicDetails();//individual
            this.groupDetails();//group
            this.InstitutionDetails();//institution

            //communication details
            if (this.viewSavingBankModel.sbCommunicationDTO != null && this.viewSavingBankModel.sbCommunicationDTO != undefined) {
              this.communicationDetailsModel = this.viewSavingBankModel.sbCommunicationDTO;
            }
            //required documents
            if (this.viewSavingBankModel.requiredDocumentDetailsDTOList != null && this.viewSavingBankModel.requiredDocumentDetailsDTOList != undefined && this.viewSavingBankModel.requiredDocumentDetailsDTOList.length > 0) {
              this.requiredDocumentsList = this.viewSavingBankModel.requiredDocumentDetailsDTOList;
              for (let document of this.requiredDocumentsList) {
                if (document.requiredDocumentFilePath != null && document.requiredDocumentFilePath != undefined) {
                    document.multipartFileList = this.fileUploadService.getFile(document.requiredDocumentFilePath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + document.requiredDocumentFilePath);
                }
              }
            }
            //kyc list
            if (this.viewSavingBankModel.kycList != null && this.viewSavingBankModel.kycList != undefined) {
              this.kycGridList = this.viewSavingBankModel.kycList;
              for (let kyc of this.kycGridList) {
                if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                  if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                    if (this.viewSavingBankModel.isNewMember)
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
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
            //service charges
            if (this.viewSavingBankModel.sbAccountServicesOptedDTOList != null && this.viewSavingBankModel.sbAccountServicesOptedDTOList != undefined)
              this.serviceTypesGridList = this.viewSavingBankModel.sbAccountServicesOptedDTOList;
            //account service list
            if (this.viewSavingBankModel.sbAccountServicesOptedDTOList != null && this.viewSavingBankModel.sbAccountServicesOptedDTOList != undefined && this.viewSavingBankModel.sbAccountServicesOptedDTOList.length > 0) {
              this.viewSavingBankModel.sbAccountServicesOptedDTOList = this.viewSavingBankModel.sbAccountServicesOptedDTOList.map((serviceCharges: any) => {
                serviceCharges.requestDocPathMultipartFileList = this.fileUploadService.getFile(serviceCharges.requestDocPath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + serviceCharges.requestDocPath);

              });
            }
            //nominee details
            if (this.viewSavingBankModel.sbNomineeDTO != null && this.viewSavingBankModel.sbNomineeDTO != undefined) {
              this.nomineeDetailsModel = this.viewSavingBankModel.sbNomineeDTO;
              if (this.nomineeDetailsModel.name != null && this.nomineeDetailsModel.name != undefined && this.nomineeDetailsModel.surname != null && this.nomineeDetailsModel.surname != undefined)
                this.nomineeMemberFullName = this.nomineeDetailsModel.name + this.nomineeDetailsModel.surname;
              if (this.nomineeDetailsModel.signedNomineeForm != null && this.nomineeDetailsModel.signedNomineeForm != undefined){
                if(this.nomineeDetailsModel.nomineeType == 2){
                  this.nomineeDetailsModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.nomineeDetailsModel.signedNomineeForm , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.nomineeDetailsModel.signedNomineeForm);
                }
                else {
                  this.nomineeDetailsModel.nomineeSighnedFormMultiPartList =  this.fileUploadService.getFile(this.nomineeDetailsModel.signedNomineeForm , ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.nomineeDetailsModel.signedNomineeForm);
                }
              }
            }
            //guardina details
            if (this.viewSavingBankModel.sbGuardianDetailsDTO != null && this.viewSavingBankModel.sbGuardianDetailsDTO != undefined) {
              this.memberGuardianDetailsModelDetails = this.viewSavingBankModel.sbGuardianDetailsDTO;
              this.gardianFullName = this.memberGuardianDetailsModelDetails.name + this.memberGuardianDetailsModelDetails.surName;
              if (this.memberGuardianDetailsModelDetails.gaurdianSignedCopyPath != null && this.memberGuardianDetailsModelDetails.gaurdianSignedCopyPath != undefined) {
                this.memberGuardianDetailsModelDetails.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.memberGuardianDetailsModelDetails.gaurdianSignedCopyPath, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModelDetails.gaurdianSignedCopyPath);
              }
            }
            //joint holder
            if (this.viewSavingBankModel.accountTypeName != null && this.viewSavingBankModel.accountTypeName != undefined && this.viewSavingBankModel.accountTypeName === "Joint") {
              this.jointHoldersFlag = true;
            }
            //joint holder
            if (this.viewSavingBankModel.sbJointAccHolderDetailsDTOList != null && this.viewSavingBankModel.sbJointAccHolderDetailsDTOList != undefined && this.viewSavingBankModel.sbJointAccHolderDetailsDTOList.length > 0) {
              this.jointHoldersFlag = true;
              this.jointHolderDetailsList = this.viewSavingBankModel.sbJointAccHolderDetailsDTOList;
              this.jointHolderDetailsList.map((joint: any) => {
                joint.admissionDateVal = this.datePipe.transform(joint.admissionDate, this.orgnizationSetting.datePipe);
              });
            }
             //account service list
             if (this.viewSavingBankModel.applicationSignedForm != null && this.viewSavingBankModel.applicationSignedForm != undefined) {
              this.viewSavingBankModel.multipartFileList = this.fileUploadService.getFile(this.viewSavingBankModel.applicationSignedForm, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.viewSavingBankModel.applicationSignedForm);
              this.isFileUploaded = applicationConstants.TRUE;
            }
            

          }
          // this.msgs = [];
          // this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          // setTimeout(() => {
          //   this.msgs = [];
          // }, 2000);
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

  /**
   * @implements submit for approval Check
   * @author jyothi.naidana
   */
  submitForApprovalCheck() {
    if (this.individualFlag) {
      if (this.viewSavingBankModel == null || this.viewSavingBankModel == undefined || this.viewSavingBankModel.productId == null || this.viewSavingBankModel.kycList == null || this.viewSavingBankModel.kycList == undefined || this.viewSavingBankModel.kycList.length == 0 || this.communicationDetailsModel == null || this.communicationDetailsModel == undefined || this.membershipBasicRequiredDetails == null || this.membershipBasicRequiredDetails == undefined) {
        this.submitForApprovalMessage = "please update mandotory details application,Kyc,Communication";
        this.submitForApprovalValidation = false;
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.submitForApprovalMessage }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
    else if (this.groupFlag) {
      if (this.viewSavingBankModel == null || this.viewSavingBankModel == undefined || this.viewSavingBankModel.productId == null || this.viewSavingBankModel.kycList == null || this.viewSavingBankModel.kycList == undefined || this.viewSavingBankModel.kycList.length == 0 || this.communicationDetailsModel == null || this.communicationDetailsModel == undefined || this.memberGroupDetailsModel == null || this.memberGroupDetailsModel == undefined) {
        this.submitForApprovalMessage = "please update mandotory details application,Kyc,Communication";
        this.submitForApprovalValidation = false;
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.submitForApprovalMessage }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
    else if (this.institutionFlag) {
      if (this.viewSavingBankModel == null || this.viewSavingBankModel == undefined || this.viewSavingBankModel.productId == null || this.viewSavingBankModel.kycList == null || this.viewSavingBankModel.kycList == undefined || this.viewSavingBankModel.kycList.length == 0 || this.communicationDetailsModel == null || this.communicationDetailsModel == undefined || this.membershipInstitutionDetailsModel == null || this.membershipInstitutionDetailsModel == undefined) {
        this.submitForApprovalMessage = "please update mandotory details application,Kyc,Communication";
        this.submitForApprovalValidation = false;
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.submitForApprovalMessage}];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
    
  }

  applicationEdit(rowData: any) {
    if(rowData.accountTypeName == "Joint"){
    this.flag = true;
  }
  else {
    this.flag = false;
  }
    this.router.navigate([savingsbanktransactionconstant.SB_APPLICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id)} });
  }

  communicationEdit(rowData: any) {
    this.router.navigate([savingsbanktransactionconstant.SB_COMMUNICATION], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  kycEdit(rowData: any) {
    if(this.isNewMember){
    this.router.navigate([savingsbanktransactionconstant.SB_KYC], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
    }
    else{
      this.router.navigate([savingsbanktransactionconstant.MEMBERSHIP_BASIC_DETAILS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });

    }
  }

  nomineeEdit(rowData: any) {
    this.router.navigate([savingsbanktransactionconstant.SB_NOMINEE], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) , preview: this.encryptDecryptService.encrypt(true) } });
  }
  serviceEdit(rowData: any) {
    this.router.navigate([savingsbanktransactionconstant.SB_SERVICES], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  editRequiredDocuments(rowData : any){
    this.router.navigate([savingsbanktransactionconstant.SB_REQUIRED_DOCUMENTS], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  editMembership(rowData : any){
    this.router.navigate([savingsbanktransactionconstant.NEW_MEMBERSHIP], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }
  
  editJointHolder(rowData : any){
    this.router.navigate([savingsbanktransactionconstant.SB_JOINTACCOUNT], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  onClick(){
    this.institutionPromoterFlag = true;
    
  }
  onClickOfGroupPromotes(){
    this.groupPromotersPopUpFlag = true;
  }

  close(){
    this.institutionPromoterFlag = false;
    this.groupPromotersPopUpFlag = false;
    this.membreIndividualFlag = false;
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

  /**
   * @author jyothi.naidana
   * @implements close photo dialogue
   */
  closePhoto(){
    this.memberPhotoCopyZoom = false;
  }

  onClickMemberIndividualMoreDetails(){
    this.membreIndividualFlag = true;
  }

  membershipBasicDetails(){
    if(this.viewSavingBankModel.memberShipBasicDetailsDTO != undefined && this.viewSavingBankModel.memberShipBasicDetailsDTO != null){
      this.membershipBasicRequiredDetails = this.viewSavingBankModel.memberShipBasicDetailsDTO;
      if(this.membershipBasicRequiredDetails.isNewMember != null && this.membershipBasicRequiredDetails.isNewMember != undefined){
        this.isNewMember = this.membershipBasicRequiredDetails.isNewMember;
      }
      if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
        this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
        this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
        if(this.membershipBasicRequiredDetails.isNewMember){
          this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
        }
        else{
          this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
        }
      }
      else{
        this.photoCopyFlag = false;
      }
      if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
        if(this.membershipBasicRequiredDetails.isNewMember){
          this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
        }
        else{
          this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
        }
      }
      else{
        this.signatureCopyFlag = false;
      }
      if (this.membershipBasicRequiredDetails.isStaff != null && this.membershipBasicRequiredDetails.isStaff != undefined && this.membershipBasicRequiredDetails.isStaff) {
        this.isStaff = applicationConstants.YES;
      }
      else{
        this.isStaff = applicationConstants.NO;
      }
      if (this.membershipBasicRequiredDetails.isKycApproved != null && this.membershipBasicRequiredDetails.isKycApproved != undefined && this.membershipBasicRequiredDetails.isKycApproved) {
        this.isKycApproved = applicationConstants.KYC_APPROVED_NAME;
      }
      else {
        this.isKycApproved = applicationConstants.KYC_NOT_APPROVED_NAME;
      }
    }
  }

  groupDetails() {
    if (this.viewSavingBankModel.groupDetailsDTO != undefined && this.viewSavingBankModel.groupDetailsDTO != null) {
      this.memberGroupDetailsModel = this.viewSavingBankModel.groupDetailsDTO;
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

  InstitutionDetails(){
    if(this.viewSavingBankModel.institutionDTO != undefined && this.viewSavingBankModel.institutionDTO != null){
      this.membershipInstitutionDetailsModel = this.viewSavingBankModel.institutionDTO;
      if(this.membershipInstitutionDetailsModel.isNewMember != null && this.membershipInstitutionDetailsModel.isNewMember != undefined){
        this.isNewMember =  this.membershipInstitutionDetailsModel.isNewMember;
      }
      if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
        this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
        this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
      }
      if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
        this.institionPromotersList=this.membershipInstitutionDetailsModel.institutionPromoterList ;
        for (let promoter of this.institionPromotersList) {
          if (promoter.dob != null && promoter.dob != undefined) {
            promoter.memDobVal = this.datePipe.transform(promoter.dob, this.orgnizationSetting.datePipe);
          }
          if (promoter.startDate != null && promoter.startDate != undefined) {
            promoter.startDateVal = this.datePipe.transform(promoter.startDate, this.orgnizationSetting.datePipe);
          }
          if (promoter.genderId != null && promoter.genderId != undefined) {
            let gender = this.genderList.filter((obj:any) => obj.value == promoter.genderId);
            if(gender != null && gender != undefined && gender.length >0)
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

  pdfDownload() {
    this.commonComponent.startSpinner();
    this.savingsAccountService.downloadPreviewPDf(this.sbAccId).subscribe((data: any) => {
      var file = new Blob([data], { type: 'application/pdf' });
      saveAs(file, "Savings_application_filled_Document.pdf");
      this.msgs = [];
      this.msgs.push({ severity: "success", detail: 'Savings application file downloaded successfully' });
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
      this.commonComponent.stopSpinner();
    }, error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: "error", detail: 'Unable to download filled FHR' });
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    })
     
  }

  pdfUploader(event:any,fileUpload:any){
    this.isFileUploaded = applicationConstants.TRUE;
    this.multipleFilesList = [];
    this.viewSavingBankModel.filesDTOList = [];
    this.viewSavingBankModel.multipartFileList = [];
    this.viewSavingBankModel.applicationSignedForm = null;
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
          this.viewSavingBankModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.viewSavingBankModel.filesDTOList[0].fileName = "Sb_Application_signed_copy" + this.sbAccId + "_" +timeStamp+ "_"+ file.name ;
        this.viewSavingBankModel.applicationSignedForm = "Sb_Application_signed_copy" + this.sbAccId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements on file remove
   * @author jyothi.naidana
   */
  fileRemoeEvent(){
    this.isFileUploaded = applicationConstants.FALSE;
    let removeFileIndex = this.viewSavingBankModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.viewSavingBankModel.applicationSignedForm);
    let obj = this.viewSavingBankModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.viewSavingBankModel.applicationSignedForm);
    this.viewSavingBankModel.filesDTOList.splice(removeFileIndex, 1);
    this.viewSavingBankModel.applicationSignedForm = null;
  }

  /**
   * @implements memberType Check
   * @author jyothi.naidana
   */
  memberTypeCheck(memberTypeName :any){
    if(memberTypeName == MemberShipTypesData.INDIVIDUAL){
      this.individualFlag = true;
      this.institutionFlag = false;
      this.groupFlag = false;
    }else if(memberTypeName == MemberShipTypesData.GROUP){
      this.individualFlag = false;
      this.institutionFlag = false;
      this.groupFlag = true;

    }else if(memberTypeName == MemberShipTypesData.INSTITUTION){
      this.individualFlag = false;
      this.institutionFlag = true;
      this.groupFlag = false;

    }
  }
  onClickkycPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  onClickdoccPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.docPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  onClicknomineePhotoCopy(){
    this.nomineePhotoCopyZoom = true;
  }
  onClickguardianPhotoCopy(){
    this.guardianPhotoCopyZoom = true;
  }
  // Popup Maximize
              @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
              
                onDialogResize(event: any) {
                  this.isMaximized = event.maximized;
              
                  if (this.isMaximized) {
                    // Restore original image size when maximized
                    this.imageElement.nativeElement.style.width = 'auto';
                    this.imageElement.nativeElement.style.height = 'auto';
                    this.imageElement.nativeElement.style.maxWidth = '100%';
                    this.imageElement.nativeElement.style.maxHeight = '100vh';
                  } else {
                    // Fit image inside the dialog without scrollbars
                    this.imageElement.nativeElement.style.width = '100%';
                    this.imageElement.nativeElement.style.height = '100%';
                    this.imageElement.nativeElement.style.maxWidth = '100%';
                    this.imageElement.nativeElement.style.maxHeight = '100%';
                    this.imageElement.nativeElement.style.objectFit = 'contain';
                  }
                }
}
