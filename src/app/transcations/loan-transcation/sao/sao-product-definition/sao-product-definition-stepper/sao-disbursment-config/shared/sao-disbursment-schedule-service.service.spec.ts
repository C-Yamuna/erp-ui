import { TestBed } from '@angular/core/testing';

import { SaoDisbursmentScheduleServiceService } from './sao-disbursment-schedule-service.service';

describe('SaoDisbursmentScheduleServiceService', () => {
  let service: SaoDisbursmentScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaoDisbursmentScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
