import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class SiLoanHistoryService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateSiLoanExistedDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SI_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addSiLoanExistedDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SI_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getSiLoanExistedDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllSiLoanExistedDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteSiLoanExistedDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  getSiLoanExistedDetailsByApplicationId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.SI_LOAN_HISTORY_BY_ACCOUNT_ID);
  }

  getAllCollateralTypes(){
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.COLLATERAL_TYPES + Configuration.GET_ALL);
  }
}
