import { Component } from '@angular/core';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel, RdKycModel } from '../../../shared/membership-basic-detail.model';
import { RdAccountCommunication, RdAccountsModel } from '../../../shared/term-depost-model.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RdAccountsService } from '../../../shared/rd-accounts.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { RdAccountKycService } from '../../../shared/rd-account-kyc.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { FileUpload } from 'primeng/fileupload';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-rd-membership-details',
  templateUrl: './rd-membership-details.component.html',
  styleUrls: ['./rd-membership-details.component.css']
})
export class RdMembershipDetailsComponent {
  msgs: any[] = [];
  kycForm: any;
  rdKycModelList: any[] = [];
  pacsId: any;
  branchId: any;
  orgnizationSetting: any;
  documentsData: any[] = [];
  uploadFlag: boolean = true;
  rdAccId: any;
  admissionNumber: any;
  disableMemberType: boolean = false;
  isEdit: boolean = false;
  showForm: Boolean = false;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  responseModel!: Responsemodel;
  memberTypeName: any;
  memberTypeId: any;
  isDisableFlag: boolean = false;
  documentNameList: any[] = [];
  editIndex: any;
  isFileUploaded: boolean = false;
  uploadFileData: any;
  rdAccountsModel: RdAccountsModel = new RdAccountsModel();
  rdKycModel: RdKycModel = new RdKycModel();
  membershipBasicRequiredDetailsModel: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  rdAccountCommunication: RdAccountCommunication = new RdAccountCommunication();
  editButtonDisable: boolean = false;
  buttonDisabled: boolean = false;
  kycDuplicate: boolean = false;
  multipleFilesList: any[] = [];
  editDocumentOfKycFalg: boolean = false;
  promotersList: any[] = [];
  tempKycList: any[] = [];
  kycModelList: any[] = [];
  addDocumentOfKycFalg: boolean = false;
  addKycButton: boolean = false;
  kycPhotoCopyZoom: boolean = false;
  veiwCardHide: boolean = false;;



  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private rdAccountsService: RdAccountsService,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService,
    private rdAccountKycService: RdAccountKycService,
  ) {
    this.kycForm = this.formBuilder.group({
      'docNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'kycDocumentTypeName': new FormControl('', Validators.required),
      'promoter': ['',],
      'fileUpload': new FormControl(''),
      'nameAsPerDocument': new FormControl(''),
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
          this.getGroupDetailsById(this.admissionNumber);
          this.getInstitutionDetailsById(this.admissionNumber);
        }
        else {
          if (params['id'] != undefined) {
            this.rdAccId = Number(this.encryptDecryptService.decrypt(params['id']));
            this.getRdAccountById(this.rdAccId);
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
   * @implements getrdAccountApplicationdetails By AccountId
   * @param id 
   * @author bhargavi
   */
  getRdAccountById(id: any) {
    this.rdAccountsService.getRdAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admissionNumber = this.responseModel.data[0].adminssionNumber;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              this.memberTypeCheckForPromotersKyc(this.responseModel.data[0].memberTypeName);
              this.rdAccountsModel = this.responseModel.data[0];
              if (this.rdAccountsModel.memberShipBasicDetailsDTO != null && this.rdAccountsModel.memberShipBasicDetailsDTO != undefined) {
                this.getMultiPartFileList();

              }
              if (this.rdAccountsModel.rdAccountKycList != null && this.rdAccountsModel.rdAccountKycList != undefined && this.rdAccountsModel.rdAccountKycList.length > 0) {
                this.kycModelList = this.rdAccountsModel.rdAccountKycList;
                for (let kyc of this.kycModelList) {
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                }
                this.tempKycList = this.kycModelList;
              }
              this.editDocumentOfKycFalg = true;
              this.membershipDataFromTdModule(this.rdAccountsModel);//for promoter kyc
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
    if (this.rdAccountsModel.memberShipBasicDetailsDTO.photoPath != null && this.rdAccountsModel.memberShipBasicDetailsDTO.photoPath != undefined) {
      this.rdAccountsModel.memberShipBasicDetailsDTO.multipartFileListForPhotoCopy = [];
      this.rdAccountsModel.memberShipBasicDetailsDTO.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.rdAccountsModel.memberShipBasicDetailsDTO.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.rdAccountsModel.memberShipBasicDetailsDTO.photoPath);

    }
    if (this.rdAccountsModel.memberShipBasicDetailsDTO.signaturePath != null && this.rdAccountsModel.memberShipBasicDetailsDTO.signaturePath != undefined) {
      this.rdAccountsModel.memberShipBasicDetailsDTO.multipartFileListForsignatureCopyPath = [];
      this.rdAccountsModel.memberShipBasicDetailsDTO.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.rdAccountsModel.memberShipBasicDetailsDTO.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.rdAccountsModel.memberShipBasicDetailsDTO.signaturePath);
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

    this.rdAccountsService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.rdAccountsModel,
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
  getInstitutionDetailsById(admissionNumber: any) {
    this.kycModelList = [];
    this.rdAccountsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.membershipInstitutionDetailsModel = this.responseModel.data[0];
          this.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.rdAccountsModel.memberTypeName = this.membershipInstitutionDetailsModel.memberTypeName;
          this.rdAccountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          if (this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != null && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList != undefined && this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipInstitutionDetailsModel.institutionKycDetailsDTOList;
            // this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              kyc.promoterName = kyc.promoterName;
            }
            this.rdAccountsModel.rdAccountKycList = this.kycModelList;
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
          this.rdAccountsModel.memberType = this.membershipInstitutionDetailsModel.memberTypeId;
          this.membershipInstitutionDetailsModel.isNewMember = this.showForm;
          this.rdAccountsModel.memInstitutionDTO = this.membershipInstitutionDetailsModel;
          this.membershipDataFromTdModule(this.rdAccountsModel.memInstitutionDTO);//for promoter kyc
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
  getGroupDetailsById(admissionNUmber: any) {
    this.kycModelList = [];
    this.rdAccountsService.getMemberGroupByAdmissionNumber(admissionNUmber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.memberGroupDetailsModel = this.responseModel.data[0];
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
            this.rdAccountsModel.rdAccountKycList = this.kycModelList;
          }
          this.tempKycList = this.kycModelList;
          this.admissionNumber = this.memberGroupDetailsModel.admissionNumber;
          this.memberGroupDetailsModel.isNewMember = this.showForm;
          this.rdAccountsModel.memberTypeName = this.memberGroupDetailsModel.memberTypeName;
          this.rdAccountsModel.memberType = this.memberGroupDetailsModel.memberTypeId;
          this.rdAccountsModel.memberShipGroupDetailsDTO = this.memberGroupDetailsModel;
          this.membershipDataFromTdModule(this.rdAccountsModel.memberShipGroupDetailsDTO);//for promoter kyc
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
     * @implements membership data from rd module
     * @author bhargavi
     */
  membershipDataFromTdModule(obj: any) {
    if (obj.memberTypeName == "Individual") {
      this.individualFlag = true;
    } else if (obj.memberTypeName == "Group") {
      this.groupFlag = true;
      if (this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList != null && this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList != undefined && this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList.length > 0) {
        this.promotersList = this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name + " " + promoter.surname + " " + promoter.aadharNumber, value: promoter.id }
        });
      }

    } else if (obj.memberTypeName == "Institution") {
      this.institutionFlag = true;
      if (this.rdAccountsModel.memInstitutionDTO.institutionPromoterList != null && this.rdAccountsModel.memInstitutionDTO.institutionPromoterList != undefined && this.rdAccountsModel.memInstitutionDTO.institutionPromoterList.length > 0) {
        this.promotersList = this.rdAccountsModel.memInstitutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
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
    this.rdAccountsService.getMembershipBasicDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
          this.membershipBasicRequiredDetailsModel.fdNonCummCommunicationDto = this.responseModel.data[0].memberShipCommunicationDetailsDTOList;
          this.membershipBasicRequiredDetailsModel.fdNonCummkycDetailsList = this.responseModel.data[0].memberShipKycDetailsDTOList;
          this.membershipBasicRequiredDetailsModel.photoPath = this.responseModel.data[0].photoCopyPath; 
          this.membershipBasicRequiredDetailsModel.signaturePath = this.responseModel.data[0].signatureCopyPath; 

          if (this.membershipBasicRequiredDetailsModel.dob != null && this.membershipBasicRequiredDetailsModel.dob != undefined) {
            this.membershipBasicRequiredDetailsModel.dobVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.admissionNumber != null && this.membershipBasicRequiredDetailsModel.admissionNumber != undefined) {
            this.admissionNumber = this.membershipBasicRequiredDetailsModel.admissionNumber;
          }
          if (this.membershipBasicRequiredDetailsModel.admissionDate != null && this.membershipBasicRequiredDetailsModel.admissionDate != undefined) {
            this.membershipBasicRequiredDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipBasicRequiredDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          if (this.membershipBasicRequiredDetailsModel.fdNonCummCommunicationDto != null && this.membershipBasicRequiredDetailsModel.fdNonCummCommunicationDto != undefined) {
            this.rdAccountCommunication = this.membershipBasicRequiredDetailsModel.fdNonCummCommunicationDto;
            this.rdAccountsModel.rdAccountCommunicationDTO= this.membershipBasicRequiredDetailsModel.fdNonCummCommunicationDto;
          }
          if (this.membershipBasicRequiredDetailsModel.memberTypeId == null || this.membershipBasicRequiredDetailsModel.memberTypeId == undefined) {
            this.membershipBasicRequiredDetailsModel.memberTypeId = applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID;
          }
          this.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
          this.memberTypeCheckForPromotersKyc(this.membershipBasicRequiredDetailsModel.memberTypeName);
          if (this.membershipBasicRequiredDetailsModel.photoPath != null && this.membershipBasicRequiredDetailsModel.photoPath != undefined) {
            this.membershipBasicRequiredDetailsModel.filesDTOList = [];
            this.membershipBasicRequiredDetailsModel.multipartFileListForPhotoCopy = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.photoPath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.photoPath);
          }
          if (this.membershipBasicRequiredDetailsModel.signaturePath != null && this.membershipBasicRequiredDetailsModel.signaturePath != undefined) {
            this.membershipBasicRequiredDetailsModel.multipartFileListForsignatureCopyPath = this.fileUploadService.getFile(this.membershipBasicRequiredDetailsModel.signaturePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.membershipBasicRequiredDetailsModel.signaturePath);
          }
          if (this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList != null && this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList != undefined && this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList.length > 0) {
            this.kycModelList = this.membershipBasicRequiredDetailsModel.memberShipKycDetailsDTOList;
            // this.kycModelDuplicateCheck(this.kycModelList);
            for (let kyc of this.kycModelList) {
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            }
          }
          this.tempKycList = this.kycModelList;
          this.rdAccountsModel.rdAccountKycList = this.kycModelList;
          this.rdAccountsModel.memberTypeName = this.membershipBasicRequiredDetailsModel.memberTypeName;
          this.membershipBasicRequiredDetailsModel.isNewMember = this.showForm;
          this.rdAccountsModel.memberShipBasicDetailsDTO = this.membershipBasicRequiredDetailsModel;
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
    this.rdKycModel = new RdKycModel;
    this.updateData();
  }


  /**
   * @implements get all kyc types  
   * @author bhargavi
   */
  getAllKycTypes() {
    this.rdAccountKycService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && data.value == this.rdKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj)
          this.rdKycModel.kycDocumentTypeName = filteredObj.label;
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
    this.rdKycModel.filesDTOList = [];
    this.rdKycModel.multipartFileList = [];
    this.rdKycModel.kycFilePath = null;
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

        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.rdKycModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.rdKycModel.filesDTOList[0].fileName = "SB_KYC_" + this.rdAccId + "_" + timeStamp + "_" + file.name;
        this.rdKycModel.kycFilePath = "SB_KYC_" + this.rdAccId + "_" + timeStamp + "_" + file.name; // This will set the last file's name as docPath
        this.rdKycModel.multipartFileList = this.rdKycModel.filesDTOList;
        let index1 = event.files.findIndex((x: any) => x === file);
        // this.addOrEditKycTempList(this.rdKycModel);
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
    this.rdAccountKycService.deleteRdAccountKyc(rowData.id).subscribe((response: any) => {
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
    this.rdAccountKycService.getKycDetailsByAdmissionNumber(admissionNumber).subscribe((response: any) => {
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
      // this.getRdAccountById(rdAccId);
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
    // this.kycModelList = [];
    this.rdKycModel = new RdKycModel();
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    // this.kycModelList = this.tempKycList;
    this.editButtonDisable = false;
    // this.kycModelList ;
    // this.updateData();
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
    // row.kycFilePath = this.rdKycModel.kycFilePath ;
    // row.multipartFileList = this.rdKycModel.multipartFileList;
    // row.kycDocumentTypeId = this.rdKycModel.kycDocumentTypeId;
    // row.kycDocumentTypeName = this.rdKycModel.kycDocumentTypeName;
    // row.filesDTOList = this.rdKycModel.filesDTOList;
    // row.multipartFileList = this.rdKycModel.multipartFileList;

    // this.kycModelList[existingIndex].push(row);
    this.addKycButton = false;
    this.buttonDisabled = false;
    this.updateData();
  }

  /**
   * @author bhargavi
   * @param id
   */
  getKycById(id: any) {
    this.kycModelList = [];
    this.rdAccountKycService.getRdAccountKyc(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.rdKycModel = this.responseModel.data[0];
              if (this.rdKycModel.kycFilePath != undefined) {
                for (let kyc of this.kycModelList) {
                  this.rdKycModel.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
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

    if (this.rdKycModel.kycFilePath != null || this.rdKycModel.kycFilePath != undefined) {
      rowData.kycFilePath = this.rdKycModel.kycFilePath;
      if (this.rdKycModel.multipartFileList != null && this.rdKycModel.multipartFileList != undefined && this.rdKycModel.multipartFileList.length > 0) {
        rowData.multipartFileList = this.rdKycModel.multipartFileList;

      }
    }
    // this.kycModelList[kyc] = rowData;
    // let kycObj = this.kycModelList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    this.rdKycModel = rowData;
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
      this.rdKycModel.kycDocumentTypeName = filteredObj.label;//Kyc Type Name Check

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
