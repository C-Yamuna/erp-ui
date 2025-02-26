import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionBankDetailsComponent } from './institution-bank-details.component';

describe('InstitutionBankDetailsComponent', () => {
  let component: InstitutionBankDetailsComponent;
  let fixture: ComponentFixture<InstitutionBankDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstitutionBankDetailsComponent]
    });
    fixture = TestBed.createComponent(InstitutionBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
