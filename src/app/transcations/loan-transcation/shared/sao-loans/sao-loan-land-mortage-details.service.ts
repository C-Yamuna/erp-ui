import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { Configuration } from 'src/app/configurations/configurations-constants';
@Injectable({
  providedIn: 'root'
})
export class SaoLoanLandMortageDetailsService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateSaoLoanLandMortageDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_LOAN_LAND_MORTAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addSaoLoanLandMortageDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_LOAN_LAND_MORTAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getSaoLoanLandMortageDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_LAND_MORTAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllSaoLoanLandMortageDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_LAND_MORTAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteSaoLoanLandMortageDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_LAND_MORTAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getLandDetailsBySaoLoanApplicationId(id: any){
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_LAND_MORTAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_SAO_LAND_DETAILS_BY_LOAN_ID);
  }
  getAllVillages() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.COMMON_MASTER+ ERP_TRANSACTION_CONSTANTS.VILLAGES + ERP_TRANSACTION_CONSTANTS.GET_ALL)
  }
  getAllLandownershipTypes() {
    return this.commonHttpService.getAll(Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE + Configuration.GET_ALL);
  }

}
