import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class FdNonCummulativeInterestPaymentService {

  constructor(private commonHttpService:CommonHttpService) { }

  updateFdNonCumInterestPayment(object:any){
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addFdNonCumInterestPayment(object:any){
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllFdNonCumInterestPayment(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
 
  getFdNonCumInterestPayment(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteFdNonCumInterestPayment(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTransactionListBasedOnAccountWithDueInterestPayments(accountNumber:any){
    let headers = new HttpHeaders({ 'accountNumber': accountNumber + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET_TRANSACTION_LIST_BASED_ON_ACCOUNT_WITH_DUE_INTEREST_PAYMENTS);
  }
  getFdNonCumInterestPaymentByAccountNumber(accountNumber:any){
    let headers = new HttpHeaders({ 'accountNumber': accountNumber + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_LIST_WITH_INTEREST_PAYMENT_DETAILS);
  }
  getAllTransactionModes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.TRANSACTION_MODES + Configuration.GET_ALL);
  }

  getAllPaymentsByAccountIdAndAccountNumber(accountId:any,accountNumber:any){
    let headers = new HttpHeaders({'accountId': accountId + '', 'accountNumber': accountNumber + '' })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INTEREST_PAYMENTS + ERP_TRANSACTION_CONSTANTS.GET_ALL_PAYMENTS_BY_ACCOUNT_ID_AND_ACCOUNT_NUMBER);
  }

  
  updateFdNonCumTransaction(object:any){
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNTS_TRANSACTIONS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addFdNonCumTransaction(object:any){
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNTS_TRANSACTIONS + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  
}
