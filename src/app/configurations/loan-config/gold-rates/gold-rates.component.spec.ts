import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldRatesComponent } from './gold-rates.component';

describe('GoldRatesComponent', () => {
  let component: GoldRatesComponent;
  let fixture: ComponentFixture<GoldRatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldRatesComponent]
    });
    fixture = TestBed.createComponent(GoldRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
