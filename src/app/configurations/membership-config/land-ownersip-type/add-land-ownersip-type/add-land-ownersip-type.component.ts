import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LandOwnersipType } from '../shared/land-ownersip-type.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { LandOwnersipTypeService } from '../shared/land-ownersip-type.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MembershipConfigConstants } from '../../membership-config-constants';

@Component({
  selector: 'app-add-land-ownersip-type',
  templateUrl: './add-land-ownersip-type.component.html',
  styleUrls: ['./add-land-ownersip-type.component.css']
})
export class AddLandOwnersipTypeComponent {

  landownershiptypeform: FormGroup;
    statusList: any[] = [];
    landOwnershipTypeModel: LandOwnersipType = new LandOwnersipType();
    responseModel!: Responsemodel;
    msgs: any[] = [];
    isEdit: any;
    stateListData: any[] = [];
    maxDate: any;
    orgnizationSetting: any;
    requiredlist: any[] = [];

    constructor(private router: Router, private formBuilder: FormBuilder,
        private commonfunctionservice: CommonFunctionsService,
        private activateRoute: ActivatedRoute,
        private encryptService: EncryptDecryptService,
        private commonComponent: CommonComponent,
        private landOwnershipTypeService: LandOwnersipTypeService,
      ) {
        this.landownershiptypeform = this.formBuilder.group({
          name: new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_PATTERN), Validators.required]),
          description: new FormControl(''),
          code: new FormControl('', [Validators.required]),
          statusName: new FormControl('', [Validators.required]),

        })
      }

        ngOnInit(): void {
          this.orgnizationSetting = this.commonComponent.orgnizationSettings()
          this.statusList = this.commonComponent.statusList();
          this.activateRoute.queryParams.subscribe(params => {
            if (params['id'] != undefined) {
              // this.commonComponent.startSpinner();
              let id = this.encryptService.decrypt(params['id']);
              this.isEdit = true;
              this.landOwnershipTypeService.getLandownershipTypeById(id).subscribe(res => {
                this.responseModel = res;
                // this.commonComponent.stopSpinner();
                if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
                  this.landOwnershipTypeModel = this.responseModel.data[0];
                }
              });
            } else {
              this.isEdit = false;
              this.landOwnershipTypeModel.status = this.statusList[0].value;
            }
          })
      
        }

        navigateToBack() {
            this.router.navigate([MembershipConfigConstants.LAND_OWNERSHIP_TYPES]);
          }

          addOrUpdate() {
            //this.commonComponent.startSpinner();
            if (this.isEdit) {
              this.landOwnershipTypeService.updateLandOwnershipTypes(this.landOwnershipTypeModel).subscribe((response: any) => {
                this.responseModel = response;
                if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
                  //this.commonComponent.stopSpinner();
                  this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
                  setTimeout(() => {
                    this.msgs = [];
                    this.navigateToBack();
                  }, 1000);
                } else {
                  // this.commonComponent.stopSpinner();
                  this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
                  setTimeout(() => {
                    this.msgs = [];
                  }, 1000);
                }
              },
                error => {
                  //this.commonComponent.stopSpinner();
                  this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
                  setTimeout(() => {
                    this.msgs = [];
                  }, 1000);
                });
            } else {
              this.landOwnershipTypeService.addLandownershipTypes(this.landOwnershipTypeModel).subscribe((response: any) => {
                this.responseModel = response;
                if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
                  // this.commonComponent.stopSpinner();
                  this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
                  setTimeout(() => {
                    this.msgs = [];
                    this.navigateToBack();
                  }, 1000);
                } else {
                  //this.commonComponent.stopSpinner();
                  this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
                  setTimeout(() => {
                    this.msgs = [];
                  }, 1000);
                }
              },
                error => {
                  // this.commonComponent.stopSpinner();
                  this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
                  setTimeout(() => {
                    this.msgs = [];
                  }, 1000);
                });
            }
          }
}
