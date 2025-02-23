import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class GoldRatesService {

  constructor(private commonHttpService:CommonHttpService) { }

  updateGoldRates(kycdocumentModel:any){
      return this.commonHttpService.put(kycdocumentModel, Headers, Configuration.LOANS + Configuration.GOLD_RATES + Configuration.UPDATE);
    }
  
    addGoldRates(kycdocumentModel:any){
      return this.commonHttpService.post(kycdocumentModel, Headers, Configuration.LOANS + Configuration.GOLD_RATES+ Configuration.ADD);
    }
  
    getAllGoldRates(){
      return this.commonHttpService.getAll(Configuration.LOANS + Configuration.GOLD_RATES + Configuration.GET_ALL);
    }
  
    getGoldRatesById(id: any){
      let headers = new HttpHeaders({ 'id': id + '', })
      return this.commonHttpService.getById( headers, Configuration.LOANS + Configuration.GOLD_RATES + Configuration.GET);
    }
  
    deleteGoldRates(id: any){
      let headers = new HttpHeaders({ 'id': id + '', })
      return this.commonHttpService.delete( headers, Configuration.LOANS + Configuration.GOLD_RATES + Configuration.DELETE);
    }
}
