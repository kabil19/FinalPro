import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentsHistoryTemplateComponent } from './invoice-payments-history-template.component';

describe('InvoicePaymentsHistoryTemplateComponent', () => {
  let component: InvoicePaymentsHistoryTemplateComponent;
  let fixture: ComponentFixture<InvoicePaymentsHistoryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePaymentsHistoryTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePaymentsHistoryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
