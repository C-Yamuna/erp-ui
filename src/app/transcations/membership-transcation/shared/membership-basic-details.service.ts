import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { Configuration } from 'src/app/configurations/configurations-constants';
@Injectable({
  providedIn: 'root'
})
export class MembershipBasicDetailsService {

  constructor(private commonHttpService: CommonHttpService, private commonFunctionService: CommonFunctionsService) { }
  
  
  updateMembershipBasicDetails(MembershipModel: any) {
    return this.commonHttpService.put(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addMembershipBasicDetails(MembershipModel: any) {
    return this.commonHttpService.post(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getMembershipBasicDetailsById(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllMembershipBasicDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteMembershipBasicDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getMembershipBasicDetailsByMemberId(id: string, pacsId: string,branchId: string ) {
    let headers = new HttpHeaders({ 'id': id + '' , 'pacsId': pacsId+'','branchId': branchId+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBERSHIP_BASIC_DETAILS);
  }

  getAllRelationshipType() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.RELATIONSHIP_TYPES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getAllQualificationType() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.QUALIFICATION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  getAllOccupationType() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.OCCUPATION_TYPES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  getAllcaste() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.CASTE + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  getAllCommunityTypes() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.COMMUNITY + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getAllMemberTypes() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBER_TYPE + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getAllKycDocTypes(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.KYC_DOC_TYPES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getAllGridList(pacsId :any,branchId:any){
    let headers = new HttpHeaders({ 'pacsId': pacsId + '' , 'branchId': branchId+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_GRID);
  }

  getAllSubProduct() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.SUB_PRODUCT + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getAllProduct() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.PRODUCTS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  submitForApproval(MembershipModel:any) {
    return this.commonHttpService.put(MembershipModel, Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS+ERP_TRANSACTION_CONSTANTS.submit_for_approval);
  }


  downloadPreviewPDf(id:any){
    let status = this.commonFunctionService.getStorageValue('language');
    let url = ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_PDF_DOWNLOAD+"/"+id + "/"+status;
    const headers = new HttpHeaders({});
     return this.commonHttpService.generateAssetSheet(headers,url);
   }

   getMembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_BY_ADMISSION_NUMBER);
  }

  getSILoanApplicationDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId +''})
    return this.commonHttpService.getById(headers , Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.SI_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_SI_LOAN_APPLICATION_BY_ADDMISSION_NUMBER);
  }

  getSaoLoanApplicationDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId +''})
    return this.commonHttpService.getById(headers , Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_SAO_LOAN_APPLICATION_BY_ADDMISSION_NUMBER);
  }
  getCILoanApplicationDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId +''})
    return this.commonHttpService.getById(headers , Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_CI_LOAN_APPLICATION_BY_ADDMISSION_NUMBER);
  }
  getTermLoanApplicationDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId +''})
    return this.commonHttpService.getById(headers , Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_TERM_LOAN_APPLICATION_BY_ADDMISSION_NUMBER);
  }

  getDailyDepositsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId + ''})
    return this.commonHttpService.getById(headers , Configuration.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_DAILY_DEPOSITS_BY_ADDMISSION_NUMBER);
  }
  getSbAccountDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId + ''})
    return this.commonHttpService.getById(headers , Configuration.DEMANDDEPOSITS + Configuration.SAVING_ACCOUNT + Configuration.SB_ACCOUNT_ADMISSION_NUMBER);
  }
  getFDAccountDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId +''})
    return this.commonHttpService.getById(headers , Configuration.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMMULATIVE_ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_FD_CUMMULATIVE_APPLICATION_BY_ADDMISSION_NUMBER);
  }

  getFDNonAccountDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId +''})
    return this.commonHttpService.getById(headers , Configuration.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNT + ERP_TRANSACTION_CONSTANTS.GET_FD_NON_CUMMULATIVE_APPLICATION_BY_ADDMISSION_NUMBER);
  }

  getRDAccountDetailsByAdmissionNumber(admissionNumber :any,memberTypeId:any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '','memberTypeId':memberTypeId +''})
    return this.commonHttpService.getById(headers , Configuration.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.RD_ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_RD_APPLICATION_BY_ADDMISSION_NUMBER);
  }

  getAgentDetailsByAdmissionNumber(admissionNumber :any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + ''})
    return this.commonHttpService.getById(headers , Configuration.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.AGENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_AGENT_DETAILS_BY_ADDMISSION_NUMBER);
  }

  getTopFiveTransactions(accountId:any){
    let headers = new HttpHeaders({ 'accountId': accountId + '', })
    return this.commonHttpService.getById( headers, Configuration.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SB_TRANSACTION + ERP_TRANSACTION_CONSTANTS.GET_TOP_FIVE_RECORDS_OF_TRANSACTIONS);
  }

  getAllFDCummulativeTransactions(termAccId:any){
    let headers = new HttpHeaders({ 'termAccId': termAccId + '', })
    return this.commonHttpService.getById( headers, Configuration.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_TRANSACTION + ERP_TRANSACTION_CONSTANTS.GET_ALL_FD_TRANSDACTIONS);
  }

  getAllFdNonCummulativeTransactions(termAccId:any){
    let headers = new HttpHeaders({ 'termAccId': termAccId + '', })
    return this.commonHttpService.getById( headers, Configuration.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNTS_TRANSACTIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL_FD_NON_CUMMULATIVE_TANSACTIONS);
  }

  getAllRdTransactions(termAccId:any){
    let headers = new HttpHeaders({ 'termAccId': termAccId + '', })
    return this.commonHttpService.getById( headers, Configuration.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.RD_ACCOUNT_TRANSACTIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL_RD_TANSACTIONS);
  }

  getAllAgentTransactions(agentId:any){
    let headers = new HttpHeaders({ 'agentId': agentId + '', })
    return this.commonHttpService.getById( headers, Configuration.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.AGENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_AGENT_TRANSACTION_BY_AGENT_ID);
  }

  getAllPigmyTransactions(pacsId:any,accountId:any){
    let headers = new HttpHeaders({ 'pacsId':pacsId +'','accountId': accountId + '', })
    return this.commonHttpService.getById( headers, Configuration.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_DAILY_DEPOSIT_TRANSCATION_BY_ACCOUNT_ID);
  }

  getAllCILoanTransactions(id:any){
    let headers = new HttpHeaders({ 'id':id +''})
    return this.commonHttpService.getById( headers, Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_DETAILS_BY_LOAN_APPLICATION_ID);
  }

  getAllSILoanTransactions(id:any){
    let headers = new HttpHeaders({ 'id':id +''})
    return this.commonHttpService.getById( headers, Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.SI_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_DETAILS_BY_LOAN_APPLICATION_ID);
  }

  getAllSAOLoanTransactions(id:any){
    let headers = new HttpHeaders({ 'id':id +''})
    return this.commonHttpService.getById( headers, Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_DETAILS_BY_LOAN_APPLICATION_ID);
  }

  getAllTermLoanTransactions(id:any){
    let headers = new HttpHeaders({ 'id':id +''})
    return this.commonHttpService.getById( headers, Configuration.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.GET_ALL_TRANSACTION_DETAILS_BY_LOAN_APPLICATION_ID);
  }



}
