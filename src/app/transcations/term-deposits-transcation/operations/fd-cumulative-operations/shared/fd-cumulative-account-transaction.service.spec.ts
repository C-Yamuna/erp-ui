import { TestBed } from '@angular/core/testing';

import { FdCumulativeAccountTransactionService } from './fd-cumulative-account-transaction.service';

describe('FdCumulativeAccountTransactionService', () => {
  let service: FdCumulativeAccountTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FdCumulativeAccountTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
