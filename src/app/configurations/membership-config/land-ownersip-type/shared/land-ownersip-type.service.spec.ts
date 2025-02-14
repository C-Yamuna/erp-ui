import { TestBed } from '@angular/core/testing';

import { LandOwnersipTypeService } from './land-ownersip-type.service';

describe('LandOwnersipTypeService', () => {
  let service: LandOwnersipTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandOwnersipTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
