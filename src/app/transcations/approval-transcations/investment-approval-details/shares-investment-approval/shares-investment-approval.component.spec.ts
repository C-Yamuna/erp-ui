import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesInvestmentApprovalComponent } from './shares-investment-approval.component';

describe('SharesInvestmentApprovalComponent', () => {
  let component: SharesInvestmentApprovalComponent;
  let fixture: ComponentFixture<SharesInvestmentApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharesInvestmentApprovalComponent]
    });
    fixture = TestBed.createComponent(SharesInvestmentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
