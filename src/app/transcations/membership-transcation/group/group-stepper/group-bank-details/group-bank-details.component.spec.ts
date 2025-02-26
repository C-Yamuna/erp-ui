import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBankDetailsComponent } from './group-bank-details.component';

describe('GroupBankDetailsComponent', () => {
  let component: GroupBankDetailsComponent;
  let fixture: ComponentFixture<GroupBankDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupBankDetailsComponent]
    });
    fixture = TestBed.createComponent(GroupBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
