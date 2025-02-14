import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
@Injectable({
  providedIn: 'root'
})
export class MembershipGroupDetailsService {

  constructor(private commonHttpService: CommonHttpService,private commonFunctionService: CommonFunctionsService) { }

  updateMembershipGroupDetails(MembershipModel: any) {
    return this.commonHttpService.put(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addMembershipGroupDetails(MembershipModel: any) {
    return this.commonHttpService.post(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.LOANS+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
  getGroupByAdmissionNumber(admissionNumber:any){
      let headers = new HttpHeaders({ 'admissionNumber': admissionNumber + '', })
      return this.commonHttpService.getById(headers , ERP_TRANSACTION_CONSTANTS.LOANS + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_GROUP_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_DETAILS_BY_ADMISSION_NUMBER);
    }
 

}
