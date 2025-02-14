import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { CommonFunctionsService } from 'src/app/shared/commonfunction.service';
import { applicationConstants } from 'src/app/shared/applicationConstants';
import { Configuration } from 'src/app/configurations/configurations-constants';
@Injectable({
  providedIn: 'root'
})
export class MembershipLandDetailsService {

  constructor(private commonHttpService: CommonHttpService,private commonFunctionsService: CommonFunctionsService) { }

  updateMembershipLandDetails(MembershipModel: any) {
    return this.commonHttpService.put(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS + ERP_TRANSACTION_CONSTANTS.UPDATE)
  }
  addMembershipLandDetails(MembershipModel: any) {
    return this.commonHttpService.post(MembershipModel,Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP+ ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS + ERP_TRANSACTION_CONSTANTS.ADD)
  }
//   getMembershipLandDetailsById(id: string) {
//     let headers = new HttpHeaders({ 'id': id + '' })
//     return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS + ERP_TRANSACTION_CONSTANTS.GET);
//   }
//   getAllMembershipLandDetails(){
//     return this.commonHttpService.getAll(ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_ALL);
//   }
//   deleteMembershipLandDetails(id: string) {
//     let headers = new HttpHeaders({ 'id': id + '' })
//     return this.commonHttpService.delete(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS + ERP_TRANSACTION_CONSTANTS.DELETE);
//   }
  getMembershipLandDetailsByMemberIdAndPacsId(id: any, pacsId: any,branchId:any) {
 let headers = new HttpHeaders({ 'id': id + '' ,'pacsId': pacsId+'', 'branchId': branchId+''})
    return this.commonHttpService.getById(headers,ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS + ERP_TRANSACTION_CONSTANTS.GET_MEMBER_LAND_DETAILS_BY_MEMBERSHIP_ID_AND_PACS_ID);
  }
getById(id:any) {
  let pacsId = this.commonFunctionsService.getStorageValue(applicationConstants.PACS_ID);
  let headers = new HttpHeaders({ 'id': id + ''  , 'pacsId': pacsId + ''  });
  return this.commonHttpService.getById(headers,  ERP_TRANSACTION_CONSTANTS. MEMBERSHIP +  ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS +  ERP_TRANSACTION_CONSTANTS.GET);
}

getAllLandTypes() {
  return this.commonHttpService.getAll( ERP_TRANSACTION_CONSTANTS. MEMBERSHIP +  ERP_TRANSACTION_CONSTANTS.LAND_TYPE +  ERP_TRANSACTION_CONSTANTS.GET_ALL);
}

getAllIrrigationTypes() {
  return this.commonHttpService.getAll( ERP_TRANSACTION_CONSTANTS. MEMBERSHIP +  ERP_TRANSACTION_CONSTANTS.IRRIGATION_TYPE +  ERP_TRANSACTION_CONSTANTS.GET_ALL);
}

getAllandOwnerships() {
  return this.commonHttpService.getAll( ERP_TRANSACTION_CONSTANTS. MEMBERSHIP +  ERP_TRANSACTION_CONSTANTS.LAND_OWNERSHIP +  ERP_TRANSACTION_CONSTANTS.GET_ALL);
}

duplicateCheckForKhataNumber(landDetailsModel:any) {
  return this.commonHttpService.put(landDetailsModel, Headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + ERP_TRANSACTION_CONSTANTS.MEMBERSHIP_LAND_DETAILS + ERP_TRANSACTION_CONSTANTS.DUPLICATE_CHECK_FOR_KHATA_NUMBER)
}

getMeasuringUnit() {
  let headers = new HttpHeaders({})
  return this.commonHttpService.getById(headers, ERP_TRANSACTION_CONSTANTS.MEMBERSHIP + Configuration.UOM + ERP_TRANSACTION_CONSTANTS.GET_MEASURING_UNIT);
}
checkPassbookNumberInDb(pasbookNumber:any) {
  let headers = new HttpHeaders({ 'passbookNumber': pasbookNumber + '' })
  return this.commonHttpService.getById(headers,  ERP_TRANSACTION_CONSTANTS. MEMBERSHIP +  ERP_TRANSACTION_CONSTANTS.CUSTOMER_LAND_SURVEY_DETAILS +  ERP_TRANSACTION_CONSTANTS.GET_LAND_DETAILS_BY_PASSBOOK_NUMBER);
}

// checkKhataNumberInDb(khataNumber,villageId) {
//   let headers = new HttpHeaders({ 'khataNumber': khataNumber + '', 'id':villageId+'' })
//   return this.commonHttpService.getById(headers,  ERP_TRANSACTION_CONSTANTS. MEMBERSHIP +  ERP_TRANSACTION_CONSTANTS.CUSTOMER_LAND_SURVEY_DETAILS +  ERP_TRANSACTION_CONSTANTS.GET_LAND_DETAILS_BY_KHATA_NUMBER);
// }
}
