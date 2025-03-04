import { Component } from '@angular/core';
import { LandOwnersipType } from './shared/land-ownersip-type.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { LandOwnersipTypeService } from './shared/land-ownersip-type.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MembershipConfigConstants } from '../membership-config-constants';

@Component({
  selector: 'app-land-ownersip-type',
  templateUrl: './land-ownersip-type.component.html',
  styleUrls: ['./land-ownersip-type.component.css']
})
export class LandOwnersipTypeComponent {

   columns: any[] = [];
    gridListData: any[] = [];
    tempGridListData: any[] = [];
    msgs: any[] = [];
    gridListLength: Number | undefined;
    LandOwnershipTypeModel: LandOwnersipType = new LandOwnersipType();
    displayDialog: boolean = false;
    responseModel!: Responsemodel;
    deleteId: any;
    constructor(private router: Router,
      private commonComponent: CommonComponent,
      private landOwnersipTypeService: LandOwnersipTypeService,
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

    addLandownershipTypes() {
      this.router.navigate([MembershipConfigConstants.ADD_LAND_OWNERSHIP_TYPES]);
    }

    getAll() {
        this.commonComponent.startSpinner();
        this.landOwnersipTypeService.getAllLandownershipTypes().subscribe((data: any) => {
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
          this.router.navigate([MembershipConfigConstants.ADD_LAND_OWNERSHIP_TYPES], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        }
      
        deleteData(rowData: any) {
          this.displayDialog = true;
          this.deleteId = rowData.id;
        }
      
        submit() {
          this.commonComponent.startSpinner();
          this.landOwnersipTypeService.deleteLandownershipType(this.deleteId).subscribe(response => {
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
