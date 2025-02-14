import { TestBed } from '@angular/core/testing';

import { InterestPaymentService } from './interest-payment.service';

describe('InterestPaymentService', () => {
  let service: InterestPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterestPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
