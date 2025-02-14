import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class MembershipAssetsDetailsService {

  constructor(private commonHttpService: CommonHttpService) { }
  
  updateMembershipAssetsDetails(MembershipModel: any) {
    return this.commonHttpService.put(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_ASSETS_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addMembershipAssetsDetails(MembershipModel: any) {
    return this.commonHttpService.post(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_ASSETS_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getMembershipAssetsDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_ASSETS_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllMembershipAssetsDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_ASSETS_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteMembershipAssetsDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_ASSETS_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getMembershipAssetsDetailsByMemberIdAndBranchIdAndPacsID(id: string,branchId: string , membershipId: string, pacsId: string) {
    let headers = new HttpHeaders({ 'id': id + '' ,'branchId': branchId+'', 'membershipId': membershipId+'', 'pacsId': pacsId+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_ASSETS_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_ASSETS_DETAILS_BY_MEMBER_ID_AND_PACS_ID_BRANCH_ID);
  }
}
