import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class SaoProductPurposeService {

  constructor(private commonHttpService:CommonHttpService) { }

  updateSaoProductPurpose(purposeModel:any){
    return this.commonHttpService.put(purposeModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_PROD_PURPOSE_CONFIG + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addSaoProductPurpose(purposeModel:any){
    return this.commonHttpService.post(purposeModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_PROD_PURPOSE_CONFIG+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllSaoProductPurpose(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_PROD_PURPOSE_CONFIG + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getSaoProductPurposeById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_PROD_PURPOSE_CONFIG + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteSaoProductPurpose(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_PROD_PURPOSE_CONFIG + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getSaoProductPurposeByProductId(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_PROD_PURPOSE_CONFIG + ERP_TRANSACTION_CONSTANTS.GET_SAO_PROD_PURPOSE_BY_PRODUCT_ID);
  }
}
