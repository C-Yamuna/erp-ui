import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { GroupPromotersModel, IndividualMemberDetailsModel, InstitutionPromoterDetailsModel, MemInstitutionModel, MemberShipGroupDetailsModel } from './shared/membership-basic-details.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MembershipBasicDetailsService } from './shared/membership-basic-details.service';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { SaoLoanNomineeDetailsService } from '../../../shared/sao-loans/sao-loan-nominee-details.service';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { SaoCommunication } from '../sao-communication/shared/sao-communication.model';
import { SaoCommunicationService } from '../sao-communication/shared/sao-communication.service';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { SaoKyc } from '../sao-kyc/shared/sao-kyc.model';
import { SaoKycService } from '../sao-kyc/shared/sao-kyc.service';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonStatusData, MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-membership-basic-details',
  templateUrl: './membership-basic-details.component.html',
  styleUrls: ['./membership-basic-details.component.css']
})
export class MembershipBasicDetailsComponent {
 
  kycForm: FormGroup;
  genderList: any[] = [];
  maritalstatusList: any[] = [];
  relationTypesList: any[] = [];
  id: any;
  isEdit: boolean = false;
  imageUrl: string | ArrayBuffer | null = null;
  fileName: any;
  responseModel!: Responsemodel;
  checked: Boolean = false;
  showForm: Boolean = false;
  admissionNumberList: any[] = [];
  orgnizationSetting: any;
  memberTypeId: any;
  individualFlag: boolean = false;
  groupFlag: boolean = false;
  institutionFlag: boolean = false;
  isDisableFlag: boolean = false;
  disableMemberType: boolean = false;
  promoterDetailsForm: any;
  promoterColumns: any[] = [];
  institutionPromoterColumn: any[] = [];
  institutionPromoter: any[] = [];
  maritalStatusList: any[] = [];
  addButton: boolean = false;
  EditDeleteDisable: boolean = false;
  newRow: any;
  promoterDetails: any[] = [];
  msgs: any[] = [];
  sameAsPermanentAddress: boolean = false;
  saoCommunicationModel: SaoCommunication = new SaoCommunication;
  individualMemberDetailsModel: IndividualMemberDetailsModel = new IndividualMemberDetailsModel();
  institutionPromoterDetailsModel: InstitutionPromoterDetailsModel = new InstitutionPromoterDetailsModel();
  groupPromotersModel: GroupPromotersModel = new GroupPromotersModel();
  memberShipGroupDetailsModel: MemberShipGroupDetailsModel = new MemberShipGroupDetailsModel();
  memInstitutionModel: MemInstitutionModel = new MemInstitutionModel();
  saoLoanApplicationModel: SaoLoanApplication = new SaoLoanApplication();
  saoKycModel : SaoKyc = new SaoKyc();
  statesList: any[] = [];
  districtsList: any[] = [];
  mandalsList: any[] = [];
  villageList: any[] = [];
  memberTypeList: any[] = [];
  occupationTypeList: any[] = [];
  qualificationList: any[] = [];
  castesList: any;
  operatorTypeList: any;
  @ViewChild('dt', { static: false }) private dt!: Table;
  @ViewChild('cv', { static: false }) private cv!: Table;
  allTypesOfmembershipList: any;
  pacsId: any;
  branchId: any;
  admissionNumber: any;
  accountList: any[] = [];
  memberTypeName: any;
  //kyc related
  addKycButton: boolean = false;
  addDocumentOfKycFalg: boolean = false;
  editDocumentOfKycFalg: boolean = false;
  buttonDisabled: boolean = false;
  editButtonDisable : boolean = false ;
  admissionNumberDropDownDisable : boolean = false ;
  kycModelList: any[] = [];
  multipleFilesList: any[] = [];
  uploadFileData: any;
  isFileUploaded: boolean = false;
  uploadFlag: boolean = true;
  submitFlag: boolean = false;
  documentNameList: any[] = [];
  veiwCardHide : boolean = false;
  editIndex: any;
  documentsData: any[] = [];
  loanId:any;
  saveButtonDisable: boolean= false;

  constructor(private formBuilder: FormBuilder, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private membershipBasicDetailsService: MembershipBasicDetailsService, private saoLoanApplicationService: SaoLoanApplicationService, private saoLoanNomineeDetailsService: SaoLoanNomineeDetailsService,
    private datePipe: DatePipe, private saoCommunicationService: SaoCommunicationService,private saoKycService : SaoKycService,private fileUploadService : FileUploadService
  ) {
    this.kycForm = this.formBuilder.group({
      // 'promoterName': [{ value: '', disabled: true }],
      'kycDocumentTypeName': new FormControl('', Validators.required),
      'documentNumber':new FormControl('',[Validators.required, Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      
      'nameAsPerDocument':new FormControl('',[Validators.required,Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.maxLength(40), Validators.pattern(/^[^\s]+(\s.*)?$/)]),
      'kycFilePath': new FormControl(''),
     })
  }
  ngOnInit(): void {
    this.pacsId = 1;
    this.branchId = 1;
    this.kycModelList =[] ;
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    if (this.documentsData.length >= 1) {
      this.uploadFlag = true;
    }
    this.getAllKycTypes();
    this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        
          if(params['id'] != undefined){
            this.loanId = Number(this.encryptDecryptService.decrypt(params['id']));
            this.getSaoLoanApplicationById(this.loanId );
          }
        
        this.isEdit = true;
      }
      
      this.membershipBasicDetailsService.currentStep.subscribe((data: any) => {
        this.kycModelList = [];
        if (data != undefined && data != null) {
          // this.buttonDisabled = data.isDisable
          if (data.data != null && data.data != undefined) {

            if (data.data.individualMemberDetailsDTO != undefined && data.data.individualMemberDetailsDTO.memberTypeName != undefined
              && data.data.individualMemberDetailsDTO.memberTypeName === MemberShipTypesData.INDIVIDUAL) {
                this.individualFlag = true;
              this.individualMemberDetailsModel = data.data.individualMemberDetailsDTO;
              this.admissionNumber = this.individualMemberDetailsModel.admissionNumber;
              this.memberTypeName = data.data.individualMemberDetailsDTO.memberTypeName;
              if (data.data.individualMemberDetailsDTO.memberShipKycDetailsDTOList != null) {
                this.kycModelList = data.data.individualMemberDetailsDTO.memberShipKycDetailsDTOList;

                if (this.kycModelList != null && this.kycModelList != undefined) {
                  this.editDocumentOfKycFalg = true;
                  for (let kyc of this.kycModelList) {
                    if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                  }
                }
              }
            }

            if (data.data.memberGroupDetailsDTO != undefined && data.data.memberGroupDetailsDTO.memberTypeName != undefined
              && data.data.memberGroupDetailsDTO.memberTypeName === MemberShipTypesData.GROUP) {
                this.individualFlag = false;
              this.memberShipGroupDetailsModel = data.data.memberGroupDetailsDTO;
              this.admissionNumber = this.memberShipGroupDetailsModel.admissionNumber;
              this.memberTypeName = data.data.memberGroupDetailsDTO.memberTypeName;
              if (data.data.memberGroupDetailsDTO.groupKycList != null) {
                this.kycModelList = data.data.memberGroupDetailsDTO.groupKycList;

                if (this.kycModelList != null && this.kycModelList != undefined) {
                  this.editDocumentOfKycFalg = true;
                  for (let kyc of this.kycModelList) {
                    if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                  }
                }
              }
            }

            if (data.data.memberInstitutionDTO != undefined && data.data.memberInstitutionDTO.memberTypeName != undefined
              && data.data.memberInstitutionDTO.memberTypeName === MemberShipTypesData.INSTITUTION) {
                this.individualFlag = false;
              this.memInstitutionModel = data.data.memberInstitutionDTO;
              this.admissionNumber = this.memInstitutionModel.admissionNumber;
              this.memberTypeName = data.data.memberInstitutionDTO.memberTypeName;
              if (data.data.memberInstitutionDTO.institutionKycDetailsDTOList != null) {
                this.kycModelList = data.data.memberInstitutionDTO.institutionKycDetailsDTOList;

                if (this.kycModelList != null && this.kycModelList != undefined) {
                  this.editDocumentOfKycFalg = true;
                  for (let kyc of this.kycModelList) {
                    if (kyc.kycFilePath != null && kyc.kycFilePath != undefined) {
                      kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                    }
                  }
                }
              }
            }
          }
        }
        this.updateData();
      });

    });
    this.buttonDisabled = false;
    this.kycForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.kycForm.valid) {
        this.save();
      }
    });
    
    // this.updateData();
  }
  memberTypeCheck() {
    this.kycModelList = [];
    if (this.memberTypeName == MemberShipTypesData.INDIVIDUAL) {
      this.getMemberDetailsByAdmissionNumber(this.individualMemberDetailsModel.admissionNumber);
    } else if (this.memberTypeName == MemberShipTypesData.GROUP) {
      this.getGroupDetailsByAdmissionNumber(this.memberShipGroupDetailsModel.admissionNumber);
    } else if (this.memberTypeName == MemberShipTypesData.INSTITUTION) {
      this.getInstitutionByAdmissionNumber(this.memInstitutionModel.admissionNumber);
    }
  }
  //@akhila
  //get memberDetails by loan id
  getSaoLoanApplicationById(id: any) {
    this.saoLoanApplicationService.getSaoLoanApplicationById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.admissionNumberDropDownDisable = true;
              this.saoLoanApplicationModel = this.responseModel.data[0];
              this.admissionNumber = this.saoLoanApplicationModel.admissionNo;
              this.memberTypeName = this.responseModel.data[0].memberTypeName;
              if(this.saoLoanApplicationModel.saoLoanKycDetailsDTOList != null){
                this.kycModelList = this.saoLoanApplicationModel.saoLoanKycDetailsDTOList;
                for(let kyc of this.kycModelList){
                  kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
                }
              }
              this.updateData();
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
  addKyc(event : any){
    this.getAllKycTypes();
    this.multipleFilesList = [];
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = true;
    this.editButtonDisable  = true;
    this.saoKycModel = new SaoKyc;
    this.updateData();
  }
  editsave(row: any) {
    this.saoKycModel.saoLoanApplicationId = this.loanId;
    this.saoKycModel.admissionNumber = this.admissionNumber;
    if(this.documentNameList != null && this.documentNameList != undefined && this.documentNameList.length > 0){
      let filteredObj = this.documentNameList.find((data: any) => null != data && this.saoKycModel.kycDocumentTypeId != null && data.value == this.saoKycModel.kycDocumentTypeId);
      if (filteredObj != null && undefined != filteredObj && filteredObj.label != null && filteredObj.label != undefined){
        this.saoKycModel.kycDocumentTypeName = filteredObj.label;
      }
    }
    this.editDocumentOfKycFalg = true;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
    
    this.saoKycService.updateDocument(this.saoKycModel).subscribe((response: any) => {
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
      this.updateData();
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });

  }
 

  editCancle(){
    this.editDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable  = false;
    if(this.saoKycModel.saoLoanApplicationId != null && this.saoKycModel.saoLoanApplicationId != undefined){
      this.getAllSaoKycsDetailsBySaoLoanApplicationId(this.loanId);
    }else{
      this.memberTypeCheck();
    }
    this.updateData();
  }
  cancel(){
    this.addDocumentOfKycFalg = !this.addDocumentOfKycFalg;
    this.buttonDisabled = false;
    this.editButtonDisable = false;
  }
  
  getAllKycTypes() {
    this.documentNameList = [];
    this.saoKycService.getAllKYCDocTypes().subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if ( this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
            this.documentNameList = this.responseModel.data;
            this.documentNameList = this.responseModel.data.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE).map((state: any) => {
              return { label: state.name, value: state.id };
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
  onClick(){
    this.addDocumentOfKycFalg = true;
  }
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
    this.updateData();
    this.getKycById(modelData.id);
    
  }
  addOrEditKycTempList(rowData : any){
    const kyc = this.kycModelList.find(obj => obj && obj.kycDocumentTypeId === rowData.kycDocumentTypeId );
    this.saoKycModel = kyc;
  }

  //get all sao kyc details by admission number
  // @akhila.M
  getAllSaoKycsDetailsBySaoLoanApplicationId(saoLoanApplicationId: any) {
    //this.kycModelList = [];
    this.saoKycService.getAllSaoKycsDetailsByApplicationId(saoLoanApplicationId).subscribe((response: any) => {
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
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
      setTimeout(() => {
        this.msgs = [];
      }, 3000);
    });
  }
 
  getKycById(id : any){
    this.saoKycService.getKycById(id).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
          this.saoKycModel = this.responseModel.data[0];
          if(this.saoKycModel.kycFilePath != null && this.saoKycModel.kycFilePath != undefined){
            this.saoKycModel.multipartFileList = this.fileUploadService.getFile(this.saoKycModel.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.saoKycModel.kycFilePath);
            this.saveButtonDisable = true;
          }
          else{
            this.saveButtonDisable = false;
          }
        }
      }
    });
  }

  // uploading image
  // akhila.m
  imageUploader(event: any, fileUpload: FileUpload) {
    this.saveButtonDisable = true;
    this.isFileUploaded = applicationConstants.FALSE;
    this.saoKycModel.multipartFileList = [];
    this.saoKycModel.filesDTOList = [];
    this.saoKycModel.kycFilePath = null;
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
          this.saoKycModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        this.saoKycModel.filesDTOList[0].fileName = "SAO_KYC_" + this.loanId + "_" + file.name;
        this.saoKycModel.kycFilePath = "SAO_KYC_" + this.loanId + "_" + file.name; // This will set the last file's name as docPath
        let index1 = event.files.findIndex((x: any) => x === file);
        fileUpload.remove(event, index1);
        fileUpload.clear();
      }
      reader.readAsDataURL(file);
    }
  }
  fileRemoveEvent() {
    this.saveButtonDisable = false;
    this.saoKycModel.multipartFileList = [];
    if (this.saoKycModel.filesDTO != null && this.saoKycModel.filesDTO != undefined) {
      this.saoKycModel.kycFilePath = null;
      this.saoKycModel.filesDTO = null;
    }
  }
  
  //@akhila.M
  // get member details based on admission number from member module
  getMemberDetailsByAdmissionNumber(admisionNumber: any) {
    this.kycModelList = [];
    
    this.membershipBasicDetailsService.getMembershipBasicDetailsByAdmissionNumber(admisionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
          this.individualMemberDetailsModel = this.responseModel.data[0];
          if (this.individualMemberDetailsModel.memberTypeId == null ||  this.individualMemberDetailsModel.memberTypeId == undefined) {
            this.individualMemberDetailsModel.memberTypeId = applicationConstants.INDIVIDUAL_MEMBER_TYPE_ID;
          }
          this.individualMemberDetailsModel.saoLoanCommunicationDetailsDTOList = this.responseModel.data[0].memberShipCommunicationDetailsDTOList;
          this.individualMemberDetailsModel.memberShipKycDetailsDTOList = this.responseModel.data[0].memberShipKycDetailsDTOList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);

          if (this.individualMemberDetailsModel.dob != null && this.individualMemberDetailsModel.dob != undefined) {
            this.individualMemberDetailsModel.dobVal = this.datePipe.transform(this.individualMemberDetailsModel.dob, this.orgnizationSetting.datePipe);
          }
          if (this.individualMemberDetailsModel.admissionDate != null && this.individualMemberDetailsModel.admissionDate != undefined) {
            this.individualMemberDetailsModel.admissionDateVal = this.datePipe.transform(this.individualMemberDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
          }
          // if(this.individualMemberDetailsModel.saoLoanCommunicationDetailsDTOList[0] != null && this.individualMemberDetailsModel.saoLoanCommunicationDetailsDTOList[0] != undefined){
          //   this.saoCommunicationModel = this.individualMemberDetailsModel.saoLoanCommunicationDetailsDTOList[0];
          // }
          if(this.individualMemberDetailsModel.memberShipKycDetailsDTOList != null && this.individualMemberDetailsModel.memberShipKycDetailsDTOList != undefined){
            this.kycModelList = this.individualMemberDetailsModel.memberShipKycDetailsDTOList;
            for(let kyc of this.kycModelList){
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
            }              
             this.saoLoanApplicationModel.saoLoanKycDetailsDTOList = this.individualMemberDetailsModel.memberShipKycDetailsDTOList;
          }
          this.saoLoanApplicationModel.memberTypeName = this.individualMemberDetailsModel.memberTypeName;
          this.saoLoanApplicationModel.individualMemberDetailsDTO  = this.individualMemberDetailsModel;
          this.saoLoanApplicationModel.saoLoanKycDetailsDTOList  = this.kycModelList;
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

  //@akhila.M
  // get member group details based on admission from member module
  getGroupDetailsByAdmissionNumber(admissionNumber: any) {
    this.kycModelList = [];
    // this.individualFlag = false;
    this.membershipBasicDetailsService.getMemberShipGroupDetailsByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memberShipGroupDetailsModel = this.responseModel.data[0];
            this.kycModelList = this.responseModel.data[0].groupKycList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);
            for(let kyc of this.kycModelList){
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              kyc.filesDTOList = [];
              kyc.filesDTOList = kyc.multipartFileList;
            }              
             this.saoLoanApplicationModel.saoLoanKycDetailsDTOList = this.memberShipGroupDetailsModel.groupKycList;

              this.saoLoanApplicationModel.memberGroupDetailsDTO  = this.memberShipGroupDetailsModel;
            
            
            this.memberTypeName = this.responseModel.data[0].memberTypeName;
            if (this.memberShipGroupDetailsModel.registrationDate != null && this.memberShipGroupDetailsModel.registrationDate != undefined) {
              this.memberShipGroupDetailsModel.registrationDateVal = this.datePipe.transform(this.memberShipGroupDetailsModel.registrationDate, this.orgnizationSetting.datePipe);
            }
            if (this.memberShipGroupDetailsModel.admissionDate != null && this.memberShipGroupDetailsModel.admissionDate != undefined) {
              this.memberShipGroupDetailsModel.admissionDateVal = this.datePipe.transform(this.memberShipGroupDetailsModel.admissionDate, this.orgnizationSetting.datePipe);
            }
            if (this.memberShipGroupDetailsModel.memberTypeId == null ||  this.memberShipGroupDetailsModel.memberTypeId == undefined) {
              this.memberShipGroupDetailsModel.memberTypeId = applicationConstants.GROUP_MEMBER_TYPE_ID;
            }
            
            this.saoLoanApplicationModel.memberTypeName = this.memberShipGroupDetailsModel.memberTypeName;
           
            this.saoLoanApplicationModel.saoLoanKycDetailsDTOList  = this.kycModelList;
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
  //@akhila.M
  // get member institution details based on admission number
  getInstitutionByAdmissionNumber(admissionNumber: any) {
    this.kycModelList = [];
    // this.individualFlag = false;
    this.membershipBasicDetailsService.getMemberIstitutionByAdmissionNumber(admissionNumber).subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.memInstitutionModel = this.responseModel.data[0];
            if (this.memInstitutionModel.memberTypeId == null ||  this.memInstitutionModel.memberTypeId == undefined) {
              this.memInstitutionModel.memberTypeId = applicationConstants.INSTITUTION_MEMBER_TYPE_ID;
            }
            this.kycModelList = this.responseModel.data[0].institutionKycDetailsDTOList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE);
            for(let kyc of this.kycModelList){
              kyc.multipartFileList = this.fileUploadService.getFile(kyc.kycFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + kyc.kycFilePath);
              
            }  
            this.memberTypeName = this.memInstitutionModel.memberTypeName;
            this.saoLoanApplicationModel.memberTypeName = this.memInstitutionModel.memberTypeName;
            this.saoLoanApplicationModel.memberInstitutionDTO  = this.memInstitutionModel;
            this.saoLoanApplicationModel.saoLoanKycDetailsDTOList  = this.kycModelList;
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

 
  //@akhila.M
  // update stepper component based on memberTypeId
  updateData() {
    if(this.kycModelList != null && this.kycModelList != undefined && this.kycModelList.length > 0){
      this.isDisableFlag = false;
    }else{
      this.isDisableFlag = true;
    }
    if (this.individualMemberDetailsModel.memberTypeId == 1) {
      this.individualMemberDetailsModel.memberTypeName = this.memberTypeName;
      this.saoLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.saoLoanApplicationModel.individualMemberDetailsDTO = this.individualMemberDetailsModel;
     
    }
    else if (this.individualMemberDetailsModel.memberTypeId == 2) {
      
      this.memberShipGroupDetailsModel.memberTypeId = this.memberTypeId;
      this.memberShipGroupDetailsModel.memberTypeName = this.memberTypeName;
      this.saoLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.saoLoanApplicationModel.memberGroupDetailsDTO = this.memberShipGroupDetailsModel;
    }
    else if (this.individualMemberDetailsModel.memberTypeId == 3) {
      
      this.memInstitutionModel.memberTypeId = this.memberTypeId;
      this.memInstitutionModel.memberTypeName = this.memberTypeName;
      this.saoLoanApplicationModel.memberTypeName = this.memberTypeName;
      this.saoLoanApplicationModel.memberInstitutionDTO = this.memInstitutionModel;
    }
    
    this.saoLoanApplicationService.changeData({
      formValid: !this.kycForm.valid ? true : false ,
      data: this.saoLoanApplicationModel,
      isDisable: this.isDisableFlag,
      stepperIndex: 0,
    });
  }

  //@akhila.M
  //save stepper data
  save() {
    this.updateData();
  }

}
