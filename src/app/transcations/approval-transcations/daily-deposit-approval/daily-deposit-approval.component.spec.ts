import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDepositApprovalComponent } from './daily-deposit-approval.component';

describe('DailyDepositApprovalComponent', () => {
  let component: DailyDepositApprovalComponent;
  let fixture: ComponentFixture<DailyDepositApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyDepositApprovalComponent]
    });
    fixture = TestBed.createComponent(DailyDepositApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
