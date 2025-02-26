import { SiLoanApplication } from './../../../shared/si-loans/si-loan-application.model';
import { SiLoanDisbursement } from './../../../shared/si-loans/si-loan-disbursement.model';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Table } from 'primeng/table';
import { SiDisbursementService } from '../../../shared/si-loans/si-disbursement.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { SiProductDefinitionService } from '../../../shared/si-loans/si-product-definition.service';
import { SiLoanProductDefinition } from '../../../shared/si-loans/si-loan-product-definition.model';
import { TranslateService } from '@ngx-translate/core';
import { MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { MemberGroupDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';

@Component({
  selector: 'app-simple-interest-loan-disbursement',
  templateUrl: './simple-interest-loan-disbursement.component.html',
  styleUrls: ['./simple-interest-loan-disbursement.component.css']
})
export class SimpleInterestLoanDisbursementComponent {

 orgnizationSetting: any;
   disbursementForm: FormGroup;
   siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
   siLoanDisbursementModel: SiLoanDisbursement = new SiLoanDisbursement();
   membershipBasicDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
   membershipGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
   siLoanDisbursementColumns: any[] = [];
   pacsId: any;
   branchId: any;
   loanAccId: any;
   isEdit: boolean = false;
   responseModel!: Responsemodel;
   siLoanDisbursementList: any[] = [];
   msgs: any[] = [];
   isKycApproved: any;
   photoCopyFlag: boolean = false;
   membreIndividualFlag: boolean = false;
   totalDisbursement: Number = 0;
   admisionNumber: any;
   memberTypeName: any;
   isFileUploadedPhoto: boolean = false;
   isFileUploadedsignature: boolean = false;
   disableMemberType: boolean = false;
   groupOrInstitutionDisable: boolean = false;
   promoterDetails: any [] =[];
   genderList: any [] =[];
   institutionPromoter: any;
   institutionPromoterPromoterFlag: boolean = false;
   institutionFlag: boolean =false;
   groupFlag: boolean =false;
   individualFlag: boolean =false;
   groupPromotersPopUpFlag:boolean = false;
   groupPrmoters: { field: string; header: string; }[];
   memberPhotoCopyZoom:boolean = false;
   trueFalseList :any[]=[];
   isEditDeleteButtonEnable:boolean=false;
   dueAmount: any;
   nextDisbursmentDate: any;
   disbursmentDueDate: any;
   disburmentAmount: any;
   editDisable: boolean = false;
   addOrEdit:boolean = false;
   disbursementScheduleList :any []=[];
   indvidualFalg: boolean = false;
   constructor(private router: Router,
     private formBuilder: FormBuilder,
     private commonFunctionsService: CommonFunctionsService,
     private encryptDecryptService: EncryptDecryptService,
     private commonComponent: CommonComponent,
     private datePipe: DatePipe,
     private activateRoute: ActivatedRoute,
     private translate: TranslateService,
     private fileUploadService: FileUploadService,
     private siLoanApplicationService: SiLoanApplicationService,
     private siDisbursementService: SiDisbursementService) {
 
     this.siLoanDisbursementColumns = [
       // { field: 'disbursementOrder', header: 'ERP.UNITS' },
       { field: 'disbursementAmount', header: 'LOANS.DISBURSEMENT_AMOUNT' },
       { field: 'accountNumber', header: 'LOANS.ACCOUNT_NUMBER' },
       { field: 'disbursementDateVal', header: 'LOANS.DISBURSEMENT_DATE' },
       { field: 'transactionDateVal', header: 'LOANS.TRANSACTION_DATE' },
       { field: 'statusName', header: 'LOANS.STATUS' }
     ];
     this.disbursementForm = this.formBuilder.group({
       'accountNumber': new FormControl({ value: '', disabled: true }),
       'disbursementDate': new FormControl({ value: '', disabled: true }),
       'disbursementAmount': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
       'transactionDate': new FormControl({ value: '', disabled: true }),
       'isPhotoSignatureVerified': new FormControl('',  Validators.compose([Validators.required])),
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
 
   ngOnInit() {
     this.commonFunctionsService.setStorageValue('language', 'en');
     this.translate.use(this.commonFunctionsService.getStorageValue('language'));
     this.orgnizationSetting = this.commonComponent.orgnizationSettings();
     this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
     this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
     this.trueFalseList = this.commonComponent.requiredlist();
     this.activateRoute.queryParams.subscribe(params => {
       if (params['id'] != undefined) {
         this.loanAccId = Number(this.encryptDecryptService.decrypt(params['id']));
         this.getSiLoanApplicationsById(this.loanAccId);
         this.isEdit = true;
       } else {
         this.isEdit = false;
         this.siLoanDisbursementModel = new SiLoanDisbursement();
       }
     });
     this.siLoanDisbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.dueDisbursmentDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
   }
 
  
 
   /**
      * @implements get si account details by id
      * @param id 
      * @author k.yamuna
      */
   getSiLoanApplicationsById(id: any) {
     this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((data: any) => {
       this.responseModel = data;
       if (this.responseModel != null && this.responseModel != undefined) {
         if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
           if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
             if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
               this.admisionNumber = this.responseModel.data[0].admissionNumber;
               this.memberTypeName = this.responseModel.data[0].memberTypeName;;
               this.getSILoanDisbursementsBySIApplicationId();
               this.getSchedulesByApplicationId();
               this.siLoanApplicationModel = this.responseModel.data[0];
                 if (this.siLoanApplicationModel.applicationDate != null && this.siLoanApplicationModel.applicationDate != undefined)
                   this.siLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.siLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
       
                 if (this.siLoanApplicationModel.sanctionDate != null && this.siLoanApplicationModel.sanctionDate != undefined)
                   this.siLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.siLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
       
                 if (this.siLoanApplicationModel.loanDueDate != null && this.siLoanApplicationModel.loanDueDate != undefined)
                   this.siLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.siLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                 
                 if(this.siLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
                   this.indvidualFalg = true;
                 else {
                   this.indvidualFalg = false;
                 }
                 if (this.siLoanApplicationModel.applicationPath != null && this.siLoanApplicationModel.applicationPath != undefined) {
                   this.siLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.siLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.siLoanApplicationModel.applicationPath);
                 } 
       
               if (this.siLoanApplicationModel.individualMemberDetailsDTO != null && this. siLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                 this.individualFlag = true;
                 this.membershipBasicDetailsModel = this. siLoanApplicationModel.individualMemberDetailsDTO;
                 if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined)
                   this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
 
                 if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined)
                   this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
 
                 if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
                   this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath);
                   this.isFileUploadedPhoto = applicationConstants.TRUE;
                 }
                 if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
                   this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath);
                   this.isFileUploadedsignature = applicationConstants.TRUE;
                 }
               }
               if (this. siLoanApplicationModel.memberGroupDetailsDTO != null && this. siLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                 this.membershipGroupDetailsModel = this. siLoanApplicationModel.memberGroupDetailsDTO;
                 this.groupFlag = true;
                 if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined)
                   this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                 if (this.membershipGroupDetailsModel.groupPromoterList != null && this.membershipGroupDetailsModel.groupPromoterList != undefined && this.membershipGroupDetailsModel.groupPromoterList.length > 0) {
                   this.promoterDetails = this.membershipGroupDetailsModel.groupPromoterList;
                   let i = 0;
                   for( let groupPromoters of this.promoterDetails){
                     i = i+1;
                     groupPromoters.uniqueId = i;
                     if(groupPromoters.dob != null && groupPromoters.dob != undefined){
                       groupPromoters.memDobVal = this.datePipe.transform(groupPromoters.dob, this.orgnizationSetting.datePipe);
                     }
                     if(groupPromoters.startDate != null && groupPromoters.startDate != undefined){
                       groupPromoters.startDateVal = this.datePipe.transform(groupPromoters.startDate, this.orgnizationSetting.datePipe);
                     }
                     if(groupPromoters.genderId != null && groupPromoters.genderId != undefined){
                       let Obj = this.genderList.filter(obj => obj.value == groupPromoters.genderId);
                       if(Obj != null && Obj != undefined && Obj[0] != null && Obj[0] != undefined &&  Obj[0].label != null &&  Obj[0].label != undefined){
                         groupPromoters.genderName = Obj[0].label ;
                       }
                     }
                   }
                 }
                 this.disableMemberType = true;
 
               }
               if (this. siLoanApplicationModel.memberInstitutionDTO != null && this. siLoanApplicationModel.memberInstitutionDTO != undefined) {
                 this.institutionFlag = true;
                 this.membershipInstitutionDetailsModel = this. siLoanApplicationModel.memberInstitutionDTO;
                 this.groupOrInstitutionDisable = false;
 
                 if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                   this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                 if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0){
                   this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
                   let i = 0;
                   for( let institution of this.institutionPromoter){
                     i = i+1;
                     institution.uniqueId = i;
                     if(institution.dob != null && institution.dob != undefined){
                       institution.memDobVal = this.datePipe.transform(institution.dob, this.orgnizationSetting.datePipe);
                     }
                     if(institution.startDate != null && institution.startDate != undefined){
                       institution.startDateVal = this.datePipe.transform(institution.startDate, this.orgnizationSetting.datePipe);
                     }
                     if(institution.genderId != null && institution.genderId != undefined){
                       let Obj = this.genderList.filter(obj => obj.value == institution.genderId);
                       if(Obj != null && Obj != undefined && Obj[0] != null && Obj[0] != undefined &&  Obj[0].label != null &&  Obj[0].label != undefined){
                         institution.genderName = Obj[0].label ;
                       }
                     }
                   }
                 }
                 this.disableMemberType = true;
 
               }
               if(this.siLoanApplicationModel.loanApprovedDate != null && this. siLoanApplicationModel.loanApprovedDate){
                 this.siLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.siLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);
               }
             }
           }
           else {
             this.groupOrInstitutionDisable = true;
           }
         }
       }
     });
   }
 
   /**
    * @implements get siLoan disbursment by si application id
    * @author k.yamuna
    */
   getSILoanDisbursementsBySIApplicationId() {
     this.dueAmount = 0;
     this.disburmentAmount  = 0;
     this.isEditDeleteButtonEnable =false;
     this.siDisbursementService.getSIDisbursementListByApplicationId(this.loanAccId).subscribe((data: any) => {
       this.responseModel = data;
       if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
         if (this.responseModel != null && this.responseModel != undefined) {
           if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
             this.siLoanDisbursementList = this.responseModel.data;
             this.siLoanDisbursementList = this.siLoanDisbursementList.filter(data => data.disbursementDate != null && data.transactionDate != null).map(count => {
               count.disbursementDateVal = this.datePipe.transform(count.disbursementDate, this.orgnizationSetting.datePipe);
               count.transactionDateVal = this.datePipe.transform(count.transactionDate, this.orgnizationSetting.datePipe);
               if (count.statusName == applicationConstants.SUBMISSION_FOR_APPROVAL) {
                 count.submissionForApproval = true;
                 count.actionButton = false;
                 count.edit = false; 
               }
               else if (count.statusName == applicationConstants.CREATED || count.accountStatusName == applicationConstants.IN_PROGRESS) {
                 count.created = true;
                 count.edit = true;
               }
               else if (count.statusName == applicationConstants.REQUEST_FOR_RESUBIMSSION) {
                 count.requestForResubmmission = true;
               }
               else if (count.statusName == applicationConstants.APPROVED) {
                 count.approved = true;
                 this.disburmentAmount = this.disburmentAmount + count.disbursementAmount ;
               }
               this.totalDisbursement = this.totalDisbursement + count.disbursementAmount;
               if(count.statusName == CommonStatusData.SCHEDULED){
                 count.scheduled = true;
                 this.dueAmount = this.dueAmount + count.disbursementAmount ;
                 this.editDisable = false;
               }
               else {
                 this.editDisable = true;
               }
               return count;
             });
            this.nextDisbursmentDate =  Math.min(...this.siLoanDisbursementList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
            this.nextDisbursmentDate = this.datePipe.transform( this.nextDisbursmentDate, this.orgnizationSetting.datePipe);
            this.disbursmentDueDate =  Math.max(...this.siLoanDisbursementList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
            this.disbursmentDueDate = this.datePipe.transform(this.disbursmentDueDate , this.orgnizationSetting.datePipe);
           }
         }
       } else {
         this.commonComponent.stopSpinner();
         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
         setTimeout(() => {
           this.msgs = [];
         }, 2000);
       }
     }, error => {
       this.commonComponent.stopSpinner();
       this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
       setTimeout(() => {
         this.msgs = [];
       }, 2000);
     });
   }
 
   /**
    * @implements add or update disbursment
    * @author jyothi.nadana
    */
   addOrUpdate() {
     if (this.siLoanApplicationModel.sanctionAmount != null && this.siLoanApplicationModel.sanctionAmount != undefined && this.siLoanDisbursementModel.disbursementAmount != null && this.siLoanDisbursementModel.disbursementAmount != undefined && this.siLoanApplicationModel.sanctionAmount < this.siLoanDisbursementModel.disbursementAmount) {
       this.disbursementForm.get("disbursementAmount")?.reset();
       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: "Disbursement Amount Should Not be Greater Sanction Amount" }];
       setTimeout(() => {
         this.msgs = [];
         this.getSILoanDisbursementsBySIApplicationId();
         this.cancelOrRefresh();
       }, 2000);
     }
     else {
       this.commonComponent.startSpinner();
       this.siLoanDisbursementModel.pacsId = this.pacsId;
       this.siLoanDisbursementModel.branchId = this.branchId;
       this.siLoanDisbursementModel.siLoanApplicationId = this.loanAccId;
       this.siLoanDisbursementModel.accountNumber = this.siLoanApplicationModel.accountNumber;
       this.siLoanDisbursementModel.siProductId = this.siLoanApplicationModel.siProductId;
       if (this.siLoanDisbursementModel.disbursementDateVal != null && this.siLoanDisbursementModel.disbursementDateVal != undefined) {
         this.siLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanDisbursementModel.disbursementDateVal));
       }
       if (this.siLoanDisbursementModel.transactionDateVal != null && this.siLoanDisbursementModel.transactionDateVal != undefined) {
         this.siLoanDisbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanDisbursementModel.transactionDateVal));
       }
 
       if (this.siLoanDisbursementModel.dueDisbursmentDateVal != null && this.siLoanDisbursementModel.dueDisbursmentDateVal != undefined) {
         this.siLoanDisbursementModel.dueDisbursmentDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanDisbursementModel.dueDisbursmentDateVal));
       }
 
       if (this.siLoanDisbursementModel.id != undefined) {
         this.siDisbursementService.updateSIDisbursement(this.siLoanDisbursementModel).subscribe((response: any) => {
           this.responseModel = response;
           if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
             this.commonComponent.stopSpinner();
             this.addOrEdit = false;
             this.editDisable = false;
             this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
             setTimeout(() => {
               this.msgs = [];
               this.getSILoanDisbursementsBySIApplicationId();
               this.cancelOrRefresh();
             }, 2000);
           } else {
             this.commonComponent.stopSpinner();
             this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
             setTimeout(() => {
               this.msgs = [];
             }, 2000);
           }
         }, error => {
           this.commonComponent.stopSpinner();
           this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
           setTimeout(() => {
             this.msgs = [];
           }, 2000);
         });
       } else {
         let disbursements = this.siLoanDisbursementList.filter((obj: any) => obj.statusName == CommonStatusData.SCHEDULED)
         if (disbursements != null && disbursements != undefined && disbursements.length > 0) {
           this.disbursementForm.reset();
           this.cancelOrRefresh();
           this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: "Please Release The Pending Disbursement" }];
           setTimeout(() => {
             this.msgs = [];
           }, 2000);
         }
         else {
           this.siLoanDisbursementModel.statusName = CommonStatusData.SCHEDULED;
           this.siDisbursementService.addSIDisbursement(this.siLoanDisbursementModel).subscribe((response: any) => {
             this.responseModel = response;
             if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
               this.commonComponent.stopSpinner();
               this.addOrEdit = false;
               this.editDisable = false;
               this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
               setTimeout(() => {
                 this.msgs = [];
                 this.getSILoanDisbursementsBySIApplicationId();
                 this.cancelOrRefresh();
               }, 1000);
             } else {
               this.commonComponent.stopSpinner();
               this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
               setTimeout(() => {
                 this.msgs = [];
               }, 2000);
             }
           }, error => {
             this.commonComponent.stopSpinner();
             this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
             setTimeout(() => {
               this.msgs = [];
             }, 1000);
           });
         }
       }
 
     }
   }
 
   /**
    * @implements onClick member individaul photo copy
    * @author k.yamuna
    */
   onClickMemberIndividualMoreDetails() {
     this.membreIndividualFlag = true;
   }
 
   /**
    * @implements onClick Memberphoto copy
    * @author k.yamuna
    */
   onClickMemberPhotoCopy() {
     this.memberPhotoCopyZoom = true;
   }
 
   /**
    * @implements navigate back
    * @author k.yamuna
    */
   navigateToBack() {
     this.router.navigate([Loantransactionconstant.SIMPLE_INTEREST_LOANS_TRANSACTION]);
   }
 
   /**
    * @implements onClick institution Details
    * @author k.yamuna
    */
   onClickInstitutionMoreDetails(){
     this.institutionPromoterPromoterFlag = true;
   }
 
   /**
    * @implements onClick group promoter
    * @author k.yamuna
    */
   onClickOfGroupPromotes(){
     this.groupPromotersPopUpFlag = true;
   }
 
   /**
    * @implements cancle or refresh
    * @author k.yamuna
    */
   cancelOrRefresh(){
     this.siLoanDisbursementModel.disbursementAmount = null;
     this.siLoanDisbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.dueDisbursmentDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.isPhotoSignVerfied = null;
     this.siLoanDisbursementModel.id = null;
   }
 
   /**
    * @implements edit disbursement
    * @param rowData
    * @author k.yamuna 
    */
   editDisbursements(rowData:any){
     this.isEditDeleteButtonEnable =true;
     this.addOrEdit = true;
     this.editDisable = true;
     this.siDisbursementService.getSIDisbursementById(rowData.id).subscribe((response: any) => {
       this.responseModel = response;
       if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
         if(this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0){
         this.commonComponent.stopSpinner();
         this.siLoanDisbursementModel = this.responseModel.data[0];
         this.siLoanDisbursementModel.disbursementDateVal = this.datePipe.transform(this.siLoanDisbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
         this.siLoanDisbursementModel.transactionDateVal = this.datePipe.transform(this.siLoanDisbursementModel.transactionDate, this.orgnizationSetting.datePipe);
         }
       } else {
         this.commonComponent.stopSpinner();
         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
         setTimeout(() => {
           this.msgs = [];
         }, 2000);
       }
     }, error => {
       this.commonComponent.stopSpinner();
       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
       setTimeout(() => {
         this.msgs = [];
       }, 1000);
     });
   }
 
   /**
    * @implements add disbursemt
    * @author k.yamuna
    */
   addDisbursment(){
     this.siLoanDisbursementModel.disbursementAmount = null;
     this.siLoanDisbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.dueDisbursmentDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
     this.siLoanDisbursementModel.isPhotoSignVerfied = null;
     this.siLoanDisbursementModel.id = null;
     this.addOrEdit = true;
     this.editDisable = true;
   }
 
   /**
    * @implements close disbursemtn
    * @author k.yamuna
    */
   closeDisbursement(){
     this.addOrEdit = false;
     this.editDisable = false;
   }
 
   /**
    * @implements get schedule by application 
    * @author k.yamuna
    */
   getSchedulesByApplicationId() {
     this.disburmentAmount = 0;
     this.isEditDeleteButtonEnable = false;
     this.siDisbursementService.getSILoanDisbursementScheduleByLoanApplicationId(this.loanAccId).subscribe((data: any) => {
       this.responseModel = data;
       if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
         if (this.responseModel != null && this.responseModel != undefined) {
           if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
             this.disbursementScheduleList = this.responseModel.data;
           }
           else {
             this.addOrEdit = false;
           }
         }
       } else {
         this.commonComponent.stopSpinner();
         this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
         setTimeout(() => {
           this.msgs = [];
         }, 2000);
       }
     }, error => {
       this.commonComponent.stopSpinner();
       this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
       setTimeout(() => {
         this.msgs = [];
       }, 2000);
     });
   }
 
   /**
    * @implements cancle pop up
    * @author k.yamuna
    */
   canclePopUp(){
     this.addOrEdit = false;
     this.editDisable = false;
   }
 
 
 }
 
