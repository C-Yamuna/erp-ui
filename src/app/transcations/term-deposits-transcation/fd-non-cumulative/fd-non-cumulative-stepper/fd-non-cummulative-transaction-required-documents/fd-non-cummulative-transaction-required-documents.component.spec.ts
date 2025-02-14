import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCummulativeTransactionRequiredDocumentsComponent } from './fd-non-cummulative-transaction-required-documents.component';

describe('FdNonCummulativeTransactionRequiredDocumentsComponent', () => {
  let component: FdNonCummulativeTransactionRequiredDocumentsComponent;
  let fixture: ComponentFixture<FdNonCummulativeTransactionRequiredDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCummulativeTransactionRequiredDocumentsComponent]
    });
    fixture = TestBed.createComponent(FdNonCummulativeTransactionRequiredDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
