import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';


export type stepperDataModel = {
  stepperIndex?: number;
  data?: any;
  formValid?: boolean,
  method?:any;
  url?: string;
  savedId?:any;
  isObjChanged?:boolean;
  isDisable?:boolean;
  showFile?:boolean;
} | null;

@Injectable({
  providedIn: 'root'
})
export class CompoundInterestProductDefinitionService {
  
  private organizationDetailsStepper = new BehaviorSubject<stepperDataModel>(null);
  public currentStep = this.organizationDetailsStepper.asObservable();


  constructor(private commonHttpService: CommonHttpService,private commonFunctionService: CommonFunctionsService) { }

  changeData(data: stepperDataModel) {
    this.organizationDetailsStepper.next(data)
  }

  updateCompoundInterestProductDefinition(loansModel: any) {
    return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addCompoundInterestProductDefinition(loansModel: any) {
    return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getCompoundInterestProductDefinitionById(id: any) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllCompoundInterestProductDefinition(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteCompoundInterestProductDefinition(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
 getPreviewDetailsByProductId(productId: string) {
    let headers = new HttpHeaders({ 'productId': productId + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_CI_PRODUCT_DEFINITION_BY_PRODUCT_ID);
  }
  getActiveProductsBasedOnPacsId(pacsId: string){
    let headers = new HttpHeaders({ 'pacsId': pacsId + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS + ERP_TRANSACTION_CONSTANTS.GET_ALL_ACTIVE_PRODUCTS_BASED_ON_PACSID);
  }

  downloadCIPreviewPDf(id:any){
    let status = this.commonFunctionService.getStorageValue('language');
    let url = ERP_TRANSACTION_CONSTANTS.LOANS+ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITIONS+ERP_TRANSACTION_CONSTANTS.CI_PRODUCT_DEFINITION_PREVIEW_DOWNLOAD+"/"+id + "/"+status;
    const headers = new HttpHeaders({});
     return this.commonHttpService.generateAssetSheet(headers,url);
   }

   getAllLoanPurpose(){
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.LOAN_PURPOSE + Configuration.GET_ALL);
  }

  getAllCollateralTypes(){
    return this.commonHttpService.getAll(Configuration.LOANS + Configuration.COLLATERAL_TYPES + Configuration.GET_ALL);
  }
}
