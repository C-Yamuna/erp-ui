import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoFieldVisitConfigComponent } from './sao-field-visit-config.component';

describe('SaoFieldVisitConfigComponent', () => {
  let component: SaoFieldVisitConfigComponent;
  let fixture: ComponentFixture<SaoFieldVisitConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoFieldVisitConfigComponent]
    });
    fixture = TestBed.createComponent(SaoFieldVisitConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
