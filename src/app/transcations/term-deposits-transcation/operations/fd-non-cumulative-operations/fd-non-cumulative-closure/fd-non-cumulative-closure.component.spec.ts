import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdNonCumulativeClosureComponent } from './fd-non-cumulative-closure.component';

describe('FdNonCumulativeClosureComponent', () => {
  let component: FdNonCumulativeClosureComponent;
  let fixture: ComponentFixture<FdNonCumulativeClosureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdNonCumulativeClosureComponent]
    });
    fixture = TestBed.createComponent(FdNonCumulativeClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
