import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonComponent } from 'src/app/shared/common.component';
import { EncryptDecryptService } from 'src/app/shared/encrypt-decrypt.service';
import { TERMDEPOSITCONFIGCONSTANTS } from '../term-deposit-config-constants';
import { WorkflowService } from './shared/workflow.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';

@Component({
  selector: 'app-td-work-flow',
  templateUrl: './td-work-flow.component.html',
  styleUrls: ['./td-work-flow.component.css']
})
export class TdWorkFlowComponent implements OnInit {

  workFloStepsList: any;
  columns: any[] = [];
  responseModel: any;
  subColumns: any[] = [];
  msgs:any[]=[];
  displayDialog:boolean=applicationConstants.FALSE;
  orgnizationSetting:any;
  deleteId: any;

  constructor(private encryptDecryptService: EncryptDecryptService,private router:Router,  private commonComponent: CommonComponent,
    private workFlowService:WorkflowService,private datePipe:DatePipe) { 
      this.workFloStepsList = [];
      this.columns = [
        { field: 'name', header: 'TERMDEPOSITS.WORK_FLOW_NAME' },
        { field: 'code', header: 'TERMDEPOSITS.CODE' },
        { field: 'categoryName', header: 'TERMDEPOSITS.COMMON_CATEGORYS' },
        { field: 'noOfSteps', header: 'TERMDEPOSITS.NO_OF_STEPS' },
        { field: 'isExceptionalName', header: 'TERMDEPOSITS.IS_EXCEPTIONAL' },
        { field: 'effStartDate', header: 'TERMDEPOSITS.EFFECTIVE_START_DATE' },
        { field: 'effEndDate', header: 'TERMDEPOSITS.EFFECTIVE_END_DATE' },
        // { field: 'statusName', header: 'DEMANDDEPOSITS.STATUS' },
  
      ]
      this.subColumns = [
        { field: 'commonStatusName', header: 'TERMDEPOSITS.WORK_FLOW_NAME' },
        { field: 'levelName', header: 'TERMDEPOSITS.ACTOR' },
        { field: 'prevStepName', header: 'TERMDEPOSITS.PREV_STEP' },
        { field: 'statusName', header: 'TERMDEPOSITS.STATUS' }    
        ];
    }

  ngOnInit() {

  this.orgnizationSetting = this.commonComponent.orgnizationSettings()
    this.getAllWorkFlow();
  }

  getAllWorkFlow() {
    this.commonComponent.startSpinner();
    this.workFlowService.getAllWorkFlow().subscribe((data: any) => {
      this.responseModel = data;
      this.workFloStepsList = this.responseModel.data.map((obj: { effStartDate: string | number | Date | null; effEndDate: string | number | Date | null; }) => {
        obj.effStartDate=this.datePipe.transform(obj.effStartDate, this.orgnizationSetting.datePipe);
        obj.effEndDate=this.datePipe.transform(obj.effEndDate, this.orgnizationSetting.datePipe);
        return obj;
      })
      this.commonComponent.stopSpinner();
    });
  }
  
  addData(){
    this.router.navigate([TERMDEPOSITCONFIGCONSTANTS.ADD_WORK_FLOW]);
  }
  editWorkflowStep(data:any) {
  
    this.router.navigate([TERMDEPOSITCONFIGCONSTANTS.ADD_WORK_FLOW], { queryParams: { id: this.encryptDecryptService.encrypt(data.id) } })
  }

  submit(){
    this.commonComponent.startSpinner();
    this.workFlowService.deleteWorkFlow(this.deleteId).subscribe(response => {
      this.responseModel = response;
      this.msgs = [];
      if (this.responseModel.status === applicationConstants.STATUS_SUCCESS) {
        if (this.responseModel.data != null && this.responseModel.data != undefined) {
        this.commonComponent.stopSpinner();
        this.displayDialog = applicationConstants.FALSE;
        this.msgs = [];
        this.msgs = [{ severity: 'success', summary: applicationConstants.STATUS_SUCCESS, detail: this.responseModel.statusMsg }];
        setTimeout(() => {
          this.msgs = [];
          this.getAllWorkFlow();
        }, 2000);
      }
      } else {
        this.displayDialog = applicationConstants.FALSE;
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

  deleteData(rowData: any) {
    this.displayDialog = applicationConstants.TRUE;
    this.deleteId = rowData.id;
  }
  cancel() {
    this.displayDialog = applicationConstants.FALSE;
  }
 
}


