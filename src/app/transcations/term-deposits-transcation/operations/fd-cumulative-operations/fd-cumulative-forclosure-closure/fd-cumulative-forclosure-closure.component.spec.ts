import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCumulativeForclosureClosureComponent } from './fd-cumulative-forclosure-closure.component';

describe('FdCumulativeForclosureClosureComponent', () => {
  let component: FdCumulativeForclosureClosureComponent;
  let fixture: ComponentFixture<FdCumulativeForclosureClosureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FdCumulativeForclosureClosureComponent]
    });
    fixture = TestBed.createComponent(FdCumulativeForclosureClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
