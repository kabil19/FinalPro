import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPaymentsComponent } from './common-payments.component';

describe('CommonPaymentsComponent', () => {
  let component: CommonPaymentsComponent;
  let fixture: ComponentFixture<CommonPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
