import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCumulativeRenewalComponent } from './fd-cumulative-renewal.component';

describe('FdCumulativeRenewalComponent', () => {
  let component: FdCumulativeRenewalComponent;
  let fixture: ComponentFixture<FdCumulativeRenewalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdCumulativeRenewalComponent]
    });
    fixture = TestBed.createComponent(FdCumulativeRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
