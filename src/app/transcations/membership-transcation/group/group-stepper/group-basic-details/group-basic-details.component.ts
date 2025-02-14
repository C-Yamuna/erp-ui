import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table/table';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { GroupCommunicationModel, GroupKycDeatilsModel, MemberGroupBasicDetails, promoterDetailsModel } from '../../../shared/member-group-details-model';
import { MemberBasicDetailsStepperService } from '../../../individual/shared/membership-individual-stepper.service';
import { GroupPromotersService } from '../../../shared/group-promoters.service';
import { MembershipGroupDetailsService } from '../../../shared/membership-group-details.service';
import { MembershipBasicDetailsService } from '../../../shared/membership-basic-details.service';
import { DatePipe } from '@angular/common';
import { OperatorTypeService } from 'src/app/configurations/common-config/operator-type/shared/operator-type.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { MemberBasicDetails } from '../../../shared/member-basic-details.model';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-group-basic-details',
  templateUrl: './group-basic-details.component.html',
  styleUrls: ['./group-basic-details.component.css']
})
export class GroupBasicDetailsComponent implements OnInit{
 
  @ViewChild('dt', { static: false }) private dt!: Table;
  groupBasicDetailsForm:FormGroup;
  promoterDetailsForm:any;
  groupBasicDetails:any;
  tempGroupBasicDetails:any []=[];
  groupBasicDetailsList:any []=[];
  date: any;
  addButton: boolean = false;
  id: any;
  groupBasic: any;
  statusList: any[]=[];
  groupCommunicationModel:GroupCommunicationModel = new GroupCommunicationModel()
  groupKycDeatilsModel:GroupKycDeatilsModel = new GroupKycDeatilsModel();
  memberGroupBasicDetails :MemberGroupBasicDetails = new MemberGroupBasicDetails();
  promoterDetailsModel :promoterDetailsModel = new promoterDetailsModel();
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();

  EditDeleteDisable:boolean = false;
  activeIndex: number = 0;
  buttonDisabled: boolean=false;
  promoterDisplayFlag: boolean = false;
  completed = 0;
  branchId: any;
  saveAndContinueFlag: boolean = true;
  isEdit: any;
  responseModel!: Responsemodel;
  savedID: any;
  msgs: any[] = [];
  orgnizationSetting: any;
  communication: any;
  kyc: any;
  land: any;
  nominee: any;
  familydetails: any;
  asset: any;
  basicDetails: any;
  buttonDisbled: boolean =true;
  isSaveContinueEnable: boolean = false;
  nextDisable: boolean = false;
  serviceUrl: any;
  promoterColumns: any[] = [];
  genderList:any[]=[];
  maritalStatusList:any[]=[];
  operatorTypeList:any[]=[];
  promoterDetails:any[]=[];
  memberTypeList:any[]=[];
  newRow: any;
  admissionNumber: any;
  subProductList:any;
  landFlag: boolean = false;
  buttonsFlag: boolean = true;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  uploadSignature: boolean= false;
  rowEdit:number =0
  cancleButtonFlag : Boolean = false;
  admissionNumberDropDown: boolean = false;
  allTypesOfmembershipList: any[]=[];
  admissionNumbersList: any[]=[];
  pacsId:any;
  promterTypeDisabled : any;
  groupId: any;
  today:any;
  requiredlist: any[]=[];
  submitDisableForResolution: boolean= false;
  submitDisableForApplication: boolean= false;
  tempPromoterModel: any;
  submitDisableForImage: boolean= false;
  submitDisableForSignature: boolean= false;
  groupTypesList: any[]=[];
  
  constructor(private commonComponent: CommonComponent,private router:Router, private formBuilder:FormBuilder,
    private memberBasicDetailsStepperService:MemberBasicDetailsStepperService,
    private activateRoute: ActivatedRoute, private encryptService: EncryptDecryptService,
    private membershipGroupDetailsService:MembershipGroupDetailsService,
    private operatorTypeService:OperatorTypeService, private commonFunctionsService: CommonFunctionsService,
    private membershipBasicDetailsService: MembershipBasicDetailsService,
    private groupPromotersService:GroupPromotersService, private datePipe: DatePipe, private fileUploadService :FileUploadService,
  ){
    this.groupBasicDetailsForm = this.formBuilder.group({
      // 'memberTypeId': new FormControl('', Validators.required),
      'subProductId':new FormControl('',Validators.required),
      'name':new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'registrationNumber': new FormControl('',Validators.required),
      'registrationDate': new FormControl('',Validators.required),
      // 'mobileNumber':new FormControl('',Validators.required),
      'gstNumber':new FormControl('',[Validators.pattern(applicationConstants.GST_NUMBER_PATTERN) ]),
      'admissionDate': new FormControl('',Validators.required),
      'pocName': new FormControl('', [Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'pocNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(10)]),
      'panNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN),]),
      'tanNumber': new FormControl('',[Validators.pattern(applicationConstants.TAN_NUMBER)]),
      'resolutionNumber': new FormControl(''),
      'groupTypeId':new FormControl('',Validators.required),
    })
    this.promoterDetailsForm = this.formBuilder.group({
      'surName':new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'name':new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'operatorTypeId': new FormControl('',Validators.required),
      'dob': new FormControl('',Validators.required),
      'age': new FormControl('',Validators.required),
      'genderId': new FormControl(''),
      'martialId': new FormControl(''),
      'mobileNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.MOBILE_PATTERN), Validators.maxLength(10)]),
      'aadharNumber': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.AADHAR_PATTERN), Validators.maxLength(12)]),
      'emailId': new FormControl('', [ Validators.pattern(applicationConstants.EMAIL_PATTERN)]),
      'startDate': new FormControl('',Validators.required),
      'authorizedSignatory':new FormControl('',Validators.required),
      'isExistingMember':new FormControl(''),
      'admissionNumber':new FormControl('',)
    })
  }
  ngOnInit(): void {
    // this.addNewEntry();
    this.requiredlist = this.commonComponent.requiredlist();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.statusList = this.commonComponent.status();
    this.genderList = this.commonComponent.genderList();
    this.maritalStatusList = this.commonComponent.maritalStatusList();
    this.pacsId =  this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
    this.branchId =  this.commonFunctionsService.getStorageValue(applicationConstants.BRANCH_ID);
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

      this.groupTypesList = [
        { label: "Self Help Group", value:1 },
        { label: "Rythu Mitra", value:2 }
      ]
  
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let queryParams = params['id'].split('#');
        let id = this.encryptService.decrypt(params['id']);
        this.groupId = id;
  
        if (id != "" && id != null && id != undefined) {
          this.isEdit = true;
          this.getMembershipGroupDetailsById(this.groupId); // Call the method to fetch details
        }
      } else {
        this.isEdit = false;
        // this.getMemberPreviewsDetails();
        this.generateNewAdmissionNumber();
        this.memberGroupBasicDetails.groupStatus = this.statusList[0].value;
      }
    });
  
    this.groupBasicDetailsForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.groupBasicDetailsForm.valid) {
        this.save();
      }
    });
    this.getAllSubProducts();
  }
 
  updateData() {
    if (this.promoterDetails != null && this.promoterDetails != undefined &&
      this.promoterDetails.length >= 2 && this.buttonsFlag ) {
      this.landFlag = true;
    }
    this.promoterDetailsModel.groupId =this.memberGroupBasicDetails.id
    this.memberBasicDetailsStepperService.changeData({
      formValid: this.promoterDetailsForm.valid ,
      data: this.promoterDetailsModel,
      savedId:this.groupId,
      stepperIndex: 0,
      isDisable: !this.landFlag ? true : false,
    });
  }
 
  getMembershipGroupDetailsById(id: any): void {
    this.membershipGroupDetailsService.getMembershipGroupDetailsById(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.memberGroupBasicDetails = this.responseModel.data[0];
        if (this.memberGroupBasicDetails.admissionDate != null && this.memberGroupBasicDetails.admissionDate != undefined) {
          this.memberGroupBasicDetails.admissionDateVal = this.datePipe.transform(this.memberGroupBasicDetails.admissionDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.registrationDate != null && this.memberGroupBasicDetails.registrationDate != undefined) {
          this.memberGroupBasicDetails.registrationDateVal = this.datePipe.transform(this.memberGroupBasicDetails.registrationDate, this.orgnizationSetting.datePipe);
        }
        if (this.memberGroupBasicDetails.resolutionCopyPath != null && this.memberGroupBasicDetails.resolutionCopyPath != undefined) {
          this.memberGroupBasicDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.memberGroupBasicDetails.resolutionCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.resolutionCopyPath  );
          this.submitDisableForResolution = true;
        }
        if (this.memberGroupBasicDetails.applicationCopyPath != null && this.memberGroupBasicDetails.applicationCopyPath != undefined) {
          this.memberGroupBasicDetails.applicationCopyList = this.fileUploadService.getFile(this.memberGroupBasicDetails.applicationCopyPath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGroupBasicDetails.applicationCopyPath  );
          this.submitDisableForApplication = true;
        }
        // let i = 0;
                this.promoterDetailsModel.groupId = this.memberGroupBasicDetails.id
        if (this.memberGroupBasicDetails.groupPromoterList != null && this.memberGroupBasicDetails.groupPromoterList != undefined &&this.memberGroupBasicDetails.groupPromoterList.length > 0) {
          this.promoterDetails = this.memberGroupBasicDetails.groupPromoterList.map((member: any) => {
            // i = i+1;
            // member.uniqueId = i;
            member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
            member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
            
            if (member.uploadImage != null && member.uploadImage != undefined) {
              member.multipartFileListForPhotoCopy = this.fileUploadService.getFile(member.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadImage );
              this.submitDisableForImage = true;
            }
            if (member.uploadSignature != null && member.uploadSignature != undefined) {
              member.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(member.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadSignature  );
              this.submitDisableForSignature = true;
            }
            // if(member.authorizedSignatory != null && member.authorizedSignatory != undefined)
            //   this.getSignatureUpload(member);
             return member;
          });
          this.buttonsFlag  = true;
          // this.landFlag = true;
        }
        else{
          this.buttonsFlag  = false;
          this.landFlag = false;
        }
      }
      this.updateData();
    });
  }

  getAllPromotersByGroupIdAndPacsId() {
    this.commonComponent.startSpinner();
    this.groupPromotersService.getGroupPromoterDetailsByGroupId(this.groupId,this.pacsId,this.branchId).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.promoterDetails = this.responseModel.data;
        this.promoterDetails.map((member: any) => {
          // i = i+1;
          // member.uniqueId = i;
          member.memDobVal = this.datePipe.transform(member.dob, this.orgnizationSetting.datePipe);
          member.startDateVal = this.datePipe.transform(member.startDate, this.orgnizationSetting.datePipe);
          
          if (member.uploadImage != null && member.uploadImage != undefined) {
            member.multipartFileListForPhotoCopy = this.fileUploadService.getFile(member.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadImage );
            this.submitDisableForImage = true;
          }
          if (member.uploadSignature != null && member.uploadSignature != undefined) {
            member.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(member.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + member.uploadSignature  );
            this.submitDisableForSignature = true;
          }
        });
        this.buttonsFlag  = true;
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
  getAllSubProducts() {
    this.commonComponent.startSpinner();
    this.membershipBasicDetailsService.getAllSubProduct().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data == null || (this.responseModel.data != null && this.responseModel.data.length == 0)) {

          this.msgs = [];
          this.msgs = [{ severity: 'error', detail: applicationConstants.RELATIONSHIP_TYPE_NO_DATA_MESSAGE }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
        this.subProductList = this.responseModel.data.filter((customertype:any) => customertype.status == applicationConstants.ACTIVE).map((count:any) => {
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
 
  save() {
    this.updateData();
  }
  // Centralize the logic for enabling/disabling form fields
private toggleFormFields(isExistingMember: boolean): void {
  const fields = [
    'surName', 'name', 'operatorTypeId', 'dob', 'age', 'genderId', 
    'martialId', 'mobileNumber', 'aadharNumber', 'emailId', 'startDate'
  ];

  fields.forEach(field => {
    if (isExistingMember) {
      this.promoterDetailsForm.get(field).disable();
    } else {
      this.promoterDetailsForm.get(field).enable();
    }
  });
}

editPromoter(rowData: any) {
  this.commonComponent.startSpinner();
  this.cancleButtonFlag = true;
  this.addButton = true;
  this.EditDeleteDisable = true;
  this.buttonsFlag = false;
  this.landFlag = false;
  if (rowData.id != null) {
    this.promoterDisplayFlag = true;
    this.groupPromotersService.getGroupPromotersById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      this.promoterDetailsModel = this.responseModel.data[0];
      this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
      this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);
      if (this.promoterDetailsModel.uploadImage != null && this.promoterDetailsModel.uploadImage != undefined) {
        this.promoterDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.promoterDetailsModel.uploadImage ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadImage );
        this.submitDisableForImage = true;
      }
      if (this.promoterDetailsModel.uploadSignature != null && this.promoterDetailsModel.uploadSignature != undefined) {
        this.promoterDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.promoterDetailsModel.uploadSignature ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.promoterDetailsModel.uploadSignature  );
        this.submitDisableForSignature = true;
      }
      if (this.promoterDetailsModel.isExistingMember) {
        this.admissionNumberDropDown = true;
        this.getAllTypeOfMembershipDetails(this.pacsId, this.branchId);
        this.disableFormFields();
      } else {
        this.admissionNumberDropDown = false;
        this.enableFormFields();
      }
    
      this.getAllOperatorType();
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
disableFormFields() {
  const fieldsToDisable = [
    'surName', 'name', 'dob', 'age', 'genderId', 'martialId', 
    'mobileNumber', 'aadharNumber', 'emailId', 'startDate'
  ];
  fieldsToDisable.forEach(field => this.promoterDetailsForm.get(field)?.disable());
}

enableFormFields() {
  const fieldsToEnable = [
    'surName', 'name', 'dob', 'age', 'genderId', 
    'martialId', 'mobileNumber', 'aadharNumber', 'emailId', 'startDate'
  ];
  fieldsToEnable.forEach(field => this.promoterDetailsForm.get(field)?.enable());
}

onRowEditSave() {
  this.addButton = true;
  this.buttonsFlag  = false;
  this.landFlag = false;
  this.promoterDisplayFlag = true;
  this.EditDeleteDisable = true;
  this.cancleButtonFlag = false;
  this.submitDisableForImage= false;
  this.submitDisableForSignature= false;
  this.promoterDetailsModel.multipartFileListForPhotoCopy =[];
  this.promoterDetailsModel.multipartFileListForsignatureCopyPath =[];
  this.promoterDetailsModel = new promoterDetailsModel();
  this.promoterDetailsForm.reset();
  // this.onChangeExistedPrmoter(false);
  this.admissionNumberDropDown = false;

  // Re-fetch operator types for a new promoter
  this.getAllOperatorType();
  this.updateData();
}

  getAllOperatorType() {
    this.commonComponent.startSpinner();
    this.operatorTypeService.getAllOperationTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != undefined && this.responseModel.data != null && this.responseModel.data.length > 0) {

          this.operatorTypeList = this.responseModel.data.filter((customertype: any) => customertype.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.name, value: count.id }
          });
          this.commonComponent.stopSpinner();
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
  saveOrUpdatePromoterDetailsDetails(rowData: any) {
    this.promoterDisplayFlag = false;
    rowData.pacsId = this.pacsId;
    rowData.branchId =this.branchId;
    rowData.groupId = this.groupId;
    rowData.status = applicationConstants.ACTIVE;
    this.addButton = false;
    this.EditDeleteDisable = false;

    if (rowData.memDobVal != undefined && rowData.memDobVal != null)
      rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal));

    if (rowData.startDateVal != undefined && rowData.memDobVal != null)
      rowData.startDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.startDateVal));


    this.operatorTypeList.filter(data => data != null && data.value == rowData.operatorTypeId).map(count => {
      rowData.operatorTypeName = count.label;
    })
    this.genderList.filter(data => data != null && data.value == rowData.genderId).map(count => {
      rowData.genderTypeName = count.label;
    })
  
    this.maritalStatusList.filter(data => data != null && data.value == rowData.martialId).map(count => {
      rowData.maritalStatusName = count.label;
    })
    if (rowData.id != null) {
      this.groupPromotersService.updateGroupPromoters(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (null != rowData.dob)
            rowData.memDobVal = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);

          if (null != rowData.startDate)
            rowData.startDateVal = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);

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
        this.getAllPromotersByGroupIdAndPacsId();
      },
        error => {
          this.commonComponent.stopSpinner();
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      this.groupPromotersService.addGroupPromoters(rowData).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          rowData= this.responseModel.data[0]
          if (null != this.responseModel.data[0].dob)
            this.responseModel.data[0].memDobVal = this.datePipe.transform(this.responseModel.data[0].dob, this.orgnizationSetting.datePipe);
          // this.buttonsFlag  = true;
          // this.landFlag =true;
          // this.updateData();

          if (null != rowData.dob)
            rowData.memDobVal = this.datePipe.transform(rowData.dob, this.orgnizationSetting.datePipe);

          if (null != rowData.startDate)
            rowData.startDateVal = this.datePipe.transform(rowData.startDate, this.orgnizationSetting.datePipe);
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
        this.getAllPromotersByGroupIdAndPacsId();
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
  
  generateNewAdmissionNumber(): void {
    this.admissionNumber = this.generateAdmissionNumber();
    this.memberGroupBasicDetails.admissionNumber =this.admissionNumber
  }
  
  generateAdmissionNumber(): string {
    // Generate a random 12-digit number
    const admissionNumber = Math.floor(100000000000 + Math.random() * 900000000000);
    return admissionNumber.toString();
  }

  fileUploader(event: any, fileUpload: FileUpload, filePathName: any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.isEdit && this.memberGroupBasicDetails.filesDTOList == null || this.memberGroupBasicDetails.filesDTOList == undefined){
      this.memberGroupBasicDetails.filesDTOList = [];
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
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
        if (filePathName === "resolutionCopyPath") {
          this.submitDisableForResolution = true;
          this.memberGroupBasicDetails.multipartFileListForsignatureCopyPath = [];
          this.memberGroupBasicDetails.filesDTOList.push(files);
          this.memberGroupBasicDetails.resolutionCopyPath = null;
          this.memberGroupBasicDetails.filesDTOList[this.memberGroupBasicDetails.filesDTOList.length - 1].fileName = "Group_Resolution_Copy" + "_" + timeStamp + "_" + file.name;
          this.memberGroupBasicDetails.resolutionCopyPath = "Group_Resolution_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        if (filePathName === "applicationCopyPath") {
          this.submitDisableForApplication = true;
          this.memberGroupBasicDetails.applicationCopyList = [];
          this.memberGroupBasicDetails.filesDTOList.push(files);
          this.memberGroupBasicDetails.applicationCopyPath = null;
          this.memberGroupBasicDetails.filesDTOList[this.memberGroupBasicDetails.filesDTOList.length - 1].fileName = "Group_Application_Copy" + "_" + timeStamp + "_" + file.name;
          this.memberGroupBasicDetails.applicationCopyPath = "Group_Application_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }

  fileUploadersForPromoter(event: any, fileUpload: FileUpload, filePathName: any,rowData:any) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    if(this.isEdit && rowData.filesDTOList == null || rowData.filesDTOList == undefined){
      rowData.filesDTOList = [];
    }
    let files: FileUploadModel = new FileUploadModel();
    for (let file of event.files) {
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
          this.submitDisableForImage = true;
          rowData.multipartFileListForPhotoCopy = [];
          rowData.uploadImage = null;
          rowData.filesDTOList.push(files);
          rowData.filesDTOList[rowData.filesDTOList.length - 1].fileName = "Group_Promoter_Photo_Copy" + "_" + timeStamp + "_" + file.name;
          rowData.uploadImage = "Group_Promoter_Photo_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        if (filePathName === "signaturePath") {
          this.submitDisableForSignature = true;
          rowData.multipartFileListForsignatureCopyPath = [];
          rowData.uploadSignature = null;
          rowData.filesDTOList.push(files);
          rowData.filesDTOList[rowData.filesDTOList.length - 1].fileName = "Group_Promoter_Signature_Copy" + "_" + timeStamp + "_" + file.name;
          rowData.uploadSignature = "Group_Promoter_Signature_Copy" + "_" + timeStamp + "_" + file.name; 
        }
        
        this.updateData();
      }
      reader.readAsDataURL(file);
    }
  }
  fileRemoveEvent(fileName: any, rowData: any) {
    if (fileName == "resolutionCopyPath") {
      this.submitDisableForResolution = false;
      let removeFileIndex = rowData.filesDTOList.findIndex((obj: any) => obj && obj.fileName === rowData.resolutionCopyPath);
      rowData.filesDTOList.splice(removeFileIndex, 1);
      rowData.resolutionCopyPath = null;
    }
    else if (fileName == "applicationCopyPath") {
      this.submitDisableForApplication = false;
      let removeFileIndex = rowData.filesDTOList.findIndex((obj: any) => obj && obj.fileName === rowData.applicationCopyPath);
      rowData.filesDTOList.splice(removeFileIndex, 1);
      rowData.applicationCopyPath = null;
    }
  }
fileRemoveEventForPromoter(fileName: any,rowData:any) {
    if (fileName == "photoCopyPath") {
      this.submitDisableForImage = false;
    let removeFileIndex = rowData.filesDTOList.findIndex((obj: any) => obj && obj.fileName === rowData.uploadImage);
    rowData.filesDTOList.splice(removeFileIndex, 1);
    rowData.uploadImage = null;
  }
  else if (fileName == "signaturePath") {
    this.submitDisableForSignature = false;
    let removeFileIndex = rowData.filesDTOList.findIndex((obj: any) => obj && obj.fileName === rowData.uploadSignature);
    rowData.filesDTOList.splice(removeFileIndex, 1);
    rowData.uploadSignature = null;
}
}
getSignatureUpload(rowdata:any){
  let data = rowdata.authorizedSignatory ;
    if(data == applicationConstants.TRUE){
      this.uploadSignature = false;
    }
    else if(data == applicationConstants.FALSE){
      this.uploadSignature = true;
    }
    else{
        this.uploadSignature = true;
    }
}

admissionDateOnSelect(){
  if(this.memberGroupBasicDetails.admissionDateVal != undefined && this.memberGroupBasicDetails.registrationDateVal != undefined){
    if(this.memberGroupBasicDetails.admissionDateVal < this.memberGroupBasicDetails.registrationDateVal){
      this.groupBasicDetailsForm.get('registrationDate')?.reset();
      this.groupBasicDetailsForm.get('admissionDate')?.reset();
      this.groupBasicDetailsForm.updateValueAndValidity();
      this.msgs = [{ severity: 'warning', detail: applicationConstants.REGISTRATION_DATE_SHOULD_LESSTHAN_ADMISSION_DATE }];
      setTimeout(() => {
        this.msgs = [];        
      }, 2000);
    }
  }
}
  /**
   * @implements cancle prmoters
   * @author K.YAMUNA
   */
  cancelPromoter(falg:Boolean) {
    this.addButton = false;
    this.EditDeleteDisable = false;
    this.buttonsFlag  = true;
    this.promoterDisplayFlag = false;
    this.EditDeleteDisable = false;
    this.promoterDetails;
    this.updateData();
  }

   /**
   * @implements onchange existed prmoter
   * @author k.yamuna
   */
   onChangeExistedPrmoter(isExistingMember :any){
    if(isExistingMember){
        this.admissionNumberDropDown = true;
        this.getAllTypeOfMembershipDetails(this.pacsId,this.branchId);
        this.resetFields();
    }
    else {
      this.resetFields();
        this.admissionNumberDropDown = false;
         this.promoterDetailsForm.get('admissionNumber').reset();

         this.enableFormFields();
        // this.promoterDetailsForm.get('admissionNumber').setValidators(null);
    }
  }
    /**
   * @implements reset feilds 
   * @author k.yamuna
   */
    resetFields(){
      this.promoterDetailsForm.get('surName').reset();
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
      this.promoterDetailsForm.get('authorizedSignatory').reset();

    }

    /**
       * @author k.yamuna
       * @implement get member admission Numbers list
       * @argument pacsId,branchId
       */
    getAllTypeOfMembershipDetails(pacsId: any, branchId: any) {
       this.admissionNumbersList = [];
      this.membershipBasicDetailsService.getAllGridList(pacsId,branchId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.allTypesOfmembershipList = this.responseModel.data;
              this.admissionNumbersList = this.allTypesOfmembershipList.filter((obj: any) => (obj != null) && obj.memberTypeName == MemberShipTypesData.INDIVIDUAL && obj.statusName == CommonStatusData.APPROVED)
              .map((relationType: any) => {
                return relationType.admissionNumber
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
     * @author k.yamuna
     * @implement get member details for promoter by admission Number
     * @argument admissionNumber
     */
  getMemberDetailsByAdmissionNUmber(admissionNumber: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.memberBasicDetailsModel = this.responseModel.data[0];
          if( this.memberBasicDetailsModel != null &&  this.memberBasicDetailsModel != undefined){
            this.promoterDetailsModel.name = this.memberBasicDetailsModel.name,
            this.promoterDetailsModel.surname = this.memberBasicDetailsModel.surname;
            this.promoterDetailsModel.aadharNumber = this.memberBasicDetailsModel.aadharNumber;
            this.promoterDetailsModel.dob = this.memberBasicDetailsModel.dob;
            if (this.promoterDetailsModel.dob != null && this.promoterDetailsModel.dob != undefined)
              this.promoterDetailsModel.memDobVal = this.datePipe.transform(this.promoterDetailsModel.dob, this.orgnizationSetting.datePipe);
            this.promoterDetailsModel.age = this.memberBasicDetailsModel.age;
            this.promoterDetailsModel.genderId = this.memberBasicDetailsModel.genderId;
            this.promoterDetailsModel.martialId = this.memberBasicDetailsModel.martialId;
            this.promoterDetailsModel.mobileNumber = this.memberBasicDetailsModel.mobileNumber;
            this.promoterDetailsModel.emailId = this.memberBasicDetailsModel.emailId;
            this.promoterDetailsModel.startDate = this.memberBasicDetailsModel.admissionDate;
            if (this.promoterDetailsModel.startDate != null && this.promoterDetailsModel.startDate != undefined)
              this.promoterDetailsModel.startDateVal = this.datePipe.transform(this.promoterDetailsModel.startDate, this.orgnizationSetting.datePipe);

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
    } else {
      this.promoterDetailsForm.get('age')?.reset();
      this.msgs = [{ severity: 'warning', detail: "Age should not be zero or negative" }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  }
}

// Method to calculate age from date of birth
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
 addOrUpdate(rowData:any) {
    //saveorupdate code here
    rowData.branchId = this.branchId;
    rowData.pacsId = this.pacsId;
    rowData.groupStatus = 2;
    rowData.memberTypeId = 2; 
    rowData.memberTypeName = MemberShipTypesData.GROUP;
    rowData.name = rowData.name.trim();
    if(rowData.registrationDateVal != undefined && rowData.registrationDateVal != null)
      rowData.registrationDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.registrationDateVal));

    if(rowData.admissionDateVal != undefined &&rowData.admissionDateVal != null)
    rowData.admissionDate = this.commonFunctionsService.getUTCEpoch(new Date(rowData.admissionDateVal));

    if (rowData.id != null) {
   
    this.membershipGroupDetailsService.updateMembershipGroupDetails(rowData).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {

        rowData = response.data[0];
        this.groupId = rowData.id;
        if(null != rowData.admissionDate)
          rowData.admissionDateVal=this.datePipe.transform(rowData.admissionDate, this.orgnizationSetting.datePipe);
        if(null != rowData.registrationDate)
          rowData.registrationDateVal=this.datePipe.transform(rowData.registrationDate, this.orgnizationSetting.datePipe);

        if(rowData.memDobVal != undefined && rowData.memDobVal != null)
          rowData.dob = this.commonFunctionsService.getUTCEpoch(new Date(rowData.memDobVal));
        this.commonComponent.stopSpinner();
        this.msgs = [];
        // this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
        this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];

        setTimeout(() => {
          this.msgs = [];
        }, 2000);
       
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  } else {
    this.membershipGroupDetailsService.addMembershipGroupDetails(rowData).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.groupId = this.responseModel.data[0].id;
        this.isEdit = true;
        this.msgs = [];
        this.msgs = [{ severity: 'success', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
       
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    },
      error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }
}
 
}
