import { TestBed } from '@angular/core/testing';

import { GoldRatesService } from './gold-rates.service';

describe('GoldRatesService', () => {
  let service: GoldRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoldRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
