import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanCollectionService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateTermCollection(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermCollection(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermCollectionById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermCollection(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermCollection(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  TermCollectionApproval(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.APPROVAL_TERM_COLLECTION_DETAILS)
  }
  getTermDemandByLoanApplicationId(id: string){
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.GET_DEMAND_BY_ACCOUNT_NUMBER);
  }
  getTermCillectionDetailsByLoanApplicationId(id: string){
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_COLLECTIONS + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_COLLECTION_BY_APPLICATION_ID);
  }
}
