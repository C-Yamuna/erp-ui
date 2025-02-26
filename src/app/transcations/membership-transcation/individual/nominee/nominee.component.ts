import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { MembershipBasicDetailsService } from '../../shared/membership-basic-details.service';
import { MemberBasicDetailsStepperService } from '../shared/membership-individual-stepper.service';
import { MemberBasicDetails, MemberGuardianDetailsModel, MemberNomineeDetails, MemberNomoineeGuardianDetailsModel } from '../../shared/member-basic-details.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { RelationshipTypeService } from 'src/app/configurations/common-config/relationship-type/shared/relationship-type.service';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Component({
  selector: 'app-nominee',
  templateUrl: './nominee.component.html',
  styleUrls: ['./nominee.component.css']
})
export class NomineeComponent {
  nomineeForm: any;
  nominee: any;
  nomineeList: any;
  newNominee: boolean = false;
  noNominee: boolean = false;
  responseModel!: Responsemodel;
  msgs: any[] = [];
  memberNomineeDetailsModel: MemberNomineeDetails = new MemberNomineeDetails();
  memberBasicDetailsModel: MemberBasicDetails = new MemberBasicDetails();
  memberGuardianDetailsModel: MemberGuardianDetailsModel = new MemberGuardianDetailsModel();
  fileName: any;
  isEdit: boolean = false;
  age: any;
  guarntorDetailsFalg: boolean = false;
  relationTypesList: any[] = [];
  orgnizationSetting: any;
  guadianTypesList: any[] = [];
  showForm: any;
  memberTypeName: any;
  courtAppointedGuardain :any;
  multipleFilesList: any;
  uploadFileData: any;
  isFileUploaded: any;
  sameAsMemberGuardain: boolean = false;
  noGuardain: boolean = true;
  flag: boolean = false;
  memberId: any;
  subProductName: any;
  multipartFileList: any[]=[];
  multipartsFileList: any[]=[];
  isGurdianAdded:Boolean = false;
  saveDisabled:Boolean = false;
  saveDisabledForGuardian :Boolean = false
  saveAndNextButtonDisable:Boolean = false;
  saveAndNextButtonDisableGardian:Boolean = false;
  admissionNumber: any;
  today: any;

  constructor(private router: Router, private formBuilder: FormBuilder, private membershipBasicDetailsService: MembershipBasicDetailsService, private commonComponent: CommonComponent, private activateRoute: ActivatedRoute, private encryptDecryptService: EncryptDecryptService, private relationshipTypeService: RelationshipTypeService, private commonFunctionsService: CommonFunctionsService, private datePipe: DatePipe , private memberBasicDetailsStepperService : MemberBasicDetailsStepperService , private fileUploadService :FileUploadService) {
    this.nomineeForm = this.formBuilder.group({
      relationName:['', ],
      nomineeName: ['', ],
      nomineeAge:  [''],
      aadhaar: ['', ],
      mobileNumber:['', ],
      email: ['', ],
      nomineeDob: new FormControl('', ),
      remarks: new FormControl('', ),
      // 'nomineeAddres': new FormControl('', Validators.required),
      nomineeType: [''],

      //guardian form fields
      relationNameOfGuardian: ['', ],
      guardianName: ['', ],
      guardianAge: ['', ],
      guardianDob: ['', ],
      guardianAadhar: ['', ],
      guardianMobile: ['', ],
      guardianEmail: ['', ],
      guardianAddress: ['', ],
      guardainType: [''],
      fileUpload : ['', ],
      guardianRemarks: new FormControl('', ),

    });
  }

  // @k.yamuna
  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.showForm = this.commonFunctionsService.getStorageValue(applicationConstants.B_CLASS_MEMBER_CREATION);
    this.today = new Date();
      this.nomineeList = [
        { label: 'New Nominee', value: 1 },
        { label: 'No Nominee', value: 2 },
      ]
   
    this.guadianTypesList = [
      { label: 'New Guardian', value: 1 },
      { label: 'No Guardian', value: 2 },
    ]
   
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined ) {
        if(params['id'] != undefined && params['id'] != null){
          let queryParams = this.encryptDecryptService.decrypt(params['id']);
          this.memberId = Number(queryParams);
          this.getMembershipBasicDetailsById(this.memberId);
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
  //@k.yamuna
  updateData() {
    if (this.age <= 18) {
      this.memberGuardianDetailsModel.memberId = this.memberId;
      this.memberGuardianDetailsModel.admissionNumber = this.admissionNumber;

      this.memberNomineeDetailsModel.memberGuardianDetailsModel = this.memberGuardianDetailsModel;
    }
    this.memberNomineeDetailsModel.memberAge = this.age;
    this.memberNomineeDetailsModel.memberShipId = this.memberId;
    this.memberNomineeDetailsModel.admissionNumber = this.admissionNumber;

    // Ensure correct logic for enabling/disabling buttons
    this.saveAndNextButtonDisable = !this.saveDisabled || !this.nomineeForm.valid;
    this.saveAndNextButtonDisableGardian = !this.isGurdianAdded || this.saveDisabledForGuardian;

    this.memberBasicDetailsStepperService.changeData({
      formValid: !this.nomineeForm.valid,
      data: this.memberNomineeDetailsModel,
      isDisable:  (this.saveAndNextButtonDisable || this.saveAndNextButtonDisableGardian) ? true : false ,
      //     stepperIndex: 5,
      stepperIndex: 5,
    });
}
  
  save() {
    this.updateData();
  }
  //on change nominee type need to update validation
  //@k.yamuna
  onChange(event: any ,flag :boolean) {
    if (event == 1) {//new nominee
      this.newNomineeType(flag);
    }
    else if (event == 2) {//same as membership nominee
      this.noNomineeType(flag);
    }
    if(this.age > 18){
      this.isGurdianAdded = true;
    }
  }

  /**
   *  @author k.yamuna
   * @implements onChange Guardain Type 
   * @param event guardain Type
   */
  onChangeGuardain(event: any , flag :boolean) {
    if (event == 1) {//new guardain
      this.newGuardainType(flag);
    }
    else if (event == 2) {//no guardain
      this.noGuardainaType(flag);
    }
  }

/**
   * @implements getting member basic details for nominee and guardian details based on memberId
   * @param id 
   * @author k.yamuna
   */ 
  getMembershipBasicDetailsById(id: any) {
    this.membershipBasicDetailsService.getMembershipBasicDetailsById(this.memberId).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0]) {
        this.memberBasicDetailsModel = this.responseModel.data[0];
        this.subProductName = this.memberBasicDetailsModel.subProductName
        this.updateData();
        if (this.memberBasicDetailsModel.age != null && this.memberBasicDetailsModel.age != undefined) {
          this.age = this.memberBasicDetailsModel.age;
          if (this.age < 18) {
            this.guarntorDetailsFalg = true;
            this.noGuardain = false;
            this.courtAppointedGuardain = false
          }
        }
        if (this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList != null && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList != undefined && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList.length > 0 && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList[0] != null && this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList[0] != undefined) {
          this.memberGuardianDetailsModel = this.memberBasicDetailsModel.memberShipGuadianDetailsDTOList[0];
          this.isGurdianAdded = true;
          if (this.memberGuardianDetailsModel.guardianType != null && this.memberGuardianDetailsModel.guardianType != undefined) {
            this.onChangeGuardain(this.memberGuardianDetailsModel.guardianType, this.flag);
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
          if (this.memberGuardianDetailsModel.guardianDob != null && this.memberGuardianDetailsModel.guardianDob != undefined) {
            this.memberGuardianDetailsModel.guardianDobVal = this.datePipe.transform(this.memberGuardianDetailsModel.guardianDob, this.orgnizationSetting.datePipe);
          }
          if(this.memberGuardianDetailsModel.uploadFilePath != null && this.memberGuardianDetailsModel.uploadFilePath != undefined)
            this.memberGuardianDetailsModel.multipartsFileList = this.fileUploadService.getFile(this.memberGuardianDetailsModel.uploadFilePath ,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberGuardianDetailsModel.uploadFilePath);
          this.saveDisabledForGuardian = false;
        }

        if (this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList != null && this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList != undefined && this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList.length > 0 && this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList[0] != null && this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList[0] != undefined) {//nominee details
          this.memberNomineeDetailsModel = this.memberBasicDetailsModel.memberShipNomineeDetailsDTOList[0];
          // this.memberNomineeDetailsModel.subProductId = this.memberBasicDetailsModel.subProductId
          if (this.memberNomineeDetailsModel.nomineeType != null && this.memberNomineeDetailsModel.nomineeType != undefined) {
            this.onChange(this.memberNomineeDetailsModel.nomineeType, this.flag);
          }
          if (this.memberNomineeDetailsModel.nomineeDob != null && this.memberNomineeDetailsModel.nomineeDob != undefined) {
            this.memberNomineeDetailsModel.nomineeDobVal = this.datePipe.transform(this.memberNomineeDetailsModel.nomineeDob, this.orgnizationSetting.datePipe);
          }
          if (this.memberNomineeDetailsModel.nomineeFilePath != null && this.memberNomineeDetailsModel.nomineeFilePath != undefined)
            this.memberNomineeDetailsModel.multipartFileList = this.fileUploadService.getFile(this.memberNomineeDetailsModel.nomineeFilePath, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.FILES + "/" + this.memberNomineeDetailsModel.nomineeFilePath);
            this.saveDisabled = true;
        }
        if (this.memberBasicDetailsModel.id != null && this.memberBasicDetailsModel.id != undefined) {
          this.memberGuardianDetailsModel.memberId = this.memberBasicDetailsModel.id;
        }
        if (this.memberBasicDetailsModel.id != null && this.memberBasicDetailsModel.id != undefined) {
          this.memberNomineeDetailsModel.memberShipId = this.memberBasicDetailsModel.id;
        }
        if (this.memberBasicDetailsModel.admissionNumber != null && this.memberBasicDetailsModel.admissionNumber != undefined) {
          this.memberNomineeDetailsModel.admissionNumber = this.memberBasicDetailsModel.admissionNumber
          this.admissionNumber =  this.memberBasicDetailsModel.admissionNumber;
        }

        if (this.memberBasicDetailsModel.admissionNumber != null && this.memberBasicDetailsModel.admissionNumber != undefined) {
          this.memberGuardianDetailsModel.admissionNumber = this.memberBasicDetailsModel.admissionNumber
        }
      }
      this.updateData();
    });
  }

  //get all relation types list
  getAllRelationTypes() {
    this.relationshipTypeService.getAllRelationshipType().subscribe((res: any) => {
      this.responseModel = res;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.relationTypesList = this.responseModel.data
            this.relationTypesList = this.responseModel.data.filter((kyc: any) => kyc.status == applicationConstants.ACTIVE).map((count: any) => {
              return { label: count.name, value: count.id }
            });
         
            
          }
        }
      }
    });
  }

  onChangeRelationForNominee() {
    let  nominee= this.relationTypesList.find((data: any) => null != data && this.memberNomineeDetailsModel.relationTypeId  != null && data.value == this.memberNomineeDetailsModel.relationTypeId);
    if (nominee != null && undefined != nominee && nominee.label != null && nominee.label != undefined){
      this.memberNomineeDetailsModel.relationTypeName = nominee.label;
    }
  }
  onChangeRelationForGaurdian() {
    let  guardain= this.relationTypesList.find((data: any) => null != data && this.memberGuardianDetailsModel.relationshipTypeId  != null && data.value == this.memberGuardianDetailsModel.relationshipTypeId);
    if (guardain != null && undefined != guardain && guardain.label != null && guardain.label != undefined){
          this.memberGuardianDetailsModel.relationshipTypeName = guardain.label;
    }
  }

  /**
   * @implements fileUpload service
   * @param event 
   * @param fileUpload 
   * @param filePathName 
   */
 //upload documnet for nominee
  fileUploaderForNominee(event: any, fileUpload: FileUpload) {
    this.saveDisabled = true;
    this.isFileUploaded = applicationConstants.FALSE;
    this.memberNomineeDetailsModel.multipartFileList = [];
    this.multipartFileList = [];
    this.memberNomineeDetailsModel.filesDTO = null; // Initialize as a single object
    this.memberNomineeDetailsModel.nomineeFilePath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "MEMBER_NOMINEE_" + this.memberId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.memberNomineeDetailsModel.filesDTO = filesDTO;
      this.memberNomineeDetailsModel.nomineeFilePath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
    this.updateData();
  }

  //remove documnet for nominee
  fileRemoveEventForNominee() {
    this.saveDisabled = false;
    this.memberNomineeDetailsModel.multipartFileList = [];
    if (this.memberNomineeDetailsModel.filesDTO != null && this.memberNomineeDetailsModel.filesDTO != undefined) {
      this.memberNomineeDetailsModel.nomineeFilePath = null;
      this.memberNomineeDetailsModel.filesDTO = null;
    }
    this.updateData();
  }
  //upload documnet for gaurdian
  fileUploaderForGaurdian(event: any, fileUpload: FileUpload) {
    this.saveDisabledForGuardian = false;
    this.isFileUploaded = applicationConstants.FALSE;
    this.memberGuardianDetailsModel.multipartsFileList = [];
    this.multipartsFileList = [];
    this.memberGuardianDetailsModel.filesDTO = null; // Initialize as a single object
    this.memberGuardianDetailsModel.uploadFilePath = null;
    let file = event.files[0]; // Only one file
    let reader = new FileReader();
    reader.onloadend = (e) => {
      let filesDTO = new FileUploadModel();
      this.uploadFileData = e.target as FileReader;
      filesDTO.fileName = "MEMBER_GAUDIAN_" + this.memberId + "_" + this.commonComponent.getTimeStamp() + "_" + file.name;
      filesDTO.fileType = file.type.split('/')[1];
      filesDTO.value = (this.uploadFileData.result as string).split(',')[1];
      filesDTO.imageValue = this.uploadFileData.result as string;
      this.memberGuardianDetailsModel.filesDTO = filesDTO;
      this.memberGuardianDetailsModel.uploadFilePath = filesDTO.fileName;
      let index1 = event.files.indexOf(file);
      if (index1 > -1) {
        fileUpload.remove(event, index1);
      }
      fileUpload.clear();
    };

    reader.readAsDataURL(file);
    this.updateData();
  }

  //remove documnet for gaurdian
  fileRemoveEventForGaurdian() {
    this.saveDisabledForGuardian = true;
    this.memberGuardianDetailsModel.multipartsFileList = [];
    if (this.memberGuardianDetailsModel.filesDTO != null && this.memberGuardianDetailsModel.filesDTO != undefined) {
      this.memberGuardianDetailsModel.uploadFilePath = null;
      this.memberGuardianDetailsModel.filesDTO = null;
    }
    this.updateData();
  }
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
      const controlSix = this.nomineeForm.get('guardianAge');
      if (controlSix) {
        controlSix.setValidators([
          Validators.required,
        ]);
        controlSix.updateValueAndValidity();
      }
      const controlSeven = this.nomineeForm.get('guardianDob');
      if (controlSeven) {
        controlSeven.setValidators([
          Validators.required,
        ]);
        controlSeven.updateValueAndValidity();
      }
      this.updateData();
    }
  }
 
  /**
   * @author k.yamuna
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
    const controlsix = this.nomineeForm.get('nomineeDob');
    if (controlsix) {
      controlsix.setValidators([
        Validators.required,
      ]);
      controlsix.updateValueAndValidity();
    }
    const controlSeven = this.nomineeForm.get('nomineeAge');
    if (controlSeven) {
      controlSeven.setValidators([
        Validators.required,
        // Validators.pattern(applicationConstants.AADHAR_PATTERN)
      ]);
      controlSeven.updateValueAndValidity();
    }
    this.updateData();
  }

  nomineeValidatorsFormNotRequired() {
    this.removeValidators('relationName');
    this.removeValidators('nomineeName');
    this.removeValidators('aadhaar');
    this.removeValidators('mobileNumber');
    this.removeValidators('nomineeDob');
    this.removeValidators('nomineeAge');
    const remarksControl = this.nomineeForm.get('remarks');
    if (remarksControl) {
      remarksControl.setValidators([Validators.required]);
      remarksControl.updateValueAndValidity();
    }
    this.updateData();
  }
  removeValidators(controlName: string) {
    const control = this.nomineeForm.get(controlName);
    if (control) {
      control.setValidators(null);
      control.updateValueAndValidity();
    }
  }
 
/**
 * @implements onChange new Nominee
 * @param flag 
 * @author k.yamuna
 */
  newNomineeType(flag:boolean){
    this.saveDisabled = false;
    this.newNominee = true;
      this.noNominee = false;
      //onchange on update
      if(flag){
        let nomineeId = null;
        if(this.memberNomineeDetailsModel != null && this.memberNomineeDetailsModel != undefined && this.memberNomineeDetailsModel.id  != null && this.memberNomineeDetailsModel.id  != undefined){
          nomineeId = this.memberNomineeDetailsModel.id ;
        }
        this.memberNomineeDetailsModel = new MemberNomineeDetails();
        if(nomineeId != null && nomineeId != undefined){
          this.memberNomineeDetailsModel.id = nomineeId;
        }
      }
      this.memberNomineeDetailsModel.status = applicationConstants.ACTIVE;
      this.memberNomineeDetailsModel.nomineeType = 1;
      this.nomineeValidatorsRequired();
  }

  
  /**
   * @implements noNimineeType OnChange
   * @param flag 
   * @author k.yamuna
   */
  noNomineeType(flag: boolean) {
    this.noNominee = true;
    this.newNominee = false;
    this.saveDisabled = false;
  
    if (flag) {
      let nomineeId = null; // On change on update
      if (this.memberNomineeDetailsModel != null && this.memberNomineeDetailsModel != undefined) {
        if (this.memberNomineeDetailsModel.id != null && this.memberNomineeDetailsModel.id != undefined) {
          nomineeId = this.memberNomineeDetailsModel.id;
        }
      }
      this.memberNomineeDetailsModel = new MemberNomineeDetails();
      this.memberNomineeDetailsModel.multipartFileList = []; 
      this.memberNomineeDetailsModel.filesDTO = null; 
      this.memberNomineeDetailsModel.nomineeFilePath = null; 
  
      this.memberNomineeDetailsModel.status = applicationConstants.ACTIVE;
      if (nomineeId != null && nomineeId != undefined) {
        this.memberNomineeDetailsModel.id = nomineeId;
      }
      this.memberNomineeDetailsModel.nomineeType = 2; 
    }
    this.nomineeValidatorsFormNotRequired();
  }
  
  /**
   * @implements new guardain Onchage
   * @param flag 
   * @author k.yamuna
   */
  newGuardainType(flag : boolean){
    this.nomineeForm.get('relationNameOfGuardian').reset();
    this.nomineeForm.get('guardianName').reset();
    this.nomineeForm.get('guardianAadhar').reset();
    this.nomineeForm.get('guardianMobile').reset();
    this.nomineeForm.get('guardianEmail').reset();
    this.nomineeForm.get('guardianAge').reset();
    this.nomineeForm.get('guardianDob').reset();

    this.saveDisabledForGuardian = true;
    this.courtAppointedGuardain = true;
      this.noGuardain  = false;
      //onchange on update
      if(flag){
        let guardainId = null;
        if(this.memberGuardianDetailsModel != null && this.memberGuardianDetailsModel != undefined && this.memberGuardianDetailsModel.id  != null && this.memberGuardianDetailsModel.id  != undefined){
          guardainId = this.memberGuardianDetailsModel.id ;
        }
        this.memberGuardianDetailsModel = new MemberGuardianDetailsModel();
        this.memberGuardianDetailsModel.id = guardainId;
        this.memberGuardianDetailsModel.status = applicationConstants.ACTIVE;
        this.isGurdianAdded = true;
      }
      this.memberGuardianDetailsModel.guardianType = 1;
      this.guardainFormValidation();
  }

/**
   * @implements no guardian memthod for remove validation and no guardian flag enable
   * @param id 
   * @author k.yamuna
   */ 
  noGuardainaType(flag:boolean){
    this.saveDisabledForGuardian = true;
    this.courtAppointedGuardain = false;
    this.noGuardain  = true;
    //onchange on update
    let guardainId = null;
    let remarks = null;
    if(flag){
      let gaurdianSignedCopyPath = null;
      if(this.memberGuardianDetailsModel != null && this.memberGuardianDetailsModel != undefined){
        if(this.memberGuardianDetailsModel.id  != null && this.memberGuardianDetailsModel.id  != undefined){
          guardainId = this.memberGuardianDetailsModel.id ;
        }
        if(this.memberGuardianDetailsModel.remarks  != null && this.memberGuardianDetailsModel.remarks  != undefined){
          remarks = this.memberGuardianDetailsModel.remarks ;
        }
      }
      this.memberGuardianDetailsModel = new MemberGuardianDetailsModel();
      this.memberGuardianDetailsModel.status = applicationConstants.ACTIVE;
      this.isGurdianAdded = true;
      if(guardainId != null && guardainId != undefined){
        this.memberGuardianDetailsModel.id = guardainId;
      }
      if(remarks != null && remarks != undefined){
        this.memberGuardianDetailsModel.remarks = remarks;
      }
    }
    this.memberGuardianDetailsModel.guardianType = 2;
    this.noGuardainValidation();
   
  }
  noGuardainValidation(){
    if (this.age <= 18) {
      this.nomineeForm.get('relationNameOfGuardian')?.enable();
    this.nomineeForm.get('guardianName')?.enable();
    this.nomineeForm.get('guardianAadhar')?.enable();
    this.nomineeForm.get('guardianMobile')?.enable();
    this.nomineeForm.get('guardianEmail')?.enable();

    this.removeValidators('relationNameOfGuardian');
    this.removeValidators('guardianName');
    this.removeValidators('guardianAadhar');
    this.removeValidators('guardianMobile');
    this.removeValidators('guardianDob');
    this.removeValidators('guardianAge');

    this.guarntorDetailsFalg = true;
    const controlName = this.nomineeForm.get('guardianRemarks');
    if (controlName) {
      controlName.setValidators([
        Validators.required,
      ]);
      controlName.updateValueAndValidity();
    }

    }
  }
 
 
  /**
   * @implements Method to validate and handle both DOB and Age fields
   * @param model and type
   * @author k.yamuna
   */
  datesValidationCheckAgeAndDob(model: any, type: number): void {
    if (type === 2) { 
      if (model.nomineeDobVal) {
        const calculatedAge = this.calculateAge(model.nomineeDobVal);
        model.nomineeAge = calculatedAge; 
      }
    } else if (type === 1) { 
      if (model.nomineeAge && model.nomineeAge > 0) {
        const calculatedDob = this.calculateDobFromAge(model.nomineeAge);
        model.nomineeDobVal = calculatedDob; 
      } else if(model.nomineeAge != null && model.nomineeAge <= 0){
        this.nomineeForm.get('nomineeAge').reset();
        this.msgs = [{ severity: 'error', detail: "Age should not be zero or negative" }];
        setTimeout(() =>{
          this.msgs =[];
        },2000);
       
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

   /**
   * @implements Method to validate guardian and handle both DOB and Age fields
   * @param model and type
   * @author k.yamuna
   */
   guardianDatesValidationCheckAgeAndDob(model: any, type: number): void {
    if (type === 2) { 
      if (model.guardianDobVal) {
        const calculatedAge = this.calculateAge(model.guardianDobVal);
        model.guardianAge = calculatedAge; 
      }
    } else if (type === 1) { 
      if (model.guardianAge && model.guardianAge > 0) {
        const calculatedDob = this.calculateDobFromAge(model.guardianAge);
        model.guardianDobVal = calculatedDob; 
      } else if(model.guardianAge != null && model.guardianAge <= 0){
        this.nomineeForm.get('guardianAge').reset();
        this.msgs = [{ severity: 'error', detail: "Age should not be zero or negative" }];
        setTimeout(() =>{
          this.msgs =[];
        },2000);
       
      }
    }
  }
}

