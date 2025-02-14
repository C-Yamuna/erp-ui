import { TestBed } from '@angular/core/testing';

import { LandTypesService } from './land-types.service';

describe('LandTypesService', () => {
  let service: LandTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
