import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';

@Injectable({
  providedIn: 'root'
})
export class LandTypesService {

  constructor(
    private commonHttpService: CommonHttpService
  ) { }
  
  updateLandTypes(landTypeModel:any){
    return this.commonHttpService.put(landTypeModel, Headers, Configuration.MEMBERSHIP + Configuration.LAND_TYPES + Configuration.UPDATE);
  }
  getAllLandTypes() {
    return this.commonHttpService.getAll(Configuration.MEMBERSHIP + Configuration.LAND_TYPES + Configuration.GET_ALL);
  }

  deleteLandType(id: any) {
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.delete(headers, Configuration.MEMBERSHIP + Configuration.LAND_TYPES + Configuration.DELETE);
  }

  addLandTypes(landTypeModel:any){
    return this.commonHttpService.post(landTypeModel, Headers, Configuration.MEMBERSHIP + Configuration.LAND_TYPES+ Configuration.ADD);
  }

  getLandTypeById(id: any){
    let headers = new HttpHeaders({ 'id': id + '', })
    return this.commonHttpService.getById( headers, Configuration.MEMBERSHIP + Configuration.LAND_TYPES + Configuration.GET);
  }

}
