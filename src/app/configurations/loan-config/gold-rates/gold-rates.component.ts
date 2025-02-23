import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { GoldRatesService } from './shared/gold-rates.service';
import { GoldRates } from './shared/gold-rates.model';
import { Responsemodel } from 'src/app/shared/responsemodel';
import { LoanConfigConstants } from '../loan-config-constants';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gold-rates',
  templateUrl: './gold-rates.component.html',
  styleUrls: ['./gold-rates.component.css']
})
export class GoldRatesComponent {
  products: [] = [];
  columns: any[] = [];
  gridListData: any[] = [];
  tempGridListData: any[] = [];
  msgs: any[] = [];
  gridListLength: Number | undefined;
  GoldRatesModel: GoldRates = new GoldRates();
  displayDialog: boolean = false;
  responseModel!: Responsemodel;
  deleteId: any;
  orgnizationSetting:any;
  constructor(private router: Router, 
      private commonComponent: CommonComponent,
      private goldRatesService: GoldRatesService,
      private encryptDecryptService: EncryptDecryptService,
       private datePipe: DatePipe
    ) {
      this.columns = [
        { field: 'date', header: 'LOANS.DATE' },
        { field: 'quality', header: 'LOANS.QUALITY' },
        { field: 'valuePerGram', header: 'LOANS.VALUE_PER_GRAM' },
        { field: 'description', header: 'LOANS.DESCRIPTION' },
        { field: 'statusName', header: 'LOANS.STATUS' },
      ];
    }

      ngOnInit(): void {
        this.orgnizationSetting = this.commonComponent.orgnizationSettings();
        this.getAll();
      }
      addGoldRates() {
        this.router.navigate([LoanConfigConstants.ADD_GOLD_RATES]);
      }
      getAll() {
          // this.commonComponent.startSpinner();
          this.goldRatesService.getAllGoldRates().subscribe((data: any) => {
            this.responseModel = data;
            if (this.responseModel.status == applicationConstants.STATUS_SUCCESS) {
              this.gridListData = this.responseModel.data;

              const currentDate = this.datePipe.transform(new Date(), this.orgnizationSetting.datePipe);

              this.gridListData = this.gridListData.filter((data:any) => null!=data.date).map(count => {
                count.date = this.datePipe.transform(count.date, this.orgnizationSetting.datePipe);
               // Check if the date is the current date
                count.isEditable = (count.date === currentDate);
                return count;
              })
              // this.commonComponent.stopSpinner();
            } else {
              // this.commonComponent.stopSpinner();
              this.msgs = [];
              this.msgs = [{ severity: 'error', detail: this.responseModel.statusMsg }];
            }
          }, error => {
            // this.commonComponent.stopSpinner();
            this.msgs = [];
            this.msgs = [{ severity: "error", summary: 'Failed', detail: applicationConstants.WE_COULDNOT_PROCESS_YOU_ARE_REQUEST }];
          });
        }
        
        editkycdoctype(rowData: any) {
          this.router.navigate([LoanConfigConstants.ADD_GOLD_RATES], { queryParams: { id: this.encryptDecryptService.encrypt(rowData.id) } });
        }
      
        deleteData(rowData: any) {
          this.displayDialog = true;
          this.deleteId = rowData.id;
        }
      
        submit() {
          // this.commonComponent.startSpinner();
          this.goldRatesService.deleteGoldRates(this.deleteId).subscribe(response => {
            this.responseModel = response;
            this.msgs = [];
            if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
              // this.commonComponent.stopSpinner();
              this.displayDialog = false;
              this.msgs = [];
              this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
                this.getAll();
              }, 2000);
            } else {
              this.displayDialog = false;
              // this.commonComponent.stopSpinner();
              this.msgs = [{ severity: 'error', summary: applicationConstants.STATUS_ERROR, detail: this.responseModel.statusMsg }];
              setTimeout(() => {
                this.msgs = [];
              }, 2000);
            }
          }, error => {
            // this.commonComponent.stopSpinner();
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
