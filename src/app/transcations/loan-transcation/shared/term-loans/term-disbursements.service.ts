import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class TermDisbursementsService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateTermDisbursements(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermDisbursements(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermDisbursementsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermDisbursements(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermDisbursements(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  termDisbursementApproval(loansModel: any)  {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.TERM_DISBURSEMENT_APPROVAL) 
   }
}
