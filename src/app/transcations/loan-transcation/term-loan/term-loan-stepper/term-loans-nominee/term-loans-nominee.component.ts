import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api/public_api';
import { MemberGroupDetailsModel, MembershipBasicRequiredDetails, MembershipInstitutionDetailsModel } from '../term-loan-new-membership/shared/term-loan-new-membership.model';
import { TermApplication } from '../term-loan-application-details/shared/term-application.model';
import { TermLoanGuardianDetails, TermLoanNominee } from './shared/term-loan-nominee.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { DatePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TermLoanNomineeService } from './shared/term-loan-nominee.service';
import { TermApplicationService } from '../term-loan-application-details/shared/term-application.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { MemberShipTypesData } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-term-loans-nominee',
  templateUrl: './term-loans-nominee.component.html',
  styleUrls: ['./term-loans-nominee.component.css']
})
export class TermLoansNomineeComponent {
  nomineeForm: FormGroup;
  guarantorDetailsForm: any;
  nominee: any;
  nomineeList: any[] = [];
  checked: any;
  newNominee: boolean = false;
  sameAsMembershipNominee: boolean = false;
  noNominee: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];

  termLoanNomineeModel: TermLoanNominee = new TermLoanNominee();
  termLoanGuardianDetailsModel:TermLoanGuardianDetails = new TermLoanGuardianDetails();
  termLoanApplicationModel: TermApplication = new TermApplication();
  membershipBasicRequiredDetailsModel: MembershipBasicRequiredDetails = new MembershipBasicRequiredDetails();
  memberGroupDetailsModel: MemberGroupDetailsModel = new MemberGroupDetailsModel();
  membershipInstitutionDetailsModel: MembershipInstitutionDetailsModel = new MembershipInstitutionDetailsModel();
  fileName: any;
  termLoanApplicationId: any;
  isEdit: boolean = false;
  age: any;
  guarntorDetailsFalg: boolean = false;
  relationTypesList: any[] = [];

  flagForNomineeTypeValue: any;
  accountOpeningDateVal: any;
  applicationType: any;
  accountType: any;
  minBalence: any;
  orgnizationSetting: any;

  accountNumber: any;
  productName: any;
  statesList: any;
  districtsList: any;
  mandalsList: any;
  villageList: any;
  guadianTypesList: any[] = [];
  guardain :any;
  showForm: any;
  memberTypeName: any;
  institutionPromoter: any;
  promoterDetails: any;
  admissionNumber: any;

  nomineeEdit : Boolean = false;
  nomineeHistoryList : any[] = [];
  nomineeFields: any[] = [];

  courtAppointedGuardain :any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  sameAsMemberGuardain: boolean = false;
  noGuardain: boolean = true;
  nomineeTypeDisable: boolean = false;
  guardainTypeDisable: boolean = false;
  historyFLag: boolean = false;
  flag: boolean = false;
  relationshipTypeName: any;
  relationshipTypeId: any;
  guardianName: any;
  guardianAadharNumber: any;
  guardianMobileNumber: any;
  guardianEmailId: any;
  memberFilePath: any;
  depositDate: any;

  isFileUploadedNominee: boolean = false;
  isFileUploadedGuardian: boolean = false;
  isSaveAndNextEnable : boolean = false;
  constructor(private formBuilder: FormBuilder,
    private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService,
    private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe,
    private termLoanApplicationsService: TermApplicationService,
    private termLoanNomineeService: TermLoanNomineeService, private fileUploadService: FileUploadService) {

      this.nomineeForm = this.formBuilder.group({
        relationName:['', ],
        nomineeName: ['', ],
        aadhaar: ['', ],
        mobileNumber:['', ],
        email: ['', ],
        dateOfBirth: new FormControl('', ),
        remarks: new FormControl('', ),
        nomineeType: ['', Validators.required],
  
        //guardian form fields
        relationNameOfGuardian: ['', ],
        guardianName: ['', ],
        guardianAge: ['', ],
        guardianAadhar: ['', ],
        guardianMobile: ['', ],
        guardianEmail: ['', ],
        guardianAddress: ['', ],
        guardainType: [''],
        fileUpload : ['', ],
        guardianRemarks: new FormControl('', ),
  
      });
      this.nomineeFields = [
        { field: 'name', header: 'Name' },
        { field: 'accountNumber', header: 'Account Number' },
        { field: 'aadharNumber', header: 'Aadhar Number' },
        { field: 'mobileNumber', header: 'Mobile Number' },
        { field: 'nomineeEmail',header:'Email'},
        { field: 'statusName', header: 'Status' },
      ]
  
    }
  
    ngOnInit(): void {
      this.orgnizationSetting = this.commonComponent.orgnizationSettings();
      this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
      if(this.showForm){
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'No Nominee', value: 3 },
        ]
      }
      else{
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'Same As Membership Nominee', value: 2 },
          { label: 'No Nominee', value: 3 },
        ]
      }
     if(this.showForm){
      this.guadianTypesList = [
        { label: 'New Guardain', value: 1 },
        { label: 'No Guardain', value: 3 },
      ]
     }else{
      this.guadianTypesList= [
        { label: 'New Guardain', value: 1 },
        { label: 'Same as Member Guardain', value: 2 },
        { label: 'No Guardain', value: 3 },
      ];
     }
      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined || params['preview'] != undefined) {
          if(params['preview'] != undefined && params['preview'] != null){
            let edit = this.encryptDecryptService.decrypt(params['preview']);
            this.historyFLag = true;
          }
          if(params['id'] != undefined && params['id'] != null){
            let queryParams = this.encryptDecryptService.decrypt(params['id']);
            this.termLoanApplicationId = Number(queryParams);
            this.getTermApplicationByTermAccId(this.termLoanApplicationId);
            this.isEdit = true;
          }
        } else {
          this.isEdit = false;
        }
      });
      this.nomineeForm.valueChanges.subscribe((data: any) => {
        this.updateData();
        if (this.nomineeForm.valid) {
          this.save();
        }
      });
      this.getAllRelationTypes();
    }
    //update model data to stepper component
    updateData() {
      if(this.relationTypesList != null && this.relationTypesList != undefined && this.relationTypesList.length > 0){
        let nominee = this.relationTypesList.find((data: any) => null != data && this.termLoanNomineeModel.relationTypeId != null && data.value == this.termLoanNomineeModel.relationTypeId);
        if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined) {
          this.termLoanNomineeModel.relationTypeName = nominee.label;
        }
       
      }
      if (this.age <= 18) {
        this.termLoanGuardianDetailsModel.termLoanApplicationId = this.termLoanApplicationId ;
        this.termLoanGuardianDetailsModel.accountNumber = this.accountNumber;
        let guardain = this.relationTypesList.find((data: any) => null != data && this.termLoanGuardianDetailsModel.relationshipTypeId != null && data.value == this.termLoanGuardianDetailsModel.relationshipTypeId);
        if (guardain != null && undefined != guardain  && guardain.label != undefined) {
          this.termLoanGuardianDetailsModel.relationshipTypeName = guardain.label;
        }
        this.termLoanNomineeModel.termMemberGuardianDetailsDTO = this.termLoanGuardianDetailsModel;
        this.isSaveAndNextEnable = (!this.nomineeForm.valid) || !(this.isFileUploadedNominee && this.isFileUploadedGuardian)
      }
      else {
        this.isSaveAndNextEnable = (!this.nomineeForm.valid) || (!this.isFileUploadedNominee);
      }
      this.termLoanNomineeModel.termLoanApplicationId = this.termLoanApplicationId;
      this.termLoanApplicationsService.changeData({
        formValid: !this.nomineeForm.valid ? true : false,
        data: this.termLoanNomineeModel,
        isDisable: this.isSaveAndNextEnable,
        // isDisable:false,
        stepperIndex: 5,
      });
    }
    save() {
      this.updateData();
    }
    //on change nominee type need to update validation
    onChange(event: any ,flag :boolean) {
      if (event == 1) {//new nominee
        this.newNomineeType(flag);
      }
      else if (event == 2) {//same as membership nominee
        this.samAsMemberNomineeType(flag);
      }
      else if (event == 3) {//no nominee
        this.noNomineeType(flag);
      } 
    }
  
    /**
     * @implements onChange Guardain Type 
     * @param event guardain Type
     */
    onChangeGuardain(event: any , flag :boolean) {
      if (event == 1) {//new guardain
        this.newGuardainType(flag);
      }
     else if (event == 2) {//same as member guardain
        this.sameAsMemberGuardianType(flag);
      }
      else if (event == 3) {//no guardain
        this.noGuardainaType(flag);
      }
    }
  
    getTermApplicationByTermAccId(id: any) {
      this.termLoanApplicationsService.getTermApplicationByTermAccId(id).subscribe((data: any) => {
        this.responseModel = data;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0) {
              this.termLoanApplicationModel = this.responseModel.data[0];
              if (this.responseModel.data[0].depositDate != null && this.responseModel.data[0].depositDate != undefined) {
                this.depositDate = this.datePipe.transform(this.responseModel.data[0].depositDate, this.orgnizationSetting.datePipe);
              }
              if (this.responseModel.data[0].memberTypeName != null && this.responseModel.data[0].memberTypeName != undefined) {
                this.memberTypeName = this.responseModel.data[0].memberTypeName;
                this.memberTypeCheck(this.memberTypeName);
              }
              if (this.responseModel.data[0].admissionNo != null && this.responseModel.data[0].admissionNo != undefined) {
                this.admissionNumber = this.responseModel.data[0].admissionNo;
              }
              if (this.responseModel.data[0].accountNumber != null && this.responseModel.data[0].accountNumber != undefined) {
                this.accountNumber = this.responseModel.data[0].accountNumber;
                if (this.historyFLag) {
                  // this.getNomineeHistoryByRdAccountNumber(this.accountNumber);
                }
              }
              if (this.termLoanApplicationModel != null && this.termLoanApplicationModel != undefined) {
                if (this.termLoanApplicationModel.termLoanNomineeDetailsDTO != null && this.termLoanApplicationModel.termLoanNomineeDetailsDTO != undefined) {
                  this.termLoanNomineeModel = this.termLoanApplicationModel.termLoanNomineeDetailsDTO;
                  if (this.termLoanNomineeModel.nomineeFilePath != null && this.termLoanNomineeModel.nomineeFilePath != undefined) {
                    this.termLoanNomineeModel.multipartFileList = this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
                    if (this.termLoanNomineeModel.nomineeType != null && this.termLoanNomineeModel.nomineeType != undefined) {
                      if (this.termLoanNomineeModel.nomineeType != 2) {
                        this.termLoanNomineeModel.multipartFileList = this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
                      }
                      else {
                        this.termLoanNomineeModel.multipartFileList = this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
                      }
                      this.isFileUploadedNominee = applicationConstants.TRUE;
                    }
                  }
  
                }
                else {
                  this.isFileUploadedNominee = applicationConstants.FALSE;
                }
                if (this.termLoanApplicationModel.termMemberGuardianDetailsDTO != null && this.termLoanApplicationModel.termMemberGuardianDetailsDTO != undefined){
                  this.termLoanGuardianDetailsModel = this.termLoanApplicationModel.termMemberGuardianDetailsDTO;
  
                if (this.termLoanGuardianDetailsModel.uploadFilePath != null && this.termLoanGuardianDetailsModel.uploadFilePath != undefined) {
                  if(this.termLoanGuardianDetailsModel.guardianType != null && this.termLoanGuardianDetailsModel.guardianType != undefined){
                    if(this.termLoanGuardianDetailsModel.guardianType != 2){
                      this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles =  this.fileUploadService.getFile(this.termLoanGuardianDetailsModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanGuardianDetailsModel.uploadFilePath);
                    }
                    else {
                      this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles =  this.fileUploadService.getFile(this.termLoanGuardianDetailsModel.uploadFilePath , ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanGuardianDetailsModel.uploadFilePath);
                    }
                    this.isFileUploadedGuardian = applicationConstants.TRUE;
                  }
                  
                }
                else{
                  this.isFileUploadedGuardian = applicationConstants.FALSE;
                }
              }
                if (this.termLoanNomineeModel.nomineeType != null && this.termLoanNomineeModel.nomineeType != undefined) {
                  this.onChange(this.termLoanNomineeModel.nomineeType, this.flag);
                }
  
              if (this.responseModel.data[0].individualMemberDetailsDTO.age != null && this.responseModel.data[0].individualMemberDetailsDTO.age != undefined) {
                this.age = this.responseModel.data[0].individualMemberDetailsDTO.age;
                if (this.age < 18) {
                  this.guarntorDetailsFalg = true;
                }
              }
              if (this.guarntorDetailsFalg && this.termLoanGuardianDetailsModel.guardianType != null && this.termLoanGuardianDetailsModel.guardianType != undefined) {
                this.onChangeGuardain(this.termLoanGuardianDetailsModel.guardianType, this.flag);
              }
              }
              else if (this.guarntorDetailsFalg) {
                const controlName = this.nomineeForm.get('guardainType');
                if (controlName) {
                  controlName.setValidators([
                    Validators.required,
                  ]);
                  controlName.updateValueAndValidity();
                }
              }
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
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
     * @implements member Type Check
     * @param memberType 
     * @param data 
     */
    memberTypeCheck(memberType: any) {
      if (memberType != MemberShipTypesData.INDIVIDUAL) {
        this.termLoanApplicationModel.operationTypeName = applicationConstants.SINGLE_ACCOUNT_TYPE;
        this.nomineeList = [
          { label: 'New Nominee', value: 1 },
          { label: 'No Nominee', value: 3 },
        ]
        this.guadianTypesList = [
          { label: 'New Guardain', value: 1 },
          { label: 'No Guardain', value: 3 },
        ]
      }
    }
    //get all relation types list
    getAllRelationTypes() {
      this.termLoanApplicationsService.getAllRelationTypes().subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.relationTypesList = this.responseModel.data
              this.relationTypesList = this.responseModel.data.filter((nominee: any) => nominee.status == applicationConstants.ACTIVE).map((count: any) => {
                return { label: count.name, value: count.id }
              });
            let  nominee= this.relationTypesList.find((data: any) => null != data && this.termLoanNomineeModel.relationTypeId  != null && data.value == this.termLoanNomineeModel.relationTypeId);
            if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined){
                  this.termLoanNomineeModel.relationTypeName = nominee.label;
              }
              let  guardain= this.relationTypesList.find((data: any) => null != data && this.termLoanGuardianDetailsModel.relationshipTypeId  != null && data.value == this.termLoanGuardianDetailsModel.relationshipTypeId);
              if (guardain != null && undefined != guardain && nominee.label != null && guardain.label != undefined){
                  this.termLoanGuardianDetailsModel.relationshipTypeName = guardain.label;
              }
            }
          }
        }
      });
    }
  
    //get guardian details by account Number
    getGuardianDetails(accountNumber: any) {
      this.termLoanNomineeService.getguardianDetailsByTermAccId(accountNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.termLoanGuardianDetailsModel = this.responseModel.data[0];
              if (this.termLoanGuardianDetailsModel.guardianDob != null && this.termLoanGuardianDetailsModel.guardianDob != undefined) {
                this.termLoanGuardianDetailsModel.guardianDob = this.datePipe.transform(this.termLoanGuardianDetailsModel.guardianDob, this.orgnizationSetting.datePipe);
              }
              if(this.termLoanGuardianDetailsModel.guardianType != null && this.termLoanGuardianDetailsModel.guardianType != undefined){
                this.onChangeGuardain(this.termLoanGuardianDetailsModel.guardianType , this.flag);
              }
              this.updateData();
            }
          }
          else {
            this.msgs = [];
            this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        }
      });
    }
  
    /**
     * @implements getNominee from member module
     * @param admissionNumber 
     */
    getMemberNomineDetailsByAdmissionNumber(admissionNumber : any){
      this.termLoanNomineeService.getNomineeFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.membershipBasicRequiredDetailsModel = this.responseModel.data[0];
              if (this.responseModel.data[0].memberShipNomineeDetailsDTOList != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList != undefined &&
                this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0] != undefined) {
              }
              if(this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId != undefined){
                this.termLoanNomineeModel.relationTypeId = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationTypeId;
                // this.getAllRelationTypes();
              }
              if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationshipTypeName != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationshipTypeName != undefined) {
                this.termLoanNomineeModel.relationTypeName = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].relationshipTypeName;
              }
              if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName != undefined) {
                this.termLoanNomineeModel.nomineeName = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeName;
              }
              if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber != undefined) {
                this.termLoanNomineeModel.nomineeAadharNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeAadharNumber;
              }
              if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber != undefined) {
                this.termLoanNomineeModel.nomineeMobileNumber = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeMobileNumber;
              }
              if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId != undefined) {
                this.termLoanNomineeModel.nomineeEmailId = this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeEmailId;
              }
              if (this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != null && this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath != undefined) {
                this.termLoanNomineeModel.multipartFileList = this.fileUploadService.getFile(this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath , 
                  ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].memberShipNomineeDetailsDTOList[0].nomineeFilePath );
                  this.isFileUploadedNominee = applicationConstants.TRUE;
                  
                }
              this.termLoanNomineeModel.nomineeType = 2;
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
     * @implements get guardain from member module
     * @param admissionNumber
     */
    getGaurdainFromMemberModule(admissionNumber : any){
      this.termLoanNomineeService.getGardianFromMemberModuleByAdmissionNumber(admissionNumber).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data[0].relationshipTypeId != null && this.responseModel.data[0].relationshipTypeId != undefined) {
              this.termLoanGuardianDetailsModel.relationshipTypeId = this.responseModel.data[0].relationshipTypeId;
            }
            if (this.responseModel.data[0].relationshipTypeName != null && this.responseModel.data[0].relationshipTypeName != undefined) {
              this.termLoanGuardianDetailsModel.relationshipTypeName = this.responseModel.data[0].relationshipTypeName;
              
            }
            if (this.responseModel.data[0].guardianName != null && this.responseModel.data[0].guardianName != undefined) {
              this.termLoanGuardianDetailsModel.guardianName = this.responseModel.data[0].guardianName;
              
            }
            if (this.responseModel.data[0].guardianAadharNumber != null && this.responseModel.data[0].guardianAadharNumber != undefined) {
              this.termLoanGuardianDetailsModel.guardianAadharNumber = this.responseModel.data[0].guardianAadharNumber;
            }
            if (this.responseModel.data[0].guardianMobileNumber != null && this.responseModel.data[0].guardianMobileNumber != undefined) {
              this.termLoanGuardianDetailsModel.guardianMobileNumber = this.responseModel.data[0].guardianMobileNumber;
            }
            if (this.responseModel.data[0].guardianEmailId != null && this.responseModel.data[0].guardianEmailId != undefined) {
              this.termLoanGuardianDetailsModel.guardianEmailId = this.responseModel.data[0].guardianEmailId;
            }
            if (this.responseModel.data[0].uploadFilePath != null && this.responseModel.data[0].uploadFilePath != undefined) {
              this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles = this.fileUploadService.getFile(this.responseModel.data[0].uploadFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.responseModel.data[0].uploadFilePath);
              this.isFileUploadedGuardian = applicationConstants.TRUE;
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
     * @implements fileUpload service
     * @param event 
     * @param fileUpload 
     * @param filePathName 
     */
    fileUploader(event: any, fileUpload: FileUpload , filePathName:any) {
      this.multipleFilesList = [];
      if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined && this.isEdit && this.termLoanNomineeModel.filesDTOList == null || this.termLoanNomineeModel.filesDTOList == undefined){
          this.termLoanNomineeModel.filesDTOList = [];
      }
      if(this.isEdit && this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined && this.termLoanGuardianDetailsModel.filesDTO == null || this.termLoanGuardianDetailsModel.filesDTO == undefined){
        this.termLoanGuardianDetailsModel.filesDTO = [];
      }
      if (filePathName === "Nominee") {
        this.termLoanNomineeModel.multipartFileList = [];
        this.isFileUploadedNominee = applicationConstants.FALSE;
      }
      if (filePathName === "Guardain") {
        this.isFileUploadedGuardian = applicationConstants.FALSE;
        this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles = [];
      }
  
      let selectedFiles = [...event.files];
      // Clear file input before processing files
      fileUpload.clear();
  
      let files: FileUploadModel = new FileUploadModel();
      for (let file of selectedFiles) {
        let reader = new FileReader();
        reader.onloadend = (e) => {
          let files = new FileUploadModel();
          this.uploadFileData = e.currentTarget;
          files.fileName = file.name;
          files.fileType = file.type.split('/')[1];
          files.value = this.uploadFileData.result.split(',')[1];
          files.imageValue = this.uploadFileData.result;
          
            this.multipleFilesList.push(files);
            // Add to filesDTOList array
          let timeStamp = this.commonComponent.getTimeStamp();
          if (filePathName === "Nominee") {
            this.isFileUploadedNominee = applicationConstants.TRUE;
            this.termLoanNomineeModel.filesDTOList.push(files); 
            this.termLoanNomineeModel.multipartFileList.push(files);
            this.termLoanNomineeModel.nomineeFilePath = null;
            this.termLoanNomineeModel.filesDTOList[this.termLoanNomineeModel.filesDTOList.length-1].fileName = "TERM_LOAN_NOMINEE" + this.termLoanApplicationId + "_" + timeStamp + "_" + file.name;
            this.termLoanNomineeModel.nomineeFilePath = "TERM_LOAN_NOMINEE" + this.termLoanApplicationId + "_" +timeStamp+"_"+ file.name; 
          }
          if (filePathName === "Guardain") {
            this.isFileUploadedGuardian = applicationConstants.TRUE;
            this.termLoanGuardianDetailsModel.filesDTO.push(files); 
            this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles.push(files);
            this.termLoanGuardianDetailsModel.uploadFilePath = null;
            this.termLoanGuardianDetailsModel.filesDTO[this.termLoanGuardianDetailsModel.filesDTO.length-1].fileName = "TERM_LOAN_GUARDAIN" + "_" + timeStamp + "_" + file.name;
            this.termLoanGuardianDetailsModel.uploadFilePath = "TERM_LOAN_GUARDAIN" + "_" + timeStamp + "_" + file.name; 
          }
          this.updateData();
        }
        reader.readAsDataURL(file);
      }
    }
  
  
    onImageSelected(event: Event): void {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.fileName = file.name;
      }
    }
  /**
   * @implements gurdaind from validation
   */
    guardainFormValidation() {
      if (this.age <= 18) {
      this.nomineeForm.get('relationNameOfGuardian')?.enable();
      this.nomineeForm.get('guardianName')?.enable();
      this.nomineeForm.get('guardianAadhar')?.enable();
      this.nomineeForm.get('guardianMobile')?.enable();
      this.nomineeForm.get('guardianEmail')?.enable();
     
  
        this.guarntorDetailsFalg = true;
        const controlName = this.nomineeForm.get('relationNameOfGuardian');
        if (controlName) {
          controlName.setValidators([
            Validators.required,
          ]);
          controlName.updateValueAndValidity();
        }
        const controlTow = this.nomineeForm.get('guardianName');
        if (controlTow) {
          controlTow.setValidators([
            Validators.required,
            Validators.pattern(applicationConstants.NAME_PATTERN)
          ]);
          controlTow.updateValueAndValidity();
        }
        const controlFour = this.nomineeForm.get('guardianAadhar');
        if (controlFour) {
          controlFour.setValidators([
            Validators.required,
            Validators.pattern(applicationConstants.AADHAR_PATTERN)
          ]);
          controlFour.updateValueAndValidity();
        }
        const controlFive = this.nomineeForm.get('guardianMobile');
        if (controlFive) {
          controlFive.setValidators([
            Validators.required,
            Validators.pattern(applicationConstants.MOBILE_PATTERN)
          ]);
          controlFive.updateValueAndValidity();
        }
        this.updateData();
      }
    }
  

  
    /**
     * @implements gurdain form validation based on guardain type
     */
    guardaindisable(){
      this.nomineeForm.get('relationNameOfGuardian')?.disable();
      this.nomineeForm.get('guardianName')?.disable();
      this.nomineeForm.get('guardianAadhar')?.disable();
      this.nomineeForm.get('guardianMobile')?.disable();
      this.nomineeForm.get('guardianEmail')?.disable();
      this.updateData();
    }
  
    /**
     * @implements nominee form validation
     */
    nomineeFormValidation() {
      this.nomineeForm.get('relationName')?.disable();
      this.nomineeForm.get('nomineeName')?.disable();
      this.nomineeForm.get('aadhaar')?.disable();
      this.nomineeForm.get('mobileNumber')?.disable();
      this.nomineeForm.get('email')?.disable();
      this.nomineeForm.get('fileUpload')?.disable();
      this.updateData();
    }
    /**
     * @implements nominee required valdation
     */
    nomineeValidatorsRequired(){
      this.nomineeForm.get('relationName')?.enable();
      this.nomineeForm.get('nomineeName')?.enable();
      this.nomineeForm.get('aadhaar')?.enable();
      this.nomineeForm.get('mobileNumber')?.enable();
      this.nomineeForm.get('email')?.enable();
      this.nomineeForm.get('fileUpload')?.enable();
      const controlName = this.nomineeForm.get('relationName');
      if (controlName) {
        controlName.setValidators([
          Validators.required,
        ]);
        controlName.updateValueAndValidity();
      }
      
      const controlTow = this.nomineeForm.get('nomineeName');
      if (controlTow) {
        controlTow.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.NAME_PATTERN)
        ]);
        controlTow.updateValueAndValidity();
      }
      const controlFour = this.nomineeForm.get('aadhaar');
      if (controlFour) {
        controlFour.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.AADHAR_PATTERN)
        ]);
        controlFour.updateValueAndValidity();
      }
      const controlFive = this.nomineeForm.get('mobileNumber');
      if (controlFive) {
        controlFive.setValidators([
          Validators.required,
          Validators.pattern(applicationConstants.MOBILE_PATTERN)
        ]);
        controlFive.updateValueAndValidity();
      }
  
      const controlSix = this.nomineeForm.get('email');
      if (controlSix) {
        controlSix.setValidators([
          Validators.pattern(applicationConstants.EMAIL_PATTERN)
        ]);
        controlSix.updateValueAndValidity();
      }
      this.updateData();
    }
  
    /**
     * @implements nominee not required validation 
     */
    nomineeValidatorsFormNotRequired(){
      const controlName = this.nomineeForm.get('relationName');
      if (controlName) {
        controlName.setValidators(null); // Set the required validator null
        controlName.updateValueAndValidity();
      }
  
      const controlTow = this.nomineeForm.get('nomineeName');
      if (controlTow) {
        controlTow.setValidators(null); // Set the required validator null
        controlTow.updateValueAndValidity();
      }
      const controlFour = this.nomineeForm.get('aadhaar');
      if (controlFour) {
        controlFour.setValidators(null); // Set the required validator null
        controlFour.updateValueAndValidity();
      }
      const controlFive = this.nomineeForm.get('mobileNumber');
      if (controlFive) {
        controlFive.setValidators(null); // Set the required validator null
        controlFive.updateValueAndValidity();
      }
      this.updateData();
    }
  
    /**
     * @implements onFileremove from file value
     * @param fileName 
     */
    fileRemoeEvent(fileName :any){
      if(fileName == "Nominee"){
        this.isFileUploadedNominee = applicationConstants.FALSE;
        if(this.termLoanNomineeModel.filesDTOList != null && this.termLoanNomineeModel.filesDTOList != undefined && this.termLoanNomineeModel.filesDTOList.length > 0){
          let removeFileIndex = this.termLoanNomineeModel.filesDTOList.findIndex((obj:any) => obj && obj.fileName === this.termLoanNomineeModel.nomineeFilePath);
          this.termLoanNomineeModel.filesDTOList[removeFileIndex] = null;
          this.termLoanNomineeModel.nomineeFilePath = null;
        }
      }
      if(fileName == "Guardain"){
        this.isFileUploadedGuardian = applicationConstants.FALSE;
        if(this.termLoanGuardianDetailsModel.filesDTO != null && this.termLoanGuardianDetailsModel.filesDTO != undefined && this.termLoanGuardianDetailsModel.filesDTO.length > 0){
          let removeFileIndex = this.termLoanGuardianDetailsModel.filesDTO.findIndex((obj:any) => obj && obj.fileName === this.termLoanGuardianDetailsModel.uploadFilePath);
          this.termLoanGuardianDetailsModel.filesDTO[removeFileIndex] = null;
          this.termLoanGuardianDetailsModel.uploadFilePath = null;
        }
      }
      this.updateData();//validation update for save and next button
    }
  /**
   * @implements onChange new Nominee
   * @param flag 
   */
    newNomineeType(flag:boolean){
      this.newNominee = true;
        this.noNominee = false;
        //onchange on update
        if(flag){
          let nomineeId = null;
          if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined && this.termLoanNomineeModel.id  != null && this.termLoanNomineeModel.id  != undefined){
            nomineeId = this.termLoanNomineeModel.id ;
          }
          this.termLoanNomineeModel = new TermLoanNominee();
          if(nomineeId != null && nomineeId != undefined){
            this.termLoanNomineeModel.id = nomineeId;
          }
        }
        this.termLoanNomineeModel.nomineeType = 1;
        this.nomineeValidatorsRequired();
    }
  
    /**
     * @implements sameAsmemberNominee onChange
     * @param flag 
     */
    samAsMemberNomineeType(flag:boolean){
      this.newNominee = true;
      this.noNominee = false;
      //onchange on update
      if(flag){
        let nomineeId = null;
        if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined && this.termLoanNomineeModel.id  != null && this.termLoanNomineeModel.id  != undefined){
          nomineeId = this.termLoanNomineeModel.id ;
        }
        this.termLoanNomineeModel = new TermLoanNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.termLoanNomineeModel.id = nomineeId;
        }
        if(this.admissionNumber != null && this.admissionNumber != undefined){
          this.getMemberNomineDetailsByAdmissionNumber(this.admissionNumber);
        }
      }
      this.termLoanNomineeModel.nomineeType = 2;
      this.nomineeFormValidation();
    }
  
    /**
     * @implements noNomineeType OnChange
     * @param flag 
     */
    noNomineeType(flag : boolean){
      this.noNominee = true;
      this.newNominee = false;
      this.sameAsMembershipNominee = false;
      if(flag){
        let nomineeId = null;//onchange on update
  
        let signedCopyPath = null;
        if(this.termLoanNomineeModel != null && this.termLoanNomineeModel != undefined){
          if(this.termLoanNomineeModel.id  != null && this.termLoanNomineeModel.id  != undefined){
            nomineeId = this.termLoanNomineeModel.id ;
          }
          if(this.termLoanNomineeModel.nomineeFilePath  != null && this.termLoanNomineeModel.nomineeFilePath  != undefined){
            signedCopyPath = this.termLoanNomineeModel.nomineeFilePath ;
            this.termLoanNomineeModel.nomineeFilePath = this.fileUploadService.getFile(this.termLoanNomineeModel.nomineeFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanNomineeModel.nomineeFilePath);
          }
        }
        this.termLoanNomineeModel = new TermLoanNominee();
        if(nomineeId != null && nomineeId != undefined){
          this.termLoanNomineeModel.id = nomineeId;
        }
        this.termLoanNomineeModel.nomineeType = 3;
        if(signedCopyPath != null && signedCopyPath != undefined){
        this.termLoanNomineeModel.nomineeFilePath = signedCopyPath;
        }
      }
      this.nomineeValidatorsFormNotRequired();
      // this.newNominee = false;
    }
  
    /**
     * @implements new guardain Onchage
     * @param flag 
     */
    newGuardainType(flag : boolean){
      this.courtAppointedGuardain = false;
        this.sameAsMemberGuardain = true;
        this.noGuardain  = false;
        //onchange on update
        if(flag){
          let guardainId = null;
          if(this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined && this.termLoanGuardianDetailsModel.id  != null && this.termLoanGuardianDetailsModel.id  != undefined){
            guardainId = this.termLoanGuardianDetailsModel.id ;
          }
          this.termLoanGuardianDetailsModel = new TermLoanGuardianDetails();
          this.termLoanGuardianDetailsModel.id = guardainId;
        }
        this.termLoanGuardianDetailsModel.guardianType = 1;
        this.guardainFormValidation();
    }
  /**
   * @implements sameAsMember gurdain Onchage
   * @param flag 
   */
    sameAsMemberGuardianType(flag:boolean){
      this.sameAsMemberGuardain = true;
      this.courtAppointedGuardain = false;
      this.noGuardain  = false;
      //onchange on update
      if(flag){
        let guardainId = null;
        if(this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined && this.termLoanGuardianDetailsModel.id  != null && this.termLoanGuardianDetailsModel.id  != undefined){
          guardainId = this.termLoanGuardianDetailsModel.id ;
        }
        this.termLoanGuardianDetailsModel = new TermLoanGuardianDetails();
        this.termLoanGuardianDetailsModel.id = guardainId;
        this.getGaurdainFromMemberModule(this.admissionNumber);//get from member module
      }
      this.termLoanGuardianDetailsModel.guardianType = 2;
      this.guardaindisable();
    }
  
    noGuardainaType(flag:boolean){
      this.courtAppointedGuardain = true;
      this.sameAsMemberGuardain = false;
      this.noGuardain  = true;
      //onchange on update
      let guardainId = null;
      if(flag){
        let uploadFilePath = null;
        if(this.termLoanGuardianDetailsModel != null && this.termLoanGuardianDetailsModel != undefined){
          if(this.termLoanGuardianDetailsModel.id  != null && this.termLoanGuardianDetailsModel.id  != undefined){
            guardainId = this.termLoanGuardianDetailsModel.id ;
          }
         
          if(this.termLoanGuardianDetailsModel.kycFilePath  != null && this.termLoanGuardianDetailsModel.kycFilePath  != undefined){
            uploadFilePath = this.termLoanGuardianDetailsModel.kycFilePath ;
            this.termLoanGuardianDetailsModel.guardainSighnedMultipartFiles =this.fileUploadService.getFile(this.termLoanGuardianDetailsModel.kycFilePath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.termLoanGuardianDetailsModel.kycFilePath);
          }
        } 
        this.termLoanGuardianDetailsModel = new TermLoanGuardianDetails();
        if(guardainId != null && guardainId != undefined){
          this.termLoanGuardianDetailsModel.id = guardainId;
        }
       
      }
      this.termLoanGuardianDetailsModel.guardianType = 3;
      this.guardaindisable();
    }
}
