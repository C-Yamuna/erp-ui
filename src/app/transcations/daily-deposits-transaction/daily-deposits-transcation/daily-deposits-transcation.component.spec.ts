import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDepositsTranscationComponent } from './daily-deposits-transcation.component';

describe('DailyDepositsTranscationComponent', () => {
  let component: DailyDepositsTranscationComponent;
  let fixture: ComponentFixture<DailyDepositsTranscationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyDepositsTranscationComponent]
    });
    fixture = TestBed.createComponent(DailyDepositsTranscationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
