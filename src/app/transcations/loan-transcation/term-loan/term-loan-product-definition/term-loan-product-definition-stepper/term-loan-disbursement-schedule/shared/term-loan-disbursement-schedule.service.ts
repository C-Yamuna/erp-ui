import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanDisbursementScheduleService {
  commonHttpService: any;

  updateTermLoanDisbursementSchedule(disbursementModel:any){
    return this.commonHttpService.put(disbursementModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_DISBURSEMENT_SCHEDULE + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addTermLoanDisbursementSchedule(disbursementModel:any){
    return this.commonHttpService.post(disbursementModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_DISBURSEMENT_SCHEDULE+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllTermLoanDisbursementSchedule(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_DISBURSEMENT_SCHEDULE + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getTermLoanDisbursementScheduleById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_DISBURSEMENT_SCHEDULE + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteTermLoanDisbursementSchedule(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_DISBURSEMENT_SCHEDULE + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermLoanDisbursementScheduleByProductId(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_DISBURSEMENT_SCHEDULE + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_DISBURSEMENT_SCHEDULE_LIST_BY_PRODUCT_ID);
  }
}
