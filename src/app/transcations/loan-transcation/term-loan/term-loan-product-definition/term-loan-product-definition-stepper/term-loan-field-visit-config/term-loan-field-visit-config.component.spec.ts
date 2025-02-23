import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanFieldVisitConfigComponent } from './term-loan-field-visit-config.component';

describe('TermLoanFieldVisitConfigComponent', () => {
  let component: TermLoanFieldVisitConfigComponent;
  let fixture: ComponentFixture<TermLoanFieldVisitConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanFieldVisitConfigComponent]
    });
    fixture = TestBed.createComponent(TermLoanFieldVisitConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
