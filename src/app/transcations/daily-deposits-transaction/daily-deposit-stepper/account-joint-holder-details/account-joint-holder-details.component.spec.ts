import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountJointHolderDetailsComponent } from './account-joint-holder-details.component';

describe('AccountJointHolderDetailsComponent', () => {
  let component: AccountJointHolderDetailsComponent;
  let fixture: ComponentFixture<AccountJointHolderDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountJointHolderDetailsComponent]
    });
    fixture = TestBed.createComponent(AccountJointHolderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
