import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class TermLoanMortgageService {

  constructor(private commonHttpService: CommonHttpService) { }

 
  // Term Gold Loan services
  updateTermGoldLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_GOLD_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermGoldLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_GOLD_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermGoldLoanMortagageDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_GOLD_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermGoldLoanMortagageDetails() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_GOLD_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermGoldLoanMortagageDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_GOLD_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermGoldLoanMortgageDetailsByLoanAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_GOLD_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_GOLD_MORTGAGE_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }

  // Term Land Loan services
  updateTermLandLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_LAND_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermLandLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_LAND_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermLandLoanMortagageDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_LAND_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermLandLoanMortagageDetails() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_LAND_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermLandLoanMortagageDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_LAND_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermLandLoanMortgageDetailsByLoanAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_LAND_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }

  // Term Bond Loan services
  updateTermBondLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_BONDS_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermBondLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_BONDS_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermBondLoanMortagageDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_BONDS_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermBondLoanMortagageDetails() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_BONDS_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermBondLoanMortagageDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_BONDS_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermBondLoanMortgageDetailsByLoanAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_BONDS_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }

  // Term Vehicle Loan services
  updateTermVehicleLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_VEHICLE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermVehicleLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_VEHICLE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermVehicleLoanMortagageDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_VEHICLE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermVehicleLoanMortagageDetails() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_VEHICLE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermVehicleLoanMortagageDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_VEHICLE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermVehicleLoanMortgageDetailsByLoanAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_LOAN_VEHICLE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }

  // Term Storage Loan services
  updateTermStorageLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_STORAGE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermStorageLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_STORAGE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermStorageLoanMortagageDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_STORAGE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermStorageLoanMortagageDetails() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_STORAGE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermStorageLoanMortagageDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_STORAGE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermStorageLoanMortgageDetailsByLoanAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_STORAGE_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }

  // Term Other Loan services
  updateTermOtherLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_OTHER_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermOtherLoanMortagageDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_OTHER_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermOtherLoanMortagageDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_OTHER_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermOtherLoanMortagageDetails() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_OTHER_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermOtherLoanMortagageDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_OTHER_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermOtherLoanMortgageDetailsByLoanAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_OTHER_MORTGAGE_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }

  getMemberByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.INDIVIDUAL_MEMBER_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
  }
  getInstitutionDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.MEM_INSTITUTIONS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
  }
  getGroupByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
  }
  getInstitutionDetails(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.MEM_INSTITUTIONS + ERP_TRANSACTION_CONSTANTS.GET);
  }

  getAllLandTypes() {
    return this.commonHttpService.getAll(Configuration.MEMBERSHIP + Configuration.SOIL_TYPES + Configuration.GET_ALL);
  }


  // property

  updateTermProperyMortgageLoanDetails(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_PROPERTY_MORTGAGES + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addTermProperyMortgageLoanDetails(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.TERM_PROPERTY_MORTGAGES + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getTermProperyMortgageLoanDetailsById(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PROPERTY_MORTGAGES + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllTermProperyMortgageLoanDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PROPERTY_MORTGAGES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteTermProperyMortgageLoanDetails(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PROPERTY_MORTGAGES + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTermProperyMortgageLoanDetailsByApplicationId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.TERM_PROPERTY_MORTGAGES + ERP_TRANSACTION_CONSTANTS.GET_DETAILS_BY_TERM_LOAN_APPLICATION_ID);
  }
  getAllVillages() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.COMMON_MASTER+ ERP_TRANSACTION_CONSTANTS.VILLAGES + ERP_TRANSACTION_CONSTANTS.GET_ALL)
  }
  getAllLandownershipTypes() {
    return this.commonHttpService.getAll(Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE + Configuration.GET_ALL);
  }
}
