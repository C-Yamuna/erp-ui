import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TERMDEPOSITCONFIGCONSTANTS } from '../term-deposit-config-constants';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonCategoryService } from './shared/common-category.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-td-common-category',
  templateUrl: './td-common-category.component.html',
  styleUrls: ['./td-common-category.component.css']
})
export class TdCommonCategoryComponent implements OnInit{
  tdcommoncategory: any[] = [];
  tdcommoncategorytypes: any[] = [];
  responseModel!: Responsemodel;
  columns: any[] = [];
  gridListData: any[] = [];
  msgs: any[] = [];
  displayDialog!: boolean;
  id: any;

  constructor(private router: Router, private encryptDecryptService: EncryptDecryptService, private commonComponent:CommonComponent,
private commonCategoryService:CommonCategoryService)
     { }
  ngOnInit() {
 
    this.columns = [
      { field: 'name', header: 'TERMDEPOSITS.NAME' },
      { field: 'description', header: 'TERMDEPOSITS.DESCRIPTION' },
      { field: 'statusName', header: 'TERMDEPOSITS.STATUS' }
     
    ];

    this.tdcommoncategorytypes = [
      { field: 'name', header: 'TERMDEPOSITS.NAME' },
      { field: 'description', header: 'TERMDEPOSITS.DESCRIPTION' },
      { field: 'statusName', header: 'TERMDEPOSITS.STATUS' }
    ];
    this.getAll();
  }
  addData(){
    this.router.navigate([TERMDEPOSITCONFIGCONSTANTS.ADD_COMMON_CATEGORY]);
  }

  getAll() {
    this.commonComponent.startSpinner();
    this.commonCategoryService.getAllCommonCategory().subscribe((data: any) => {
      this.responseModel = data;
      this.gridListData = this.responseModel.data;
      this.commonComponent.stopSpinner();
    },
      error => {
        this.msgs = [];
        this.commonComponent.stopSpinner();
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      });
  }

 

  editData(row:any) {
    this.router.navigate([TERMDEPOSITCONFIGCONSTANTS.ADD_COMMON_CATEGORY], { queryParams: { id: this.encryptDecryptService.encrypt(row.id) } })
  }

  deleteData(row:any) {
    this.displayDialog = true;
    this.id = row.id;
  }

  delete(){
    this.commonComponent.startSpinner();
    this.commonCategoryService.deleteCommonCategory(this.id).subscribe(response=>{
      this.responseModel = response;
      if(this.responseModel.status == applicationConstants.STATUS_SUCCESS){
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];  
        }, 2000);
        this.displayDialog = false;
        this.getAll();
      }else{
        this.displayDialog = false;
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
        }, 2000);
      }

    },error=>{
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
      setTimeout(() => {
        this.msgs = [];
      }, 2000);
    })

  }

  noDelete() {
    this.displayDialog = false;
  }
}
