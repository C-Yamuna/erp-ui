import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../membership-basic-required-details/shared/membership-basic-required-details';
import { SavingBankApplicationModel } from '../savings-bank-application/shared/saving-bank-application-model';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SavingBankApplicationService } from '../savings-bank-application/shared/saving-bank-application.service';
import { SavingsBankCommunicationService } from '../savings-bank-communication/shared/savings-bank-communication.service';
import { MembershipServiceService } from '../membership-basic-required-details/shared/membership-service.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { DatePipe } from '@angular/common';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { SbTransaction } from '../../sb-transactions/shared/sb-transaction';
import { CommunityService } from 'src/app/configurations/common-config/community/shared/community.service';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { savingsbanktransactionconstant } from '../../savingsbank-transaction-constant';

@Component({
  selector: 'app-new-membership',
  templateUrl: './new-membership.component.html',
  styleUrls: ['./new-membership.component.css']
})
export class NewMembershipComponent {

  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  communityList: any[] = [];
  
  membershipBasicRequiredDetails: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  savingBankApplicationModel: SavingBankApplicationModel = new SavingBankApplicationModel();

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
  sbAccId: any;
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
  trueFalseList: any[] = [];
  groupedQualificationSubQualification: any[]=[];
  subQualificationList: any[]=[];
  tempSubQualificationList: any[]=[];
  tempSubCasteList: any[]=[];
  groupedCasteSubCaste: any[]=[];
  subCasteList: any[]=[];

  groupTypes :any[]=[];
  institutionTypes:any[]=[];

  today :any;

  fileSizeMsgResulutionCopy :any;
  fileSizeMsgForImage:any;
  fileSizeMsgForSignature :any;

  constructor(private router: Router, private formBuilder: FormBuilder, private savingBankApplicationService: SavingBankApplicationService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private savingsBankCommunicationService: SavingsBankCommunicationService, private membershipServiceService: MembershipServiceService , private fileUploadService :FileUploadService, private communityService: CommunityService) {
    this.memberCreationForm = this.formBuilder.group({
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
      "name":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
      "registrationNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
      "registrationDate": new FormControl('', Validators.required),
      "admissionDate": new FormControl('', Validators.required),
      // pocNumber: ['', Validators.required],
      "mobileNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(40)]),
      "panNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.maxLength(40)]),
      "tanNumber":  new FormControl('', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.maxLength(40)]),
      "gstNumber":  new FormControl('', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.maxLength(40)]),
      "pocName":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
      "groupType": new FormControl('', Validators.required),
      "societyAdmissionNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
      "operatorTypeId":new FormControl('', Validators.required),

    })
    this.institutionForm = this.formBuilder.group({
      "name":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
      "registrationNumber":  new FormControl('', [Validators.required,Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
      "registrationDate": new FormControl('', Validators.required),
      "admissionDate": new FormControl('', Validators.required),
      // pocName: ['', Validators.required],
      "mobileNumber": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(40)]),
      "panNumber": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.maxLength(40)]),
      "tanNumber": new FormControl('', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.maxLength(40)]),
      "gstNumber": new FormControl('', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.maxLength(40)]),
      "pocName": new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.maxLength(40)]),
      "institutionType": new FormControl('',Validators.required),
      "societyAdmissionNumber": new FormControl('', [Validators.required,Validators.required,Validators.pattern(applicationConstants.ALLOW_NEW_NUMBERS), Validators.maxLength(40)]),
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
    this.membershipBasicRequiredDetails.filesDTOList = [];
    this.pacsId = 1;
    this.branchId = 1;
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.maritalStatusList = this.commonComponent.maritalStatusList();
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

    this.getAllTypeOfMembershipDetails(this.pacsId , this.branchId);
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        this.sbAccId = this.encryptDecryptService.decrypt(params['id']);
        this.getSbAccountDetailsById(this.sbAccId);
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
  getSbAccountDetailsById(id: any) {
    this.savingBankApplicationService.getSbApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
              this.admisionNumber = this.responseModel.data[0].admissionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.memberTypeId = this.responseModel.data[0].memberTypeId;
              this.savingBankApplicationModel = this.responseModel.data[0];
              this.membershipDataFromSbModule();
              this.updateData();
              
            }
            else {
              this.groupOrInstitutionDisable = true;
            }
          }
      
      }
    });
  }

  membershipBasicDetails(){
    if (this.savingBankApplicationModel.memberShipBasicDetailsDTO != null && this.savingBankApplicationModel.memberShipBasicDetailsDTO!= undefined) {
      this.membershipBasicRequiredDetails = this.savingBankApplicationModel.memberShipBasicDetailsDTO;
      if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
        this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
      }
      if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
        this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
      }
      if(this.membershipBasicRequiredDetails.memberTypeId != undefined && this.membershipBasicRequiredDetails.memberTypeId){
        this.memberTypeId = this.membershipBasicRequiredDetails.memberTypeId;
      }
      if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
        this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
        this.isFileUploadedPhoto = applicationConstants.TRUE;
      }
      if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
        this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
        this.isFileUploadedsignature = applicationConstants.TRUE;
      }
      if (this.membershipBasicRequiredDetails.mcrDocumentCopy != null && this.membershipBasicRequiredDetails.mcrDocumentCopy != undefined) {
        this.membershipBasicRequiredDetails.mcrDocumentCopyMultiPartFileList = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.mcrDocumentCopy ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.mcrDocumentCopy  );
      }
      this.savingBankApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
      this.updateData();
      this.disableMemberType = true;
    }
      else {
        this.groupOrInstitutionDisable = true;
      }
    
  }

  groupDetails() {
    if (this.savingBankApplicationModel.groupDetailsDTO != undefined && this.savingBankApplicationModel.groupDetailsDTO != null) {
      this.memberGroupDetailsModel = this.savingBankApplicationModel.groupDetailsDTO;
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
          if(groupPromoters.endDate != null && groupPromoters.endDate != undefined){
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
      if (this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined) {
        this.savingBankApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
      }
      if (this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined) {
        this.savingBankApplicationModel.groupDetailsDTO = this.memberGroupDetailsModel;
      }
      this.disableMemberType = true;
    }
    else {
      this.groupOrInstitutionDisable = false;
    }

  }
  institutionDetails(){
    if(this.savingBankApplicationModel.institutionDTO != undefined && this.savingBankApplicationModel.institutionDTO != null){
      this.membershipInstitutionDetailsModel = this.savingBankApplicationModel.institutionDTO;
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
          if(institution.endDate != null && institution.endDate != undefined){
            institution.endDateVal = this.datePipe.transform(institution.endDate, this.orgnizationSetting.datePipe);
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
      this.savingBankApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
      this.savingBankApplicationModel.institutionDTO = this.membershipInstitutionDetailsModel;
      this.disableMemberType = true;
    }
    else {
      this.groupOrInstitutionDisable = true;;
    }
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
    this.savingBankApplicationModel.memberTypeId = this.memberTypeId;
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      this.isDisableFlag = (!this.memberCreationForm.valid) || !(this.isFileUploadedPhoto && this.isFileUploadedsignature)
      this.savingBankApplicationModel.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetails.memberTypeName = this.memberTypeName;
      this.membershipBasicRequiredDetails.isNewMember = this.showForm;
      this.savingBankApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
    }
    if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      this.isDisableFlag = (!(this.groupForm.valid && (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length  >=2))) || this.groupPromoters
      this.memberGroupDetailsModel.memberTypeId = this.memberTypeId;
      this.memberGroupDetailsModel.memberTypeName = this.memberTypeName;
      this.memberGroupDetailsModel.isNewMember = this.showForm;
      this.savingBankApplicationModel.groupDetailsDTO = this.memberGroupDetailsModel;
      this.savingBankApplicationModel.memberTypeName = this.memberTypeName;
      this.addButton = !this.groupForm.valid;
    }
    if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      this.isDisableFlag = (!(this.institutionForm.valid &&(this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length >0)))|| this.institutionPromoterPopUp
      this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
      this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
      this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
      this.savingBankApplicationModel.memberTypeName = this.memberTypeName;
      this.savingBankApplicationModel.institutionDTO = this.membershipInstitutionDetailsModel;
      this.addButton = !this.institutionForm.valid;
  }
   
    this.savingBankApplicationService.changeData({
      formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
      data: this.savingBankApplicationModel,
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
    this.membershipBasicRequiredDetails.relationTypeName = filteredItem.label;

  }
  /**
   * @implements get getAll relation Types
   * @author jyothi.naidana
   */
  getAllRelationTypes() {
    this.savingBankApplicationService.getAllRelationTypes().subscribe((res: any) => {
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
    this.savingBankApplicationService.getAllOccupationTypesList().subscribe((res: any) => {
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
    this.savingBankApplicationService.getAllQualificationSubQualification().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.qualificationTypes = this.responseModel.data;
        this.groupedQualificationSubQualification = this.responseModel.data.filter((qualification:any) => qualification.status == applicationConstants.ACTIVE).map((count:any) => {
          this.subQualificationList = [];
          count.subQualificationList.filter((subCaste:any) => subCaste.status == applicationConstants.TRUE).map((subCount:any) => {
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
    this.savingBankApplicationService.getAllCasteSubCaste().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.castesList = this.responseModel.data;
        this.tempSubCasteList = [];
        this.groupedCasteSubCaste = this.responseModel.data.filter((caste:any) => caste.status == applicationConstants.TRUE).map((count:any) => {
          this.subCasteList = [];
          count.subCastesList.filter((subCaste:any) => subCaste.status == applicationConstants.TRUE).map((subCount:any) => {
            this.subCasteList.push({ label: subCount.name, value: subCount.id})
            this.tempSubCasteList.push({ label: subCount.name, value: subCount.id})
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
    this.savingBankApplicationService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
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
            if(this.membershipBasicRequiredDetails.memberTypeId != undefined && this.membershipBasicRequiredDetails.memberTypeId){
              this.memberTypeId = this.membershipBasicRequiredDetails.memberTypeId;
            }
            if (this.membershipBasicRequiredDetails.photoCopyPath != null && this.membershipBasicRequiredDetails.photoCopyPath != undefined) {
              this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoCopyPath  );
              this.isFileUploadedPhoto = applicationConstants.TRUE;
            }
            if (this.membershipBasicRequiredDetails.signatureCopyPath != null && this.membershipBasicRequiredDetails.signatureCopyPath != undefined) {
              this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signatureCopyPath  );
              this.isFileUploadedsignature = applicationConstants.TRUE;
            }
            this.savingBankApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
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
    this.savingBankApplicationService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
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
              if(this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined){
                this.savingBankApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
              }
              if(this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined){
              this.savingBankApplicationModel.groupDetailsDTO = this.memberGroupDetailsModel;
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
    this.savingBankApplicationService.getInstitutionDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
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
            this.savingBankApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
            this.savingBankApplicationModel.institutionDTO = this.membershipInstitutionDetailsModel;
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
  OnChangeMemberType(memberTypeId: any) {
    const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === memberTypeId);
    this.memberTypeName = filteredItem.label;
    if (memberTypeId == 1) {
      this.individualFlag = true;
      this.institutionFlag = false;
      this.groupFlag = false;

      this.membershipBasicRequiredDetails.memberTypeId = 1;
      this.savingBankApplicationModel.memberTypeId = 1;

      this.savingBankApplicationModel.groupDetailsDTO = null;
      // this.memberGroupDetailsModel = new MemberGroupDetailsModel();
       // this.membershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
      this.savingBankApplicationModel.institutionDTO = null;

      
      this.groupForm.reset();
      this.institutionForm.reset();
    }
    else if (memberTypeId == 2) {
      this.addButton = false;
      this.EditDeleteDisable = false;
      this.groupFlag = true;
      this.individualFlag = false;
      this.institutionFlag = false;
      this.memberGroupDetailsModel.memberTypeId = 2;
      this.savingBankApplicationModel.memberTypeId =2;

      // refressing the form with data
      this.savingBankApplicationModel.memberShipBasicDetailsDTO = null;
      this.savingBankApplicationModel.institutionDTO = null;
      this.memberCreationForm.reset();
      this.institutionForm.reset();
      // this.membershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
      // this.membershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
      
    }
    else if (memberTypeId == 3) {
      this.addButton = false;
      this.EditDeleteDisable = false;
      this.institutionFlag = true;
      this.individualFlag = false;
      this.groupFlag = false;

      this.membershipInstitutionDetailsModel.memberTypeId = 3;
      this.savingBankApplicationModel.memberTypeId =3;

      this.savingBankApplicationModel.institutionDTO = null;
      this.savingBankApplicationModel.memberShipBasicDetailsDTO = null;
      // this.membershipBasicRequiredDetails = new MembershipBasicRequiredDetails();;
      
      // this.memberGroupDetailsModel = new MemberGroupDetailsModel();
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
    if(rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory){
      rowData.authorizedSignatoryName = applicationConstants.YES;
    }
    else {
      rowData.authorizedSignatoryName = applicationConstants.NO;
    }
    if (rowData.startDate != null && rowData.startDate != undefined) {
      rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
    }
    if (!this.memberGroupDetailsModel.groupPromotersDTOList) {
      this.memberGroupDetailsModel.groupPromotersDTOList = []; // Initialize it as an empty array
    }
    // let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
    // if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
    //   rowData.operatorTypeName = Object.label;
    // }
   let Object = this.genderList.find((obj:any)=>obj.value == rowData.genderId);
    if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.genderName = Object.label;
    }
    Object = this.maritalStatusList.find((obj:any)=>obj.value == rowData.martialId);
    if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
      rowData.maritalStatusName = Object.label;
    }
    if(rowData.endDateVal != null && rowData.endDateVal != undefined){
      rowData.endDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDateVal) );
    }
    if(rowData.endDate != null && rowData.endDate != undefined){
      rowData.endDateVal = this.datePipe.transform(rowData.endDate, this.orgnizationSetting.datePipe);
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
   * @author jyothi.naidana
   * @param falg 
   */
  cancelPromoter(falg:Boolean) {
    this.addButton = false;
    this.groupPromoters = false;
    this.EditDeleteDisable = false;
    this.promoterDetails;
    this.getSbAccountDetailsById(this.sbAccId);
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
    this.promoterDetailsModel = new promoterDetailsModel();
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
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
    }
    else{
      this.admissionNumberDropDown = false;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
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
    this.promoterDetailsForm.get("photoUpload")?.reset();
    this.promoterDetailsForm.get("signatureUpload")?.reset();
    this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
    this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
    this.groupPromoters = true;
    this.cancleButtonFlag = false;
    this.promoterDetailsModel = new promoterDetailsModel();
    this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
    this.promoterDetailsForm.reset();
    this.onChangeExistedPrmoter(false , false);
    this.admissionNumberDropDown = false;
    this.updateData();
    
  }
  /**
   * @implements get all operator Details
   * @author jyothi.naidana
   */
  getAllOperatorTypes() {
    this.commonComponent.startSpinner();
    this.savingBankApplicationService.getAllOperationTypes().subscribe((res: any) => {
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
   * @author jyothi.naidana
   */
  saveInstitutionPromoterDetails(rowData: any) {
    this.institutionPromoterPopUp = false;
    this.cancleButtonFlag = false
    rowData.pacsId = 1;
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
    if(rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory){
      rowData.authorizedSignatoryName = applicationConstants.YES;
    }
    else {
      rowData.authorizedSignatoryName = applicationConstants.NO;
    }
    if (rowData.startDate != null && rowData.startDate != undefined) {
      rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
    }
    if(rowData.endDateVal != null && rowData.endDateVal != undefined){
      rowData.endDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.endDateVal) );
    }
    if(rowData.endDate != null && rowData.endDate != undefined){
      rowData.endDateVal = this.datePipe.transform(rowData.endDate, this.orgnizationSetting.datePipe);
    }
    // let Object = this.operatorTypeList.find((obj:any)=>obj.value == rowData.operatorTypeId);
    // if(Object != null && Object != undefined && Object.label != null && Object.label != undefined) {
    //   rowData.operatorTypeName = Object.label;
    // }
    let Object = this.genderList.find((obj: any) => obj.value == rowData.genderId);
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
    this.getSbAccountDetailsById(this.sbAccId);
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
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
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
    // this.institutionPromoterDetailsModel =  this.institutionPromoter.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
    this.institutionPromoterDetailsModel = rowData;
    if(this.institutionPromoterDetailsModel.isExistingMember ){
      this.admissionNumberDropDown = true;

      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage  );
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );
    }
    else{
      this.admissionNumberDropDown = false;
      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage  );
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );
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
    this.promoterDetailsForm.get("photoUpload")?.reset();
    this.promoterDetailsForm.get("signatureUpload")?.reset();
    this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
    this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
    this.institutionPromoterPopUp = true;
    this.cancleButtonFlag = true;
    let uniqueId = this.institutionPromoter.length + 1
    this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
    this.institutionPromoterDetailsModel.uniqueId = uniqueId; 
    this.promoterDetailsForm.reset();
    this.onChangeExistedPrmoter(false , false);
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
  membershipDataFromSbModule() {
    if (this.memberTypeName == "Individual") {
      this.individualFlag = true;
      // this.getMemberDetailsByAdmissionNumber(this.admisionNumber);
      this.membershipBasicDetails();
    } else if (this.memberTypeName == "Group") {
      this.groupFlag = true;
      // this.getGroupByAdmissionNumber(this.admisionNumber);
      this.groupDetails();
    } else if (this.memberTypeName == "Institution") {
      this.institutionFlag = true;
      // this.getInstitutionByAdmissionNumber(this.admisionNumber);
      this.institutionDetails();
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
    let fileSizeFalg = false;
    if(this.isEdit && this.membershipBasicRequiredDetails.filesDTOList == null || this.membershipBasicRequiredDetails.filesDTOList == undefined){
      this.membershipBasicRequiredDetails.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "individualPhotoCopy") {
      this.isFileUploadedPhoto = applicationConstants.FALSE;
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForImage= "file is bigger than 2MB";
        fileSizeFalg = true;
       }
      this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = [];
      // Clear file input before processing files
      fileUploadPhoto.clear();
    }
    if (filePathName === "individualSighnedCopy") {
      this.isFileUploadedsignature = applicationConstants.FALSE;
      this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForSignature = "file is bigger than 2MB";
        fileSizeFalg = true;
       }
      fileUploadSign.clear();
    }
    if (filePathName === "resulutionCopy") {
      this.membershipBasicRequiredDetails.mcrDocumentCopyMultiPartFileList = [];
      if (selectedFiles[0].size/1000000  > 5) {
        this.fileSizeMsgResulutionCopy = "file is bigger than 5MB";
        fileSizeFalg = true;
      }
      fileUploadSign.clear();
    }
    if(!fileSizeFalg){
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
            this.fileSizeMsgForImage = null;
            files.fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.isFileUploadedPhoto = applicationConstants.TRUE;
            this.membershipBasicRequiredDetails.filesDTOList.push(files);
            this.membershipBasicRequiredDetails.photoCopyPath = null;
            this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy.push(files);
            this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.photoCopyPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          else if (filePathName === "individualSighnedCopy") {
            this.fileSizeMsgForSignature = null;
            files.fileName = "Individual_Member_Signature_copy" + "_" + timeStamp + "_" + file.name;
            this.isFileUploadedsignature = applicationConstants.TRUE;
            this.membershipBasicRequiredDetails.filesDTOList.push(files);
            this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath.push(files);
            this.membershipBasicRequiredDetails.signatureCopyPath = null;
            this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.signatureCopyPath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          else if (filePathName === "resulutionCopy") {
            this.fileSizeMsgResulutionCopy = null;
            files.fileName = "Resulution_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.filesDTOList.push(files);
            this.membershipBasicRequiredDetails.mcrDocumentCopyMultiPartFileList.push(files);
            this.membershipBasicRequiredDetails.mcrDocumentCopy = null;
            this.membershipBasicRequiredDetails.filesDTOList[this.membershipBasicRequiredDetails.filesDTOList.length - 1].fileName = "Resulution_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetails.mcrDocumentCopy = "Resulution_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
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
   * @author jyothi.naidana
   */
  fileRemoeEvent(fileName: any) {
      if (this.membershipBasicRequiredDetails.filesDTOList != null && this.membershipBasicRequiredDetails.filesDTOList != undefined && this.membershipBasicRequiredDetails.filesDTOList.length > 0) {
        if (fileName == "individualPhotoCopy") {
          this.isFileUploadedPhoto = applicationConstants.FALSE;
        let removeFileIndex = this.membershipBasicRequiredDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.photoCopyPath);
        let obj = this.membershipBasicRequiredDetails.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.photoCopyPath);
        this.membershipBasicRequiredDetails.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetails.photoCopyPath = null;
      }
      if (fileName == "individualSighnedCopy") {
        this.isFileUploadedsignature = applicationConstants.FALSE;
        let removeFileIndex = this.membershipBasicRequiredDetails.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.signatureCopyPath);
        let obj = this.membershipBasicRequiredDetails.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetails.signatureCopyPath);
        this.membershipBasicRequiredDetails.filesDTOList.splice(removeFileIndex, 1);
        this.membershipBasicRequiredDetails.signatureCopyPath = null;
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
    if(this.memberGroupDetailsModel.admissionDateVal != undefined && this.memberGroupDetailsModel.registrationDateVal != undefined){
      if( new Date(this.memberGroupDetailsModel.admissionDateVal) <  new Date(this.memberGroupDetailsModel.registrationDateVal)){
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

    //individual membershipdates
    if (this.membershipBasicRequiredDetails != null && this.membershipBasicRequiredDetails != undefined) {
      if (this.membershipBasicRequiredDetails.admissionDateVal != null && this.membershipBasicRequiredDetails.admissionDateVal != undefined) {
        this.membershipBasicRequiredDetails.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetails.admissionDateVal));
        if(this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined){
          if(this.membershipBasicRequiredDetails.dob > this.membershipBasicRequiredDetails.admissionDate){
            this.membershipBasicRequiredDetails.dob = null;
            this.membershipBasicRequiredDetails.dobVal = null;
            this.membershipBasicRequiredDetails.age = null;
            this.memberCreationForm.get('dateOfBirth')?.reset;
            this.membershipBasicRequiredDetails.admissionDate = null;
            this.membershipBasicRequiredDetails.admissionDateVal = null;
            this.memberCreationForm.get('admissionDate')?.reset;
            this.msgs = [{ severity: 'warning', detail: savingsbanktransactionconstant.DATE_OF_BIRTH_SHOUL_NOT_BE_GREATER_THAN_ADMISSION_DATE }];
            setTimeout(() => {
              this.msgs = [];        
            }, 2000);
          }
        }
      }
      if (this.membershipBasicRequiredDetails.dobVal != null && this.membershipBasicRequiredDetails.dobVal != undefined) {//dob 
        this.membershipBasicRequiredDetails.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetails.dobVal));//doc conversion
        if(this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined){//dob with admission date check
          if(this.membershipBasicRequiredDetails.dob > this.membershipBasicRequiredDetails.admissionDate){
            this.membershipBasicRequiredDetails.dob = null;
            this.membershipBasicRequiredDetails.dobVal = null;
            this.membershipBasicRequiredDetails.age = null;
            this.memberCreationForm.get('dateOfBirth')?.reset;
            this.membershipBasicRequiredDetails.admissionDate = null;
            this.membershipBasicRequiredDetails.admissionDateVal = null;
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
      this.promoterDetailsModel = new promoterDetailsModel();
      this.promoterDetailsModel.isExistingMember = isExistingMember;
      this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
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
    this.promoterDetailsForm.get('surname')?.reset();
    this.promoterDetailsForm.get('name')?.reset();
    // this.promoterDetailsForm.get('operatorTypeId')?.reset();
    this.promoterDetailsForm.get('dob')?.reset();
    this.promoterDetailsForm.get('age')?.reset();
    this.promoterDetailsForm.get('genderId')?.reset();
    this.promoterDetailsForm.get('martialId')?.reset();
    this.promoterDetailsForm.get('mobileNumber')?.reset();
    this.promoterDetailsForm.get('aadharNumber')?.reset();
    this.promoterDetailsForm.get('emailId')?.reset();
    this.promoterDetailsForm.get('startDate')?.reset();
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
        }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
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
        this.membershipBasicRequiredDetails = this.responseModel.data[0];
        
       this.promoterDetailsModel.name  = this.membershipBasicRequiredDetails.name,
       this.promoterDetailsModel.surname  = this.membershipBasicRequiredDetails.surname;
       this.promoterDetailsModel.aadharNumber  = this.membershipBasicRequiredDetails.aadharNumber;
       this.promoterDetailsModel.dob  = this.membershipBasicRequiredDetails.dob;
       if(this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
        this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
       this.promoterDetailsModel.age  = this.membershipBasicRequiredDetails.age;
       this.promoterDetailsModel.genderId  = this.membershipBasicRequiredDetails.genderId;
       this.promoterDetailsModel.martialId  = this.membershipBasicRequiredDetails.martialId;
       this.promoterDetailsModel.mobileNumber  = this.membershipBasicRequiredDetails.mobileNumber;
       this.promoterDetailsModel.emailId  = this.membershipBasicRequiredDetails.emailId;
       this.promoterDetailsModel.startDate  = this.membershipBasicRequiredDetails.admissionDate;
       if(this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
        this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);

       this.promoterDetailsModel.uploadImage = this.membershipBasicRequiredDetails.photoCopyPath;
       this.promoterDetailsModel.uploadSignature = 	this.membershipBasicRequiredDetails.signatureCopyPath;

       this.institutionPromoterDetailsModel.uploadImage =  this.membershipBasicRequiredDetails.photoCopyPath;
       this.institutionPromoterDetailsModel.uploadSignature =  	this.membershipBasicRequiredDetails.signatureCopyPath;

      if(this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined){
        this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
        this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage);
        this.isFileUploadedPromoterPhoto= applicationConstants.TRUE;
      }
      if(this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined){
        this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
        this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );

        this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
      }
      //  this.promoterDetailsModel.operatorTypeId  = this.membershipBasicRequiredDetails.occupationId;
       
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
        if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length > 0 && isGroupLeadeExited[0].id != this.promoterDetailsModel.id) {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
          this.promoterDetailsForm.get('isGroupLeader')?.reset();
          setTimeout(() => {
            this.msgs = [];
          }, 3000);
        }
      }
    }
    else {
      if (isGroupLeader) {
        let isGroupLeadeExited = this.institutionPromoter.filter((obj: any) => obj.isGroupLeader == true);
        if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length > 0 && isGroupLeadeExited[0].id != this.institutionPromoterDetailsModel.id) {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
          this.promoterDetailsForm.get('isGroupLeader')?.reset();
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
    let fileSizeFalg = false;
    if(this.isEdit && this.promoterDetailsModel.filesDTOList == null || this.promoterDetailsModel.filesDTOList == undefined){
      this.promoterDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "groupPromoterImage") {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForImage= "file is bigger than 2MB";
        fileSizeFalg = true;
       }
      fileUploadPhotoPromoter.clear();
    }
    if (filePathName === "groupPromoterSignature") {
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForSignature = "file is bigger than 2MB";
        fileSizeFalg = true;
       }
      fileUpload.clear();
    }
    let files: FileUploadModel = new FileUploadModel();
    if(!fileSizeFalg){
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
            this.fileSizeMsgForImage= null;
            files.fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
            this.promoterDetailsModel.filesDTOList.push(files);
            this.promoterDetailsModel.multipartFileListForPhotoCopyPath.push(files);
            this.promoterDetailsModel.uploadImage = null;
            this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.promoterDetailsModel.uploadImage = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupPromoterSignature") {
            this.fileSizeMsgForSignature = null;
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
    
  }


  
  /**
   * @implements fileUpload for promoter in institution
   * @param event 
   * @param fileUpload 
   * @param filePathName 
   */
  fileUploaderForInstitutionPromoters(event: any, fileUploadInstitutionPromoterSign: FileUpload, fileUpload: FileUpload, filePathName: any) {
    let fileSizeFalg = false;
    if (this.isEdit && this.institutionPromoterDetailsModel.filesDTOList == null || this.institutionPromoterDetailsModel.filesDTOList == undefined) {
      this.institutionPromoterDetailsModel.filesDTOList = [];
    }
    let selectedFiles = [...event.files];
    if (filePathName === "institutionPromoterImage") {
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForImage= "file is bigger than 2MB";
        fileSizeFalg = true;
       }
      fileUpload.clear();
    }
    if (filePathName === "insitutionPromoterSignature") {
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = [];
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForSignature = "file is bigger than 2MB";
        fileSizeFalg = true;
       }
      fileUploadInstitutionPromoterSign.clear();
    }
    let files: FileUploadModel = new FileUploadModel();
    if(!fileSizeFalg){
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
            this.fileSizeMsgForImage = null;
            files.fileName = "Institution_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
            this.institutionPromoterDetailsModel.filesDTOList.push(files);
            this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath.push(files);
            this.institutionPromoterDetailsModel.uploadImage = null;
            this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.institutionPromoterDetailsModel.uploadImage = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "insitutionPromoterSignature") {
            this.fileSizeMsgForSignature = null;
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
 
  }
  

  /**
   * @implements submit group institution details
   * @author jyothi.naidana
   */
  submitGropOrInstitution() {
    this.savingBankApplicationModel.pacsId = this.pacsId;
    this.savingBankApplicationModel.pacsCode = 12;
    this.savingBankApplicationModel.branchId = this.branchId;
    if (this.sbAccId != null && this.sbAccId != undefined) {
      this.savingBankApplicationService.updateSbApplication(this.savingBankApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
           this.sbAccId =  this.responseModel.data[0].id;
           this.groupOrInstitutionDisable = true;
           this.getSbAccountDetailsById(this.sbAccId);
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
      this.savingBankApplicationModel.isActive = applicationConstants.TRUE;
      this.savingBankApplicationModel.statusName = "In Progress";
      this.savingBankApplicationService.addSbApplication(this.savingBankApplicationModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.sbAccId =  this.responseModel.data[0].id;
            this.groupOrInstitutionDisable = true;
            this.getSbAccountDetailsById(this.sbAccId);
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

  /**
   * @implements save institution Promoters
   * @param rowData 
   * @author jyothi.naidana
   */
  saveInstitutionPrmoters(rowData:any){
    if (rowData.id != null && rowData.id != undefined) {
      this.savingBankApplicationService.updateInstituionPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.getSbAccountDetailsById(this.sbAccId);
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
      this.savingBankApplicationService.addInstituionPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.getSbAccountDetailsById(this.sbAccId);
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
      this.savingBankApplicationService.updateGroupPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.getSbAccountDetailsById(this.sbAccId);
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
      this.savingBankApplicationService.addGroupPromoterDetails(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 1200);
          this.getSbAccountDetailsById(this.sbAccId);
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
          this.membershipBasicRequiredDetails.dobVal = null;
          this.membershipBasicRequiredDetails.dob = null;
          this.membershipBasicRequiredDetails.dobVal = formattedDob;
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
   * @author jyothi.naidana
   */
  onChangeQualificationChange() {
    let qualification = this.tempSubQualificationList.find((data: any) => null != data && this.membershipBasicRequiredDetails.qualificationId != null && data.value == this.membershipBasicRequiredDetails.qualificationId);
      if (qualification != null && undefined != qualification)
          this.membershipBasicRequiredDetails.qualificationName = qualification.label;
  }

   /**
   * @implements map qulaification name
   * @author jyothi.naidana
   */
  onChangeCasteChange() {
    let caste = this.tempSubCasteList.find((data: any) => null != data && this.membershipBasicRequiredDetails.casteId != null && data.value == this.membershipBasicRequiredDetails.casteId);
    if (caste != null && undefined != caste)
    this.membershipBasicRequiredDetails.casteName = caste.label;
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
    let community = this.communityList.find((data: any) => null != data && this.membershipBasicRequiredDetails.communityId != null && data.value == this.membershipBasicRequiredDetails.communityId);
    if (community != null && undefined != community)
    this.membershipBasicRequiredDetails.communityName = community.label;
  }
  
  /**
   * @implements onChange Occupation
   * @author jyothi.naidana
   */
  onChangeOccupationChange() {
    let occupation = this.occupationTypeList.find((data: any) => null != data && this.membershipBasicRequiredDetails.occupationId != null && data.value == this.membershipBasicRequiredDetails.occupationId);
    if (occupation != null && undefined != occupation)
    this.membershipBasicRequiredDetails.occupationName = occupation.label;
  }

  /**
   * @implements onChange Occupation
   * @author jyothi.naidana
   */
  groupTypeOnChange(){
    let group = this.groupTypes.find((data: any) => null != data && this.memberGroupDetailsModel.groupTypeId != null && data.value == this.memberGroupDetailsModel.groupTypeId);
    if (group != null && undefined != group)
      this.memberGroupDetailsModel.groupTypeName = group.label;
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
  
  
}
