import { TestBed } from '@angular/core/testing';

import { ConfirmInvoiceService } from './confirm-invoice.service';

describe('ConfirmInvoiceService', () => {
  let service: ConfirmInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
