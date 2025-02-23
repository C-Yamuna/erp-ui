import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanDisbursementScheduleComponent } from './term-loan-disbursement-schedule.component';

describe('TermLoanDisbursementScheduleComponent', () => {
  let component: TermLoanDisbursementScheduleComponent;
  let fixture: ComponentFixture<TermLoanDisbursementScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanDisbursementScheduleComponent]
    });
    fixture = TestBed.createComponent(TermLoanDisbursementScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
