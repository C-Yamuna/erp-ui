import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanDisbursementComponent } from './term-loan-disbursement.component';

describe('TermLoanDisbursementComponent', () => {
  let component: TermLoanDisbursementComponent;
  let fixture: ComponentFixture<TermLoanDisbursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanDisbursementComponent]
    });
    fixture = TestBed.createComponent(TermLoanDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
