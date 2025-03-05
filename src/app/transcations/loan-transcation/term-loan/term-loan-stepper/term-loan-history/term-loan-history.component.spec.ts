import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanHistoryComponent } from './term-loan-history.component';

describe('TermLoanHistoryComponent', () => {
  let component: TermLoanHistoryComponent;
  let fixture: ComponentFixture<TermLoanHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermLoanHistoryComponent]
    });
    fixture = TestBed.createComponent(TermLoanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
