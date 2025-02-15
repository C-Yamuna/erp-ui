import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { MembershipBasicDetails, MembershipGroupDetails, MemInstitutionDetails } from '../ci-membership-details/shared/membership-details.model';
import { CiLoanApplication } from '../ci-product-details/shared/ci-loan-application.model';
import { CiLoanKyc } from './shared/ci-kyc.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { DatePipe } from '@angular/common';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { CiLoanApplicationService } from '../ci-product-details/shared/ci-loan-application.service';
import { CiKycService } from './shared/ci-kyc.service';
import { MembershipDetailsService } from '../ci-membership-details/shared/membership-details.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { Table } from 'primeng/table';
import { DOCUMENT_TYPES, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-ci-kyc',
  templateUrl: './ci-kyc.component.html',
  styleUrls: ['./ci-kyc.component.css']
})
export class CiKycComponent {
  kycForm: FormGroup;
  kyc: any;
  checked: any;
  ciLoanApplicationId: any;
  accountType: any;
  applicationType: any;
  msgs: any[] = [];
  responseModel!: Responsemodel;
  minBalence: any;
  applicationDateVal: any;

  documentTypeList: any[] = [];

  membershipBasicDetailsModel: MembershipBasicDetails = new MembershipBasicDetails();
  membershipGroupDetailsModel: MembershipGroupDetails = new MembershipGroupDetails();
  membershipInstitutionDetailsModel: MemInstitutionDetails = new MemInstitutionDetails();
  ciLoanApplicationModel: CiLoanApplication = new CiLoanApplication;
  ciLoanKycModel: CiLoanKyc = new CiLoanKyc();


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


  @ViewChild('cv', { static: false })
  private cv!: Table;
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
  requiredDocumentsNamesText: any;
  mandatoryDoxsTextShow: boolean = false;
  saveAndNextEnable : boolean = false;
  kycPhotoCopyZoom: boolean = false;
  isPanNumber: boolean = false;;

  constructor(private router: Router, 
    private formBuilder: FormBuilder, 
    private ciLoanApplicationService: CiLoanApplicationService,
    private ciKycService: CiKycService, 
    private membershipDetailsService: MembershipDetailsService,
    private commonComponent: CommonComponent,
     private activateRoute: ActivatedRoute, 
     private encryptDecryptService: EncryptDecryptService,
     private fileUploadService : FileUploadService,
     private commonFunctionsService: CommonFunctionsService, 
     private datePipe: DatePipe) {
      this.kycForm = this.formBuilder.group({
        'docNumber': ['', [ Validators.compose([Validators.required])]],
        'docTypeName': ['',  Validators.compose([Validators.required])],
        'fileUpload': ['', ],
        'nameAsPerDocument':[Validators.pattern(applicationConstants.ALPHA_NAME_PATTERN),Validators.compose([Validators.required])],
        'promoter': ['', ],
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
          this.ciLoanApplicationId = Number(queryParams);
          this.getCiAccountDetailsById(this.ciLoanApplicationId);
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
      // this.getAllKycsDetailsBySbId(this.ciLoanApplicationId);
      this.getAllKycTypes();
      this.updateData();
    }
    
   /**
    * @implements get all kyc types
    * @author jyothi.naidana
    */
    getAllKycTypes() {
      this.ciKycService.getAllKycTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.documentNameList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
            return { label: count.name, value: count.id , isMandatory:count.isMandatory }
          });
          let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
              if (filteredObj != null && undefined != filteredObj){
                this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
              }
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
  
   
  /**
   * @implements image uploader for Kyc document
   * @param event 
   * @param fileUpload 
   * @author jyothi.naidana
   */
    imageUploader(event: any, fileUpload: FileUpload) {
      this.isFileUploaded = applicationConstants.FALSE;
      this.multipleFilesList = [];
      this.ciLoanKycModel.filesDTOList = [];
      this.ciLoanKycModel.kycFilePath = null;
      this.ciLoanKycModel.multipartFileList = [];
      let files: FileUploadModel = new FileUploadModel();

      let selectedFiles = [...event.files];
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
            this.ciLoanKycModel.multipartFileList.push(files);
            this.ciLoanKycModel.filesDTOList.push(files); // Add to filesDTOList array
          }
          let timeStamp = this.commonComponent.getTimeStamp();
          this.ciLoanKycModel.filesDTOList[0].fileName = "SB_KYC_" + this.ciLoanApplicationId + "_" +timeStamp+ "_"+ file.name ;
          this.ciLoanKycModel.kycFilePath = "SB_KYC_" + this.ciLoanApplicationId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
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
    /**
     * @implements update data to parent compenent
     * @author jyothi.naidana
     */
    updateData() {
      this.ciLoanKycModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciLoanKycModel.admissionNumber = this.admissionNumber;
      this.ciLoanKycModel.memberTypeName  = this.memberTypeName;
      this.ciLoanKycModel.memberType  = this.memberTypeId;
      this.ciLoanKycModel.memberId  = this.memberId;
      //for manadatory KYC Documents check
      this.saveAndNextEnable = false;
      if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
        let documentNameList = this.documentNameList.filter((obj: any) => obj.isMandatory);
        if (this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0 && documentNameList != null && documentNameList != undefined && documentNameList.length > 0) {
          if (this.ciLoanKycModel.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
            const missingItems = this.kycModelList.filter(document => !documentNameList.some(mandatoryDocument => document.kycDocumentTypeId === mandatoryDocument.value));
            if ((documentNameList.length != this.kycModelList.length - missingItems.length) || this.buttonDisabled) {
              this.saveAndNextEnable = true;
            }
          }
          else {//group institution promoter kyc mandatory uploads check
            let i = 0 ;
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
      this.ciLoanApplicationService.changeData({
        formValid: !this.kycForm.valid ? true : false,
        data: this.ciLoanKycModel,
        // isDisable: this.documentsData.length <= 0 ? true : false || this.uploadFlag,
        isDisable: this.saveAndNextEnable,
        stepperIndex: 1,
      });
    }
  
    /**
     * @implements delete kyc
     * @param rowDataId 
     * @author jyothi.naidana
     */
    delete(rowDataId: any) {
      this.ciKycService.deleteCiLoanKycDetails(rowDataId).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.kycModelList = this.responseModel.data;
            this.getAllKycsDetailsCiKycDetails(this.ciLoanApplicationId);
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
  
   /**
    * @implements get all kyc by sb id
    * @param id 
    * @author jyothi.naidana
    */
    getAllKycsDetailsCiKycDetails(id: any) {
      this.ciKycService.getKycDetailsByCiLoanApplicationId(id).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 ) {
              this.kycModelList = this.responseModel.data;
              if (this.kycModelList != null && this.kycModelList != undefined) {
                this.editDocumentOfKycFalg = true;
                for (let kyc of this.kycModelList) {
                  if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                    if(kyc.kycFilePath != null && kyc.kycFilePath != undefined){
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOAN_PURPOSES + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
  
                    }
                  }  
                }
                this.buttonDisabled = false;
              }
              this.updateData();
            }
            else{
              this.addDocumentOfKycFalg = true;
              this.buttonDisabled = true;
              this.updateData();
            }
          }
        }
        // this.getSbAccountDetailsById(ciLoanApplicationId);
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
     * @author jyothi.naidana
     */
    saveKyc(row: any) {
      this.ciLoanKycModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciLoanKycModel.admissionNumber = this.admissionNumber;
      this.ciLoanKycModel.memberTypeName  = this.memberTypeName;
      this.ciLoanKycModel.memberType  = this.memberTypeId;
      this.ciLoanKycModel.memberId  = this.memberId;
      if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
          this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
      }
      this.ciLoanKycModel.status  = applicationConstants.ACTIVE;
      this.ciKycService.addCiLoanKycDetails(this.ciLoanKycModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          this.ciLoanKycModel = this.responseModel.data[0];
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
        this.getAllKycsDetailsCiKycDetails(this.ciLoanApplicationId);
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
     * @author jyothi.naidana
     */
    cancelKyc() {
      this.ciLoanKycModel = new CiLoanKyc();
      this.kycModelList = [];
      this.addKycButton = false;
      this.editButtonDisable = false;
      this.getAllKycsDetailsCiKycDetails(this.ciLoanApplicationId);
    }
    /**
     * @implements get sb account details by sb id
     * @param id 
     * @author jyothi.naidana
     */
    getCiAccountDetailsById(id: any) {
      this.ciLoanApplicationService.getLoanApplicationDetailsByLoanApplicationId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.ciLoanApplicationModel = this.responseModel.data[0]
              if (this.ciLoanApplicationModel.applicationDate != null && this.ciLoanApplicationModel.applicationDate != undefined) {
                this.applicationDateVal = this.datePipe.transform(this.ciLoanApplicationModel.applicationDate, this.orgnizationSetting.datePipe);
              }
              if (this.ciLoanApplicationModel.ciProductName != null && this.ciLoanApplicationModel.ciProductName != undefined) {
                this.productName = this.ciLoanApplicationModel.ciProductName;
              }
              if (this.ciLoanApplicationModel.operationTypeName != null && this.ciLoanApplicationModel.operationTypeName != undefined) {
                this.accountType = this.ciLoanApplicationModel.operationTypeName;
              }
              if(this.ciLoanApplicationModel.admissionNo != null && this.ciLoanApplicationModel.admissionNo != undefined){
                this.admissionNumber = this.ciLoanApplicationModel.admissionNo;
              }
              if(this.ciLoanApplicationModel.memberTypeName != null && this.ciLoanApplicationModel.memberTypeName != undefined){
                this.memberTypeName = this.ciLoanApplicationModel.memberTypeName;
                this.membershipDataFromSbModule();
                /**
                 * get required member details for kyc
                 */
                // this.membershipDataFromSbModule();
              }
              //required documents
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
              if(this.responseModel.data[0].memberTypeId != null && this.responseModel.data[0].memberTypeId != undefined)
                this.memberTypeId = this.responseModel.data[0].memberTypeId;
              this.getAllKycsDetailsCiKycDetails(this.ciLoanApplicationId);
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
    * @author jyothi.naidana
    */
    addKyc(event: any) {
      this.isFileUploaded = applicationConstants.FALSE;
      this.getAllKycTypes();
      this.multipleFilesList = [];
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = true;
      this.editButtonDisable = true;
      this.ciLoanKycModel = new CiLoanKyc;
      this.updateData();
    }
  
    /**
     * @implements cancle kyc
     * @author jyothi.naidana
     */
    cancel() {
      this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.getAllKycsDetailsCiKycDetails(this.ciLoanApplicationId);
      this.updateData();
    }
    
    onClick() {
      this.addDocumentOfKycFalg = true;
    }
   /**
    * @implements edit card data
    * @param index 
    * @param modelData 
    * @author jyothi.naidana
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
     * @author jyothi.naidana
     */
    editCancle() {
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
        this.getAllKycsDetailsCiKycDetails(this.ciLoanApplicationId);
      
      this.updateData();
    }
  
     /**
      * @implements edit save
      * @param row 
      * @author jyothi.naidana
      */
    editsave(row: any) {
      this.ciLoanKycModel.ciLoanApplicationId = this.ciLoanApplicationId;
      this.ciLoanKycModel.admissionNumber = this.admissionNumber;
      this.ciLoanKycModel.memberTypeName  = this.memberTypeName;
      this.ciLoanKycModel.memberType  = this.memberTypeId;
      this.ciLoanKycModel.memberId  = this.memberId;
      
      if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
        let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
        if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
          this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
        }
      }
      this.editDocumentOfKycFalg = true;
      this.buttonDisabled = false;
      this.editButtonDisable = false;
      this.ciKycService.updateCiLoanKycDetails(this.ciLoanKycModel).subscribe((response: any) => {
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
        this.getAllKycsDetailsCiKycDetails(this.ciLoanApplicationId);
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
    * @author jyothi.naidana
    */
    getKycById(id: any) {
      this.ciKycService.getCiLoanKycDetailsById(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
                this.ciLoanKycModel = this.responseModel.data[0];
                if (this.ciLoanKycModel.kycFilePath != undefined) {
                  if(this.ciLoanKycModel.kycFilePath != null && this.ciLoanKycModel.kycFilePath != undefined){
                    this.ciLoanKycModel.multipartFileList = this.fileUploadService.getFile(this.ciLoanKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.ciLoanKycModel.kycFilePath);
                    this.isFileUploaded = applicationConstants.TRUE;
                  }
                }
                if(this.ciLoanKycModel.kycDocumentTypeName != null && this.ciLoanKycModel.kycDocumentTypeName != undefined){
                  this.documentNumberDynamicValidation(this.ciLoanKycModel.kycDocumentTypeName );
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
     * @author jyothi.naidana
     */
    getMemberDetailsByAdmissionNumber(admisionNumber: any) {
      this.ciLoanApplicationService.getMemberShipBasicDetailsFromLoansModule(admisionNumber).subscribe((response: any) => {
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
              this.memberId = this.membershipBasicDetailsModel.id;
              
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
     * @author jyothi.naidana
     */
    getGroupByAdmissionNumber(admissionNumber: any) {
      this.ciLoanApplicationService.getMemberShipGroupDetailsFromLoansModule(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipGroupDetailsModel = this.responseModel.data[0];
              if (this.membershipGroupDetailsModel.registrationDate != null && this.membershipGroupDetailsModel.registrationDate != undefined) {
                this.membershipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.registrationDateVal, this.orgnizationSetting.datePipe);
              }
              if (this.membershipGroupDetailsModel.admissionDate != null && this.membershipGroupDetailsModel.admissionDate != undefined) {
                this.membershipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.membershipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
              }
                this.memberId = this.membershipGroupDetailsModel.id;
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
     * @author jyothi.naidana
     */
    getInstitutionByAdmissionNumber(admissionNumber: any) {
      this.ciLoanApplicationService.getMemberShipInstitutionDetailsFromLoansModule(admissionNumber).subscribe((response: any) => {
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
  
    /**
     * @implements membership data from sb module
     * @author jyothi.naidana
     */
    membershipDataFromSbModule(){
      if (this.memberTypeName == "Individual") {
        this.individualFlag = true;
      } else if (this.memberTypeName == "Group") {
        this.groupFlag = true;
        if(this.ciLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList != null && this.ciLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList != undefined && this.ciLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList.length >0){
          this.promotersList = this.ciLoanApplicationModel.memberGroupDetailsDTO.groupPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
            return { label: promoter.name+" "+promoter.surname +"-"+promoter.aadharNumber, value: promoter.id }
          });
        }
      } else if (this.memberTypeName == "Institution") {
        this.institutionFlag = true;
        if(this.ciLoanApplicationModel.memberInstitutionDTO.institutionPromoterList != null && this.ciLoanApplicationModel.memberInstitutionDTO.institutionPromoterList != undefined && this.ciLoanApplicationModel.memberInstitutionDTO.institutionPromoterList.length >0){
          this.promotersList = this.ciLoanApplicationModel.memberInstitutionDTO.institutionPromoterList.filter((promoter: any) => promoter.status == applicationConstants.ACTIVE).map((promoter: any) => {
            return { label: promoter.name+" "+promoter.surname+"-"+promoter.aadharNumber, value: promoter.id }
          });
        }
      }
      
    }
  
  /**
   * @implements kyc module deuplicate
   * @param kycDocTypeId 
   * @author jyothi.naidana
   */
  kycModelDuplicateCheck(ciLoanKycModel: any) {
    if (this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0) {
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.ciLoanKycModel.kycDocumentTypeId != null && data.value == this.ciLoanKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined) {
        this.ciLoanKycModel.kycDocumentTypeName = filteredObj.label;
        this.documentNumberDynamicValidation(this.ciLoanKycModel.kycDocumentTypeName );
      }
      
    }
    
    //   if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
    //     let duplicate
    //     if(this.ciLoanApplicationModel.memberTypeName != MemberShipTypesData.INDIVIDUAL){
    //       duplicate = this.kycModelList.find((obj:any) => obj && obj.kycDocumentTypeId === ciLoanKycModel.kycDocTypeId && obj.promoterId ===  ciLoanKycModel.promoterId);
    //     }
    //     else {
    //       duplicate = this.kycModelList.find((obj:any) => obj && obj.kycDocumentTypeId === ciLoanKycModel.kycDocTypeId );
    //     }

    //   if (duplicate != null && duplicate != undefined) {
    //     this.kycForm.reset();
    //     this.msgs = [];
    //     this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: "duplicate Kyc Types"}];
    //     setTimeout(() => {
    //       this.msgs = [];
    //     }, 3000);
    //   } 
    // }
  }
  
     /**
     * @author jyothi.naidana
     * @implements on click delete
     */
     deletDilogBox(rowData:any){
      this.displayDialog = true;
      if(rowData.id != null && rowData.id != undefined){
        this.deleteId = rowData.id;
      }
     
    }

  /**
   * @implements document number dynamic Vaildation
   * @author jyothi.naidana
   */
  documentNumberDynamicValidation(docTypeName: any) {
    if (DOCUMENT_TYPES.AADHAR == this.ciLoanKycModel.kycDocumentTypeName) {
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
    else if (DOCUMENT_TYPES.PANNUMBER == this.ciLoanKycModel.kycDocumentTypeName) {
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
      this.isPanNumber = false;
    }
  }
  
    /**
     * @author jyothi.naidana
     * @implements cancle delete dialog box
     */
    cancelForDialogBox() {
      this.displayDialog = false;
    }
  
    /**
     * @author jyothi.naidana
     * @implements submit delete diloge 
     */
    submitDelete(){
      if(this.deleteId != null && this.deleteId != undefined){
        this.delete(this.deleteId);
      }
      this.ciLoanKycModel = new CiLoanKyc();
        this.displayDialog = false;
    }
  
    /**
     * @implements onFile remove
     * @author jyothi.naidana
     */
    fileRemoeEvent(){
      this.isFileUploaded = applicationConstants.FALSE; // upload validation
      if(this.ciLoanKycModel.filesDTOList != null && this.ciLoanKycModel.filesDTOList != undefined && this.ciLoanKycModel.filesDTOList.length > 0){
       let removeFileIndex = this.ciLoanKycModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.ciLoanKycModel.kycFilePath);
       if(removeFileIndex != null && removeFileIndex != undefined){
         this.ciLoanKycModel.filesDTOList[removeFileIndex] = null;
         this.ciLoanKycModel.kycFilePath = null;
       }
      }
     }
     onClickkycPhotoCopy(){
      this.kycPhotoCopyZoom = true;
    }
    kycclosePhoto(){
      this.kycPhotoCopyZoom = false;
    }
    kycclosePhotoCopy() {
      this.kycPhotoCopyZoom = false;
    }
   
}
