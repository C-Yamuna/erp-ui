import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class TermProdCollateralsConfigService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateTermProductCollateralConfig(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_COLLATERALS_CONFIGS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermProductCollateralConfig(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_COLLATERALS_CONFIGS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermProductCollateralConfigById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_COLLATERALS_CONFIGS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermProductCollateralConfig(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_COLLATERALS_CONFIGS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermProductCollateralConfig(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PRODUCT_COLLATERALS_CONFIGS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
}
