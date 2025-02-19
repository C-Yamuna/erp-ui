import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringDepositRenewalComponent } from './recurring-deposit-renewal.component';

describe('RecurringDepositRenewalComponent', () => {
  let component: RecurringDepositRenewalComponent;
  let fixture: ComponentFixture<RecurringDepositRenewalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecurringDepositRenewalComponent]
    });
    fixture = TestBed.createComponent(RecurringDepositRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
