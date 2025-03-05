import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class SaoLoanHistoryService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateSaoLoanExistedDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addSaoLoanExistedDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getSaoLoanExistedDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllSaoLoanExistedDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteSaoLoanExistedDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  getSaoLoanExistedDetailsByApplicationId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_EXIST_DETAILS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_HISTORY_BY_APPLICATION_ID);
  }

  getAllCollateralTypes(){
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.COLLATERAL_TYPES + Configuration.GET_ALL);
  }
}
