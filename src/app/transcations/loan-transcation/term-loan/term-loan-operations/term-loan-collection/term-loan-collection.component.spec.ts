import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanCollectionComponent } from './term-loan-collection.component';

describe('TermLoanCollectionComponent', () => {
  let component: TermLoanCollectionComponent;
  let fixture: ComponentFixture<TermLoanCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanCollectionComponent]
    });
    fixture = TestBed.createComponent(TermLoanCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
