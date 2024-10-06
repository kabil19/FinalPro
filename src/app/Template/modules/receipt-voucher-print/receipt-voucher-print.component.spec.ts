import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptVoucherPrintComponent } from './receipt-voucher-print.component';

describe('ReceiptVoucherPrintComponent', () => {
  let component: ReceiptVoucherPrintComponent;
  let fixture: ComponentFixture<ReceiptVoucherPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptVoucherPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptVoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
