import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RdAccountKycService } from '../../../shared/rd-account-kyc.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { MemberGroupDetailsModel, MembershipBasicDetail, MembershipInstitutionDetailsModel, RdKycModel } from '../../../shared/membership-basic-detail.model';
import { RdAccountsService } from '../../../shared/rd-accounts.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { termdeposittransactionconstant } from '../../../term-deposit-transaction-constant';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { RdAccountsModel } from '../../../shared/term-depost-model.model';
import { DOCUMENT_TYPES, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-recurring-deposit-kyc',
  templateUrl: './recurring-deposit-kyc.component.html',
  styleUrls: ['./recurring-deposit-kyc.component.css']
})
export class RecurringDepositKycComponent {

  kycForm: FormGroup;
  kyc: any;
  checked: any;
  rdAccId: any;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  minBalence: any;
  accountOpeningDateVal: any;
  membershipBasicDetail:MembershipBasicDetail = new MembershipBasicDetail();
  memberGroupDetailsModel:MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel:MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  rdAccountsModel:RdAccountsModel = new RdAccountsModel();
  rdKycModel:RdKycModel = new RdKycModel();
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
  individualFlag : boolean = false;
  groupFlag : boolean = false;
  institutionFlag : boolean = false;
  memberTypeName: any;
  promoterDetails: any[]= [];
  institutionPromoter: any[]= [];
  memberName: any;
  mobileNumer: any;
  aadharNumber: any;
  qualificationName: any;
  panNumber: any;
  memberTypeId: any;
  displayDialog: boolean = false;
  deleteId: any;
  promotersList: any [] =[];
  mandatoryDoxsTextShow: boolean = false;
  requiredDocumentsNamesText: any;
  saveAndNextEnable : boolean = false;
  kycPhotoCopyZoom: boolean = false;
  isMaximized: boolean = false;
  isPanNumber: boolean = false;


  constructor(private router: Router, private formBuilder: FormBuilder, private rdAccountsService: RdAccountsService,
    private rdAccountKycService: RdAccountKycService, private commonComponent: CommonComponent,
     private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
     private fileUploadService : FileUploadService,
     private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe) {
      this.kycForm = this.formBuilder.group({
        'docTypeName': new FormControl('', Validators.required),
        'docNumber': new FormControl('',[Validators.required, Validators.pattern(applicationConstants.ALLOW_NUMBERS_ONLY)]),
        'nameAsPerDocument': new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40)]),
        'kycFilePath': new FormControl(''),
        'promoter': new FormControl('')
      });
  }

  
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined ) {
        let queryParams = this.encryptDecryptService.decrypt(params['id']);
        this.rdAccId = Number(queryParams);
        this.getRdAccounts(this.rdAccId);
        this.isEdit = true;
        
      } else {
        this.isEdit = false;
      }
    });
    this.buttonDisabled = false;
    this.columns = [
      { field: 'docTypeName', header: 'MEMBERSHIP.KYC_DOCUMENT_NAME' },
      { field: 'docNumber', header: 'MEMBERSHIP.KYC_DOCUMENT_NUMBER' },
      { field: 'docPath', header: 'MEMBERSHIP.KYC_DOCUMENT' }
    ];
    this.getAllKycTypes();
    this.updateData();
  }
  
  getAllKycTypes() {
    this.rdAccountKycService.getAllKycTypes().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
          return { label: count.name, value: count.id , isMandatory:count.isMandatory}
        });
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.rdKycModel.kycDocumentTypeId != null && data.value == this.rdKycModel.kycDocumentTypeId);
            if (filteredObj != null && undefined != filteredObj)
              this.rdKycModel.kycDocumentTypeName = filteredObj.label;
        let i = 0;
        for (let doc of this.documentNameList) {
          if (i == 0)
            this.requiredDocumentsNamesText = "Please Upload Mandatory KYC Documents ("
          if (doc.isMandatory) {
            i = i + 1;
            this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + "'" + doc.label + "'";
          }
        }
        this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + ")";
        if (i > 0) {
          this.mandatoryDoxsTextShow = true;
        }
      }
    });
  }

  imageUploader(event: any, fileUpload: FileUpload) {
    let fileSizeFlag = false;
    this.isFileUploaded = applicationConstants.FALSE;
    this.multipleFilesList = [];
    this.rdKycModel.filesDTOList = [];
    this.rdKycModel.kycFilePath = null;
    this.rdKycModel.multipartFileList = [];
    
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
            this.rdKycModel.filesDTOList.push(files);
            this.rdKycModel.multipartFileList.push(files);
          }

          let timeStamp = this.commonComponent.getTimeStamp();
          this.rdKycModel.filesDTOList[0].fileName = "RD_KYC_" + this.rdAccId + "_" + timeStamp + "_" + file.name;
          this.rdKycModel.kycFilePath = "RD_KYC_" + this.rdAccId + "_" + timeStamp + "_" + file.name;

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

  
  save() {
    this.updateData();
  }
  updateData() {
    this.rdKycModel.rdAccId = this.rdAccId;
    this.rdKycModel.admissionNumber = this.admissionNumber;
    this.rdKycModel.memberTypeName = this.memberTypeName;
    this.rdKycModel.memberType = this.memberTypeId;
    this.rdKycModel.memberId = this.memberId;
    //for manadatory KYC Documents check
    this.saveAndNextEnable = false;
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let documentNameList = this.documentNameList.filter((obj: any) => obj.isMandatory);
      if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0 && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) {
        if (this.rdKycModel.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
          const missingItems = this.kycModelList.filter(document => !documentNameList.some(mandatoryDocument => document.kycDocumentTypeId === mandatoryDocument.value));
          if ((documentNameList.length != this.kycModelList.length - missingItems.length) || this.buttonDisabled) {
            this.saveAndNextEnable = true;
          }
        }else {//group institution promoter kyc mandatory uploads check
          let i = 0;
          this.promotersList.forEach((promoter: any) => {
            let KycList = this.kycModelList.filter((obj: any) => obj.promoterId === promoter.value);

            if (this.documentNameList?.length) {
              // Filter only mandatory documents
              let mandatoryDocs = this.documentNameList.filter((doc: any) => doc.isMandatory);

              if (KycList.length > 0 && mandatoryDocs.length > 0) {
                // Check if all mandatory documents are present in KycList
                const missingItems = mandatoryDocs.filter(
                  (mandatoryDoc) => !KycList.some((kyc) => kyc.kycDocumentTypeId === mandatoryDoc.value)
                );

                // disable save button if any mandatory document is missing
                if (missingItems.length > 0 || this.buttonDisabled) {
                  this.saveAndNextEnable = true;
                }
              } else if ((KycList.length === 0 && mandatoryDocs.length > 0) || this.buttonDisabled) {
                // If no KYC documents exist but mandatory ones are required
                this.saveAndNextEnable = true;
              }
            }
          });
        }
      }
      else if (((this.kycModelList == null || this.kycModelList == undefined || this.kycModelList.length === 0) && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) || this.buttonDisabled) {
        this.saveAndNextEnable = true;
      }
    }
    this.rdAccountsService.changeData({
      formValid: !this.kycForm.valid ? true : false,
      data: this.rdKycModel,
      // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
      // isDisable: this.buttonDisabled,
      isDisable: this.saveAndNextEnable,
      stepperIndex: 1,
    });
  }

  /**
   * @implements delete kyc
   * @param rowDataId 

   */
  delete(rowDataId: any) {
    this.rdAccountKycService.deleteRdAccountKyc(rowDataId).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.kycModelList = this.responseModel.data;
          this.getAllKycsDetailsRdKycDetails(this.rdAccId);
          this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      else{
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
    this.rdAccountKycService.getKycDetailsByTermAccountId(id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.kycModelList = this.responseModel.data;
            if (this.kycModelList != null && this.kycModelList != undefined) {
              this.editDocumentOfKycFalg = true;
              for (let kyc of this.kycModelList) {
                if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                  if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                    kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);

                  }
                }  
              }
              this.buttonDisabled = false;
              this.updateData();
            }
          }
          else{
            this.addDocumentOfKycFalg = true;
            this.buttonDisabled = true;
            this.updateData();
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
    this.rdKycModel.rdAccId = this.rdAccId;
    this.rdKycModel.admissionNumber = this.admissionNumber;
    this.rdKycModel.memberTypeName  = this.memberTypeName;
    this.rdKycModel.memberType  = this.memberTypeId;
    this.rdKycModel.memberId  = this.memberId;
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.rdKycModel.kycDocumentTypeId != null && data.value == this.rdKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.rdKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.rdKycModel.status  = applicationConstants.ACTIVE;
    this.rdAccountKycService.addRdAccountKyc(this.rdKycModel).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.rdKycModel = this.responseModel.data[0];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 1200);
      }else {
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      this.addKycButton = false;
      this.buttonDisabled = false;
      this.getAllKycsDetailsRdKycDetails(this.rdAccId);
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
    this.getAllKycsDetailsRdKycDetails(this.rdAccId);
  }
  getRdAccounts(id: any) {
    this.rdAccountsService.getRdAccounts(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.rdAccountsModel = this.responseModel.data[0]
            if (this.rdAccountsModel.depositDate != null && this.rdAccountsModel.depositDate != undefined) {
              this.accountOpeningDateVal = this.datePipe.transform(this.rdAccountsModel.depositDate, this.orgnizationSetting.datePipe);
            }
            if (this.rdAccountsModel.productName != null && this.rdAccountsModel.productName != undefined) {
              this.productName = this.rdAccountsModel.productName;
            }
            if (this.rdAccountsModel.accountTypeName != null && this.rdAccountsModel.accountTypeName != undefined) {
              this.accountType = this.rdAccountsModel.accountTypeName;
            }
            if (this.rdAccountsModel.depositAmount != null && this.rdAccountsModel.depositAmount != undefined) {
              this.minBalence = this.rdAccountsModel.depositAmount;
            } 
            if(this.rdAccountsModel.adminssionNumber != null && this.rdAccountsModel.adminssionNumber != undefined){
              this.admissionNumber = this.rdAccountsModel.adminssionNumber;
            }
            if(this.rdAccountsModel.memberTypeName != null && this.rdAccountsModel.memberTypeName != undefined){
              this.memberTypeName = this.rdAccountsModel.memberTypeName;
              this.membershipDataFromModule();
            }
            if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length >0) {
              let i = 0;
              for (let doc of this.documentNameList) {
                if (i == 0)
                  this.requiredDocumentsNamesText = "Please Upload Mandatory KYC Documents ("
                if (doc.isMandatory) {
                  i = i + 1;
                  this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + "'" + doc.label + "'";
                }
              }
              this.requiredDocumentsNamesText = this.requiredDocumentsNamesText + ")";
              if (i > 0) {
                this.mandatoryDoxsTextShow = true;
              }
            }
          
            if(this.responseModel.data[0].memberType != null && this.responseModel.data[0].memberType != undefined)
              this.memberTypeId = this.responseModel.data[0].memberType;
            this.getAllKycsDetailsRdKycDetails(this.rdAccId);
            this.updateData();
          }
        }else {
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
    this.isFileUploaded = applicationConstants.FALSE;
    this.getAllKycTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable = true;
    this.rdKycModel = new RdKycModel;
    this.updateData();
  }

  /**
   * @implements cancle kyc

   */
  cancel() {
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.getAllKycsDetailsRdKycDetails(this.rdAccId);
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
      this.getAllKycsDetailsRdKycDetails(this.rdAccId);
    
    this.updateData();
  }

   /**
    * @implements edit save
    * @param row 
 
    */
  editsave(row: any) {
    this.rdKycModel.rdAccId = this.rdAccId;
    this.rdKycModel.admissionNumber = this.admissionNumber;
    this.rdKycModel.memberTypeName  = this.memberTypeName;
    this.rdKycModel.memberType  = this.memberTypeId;
    this.rdKycModel.memberId  = this.memberId;
    
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.rdKycModel.kycDocumentTypeId != null && data.value == this.rdKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.rdKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    this.rdAccountKycService.updateRdAccountKyc(this.rdKycModel).subscribe((response: any) => {
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
      this.getAllKycsDetailsRdKycDetails(this.rdAccId);
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
    this.rdAccountKycService.getRdAccountKyc(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.rdKycModel = this.responseModel.data[0];
              if (this.rdKycModel.kycFilePath != undefined) {
                if(this.rdKycModel.kycFilePath != null && this.rdKycModel.kycFilePath != undefined){
                  this.rdKycModel.multipartFileList = this.fileUploadService.getFile(this.rdKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.rdKycModel.kycFilePath);
                  this.isFileUploaded = applicationConstants.TRUE;
                }
                if(this.rdKycModel.kycDocumentTypeName != null && this.rdKycModel.kycDocumentTypeName != undefined){
                  this.documentNumberDynamicValidation(this.rdKycModel.kycDocumentTypeName );
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
    this.rdAccountsService.getMemberByAdmissionNumber(admisionNumber).subscribe((response: any) => {
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
    this.rdAccountsService.getGroupByAdmissionNumber(admissionNumber).subscribe((response: any) => {
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
    this.rdAccountsService.getInstitutionDetails(admissionNumber).subscribe((response: any) => {
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

  membershipDataFromModule(){
    if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.individualFlag = true;
    } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
      this.groupFlag = true;
      if(this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList != null && this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList != undefined && this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList.length >0){
        this.promotersList = this.rdAccountsModel.memberShipGroupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name+" "+promoter.surname, value: promoter.id }
        });
      }
    
    } else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.institutionFlag = true;
      if(this.rdAccountsModel.memInstitutionDTO.institutionPromoterList != null && this.rdAccountsModel.memInstitutionDTO.institutionPromoterList != undefined && this.rdAccountsModel.memInstitutionDTO.institutionPromoterList.length >0){
        this.promotersList = this.rdAccountsModel.memInstitutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
          return { label: promoter.name+" "+promoter.surname, value: promoter.id }
        });
      }
     
    }
    
  }

  /**
   * @implements kyc module deuplicate
   * @param kycDocTypeId 

   */
  kycModelDuplicateCheck(rowData: any) {
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.rdKycModel.kycDocumentTypeId != null && data.value == this.rdKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.rdKycModel.kycDocumentTypeName = filteredObj.label;
        this.documentNumberDynamicValidation(this.rdKycModel.kycDocumentTypeName);
      }
    }
    if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0) {
      let duplicate: any
      if (this.rdKycModel.memberTypeName != MemberShipTypesData.INDIVIDUAL) {
        duplicate = this.kycModelList.filter((obj: any) => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId && obj.promoterId === rowData.promoterId);
      }
      else {
        duplicate = this.kycModelList.filter((obj: any) => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId);
      }
      if (this.addDocumentOfKycFalg && duplicate != null && duplicate != undefined && duplicate.length == 1) {
        this.kycForm.reset();
        this.rdKycModel = new RdKycModel();
        if (rowData.id != null && rowData != undefined)
          this.rdKycModel.id = rowData.id;
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
      else if (!this.addDocumentOfKycFalg && duplicate != null && duplicate != undefined && duplicate.length == 1 && duplicate[0].id != rowData.id) {
        this.kycForm.reset();
        this.rdKycModel = new RdKycModel();
        if (rowData.id != null && rowData != undefined)
          this.rdKycModel.id = rowData.id;
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types" }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      }
    }
  }
   /**

   * @implements on click delete
   */
   deletDilogBox(rowData:any){
    this.displayDialog = true;
    if(rowData.id != null && rowData.id != undefined){
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
  submitDelete(){
    if(this.deleteId != null && this.deleteId != undefined){
      this.delete(this.deleteId);
    }
    this.rdKycModel = new RdKycModel();
      this.displayDialog = false;
  }

  /**
   * @implements onFile remove

   */
  fileRemoeEvent(){
    this.isFileUploaded = applicationConstants.FALSE;
    if(this.rdKycModel.filesDTOList != null && this.rdKycModel.filesDTOList != undefined && this.rdKycModel.filesDTOList.length > 0){
     let removeFileIndex = this.rdKycModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.rdKycModel.kycFilePath);
     if(removeFileIndex != null && removeFileIndex != undefined){
       this.rdKycModel.filesDTOList[removeFileIndex] = null;
       this.rdKycModel.kycFilePath = null;
     }
    }
   }

   onClickkycPhotoCopy(rowData :any){
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
    /**
      * @implements document number dynamic Vaildation
      * @author Bhargavi
      */
    documentNumberDynamicValidation(docTypeName: any) {
      if (DOCUMENT_TYPES.AADHAR == this.rdKycModel.kycDocumentTypeName) {
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
      else if (DOCUMENT_TYPES.PANNUMBER == this.rdKycModel.kycDocumentTypeName) {
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
