import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLandOwnersipTypeComponent } from './add-land-ownersip-type.component';

describe('AddLandOwnersipTypeComponent', () => {
  let component: AddLandOwnersipTypeComponent;
  let fixture: ComponentFixture<AddLandOwnersipTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLandOwnersipTypeComponent]
    });
    fixture = TestBed.createComponent(AddLandOwnersipTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
