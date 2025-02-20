import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class LandOwnersipTypeService {

  constructor(
      private commonHttpService: CommonHttpService
  ) { }

    updateLandOwnershipTypes(landTypeModel:any){
      return this.commonHttpService.put(landTypeModel, Headers, Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE + Configuration.UPDATE);
    }
    getAllLandownershipTypes() {
      return this.commonHttpService.getAll(Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE + Configuration.GET_ALL);
    }
  
    deleteLandownershipType(id: any) {
      let headers = new HttpHeaders({ 'id': id + '', })
      return this.commonHttpService.delete(headers, Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE + Configuration.DELETE);
    }
  
    addLandownershipTypes(landTypeModel:any){
      return this.commonHttpService.post(landTypeModel, Headers, Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE+ Configuration.ADD);
    }
  
    getLandownershipTypeById(id: any){
      let headers = new HttpHeaders({ 'id': id + '', })
      return this.commonHttpService.getById( headers, Configuration.MEMBERSHIP + Configuration.LAND_OWNERSHIP_TYPE + Configuration.GET);
    }
}
