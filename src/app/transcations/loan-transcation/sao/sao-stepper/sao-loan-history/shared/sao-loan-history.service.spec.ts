import { TestBed } from '@angular/core/testing';

import { SaoLoanHistoryService } from './sao-loan-history.service';

describe('SaoLoanHistoryService', () => {
  let service: SaoLoanHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaoLoanHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
