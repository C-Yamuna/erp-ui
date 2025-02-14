import { Component } from '@angular/core';
import { LandTypes } from '../shared/land-types.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { MembershipConfigConstants } from '../../membership-config-constants';
import { LandTypesService } from '../shared/land-types.service';

@Component({
  selector: 'app-add-land-types',
  templateUrl: './add-land-types.component.html',
  styleUrls: ['./add-land-types.component.css']
})
export class AddLandTypesComponent {

  landtypeform: FormGroup;
  statusList: any[] = [];
  landTypeModel: LandTypes = new LandTypes();
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
    private landTypesService: LandTypesService,
  ) {
    this.landtypeform = this.formBuilder.group({
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
        this.landTypesService.getLandTypeById(id).subscribe(res => {
          this.responseModel = res;
          // this.commonComponent.stopSpinner();
          if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
            this.landTypeModel = this.responseModel.data[0];
          }
        });
      } else {
        this.isEdit = false;
        this.landTypeModel.status = this.statusList[0].value;
      }
    })

  }

  navigateToBack() {
    this.router.navigate([MembershipConfigConstants.LAND_TYPES]);
  }
  addOrUpdate() {
    //this.commonComponent.startSpinner();
    if (this.isEdit) {
      this.landTypesService.updateLandTypes(this.landTypeModel).subscribe((response: any) => {
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
      this.landTypesService.addLandTypes(this.landTypeModel).subscribe((response: any) => {
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
