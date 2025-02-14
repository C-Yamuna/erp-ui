import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Configuration } from 'src/app/configurations/configurations-constants';
import { CommonHttpService } from 'src/app/shared/common-http.service';

export type stepperDataModel = {
  formValid?: boolean,
  stepperIndex?: number;
  data?: any;
  method?: any;
  url?: string;
  isObjChanged?: boolean;
  isDisable?: boolean;
} | null;

@Injectable({
  providedIn: 'root'
})
export class SavingsBankStepperService {
  private savingsDepositStepper = new BehaviorSubject<stepperDataModel>(null);
  public currentStep = this.savingsDepositStepper.asObservable();

  constructor(private commonHttpService:CommonHttpService) { }

  changeData(data: stepperDataModel) {
    this.savingsDepositStepper.next(data)
  }
}
