import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonConfigConstants } from '../common-config-constants';
import { Block } from './shared/block.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { BlockService } from './shared/block.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { CommonComponent } from 'src/app/shared/common.component';


@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit{

  products: [] = [];
  columns: any[] = [];
  gridListData: any[] = [];
  tempGridListData: any[] = [];
  msgs: any[] = [];
  gridListLength: Number | undefined;
  blockModel: Block = new Block();
  displayDialog: boolean = false;
  responseModel!: Responsemodel;
  deleteId: any;
  constructor(private router: Router, private blockService: BlockService,
    private encryptDecryptService: EncryptDecryptService,private commonComponent: CommonComponent,
  ) {
    this.columns = [
      { field: 'name', header: 'ERP.NAME' },
      { field: 'description', header: 'ERP.DESCRIPTION' },
      { field: 'statusName', header: 'ERP.STATUS' },
    ];

  }
  ngOnInit(): void {
    this.getAll();
  }
  addblock(){
    this.router.navigate([CommonConfigConstants.ADD_BLOCK]);  
  }
  getAll() {
    this.blockService.getAllBlock().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.gridListData = this.responseModel.data;
      } else {
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    });
  }

  editblock(rowData: any) {
    this.router.navigate([CommonConfigConstants.ADD_BLOCK], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  deleteData(rowData: any) {
    this.displayDialog = true;
    this.deleteId = rowData.id;
  }
  
  submit() {
    this.commonComponent.startSpinner();
    this.blockService.deleteBlock(this.deleteId).subscribe(response => {
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
}
