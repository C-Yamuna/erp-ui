import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanFieldVisitService {

  constructor(private commonHttpService:CommonHttpService) { }

  updateTermLoanFieldVisit(fieldvisitModel:any){
    return this.commonHttpService.put(fieldvisitModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_FIELD_VISIT_CONFIG + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addTermLoanFieldVisit(fieldvisitModel:any){
    return this.commonHttpService.post(fieldvisitModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_FIELD_VISIT_CONFIG+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllTermLoanFieldVisit(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_FIELD_VISIT_CONFIG + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getTermLoanFieldVisitById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_FIELD_VISIT_CONFIG + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteTermLoanFieldVisit(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_FIELD_VISIT_CONFIG + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermLoanRequiredFieldVisitByProductId(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_FIELD_VISIT_CONFIG + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_FIELD_VISIT_LIST_BY_PRODUCT_ID);
  }

}
