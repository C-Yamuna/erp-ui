import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanCollectionComponent } from './ci-loan-collection.component';

describe('CiLoanCollectionComponent', () => {
  let component: CiLoanCollectionComponent;
  let fixture: ComponentFixture<CiLoanCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanCollectionComponent]
    });
    fixture = TestBed.createComponent(CiLoanCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
