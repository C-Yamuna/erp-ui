import { Component, ViewChild } from '@angular/core';
import { GroupPromoterDetails, InstitutionPromoterDetails, MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { CommunityService } from 'src/app/configurations/common-config/community/shared/community.service';
import { CommonStatusData, MemberShipTypesData, membershipProductName } from 'src/app/transcations/common-status-data.json';
import { savingsbanktransactionconstant } from 'src/app/transcations/savings-bank-transcation/savingsbank-transaction-constant';



@Component({
  selector: 'app-ci-loan-new-membership',
  templateUrl: './ci-loan-new-membership.component.html',
  styleUrls: ['./ci-loan-new-membership.component.css']
})
export class CiLoanNewMembershipComponent {
  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  communityList: any[] = [];

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  promoterDetailsModel: GroupPromoterDetails = new GroupPromoterDetails();
  institutionPromoterDetailsModel: InstitutionPromoterDetails = new InstitutionPromoterDetails();
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
  ciLoanApplicationId: any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploadedPhoto: Boolean =false;
  isFileUploadedsignature: Boolean =false;
  groupPromoters: boolean = false;
 

  cancleButtonFlag : Boolean = false;

  promterTypeDisabled : any;

  admissionNumbersList:any[]=[];
  admissionNumberDropDown: boolean = false;

  isExistingMember:Boolean =false;
  institutionPromoterPopUp: boolean = false;
  uploadSignature: boolean = false;

  isFileUploadedPromoterPhoto: boolean = false;
  isFileUploadedPromoterSignature: boolean = false;

  groupOrInstitutionDisable : boolean = false;
  statusList: any []= [];
  trueFalseList: any[] = [];
  groupTypes :any[]=[];
  institutionTypes:any[]=[];
  groupedQualificationSubQualification: any[]=[];
  subQualificationList: any[]=[];
  tempSubQualificationList: any[]=[];
  tempSubCasteList: any[]=[];
  groupedCasteSubCaste: any[]=[];
  subCasteList: any[]=[];
  today :any;
  subProductList: any[]=[];

  
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private ciLoanApplicationService: CiLoanApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private membershipServiceService: MembershipServiceService , private fileUploadService :FileUploadService,private communityService: CommunityService) {
      this.memberCreationForm = this.formBuilder.group({
        "subProductId": new FormControl('', Validators.required),
        "surName":  new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        "name":  new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        "gender": new FormControl('', Validators.required),
        "dateOfBirth": new FormControl('', Validators.required),
        "age":  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
        "maritalStatus": new FormControl('', Validators.required),
        "relationWithMember": ['', [Validators.pattern(applicationConstants.ALPHA_NAME_PATTERN), Validators.compose([Validators.required])]],
        "relationName": new FormControl('', Validators.required),
        "aadharNumber":  new FormControl('', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.maxLength(40)]),
        "panNumber":  new FormControl('', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.maxLength(40)]),
        "mobileNumber":  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
        "occupation": new FormControl('', Validators.required),
        "community": new FormControl('', Validators.required),
        "quslification": new FormControl('', Validators.required),
        "caste": new FormControl('', Validators.required),
        "email":  new FormControl('', [Validators.pattern(applicationConstants.EMAIL_PATTERN), Validators.maxLength(40)]),
        "admissionDate": new FormControl('', Validators.required),
        "isStaff": new FormControl('', Validators.required),
        "fileUpload" : new FormControl('',),
        "admissionFee":  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
        "societyAdmissionNumber":  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
        "mcrNumber":  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
      })
      this.groupForm = this.formBuilder.group({
        "subProductId": new FormControl('', Validators.required),
        "name":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        "registrationNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
        "registrationDate": new FormControl('', Validators.required),
        "admissionDate": new FormControl('', Validators.required),
        // pocNumber: ['', Validators.required],
        // "mobileNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(40)]),
        "panNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.maxLength(40)]),
        "tanNumber":  new FormControl('', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.maxLength(40)]),
        "gstNumber":  new FormControl('', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.maxLength(40)]),
        // "pocName":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        "groupType": new FormControl('', Validators.required),
        "societyAdmissionNumber":  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
        "operatorTypeId":new FormControl('', Validators.required),
  
      })
      this.institutionForm = this.formBuilder.group({
        "subProductId": new FormControl('', Validators.required),
        "name":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        "registrationNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
        "registrationDate": new FormControl('', Validators.required),
        "admissionDate": new FormControl('', Validators.required),
        // pocName: ['', Validators.required],
        // "mobileNumber": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(40)]),
        "panNumber": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.maxLength(40)]),
        "tanNumber": new FormControl('', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.maxLength(40)]),
        "gstNumber": new FormControl('', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.maxLength(40)]),
        // "pocName": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        "institutionType": new FormControl('',Validators.required),
        "societyAdmissionNumber": new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS), Validators.maxLength(40)]),
        "operatorTypeId":new FormControl('', Validators.required),
      })
      this.promoterDetailsForm = this.formBuilder.group({
        "surname":  new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        "name": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
        // "operatorTypeId": new FormControl('',),
        "dob": new FormControl('', Validators.required),
        "age": new FormControl('', Validators.required),
        "genderId": new FormControl('', Validators.required),
        "martialId": new FormControl('', Validators.required),
        "mobileNumber": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(40)]),
        "aadharNumber": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.maxLength(40)]),
        "emailId": new FormControl('', [Validators.pattern(applicationConstants.EMAIL_PATTERN), Validators.maxLength(40)]),
        "startDate": new FormControl('', Validators.required),
        "promterType": new FormControl('',),
        "isGroupLeader" : new FormControl('', Validators.required),
        "admissionNumber" : new FormControl('',),
        "photoUpload" : new FormControl('',),
        "ignatureUpload" : new FormControl('',),
        "authorizedSignatory": new FormControl('', Validators.required),
        "isPoc":new FormControl('',Validators.required),
        'endDate': new FormControl(''),
      })
      this.today = new Date();//for future date set to disable
    }
  
  
    ngOnInit(): void {
      this.  membershipBasicDetailsModel.filesDTOList = [];
      this.pacsId = 1;
      this.branchId = 1;
      this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
      this.orgnizationSetting = this.commonComponent.orgnizationSettings()
      this.maritalStatusList = this.commonComponent.maritalStatusList();
      this.statusList = this.commonComponent.requiredlist();
      this.trueFalseList = this.commonComponent.requiredlist();
    
      this.groupTypes  = [
        { label: "Self Help Group", value:1 },
        { label: "Rythu Mitra", value:2 }
      ]
      
      this.institutionTypes= [
        { label: "Self Help Group", value:1 },
        { label: "Rythu Mitra", value:2 }
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
      this.getAllTypeOfMembershipDetails(this.pacsId , this.branchId);
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.commonComponent.startSpinner();
          this.ciLoanApplicationId = this.encryptDecryptService.decrypt(params['id']);
          this.getCiLoanApplicationsById(this.ciLoanApplicationId);
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
   * @author jyothi.naidana
   */
  getAllSubProducts() {
    this.commonComponent.startSpinner();
    this.ciLoanApplicationService.getAllSubProduct().subscribe((res: any) => {
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
     * @author jyothi.naidana
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
                this.ciLoanApplicationModel = this.responseModel.data[0];
                if (this.ciLoanApplicationModel.individualMemberDetailsDTO != null && this. ciLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                  this.membershipBasicDetailsModel = this. ciLoanApplicationModel.individualMemberDetailsDTO;
                  if(this.membershipBasicDetailsModel.memberTypeId != undefined && this.membershipBasicDetailsModel.memberTypeId){
                    this.memberTypeId = this.membershipBasicDetailsModel.memberTypeId;
                  }
  
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
                  this.disableMemberType = true;

                }
                if (this. ciLoanApplicationModel.memberGroupDetailsDTO != null && this. ciLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                  this.membershipGroupDetailsModel = this. ciLoanApplicationModel.memberGroupDetailsDTO;
                  this.groupOrInstitutionDisable = false;
                  if(this.membershipGroupDetailsModel.memberTypeId != undefined && this.membershipGroupDetailsModel.memberTypeId){
                    this.memberTypeId = this.membershipGroupDetailsModel.memberTypeId;
                  }
  
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
                      if(groupPromoters.endDate != null && groupPromoters.endDate != undefined){
                        groupPromoters.endDateVal  = this.datePipe.transform(groupPromoters.endDate, this.orgnizationSetting.datePipe);
                      }
                      if(groupPromoters.genderId != null && groupPromoters.genderId != undefined){
                        let Obj = this.genderList.filter(obj => obj.value == groupPromoters.genderId);
                        if(Obj != null && Obj != undefined ){
                          groupPromoters.genderName = Obj[0].label ;
                        }
                      }
                      if(groupPromoters.authorizedSignatory != null && groupPromoters.authorizedSignatory != undefined && groupPromoters.authorizedSignatory){
                        groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                      }
                      else {
                        groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                      }
                    }
                  }
                  this.disableMemberType = true;

                }
                if (this. ciLoanApplicationModel.memberInstitutionDTO != null && this. ciLoanApplicationModel.memberInstitutionDTO != undefined) {
                  this.membershipInstitutionDetailsModel = this. ciLoanApplicationModel.memberInstitutionDTO;
                  this.groupOrInstitutionDisable = false;
                  if(this.membershipInstitutionDetailsModel.memberTypeId != undefined && this.membershipInstitutionDetailsModel.memberTypeId){
                    this.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;
                  }
  
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
                      if(institution.endDate != null && institution.endDate != undefined){
                        institution.endDateVal  = this.datePipe.transform(institution.endDate, this.orgnizationSetting.datePipe);
                      }
                      if(institution.genderId != null && institution.genderId != undefined){
                        let Obj = this.genderList.filter(obj => obj.value == institution.genderId);
                        if(Obj != null && Obj != undefined ){
                          institution.genderName = Obj[0].label ;
                        }
                      }
                      if(institution.authorizedSignatory != null && institution.authorizedSignatory != undefined && institution.authorizedSignatory){
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
      * @author jyothi.naidana
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
     * @author jyothi.naidana
     */
    updateData() {
      this.  ciLoanApplicationModel.memberTypeId = this.memberTypeId;
      if (this.memberTypeName == "Individual") {
        this.individualFlag = true;
        this.isDisableFlag = (!this.memberCreationForm.valid) || !(this.isFileUploadedPhoto && this.isFileUploadedsignature)
        this.  ciLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.  membershipBasicDetailsModel.memberTypeName = this.memberTypeName;
        this.  membershipBasicDetailsModel.isNewMember = this.showForm;
        this.  ciLoanApplicationModel.individualMemberDetailsDTO = this.  membershipBasicDetailsModel;
      }
      if (this.memberTypeName == "Group") {
        this.groupFlag = true;
        this.isDisableFlag = (!(this.groupForm.valid && (this.membershipGroupDetailsModel.groupPromoterList != null && this.  membershipGroupDetailsModel.groupPromoterList != undefined && this.  membershipGroupDetailsModel.groupPromoterList.length  >=2))) || this.groupPromoters
        this.membershipGroupDetailsModel.memberTypeId = this.memberTypeId;
        this.membershipGroupDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipGroupDetailsModel.isNewMember = this.showForm;
        this.ciLoanApplicationModel.memberGroupDetailsDTO = this.  membershipGroupDetailsModel;
        this.ciLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.addButton = !this.groupForm.valid;
      }
      if (this.memberTypeName == "Institution") {
        this.institutionFlag = true;
        this.isDisableFlag = (!(this.institutionForm.valid &&(this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length >0)))|| this.institutionPromoterPopUp
        this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
        this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
        this.  ciLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.  ciLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
        this.addButton = !this.institutionForm.valid;
    }
     
      this.  ciLoanApplicationService.changeData({
        formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
        data: this.  ciLoanApplicationModel,
        isDisable: this.isDisableFlag,
        stepperIndex: 0,
      });
    }
    /**
     * @implements update save
     * @author jyothi.naidana
     */
    save() {
      this.updateData();
    }
  
    /**
     * @implements on Change Relation Type
     * @author jyothi.naidana
     */
    onChangeRelationTypeChange(event: any) {
      const filteredItem = this.relationTypesList.find(item => item.value === event.value);
      this.  membershipBasicDetailsModel.relationTypeName = filteredItem.label;
  
    }
    /**
     * @implements get getAll relation Types
     * @author jyothi.naidana
     */
    getAllRelationTypes() {
      this.  ciLoanApplicationService.getAllRelationTypes().subscribe((res: any) => {
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
     * @author jyothi.naidana
     */
    getAllOccupationTypes() {
      this.  ciLoanApplicationService.getAllOccupationTypesList().subscribe((res: any) => {
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
     * @author jyothi.naidana
     */
    getAllQualificationType() {
      this.  ciLoanApplicationService.getAllQualificationSubQualification().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.qualificationTypes = this.responseModel.data;
          this.groupedQualificationSubQualification = this.responseModel.data.filter((qualification:any) => qualification.status == applicationConstants.ACTIVE).map((count:any) => {
            this.subQualificationList = [];
            count.subQualificationList.filter((subCaste:any) => subCaste.status == applicationConstants.ACTIVE).map((subCount:any) => {
              this.subQualificationList.push({ label: subCount.name, value: subCount.id})
              this.tempSubQualificationList.push({ label: subCount.name, value: subCount.id})
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
   * @author jyothi.naidana
   */
  getCastesList() {
    this.ciLoanApplicationService.getAllCasteSubCaste().subscribe((res: any) => {
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
     * @author jyothi.naidana
     */
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.ciLoanApplicationService.getMemberShipBasicDetailsFromLoansModule(admisionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.  membershipBasicDetailsModel = this.responseModel.data[0];
              if (this.  membershipBasicDetailsModel.dob != null && this.  membershipBasicDetailsModel.dob != undefined) {
                this.  membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.  membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.  membershipBasicDetailsModel.admissionDate != null && this.  membershipBasicDetailsModel.admissionDate != undefined) {
                this.  membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.  membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if(this.  membershipBasicDetailsModel.memberTypeId != undefined && this.  membershipBasicDetailsModel.memberTypeId){
                this.memberTypeId = this.  membershipBasicDetailsModel.memberTypeId;
              }
              if (this.  membershipBasicDetailsModel.photoCopyPath != null && this.  membershipBasicDetailsModel.photoCopyPath != undefined) {
                this.  membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.  membershipBasicDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.  membershipBasicDetailsModel.photoCopyPath  );
                this.isFileUploadedPhoto = applicationConstants.TRUE;
              }
              if (this.  membershipBasicDetailsModel.signatureCopyPath != null && this.  membershipBasicDetailsModel.signatureCopyPath != undefined) {
                this.  membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.  membershipBasicDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.  membershipBasicDetailsModel.signatureCopyPath  );
                this.isFileUploadedsignature = applicationConstants.TRUE;
              }
              this.  ciLoanApplicationModel.individualMemberDetailsDTO = this.  membershipBasicDetailsModel;
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
     * @author jyothi.naidana
     */
    getGroupByAdmissionNumber(admissionNumber: any) {
      this.  ciLoanApplicationService.getMemberShipGroupDetailsFromLoansModule(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length != null && this.responseModel.data.length != undefined && this.responseModel.data.length > 0) {
              this.  membershipGroupDetailsModel = this.responseModel.data[0];
              this.groupOrInstitutionDisable = false;
              if (this.  membershipGroupDetailsModel.registrationDate != null && this.  membershipGroupDetailsModel.registrationDate != undefined) {
                this.  membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.  membershipGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.  membershipGroupDetailsModel.admissionDate != null && this.  membershipGroupDetailsModel.admissionDate != undefined) {
                this.  membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.  membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.  membershipGroupDetailsModel.memberTypeId != null && this.  membershipGroupDetailsModel.memberTypeId != undefined) {
                this.memberTypeId = this.  membershipGroupDetailsModel.memberTypeId;
              }
             
                if (this.  membershipGroupDetailsModel.groupPromoterList != null && this.  membershipGroupDetailsModel.groupPromoterList != undefined && this.  membershipGroupDetailsModel.groupPromoterList.length > 0) {
                  this.promoterDetails = this.  membershipGroupDetailsModel.groupPromoterList;
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
                      if(Obj != null && Obj != undefined ){
                        groupPromoters.genderName = Obj[0].label ;
                      }
                    }
                    if(groupPromoters.authorizedSignatory != null && groupPromoters.authorizedSignatory != undefined && groupPromoters.authorizedSignatory){
                      groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                    }
                    else {
                      groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                    }
                  }
                }
                if(this.  membershipGroupDetailsModel.memberTypeName != null && this.  membershipGroupDetailsModel.memberTypeName != undefined){
                  this.  ciLoanApplicationModel.memberTypeName = this.  membershipGroupDetailsModel.memberTypeName;
                }
                if(this.  membershipGroupDetailsModel != null && this.  membershipGroupDetailsModel != undefined){
                this.  ciLoanApplicationModel.memberGroupDetailsDTO = this.  membershipGroupDetailsModel;
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
     * @author jyothi.naidana
     */
    getInstitutionByAdmissionNumber(admissionNumber: any) {
      this.  ciLoanApplicationService.getMemberShipInstitutionDetailsFromLoansModule(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length != null && this.responseModel.data.length != undefined && this.responseModel.data.length > 0 ) {
              this.membershipInstitutionDetailsModel = this.responseModel.data[0];
              this.groupOrInstitutionDisable = false;
              if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined) {
                this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
                this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if(this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined){
                this.memberTypeId = this.memberTypeId;
              }
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
                    if(Obj != null && Obj != undefined ){
                      institution.genderName = Obj[0].label ;
                    }
                  }
                  if(institution.authorizedSignatory != null && institution.authorizedSignatory != undefined && institution.authorizedSignatory){
                    institution.authorizedSignatoryName = applicationConstants.YES;
                  }
                  else {
                    institution.authorizedSignatoryName = applicationConstants.YES;
                  }
                }
              }
              this.  ciLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
              this.  ciLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
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
     * @author jyothi.naidana
     */
    OnChangeMemberType(event: any) {
      const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === event.value);
      this.memberTypeName = filteredItem.label;
      if (event.value == 1) {
        this.individualFlag = true;
        this.institutionFlag = false;
        this.groupFlag = false;
        this.membershipBasicDetailsModel.memberTypeId = 1;
        this.ciLoanApplicationModel.memberTypeId = 1;

        this.ciLoanApplicationModel.memberGroupDetailsDTO = null;
        this.membershipGroupDetailsModel = new MembershipGroupDetails();
        this.membershipInstitutionDetailsModel = new MemInstitutionDetails();
        this.ciLoanApplicationModel.memberInstitutionDTO = null;
        this.groupForm.reset();
        this.institutionForm.reset();
      }
      else if (event.value == 2) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.groupFlag = true;
        this.individualFlag = false;
        this.institutionFlag = false;
        this.  membershipGroupDetailsModel.memberTypeId = 2;
        this.  ciLoanApplicationModel.memberTypeId =2;

        // refressing the form with data
        this.ciLoanApplicationModel.individualMemberDetailsDTO = null;
        this.ciLoanApplicationModel.memberInstitutionDTO = null;
        this.memberCreationForm.reset();
        this.institutionForm.reset();
        this.membershipBasicDetailsModel = new MembershipBasicDetails();
        this.membershipInstitutionDetailsModel = new MemInstitutionDetails();
      }
      else if (event.value == 3) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.institutionFlag = true;
        this.individualFlag = false;
        this.groupFlag = false;
        this.membershipInstitutionDetailsModel.memberTypeId = 3;
        this.ciLoanApplicationModel.memberTypeId =3;

        this.ciLoanApplicationModel.memberInstitutionDTO = null;
        this.ciLoanApplicationModel.individualMemberDetailsDTO = null;
        this.membershipBasicDetailsModel = new MembershipBasicDetails();;
        this.membershipGroupDetailsModel = new MembershipGroupDetails();
        this.groupForm.reset();
        this.memberCreationForm.reset();
      }
      this.updateData();
    }
  
  
   /**
    * @implements save group prmoters
    * @param rowData 
    * @author jyothi.naidana
    */
    savePromoterDetails(rowData: any) {
      rowData.pacsId = 1;
      rowData.status = applicationConstants.ACTIVE;
      this.addButton = false;
      this.EditDeleteDisable = false;
      if(rowData.memDobVal != null && rowData.memDobVal != undefined){
        rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal) );
      }
      if (rowData.dob != null && rowData.dob != undefined) {
        rowData.memDobVal  = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);
      }
      if(rowData.startDateVal != null && rowData.startDateVal != undefined){
        rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal) );
      }
      if(rowData.endDateVal != null && rowData.endDateVal != undefined){
        rowData.endDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDateVal) );
      }
      if(rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory){
        rowData.authorizedSignatoryName = applicationConstants.YES;
      }
      else {
        rowData.authorizedSignatoryName = applicationConstants.NO;
      }
      if (rowData.startDate != null && rowData.startDate != undefined) {
        rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
      }
      if(rowData.endDate != null && rowData.endDate != undefined){
        rowData.endDateVal  = this.datePipe.transform(rowData.endDate, this.orgnizationSetting.datePipe);
      }
      if (!this.  membershipGroupDetailsModel.groupPromotersDTOList) {
        this.  membershipGroupDetailsModel.groupPromotersDTOList = []; // Initialize it as an empty array
      }
      let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
      if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
        rowData.operatorTypeName = Object.label;
      }
      Object = this.genderList.find((obj:any)=>obj.value == rowData.genderId);
      if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
        rowData.genderName = Object.label;
      }
      Object = this.maritalStatusList.find((obj:any)=>obj.value == rowData.martialId);
      if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
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
      //   this.  membershipGroupDetailsModel.groupPromoterList = this.promoterDetails;
      // }else{
      //   this.promoterDetails.push(rowData);
      //   this.  membershipGroupDetailsModel.groupPromoterList = this.promoterDetails;
      // }
      rowData.groupId = this.  membershipGroupDetailsModel.id;
      this.saveGropPromotersDetails(rowData);
      
    }
  
    /**
     * @implements cancle prmoters
     * @author jyothi.naidana
     * @param falg 
     */
    cancelPromoter(falg:Boolean) {
      this.addButton = false;
      this.groupPromoters = false;
      this.EditDeleteDisable = false;
      this.promoterDetails;
      this.updateData();
    }
    
     /**
   * @implements edit promoters
   * @param rowData 
   * @author jyothi.naidana
   */
  editPromoter(rowData: any) {
    this.cancleButtonFlag = true;
    this.addButton = true;
    this.EditDeleteDisable = true;
    this.groupPromoters = true;
    this.promoterDetailsModel = new GroupPromoterDetails();
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
    if(this.promoterDetailsModel.isExistingMember ){
      this.admissionNumberDropDown = true;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage);
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature);
    }
    else{
      this.admissionNumberDropDown = false;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage );
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature);
    }
    this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
    this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
    
    this.updateData();
  }
  
    /**
     * @implements row add of group promoters
     * @author jyothi.naidana
     */
    onRowAddSave() {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.groupPromoters = true;
      this.cancleButtonFlag = false;
      this.promoterDetailsModel = new GroupPromoterDetails();
      this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
      this.promoterDetailsForm.reset();
      this.onChangeExistedPrmoter(false , true);
      this.admissionNumberDropDown = false;
      this.updateData();
      
    }
    /**
     * @implements get all operator Details
     * @author jyothi.naidana
     */
    getAllOperatorTypes() {
      this.commonComponent.startSpinner();
      this.  ciLoanApplicationService.getAllOperationTypes().subscribe((res: any) => {
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
            this.promoterDetailsModel.operationTypeName = relation.label;
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
     * @author jyothi.naidana
     */
    saveInstitutionPromoterDetails(rowData: any) {
      this.institutionPromoterPopUp = false;
      this.cancleButtonFlag = false
      rowData.pacsId = 1;
      rowData.status = applicationConstants.ACTIVE;
      this.addButton = false;
      this.EditDeleteDisable = false;
  
      if(rowData.memDobVal != null && rowData.memDobVal != undefined){
        rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal) );
      }
      if (rowData.dob != null && rowData.dob != undefined) {
        rowData.memDobVal  = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);
      }
      if(rowData.startDateVal != null && rowData.startDateVal != undefined){
        rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal) );
      }
      if(rowData.endDateVal != null && rowData.endDateVal != undefined){
        rowData.endDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDateVal) );
      }
      if(rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory){
        rowData.authorizedSignatoryName = applicationConstants.YES;
      }
      else {
        rowData.authorizedSignatoryName = applicationConstants.NO;
      }
      if (rowData.startDate != null && rowData.startDate != undefined) {
        rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
      }
      if(rowData.endDate != null && rowData.endDate != undefined){
        rowData.endDateVal = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDate) );
      }
      let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
      if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
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
     * @author jyothi.naidana
     */
    cancelInstitutionPromoter(falg : Boolean) {
      this.addButton = false;
      this.EditDeleteDisable = false;
      this.institutionPromoterPopUp = false;
      this.institutionPromoter;
      this.updateData();
    }
  
    /**
   * @implements edit institution promoters
   * @param rowData 
   * @author jyothi.naidana
   */
  editInstitutionPromoter(rowData: any) {
    this.cancleButtonFlag = false;
    this.addButton = true;
    this.EditDeleteDisable = true;
    this.institutionPromoterPopUp = true;
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetails();
    // First, assign the data
    this.promoterDetailsModel = { ...rowData };
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
    this.institutionPromoterDetailsModel = rowData;
    if(this.institutionPromoterDetailsModel.isExistingMember ){
      this.admissionNumberDropDown = true;

      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage  );
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );
    }
    else{
      this.admissionNumberDropDown = false;
      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage  );
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );
    }
   
    this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
    this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
   
    this.updateData();
  }
    /**
     * @implements on institution promoter add
     * @author jyothi.naidana
     */
    onRowAddInstitution() {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.institutionPromoterPopUp = true;
      this.cancleButtonFlag = true;
      let uniqueId = this.institutionPromoter.length + 1
      this.institutionPromoterDetailsModel = new InstitutionPromoterDetails();
      this.institutionPromoterDetailsModel.uniqueId = uniqueId; 
      this.promoterDetailsForm.reset();
      this.admissionNumberDropDown = false;
      this.updateData();
    }
  
    /**
     * @implements get All member types 
     * @author jyothi.naidana
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
          if(filteredItem != null && filteredItem != undefined && filteredItem.label != null && filteredItem.label != undefined){
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
     * @author jyothi.naidana
     */
    membershipDataFromCIModule() {
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
   * @author jyothi.naidana
   */
  fileUploader(event: any, fileUploadPhoto: FileUpload, fileUploadSign: FileUpload, filePathName: any) {
    this.multipleFilesList = [];
    if(this.isEdit && this.membershipBasicDetailsModel.filesDTOList == null || this.membershipBasicDetailsModel.filesDTOList == undefined){
      this.membershipBasicDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "individualPhotoCopy") {
      this.isFileUploadedPhoto = applicationConstants.FALSE;
      this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = [];
      // Clear file input before processing files
      fileUploadPhoto.clear();
    }
    if (filePathName === "individualSighnedCopy") {
      this.isFileUploadedsignature = applicationConstants.FALSE;
      this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = [];
      fileUploadSign.clear();
    }
   
    let files: FileUploadModel = new FileUploadModel();
    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let timeStamp = this.commonComponent.getTimeStamp();
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        // files.fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        this.multipleFilesList.push(files);
         // Add to filesDTOList array
        if (filePathName === "individualPhotoCopy") {
          files.fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.isFileUploadedPhoto = applicationConstants.TRUE;
          this.membershipBasicDetailsModel.filesDTOList.push(files);
          this.membershipBasicDetailsModel.multipartFileListForPhotoCopy.push(files);
          this.membershipBasicDetailsModel.photoCopyPath = null;
          this.membershipBasicDetailsModel.filesDTOList[this.membershipBasicDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicDetailsModel.photoCopyPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        if (filePathName === "individualSighnedCopy") {
          this.isFileUploadedsignature = applicationConstants.TRUE;
          this.membershipBasicDetailsModel.filesDTOList.push(files);
          this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath.push(files);
          this.membershipBasicDetailsModel.signatureCopyPath = null;
          this.membershipBasicDetailsModel.filesDTOList[this.membershipBasicDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
          this.membershipBasicDetailsModel.signatureCopyPath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        }
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  
    /**
     * @implements onFileremove from file value
     * @param fileName 
     * @author jyothi.naidana
     */
    fileRemoeEvent(fileName: any) {
        if (this.  membershipBasicDetailsModel.filesDTOList != null && this.  membershipBasicDetailsModel.filesDTOList != undefined && this.  membershipBasicDetailsModel.filesDTOList.length > 0) {
          if (fileName == "individualPhotoCopy") {
            this.isFileUploadedPhoto = applicationConstants.FALSE;
          let removeFileIndex = this.  membershipBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.  membershipBasicDetailsModel.photoCopyPath);
          let obj = this.  membershipBasicDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.  membershipBasicDetailsModel.photoCopyPath);
          this.  membershipBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.  membershipBasicDetailsModel.photoCopyPath = null;
        }
        if (fileName == "individualSighnedCopy") {
          this.isFileUploadedsignature = applicationConstants.FALSE;
          let removeFileIndex = this.  membershipBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.  membershipBasicDetailsModel.signatureCopyPath);
          let obj = this.  membershipBasicDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.  membershipBasicDetailsModel.signatureCopyPath);
          this.  membershipBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.  membershipBasicDetailsModel.signatureCopyPath = null;
        }
        this.updateData();
      }
      if(this.promoterDetailsModel.filesDTOList != null && this.promoterDetailsModel.filesDTOList  != undefined && this.promoterDetailsModel.filesDTOList .length >0){
       
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
      if(this.institutionPromoterDetailsModel.filesDTOList != null && this.institutionPromoterDetailsModel.filesDTOList != undefined && this.institutionPromoterDetailsModel.filesDTOList.length >0){
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
   * @author jyothi.naidana
   */
  dateConverstion() {
    //group dates
    if(this.membershipGroupDetailsModel.admissionDateVal != undefined && this.membershipGroupDetailsModel.registrationDateVal != undefined){
      if( new Date(this.membershipGroupDetailsModel.admissionDateVal) <  new Date(this.membershipGroupDetailsModel.registrationDateVal)){
        this.groupForm.get('registrationDate')?.reset();
        this.groupForm.get('admissionDate')?.reset();
        this.groupForm.updateValueAndValidity();
        this.msgs = [{ severity: 'warning', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
        setTimeout(() => {
          this.msgs = [];        
        }, 2000);
      }
    }
    if (this.membershipGroupDetailsModel != null && this.membershipGroupDetailsModel != undefined) {
      if (this.membershipGroupDetailsModel.admissionDateVal != null && this.membershipGroupDetailsModel.admissionDateVal != undefined) {
        this.membershipGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.admissionDateVal));
      }
      if (this.membershipGroupDetailsModel.registrationDateVal != null && this.membershipGroupDetailsModel.registrationDateVal != undefined) {
        this.membershipGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipGroupDetailsModel.registrationDateVal));
      }
    }

    //individual membershipdates
    if (this.membershipBasicDetailsModel != null && this.membershipBasicDetailsModel != undefined) {
      if (this.membershipBasicDetailsModel.admissionDateVal != null && this.membershipBasicDetailsModel.admissionDateVal != undefined) {
        this.membershipBasicDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.admissionDateVal));
        if(this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined){
          if(this.membershipBasicDetailsModel.dob > this.membershipBasicDetailsModel.admissionDate){
            this.membershipBasicDetailsModel.dob = null;
            this.membershipBasicDetailsModel.dobVal = null;
            this.membershipBasicDetailsModel.age = null;
            this.memberCreationForm.get('dateOfBirth')?.reset;
            this.membershipBasicDetailsModel.admissionDate = null;
            this.membershipBasicDetailsModel.admissionDateVal = null;
            this.memberCreationForm.get('admissionDate')?.reset;
            this.msgs = [{ severity: 'warning', detail: savingsbanktransactionconstant.DATE_OF_BIRTH_SHOUL_NOT_BE_GREATER_THAN_ADMISSION_DATE }];
            setTimeout(() => {
              this.msgs = [];        
            }, 2000);
          }
        }
      }
      if (this.membershipBasicDetailsModel.dobVal != null && this.membershipBasicDetailsModel.dobVal != undefined) {//dob 
        this.membershipBasicDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.dobVal));//doc conversion
        if(this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined){//dob with admission date check
          if(this.membershipBasicDetailsModel.dob > this.membershipBasicDetailsModel.admissionDate){
            this.membershipBasicDetailsModel.dob = null;
            this.membershipBasicDetailsModel.dobVal = null;
            this.membershipBasicDetailsModel.age = null;
            this.memberCreationForm.get('dateOfBirth')?.reset;
            this.membershipBasicDetailsModel.admissionDate = null;
            this.membershipBasicDetailsModel.admissionDateVal = null;
            this.memberCreationForm.get('admissionDate')?.reset;
            this.msgs = [{ severity: 'warning', detail: savingsbanktransactionconstant.DATE_OF_BIRTH_SHOUL_NOT_BE_GREATER_THAN_ADMISSION_DATE }];
            setTimeout(() => {
              this.msgs = [];        
            }, 2000);
          }
        }
        this.ageCaluculation(false);
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
    
    this.updateData();
  }

  
    /**
   * @implements onchange existed prmoter
   * @author jyothi.naidana
   */
  onChangeExistedPrmoter(isExistingMember :any ,flag :boolean){
    this.resetFields();
    if(flag){
      this.promoterDetailsModel = new GroupPromoterDetails();
      this.promoterDetailsModel.isExistingMember = isExistingMember;
      this.institutionPromoterDetailsModel = new InstitutionPromoterDetails();
      this.institutionPromoterDetailsModel.isExistingMember = isExistingMember;
    }
    if(isExistingMember){
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
     * @author jyothi.naidana
     */
    resetFields(){
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
     * @author jyothi.naidana
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
     * @author jyothi.naidana
     * @implement get member module data by admission Number
     * @argument admissionNumber
     */
  getMemberDetailsByAdmissionNUmber(admissionNumber: any ) {
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0) {
          this.  membershipBasicDetailsModel = this.responseModel.data[0];
          
         this.promoterDetailsModel.name  = this.  membershipBasicDetailsModel.name,
         this.promoterDetailsModel.surname  = this.  membershipBasicDetailsModel.surname;
         this.promoterDetailsModel.aadharNumber  = this.  membershipBasicDetailsModel.aadharNumber;
         this.promoterDetailsModel.dob  = this.  membershipBasicDetailsModel.dob;
         if(this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
          this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
         this.promoterDetailsModel.age  = this.  membershipBasicDetailsModel.age;
         this.promoterDetailsModel.genderId  = this.  membershipBasicDetailsModel.genderId;
         this.promoterDetailsModel.martialId  = this.  membershipBasicDetailsModel.martialId;
         this.promoterDetailsModel.mobileNumber  = this.  membershipBasicDetailsModel.mobileNumber;
         this.promoterDetailsModel.emailId  = this.  membershipBasicDetailsModel.emailId;
         this.promoterDetailsModel.startDate  = this.  membershipBasicDetailsModel.admissionDate;
         if(this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
          this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
  
         this.promoterDetailsModel.uploadImage = this.  membershipBasicDetailsModel.photoCopyPath;
         this.promoterDetailsModel.uploadSignature = 	this.  membershipBasicDetailsModel.signatureCopyPath;
  
         this.institutionPromoterDetailsModel.uploadImage =  this.  membershipBasicDetailsModel.photoCopyPath;
         this.institutionPromoterDetailsModel.uploadSignature =  	this.  membershipBasicDetailsModel.signatureCopyPath;
  
        if(this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined){
          this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
          this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
          this.isFileUploadedPromoterPhoto= applicationConstants.TRUE;
        }
        if(this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined){
          this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
          this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );

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
   * @author jyothi.naidana
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
        let isGroupLeadeExited = this.institutionPromoter.filter((obj: any) => obj.isGroupLeader == true);
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
  fileUploaderForPromoters(event: any, fileUploadPhotoPromoter: FileUpload,fileUpload: FileUpload, filePathName: any) {
    this.multipleFilesList = [];
    if(this.isEdit && this.promoterDetailsModel.filesDTOList == null || this.promoterDetailsModel.filesDTOList == undefined){
      this.promoterDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "groupPromoterImage") {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = [];
      fileUploadPhotoPromoter.clear();
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
  fileUploaderForInstitutionPromoters(event: any, fileUploadInstitutionPromoterSign: FileUpload, fileUpload: FileUpload, filePathName: any) {

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
      fileUploadInstitutionPromoterSign.clear();
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
     * @author jyothi.naidana
     */
    submitGropOrInstitution() {
      this.ciLoanApplicationModel.pacsId = this.pacsId;
      this.ciLoanApplicationModel.pacsCode = 12;
      this.ciLoanApplicationModel.branchId = this.branchId;
      if (this.ciLoanApplicationId != null && this.  ciLoanApplicationId != undefined) {
        this.ciLoanApplicationModel.statusName = applicationConstants.IS_ACTIVE;
        this.ciLoanApplicationService.updateCiLoanApplications(this.ciLoanApplicationModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
             this.  ciLoanApplicationId =  this.responseModel.data[0].id;
             this.groupOrInstitutionDisable = true;
             this.getCiLoanApplicationsById(this.  ciLoanApplicationId);
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
        this.ciLoanApplicationModel.statusName = applicationConstants.IS_ACTIVE;
        this.ciLoanApplicationModel.accountStatusName = "In Progress";
        this.ciLoanApplicationService.addCiLoanApplications(this.  ciLoanApplicationModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.  ciLoanApplicationId =  this.responseModel.data[0].id;
              this.groupOrInstitutionDisable = true;
              this.getCiLoanApplicationsById(this.  ciLoanApplicationId);
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
  
    saveInstitutionPrmoters(rowData:any){
      if (rowData.id != null && rowData.id != undefined) {
        rowData.statusName = applicationConstants.IS_ACTIVE;
        this.  ciLoanApplicationService.updateInstituionPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getCiLoanApplicationsById(this.  ciLoanApplicationId);
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
        this.  ciLoanApplicationService.addInstituionPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getCiLoanApplicationsById(this.  ciLoanApplicationId);
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
     * @author jyothi.naidana
     */
    saveGropPromotersDetails(rowData:any){
      if (rowData.id != null && rowData.id != undefined) {
        this.  ciLoanApplicationService.updateGroupPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.getCiLoanApplicationsById(this.  ciLoanApplicationId);
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
        this.ciLoanApplicationService.addGroupPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.getCiLoanApplicationsById(this.  ciLoanApplicationId);
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
   * @author jyothi.naidana
   */
  ageCaluculation(flag: any) {
    if (flag) {//with age to date convertion
      if (this.membershipBasicDetailsModel.age != null && this.membershipBasicDetailsModel.age != undefined) {
        if (this.membershipBasicDetailsModel.age > 0) {

          const currentDate = new Date();  // Get the current date
          const birthYear = currentDate.getFullYear() - this.membershipBasicDetailsModel.age;  // Subtract the entered age from the current year
          const birthMonth = currentDate.getMonth();  // Keep the current month
          const birthDate = currentDate.getDate();   // Keep the current day

          // Construct the calculated Date of Birth
          const dob = new Date(birthYear, birthMonth, birthDate);

          // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          // Format the Date of Birth to 'DD/Mon/YYYY'
          const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;

          // Format the Date of Birth to YYYY-MM-DD to match the input type="date" format
          this.membershipBasicDetailsModel.dobVal = formattedDob;
        }
        else {
          this.memberCreationForm.get('age')?.reset();
          this.memberCreationForm.get("dateOfBirth")?.reset();
          this.msgs = [{ severity: 'error',  detail: savingsbanktransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    }
    else {//with date to age convertion
      this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dobVal, this.orgnizationSetting.datePipe);
      if (this.membershipBasicDetailsModel.dobVal) {
        const dob = new Date(this.membershipBasicDetailsModel.dobVal);  // Parse the date of birth entered by the user
        const currentDate = new Date();  // Get the current date
        let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
        const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
        if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
          age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
        }
        this.membershipBasicDetailsModel.age = age;  // Set the calculated age to the class property
      }
    }

  }

   /**
   * @implements map qulaification name
   * @author jyothi.naidana
   */
   onChangeQualificationChange() {
    let qualification = this.tempSubQualificationList.find((data: any) => null != data && this.membershipBasicDetailsModel.qualificationId != null && data.value == this.membershipBasicDetailsModel.qualificationId);
      if (qualification != null && undefined != qualification)
          this.membershipBasicDetailsModel.qualificationName = qualification.label;
  }

   /**
   * @implements map qulaification name
   * @author jyothi.naidana
   */
  onChangeCasteChange() {
    let caste = this.tempSubCasteList.find((data: any) => null != data && this.membershipBasicDetailsModel.casteId != null && data.value == this.membershipBasicDetailsModel.casteId);
    if (caste != null && undefined != caste)
    this.membershipBasicDetailsModel.casteName = caste.label;
  }


  /**
   * @implements age caluculation
   * @param age 
   * @author jyothi.naidana
   */
  promoterageCaluculation(flag: any ,isGroupFlag :any) {
    if(isGroupFlag){
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
            this.msgs = [{ severity: 'error',  detail: savingsbanktransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      }
      else {//with date to age convertion
        this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.memDobVal, this.orgnizationSetting.datePipe);
        if (this.promoterDetailsModel.memDobVal) {
          const dob = new Date(this.promoterDetailsModel.memDobVal);  // Parse the date of birth entered by the user
          const currentDate = new Date();  // Get the current date
          let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
          const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
          if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
          }
          this.promoterDetailsModel.age = age;  // Set the calculated age to the class property
        }
      }
    }
    else {
      if (flag) {//with age to date convertion
        if (this.institutionPromoterDetailsModel.age != null && this.institutionPromoterDetailsModel.age != undefined) {
          if (this.institutionPromoterDetailsModel.age > 0) {
  
            const currentDate = new Date();  // Get the current date
            const birthYear = currentDate.getFullYear() - this.institutionPromoterDetailsModel.age;  // Subtract the entered age from the current year
            const birthMonth = currentDate.getMonth();  // Keep the current month
            const birthDate = currentDate.getDate();   // Keep the current day
  
            // Construct the calculated Date of Birth
            const dob = new Date(birthYear, birthMonth, birthDate);
  
            // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
            // Format the Date of Birth to 'DD/Mon/YYYY'
            const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;
  
            // Format the Date of Birth to YYYY-MM-DD to match the input type="date" format
            this.institutionPromoterDetailsModel.memDobVal = formattedDob;
          }
          else {
            this.promoterDetailsForm.get('age')?.reset();
            this.promoterDetailsForm.get("dateOfBirth")?.reset();
            this.msgs = [{ severity: 'error',  detail: savingsbanktransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      }
      else {//with date to age convertion
        this.institutionPromoterDetailsModel.memDobVal = this.datePipe.transform(this.institutionPromoterDetailsModel.memDobVal, this.orgnizationSetting.datePipe);
        if (this.institutionPromoterDetailsModel.memDobVal) {
          const dob = new Date(this.institutionPromoterDetailsModel.memDobVal);  // Parse the date of birth entered by the user
          const currentDate = new Date();  // Get the current date
          let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
          const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
          if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
          }
          this.institutionPromoterDetailsModel.age = age;  // Set the calculated age to the class property
        }
      }
    }
  }

  /**
   * @implements onChangCommunity
   * @author jyothi.naidana
   */
  onChangeCommunityChange() {
    let community = this.communityList.find((data: any) => null != data && this.membershipBasicDetailsModel.communityId != null && data.value == this.membershipBasicDetailsModel.communityId);
    if (community != null && undefined != community)
    this.membershipBasicDetailsModel.communityName = community.label;
  }
  
  /**
   * @implements onChange Occupation
   * @author jyothi.naidana
   */
  onChangeOccupationChange() {
    let occupation = this.occupationTypeList.find((data: any) => null != data && this.membershipBasicDetailsModel.occupationId != null && data.value == this.membershipBasicDetailsModel.occupationId);
    if (occupation != null && undefined != occupation)
    this.membershipBasicDetailsModel.occupationName = occupation.label;
  }

  /**
   * @implements onChange Occupation
   * @author jyothi.naidana
   */
  groupTypeOnChange(){
    let group = this.groupTypes.find((data: any) => null != data && this.membershipGroupDetailsModel.groupTypeId != null && data.value == this.membershipGroupDetailsModel.groupTypeId);
    if (group != null && undefined != group)
      this.membershipGroupDetailsModel.groupTypeName = group.label;
  }

   /**
   * @implements onChange Occupation
   * @author jyothi.naidana
   */
   institutionTypeOnChange(){
    let institution = this.institutionTypes.find((data: any) => null != data && this.membershipInstitutionDetailsModel.institutionType != null && data.value == this.membershipInstitutionDetailsModel.institutionType);
    if (institution != null && undefined != institution)
      this.membershipInstitutionDetailsModel.institutionTypeName = institution.label;
  }

  /**
   * @implements isPoc Check for promoters
   * @param isPoc 
   * @returns 
   */
  isPosCheck(isPoc: any , isGroup:any) {
    if(isGroup){
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
   * @author jyothi.naidana
   */
  onGenderChange(genderId :any){
    this.membershipBasicDetailsModel.genderName =this.genderList.find((obj:any) => obj.value == genderId)?.label;
  }

   /**
   * @implements on Change of marital status gender Type nam marital status
   * @author jyothi.naidana
   */
  maritalStatusChange(maritalStatusId :any){
    this.membershipBasicDetailsModel.maritalStatusName =this.maritalStatusList.find((obj:any) => obj.value == maritalStatusId)?.label;
  }

  /**
   * @implements onChange operation Type
   * @param oprationType 
   * @param isGroup 
   * @author jyothi.naidana
   */
  onChangeOperationType(oprationType:any,isGroup:any){
    if(isGroup){
      this.membershipGroupDetailsModel.operatorTypeName= this.operatorTypeList.find((obj:any) => obj.value == oprationType)?.label;
    }
    else {
      this.membershipInstitutionDetailsModel.operatorTypeName= this.operatorTypeList.find((obj:any) => obj.value == oprationType)?.label;
    }
   
  }

}
