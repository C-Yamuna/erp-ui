import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class CashManagementService {

  constructor(private commonHttpService: CommonHttpService) { }

  getAllDemandDepositTransactions() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SB_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_CURRENT_DATE_TRANSACTIONS);
  }

  getAllDailyDepositTransactions() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.DAILY_DEPOSIT_TRANSACTION + ERP_TRANSACTION_CONSTANTS.GET_ALL_CURRENT_DATE_TRANSACTIONS);
  }

  getAllTermDepositTransactions() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_CUMULATIVE_ACCOUNTS_TRANSACTION + ERP_TRANSACTION_CONSTANTS.GET_ALL_CURRENT_DATE_TRANSACTIONS);
  }

  getAllLoanTransactions() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SI_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_CURRENT_DATE_TRANSACTIONS);
  }

  getAllApprovedMembersFromMembershipModule(pacsId: any, branchId: any) {
    let headers = new HttpHeaders({ 'pacsId': pacsId + '', 'branchId': branchId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_GRID);
  }

  getMemberBasicDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_BY_ADMISSION_NUMBER);
  }

  getGroupDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_GROUP_BY_ADMISSION_NUMBER);
  }

  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEM_INSTITUTIONS + ERP_TRANSACTION_CONSTANTS.GET_INSTITUTION_BY_ADMISSION_NUMBER);
  }

  addTransaction(object: any) {
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SB_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  updateTransaction(object: any) {
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SB_TRANSACTION_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  getMemberSharesByAdmissionNumberAndMemberType(admissionNumber: any, memberTypeId: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', 'memberTypeId': memberTypeId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_SHARES_BY_ADMISSION_NUMBER_AND_MEMBER_TYPE);
  }

  getDemandDepositsByAdmissionNumberAndMemberType(admissionNumber: any, memberTypeId: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', 'memberTypeId': memberTypeId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.GET_DEMAND_DEPOSITS_BY_ADMISSION_NUMBER_AND_MEMBER_TYPE);
  }

  getDailyDepositsByAdmissionNumberAndMemberType(admissionNumber: any, memberTypeId: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', 'memberTypeId': memberTypeId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_DAILY_DEPOSITS_BY_ADMISSION_NUMBER_AND_MEMBER_TYPE);
  }

  getTermDepositsByAdmissionNumberAndMemberType(admissionNumber: any, memberTypeId: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', 'memberTypeId': memberTypeId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_TERM_DEPOSITS_BY_ADMISSION_NUMBER_AND_MEMBER_TYPE);
  }

  getLoansByAdmissionNumberAndMemberType(admissionNumber: any, memberTypeId: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', 'memberTypeId': memberTypeId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_LOANS_BY_ADMISSION_NUMBER_AND_MEMBER_TYPE);
  }

  getLockersByAdmissionNumberAndMemberType(admissionNumber: any, memberTypeId: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', 'memberTypeId': memberTypeId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOCKERS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_LOCKERS_BY_ADMISSION_NUMBER_AND_MEMBER_TYPE);
  }

  getAgentsByAdmissionNumberAndMemberType(admissionNumber: any, memberTypeId: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', 'memberTypeId': memberTypeId + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_AGENTS_BY_ADMISSION_NUMBER_AND_MEMBER_TYPE);
  }

}
