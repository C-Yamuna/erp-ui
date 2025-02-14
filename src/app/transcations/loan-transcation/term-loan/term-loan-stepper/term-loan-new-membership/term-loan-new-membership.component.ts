import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel, promoterDetailsModel } from './shared/term-loan-new-membership.model';
import { TermLoanKyc } from '../term-loans-kyc/shared/term-loan-kyc.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { TermLoanNewMembershipService } from './shared/term-loan-new-membership.service';
import { DatePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanCommunicationService } from '../term-loans-communication/shared/term-loan-communication.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { TermLoanCommunication } from '../term-loans-communication/shared/term-loan-communication.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MembershipServiceService } from 'src/app/transcations/savings-bank-transcation/savings-bank-account-creation-stepper/membership-basic-required-details/shared/membership-service.service';
import { CommunityService } from 'src/app/configurations/common-config/community/shared/community.service';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-term-loan-new-membership',
  templateUrl: './term-loan-new-membership.component.html',
  styleUrls: ['./term-loan-new-membership.component.css']
})
export class TermLoanNewMembershipComponent {
  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  communityList: any[] = [];

  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  termLoanKycModel: TermLoanKyc = new TermLoanKyc();
  promoterDetailsModel: promoterDetailsModel = new promoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  termLoanApplicationModel: TermApplication = new TermApplication();
  termLoanCommunicationModel: TermLoanCommunication = new TermLoanCommunication();
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
 termLoanApplicationId: any;
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

  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe, private termLoanCommunicationService: TermLoanCommunicationService,
    private termLoanApplicationsService: TermApplicationService,private membershipServiceService: MembershipServiceService,
    private membershipService: TermLoanNewMembershipService, private fileUploadService: FileUploadService,private communityService: CommunityService) {

      this.memberCreationForm = this.formBuilder.group({
        surName: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS)]],
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        age: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY), Validators.compose([Validators.required])]],
        maritalStatus: ['', Validators.required],
        relationWithMember: ['',Validators.compose([Validators.required])],
        relationName: ['', Validators.compose([Validators.required])],
        aadharNumber: ['', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.compose([Validators.required])]],
        panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        occupation: ['',Validators.compose([Validators.required])],
        community: ['',Validators.compose([Validators.required])],
        quslification: ['',Validators.compose([Validators.required])],
        caste:  ['',Validators.compose([Validators.required])],
        email: ['', [Validators.pattern(applicationConstants.EMAIL_PATTERN)]],
        admissionDate: ['',Validators.compose([Validators.required])],
        isStaff: [''],
        fileUpload:[''],
        admissionFee:['']
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
        pocName:['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
  
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
        pocName:['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
      })
      this.promoterDetailsForm = this.formBuilder.group({
        surname: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        operatorTypeId: ['',],
        dob: ['', Validators.required],
        age: ['', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.compose([Validators.required])]],
        genderId: ['', Validators.required],
        martialId: ['', Validators.required],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        aadharNumber: ['', [Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.compose([Validators.required])]],
        emailId: ['', [Validators.pattern(applicationConstants.EMAIL_PATTERN), Validators.compose([Validators.required])]],
        startDate: ['', Validators.required],
        promterType: ['',],
        isGroupLeader :['',],
        admissionNumber :['',],
        photoUpload :['',],
        signatureUpload :['',],
        authorizedSignatory:['',],
      })
    }
  
  
    ngOnInit(): void {
      this.membershipBasicRequiredDetailsModel.filesDTOList = [];
      this.pacsId = 1;
      this.branchId = 1;
      this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
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
          this.termLoanApplicationId = this.encryptDecryptService.decrypt(params['id']);
          this.getTermApplicationByTermAccId(this.termLoanApplicationId);
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
 
     */
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.admisionNumber = this.responseModel.data[0].admissionNumber;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;;
                this.termLoanApplicationModel = this.responseModel.data[0];
                if (this.termLoanApplicationModel.individualMemberDetailsDTO != null && this. termLoanApplicationModel.individualMemberDetailsDTO != undefined) {
                  this.membershipBasicRequiredDetailsModel = this. termLoanApplicationModel.individualMemberDetailsDTO;
                  if(this.membershipBasicRequiredDetailsModel.memberTypeId != undefined && this.membershipBasicRequiredDetailsModel.memberTypeId){
                    this.memberTypeId = this.membershipBasicRequiredDetailsModel.memberTypeId;
                  }
  
                  if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                    this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
  
                  if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                    this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                  if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath);
                    this.isFileUploadedPhoto = applicationConstants.TRUE;
                  }
                  if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                    this.isFileUploadedsignature = applicationConstants.TRUE;
                  }
                  this.disableMemberType = true;

                }
                if (this. termLoanApplicationModel.memberGroupDetailsDTO != null && this. termLoanApplicationModel.memberGroupDetailsDTO != undefined) {
                  this.memberGroupDetailsModel = this. termLoanApplicationModel.memberGroupDetailsDTO;
                  this.groupOrInstitutionDisable = false;
                  if(this.memberGroupDetailsModel.memberTypeId != undefined && this.memberGroupDetailsModel.memberTypeId){
                    this.memberTypeId = this.memberGroupDetailsModel.memberTypeId;
                  }
  
                  if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined)
                    this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
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
                    }
                  }
                  this.disableMemberType = true;

                }
                if (this. termLoanApplicationModel.memberInstitutionDTO != null && this. termLoanApplicationModel.memberInstitutionDTO != undefined) {
                  this.membershipInstitutionDetailsModel = this. termLoanApplicationModel.memberInstitutionDTO;
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
                      if(institution.genderId != null && institution.genderId != undefined){
                        let Obj = this.genderList.filter(obj => obj.value == institution.genderId);
                        if(Obj != null && Obj != undefined ){
                          institution.genderName = Obj[0].label ;
                        }
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
 
     */
    updateData() {
      this.termLoanApplicationModel.memberTypeId = this.memberTypeId;
      if (this.memberTypeName == "Individual") {
        this.individualFlag = true;
        this.isDisableFlag = (!this.memberCreationForm.valid) || !(this.isFileUploadedPhoto && this.isFileUploadedsignature)
        this.termLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.membershipBasicRequiredDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipBasicRequiredDetailsModel.isNewMember = this.showForm;
        this.termLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicRequiredDetailsModel;
      }
      if (this.memberTypeName == "Group") {
        this.groupFlag = true;
        this.isDisableFlag = (!(this.groupForm.valid && (this.memberGroupDetailsModel.groupPromoterList != null && this.  memberGroupDetailsModel.groupPromoterList != undefined && this.  memberGroupDetailsModel.groupPromoterList.length  >=2))) || this.groupPromoters
        this.memberGroupDetailsModel.memberTypeId = this.memberTypeId;
        this.memberGroupDetailsModel.memberTypeName = this.memberTypeName;
        this.memberGroupDetailsModel.isNewMember = this.showForm;
        this.termLoanApplicationModel.memberGroupDetailsDTO = this.  memberGroupDetailsModel;
        this.termLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.addButton = !this.groupForm.valid;
      }
      if (this.memberTypeName == "Institution") {
        this.institutionFlag = true;
        this.isDisableFlag = (!(this.institutionForm.valid &&(this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length >0)))|| this.institutionPromoterPopUp
        this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
        this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
        this.termLoanApplicationModel.memberTypeName = this.memberTypeName;
        this.termLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
        this.addButton = !this.institutionForm.valid;
    }
     
      this.termLoanApplicationsService.changeData({
        formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
        data: this.termLoanApplicationModel,
        isDisable: this.isDisableFlag,
        stepperIndex: 0,
      });
    }
    /**
     * @implements update save
 
     */
    save() {
      this.updateData();
    }
  
    /**
     * @implements on Change Relation Type
 
     */
    onChangeRelationTypeChange(event: any) {
      const filteredItem = this.relationTypesList.find(item => item.value === event.value);
      this.membershipBasicRequiredDetailsModel.relationTypeName = filteredItem.label;
  
    }
    /**
     * @implements get getAll relation Types
 
     */
    getAllRelationTypes() {
      this.termLoanApplicationsService.getAllRelationTypes().subscribe((res: any) => {
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
 
     */
    getAllOccupationTypes() {
      this.termLoanApplicationsService.getAllOccupationTypesList().subscribe((res: any) => {
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
 
     */
    getAllQualificationType() {
      this.termLoanApplicationsService.getQualificationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.qualificationTypes = this.responseModel.data;
          this.qualificationTypes = this.qualificationTypes.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      });
    }
  
    /**
     * @implements get castes list
 
     */
    getCastesList() {
      this.termLoanApplicationsService.getCastes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.castesList = this.responseModel.data;
          this.castesList = this.castesList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      });
    }
  
   
   /**
     * @implements get membership detaild by admission Number
     * @param admissionNumber 
 
     */
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.termLoanApplicationsService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
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
              if(this.membershipBasicRequiredDetailsModel.memberTypeId != undefined && this.membershipBasicRequiredDetailsModel.memberTypeId){
                this.memberTypeId = this.membershipBasicRequiredDetailsModel.memberTypeId;
              }
              if (this.membershipBasicRequiredDetailsModel.photoCopyPath != null && this.membershipBasicRequiredDetailsModel.photoCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath  );
                this.isFileUploadedPhoto = applicationConstants.TRUE;
              }
              if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath  );
                this.isFileUploadedsignature = applicationConstants.TRUE;
              }
              this.termLoanApplicationModel.individualMemberDetailsDTO = this.membershipBasicRequiredDetailsModel;
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
 
     */
    getGroupByAdmissionNumber(admissionNumber: any) {
      this.termLoanApplicationsService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length != null && this.responseModel.data.length != undefined && this.responseModel.data.length > 0) {
              this.  memberGroupDetailsModel = this.responseModel.data[0];
              this.groupOrInstitutionDisable = false;
              if (this.  memberGroupDetailsModel.registrationDate != null && this.  memberGroupDetailsModel.registrationDate != undefined) {
                this.  memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.  memberGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.  memberGroupDetailsModel.admissionDate != null && this.  memberGroupDetailsModel.admissionDate != undefined) {
                this.  memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.  memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.  memberGroupDetailsModel.memberTypeId != null && this.  memberGroupDetailsModel.memberTypeId != undefined) {
                this.memberTypeId = this.  memberGroupDetailsModel.memberTypeId;
              }
             
                if (this.  memberGroupDetailsModel.groupPromoterList != null && this.  memberGroupDetailsModel.groupPromoterList != undefined && this.  memberGroupDetailsModel.groupPromoterList.length > 0) {
                  this.promoterDetails = this.  memberGroupDetailsModel.groupPromoterList;
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
                if(this.  memberGroupDetailsModel.memberTypeName != null && this.  memberGroupDetailsModel.memberTypeName != undefined){
                  this.termLoanApplicationModel.memberTypeName = this.  memberGroupDetailsModel.memberTypeName;
                }
                if(this.  memberGroupDetailsModel != null && this.  memberGroupDetailsModel != undefined){
                this.termLoanApplicationModel.memberGroupDetailsDTO = this.  memberGroupDetailsModel;
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
 
     */
    getInstitutionByAdmissionNumber(admissionNumber: any) {
      this.termLoanApplicationsService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
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
              this.termLoanApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
              this.termLoanApplicationModel.memberInstitutionDTO = this.membershipInstitutionDetailsModel;
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
 
     */
    OnChangeMemberType(event: any) {
      const filteredItem = this.memberTypeList.find((item: { value: any; }) => item.value === event.value);
      this.memberTypeName = filteredItem.label;
      if (event.value == 1) {
        this.individualFlag = true;
        this.institutionFlag = false;
        this.groupFlag = false;
        this.membershipBasicRequiredDetailsModel.memberTypeId = 1;
        this.termLoanApplicationModel.memberTypeId = 1;
      }
      else if (event.value == 2) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.groupFlag = true;
        this.individualFlag = false;
        this.institutionFlag = false;
        this.  memberGroupDetailsModel.memberTypeId = 2;
        this.termLoanApplicationModel.memberTypeId =2;
      }
      else if (event.value == 3) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.institutionFlag = true;
        this.individualFlag = false;
        this.groupFlag = false;
        this.membershipInstitutionDetailsModel.memberTypeId = 3;
        this.termLoanApplicationModel.memberTypeId =3;
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
      if(rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory){
        rowData.authorizedSignatoryName = applicationConstants.YES;
      }
      else {
        rowData.authorizedSignatoryName = applicationConstants.NO;
      }
      if (rowData.startDate != null && rowData.startDate != undefined) {
        rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
      }
      if (!this.  memberGroupDetailsModel.groupPromotersDTOList) {
        this.  memberGroupDetailsModel.groupPromotersDTOList = []; // Initialize it as an empty array
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
      //   this.  memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
      // }else{
      //   this.promoterDetails.push(rowData);
      //   this.  memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
      // }
      rowData.groupId = this.  memberGroupDetailsModel.id;
      this.saveGropPromotersDetails(rowData);
      
    }
  
    /**
     * @implements cancle prmoters
 
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
 
     */
    editPromoter(rowData: any) {
      this.cancleButtonFlag = true;
      this.addButton = true;
      this.EditDeleteDisable = true;
      this.groupPromoters = true;
      this.promoterDetailsModel = new promoterDetailsModel();
      this.promoterDetailsModel = rowData;
      // this.promoterDetailsModel = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
      if(this.promoterDetailsModel.isExistingMember ){
        this.admissionNumberDropDown = true;
        this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
        this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
      }
      else{
        this.admissionNumberDropDown = false;
        this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
        this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
      }
      this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
      this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
      this.onChangeExistedPrmoter(this.promoterDetailsModel.isExistingMember , false);
      this.updateData();
    }
  
    /**
     * @implements row add of group promoters
 
     */
    onRowAddSave() {
      this.promoterDetailsForm.get("photoUpload").reset();
      this.promoterDetailsForm.get("signatureUpload").reset();
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.groupPromoters = true;
      this.cancleButtonFlag = false;
      this.promoterDetailsModel = new promoterDetailsModel();
      this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
      this.promoterDetailsForm.reset();
      this.onChangeExistedPrmoter(false , true);
      this.admissionNumberDropDown = false;
      this.updateData();
      
    }
    /**
     * @implements get all operator Details
 
     */
    getAllOperatorTypes() {
      this.commonComponent.startSpinner();
      this.termLoanApplicationsService.getAllOperationTypes().subscribe((res: any) => {
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
      if(rowData.authorizedSignatory != null && rowData.authorizedSignatory != undefined && rowData.authorizedSignatory){
        rowData.authorizedSignatoryName = applicationConstants.YES;
      }
      else {
        rowData.authorizedSignatoryName = applicationConstants.NO;
      }
      if (rowData.startDate != null && rowData.startDate != undefined) {
        rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
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
 
     */
    editInstitutionPromoter(rowData: any) {
      this.cancleButtonFlag = false;
      this.addButton = true;
      this.EditDeleteDisable = true;
      this.institutionPromoterPopUp = true;
      this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
     
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
      this.onChangeExistedPrmoter(this.institutionPromoterDetailsModel.isExistingMember , false);
      this.updateData();
    }
    /**
     * @implements on institution promoter add
 
     */
    onRowAddInstitution() {
      this.promoterDetailsForm.get("photoUpload").reset();
      this.promoterDetailsForm.get("signatureUpload").reset();
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
 
     */
    fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
      
      this.multipleFilesList = [];
      if(this.isEdit && this.membershipBasicRequiredDetailsModel.filesDTOList == null || this.membershipBasicRequiredDetailsModel.filesDTOList == undefined){
        this.membershipBasicRequiredDetailsModel.filesDTOList = [];
      }
      if (filePathName === "individualPhotoCopy") {
        this.isFileUploadedPhoto = applicationConstants.FALSE;
      }
      if (filePathName === "individualSighnedCopy") {
        this.isFileUploadedsignature = applicationConstants.FALSE;
      }
      let files: FileUploadModel = new FileUploadModel();
      for (let file of event.files) {
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
            this.isFileUploadedPhoto = applicationConstants.TRUE;
            this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
            this.membershipBasicRequiredDetailsModel.photoCopyPath = null;
            this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = [];
            this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetailsModel.photoCopyPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "individualSighnedCopy") {
            this.isFileUploadedsignature = applicationConstants.TRUE;
            this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
            this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = [];
            this.membershipBasicRequiredDetailsModel.signatureCopyPath = null;
            this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicRequiredDetailsModel.signatureCopyPath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupPhotoCopy") {
            this.  memberGroupDetailsModel.filesDTOList.push(files);
            this.  memberGroupDetailsModel.signatureCopyPath = null;
            this.  memberGroupDetailsModel.filesDTOList[this.  memberGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.  memberGroupDetailsModel.signatureCopyPath = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupSignatureCopy") {
            this.  memberGroupDetailsModel.filesDTOList.push(files);
            this.  memberGroupDetailsModel.signatureCopyPath = null;
            this.  memberGroupDetailsModel.filesDTOList[this.  memberGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.  memberGroupDetailsModel.signatureCopyPath = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "intistutionPhotoCopy") {
            this.membershipInstitutionDetailsModel.filesDTOList.push(files);
            this.membershipInstitutionDetailsModel.signatureCopyPath = null;
            this.membershipInstitutionDetailsModel.filesDTOList[this.membershipInstitutionDetailsModel.filesDTOList.length - 1].fileName = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipInstitutionDetailsModel.signatureCopyPath = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "institutionSignature") {
            this.membershipInstitutionDetailsModel.filesDTOList.push(files);
            this.membershipInstitutionDetailsModel.signatureCopyPath = null;
            this.membershipInstitutionDetailsModel.filesDTOList[this.membershipInstitutionDetailsModel.filesDTOList.length - 1].fileName = "Institution_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipInstitutionDetailsModel.signatureCopyPath = "Institution_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          // let index1 = event.files.findIndex((x: any) => x === file);
          // fileUpload.remove(event, index1);
          // fileUpload.clear();
          this.updateData();
        }
        reader.readAsDataURL(file);
      }
    }
  
    /**
     * @implements onFileremove from file value
     * @param fileName 
 
     */
    fileRemoeEvent(fileName: any) {
        if (this.membershipBasicRequiredDetailsModel.filesDTOList != null && this.membershipBasicRequiredDetailsModel.filesDTOList != undefined && this.membershipBasicRequiredDetailsModel.filesDTOList.length > 0) {
          if (fileName == "individualPhotoCopy") {
            this.isFileUploadedPhoto = applicationConstants.FALSE;
          let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.photoCopyPath);
          let obj = this.membershipBasicRequiredDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.photoCopyPath);
          this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicRequiredDetailsModel.photoCopyPath = null;
        }
        if (fileName == "individualSighnedCopy") {
          this.isFileUploadedsignature = applicationConstants.FALSE;
          let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.signatureCopyPath);
          let obj = this.membershipBasicRequiredDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.signatureCopyPath);
          this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicRequiredDetailsModel.signatureCopyPath = null;
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
 
     */
    dateConverstion() {
      if(this.  memberGroupDetailsModel.admissionDateVal != undefined && this.  memberGroupDetailsModel.registrationDateVal != undefined){
        if( new Date(this.  memberGroupDetailsModel.admissionDateVal) <  new Date(this.  memberGroupDetailsModel.registrationDateVal)){
          this.groupForm.get('registrationDate')?.reset();
          this.groupForm.get('admissionDate')?.reset();
          this.groupForm.updateValueAndValidity();
          this.msgs = [{ severity: 'warning', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
          setTimeout(() => {
            this.msgs = [];        
          }, 2000);
        }
      }
  
      if (this.  memberGroupDetailsModel != null && this.  memberGroupDetailsModel != undefined) {
        if (this.  memberGroupDetailsModel.admissionDateVal != null && this.  memberGroupDetailsModel.admissionDateVal != undefined) {
          this.  memberGroupDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.  memberGroupDetailsModel.admissionDateVal));
        }
        if (this.  memberGroupDetailsModel.registrationDateVal != null && this.  memberGroupDetailsModel.registrationDateVal != undefined) {
          this.  memberGroupDetailsModel.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(this.  memberGroupDetailsModel.registrationDateVal));
        }
      }
      if (this.membershipBasicRequiredDetailsModel != null && this.membershipBasicRequiredDetailsModel != undefined) {
        if (this.membershipBasicRequiredDetailsModel.admissionDateVal != null && this.membershipBasicRequiredDetailsModel.admissionDateVal != undefined) {
          this.membershipBasicRequiredDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.admissionDateVal));
        }
        if (this.membershipBasicRequiredDetailsModel.dobVal != null && this.membershipBasicRequiredDetailsModel.dobVal != undefined) {
          this.membershipBasicRequiredDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicRequiredDetailsModel.dobVal));
        }
      }
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
 
     */
    onChangeExistedPrmoter(isExistingMember :any ,flag :boolean){
      if(flag){
        this.resetFields();
      }
      if(isExistingMember){
          this.admissionNumberDropDown = true;
          this.promoterDetailsForm.get('surname').disable();
          this.promoterDetailsForm.get('name').disable();
          this.promoterDetailsForm.get('operatorTypeId').disable();
          this.promoterDetailsForm.get('dob').disable();
          this.promoterDetailsForm.get('age').disable();
          this.promoterDetailsForm.get('genderId').disable();
          this.promoterDetailsForm.get('martialId').disable();
          this.promoterDetailsForm.get('mobileNumber').disable();
          this.promoterDetailsForm.get('aadharNumber').disable();
          this.promoterDetailsForm.get('emailId').disable();
          this.promoterDetailsForm.get('startDate').disable();
          
          this.promoterDetailsForm.get('admissionNumber').setValidators( Validators.compose([Validators.required]));
      }
      else {
          this.promoterDetailsForm.get('surname').enable();
          this.promoterDetailsForm.get('name').enable();
          this.promoterDetailsForm.get('operatorTypeId').enable();
          this.promoterDetailsForm.get('dob').enable();
          this.promoterDetailsForm.get('age').enable();
          this.promoterDetailsForm.get('genderId').enable();
          this.promoterDetailsForm.get('martialId').enable();
          this.promoterDetailsForm.get('mobileNumber').enable();
          this.promoterDetailsForm.get('aadharNumber').enable();
          this.promoterDetailsForm.get('emailId').enable();
          this.promoterDetailsForm.get('startDate').enable();
          this.admissionNumberDropDown = false;
      }
    }
  
    /**
     * @implements reset feilds 
 
     */
    resetFields(){
      this.promoterDetailsForm.get('surname').reset();
      this.promoterDetailsForm.get('name').reset();
      this.promoterDetailsForm.get('operatorTypeId').reset();
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
 
     * @implement get member module data by admission Number
     * @argument admissionNumber
     */
  getMemberDetailsByAdmissionNUmber(admissionNumber: any ) {
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
          
         this.promoterDetailsModel.name  = this.membershipBasicRequiredDetailsModel.name,
         this.promoterDetailsModel.surname  = this.membershipBasicRequiredDetailsModel.surname;
         this.promoterDetailsModel.aadharNumber  = this.membershipBasicRequiredDetailsModel.aadharNumber;
         this.promoterDetailsModel.dob  = this.membershipBasicRequiredDetailsModel.dob;
         if(this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
          this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
         this.promoterDetailsModel.age  = this.membershipBasicRequiredDetailsModel.age;
         this.promoterDetailsModel.genderId  = this.membershipBasicRequiredDetailsModel.genderId;
         this.promoterDetailsModel.martialId  = this.membershipBasicRequiredDetailsModel.martialId;
         this.promoterDetailsModel.mobileNumber  = this.membershipBasicRequiredDetailsModel.mobileNumber;
         this.promoterDetailsModel.emailId  = this.membershipBasicRequiredDetailsModel.emailId;
         this.promoterDetailsModel.startDate  = this.membershipBasicRequiredDetailsModel.admissionDate;
         if(this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
          this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
  
         this.promoterDetailsModel.uploadImage = this.membershipBasicRequiredDetailsModel.photoCopyPath;
         this.promoterDetailsModel.uploadSignature = 	this.membershipBasicRequiredDetailsModel.signatureCopyPath;
  
         this.institutionPromoterDetailsModel.uploadImage =  this.membershipBasicRequiredDetailsModel.photoCopyPath;
         this.institutionPromoterDetailsModel.uploadSignature =  	this.membershipBasicRequiredDetailsModel.signatureCopyPath;
  
        if(this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined){
          this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
          this.isFileUploadedPromoterPhoto= applicationConstants.TRUE;
        }
        if(this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined){
          this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
        }
         this.promoterDetailsModel.operatorTypeId  = this.membershipBasicRequiredDetailsModel.occupationId;
         
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
    onGroupLeaderSelect(isGroup:any) {
      if(isGroup){
        let isGroupLeadeExited = this.promoterDetails.filter((obj: any) => obj.isGroupLeader == true);
        if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length >0) {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
          setTimeout(() => {
            this.promoterDetailsForm.get('isGroupLeader').reset();
            this.msgs = [];
          }, 3000);
        }
      }
      else{
        let isGroupLeadeExited = this.institutionPromoter.filter((obj: any) => obj.isGroupLeader == true);
        if (isGroupLeadeExited != null && isGroupLeadeExited != undefined && isGroupLeadeExited.length >0) {
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "One Group leader is Already Exist" }];
          setTimeout(() => {
            this.promoterDetailsForm.get('isGroupLeader').reset();
            this.msgs = [];
          }, 3000);
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
      if(this.isEdit && this.promoterDetailsModel.filesDTOList == null || this.promoterDetailsModel.filesDTOList == undefined){
        this.promoterDetailsModel.filesDTOList = [];
      }
      if (filePathName === "groupPromoterImage") {
        this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      }
      if (filePathName === "groupPromoterSignature") {
        this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      }
      let files: FileUploadModel = new FileUploadModel();
      for (let file of event.files) {
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
            this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.promoterDetailsModel.uploadImage = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupPromoterSignature") {
            this.isFileUploadedPromoterSignature = applicationConstants.TRUE
            this.promoterDetailsModel.filesDTOList.push(files);
            this.promoterDetailsModel.uploadSignature = null;
            this.promoterDetailsModel.filesDTOList[this.promoterDetailsModel.filesDTOList.length - 1].fileName = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.promoterDetailsModel.uploadSignature = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          let index1 = event.files.findIndex((x: any) => x === file);
          fileUpload.remove(event, index1);
          fileUpload.clear();
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
      
      this.multipleFilesList = [];
      if(this.isEdit && this.institutionPromoterDetailsModel.filesDTOList == null || this.institutionPromoterDetailsModel.filesDTOList == undefined){
        this.institutionPromoterDetailsModel.filesDTOList = [];
      }
      if (filePathName === "institutionPromoterImage") {
        this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      }
      if (filePathName === "insitutionPromoterSignature") {
        this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      }
      let files: FileUploadModel = new FileUploadModel();
      for (let file of event.files) {
        let reader = new FileReader();
        reader.onloadend = (e) => {
          let timeStamp = this.commonComponent.getTimeStamp();
          let files = new FileUploadModel();
          this.uploadFileData = e.currentTarget;
          files.fileName = "Institution_Photo_copy" + "_" + timeStamp + "_" + file.name;
          files.fileType = file.type.split('/')[1];
          files.value = this.uploadFileData.result.split(',')[1];
          files.imageValue = this.uploadFileData.result;
          this.multipleFilesList.push(files);
           
          if (filePathName === "institutionPromoterImage") {
            this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
            this.institutionPromoterDetailsModel.filesDTOList.push(files);
            this.institutionPromoterDetailsModel.uploadImage = null;
            this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.institutionPromoterDetailsModel.uploadImage = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "insitutionPromoterSignature") {
            this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
            this.institutionPromoterDetailsModel.filesDTOList.push(files);
            this.institutionPromoterDetailsModel.uploadSignature = null;
            this.institutionPromoterDetailsModel.filesDTOList[this.institutionPromoterDetailsModel.filesDTOList.length - 1].fileName = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.institutionPromoterDetailsModel.uploadSignature = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          let index1 = event.files.findIndex((x: any) => x === file);
          fileUpload.remove(event, index1);
          fileUpload.clear();
          this.updateData();
        }
        reader.readAsDataURL(file);
      }
    }
    
  
    /**
     * @implements submit group institution details
 
     */
    submitGropOrInstitution() {
      this.termLoanApplicationModel.pacsId = this.pacsId;
      this.termLoanApplicationModel.pacsCode = 12;
      this.termLoanApplicationModel.branchId = this.branchId;
      if (this.termLoanApplicationId != null && this. termLoanApplicationId != undefined) {
        this.termLoanApplicationModel.statusName = applicationConstants.IS_ACTIVE;
        this.termLoanApplicationsService.updateTermApplication(this.termLoanApplicationModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
             this. termLoanApplicationId =  this.responseModel.data[0].id;
             this.groupOrInstitutionDisable = true;
             this.getTermApplicationByTermAccId(this. termLoanApplicationId);
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
        this.termLoanApplicationModel.statusName = applicationConstants.IS_ACTIVE;
        this.termLoanApplicationModel.accountStatusName = "In Progress";
        this.termLoanApplicationsService.addTermApplication(this.termLoanApplicationModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this. termLoanApplicationId =  this.responseModel.data[0].id;
              this.groupOrInstitutionDisable = true;
              this.getTermApplicationByTermAccId(this. termLoanApplicationId);
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
        this.termLoanApplicationsService.updateInstituionPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getTermApplicationByTermAccId(this. termLoanApplicationId);
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
        this.termLoanApplicationsService.addInstituionPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getTermApplicationByTermAccId(this. termLoanApplicationId);
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
 
     */
    saveGropPromotersDetails(rowData:any){
      if (rowData.id != null && rowData.id != undefined) {
        this.termLoanApplicationsService.updateGropDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.getTermApplicationByTermAccId(this. termLoanApplicationId);
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
        this.termLoanApplicationsService.addGroupPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.getTermApplicationByTermAccId(this. termLoanApplicationId);
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

}
