import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SiBorrowingAccountDetails } from '../shared/siborrowing.model';
import { SiBorrowingAccountMapping } from './shared/si-borrowing-account-mapping.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SiBorrowingStepperService } from '../shared/si-borrowing-stepper.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { SiBorrowingAccountMappingService } from './shared/si-borrowing-account-mapping.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-si-borrowing-account-mapping',
  templateUrl: './si-borrowing-account-mapping.component.html',
  styleUrls: ['./si-borrowing-account-mapping.component.css']
})
export class SiBorrowingAccountMappingComponent {
  responseModel!: Responsemodel;
  msgs: any[]=[];
  siborrowingAccountDetailsModel :SiBorrowingAccountDetails = new SiBorrowingAccountDetails();
  SiBorrowingAccountMappingModel:SiBorrowingAccountMapping = new SiBorrowingAccountMapping();
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  siborrowingAccountMappedLoansDTOList: any[] = [];
  borrowingsAccountMapping: any[] = [];
  date: any;
  statusList:any[]=[];
  tempGridListData: any[] = [];
  gridListLenght: Number | undefined;
  pacsId : any;
  branchId : any;
  borrowingAccountId: any;
  borrowingsAccountMappinglist:any[]=[];
  isselect: boolean = false;
  accountNumber: any;
  siborrowingaccountsList: any[]=[];
  buttonDisbled: boolean = applicationConstants.FALSE;
  selectAllChecked: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private siBorrowingStepperService : SiBorrowingStepperService,
    private commonComponent: CommonComponent,private siBorrowingAccountMappingService:SiBorrowingAccountMappingService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,
    private datePipe: DatePipe,
     private commonFunctionsService: CommonFunctionsService,
   
  )
  
  { 
    this.borrowingsAccountMapping = [
      { field: 'admissionNo', header: 'BORROWINGSTRANSACTIONS.ADMISSION_NUMBER' },
      { field: 'accountNumber', header: 'BORROWINGSTRANSACTIONS.LOAN_ACCOUNT_NUMBER' },
      { field: 'memberName', header: 'BORROWINGSTRANSACTIONS.NAME' },
      { field: 'sanctionAmount', header: 'BORROWINGSTRANSACTIONS.LOAN_AMOUNT' },
      { field: 'purposeName',header:'BORROWINGSTRANSACTIONS.PURPOSE'},

    
    ];
  }
   /**
   * @author vinitha
   * @implements get account details data by borrowing accountId 
   */
  ngOnInit() {
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.statusList = this.commonComponent.status();
    this.getSiBorrowingAccountMappedLoansListByPacsIdAndBranchId();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
   
        this.borrowingAccountId = Number(this.encryptService.decrypt(params['id']));
        this.siborrowingAccountMappedLoansDTOList.forEach(row => {
          row.selected = this.borrowingsAccountMappinglist.some(item => item.loanAccountNumber === row.accountNumber);
        });
      
        this.getBySiBorrowingAccountId(this.borrowingAccountId);
        if (this.borrowingAccountId != "" && this.borrowingAccountId != null && this.borrowingAccountId != undefined) {
          this.siBorrowingStepperService.getSiBorrowingStepperById(this.borrowingAccountId).subscribe(res => {
            this.responseModel = res;
            this.commonComponent.stopSpinner();
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
              this.siborrowingAccountDetailsModel = this.responseModel.data[0];
              if (this.siborrowingAccountDetailsModel != null && this.siborrowingAccountDetailsModel != undefined) {
              if(this.siborrowingAccountDetailsModel.requestedDate != null && this.siborrowingAccountDetailsModel.requestedDate != undefined &&this.siborrowingAccountDetailsModel.requestedDate!=null&&this.siborrowingAccountDetailsModel.requestedDate!= undefined){
                this.siborrowingAccountDetailsModel.requestedDate=this.datePipe.transform(this.siborrowingAccountDetailsModel.requestedDate, this.orgnizationSetting.datePipe);
              }
            }
            }
            else {
              this.commonComponent.stopSpinner();
              this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }, error => {
              this.msgs = [];
              this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
              this.commonComponent.stopSpinner();
            });
 
        }
        
      }
    }) 
    this.save();
    this.updateHeaderCheckboxState(); 

  }
   /**
   * @author vinitha
   * @implements get mapped loans data by borrowing accountId 
   */
  getBySiBorrowingAccountId(borrowingAccountId:any) {
    this.siBorrowingAccountMappingService.getSiBorrowingAccountMappedLoansListByBorrowingAccountId(borrowingAccountId).subscribe((res: Responsemodel) => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
        if (this.responseModel != null&& this.responseModel.data!= undefined && this.responseModel.data.length>0) {
        this.borrowingsAccountMappinglist = this.responseModel.data; 
        this.siborrowingAccountMappedLoansDTOList.forEach(row => {
          row.selected = this.borrowingsAccountMappinglist.some(item => 
            item.loanAccountNumber != null  && item.loanAccountNumber != undefined && row.accountNumber != null && row.accountNumber != undefined  && 
            item.loanAccountNumber === row.accountNumber
          );
        });  
          this.updateData();
          this.updateHeaderCheckboxState();
        }
      } else {
        this.siborrowingAccountMappedLoansDTOList = []; // Reset data to avoid issues
        this.selectAllChecked = false;
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }


  onSelectCheckBox(event: any, rowData: any) {
    if (event.checked) {
      rowData.selected = true; 
  
      let selectedMapping: SiBorrowingAccountMapping = {
        status: this.statusList[0].value, 
        statusName: this.statusList[0].label,
        pacsId: rowData.pacsId,
        branchId: rowData.branchId,
        borrowingAccountId: this.borrowingAccountId,
        loanMemberAdmissionNumber: rowData.admissionNo,
        loanAccountNumber: rowData.accountNumber,
        memberName: rowData.memberName,
        loanAmount: rowData.sanctionAmount,
        purpose: rowData.purposeId,
        purposeName: rowData.purposeName,
      };

      if (!this.borrowingsAccountMappinglist.some(item => item.loanAccountNumber === rowData.accountNumber)) {
        this.borrowingsAccountMappinglist.push(selectedMapping);
      }
    } else {
      rowData.selected = false;  
      this.borrowingsAccountMappinglist = this.borrowingsAccountMappinglist.filter(item => item.loanAccountNumber !== rowData.accountNumber);
    }
  
    this.updateHeaderCheckboxState();  
    this.updateData(); 
  }

selectAll(event: any) {
  if (event.checked) {
    this.siborrowingAccountMappedLoansDTOList.forEach(row => {
      row.selected = true;  
      let selectedMapping: SiBorrowingAccountMapping = {
        status: this.statusList[0].value, 
        statusName: this.statusList[0].label,
        pacsId: row.pacsId,
        branchId: row.branchId,
        borrowingAccountId: this.borrowingAccountId,
        loanMemberAdmissionNumber: row.admissionNo,
        loanAccountNumber: row.accountNumber,
        memberName: row.memberName,
        loanAmount: row.sanctionAmount,
        purpose: row.purposeId,
        purposeName: row.purposeName,
      };
      if (!this.borrowingsAccountMappinglist.some(item => item.loanAccountNumber === row.accountNumber)) {
        this.borrowingsAccountMappinglist.push(selectedMapping);
      }
    });
  } else {
    this.siborrowingAccountMappedLoansDTOList.forEach(row => {
      row.selected = false;
    });
    this.borrowingsAccountMappinglist = [];  
  }

  this.updateHeaderCheckboxState(); 
  this.updateData();  
}



updateHeaderCheckboxState() {
  if (!this.siborrowingAccountMappedLoansDTOList || this.siborrowingAccountMappedLoansDTOList.length === 0) {
    this.selectAllChecked = false; 
  } else {
    this.selectAllChecked = this.siborrowingAccountMappedLoansDTOList.every(row => row.selected);
  }
}
  save() {
    this.updateData();
  }

  updateData() {
    if (this.borrowingsAccountMappinglist != null && this.borrowingsAccountMappinglist.length > 0) {
      this.buttonDisbled = applicationConstants.TRUE;  
    } else {
      this.buttonDisbled = applicationConstants.FALSE;
    }
    this.siBorrowingStepperService.changeData({
      formValid: this.buttonDisbled,
      data: this.borrowingsAccountMappinglist,
      isDisable: !this.borrowingsAccountMappinglist? applicationConstants.TRUE : applicationConstants.FALSE, 
      stepperIndex: 1,
    });
  }
 
  navigateToBack(){
    this.router.navigate([]);
  }
 
 /**
   * @author vinitha
   * @implements get loans data by pacsId And branchId
   */
  getSiBorrowingAccountMappedLoansListByPacsIdAndBranchId() {
    this.commonComponent.startSpinner();
    this.siBorrowingAccountMappingService.getAllDisbursementPendingLoans(this.pacsId,this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS&& this.responseModel.data[0] !=null) {
        if (this.responseModel != null&& this.responseModel.data!= undefined && this.responseModel.data.length>0) {
        this.siborrowingAccountMappedLoansDTOList = this.responseModel.data;
        }
        this.siborrowingAccountMappedLoansDTOList.forEach(row => {
          row.selected = this.borrowingsAccountMappinglist.some(item => 
            item.loanAccountNumber != null  && item.loanAccountNumber != undefined && row.accountNumber != null && row.accountNumber != undefined  && 
            item.loanAccountNumber === row.accountNumber
          );
        });
        this.commonComponent.stopSpinner();
      } 
      else {

        this.commonComponent.stopSpinner();

        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

}
