import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdCumulativeApplicationService } from '../fd-cumulative-application/shared/fd-cumulative-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FdCumulativeApplication } from '../fd-cumulative-application/shared/fd-cumulative-application.model';
import { NewMembershipAddService } from '../new-membership-add/shared/new-membership-add.service';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { FdCumulativeKyc } from '../fd-cumulative-kyc/shared/fd-cumulative-kyc.model';
import { FileUpload } from 'primeng/fileupload';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FdCumulativeCommunication } from '../fd-cumulative-communication/shared/fd-cumulative-communication.model';
import { FdCumulativeKycService } from '../fd-cumulative-kyc/shared/fd-cumulative-kyc.service';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { Table } from 'primeng/table';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-membership-details',
  templateUrl: './membership-details.component.html',
  styleUrls: ['./membership-details.component.css']
})
export class MembershipDetailComponent {

  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  fdCumulativeApplicationModel: FdCumulativeApplication = new FdCumulativeApplication();
  fdCumulativeKycModel: FdCumulativeKyc = new FdCumulativeKyc();
  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  fdCumulativeCommunication:FdCumulativeCommunication = new FdCumulativeCommunication();

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
  isDisableFlag: boolean = false;
  disableMemberType: boolean = false;
  promoterDetailsForm: any;
  institutionPromoter: any[] = [];
  addButton: boolean = false;
  EditDeleteDisable: boolean = false;
  newRow: any;
  promoterDetails: any[] = [];
  memberTypeId : any;
  msgs: any[] = [];
  operatorTypeList: any[] = [];
  admisionNumber: any;
  kycForm: any;
  sameAsPermanentAddress: boolean = false;
  statesList: any[] = [];
  districtsList: any[] = [];
  mandalsList: any[] = [];
  villageList: any[] = [];
  allTypesOfmembershipList: any;
  pacsId: any;
  branchId: any;
  admissionNUmber: any;
  permenentAllTypesOfmembershipList: any;
  fdCummulativeAccId: any;
  documentsData: any[] = [];
  uploadFlag: boolean = true;
  kyc: any;
  accountType: any;
  applicationType: any;
  minBalence: any;
  accountOpeningDateVal: any;
  documentTypeList: any[] = [];
  kycModelList: any[] = [];
  adhaarFilesList: any[] = [];
  signFilesList: any[] = [];
  panFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  columns: any[] = [];
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  buttonDisabled: boolean = false;
  filesList: any[] = [];
  exerciseFileList: any[] = [];
  lastDot = applicationConstants.LAST_DOT;
  memberId: any;
  kycListByMemberId: any[] = [];
  typeFlag: boolean = false;
  addKycButton: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  @ViewChild('cv', { static: false })
  private cv!: Table;
  editIndex: any;
  afterEditCancleFalg: boolean = false;
  editButtonDisable: boolean = false;
  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  admissionNumber: any;
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  editFlag: any;
  kycDuplicate: boolean = false;
  tempKycList: any[] =[];
  promotersList: any[] =[];
  kycPhotoCopyZoom: boolean = false;



  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private fdCumulativeApplicationService: FdCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private membershipServiceService: NewMembershipAddService,private fileUploadService : FileUploadService,
    private fdCumulativeKycService:FdCumulativeKycService,
    ) {
      this.kycForm = this.formBuilder.group({
        'docNumber': [{ value: '', disabled: true }],
        'docTypeName':[{ value: '', disabled: true }],
        'promoter':['', ],
        'fileUpload': new FormControl({ value: '', disabled: true }),
        'nameAsPerDocument':['',[Validators.pattern(applicationConstants.ALPHA_NAME_PATTERN),Validators.compose([Validators.required])]],
      });
  }

ngOnInit(): void {
    this.kycModelList = [];
    this.pacsId = 1;
    this.branchId = 1;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined || params['admissionNo']) {
        this.commonComponent.startSpinner();

        if (params['admissionNo'] != undefined) {
          this.admissionNumber = this.encryptDecryptService.decrypt(params['admissionNo']);
        }

        if (this.admissionNumber != null && this.admissionNumber != undefined) {
          this.getMembershipBasicDetailsByAdmissionNumber(this.admissionNumber);
          this.getMemberGroupByAdmissionNumber(this.admissionNumber);
          this.getMemberIstitutionByAdmissionNumber(this.admissionNumber);
        }
        else {
          if (params['id'] != undefined) {
            this.fdCummulativeAccId = Number(this.encryptDecryptService.decrypt(params['id']));
            this.getFdCummApplicationById(this.fdCummulativeAccId);
          }
        }
        this.disableMemberType = true;
        this.isEdit = true;
      }
      else {
        let val = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
        this.updateData();

      }
    });
    // this.kycForm.valueChanges.subscribe((data: any) => {
    //   this.updateData();
    //   if (this.kycForm.valid) {
    //     this.save();
    //   }
    // });
    this.getAllKycTypes();
  }

  /**
   * @implements getfdcumulativeAccountApplicationdetails By AccountId
   * @param id 
   * @author bhargavi
   */
  getFdCummApplicationById(id: any) {
    this.fdCumulativeApplicationService.getFdCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.memberTypeCheckForPromotersKyc(this.responseModel.data[0].memberTypeName);
              this.fdCumulativeApplicationModel = this.responseModel.data[0];
              if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != null && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined) {
                this.getMultiPartFileList();

              }
              if (this.fdCumulativeApplicationModel.fdCummulativeAccountKycList != null && this.fdCumulativeApplicationModel.fdCummulativeAccountKycList != undefined && this.fdCumulativeApplicationModel.fdCummulativeAccountKycList.length > 0) {
                this.kycModelList = this.fdCumulativeApplicationModel.fdCummulativeAccountKycList;
                for (let kyc of this.kycModelList) {
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                }
                this.tempKycList = this.kycModelList;
              }
              this.editDocumentOfKycFalg = true;
              this.membershipDataFromTdModule(this.fdCumulativeApplicationModel);//for promoter kyc
              this.updateData();
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
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  memberTypeCheckForPromotersKyc(memberTypeName: any) {
    if (memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
    }
    else {
      this.individualFlag = false;
      //  const controlName = this.promoterDetailsForm.get('promoter');
      //  if (controlName) {
      //   controlName.setValidators([
      //     Validators.required,
      //   ]);
      //   controlName.updateValueAndValidity();
      // }

    }
  }
  /**
  * @implements get multipart file list 
  * @author bhargavi
  */
  getMultiPartFileList() {
    if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath != null && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath != undefined) {
      this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForPhotoCopy = [];
      this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath);

    }
    if (this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath != null && this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath != undefined) {
      this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForsignatureCopyPath = [];
      this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath);
    }
  }

  /**
   * @implements updateData To parent component'
   * @author bhargavi
   */
  updateData() {
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      // this.kycDuplicate = this.kycModelDuplicateCheck(this.kycModelList);
      if (this.kycDuplicate || this.buttonDisabled) {
        this.isDisableFlag = true;
      }
      else {
        this.isDisableFlag = false;
      }
    } else {
      this.isDisableFlag = true;
    }

    this.fdCumulativeApplicationService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.fdCumulativeApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }
  save() {
    this.updateData();
  }


  /**
   * @author bhargavi
   * @param admissionNumber 
   * @implements get institution Details From memember module by admission Number
   */
  getMemberIstitutionByAdmissionNumber(admissionNumber: any) {
    this.kycModelList = [];
    this.membershipServiceService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.membershipInstitutionDetailsModel.photoPath = this.responseModel.data[0].photoCopyPath; 
          this.membershipInstitutionDetailsModel.signaturePath = this.responseModel.data[0].signatureCopyPath; 
          this.fdCumulativeApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.fdCumulativeApplicationModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          if (this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != null && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != undefined && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
            // this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              kyc.promoterName = kyc.promoterName;
            }
            this.fdCumulativeApplicationModel.fdCummulativeAccountKycList = this.kycModelList;
          }
          if (this.membershipInstitutionDetailsModel.memberTypeId == null || this.membershipInstitutionDetailsModel.memberTypeId == undefined) {
            this.membershipInstitutionDetailsModel.memberTypeId = applicationConstants.INSTITUTION_MEMBER_TYPE_ID;
            this.memberTypeCheckForPromotersKyc(this.memberTypeName);
          }
          if (this.membershipInstitutionDetailsModel.memberTypeId != null && this.membershipInstitutionDetailsModel.memberTypeId != undefined) {
            this.memberTypeCheckForPromotersKyc(this.memberTypeName);
          }
          this.tempKycList = this.kycModelList;
          this.admissionNumber = this.membershipInstitutionDetailsModel.admissionNumber;
          this.fdCumulativeApplicationModel.memberType = this.membershipInstitutionDetailsModel.memberTypeId;
          this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
          this.fdCumulativeApplicationModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          this.membershipDataFromTdModule(this.fdCumulativeApplicationModel.memInstitutionDTO);//for promoter kyc
          this.updateData();
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
   * @author bhargavi
   * @param admissionNUmber 
   * @implements get group details from member module
   */
  getMemberGroupByAdmissionNumber(admissionNUmber: any) {
    this.kycModelList = [];
    this.membershipServiceService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
          this.memberGroupDetailsModel.photoPath = this.responseModel.data[0].photoCopyPath; 
          this.memberGroupDetailsModel.signaturePath = this.responseModel.data[0].signatureCopyPath; 
          this.memberTypeName = this.responseModel.data[0].memberTypeName;
          if (this.memberGroupDetailsModel.registrationDate != null && this.memberGroupDetailsModel.registrationDate != undefined) {
            this.memberGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.admissionDate != null && this.memberGroupDetailsModel.admissionDate != undefined) {
            this.memberGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.memberGroupDetailsModel.memberTypeId == null || this.memberGroupDetailsModel.memberTypeId == undefined) {
            this.memberGroupDetailsModel.memberTypeId = applicationConstants.GROUP_MEMBER_TYPE_ID;

          }
          this.memberTypeCheckForPromotersKyc(this.memberTypeName);
          if (this.memberGroupDetailsModel.groupKycList != null && this.memberGroupDetailsModel.groupKycList != undefined) {
            this.kycModelList = this.memberGroupDetailsModel.groupKycList;
            // this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            }
            this.fdCumulativeApplicationModel.fdCummulativeAccountKycList = this.kycModelList;
          }
          this.tempKycList = this.kycModelList;
          this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.memberGroupDetailsModel.isNewMember = this.showForm;
          this.fdCumulativeApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
          this.fdCumulativeApplicationModel.memberType = this.memberGroupDetailsModel.memberTypeId;
          this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
          this.membershipDataFromTdModule(this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO);//for promoter kyc
          this.updateData();
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
     * @implements membership data from sb module
     * @author bhargavi
     */
  membershipDataFromTdModule(obj: any) {
    if (obj.memberTypeName == "Individual") {
      this.individualFlag = true;
    } else if (obj.memberTypeName == "Group") {
      this.groupFlag = true;
      if (this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList != null && this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList != undefined && this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList.length > 0) {
        this.promotersList = this.fdCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name + " " + promoter.surname + " " + promoter.aadharNumber, value: promoter.id }
        });
      }

    } else if (obj.memberTypeName == "Institution") {
      this.institutionFlag = true;
      if (this.fdCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList != null && this.fdCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList != undefined && this.fdCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList.length > 0) {
        this.promotersList = this.fdCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name + " " + promoter.surname + " " + promoter.aadharNumber, value: promoter.id }
        });
      }

    }

  }



  /**
   * @implements member module data by member admission Number
   * @param admissionNumber 
   * @author bhargavi
   */
  getMembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    this.kycModelList = [];
    this.membershipServiceService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.membershipBasicRequiredDetails = this.responseModel.data[0];
          this.membershipBasicRequiredDetails.fdCummCommunicationDto = this.responseModel.data[0].memberShipCommunicationDetailsDTOList;
          this.membershipBasicRequiredDetails.photoPath = this.responseModel.data[0].photoCopyPath; 
          this.membershipBasicRequiredDetails.signaturePath = this.responseModel.data[0].signatureCopyPath; 
          if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
            this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetails.admissionNumber != null && this.membershipBasicRequiredDetails.admissionNumber != undefined) {
            this.admissionNumber = this.membershipBasicRequiredDetails.admissionNumber;
          }
          if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
            this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetails.fdCummCommunicationDto != null && this.membershipBasicRequiredDetails.fdCummCommunicationDto != undefined) {
            this.fdCumulativeCommunication = this.membershipBasicRequiredDetails.fdCummCommunicationDto;
            this.fdCumulativeApplicationModel.fdCummulativeAccountCommunicationDTO = this.membershipBasicRequiredDetails.fdCummCommunicationDto;
          }
          if (this.membershipBasicRequiredDetails.memberTypeId == null || this.membershipBasicRequiredDetails.memberTypeId == undefined) {
            this.membershipBasicRequiredDetails.memberTypeId = applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID;
          }
          this.memberTypeName = this.membershipBasicRequiredDetails.memberTypeName;
          this.memberTypeCheckForPromotersKyc(this.membershipBasicRequiredDetails.memberTypeName);
          if (this.membershipBasicRequiredDetails.photoPath != null && this.membershipBasicRequiredDetails.photoPath != undefined) {
            this.membershipBasicRequiredDetails.filesDTOList = [];
            this.membershipBasicRequiredDetails.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.photoPath);
          }
          if (this.membershipBasicRequiredDetails.signaturePath != null && this.membershipBasicRequiredDetails.signaturePath != undefined) {
            this.membershipBasicRequiredDetails.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.signaturePath);
          }
          if (this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != null && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != undefined && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList;
            // this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            }
          }
          this.tempKycList = this.kycModelList;
          this.fdCumulativeApplicationModel.fdCummulativeAccountKycList = this.kycModelList;
          this.fdCumulativeApplicationModel.memberTypeName = this.membershipBasicRequiredDetails.memberTypeName;
          this.membershipBasicRequiredDetails.isNewMember = this.showForm;
          this.fdCumulativeApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
          this.updateData();
          // this.savingCommuncationDetailsSet(this.membershipBasicRequiredDetails.memberShipCommunicationDetailsDTOList[0]);
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
   * @implements add kyc 
   * @param event 
   * @author bhargavi
   */
  addKyc(event: any) {
    this.memberTypeCheckForPromotersKyc(this.memberTypeName);
    this.getAllKycTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.fdCumulativeKycModel = new FdCumulativeKyc;
    this.updateData();
  }


  /**
   * @implements get all kyc types  
   * @author bhargavi
   */
  getAllKycTypes() {
    this.fdCumulativeKycService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.fdCumulativeKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj)
          this.fdCumulativeKycModel.kycDocumentTypeName = filteredObj.label;
      }
    });
  }


  /**
   * @implements image uploader
   * @param event 
   * @param fileUpload 
   * @author bhargavi
   */
  imageUploader(event: any, fileUpload: FileUpload) {
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.fdCumulativeKycModel.filesDTOList = [];
    this.fdCumulativeKycModel.multipartFileList =[];
    this.fdCumulativeKycModel.kycFilePath = null;
    let files: FileUploadModel = new FileUploadModel();
    let selectedFiles = [...event.files];
    fileUpload.clear();
    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;

        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.fdCumulativeKycModel.filesDTOList.push(files); // Add to filesDTOList array
          this.fdCumulativeKycModel.multipartFileList.push(files);
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.fdCumulativeKycModel.filesDTOList[0].fileName = "FD_NON_CUM_KYC_" + this.fdCummulativeAccId + "_" +timeStamp+ "_"+ file.name ;
        this.fdCumulativeKycModel.kycFilePath = "FD_NON_CUM_KYC_" + this.fdCummulativeAccId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        this.fdCumulativeKycModel.multipartFileList = this.fdCumulativeKycModel.filesDTOList;
        let index1 = event.files.findIndex((x: any) => x === file);
        // this.addOrEditKycTempList(this.fdCumulativeKycModel);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements delete kyc
   * @param rowData 
   * @author bhargavi
   */
  delete(rowData: any) {
    this.fdCumulativeKycService.deleteKyc(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
        this.getAllKycsDetailsRdKycDetails(this.admissionNumber);
      }
    });
  }

  /**
   * @implements get all kyc from db details
   * @param admissionNumber 
   * @author bhargavi
   */
  getAllKycsDetailsRdKycDetails(admissionNumber: any) {
    this.kycModelList = [];
    this.fdCumulativeKycService.getMemberKycByAddmissionNumber(admissionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.kycModelList = this.responseModel.data;
            if (this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                let multipleFilesList = [];
                let file = new FileUploadModel();
                file.imageValue = ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath;
                let objects = kyc.kycFilePath.split('.');
                file.fileType = objects[objects.length - 1];
                let name = kyc.kycFilePath.replace(/ /g, "_");
                file.fileName = name
                multipleFilesList.push(file);
                kyc.multipartFileList = multipleFilesList;
              }
            }
          }
        }
      }
      // this.getFdCummApplicationById(fdCummulativeAccId);
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @implements cancle Kyc for edit
   * @author jyothi.nadaina
   */
  cancelKyc() {
    this.kycModelList = [];
    this.addKycButton = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.admissionNumber);
  }

  /**
  * @implements cancle Kyc for add
  * @author jyothi.nadaina
  */
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    // this.getAllKycsDetailsSbKycDetails(this.admissionNumber);
    this.updateData();
  }
  /**
  * @implements onClick
  * @author jyothi.nadaina
  */
  onClick() {
    this.addDocumentOfKycFalg = true;
  }


  /**
   * @implements click on edit and populate data on form and save & next disable purpose
   * @author jyothi.nadaina
   * @param index
   * @param modelData
   */
  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.getAllKycTypes();
    this.addOrEditKycTempList(modelData);
    // this.getKycById(modelData.id);
    this.updateData();
  }

  /**
  * @implements edit cancle
  * @author bhargavi
  */
  editCancle() {
    this.fdCumulativeKycModel = new FdCumulativeKyc();
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.updateData();
  }

  /**
   * @author bhargavi
   * @param row 
   * @implements save kyc details (append to kyc list)
   */
  editsave(row: any) {
    this.memberTypeCheckForPromotersKyc(this.memberTypeName);
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    let docType = this.documentNameList.filter((obj: any) => row.kycDocumentTypeId == obj.value);
    if (docType != null && docType != undefined && docType.length > 0) {
      row.kycDocumentTypeName = docType[0].label;
    }
    const existingIndex = null;
    if (!this.individualFlag) {
      let promoter = this.promotersList.filter((obj: any) => row.promoterId == obj.value);
      if (promoter != null && promoter != undefined && promoter.length > 0) {
        row.promoterName = promoter[0].label;
      }
      const existingIndex = this.kycModelList.findIndex(
        promoter => promoter.kycDocumentTypeId === row.kycDocumentTypeId && promoter.promoterId == row.promoterId);//finding the kyc obj in list for replace the updated data
      this.kycModelList[existingIndex] = null;
      this.kycModelList[existingIndex] = row;
      this.tempKycList[existingIndex] = row;
    }
    else {
      const existingIndex = this.kycModelList.findIndex(
        promoter => promoter.kycDocumentTypeId === row.kycDocumentTypeId);//finding the kyc obj in list for replace the updated data
      this.kycModelList[existingIndex] = null;
      this.kycModelList[existingIndex] = row;
      this.tempKycList[existingIndex] = row;
    }
    // row.kycFilePath = this.fdCumulativeKycModel.kycFilePath ;
    // row.multipartFileList = this.fdCumulativeKycModel.multipartFileList;
    // row.kycDocumentTypeId = this.fdCumulativeKycModel.kycDocumentTypeId;
    // row.kycDocumentTypeName = this.fdCumulativeKycModel.kycDocumentTypeName;
    // row.filesDTOList = this.fdCumulativeKycModel.filesDTOList;
    // row.multipartFileList = this.fdCumulativeKycModel.multipartFileList;

    // this.kycModelList[existingIndex].push(row);
    this.addKycButton = false;
    this.buttonDisabled = false;
    this.updateData();
  }

  /**
   * @author bhargavi
   * @param id
   * @implements bhargavi 
   */
  getKycById(id: any) {
    this.kycModelList = [];
    this.fdCumulativeKycService.getKycById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.fdCumulativeKycModel = this.responseModel.data[0];
              if (this.fdCumulativeKycModel.kycFilePath != undefined) {
                for (let kyc of this.kycModelList) {
                  this.fdCumulativeKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * @implements add or edit kyc temp List
   * @param rowData 
   * @author bhargavi
   */
  addOrEditKycTempList(rowData: any) {
    this.memberTypeCheckForPromotersKyc(this.memberTypeName);
    if (!this.individualFlag) {
      const kyc = this.kycModelList.findIndex(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId && obj.promoterId == rowData.promoterId);
    } else {
      const kyc = this.kycModelList.findIndex(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId);
    }

    if (this.fdCumulativeKycModel.kycFilePath != null || this.fdCumulativeKycModel.kycFilePath != undefined) {
      rowData.kycFilePath = this.fdCumulativeKycModel.kycFilePath;
      if (this.fdCumulativeKycModel.multipartFileList != null && this.fdCumulativeKycModel.multipartFileList != undefined && this.fdCumulativeKycModel.multipartFileList.length > 0) {
        rowData.multipartFileList = this.fdCumulativeKycModel.multipartFileList;

      }
    }
    // this.kycModelList[kyc] = rowData;
    // let kycObj = this.kycModelList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    this.fdCumulativeKycModel = rowData;
  }

  /**
   * @implements duplicate kyc type
   * @param kycDocType 
   * @returns 
   * @author bhargavi
   */
  kycModelDuplicateCheck(kycDocType: any) {
    let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == kycDocType);
    if (filteredObj != null && undefined != filteredObj)
      this.fdCumulativeKycModel.kycDocumentTypeName = filteredObj.label;//Kyc Type Name Check

    //duplicate check
    let duplicate = false;
    const uniqueIds = new Set<number>();
    const duplicateIds = new Set<number>();
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      for (let item of this.kycModelList) {
        if (item != null && item != undefined && item.kycDocumentTypeId != null && item.kycDocumentTypeId != undefined) {
          if (uniqueIds.has(item.kycDocumentTypeId)) {
            duplicateIds.add(item.kycDocumentTypeId);
          } else {
            uniqueIds.add(item.kycDocumentTypeId);
          }
        }
        if (duplicateIds.size > 0) {
          duplicate = true;
          this.kycForm.reset();
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
          setTimeout(() => {
            this.msgs = [];
          }, 1500);
        }
      }
    }

    return duplicate;
  }

  onClickkycPhotoCopy() {
    this.kycPhotoCopyZoom = true;
  }

  kycclosePhoto() {
    this.kycPhotoCopyZoom = false;
  }

  kycclosePhotoCopy() {
    this.kycPhotoCopyZoom = false;
  }
  
}