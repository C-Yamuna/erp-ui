import { TestBed } from '@angular/core/testing';

import { DailyDepositsAccountsServiceService } from './daily-deposits-accounts.service';

describe('DailyDepositsAccountsServiceService', () => {
  let service: DailyDepositsAccountsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyDepositsAccountsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
