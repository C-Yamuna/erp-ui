import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../../compound-interest-loan-stepper/ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../../compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.model';
import { CiCollection, CiLoanDisbursement } from '../shared/ci-loan-disbursement.model';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CiDisbursementsService } from '../../../shared/ci-loans/ci-disbursements.service';
import { CiLoanApplicationService } from '../../compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonStatusData } from 'src/app/transcations/common-status-data.json';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { CiCollectionsService } from '../../../shared/ci-loans/ci-collections.service';

@Component({
  selector: 'app-ci-loan-collection',
  templateUrl: './ci-loan-collection.component.html',
  styleUrls: ['./ci-loan-collection.component.css']
})
export class CiLoanCollectionComponent {

  orgnizationSetting: any;
  collectionForm: FormGroup;
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciCollectionModal: CiCollection = new CiCollection();
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanCollectionColumns: any[] = [];
  pacsId: any;
  branchId: any;
  loanAccId: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  ciLoanColectionList: any[] = [];
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
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciCollectionsService: CiCollectionsService) {

    this.ciLoanCollectionColumns = [
      { field: 'disbursementOrder', header: 'ERP.UNITS' },
      { field: 'transactionDateVal', header: 'LOANS.COLLECTION_DATE' },
      { field: 'totaolCollectionAmount', header: 'LOANS.COLLECTION_AMOUNT' },
      { field: 'collectionCharges', header: 'ERP.COLLECTION_CHARGES' },
      { field: 'disbursementDateVal', header: 'ERP.COLLECTION_INTEREST' },
      { field: 'principleCollection', header: 'ERP.COLLECTION_PRINCIPAL' },
      { field: 'statusName', header: 'LOANS.STATUS' }
    ];
    this.transactionHistoryColumns=[
      { field: 'disbursementOrder', header: 'ERP.UNITS' },
      { field: 'transactionDateVal', header: 'LOANS.COLLECTION_DATE' },
      { field: 'totaolCollectionAmount', header: 'LOANS.COLLECTION_AMOUNT' },
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
        this.getCiLoanApplicationsById(this.loanAccId);
        this.isEdit = true;
      } else {
        this.isEdit = false;
        this.ciCollectionModal = new CiCollection();
      }
    });
    this.ciCollectionModal.transactionDateVal = this.commonFunctionsService.currentDate();
  }

  /**
     * @implements get ci account details by id
     * @param id 
     * @author jyothi.naidana
     */
  getCiLoanApplicationsById(id: any) {
    this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admisionNumber = this.responseModel.data[0].admissionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;;
              this.ciLoanApplicationModel = this.responseModel.data[0];
              this.getCollectionByLoanApplicationId();
              if (this.ciLoanApplicationModel.individualMemberDetailsDTO != null && this.ciLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                this.individualFlag = true;
                this.membershipBasicDetailsModel = this.ciLoanApplicationModel.individualMemberDetailsDTO;
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
              if (this.ciLoanApplicationModel.memberGroupDetailsDTO != null && this.ciLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                this.membershipGroupDetailsModel = this.ciLoanApplicationModel.memberGroupDetailsDTO;
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
              if (this.ciLoanApplicationModel.memberInstitutionDTO != null && this.ciLoanApplicationModel.memberInstitutionDTO != undefined) {
                this.institutionFlag = true;
                this.membershipInstitutionDetailsModel = this.ciLoanApplicationModel.memberInstitutionDTO;
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
              if (this.ciLoanApplicationModel.loanApprovedDate != null && this.ciLoanApplicationModel.loanApprovedDate) {
                this.ciLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.ciLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);
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
   * @author jyothi.naidana
   */
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  /**
   * @implements on Clic member photo copy
   * @author jyothi.naidana
   */
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  /**
   * @implements navigate back
   * @author jyothi.naidana
   */
  navigateToBack() {
    this.router.navigate([Loantransactionconstant.COMPOUND_INTEREST_LOAN]);
  }


  /**
   * @implements on click institution more details
   */
  onClickInstitutionMoreDetails(){
    this.institutionPromoterPromoterFlag = true;
  }

  /**
   * @implements onClick Group more details
   * @author jyothi.naidana
   */
  onClickOfGroupPromotes(){
    this.groupPromotersPopUpFlag = true;
  }

   /**
   * @implements cancle or refresh
   * @author jyothi.naidana
   */
   cancelOrRefresh(){
    this.ciCollectionModal.transactionDateVal = this.commonFunctionsService.currentDate();
    this.ciCollectionModal.id = null;
    this.ciCollectionModal.totaolCollectionAmount = null;
    this.ciCollectionModal.dueAsOnDate= null;
    this.ciCollectionModal.paymentMode = null;
  }


  /**
   * @implements edit collection
   * @author jyothi.naidana
   */
  editCollection(rowData:any){
  this.isEditDeleteButtonEnable =true;
  this.ciCollectionsService.getCiCollectionsById(rowData.id).subscribe((response: any) => {
    this.responseModel = response;
    if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
      if(this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0){
      this.commonComponent.stopSpinner();
      this.ciCollectionModal = this.responseModel.data[0];
      this.ciCollectionModal.transactionDateVal = this.datePipe.transform(this.ciCollectionModal.transactionDate, this.orgnizationSetting.datePipe);
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
   * @author jyothi.naidana
   */
  addOrUpdate() {
    this.commonComponent.startSpinner();
    this.ciCollectionModal.pacsId = this.pacsId;
    this.ciCollectionModal.branchId = this.branchId;
    this.ciCollectionModal.ciLoanApplicationId = this.loanAccId;
    this.ciCollectionModal.accountNumber = this.ciLoanApplicationModel.accountNumber;
    this.ciCollectionModal.ciProductId = this.ciLoanApplicationModel.ciProductId;
   
    if (this.ciCollectionModal.transactionDateVal != null && this.ciCollectionModal.transactionDateVal != undefined) {
      this.ciCollectionModal.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciCollectionModal.transactionDateVal));
    }
    if (this.ciCollectionModal.id != undefined) {
      this.ciCollectionsService.updateCiCollections(this.ciCollectionModal).subscribe((response: any) => {
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
      this.ciCollectionModal.statusName = CommonStatusData.CREATED;
      this.ciCollectionsService.addCiCollections(this.ciCollectionModal).subscribe((response: any) => {
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
   * @author jyothi.naidana
   */
  getCollectionByLoanApplicationId(){
    this.dueAmount = 0;
    this.disburmentAmount  = 0;
    this.isEditDeleteButtonEnable =false;
    this.ciCollectionsService.getCollectionByApplicationId(this.loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciLoanColectionList = this.responseModel.data;
            this.ciLoanColectionList = this.ciLoanColectionList.filter(data =>  data.transactionDate != null).map(count => {
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
           this.nextDisbursmentDate =  Math.min(...this.ciLoanColectionList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
           this.nextDisbursmentDate = this.datePipe.transform( this.nextDisbursmentDate, this.orgnizationSetting.datePipe);
           this.disbursmentDueDate =  Math.max(...this.ciLoanColectionList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
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
