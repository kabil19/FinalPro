import { TestBed } from '@angular/core/testing';

import { PurchaseInvoiceChequeService } from './purchase-invoice-cheque.service';

describe('PurchaseInvoiceChequeService', () => {
  let service: PurchaseInvoiceChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseInvoiceChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
