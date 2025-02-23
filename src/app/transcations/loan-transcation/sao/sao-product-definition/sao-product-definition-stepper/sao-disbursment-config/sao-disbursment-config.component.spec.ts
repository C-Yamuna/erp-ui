import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaoDisbursmentConfigComponent } from './sao-disbursment-config.component';

describe('SaoDisbursmentConfigComponent', () => {
  let component: SaoDisbursmentConfigComponent;
  let fixture: ComponentFixture<SaoDisbursmentConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaoDisbursmentConfigComponent]
    });
    fixture = TestBed.createComponent(SaoDisbursmentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
