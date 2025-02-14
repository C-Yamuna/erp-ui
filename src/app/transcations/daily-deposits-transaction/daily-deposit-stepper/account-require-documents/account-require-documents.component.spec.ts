import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRequireDocumentsComponent } from './account-require-documents.component';

describe('AccountRequireDocumentsComponent', () => {
  let component: AccountRequireDocumentsComponent;
  let fixture: ComponentFixture<AccountRequireDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountRequireDocumentsComponent]
    });
    fixture = TestBed.createComponent(AccountRequireDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
