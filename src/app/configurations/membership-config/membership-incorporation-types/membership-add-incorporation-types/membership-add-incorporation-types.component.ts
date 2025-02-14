import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipConfigConstants } from '../../membership-config-constants';
import { IncorporationTypesService } from '../shared/incorporation-types.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { CommonComponent } from 'src/app/shared/common.component';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { IncorporationTypes } from '../shared/incorporation-types.model';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-membership-add-incorporation-types',
  templateUrl: './membership-add-incorporation-types.component.html',
  styleUrls: ['./membership-add-incorporation-types.component.css']
})
export class MembershipAddIncorporationTypesComponent {

  incorporationtypeform: FormGroup;
  incorporationTypesModel: IncorporationTypes = new IncorporationTypes();
  statusList: any[] = [];
  msgs: any[] = [];
  responseModel!: Responsemodel;
  buttonDisabled: any;
  isEdit: any;

  constructor(private router: Router, 
    private formBuilder: FormBuilder,
    private incorporationTypesService:IncorporationTypesService,
    private activateRoute: ActivatedRoute,
    private commonComponent:CommonComponent,
    private encryptService: EncryptDecryptService,){ 
    this.incorporationtypeform = this.formBuilder.group({
      'name':  new FormControl('', [Validators.pattern(applicationConstants.NEW_NAME_VALIDATIONS),Validators.required]),
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
        this.incorporationTypesService.getIncorporationTypesById(id).subscribe(res => {
          this.responseModel = res;
          this.commonComponent.stopSpinner();
          if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
            this.incorporationTypesModel = this.responseModel.data[0];
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
        this.incorporationTypesModel.status = this.statusList[0].value;
      }
    })
  }

  addOrUpdate() {
    this.commonComponent.startSpinner();
    this.incorporationTypesModel.name =  this.incorporationTypesModel.name.trim();
    if (this.isEdit) {
      this.incorporationTypesService.updateIncorporationTypes(this.incorporationTypesModel).subscribe((response: any) => {
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
      this.incorporationTypesService.addIncorporationTypes(this.incorporationTypesModel).subscribe((response: any) => {
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
    this.router.navigate([MembershipConfigConstants.INCORPORATION_TYPES]);
  }
}
