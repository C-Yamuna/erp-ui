import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FdNonCummulativeAccountKycService } from '../../../shared/fd-non-cummulative-account-kyc.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FdNonCumulativeApplicationService } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FdNonCumulativeApplication } from '../fd-non-cumulative-application/shared/fd-non-cumulative-application.model';
import { NewMembershipAddService } from '../new-membership-add/shared/new-membership-add.service';
import { MemberGroupDetailsModel, MembershipInstitutionDetailsModel, NewMembershipAdd } from '../new-membership-add/shared/new-membership-add.model';
import { FdNonCumulativeKyc } from '../fd-non-cumulative-kyc/shared/fd-non-cumulative-kyc.model';
import { FileUpload } from 'primeng/fileupload';
import { FdNonCumulativeCommunication } from '../fd-non-cumulative-communication/shared/fd-non-cumulative-communication.model';
import { Table } from 'primeng/table';
import { FdNonCumulativeKycService } from '../fd-non-cumulative-kyc/shared/fd-non-cumulative-kyc.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-membership-details',
  templateUrl: './membership-details.component.html',
  styleUrls: ['./membership-details.component.css']
})
export class MembershipDetailsComponent {


  applicationList: any[] = [];
  accountList: any[] = [];
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  fdNonCumulativeApplicationModel: FdNonCumulativeApplication = new FdNonCumulativeApplication();
  fdNonCumulativeKycModel: FdNonCumulativeKyc = new FdNonCumulativeKyc();
  membershipBasicRequiredDetails: NewMembershipAdd = new NewMembershipAdd();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  fdNonCumulativeCommunicationModel: FdNonCumulativeCommunication = new FdNonCumulativeCommunication();
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
  memberTypeId: any;
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
  fdNonCummulativeAccId: any;
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
  tempKycList: any[] = [];
  promotersList: any[] = [];
  kycPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;


  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private fdNonCumulativeApplicationService: FdNonCumulativeApplicationService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private membershipServiceService: NewMembershipAddService,
    private fdNonCumulativeKycService: FdNonCumulativeKycService,
    private fileUploadService: FileUploadService) {
    this.kycForm = this.formBuilder.group({
      'docNumber': [{ value: '', disabled: true }],
      'docTypeName': [{ value: '', disabled: true }],
      'promoter': ['',],
      'fileUpload': new FormControl({ value: '', disabled: true }),
      'nameAsPerDocument': ['', [Validators.pattern(applicationConstants.ALPHA_NAME_PATTERN), Validators.compose([Validators.required])]],
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
            this.fdNonCummulativeAccId = Number(this.encryptDecryptService.decrypt(params['id']));
            this.getFdNonCummApplicationById(this.fdNonCummulativeAccId);
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
   * @implements getsbAccountApplicationdetails By AccountId
   * @param id 
   * @author bhargavi
   */
  getFdNonCummApplicationById(id: any) {
    this.fdNonCumulativeApplicationService.getFdNonCummApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admissionNumber = this.responseModel.data[0].admissionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.memberTypeCheckForPromotersKyc(this.responseModel.data[0].memberTypeName);
              this.fdNonCumulativeApplicationModel = this.responseModel.data[0];
              if (this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO != null && this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO != undefined) {
                this.getMultiPartFileList();

              }
              if (this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList != null && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList != undefined && this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList.length > 0) {
                this.kycModelList = this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList;
                for (let kyc of this.kycModelList) {
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                }
                this.tempKycList = this.kycModelList;
              }
              this.editDocumentOfKycFalg = true;
              this.membershipDataFromTdModule(this.fdNonCumulativeApplicationModel);//for promoter kyc
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
    if (this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath != null && this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath != undefined) {
      this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForPhotoCopy = [];
      this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.photoPath);

    }
    if (this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath != null && this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath != undefined) {
      this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForsignatureCopyPath = [];
      this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO.signaturePath);
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

    this.fdNonCumulativeApplicationService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.fdNonCumulativeApplicationModel,
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
    this.fdNonCumulativeApplicationService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.membershipInstitutionDetailsModel.photoPath = this.responseModel.data[0].photoCopyPath;
          this.membershipInstitutionDetailsModel.signaturePath = this.responseModel.data[0].signatureCopyPath;
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.fdNonCumulativeApplicationModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.fdNonCumulativeApplicationModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          if (this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != null && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != undefined && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
            // this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              kyc.promoterName = kyc.promoterName;
            }
            this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList = this.kycModelList;
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
          this.fdNonCumulativeApplicationModel.memberType = this.membershipInstitutionDetailsModel.memberTypeId;
          this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
          this.fdNonCumulativeApplicationModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          this.membershipDataFromTdModule(this.fdNonCumulativeApplicationModel.memInstitutionDTO);//for promoter kyc
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
    this.fdNonCumulativeApplicationService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
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
            this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList = this.kycModelList;
          }
          this.tempKycList = this.kycModelList;
          this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.memberGroupDetailsModel.isNewMember = this.showForm;
          this.fdNonCumulativeApplicationModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
          this.fdNonCumulativeApplicationModel.memberType = this.memberGroupDetailsModel.memberTypeId;
          this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
          this.membershipDataFromTdModule(this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO);//for promoter kyc
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
      if (this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList != null && this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList != undefined && this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList.length > 0) {
        this.promotersList = this.fdNonCumulativeApplicationModel.memberShipGroupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name + " " + promoter.surname + " " + promoter.aadharNumber, value: promoter.id }
        });
      }

    } else if (obj.memberTypeName == "Institution") {
      this.institutionFlag = true;
      if (this.fdNonCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList != null && this.fdNonCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList != undefined && this.fdNonCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList.length > 0) {
        this.promotersList = this.fdNonCumulativeApplicationModel.memInstitutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
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
    this.fdNonCumulativeApplicationService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.membershipBasicRequiredDetails = this.responseModel.data[0];
          this.membershipBasicRequiredDetails.fdNonCummCommunicationDto = this.responseModel.data[0].memberShipCommunicationDetailsDTO;
          this.membershipBasicRequiredDetails.photoPath = this.responseModel.data[0].photoCopyPath;
          this.membershipBasicRequiredDetails.signaturePath = this.responseModel.data[0].signatureCopyPath;
          this.membershipBasicRequiredDetails.subProductName = this.responseModel.data[0].subProductName;
          this.memberTypeName = this.responseModel.data[0].memberTypeName;
          this.membershipBasicRequiredDetails.resolutionCopy = this.responseModel.data[0].mcrDocumentCopy;
          this.membershipBasicRequiredDetails.mcrNumber = this.responseModel.data[0].mcrNumber;
          this.membershipBasicRequiredDetails.resolutionDate = this.responseModel.data[0].resolutionDate;
          if (this.membershipBasicRequiredDetails.resolutionDate != null && this.membershipBasicRequiredDetails.resolutionDate != undefined) {
            this.membershipBasicRequiredDetails.resolutionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.resolutionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetails.dob != null && this.membershipBasicRequiredDetails.dob != undefined) {
            this.membershipBasicRequiredDetails.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetails.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetails.admissionNumber != null && this.membershipBasicRequiredDetails.admissionNumber != undefined) {
            this.admissionNumber = this.membershipBasicRequiredDetails.admissionNumber;
          }
          if (this.membershipBasicRequiredDetails.admissionDate != null && this.membershipBasicRequiredDetails.admissionDate != undefined) {
            this.membershipBasicRequiredDetails.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetails.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetails.fdNonCummCommunicationDto != null && this.membershipBasicRequiredDetails.fdNonCummCommunicationDto != undefined) {
            this.fdNonCumulativeCommunicationModel = this.membershipBasicRequiredDetails.fdNonCummCommunicationDto;
            this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountCommunicationDto = this.membershipBasicRequiredDetails.fdNonCummCommunicationDto;
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
          if (this.membershipBasicRequiredDetails.resolutionCopy != null && this.membershipBasicRequiredDetails.resolutionCopy != undefined) {
            this.membershipBasicRequiredDetails.multipartFileListForResolutionCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetails.resolutionCopy, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetails.resolutionCopy);
          }
          if (this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != null && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList != undefined && this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipBasicRequiredDetails.memberShipKycDetailsDTOList;
            // this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            }
          }
          this.tempKycList = this.kycModelList;
          this.fdNonCumulativeApplicationModel.fdNonCummulativeAccountKycList = this.kycModelList;
          this.fdNonCumulativeApplicationModel.memberTypeName = this.membershipBasicRequiredDetails.memberTypeName;
          this.membershipBasicRequiredDetails.isNewMember = this.showForm;
          this.fdNonCumulativeApplicationModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetails;
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
    this.fdNonCumulativeKycModel = new FdNonCumulativeKyc;
    this.updateData();
  }


  /**
   * @implements get all kyc types  
   * @author bhargavi
   */
  getAllKycTypes() {
    this.fdNonCumulativeKycService.getAllKycTypesFromCommonMaster().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.fdNonCumulativeKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj)
          this.fdNonCumulativeKycModel.kycDocumentTypeName = filteredObj.label;
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
      let fileSizeFlag = false;
      this.isFileUploaded = applicationConstants.FALSE;
      this.multipleFilesList = [];
      this.fdNonCumulativeKycModel.filesDTOList = [];
      this.fdNonCumulativeKycModel.kycFilePath = null;
      this.fdNonCumulativeKycModel.multipartFileList = [];
      
      let selectedFiles = [...event.files];
      if (selectedFiles[0].size / 1024 / 1024 > 2) {
        this.msgs = [{ severity: "warning", summary: applicationConstants.THE_FILE_SIZE_SHOULD_BE_LESS_THEN_2MB }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
        fileSizeFlag = true;
      }
      fileUpload.clear();
      if (!fileSizeFlag) {
        for (let file of selectedFiles) {
          let reader = new FileReader();
          reader.onloadend = (e) => {
            this.isFileUploaded = applicationConstants.TRUE;
            let files = new FileUploadModel();
            this.uploadFileData = e.currentTarget;
            files.fileName = file.name;
            files.fileType = file.type.split("/")[1];
            files.value = this.uploadFileData.result.split(",")[1];
            files.imageValue = this.uploadFileData.result;
  
            let index = this.multipleFilesList.findIndex((x) => x.fileName === files.fileName);
            if (index === -1) {
              this.multipleFilesList.push(files);
              this.fdNonCumulativeKycModel.filesDTOList.push(files);
              this.fdNonCumulativeKycModel.multipartFileList.push(files);
            }
  
            let timeStamp = this.commonComponent.getTimeStamp();
            this.fdNonCumulativeKycModel.filesDTOList[0].fileName = "FD_NON_CUM_KYC_" + this.fdNonCummulativeAccId + "_" + timeStamp + "_" + file.name;
            this.fdNonCumulativeKycModel.kycFilePath = "FD_NON_CUM_KYC_" + this.fdNonCummulativeAccId + "_" + timeStamp + "_" + file.name;
  
            let index1 = event.files.findIndex((x: any) => x === file);
            fileUpload.remove(event, index1);
            fileUpload.clear();
          };
          reader.readAsDataURL(file);
        }
      } else {
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }

  /**
   * @implements delete kyc
   * @param rowData 
   * @author bhargavi
   */
  delete(rowData: any) {
    this.fdNonCumulativeKycService.deleteKyc(rowData.id).subscribe((response: any) => {
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
    this.fdNonCumulativeKycService.getMemberKycByAddmissionNumber(admissionNumber).subscribe((response: any) => {
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
      // this.getFdNonCummApplicationById(fdNonCummulativeAccId);
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
  * @implements edit cancel
  * @author bhargavi
  */
  editCancle() {
    this.fdNonCumulativeKycModel = new FdNonCumulativeKyc();
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
    // row.kycFilePath = this.fdNonCumulativeKycModel.kycFilePath ;
    // row.multipartFileList = this.fdNonCumulativeKycModel.multipartFileList;
    // row.kycDocumentTypeId = this.fdNonCumulativeKycModel.kycDocumentTypeId;
    // row.kycDocumentTypeName = this.fdNonCumulativeKycModel.kycDocumentTypeName;
    // row.filesDTOList = this.fdNonCumulativeKycModel.filesDTOList;
    // row.multipartFileList = this.fdNonCumulativeKycModel.multipartFileList;

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
    this.fdNonCumulativeKycService.getKycById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.fdNonCumulativeKycModel = this.responseModel.data[0];
              if (this.fdNonCumulativeKycModel.kycFilePath != undefined) {
                for (let kyc of this.kycModelList) {
                  this.fdNonCumulativeKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
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

    if (this.fdNonCumulativeKycModel.kycFilePath != null || this.fdNonCumulativeKycModel.kycFilePath != undefined) {
      rowData.kycFilePath = this.fdNonCumulativeKycModel.kycFilePath;
      if (this.fdNonCumulativeKycModel.multipartFileList != null && this.fdNonCumulativeKycModel.multipartFileList != undefined && this.fdNonCumulativeKycModel.multipartFileList.length > 0) {
        rowData.multipartFileList = this.fdNonCumulativeKycModel.multipartFileList;

      }
    }
    // this.kycModelList[kyc] = rowData;
    // let kycObj = this.kycModelList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    this.fdNonCumulativeKycModel = rowData;
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
      this.fdNonCumulativeKycModel.kycDocumentTypeName = filteredObj.label;//Kyc Type Name Check

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

  onClickkycPhotoCopy(rowData: any) {
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }

  kycclosePhoto() {
    this.kycPhotoCopyZoom = false;
  }

  kycclosePhotoCopy() {
    this.kycPhotoCopyZoom = false;
  }

  // Popup Maximize
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  onDialogResize(event: any) {
    this.isMaximized = event.maximized;

    if (this.isMaximized) {
      // Restore original image size when maximized
      this.imageElement.nativeElement.style.width = 'auto';
      this.imageElement.nativeElement.style.height = 'auto';
      this.imageElement.nativeElement.style.maxWidth = '100%';
      this.imageElement.nativeElement.style.maxHeight = '100vh';
    } else {
      // Fit image inside the dialog without scrollbars
      this.imageElement.nativeElement.style.width = '100%';
      this.imageElement.nativeElement.style.height = '100%';
      this.imageElement.nativeElement.style.maxWidth = '100%';
      this.imageElement.nativeElement.style.maxHeight = '100%';
      this.imageElement.nativeElement.style.objectFit = 'contain';
    }
  }
}
