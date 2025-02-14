import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandOwnersipTypeComponent } from './land-ownersip-type.component';

describe('LandOwnersipTypeComponent', () => {
  let component: LandOwnersipTypeComponent;
  let fixture: ComponentFixture<LandOwnersipTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandOwnersipTypeComponent]
    });
    fixture = TestBed.createComponent(LandOwnersipTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
