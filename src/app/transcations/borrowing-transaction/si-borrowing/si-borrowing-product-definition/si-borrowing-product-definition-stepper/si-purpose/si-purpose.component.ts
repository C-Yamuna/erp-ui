import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SiBorrowingProductDefinition } from '../../shared/si-borrowing-product-definition.model';
import { SiPurpose } from './shared/si-purpose.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SiBorrowingProductDefinitionService } from '../../shared/si-borrowing-product-definition.service';
import { SiPurposeService } from './shared/si-purpose.service';

@Component({
  selector: 'app-si-purpose',
  templateUrl: './si-purpose.component.html',
  styleUrls: ['./si-purpose.component.css']
})
export class SiPurposeComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;
  purposeList: any[] = [];
  displayDialog: boolean = applicationConstants.FALSE;
  purposeForm: FormGroup;
  newRow :any =null;
  editDeleteDisable:boolean = applicationConstants.FALSE;
  addButton:boolean = applicationConstants.FALSE;
  siProductDefinitionModel :SiBorrowingProductDefinition = new SiBorrowingProductDefinition();
  siProdPurposesModel : SiPurpose = new SiPurpose();
  maxDate = new Date();
  orgnizationSetting:any;
  isEdit: any;
  productId: any;
  msgs: any[]=[];
  responseModel!: Responsemodel;
  enableSaveAndNextButton: boolean = applicationConstants.FALSE;
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  purposeTypeList: any[]=[];
  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private commonFunctionService: CommonFunctionsService,private encryptService: EncryptDecryptService,
    private siBorrowingProductDefinitionService : SiBorrowingProductDefinitionService, private siPurposeService :SiPurposeService,
  )
  { 
    this.purposeForm = this.formBuilder.group({
      'purposeId': new FormControl('', ),
      'gesitationPeriod': new FormControl('', Validators.required),
      'maxGesitationPeriod':new FormControl('', Validators.required),
      'remarks':new FormControl('', ),
      
    });
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted!= undefined) {
        this.isEdit = applicationConstants.TRUE;
       
        this.productId = Number(this.encryptService.decrypt(encrypted));
          this.getPreviewDetailsByProductId(this.productId);
      } else {
        this.isEdit = applicationConstants.FALSE;
      }
      this.updateData();
    });
  
    this.purposeForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.purposeForm.valid) {
        this.save();
      }
    });
  
  }
 /**
    @author vinitha
    @implements Integrating SI Borrowings Configuration details To Main Stepper Component
   */
  updateData() {
    this.siProdPurposesModel.productId = this.productId
    this.siBorrowingProductDefinitionService.changeData({
      formValid: this.enableSaveAndNextButton ,
      data: this.siProdPurposesModel,
      savedId:this.productId,
      stepperIndex: 4,
      isDisable: !this.purposeForm.valid ? applicationConstants.TRUE:applicationConstants.FALSE,
    });
  }
     /**
    @author vinitha
    @implements To Call update Data function to integrate data to main stepper
   */
  save() {
    this.updateData();
  }
  
  addInlineRow() {
    this.addNewEntry();
    this.editDeleteDisable = applicationConstants.TRUE;;
    this.addButton = applicationConstants.TRUE;;
    this.dt._first = 0;
    this.dt.value.unshift(this.newRow);
    this.dt.initRowEdit(this.dt.value[0]);
    this.enableSaveAndNextButton = applicationConstants.FALSE;  
    this.updateData();
  }

  addNewEntry()
  {
    this.newRow = {purposeId: '',gesitationPeriod:'',maxGesitationPeriod:'',remarks:''}
  }
     /**
    @author vinitha
    @implementsRow Row Edit Cancel
   
   */
  onRowEditCancel() {
    this.addButton=applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    this.enableSaveAndNextButton = applicationConstants.TRUE;
    const index = this.dt.value.indexOf(this.newRow);
    if (index > -1) {
      this.dt.value.splice(index, 1);
    }
    this.addNewEntry();
    this.updateData();
  }
/**
    @author vinitha
    @implements edit inline row
   
   */
  editInlineRow(row:any) {
    this.addButton = applicationConstants.TRUE;
    this.editDeleteDisable = applicationConstants.TRUE; 
    this.enableSaveAndNextButton = applicationConstants.FALSE;  
    this.updateData();
  }
 /**
    @author vinitha
    @implements SI Borrowings Configuration details 
    @argument ProductId
   */
getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.purposeList=[]
    this.siBorrowingProductDefinitionService.getPreviewByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.siProductDefinitionModel = this.responseModel.data[0];
        if (this.siProductDefinitionModel != null && this.siProductDefinitionModel != undefined) {

          if(null!=this.siProductDefinitionModel.effectiveStartDate && undefined!=this.siProductDefinitionModel.effectiveStartDate)
            this.siProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.siProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          
        if (this.siProductDefinitionModel.siProductPurposeConfigDTO != null && this.siProductDefinitionModel.siProductPurposeConfigDTO != undefined &&
            this.siProductDefinitionModel.siProductPurposeConfigDTO.length > 0) {

              this.enableSaveAndNextButton = applicationConstants.TRUE;

          this.purposeList = this.siProductDefinitionModel.siProductPurposeConfigDTO;

        
         
        }
        else{
          this.enableSaveAndNextButton = applicationConstants.FALSE;
        }
      }
      this.updateData();
      }else {
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail:  applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      this.commonComponent.stopSpinner();
    });
  }
 /**
    @author vinitha
  @implements It Saves the SI Borrowings Linked Share Capital data 
    @argument ProductId
   */

  saveInlineRow(rowData: any) {
    if(null != this.siProdPurposesModel.productId && undefined!=this.siProdPurposesModel.productId)
      rowData.productId = this.siProdPurposesModel.productId;
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
   
    this.purposeTypeList.filter((purposetype: any) => purposetype != null && purposetype.value == this.siProdPurposesModel.purposeId).map((act: { label: any; }) => {
      this.siProdPurposesModel.purposeName = act.label;
    });
 
  
     if(rowData.id != null)
      {
          this.siPurposeService.updateSiPurpose(rowData).subscribe((response: any) => {
            this.responseModel = response;
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
              if (this.responseModel != null&& this.responseModel.data!= undefined) {
  
             
              if(null != rowData.productId && undefined!=rowData.productId)
               this.getPreviewDetailsByProductId(rowData.productId);
              this.commonComponent.stopSpinner();
              this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];  
              }, 2000);
            }
            } else {
             this.commonComponent.stopSpinner();
              this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];  
              }, 2000);
              this.getPreviewDetailsByProductId(this.productId);
            }
          },
            error => {
              this.commonComponent.stopSpinner();
              this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];  
              }, 2000);
            });
    } else {
      rowData.status = applicationConstants.ACTIVE;
       this.siPurposeService.addSiPurpose(rowData).subscribe((response: any) => {
         this.responseModel = response;
         if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
          if (this.responseModel != null&& this.responseModel.data!= undefined) {
  
         
          this.purposeList.unshift(this.responseModel.data[0]);
          this.purposeList.splice(1, 1);
          if(null != rowData.productId && undefined!=rowData.productId)
            this.getPreviewDetailsByProductId(rowData.productId);
           this.commonComponent.stopSpinner();
           this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
           setTimeout(() => {
             this.msgs = [];  
           }, 2000);
          }
         } else {
           this.commonComponent.stopSpinner();
           this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
           setTimeout(() => {
             this.msgs = [];  
           }, 2000);
           this.getPreviewDetailsByProductId(this.productId);
         }
       },
         error => {
           this.commonComponent.stopSpinner();
           this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
           setTimeout(() => {
             this.msgs = [];  
           }, 2000);
         });
     }
     }
     checkForGestationPeriod(){
      const gesitationPeriod = this.purposeForm.get('gesitationPeriod')?.value;
      const maxGesitationPeriod = this.purposeForm.get('maxGesitationPeriod')?.value;
  
      if (gesitationPeriod && maxGesitationPeriod &&  gesitationPeriod >=maxGesitationPeriod) {
        this.amountAndTenureFlag = applicationConstants.FALSE;
        this.msgs = [{ severity: 'error', detail: applicationConstants.GESTATION_PERIOD_ERROR }];
        setTimeout(() => {
          this.msgs = [];
        }, 1500);
      } else {
        this.msgs = [];
        this.amountAndTenureFlag = applicationConstants.TRUE;
      }
  
     
      this.updateData();
    }
}
