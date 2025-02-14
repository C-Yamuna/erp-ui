import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
@Injectable({
  providedIn: 'root'
})
export class MemberGuardianDetailsService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateMemberGuardianDetails(MembershipModel: any) {
    return this.commonHttpService.put(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addMemberGuardianDetails(MembershipModel: any) {
    return this.commonHttpService.post(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getMemberGuardianDetailsById(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
  }
  getAllMemberGuardianDetails(){
    return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
  }
  deleteMemberGuardianDetails(id: string) {
    let headers = new HttpHeaders({ 'id': id + '' })
    return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
  }
  getMemberGuardianDetailsByMembershipIdAndPacsId(id: string,branchId: string , membershipId: string, pacsId: string) {
    let headers = new HttpHeaders({ 'id': id + '' ,'branchId': branchId+'', 'membershipId': membershipId+'', 'pacsId': pacsId+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBER_GUARDIAN_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_GUARDIAN_DETAILS_BY_MEMBERSHIP_ID_AND_PACSID);
  }
}
