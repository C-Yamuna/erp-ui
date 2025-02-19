import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringDepositForeclosureClosureComponent } from './recurring-deposit-foreclosure-closure.component';

describe('RecurringDepositForeclosureClosureComponent', () => {
  let component: RecurringDepositForeclosureClosureComponent;
  let fixture: ComponentFixture<RecurringDepositForeclosureClosureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecurringDepositForeclosureClosureComponent]
    });
    fixture = TestBed.createComponent(RecurringDepositForeclosureClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
