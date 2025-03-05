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
  getAllCoveredVillagesByPacId(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, Configuration.COMMON_MASTER + Configuration.COVERED_VILLAGES + Configuration.GET_ALL_COVERED_VILLAGES_BY_PAC_ID);
  }

  getAllLandownershipTypes() {
    return this.commonHttpService.getAll(Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE + Configuration.GET_ALL);
  }
  checkPassbookNumberInDb(pasbookNumber:any) {
    let headers = new HttpHeaders({ 'passbookNumber': pasbookNumber + '' })
    return this.commonHttpService.getById(headers,  ERP_TRANSACTION_CONSTANTS. LOANS +  ERP_TRANSACTION_CONSTANTS.CUSTOMER_LAND_SURVEY_DETAILS +  ERP_TRANSACTION_CONSTANTS.GET_LAND_DETAILS_BY_PASSBOOK_NUMBER);
  }
  getMeasuringUnit() {
    let headers = new HttpHeaders({})
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + Configuration.UOM + ERP_TRANSACTION_CONSTANTS.GET_MEASURING_UNIT);
  }
  getLandDetailsByApplicationIdAndPacsId(id: any, pacsId: any,branchId:any) {
    let headers = new HttpHeaders({ 'id': id + '' ,'pacsId': pacsId+'', 'branchId': branchId+''})
       return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_LAND_MORTAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_LAND_DETAILS_BY_APPLICATION_ID_AND_PACS_ID);
  }
  getAllSoilTypes(){
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.SOIL_TYPES + Configuration.GET_ALL);
  }
  getAllLandTypes() {
    return this.commonHttpService.getAll( ERP_TRANSACTION_CONSTANTS. MEMBERSHIP +  ERP_TRANSACTION_CONSTANTS.LAND_TYPE +  ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
 
  getAllIrrigationTypes() {
    return this.commonHttpService.getAll( ERP_TRANSACTION_CONSTANTS. LOANS +  ERP_TRANSACTION_CONSTANTS.IRRIGATION_TYPE +  ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
}
