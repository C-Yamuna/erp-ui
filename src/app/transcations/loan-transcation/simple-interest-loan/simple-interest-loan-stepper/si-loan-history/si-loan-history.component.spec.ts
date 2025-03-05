import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiLoanHistoryComponent } from './si-loan-history.component';

describe('SiLoanHistoryComponent', () => {
  let component: SiLoanHistoryComponent;
  let fixture: ComponentFixture<SiLoanHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiLoanHistoryComponent]
    });
    fixture = TestBed.createComponent(SiLoanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
