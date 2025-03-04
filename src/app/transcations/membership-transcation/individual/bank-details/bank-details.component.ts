import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberShipBasicDetailsModel } from 'src/app/transcations/loan-transcation/sao/shared/sao-loan-application.model';
import { BankDetailsModel } from '../../shared/bank-details.model';
import { MemberBasicDetailsStepperService } from '../shared/membership-individual-stepper.service';
import { MembershipBankDetailsService } from '../../shared/membership-bank-details.service';
import { MemberBasicDetails } from '../../shared/member-basic-details.model';
import { IndividualMemberDetailsModel } from 'src/app/transcations/loan-transcation/sao/sao-stepper/membership-basic-details/shared/membership-basic-details.model';
import { MembershipBasicDetailsService } from '../../shared/membership-basic-details.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent {
@ViewChild('dt', { static: false }) private dt!: Table;
  bankForm: any;
  commomCategory: any[] = [];
  tempCommomCategory: any[] = [];
  addButton: boolean = false;
  statusList: any[] = [];
  bankDetailsModel: BankDetailsModel = new BankDetailsModel();
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  responseModel!: Responsemodel;
  msgs: any[] = [];
  isEdit: any;
  buttonDisabled?: any;
  orgnizationSetting: any;
  countryList: any[] = [];
  soilTypeList: any[] = [];
  villageList: any[] = [];
  districtList: any[] = [];
  subDistrictList: any[] = [];
  workFlowList: any[] = [];
  displayDialog: boolean = false;
  editDeleteDisable: boolean = false;
  memberBankDetailsDTOList: any[] = [];
  relationshipTypeList: any[] = [];
  qualificationLIst: any[] = [];
  displayVillageDialog: boolean = false;
  rowVillageId: any;
  rowId: any;
  newRow: any = null;
  memberId: any;
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  uploadFileData: any;
  isFileUploaded: boolean = false;
  multipleFilesList: any;
  today: any;

  constructor(private commonComponent: CommonComponent, private router: Router, private formBuilder: FormBuilder, private memberBasicDetailsStepperService: MemberBasicDetailsStepperService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private membershipBankDetailsService: MembershipBankDetailsService,
    private memberShipBasicDetailsService: MembershipBasicDetailsService,
    private datePipe: DatePipe, private commonFunctionsService: CommonFunctionsService,


  ) {
    this.bankForm = this.formBuilder.group({
      'bankName': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'nameInBank': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'ifscCode': new FormControl('', Validators.required),
      // 'status': new FormControl('',Validators.required),
      'accountNumber': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.ACCOUNT_NUMBER_PATTERN)]),

    });

  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.addNewEntry();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.memberId = this.encryptService.decrypt(params['id']);
        if (this.memberId) {
          this.isEdit = true;
          this.getMembershipDetailsById(this.memberId);
        }
      } else {
        this.isEdit = false;
      }
      this.updateData();
    });

    this.bankForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.bankForm.valid) {
        this.save();
      }
    });
  }
  /**
   * @implements getMembershipDetailsById method for get memberBankDetailsDTOList based on memberId
   * @param id 
   * @author yamuna.k
   */
  getMembershipDetailsById(id: any) {
    this.commonComponent.startSpinner();
    this.memberShipBasicDetailsService.getMembershipBasicDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.memberBasicDetailsModel = this.responseModel.data[0];

        // if (this.memberBasicDetailsModel.admissionDate != null && this.memberBasicDetailsModel.admissionDate != undefined) {
        //   this.memberBasicDetailsModel.admissionDate = this.datePipe.transform(this.memberBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        // }
        if (this.memberBasicDetailsModel.memberBankDetailsDTOList != null && this.memberBasicDetailsModel.memberBankDetailsDTOList.length > 0) {
          this.memberBankDetailsDTOList = this.memberBasicDetailsModel.memberBankDetailsDTOList;
        }
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.updateData();
    },
    error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }

  // updateData() {
  //   this.bankDetailsModel.memberId = this.memberBasicDetailsModel.id
  //   this.memberBasicDetailsStepperService.changeData({
  //     formValid: this.bankForm.valid,
  //     data: this.bankDetailsModel,
  //     savedId: this.memberId,
  //     stepperIndex: 8,
  //     // isDisable: !this.landFlag ? true : false,
  //   });
  // }
  updateData() {
    this.bankDetailsModel.memberId = this.memberBasicDetailsModel.id
    if (this.memberBankDetailsDTOList == null || this.memberBankDetailsDTOList == undefined ||
      this.memberBankDetailsDTOList.length == 0) {
      this.buttonsFlag = true;
    }
    else {
      this.buttonsFlag = false;
    }
    if (this.landFlag) {
      this.buttonsFlag = true;
    }
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.bankForm.valid ,
      data: this.bankDetailsModel,
      savedId:this.memberId,
      stepperIndex: 8,
      isDisable: this.landFlag
    });
  }

  save() {
    this.updateData();
  }
    /**
   * @implements edit bank details
   * @param bank model 
   * @author yamuna.k
   */
  editVillageRow(row: any) {
    this.addButton = applicationConstants.TRUE
    this.editDeleteDisable = applicationConstants.TRUE
    // this.buttonsFlag  = false;
    this.landFlag =applicationConstants.TRUE
    this.updateData();
  }
  addNewEntry() {
    this.newRow = { bankName: '', nameInBank: '', ifscCode: '', accountNumber: '', status: '' }
  }
     /**
   * @implements  on click add button for disply inline row 
   * @author yamuna.k
   */
  onRowEditSave() {
    this.bankForm.reset();
    this.addNewEntry();
    this.editDeleteDisable =applicationConstants.TRUE;
    this.addButton = applicationConstants.TRUE;
    // this.buttonsFlag  = false;
    this.landFlag =applicationConstants.TRUE;
    this.updateData();
    this.dt._first = 0;
    this.dt.value.unshift(this.newRow);
    this.dt.initRowEdit(this.dt.value[0]);
    // this.getAllRelationshipType();
    // this.getQualificationType();

  }
     /**
   * @implements  cancle bank details
   * @author yamuna.k
   */
  onRowEditCancel() {
    this.addButton = false;
    this.editDeleteDisable = false;
    // this.buttonsFlag = true;
    this.landFlag =applicationConstants.FALSE;
    this.updateData();
    const index = this.dt.value.indexOf(this.newRow);

    // Remove the newRow from the array if it exists
    if (index > -1) {
      this.dt.value.splice(index, 1);
    }
    this.addNewEntry();
  }


     /**
   * @implements  add or update bank details
   * @author yamuna.k
   */
  saveOrUpdateBankDetailsDetails(rowData: any) {
    rowData.pacsId = 1;
    rowData.branchId = 1;
    rowData.status = applicationConstants.ACTIVE;
    rowData.memberId = this.memberId;
    rowData.memberType = this.memberBasicDetailsModel.memberTypeId;
    rowData.admissionNumber = this.memberBasicDetailsModel.admissionNumber;
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    this.landFlag = applicationConstants.FALSE;

    if (rowData.id != null) {
      this.membershipBankDetailsService.updateMembershipBankDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.getMembershipDetailsById(rowData.memberId);
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      this.membershipBankDetailsService.addMembershipBankDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.getMembershipDetailsById(rowData.memberId);
          this.memberBankDetailsDTOList.unshift(this.responseModel.data[0]);
          this.memberBankDetailsDTOList.splice(1, 1);
          // this.updateData();
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);

        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    }
  }
}
