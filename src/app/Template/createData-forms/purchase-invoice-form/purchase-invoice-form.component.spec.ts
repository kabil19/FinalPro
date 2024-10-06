import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceFormComponent } from './purchase-invoice-form.component';

describe('PurchaseInvoiceFormComponent', () => {
  let component: PurchaseInvoiceFormComponent;
  let fixture: ComponentFixture<PurchaseInvoiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiceFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseInvoiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
