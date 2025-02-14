import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { GroupPromoterDetailsModel, InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel, promoterDetailsModel } from '../../../shared/membership-basic-detail.model';
import { RdAccountsService } from '../../../shared/rd-accounts.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { RdAccountsModel } from '../../../shared/term-depost-model.model';
import { Table } from 'primeng/table';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { CommunityService } from 'src/app/configurations/common-config/community/shared/community.service';
import { SelectItemGroup } from 'primeng/api';
import { CasteService } from 'src/app/configurations/common-config/caste/shared/caste.service';
import { QualificationService } from 'src/app/configurations/common-config/qualification/shared/qualification.service';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';

@Component({
  selector: 'app-recurring-deposit-new-member',
  templateUrl: './recurring-deposit-new-member.component.html',
  styleUrls: ['./recurring-deposit-new-member.component.css']
})

export class RecurringDepositNewMemberComponent {
  memberCreationForm: FormGroup;
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  communityList: any[] = [];

  membershipBasicDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  membershipGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: GroupPromoterDetailsModel = new GroupPromoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  rdAccountsModel: RdAccountsModel = new RdAccountsModel();
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
  rdAccId: any;
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
  requiredlist: any[] = [];

  groupOrInstitutionDisable : boolean = false;
  today: any;
      tempSubCasteList : any[] = [];
      tempSubQualificationList:any[] = [];
      groupedCasteSubCaste: SelectItemGroup[] =[];
      groupedQualificationSubQualification : any[] =[];
      subCasteList: any[] = [];
      subQualificationList:any[]=[];
      
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private rdAccountsService: RdAccountsService,

    // private rdAccountsService: CiLoanApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
        private casteService: CasteService,
        private qualificationService: QualificationService,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe, private fileUploadService :FileUploadService,private communityService: CommunityService) {
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
        qualificationId: ['',Validators.compose([Validators.required])],
        casteId:  ['',Validators.compose([Validators.required])],
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
      this. membershipBasicDetailsModel.filesDTOList = [];
      this.pacsId = 1;
      this.branchId = 1;
      this.today = new Date();
      this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
      this.orgnizationSetting = this.commonComponent.orgnizationSettings()
      this.maritalStatusList = this.commonComponent.maritalStatusList();
      this.requiredlist = this.commonComponent.requiredlist();
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
      // this.getAllQualificationType();
      this.getAllGroupedQualificationAndSubQualification();
      // this.getCastesList();
      this.getAllGroupedCasteAndSubCaste();
      this.getAllCommunityTypes();
  
      this.getAllTypeOfMembershipDetails(this.pacsId , this.branchId);
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.commonComponent.startSpinner();
          this.rdAccId = this.encryptDecryptService.decrypt(params['id']);
          this.getRdAccounts(this.rdAccId);
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
    getRdAccounts(id: any) {
      this.rdAccountsService.getRdAccounts(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.admisionNumber = this.responseModel.data[0].admissionNumber;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;;
                this.rdAccountsModel = this.responseModel.data[0];
                if (this.rdAccountsModel.memberShipBasicDetailsDTO != null && this. rdAccountsModel.memberShipBasicDetailsDTO != undefined) {
                  this. membershipBasicDetailsModel = this. rdAccountsModel.memberShipBasicDetailsDTO;
                  if(this. membershipBasicDetailsModel.memberTypeId != undefined && this. membershipBasicDetailsModel.memberTypeId){
                    this.memberTypeId = this. membershipBasicDetailsModel.memberTypeId;
                  }
  
                  if (this. membershipBasicDetailsModel.dob != null && this. membershipBasicDetailsModel.dob != undefined)
                    this. membershipBasicDetailsModel.dobVal = this.datePipe.transform(this. membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
  
                  if (this. membershipBasicDetailsModel.admissionDate != null && this. membershipBasicDetailsModel.admissionDate != undefined)
                    this. membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this. membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                  if (this.membershipBasicDetailsModel.photoPath != null && this.membershipBasicDetailsModel.photoPath != undefined) {
                    this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoPath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoPath  );
                    this.isFileUploadedPhoto = applicationConstants.TRUE;
                  }
                  if (this.membershipBasicDetailsModel.signaturePath != null && this.membershipBasicDetailsModel.signaturePath != undefined) {
                    this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signaturePath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signaturePath  );
                    this.isFileUploadedsignature = applicationConstants.TRUE;
                  }
                  this.disableMemberType = true;

                }
                if (this. rdAccountsModel.memberShipGroupDetailsDTO != null && this. rdAccountsModel.memberShipGroupDetailsDTO != undefined) {
                  this.membershipGroupDetailsModel = this. rdAccountsModel.memberShipGroupDetailsDTO;
                  this.groupOrInstitutionDisable = false;
                  if(this.membershipGroupDetailsModel.memberTypeId != undefined && this.membershipGroupDetailsModel.memberTypeId){
                    this.memberTypeId = this.membershipGroupDetailsModel.memberTypeId;
                  }
  
                  if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined)
                    this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

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
                      if(groupPromoters.genderId != null && groupPromoters.genderId != undefined){
                        let Obj = this.genderList.filter(obj => obj.value == groupPromoters.genderId);
                        if(Obj != null && Obj != undefined ){
                          groupPromoters.genderName = Obj[0].label ;
                        }
                      }
                      if (groupPromoters.authorizedSignatory != null && groupPromoters.authorizedSignatory != undefined && groupPromoters.authorizedSignatory) {
                        groupPromoters.authorizedSignatoryName = applicationConstants.YES;
                      }
                      else {
                        groupPromoters.authorizedSignatoryName = applicationConstants.NO;
                      }
                    }
                  }
                  this.disableMemberType = true;

                }
                if (this. rdAccountsModel.memInstitutionDTO != null && this. rdAccountsModel.memInstitutionDTO != undefined) {
                  this.membershipInstitutionDetailsModel = this. rdAccountsModel.memInstitutionDTO;
                  this.groupOrInstitutionDisable = false;
                  if(this.membershipInstitutionDetailsModel.memberTypeId != undefined && this.membershipInstitutionDetailsModel.memberTypeId){
                    this.memberTypeId = this.membershipInstitutionDetailsModel.memberTypeId;
                  }
                  if (this.membershipInstitutionDetailsModel.registrationDate != null && this.membershipInstitutionDetailsModel.registrationDate != undefined)
                    this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDate, this.orgnizationSetting.datePipe);

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
                      if (institution.authorizedSignatory != null && institution.authorizedSignatory != undefined && institution.authorizedSignatory) {
                        institution.authorizedSignatoryName = applicationConstants.YES;
                      }
                      else {
                        institution.authorizedSignatoryName = applicationConstants.NO;
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
      this.rdAccountsModel.memberType = this.memberTypeId;
      if (this.memberTypeName == "Individual") {
        this.individualFlag = true;
        this.isDisableFlag = (!this.memberCreationForm.valid) || !(this.isFileUploadedPhoto && this.isFileUploadedsignature)
        this.rdAccountsModel.memberTypeName = this.memberTypeName;
        this.membershipBasicDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipBasicDetailsModel.isNewMember = this.showForm;
        this.rdAccountsModel.memberShipBasicDetailsDTO = this.membershipBasicDetailsModel;
      }
      if (this.memberTypeName == "Group") {
        this.groupFlag = true;
        this.isDisableFlag = (!(this.groupForm.valid && (this.membershipGroupDetailsModel.groupPromoterList != null && this.membershipGroupDetailsModel.groupPromoterList != undefined && this.membershipGroupDetailsModel.groupPromoterList.length  >=2))) || this.groupPromoters
        this.membershipGroupDetailsModel.memberTypeId = this.memberTypeId;
        this.membershipGroupDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipGroupDetailsModel.isNewMember = this.showForm;
        this.rdAccountsModel.memberShipGroupDetailsDTO = this.membershipGroupDetailsModel;
        this.rdAccountsModel.memberTypeName = this.memberTypeName;
        this.addButton = !this.groupForm.valid;
      }
      if (this.memberTypeName == "Institution") {
        this.institutionFlag = true;
        this.isDisableFlag = (!(this.institutionForm.valid &&(this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length >0)))|| this.institutionPromoterPopUp
        this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
        this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
        this.rdAccountsModel.memberTypeName = this.memberTypeName;
        this.rdAccountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
        this.addButton = !this.institutionForm.valid;
    }
     
      this.rdAccountsService.changeData({
        formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
        data: this.rdAccountsModel,
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
      this.membershipBasicDetailsModel.relationTypeName = filteredItem.label;
  
    }
    /**
     * @implements get getAll relation Types
     * @author bhargavi
     */
    getAllRelationTypes() {
      this.rdAccountsService.getAllRelationTypes().subscribe((res: any) => {
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
      this.rdAccountsService.getAllOccupationTypes().subscribe((res: any) => {
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
    // getAllQualificationType() {
    //   this.rdAccountsService.getQualificationTypes().subscribe((res: any) => {
    //     this.responseModel = res;
    //     if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
    //       this.qualificationTypes = this.responseModel.data;
    //       this.qualificationTypes = this.qualificationTypes.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
    //         return { label: relationType.name, value: relationType.id };
    //       });
    //     }
    //   });
    // }
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
                this.groupedQualificationSubQualification = this.responseModel.data.filter((caste:any) => caste.status == applicationConstants.TRUE).map((count:any) => {
                  this.subQualificationList = [];
                  count.subQualificationList.filter((subCaste:any) => subCaste.status == applicationConstants.TRUE).map((subCount:any) => {
                    this.subQualificationList.push({ label: subCount.name, value: subCount.id})
                    this.tempSubQualificationList.push({ label: subCount.name, value: subCount.id})
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
          
          onChangeQualificationChange() {
            let qualification = this.tempSubQualificationList.find((data: any) => null != data && this.membershipBasicDetailsModel.qualificationId != null && data.value == this.membershipBasicDetailsModel.qualificationId);
              if (qualification != null && undefined != qualification)
                  this.membershipBasicDetailsModel.qualificationName = qualification.label;
          }
  
    /**
     * @implements get castes list
     * @author bhargavi
     */
    // getCastesList() {
    //   this.rdAccountsService.getCastes().subscribe((res: any) => {
    //     this.responseModel = res;
    //     if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
    //       this.castesList = this.responseModel.data;
    //       this.castesList = this.castesList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
    //         return { label: relationType.name, value: relationType.id };
    //       });
    //     }
    //   });
    // }
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
          onChangeCasteChange() {
            let caste = this.tempSubCasteList.find((data: any) => null != data && this.membershipBasicDetailsModel.casteId != null && data.value == this.membershipBasicDetailsModel.casteId);
            if (caste != null && undefined != caste)
            this.membershipBasicDetailsModel.casteName = caste.label;
          }
  
   
   /**
     * @implements get membership detaild by admission Number
     * @param admissionNumber 
     * @author bhargavi
     */
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.rdAccountsService.getMemBasicDetailsFromTdModule(admisionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipBasicDetailsModel = this.responseModel.data[0];
              if (this.membershipBasicDetailsModel.dob != null && this.membershipBasicDetailsModel.dob != undefined) {
                this.membershipBasicDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicDetailsModel.dob, this.orgnizationSetting.datePipe);
              }
              if (this.membershipBasicDetailsModel.admissionDate != null && this.membershipBasicDetailsModel.admissionDate != undefined) {
                this.membershipBasicDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if(this.membershipBasicDetailsModel.memberTypeId != undefined && this.membershipBasicDetailsModel.memberTypeId){
                this.memberTypeId = this.membershipBasicDetailsModel.memberTypeId;
              }
              if (this.membershipBasicDetailsModel.photoCopyPath != null && this.membershipBasicDetailsModel.photoCopyPath != undefined) {
                this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.photoCopyPath  );
                this.isFileUploadedPhoto = applicationConstants.TRUE;
              }
              if (this.membershipBasicDetailsModel.signatureCopyPath != null && this.membershipBasicDetailsModel.signatureCopyPath != undefined) {
                this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicDetailsModel.signatureCopyPath  );
                this.isFileUploadedsignature = applicationConstants.TRUE;
              }
              this.rdAccountsModel.memInstitutionDTO = this.membershipBasicDetailsModel;
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
      this.rdAccountsService.getMemGroupDetailsFromTdModule(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length != null && this.responseModel.data.length != undefined && this.responseModel.data.length > 0) {
              this.membershipGroupDetailsModel = this.responseModel.data[0];
              this.groupOrInstitutionDisable = false;
              if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
                this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
                this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
              if (this.membershipGroupDetailsModel.memberTypeId != null && this.membershipGroupDetailsModel.memberTypeId != undefined) {
                this.memberTypeId = this.membershipGroupDetailsModel.memberTypeId;
              }
             
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
                if(this.membershipGroupDetailsModel.memberTypeName != null && this.membershipGroupDetailsModel.memberTypeName != undefined){
                  this.rdAccountsModel.memberTypeName = this.membershipGroupDetailsModel.memberTypeName;
                }
                if(this.membershipGroupDetailsModel != null && this.membershipGroupDetailsModel != undefined){
                this.rdAccountsModel.memberShipGroupDetailsDTO = this.membershipGroupDetailsModel;
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
      this.rdAccountsService.getMemInstituteDetailsFromTdModule(admissionNumber).subscribe((response: any) => {
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
              this.rdAccountsModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
              this.rdAccountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
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
        this.membershipBasicDetailsModel = new MembershipBasicDetail();
        this.membershipBasicDetailsModel.memberTypeId = 1;
        this.rdAccountsModel.memberType = 1;
      }
      else if (event.value == 2) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.groupFlag = true;
        this.individualFlag = false;
        this.institutionFlag = false;
        this.membershipGroupDetailsModel.memberTypeId = 2;
        this.rdAccountsModel.memberType =2;
      }
      else if (event.value == 3) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.institutionFlag = true;
        this.individualFlag = false;
        this.groupFlag = false;
        this.membershipInstitutionDetailsModel.memberTypeId = 3;
        this.rdAccountsModel.memberType =3;
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
      if (!this.membershipGroupDetailsModel.groupPromotersDTOList) {
        this.membershipGroupDetailsModel.groupPromotersDTOList = []; // Initialize it as an empty array
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
      //   this.membershipGroupDetailsModel.groupPromoterList = this.promoterDetails;
      // }else{
      //   this.promoterDetails.push(rowData);
      //   this.membershipGroupDetailsModel.groupPromoterList = this.promoterDetails;
      // }
      rowData.groupId = this.membershipGroupDetailsModel.id;
      this.saveGropPromotersDetails(rowData);
      
    }
  
    /**
     * @implements cancle prmoters
     * @author bhargavi
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
     * @author bhargavi
     */
    editPromoter(rowData: any) {
      this.cancleButtonFlag = true;
      this.addButton = true;
      this.EditDeleteDisable = true;
      this.groupPromoters = true;
      this.promoterDetailsModel = new GroupPromoterDetailsModel();
      this.promoterDetailsModel = rowData;
      // this.promoterDetailsModel = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
      if(this.promoterDetailsModel.isExistingMember ){
        this.admissionNumberDropDown = true;
        this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
        this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
      }
      else{
        this.admissionNumberDropDown = false;
        this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
        this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
      }
      this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
      this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
      this.onChangeExistedPrmoter(this.promoterDetailsModel.isExistingMember , false);
      this.updateData();
    }
  
    /**
     * @implements row add of group promoters
     * @author bhargavi
     */
    onRowAddSave() {
      this.promoterDetailsModel = new GroupPromoterDetailsModel();
      // this.promoterDetailsForm.get("photoUpload").reset();
      // this.promoterDetailsForm.get("signatureUpload").reset();
      this.isFileUploadedPromoterPhoto = applicationConstants.FALSE;
      this.isFileUploadedPromoterSignature = applicationConstants.FALSE;
      this.groupPromoters = true;
      this.cancleButtonFlag = false;
      this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
      this.promoterDetailsForm.reset();
      this.onChangeExistedPrmoter(false , true);
      this.admissionNumberDropDown = false;
      this.updateData();
      
    }
    /**
     * @implements get all operator Details
     * @author bhargavi
     */
    getAllOperatorTypes() {
      this.commonComponent.startSpinner();
      this.rdAccountsService.getAllOperationTypes().subscribe((res: any) => {
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
     * @author bhargavi
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
     * @author bhargavi
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
        this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage  );
        this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );
      }
     
      this.isFileUploadedPromoterPhoto = applicationConstants.TRUE;
      this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
      this.onChangeExistedPrmoter(this.institutionPromoterDetailsModel.isExistingMember , false);
      this.updateData();
    }
    /**
     * @implements on institution promoter add
     * @author bhargavi
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
     * @author bhargavi
     */
    getAllMemberType() {
      this.rdAccountsService.getAllMemberTypes().subscribe((data: any) => {
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
     * @author bhargavi
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
     * @author bhargavi
     */
    fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
      
      this.multipleFilesList = [];
      if(this.isEdit && this.membershipBasicDetailsModel.filesDTOList == null || this.membershipBasicDetailsModel.filesDTOList == undefined){
        this.membershipBasicDetailsModel.filesDTOList = [];
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
            this.membershipBasicDetailsModel.filesDTOList.push(files);
            this.membershipBasicDetailsModel.photoPath = null;
            this.membershipBasicDetailsModel.multipartFileListForPhotoCopy = [];
            this.membershipBasicDetailsModel.filesDTOList[this.membershipBasicDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicDetailsModel.photoPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "individualSighnedCopy") {
            this.isFileUploadedsignature = applicationConstants.TRUE;
            this.membershipBasicDetailsModel.filesDTOList.push(files);
            this.membershipBasicDetailsModel.multipartFileListForsignatureCopyPath = [];
            this.membershipBasicDetailsModel.signaturePath = null;
            this.membershipBasicDetailsModel.filesDTOList[this.membershipBasicDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipBasicDetailsModel.signaturePath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupPhotoCopy") {
            this.membershipGroupDetailsModel.filesDTOList.push(files);
            this.membershipGroupDetailsModel.signaturePath = null;
            this.membershipGroupDetailsModel.filesDTOList[this.membershipGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipGroupDetailsModel.signaturePath = "Group_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupSignatureCopy") {
            this.membershipGroupDetailsModel.filesDTOList.push(files);
            this.membershipGroupDetailsModel.signaturePath = null;
            this.membershipGroupDetailsModel.filesDTOList[this.membershipGroupDetailsModel.filesDTOList.length - 1].fileName = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipGroupDetailsModel.signaturePath = "Group_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "intistutionPhotoCopy") {
            this.membershipInstitutionDetailsModel.filesDTOList.push(files);
            this.membershipInstitutionDetailsModel.signaturePath = null;
            this.membershipInstitutionDetailsModel.filesDTOList[this.membershipInstitutionDetailsModel.filesDTOList.length - 1].fileName = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipInstitutionDetailsModel.signaturePath = "Institution_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "institutionSignature") {
            this.membershipInstitutionDetailsModel.filesDTOList.push(files);
            this.membershipInstitutionDetailsModel.signaturePath = null;
            this.membershipInstitutionDetailsModel.filesDTOList[this.membershipInstitutionDetailsModel.filesDTOList.length - 1].fileName = "Institution_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
            this.membershipInstitutionDetailsModel.signaturePath = "Institution_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
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
     * @author bhargavi
     */
    fileRemoeEvent(fileName: any) {
        if (this.membershipBasicDetailsModel.filesDTOList != null && this.membershipBasicDetailsModel.filesDTOList != undefined && this.membershipBasicDetailsModel.filesDTOList.length > 0) {
          if (fileName == "individualPhotoCopy") {
            this.isFileUploadedPhoto = applicationConstants.FALSE;
          let removeFileIndex = this.membershipBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.photoCopyPath);
          let obj = this.membershipBasicDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.photoCopyPath);
          this.membershipBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicDetailsModel.photoCopyPath = null;
        }
        if (fileName == "individualSighnedCopy") {
          this.isFileUploadedsignature = applicationConstants.FALSE;
          let removeFileIndex = this.membershipBasicDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.signatureCopyPath);
          let obj = this.membershipBasicDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicDetailsModel.signatureCopyPath);
          this.membershipBasicDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicDetailsModel.signatureCopyPath = null;
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
     * @author bhargavi
     */
    dateConverstion() {
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
      if (this.membershipBasicDetailsModel != null && this.membershipBasicDetailsModel != undefined) {
        if (this.membershipBasicDetailsModel.admissionDateVal != null && this.membershipBasicDetailsModel.admissionDateVal != undefined) {
          this.membershipBasicDetailsModel.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.admissionDateVal));
        }
        if (this.membershipBasicDetailsModel.dobVal != null && this.membershipBasicDetailsModel.dobVal != undefined) {
          this.membershipBasicDetailsModel.dob = this.commonFunctionsService.getUTCEpoch(new Date(this.membershipBasicDetailsModel.dobVal));
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
     * @author bhargavi
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
     * @author bhargavi
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
     * @author bhargavi
     * @implement get member admission Numbers list
     * @argument pacsId,branchId
     */
  getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
    this.rdAccountsService.getAllTypeOfMemberDetailsListFromMemberModule(this.pacsId, this.branchId).subscribe((response: any) => {
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
  getMemberDetailsByAdmissionNUmber(admissionNumber: any ) {
    this.rdAccountsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length >0) {
          this.membershipBasicDetailsModel = this.responseModel.data[0];
          this.membershipBasicDetailsModel.photoPath = this.responseModel.data[0].photoCopyPath;
          this.membershipBasicDetailsModel.signaturePath = this.responseModel.data[0].signatureCopyPath;
         this.promoterDetailsModel.name  = this.membershipBasicDetailsModel.name,
         this.promoterDetailsModel.surname  = this.membershipBasicDetailsModel.surname;
         this.promoterDetailsModel.aadharNumber  = this.membershipBasicDetailsModel.aadharNumber;
         this.promoterDetailsModel.dob  = this.membershipBasicDetailsModel.dob;
         if(this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
          this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
         this.promoterDetailsModel.age  = this.membershipBasicDetailsModel.age;
         this.promoterDetailsModel.genderId  = this.membershipBasicDetailsModel.genderId;
         this.promoterDetailsModel.martialId  = this.membershipBasicDetailsModel.martialId;
         this.promoterDetailsModel.mobileNumber  = this.membershipBasicDetailsModel.mobileNumber;
         this.promoterDetailsModel.emailId  = this.membershipBasicDetailsModel.emailId;
         this.promoterDetailsModel.startDate  = this.membershipBasicDetailsModel.admissionDate;
         if(this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
          this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
  
         this.promoterDetailsModel.uploadImage = this.membershipBasicDetailsModel.photoCopyPath;
         this.promoterDetailsModel.uploadSignature = 	this.membershipBasicDetailsModel.signatureCopyPath;
  
         this.institutionPromoterDetailsModel.uploadImage =  this.membershipBasicDetailsModel.photoCopyPath;
         this.institutionPromoterDetailsModel.uploadSignature =  	this.membershipBasicDetailsModel.signatureCopyPath;
  
        if(this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined){
          this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
          this.isFileUploadedPromoterPhoto= applicationConstants.TRUE;
        }
        if(this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined){
          this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
          this.isFileUploadedPromoterSignature = applicationConstants.TRUE;
        }
         this.promoterDetailsModel.operatorTypeId  = this.membershipBasicDetailsModel.occupationId;
         
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
     * @author bhargavi
     */
    submitGropOrInstitution() {
      this.rdAccountsModel.pacsId = this.pacsId;
      this.rdAccountsModel.pacsCode = 12;
      this.rdAccountsModel.branchId = this.branchId;
      if (this.rdAccId != null && this.rdAccId != undefined) {
        this.rdAccountsModel.statusName = applicationConstants.IS_ACTIVE;
        this.rdAccountsService.updateRbAccounts(this.rdAccountsModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
             this.rdAccId =  this.responseModel.data[0].id;
             this.groupOrInstitutionDisable = true;
             this.getRdAccounts(this.rdAccId);
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
        this.rdAccountsModel.statusName = applicationConstants.IS_ACTIVE;
        this.rdAccountsModel.statusName = "In Progress";
        this.rdAccountsService.addRdAccounts(this.rdAccountsModel).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.rdAccId =  this.responseModel.data[0].id;
              this.groupOrInstitutionDisable = true;
              this.getRdAccounts(this.rdAccId);
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
        this.rdAccountsService.updateInstitutionPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getRdAccounts(this.rdAccId);
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
        this.rdAccountsService.addInstitutionPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
              this.getRdAccounts(this.rdAccId);
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
    saveGropPromotersDetails(rowData:any){
      if (rowData.id != null && rowData.id != undefined) {
        this.rdAccountsService.updateGroupPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.getRdAccounts(this.rdAccId);
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
        this.rdAccountsService.addGroupPromoterDetails(rowData).subscribe((response: any) => {
          this.responseModel = response;
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 1200);
            this.getRdAccounts(this.rdAccId);
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
    datesValidationCheckAgeAndDob(model: any, type: number): void {
      if (type === 2) {
        if (model.dobVal) {
          const calculatedAge = this.calculateAge(model.dobVal);
          model.age = calculatedAge;
        }
      } else if (type === 1) {
        if (model.age && model.age > 0) {
          const calculatedDob = this.calculateDobFromAge(model.age);
          model.dobVal = calculatedDob;
          this.membershipBasicDetailsModel.dob = this.commonFunctionsService.getUTCEpochWithTime(model.dobVal);
        } else if (model.age != null && model.age <= 0) {
          this.memberCreationForm.get('age')?.reset();
          this.msgs = [{ severity: 'error', detail: "Age should not be zero or negative" }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);

        }
      }
    }
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

    // Method to calculate date of birth from age
    calculateDobFromAge(age: number): Date {
      if (isNaN(age) || age <= 0) {
        return new Date(0);
      }
      const today = new Date();
      const birthYear = today.getFullYear() - age;
      const dob = new Date(today);
      dob.setFullYear(birthYear);
      dob.setMonth(0);
      dob.setDate(1);
      return dob;
    }

      promoterageCaluculation(flag: any, isGroupFlag: any) {
        if (isGroupFlag) {
          if (flag) {
            if (this.promoterDetailsModel.age != null && this.promoterDetailsModel.age != undefined) {
              if (this.promoterDetailsModel.age > 0) {
                const currentDate = new Date();
                const birthYear = currentDate.getFullYear() - this.promoterDetailsModel.age;
                const birthMonth = currentDate.getMonth();
                const birthDate = currentDate.getDate();
                const dob = new Date(birthYear, birthMonth, birthDate);
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;
                this.promoterDetailsModel.memDobVal = formattedDob;
              }
              else {
                this.promoterDetailsForm.get('age')?.reset();
                this.promoterDetailsForm.get("dateOfBirth")?.reset();
                this.msgs = [{ severity: 'error', detail: termdeposittransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
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
              const currentDate = new Date();
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
                const birthYear = currentDate.getFullYear() - this.institutionPromoterDetailsModel.age;
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
                this.msgs = [{ severity: 'error', detail: termdeposittransactionconstant.AGE_SHOULD_NOT_BE_ZERO }];
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
}
