import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentsHistoryProcessComponent } from './invoice-payments-history-process.component';

describe('InvoicePaymentsHistoryProcessComponent', () => {
  let component: InvoicePaymentsHistoryProcessComponent;
  let fixture: ComponentFixture<InvoicePaymentsHistoryProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePaymentsHistoryProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePaymentsHistoryProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
