import { TestBed } from '@angular/core/testing';

import { FdNonCummulativeTransactionRequiredDocumentsService } from './fd-non-cummulative-transaction-required-documents.service';

describe('FdNonCummulativeTransactionRequiredDocumentsService', () => {
  let service: FdNonCummulativeTransactionRequiredDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FdNonCummulativeTransactionRequiredDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
