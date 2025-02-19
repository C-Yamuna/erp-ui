import { Component } from '@angular/core';
import { Loantransactionconstant } from '../../../loan-transaction-constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TermApplication } from '../../term-loan-stepper/term-loan-application-details/shared/term-application.model';
import { TermLoanCollection } from './shared/term-loan-collection.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { TermApplicationService } from '../../term-loan-stepper/term-loan-application-details/shared/term-application.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { TermLoanCollectionService } from './shared/term-loan-collection.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MembershipBasicRequiredDetails } from '../../term-loan-stepper/term-loan-new-membership/shared/term-loan-new-membership.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { TermLoanTransaction } from '../term-loan-disbursement/shared/term-loan-disbursement.model';
import { TermLoanDisbursementService } from '../term-loan-disbursement/shared/term-loan-disbursement.service';

@Component({
  selector: 'app-term-loan-collection',
  templateUrl: './term-loan-collection.component.html',
  styleUrls: ['./term-loan-collection.component.css']
})
export class TermLoanCollectionComponent {
  collectionForm:FormGroup;
  collectionDetails:any;
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanCollectionModel: TermLoanCollection = new TermLoanCollection();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  termLoanTransactionModel: TermLoanTransaction = new TermLoanTransaction();
  foreclosureChargesEnabled: boolean = false;
  paymentOptions:any;
  additionalChargesCheck:boolean = false;
  accountNumber: any;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  msgs: any[] = [];
  loanId: any;
  isEdit: any;
  showForm: boolean = false;
  rowEdit: boolean = false;
  photoCopyFlag: boolean = false;
  memberPhotoCopyZoom: boolean = false;
  yourData: Data[] = [
    {
        totalOutstanding: 1000,
        debit: {
            charges: 200,
            interest: 300,
            principal: 500
        },
        credit: {
            charges: 150,
            interest: 250,
            principal: 400
        },
        outstanding: {
            charges: 50,
            interest: 50,
            principal: 100
        }
    },
  ];
  pacsId: any;
  branchId: any;
  termLoanCollectionList: any[] = [];
  totalDue: any;
 
  
  constructor(private router: Router,private termLoanApplicationsService: TermApplicationService,private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,private encryptDecryptService: EncryptDecryptService, private formBuilder: FormBuilder
    , private commonFunctionsService: CommonFunctionsService,private translate: TranslateService,private termLoanCollectionService: TermLoanCollectionService
    , private datePipe: DatePipe,private fileUploadService: FileUploadService,private termLoanDisbursementService: TermLoanDisbursementService
  ){
    this.paymentOptions = [
      { label: 'Cash', value: 1 },
      { label: 'Cheque', value: 2 },
      { label: 'Transfer', value: 3},
    ];
    this.collectionForm = this.formBuilder.group({
      // effectiveRoi: ['', ],
      totalDueAmount:[{ value: '', disabled: true }],
      totalCollectionAmount:['', [Validators.required,Validators.pattern(applicationConstants.AMOUNT_PATTERN_VALIDATION)]],
      transactionDate:new FormControl({ value: '', disabled: true }, [Validators.required]),
      paymentModeName:['', [Validators.required]],
      referenceNumber:['', [Validators.required]],
      remarks:['', ],

      
      
    })
    this.collectionDetails = [

      { field: 'totalCollectionAmount', header: 'LOANS.COLLECTION_AMOUNT' },
      { field: 'transactionDate', header: 'LOANS.TRANSACTION_DATE' },
      { field: 'paymentModeName', header: 'LOANS.PAYMENT_MODE' },
      // { field: 'accountNumber', header: 'LOANS.ACCOUNT_NUMBER' },
      { field: 'referenceNumber', header: 'LOANS.REFERENCE_NUMBER' },
      { field: 'statusName', header: 'LOANS.STATUS' },
     
    ];
  }
  ngOnInit() {
    this.translate.use(this.commonFunctionsService.getStorageValue('language'));
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.loanId = this.encryptDecryptService.decrypt(params['id']);
        this.isEdit = true;
        if (this.loanId != null && this.loanId != undefined) {
          this.getTermCillectionDetailsByLoanApplicationId();
        }
      } else {
        this.isEdit = false;
      }
    })
    this.getTermApplicationByTermAccId(this.loanId);
    this.termLoanCollectionModel.transactionDate = this.commonFunctionsService.currentDate();
  }
       /**
   * @implements add or update data in transaction details
   * @author vinitha
   */
  saveCollection() {
    if (this.termLoanCollectionModel.collectionDateVal != undefined)
      this.termLoanCollectionModel.collectionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanCollectionModel.collectionDateVal));

    if (this.termLoanCollectionModel.transactionDate != undefined)
      this.termLoanCollectionModel.transactionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.termLoanCollectionModel.transactionDate));

    if(this.termLoanCollectionModel.transactionDate == null || this.termLoanCollectionModel.transactionDate == undefined){
      this.termLoanCollectionModel.transactionDate = this.commonFunctionsService.currentDate();
    }
    this.termLoanTransactionModel.moduleType = applicationConstants.COLLECTION;



    if(this.termLoanCollectionModel.totalCollectionAmount != null && this.termLoanCollectionModel.totalCollectionAmount != undefined){
      this.termLoanTransactionModel.transactionAmount = this.termLoanCollectionModel.totalCollectionAmount;
    }

    if(this.termLoanApplicationModel.accountNumber != null && this.termLoanApplicationModel.accountNumber != undefined){
      this.termLoanTransactionModel.accountNumber = this.termLoanApplicationModel.accountNumber;
    }

    if(this.termLoanCollectionModel.transactionDate != null && this.termLoanCollectionModel.transactionDate != undefined){
      this.termLoanTransactionModel.transactionDate = this.termLoanCollectionModel.transactionDate;
    }

    if(this.termLoanCollectionModel.paymentMode != null && this.termLoanCollectionModel.paymentMode != undefined){
      this.termLoanTransactionModel.transactionMode = this.termLoanCollectionModel.paymentMode;
    }

    if(this.termLoanCollectionModel.referenceNumber != null && this.termLoanCollectionModel.referenceNumber != undefined){
      this.termLoanTransactionModel.referenceNumber = this.termLoanCollectionModel.referenceNumber;
    }

    if(this.termLoanCollectionModel.remarks != null && this.termLoanCollectionModel.remarks != undefined){
      this.termLoanTransactionModel.remarks = this.termLoanCollectionModel.remarks;
    }
    if(this.termLoanCollectionModel.sbAccountNumber != null && this.termLoanCollectionModel.sbAccountNumber != undefined){
      this.termLoanTransactionModel.sbAccountNumber = this.termLoanCollectionModel.sbAccountNumber;
    }

    if(this.termLoanApplicationModel.id != null && this.termLoanApplicationModel.id != undefined){
      this.termLoanTransactionModel.termLoanApplicationId = this.termLoanApplicationModel.id;
    }
   

 
      if(this.termLoanCollectionModel.id != null ){
        this.termLoanTransactionModel.collectionId = this.termLoanCollectionModel.id;
  
      this.termLoanTransactionModel.statusName = applicationConstants.SUBMISSION_FOR_APPROVAL;
      this.termLoanDisbursementService.updateTermTransactionDetails(this.termLoanTransactionModel).subscribe((response: any) => {
        this.responseModel = response;
        this.commonComponent.stopSpinner();
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          this.getTermCillectionDetailsByLoanApplicationId();
        this.resetCollectionFormData();
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
       
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
    } else {
      this.termLoanTransactionModel.statusName = applicationConstants.CREATED;
      this.termLoanDisbursementService.addTermTransactionDetails(this.termLoanTransactionModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          this.getTermCillectionDetailsByLoanApplicationId();
          this.resetCollectionFormData();
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
        
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        });
    }
    this.isEdit = applicationConstants.FALSE;


  }
         /**
   * @implements get application data by term accountid
   * @author vinitha
   */
  
  getTermApplicationByTermAccId(id: any) {
    this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.termLoanApplicationModel = this.responseModel.data[0];

            this.membershipBasicRequiredDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
            if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
              this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
              this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
              this.photoCopyFlag = true;
            }
            if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
            }

            if (this.termLoanApplicationModel.loanApprovedDate != null && this.termLoanApplicationModel.loanApprovedDate != undefined)
              this.termLoanApplicationModel.loanApprovedDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanApprovedDate, this.orgnizationSetting.datePipe);
            
            if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined)
              this.termLoanApplicationModel.loanDueDateVal = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
           
            if (this.termLoanApplicationModel.termCollectionDTOList != undefined && this.termLoanApplicationModel.termCollectionDTOList != null
              && this.termLoanApplicationModel.termCollectionDTOList.length > 0) {
              this.termLoanCollectionList = this.termLoanApplicationModel.termCollectionDTOList;

              if(this.termLoanCollectionModel.transactionDate != null && this.termLoanCollectionModel.transactionDate != undefined ){
                this.termLoanCollectionModel.transactionDate=this.datePipe.transform(this.termLoanCollectionModel.transactionDate, this.orgnizationSetting.datePipe);
               
              }

              if(this.termLoanCollectionModel.transactionDate == null || this.termLoanCollectionModel.transactionDate == undefined){
                this.termLoanCollectionModel.transactionDate = this.commonFunctionsService.currentDate();
              }
             
             
              for (let collection of this.termLoanCollectionList) {
                if (this.termLoanApplicationModel.accountNumber != null)
                  collection.accountNumber = this.termLoanApplicationModel.accountNumber;

                if (collection.collectionDate != null && collection.collectionDate != undefined)
                  collection.collectionDateVal = this.datePipe.transform(collection.collectionDate, this.orgnizationSetting.datePipe);

                if (collection.transactionDate != null && collection.transactionDate != undefined)
                  collection.transactionDate = this.datePipe.transform(collection.transactionDate, this.orgnizationSetting.datePipe);
                
                // if(collection.totalDueAmount != null&& collection.totalDueAmount != undefined)
                //   this.termLoanCollectionModel.totalDueAmount = this.termLoanApplicationModel.totalDisbursedAmount - this.termLoanApplicationModel.totalCollectionAmount;
                // else
                //   this.termLoanCollectionModel.totalDueAmount = this.termLoanApplicationModel.totalDisbursedAmount;

                if (collection.statusName != null && collection.statusName != undefined && collection.statusName === applicationConstants.CREATED)
                  collection.isEditShow = applicationConstants.TRUE;
                else
                  collection.isEditShow = applicationConstants.FALSE;
              }
            }

          }
        }
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
   * @implements get collection data by term application id
   * @author vinitha
   */
  getTermCillectionDetailsByLoanApplicationId() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.termLoanCollectionService.getTermCillectionDetailsByLoanApplicationId(this.loanId).subscribe((data: any) => {
       this.responseModel = data;
          if (this.responseModel.data[0].termCollectionDTOList != undefined && this.responseModel.data[0].termCollectionDTOList != null
            && this.responseModel.data[0].termCollectionDTOList.length > 0) {
            this.termLoanCollectionList = this.responseModel.data[0].termCollectionDTOList;

            if(this.termLoanCollectionModel.transactionDate != null && this.termLoanCollectionModel.transactionDate != undefined ){
              this.termLoanCollectionModel.transactionDate=this.datePipe.transform(this.termLoanCollectionModel.transactionDate, this.orgnizationSetting.datePipe);
             
            }

            if(this.termLoanCollectionModel.transactionDate == null || this.termLoanCollectionModel.transactionDate == undefined){
              this.termLoanCollectionModel.transactionDate = this.commonFunctionsService.currentDate();
            }
           
           
            for (let collection of this.termLoanCollectionList) {
              if (this.termLoanApplicationModel.accountNumber != null)
                collection.accountNumber = this.termLoanApplicationModel.accountNumber;

              if (collection.collectionDate != null && collection.collectionDate != undefined)
                collection.collectionDateVal = this.datePipe.transform(collection.collectionDate, this.orgnizationSetting.datePipe);

              if (collection.transactionDate != null && collection.transactionDate != undefined)
                collection.transactionDate = this.datePipe.transform(collection.transactionDate, this.orgnizationSetting.datePipe);
              

              if (collection.statusName != null && collection.statusName != undefined && collection.statusName === applicationConstants.CREATED)
                collection.isEditShow = applicationConstants.TRUE;
              else
                collection.isEditShow = applicationConstants.FALSE;
            }
            }
    
        this.commonComponent.stopSpinner();
     }, error => {
       this.msgs = [];
       this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
       this.commonComponent.stopSpinner();
     });
  }
         /**
   * @implements get data from table to form
   * @author vinitha
   */
  editRow(rowData: any) {
    this.termLoanCollectionModel.termLoanApplicationId = rowData.termLoanApplicationId;
    this.termLoanCollectionModel.accountNumber = rowData.accountNumber;
    this.termLoanCollectionModel.collectionDateVal = rowData.collectionDateVal;
    this.termLoanCollectionModel.totalCollectionAmount = rowData.totalCollectionAmount;
    this.termLoanCollectionModel.transactionDate = rowData.transactionDate;
    this.termLoanCollectionModel.paymentMode = rowData.paymentMode;
    this.termLoanCollectionModel.referenceNumber = rowData.referenceNumber;
    this.termLoanCollectionModel.id = rowData.id;
    this.termLoanTransactionModel.id = rowData.id;
    // this.rowEdit = true;
    // this.isEdit = true;
  }
           /**
   * @implements reset the data in form after saving data
   * @author vinitha
   */
  resetCollectionFormData() {
    this.termLoanCollectionModel.collectionDateVal = null;
    this.termLoanCollectionModel.totalCollectionAmount = null;
    this.termLoanCollectionModel.transactionDate = null;
    this.termLoanCollectionModel.paymentMode = null;
    this.termLoanCollectionModel.referenceNumber = null;
    this.termLoanCollectionModel.remarks = null;
  }
  back(){
    this.router.navigate([Loantransactionconstant.TERM_LOAN]);
  }
  
  isBasicDetails: boolean = false;
  position: string = 'center';
  showBasicDetailsDialog(position: string) {
    this.position = position;
    this.isBasicDetails = true;
  }
  onClickMemberIndividualMoreDetails(){
    this.showForm = true
  }
  onClickMemberPhotoCopy() {
    this.memberPhotoCopyZoom = true;
  }
}
