import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCumulativeInterestPaymentComponent } from './fd-non-cumulative-interest-payment.component';

describe('FdNonCumulativeInterestPaymentComponent', () => {
  let component: FdNonCumulativeInterestPaymentComponent;
  let fixture: ComponentFixture<FdNonCumulativeInterestPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCumulativeInterestPaymentComponent]
    });
    fixture = TestBed.createComponent(FdNonCumulativeInterestPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
