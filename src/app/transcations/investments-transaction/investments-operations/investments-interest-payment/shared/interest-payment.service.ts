import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class InterestPaymentService {

  constructor(private commonHttpService : CommonHttpService) { }

  getInterestPaymentsByInvestmentAcId(termAccId: any) {
    let headers = new HttpHeaders({ 'termAccId': termAccId + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.INVESTMENT_INTEREST_PAYMENT + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENT_BY_INVESTMENT_ID);
  }

  updateInterestPayment(interestPaymentModel: any) {
    return this.commonHttpService.put(interestPaymentModel, Headers, ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.INVESTMENT_INTEREST_PAYMENT + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addInterestPayment(interestPaymentModel: any) {
    return this.commonHttpService.post(interestPaymentModel, Headers, ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.INVESTMENT_INTEREST_PAYMENT + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  deleteInterestPayment(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.INVESTMENTS + ERP_TRANSACTION_CONSTANTS.INVESTMENT_INTEREST_PAYMENT + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
}
