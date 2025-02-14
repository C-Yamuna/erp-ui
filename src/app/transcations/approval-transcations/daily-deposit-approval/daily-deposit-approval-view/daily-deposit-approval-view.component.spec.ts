import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDepositApprovalViewComponent } from './daily-deposit-approval-view.component';

describe('DailyDepositApprovalViewComponent', () => {
  let component: DailyDepositApprovalViewComponent;
  let fixture: ComponentFixture<DailyDepositApprovalViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyDepositApprovalViewComponent]
    });
    fixture = TestBed.createComponent(DailyDepositApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
