import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Member360DetailsViewComponent } from './member360-details-view.component';

describe('Member360DetailsViewComponent', () => {
  let component: Member360DetailsViewComponent;
  let fixture: ComponentFixture<Member360DetailsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Member360DetailsViewComponent]
    });
    fixture = TestBed.createComponent(Member360DetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
