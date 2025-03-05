import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from 'src/app/configurations/configurations-constants';

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
export class DailyDepositsAccountsService {

  constructor(private commonHttpService:CommonHttpService, private commonFunctionService: CommonFunctionsService) { }

  private recurringDepositApplicaiton = new BehaviorSubject<stepperDataModel>(null);
  public currentStep = this.recurringDepositApplicaiton.asObservable();
  
  changeData(data: stepperDataModel) {
    this.recurringDepositApplicaiton.next(data)
  }

  public resetCurrentStep() {
    this.recurringDepositApplicaiton.next(null); 
  }

  getAccountsByPacsAndBranchId(pacsId: any , branchId: any) {
    let headers = new HttpHeaders({ 'pacsId': pacsId + '' ,'branchId': branchId+''})
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET_ACCOUNTS_DETAILS_BY_PACSID_AND_BRANCHID)
  }

  getAllMembershipDetailsFromMembership(pacsId:any,branchId:any){
    let headers = new HttpHeaders({ 'pacsId': pacsId + '' , 'branchId': branchId+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL_GRID);
  }

  getDailyDepositsByacid(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET)
  }

  getMembershipBasicDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_BY_ADMISSION_NUMBER);
  }

  getMemberIstitutionByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEM_INSTITUTIONS + ERP_TRANSACTION_CONSTANTS.GET_INSTITUTION_BY_ADMISSION_NUMBER);
  }

  getMemberGroupByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_GROUP_BY_ADMISSION_NUMBER);
  }

  updatedailyDepositsApplicationWithMemberModuleDetails(object:any){
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.UPDATE_DAILY_DEPOSITS_ACCOUNT_WITH_MEMBER_MODULE);
  }
  
  addDailyDepositsApplicationWithMemberModuleDetails(object:any){
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS+ ERP_TRANSACTION_CONSTANTS.ADD_DAILY_DEPOSITS_ACCOUNT_WITH_MEMBER_MODULE);
  }

  updateDailyDepositsAccountCommunication(Model: any) {
    return this.commonHttpService.put(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addDailyDepositsAccountCommunication(Model: any) {
    return this.commonHttpService.post(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_COMMUNICATION + ERP_TRANSACTION_CONSTANTS.ADD)
  }

  updateDailyDepositsAccounts(Model: any) {
    return this.commonHttpService.put(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addDailyDepositsAccounts(Model: any) {
    return this.commonHttpService.post(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.ADD)
  }

  updateJointHolders(Model: any) {
    return this.commonHttpService.put(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.JOINT_ACC_HOLDER_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addJointHolders(Model: any) {
    return this.commonHttpService.post(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.JOINT_ACC_HOLDER_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }

  updateAccountNominees(Model: any) {
    return this.commonHttpService.put(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_NOMINEE + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addAccountNominees(Model: any) {
    return this.commonHttpService.post(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_NOMINEE + ERP_TRANSACTION_CONSTANTS.ADD)
  }

  updateGuardianDetails(Model: any) {
    return this.commonHttpService.put(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_GUARDIAN + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addGuardianDetails(Model: any) {
    return this.commonHttpService.post(Model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_GUARDIAN + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getAccounts(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllKycTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.KYC_DOC_TYPE + Configuration.GET_ALL);
  }
  getNomineeFromMembeshipByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_BY_ADMISSION_NUMBER);
  }
  deleteRdAccountKyc(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.DELETE)
  }
  getKycDetailsByAdmissionNumber(admissionNumber: any) {
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.GET_ALL_KYC_DETAILS_BY_ADMISSION_NUMBER)
  }
  updateAccountKyc(model: any) {
    return this.commonHttpService.put(model,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  getKycDetailsByAccountId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.GET_DAILY_DEPOSITS_KYC_DETAILS_BY_ACCOUNT_ID)
  }
  getGuardianDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_GUARDIAN + ERP_TRANSACTION_CONSTANTS.GET)
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
  getAllProductDefinitionList(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  getAllAccountTypesList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.ACCOUNTS_TYPES + Configuration.GET_ALL);
  }
  getProductDefinitionByProductIdAndDepositDate(pacsId: any, subProductId: any, id: any) {
    let headers = new HttpHeaders({ 'pacsId': pacsId + '', 'subProductId': subProductId + '','id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_PRODUCT_DETAILS_BY_PRODUCTID_APPLICATION_DATE);
  }
  getAllRelationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.RELATIONSHIP_TYPES + Configuration.GET_ALL);
  }
  getNomineeByAccountNumber(accountNumber: any) {
    let headers = new HttpHeaders({ 'accountNumber': accountNumber + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_NOMINEE + ERP_TRANSACTION_CONSTANTS.GET_NOMINEE_DETAILS_BY_ACCOUNT_NUMBER)
  }
  getAllDocuementsTypes(){
    return this.commonHttpService.getAll(Configuration.DAILYDEPOSITS + Configuration.DOC_TYPES + Configuration.GET_ALL);
  }
  deleteRequiredDocument(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_REQURIED_DOCUMNETS + ERP_TRANSACTION_CONSTANTS.DELETE)
  }
  getRequiredDocsByAccId(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_REQURIED_DOCUMNETS + ERP_TRANSACTION_CONSTANTS.GET_REQUIRED_DOCUMENT_DETAILS_BY_ACC_ID)
  }
  saveRequiredDocument(object:any){
    return this.commonHttpService.post(object, Headers, Configuration.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNT_REQURIED_DOCUMNETS + Configuration.ADD);
  }
  updateRequiredDocument(object:any){
    return this.commonHttpService.put(object, Headers, Configuration.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNT_REQURIED_DOCUMNETS + Configuration.UPDATE);
  }
  getDocuments(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNT_REQURIED_DOCUMNETS + ERP_TRANSACTION_CONSTANTS.GET);
  }

  downloadPreviewPDf(id:any){
    let status = this.commonFunctionService.getStorageValue('language');
    let url = ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ERP_TRANSACTION_CONSTANTS.ACCOUNTS+ERP_TRANSACTION_CONSTANTS.DAILY_DEPOSITS_APPLICATION_PREVIEW_DOWNLOAD+"/"+id + "/"+status;
    const headers = new HttpHeaders({});
     return this.commonHttpService.generateAssetSheet(headers,url);
   }
   deleteAccountKyc(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.DELETE)
  }
  addAccountKyc(TermDepostModel: any) {
    return this.commonHttpService.post(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getAllAccountKyc() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.GET_ALL)
  }
  getAccountKyc(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.ACCOUNT_KYC + ERP_TRANSACTION_CONSTANTS.GET)
  }
  getAllOccupationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OCCUPATION_TYPES + Configuration.GET_ALL);
  }
  getQualificationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OCCUPATION_TYPES + Configuration.GET_ALL);
  }

  getCastes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.CASTE + Configuration.GET_ALL);
  }

  getAllOperationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OPERATION_TYPES + Configuration.GET_ALL);
  }

  updateCommunication(object:any){
    return this.commonHttpService.put(object, Headers, Configuration.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.RD_ACCOUNT_COMMUNICATION + Configuration.UPDATE);
  }

  getAllMemberTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.MEMBER_TYPES + Configuration.GET_ALL);
  }

  getAllSubProduct() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.SUB_PRODUCT + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  addJointHoldersList(list: any) {
    return this.commonHttpService.post(list,Headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS+ ERP_TRANSACTION_CONSTANTS.JOINT_ACC_HOLDER_DETAILS + ERP_TRANSACTION_CONSTANTS.JOINT_HOLDER_SAVE_LIST)
  }
  deleteTransaction(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.DAILY_DEPOSIT_TRANSACTION + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getTransaction(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.DAILY_DEPOSIT_TRANSACTION + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getTopFiveTransactions(id:any,pacsId:any){
    let headers = new HttpHeaders({ 'accountId': id + '', 'pacsId':pacsId})
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.DAILY_DEPOSIT_TRANSACTION + ERP_TRANSACTION_CONSTANTS.GET_TOP_FIVE_DAILY_DEPOSITS_RECORDS_OF_TRANSACTIONS);
  }
  updateTransaction(object:any){
    return this.commonHttpService.put(object, Headers, Configuration.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.DAILY_DEPOSIT_TRANSACTION + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }
  addTransaction(object:any){
    return this.commonHttpService.post(object, Headers, Configuration.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.DAILY_DEPOSIT_TRANSACTION+ ERP_TRANSACTION_CONSTANTS.ADD);
  }
  addRenewalData(object:any){
    return this.commonHttpService.post(object, Headers, Configuration.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.ACCOUNTS+ ERP_TRANSACTION_CONSTANTS.SAVE_ACCOUNT_ON_RENEWAL);
  }
  getDailyDepositProductDefinitionOverviewDetailsById(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_PRODUCT_OVERVIEW_BY_ID);
  }
  getAllRequiredDocuments(id:any){
    let headers = new HttpHeaders({ 'productId': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.DAILYDEPOSITS + ERP_TRANSACTION_CONSTANTS.REQUIRED_DOCUMENTS_CONFIG + ERP_TRANSACTION_CONSTANTS.GER_REQUIRED_DOCUMENTS_CONFIG_BY_PRODUCT_ID);
  }
  getAllCommunity(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.COMMUNITY + Configuration.GET_ALL);
  }
  getAllQualificationSubQualification() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.QUALIFICATION + Configuration.GET_ALL_QUALIFICATION_AND_SUB_QUALIFICATION)
  }
  getAllCasteSubCaste() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.CASTE + Configuration.GET_ALL_CAST_AND_SUB_CASTE)
  }
  getBlockList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.BLOCKS + Configuration.GET_ALL);
  }
  getAllDivisionList(){
    return this.commonHttpService.getAll(  Configuration.COMMON_MASTER + Configuration.DIVISION + Configuration.GET_ALL);
  }
  getAllAgentDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.AGENTDETAILS + ERP_TRANSACTION_CONSTANTS.AGENT_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
}
