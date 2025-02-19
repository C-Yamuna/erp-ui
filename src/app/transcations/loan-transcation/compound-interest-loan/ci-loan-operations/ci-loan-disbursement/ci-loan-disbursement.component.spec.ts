import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanDisbursementComponent } from './ci-loan-disbursement.component';

describe('CiLoanDisbursementComponent', () => {
  let component: CiLoanDisbursementComponent;
  let fixture: ComponentFixture<CiLoanDisbursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanDisbursementComponent]
    });
    fixture = TestBed.createComponent(CiLoanDisbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
