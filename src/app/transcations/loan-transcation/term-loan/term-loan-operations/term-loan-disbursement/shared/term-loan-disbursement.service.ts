import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanDisbursementService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateTermDisbursement(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermDisbursement(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermDisbursementById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermDisbursement(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermDisbursement(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  TermDisbursementApproval(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENT_APPROVAL)
  }
  getTermDisbursmentDetailsByLoanApplicationId(id: string){
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.GET_TERM_DISBURSEMENT_LIST_BY_APPLICATION_ID);
  }

  updateTermTransactionDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermTransactionDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermTransactionDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermTransactionDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermTransactionDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  GetAllTransactionDetailsByModuleType(id: string ,moduleType: string) {
    let headers = new HttpHeaders({ 'id': id + '' ,'moduleType':moduleType + ''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_DETAILS_BY_MODULE_TYPE);
  }
 GetAllTransactionDetailsByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_DETAILS_BY_LOAN_APPLICATION_ID);
  }

  getTermDisbursmentScheduleByLoanProductId(id: string){
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_DISBURSEMENT_SCHEDULE + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_DISBURSEMENT_SCHEDULE_LIST_BY_PRODUCT_ID);
  }

  getTermDisbursmentListByApplicationId(id: string){
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.GET_TERM_DISBURSEMENT_LIST_BY_APPLICATIONID);
  }
  
}
