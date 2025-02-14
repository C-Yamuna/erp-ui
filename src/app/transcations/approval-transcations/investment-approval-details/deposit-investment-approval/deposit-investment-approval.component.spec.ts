import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositInvestmentApprovalComponent } from './deposit-investment-approval.component';

describe('DepositInvestmentApprovalComponent', () => {
  let component: DepositInvestmentApprovalComponent;
  let fixture: ComponentFixture<DepositInvestmentApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepositInvestmentApprovalComponent]
    });
    fixture = TestBed.createComponent(DepositInvestmentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
