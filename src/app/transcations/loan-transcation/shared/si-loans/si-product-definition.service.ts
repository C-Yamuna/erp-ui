import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class SiProductDefinitionService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateSIProductDefinition(loansModel: any) {
    return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addSIProductDefinition(loansModel: any) {
    return this.commonHttpService.post(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getSIProductDefinitionById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllSIProductDefinition() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteSIProductDefinition(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getSIProductDefinitionPreviewByProductId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_SI_PRODUCT_DEFINITION_PREVIEW_BY_PROD_ID);
  }
  getSIProductDefinitionByProductIdAndApplicationDate(pacsId: any, productId: any, applicationId: any) {
    let headers = new HttpHeaders({ 'pacsId': pacsId + '', 'productId': productId + '','applicationId': applicationId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_PRODUCT_DETAILS_BY_PRODUCT_ID_AND_APPLICATION_DATE);
  }

}
