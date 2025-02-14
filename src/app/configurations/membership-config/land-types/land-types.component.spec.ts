import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandTypesComponent } from './land-types.component';

describe('LandTypesComponent', () => {
  let component: LandTypesComponent;
  let fixture: ComponentFixture<LandTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandTypesComponent]
    });
    fixture = TestBed.createComponent(LandTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
