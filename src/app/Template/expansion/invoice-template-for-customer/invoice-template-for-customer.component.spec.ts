import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTemplateForCustomerComponent } from './invoice-template-for-customer.component';

describe('InvoiceTemplateForCustomerComponent', () => {
  let component: InvoiceTemplateForCustomerComponent;
  let fixture: ComponentFixture<InvoiceTemplateForCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTemplateForCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceTemplateForCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
