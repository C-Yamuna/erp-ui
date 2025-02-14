import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { applicationConstants } from '../shared/applicationConstants';
import { DatePipe } from '@angular/common';

@Injectable()
export class CommonFunctionsService {

  date: any;
  public dataSource = new BehaviorSubject<any>(this.getStorageValue('language') || 'en');
  data: any = this.dataSource.asObservable();

  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private datePipe: DatePipe) {
  }

  saveAuthToken(val: any): void {
    this.storage.set(applicationConstants.HEADER_AUTHEN_KEY, val);
  }

  getAuthToken(): any {
    let authToken: any = this.storage.get(applicationConstants.HEADER_AUTHEN_KEY);
    return authToken;
  }
  setUserInSession(val: any): void {
    this.storage.set(applicationConstants.HEADER_USER_KEY, val);
  }

  getUserFromSession(): any {
    let userid: number = this.storage.get(applicationConstants.HEADER_USER_KEY);
    return userid;
  }

  removeToken(): any {
    this.storage.remove(applicationConstants.HEADER_USER_KEY);
    this.storage.remove(applicationConstants.HEADER_AUTHEN_KEY);
    this.storage.remove(applicationConstants.ORG_DATE_FORMATE);
    this.storage.remove(applicationConstants.roleId);
    this.storage.remove(applicationConstants.roleName);
    this.storage.remove(applicationConstants.institutionId);
  }

  setStorageValue(constants: any, val: any): void {
    this.storage.set(constants, val);
  }

  getStorageValue(constant: any): any {
    return this.storage.get(constant);
  }

  removeStorageValue(constant: any): void {
    this.storage.remove(constant);
  }

  getUTCEpoch(date: any) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let d = Date.UTC(year, month, day);
    return d;
  }

  getUTCEpochWithTime(dateVal: Date) {
    let givenDate = new Date(dateVal);
    let year = givenDate.getUTCFullYear();
    let month = givenDate.getUTCMonth();
    let day = givenDate.getUTCDay();
    let hour = givenDate.getUTCHours();
    let mins = givenDate.getUTCMinutes();
    let secs = givenDate.getUTCSeconds();
    let d = Date.UTC(year, month, day, hour, mins, secs);
    return d;
  }

  languageSelection(data: any) {
    this.dataSource.next(data);
  }

  /**
     * converting html to type string
     * @returns  string data
     */
  convertHTMLtoString(html: any) {
    var temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  convertLocalDatetoUTCDateWithoutTime(year: any, month: any) {
    return this.getUTCEpoch(new Date(year, month))
  }

  convertLocalDatetoUTCDateWithTime(date: any) {
    return this.getUTCEpoch(new Date(date))
  }

  getFinancialYear() {
    let month = new Date().getMonth();
    let financialYear = '';
    if (month > 2) {
      financialYear = financialYear + new Date().getFullYear() + "-" + (new Date().getFullYear() + 1);
    } else {
      financialYear = financialYear + (new Date().getFullYear() - 1) + "-" + new Date().getFullYear();
    }
    return financialYear;
  }

  monthDiff(dateFrom: Date, dateTo: Date) {
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

  getUTCEpochWithTimedateConversionToLong(dataVal: any) {
    if (dataVal != null && dataVal != undefined) {
      let dateSplit: any[] = dataVal.split('/');
      if (dateSplit != null && dateSplit != undefined && dateSplit.length >= 3) {
        this.date = this.getUTCEpoch(new Date(dateSplit[2], Number(dateSplit[1]) - 1, dateSplit[0], 0, 0, 0));
      }
    }
    return this.date;
  }

  dateConvertionIntoFormate(date: any) {
    const formattedDate = this.datePipe.transform(new Date(date), 'dd/MMM/yyyy');
    let dateVal = formattedDate;
    return dateVal;
  }
  currentDate() {
    let date = new Date();
    const formattedDate = this.datePipe.transform(new Date(date), 'dd/MMM/yyyy');
    return formattedDate;
  }

  dateConvertsionToLong(dataVal: any) {
    const formattedDate = dataVal.toUTCString();
    const timestamp = Math.floor(dataVal.getTime() / 1000);
    return timestamp;
  }


  /**
   * @implements string values of Number
   * @author jyothi.naidana
   */
  private ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  /**
   * @implements string values of tens
   * @author jyothi.naidana
   */
  private tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  /**
   * @implements convert number to string
   * @param num 
   * @returns convertedNumber
   * @author jyothi.naidana
   */
  convertToWords(num: number): string {
    if (num === 0) return 'Zero rupees only';
    return this.convert(num) + ' rupees only';
  }

  /**
   * @implements biuld number string 
   * @param num 
   * @returns 
   * @author jyothi.naidana
   */
  private convert(num: number): string {
    if (num < 20) {
      return this.ones[num];
    } else if (num < 100) {
      return this.tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + this.ones[num % 10] : '');
    } else if (num < 1000) {
      return this.ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + this.convert(num % 100) : '');
    } else if (num < 100000) {
      return this.convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + this.convert(num % 1000) : '');
    } else if (num < 10000000) {
      return this.convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + this.convert(num % 100000) : '');
    } else {
      return this.convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + this.convert(num % 10000000) : '');
    }
  }
  
}