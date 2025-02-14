import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class FdRequiredDocumentsService {

  constructor(private commonHttpService:CommonHttpService)  { }

  updateDocuments(object:any){
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMMULATIVE_REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addDocuments(object:any){
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMMULATIVE_REQUIRED_DOCUMENT_DETAILS+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllDocuments(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMMULATIVE_REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getDocuments(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMMULATIVE_REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteDocuments(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMMULATIVE_REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  getRequiredDocumentByFdCummulativeAccountId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS+ ERP_TRANSACTION_CONSTANTS.FD_CUMMULATIVE_REQUIRED_DOCUMENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_REQUIRED_DOCUMENT_DETAILS_BY_ACCOUNT_ID)
  }

  getAllRequiredDocumentsFromProductDefinition(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMULATIVE_REQUIRED_DOCUMENTS_CONFIG + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

 
}
