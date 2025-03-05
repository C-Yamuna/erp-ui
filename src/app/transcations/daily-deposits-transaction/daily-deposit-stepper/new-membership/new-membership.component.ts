import { Component, ViewChild } from '@angular/core';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { GroupPromoterDetailsModel, InstitutionPromoterDetailsModel, MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { Accounts } from '../../shared/accounts.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Table } from 'primeng/table';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-new-membership',
  templateUrl: './new-membership.component.html',
  styleUrls: ['./new-membership.component.css']
})
export class NewMembershipComponent {
  memberCreationForm: any; 
  groupForm: FormGroup;
  institutionForm: FormGroup;
  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];

  membershipBasicRequiredDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  promoterDetailsModel: GroupPromoterDetailsModel = new GroupPromoterDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  rdAccountsModel: Accounts = new Accounts();
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
  addButton: boolean = false;
  EditDeleteDisable: boolean = false;
  newRow: any;
  groupPrmotersList: any[] = [];
  memberTypeId: any;

  @ViewChild('dt', { static: false }) private dt!: Table;
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
  isFileUploaded: any;
  communityList: any[]=[];

  age: any;
  cancleButtonFlag : Boolean = true;
  promoterDetails: any[] = [];
  groupPromoters: boolean = false;
  admissionNumberDropDown: boolean = false;
  institutionPromoterPopUp: boolean = false;
  isExistingMember:Boolean =false;
  admissionNumbersList:any[]=[];
  promterTypeDisabled : any;
  subProductList:any[]=[];
  today:any;
  isFileUploadedPhoto: Boolean =false;
  isFileUploadedsignature: Boolean =false;
  fileSizeMsgResulutionCopy :any;
  fileSizeMsgForImage:any;
  fileSizeMsgForSignature :any;
  trueFalseList: any[] = [];
  groupedQualificationSubQualification: any[]=[];
  subQualificationList: any[]=[];
  tempSubQualificationList: any[]=[];
  tempSubCasteList: any[]=[];
  groupedCasteSubCaste: any[]=[];
  subCasteList: any[]=[];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private fileUploadService :FileUploadService,
    private dailyDepositsAccountsService :DailyDepositsAccountsService) {
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
      // "mcrNumber":  new FormControl('', [Validators.pattern(applicationConstants.ALLOW_NUMBERS), Validators.maxLength(40)]),
    
      })
      this.groupForm = this.formBuilder.group({
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationDate: ['', Validators.required],
        admissionDate: ['', Validators.required],
        // pocNumber: ['', Validators.required],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
        tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.compose([Validators.required])]],
        gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.compose([Validators.required])]],
  
      })
      this.institutionForm = this.formBuilder.group({
        name: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationNumber: ['', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS), Validators.compose([Validators.required])]],
        registrationDate: ['', Validators.required],
        admissionDate: ['', Validators.required],
        // pocName: ['', Validators.required],
        mobileNumber: ['', [Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.compose([Validators.required])]],
        panNumber: ['', [Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN), Validators.compose([Validators.required])]],
        tanNumber: ['', [Validators.pattern(applicationConstants.TAN_NUMBER), Validators.compose([Validators.required])]],
        gstNumber: ['', [Validators.pattern(applicationConstants.GST_NUMBER_PATTERN), Validators.compose([Validators.required])]],
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
      this.trueFalseList = this.commonComponent.requiredlist();
      this.today = new Date();
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

      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          this.commonComponent.startSpinner();
          this.rdAccId = this.encryptDecryptService.decrypt(params['id']);
          this.getRdAccounts(this.rdAccId);
          this.isEdit = true;
        }
        else {
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
  
   * @author jyothi.naidana
   */
    getAllCommunityTypes() {
      this.commonComponent.startSpinner();
      this.dailyDepositsAccountsService.getAllCommunity().subscribe((res: any) => {
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
    getRdAccounts(id: any) {
      this.dailyDepositsAccountsService.getAccounts(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.admisionNumber = this.responseModel.data[0].admissionNumber;
                this.memberTypeName = this.responseModel.data[0].memberTypeName;;
                this.rdAccountsModel = this.responseModel.data[0];
                if (this.rdAccountsModel.memberShipBasicDetailsDTO != null && this.rdAccountsModel.memberShipBasicDetailsDTO != undefined) {
                  this.membershipBasicRequiredDetailsModel = this.rdAccountsModel.memberShipBasicDetailsDTO;
                  if(this.membershipBasicRequiredDetailsModel.memberTypeId != undefined && this.membershipBasicRequiredDetailsModel.memberTypeId){
                    this.memberTypeId = this.membershipBasicRequiredDetailsModel.memberTypeId;
                  }
  
                  if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined)
                    this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
  
                  if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined)
                    this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
  
                  if (this.membershipBasicRequiredDetailsModel.photoPath != null && this.membershipBasicRequiredDetailsModel.photoPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoPath);
                  }
                  if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                    this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath);
                  }
                  this.disableMemberType = true;

                }
                if (this.rdAccountsModel.memberShipGroupDetailsDTO != null && this.rdAccountsModel.memberShipGroupDetailsDTO != undefined) {
                  this.memberGroupDetailsModel = this.rdAccountsModel.memberShipGroupDetailsDTO;
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
                if (this.rdAccountsModel.memInstitutionDTO != null && this.rdAccountsModel.memInstitutionDTO != undefined) {
                  this.membershipInstitutionDetailsModel = this.rdAccountsModel.memInstitutionDTO;
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
          }
        }
      });
    }
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
      this. rdAccountsModel.memberType = this.memberTypeId;
      if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
        this.individualFlag = true;
        this.isDisableFlag = (!this.memberCreationForm.valid) || !(this.isFileUploadedPhoto && this.isFileUploadedsignature)
        this. rdAccountsModel.memberTypeName = this.memberTypeName;
        this.membershipBasicRequiredDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipBasicRequiredDetailsModel.isNewMember = this.showForm;
        this. rdAccountsModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetailsModel;
      }
      if (this.memberTypeName == MemberShipTypesData.GROUP) {
        this.groupFlag = true;
        this.isDisableFlag = !(this.groupForm.valid && (this.memberGroupDetailsModel.groupPromoterList != null && this.memberGroupDetailsModel.groupPromoterList != undefined && this.memberGroupDetailsModel.groupPromoterList.length  >0))
        this.memberGroupDetailsModel.memberTypeId = this.memberTypeId;
        this.memberGroupDetailsModel.memberTypeName = this.memberTypeName;
        this.memberGroupDetailsModel.isNewMember = this.showForm;
        this. rdAccountsModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
        this. rdAccountsModel.memberTypeName = this.memberTypeName;
        this.addButton = !this.groupForm.valid;
      }
      if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
        this.institutionFlag = true;
        this.isDisableFlag = !(this.institutionForm.valid &&(this.membershipInstitutionDetailsModel.institutionPromoterList != null && this.membershipInstitutionDetailsModel.institutionPromoterList != undefined && this.membershipInstitutionDetailsModel.institutionPromoterList.length >0))
        this.membershipInstitutionDetailsModel.memberTypeId = this.memberTypeId;
        this.membershipInstitutionDetailsModel.memberTypeName = this.memberTypeName;
        this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
        this. rdAccountsModel.memberTypeName = this.memberTypeName;
        this. rdAccountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
        this.addButton = !this.institutionForm.valid;
    }
     
      this.dailyDepositsAccountsService.changeData({
        formValid: this.memberCreationForm.valid ? true : false || (this.institutionForm.valid) ? true : false || (this.groupForm.valid) ? true : false,
        data: this. rdAccountsModel,
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
      this.dailyDepositsAccountsService.getAllRelationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.relationTypesList = this.responseModel.data;
          this.relationTypesList = this.relationTypesList.filter((obj: any) => obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
        }
      });
    }
    /**
     * @implements get getAll Occupation Types
    
     */
    getAllOccupationTypes() {
      this.dailyDepositsAccountsService.getAllOccupationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.occupationTypeList = this.responseModel.data;
          this.occupationTypeList = this.occupationTypeList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((relationType: { name: any; id: any; }) => {
            return { label: relationType.name, value: relationType.id };
          });
  
        }
      });
    }

    onChangeOccupationChange() {
      let occupation = this.occupationTypeList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.occupationId != null && data.value == this.membershipBasicRequiredDetailsModel.occupationId);
      if (occupation != null && undefined != occupation)
      this.membershipBasicRequiredDetailsModel.occupationName = occupation.label;
    }

    /**
     * @implements get getAll Qualification Types
    
     */
    getAllQualificationType() {
      this.dailyDepositsAccountsService.getAllQualificationSubQualification().subscribe((res: any) => {
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
  
    onChangeQualificationChange() {
      let qualification = this.tempSubQualificationList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.qualificationId != null && data.value == this.membershipBasicRequiredDetailsModel.qualificationId);
        if (qualification != null && undefined != qualification)
            this.membershipBasicRequiredDetailsModel.qualificationName = qualification.label;
    }
    /**
     * @implements get castes list
    
     */
    getCastesList() {
      this.dailyDepositsAccountsService.getAllCasteSubCaste().subscribe((res: any) => {
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
    onChangeCasteChange() {
      let caste = this.tempSubCasteList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.casteId != null && data.value == this.membershipBasicRequiredDetailsModel.casteId);
      if (caste != null && undefined != caste)
      this.membershipBasicRequiredDetailsModel.casteName = caste.label;
    }
   
   /**
     * @implements get membership detaild by admission Number
     * @param admissionNumber 
    
     */
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.dailyDepositsAccountsService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((response: any) => {
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
                this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoCopyPath  );
                this.isFileUploadedPhoto = applicationConstants.TRUE;
              }
              if (this.membershipBasicRequiredDetailsModel.signatureCopyPath != null && this.membershipBasicRequiredDetailsModel.signatureCopyPath != undefined) {
                this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signatureCopyPath ,ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signatureCopyPath  );
                this.isFileUploadedsignature = applicationConstants.TRUE;
              }
              this. rdAccountsModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetailsModel;
              this. rdAccountsModel.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
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
      this.dailyDepositsAccountsService.getMemberGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.memberGroupDetailsModel = this.responseModel.data[0];
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
                  }
                }
                if(this.memberGroupDetailsModel.memberTypeName != null && this.memberGroupDetailsModel.memberTypeName != undefined){
                  this. rdAccountsModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
                }
                if(this.memberGroupDetailsModel != null && this.memberGroupDetailsModel != undefined){
                this. rdAccountsModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
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
     * @implements get institution details by admission Number
     * @param admissionNumber 
    
     */
    getInstitutionByAdmissionNumber(admissionNumber: any) {
      this.dailyDepositsAccountsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipInstitutionDetailsModel = this.responseModel.data[0];
  
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
                }
              }
              this. rdAccountsModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
              this. rdAccountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
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
      }
      else if (event.value == 2) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.groupFlag = true;
        this.individualFlag = false;
        this.institutionFlag = false;
        this.memberGroupDetailsModel.memberTypeId = 2;
      }
      else if (event.value == 3) {
        this.addButton = false;
        this.EditDeleteDisable = false;
        this.institutionFlag = true;
        this.individualFlag = false;
        this.groupFlag = false;
        this.membershipInstitutionDetailsModel.memberTypeId = 3;
      }
      this.updateData();
    }
  
  
   /**
    * @implements save group prmoters
    * @param rowData 
   
    */
    savePromoterDetails(rowData: any) {
      this.groupPromoters = false;
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
      
      if (rowData.startDate != null && rowData.startDate != undefined) {
        rowData.startDateVal  = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
      }
      if (!this.memberGroupDetailsModel.groupPromoterList) {
        this.memberGroupDetailsModel.groupPromoterList = []; // Initialize it as an empty array
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
      if(this.promoterDetails != null && this.promoterDetails != undefined && this.promoterDetails.length > 0 ){
        const kyc = this.promoterDetails.findIndex((obj:any) => (obj != null && obj != undefined ) && obj.uniqueId === rowData.uniqueId );
        if(kyc != -1){
          this.promoterDetails[kyc] = null;
          this.promoterDetails[kyc] = rowData;
        }
        else{
          this.promoterDetails.push(rowData);
        }
        this.memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
      }else{
        this.promoterDetails.push(rowData);
        this.memberGroupDetailsModel.groupPromoterList = this.promoterDetails;
      }
      this.updateData();
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
      this.promoterDetailsModel = new GroupPromoterDetailsModel();
      this.promoterDetailsModel = this.promoterDetails.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
      if(this.promoterDetailsModel.isExistingMember ){
        this.admissionNumberDropDown = true;
      }
      else{
        this.admissionNumberDropDown = false;
      }
      this.promoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage  );
      this.promoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
      
    }
  
    /**
     * @implements row add of group promoters
    
     */
    onRowAddSave() {
      this.groupPromoters = true;
      this.cancleButtonFlag = false;
      this.promoterDetailsModel = new GroupPromoterDetailsModel();
      this.promoterDetailsModel.uniqueId = this.promoterDetails.length + 1
      this.promoterDetailsForm.reset();
      this.onChangeExistedPrmoter(false);
      this.admissionNumberDropDown = false;
    }
    /**
     * @implements get all operator Details
    
     */
    getAllOperatorTypes() {
      this.commonComponent.startSpinner();
      this.dailyDepositsAccountsService.getAllOperationTypes().subscribe((res: any) => {
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
  
      if (!this.membershipInstitutionDetailsModel.institutionPromoterList) {
        this.membershipInstitutionDetailsModel.institutionPromoterList = []; // Initialize it as an empty array
      }
      if(this.institutionPromoter != null && this.institutionPromoter != undefined && this.institutionPromoter.length > 0){
        const kyc = this.institutionPromoter.findIndex((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
        if(kyc != -1){
          this.institutionPromoter[kyc] = null;
          this.institutionPromoter[kyc] = rowData;
        }
        else {
          this.institutionPromoter.push(rowData);
        }
        this.membershipInstitutionDetailsModel.institutionPromoterList = this.institutionPromoter;
      }
      else{
        this.institutionPromoter.push(rowData);
        this.membershipInstitutionDetailsModel.institutionPromoterList = this.institutionPromoter;
      }
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
      this.institutionPromoterDetailsModel =  this.institutionPromoter.find((obj:any) => (obj != null && obj != undefined) && obj.uniqueId === rowData.uniqueId );
      if(this.institutionPromoterDetailsModel.isExistingMember ){
        this.admissionNumberDropDown = true;
      }
      else{
        this.admissionNumberDropDown = false;
      }
      this.institutionPromoterDetailsModel.multipartFileListForPhotoCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadImage  );
      this.institutionPromoterDetailsModel.multipartFileListForSignatureCopyPath = this.fileUploadService.getFile(this.institutionPromoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.institutionPromoterDetailsModel.uploadSignature  );
    }
    /**
     * @implements on institution promoter add
    
     */
    onRowAddInstitution() {
      this.institutionPromoterPopUp = true;
      this.cancleButtonFlag = true;
      let uniqueId = this.institutionPromoter.length + 1
      this.institutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
      this.institutionPromoterDetailsModel.uniqueId = uniqueId; 
      this.promoterDetailsForm.reset();
      this.admissionNumberDropDown = false;
      
    }
  
    /**
     * @implements get All member types 
    
     */
    getAllMemberType() {
      this.dailyDepositsAccountsService.getAllMemberTypes().subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberTypeList = this.responseModel.data;
            this.memberTypeList = this.memberTypeList.filter((obj: any) => obj != null && obj.name==="Individual").map((relationType: { name: any; id: any; }) => {
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
    membershipDataFromSbModule() {
      if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
        this.individualFlag = true;
        // this.getMemberDetailsByAdmissionNumber(this.admisionNumber);
      } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
        this.groupFlag = true;
        this.getGroupByAdmissionNumber(this.admisionNumber);
      } else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
        this.institutionFlag = true;
        this.getInstitutionByAdmissionNumber(this.admisionNumber);
      }
    }
  
    /**
     * @implements image uploader
     * @param event 
     * @param fileUpload 
    
     */
    fileUploader(event: any, fileUploadPhoto: FileUpload, fileUploadSign: FileUpload, filePathName: any) {
      this.multipleFilesList = [];
      let fileSizeFalg = false;
      if(this.isEdit && this.membershipBasicRequiredDetailsModel.filesDTOList == null || this.membershipBasicRequiredDetailsModel.filesDTOList == undefined){
        this.membershipBasicRequiredDetailsModel.filesDTOList = [];
      }
      let selectedFiles = [...event.files];
      if (filePathName === "individualPhotoCopy") {
        this.isFileUploadedPhoto = applicationConstants.FALSE;
        if (selectedFiles[0].size/1024/1024 > 2) {
          this.fileSizeMsgForImage= "file is bigger than 2MB";
          fileSizeFalg = true;
         }
        this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = [];
        // Clear file input before processing files
        fileUploadPhoto.clear();
      }
      if (filePathName === "individualSighnedCopy") {
        this.isFileUploadedsignature = applicationConstants.FALSE;
        this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = [];
        if (selectedFiles[0].size/1024/1024 > 2) {
          this.fileSizeMsgForSignature = "file is bigger than 2MB";
          fileSizeFalg = true;
         }
        fileUploadSign.clear();
      }
      // if (filePathName === "resulutionCopy") {
      //   this.membershipBasicRequiredDetailsModel.mcrDocumentCopyMultiPartFileList = [];
      //   if (selectedFiles[0].size/1000000  > 5) {
      //     this.fileSizeMsgResulutionCopy = "file is bigger than 5MB";
      //     fileSizeFalg = true;
      //   }
      //   fileUploadSign.clear();
      // }
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
              this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
              this.membershipBasicRequiredDetailsModel.photoCopyPath = null;
              this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy.push(files);
              this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name;
              this.membershipBasicRequiredDetailsModel.photoCopyPath = "Individual_Member_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
            }
            else if (filePathName === "individualSighnedCopy") {
              this.fileSizeMsgForSignature = null;
              files.fileName = "Individual_Member_Signature_copy" + "_" + timeStamp + "_" + file.name;
              this.isFileUploadedsignature = applicationConstants.TRUE;
              this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
              this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath.push(files);
              this.membershipBasicRequiredDetailsModel.signatureCopyPath = null;
              this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name;
              this.membershipBasicRequiredDetailsModel.signatureCopyPath = "Individual_Member_signed_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
            }
            // else if (filePathName === "resulutionCopy") {
            //   this.fileSizeMsgResulutionCopy = null;
            //   files.fileName = "Resulution_copy" + "_" + timeStamp + "_" + file.name;
            //   this.membershipBasicRequiredDetailsModel.filesDTOList.push(files);
            //   this.membershipBasicRequiredDetailsModel.mcrDocumentCopyMultiPartFileList.push(files);
            //   this.membershipBasicRequiredDetailsModel.mcrDocumentCopy = null;
            //   this.membershipBasicRequiredDetailsModel.filesDTOList[this.membershipBasicRequiredDetailsModel.filesDTOList.length - 1].fileName = "Resulution_copy" + "_" + timeStamp + "_" + file.name;
            //   this.membershipBasicRequiredDetailsModel.mcrDocumentCopy = "Resulution_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
            // }
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
     */
    fileRemoeEvent(fileName: any) {
        if (this.membershipBasicRequiredDetailsModel.filesDTOList != null && this.membershipBasicRequiredDetailsModel.filesDTOList != undefined && this.membershipBasicRequiredDetailsModel.filesDTOList.length > 0) {
          if (fileName == "individualPhotoCopy") {
            this.isFileUploadedPhoto = applicationConstants.FALSE;
          let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.photoPath);
          let obj = this.membershipBasicRequiredDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.photoPath);
          this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicRequiredDetailsModel.photoPath = null;
        }
        if (fileName == "individualSighnedCopy") {
          this.isFileUploadedsignature = applicationConstants.FALSE;
          let removeFileIndex = this.membershipBasicRequiredDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.signaturePath);
          let obj = this.membershipBasicRequiredDetailsModel.filesDTOList.find((obj: any) => obj && obj.fileName === this.membershipBasicRequiredDetailsModel.signaturePath);
          this.membershipBasicRequiredDetailsModel.filesDTOList.splice(removeFileIndex, 1);
          this.membershipBasicRequiredDetailsModel.signaturePath = null;
        }
      }
    }
  
    /**
     * @implements date converstions
    
     */
    dateConverstion() {
  
      if(this.memberGroupDetailsModel.admissionDateVal != undefined && this.memberGroupDetailsModel.registrationDateVal != undefined){
        if( new Date(this.memberGroupDetailsModel.admissionDateVal) <  new Date(this.memberGroupDetailsModel.registrationDateVal)){
          this.groupForm.get('registrationDate')?.reset();
          this.groupForm.get('admissionDate')?.reset();
          this.groupForm.updateValueAndValidity();
          this.msgs = [{ severity: 'warn', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
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
      this.ageCaluculation(false);
    }
  
    /**
     * @implements onchange existed prmoter
    
     */
    onChangeExistedPrmoter(isExistingMember :any){
      if(isExistingMember){
          this.admissionNumberDropDown = true;
          this.getAllTypeOfMembershipDetails(this.pacsId,this.branchId);
          this.resetFields();
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
        this.resetFields();
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
  getAllTypeOfMembershipDetails(admissionNUmber: any, branchId: any) {
    this.dailyDepositsAccountsService.getAllMembershipDetailsFromMembership(this.pacsId, this.branchId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.allTypesOfmembershipList = this.responseModel.data;
            this.admissionNumbersList = this.allTypesOfmembershipList.filter((obj: any) => (obj != null) && obj.memberTypeName == "Individual").map((relationType: { id: any; name: any; admissionNumber: any; memberTypeName: any }) => {
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
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.dailyDepositsAccountsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
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
      this.isFileUploaded = applicationConstants.FALSE;
      this.multipleFilesList = [];
      if(this.isEdit && this.promoterDetailsModel.filesDTO == null || this.promoterDetailsModel.filesDTO == undefined){
        this.promoterDetailsModel.filesDTO = [];
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
            this.promoterDetailsModel.filesDTO.push(files);
            this.promoterDetailsModel.uploadImage = null;
            this.promoterDetailsModel.filesDTO[this.promoterDetailsModel.filesDTO.length - 1].fileName = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.promoterDetailsModel.uploadImage = "Group_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "groupPromoterSignature") {
            this.promoterDetailsModel.filesDTO.push(files);
            this.promoterDetailsModel.uploadSignature = null;
            this.promoterDetailsModel.filesDTO[this.promoterDetailsModel.filesDTO.length - 1].fileName = "Group_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
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
      this.isFileUploaded = applicationConstants.FALSE;
      this.multipleFilesList = [];
      if(this.isEdit && this.institutionPromoterDetailsModel.filesDTO == null || this.institutionPromoterDetailsModel.filesDTO == undefined){
        this.institutionPromoterDetailsModel.filesDTO = [];
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
            this.institutionPromoterDetailsModel.filesDTO.push(files);
            this.institutionPromoterDetailsModel.uploadImage = null;
            this.institutionPromoterDetailsModel.filesDTO[this.institutionPromoterDetailsModel.filesDTO.length - 1].fileName = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name;
            this.institutionPromoterDetailsModel.uploadImage = "Institution_Promoter_Photo_copy" + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
          }
          if (filePathName === "insitutionPromoterSignature") {
            this.institutionPromoterDetailsModel.filesDTO.push(files);
            this.institutionPromoterDetailsModel.uploadSignature = null;
            this.institutionPromoterDetailsModel.filesDTO[this.institutionPromoterDetailsModel.filesDTO.length - 1].fileName = "Institution_Promoter_signed_copy" + "_" + timeStamp + "_" + file.name;
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
    getAllSubProducts() {
      this.commonComponent.startSpinner();
      this.dailyDepositsAccountsService.getAllSubProduct().subscribe((res: any) => {
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
          this.subProductList = this.subProductList.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
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
    // Method to validate and handle both DOB and Age fields
    datesValidationCheckAgeAndDob(model: any, type: number): void {
      if (type === 2) { 
        if (model.memDobVal) {
          const calculatedAge = this.calculateAge(model.memDobVal);
          model.age = calculatedAge; 
        }
      } else if (type === 1) { 
        if (model.age && model.age > 0) {
          const calculatedDob = this.calculateDobFromAge(model.age);
          model.memDobVal = calculatedDob; 
        } else if(model.age != null && model.age <= 0){
          this.memberCreationForm.get('age').reset();
          this.msgs = [{ severity: 'error', detail: "Age should not be zero or negative" }];
          setTimeout(() =>{
            this.msgs =[];
          },2000);
         
        }
      }
    }

    onChangeCommunityChange() {
      let community = this.communityList.find((data: any) => null != data && this.membershipBasicRequiredDetailsModel.communityId != null && data.value == this.membershipBasicRequiredDetailsModel.communityId);
      if (community != null && undefined != community)
      this.membershipBasicRequiredDetailsModel.communityName = community.label;
    }

    ageCaluculation(flag: any) {
      if (flag) {//with age to date convertion
        if (this.membershipBasicRequiredDetailsModel.age != null && this.membershipBasicRequiredDetailsModel.age != undefined) {
          if (this.membershipBasicRequiredDetailsModel.age > 0) {
  
            const currentDate = new Date();  // Get the current date
            const birthYear = currentDate.getFullYear() - this.membershipBasicRequiredDetailsModel.age;  // Subtract the entered age from the current year
            const birthMonth = currentDate.getMonth();  // Keep the current month
            const birthDate = currentDate.getDate();   // Keep the current day
  
            // Construct the calculated Date of Birth
            const dob = new Date(birthYear, birthMonth, birthDate);
  
            // Array of month names for formatting (e.g., 'Jan', 'Feb', 'Mar', etc.)
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
            // Format the Date of Birth to 'DD/Mon/YYYY'
            const formattedDob = `${dob.getDate() < 10 ? '0' + dob.getDate() : dob.getDate()}/${monthNames[dob.getMonth()]}/${dob.getFullYear()}`;
  
            // Format the Date of Birth to YYYY-MM-DD to match the input type="date" format
            this.membershipBasicRequiredDetailsModel.dobVal = null;
            this.membershipBasicRequiredDetailsModel.dob = null;
            this.membershipBasicRequiredDetailsModel.dobVal = formattedDob;
          }
          else {
            this.memberCreationForm.get('age')?.reset();
            this.memberCreationForm.get("dateOfBirth")?.reset();
            this.msgs = [{ severity: 'error',  detail: applicationConstants.AGE_SHOULD_NOT_BE_ZERO }];
            setTimeout(() => {
              this.msgs = [];
            }, 3000);
          }
        }
      }
      else {//with date to age convertion
        this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dobVal, this.orgnizationSetting.datePipe);
        if (this.membershipBasicRequiredDetailsModel.dobVal) {
          const dob = new Date(this.membershipBasicRequiredDetailsModel.dobVal);  // Parse the date of birth entered by the user
          const currentDate = new Date();  // Get the current date
          let age = currentDate.getFullYear() - dob.getFullYear();  // Calculate age in years
          const m = currentDate.getMonth() - dob.getMonth();  // Check if birthday has passed in the current year
          if (m < 0 || (m === 0 && currentDate.getDate() < dob.getDate())) {
            age--;  // If birthday hasn't occurred yet this year, subtract 1 from the age
          }
          this.membershipBasicRequiredDetailsModel.age = age;  // Set the calculated age to the class property
        }
      }
  
    }
}
