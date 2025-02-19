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
export class FdNonCumulativeApplicationService {

  private organizationDetailsStepper = new BehaviorSubject<stepperDataModel>(null);
  public currentStep = this.organizationDetailsStepper.asObservable();

  constructor(private commonHttpService:CommonHttpService,  private commonFunctionService: CommonFunctionsService) { }
  changeData(data: stepperDataModel) {
    this.organizationDetailsStepper.next(data)
  }
  public resetCurrentStep() {
    this.organizationDetailsStepper.next(null); // or initial value
  }
  getAllMemberTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.MEMBER_TYPES + Configuration.GET_ALL);
  }

  getFdNonCummApplicationById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNT + ERP_TRANSACTION_CONSTANTS.GET);
  }

  getAllRelationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.RELATIONSHIP_TYPES + Configuration.GET_ALL);
  }

  getAllOccupationTypes(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OCCUPATION_TYPES + Configuration.GET_ALL);
  }

  getAllAccountTypesList(){
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.ACCOUNTS_TYPES + Configuration.GET_ALL);
}

getQualificationTypes(){
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.QUALIFICATION + Configuration.GET_ALL);
}

getCastes(){
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.CASTE + Configuration.GET_ALL);
}

getAllOperationTypes(){
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OPERATION_TYPES + Configuration.GET_ALL);
}

updateFdNonCummApplication(object:any){
  return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNT + ERP_TRANSACTION_CONSTANTS.UPDATE);
}

addFdNonCummApplication(object:any){
  return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNT+ ERP_TRANSACTION_CONSTANTS.ADD);
}

getAllProductDefinitionList(){
  return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMM_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}

getProduct(id: any){
  let headers = new HttpHeaders({ 'pacsId': id + '', })
  return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMM_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ACTIVE_PRODUCTS_BASED_ON_PACSID);
}

updateFdNonCummApplicationWithMemberModuleDetails(object:any){
  return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNT + ERP_TRANSACTION_CONSTANTS.UPDATE_FD_NON_CUMMULATIVE_ACCOUNT_WITH_MEMBER_MODULE);
}

addFdNonCummApplicationWithMemberModuleDetails(object:any){
  return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNT+ ERP_TRANSACTION_CONSTANTS.ADD_FD_NON_CUMMULATIVE_WITH_MEMBER_MODULE);
}
getProductById(id: any) {
  let headers = new HttpHeaders({ 'id': id + '', })
  return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMULATIVE_INTEREST_POLICY_CONFIG + ERP_TRANSACTION_CONSTANTS.GET);
}
getMemberByAdmissionNumber(admissionNumber:any){
  let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
  return this.commonHttpService.getById(headers , ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_BASIC_DETAILS+ ERP_TRANSACTION_CONSTANTS.GET_MEMBERSHIP_BASIC_DETAILS_BY_ADMISSION_NO);
}
getGroupByAdmissionNumber(admissionNumber:any){
  let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
  return this.commonHttpService.getById(headers , ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
}

getInstitutionDetails(admissionNumber:any ){
  let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + ''})
  return this.commonHttpService.getById(headers , ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.MEM_INSTITUTIONS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
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

getAllProducts() {
  return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMM_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ALL);
}

getfdnonProductDefinitionByProductIdAndDepositDate(pacsId: any, subProductId: any, id: any) {
  let headers = new HttpHeaders({ 'pacsId': pacsId + '', 'subProductId': subProductId + '','id': id + '' })
  return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMM_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_PRODUCT_DETAILS_BY_PRODUCT_ID_APPLICATION_DATE);
}

downloadPreviewPDf(id:any){
  let status = this.commonFunctionService.getStorageValue('language');
  let url = ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS+ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNTS+ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_APPLICATION_PREVIEW_DOWNLOAD+"/"+id + "/"+status;
  const headers = new HttpHeaders({});
   return this.commonHttpService.generateAssetSheet(headers,url);
 }
 getActiveProductsById(pacsId: any) {
  let headers = new HttpHeaders({ 'pacsId': pacsId + '', })
  return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_ACTIVE_PRODUCTS_BASED_ON_PACSID);
}
getFdNonCumulativeProductDefinitionOverviewDetailsById(id: any) {
  let headers = new HttpHeaders({ 'id': id + '' })
  return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMULATIVE_PRODUCT_DEFINITION + ERP_TRANSACTION_CONSTANTS.GET_PRODUCT_OVERVIEW_BY_ID);
}

updateInstitutionPromoterDetails(TermDepostModel: any) {
  return this.commonHttpService.put(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS+ ERP_TRANSACTION_CONSTANTS.INSTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
}
addInstitutionPromoterDetails(TermDepostModel: any) {
  return this.commonHttpService.post(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS+ ERP_TRANSACTION_CONSTANTS.INSTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
}

updateGroupPromoterDetails(TermDepostModel: any) {
  return this.commonHttpService.put(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.UPDATE)
}
addGroupPromoterDetails(TermDepostModel: any) {
  return this.commonHttpService.post(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.ADD)
}
updateGropDetails(object: any) {
  return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
}
addInstituionPromoterDetails(object: any) {
  return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INSTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD);
}
updateInstituionPromoterDetails(object: any) {
  return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.INSTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE);
}
getAllOccupationTypesList(){
  return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.OCCUPATION_TYPES + Configuration.GET_ALL);
}

saveAccountOnRenewal(object:any){
  return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.FD_NON_CUMMULATIVE_ACCOUNT+ ERP_TRANSACTION_CONSTANTS.SAVE_ACCOUNT_ON_RENEWAL);
}
}
