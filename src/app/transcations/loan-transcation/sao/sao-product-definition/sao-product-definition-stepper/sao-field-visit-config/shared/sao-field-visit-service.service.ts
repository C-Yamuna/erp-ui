import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class SaoFieldVisitServiceService {

  constructor(private commonHttpService: CommonHttpService) { }
  
    updateSaoFieldVisit(loansModel: any) {
      return this.commonHttpService.put(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_FIELD_VISIT + ERP_TRANSACTION_CONSTANTS.UPDATE)
    }
    addSaoFieldVisit(loansModel: any) {
      return this.commonHttpService.post(loansModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.SAO_FIELD_VISIT + ERP_TRANSACTION_CONSTANTS.ADD)
    }
    getSaoFieldVisitById(id: string) {
      let headers = new HttpHeaders({ 'id': id + '' })
      return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_FIELD_VISIT + ERP_TRANSACTION_CONSTANTS.GET);
    }
    getAllSaoFieldVisits(){
      return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_FIELD_VISIT + ERP_TRANSACTION_CONSTANTS.GET_ALL);
    }
    deleteSaoFieldVisit(id: string) {
      let headers = new HttpHeaders({ 'id': id + '' })
      return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.SAO_FIELD_VISIT + ERP_TRANSACTION_CONSTANTS.DELETE);
    }
}
