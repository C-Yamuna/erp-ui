import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCumulativeRenewalComponent } from './fd-non-cumulative-renewal.component';

describe('FdNonCumulativeRenewalComponent', () => {
  let component: FdNonCumulativeRenewalComponent;
  let fixture: ComponentFixture<FdNonCumulativeRenewalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCumulativeRenewalComponent]
    });
    fixture = TestBed.createComponent(FdNonCumulativeRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
