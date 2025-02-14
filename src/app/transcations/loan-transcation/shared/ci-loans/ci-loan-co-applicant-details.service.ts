import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class CiLoanCoApplicantDetailsService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateCiLoanCoApplicantDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_CO_APPLICANT_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiLoanCoApplicantDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_CO_APPLICANT_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCiLoanCoApplicantDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_CO_APPLICANT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiLoanCoApplicantDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_CO_APPLICANT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiLoanCoApplicantDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_CO_APPLICANT_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getCiLoanCoApplicantByLoanApplicationId(loanApplicationId: string) {
    let headers = new HttpHeaders({ 'loanApplicationId': loanApplicationId + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_CO_APPLICANT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_CI_LOAN_CO_APPLICANT_BY_LOAN_APPLICATION_ID);
  }
}
