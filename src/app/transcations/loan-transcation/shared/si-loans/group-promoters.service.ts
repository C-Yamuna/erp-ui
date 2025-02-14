import { Injectable } from '@angular/core';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class GroupPromotersService {

  constructor(private commonHttpService : CommonHttpService) { }
  updateGroupPromoters(TermDepostModel: any) {
    return this.commonHttpService.put(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addGroupPromoters(TermDepostModel: any) {
    return this.commonHttpService.post(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getAllGroupPromoters() {
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.GET_ALL)
  }
  getGroupPromoters(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.GET)
  }
  getGroupPromoterDetailsByGroupId(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.GET_GROUP_PROMOTER_DETAILS_BY_GROUP_ID)
  }
  deleteGroupPromoters(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.GROUP_PROMOTERS + ERP_TRANSACTION_CONSTANTS.DELETE)
  }
  updateInstitutionPromoters(TermDepostModel: any) {
    return this.commonHttpService.put(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.INISTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addInstitutionPromoters(TermDepostModel: any) {
    return this.commonHttpService.post(TermDepostModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.INISTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getInstitutionPromoters(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.INISTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.GET)
  }
  getInstitutionPromoterDetailsByInstitutionId(id: any,pacsId:any) {
    let headers = new HttpHeaders({ 'id': id + '','pacsId': pacsId +'' })
    return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.INISTITUTION_PROMOTER_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_INISTITUTION_PROMOTER_DETAILS_BY_INISTITUTIONID_AND_PACSID)
  }
}
