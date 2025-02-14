import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { DocumentTypesService } from '../document-types/shared/document-types.service';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { DocumentTypes } from '../document-types/shared/document-types.model';
import { MembershipConfigConstants } from '../membership-config-constants';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { LandTypesService } from './shared/land-types.service';
import { LandTypes } from './shared/land-types.model';

@Component({
  selector: 'app-land-types',
  templateUrl: './land-types.component.html',
  styleUrls: ['./land-types.component.css']
})
export class LandTypesComponent {

  columns: any[] = [];
  gridListData: any[] = [];
  tempGridListData: any[] = [];
  msgs: any[] = [];
  gridListLength: Number | undefined;
  LandTypeModel: LandTypes = new LandTypes();
  displayDialog: boolean = false;
  responseModel!: Responsemodel;
  deleteId: any;
  constructor(private router: Router,
    private commonComponent: CommonComponent,
    private landTypeService: LandTypesService,
    private encryptDecryptService: EncryptDecryptService,
  ) {
    this.columns = [
      { field: 'name', header: 'MEMBERSHIPCONFIG.NAME' },
      { field: 'code', header: 'MEMBERSHIPCONFIG.CODE' },
      { field: 'discription', header: 'MEMBERSHIPCONFIG.DESCRIPTION' },
      { field: 'statusName', header: 'MEMBERSHIPCONFIG.STATUS' },
    ];
  }
  ngOnInit(): void {
    this.getAll();
  }



  addLandtype() {
    this.router.navigate([MembershipConfigConstants.ADD_LAND_TYPES]);
  }

  getAll() {
    this.commonComponent.startSpinner();
    this.landTypeService.getAllLandTypes().subscribe((data: any) => {
      this.responseModel = data;
      if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
        this.gridListData = this.responseModel.data;
        this.commonComponent.stopSpinner();
      } else {
        this.commonComponent.stopSpinner();
        this.msgs = [];
        this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
      }
    }, error => {
      this.commonComponent.stopSpinner();
      this.msgs = [];
      this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
    });
  }

  editLandtype(rowData: any) {
    this.router.navigate([MembershipConfigConstants.ADD_LAND_TYPES], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
  }

  deleteData(rowData: any) {
    this.displayDialog = true;
    this.deleteId = rowData.id;
  }

  submit() {
    this.commonComponent.startSpinner();
    this.landTypeService.deleteLandType(this.deleteId).subscribe(response => {
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
