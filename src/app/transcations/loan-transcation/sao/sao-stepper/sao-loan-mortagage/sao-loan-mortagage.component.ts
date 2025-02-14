import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { LoanConfigConstants } from 'src/app/configurations/loan-config/loan-config-constants';
import { SaoLoanLandMortageDetailsService } from '../../../shared/sao-loans/sao-loan-land-mortage-details.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Table } from 'primeng/table';
import { SaoLoanLandMortageDetailsModel } from './shared/sao-loan-mortgage.model';
import { CommonComponent } from 'src/app/shared/common.component';
import { FileUpload } from 'primeng/fileupload';
import { FileUploadModel } from 'src/app/layout/mainmenu/shared/file-upload-model.model';
import { SaoLoanApplicationService } from '../../../shared/sao-loans/sao-loan-application.service';
import { SaoLoanApplication } from '../../shared/sao-loan-application.model';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { MembershipBasicDetailsService } from '../membership-basic-details/shared/membership-basic-details.service';
import { DatePipe } from '@angular/common';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { FileUploadService } from 'src/app/shared/file-upload.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Component({
  selector: 'app-sao-loan-mortagage',
  templateUrl: './sao-loan-mortagage.component.html',
  styleUrls: ['./sao-loan-mortagage.component.css']
})
export class SaoLoanMortagageComponent {

  @ViewChild('dt', { static: false })
  private dt!: Table;
  Collateralform: FormGroup;
  selectcollateraltype: any;
  showgoldform: boolean = false;
  showlandform: boolean = false;
  showbondform:boolean = false;
  showstorageform:boolean = false;
  showothersform:boolean = false;
  buttonDisabled: boolean = false;
  carrats: any[] | undefined;
  admissionnumber:any;
  landTypeList: any[] = [];
  gridList: any[] = [];
  msgs: any[] = [];
  addButton: boolean = false;
  editDeleteDisable: boolean = false;
  saveAndNextDisable: boolean = false;
  displayDialog: boolean = false;
  responseModel!: Responsemodel;
  loanId: any;
  isEdit:boolean = false;
  orgnizationSetting: any;
  multipleFilesList: any[] = [];
  uploadFileData: any;
  saoLoanApplicatonModel: SaoLoanApplication = new SaoLoanApplication();
  saoLoanLandMortageDetailsModel : SaoLoanLandMortageDetailsModel = new SaoLoanLandMortageDetailsModel();
  statusList: any[] = [];
  deleteId: any;
  landMortgagePopUp:boolean = false;
  villagesList:any[]=[];
  landOwnershipTypesList:any[]=[];
 
  constructor(private router: Router, private formBuilder: FormBuilder,private saoLoanLandMortageDetailsService: SaoLoanLandMortageDetailsService,
    private commonComponent: CommonComponent,private saoLoanApplicationService : SaoLoanApplicationService,private activateRoute: ActivatedRoute,
    private encryptDecryptService: EncryptDecryptService,private membershipBasicDetailsService: MembershipBasicDetailsService,private datePipe: DatePipe,
    private fileUploadService :FileUploadService,private commonFunctionsService: CommonFunctionsService
  )
  { 
    this.Collateralform = this.formBuilder.group({
     'passbookNumber': new FormControl('', [Validators.required]),
      'khataNumber': new FormControl('', [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'surveyNumber': new FormControl('', [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'totalLandInUnits':new FormControl(Validators.compose([Validators.required]), [Validators.maxLength(5) ]),
      'totalLandInSubUnits': new FormControl([Validators.required], [Validators.maxLength(5)]),
      'landValuePerUnit': new FormControl(Validators.compose([Validators.required]), [Validators.minLength(1), Validators.maxLength(13) ]),   
      'totalLandValue': new FormControl(Validators.compose([Validators.required]), [ Validators.minLength(1), Validators.maxLength(13) ]),
      'mortgageLandInUnits': new FormControl(Validators.compose([Validators.required]), [Validators.maxLength(5)]),
      'mortgageLandInSubUnits': new FormControl( Validators.compose([Validators.required]), [Validators.maxLength(5)]),
      'mortgageLandValuePerUnit': new FormControl(Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES),  Validators.minLength(1), Validators.maxLength(13)]),
      'totalMortgageLandValue': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALLOW_DECIMALS_UPTO_TWO_PLACES),  Validators.minLength(1), Validators.maxLength(13)]),
      'mortgageDeedNumber': new FormControl( Validators.compose([Validators.required]), [Validators.pattern(applicationConstants.ALPHANUMERIC)]),
      'mortgageDeedDate': new FormControl('', [Validators.required]),
      'ownershipType': new FormControl('', [Validators.required]),
      'village': new FormControl('', [Validators.required])
    })
   
   
  }
  ngOnInit() {
    this.getAllVaillages();
    this.getAllLandOwnerShipTypes();
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.statusList = this.commonComponent.status();
    this.landTypeList = [
        { label: 'Dry Land', value: 1 },
        { label: 'Wet Land', value: 2 },
    ];
    this.landOwnershipTypesList= [
      { label: 'Land Ownership', value: 1 },
     
    ];
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        this.loanId = Number(this.encryptDecryptService.decrypt(params['id']));
        this.isEdit = true;
        this.getSaoLoanLandDetailsByApplicationId(this.loanId);
      } else {
        this.isEdit = false;
      }
    }) 
    this.updateData();
   this.getSaoLoanApplicationDetailsById(this.loanId);
}

updateData() {
  this.saveAndNextDisable = !this.Collateralform.valid;
  if(this.editDeleteDisable != null){
    this.saveAndNextDisable = this.editDeleteDisable;
  }
  this.saoLoanApplicationService.changeData({
    formValid: !this.Collateralform.valid ? true : false,
    data: this.saoLoanLandMortageDetailsModel,
    isDisable: this.saveAndNextDisable,
    // isDisable: (!this.Collateralform.valid),
    stepperIndex: 7,
  });
}
save() {
  this.updateData();
}
getSaoLoanApplicationDetailsById(id: any) {
  this.saoLoanApplicationService.getSaoLoanApplicationDetailsById(id).subscribe((response: any) => {
    this.responseModel = response;
    if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
      this.saoLoanApplicatonModel = this.responseModel.data[0];
    }
    else {
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
  });
}
getAllVaillages(){
  this.saoLoanLandMortageDetailsService.getAllVillages().subscribe((data: any) => {
    this.responseModel = data;
    if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
      this.villagesList = this.responseModel.data.filter((obj:any) => obj.status == applicationConstants.ACTIVE).map((obj: any) => {
        return { label: obj.name, value: obj.id };
      });
    } else {
      this.msgs = [];
      this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
    }
  });
}
getAllLandOwnerShipTypes() {
  this.commonComponent.startSpinner();
  this.saoLoanLandMortageDetailsService.getAllLandownershipTypes().subscribe(response => {
    this.responseModel = response;
    if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
      this.commonComponent.stopSpinner();
      this.landOwnershipTypesList = this.responseModel.data.filter((landType: { status: number; }) => landType.status == 1).map((landType: any) => {
        return { label: landType.name, value: landType.id };
      });
    }
  },
    error => {
      this.msgs = [];
      this.commonComponent.stopSpinner();
      this.msgs.push({ severity: 'error', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST });
    })
}
getSaoLoanLandDetailsByApplicationId(loanId: any){
  this.editDeleteDisable = true;
  this.saoLoanLandMortageDetailsService.getLandDetailsBySaoLoanApplicationId(loanId).subscribe(res => {
    this.responseModel = res;
    this.commonComponent.stopSpinner();
    if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
      this.gridList = this.responseModel.data;
      if(this.gridList != null && this.gridList.length >0){
        this.editDeleteDisable = false;
        this.gridList = this.responseModel.data.map((land: any) => {
          if(land.villageId != null && land.villageId != undefined){
            let villageName  = this.villagesList.filter((village:any) => village.value == land.villageId);
            land.villageName = villageName[0].label;
          }
          if (land != null && land != undefined && land.documentPath != null && land.documentPath != undefined) {
            land.requestedDocPathMultipartFileList = this.fileUploadService.getFile(land.documentPath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + land.documentPath);
          }
          return land
        });
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      this.updateData();
    } else {
      this.commonComponent.stopSpinner();
      this.buttonDisabled = applicationConstants.FALSE;
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    }
    
  });
}

  addOrUpdateLandDetails(rowData:any) {
    this.landMortgagePopUp = false;
    this.addButton = false;
    this.editDeleteDisable = false;
    rowData.saoLoanApplicationId = this.loanId;
    rowData.filesDTOList = this.saoLoanLandMortageDetailsModel.filesDTOList;
    rowData.documentPath = this.saoLoanLandMortageDetailsModel.documentPath;
   
    this.saoLoanLandMortageDetailsModel = rowData;
    this.saoLoanLandMortageDetailsModel.admissionNo = this.saoLoanApplicatonModel.admissionNo;
    this.saoLoanLandMortageDetailsModel.mortgageDeedDate = this.commonFunctionsService.getUTCEpoch(new Date(this.saoLoanLandMortageDetailsModel.mortgageDeedDateVal));
    if (rowData.id != undefined) {
      this.saoLoanLandMortageDetailsService.updateSaoLoanLandMortageDetails(this.saoLoanLandMortageDetailsModel).subscribe((res: any) => {
        this.responseModel = res;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.saoLoanLandMortageDetailsModel = this.responseModel.data;
              this.addButton = false;
              if (this.responseModel.data[0].ciLoanApplicationId != null && this.responseModel.data[0].ciLoanApplicationId != undefined) {
                this.getSaoLoanLandDetailsByApplicationId(this.loanId);
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
    } else {
      this.saoLoanLandMortageDetailsModel.status = applicationConstants.ACTIVE;
      this.saoLoanLandMortageDetailsService.addSaoLoanLandMortageDetails(this.saoLoanLandMortageDetailsModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel != null && this.responseModel != undefined) {
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
              this.saoLoanLandMortageDetailsModel = this.responseModel.data;
              this.addButton = false;
              this.getSaoLoanLandDetailsByApplicationId(this.loanId);
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
  }
  addData() {
    this.landMortgagePopUp = true;
    this.saoLoanLandMortageDetailsModel = new SaoLoanLandMortageDetailsModel();
    this.addButton = true;
    this.editDeleteDisable = true;
    this.updateData();
    
  }
  getLandDetailsBySaoLoanApplicationId(loanId:any) {
    this.saoLoanLandMortageDetailsService.getLandDetailsBySaoLoanApplicationId(loanId).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.gridList = this.responseModel.data;
        this.gridList = this.responseModel.data.map((land: any) => {
          if (land != null && land != undefined && land.documentPath != null && land.documentPath != undefined) {
            land.requestedDocPathMultipartFileList = this.fileUploadService.getFile(land.documentPath , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.FILES + "/" + land.documentPath);
          }
          return land
        });
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      } else {
        this.commonComponent.stopSpinner();
        this.buttonDisabled = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    });
    this.updateData();
  }
  
  editLandLoanMortgage(rowData: any) {
    this.landMortgagePopUp = true;
    this.addButton = true;
    this.editDeleteDisable = true;
    this.updateData();
    this.saoLoanLandMortageDetailsService.getSaoLoanLandMortageDetailsById(rowData.id).subscribe((response: any) => {
      this.responseModel = response;
      if (this.responseModel != null && this.responseModel != undefined) {
        if (this.responseModel.status != null && this.responseModel.status != undefined && this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
          if (this.responseModel.data != null && this.responseModel.data != undefined && this.responseModel.data.length > 0 && this.responseModel.data[0] != null && this.responseModel.data[0] != undefined) {
            this.saoLoanLandMortageDetailsModel = this.responseModel.data[0];
            this.saoLoanLandMortageDetailsModel.mortgageDeedDateVal = this.datePipe.transform(this.saoLoanLandMortageDetailsModel.mortgageDeedDate, this.orgnizationSetting.datePipe);
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
  cancelLandLoanMortgage() {
    this.landMortgagePopUp = false;
    this.gridList = [];
    this.addButton = false;
    this.editDeleteDisable = false;
    this.getSaoLoanLandDetailsByApplicationId(this.loanId);
  }
  
  deletDilogBox(rowData:any){
    this.displayDialog = true;
    this.deleteId = rowData.id;
  }
  submitDelete(){
    this.displayDialog = false;
    this.saoLoanLandMortageDetailsService.deleteSaoLoanLandMortageDetails(this.deleteId).subscribe((response : any ) => {
      this.responseModel = response;
      if(this.responseModel.status == applicationConstants.STATUS_SUCCESS){
        if(this.loanId != null && this.loanId != undefined){
          this.getSaoLoanLandDetailsByApplicationId(this.loanId);
        }  
       
      }
        else {
          this.msgs = [];
          this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      }, error => {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.SERVER_DOWN_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 3000);
      });
  }
  cancelForDialogBox() {
    this.displayDialog = false;
  }
   /**
   * @implements file upload service
   * @param event
   * @param fileUpload
   * @author akhila.m
   */
   fileUploader(event:any ,fileUpload: FileUpload ){
    this.multipleFilesList = [];
    this.saoLoanLandMortageDetailsModel.filesDTOList = [];
    this.saoLoanLandMortageDetailsModel.documentPath = null;
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
          this.saoLoanLandMortageDetailsModel.filesDTOList.push(files); // Add to filesDTOList array
        }
        let timeStamp = this.commonComponent.getTimeStamp();
        this.saoLoanLandMortageDetailsModel.filesDTOList[0].fileName = "LAND_MORTGAGE" + this.loanId + "_" +timeStamp+ "_"+ file.name ;
        this.saoLoanLandMortageDetailsModel.documentPath = "LAND_MORTGAGE" + this.loanId + "_" +timeStamp+"_"+ file.name; // This will set the last file's name as docPath
      }
      reader.readAsDataURL(file);
    }
  }

  /**
   * @implements onFileremove from file value
   * @author akhila.m
   */
  fileRemoeEvent() {
    if (this.saoLoanLandMortageDetailsModel.filesDTOList != null && this.saoLoanLandMortageDetailsModel.filesDTOList != undefined && this.saoLoanLandMortageDetailsModel.filesDTOList.length > 0) {
      let removeFileIndex = this.saoLoanLandMortageDetailsModel.filesDTOList.findIndex((obj: any) => obj && obj.fileName === this.saoLoanLandMortageDetailsModel.documentPath);
      this.saoLoanLandMortageDetailsModel.filesDTOList[removeFileIndex] = null;
      this.saoLoanLandMortageDetailsModel.documentPath = null;
    }
  }
 
}
