import { SiCollectionService } from './../../../shared/si-loans/si-collection.service';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { SiLoanApplication } from '../../../shared/si-loans/si-loan-application.model';
import { SiLoanCollection } from '../../../shared/si-loans/si-loan-collection.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-simple-interest-loan-collection',
  templateUrl: './simple-interest-loan-collection.component.html',
  styleUrls: ['./simple-interest-loan-collection.component.css']
})
export class SimpleInterestLoanCollectionComponent {
   orgnizationSetting: any;
    collectionForm: FormGroup;
    siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();
    siLoanApplication: SiLoanApplication = new SiLoanApplication();

    siCollectionModal: SiLoanCollection = new SiLoanCollection();
    membershipBasicDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
    membershipGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
    membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
    siLoanCollectionColumns: any[] = [];
    pacsId: any;
    branchId: any;
    loanAccId: any;
    isEdit: boolean = false;
    responseModel!: Responsemodel;
    siLoanCollectionList: any[] = [];
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
    paymentMethodOptions: any[] = [];
    transactionHistoryColumns: { field: string; header: string; }[];
    transactionHistoryList :any [] =[];
  
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
      private siCollectionsService: SiCollectionService) {
  
      this.siLoanCollectionColumns = [
        { field: 'disbursementOrder', header: 'ERP.UNITS' },
        { field: 'transactionDateVal', header: 'LOANS.COLLECTION_DATE' },
        { field: 'totalCollectionAmount', header: 'LOANS.COLLECTION_AMOUNT' },
        { field: 'collectionCharges', header: 'ERP.COLLECTION_CHARGES' },
        { field: 'disbursementDateVal', header: 'ERP.COLLECTION_INTEREST' },
        { field: 'principleCollection', header: 'ERP.COLLECTION_PRINCIPAL' },
        { field: 'statusName', header: 'LOANS.STATUS' }
      ];
      this.transactionHistoryColumns=[
        { field: 'disbursementOrder', header: 'ERP.UNITS' },
        { field: 'transactionDateVal', header: 'LOANS.COLLECTION_DATE' },
        { field: 'totalCollectionAmount', header: 'LOANS.COLLECTION_AMOUNT' },
        { field: 'collectionCharges', header: 'ERP.COLLECTION_CHARGES' },
        { field: 'disbursementDateVal', header: 'ERP.COLLECTION_INTEREST' },
        { field: 'transactionDateVal', header: 'ERP.COLLECTION_PRINCIPAL' },
        { field: 'statusName', header: 'LOANS.STATUS' }
      ]
  
      this.collectionForm = this.formBuilder.group({
        'dueAsOnDate': new FormControl('',  Validators.compose([Validators.required])),
        'collectionAmount': new FormControl('',  Validators.compose([Validators.required])),
        'paymentMode': new FormControl('',  Validators.compose([Validators.required])),
        'transactionDate': new FormControl({ value: '', disabled: true }),
        'referenceNumber': new FormControl({ value: '', disabled: true }),
        // 'narration': new FormControl('',  Validators.compose([Validators.required])),
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
      this.paymentMethodOptions = [
        { label: 'Cash', value: 1 },
        // { label: 'Cheque', value: 2 }
        // { label: 'transafer', value: 3 }
      ];
      this.commonFunctionsService.setStorageValue('language', 'en');
      this.translate.use(this.commonFunctionsService.getStorageValue('language'));
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
      this.branchId = this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
      this.trueFalseList = this.commonComponent.requiredlist();
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.loanAccId = this.encryptDecryptService.decrypt(params['id']);
          this.getSiLoanApplicationsById(this.loanAccId);
          this.isEdit = true;
        } else {
          this.isEdit = false;
          this.siCollectionModal = new SiLoanCollection();
        }
      });
      this.siCollectionModal.transactionDateVal = this.commonFunctionsService.currentDate();
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
                this.siLoanApplicationModel = this.responseModel.data[0];
                this.getCollectionByLoanApplicationId();
                if (this.siLoanApplicationModel.individualMemberDetailsDTO != null && this.siLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                  this.individualFlag = true;
                  this.membershipBasicDetailsModel = this.siLoanApplicationModel.individualMemberDetailsDTO;
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
                if (this.siLoanApplicationModel.memberGroupDetailsDTO != null && this.siLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                  this.membershipGroupDetailsModel = this.siLoanApplicationModel.memberGroupDetailsDTO;
                  this.groupFlag = true;
                  if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined)
                    this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                  if (this.membershipGroupDetailsModel.groupPromoterList != null && this.membershipGroupDetailsModel.groupPromoterList != undefined && this.membershipGroupDetailsModel.groupPromoterList.length > 0) {
                    this.promoterDetails = this.membershipGroupDetailsModel.groupPromoterList;
                    let i = 0;
                    for (let groupPromoters of this.promoterDetails) {
                      i = i + 1;
                      groupPromoters.uniqueId = i;
                      if (groupPromoters.dob != null && groupPromoters.dob != undefined) {
                        groupPromoters.memDobVal = this.datePipe.transform(groupPromoters.dob, this.orgnizationSetting.datePipe);
                      }
                      if (groupPromoters.startDate != null && groupPromoters.startDate != undefined) {
                        groupPromoters.startDateVal = this.datePipe.transform(groupPromoters.startDate, this.orgnizationSetting.datePipe);
                      }
                      if (groupPromoters.genderId != null && groupPromoters.genderId != undefined) {
                        let Obj = this.genderList.filter(obj => obj.value == groupPromoters.genderId);
                        if (Obj != null && Obj != undefined && Obj[0] != null && Obj[0] != undefined && Obj[0].label != null && Obj[0].label != undefined) {
                          groupPromoters.genderName = Obj[0].label;
                        }
                      }
                    }
                  }
                  this.disableMemberType = true;
  
                }
                if (this.siLoanApplicationModel.memberInstitutionDTO != null && this.siLoanApplicationModel.memberInstitutionDTO != undefined) {
                  this.institutionFlag = true;
                  this.membershipInstitutionDetailsModel = this.siLoanApplicationModel.memberInstitutionDTO;
                  this.groupOrInstitutionDisable = false;
  
                  if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
                    this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                  if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0) {
                    this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
                    let i = 0;
                    for (let institution of this.institutionPromoter) {
                      i = i + 1;
                      institution.uniqueId = i;
                      if (institution.dob != null && institution.dob != undefined) {
                        institution.memDobVal = this.datePipe.transform(institution.dob, this.orgnizationSetting.datePipe);
                      }
                      if (institution.startDate != null && institution.startDate != undefined) {
                        institution.startDateVal = this.datePipe.transform(institution.startDate, this.orgnizationSetting.datePipe);
                      }
                      if (institution.genderId != null && institution.genderId != undefined) {
                        let Obj = this.genderList.filter(obj => obj.value == institution.genderId);
                        if (Obj != null && Obj != undefined && Obj[0] != null && Obj[0] != undefined && Obj[0].label != null && Obj[0].label != undefined) {
                          institution.genderName = Obj[0].label;
                        }
                      }
                    }
                  }
                  this.disableMemberType = true;
  
                }
                if (this.siLoanApplicationModel.loanApprovedDate != null && this.siLoanApplicationModel.loanApprovedDate) {
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
     * @implements on click member individual
     * @author k.yamuna
     */
    onClickMemberIndividualMoreDetails() {
      this.membreIndividualFlag = true;
    }
  
    /**
     * @implements on Clic member photo copy
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
     * @implements on click institution more details
     */
    onClickInstitutionMoreDetails(){
      this.institutionPromoterPromoterFlag = true;
    }
  
    /**
     * @implements onClick Group more details
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
      this.siCollectionModal.transactionDateVal = this.commonFunctionsService.currentDate();
      this.siCollectionModal.id = null;
      this.siCollectionModal.totalCollectionAmount = null;
      this.siCollectionModal.dueAsOnDate= null;
      this.siCollectionModal.paymentMode = null;
    }
  
  
    /**
     * @implements edit collection
     * @author k.yamuna
     */
    editCollection(rowData:any){
    this.isEditDeleteButtonEnable =true;
    this.siCollectionsService.getSICollectionById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if(this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0){
        this.commonComponent.stopSpinner();
        this.siCollectionModal = this.responseModel.data[0];
        this.siCollectionModal.transactionDateVal = this.datePipe.transform(this.siCollectionModal.transactionDate, this.orgnizationSetting.datePipe);
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
     * @implements add or update disbursment
     * @author k.yamuna
     */
    addOrUpdate() {
      this.commonComponent.startSpinner();
      this.siCollectionModal.pacsId = this.pacsId;
      this.siCollectionModal.branchId = this.branchId;
      this.siCollectionModal.siLoanApplicationId = this.loanAccId;
      this.siCollectionModal.accountNumber = this.siLoanApplicationModel.accountNumber;
      this.siCollectionModal.siProductId = this.siLoanApplicationModel.siProductId;
     
      if (this.siCollectionModal.transactionDateVal != null && this.siCollectionModal.transactionDateVal != undefined) {
        this.siCollectionModal.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siCollectionModal.transactionDateVal));
      }
      if (this.siCollectionModal.id != undefined) {
        this.siCollectionsService.updateSICollection(this.siCollectionModal).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getCollectionByLoanApplicationId();
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
        this.siCollectionModal.statusName = CommonStatusData.CREATED;
        this.siCollectionsService.addSICollection(this.siCollectionModal).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getCollectionByLoanApplicationId();
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
  
    /**
     * @implements get collection by application
     * @author k.yamuna
     */
    getCollectionByLoanApplicationId(){
      this.dueAmount = 0;
      this.disburmentAmount  = 0;
      this.isEditDeleteButtonEnable =false;
      this.siCollectionsService.getSICollectionByApplicationId(this.loanAccId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.siLoanApplication = this.responseModel.data;
              if( this.siLoanApplicationModel != null &&  this.siLoanApplicationModel != undefined){
                this.siLoanCollectionList = this.siLoanApplicationModel.siCollectionDTOList;
                if(this.siLoanCollectionList != null && this.siLoanCollectionList.length > 0){
                  this.siLoanCollectionList = this.siLoanCollectionList.filter(data =>  data.transactionDate != null).map(count => {
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
                      this.editDisable = true;
                    return count;
                  });
                }
              }
             this.nextDisbursmentDate =  Math.min(...this.siLoanCollectionList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
             this.nextDisbursmentDate = this.datePipe.transform( this.nextDisbursmentDate, this.orgnizationSetting.datePipe);
             this.disbursmentDueDate =  Math.max(...this.siLoanCollectionList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
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
  
  }
  