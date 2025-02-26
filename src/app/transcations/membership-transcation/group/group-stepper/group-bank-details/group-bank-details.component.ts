import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { BankDetailsModel } from '../../../shared/bank-details.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { MembershipBankDetailsService } from '../../../shared/membership-bank-details.service';
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { MembershipGroupDetailsService } from '../../../shared/membership-group-details.service';
import { MemberGroupBasicDetails } from '../../../shared/member-group-details-model';

@Component({
  selector: 'app-group-bank-details',
  templateUrl: './group-bank-details.component.html',
  styleUrls: ['./group-bank-details.component.css']
})
export class GroupBankDetailsComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;
  bankForm: any;
  commomCategory: any[] = [];
  tempCommomCategory: any[] = [];
  addButton: boolean = false;
  statusList: any[] = [];
  bankDetailsModel: BankDetailsModel = new BankDetailsModel();
  memberGroupDetailsModel :MemberGroupBasicDetails = new MemberGroupBasicDetails();
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
  groupId: any;
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  uploadFileData: any;
  isFileUploaded: boolean = false;
  multipleFilesList: any;
  today: any;


  constructor(private commonComponent: CommonComponent, private router: Router, private formBuilder: FormBuilder, private memberBasicDetailsStepperService: MemberBasicDetailsStepperService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService, private MembershipBankDetailsService: MembershipBankDetailsService,
    private memberShipGroupDetailsService: MembershipGroupDetailsService,
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
        this.groupId = this.encryptService.decrypt(params['id']);
        if (this.groupId) {
          this.isEdit = true;
          this.getMembershipGroupDetailsById(this.groupId);
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
   * @implements  get MembershipGroupDetails By Id for memberBankDetailsDTOList based on group id
   * @author yamuna.k
   */
  getMembershipGroupDetailsById(id: any) {
    this.commonComponent.startSpinner();
    this.memberShipGroupDetailsService.getMembershipGroupDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.memberGroupDetailsModel = this.responseModel.data[0];

        if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
          this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupDetailsModel.memberBankDetailsDTOList.length > 0) {
          this.memberBankDetailsDTOList = this.memberGroupDetailsModel.memberBankDetailsDTOList;
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

  updateData() {
    this.bankDetailsModel.memberId = this.memberGroupDetailsModel.id
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.bankForm.valid,
      data: this.bankDetailsModel,
      savedId: this.groupId,
      stepperIndex: 4,
      // isDisable: !this.landFlag ? true : false,
    });
  }

  save() {
    this.updateData();
  }
     /**
   * @implements  edit bank details
   * @author yamuna.k
   */
  editVillageRow(row: any) {
    this.addButton = true;
    this.editDeleteDisable = true;
    // this.buttonsFlag  = false;
    // this.landFlag =false
    // this.updateData();
  }
     /**
   * @implements  add new entry inline
   * @author yamuna.k
   */
  addNewEntry() {
    this.newRow = { bankName: '', nameInBank: '', ifscCode: '', accountNumber: '', status: '' }
  }

     /**
   * @implements  add button method for inline row
   * @author yamuna.k
   */
  onRowEditSave() {
    this.bankForm.reset();
    this.addNewEntry();
    this.editDeleteDisable = true;
    this.addButton = true;
    // this.buttonsFlag  = false;
    // this.landFlag =false
    // this.updateData();
    this.dt._first = 0;
    this.dt.value.unshift(this.newRow);
    this.dt.initRowEdit(this.dt.value[0]);
    // this.getAllRelationshipType();
    // this.getQualificationType();

  }

     /**
   * @implements  cancle method 
   * @author yamuna.k
   */
  onRowEditCancel() {
    this.addButton = false;
    this.editDeleteDisable = false;
    this.buttonsFlag = true;
    // this.landFlag =true;
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
    rowData.memberId = this.groupId;
    rowData.memberType = this.memberGroupDetailsModel.memberTypeId;
    rowData.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
    this.addButton = false;
    this.editDeleteDisable = false;

    if (rowData.id != null) {
      this.MembershipBankDetailsService.updateMembershipBankDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.getMembershipGroupDetailsById(rowData.memberId);
          // this.buttonsFlag  = true;
          // this.landFlag =true;;
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
    } else {
      this.MembershipBankDetailsService.addMembershipBankDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.getMembershipGroupDetailsById(rowData.memberId);
          if (null != this.responseModel.data[0].dob)
            this.responseModel.data[0].memDobVal = this.datePipe.transform(this.responseModel.data[0].dob, this.orgnizationSetting.datePipe);
          // this.buttonsFlag  = true;
          // this.landFlag =true;
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



  // familyDplicate(id: any) {
  //   if (id != null && id != undefined) {
  //     if (this.memberBankDetailsDTOList != null && this.memberBankDetailsDTOList != undefined && this.memberBankDetailsDTOList.length > 0) {
  //       for (let item of this.memberBankDetailsDTOList) {
  //         if (item != null && item != undefined && item.status != null && item.status != undefined && item.relationTypeId != null && item.relationTypeId != undefined && item.status == applicationConstants.ACTIVE && item.relationTypeId === id) {
  //           this.bankForm.reset();
  //           this.msgs = [];
  //           this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "relation with member already exists" }];
  //           setTimeout(() => {
  //             this.msgs = [];
  //           }, 1500);
  //         }
  //       }
  //     }
  //   }
  // }
}

