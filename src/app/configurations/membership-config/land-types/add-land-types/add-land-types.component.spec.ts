import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLandTypesComponent } from './add-land-types.component';

describe('AddLandTypesComponent', () => {
  let component: AddLandTypesComponent;
  let fixture: ComponentFixture<AddLandTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLandTypesComponent]
    });
    fixture = TestBed.createComponent(AddLandTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
