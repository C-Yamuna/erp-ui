import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoLoanHistoryComponent } from './sao-loan-history.component';

describe('SaoLoanHistoryComponent', () => {
  let component: SaoLoanHistoryComponent;
  let fixture: ComponentFixture<SaoLoanHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoLoanHistoryComponent]
    });
    fixture = TestBed.createComponent(SaoLoanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
