import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCumulativeForeclosureComponent } from './fd-non-cumulative-foreclosure.component';

describe('FdNonCumulativeForeclosureComponent', () => {
  let component: FdNonCumulativeForeclosureComponent;
  let fixture: ComponentFixture<FdNonCumulativeForeclosureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCumulativeForeclosureComponent]
    });
    fixture = TestBed.createComponent(FdNonCumulativeForeclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
