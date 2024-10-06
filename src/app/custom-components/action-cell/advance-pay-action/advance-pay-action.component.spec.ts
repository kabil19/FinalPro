import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePayActionComponent } from './advance-pay-action.component';

describe('AdvancePayActionComponent', () => {
  let component: AdvancePayActionComponent;
  let fixture: ComponentFixture<AdvancePayActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancePayActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePayActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
