import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentApprovalDetailsComponent } from './investment-approval-details.component';

describe('InvestmentApprovalDetailsComponent', () => {
  let component: InvestmentApprovalDetailsComponent;
  let fixture: ComponentFixture<InvestmentApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvestmentApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(InvestmentApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
