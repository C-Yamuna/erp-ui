import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiLoanClosureComponent } from './ci-loan-closure.component';

describe('CiLoanClosureComponent', () => {
  let component: CiLoanClosureComponent;
  let fixture: ComponentFixture<CiLoanClosureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CiLoanClosureComponent]
    });
    fixture = TestBed.createComponent(CiLoanClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
