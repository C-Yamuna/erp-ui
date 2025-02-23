import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoldRatesComponent } from './add-gold-rates.component';

describe('AddGoldRatesComponent', () => {
  let component: AddGoldRatesComponent;
  let fixture: ComponentFixture<AddGoldRatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddGoldRatesComponent]
    });
    fixture = TestBed.createComponent(AddGoldRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
