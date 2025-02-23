import { TestBed } from '@angular/core/testing';

import { SaoFieldVisitServiceService } from './sao-field-visit-service.service';

describe('SaoFieldVisitServiceService', () => {
  let service: SaoFieldVisitServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaoFieldVisitServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
