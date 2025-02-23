import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { GoldRatesService } from '../shared/gold-rates.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { GoldRates } from '../shared/gold-rates.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { LoanConfigConstants } from '../../loan-config-constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-gold-rates',
  templateUrl: './add-gold-rates.component.html',
  styleUrls: ['./add-gold-rates.component.css']
})
export class AddGoldRatesComponent {
  goldRateForm:FormGroup;
  goldQualityList: any[] = [];
  statusList: any[] = [];
  goldRatesModel: GoldRates = new GoldRates();
  responseModel!: Responsemodel;
  msgs: any[] = [];
  isEdit: any;
  stateListData: any[] = [];
  maxDate:any;
  orgnizationSetting:any;
  currentDate:any;
   constructor(private router:Router, private formBuilder:FormBuilder,
      private commonfunctionservice : CommonFunctionsService,private activateRoute: ActivatedRoute,
      private encryptService: EncryptDecryptService,private commonComponent: CommonComponent, private goldRateService: GoldRatesService,
     private datePipe: DatePipe,private commonFunctionsService: CommonFunctionsService,
    ){
      this.goldRateForm = this.formBuilder.group({
        date: new FormControl({ value: '', disabled: true },Validators.required),
        quality: new FormControl('',[Validators.required]),
        valueperGram: new FormControl('',[Validators.required]),
        description: new FormControl('',),
        statusName: new FormControl('',[Validators.required]),
  
  })
  }

  ngOnInit(): void {
    this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.goldQualityList = this.commonComponent.quality();
    this.statusList = this.commonComponent.status();

    this.currentDate = new Date();
    this.goldRatesModel.dateVal = this.datePipe.transform(this.currentDate, this.orgnizationSetting.datePipe);



      this.activateRoute.queryParams.subscribe(params => {
        if (params['id'] != undefined) {
          // this.commonComponent.startSpinner();
          let id = this.encryptService.decrypt(params['id']);
          this.isEdit = true;
          this.goldRateService.getGoldRatesById(id).subscribe(res => {
            this.responseModel = res;
            // this.commonComponent.stopSpinner();
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
              this.goldRatesModel = this.responseModel.data[0];
              if(this.goldRatesModel.date == null || this.goldRatesModel.date == undefined){
                this.goldRatesModel.dateVal = this.commonFunctionsService.currentDate();
              }
              if (this.goldRatesModel.date != null && this.goldRatesModel.date != undefined)
                this.goldRatesModel.dateVal = this.datePipe.transform(this.goldRatesModel.date, this.orgnizationSetting.datePipe);
            }
          });
        } else {
          this.isEdit = false;
          this.goldRatesModel.status = this.goldQualityList[0].value;
          this.goldRatesModel.status = this.statusList[0].value;
        }
      })
    
  }
  navigateToBack(){
    this.router.navigate([LoanConfigConstants.GOLD_RATES]); 
  }
  addOrUpdate() {
    //this.commonComponent.startSpinner();
    if (this.goldRatesModel.dateVal != null && this.goldRatesModel.dateVal != undefined) {
      this.goldRatesModel.date = this.commonFunctionsService.getUTCEpoch(new Date(this.goldRatesModel.dateVal));
    }
    if (this.isEdit) {
      this.goldRateService.updateGoldRates(this.goldRatesModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          //this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];  
            this.navigateToBack();
          }, 1000);
        } else {
         // this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];  
          }, 1000);
        }
      },
        error => {
          //this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];  
          }, 1000);
        });
    } else {
      this.goldRateService.addGoldRates(this.goldRatesModel).subscribe((response: any) => {
        this.responseModel = response;
        if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
          // this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'success',summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];  
            this.navigateToBack();
          }, 1000);
        } else {
          //this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];  
          }, 1000);
        }
      },
        error => {
          // this.commonComponent.stopSpinner();
          this.msgs =[{ severity: 'error',summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
          setTimeout(() => {
            this.msgs = [];  
          }, 1000);
        });
    }
  }
}
