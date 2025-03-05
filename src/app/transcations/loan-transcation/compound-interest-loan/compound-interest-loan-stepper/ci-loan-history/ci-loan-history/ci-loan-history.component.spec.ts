import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanHistoryComponent } from './ci-loan-history.component';

describe('CiLoanHistoryComponent', () => {
  let component: CiLoanHistoryComponent;
  let fixture: ComponentFixture<CiLoanHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanHistoryComponent]
    });
    fixture = TestBed.createComponent(CiLoanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
