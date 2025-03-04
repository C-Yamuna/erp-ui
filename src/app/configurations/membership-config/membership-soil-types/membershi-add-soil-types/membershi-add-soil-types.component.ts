import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipConfigConstants } from '../../membership-config-constants';
import { SoilTypesService } from '../shared/soil-types.service';
import { SoilTypes } from '../shared/soil-types.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-membershi-add-soil-types',
  templateUrl: './membershi-add-soil-types.component.html',
  styleUrls: ['./membershi-add-soil-types.component.css']
})
export class MembershiAddSoilTypesComponent {
  cities: any[] | undefined;
  soiltypeform: FormGroup;
  statusList: any[] = [];
  msgs: any[] = [];
  soilTypesModel: SoilTypes = new SoilTypes();
  responseModel!: Responsemodel;
  buttonDisabled: any;
  isEdit: any;

  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private soilTypesService: SoilTypesService,
    private activateRoute: ActivatedRoute,
    private commonComponent:CommonComponent,
    private encryptService: EncryptDecryptService,){ 
    this.soiltypeform = this.formBuilder.group({
      'name': new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
      'description': new FormControl(''), 
      'statusName': new FormControl('',[Validators.required]),
    })
  }

  ngOnInit() {
    this.statusList = this.commonComponent.status();
    this.activateRoute.queryParams.subscribe(params => {
      if (params['id'] != undefined) {
        this.commonComponent.startSpinner();
        let id = this.encryptService.decrypt(params['id']);
        this.isEdit = true;
        this.soilTypesService.getSoilTypesById(id).subscribe(res => {
          this.responseModel = res;
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.soilTypesModel = this.responseModel.data[0];
          } else {
            this.commonComponent.stopSpinner();
            this.buttonDisabled = applicationConstants.FALSE;
            this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
            setTimeout(() => {
              this.msgs = [];
            }, 2000);
          }
        });
      } else {
        this.isEdit = false;
        this.soilTypesModel.status = this.statusList[0].value;
      }
    })
  }

  addOrUpdate() {
    this.commonComponent.startSpinner();
    this.soilTypesModel.name =  this.soilTypesModel.name.trim();
    if (this.isEdit) {
      this.soilTypesService.updateSoilTypes(this.soilTypesModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          this.buttonDisabled = applicationConstants.FALSE;
          this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },error => {
          this.buttonDisabled = applicationConstants.FALSE;
          this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        });
    } else {
      this.soilTypesService.addSoilTypes(this.soilTypesModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
            this.navigateToBack();
          }, 2000);
        } else {
          this.commonComponent.stopSpinner();
          this.buttonDisabled = applicationConstants.FALSE;
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
        }
      },error => {
          this.commonComponent.stopSpinner();
          this.buttonDisabled = applicationConstants.FALSE;
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];
          }, 2000);
          this.buttonDisabled = applicationConstants.FALSE;
        });
    }
  }
  navigateToBack(){
    this.router.navigate([MembershipConfigConstants.SOIL_TYPES]);
  }
}
