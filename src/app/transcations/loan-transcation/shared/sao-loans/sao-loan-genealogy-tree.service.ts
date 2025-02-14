import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class SaoLoanGenealogyTreeService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateSaoLoanGenealogyTree(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_LOAN_GENEALOGY_TREE + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addSaoLoanGenealogyTree(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_LOAN_GENEALOGY_TREE + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getSaoLoanGenealogyTreeById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_GENEALOGY_TREE + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllSaoLoanGenealogyTree(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_GENEALOGY_TREE + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
 
  deleteSaoLoanGenealogyTree(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_GENEALOGY_TREE + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getSaoGenealogyTreeDetailsByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_GENEALOGY_TREE + ERP_TRANSACTION_CONSTANTS.GET_SAO_GENEALOGY_TREE_DETAILS_BY_LOAN_APPLICATION_ID);
  }
}
