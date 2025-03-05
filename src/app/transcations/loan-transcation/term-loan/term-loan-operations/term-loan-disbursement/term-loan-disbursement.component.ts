import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { TermLoanDisbursement, TermLoanTransaction } from './shared/term-loan-disbursement.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../term-loan-stepper/term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermApplication, TermLoanDisbursementScheduleModel, TermLoanProductDefinition } from '../../term-loan-stepper/term-loan-application-details/shared/term-application.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TermLoanDisbursementService } from './shared/term-loan-disbursement.service';
import { TermApplicationService } from '../../term-loan-stepper/term-loan-application-details/shared/term-application.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { TermLoanDisbursementScheduleService } from '../../term-loan-product-definition/term-loan-product-definition-stepper/term-loan-disbursement-schedule/shared/term-loan-disbursement-schedule.service';

@Component({
  selector: 'app-term-loan-disbursement',
  templateUrl: './term-loan-disbursement.component.html',
  styleUrls: ['./term-loan-disbursement.component.css']
})
export class TermLoanDisbursementComponent {
  orgnizationSetting: any;
  disbursementForm: FormGroup;
  termLoanDisbursementModel: TermLoanDisbursement = new TermLoanDisbursement();
  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanDisbursementScheduleModel:TermLoanDisbursementScheduleModel = new TermLoanDisbursementScheduleModel();
  termLoanTransactionModel: TermLoanTransaction = new TermLoanTransaction();
  termLoanProductDefinitionModel :TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanDisbursementColumns: any[] = [];
  pacsId: any;
  branchId: any;
  termLoanApplicationId: any;
  isEdit: boolean = false;
  responseModel!: Responsemodel;
  termLoanDisbursementList: any[] = [];
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
  termProductId: any;
  requestedAmount:any;
  finalDisbursementList:any []=[];
  paymentOptions:any;
  unsavedSchedules: any;
  disbursementType: any;
  constructor(private router: Router, private formBuilder: FormBuilder, private termLoanDisbursementService: TermLoanDisbursementService,  private termLoanApplicationsService: TermApplicationService,
    private encryptService: EncryptDecryptService, private commonComponent: CommonComponent, private commonFunctionsService: CommonFunctionsService, private translate: TranslateService,
     private activateRoute: ActivatedRoute, private datePipe: DatePipe,private fileUploadService: FileUploadService,private cdr: ChangeDetectorRef,
     private termLoanDisbursementScheduleService: TermLoanDisbursementScheduleService
  ) {
    this.termLoanDisbursementColumns = [
      { field: 'disbursementOrder', header: 'ERP.DISBURSEMENT_ORDER' },
      { field: 'typeName', header: 'ERP.DISBURSEMENT_TYPE' },
      { field: 'disbursementDateVal', header: 'ERP.DISBURSEMENT_DATE' },
      { field: 'disbursementAmount', header: 'ERP.DISBURSEMENT_AMOUNT' },
      { field: 'transactionDateVal', header: 'ERP.TRANSACTION_DATE' },
      { field: 'statusName', header: 'ERP.STATUS' }
    ];
    this.disbursementForm = this.formBuilder.group({
      'accountNumber': new FormControl({ value: '', disabled: true }),
      'disbursementDate': new FormControl({ value: '', disabled: true }),
      'disbursementAmount': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]),
      'transactionDate': new FormControl({ value: '', disabled: true }),
      'isPhotoSignatureVerified': new FormControl('',  Validators.compose([Validators.required])),
      'paymentModeName':new FormControl('',  Validators.compose([Validators.required])),
      'type': new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
    this.groupPrmoters = [
      { field: 'surname', header: 'ERP.SURNAME' },
      { field: 'name', header: 'ERP.NAME' },
      { field: 'operatorTypeName', header: 'ERP.OPERATION_TYPE' },
      { field: 'memDobVal', header: 'ERP.DOB' },
      { field: 'age', header: 'ERP.AGE' },
      { field: 'genderTypeName', header: 'ERP.GENDER' },
      { field: 'maritalStatusName', header: 'ERP.MARITAL_STATUS' },
      { field: 'mobileNumber', header: 'ERP.MOBILE_NUMBER' },
      { field: 'emailId', header: 'ERP.EMAIL' },
      { field: 'aadharNumber', header: 'ERP.AADHAR_NUMBER' },
      { field: 'startDateVal', header: 'ERP.START_DATE' },
    ];
    this.paymentOptions = [
      { label: 'Cash', value: 1 },
      { label: 'Transfer', value: 2},
    ];
    this.disbursementType = [
      { label: 'Daily', value: 1 },
      { label: 'Monthly', value: 2},
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
        this.termLoanApplicationId = Number(this.encryptService.decrypt(params['id']));
        this.getTermApplicationByTermAccId(this.termLoanApplicationId);
        this.isEdit = true;
      } else {
        this.isEdit = false;
        this.termLoanDisbursementModel = new TermLoanDisbursement();
      }
    });
    this.termLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
  }

 

  /**
     * @implements get term account details by id
     * @param id 
     * @author vinitha
     */
  getTermApplicationByTermAccId(id: any) {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admisionNumber = this.responseModel.data[0].admissionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
 
              this.termLoanApplicationModel = this.responseModel.data[0];

                if (this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != undefined)
                  this.termLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.termLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
      
                if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined)
                  this.termLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.termLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
      
                if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined)
                  this.termLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                
                if(this.termLoanApplicationModel.memberTypeName == MemberShipTypesData.INDIVIDUAL)
                  this.indvidualFalg = true;
                else {
                  this.indvidualFalg = false;
                }
                if (this.termLoanApplicationModel.applicationPath != null && this.termLoanApplicationModel.applicationPath != undefined) {
                  this.termLoanApplicationModel.multipartFileList = this.fileUploadService.getFile(this.termLoanApplicationModel.applicationPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanApplicationModel.applicationPath);
                } 
      
              if (this.termLoanApplicationModel.individualMemberDetailsDTO != null && this. termLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                this.individualFlag = true;
                this.membershipBasicRequiredDetailsModel = this. termLoanApplicationModel.individualMemberDetailsDTO;
                if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                  this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                  this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                  this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                  this.isFileUploadedPhoto = applicationConstants.TRUE;
                }
                if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                  this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                  this.isFileUploadedsignature = applicationConstants.TRUE;
                }
              }
              if (this. termLoanApplicationModel.memberGroupDetailsDTO != null && this. termLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                this.memberGroupDetailsModel = this. termLoanApplicationModel.memberGroupDetailsDTO;
                this.groupFlag = true;
                if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
                  this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                  this.promoterDetails = this.memberGroupDetailsModel.groupPromoterList;
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
              if (this. termLoanApplicationModel.memberInstitutionDTO != null && this. termLoanApplicationModel.memberInstitutionDTO != undefined) {
                this.institutionFlag = true;
                this.membershipInstitutionDetailsModel = this. termLoanApplicationModel.memberInstitutionDTO;
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
              if(this.termLoanApplicationModel.loanApprovedDate != null && this. termLoanApplicationModel.loanApprovedDate){
                this.termLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);
              }
              if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined)
                this.termLoanApplicationModel.sanctionDateVal = this.datePipe.transform(this.termLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
          
           
            
            this.termLoanDisbursementList = this.termLoanApplicationModel.termLoanDisbursementDTOList ;
        
              this.getSchedulesByApplicationId(this.termLoanApplicationModel.termProductId);
          
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
   * @implements get termLoan disbursment by term application id
   * @author vinitha
   */
  getTermDisbursmentDetailsByLoanApplicationId() {
    this.dueAmount = 0;
    this.disburmentAmount  = 0;
    this.isEditDeleteButtonEnable =false;
    this.termLoanDisbursementService.getTermDisbursmentListByApplicationId(this.termLoanApplicationId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termLoanDisbursementList = this.responseModel.data;
            this.termLoanDisbursementList = this.termLoanDisbursementList.filter(data => data.disbursementDate != null && data.transactionDate != null).map(count => {
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
           this.nextDisbursmentDate =  Math.min(...this.termLoanDisbursementList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
           this.nextDisbursmentDate = this.datePipe.transform( this.nextDisbursmentDate, this.orgnizationSetting.datePipe);
           this.disbursmentDueDate =  Math.max(...this.termLoanDisbursementList.filter((obj:any) => obj.statusName === CommonStatusData.SCHEDULED).map(item => item.disbursementDate));
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
   * @author vinitha
   */
  addOrUpdate() {
      this.commonComponent.startSpinner();
      this.termLoanDisbursementModel.pacsId = this.pacsId;
      this.termLoanDisbursementModel.branchId = this.branchId;
      this.termLoanDisbursementModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanDisbursementModel.accountNumber = this.termLoanApplicationModel.accountNumber;
      this.termLoanDisbursementModel.termProductId = this.termLoanApplicationModel.termProductId;
      const selectedDisbursement = this.termLoanDisbursementList.find((item: any) => item.id === this.termLoanApplicationModel.id);
  
      if (selectedDisbursement) {
        this.termLoanDisbursementModel.disbursementOrder = selectedDisbursement.disbursementOrder;
        this.termLoanDisbursementModel.disbursementAmount = selectedDisbursement.disbursementAmount;
        this.termLoanDisbursementModel.typeName = selectedDisbursement.typeName;
        this.termLoanDisbursementModel.disbursementDate = this.datePipe.transform(selectedDisbursement.disbursementDateVal, this.orgnizationSetting.datePipe);
      }
      // if (this.termLoanDisbursementModel.disbursementDateVal != null && this.termLoanDisbursementModel.disbursementDateVal != undefined) {
      //   this.termLoanDisbursementModel.disbursementDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanDisbursementModel.disbursementDateVal));
      // }
      if (this.termLoanDisbursementModel.transactionDateVal != null && this.termLoanDisbursementModel.transactionDateVal != undefined) {
        this.termLoanDisbursementModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanDisbursementModel.transactionDateVal));
      }

      if (this.termLoanDisbursementModel.id != undefined) {
        this.termLoanDisbursementService.updateTermDisbursement(this.termLoanDisbursementModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.commonComponent.stopSpinner();
            this.addOrEdit = false;
            this.editDisable = false;
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getTermApplicationByTermAccId(this.termLoanApplicationId);
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
        let disbursements = this.termLoanDisbursementList.filter((obj: any) => obj.statusName == CommonStatusData.SCHEDULED)
        if (disbursements != null && disbursements != undefined && disbursements.length > 0) {
          this.disbursementForm.reset();
          this.cancelOrRefresh();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: "Please Release The Pending Disbursement" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        else {
          this.termLoanDisbursementModel.statusName = CommonStatusData.APPROVED;
          this.termLoanDisbursementService.addTermDisbursement(this.termLoanDisbursementModel).subscribe((response: any) => {
            this.responseModel = response;
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              this.commonComponent.stopSpinner();
              this.addOrEdit = false;
              this.editDisable = false;
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
                this.getTermApplicationByTermAccId(this.termLoanApplicationId);
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
        }
      }

    
  }

  /**
   * @implements onClick member individaul photo copy
   * @author vinitha
   */
  onClickMemberIndividualMoreDetails() {
    this.membreIndividualFlag = true;
  }

  /**
   * @implements onClick Memberphoto copy
   * @author vinitha
   */
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }

  /**
   * @implements navigate back
   * @author vinitha
   */
  navigateToBack() {
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }

  /**
   * @implements onClick institution Details
   * @author vinitha
   */
  onClickInstitutionMoreDetails(){
    this.institutionPromoterPromoterFlag = true;
  }

  /**
   * @implements onClick group promoter
   * @author vinitha
   */
  onClickOfGroupPromotes(){
    this.groupPromotersPopUpFlag = true;
  }

  /**
   * @implements cancle or refresh
   * @author vinitha
   */
  cancelOrRefresh(){
    this.termLoanDisbursementModel.disbursementAmount = null;
    this.termLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
    this.termLoanDisbursementModel.isPhotoSignVerfied = null;
    this.termLoanDisbursementModel.id = null;
  }

  /**
   * @implements edit disbursement
   * @param rowData
   * @author vinitha
   */
  editDisbursements(rowData: any) {
    this.isEditDeleteButtonEnable = true;
    this.addOrEdit = true;
    this.editDisable = true;
  
    const selectedDisbursement = this.termLoanDisbursementList.find((item: any) => item.id === rowData.id);
  
    if (selectedDisbursement) {
      
      this.termLoanDisbursementModel.disbursementOrder = selectedDisbursement.disbursementOrder;
      this.termLoanDisbursementModel.disbursementAmount = selectedDisbursement.disbursementAmount;
      this.termLoanDisbursementModel.typeName = selectedDisbursement.typeName;
      this.termLoanDisbursementModel.disbursementDateVal = this.datePipe.transform(selectedDisbursement.disbursementDateVal, this.orgnizationSetting.datePipe);
    //     this.termLoanDisbursementService.getTermDisbursementById(rowData.id).subscribe(
    //   (response: any) => {
    //     this.responseModel = response;
    //     if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
    //       if (this.responseModel.data && this.responseModel.data.length > 0) {
    //         this.commonComponent.stopSpinner();
    //         this.termLoanDisbursementModel = this.responseModel.data[0];
  
    //         // Ensure date transformation
    //         this.termLoanDisbursementModel.disbursementDateVal = this.datePipe.transform(this.termLoanDisbursementModel.disbursementDate, this.orgnizationSetting.datePipe);
    //         this.termLoanDisbursementModel.transactionDateVal = this.datePipe.transform(this.termLoanDisbursementModel.transactionDate, this.orgnizationSetting.datePipe);
    //       }
    //     } else {
    //       this.commonComponent.stopSpinner();
    //       this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
    //       setTimeout(() => {
    //         this.msgs = [];
    //       }, 2000);
    //     }
    //   },
    //   (error) => {
    //     this.commonComponent.stopSpinner();
    //     this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
    //     setTimeout(() => {
    //       this.msgs = [];
    //     }, 1000);
    //   }
    // );
    }
  }
  

  /**
   * @implements add disbursemt
   * @author vinitha
   */
  addDisbursment(){
    this.termLoanDisbursementModel.disbursementAmount = null;
    // this.termLoanDisbursementModel.disbursementDateVal = this.commonFunctionsService.currentDate();
    this.termLoanDisbursementModel.transactionDateVal = this.commonFunctionsService.currentDate();
    this.termLoanDisbursementModel.isPhotoSignVerfied = null;
    this.termLoanDisbursementModel.id = null;
    this.addOrEdit = true;
    this.editDisable = true;
  }

  /**
   * @implements close disbursemtn
   * @author vinitha
   */
  closeDisbursement(){
    this.addOrEdit = false;
    this.editDisable = false;
  }

  /**
   * @implements get schedule by product 
   * @author vinitha
   */
  getSchedulesByApplicationId(termProductId: any) {
    this.disburmentAmount = 0;
    this.isEditDeleteButtonEnable = false;
    this.termLoanDisbursementService.getTermDisbursmentScheduleByLoanProductId(termProductId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termLoanDisbursementList = this.responseModel.data;
            const currentDate = new Date();
          
            this.termLoanDisbursementList = this.termLoanDisbursementList.map((schedule: { visitNumber: any; tenureTypeName: any;disbursementPercentage: number; visitTenure: number; }) => {
              const percentage = (schedule.disbursementPercentage / 100) * this.termLoanApplicationModel.requestedAmount;;
            
              const visitTenure = schedule.visitTenure ?? 0;
          
              const disbursementDate = new Date(currentDate);
              disbursementDate.setDate(disbursementDate.getDate() + visitTenure);
              const formattedDate = `${String(disbursementDate.getDate()).padStart(2, '0')}/${String(disbursementDate.getMonth() + 1).padStart(2, '0')}/${disbursementDate.getFullYear()}`;            
              return {
                disbursementOrder: schedule.visitNumber,
                typeName: schedule.tenureTypeName,
                disbursementAmount: percentage,
                disbursementDateVal: formattedDate
              };
            });
            this.updateDisbursementTable(this.unsavedSchedules);
            
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

  updateDisbursementTable(unsavedSchedules: any) {
   
    const updatedRecord = this.termLoanApplicationModel.termLoanDisbursementDTOList.filter((obj:any) => obj != null).map((disbursement :any)=>{
      disbursement.transactionDateVal = this.datePipe.transform( disbursement.transactionDate , this.orgnizationSetting.datePipe);
      disbursement.disbursementDateVal = this.datePipe.transform( disbursement.disbursementDate , this.orgnizationSetting.datePipe);
      const updatedRecord = this.termLoanApplicationModel.termLoanDisbursementDTOList.find(
        (updated: { disbursementOrder: any }) => updated.disbursementOrder === disbursement.disbursementOrder
      );
      if (disbursement.statusName == applicationConstants.APPROVED) {
        disbursement.approved = true;
        this.disburmentAmount = this.disburmentAmount + disbursement.disbursementAmount ;
      }
      this.totalDisbursement = this.totalDisbursement + disbursement.disbursementAmount;
      if(disbursement.statusName == CommonStatusData.SCHEDULED){
        disbursement.scheduled = true;
        this.dueAmount = this.dueAmount + disbursement.disbursementAmount ;
        this.editDisable = false;
      }
      if (updatedRecord) {
     
        const index = this.termLoanDisbursementList.findIndex(
          (saved: { disbursementOrder: any } ) => saved.disbursementOrder === disbursement.disbursementOrder
        );
        if (index !== -1) {       
          this.termLoanDisbursementList[index] = updatedRecord;
        }
      } else {
        
        this.termLoanDisbursementList.push(disbursement);
      }
    });
  
   
    this.termLoanDisbursementList = [...this.termLoanDisbursementList];
  }
  
  /**
   * @implements cancle pop up
   * @author vinitha
   */
  canclePopUp(){
    this.addOrEdit = false;
    this.editDisable = false;
  }

}
