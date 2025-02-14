import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class GeneralConfigService {

  constructor(private commonHttpService:CommonHttpService, private commonFunctionService: CommonFunctionsService) { }

  updateGeneralConfig(generalconfigModel:any){
    return this.commonHttpService.put(generalconfigModel, Headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addGeneralConfig(generalconfigModel:any){
    return this.commonHttpService.post(generalconfigModel, Headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION+ ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllGeneralConfig(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getGeneralConfigById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteGeneralConfig(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getAllActiveProductBasedOnPacsId  (pacsId: any){
    let headers = new HttpHeaders({ 'pacsId': pacsId + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ALL_ACTIVE_PRODUCT_BASED_ON_PACS_ID);
  }
  
  getActiveProductBasedOnProductId(productId: any){
    let headers = new HttpHeaders({ 'productId': productId + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ACTIVE_PRODUCT_BASED_ON_PRODUCT_ID);
  }
  getProductlistByPacsId  (pacsId: any){
    let headers = new HttpHeaders({ 'pacsId': pacsId + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_PRODUCT_LIST_BY_PACSID);
  }
  downloadPreviewPDf(id:any){
    let status = this.commonFunctionService.getStorageValue('language');
    let url = ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS+ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION+ERP_TRANSACTION_CONSTANTS.SB_PRODUCT_DEFINITION_PREVIEW_DOWNLOAD+"/"+id + "/"+status;
    const headers = new HttpHeaders({});
     return this.commonHttpService.generateAssetSheet(headers,url);
   }
}
