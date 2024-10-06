import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePayHistoryComponent } from './advance-pay-history.component';

describe('AdvancePayHistoryComponent', () => {
  let component: AdvancePayHistoryComponent;
  let fixture: ComponentFixture<AdvancePayHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePayHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePayHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
