import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class CiFieldVerificationDetailsService {
  constructor(private commonHttpService: CommonHttpService) { }

  updateCiFieldVerificationDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_FIELD_VERIFICATION_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiFieldVerificationDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_FIELD_VERIFICATION_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCiFieldVerificationDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_FIELD_VERIFICATION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiFieldVerificationDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_FIELD_VERIFICATION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiFieldVerificationDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_FIELD_VERIFICATION_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getCiFieldVerificationDetailsByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_FIELD_VERIFICATION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_CI_FIELD_VERIFICATION_DETAILS_BY_LOAN_APPLICATION_ID);
  }
}
