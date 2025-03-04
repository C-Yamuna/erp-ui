import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { SiLinkedShareCapital } from './shared/si-linked-share-capital.model';
import { SimpleInterestProductDefinition } from '../../shared/simple-interest-product-definition.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { SimpleInterestProductDefinitionService } from '../../shared/simple-interest-product-definition.service';
import { SiLinkedShareCapitalService } from './shared/si-linked-share-capital.service';
import { BoxNumber } from 'src/app/transcations/common-status-data.json';

@Component({
  selector: 'app-si-linked-share-capital',
  templateUrl: './si-linked-share-capital.component.html',
  styleUrls: ['./si-linked-share-capital.component.css']
})
export class SiLinkedShareCapitalComponent {
  @ViewChild('dt', { static: false }) private dt!: Table;
  linkedShareCapitalList: any[] = [];
  displayDialog: boolean = applicationConstants.FALSE;
  linkedShareCapitalForm: FormGroup;
  newRow :any =null;
  editDeleteDisable:boolean = applicationConstants.FALSE;
  addButton:boolean = applicationConstants.FALSE;
  siLinkedShareCapitalModel :SiLinkedShareCapital = new SiLinkedShareCapital();
  simpleInterestProductDefinitionModel :SimpleInterestProductDefinition = new SimpleInterestProductDefinition();
  maxDate = new Date();
  minDate = new Date();
  orgnizationSetting:any;
  isEdit: any;
  siProductId: any;
  msgs: any[]=[];
  responseModel!: Responsemodel;
  enableSaveAndNextButton: boolean = applicationConstants.FALSE;

  gstApplicableList: any[]=[];
  collectionTypeList: any[]=[];
  amountAndTenureFlag: boolean = applicationConstants.TRUE;
  constructor(private formBuilder: FormBuilder,private commonComponent: CommonComponent,private activateRoute: ActivatedRoute,
    private datePipe: DatePipe,private commonFunctionService: CommonFunctionsService,private encryptService: EncryptDecryptService,
    private simpleInterestProductDefinitionService : SimpleInterestProductDefinitionService, private siLinkedShareCapitalService :SiLinkedShareCapitalService
  )
  { 
    this.linkedShareCapitalForm = this.formBuilder.group({
      'collectionType': new FormControl('', Validators.required),
      'collectionValue': new FormControl('',),
      'cgstPercentage': new FormControl('', ),
      'sgstPercentage': new FormControl('',),
      'igstPercentage': new FormControl('',),
      'minSlabAmount':new FormControl('', Validators.required),
      'gstApplicable': new FormControl('', Validators.required),
      'maxSlabAmount':new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings();
    this.gstApplicableList = this.commonComponent.requiredlist();
    this.collectionTypeList = this.commonComponent.collectiontypeList();
    this.activateRoute.queryParams.subscribe(params => {
      let encrypted = params['id'];
      if (encrypted!= undefined) {
        this.isEdit = applicationConstants.TRUE;
       
        this.siProductId = Number(this.encryptService.decrypt(encrypted));
          this.getPreviewDetailsByProductId(this.siProductId);
      } else {
        this.isEdit = applicationConstants.FALSE;
      }
      this.updateData();
    });
  
    this.linkedShareCapitalForm.valueChanges.subscribe((data: any) => {
      this.updateData();
      if (this.linkedShareCapitalForm.valid) {
        this.save();
      }
    });
  }
 /**
    @author vinitha
    @implements Integrating SI Loans Configuration details To Main Stepper Component
   */
  updateData() {
    this.siLinkedShareCapitalModel.siProductId = this.siProductId
    this.simpleInterestProductDefinitionService.changeData({
      formValid: this.enableSaveAndNextButton ,
      data: this.siLinkedShareCapitalModel,
      savedId:this.siProductId,
      stepperIndex: 2,
      isDisable: !this.linkedShareCapitalForm.valid ? applicationConstants.TRUE:applicationConstants.FALSE,
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
    this.newRow = {collectionType: '',collectionValue:'',minSlabAmount:'',maxSlabAmount:'',gstApplicable:'', cgstPercentage: '',sgstPercentage: '',igstPercentage:''}
  }
     /**
    @author vinitha
    @implementsRow Row Edit Cancel
   
   */
  onRowEditCancel() {
    this.addButton=applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    this.enableSaveAndNextButton = applicationConstants.TRUE;
    this.getPreviewDetailsByProductId(this.siProductId)
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
    @implements SI Loans Configuration details 
    @argument ProductId
   */
getPreviewDetailsByProductId(id: any) {
    this.isEdit = applicationConstants.TRUE;
    this.linkedShareCapitalList=[]
    this.simpleInterestProductDefinitionService.getPreviewDetailsByProductId(id).subscribe(res => {
      this.responseModel = res;
      this.commonComponent.stopSpinner();
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] != null) {
        this.simpleInterestProductDefinitionModel = this.responseModel.data[0];
        if (this.simpleInterestProductDefinitionModel != null && this.simpleInterestProductDefinitionModel != undefined) {

          if(null!=this.simpleInterestProductDefinitionModel.effectiveStartDate && undefined!=this.simpleInterestProductDefinitionModel.effectiveStartDate)
            this.simpleInterestProductDefinitionModel.effectiveStartDate = this.datePipe.transform(this.simpleInterestProductDefinitionModel.effectiveStartDate, this.orgnizationSetting.datePipe);
          
        if (this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != null && this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList != undefined &&
            this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList.length > 0) {

              this.enableSaveAndNextButton = applicationConstants.TRUE;

          this.linkedShareCapitalList = this.simpleInterestProductDefinitionModel.siLoanLinkedShareCapitalConfigDTOList;

        
         
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
  @implements It Saves the SI Loans Linked Share Capital data 
    @argument ProductId
   */

  saveInlineRow(rowData: any) {
    if(null != this.siLinkedShareCapitalModel.siProductId && undefined!=this.siLinkedShareCapitalModel.siProductId)
      rowData.siProductId = this.siLinkedShareCapitalModel.siProductId;
    this.addButton = applicationConstants.FALSE;
    this.editDeleteDisable = applicationConstants.FALSE;
    
  
     if(rowData.id != null)
      {
          this.siLinkedShareCapitalService.updateSiLinkedShareCapital(rowData).subscribe((response: any) => {
            this.responseModel = response;
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
              if (this.responseModel != null&& this.responseModel.data!= undefined) {
  
                
              if(null != rowData.siProductId && undefined!=rowData.siProductId)
               this.getPreviewDetailsByProductId(rowData.siProductId);
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
              this.getPreviewDetailsByProductId(this.siProductId);
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
       this.siLinkedShareCapitalService.addSiLinkedShareCapital(rowData).subscribe((response: any) => {
         this.responseModel = response;
         if (this.responseModel.status === applicationConstants.STATUS_SUCCESS && this.responseModel.data[0] !=null) {
          if (this.responseModel != null&& this.responseModel.data!= undefined) {
  
        
          this.linkedShareCapitalList.unshift(this.responseModel.data[0]);
          this.linkedShareCapitalList.splice(1, 1);
          if(null != rowData.siProductId && undefined!=rowData.siProductId)
            this.getPreviewDetailsByProductId(rowData.siProductId);
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
           this.getPreviewDetailsByProductId(this.siProductId);
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
     collectiontypeDuplicateCheck(selectedcollectionType: any) {
      // Check if there is any row in the list with the same serviceTypeId as the selected one
      const isDuplicate = this.linkedShareCapitalList.some(row => 
        row.collectionType === selectedcollectionType &&
        row.id !== this.siLinkedShareCapitalModel.id 
      );
    
      if (isDuplicate) {
        this.linkedShareCapitalForm.get('collectionTypeName')?.reset();
        this.msgs = [{ severity: 'error',  detail:applicationConstants.COLLECTION_TYPE_ALREADY_EXIST}];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
        return applicationConstants.TRUE;
      }
    
  
      return applicationConstants.FALSE;
    }
     checkForAmount(box : any): void {
       const minSlabAmount = this.linkedShareCapitalForm.get('minSlabAmount')?.value;
            const maxSlabAmount = this.linkedShareCapitalForm.get('maxSlabAmount')?.value;
        
            if (minSlabAmount != null && minSlabAmount !='' && maxSlabAmount != null && maxSlabAmount !='' &&
              Number(minSlabAmount) > Number(maxSlabAmount)) {
              this.msgs = [];
              if (box == BoxNumber.BOX_ONE) {
                this.msgs.push({ severity: 'warning', detail: applicationConstants.MINIMUM_SLAB_AMOUNT_SHOULD_BE_LESS_THAN_OR_EQUAL_TO_MAXIMUM_SLAB_AMOUNT });
                this.linkedShareCapitalForm.get('minSlabAmount')?.reset();
              } else if (box == BoxNumber.BOX_TWO) {
                this.msgs.push({ severity: 'warning', detail: applicationConstants.MAXIMUM_SLAB_AMOUNT_SHOULD_BE_GREATER_THAN_OR_EQUAL_TO_MINIMUM_SLAB_AMOUNT });
                this.linkedShareCapitalForm.get('maxSlabAmount')?.reset();
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
}
