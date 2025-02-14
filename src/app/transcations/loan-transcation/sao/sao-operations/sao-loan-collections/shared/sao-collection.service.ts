import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class SaoCollectionService {
  constructor(private commonHttpService: CommonHttpService) { }

  updateSaoCollection(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addSaoCollection(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getSaoCollectionListByApplicationId(id: any){
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.GET_COLLECTION_LIST_BY_APPLICATION_ID);
  }
  getSaoDisbursementById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllSaoDisbursement(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteSaoDisbursement(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  approveSaoCollectionDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.APPROVE_SAO_COLLECTION_DETAILS)
  }
  getDemand(id: string, accountNumber: string) {
    let headers = new HttpHeaders({ 'id': id + '' , 'accountNumber':accountNumber+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_COLLECTION + ERP_TRANSACTION_CONSTANTS.GET_DEMAND);
  }
}
