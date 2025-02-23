import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';


export type stepperDataModel = {
  formValid?: boolean,
  stepperIndex?: number;
  data?: any;
  method?:any;
  url?: string;
  isObjChanged?:boolean;
  isDisable?:boolean;

} | null;

@Injectable({
  providedIn: 'root'
})
export class CiLoanApplicationService {

  private ciLoanApplication = new BehaviorSubject<stepperDataModel>(null);
  public currentStep = this.ciLoanApplication.asObservable();

  constructor(private commonHttpService:CommonHttpService , private commonFunctionService: CommonFunctionsService) { }
  changeData(data: stepperDataModel) {
    this.ciLoanApplication.next(data)
  }

  public resetCurrentStep() {
    this.ciLoanApplication.next(null); // or initial value
  }


  updateCiLoanApplications(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  approve(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATION_APPROVAL)
  }
  addCiLoanApplications(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCiLoanApplicationsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiLoanApplications(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiLoanApplications(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getLoanApplicationDetailsByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET_LOAN_APPLICATION_DETAILS_BY_LOAN_APPLICATION_ID);
  }
  getCiLoanApplicationDetailsByPacsIdAndBranchId(pacsId: any,branchId: any){
    let headers = new HttpHeaders({ 'pacsId': pacsId + '', 'branchId': branchId + '' })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATIONS + ERP_TRANSACTION_CONSTANTS.GET_CI_LOAN_APPLICATION_DETAILS_BY_PACS_ID_AND_BRANCH_ID);
  }

  getstatesList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.STATE + Configuration.GET_ALL);
  }
  getDistrictsList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.DISTRICT + Configuration.GET_ALL);
  }
  getMandalsList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.SUB_DISTRICT + Configuration.GET_ALL);
  }
  getVillageList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.VILLAGES + Configuration.GET_ALL);
  }
  getDistrictsByStateId(id : any){
    let headers = new HttpHeaders({ 'stateId': id + '', })
    return this.commonHttpService.getById( headers, Configuration.COMMON_MASTER + Configuration.DISTRICT + Configuration.GET_DISTRICT_BY_STATE_ID);
  }
  getSubDistrictByDistrictId(id : any){
    let headers = new HttpHeaders({ 'districtId': id + '', })
    return this.commonHttpService.getById( headers, Configuration.COMMON_MASTER + Configuration.SUB_DISTRICT + Configuration.GET_SUB_DISTRICTS_BY_DISTRICT_ID);
  }
  getvillagesBySubDistrictId(id : any){
    let headers = new HttpHeaders({ 'subDistrictId': id + '', })
    return this.commonHttpService.getById( headers, Configuration.COMMON_MASTER + Configuration.VILLAGES + Configuration.GET_VILLAGES_BY_SUB_DISTRICT_ID);
  }

  getAllRepaymentFrequency() {
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.REPAYMENT_FREQUENCY + Configuration.GET_ALL);
  }

  getAllLoanPurpose() {
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.LOAN_PURPOSE + Configuration.GET_ALL);
  }

  getAllAccountTypes() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.ACCOUNTS_TYPES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getAllInsuranceVendors() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.INSURANCE_VENDOR_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getAllRelationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.RELATIONSHIP_TYPES + Configuration.GET_ALL);
  }

  getAllQualificationSubQualification() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.QUALIFICATION + Configuration.GET_ALL_QUALIFICATION_AND_SUB_QUALIFICATION)
  }

  getAllCasteSubCaste() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.CASTE + Configuration.GET_ALL_CAST_AND_SUB_CASTE)
  }

  getAllOperationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OPERATION_TYPES + Configuration.GET_ALL);
  }

  getAllMemberTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.MEMBER_TYPES + Configuration.GET_ALL);
  }

  getMemberShipBasicDetailsFromLoansModule(admissionNumber: string) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER)
  }
  

  getMemberShipGroupDetailsFromLoansModule(admissionNumber: string) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER)
  }

  getMemberShipInstitutionDetailsFromLoansModule(admissionNumber: string) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.MEM_INSTITUTIONS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER)
  }

  downloadPreviewPDf(id:any){
    let status = this.commonFunctionService.getStorageValue('language');
    let url = ERP_TRANSACTION_CONSTANTS.LOANS+ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATION+ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATION_PREVIEW_DOWNLOAD+"/"+id + "/"+status;
    const headers = new HttpHeaders({});
     return this.commonHttpService.generateAssetSheet(headers,url);
   }
   getAllOccupationTypesList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OCCUPATION_TYPES + Configuration.GET_ALL);
}
  updateGropDetails(object: any) {
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }
  addGroupPromoterDetails(object: any) {
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.ADD);
  }
  updateGroupPromoterDetails(object: any) {
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }
  addInstituionPromoterDetails(object: any) {
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.INSTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD);
  }
  updateInstituionPromoterDetails(object: any) {
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.INSTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }


  updateCiLoanDisbursementSchedule(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_DISBURSEMENT_SCHEDULES + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiLoanDisbursementSchedule(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_DISBURSEMENT_SCHEDULES + ERP_TRANSACTION_CONSTANTS.ADD)
  }

  updateCiDisbursements(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCiDisbursements(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_DISBURSEMENTS + ERP_TRANSACTION_CONSTANTS.ADD)
  }

  getCiLoanDisbursementScheduleById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DISBURSEMENT_SCHEDULES + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCiLoanDisbursementSchedule(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DISBURSEMENT_SCHEDULES + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCiLoanDisbursementSchedule(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DISBURSEMENT_SCHEDULES + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getCiLoanDisbursementScheduleByLoanApplicationId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_LOAN_DISBURSEMENT_SCHEDULES + ERP_TRANSACTION_CONSTANTS.GET_CI_LOAN_DISBURSEMENT_SCHEDULE_BY_LOAN_APPLICATION_ID);
  }

  updateCiLoanApplication(loanapplication: any) {
    return this.commonHttpService.put(loanapplication,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_LOAN_APPLICATION + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
 
}
