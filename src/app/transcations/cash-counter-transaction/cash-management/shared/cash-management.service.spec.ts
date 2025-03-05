import { TestBed } from '@angular/core/testing';

import { CashManagementService } from './cash-management.service';

describe('CashManagementService', () => {
  let service: CashManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
