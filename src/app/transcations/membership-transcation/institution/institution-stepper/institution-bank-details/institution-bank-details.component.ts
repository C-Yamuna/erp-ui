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
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { BankDetailsModel } from '../../../shared/bank-details.model';
import { MembershipBankDetailsService } from '../../../shared/membership-bank-details.service';
import { MemInstitutionService } from '../../../shared/mem-institution.service';
import { InstitutionBasicDetailsModel } from '../../../shared/institution-details.model';

@Component({
  selector: 'app-institution-bank-details',
  templateUrl: './institution-bank-details.component.html',
  styleUrls: ['./institution-bank-details.component.css']
})
export class InstitutionBankDetailsComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;
  bankForm: any;
  commomCategory: any[] = [];
  tempCommomCategory: any[] = [];
  addButton: boolean = false;
  statusList: any[] = [];
  bankDetailsModel: BankDetailsModel = new BankDetailsModel();
  institutionModel: InstitutionBasicDetailsModel = new InstitutionBasicDetailsModel();
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
    private memInstitutionService: MemInstitutionService,
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
          this.getMembershipInstitutionDetailsById(this.memberId);
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
   * @implements getMembershipInstitutionDetailsById method for get memberBankDetailsDTOList based on memberId
   * @param id 
   * @author yamuna.k
   */
  getMembershipInstitutionDetailsById(id: any) {
    this.commonComponent.startSpinner();
    this.memInstitutionService.getMemInstitutionById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.institutionModel = this.responseModel.data[0];

        if (this.institutionModel.admissionDate != null && this.institutionModel.admissionDate != undefined) {
          this.institutionModel.admissionDate = this.datePipe.transform(this.institutionModel.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.institutionModel.memberBankDetailsDTOList.length > 0) {
          this.memberBankDetailsDTOList = this.institutionModel.memberBankDetailsDTOList;
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
    this.bankDetailsModel.memberId = this.institutionModel.id
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.bankForm.valid,
      data: this.bankDetailsModel,
      savedId: this.memberId,
      stepperIndex: 4,
      // isDisable: !this.landFlag ? true : false,
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
    this.addButton = true;
    this.editDeleteDisable = true;
    // this.buttonsFlag  = false;
    // this.landFlag =false
    // this.updateData();
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
* @implements  cancle bank details
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
    rowData.memberId = this.memberId;
    rowData.memberType = this.institutionModel.memberTypeId;
    rowData.admissionNumber = this.institutionModel.admissionNumber;
    this.addButton = false;
    this.editDeleteDisable = false;

    if (rowData.id != null) {
      this.membershipBankDetailsService.updateMembershipBankDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.getMembershipInstitutionDetailsById(rowData.memberId);
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
      this.membershipBankDetailsService.addMembershipBankDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.getMembershipInstitutionDetailsById(rowData.memberId);
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
}
