import { SiLoanApplication } from './../../../shared/si-loans/si-loan-application.model';
import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { SiLoanApplicationService } from '../../../shared/si-loans/si-loan-application.service';
import { Table } from 'primeng/table';
import { promoterDetailsModel } from 'src/app/transcations/membership-transcation/shared/member-group-details-model';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { InstitutionPromoterDetailsModel } from '../../../sao/sao-stepper/membership-basic-details/shared/membership-basic-details.model';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { CasteService } from 'src/app/configurations/common-config/caste/shared/caste.service';
import { CommunityService } from 'src/app/configurations/common-config/community/shared/community.service';
import { RelationshipTypeService } from 'src/app/configurations/common-config/relationship-type/shared/relationship-type.service';
import { QualificationService } from 'src/app/configurations/common-config/qualification/shared/qualification.service';
import { OccupationTypesService } from 'src/app/configurations/common-config/occupation-types/shared/occupation-types.service';
import { MembershipBasicDetailsService } from 'src/app/transcations/membership-transcation/shared/membership-basic-details.service';
import { SelectItemGroup } from 'primeng/api';
import { GroupPromotersService } from '../../../shared/si-loans/group-promoters.service';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../../../shared/si-loans/si-loan-membership-details.model';
import { GroupPromoterDetails, InstitutionPromoterDetails } from '../../../compound-interest-loan/compound-interest-loan-stepper/ci-membership-details/shared/membership-details.model';

@Component({
  selector: 'app-si-loan-membership-details',
  templateUrl: './si-loan-membership-details.component.html',
  styleUrls: ['./si-loan-membership-details.component.css']
})
export class SiLoanMembershipDetailsComponent {

  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];

  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: GroupPromoterDetails = new GroupPromoterDetails();
  institutionPromoterDetailsModel: InstitutionPromoterDetails = new InstitutionPromoterDetails();
  siLoanApplicationModel: SiLoanApplication = new SiLoanApplication();

  communityList: any[] = [];
  relationshipTypeList: any[] = [];
  occupationList: any[] = [];
  qualificationTypesList: any[] = [];
  admissionNumberList: any[] = [];
  // groupedCasteSubCaste: any[] = [];
  checked: Boolean = false;
  isMemberCreation: Boolean = false;
  id: any;
  isEdit: boolean = false;
  imageUrl: string | ArrayBuffer | null = null;
  fileName: any;
  responseModel!: Responsemodel;
  orgnizationSetting: any;
  docFilesList: any[] = [];
  submitFlag: boolean = false;
  maritalStatusList: any[] = [];

  memberTypeList: any[] = [];
  memberTypeName: any;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  isDisableFlag: boolean = true;
  disableMemberType: boolean = false;
  promoterDetailsForm: any;
  promoterColumns: any[] = [];
  institutionPromoterColumn: any[] = [];
  institutionPromoter: any[] = [];
  addButton: boolean = false;
  EditDeleteDisable: boolean = false;
  newRow: any;
  promoterDetails: any[] = [];
  memberTypeId: any;
  age: any;

  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;

  msgs: any[] = [];
  operatorTypeList: any[] = [];
  admisionNumber: any;
  pacsId: any;
  branchId: any;
  allTypesOfmembershipList: any;
  permenentAllTypesOfmembershipList: any;
  loanAccId: any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  requiredlist: any[] = [];
  accountNumber: any;
  admissionNumber: any;
  operationTypeName: any;
  institutionTypes: any[] = [];
  ;

  ageMaxValue: any;
  ageMinValue: undefined;
  today: any;
  tempSubCasteList: any[] = [];
  tempSubQualificationList: any[] = [];
  groupedCasteSubCaste: SelectItemGroup[] = [];
  groupedQualificationSubQualification: any[] = [];
  subCasteList: any[] = [];
  subQualificationList: any[] = [];
  saveButtonDisabled: boolean = false;
  subProductList: any;
  show: any
  promterTypeDisabled: any;
  groupOrInstitutionDisable: boolean = false;
  isFileUploadedPhoto: Boolean = false;
  isFileUploadedsignature: Boolean = false;
  groupPromoters: boolean = false;
  isExistingMember: Boolean = false;
  institutionPromoterPopUp: boolean = false;
  uploadSignature: boolean = false;
  isFileUploadedPromoterPhoto: boolean = false;
  isFileUploadedPromoterSignature: boolean = false;
  cancleButtonFlag: boolean = false;
  admissionNumberDropDown: boolean = false;
  submitDisableForImage: boolean = false;
  submitDisableForSignature: boolean = false;
  groupId: any;
  institutionId: any;
  admissionNumbersList: any[] = [];
  groupTypesList: any[]=[];

  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
    private membershipServiceService: MembershipServiceService, private fileUploadService: FileUploadService,
    private siLoanApplicationService: SiLoanApplicationService,
    private relationshipTypeService: RelationshipTypeService, private qualificationService: QualificationService
    , private casteService: CasteService, private occupationTypesService: OccupationTypesService, private communityService: CommunityService,
    private membershipBasicDetailsService: MembershipBasicDetailsService, private groupPromotersService: GroupPromotersService,) {

    this.memberCreationForm = this.formBuilder.group({
      'surname': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'name': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'subProductId': new FormControl('', Validators.required),
      'age': new FormControl('', Validators.required),
      'dob': new FormControl('', Validators.required),
      'genderId': new FormControl('', Validators.required),
      'martialId': new FormControl('', Validators.required),
      'relationId': new FormControl('', Validators.required),
      'relativeName': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'qualificationId': new FormControl('', Validators.required),
      'occupationId': new FormControl('', Validators.required),
      'aadharNumber': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.AADHAR_PATTERN)]),
      'panNumber': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN),]),
      'mobileNumber': new FormControl('', [Validators.required, Validators.pattern(applicationConstants.MOBILE_PATTERN)]),
      'emailId': new FormControl('', [Validators.pattern(applicationConstants.EMAIL_PATTERN)]),
      'casteId': new FormControl('', Validators.required),
      'communityId': new FormControl('', Validators.required),
      // 'mcrNumber': new FormControl(''),
      'admissionDate': new FormControl('', Validators.required),
      // 'admissionFee': new FormControl(''),
      'isStaff': new FormControl('', Validators.required),
      'societyAdmissionNo': new FormControl('', Validators.required),
      'resolutionDate': new FormControl(''),
    })

    this.groupForm = this.formBuilder.group({
      name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationDate: ['', Validators.required],
      admissionDate: ['', Validators.required],
      // pocNumber: ['', Validators.required],
      // mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
      panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
      tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER)]],
      gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN)]],
      // pocName: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      subProductId: ['', Validators.compose([Validators.required])],
      groupTypeId:['', Validators.compose([Validators.required])],
      societyAdmissionNo: [new FormControl('', Validators.required)],
      operatorTypeId:['', Validators.compose([Validators.required])],
     



    })

    this.institutionForm = this.formBuilder.group({
      name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationDate: ['', Validators.required],
      admissionDate: ['', Validators.required],
      // mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
      panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
      tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER)]],
      gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN)]],
      // pocName: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      subProductId: ['', Validators.compose([Validators.required])],
      societyAdmissionNo: [new FormControl('')],
      operatorTypeId:['', Validators.compose([Validators.required])],
      institutionType:['', Validators.compose([Validators.required])],

    })
    this.promoterDetailsForm = this.formBuilder.group({
      surname: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      // operatorTypeId: ['', Validators.required],
      dob: ['', Validators.required],
      age: ['', Validators.required],
      genderId: ['', Validators.required],
      martialId: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      aadharNumber: ['', Validators.required],
      emailId: ['', Validators.required],
      startDate: ['', Validators.required],
      promterType: ['',],
      admissionNumber: [''],
      authorizedSignatory:['', Validators.required],
      isPoc:['', Validators.required],
      endDate:[''],
    })
  }

  ngOnInit(): void {
    this.today = new Date();
    this.requiredlist = this.commonComponent.requiredlist();
    this.membershipBasicRequiredDetailsModel.filesDTOList = [];
    this.pacsId = 1;
    this.branchId = 1;
    this.isMemberCreation = this.commonFunctionsService.getStorageValue('b-class-member_creation');
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.maritalStatusList = this.commonComponent.maritalStatusList();

    this.genderList = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 2 },
    ]
    this.maritalstatusList = [
      { label: 'Married', value: 1 },
      { label: 'Un-Married', value: 2 }
    ]
    this.groupTypesList = [
      { label: "Self Help Group", value:1 },
      { label: "Rythu Mitra", value:2 }
    ]
    this.institutionTypes= [
      { label: "Self Help Group", value:1 },
      { label: "Rythu Mitra", value:2 }
    ]


    this.getAllMemberType();
    this.getAllRelationshipType();
    this.getAllGroupedQualificationAndSubQualification();
    this.getAllGroupedCasteAndSubCaste();
    this.getOccupationTypes();
    this.getAllSubProducts();
    this.getAllCommunityTypes();
    this.getAllOperatorTypes();

    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.loanAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getSILoanApplicationById(this.loanAccId);
        this.isEdit = true;
      } else if (params['isMemberCreation'] != undefined) {
        this.isEdit = false;
      } else {
        let val = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
        this.isEdit = false;
        this.memberFormReset(val);
        this.updateData();
      }
    });

    this.memberCreationForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.memberCreationForm.valid || this.groupForm.valid || this.institutionForm.valid) {
        this.save();
      }
    });

    this.groupForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.groupForm.valid) {
        this.save();
      }
    });

    this.institutionForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.groupForm.valid) {
        this.save();
      }
    });

  }
  /**
   * @implements getting si loan application details
   * @param id
   * @author yamuna.k
   */
  getSILoanApplicationById(id: any) {
    this.siLoanApplicationService.getSILoanApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.admissionNumber = this.responseModel.data[0].admissionNo;
            this.memberTypeName = this.responseModel.data[0].memberTypeName;;
            this.memberTypeId = this.responseModel.data[0].memberTypeId;
            this.siLoanApplicationModel = this.responseModel.data[0];
            this.updateData();
            this.membershipDataFromSbModule();
          }
          else {
            this.groupOrInstitutionDisable = true;
          }
        }

      }
    });
  }
   /**
   * @implements getting member module date by admission Number
   * @author yamuna.k
   */
  membershipDataFromSbModule() {
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      this.getMemberDetailsByAdmissionNumber(this.admissionNumber);
    } else if (this.memberTypeName == "Group") {
      this.individualFlag = false;
      this.groupFlag = true;
      this.getGroupByAdmissionNumber(this.admissionNumber);
    } else if (this.memberTypeName == "Institution") {
      this.individualFlag = false;
      this.institutionFlag = true;
      this.getInstitutionByAdmissionNumber(this.admissionNumber);
    }
  }

  memberFormReset(flag: any) {
    if (flag) {
      this.memberCreationForm.reset();
      this.isMemberCreation = flag;
    }
    else {
      this.isMemberCreation = flag;
    }
  }
  
   /**
   * @implements updateData
   * @author yamuna.k
   */
  updateData() {
    this.siLoanApplicationModel.memberTypeId = this.memberTypeId;
    if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.siLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetailsModel.isNewMember = this.isMemberCreation;
      this.siLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicRequiredDetailsModel;

      this.individualFlag = true;
      const isFieldsValid = this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != null
        && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined;

      if (!isFieldsValid || !this.memberCreationForm.valid) {
        this.isDisableFlag = true;
      } else {
        this.isDisableFlag = false;
      }
    }
    if (this.memberTypeName == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      this.isDisableFlag = !(this.promoterDetails != null && this.promoterDetails != undefined && this.promoterDetails.length >= 2)
      this.memberGroupDetailsModel.memberTypeId = this.memberTypeId;
      this.memberGroupDetailsModel.memberTypeName = this.memberTypeName;
      this.memberGroupDetailsModel.isNewMember = this.isMemberCreation;
      this.siLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
      this.siLoanApplicationModel.memberTypeName = this.memberTypeName;
      // this.addButton = !this.groupForm.valid;
    }
    if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      this.isDisableFlag = !(this.institutionPromoter != null && this.institutionPromoter != undefined && this.institutionPromoter.length >=1)
      this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
      this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipInstitutionDetailsModel.isNewMember = this.isMemberCreation;
      this.siLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.siLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
      // this.addButton = !this.institutionForm.valid;
    }

    this.siLoanApplicationService.changeData({
      formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
      data: this.siLoanApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
 
  //stepper data save
  save() {
    this.updateData();
  }

     /**
   * @implements get all member types from masters
   * @author yamuna.k
   */
  getAllMemberType() {
    this.membershipServiceService.getAllMemberTypes().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberTypeList = this.responseModel.data;
          this.memberTypeList = this.memberTypeList.filter((obj: any) => obj != null).map((memberType: { name: any; id: any; }) => {
            return { label: memberType.name, value: memberType.id };
          });
        }
        const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === this.memberTypeId);
        if (filteredItem != null && filteredItem != undefined && filteredItem.label != null && filteredItem.label != undefined) {
          this.memberTypeName = filteredItem.label;
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
   * @implements for relation Types list
   * @author yamuna.k
   */
  getAllRelationTypes() {
    this.siLoanApplicationService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.relationshipTypeList = this.responseModel.data;
        this.relationshipTypeList = this.relationshipTypeList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }

 
     /**
   * @implements Occupations List
   * @author yamuna.k
   */
  getAllOccupationTypes() {
    this.siLoanApplicationService.getAllOccupationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.occupationList = this.responseModel.data;
        this.occupationList = this.occupationList.filter((obj: any) => obj != null).map((occupationType: { name: any; id: any; }) => {
          return { label: occupationType.name, value: occupationType.id };
        });
      }
    });
  }

     /**
   * @implements qualifications List
   * @author yamuna.k
   */
  getAllQualificationType() {

    this.siLoanApplicationService.getQualificationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.qualificationTypesList = this.responseModel.data;
        this.qualificationTypesList = this.qualificationTypesList.filter((obj: any) => obj != null).map((qualificationType: { name: any; id: any; }) => {
          return { label: qualificationType.name, value: qualificationType.id };
        });
      }
    });
  }
  /**
   * @implements Community List
   * @author yamuna.k
   */
  getAllCommunityTypes() {

    this.siLoanApplicationService.getAllCommunityTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.communityList = this.responseModel.data;
        this.communityList = this.communityList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((community: { name: any; id: any; }) => {
          return { label: community.name, value: community.id };
        });
      }
    });
  }
 /**
   * @implements get all operation types List from masters
   * @author yamuna.k
   */
  getAllOperatorTypes() {
    this.commonComponent.startSpinner();
    this.siLoanApplicationService.getAllOperationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.operatorTypeList = this.responseModel.data.filter((operationType: any) => operationType.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        // let operationType = this.operatorTypeList.find((data: any) => null != data && data.value == this.promoterDetailsModel.operatorTypeId);
        // if (operationType != null && undefined != operationType)
        //   this.promoterDetailsModel.operatorTypeName = operationType.label;
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
  onChangeOperatorChange() {
    let operator = this.operatorTypeList.find((data: any) => null != data && this.memberGroupDetailsModel.operatorTypeId != null && data.value == this.memberGroupDetailsModel.operatorTypeId);
    if (operator != null && undefined != operator)
    this.memberGroupDetailsModel.operatorTypeName = operator.label;
  }
/**
   * @implements get member basic details by admissionNumber
   * @author yamuna.k
   */
  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.siLoanApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
            if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
              this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
              this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetailsModel.resolutionDate != null && this.membershipBasicRequiredDetailsModel.resolutionDate != undefined) {
              this.membershipBasicRequiredDetailsModel.resolutionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.resolutionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetailsModel.memberTypeId != undefined && this.membershipBasicRequiredDetailsModel.memberTypeId) {
              this.memberTypeId = this.membershipBasicRequiredDetailsModel.memberTypeId;
            }
            if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
            }
            if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
              this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
            }
            this.siLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicRequiredDetailsModel;
            this.siLoanApplicationModel.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
            this.updateData();
            this.disableMemberType = true;
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
/**
   * @implements get group basic details by admissionNumber
   * @author yamuna.k
   */
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.siLoanApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberGroupDetailsModel = this.responseModel.data[0];
            this.addButton = false;
            this.isEdit = true;
            if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined)
              this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

            if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
              this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.memberGroupDetailsModel.memberTypeId != null && this.memberGroupDetailsModel.memberTypeId != undefined)
              this.memberTypeId = this.memberGroupDetailsModel.memberTypeId;

            if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
              this.promoterDetails = this.memberGroupDetailsModel.groupPromoterList.map((member: any) => {
                if (member != null && member != undefined) {
                  if (member.dob != null && member.dob != undefined)
                    member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);

                  if (member.startDate != null && member.startDate != undefined)
                    member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);

                  if (member.endDate != null && member.endDate != undefined)
                    member.endDateVal = this.datePipe.transform(member.endDate, this.orgnizationSetting.datePipe);

                  if (member.authorizedSignatory != null && member.authorizedSignatory != undefined && member.authorizedSignatory) {
                    member.authorizedSignatoryName = applicationConstants.YES;
                  }
                  else {
                    member.authorizedSignatoryName = applicationConstants.NO;
                  }
                  if (member.uploadImage != null && member.uploadImage != undefined) {
                    member.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(member.uploadImage, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadImage);
                    this.submitDisableForImage = true;
                    this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
                  }
                  if (member.uploadSignature != null && member.uploadSignature != undefined) {
                    member.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(member.uploadSignature, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadSignature);
                    this.submitDisableForSignature = true;
                    this.isFileUploadedPromoterSignature = applicationConstants.TRUE;

                  }
                  if (member.isExistingMember) {
                    this.admissionNumberDropDown = true;
                    this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
                    this.disableFormFields();
                  } else {
                    this.admissionNumberDropDown = false;
                    this.enableFormFields();
                  }

                }
                return member;
              });
              if (this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined)
                this.siLoanApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;

              if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined)
                this.siLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;

            }
            this.updateData();
            this.disableMemberType = true;
          }
        }
        else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
/**
   * @implements get institution basic details by admissionNumber
   * @author yamuna.k
   */
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.siLoanApplicationService.getInstitutionDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            this.addButton = false;
            // this.isEdit = true;
            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined)
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);

            if (this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined)
              this.memberTypeId = this.memberTypeId;

            if (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
             this.institutionPromoter = this.institutionPromoter.map((member: any) => {
              if (member != null && member != undefined) {
                if (member.dob != null && member.dob != undefined)
                  member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);

                if (member.startDate != null && member.startDate != undefined)
                  member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);

                if (member.endDate != null && member.endDate != undefined)
                  member.endDateVal = this.datePipe.transform(member.endDate, this.orgnizationSetting.datePipe);

                if (member.authorizedSignatory != null && member.authorizedSignatory != undefined && member.authorizedSignatory) {
                  member.authorizedSignatoryName = applicationConstants.YES;
                }
                else {
                  member.authorizedSignatoryName = applicationConstants.NO;
                }
                if (member.uploadImage != null && member.uploadImage != undefined) {
                  member.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(member.uploadImage, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadImage);
                  this.submitDisableForImage = true;
                  this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
                }
                if (member.uploadSignature != null && member.uploadSignature != undefined) {
                  member.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(member.uploadSignature, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadSignature);
                  this.submitDisableForSignature = true;
                  this.isFileUploadedPromoterSignature = applicationConstants.TRUE;

                }
                if (member.isExistingMember) {
                  this.admissionNumberDropDown = true;
                  this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
                  this.disableFormFields();
                } else {
                  this.admissionNumberDropDown = false;
                  this.enableFormFields();
                }

              }
              return member;
            });

            this.siLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.siLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
            this.updateData();
            this.disableMemberType = true;
          }
        } else {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
/**
   * @implements on changes memberType
   * @author yamuna.k
   */
  OnChangeMemberType(event: any) {
    const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === event.value);
    this.memberTypeName = filteredItem.label;
    if (event.value == 1) {
      this.individualFlag = true;
      this.institutionFlag = false;
      this.groupFlag = false;
      this.membershipBasicRequiredDetailsModel.memberTypeId = 1;
      this.siLoanApplicationModel.memberTypeId = 1;
    }
    else if (event.value == 2) {
      this.groupFlag = true;
      this.individualFlag = false;
      this.institutionFlag = false;
      this.memberGroupDetailsModel.memberTypeId = 2;
      this.siLoanApplicationModel.memberTypeId = 1;

    }
    else if (event.value == 3) {
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.membershipInstitutionDetailsModel.memberTypeId = 3;
      this.siLoanApplicationModel.memberTypeId = 1;

    }
    this.updateData();
  }
  
 
  /**
   * @implements edit promoters by id
   * @author yamuna.k
   */
  editPromoter(rowData: any) {
   this.promoterDetailsForm.reset();
    this.commonComponent.startSpinner();
    this.cancleButtonFlag = true;
    this.addButton = true;
    this.EditDeleteDisable = true;
    if (rowData.id != null) {
      this.groupPromoters = true;
      if (rowData.isExistingMember) {
        this.admissionNumberDropDown = true;
        this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
        this.disableFormFields();
      } else {
        this.admissionNumberDropDown = false;
        this.enableFormFields();
      }
      this.groupPromotersService.getGroupPromoters(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        this.promoterDetailsModel = this.responseModel.data[0];
        this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
        this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
        this.promoterDetailsModel.endDateVal = this.datePipe.transform(this.promoterDetailsModel.endDate, this.orgnizationSetting.datePipe);
        if (this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined) {
          this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);
          this.submitDisableForImage = true;
          this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
        }
        else{
          this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
        }
        if (this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined) {
          this.promoterDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature);
          this.submitDisableForSignature = true;
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
        }
        else{
          this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
        }
       
        this.getAllOperatorTypes();
        this.commonComponent.stopSpinner();
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })

    }
    this.updateData();
  }
  

  /**
   * @implements edit institution promoters by id
   * @author yamuna.k
   */
  editInstitutionPromoter(rowData: any) {
    this.promoterDetailsForm.reset();    
    this.commonComponent.startSpinner();
    this.cancleButtonFlag = true;
    this.addButton = true;
    this.EditDeleteDisable = true;
    if (rowData.id != null) {
      this.institutionPromoterPopUp = true;
    

      this.groupPromotersService.getInstitutionPromoters(rowData.id).subscribe((response: any) => {
        this.responseModel = response;
        this.institutionPromoterDetailsModel = this.responseModel.data[0];
        this.institutionPromoterDetailsModel.memDobVal = this.datePipe.transform(this.institutionPromoterDetailsModel.dob, this.orgnizationSetting.datePipe);
        this.institutionPromoterDetailsModel.startDateVal = this.datePipe.transform(this.institutionPromoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
        this.institutionPromoterDetailsModel.endDateVal = this.datePipe.transform(this.institutionPromoterDetailsModel.endDate, this.orgnizationSetting.datePipe);

        if (this.institutionPromoterDetailsModel.uploadImage != null && this.institutionPromoterDetailsModel.uploadImage != undefined) {
          this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage);
          this.submitDisableForImage = true;
          this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
        }
        else{
          this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
        }
        if (this.institutionPromoterDetailsModel.uploadSignature != null && this.institutionPromoterDetailsModel.uploadSignature != undefined) {
          this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature);
          this.submitDisableForSignature = true;
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
        }
        else{
          this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
        }
        if (this.institutionPromoterDetailsModel.isExistingMember) {
          this.admissionNumberDropDown = true;
          this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
          this.disableFormFields();
        } else {
          this.admissionNumberDropDown = false;
          this.enableFormFields();
        }
       
        this.getAllOperatorTypes();
        this.commonComponent.stopSpinner();
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [];
          this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
        })

    }
    this.updateData();
  }
 
 /**
   * @implements add institution promoter method
   * @author yamuna.k
   */
  onRowAddInstitution() {
    this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
    this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
    this.EditDeleteDisable =  applicationConstants.TRUE;
    this.addButton = applicationConstants.TRUE;
    this.institutionPromoterPopUp = true;
    this.cancleButtonFlag = false;
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetails();
    this.institutionPromoterDetailsModel.uniqueId = this.institutionPromoter.length + 1
    this.promoterDetailsForm.reset();
    this.onChangeExistedPrmoter(false);
    this.admissionNumberDropDown = false;
    this.getAllOperatorTypes();
    this.updateData();
  }
/**
   * @implements image uploader
   * @param event ,fileUpload,filePathName
   * @param fileUpload 
   * @author yamuna.k
   */
  fileUploader(event: any, fileUploadPhoto: FileUpload, fileUploadSign: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if (this.isEdit && this.membershipBasicRequiredDetailsModel.filesDTOList == null || this.membershipBasicRequiredDetailsModel.filesDTOList == undefined) {
      this.membershipBasicRequiredDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    
   
    if (filePathName === "photoCopyPath") {
      this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = [];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail:applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB}];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
       }
       fileUploadPhoto.clear();
    }
    if (filePathName === "signatureCopyPath") {
      this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail:applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB}];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
       }
       fileUploadSign.clear();
    }
    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        this.multipleFilesList.push(files);
        let timeStamp = this.commonComponent.getTimeStamp();
        if (filePathName === "photoCopyPath") {
          this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy.push(files);
          this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
          this.membershipBasicRequiredDetailsModel.photoCopyPath = null;
          this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Member_Photo_Copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicRequiredDetailsModel.photoCopyPath = "Member_Photo_Copy" + "_" + timeStamp + "_" + file.name;
        }
        if (filePathName === "signatureCopyPath") {
          this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath.push(files);
          this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
          this.membershipBasicRequiredDetailsModel.signatureCopyPath = null;
          this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Member_Signature_Copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicRequiredDetailsModel.signatureCopyPath = "Member_Signature_Copy" + "_" + timeStamp + "_" + file.name;
        }
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }
 /**
   * @implements remove file 
   * @author yamuna.k
   */
  fileRemoveEvent(fileName: any) {
    if (this.membershipBasicRequiredDetailsModel.filesDTOList != null && this.membershipBasicRequiredDetailsModel.filesDTOList != undefined && this.membershipBasicRequiredDetailsModel.filesDTOList.length > 0) {
      if (fileName == "photoCopyPath") {
        this.saveButtonDisabled = false;
        let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.photoCopyPath);
        this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetailsModel.photoCopyPath = null;
      }
      if (fileName == "signatureCopyPath") {
        this.saveButtonDisabled = false;
        let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.signatureCopyPath);
        this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetailsModel.signatureCopyPath = null;
      }
      this.updateData();
    }
  }

   /**
   * @implements all dates coverstions
   * @author yamuna.k
   */
  dateConverstion() {
    if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
      if (this.memberGroupDetailsModel.admissionDateVal != null && this.memberGroupDetailsModel.admissionDateVal != undefined)
        this.memberGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(this.memberGroupDetailsModel.admissionDateVal);

      if (this.memberGroupDetailsModel.registrationDateVal != null && this.memberGroupDetailsModel.registrationDateVal != undefined)
        this.memberGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(this.memberGroupDetailsModel.registrationDateVal);


      this.admissionDateOnSelect();
    }
    if (this.membershipBasicRequiredDetailsModel != null && this.membershipBasicRequiredDetailsModel != undefined) {
      if (this.membershipBasicRequiredDetailsModel.admissionDateVal != null && this.membershipBasicRequiredDetailsModel.admissionDateVal != undefined)
        this.membershipBasicRequiredDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(this.membershipBasicRequiredDetailsModel.admissionDateVal);

      if (this.membershipBasicRequiredDetailsModel.dobVal != null && this.membershipBasicRequiredDetailsModel.dobVal != undefined)
        this.membershipBasicRequiredDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(this.membershipBasicRequiredDetailsModel.dobVal);

      if (this.membershipBasicRequiredDetailsModel.resolutionDateVal != null && this.membershipBasicRequiredDetailsModel.resolutionDateVal != undefined)
        this.membershipBasicRequiredDetailsModel.resolutionDate = this.commonFunctionsService.getUTCEpoch(this.membershipBasicRequiredDetailsModel.resolutionDateVal);
    }
    if (this.membershipInstitutionDetailsModel != null && this.membershipInstitutionDetailsModel != undefined) {
      if (this.membershipInstitutionDetailsModel.admissionDateVal != null && this.membershipInstitutionDetailsModel.admissionDateVal != undefined)
        this.membershipInstitutionDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(this.membershipInstitutionDetailsModel.admissionDateVal);

      if (this.membershipInstitutionDetailsModel.registrationDateVal != null && this.membershipInstitutionDetailsModel.registrationDateVal != undefined)
        this.membershipInstitutionDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(this.membershipInstitutionDetailsModel.registrationDateVal);
      this.institutiobnAdmissionDateOnSelect()
    }
   
    this.updateData();
  }

     /**
   * @implements gender name setting
   * @author yamuna.k
   */
  onChangeGender(event: any) {
    let filteredObj = this.genderList.find((data: any) => null != data && event != null && data.value == event);
    if (filteredObj != null && undefined != filteredObj)
      this.membershipBasicRequiredDetailsModel.genderName = filteredObj.label;
  }

  /**
   * @implements qualification name setting while onchanges qualification
   * @author yamuna.k
   */
  onChangeQualification(event: any) {
    let filteredObj = this.qualificationTypesList.find((data: any) => null != data && event != null && data.value == event);
    if (filteredObj != null && undefined != filteredObj)
      this.membershipBasicRequiredDetailsModel.qualificationName = filteredObj.label;
  }

   /**
   * @implements occupation name setting while onchanges occupation
   * @author yamuna.k
   */
  onChangeOccupation(event: any) {
    let filteredObj = this.occupationList.find((data: any) => null != data && event != null && data.value == event);
    if (filteredObj != null && undefined != filteredObj)
      this.membershipBasicRequiredDetailsModel.occupationName = filteredObj.label;
  }

     /**
   * @implements Caste name setting while onchanges Caste
   * @author yamuna.k
   */
  onChangeCaste(event: any) {
    let filteredObj = this.groupedCasteSubCaste.find((data: any) => null != data && event != null && data.value == event);
    if (filteredObj != null && undefined != filteredObj)
      this.membershipBasicRequiredDetailsModel.casteName = filteredObj.label;
  }

      /**
   * @implements Rlation name setting while onchanges Rlation
   * @author yamuna.k
   */
  onChangeRlationWithMember(event: any) {
    let filteredObj = this.relationshipTypeList.find((data: any) => null != data && event != null && data.value == event);
    if (filteredObj != null && undefined != filteredObj)
      this.membershipBasicRequiredDetailsModel.relationTypeName = filteredObj.label;
  }

      /**
   * @implements community name setting while onchanges community
   * @author yamuna.k
   */
  onChangeCommunity(event: any) {
    let filteredObj = this.communityList.find((data: any) => null != data && event != null && data.value == event);
    if (filteredObj != null && undefined != filteredObj)
      this.membershipBasicRequiredDetailsModel.communityName = filteredObj.label;
  }

      /**
   * @implements age calculation
   * @author yamuna.k
   */
  calculateAge(dateOfBirth: Date): number {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * @implements Method to calculate date of birth from age
   * @author k.yamuna
   */
  calculateDobFromAge(age: number): Date {
    if (isNaN(age) || age <= 0) {
      return new Date(0);
    }
    const today = new Date();
    const birthYear = today.getFullYear() - age;
    const dob = new Date(birthYear, today.getMonth(), today.getDate());
    return dob;
}

  onChangeCommunityChange() {
    let community = this.communityList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.communityId != null && data.value == this.membershipBasicRequiredDetailsModel.communityId);
    if (community != null && undefined != community)
      this.membershipBasicRequiredDetailsModel.communityName = community.label;
  }

  onChangeCasteChange() {
    let caste = this.tempSubCasteList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.casteId != null && data.value == this.membershipBasicRequiredDetailsModel.casteId);
    if (caste != null && undefined != caste)
      this.membershipBasicRequiredDetailsModel.casteName = caste.label;
  }

   /**
   * @implements get all relationship types list from masters
   * @author yamuna.k
   */
  getAllRelationshipType() {
    this.commonComponent.startSpinner();
    this.relationshipTypeService.getAllRelationshipType().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.relationshipTypeList = this.responseModel.data;
        if (this.relationshipTypeList == null || (this.relationshipTypeList != null && this.relationshipTypeList.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'warn', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.relationshipTypeList = this.relationshipTypeList.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

     /**
   * @implements get all Grouped Qualification And SubQualification
   * @author yamuna.k
   */
  getAllGroupedQualificationAndSubQualification() {
    this.qualificationService.getAllQualificationSubQualification().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.CASTE_SUBCASTE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.tempSubQualificationList = [];
        this.groupedQualificationSubQualification = this.responseModel.data.filter((caste: any) => caste.status == applicationConstants.TRUE).map((count: any) => {
          this.subQualificationList = [];
          count.subQualificationList.filter((subCaste: any) => subCaste.status == applicationConstants.TRUE).map((subCount: any) => {
            this.subQualificationList.push({ label: subCount.name, value: subCount.id })
            this.tempSubQualificationList.push({ label: subCount.name, value: subCount.id })
          });
          return {
            label: count.name, value: count.id, items: this.subQualificationList
          }
        });
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

    /**
   * @implements get all OccupationTypes
   * @author yamuna.k
   */
  getOccupationTypes() {
    this.commonComponent.startSpinner();
    this.occupationTypesService.getAllOccupationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.occupationList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

  /**
   * @implements get all SubProducts
   * @author yamuna.k
   */
  getAllSubProducts() {
    this.commonComponent.startSpinner();
    this.membershipBasicDetailsService.getAllSubProduct().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.subProductList = this.responseModel.data;
        if (this.subProductList == null || (this.subProductList != null && this.subProductList.length == 0)) {
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.SUB_PRODUCTS_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.subProductList = this.subProductList.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE
        && customertype.isAclass != applicationConstants.TRUE).map((count: any) => {
          return { label: count.name, value: count.id }
        });

        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

   /**
   * @implements get all caste and sunCaste
   * @author yamuna.k
   */
  getAllGroupedCasteAndSubCaste() {
    this.casteService.getAllCasteSubCaste().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.CASTE_SUBCASTE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.tempSubCasteList = [];
        this.groupedCasteSubCaste = this.responseModel.data.filter((caste: any) => caste.status == applicationConstants.TRUE).map((count: any) => {
          this.subCasteList = [];
          count.subCastesList.filter((subCaste: any) => subCaste.status == applicationConstants.TRUE).map((subCount: any) => {
            this.subCasteList.push({ label: subCount.name, value: subCount.id })
            this.tempSubCasteList.push({ label: subCount.name, value: subCount.id })
          });
          return {
            label: count.name, value: count.id, items: this.subCasteList
          }
        });
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

  onChangeOccupationChange() {
    let occupation = this.occupationList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.occupationId != null && data.value == this.membershipBasicRequiredDetailsModel.occupationId);
    if (occupation != null && undefined != occupation)
      this.membershipBasicRequiredDetailsModel.occupationName = occupation.label;
  }

  onChangeQualificationChange() {
    let qualification = this.tempSubQualificationList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.qualificationId != null && data.value == this.membershipBasicRequiredDetailsModel.qualificationId);
    if (qualification != null && undefined != qualification)
      this.membershipBasicRequiredDetailsModel.qualificationName = qualification.label;
  }

  onChangeRelationTypeChange() {
    let relationshiptype = this.relationshipTypeList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.relationId != null && data.value == this.membershipBasicRequiredDetailsModel.relationId);
    if (relationshiptype != null && undefined != relationshiptype)
      this.membershipBasicRequiredDetailsModel.relationTypeName = relationshiptype.label;
  }

     /**
   * @implements dates Validation Check Age And Dob
   * @author yamuna.k
   */
  datesValidationCheckAgeAndDob(model: any, type: number): void {
    if (type === 2) {
      if (model.dobVal) {
        const calculatedAge = this.calculateAge(model.dobVal);
        model.age = calculatedAge;
        if (model.age != null && model.age <= 0) {
          this.memberCreationForm.get('age')?.reset();
          this.memberCreationForm.get('dob')?.reset();
          this.msgs = [{ severity: 'warning', detail:applicationConstants.AGE_SHOULD_NOT_BE_ZERO_OR_NEGATIVE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
  
        }
      }
    } else if (type === 1) {
      if (model.age && model.age > 0) {
        const calculatedDob = this.calculateDobFromAge(model.age);
        model.dobVal = calculatedDob;
        this.membershipBasicRequiredDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(model.dobVal));
      } else if (model.age != null && model.age <= 0) {
        this.memberCreationForm.get('age')?.reset();
        this.memberCreationForm.get('dob')?.reset();
        this.msgs = [{ severity: 'warning', detail:applicationConstants.AGE_SHOULD_NOT_BE_ZERO_OR_NEGATIVE }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);

      }
    }
  }

  admissionDateCheck(model: any, type: number): void {
    if (type === 1) {
      if (model.admissionDateVal) {
        // const calculatedAge = this.calculateAge(model.dobVal);
        this.membershipBasicRequiredDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(model.admissionDateVal));
      }
    }else if(type == 2){
      if (model.resolutionDateVal) {
        // const calculatedAge = this.calculateAge(model.dobVal);
        this.membershipBasicRequiredDetailsModel.resolutionDate = this.commonFunctionsService.getUTCEpoch(new Date(model.resolutionDateVal));
      }
    }
  }

  onChangeProduct() {
    let subProduct = this.subProductList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.subProductId != null && data.value == this.membershipBasicRequiredDetailsModel.subProductId);
    if (subProduct != null && undefined != subProduct) {
      this.membershipBasicRequiredDetailsModel.subProductName = subProduct.label;
    }
    if (this.membershipBasicRequiredDetailsModel.subProductId == 1) {
      this.show = true
    }
    else {
      this.show = false
    }
  }
      /**
   * @implements save and update application details
   * @author yamuna.k
   */
  submitGropOrInstitution() {
    this.siLoanApplicationModel.pacsId = this.pacsId;
    this.siLoanApplicationModel.branchId = this.branchId;
    this.memberTypeId = this.siLoanApplicationModel.memberTypeId;
    this.addButton = false;

    if (this.siLoanApplicationModel.applicationDateVal != null && this.siLoanApplicationModel.applicationDateVal != undefined)
      this.siLoanApplicationModel.applicationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.applicationDateVal));

    if (this.siLoanApplicationModel.sanctionDateVal != null && this.siLoanApplicationModel.sanctionDateVal != undefined)
      this.siLoanApplicationModel.sanctionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.sanctionDateVal));

    if (this.siLoanApplicationModel.loanDueDateVal != null && this.siLoanApplicationModel.loanDueDateVal != undefined)
      this.siLoanApplicationModel.loanDueDate = this.commonFunctionsService.getUTCEpoch(new Date(this.siLoanApplicationModel.loanDueDateVal));



    if (this.siLoanApplicationModel.id != null && this.siLoanApplicationModel.id != undefined) {
      this.siLoanApplicationService.updateSILoanApplication(this.siLoanApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null) {
              this.loanAccId = this.responseModel.data[0].id;
              this.groupOrInstitutionDisable = true;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                this.accountNumber = this.responseModel.data[0].accountNumber;
              }
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
            }
          }
          this.getSILoanApplicationById(this.loanAccId);

          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);

        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    } else {
      this.siLoanApplicationModel.statusName = CommonStatusData.IN_PROGRESS;
      this.siLoanApplicationModel.accountStatusName = CommonStatusData.IN_PROGRESS;

      if (this.siLoanApplicationModel.siLoanInsuranceDetailsDTO != undefined && this.siLoanApplicationModel.siLoanInsuranceDetailsDTO != null)
        this.siLoanApplicationModel.siLoanInsuranceDetailsDTO.statusName = CommonStatusData.IN_PROGRESS;

      if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
        this.siLoanApplicationModel.individualMemberDetailsDTO.memStatusName = CommonStatusData.IN_PROGRESS;
        if (this.siLoanApplicationModel.individualMemberDetailsDTO != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO != null) {
          if (this.siLoanApplicationModel.individualMemberDetailsDTO.age != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO.age != null) {
            this.age = this.siLoanApplicationModel.individualMemberDetailsDTO.age;
            if (this.siLoanApplicationModel.individualMemberDetailsDTO.age <= 18)
              this.siLoanApplicationModel.individualMemberDetailsDTO.isMinor = applicationConstants.TRUE;
            else
              this.siLoanApplicationModel.individualMemberDetailsDTO.isMinor = applicationConstants.FALSE;
          }
          if (this.siLoanApplicationModel.individualMemberDetailsDTO.id != undefined && this.siLoanApplicationModel.individualMemberDetailsDTO.id != null)
            this.siLoanApplicationModel.individualMemberDetailsDTO.id = null;

          if (this.siLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList != null && this.siLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList != undefined) {
            for (let kyc of this.siLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList) {
              kyc.id = null;
            }
            this.siLoanApplicationModel.siLoanKycDetailsDTOList = this.siLoanApplicationModel.individualMemberDetailsDTO.memberShipKycDetailsDTOList;
          }
        }
      } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
        this.siLoanApplicationModel.memberGroupDetailsDTO.groupStatusName = CommonStatusData.IN_PROGRESS;
        this.siLoanApplicationModel.memberGroupDetailsDTO = this.memberGroupDetailsModel;
        if (this.siLoanApplicationModel.memberGroupDetailsDTO != undefined && this.siLoanApplicationModel.memberGroupDetailsDTO != null) {
          if (this.siLoanApplicationModel.memberGroupDetailsDTO.age != undefined && this.siLoanApplicationModel.memberGroupDetailsDTO.age != null)
            this.siLoanApplicationModel.memberGroupDetailsDTO.id = null;

          if (this.siLoanApplicationModel.memberGroupDetailsDTO.groupKycList != null && this.siLoanApplicationModel.memberGroupDetailsDTO.groupKycList != undefined) {
            for (let kyc of this.siLoanApplicationModel.memberGroupDetailsDTO.groupKycList) {
              kyc.id = null;
            }
            this.siLoanApplicationModel.siLoanKycDetailsDTOList = this.siLoanApplicationModel.memberGroupDetailsDTO.groupKycList;
          }
          let operator = this.operatorTypeList.find((data: any) => null != data && this.memberGroupDetailsModel.operatorTypeId != null && data.value == this.memberGroupDetailsModel.operatorTypeId);
          if (operator != null && undefined != operator)
          this.memberGroupDetailsModel.operatorTypeName = operator.label;
        }
      } else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
        this.siLoanApplicationModel.memberInstitutionDTO.institutionStatusName = CommonStatusData.IN_PROGRESS;
        if (this.siLoanApplicationModel.memberInstitutionDTO != undefined && this.siLoanApplicationModel.memberInstitutionDTO != null) {
          if (this.siLoanApplicationModel.memberInstitutionDTO.age != undefined && this.siLoanApplicationModel.memberInstitutionDTO.age != null)
            this.siLoanApplicationModel.memberInstitutionDTO.id = null;

          if (this.siLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList != null && this.siLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList != undefined) {
            for (let kyc of this.siLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList) {
              kyc.id = null;
            }
            this.siLoanApplicationModel.siLoanKycDetailsDTOList = this.siLoanApplicationModel.memberInstitutionDTO.institutionKycDetailsDTOList;
          }
        }
      }
      this.siLoanApplicationService.addSILoanApplication(this.siLoanApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        this.siLoanApplicationModel = this.responseModel.data[0];
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.isEdit = true;
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != undefined && this.responseModel.data[0] != null) {
            this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.responseModel.data[0].id != undefined && this.responseModel.data[0].id != null)
              this.loanAccId = this.responseModel.data[0].id;
            this.groupOrInstitutionDisable = true;
            if (this.responseModel.data[0].operationTypeName != undefined && this.responseModel.data[0].operationTypeName != null)
              this.operationTypeName = this.responseModel.data[0].operationTypeName;
            if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
              this.accountNumber = this.responseModel.data[0].accountNumber;
            }
            if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNo;
            }
          }
          // this.getGroupByAdmissionNumber(this.admissionNumber);
          // this.getInstitutionByAdmissionNumber(this.admissionNumber)
          this.getSILoanApplicationById(this.loanAccId);

          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }
  /**
   * @implements add group promoter
   * @author yamuna.k
   */
  onRowAddSave() {
    // this.promoterDetailsForm.get("photoUpload").reset();
    // this.promoterDetailsForm.get("signatureUpload").reset();
    this.EditDeleteDisable =  applicationConstants.TRUE;
    this.addButton = applicationConstants.TRUE;
    this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
    this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
    this.groupPromoters = true;
    this.cancleButtonFlag = false;
    this.promoterDetailsModel = new GroupPromoterDetails();
    this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
    this.promoterDetailsForm.reset();
    this.onChangeExistedPrmoter(false);
    this.admissionNumberDropDown = false;
    this.getAllOperatorTypes();
    this.updateData();

  }
    /**
   * @implements existed members from individul for promoter
   * @author yamuna.k
   */
  onChangeExistedPrmoter(isExistingMember: any) {
  //  if(flag){
  //       this.resetFields();
        // this.promoterDetailsModel = new promoterDetailsModel();
        // this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  //     }
    if (isExistingMember) {
      this.resetFields();
      this.admissionNumberDropDown = true;
      this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
     
    }
    else {
      this.resetFields();
      this.admissionNumberDropDown = false;
      // this.promoterDetailsForm.get('admissionNumber').reset();
      this.enableFormFields();
    }
  }
    /**
   * @implements all members data from member module
   * @author yamuna.k
   */
  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.admissionNumbersList = [];
    this.membershipBasicDetailsService.getAllGridList(pacsId, branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.allTypesOfmembershipList = this.responseModel.data;
            this.admissionNumbersList = this.allTypesOfmembershipList.filter((obj: any) => (obj != null) && obj.memberTypeName == MemberShipTypesData.INDIVIDUAL && obj.statusName == CommonStatusData.APPROVED)
              .map((relationType: any) => {
                return relationType.admissionNumber;
              });
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
    });
  }
  /**
* @implements reset feilds 
* @author k.yamuna
*/
  resetFields() {
    this.promoterDetailsForm.get('surname').reset();
    this.promoterDetailsForm.get('name').reset();
    // this.promoterDetailsForm.get('operatorTypeId').reset();
    this.promoterDetailsForm.get('dob').reset();
    this.promoterDetailsForm.get('age').reset();
    this.promoterDetailsForm.get('genderId').reset();
    this.promoterDetailsForm.get('martialId').reset();
    this.promoterDetailsForm.get('mobileNumber').reset();
    this.promoterDetailsForm.get('aadharNumber').reset();
    this.promoterDetailsForm.get('emailId').reset();
    this.promoterDetailsForm.get('startDate').reset();
    this.promoterDetailsForm.get('authorizedSignatory').reset();
    this.promoterDetailsForm.get('isPoc').reset();
    this.promoterDetailsForm.get('endDate').reset();
    // this.promoterDetailsModel = new promoterDetailsModel();
    // this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
    this.promoterDetailsModel.multipartFileListForPhotoCopyPath =[];
    this.promoterDetailsModel.multipartFileListForsignatureCopyPath =[];

    this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath =[];
    this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath =[];

    this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
    this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
    
  }
    /**
   * @implements disable all fields
   * @author yamuna.k
   */
  disableFormFields() {
    const fieldsToDisable = [
      'surname', 'name', 'dob', 'age', 'genderId', 'martialId',
      'mobileNumber', 'aadharNumber', 'emailId', 'startDate'
    ];
    fieldsToDisable.forEach(field => this.promoterDetailsForm.get(field)?.disable());
  }
    /**
   * @implements enable all fields
   * @author yamuna.k
   */
  enableFormFields() {
    const fieldsToEnable = [
      'surname', 'name', 'dob', 'age', 'genderId',
      'martialId', 'mobileNumber', 'aadharNumber', 'emailId', 'startDate'
    ];
    fieldsToEnable.forEach(field => this.promoterDetailsForm.get(field)?.enable());
  }

    /**
   * @implements getMemberDetailsByAdmissionNumber
   * @author yamuna.k
   */
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
            
          if (this.membershipBasicRequiredDetailsModel != null && this.membershipBasicRequiredDetailsModel != undefined) {
            this.promoterDetailsModel.name = this.membershipBasicRequiredDetailsModel.name,
              this.promoterDetailsModel.surname = this.membershipBasicRequiredDetailsModel.surname;
            this.promoterDetailsModel.aadharNumber = this.membershipBasicRequiredDetailsModel.aadharNumber;
            this.promoterDetailsModel.dob = this.membershipBasicRequiredDetailsModel.dob;
            if (this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
              this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
            this.promoterDetailsModel.age = this.membershipBasicRequiredDetailsModel.age;
            this.promoterDetailsModel.genderId = this.membershipBasicRequiredDetailsModel.genderId;
            this.promoterDetailsModel.martialId = this.membershipBasicRequiredDetailsModel.martialId;
            this.promoterDetailsModel.mobileNumber = this.membershipBasicRequiredDetailsModel.mobileNumber;
            this.promoterDetailsModel.emailId = this.membershipBasicRequiredDetailsModel.emailId;
            this.promoterDetailsModel.startDate = this.membershipBasicRequiredDetailsModel.admissionDate;
            if (this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
              this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);

            if (this.promoterDetailsModel.endDate != null && this.promoterDetailsModel.endDate != undefined)
              this.promoterDetailsModel.endDateVal = this.datePipe.transform(this.promoterDetailsModel.endDate, this.orgnizationSetting.datePipe);

           
            this.promoterDetailsModel.uploadImage = this.membershipBasicRequiredDetailsModel.photoCopyPath;
            this.promoterDetailsModel.uploadSignature = this.membershipBasicRequiredDetailsModel.signatureCopyPath;

          
            if (this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined) {
              this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);
              this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
            }
            if (this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined) {
              this.promoterDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature);
              this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
            }
            this.disableFormFields();
            this.duplicateForPromoter(this.promoterDetailsModel);
           
          }
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
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
   * @implements getMemberDetailsByAdmissionNumber for institution promoter while select existed member
   * @author yamuna.k
   */
  getMemberDetailsByAdmissionNUmberForInstitutionPromoter(admissionNumber: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
            
          if (this.membershipBasicRequiredDetailsModel != null && this.membershipBasicRequiredDetailsModel != undefined) {
            this.institutionPromoterDetailsModel.name = this.membershipBasicRequiredDetailsModel.name,
              this.institutionPromoterDetailsModel.surname = this.membershipBasicRequiredDetailsModel.surname;
            this.institutionPromoterDetailsModel.aadharNumber = this.membershipBasicRequiredDetailsModel.aadharNumber;
            this.institutionPromoterDetailsModel.dob = this.membershipBasicRequiredDetailsModel.dob;
            if (this.institutionPromoterDetailsModel.dob != null && this.institutionPromoterDetailsModel.dob != undefined)
              this.institutionPromoterDetailsModel.memDobVal = this.datePipe.transform(this.institutionPromoterDetailsModel.dob, this.orgnizationSetting.datePipe);
            this.institutionPromoterDetailsModel.age = this.membershipBasicRequiredDetailsModel.age;
            this.institutionPromoterDetailsModel.genderId = this.membershipBasicRequiredDetailsModel.genderId;
            this.institutionPromoterDetailsModel.martialId = this.membershipBasicRequiredDetailsModel.martialId;
            this.institutionPromoterDetailsModel.mobileNumber = this.membershipBasicRequiredDetailsModel.mobileNumber;
            this.institutionPromoterDetailsModel.emailId = this.membershipBasicRequiredDetailsModel.emailId;
            this.institutionPromoterDetailsModel.startDate = this.membershipBasicRequiredDetailsModel.admissionDate;
            if (this.institutionPromoterDetailsModel.startDate != null && this.institutionPromoterDetailsModel.startDate != undefined)
              this.institutionPromoterDetailsModel.startDateVal = this.datePipe.transform(this.institutionPromoterDetailsModel.startDate, this.orgnizationSetting.datePipe);

            if (this.institutionPromoterDetailsModel.endDate != null && this.institutionPromoterDetailsModel.endDate != undefined)
              this.institutionPromoterDetailsModel.endDateVal = this.datePipe.transform(this.institutionPromoterDetailsModel.endDate, this.orgnizationSetting.datePipe);

            this.institutionPromoterDetailsModel.uploadImage = this.membershipBasicRequiredDetailsModel.photoCopyPath;
            this.institutionPromoterDetailsModel.uploadSignature = this.membershipBasicRequiredDetailsModel.signatureCopyPath;

            if (this.institutionPromoterDetailsModel.uploadImage != null && this.institutionPromoterDetailsModel.uploadImage != undefined) {
              this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage);
              this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
            }
            if (this.institutionPromoterDetailsModel.uploadSignature != null && this.institutionPromoterDetailsModel.uploadSignature != undefined) {
              this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature);
              this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
            }
            
            this.duplicateInsitutionForPromoter(this.institutionPromoterDetailsModel)
            this.disableFormFields();
            // this.promoterDetailsForm.get('admissionNumber').setValidators(Validators.compose([Validators.required]));
          }
        }
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
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
   * @implements save group promoter
   * @author yamuna.k
   */
  saveGropPromotersDetails(promoterDetailsModel: any) {
    this.groupPromoters = false;
    this.promoterDetailsModel.pacsId = 1;
    // rowData.groupId = this.memberGroupDetailsModel.id;
    this.promoterDetailsModel.groupId = this.memberGroupDetailsModel.id;
    this.groupId = this.promoterDetailsModel.groupId;
    this.addButton = false;
    this.EditDeleteDisable = false;
    promoterDetailsModel.pacsId = 1;
    this.EditDeleteDisable = false;
    this.promoterDetailsModel.status = applicationConstants.ACTIVE;
    if (promoterDetailsModel.memDobVal != null && promoterDetailsModel.memDobVal != undefined) {
      promoterDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(promoterDetailsModel.memDobVal));
    }
    if (promoterDetailsModel.startDateVal != null && promoterDetailsModel.startDateVal != undefined) {
      promoterDetailsModel.startDate = this.commonFunctionsService.getUTCEpoch(new Date(promoterDetailsModel.startDateVal));
    }

    if (promoterDetailsModel.endDateVal != null && promoterDetailsModel.endDateVal != undefined) {
      promoterDetailsModel.endDate = this.commonFunctionsService.getUTCEpoch(new Date(promoterDetailsModel.endDateVal));
    }
    if (promoterDetailsModel.authorizedSignatory != null && promoterDetailsModel.authorizedSignatory != undefined && promoterDetailsModel.authorizedSignatory) {
      promoterDetailsModel.authorizedSignatoryName = applicationConstants.YES;
    }
    else {
      promoterDetailsModel.authorizedSignatoryName = applicationConstants.NO;
    }
    if (!this.memberGroupDetailsModel.groupPromotersDTOList) {
      this.memberGroupDetailsModel.groupPromotersDTOList = []; // Initialize it as an empty array
    }
    let Object = this.operatorTypeList.find((obj: any) => obj.value == promoterDetailsModel.operatorTypeId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      promoterDetailsModel.operatorTypeName = Object.label;
    }
    Object = this.genderList.find((obj: any) => obj.value == promoterDetailsModel.genderId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      promoterDetailsModel.genderName = Object.label;
    }
    Object = this.maritalStatusList.find((obj: any) => obj.value == promoterDetailsModel.martialId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      promoterDetailsModel.maritalStatusName = Object.label;
    }
    if (this.promoterDetailsModel.id != null && this.promoterDetailsModel.id != undefined) {
      this.groupPromotersService.updateGroupPromoters(this.promoterDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);

        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        // this.getSILoanApplicationById(this.loanAccId);
        this.getAllPromotersByGroupId();
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.groupPromotersService.addGroupPromoters(this.promoterDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);

        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        this.getAllPromotersByGroupId();
        // this.getSILoanApplicationById(this.loanAccId);

        this.groupPromoters = false;
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }
  /**
   * @implements save institution promoter
   * @author yamuna.k
   */
  saveInstitutionPromotersDetails(institutionPromoterDetailsModel: any) {
    this.institutionPromoterPopUp = false;
    institutionPromoterDetailsModel.pacsId = 1;
    // rowData.groupId = this.memberGroupDetailsModel.id;
    institutionPromoterDetailsModel.institutionId = this.membershipInstitutionDetailsModel.id;
    this.institutionId = institutionPromoterDetailsModel.institutionId;
    this.addButton = false;
    this.EditDeleteDisable = false;
    institutionPromoterDetailsModel.pacsId = 1;
    this.EditDeleteDisable = false;
    this.institutionPromoterDetailsModel.status = applicationConstants.ACTIVE;
    if (institutionPromoterDetailsModel.memDobVal != null && institutionPromoterDetailsModel.memDobVal != undefined) {
      institutionPromoterDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(institutionPromoterDetailsModel.memDobVal));
    }
    if (institutionPromoterDetailsModel.dob != null && institutionPromoterDetailsModel.dob != undefined) {
      institutionPromoterDetailsModel.memDobVal = this.datePipe.transform(institutionPromoterDetailsModel.dob, this.orgnizationSetting.datePipe);
    }
    if (institutionPromoterDetailsModel.startDateVal != null && institutionPromoterDetailsModel.startDateVal != undefined) {
      institutionPromoterDetailsModel.startDate = this.commonFunctionsService.getUTCEpoch(new Date(institutionPromoterDetailsModel.startDateVal));
    }

    if (institutionPromoterDetailsModel.endDateVal != null && institutionPromoterDetailsModel.endDateVal != undefined) {
      institutionPromoterDetailsModel.endDate = this.commonFunctionsService.getUTCEpoch(new Date(institutionPromoterDetailsModel.endDateVal));
    }
    if (institutionPromoterDetailsModel.authorizedSignatory != null && institutionPromoterDetailsModel.authorizedSignatory != undefined && institutionPromoterDetailsModel.authorizedSignatory) {
      institutionPromoterDetailsModel.authorizedSignatoryName = applicationConstants.YES;
    }
    else {
      institutionPromoterDetailsModel.authorizedSignatoryName = applicationConstants.NO;
    }
    if (institutionPromoterDetailsModel.startDate != null && institutionPromoterDetailsModel.startDate != undefined) {
      institutionPromoterDetailsModel.startDateVal = this.datePipe.transform(institutionPromoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
    }

    if (institutionPromoterDetailsModel.endDate != null && institutionPromoterDetailsModel.endDate != undefined) {
      institutionPromoterDetailsModel.endDateVal = this.datePipe.transform(institutionPromoterDetailsModel.endDate, this.orgnizationSetting.datePipe);
    }
    let Object = this.operatorTypeList.find((obj: any) => obj.value == institutionPromoterDetailsModel.operatorTypeId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      institutionPromoterDetailsModel.operatorTypeName = Object.label;
    }
    Object = this.genderList.find((obj: any) => obj.value == institutionPromoterDetailsModel.genderId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      institutionPromoterDetailsModel.genderName = Object.label;
    }
    Object = this.maritalStatusList.find((obj: any) => obj.value == institutionPromoterDetailsModel.martialId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      institutionPromoterDetailsModel.maritalStatusName = Object.label;
    }
    if (institutionPromoterDetailsModel.id != null && institutionPromoterDetailsModel.id != undefined) {
      this.groupPromotersService.updateInstitutionPromoters(institutionPromoterDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);

        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        // this.getSILoanApplicationById(this.loanAccId);
        this.getAllPromotersByInstitutionId();
        // this.groupPromoters = false;
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      this.groupPromotersService.addInstitutionPromoters(institutionPromoterDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);

        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        this.getAllPromotersByInstitutionId();
        // this.getSILoanApplicationById(this.loanAccId);

        // this.groupPromoters = false;
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
  }
    /**
   * @implements get all promoters by group id
   * @author yamuna.k
   */
  getAllPromotersByGroupId() {
    this.commonComponent.startSpinner();
    this.groupPromotersService.getGroupPromoterDetailsByGroupId(this.groupId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.promoterDetails = this.responseModel.data;
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
          if (groupPromoters.endDate != null && groupPromoters.endDate != undefined) {
            groupPromoters.endDateVal = this.datePipe.transform(groupPromoters.endDate, this.orgnizationSetting.datePipe);
          }
          if (groupPromoters.genderId != null && groupPromoters.genderId != undefined) {
            let Obj = this.genderList.filter(obj => obj.value == groupPromoters.genderId);
            if (Obj != null && Obj != undefined) {
              groupPromoters.genderName = Obj[0].label;
            }
          }
          let Object = this.operatorTypeList.find((obj: any) => obj.value == groupPromoters.operatorTypeId);
          if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
            groupPromoters.operatorTypeName = Object.label;
          }
          if (groupPromoters.authorizedSignatory != null && groupPromoters.authorizedSignatory != undefined && groupPromoters.authorizedSignatory) {
            groupPromoters.authorizedSignatoryName = applicationConstants.YES;
          }
          else {
            groupPromoters.authorizedSignatoryName = applicationConstants.YES;
          }
        }
        this.updateData();
        this.commonComponent.stopSpinner();
      } else {
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
    /**
   * @implements get all promoters by institution id
   * @author yamuna.k
   */
  getAllPromotersByInstitutionId() {
    this.commonComponent.startSpinner();
    this.groupPromotersService.getInstitutionPromoterDetailsByInstitutionId(this.institutionId, this.pacsId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.institutionPromoter = this.responseModel.data;
        let i = 0;
        for (let groupPromoters of this.institutionPromoter) {
          i = i + 1;
          groupPromoters.uniqueId = i;
          if (groupPromoters.dob != null && groupPromoters.dob != undefined) {
            groupPromoters.memDobVal = this.datePipe.transform(groupPromoters.dob, this.orgnizationSetting.datePipe);
          }
          if (groupPromoters.startDate != null && groupPromoters.startDate != undefined) {
            groupPromoters.startDateVal = this.datePipe.transform(groupPromoters.startDate, this.orgnizationSetting.datePipe);
          }
          if (groupPromoters.endDate != null && groupPromoters.endDate != undefined) {
            groupPromoters.endDateVal = this.datePipe.transform(groupPromoters.endDate, this.orgnizationSetting.datePipe);
          }
          if (groupPromoters.genderId != null && groupPromoters.genderId != undefined) {
            let Obj = this.genderList.filter(obj => obj.value == groupPromoters.genderId);
            if (Obj != null && Obj != undefined) {
              groupPromoters.genderName = Obj[0].label;
            }
          }
          let Object = this.operatorTypeList.find((obj: any) => obj.value == groupPromoters.operatorTypeId);
          if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
            groupPromoters.operatorTypeName = Object.label;
          }
          if (groupPromoters.authorizedSignatory != null && groupPromoters.authorizedSignatory != undefined && groupPromoters.authorizedSignatory) {
            groupPromoters.authorizedSignatoryName = applicationConstants.YES;
          }
          else {
            groupPromoters.authorizedSignatoryName = applicationConstants.YES;
          }
        }
        this.updateData();
        this.commonComponent.stopSpinner();
      } else {
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
  
  /**
        * @implements fileUpload for promoter in group
        * @param event 
        * @param fileUpload 
        * @param filePathName 
        */
  fileUploaderForPromoters(event: any, fileUploadPhoto: FileUpload,fileUploadSign: FileUpload, filePathName: any) {
    this.multipleFilesList = [];
    if (this.isEdit && this.promoterDetailsModel.filesDTOList == null || this.promoterDetailsModel.filesDTOList == undefined) {
      this.promoterDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "groupPromoterImage") {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath =[];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB}];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      fileUploadPhoto.clear();
    }
    if (filePathName === "groupPromoterSignature") {
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.promoterDetailsModel.multipartFileListForsignatureCopyPath =[];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB}];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      
      fileUploadSign.clear();
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let timeStamp = this.commonComponent.getTimeStamp();
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        this.multipleFilesList.push(files);

        if (filePathName === "groupPromoterImage") {
          this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
          this.promoterDetailsModel.filesDTOList.push(files);
          this.promoterDetailsModel.uploadImage = null;
          this.promoterDetailsModel.multipartFileListForPhotoCopyPath.push(files);
          this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.promoterDetailsModel.uploadImage = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "groupPromoterSignature") {
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE
          this.promoterDetailsModel.multipartFileListForsignatureCopyPath.push(files);
          this.promoterDetailsModel.filesDTOList.push(files);
          this.promoterDetailsModel.uploadSignature = null;
          this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.promoterDetailsModel.uploadSignature = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
       
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }
  
     /**
   * @implements cancle promoter
   * @author yamuna.k
   */
  cancelPromoter() {
    this.addButton = false;
    this.groupPromoters = false;
    this.EditDeleteDisable = false;
    this.promoterDetails;
    this.updateData();
  }


     /**
   * @implements file upload for institution promoter
   * @author yamuna.k
   */
  fileUploaderForInstitutionPromoters(event: any, fileUploadPhotos: FileUpload,fileUploadSigna: FileUpload, filePathName: any) {
    this.multipleFilesList = [];
    if (this.isEdit && this.institutionPromoterDetailsModel.filesDTOList == null || this.institutionPromoterDetailsModel.filesDTOList == undefined) {
      this.institutionPromoterDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "institutionPromoterImage") {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath =[];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB}];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      fileUploadPhotos.clear();
    }
    if (filePathName === "insitutionPromoterSignature") {
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath =[];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB}];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      fileUploadSigna.clear();
    }
    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let timeStamp = this.commonComponent.getTimeStamp();
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        this.multipleFilesList.push(files);

        if (filePathName === "institutionPromoterImage") {
          this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
          this.institutionPromoterDetailsModel.filesDTOList.push(files);
          this.institutionPromoterDetailsModel.uploadImage = null;
          this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath.push(files);
          this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.institutionPromoterDetailsModel.uploadImage = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "insitutionPromoterSignature") {
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE
          this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath.push(files);
          this.institutionPromoterDetailsModel.filesDTOList.push(files);
          this.institutionPromoterDetailsModel.uploadSignature = null;
          this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.institutionPromoterDetailsModel.uploadSignature = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
       
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }
  /**
   * @implements cancle institution promoter
   * @author yamuna.k
   */
  cancelInstitutionPromoter() {
    this.addButton = false;
    this.EditDeleteDisable = false;
    this.institutionPromoterPopUp = false;
    this.institutionPromoter;
    this.updateData();
  }

    /**
   * @implements admission date check while on select
   * @author yamuna.k
   */
  admissionDateOnSelect(){
    if(this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined){
    if(this.memberGroupDetailsModel.admissionDateVal != undefined && this.memberGroupDetailsModel.registrationDateVal != undefined){
      if(this.memberGroupDetailsModel.admissionDateVal < this.memberGroupDetailsModel.registrationDateVal){
        this.groupForm.get('registrationDate')?.reset();
        this.groupForm.get('admissionDate')?.reset();
        this.groupForm.updateValueAndValidity();
        this.msgs = [{ severity: 'warning', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
        setTimeout(() => {
          this.msgs = [];        
        }, 2000);
      }
    }
    }

  }

     /**
   * @implements registrationDate date check while on select
   * @author yamuna.k
   */
  institutiobnAdmissionDateOnSelect(){
    if(this.membershipInstitutionDetailsModel != null && this.membershipInstitutionDetailsModel != undefined){
    if(this.membershipInstitutionDetailsModel.admissionDateVal != undefined && this.membershipInstitutionDetailsModel.registrationDateVal != undefined){
      if(this.membershipInstitutionDetailsModel.admissionDateVal < this.membershipInstitutionDetailsModel.registrationDateVal){
        this.institutionForm.get('registrationDate')?.reset();
        this.institutionForm.get('admissionDate')?.reset();
        this.institutionForm.updateValueAndValidity();
        this.msgs = [{ severity: 'warning', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
        setTimeout(() => {
          this.msgs = [];        
        }, 2000);
      }
    }
    }

  }

      /**
   * @implements duplicate check for promoter
   * @author yamuna.k
   */
  duplicateForPromoter(rowData: any) {
    if (rowData != null && rowData != undefined) {
      if (this.promoterDetails != null && this.promoterDetails != undefined && this.promoterDetails.length > 0) {
        for (let item of this.promoterDetails) {
          if (item != null && item != undefined && item.admissionNumber != null && item.admissionNumber === rowData.admissionNumber &&
            item.groupId != null && item.groupId === this.groupId) {
            // this.promoterDetailsModel = new promoterDetailsModel();
            this.promoterDetailsForm.reset();
            this.promoterDetailsModel.multipartFileListForPhotoCopyPath =[];
            this.promoterDetailsModel.multipartFileListForsignatureCopyPath =[];
            this.admissionNumberDropDown = applicationConstants.FALSE;
            this.enableFormFields();
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "promoter details already exists" }];
            setTimeout(() => {
              this.msgs = [];
            }, 1500);
          }
        }
      }
    }
  }
     /**
   * @implements duplicate check for institution promoter
   * @author yamuna.k
   */
  duplicateInsitutionForPromoter(rowData: any) {
    if (rowData != null && rowData != undefined) {
      if (this.institutionPromoter != null && this.institutionPromoter != undefined && this.institutionPromoter.length > 0) {
        for (let item of this.institutionPromoter) {
          if (item != null && item != undefined && item.admissionNumber != null && item.admissionNumber === rowData.admissionNumber &&
            item.institutionId != null && item.institutionId === this.institutionId) {
            // this.promoterDetailsModel = new promoterDetailsModel();
            this.promoterDetailsForm.reset();
            this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath =[];
            this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath =[];
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "promoter details already exists" }];
            setTimeout(() => {
              this.msgs = [];
            }, 1500);
          }
        }
      }
    }
  }

   /**
   * @implements dates ValidationCheck Age And Dob For GroupPromoter
   * @author yamuna.k
   */
  datesValidationCheckAgeAndDobForGroupPromoter(model: any, type: number): void {
    if (type === 2) {
      if (model.memDobVal) {
        const calculatedAge = this.calculateAge(model.memDobVal);
        model.age = calculatedAge;
        if (model.age != null && model.age <= 0) {
          this.promoterDetailsForm.get('age')?.reset();
          this.promoterDetailsForm.get('dob')?.reset();
          this.msgs = [{ severity: 'warning', detail:applicationConstants.AGE_SHOULD_NOT_BE_ZERO_OR_NEGATIVE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }
    } else if (type === 1) {
      if (model.age && model.age > 0) {
        const calculatedDob = this.calculateDobFromAge(model.age);
        model.memDobVal = calculatedDob;
        this.promoterDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(model.memDobVal));
      } else if (model.age != null && model.age <= 0) {
        this.promoterDetailsForm.get('age')?.reset();
        this.promoterDetailsForm.get('dob')?.reset();
        this.msgs = [{ severity: 'warning', detail:applicationConstants.AGE_SHOULD_NOT_BE_ZERO_OR_NEGATIVE }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);

      }
    }
  }
  /**
   * @implements dates ValidationCheck Age And Dob For institution promoter
   * @author yamuna.k
   */
  datesValidationCheckAgeAndDobForInstitutionPromoter(model: any, type: number): void {
    if (type === 2) {
      if (model.memDobVal) {
        const calculatedAge = this.calculateAge(model.memDobVal);
        model.age = calculatedAge;
        if (model.age != null && model.age <= 0) {
          this.promoterDetailsForm.get('age')?.reset();
          this.promoterDetailsForm.get('dob')?.reset();
          this.msgs = [{ severity: 'warning', detail:applicationConstants.AGE_SHOULD_NOT_BE_ZERO_OR_NEGATIVE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
  
        }
      }
    } else if (type === 1) {
      if (model.age && model.age > 0) {
        const calculatedDob = this.calculateDobFromAge(model.age);
        model.memDobVal = calculatedDob;
        this.institutionPromoterDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(model.memDobVal));
      } else if (model.age != null && model.age <= 0) {
        this.promoterDetailsForm.get('age')?.reset();
        this.promoterDetailsForm.get('dob')?.reset();
        this.msgs = [{ severity: 'warning', detail:applicationConstants.AGE_SHOULD_NOT_BE_ZERO_OR_NEGATIVE }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);

      }
    }
  }

  isPosCheck(isPoc: any , isGroup:any) {
    if(isGroup){
      if (this.promoterDetails && this.promoterDetails.length > 0) {
        let duplicate = this.promoterDetails.find(
          (obj: any) =>
            obj && obj.status === applicationConstants.ACTIVE && obj.isPoc === applicationConstants.TRUE
        );
        if (isPoc === applicationConstants.TRUE && duplicate) {
          this.promoterDetailsForm.get("isPoc").reset();
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.POC_ALREADY_EXIST }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
          return;
        }
      }
    }
    else {
      if (this.institutionPromoter && this.institutionPromoter.length > 0) {
        let duplicate = this.institutionPromoter.find(
          (obj: any) =>
            obj && obj.status === applicationConstants.ACTIVE && obj.isPoc === applicationConstants.TRUE
        );
        if (isPoc === applicationConstants.TRUE && duplicate) {
          this.promoterDetailsForm.get("isPoc").reset();
          this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.POC_ALREADY_EXIST }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
          return;
        }
      }
    }
    
  }
   
     /**
   * @implements onChange institution tye name
   * @author k.yamuna
   */
     institutionTypeOnChange(){
      let institution = this.institutionTypes.find((data: any) => null != data && this.membershipInstitutionDetailsModel.institutionType != null && data.value == this.membershipInstitutionDetailsModel.institutionType);
      if (institution != null && undefined != institution)
        this.membershipInstitutionDetailsModel.institutionTypeName = institution.label;
    }

}


