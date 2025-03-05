import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupPromoterDetailsModel, InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from './shared/new-membership-add.model';
import { FdCumulativeApplication } from '../fd-cumulative-application/shared/fd-cumulative-application.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FdCumulativeApplicationService } from '../fd-cumulative-application/shared/fd-cumulative-application.service';
import { NewMembershipAddService } from './shared/new-membership-add.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { GroupBasicDetailsComponent } from 'src/app/transcations/membership-transcation/group/group-stepper/group-basic-details/group-basic-details.component';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CommonStatusData, membershipProductName, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { CommunityService } from 'src/app/configurations/common-config/community/shared/community.service';
import { SelectItemGroup } from 'primeng/api';
import { CasteService } from 'src/app/configurations/common-config/caste/shared/caste.service';
import { QualificationService } from 'src/app/configurations/common-config/qualification/shared/qualification.service';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';

@Component({
  selector: 'app-new-membership-add',
  templateUrl: './new-membership-add.component.html',
  styleUrls: ['./new-membership-add.component.css']
})
export class NewMembershipAddFdComponent {
  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  communityList: any[] = [];


  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: GroupPromoterDetailsModel = new GroupPromoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  relationTypesList: any[] = [];
  occupationTypeList: any[] = [];
  qualificationTypes: any[] = [];
  admissionNumberList: any[] = [];
  castesList: any[] = [];
  checked: Boolean = false;
  showForm: Boolean = false;
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
  addButton: boolean = true;
  EditDeleteDisable: boolean = false;
  newRow: any;
  promoterDetails: any[] = [];
  memberTypeId: any;

  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('dt1', { static: false }) private dt1!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;

  msgs: any[] = [];
  operatorTypeList: any[] = [];
  admisionNumber: any;
  communicationForm: any;
  pacsId: any;
  branchId: any;
  allTypesOfmembershipList: any;
  permenentAllTypesOfmembershipList: any;
  fdCummulativeAccId: any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploadedPhoto: Boolean = false;
  isFileUploadedsignature: Boolean = false;
  groupPromoters: boolean = false;


  cancleButtonFlag: Boolean = false;

  promterTypeDisabled: any;

  admissionNumbersList: any[] = [];
  admissionNumberDropDown: boolean = false;

  isExistingMember: Boolean = false;
  institutionPromoterPopUp: boolean = false;
  uploadSignature: boolean = false;

  isFileUploadedPromoterPhoto: boolean = false;
  isFileUploadedPromoterSignature: boolean = false;

  groupOrInstitutionDisable: boolean = false;
  requiredlist: any[] = [];
  today: any;
  tempSubCasteList: any[] = [];
  tempSubQualificationList: any[] = [];
  groupedCasteSubCaste: SelectItemGroup[] = [];
  groupedQualificationSubQualification: any[] = [];
  subCasteList: any[] = [];
  subQualificationList: any[] = [];
  groupTypes: any[] = [];
  institutionTypes: any[] = [];
  subProductList: any[] = [];


  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private casteService: CasteService,
    private qualificationService: QualificationService,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private membershipServiceService: NewMembershipAddService,
    private fileUploadService: FileUploadService, private communityService: CommunityService) {
    this.memberCreationForm = this.formBuilder.group({
      surName: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS)]],
      name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY), Validators.compose([Validators.required])]],
      maritalStatus: ['', Validators.required],
      relationWithMember: ['', Validators.compose([Validators.required])],
      relationName: ['', Validators.compose([Validators.required])],
      aadharNumber: ['', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.compose([Validators.required])]],
      panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
      mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
      occupation: ['', Validators.compose([Validators.required])],
      community: ['', Validators.compose([Validators.required])],
      qualificationId: ['', Validators.compose([Validators.required])],
      casteId: ['', Validators.compose([Validators.required])],
      email: ['', [Validators.pattern(applicationConstants.EMAIL_PATTERN)]],
      admissionDate: ['', Validators.compose([Validators.required])],
      isStaff: [''],
      fileUpload: [''],
      admissionFee: [''],
      // resolutionDate: [''],
      // mcrNumber: [''],
      subProductId: ['',],
      societyAdmissionNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]],
    })
    this.groupForm = this.formBuilder.group({
      name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationDate: ['', Validators.required],
      admissionDate: ['', Validators.required],
      // pocNumber: ['', Validators.required],
      mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
      panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
      tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER)]],
      gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN)]],
      pocName: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      subProductId: ['',],
      groupTypeId: ['',],
      societyAdmissionNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]],
      operatorTypeId: ['',],

    })
    this.institutionForm = this.formBuilder.group({
      name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      registrationDate: ['', Validators.required],
      admissionDate: ['', Validators.required],
      // pocName: ['', Validators.required],
      mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
      panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
      tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER)]],
      gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN)]],
      pocName: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      subProductId: ['',],
      institutionType: ['',],
      societyAdmissionNumber: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]],
      operatorTypeId: ['',],

    })
    this.promoterDetailsForm = this.formBuilder.group({
      surname: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      // operatorTypeId: ['',],
      dob: ['', Validators.required],
      age: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
      genderId: ['', Validators.required],
      martialId: ['', Validators.required],
      mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
      aadharNumber: ['', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.compose([Validators.required])]],
      emailId: ['', [Validators.pattern(applicationConstants.EMAIL_PATTERN), Validators.compose([Validators.required])]],
      startDate: ['', Validators.required],
      promterType: ['',],
      isGroupLeader: ['',],
      admissionNumber: ['',],
      photoUpload: ['',],
      signatureUpload: ['',],
      authorizedSignatory: ['',],
      isPoc: ['', Validators.required],
      endDate: ['',],
    })
  }

  ngOnInit(): void {
    this.membershipBasicRequiredDetails.filesDTOList = [];
    this.pacsId = 1;
    this.branchId = 1;
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.maritalStatusList = this.commonComponent.maritalStatusList();
    this.requiredlist = this.commonComponent.requiredlist();
    this.genderList = this.commonComponent.requiredlist();

    this.groupTypes = [
      { label: "Self Help Group", value: 1 },
      { label: "Rythu Mitra", value: 2 }
    ]

    this.institutionTypes = [
      { label: "Self Help Group", value: 1 },
      { label: "Rythu Mitra", value: 2 }
    ]
    this.genderList = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 2 },
    ]

    this.maritalstatusList = [
      { label: 'Married', value: 1 },
      { label: 'Un-Married', value: 2 }
    ]
    // this.getGenderList();
    this.getAllRelationTypes();
    this.getAllMemberType();
    this.getAllOperatorTypes();
    this.getAllOccupationTypes();
    this.getAllQualificationType();
    this.getCastesList();
    this.getAllCommunityTypes();
    this.getAllSubProducts();
    this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        this.fdCummulativeAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getFdNonCummApplicationById(this.fdCummulativeAccId);
        this.isEdit = true;
      }
      else {
        this.groupOrInstitutionDisable = true;
        this.updateData();
        let val = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
        this.memberFormReset(val);

        if (!this.showForm) {
          this.individualFlag = true;
        }
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
 * @implements get all subproducts details
 * @author bhargavi
 */
  getAllSubProducts() {
    this.commonComponent.startSpinner();
    this.fdCumulativeApplicationService.getAllSubProduct().subscribe((res: any) => {
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
        this.subProductList = this.subProductList.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE && customertype.name != membershipProductName.ACLASS_VOTING_MEMBER && customertype.name != membershipProductName.ACLASS_MEMBER).map((count: any) => {
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
   * @implements get all community Types
   * @author bhargavi
   */
  getAllCommunityTypes() {
    this.commonComponent.startSpinner();
    this.communityService.getAllCommunity().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != null && this.responseModel.data.length > 0) {
          this.communityList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.name, value: count.id }
          });
        }
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
   * @implements get sb account details by id
   * @param id 
   * @author bhargavi
   */
  getFdNonCummApplicationById(id: any) {
    this.fdCumulativeApplicationService.getFdCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admisionNumber = this.responseModel.data[0].admissionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;;
              this.fdCumulativeApplicationModel = this.responseModel.data[0];
              if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != null && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined) {
                this.membershipBasicRequiredDetails = this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO;
                if (this.membershipBasicRequiredDetails.memberTypeId != undefined && this.membershipBasicRequiredDetails.memberTypeId) {
                  this.memberTypeId = this.membershipBasicRequiredDetails.memberTypeId;
                }

                if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined)
                  this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined)
                  this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);

                if (this.membershipBasicRequiredDetails.photoPath != null && this.membershipBasicRequiredDetails.photoPath != undefined) {
                  this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoPath);
                  this.isFileUploadedPhoto = applicationConstants.TRUE;
                }
                if (this.membershipBasicRequiredDetails.signaturePath != null && this.membershipBasicRequiredDetails.signaturePath != undefined) {
                  this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signaturePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signaturePath);
                  this.isFileUploadedsignature = applicationConstants.TRUE;
                }
                this.disableMemberType = true;

              }
              if (this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO != null && this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO != undefined) {
                this.memberGroupDetailsModel = this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO;
                this.groupOrInstitutionDisable = false;
                if (this.memberGroupDetailsModel.memberTypeId != undefined && this.memberGroupDetailsModel.memberTypeId) {
                  this.memberTypeId = this.memberGroupDetailsModel.memberTypeId;
                }

                if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
                  this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
                if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
                  this.promoterDetails = this.memberGroupDetailsModel.groupPromoterList;
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
                    if (groupPromoters.authorizedSignatory != null && groupPromoters.authorizedSignatory != undefined && groupPromoters.authorizedSignatory) {
                      groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                    }
                    else {
                      groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                    }
                  }
                }
                this.disableMemberType = true;

              }
              if (this.fdCumulativeApplicationModel.memInstitutionDTO != null && this.fdCumulativeApplicationModel.memInstitutionDTO != undefined) {
                this.membershipInstitutionDetailsModel = this.fdCumulativeApplicationModel.memInstitutionDTO;
                this.groupOrInstitutionDisable = false;
                if (this.membershipInstitutionDetailsModel.memberTypeId != undefined && this.membershipInstitutionDetailsModel.memberTypeId) {
                  this.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;
                }

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
                    if (institution.endDate != null && institution.endDate != undefined) {
                      institution.endDateVal = this.datePipe.transform(institution.endDate, this.orgnizationSetting.datePipe);
                    }
                    if (institution.genderId != null && institution.genderId != undefined) {
                      let Obj = this.genderList.filter(obj => obj.value == institution.genderId);
                      if (Obj != null && Obj != undefined) {
                        institution.genderName = Obj[0].label;
                      }
                    }
                    if (institution.authorizedSignatory != null && institution.authorizedSignatory != undefined && institution.authorizedSignatory) {
                      institution.authorizedSignatoryName = applicationConstants.YES;
                    }
                    else {
                      institution.authorizedSignatoryName = applicationConstants.YES;
                    }
                  }
                }
                this.disableMemberType = true;

              }
              this.updateData();
              // this.membershipDataFromSbModule();
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
    * @implements member form reset
    * @author bhargavi
    */
  memberFormReset(flag: any) {
    if (flag) {
      this.memberCreationForm.reset();
      this.showForm = flag;
    }
    else {
      this.showForm = flag;
    }
  }
  /**
   * @implements update
   * @author bhargavi
   */
  updateData() {
    this.fdCumulativeApplicationModel.memberType = this.memberTypeId;
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      this.isDisableFlag = (!this.memberCreationForm.valid) || !(this.isFileUploadedPhoto && this.isFileUploadedsignature)
      this.fdCumulativeApplicationModel.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetails.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetails.isNewMember = this.showForm;
      this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
    }
    if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      this.isDisableFlag = (!(this.groupForm.valid && (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length >= 2))) || this.groupPromoters
      this.memberGroupDetailsModel.memberTypeId = this.memberTypeId;
      this.memberGroupDetailsModel.memberTypeName = this.memberTypeName;
      this.memberGroupDetailsModel.isNewMember = this.showForm;
      this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
      this.fdCumulativeApplicationModel.memberTypeName = this.memberTypeName;
      this.addButton = !this.groupForm.valid;
    }
    if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      this.isDisableFlag = (!(this.institutionForm.valid && (this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0))) || this.institutionPromoterPopUp
      this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
      this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
      this.fdCumulativeApplicationModel.memberTypeName = this.memberTypeName;
      this.fdCumulativeApplicationModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
      this.addButton = !this.institutionForm.valid;
    }

    this.fdCumulativeApplicationService.changeData({
      formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
      data: this.fdCumulativeApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  /**
   * @implements update save
   * @author bhargavi
   */
  save() {
    this.updateData();
  }

  /**
   * @implements on Change Relation Type
   * @author bhargavi
   */
  onChangeRelationTypeChange(event: any) {
    const filteredItem = this.relationTypesList.find(item => item.value === event.value);
    this.membershipBasicRequiredDetails.relationTypeName = filteredItem.label;

  }
  /**
   * @implements get getAll relation Types
   * @author bhargavi
   */
  getAllRelationTypes() {
    this.fdCumulativeApplicationService.getAllRelationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.relationTypesList = this.responseModel.data;
        this.relationTypesList = this.relationTypesList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }
  /**
   * @implements get getAll Occupation Types
   * @author bhargavi
   */
  getAllOccupationTypes() {
    this.fdCumulativeApplicationService.getAllOccupationTypesList().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.occupationTypeList = this.responseModel.data;
        this.occupationTypeList = this.occupationTypeList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });

      }
    });
  }
  /**
   * @implements get getAll Qualification Types
   * @author bhargavi
   */
  getAllQualificationType() {
    this.qualificationService.getAllQualificationSubQualification().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.qualificationTypes = this.responseModel.data;
        this.groupedQualificationSubQualification = this.responseModel.data.filter((qualification: any) => qualification.status == applicationConstants.ACTIVE).map((count: any) => {
          this.subQualificationList = [];
          count.subQualificationList.filter((subCaste: any) => subCaste.status == applicationConstants.ACTIVE).map((subCount: any) => {
            this.subQualificationList.push({ label: subCount.name, value: subCount.id })
            this.tempSubQualificationList.push({ label: subCount.name, value: subCount.id })
          });
          return {
            label: count.name, value: count.id, items: this.subQualificationList
          }
        });
        this.qualificationTypes = this.qualificationTypes.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }

  /**
   * @implements get castes list
   * @author bhargavi
   */
  getCastesList() {
    this.casteService.getAllCasteSubCaste().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.castesList = this.responseModel.data;
        this.tempSubCasteList = [];
        this.groupedCasteSubCaste = this.responseModel.data.filter((caste: any) => caste.status == applicationConstants.ACTIVE).map((count: any) => {
          this.subCasteList = [];
          count.subCastesList.filter((subCaste: any) => subCaste.status == applicationConstants.ACTIVE).map((subCount: any) => {
            this.subCasteList.push({ label: subCount.name, value: subCount.id })
            this.tempSubCasteList.push({ label: subCount.name, value: subCount.id })
          });
          return {
            label: count.name, value: count.id, items: this.subCasteList
          }
        });
        this.castesList = this.castesList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
      }
    });
  }


  /**
    * @implements get membership detaild by admission Number
    * @param admissionNumber 
    * @author bhargavi
    */
  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.fdCumulativeApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicRequiredDetails = this.responseModel.data[0];
            if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
              this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
              this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicRequiredDetails.memberTypeId != undefined && this.membershipBasicRequiredDetails.memberTypeId) {
              this.memberTypeId = this.membershipBasicRequiredDetails.memberTypeId;
            }
            if (this.membershipBasicRequiredDetails.photoPath != null && this.membershipBasicRequiredDetails.photoPath != undefined) {
              this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoPath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoPath);
              this.isFileUploadedPhoto = applicationConstants.TRUE;
            }
            if (this.membershipBasicRequiredDetails.signaturePath != null && this.membershipBasicRequiredDetails.signaturePath != undefined) {
              this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signaturePath, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signaturePath);
              this.isFileUploadedsignature = applicationConstants.TRUE;
            }
            this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
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
   * @implements get group detaild by admission Number
   * @param admissionNumber 
   * @author bhargavi
   */
  getGroupByAdmissionNumber(admissionNumber: any) {
    this.fdCumulativeApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length != null && this.responseModel.data.length != undefined && this.responseModel.data.length > 0) {
            this.memberGroupDetailsModel = this.responseModel.data[0];
            this.groupOrInstitutionDisable = false;
            if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
              this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
            }
            if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
              this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.memberGroupDetailsModel.memberTypeId != null && this.memberGroupDetailsModel.memberTypeId != undefined) {
              this.memberTypeId = this.memberGroupDetailsModel.memberTypeId;
            }

            if (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length > 0) {
              this.promoterDetails = this.memberGroupDetailsModel.groupPromoterList;
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
                  if (Obj != null && Obj != undefined) {
                    groupPromoters.genderName = Obj[0].label;
                  }
                }
                if (groupPromoters.authorizedSignatory != null && groupPromoters.authorizedSignatory != undefined && groupPromoters.authorizedSignatory) {
                  groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                }
                else {
                  groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                }
              }
            }
            if (this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined) {
              this.fdCumulativeApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
            }
            if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
              this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
            }

            this.updateData();
            this.disableMemberType = true;
          }
          else {
            this.groupOrInstitutionDisable = true;
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
   * @implements get institution details by admission Number
   * @param admissionNumber 
   * @author bhargavi
   */
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.fdCumulativeApplicationService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length != null && this.responseModel.data.length != undefined && this.responseModel.data.length > 0) {
            this.membershipInstitutionDetailsModel = this.responseModel.data[0];
            this.groupOrInstitutionDisable = false;
            if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined) {
              this.memberTypeId = this.memberTypeId;
            }
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
                  if (Obj != null && Obj != undefined) {
                    institution.genderName = Obj[0].label;
                  }
                }
                if (institution.authorizedSignatory != null && institution.authorizedSignatory != undefined && institution.authorizedSignatory) {
                  institution.authorizedSignatoryName = applicationConstants.YES;
                }
                else {
                  institution.authorizedSignatoryName = applicationConstants.YES;
                }
              }
            }
            this.fdCumulativeApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.fdCumulativeApplicationModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
            this.updateData();
            this.disableMemberType = true;
          }
          else {
            this.groupOrInstitutionDisable = true;;
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
   * @implements onChange member Type
   * @param event 
   * @author bhargavi
   */
  OnChangeMemberType(event: any) {
    const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === event.value);
    this.memberTypeName = filteredItem.label;
    if (event.value == 1) {
      this.individualFlag = true;
      this.institutionFlag = false;
      this.groupFlag = false;
      this.membershipBasicRequiredDetails.memberTypeId = 1;
      this.fdCumulativeApplicationModel.memberType = 1;

      this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO = null;
      this.memberGroupDetailsModel = new MemberGroupDetailsModel();
      this.membershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
      this.fdCumulativeApplicationModel.memInstitutionDTO = null;
      this.groupForm.reset();
      this.institutionForm.reset();
    }
    else if (event.value == 2) {
      this.addButton = false;
      this.EditDeleteDisable = false;
      this.groupFlag = true;
      this.individualFlag = false;
      this.institutionFlag = false;
      this.memberGroupDetailsModel.memberTypeId = 2;
      this.fdCumulativeApplicationModel.memberType = 2;

      // refressing the form with data
      this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO = null;
      this.fdCumulativeApplicationModel.memInstitutionDTO = null;
      this.memberCreationForm.reset();
      this.institutionForm.reset();
      this.membershipBasicRequiredDetails = new NewMembershipAdd();
      this.membershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
    }
    else if (event.value == 3) {
      this.addButton = false;
      this.EditDeleteDisable = false;
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;
      this.membershipInstitutionDetailsModel.memberTypeId = 3;
      this.fdCumulativeApplicationModel.memberType = 3;

      this.fdCumulativeApplicationModel.memInstitutionDTO = null;
      this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO = null;
      this.membershipBasicRequiredDetails = new NewMembershipAdd();;
      this.memberGroupDetailsModel = new MemberGroupDetailsModel();
      this.groupForm.reset();
      this.memberCreationForm.reset();
    }
    this.updateData();
  }


  /**
   * @implements save group prmoters
   * @param rowData 
   * @author bhargavi
   */
  savePromoterDetails(rowData: any) {
    rowData.pacsId = 1;
    rowData.status = applicationConstants.ACTIVE;
    this.addButton = false;
    this.EditDeleteDisable = false;
    if (rowData.memDobVal != null && rowData.memDobVal != undefined) {
      rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal));
    }
    if (rowData.dob != null && rowData.dob != undefined) {
      rowData.memDobVal = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);
    }
    if (rowData.startDateVal != null && rowData.startDateVal != undefined) {
      rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal));
    }
    if (rowData.endDateVal != null && rowData.endDateVal != undefined) {
      rowData.endDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDateVal));
    }
    if (rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory) {
      rowData.authorizedSignatoryName = applicationConstants.YES;
    }
    else {
      rowData.authorizedSignatoryName = applicationConstants.NO;
    }
    if (rowData.startDate != null && rowData.startDate != undefined) {
      rowData.startDateVal = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
    }
    if (rowData.endDate != null && rowData.endDate != undefined) {
      rowData.endDateVal = this.datePipe.transform(rowData.endDate, this.orgnizationSetting.datePipe);
    }
    if (!this.memberGroupDetailsModel.groupPromoterList) {
      this.memberGroupDetailsModel.groupPromoterList = []; // Initialize it as an empty array
    }
    let Object = this.operatorTypeList.find((obj: any) => obj.value == rowData.operatorTypeId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.operatorTypeName = Object.label;
    }
    Object = this.genderList.find((obj: any) => obj.value == rowData.genderId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.genderName = Object.label;
    }
    Object = this.maritalStatusList.find((obj: any) => obj.value == rowData.martialId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.maritalStatusName = Object.label;
    }
    // if(this.promoterDetails != null && this.promoterDetails != undefined && this.promoterDetails.length > 0 ){
    //   const kyc = this.promoterDetails.findIndex((obj:any) => (obj != null && obj != undefined ) && obj.uniqueId === rowData.uniqueId );
    //   if(kyc != -1){
    //     this.promoterDetails[kyc] = null;
    //     this.promoterDetails[kyc] = rowData;
    //   }
    //   else{
    //     this.promoterDetails.push(rowData);
    //   }
    //   this.memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
    // }else{
    //   this.promoterDetails.push(rowData);
    //   this.memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
    // }
    rowData.groupId = this.memberGroupDetailsModel.id;
    this.saveGropPromotersDetails(rowData);

  }

  /**
   * @implements cancle prmoters
   * @author bhargavi
   * @param falg 
   */
  cancelPromoter(falg: Boolean) {
    this.addButton = false;
    this.groupPromoters = false;
    this.EditDeleteDisable = false;
    this.promoterDetails;
    this.updateData();
  }

  /**
* @implements edit promoters
* @param rowData 
* @author bhargavi
*/
  editPromoter(rowData: any) {
    this.cancleButtonFlag = true;
    this.addButton = true;
    this.EditDeleteDisable = true;
    this.groupPromoters = true;
    this.promoterDetailsModel = new GroupPromoterDetailsModel();
    // First, assign the data
    this.promoterDetailsModel = { ...rowData };
    // Then, disable the fields
    if (rowData.isExistingMember) {
      setTimeout(() => { // Ensure Angular updates the UI before disabling
        this.promoterDetailsForm.get('surname')?.disable();
        this.promoterDetailsForm.get('name')?.disable();
        this.promoterDetailsForm.get('dob')?.disable();
        // this.promoterDetailsForm.get('operatorTypeId')?.disable();
        this.promoterDetailsForm.get('dob')?.disable();
        this.promoterDetailsForm.get('age')?.disable();
        this.promoterDetailsForm.get('genderId')?.disable();
        this.promoterDetailsForm.get('martialId')?.disable();
        this.promoterDetailsForm.get('mobileNumber')?.disable();
        this.promoterDetailsForm.get('aadharNumber')?.disable();
        this.promoterDetailsForm.get('emailId')?.disable();
        this.promoterDetailsForm.get('startDate')?.disable();
        this.promoterDetailsForm.get('admissionNumber')?.setValue(rowData.admissionNumber);
      }, 100);
    }
    else {
      this.promoterDetailsForm.get('surname')?.enable();
      this.promoterDetailsForm.get('name')?.enable();
      // this.promoterDetailsForm.get('operatorTypeId')?.enable();
      this.promoterDetailsForm.get('dob')?.enable();
      this.promoterDetailsForm.get('age')?.enable();
      this.promoterDetailsForm.get('genderId')?.enable();
      this.promoterDetailsForm.get('martialId')?.enable();
      this.promoterDetailsForm.get('mobileNumber')?.enable();
      this.promoterDetailsForm.get('aadharNumber')?.enable();
      this.promoterDetailsForm.get('emailId')?.enable();
      this.promoterDetailsForm.get('startDate')?.enable();
      this.promoterDetailsForm.get('admissionNumber')?.setValidators(null);
      this.promoterDetailsForm.get('admissionNumber')?.updateValueAndValidity();
      this.admissionNumberDropDown = false;
    }
    // this.promoterDetailsModel = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
    if (this.promoterDetailsModel.isExistingMember) {
      this.admissionNumberDropDown = true;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature);
    }
    else {
      this.admissionNumberDropDown = false;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature);
    }
    this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
    this.isFileUploadedPromoterSignature = applicationConstants.TRUE;

    this.updateData();
  }

  /**
   * @implements row add of group promoters
   * @author bhargavi
   */
  onRowAddSave() {
    this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
    this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
    this.groupPromoters = true;
    this.cancleButtonFlag = false;
    this.promoterDetailsModel = new GroupPromoterDetailsModel();
    this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
    this.promoterDetailsForm.reset();
    this.onChangeExistedPrmoter(false, true);
    this.admissionNumberDropDown = false;
    this.updateData();

  }
  /**
   * @implements get all operator Details
   * @author bhargavi
   */
  getAllOperatorTypes() {
    this.commonComponent.startSpinner();
    this.fdCumulativeApplicationService.getAllOperationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {
          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.operatorTypeList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let relation = this.operatorTypeList.find((data: any) => null != data && data.value == this.promoterDetailsModel.operatorTypeId);
        if (relation != null && undefined != relation)
          this.promoterDetailsModel.operatorTypeName = relation.label;
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
   * @implements save institution promoters details
   * @param rowData 
   * @author bhargavi
   */
  saveInstitutionPromoterDetails(rowData: any) {
    this.institutionPromoterPopUp = false;
    this.cancleButtonFlag = false
    rowData.pacsId = 1;
    rowData.status = applicationConstants.ACTIVE;
    this.addButton = false;
    this.EditDeleteDisable = false;

    if (rowData.memDobVal != null && rowData.memDobVal != undefined) {
      rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal));
    }
    if (rowData.dob != null && rowData.dob != undefined) {
      rowData.memDobVal = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);
    }
    if (rowData.startDateVal != null && rowData.startDateVal != undefined) {
      rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal));
    }
    if (rowData.endDateVal != null && rowData.endDateVal != undefined) {
      rowData.endDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDateVal));
    }
    if (rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory) {
      rowData.authorizedSignatoryName = applicationConstants.YES;
    }
    else {
      rowData.authorizedSignatoryName = applicationConstants.NO;
    }
    if (rowData.startDate != null && rowData.startDate != undefined) {
      rowData.startDateVal = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
    }
    if (rowData.endDate != null && rowData.endDate != undefined) {
      rowData.endDateVal = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDate));
    }
    let Object = this.operatorTypeList.find((obj: any) => obj.value == rowData.operatorTypeId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.operatorTypeName = Object.label;
    }
    Object = this.genderList.find((obj: any) => obj.value == rowData.genderId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.genderName = Object.label;
    }
    Object = this.maritalStatusList.find((obj: any) => obj.value == rowData.martialId);
    if (Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.maritalStatusName = Object.label;
    }

    // if (!this.membershipInstitutionDetailsModel.institutionPromoterList) {
    //   this.membershipInstitutionDetailsModel.institutionPromoterList = []; // Initialize it as an empty array
    // }
    // if(this.institutionPromoter != null && this.institutionPromoter != undefined && this.institutionPromoter.length > 0){
    //   const kyc = this.institutionPromoter.findIndex((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
    //   if(kyc != -1){
    //     this.institutionPromoter[kyc] = null;
    //     this.institutionPromoter[kyc] = rowData;
    //   }
    //   else {
    //     this.institutionPromoter.push(rowData);
    //   }
    //   this.membershipInstitutionDetailsModel.institutionPromoterList = this.institutionPromoter;
    // }
    // else{
    //   this.institutionPromoter.push(rowData);
    //   this.membershipInstitutionDetailsModel.institutionPromoterList = this.institutionPromoter;
    // }
    rowData.institutionId = this.membershipInstitutionDetailsModel.id;
    this.saveInstitutionPrmoters(rowData);
    this.updateData();
  }

  /**
   * @implements cancle institution promoters
   * @param falg 
   * @author bhargavi
   */
  cancelInstitutionPromoter(falg: Boolean) {
    this.addButton = false;
    this.EditDeleteDisable = false;
    this.institutionPromoterPopUp = false;
    this.institutionPromoter;
    this.updateData();
  }

  /**
 * @implements edit institution promoters
 * @param rowData 
 * @author bhargavi
 */
  editInstitutionPromoter(rowData: any) {
    this.cancleButtonFlag = false;
    this.addButton = true;
    this.EditDeleteDisable = true;
    this.institutionPromoterPopUp = true;
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
    // First, assign the data
    this.institutionPromoterDetailsModel = { ...rowData };
    // Then, disable the fields
    if (rowData.isExistingMember) {
      this.admissionNumberDropDown = true;
      setTimeout(() => { // Ensure Angular updates the UI before disabling
        this.promoterDetailsForm.get('surname')?.disable();
        this.promoterDetailsForm.get('name')?.disable();
        this.promoterDetailsForm.get('dob')?.disable();
        // this.promoterDetailsForm.get('operatorTypeId')?.disable();
        this.promoterDetailsForm.get('dob')?.disable();
        this.promoterDetailsForm.get('age')?.disable();
        this.promoterDetailsForm.get('genderId')?.disable();
        this.promoterDetailsForm.get('martialId')?.disable();
        this.promoterDetailsForm.get('mobileNumber')?.disable();
        this.promoterDetailsForm.get('aadharNumber')?.disable();
        this.promoterDetailsForm.get('emailId')?.disable();
        this.promoterDetailsForm.get('startDate')?.disable();
        this.promoterDetailsForm.get('admissionNumber')?.setValue(rowData.admissionNumber);
      }, 100);
    }
    else {
      this.admissionNumberDropDown = false;
      this.promoterDetailsForm.get('surname')?.enable();
      this.promoterDetailsForm.get('name')?.enable();
      // this.promoterDetailsForm.get('operatorTypeId')?.enable();
      this.promoterDetailsForm.get('dob')?.enable();
      this.promoterDetailsForm.get('age')?.enable();
      this.promoterDetailsForm.get('genderId')?.enable();
      this.promoterDetailsForm.get('martialId')?.enable();
      this.promoterDetailsForm.get('mobileNumber')?.enable();
      this.promoterDetailsForm.get('aadharNumber')?.enable();
      this.promoterDetailsForm.get('emailId')?.enable();
      this.promoterDetailsForm.get('startDate')?.enable();
      this.promoterDetailsForm.get('admissionNumber')?.setValidators(null);
      this.promoterDetailsForm.get('admissionNumber')?.updateValueAndValidity();

    }
    // this.institutionPromoterDetailsModel =  this.institutionPromoter.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
    // this.institutionPromoterDetailsModel = rowData;
    if (this.institutionPromoterDetailsModel.isExistingMember) {
      this.admissionNumberDropDown = true;

      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage);
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature);
    }
    else {
      this.admissionNumberDropDown = false;
      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage);
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature);
    }

    this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
    this.isFileUploadedPromoterSignature = applicationConstants.TRUE;

    this.updateData();
  }
  /**
   * @implements on institution promoter add
   * @author bhargavi
   */
  onRowAddInstitution() {
    this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
    this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
    this.institutionPromoterPopUp = true;
    this.cancleButtonFlag = true;
    let uniqueId = this.institutionPromoter.length + 1
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
    this.institutionPromoterDetailsModel.uniqueId = uniqueId;
    this.promoterDetailsForm.reset();
    this.admissionNumberDropDown = false;
    this.updateData();
  }

  /**
   * @implements get All member types 
   * @author bhargavi
   */
  getAllMemberType() {
    this.membershipServiceService.getAllMemberTypes().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberTypeList = this.responseModel.data;
          this.memberTypeList = this.memberTypeList.filter((obj: any) => obj != null).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
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
   * @implements membership module data
   * @author bhargavi
   */
  membershipDataFromFdNonCumModule() {
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      this.getMemberDetailsByAdmissionNumber(this.admisionNumber);
    } else if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      this.getGroupByAdmissionNumber(this.admisionNumber);
    } else if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      this.getInstitutionByAdmissionNumber(this.admisionNumber);
    }
  }

  /**
* @implements image uploader
* @param event 
* @param fileUpload 
* @author bhargavi
*/

  fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
    this.multipleFilesList = [];
    let fileSizeFalg = false;
    if (this.isEdit && this.membershipBasicRequiredDetails.filesDTOList == null || this.membershipBasicRequiredDetails.filesDTOList == undefined) {
      this.membershipBasicRequiredDetails.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "individualPhotoCopy") {
      this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = [];
      this.membershipBasicRequiredDetails.photoPath = null;
      if (selectedFiles[0].size/1024/1024 > 2) { 
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB }];
        setTimeout(() => {
          this.msgs = [];
          fileUpload.clear();
        }, 2000);
      }
    }
    if (filePathName === "individualSighnedCopy") {
      this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) { 
        fileUpload.clear();
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
    if (filePathName === "individualResolutionCopy") {
      this.membershipBasicRequiredDetails.multipartFileListForResolutionCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) { 
        this.msgs = [{ severity: 'warning', summary: applicationConstants.STATUS_WARN, detail: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_5MB }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
    if (!fileSizeFalg) {
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
          // Add to filesDTOList array
          if (filePathName === "individualPhotoCopy") {
            files.fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.isFileUploadedPhoto = applicationConstants.TRUE;
            this.membershipBasicRequiredDetails.filesDTOList.push(files);
            this.membershipBasicRequiredDetails.photoPath = null;
            this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy.push(files);
            this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.photoPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          else if (filePathName === "individualSighnedCopy") {
            files.fileName = "Individual_Member_Signature_copy" + "_" + timeStamp + "_" + file.name;
            this.isFileUploadedsignature = applicationConstants.TRUE;
            this.membershipBasicRequiredDetails.filesDTOList.push(files);
            this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath.push(files);
            this.membershipBasicRequiredDetails.signaturePath = null;
            this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.signaturePath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          else if (filePathName === "individualResolutionCopy") {
            files.fileName = "Resulution_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.filesDTOList.push(files);
            this.membershipBasicRequiredDetails.multipartFileListForResolutionCopyPath.push(files);
            this.membershipBasicRequiredDetails.resolutionCopy = null;
            this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Resulution_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.resolutionCopy = "Resulution_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          // let index1 = event.files.findIndex((x: any) => x === file);
          // fileUpload.remove(event, index1);
          // fileUpload.clear();
          this.updateData();
        }
        reader.readAsDataURL(file);
      }
    }

  }


  /**
   * @implements onFileremove from file value
   * @param fileName 
   * @author bhargavi
   */
  fileRemoeEvent(fileName: any) {
    if (this.membershipBasicRequiredDetails.filesDTOList != null && this.membershipBasicRequiredDetails.filesDTOList != undefined && this.membershipBasicRequiredDetails.filesDTOList.length > 0) {
      if (fileName == "individualPhotoCopy") {
        this.isFileUploadedPhoto = applicationConstants.FALSE;
        let removeFileIndex = this.membershipBasicRequiredDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.photoPath);
        let obj = this.membershipBasicRequiredDetails.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.photoPath);
        this.membershipBasicRequiredDetails.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetails.photoPath = null;
      }
      if (fileName == "individualSighnedCopy") {
        this.isFileUploadedsignature = applicationConstants.FALSE;
        let removeFileIndex = this.membershipBasicRequiredDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.signaturePath);
        let obj = this.membershipBasicRequiredDetails.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.signaturePath);
        this.membershipBasicRequiredDetails.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetails.signaturePath = null;
      }
      this.updateData();
    }
    if (this.promoterDetailsModel.filesDTOList != null && this.promoterDetailsModel.filesDTOList != undefined && this.promoterDetailsModel.filesDTOList.length > 0) {

      if (fileName == "promoterPhot") {
        this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
        let removeFileIndex = this.promoterDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.promoterDetailsModel.uploadImage);
        let obj = this.promoterDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.promoterDetailsModel.uploadImage);
        this.promoterDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.promoterDetailsModel.uploadImage = null;
      }
      if (fileName == "promoterSignature") {
        this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
        let removeFileIndex = this.promoterDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.promoterDetailsModel.uploadSignature);
        let obj = this.promoterDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.promoterDetailsModel.uploadSignature);
        this.promoterDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.promoterDetailsModel.uploadSignature = null;
      }

    }
    if (this.institutionPromoterDetailsModel.filesDTOList != null && this.institutionPromoterDetailsModel.filesDTOList != undefined && this.institutionPromoterDetailsModel.filesDTOList.length > 0) {
      if (fileName == "promoterPhot") {
        this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
        let removeFileIndex = this.institutionPromoterDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.institutionPromoterDetailsModel.uploadImage);
        let obj = this.institutionPromoterDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.institutionPromoterDetailsModel.uploadImage);
        this.institutionPromoterDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.promoterDetailsModel.uploadImage = null;
      }
      if (fileName == "promoterSignature") {
        this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
        let removeFileIndex = this.institutionPromoterDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.institutionPromoterDetailsModel.uploadSignature);
        let obj = this.institutionPromoterDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.institutionPromoterDetailsModel.uploadSignature);
        this.institutionPromoterDetailsModel.filesDTOList.splice(removeFileIndex, 1);
        this.institutionPromoterDetailsModel.uploadSignature = null;
      }
    }
  }

  /**
  * @implements date converstions
  * @author bhargavi
  */
  dateConverstion() {
    //group dates
    if (this.memberGroupDetailsModel.admissionDateVal != undefined && this.memberGroupDetailsModel.registrationDateVal != undefined) {
      if (new Date(this.memberGroupDetailsModel.admissionDateVal) < new Date(this.memberGroupDetailsModel.registrationDateVal)) {
        this.groupForm.get('registrationDate')?.reset();
        this.groupForm.get('admissionDate')?.reset();
        this.groupForm.updateValueAndValidity();
        this.msgs = [{ severity: 'warning', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
    if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
      if (this.memberGroupDetailsModel.admissionDateVal != null && this.memberGroupDetailsModel.admissionDateVal != undefined) {
        this.memberGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.admissionDateVal));
      }
      if (this.memberGroupDetailsModel.registrationDateVal != null && this.memberGroupDetailsModel.registrationDateVal != undefined) {
        this.memberGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.memberGroupDetailsModel.registrationDateVal));
      }
    }

    if (this.membershipInstitutionDetailsModel.admissionDateVal != undefined && this.membershipInstitutionDetailsModel.registrationDateVal != undefined) {
      if (new Date(this.membershipInstitutionDetailsModel.admissionDateVal) < new Date(this.membershipInstitutionDetailsModel.registrationDateVal)) {
        this.institutionForm.get('registrationDate')?.reset();
        this.institutionForm.get('admissionDate')?.reset();
        this.institutionForm.updateValueAndValidity();
        this.msgs = [{ severity: 'warning', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }
    // institution dates
    if (this.membershipInstitutionDetailsModel != null && this.membershipInstitutionDetailsModel != undefined) {
      if (this.membershipInstitutionDetailsModel.admissionDateVal != null && this.membershipInstitutionDetailsModel.admissionDateVal != undefined) {
        this.membershipInstitutionDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.admissionDateVal));
      }
      if (this.membershipInstitutionDetailsModel.registrationDateVal != null && this.membershipInstitutionDetailsModel.registrationDateVal != undefined) {
        this.membershipInstitutionDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipInstitutionDetailsModel.registrationDateVal));
      }
    }

    //individual membershipdates
    if (this.membershipBasicRequiredDetails != null && this.membershipBasicRequiredDetails != undefined) {
      if (this.membershipBasicRequiredDetails.admissionDateVal != null && this.membershipBasicRequiredDetails.admissionDateVal != undefined) {
        this.membershipBasicRequiredDetails.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetails.admissionDateVal));
        if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
          if (this.membershipBasicRequiredDetails.dob > this.membershipBasicRequiredDetails.admissionDate) {
            this.membershipBasicRequiredDetails.dob = null;
            this.membershipBasicRequiredDetails.dobVal = null;
            this.membershipBasicRequiredDetails.age = null;
            this.memberCreationForm.get('dateOfBirth')?.reset;
            this.membershipBasicRequiredDetails.admissionDate = null;
            this.membershipBasicRequiredDetails.admissionDateVal = null;
            this.memberCreationForm.get('admissionDate')?.reset;
            this.msgs = [{ severity: 'warning', detail: applicationConstants.DATE_OF_BIRTH_SHOULD_NOT_BE_GREATER_THAN_ADMISSION_DATE }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      }
      if (this.membershipBasicRequiredDetails.dobVal != null && this.membershipBasicRequiredDetails.dobVal != undefined) {//dob 
        this.membershipBasicRequiredDetails.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetails.dobVal));//doc conversion
        if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {//dob with admission date check
          if (this.membershipBasicRequiredDetails.dob > this.membershipBasicRequiredDetails.admissionDate) {
            this.membershipBasicRequiredDetails.dob = null;
            this.membershipBasicRequiredDetails.dobVal = null;
            this.membershipBasicRequiredDetails.age = null;
            this.memberCreationForm.get('dateOfBirth')?.reset;
            this.membershipBasicRequiredDetails.admissionDate = null;
            this.membershipBasicRequiredDetails.admissionDateVal = null;
            this.memberCreationForm.get('admissionDate')?.reset;
            this.msgs = [{ severity: 'warning', detail: applicationConstants.DATE_OF_BIRTH_SHOULD_NOT_BE_GREATER_THAN_ADMISSION_DATE }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
        this.ageCaluculation(false);
      }
    }
    this.updateData();
  }


  /**
 * @implements onchange existed prmoter
 * @author bhargavi
 */
  onChangeExistedPrmoter(isExistingMember: any, flag: boolean) {
    this.resetFields();
    if (flag) {
      this.promoterDetailsModel = new GroupPromoterDetailsModel();
      this.promoterDetailsModel.isExistingMember = isExistingMember;
      this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
      this.institutionPromoterDetailsModel.isExistingMember = isExistingMember;
    }
    if (isExistingMember) {
      this.admissionNumberDropDown = true;
      this.promoterDetailsForm.get('surname')?.disable();
      this.promoterDetailsForm.get('name')?.disable();
      // this.promoterDetailsForm.get('operatorTypeId')?.disable();
      this.promoterDetailsForm.get('dob')?.disable();
      this.promoterDetailsForm.get('age')?.disable();
      this.promoterDetailsForm.get('genderId')?.disable();
      this.promoterDetailsForm.get('martialId')?.disable();
      this.promoterDetailsForm.get('mobileNumber')?.disable();
      this.promoterDetailsForm.get('aadharNumber')?.disable();
      this.promoterDetailsForm.get('emailId')?.disable();
      this.promoterDetailsForm.get('startDate')?.disable();
      this.promoterDetailsForm.get('admissionNumber')?.setValidators([Validators.required]);
      this.promoterDetailsForm.get('admissionNumber')?.updateValueAndValidity();
    }
    else {
      this.promoterDetailsForm.get('surname')?.enable();
      this.promoterDetailsForm.get('name')?.enable();
      // this.promoterDetailsForm.get('operatorTypeId')?.enable();
      this.promoterDetailsForm.get('dob')?.enable();
      this.promoterDetailsForm.get('age')?.enable();
      this.promoterDetailsForm.get('genderId')?.enable();
      this.promoterDetailsForm.get('martialId')?.enable();
      this.promoterDetailsForm.get('mobileNumber')?.enable();
      this.promoterDetailsForm.get('aadharNumber')?.enable();
      this.promoterDetailsForm.get('emailId')?.enable();
      this.promoterDetailsForm.get('startDate')?.enable();
      this.promoterDetailsForm.get('admissionNumber')?.setValidators(null);
      this.promoterDetailsForm.get('admissionNumber')?.updateValueAndValidity();
      this.admissionNumberDropDown = false;
    }
  }
  /**
   * @implements reset feilds 
   * @author bhargavi
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
  }

  /**
     * @author bhargavi
     * @implement get member admission Numbers list
     * @argument pacsId,branchId
     */
  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.membershipServiceService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.allTypesOfmembershipList = this.responseModel.data;
            this.admissionNumbersList = this.allTypesOfmembershipList.filter((obj: any) => (obj != null) && obj.memberTypeName == MemberShipTypesData.INDIVIDUAL && obj.statusName == CommonStatusData.APPROVED).map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
              return {
                label: `${relationType.name} - ${relationType.admissionNumber} - ${relationType.memberTypeName}`,
                value: relationType.admissionNumber
              };
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
     * @author bhargavi
     * @implement get member module data by admission Number
     * @argument admissionNumber
     */
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.membershipBasicRequiredDetails = this.responseModel.data[0];

          this.promoterDetailsModel.name = this.membershipBasicRequiredDetails.name,
            this.promoterDetailsModel.surname = this.membershipBasicRequiredDetails.surname;
          this.promoterDetailsModel.aadharNumber = this.membershipBasicRequiredDetails.aadharNumber;
          this.promoterDetailsModel.dob = this.membershipBasicRequiredDetails.dob;
          if (this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
            this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
          this.promoterDetailsModel.age = this.membershipBasicRequiredDetails.age;
          this.promoterDetailsModel.genderId = this.membershipBasicRequiredDetails.genderId;
          this.promoterDetailsModel.martialId = this.membershipBasicRequiredDetails.martialId;
          this.promoterDetailsModel.mobileNumber = this.membershipBasicRequiredDetails.mobileNumber;
          this.promoterDetailsModel.emailId = this.membershipBasicRequiredDetails.emailId;
          this.promoterDetailsModel.startDate = this.membershipBasicRequiredDetails.admissionDate;
          if (this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
            this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);

          this.promoterDetailsModel.uploadImage = this.responseModel.data[0].photoCopyPath;
          this.promoterDetailsModel.uploadSignature = this.responseModel.data[0].signatureCopyPath;

          this.institutionPromoterDetailsModel.uploadImage = this.responseModel.data[0].photoCopyPath;
          this.institutionPromoterDetailsModel.uploadSignature = this.responseModel.data[0].signatureCopyPath;

          if (this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined) {
            this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);
            this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);
            this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
          }
          if (this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined) {
            this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature);
            this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);

            this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
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
   * @implements onselect group leader
   * @param isGroup 
   * @author bhargavi
   */
  onGroupLeaderSelect(isGroup: any, isGroupLeader: any) {
    if (isGroup) {
      if (isGroupLeader) {
        let isGroupLeadeExited = this.promoterDetails.filter((obj: any) => obj.isGroupLeader == true);
        if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length > 0) {
          this.promoterDetailsForm.get('isGroupLeader').reset();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    }
    else {
      if (isGroupLeader) {
        let isGroupLeadeExited = this.institutionPromoter.filter((obj: any) => obj.isGroupLeader == false);
        if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length > 0) {
          this.promoterDetailsForm.get('isGroupLeader').reset();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    }
  }


  /**
* @implements fileUpload for promoter in group
* @param event 
* @param fileUpload 
* @param filePathName 
*/
  fileUploaderForPromoters(event: any, fileUpload: FileUpload, filePathName: any) {
    this.multipleFilesList = [];
    if (this.isEdit && this.promoterDetailsModel.filesDTOList == null || this.promoterDetailsModel.filesDTOList == undefined) {
      this.promoterDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "groupPromoterImage") {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = [];
      // fileUploadPhotoPromoter.clear();
    }
    if (filePathName === "groupPromoterSignature") {
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = [];
      fileUpload.clear();
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let timeStamp = this.commonComponent.getTimeStamp();
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;

        if (filePathName === "groupPromoterImage") {
          files.fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
          this.promoterDetailsModel.filesDTOList.push(files);
          this.promoterDetailsModel.multipartFileListForPhotoCopyPath.push(files);
          this.promoterDetailsModel.uploadImage = null;
          this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.promoterDetailsModel.uploadImage = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "groupPromoterSignature") {
          files.fileName = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE
          this.promoterDetailsModel.filesDTOList.push(files);
          this.promoterDetailsModel.multipartFileListForSignatureCopyPath.push(files);
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
* @implements fileUpload for promoter in institution
* @param event 
* @param fileUpload 
* @param filePathName 
*/
  fileUploaderForInstitutionPromoters(event: any, fileUpload: FileUpload, filePathName: any) {

    if (this.isEdit && this.institutionPromoterDetailsModel.filesDTOList == null || this.institutionPromoterDetailsModel.filesDTOList == undefined) {
      this.institutionPromoterDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "institutionPromoterImage") {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = [];
      fileUpload.clear();
    }
    if (filePathName === "insitutionPromoterSignature") {
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = [];
      // fileUploadInstitutionPromoterSign.clear();
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let timeStamp = this.commonComponent.getTimeStamp();
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;

        if (filePathName === "institutionPromoterImage") {
          files.fileName = "Institution_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
          this.institutionPromoterDetailsModel.filesDTOList.push(files);
          this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath.push(files);
          this.institutionPromoterDetailsModel.uploadImage = null;
          this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.institutionPromoterDetailsModel.uploadImage = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "insitutionPromoterSignature") {
          files.fileName = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
          this.institutionPromoterDetailsModel.filesDTOList.push(files);
          this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath.push(files);
          this.institutionPromoterDetailsModel.uploadSignature = null;
          this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.institutionPromoterDetailsModel.uploadSignature = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements submit group institution details
   * @author bhargavi
   */
  submitGropOrInstitution() {
    this.fdCumulativeApplicationModel.pacsId = this.pacsId;
    this.fdCumulativeApplicationModel.pacsCode = 12;
    this.fdCumulativeApplicationModel.branchId = this.branchId;
    if (this.fdCummulativeAccId != null && this.fdCummulativeAccId != undefined) {
      this.fdCumulativeApplicationModel.statusName = applicationConstants.IS_ACTIVE;
      this.fdCumulativeApplicationService.updateFdCummApplication(this.fdCumulativeApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.fdCummulativeAccId = this.responseModel.data[0].id;
            this.groupOrInstitutionDisable = true;
            this.getFdNonCummApplicationById(this.fdCummulativeAccId);
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: "Membership updated Successfully" }];
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
      this.fdCumulativeApplicationModel.statusName = applicationConstants.IS_ACTIVE;
      this.fdCumulativeApplicationModel.statusName = "In Progress";
      this.fdCumulativeApplicationService.addFdCummApplication(this.fdCumulativeApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.fdCummulativeAccId = this.responseModel.data[0].id;
            this.groupOrInstitutionDisable = true;
            this.getFdNonCummApplicationById(this.fdCummulativeAccId);
          }
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: "Membership Created Successfully" }];
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

  saveInstitutionPrmoters(rowData: any) {
    if (rowData.id != null && rowData.id != undefined) {
      rowData.statusName = applicationConstants.IS_ACTIVE;
      this.fdCumulativeApplicationService.updateInstituionPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.getFdNonCummApplicationById(this.fdCummulativeAccId);
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
    else {
      rowData.statusName = applicationConstants.IS_ACTIVE;
      this.fdCumulativeApplicationService.addInstituionPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.getFdNonCummApplicationById(this.fdCummulativeAccId);
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
   * @implements save group promoters
   * @param rowData 
   * @author bhargavi
   */
  saveGropPromotersDetails(rowData: any) {
    if (rowData.id != null && rowData.id != undefined) {
      this.fdCumulativeApplicationService.updateGroupPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.getFdNonCummApplicationById(this.fdCummulativeAccId);
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
        this.groupPromoters = false;
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
    }
    else {
      rowData.statusName == applicationConstants.ACTIVE;
      this.fdCumulativeApplicationService.addGroupPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.getFdNonCummApplicationById(this.fdCummulativeAccId);
        } else {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
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
* @implements age caluculation
* @param age 
* @author bhargavi
*/
  ageCaluculation(flag: any) {
    if (flag) {//with age to date convertion
      if (this.membershipBasicRequiredDetails.age != null && this.membershipBasicRequiredDetails.age != undefined) {
        if (this.membershipBasicRequiredDetails.age > 0) {

          const currentDate = new Date();  // Get the current date
          const birthYear = currentDate.getFullYear() - this.membershipBasicRequiredDetails.age;  // Subtract the entered age from the current year
          const birthMonth = currentDate.getMonth();  // Keep the current month
          const birthDate = currentDate.getDate();   // Keep the current day

          // Construct the calculated Date of Birth
          const dob = new Date(birthYear, birthMonth, birthDate);

          // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          // Format the Date of Birth to 'DD/Mon/YYYY'
          const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;

          // Format the Date of Birth to YYYY-MM-DD to match the input type="date" format
          this.membershipBasicRequiredDetails.dobVal = formattedDob;
        }
        else {
          this.memberCreationForm.get('age')?.reset();
          this.memberCreationForm.get("dateOfBirth")?.reset();
          this.msgs = [{ severity: 'error', detail: applicationConstants.AGE_SHOULD_NOT_BE_ZERO }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    }
    else {//with date to age convertion
      this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dobVal, this.orgnizationSetting.datePipe);
      if (this.membershipBasicRequiredDetails.dobVal) {
        const dob = new Date(this.membershipBasicRequiredDetails.dobVal);  // Parse the date of birth entered by the user
        const currentDate = new Date();  // Get the current date
        let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
        const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
        if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
          age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
        }
        this.membershipBasicRequiredDetails.age = age;  // Set the calculated age to the class property
      }
    }

  }

  /**
  * @implements map qulaification name
  * @author bhargavi
  */
  onChangeQualificationChange() {
    let qualification = this.tempSubQualificationList.find((data: any) => null != data && this.membershipBasicRequiredDetails.qualificationId != null && data.value == this.membershipBasicRequiredDetails.qualificationId);
    if (qualification != null && undefined != qualification)
      this.membershipBasicRequiredDetails.qualificationName = qualification.label;
  }

  /**
  * @implements map qulaification name
  * @author bhargavi
  */
  onChangeCasteChange() {
    let caste = this.tempSubCasteList.find((data: any) => null != data && this.membershipBasicRequiredDetails.casteId != null && data.value == this.membershipBasicRequiredDetails.casteId);
    if (caste != null && undefined != caste)
      this.membershipBasicRequiredDetails.casteName = caste.label;
  }


  /**
   * @implements age caluculation
   * @param age 
   * @author bhargavi
   */
  promoterageCaluculation(flag: any, isGroupFlag: any) {
    if (isGroupFlag) {
      if (flag) {//with age to date convertion
        if (this.promoterDetailsModel.age != null && this.promoterDetailsModel.age != undefined) {
          if (this.promoterDetailsModel.age > 0) {

            const currentDate = new Date();  // Get the current date
            const birthYear = currentDate.getFullYear() - this.promoterDetailsModel.age;  // Subtract the entered age from the current year
            const birthMonth = currentDate.getMonth();  // Keep the current month
            const birthDate = currentDate.getDate();   // Keep the current day

            // Construct the calculated Date of Birth
            const dob = new Date(birthYear, birthMonth, birthDate);

            // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            // Format the Date of Birth to 'DD/Mon/YYYY'
            const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;

            // Format the Date of Birth to YYYY-MM-DD to match the input type="date" format
            this.promoterDetailsModel.memDobVal = formattedDob;
          }
          else {
            this.promoterDetailsForm.get('age')?.reset();
            this.promoterDetailsForm.get("dateOfBirth")?.reset();
            this.msgs = [{ severity: 'error', detail: applicationConstants.AGE_SHOULD_NOT_BE_ZERO }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      }
      else {
        this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.memDobVal, this.orgnizationSetting.datePipe);
        if (this.promoterDetailsModel.memDobVal) {
          const dob = new Date(this.promoterDetailsModel.memDobVal);
          const currentDate = new Date();  // Get the current date
          let age = currentDate.getFullYear() - dob.getFullYear();
          const m = currentDate.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;
          }
          this.promoterDetailsModel.age = age;
        }
      }
    }
    else {
      if (flag) {
        if (this.institutionPromoterDetailsModel.age != null && this.institutionPromoterDetailsModel.age != undefined) {
          if (this.institutionPromoterDetailsModel.age > 0) {

            const currentDate = new Date();
            const birthYear = currentDate.getFullYear() - this.institutionPromoterDetailsModel.age;  // Subtract the entered age from the current year
            const birthMonth = currentDate.getMonth();
            const birthDate = currentDate.getDate();

            const dob = new Date(birthYear, birthMonth, birthDate);

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;
            this.institutionPromoterDetailsModel.memDobVal = formattedDob;
          }
          else {
            this.promoterDetailsForm.get('age')?.reset();
            this.promoterDetailsForm.get("dateOfBirth")?.reset();
            this.msgs = [{ severity: 'error', detail: applicationConstants.AGE_SHOULD_NOT_BE_ZERO }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      }
      else {
        this.institutionPromoterDetailsModel.memDobVal = this.datePipe.transform(this.institutionPromoterDetailsModel.memDobVal, this.orgnizationSetting.datePipe);
        if (this.institutionPromoterDetailsModel.memDobVal) {
          const dob = new Date(this.institutionPromoterDetailsModel.memDobVal);
          const currentDate = new Date();
          let age = currentDate.getFullYear() - dob.getFullYear();
          const m = currentDate.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;
          }
          this.institutionPromoterDetailsModel.age = age;
        }
      }
    }
  }

  /**
   * @implements onChangCommunity
   * @author bhargavi
   */
  onChangeCommunityChange() {
    let community = this.communityList.find((data: any) => null != data && this.membershipBasicRequiredDetails.communityId != null && data.value == this.membershipBasicRequiredDetails.communityId);
    if (community != null && undefined != community)
      this.membershipBasicRequiredDetails.communityName = community.label;
  }

  /**
   * @implements onChange Occupation
   * @author bhargavi
   */
  onChangeOccupationChange() {
    let occupation = this.occupationTypeList.find((data: any) => null != data && this.membershipBasicRequiredDetails.occupationId != null && data.value == this.membershipBasicRequiredDetails.occupationId);
    if (occupation != null && undefined != occupation)
      this.membershipBasicRequiredDetails.occupationName = occupation.label;
  }

  /**
   * @implements onChange Occupation
   * @author bhargavi
   */
  groupTypeOnChange() {
    let group = this.groupTypes.find((data: any) => null != data && this.memberGroupDetailsModel.groupTypeId != null && data.value == this.memberGroupDetailsModel.groupTypeId);
    if (group != null && undefined != group)
      this.memberGroupDetailsModel.groupName = group.label;
  }

  /**
  * @implements onChange Occupation
  * @author bhargavi
  */
  institutionTypeOnChange() {
    let institution = this.institutionTypes.find((data: any) => null != data && this.membershipInstitutionDetailsModel.institutionType != null && data.value == this.membershipInstitutionDetailsModel.institutionType);
    if (institution != null && undefined != institution)
      this.membershipInstitutionDetailsModel.institutionTypeName = institution.label;
  }

  /**
   * @implements isPoc Check for promoters
   * @param isPoc 
   * @returns 
   */
  isPosCheck(isPoc: any, isGroup: any) {
    if (isGroup) {
      if (this.promoterDetails && this.promoterDetails.length > 0) {
        let duplicate = this.promoterDetails.find(
          (obj: any) =>
            obj && obj.status === applicationConstants.ACTIVE && obj.isPoc === applicationConstants.TRUE
        );
        if (isPoc === applicationConstants.TRUE && duplicate) {
          this.promoterDetailsForm.get("isPoc").reset();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.POC_ALREADY_EXIST }];
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
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.POC_ALREADY_EXIST }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
          return;
        }
      }
    }

  }

  /**
   * @implements on Change of gender Type gender Type nam mapping
   * @author bhargavi
   */
  onGenderChange(genderId: any) {
    this.membershipBasicRequiredDetails.genderName = this.genderList.find((obj: any) => obj.value == genderId)?.label;
  }

  /**
  * @implements on Change of marital status gender Type nam marital status
  * @author bhargavi
  */
  maritalStatusChange(maritalStatusId: any) {
    this.membershipBasicRequiredDetails.maritalStatusName = this.maritalStatusList.find((obj: any) => obj.value == maritalStatusId)?.label;
  }

  /**
   * @implements onChange operation Type
   * @param oprationType 
   * @param isGroup 
   * @author bhargavi
   */
  onChangeOperationType(oprationType: any, isGroup: any) {
    if (isGroup) {
      this.memberGroupDetailsModel.operatorTypeName = this.operatorTypeList.find((obj: any) => obj.value == oprationType)?.label;
    }
    else {
      this.membershipInstitutionDetailsModel.operatorTypeName = this.operatorTypeList.find((obj: any) => obj.value == oprationType)?.label;
    }

  }
}


