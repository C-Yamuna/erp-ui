import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoanConfigConstants } from '../loan-config-constants';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ScaleOfFinanceConfigsService } from './shared/scale-of-finance-configs.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DatePipe } from '@angular/common';
import { CommonComponent } from 'src/app/shared/common.component';

@Component({
  selector: 'app-scale-of-finance-config',
  templateUrl: './scale-of-finance-config.component.html',
  styleUrls: ['./scale-of-finance-config.component.css']
})
export class ScaleOfFinanceConfigComponent implements OnInit{
  loanscaleoffinanceconfig: any[] = [];
  msgs: any[] = [];
  responseModel!: Responsemodel;
  gridList: any[] = [];
  id :  any;
  scaleOfConifgList: any;
  displayDialog: boolean = false;
  orgnizationSetting: any;
  deleteId: any;
  uomTypesList: any[]=[];
  constructor(private router: Router,private scaleOfFinanceConfigService : ScaleOfFinanceConfigsService,private encryptDecryptService: EncryptDecryptService
    ,private datePipe:DatePipe,private commonComponent: CommonComponent)
     { 
      this.loanscaleoffinanceconfig = [
        //{ field: 'pacsCode', header: 'PACS CODE' },
        { field: 'financialYear', header: 'LOANS.FINANCIAL_YEAR' },
        { field: 'cropTypeName', header: 'LOANS.CROP_TYPE' },
        { field: 'uomName', header: 'LOANS.UOM' },
        { field: 'maxAmount', header: 'LOANS.LIMIT' },
        { field: 'effectiveStartDate', header: 'LOANS.EFFECTIVE_START_DATE' },
       // { field: 'endDate', header: 'LOANS.END_DATE' },
        { field: 'statusName', header: 'LOANS.STATUS' },
      ];
     }
  ngOnInit() {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.getAllUomTypes();
   
    
  }
  addData(){
    this.router.navigate([LoanConfigConstants.ADD_SCALE_OF_FINANCE_CONFIG]);
  }
  getAll(){
    this.scaleOfFinanceConfigService.getAllScaleOfFinanceConfigs().subscribe((response: any) => {
      this.responseModel = response;
     
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.gridList = this.responseModel.data;
        this.gridList = this.responseModel.data.map((obj:any) => {
          obj.effectiveStartDate = this.datePipe.transform(obj.effectiveStartDate, this.orgnizationSetting.datePipe);
          obj.endDate = this.datePipe.transform(obj.endDate, this.orgnizationSetting.datePipe);
          let uom = this.uomTypesList.find( (object:any) => obj.uomType == object.value);
          if(uom != null && uom != undefined){
            obj.uomName = uom.label;
          }
          //obj.financialYear = this.datePipe.transform(obj.financialYear, this.orgnizationSetting.datePipe)
          return obj;
        })
       // this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      } else {
        this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
      
    });
  }
  delete(rowData:any){
    this.displayDialog = true;
    this.deleteId = rowData.id;
  }
  submit() {
    this.commonComponent.startSpinner();
    this.scaleOfFinanceConfigService.deleteScaleOfFinanceConfigs(this.deleteId).subscribe(response => {
      this.responseModel = response;
      this.msgs = [];
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        this.commonComponent.stopSpinner();
        this.displayDialog = false;
        this.msgs = [];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
          this.getAll();
        }, 2000);
      } else {
        this.displayDialog = false;
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    });
  }
  cancel() {
    this.displayDialog = false;
  }
  navigateToEdit(rowData:any){
    this.router.navigate([LoanConfigConstants.ADD_SCALE_OF_FINANCE_CONFIG], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } })
  }

  /**
   * @implements get all crop Types 
   * @author jyothi.naidana
   */
  getAllUomTypes(){
    this.scaleOfFinanceConfigService.getAllUom().subscribe((response : any )=>{
      this.responseModel  = response;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.uomTypesList = this.responseModel.data;
        this.uomTypesList = this.uomTypesList.filter((obj: any) => obj != null && obj.status == applicationConstants.ACTIVE && obj.name != null).map((relationType: { name: any; id: any; }) => {
          return { label: relationType.name, value: relationType.id };
        });
        this.getAll();
      }
      else {
        this.msgs = [];
        this.getAll();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }
    });
  }
}
