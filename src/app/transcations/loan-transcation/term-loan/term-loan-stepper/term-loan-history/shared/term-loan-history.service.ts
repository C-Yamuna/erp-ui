import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanHistoryService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateTermLoanExistedDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_LOAN_EXISTING_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermLoanExistedDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_LOAN_EXISTING_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermLoanExistedDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_EXISTING_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermLoanExistedDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_EXISTING_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermLoanExistedDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_EXISTING_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  getTermLoanExistedDetailsByApplicationId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_EXISTING_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_BY_LOAN_ACCOUNT_ID);
  }

  getAllCollateralTypes(){
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.COLLATERAL_TYPES + Configuration.GET_ALL);
  }
}
