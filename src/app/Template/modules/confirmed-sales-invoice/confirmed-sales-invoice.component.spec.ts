import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedSalesInvoiceComponent } from './confirmed-sales-invoice.component';

describe('ConfirmedSalesInvoiceComponent', () => {
  let component: ConfirmedSalesInvoiceComponent;
  let fixture: ComponentFixture<ConfirmedSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmedSalesInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmedSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
