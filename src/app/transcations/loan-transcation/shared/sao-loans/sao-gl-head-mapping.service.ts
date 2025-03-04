import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class SaoGlHeadMappingService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateSaoGlHeadMapping(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_GL_HEAD_MAPPING + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addSaoGlHeadMapping(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_GL_HEAD_MAPPING + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getSaoGlHeadMappingById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_GL_HEAD_MAPPING + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllSaoTransactionDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_GL_HEAD_MAPPING + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteSaoTransactionDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_GL_HEAD_MAPPING + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getGlHeadMappingDetailsByProductId(productId: string) {
    let headers = new HttpHeaders({ 'productId': productId + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_GL_HEAD_MAPPING + ERP_TRANSACTION_CONSTANTS.GET_GL_HEAD_MAPPING_DETAILS_BY_PRODUCT_ID);
  }
}
