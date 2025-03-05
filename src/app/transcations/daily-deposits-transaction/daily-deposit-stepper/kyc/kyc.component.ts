import { Component, ElementRef, ViewChild } from '@angular/core';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel } from 'src/app/transcations/term-deposits-transcation/shared/membership-basic-detail.model';
import { Accounts } from '../../shared/accounts.model';
import { AccountKYC } from '../../shared/account-kyc.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { DOCUMENT_TYPES, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';
import { DailyDepositsAccountsService } from '../../shared/daily-deposits-accounts.service';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent {
  kycForm: FormGroup;
  kyc: any;
  checked: any;
  accId: any;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  minBalence: any;
  accountOpeningDateVal: any;
  membershipBasicDetail: MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  accountsModel: Accounts = new Accounts();
  accountsKycModel: AccountKYC = new AccountKYC();
  kycModelList: any[] = [];
  adhaarFilesList: any[] = [];
  signFilesList: any[] = [];
  panFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  uploadFlag: boolean = true;
  submitFlag: boolean = false;
  columns: any[] = [];

  documentsData: any[] = [];
  displayPosition: boolean = false;
  documentNameList: any[] = [];
  position: any;
  docFilesList: any[] = [];
  buttonDisabled: boolean = false;
  isEdit: any;

  filesList: any[] = [];
  orgnizationSetting: any;
  exerciseFileList: any[] = [];
  lastDot = applicationConstants.LAST_DOT;
  memberId: any;
  kycListByMemberId: any[] = [];
  typeFlag: boolean = false;
  addKycButton: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  veiwCardHide: boolean = false;
  editIndex: any;
  afterEditCancleFalg: boolean = false;
  editButtonDisable: boolean = false;
  multipleFilesList: any[] = [];
  filesDTOList: any[] = [];
  productName: any;
  admissionNumber: any;
  showForm: any;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  memberTypeName: any;
  promoterDetails: any[] = [];
  institutionPromoter: any[] = [];
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  memberTypeId: any;
  displayDialog: boolean = false;
  deleteId: any;
  promotersList: any[] = [];
  isPanNumber: boolean = false;
  mandatoryDoxsTextShow: boolean = false;
  saveAndNextEnable : boolean = false;
  kycPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;
  requiredDocumentsNamesText: any;
  saveButtonDisable: boolean= false;
  requiredDocumentsList: any[]=[];
  isDisable: boolean=false;
  mandatoryList:any[]=[];
  fileSizeMsgForImage: any;


  constructor(private router: Router, private formBuilder: FormBuilder,
    private commonComponent: CommonComponent,
    private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private fileUploadService: FileUploadService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
    private dailyDepositsAccountsService:DailyDepositsAccountsService
  ) {
    this.kycForm = this.formBuilder.group({
      'docNumber': new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'requiredDocTypeName': new FormControl('', Validators.required),
      'nameAsPerDocument': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'fileUpload': new FormControl(''),
      // 'promoter': ['', ],
    });
  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.accId = Number(queryParams);
        this.getRdAccounts(this.accId);
        this.isEdit = true;

      } else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.columns = [
      { field: 'docTypeName', header: 'MEMBERSHIP.KYgetAllC_DOCUMENT_NAME' },
      { field: 'docNumber', header: 'MEMBERSHIP.KYC_DOCUMENT_NUMBER' },
      { field: 'docPath', header: 'MEMBERSHIP.KYC_DOCUMENT' }
    ];
    this.getAllKycTypes();
    this.updateData();
  }

  getAllKycTypes() {
    this.dailyDepositsAccountsService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id, isMandatory: count.isMandatory }
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.accountsKycModel.kycDocumentTypeId != null && data.value == this.accountsKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj) {
          this.accountsKycModel.kycDocumentTypeName = filteredObj.label;
        }
        this.mandatoryList = this.documentNameList.filter((obj: any) => obj.isMandatory == applicationConstants.TRUE);
        let i = 0;
        for (let doc of this.documentNameList) {
          if (i == 0)
            this.requiredDocumentsNamesText = "'Please Upload Mandatory KYC Documents "
          if (doc.isMandatory) {
            i = i + 1;
            this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + doc.label;
            if (i < this.mandatoryList.length) {
              this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + " , "
            }
          }
        }
        this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + "'";
        if (i > 0) {
          this.mandatoryDoxsTextShow = true;
        }
      }
    });
  }


  imageUploader(event: any, fileUpload: FileUpload) {
    this.saveButtonDisable = true;
    this.isFileUploaded = applicationConstants.TRUE;
    this.saveButtonDisable = true;
    this.multipleFilesList = [];
    this.accountsKycModel.filesDTOList = [];
    this.accountsKycModel.kycFilePath = null;
    this.accountsKycModel.multipartFileList = [];
    let files: FileUploadModel = new FileUploadModel();

    let selectedFiles = [...event.files];
    if(selectedFiles[0].fileType != ".pdf"){
      if (selectedFiles[0].size/1024/1024 > 2) {
        this.fileSizeMsgForImage= "file is bigger than 2MB";
       }
    }
   
    // Clear file input before processing files
    fileUpload.clear();

    for (let file of selectedFiles) {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        this.isFileUploaded = applicationConstants.TRUE;
        let files = new FileUploadModel();
        this.uploadFileData = e.currentTarget;
        files.fileName = file.name;
        files.fileType = file.type.split('/')[1];
        files.value = this.uploadFileData.result.split(',')[1];
        files.imageValue = this.uploadFileData.result;
        let index = this.multipleFilesList.findIndex(x => x.fileName == files.fileName);
        if (index === -1) {
          this.multipleFilesList.push(files);
          this.accountsKycModel.filesDTOList.push(files); // Add to filesDTOList array
          this.accountsKycModel.multipartFileList.push(files);
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.accountsKycModel.filesDTOList[0].fileName = "DD_KYC_" + this.accId + "_" +timeStamp+ "_"+ file.name ;
        this.accountsKycModel.kycFilePath = "DD_KYC" + this.accId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
        
      }
      reader.readAsDataURL(file);
    }
  }


  save() {
    this.updateData();
  }
  updateData() {
    this.accountsKycModel.accId = this.accId;
    this.accountsKycModel.admissionNumber = this.admissionNumber;
    // this.accountsKycModel.memberTypeName = this.memberTypeName;
    this.accountsKycModel.memberType = this.memberTypeId;
    this.accountsKycModel.memberId = this.memberId;
    if (this.mandatoryList != null && this.mandatoryList != undefined && this.mandatoryList.length > 0 && this.accountsModel.accountKycList != null
      && this.accountsModel.accountKycList != undefined && this.accountsModel.accountKycList.length>0) {
        this.requiredDocumentsList = this.accountsModel.accountKycList;
      if (this.requiredDocumentsList != null && this.requiredDocumentsList != undefined && this.requiredDocumentsList.length > 0) {
        if (this.requiredDocumentsList.every((doc: { kycDocumentTypeName: any; }) => this.mandatoryList.some(kyc => kyc.kycDocumentTypeName === doc.kycDocumentTypeName))) {
          this.isDisable = true;
        } else {
          this.isDisable = false;
        }
      }
      else {
        this.isDisable = true;
      }
    }
    this.dailyDepositsAccountsService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.accountsKycModel,
      // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
      isDisable: !this.isDisable,
      stepperIndex: 1,
    });
  }

  /**
   * @implements delete kyc
   * @param rowDataId 

   */
  delete(rowDataId: any) {
    this.dailyDepositsAccountsService.deleteAccountKyc(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
        this.getAllKycsDetailsRdKycDetails(this.accId);
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
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

  getAllKycsDetailsRdKycDetails(id: any) {
    this.kycModelList = [];
    this.dailyDepositsAccountsService.getKycDetailsByAccountId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.kycModelList = this.responseModel.data;

            if (this.accountsKycModel.kycFilePath != null && this.accountsKycModel.kycFilePath != undefined) {
              this.accountsKycModel.multipartFileList = this.fileUploadService.getFile(this.accountsKycModel.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountsKycModel.kycFilePath);

            }
            if (this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                let multipleFilesList = [];
                let file = new FileUploadModel();
                file.imageValue = ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath;
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
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }

  /**
   * @implements save kyc 
   * @param row 

   */
  saveKyc(row: any) {
    this.accountsKycModel.accId = this.accId;
    this.accountsKycModel.admissionNumber = this.admissionNumber;
    this.accountsKycModel.accountNumber = this.accountsKycModel.accountNumber;
    // this.accountsKycModel.memberTypeName = this.memberTypeName;
    this.accountsKycModel.memberType = this.memberTypeId;
    this.accountsKycModel.memberId = this.memberId;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.accountsKycModel.kycDocumentTypeId != null && data.value == this.accountsKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.accountsKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.accountsKycModel.status = applicationConstants.ACTIVE;
    this.dailyDepositsAccountsService.addAccountKyc(this.accountsKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.accountsKycModel = this.responseModel.data[0];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      } else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getAllKycsDetailsRdKycDetails(this.accId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
    this.addDocumentOfKycFalg = false;
    this.editButtonDisable = false;
  }
  /**
   * @implements cancle kyc

   */
  cancelKyc() {
    this.kycModelList = [];
    this.addKycButton = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.accId);
  }
  getRdAccounts(id: any) {
    this.dailyDepositsAccountsService.getAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.accountsModel = this.responseModel.data[0]
            if (this.accountsModel.depositDate != null && this.accountsModel.depositDate != undefined) {
              this.accountOpeningDateVal = this.datePipe.transform(this.accountsModel.depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.accountsModel.productName != null && this.accountsModel.productName != undefined) {
              this.productName = this.accountsModel.productName;
            }
            if (this.accountsModel.accountTypeName != null && this.accountsModel.accountTypeName != undefined) {
              this.accountType = this.accountsModel.accountTypeName;
            }
            if (this.accountsModel.depositAmount != null && this.accountsModel.depositAmount != undefined) {
              this.minBalence = this.accountsModel.depositAmount;
            }
            if (this.accountsModel.adminssionNumber != null && this.accountsModel.adminssionNumber != undefined) {
              this.admissionNumber = this.accountsModel.adminssionNumber;
            }
            if (this.accountsModel.memberTypeName != null && this.accountsModel.memberTypeName != undefined) {
              this.memberTypeName = this.accountsModel.memberTypeName;
              this.membershipDataFromModule();
            }

            if (this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined)
              this.memberTypeId = this.responseModel.data[0].memberTypeId;
            // this.getAllKycsDetailsRdKycDetails(this.accId);
            if (this.accountsModel.accountKycList != null && this.accountsModel.accountKycList != undefined && this.accountsModel.accountKycList.length > 0) {
              this.kycModelList = this.accountsModel.accountKycList;
              if(this.accountsKycModel.kycFilePath != null && this.accountsKycModel.kycFilePath != undefined){
                this.accountsKycModel.multipartFileList = this.fileUploadService.getFile(this.accountsKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountsKycModel.kycFilePath);
                this.saveButtonDisable = true;
              }
              else{
                this.saveButtonDisable = false;
              }
              for (let kyc of this.kycModelList) {
                kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                if (kyc.multipartFileList != null && kyc.multipartFileList != undefined) {
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                }
              }
            }
            this.updateData();
          }
        } else {
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

  /**
   * @implements add kyc
   * @param event 
  
   */
  addKyc(event: any) {
    this.addDocumentOfKycFalg = true;
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.accountsKycModel = new AccountKYC();
    this.getAllKycTypes();
    this.updateData();
  }

  /**
   * @implements cancle kyc

   */
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.accId);
    this.updateData();
  }

  onClick() {
    this.addDocumentOfKycFalg = true;
  }
  /**
   * @implements edit card data
   * @param index 
   * @param modelData 
  
   */
  toggleEditForm(index: number, modelData: any): void {
    if (this.editIndex === index) {
      this.editIndex = index;
    } else {
      this.editIndex = index;
    }
    if(modelData.kycFilePath != null){
      this.saveButtonDisable=true;
    }else{
      this.saveButtonDisable=false;
    }
    this.editButtonDisable = true;
    this.buttonDisabled = true;
    this.veiwCardHide = false;
    this.editDocumentOfKycFalg = false;
    this.addDocumentOfKycFalg = false;
    this.getKycById(modelData.id);
    this.updateData();

  }
  /**
   * @implements edit cancle

   */
  editCancle() {
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.accId);

    this.updateData();
  }

  /**
   * @implements edit save
   * @param row 
 
   */
  editsave(row: any) {
    this.accountsKycModel.accId = this.accId;
    this.accountsKycModel.admissionNumber = this.admissionNumber;
    // this.accountsKycModel.memberTypeName = this.memberTypeName;
    this.accountsKycModel.accountNumber = this.accountsKycModel.accountNumber;
    this.accountsKycModel.memberType = this.memberTypeId;
    this.accountsKycModel.memberId = this.memberId;

    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.accountsKycModel.requiredDocId != null && data.value == this.accountsKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.accountsKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.dailyDepositsAccountsService.updateAccountKyc(this.accountsKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        // this.kycModelList = this.responseModel.data;
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      }
      else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getAllKycsDetailsRdKycDetails(this.accId);
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });

  }

  /**
   * @implements get kyc by Id
   * @param id 
  
   */
  getKycById(id: any) {
    this.dailyDepositsAccountsService.getAccountKyc(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.accountsKycModel = this.responseModel.data[0];
              if (this.accountsKycModel.kycFilePath != undefined) {
                if (this.accountsKycModel.kycFilePath != null && this.accountsKycModel.kycFilePath != undefined) {
                  this.accountsKycModel.multipartFileList = this.fileUploadService.getFile(this.accountsKycModel.kycFilePath, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.accountsKycModel.kycFilePath);
                  this.isFileUploaded = applicationConstants.TRUE;
                }
                if(this.accountsKycModel.kycDocumentTypeName != null && this.accountsKycModel.kycDocumentTypeName != undefined){
                  this.documentNumberDynamicValidation(this.accountsKycModel.kycDocumentTypeName );
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * @implements get mememberDetails by Admission Number
   * @param admisionNumber 

   */
  getMemberByAdmissionNumber(admisionNumber: any) {
    this.dailyDepositsAccountsService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.membershipBasicDetail = this.responseModel.data[0];
            if (this.membershipBasicDetail.dob != null && this.membershipBasicDetail.dob != undefined) {
              this.membershipBasicDetail.dobVal = this.datePipe.transform(this.membershipBasicDetail.dob, this.orgnizationSetting.datePipe);
            }
            if (this.membershipBasicDetail.admissionDate != null && this.membershipBasicDetail.admissionDate != undefined) {
              this.membershipBasicDetail.admissionDateVal = this.datePipe.transform(this.membershipBasicDetail.admissionDate, this.orgnizationSetting.datePipe);
            }
            this.memberId = this.membershipBasicDetail.id;

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
   * @implements get group admission Number
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
            this.memberId = this.memberGroupDetailsModel.id;
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
   * @implements get institution by admission Number
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
              this.membershipInstitutionDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.admissionDate != null && this.membershipInstitutionDetailsModel.admissionDate != undefined) {
              this.membershipInstitutionDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipInstitutionDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.membershipInstitutionDetailsModel.institutionPromoterList.length > 0)
              this.institutionPromoter = this.membershipInstitutionDetailsModel.institutionPromoterList;
            this.memberId = this.membershipInstitutionDetailsModel.id;
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

  membershipDataFromModule() {
    if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
    } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      if (this.accountsModel.memberShipGroupDetailsDTO.groupPromoterList != null && this.accountsModel.memberShipGroupDetailsDTO.groupPromoterList != undefined && this.accountsModel.memberShipGroupDetailsDTO.groupPromoterList.length > 0) {
        this.promotersList = this.accountsModel.memberShipGroupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name + " " + promoter.surname, value: promoter.id }
        });
      }

    } else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      if (this.accountsModel.memInstitutionDTO.institutionPromoterList != null && this.accountsModel.memInstitutionDTO.institutionPromoterList != undefined && this.accountsModel.memInstitutionDTO.institutionPromoterList.length > 0) {
        this.promotersList = this.accountsModel.memInstitutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name + " " + promoter.surname, value: promoter.id }
        });
      }

    }

  }

  /**
   * @implements kyc module deuplicate
   * @param kycDocTypeId 

   */
  kycModelDuplicateCheck(rowData: any,kycDocumentTypeId:any) {
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      this.accountsKycModel.kycDocumentTypeId = kycDocumentTypeId;
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.accountsKycModel.kycDocumentTypeId != null && data.value == this.accountsKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.accountsKycModel.kycDocumentTypeName = filteredObj.label;
        this.documentNumberDynamicValidation(this.accountsKycModel.kycDocumentTypeName );
      }
      
    }
    if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
      let duplicate :any
      
        duplicate = this.kycModelList.filter((obj:any) => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
      
    if ( this.addDocumentOfKycFalg && duplicate != null && duplicate != undefined && duplicate.length ==1) {
      this.kycForm.reset();
      this.accountsKycModel = new AccountKYC();
      if(rowData.id != null && rowData != undefined)
        this.accountsKycModel.id = rowData.id;
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types"}];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    }
    else if(!this.addDocumentOfKycFalg && duplicate != null && duplicate != undefined && duplicate.length ==1 && duplicate[0].id != rowData.id){
      this.kycForm.reset();
      this.accountsKycModel = new AccountKYC();
      if(rowData.id != null && rowData != undefined)
        this.accountsKycModel.id = rowData.id;
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types"}];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    } 
  }
  }

  /**

  * @implements on click delete
  */
  deletDilogBox(rowData: any) {
    this.displayDialog = true;
    if (rowData.id != null && rowData.id != undefined) {
      this.deleteId = rowData.id;
    }

  }

  /**

   * @implements cancle delete dialog box
   */
  cancelForDialogBox() {
    this.displayDialog = false;
  }

  /**

   * @implements submit delete diloge 
   */
  submitDelete() {
    if (this.deleteId != null && this.deleteId != undefined) {
      this.delete(this.deleteId);
    }
    this.accountsKycModel = new AccountKYC();
    this.displayDialog = false;
  }

  /**
   * @implements onFile remove

   */
  fileRemoeEvent() {
    if (this.accountsKycModel.filesDTOList != null && this.accountsKycModel.filesDTOList != undefined && this.accountsKycModel.filesDTOList.length > 0) {
      let removeFileIndex = this.accountsKycModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.accountsKycModel.kycFilePath);
      if (removeFileIndex != null && removeFileIndex != undefined) {
        this.accountsKycModel.filesDTOList[removeFileIndex] = null;
        this.accountsKycModel.kycFilePath = null;
      }
    }
  }
  documentNumberDynamicValidation(docTypeName: any) {
    if (DOCUMENT_TYPES.AADHAR == this.accountsKycModel.kycDocumentTypeName) {
      const controlTow = this.kycForm.get('docNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.AADHAR_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
    else if (DOCUMENT_TYPES.PANNUMBER == this.accountsKycModel.kycDocumentTypeName) {
      const controlTow = this.kycForm.get('docNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.PAN_NUMBER_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = true;
    }
    else {
      const controlTow = this.kycForm.get('docNumber');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
        ]);
        controlTow.updateValueAndValidity();
      }
      this.isPanNumber = false;
    }
  }
  onClickkycPhotoCopy(rowData :any){
    this.multipleFilesList = [];
    this.kycPhotoCopyZoom = true;
    this.multipleFilesList = rowData.multipartFileList;
  }
  kycclosePhoto(){
    this.kycPhotoCopyZoom = false;
  }
  kycclosePhotoCopy() {
    this.kycPhotoCopyZoom = false;
  }
  fileRemoveEvent() {
    this.accountsKycModel.multipartFileList = [];
    if (this.accountsKycModel.filesDTOList != null && this.accountsKycModel.filesDTOList != undefined) {
      this.accountsKycModel.kycFilePath = null;
      this.accountsKycModel.filesDTOList = null;
    }
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
