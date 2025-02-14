import { TestBed } from '@angular/core/testing';

import { FdNonCummulativeInterestPaymentService } from './fd-non-cummulative-interest-payment.service';

describe('FdNonCummulativeInterestPaymentService', () => {
  let service: FdNonCummulativeInterestPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FdNonCummulativeInterestPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
