import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';
import { ERP_TRANSACTION_CONSTANTS } from 'src/app/transcations/erp-transaction-constants';

@Injectable({
  providedIn: 'root'
})
export class RdAccountTransactionService {

  constructor(private commonHttpService: CommonHttpService) { }

  updateRdAccountTransaction(object: any) {
    return this.commonHttpService.put(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.RD_ACCOUNTS_TRANSACTIONS + ERP_TRANSACTION_CONSTANTS.UPDATE);
  }

  addRdAccountTransaction(object: any) {
    return this.commonHttpService.post(object, Headers, ERP_TRANSACTION_CONSTANTS.TERMDEPOSITS + ERP_TRANSACTION_CONSTANTS.RD_ACCOUNTS_TRANSACTIONS + ERP_TRANSACTION_CONSTANTS.ADD);
  }

  getAllTransactionModes() {
    return this.commonHttpService.getAll(Configuration.COMMON_MASTER + Configuration.TRANSACTION_MODES + Configuration.GET_ALL);
  }
}
