import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class TermRequiredDocumentsConfigService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateTermRequiredDocumentsConfig(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_REQUIRED_DOCUMENTS_CONFIGS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermRequiredDocumentsConfig(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_REQUIRED_DOCUMENTS_CONFIGS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermRequiredDocumentsConfigById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_REQUIRED_DOCUMENTS_CONFIGS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermRequiredDocumentsConfig(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_REQUIRED_DOCUMENTS_CONFIGS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermRequiredDocumentsConfig(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_REQUIRED_DOCUMENTS_CONFIGS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
 
}
