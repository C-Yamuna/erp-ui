import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCashDenominationsComponent } from './create-cash-denominations.component';

describe('CreateCashDenominationsComponent', () => {
  let component: CreateCashDenominationsComponent;
  let fixture: ComponentFixture<CreateCashDenominationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCashDenominationsComponent]
    });
    fixture = TestBed.createComponent(CreateCashDenominationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
