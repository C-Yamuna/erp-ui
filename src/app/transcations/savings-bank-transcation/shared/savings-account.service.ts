import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from '../../erp-transaction-constants';
import { HttpHeaders } from '@angular/common/http';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';

@Injectable({
  providedIn: 'root'
})
export class SavingsAccountService {

  constructor(private commonHttpService:CommonHttpService , private commonFunctionService: CommonFunctionsService) { }

  updateSavingsAccountDetails(object:any){
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addSavingsAccountDetails(object:any){
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getSavingsAccountDetailsByPacsIdAndBranchId(pacsId: any,branchId: any){
    let headers = new HttpHeaders({ 'pacsId': pacsId + '', 'branchId': branchId + '' })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.GET_SAVINGS_ACCOUNT_DETAILS_BY_PACS_ID_AND_BRANCH_ID);
  }

  getSavingAccountByAdmissionNumberAndId(admissionNumber: any , id: any){
    let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '' , 'id': id + '' })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.GET_SAVING_ACCOUNT_BY_ADMISSION_NUMBER_AND_ID);
  }

  getAllSavingsAccountDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }

  getSavingsAccountDetailsById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.GET);
  }

  deleteSavingsAccountDetails(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete( headers, ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS + ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT + ERP_TRANSACTION_CONSTANTS.DELETE);
  }

  downloadPreviewPDf(id:any){
    let status = this.commonFunctionService.getStorageValue('language');
    let url = ERP_TRANSACTION_CONSTANTS.DEMANDDEPOSITS+ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT+ERP_TRANSACTION_CONSTANTS.SAVINGS_ACCOUNT_PDF_DOWNLOAD;
    let headers = new HttpHeaders({ 'id': id + '', 'status': status + ''})
     return this.commonHttpService.generateAssetSheet(headers,url);
   }
}
