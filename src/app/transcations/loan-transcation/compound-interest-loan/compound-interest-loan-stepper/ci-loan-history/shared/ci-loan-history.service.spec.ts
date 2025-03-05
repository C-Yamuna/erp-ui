import { TestBed } from '@angular/core/testing';

import { CiLoanHistoryService } from './ci-loan-history.service';

describe('CiLoanHistoryService', () => {
  let service: CiLoanHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CiLoanHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
