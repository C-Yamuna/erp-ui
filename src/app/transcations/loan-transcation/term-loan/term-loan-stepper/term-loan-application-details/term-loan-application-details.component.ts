import { Component, ViewChild } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermApplication, TermLoanDisbursementScheduleModel, TermLoanInsuranceDetails, TermLoanInterestPolicy, TermLoanProductDefinition } from './shared/term-application.model';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { TermApplicationService } from './shared/term-application.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-term-loan-application-details',
  templateUrl: './term-loan-application-details.component.html',
  styleUrls: ['./term-loan-application-details.component.css']
})
export class TermLoanApplicationDetailsComponent {
  termLoanApplicationForm: FormGroup;
  insuranceForm: FormGroup;
  checked: boolean = false;
  responseModel!: Responsemodel;
  productsList: any[] = [];
  repaymentFrequencyList: any[] = [];
  loanPurposeList: any[] = [];
  operationTypesList: any[] = [];
  orgnizationSetting: any;
  msgs: any[] = [];
  columns: any[] = [];
  insuranceVendorDetailsList: any[] = [];
  occupationTypesList: any[] = [];
  gendersList: any[] = [];
  isMemberCreation: boolean = false;
  memberTypeName: any;
  termLoanApplicationId: any;
  isEdit: boolean = false;
  admissionNumber: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  visible: boolean = false;
  applicationType: boolean = false;
  isIndividual: Boolean = false;
  productInfoFalg: boolean = false;
  isProductDisable: boolean = false;
  productDefinitionFlag: boolean = false;
  @ViewChild('dt', { static: false })
  private dt!: Table;
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanProductDefinitionModel: TermLoanProductDefinition = new TermLoanProductDefinition();
  termLoanInterestPolicyModel: TermLoanInterestPolicy = new TermLoanInterestPolicy();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanInsuranceDetailsModel: TermLoanInsuranceDetails = new TermLoanInsuranceDetails();
  termLoanDisbursementScheduleModel:TermLoanDisbursementScheduleModel = new TermLoanDisbursementScheduleModel()
  addButton: boolean = false;
  displayDialog: boolean = false;
  interestConfigList: any[]=[];
  collateralList: any[]=[];
  interestPolicyList: any[]=[];
  collectionOrderList: any[]=[];
  linkedShareCapitalList: any[]=[];
  chargesList: any[]=[];
  purposeList: any[]=[];
  statusList: any[] = [];
  requiredDocumentsList: any[]=[];
  editDeleteDisable: boolean = false;
  scheduleRecordsCount: any;
  disbursmentScheduleList: any[] = [];
  collectionTypeList: any[] = [];
  schedulerForm: FormGroup;
  pacsId: any;
  constructor(private router: Router, private formBuilder: FormBuilder,
    private translate: TranslateService, private commonFunctionsService: CommonFunctionsService,
    private encryptDecryptService: EncryptDecryptService, private commonComponent: CommonComponent,
   private datePipe: DatePipe,
    private commonFunction: CommonFunctionsService,  private termLoanApplicationsService: TermApplicationService,
    private activateRoute: ActivatedRoute,  private fileUploadService: FileUploadService) {

      this.termLoanApplicationForm = this.formBuilder.group({
        termProductId: ['', [Validators.required]],
        accountNumber: [{ value: '', disabled: true }],
        applicationDate: ['', [Validators.required]],
        operationTypeId: ['', ],
        effectiveRoi: [{ value: '', disabled: true }],
        penalRoi: [{ value: '', disabled: true }],
        iod: [{ value: '', disabled: true }],
        repaymentFrequency: ['', [Validators.required]],
        monthlyIncome: ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
        purposeId:['', [Validators.required]],
        requestedAmount:  ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
        // sanctionAmount:  ['', [Validators.pattern(applicationConstants.NEW_AMOUNT_PATTERN), Validators.compose([Validators.required])]],
        sanctionDate:['', [Validators.required]],
        plannedDisbursements:  ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
        loanPeriod:  ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
        loanDueDate: ['', [Validators.required]],
      })
  
      this.insuranceForm = this.formBuilder.group({
        vendorId: ['', [Validators.required]],
        policyName: ['', [Validators.pattern(applicationConstants.NAME_PATTERN), Validators.compose([Validators.required])]],
        policyNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
        sumInsured:['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
        premium: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      })
      this.schedulerForm = this.formBuilder.group({
        'disbursementNumber': ['', Validators.required],
        'typeName': ['',],
        'disbursementLimit': ['',],
        'minDaysForDisbursement': ['',],
        'remarks': ['',],
        'disbursementOrder': ['',],
        'statusName': ['',],
      })
    }
    ngOnInit() {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
      this.statusList = this.commonComponent.status();
      this.collectionTypeList = [
        { label: 'Amount', value: 1 },
        { label: 'Percentage', value: 2 },
      ];
      this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
      this.getAllProducts();
      this.getAllRepaymentFrequency();
      this.getAllLoanPurpose();
      this.getAllAccountTypes();
      this.getAllInsuranceVendors();
  
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.commonComponent.startSpinner();
          let id = this.encryptDecryptService.decrypt(params['id']);
          this.termLoanApplicationId = Number(id);
          this.isEdit = true;
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
          this.commonComponent.stopSpinner();
        } else {
          this.isEdit = false;
          this.commonComponent.stopSpinner();
        }
      })
      this.termLoanApplicationForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
      this.insuranceForm.valueChanges.subscribe((data: any) => {
        this.updateData();
      });
    }
  
    save() {
      this.updateData();
    }
  
    updateData() {
      this.termLoanApplicationModel.termLoanInsuranceDetailsDTO = this.termLoanInsuranceDetailsModel;
      this.termLoanApplicationsService.changeData({
        formValid: (!this.termLoanApplicationForm.valid && !this.insuranceForm.valid )? true : false,
        data: this.termLoanApplicationModel,
        isDisable: (!this.termLoanApplicationForm.valid) && (!this.insuranceForm.valid),
        stepperIndex: 3,
      });
    }
  
    getAllProducts() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getActiveProductsBasedOnPacsId(this.pacsId).subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.productsList = this.responseModel.data;
          this.productsList = this.productsList.filter((product: { status: number; }) => product.status == 3).map((product: any) => {
            return { label: product.name, value: product.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
    
    /**
     * @implements get product details for product pop up
     * @param id 
     */
    getProductDefinitionByProductId(id: any) {
      this.termLoanApplicationsService.getPreviewDetailsByProductId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          this.termLoanProductDefinitionModel = this.responseModel.data[0];
          if (null != this.termLoanProductDefinitionModel.effectiveStartDate && undefined != this.termLoanProductDefinitionModel.effectiveStartDate)
            this.termLoanProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.termLoanProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
        
          if (this.termLoanProductDefinitionModel.termProdCollateralsConfigList) {
            this.collateralList = this.termLoanProductDefinitionModel.termProdCollateralsConfigList
              .filter((item: any) => item != null && item.status === applicationConstants.ACTIVE)
              .map((item: { collateralTypeName: any, collateralType: any }) => ({
                label: item.collateralTypeName,
                value: item.collateralType
              }));
          }
          
        
        
          if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList.length > 0) {
            this.interestPolicyList = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList;
            this.interestPolicyList = this.interestPolicyList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
          if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != null && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList != undefined) {
            if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].roi != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].roi != null)
              this.termLoanApplicationModel.effectiveRoi = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].roi;
  
            if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].penalInterest != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].penalInterest != null)
              this.termLoanApplicationModel.penalInterest = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].penalInterest;

            if (this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].iod != undefined && this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].iod != null)
              this.termLoanApplicationModel.iod = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList[0].iod;
          }
          if (this.termLoanProductDefinitionModel.termApportionConfigDTOList != null && this.termLoanProductDefinitionModel.termApportionConfigDTOList != undefined && this.termLoanProductDefinitionModel.termApportionConfigDTOList.length > 0) {
            this.collectionOrderList = this.termLoanProductDefinitionModel.termApportionConfigDTOList;
            this.collectionOrderList = this.collectionOrderList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
          if (this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != null && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList != undefined && this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList.length > 0) {
            this.linkedShareCapitalList = this.termLoanProductDefinitionModel.termLoanLinkedSharecapitalConfigList;
            this.linkedShareCapitalList = this.linkedShareCapitalList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }

          if (this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != null && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList != undefined && this.termLoanProductDefinitionModel.termProductChargesConfigDTOList.length > 0) {
            this.chargesList = this.termLoanProductDefinitionModel.termProductChargesConfigDTOList;
            this.chargesList = this.chargesList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
          if (this.termLoanProductDefinitionModel.termProdPurPoseConfgList != null && this.termLoanProductDefinitionModel.termProdPurPoseConfgList != undefined && this.termLoanProductDefinitionModel.termProdPurPoseConfgList.length > 0) {
            this.purposeList = this.termLoanProductDefinitionModel.termProdPurPoseConfgList;
            this.purposeList = this.purposeList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }

          if (this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != null && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList != undefined && this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList.length > 0) {
            this.requiredDocumentsList = this.termLoanProductDefinitionModel.termRequiredDocumentsConfigDTOList;
            this.requiredDocumentsList = this.requiredDocumentsList.filter((data: any) => data != null && data.effectiveStartDate != null).map((object: any) => {
              object.effectiveStartDate = this.datePipe.transform(object.effectiveStartDate, this.orgnizationSetting.datePipe);
              return object;
            });
          }
        }
      });
    }
  
    getAllRepaymentFrequency() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllRepaymentFrequency().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.repaymentFrequencyList = this.responseModel.data.filter((repaymentFrequency: { status: number; }) => repaymentFrequency.status == applicationConstants.ACTIVE).map((repaymentFrequency: any) => {
            return { label: repaymentFrequency.name, value: repaymentFrequency.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    getAllLoanPurpose() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllLoanPurpose().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.loanPurposeList = this.responseModel.data.filter((loanPurpose: { status: number; }) => loanPurpose.status == 1).map((loanPurpose: any) => {
            return { label: loanPurpose.name, value: loanPurpose.id };
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    getAllAccountTypes() {
      this.termLoanApplicationsService.getAllAccountTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.operationTypesList = this.responseModel.data;
              this.operationTypesList = this.operationTypesList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
                return { label: relationType.name, value: relationType.id };
              });
            }
          }
          if (this.termLoanApplicationModel.operationTypeId != undefined) {
            const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === this.termLoanApplicationModel.operationTypeId);
            this.termLoanApplicationModel.operationTypeName = filteredItem.label;
          }
        }
      }, error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
      })
    }
  
    getAllInsuranceVendors() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllInsuranceVendors().subscribe(response => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.insuranceVendorDetailsList = this.responseModel.data.filter((insuranceVendor: { status: number; }) => insuranceVendor.status == 1).map((insuranceVendor: any) => {
            let newObj = { label: insuranceVendor.name, value: insuranceVendor.id };
            return newObj;
          });
        }
      },
        error => {
          this.msgs = [];
          this.commonComponent.stopSpinner();
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })
    }
  
    /**
     * @implements product change
     * @param event 
     */
    productOnChange(productId: any) {
      this.displayDialog = true;
      this.productInfoFalg = true;
      if (productId != null && productId != undefined) {
        this.getProductDefinitionByProductId(productId);
      }
      else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "please select product" }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
  
    onChangeAccountType(event: any) {
      if (event.value != null && event.value != undefined) {
        const filteredItem = this.operationTypesList.find((item: { value: any; }) => item.value === event.value);
        this.termLoanApplicationModel.operationTypeName = filteredItem.label;
        this.updateData();
      }
    }
  
    onChangeRepayment(event: any) {
      //  if (event.value != null && event.value != undefined) {
      //   this.getProductDefinitionByProductId(event.value);
      // }
    }
  
    onChangePurpose(event: any) {
      //  if (event.value != null && event.value != undefined) {
      //   this.getProductDefinitionByProductId(event.value);
      // }
    }
  
    //get account details by admissionNumber list
    getTermApplicationByTermAccId(termLoanApplicationId: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(termLoanApplicationId).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel != null && this.responseModel != undefined) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
                if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                  this.termLoanApplicationModel = this.responseModel.data[0];
                  if (this.termLoanApplicationModel.termProductId != null && this.termLoanApplicationModel.termProductId != undefined)
                    this.isProductDisable = applicationConstants.TRUE;
                  // if (this.termLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                  //   this.membershipBasicDetailsModel = this.termLoanApplicationModel.individualMemberDetailsDTO;
                  //   if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined)
                  //     this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
  
                  //   if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined)
                  //     this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                  // }
                  if (this.termLoanApplicationModel.applicationDate != null && this.termLoanApplicationModel.applicationDate != undefined) {
                    this.termLoanApplicationModel.applicationDateVal = this.datePipe.transform(this.termLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
                  }
                  if (this.termLoanApplicationModel.sanctionDate != null && this.termLoanApplicationModel.sanctionDate != undefined) {
                    this.termLoanApplicationModel.sanctionDate = this.datePipe.transform(this.termLoanApplicationModel.sanctionDate, this.orgnizationSetting.datePipe);
                  }
                  if (this.termLoanApplicationModel.loanDueDate != null && this.termLoanApplicationModel.loanDueDate != undefined) {
                    this.termLoanApplicationModel.loanDueDate = this.datePipe.transform(this.termLoanApplicationModel.loanDueDate, this.orgnizationSetting.datePipe);
                  }
                  if (this.termLoanApplicationModel.memberTypeName != null && this.termLoanApplicationModel.memberTypeName != undefined) {
                    this.memberTypeName = this.termLoanApplicationModel.memberTypeName;
                    if (this.termLoanApplicationModel.memberTypeName == "Individual")
                      this.isIndividual = true;
                  }
                  if (this.termLoanApplicationModel.admissionNo != null && this.termLoanApplicationModel.admissionNo != undefined) {
                    this.admissionNumber = this.termLoanApplicationModel.admissionNo;
                  }
                  if (this.termLoanApplicationModel.operationTypeName != null && this.termLoanApplicationModel.operationTypeName != undefined) {
                    this.applicationType = true;
                  }
                  if (this.termLoanApplicationModel.termProductName != null && this.termLoanApplicationModel.termProductName != undefined) {
                    this.productInfoFalg = true;
                  }
                  if (this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != null && this.termLoanApplicationModel.termLoanInsuranceDetailsDTO != undefined) {
                    this.termLoanInsuranceDetailsModel = this.termLoanApplicationModel.termLoanInsuranceDetailsDTO;
                  }
                  this.getProductDefinitionByProductId(this.termLoanApplicationModel.termProductId);
                  if (this.termLoanApplicationModel.termLoanDisbursementScheduleDTOList != null) {
                    this.disbursmentScheduleList = this.termLoanApplicationModel.termLoanDisbursementScheduleDTOList;
                  }
                  this.updateData();
                }
              }
            }
          }
        }
      });
    }
  
    onChange() {
      this.checked = !this.checked;
      if (this.checked) {
        this.isMemberCreation = true;
      }
      else {
        this.isMemberCreation = false;
      }
    }
  
    showDialog() {
      this.visible = true;
    }
  
    // getProductDefinition() {
    //   this.productDefinitionFlag = true;
    //   this.getProductDefinitionByProductId(this.termLoanApplicationModel.termProductId);
    // }
  
    closeProductDefinition() {
      this.productDefinitionFlag = false;
    }
  
    /**
     * @implements onSaction amount entry
     * @param sactionAmount 
     */
    onSactionAmountChange(sactionAmount:any){
      this.termLoanApplicationModel.effectiveRoi = null;
      this.termLoanApplicationModel.penalInterest = null;
      this.termLoanApplicationModel.iod= null;
      this.interestConfigList = this.termLoanProductDefinitionModel.termInterestPolicyConfigDTOList.filter((obj:any)=>(obj.minSlabAmount <= sactionAmount && obj.maxSlabAmount >= sactionAmount ));
      if( this.interestConfigList != null &&  this.interestConfigList != undefined &&  this.interestConfigList.length >0){
        this.termLoanApplicationModel.effectiveRoi = this.interestConfigList[0].roi;
        this.termLoanApplicationModel.penalInterest = this.interestConfigList[0].penalInterest;
        this.termLoanApplicationModel.iod = this.interestConfigList[0].iod;
      }
      else {
        this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "Given Saction Amount is Not in between of any Slabs in Product definition" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
      }
    
    }
    addData() {
      this.addButton = true;
      this.editDeleteDisable = true;
      this.updateData();
      this.dt._first = 0;
      this.dt.value.unshift({ securityType: '' });
      this.dt.initRowEdit(this.dt.value[0]);
    }
    onDisbursementChange() {
      if (this.termLoanApplicationModel.plannedDisbursements != null && this.termLoanApplicationModel.plannedDisbursements != undefined) {
        this.scheduleRecordsCount = true;
      } else {
        this.scheduleRecordsCount = false;
      }
    }
  
    addOrUpdateSchedulerDetails(rowData: any) {
      this.addButton = false;
      this.editDeleteDisable = false;
      rowData.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanDisbursementScheduleModel = rowData;
      if (rowData.id != undefined) {
  
        this.termLoanApplicationsService.updateTermLoanDisbursementSchedule(this.termLoanDisbursementScheduleModel).subscribe((res: any) => {
          this.responseModel = res;
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.getTermApplicationByTermAccId(this.termLoanApplicationId);
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          } else {
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }, error => {
          this.msgs = [{ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
        })
      } else {
  
        this.termLoanApplicationsService.addTermLoanDisbursementSchedule(this.termLoanDisbursementScheduleModel).subscribe((res: any) => {
          this.responseModel = res;
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.getTermApplicationByTermAccId(this.termLoanApplicationId);
            this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          } else {
            this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }, error => {
          this.msgs = [({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST })];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        })
      }
    }
  
    cancelSchedulerDetails() {
      this.disbursmentScheduleList = [];
      this.addButton = false;
      this.editDeleteDisable = false;
      this.getTermApplicationByTermAccId(this.termLoanApplicationId);
      this.updateData();
    }
  
    editSchedulerDetailsRow(row: any) {
      this.addButton = false;
      this.editDeleteDisable = false;
      this.termLoanDisbursementScheduleModel = row;
      this.termLoanDisbursementScheduleModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanApplicationsService.getTermLoanDisbursementScheduleById(this.termLoanDisbursementScheduleModel.id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.termLoanDisbursementScheduleModel = this.responseModel.data;
  
        }
        this.getTermApplicationByTermAccId(this.termLoanApplicationId);
      });
      this.updateData();
    }
  
}
