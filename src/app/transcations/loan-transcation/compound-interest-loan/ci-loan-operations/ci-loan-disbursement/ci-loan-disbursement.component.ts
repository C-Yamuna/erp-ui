import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CiLoanApplicationService } from '../../compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.service';
import { CiLoanApplication } from '../../compound-interest-loan-stepper/ci-product-details/shared/ci-loan-application.model';
import { CiDisbursementsService } from '../../../shared/ci-loans/ci-disbursements.service';
import { CiLoanDisbursement } from '../shared/ci-loan-disbursement.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemInstitutionDetails, MembershipBasicDetails, MembershipGroupDetails } from '../../compound-interest-loan-stepper/ci-membership-details/shared/membership-details.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-ci-loan-disbursement',
  templateUrl: './ci-loan-disbursement.component.html',
  styleUrls: ['./ci-loan-disbursement.component.css']
})
export class CiLoanDisbursementComponent {

  orgnizationSetting: any;
  disbursementForm: FormGroup;
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication();
  ciLoanDisbursementModel: CiLoanDisbursement = new CiLoanDisbursement();
  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanDisbursementColumns: any[] = [];
  pacsId: any;
  branchId: any;
  loanAccId: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  ciLoanDisbursementList: any[] = [];
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
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciDisbursementsService: CiDisbursementsService) {

    this.ciLoanDisbursementColumns = [
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
        this.getCiLoanApplicationsById(this.loanAccId);
        this.isEdit = true;
      } else {
        this.isEdit = false;
        this.ciLoanDisbursementModel = new CiLoanDisbursement();
      }
    });
    this.ciLoanDisbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.dueDisbursmentDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
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
              this.getCILoanDisbursementsByCIApplicationId();
              this.getSchedulesByApplicationId();
              this.ciLoanApplicationModel = this.responseModel.data[0];
                if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined)
                  this.ciLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.ciLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
      
                if (this.ciLoanApplicationModel.sanctionDate != null && this.ciLoanApplicationModel.sanctionDate != undefined)
                  this.ciLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.ciLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
      
                if (this.ciLoanApplicationModel.loanDueDate != null && this.ciLoanApplicationModel.loanDueDate != undefined)
                  this.ciLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.ciLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                
                if(this.ciLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
                  this.indvidualFalg = true;
                else {
                  this.indvidualFalg = false;
                }
                if (this.ciLoanApplicationModel.applicationPath != null && this.ciLoanApplicationModel.applicationPath != undefined) {
                  this.ciLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.ciLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanApplicationModel.applicationPath);
                } 
      
              if (this.ciLoanApplicationModel.individualMemberDetailsDTO != null && this. ciLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                this.individualFlag = true;
                this.membershipBasicDetailsModel = this. ciLoanApplicationModel.individualMemberDetailsDTO;
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
              if (this. ciLoanApplicationModel.memberGroupDetailsDTO != null && this. ciLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                this.membershipGroupDetailsModel = this. ciLoanApplicationModel.memberGroupDetailsDTO;
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
              if (this. ciLoanApplicationModel.memberInstitutionDTO != null && this. ciLoanApplicationModel.memberInstitutionDTO != undefined) {
                this.institutionFlag = true;
                this.membershipInstitutionDetailsModel = this. ciLoanApplicationModel.memberInstitutionDTO;
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
              if(this.ciLoanApplicationModel.loanApprovedDate != null && this. ciLoanApplicationModel.loanApprovedDate){
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
   * @implements get ciLoan disbursment by ci application id
   * @author jyothi.naidana
   */
  getCILoanDisbursementsByCIApplicationId() {
    this.dueAmount = 0;
    this.disburmentAmount  = 0;
    this.isEditDeleteButtonEnable =false;
    this.ciDisbursementsService.getCILoanDisbursementsByCIApplicationId(this.loanAccId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.ciLoanDisbursementList = this.responseModel.data;
            this.ciLoanDisbursementList = this.ciLoanDisbursementList.filter(data => data.disbursementDate != null && data.transactionDate != null).map(count => {
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
           this.nextDisbursmentDate =  Math.min(...this.ciLoanDisbursementList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
           this.nextDisbursmentDate = this.datePipe.transform( this.nextDisbursmentDate, this.orgnizationSetting.datePipe);
           this.disbursmentDueDate =  Math.max(...this.ciLoanDisbursementList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
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
    if (this.ciLoanApplicationModel.sanctionAmount != null && this.ciLoanApplicationModel.sanctionAmount != undefined && this.ciLoanDisbursementModel.disbursementAmount != null && this.ciLoanDisbursementModel.disbursementAmount != undefined && this.ciLoanApplicationModel.sanctionAmount < this.ciLoanDisbursementModel.disbursementAmount) {
      this.disbursementForm.get("disbursementAmount")?.reset();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: "Disbursement Amount Should Not be Greater Sanction Amount" }];
      setTimeout(() => {
        this.msgs = [];
        this.getCILoanDisbursementsByCIApplicationId();
        this.cancelOrRefresh();
      }, 2000);
    }
    else {
      this.commonComponent.startSpinner();
      this.ciLoanDisbursementModel.pacsId = this.pacsId;
      this.ciLoanDisbursementModel.branchId = this.branchId;
      this.ciLoanDisbursementModel.ciLoanApplicationId = this.loanAccId;
      this.ciLoanDisbursementModel.accountNumber = this.ciLoanApplicationModel.accountNumber;
      this.ciLoanDisbursementModel.ciProductId = this.ciLoanApplicationModel.ciProductId;
      if (this.ciLoanDisbursementModel.disbursementDateVal != null && this.ciLoanDisbursementModel.disbursementDateVal != undefined) {
        this.ciLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanDisbursementModel.disbursementDateVal));
      }
      if (this.ciLoanDisbursementModel.transactionDateVal != null && this.ciLoanDisbursementModel.transactionDateVal != undefined) {
        this.ciLoanDisbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanDisbursementModel.transactionDateVal));
      }

      if (this.ciLoanDisbursementModel.dueDisbursmentDateVal != null && this.ciLoanDisbursementModel.dueDisbursmentDateVal != undefined) {
        this.ciLoanDisbursementModel.dueDisbursmentDate = this.commonFunctionsService.getUTCEpoch(new Date(this.ciLoanDisbursementModel.dueDisbursmentDateVal));
      }

      if (this.ciLoanDisbursementModel.id != undefined) {
        this.ciDisbursementsService.updateCiDisbursements(this.ciLoanDisbursementModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.addOrEdit = false;
            this.editDisable = false;
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getCILoanDisbursementsByCIApplicationId();
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
        let disbursements = this.ciLoanDisbursementList.filter((obj: any) => obj.statusName == CommonStatusData.SCHEDULED)
        if (disbursements != null && disbursements != undefined && disbursements.length > 0) {
          this.disbursementForm.reset();
          this.cancelOrRefresh();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: "Please Release The Pending Disbursement" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        else {
          this.ciLoanDisbursementModel.statusName = CommonStatusData.SCHEDULED;
          this.ciDisbursementsService.addCiDisbursements(this.ciLoanDisbursementModel).subscribe((response: any) => {
            this.responseModel = response;
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.commonComponent.stopSpinner();
              this.addOrEdit = false;
              this.editDisable = false;
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
                this.getCILoanDisbursementsByCIApplicationId();
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
   * @author jyothi.naidana
   */
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  /**
   * @implements onClick Memberphoto copy
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
   * @implements onClick institution Details
   * @author jyothi.naidana
   */
  onClickInstitutionMoreDetails(){
    this.institutionPromoterPromoterFlag = true;
  }

  /**
   * @implements onClick group promoter
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
    this.ciLoanDisbursementModel.disbursementAmount = null;
    this.ciLoanDisbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.dueDisbursmentDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.isPhotoSignVerfied = null;
    this.ciLoanDisbursementModel.id = null;
  }

  /**
   * @implements edit disbursement
   * @param rowData
   * @author jyothi.naidana 
   */
  editDisbursements(rowData:any){
    this.isEditDeleteButtonEnable =true;
    this.addOrEdit = true;
    this.editDisable = true;
    this.ciDisbursementsService.getCiDisbursementsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if(this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0){
        this.commonComponent.stopSpinner();
        this.ciLoanDisbursementModel = this.responseModel.data[0];
        this.ciLoanDisbursementModel.disbursementDateVal = this.datePipe.transform(this.ciLoanDisbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
        this.ciLoanDisbursementModel.transactionDateVal = this.datePipe.transform(this.ciLoanDisbursementModel.transactionDate, this.orgnizationSetting.datePipe);
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
   * @author jyothi.naidana
   */
  addDisbursment(){
    this.ciLoanDisbursementModel.disbursementAmount = null;
    this.ciLoanDisbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.dueDisbursmentDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
    this.ciLoanDisbursementModel.isPhotoSignVerfied = null;
    this.ciLoanDisbursementModel.id = null;
    this.addOrEdit = true;
    this.editDisable = true;
  }

  /**
   * @implements close disbursemtn
   * @author jyothi.naidana
   */
  closeDisbursement(){
    this.addOrEdit = false;
    this.editDisable = false;
  }

  /**
   * @implements get schedule by application 
   * @author jyothi.naidana
   */
  getSchedulesByApplicationId() {
    this.disburmentAmount = 0;
    this.isEditDeleteButtonEnable = false;
    this.ciDisbursementsService.getCILoanDisbursementScheduleByCIApplicationId(this.loanAccId).subscribe((data: any) => {
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
   * @author jyothi.naidana
   */
  canclePopUp(){
    this.addOrEdit = false;
    this.editDisable = false;
  }


}
