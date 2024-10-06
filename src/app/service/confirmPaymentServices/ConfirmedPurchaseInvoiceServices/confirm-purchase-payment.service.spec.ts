import { TestBed } from '@angular/core/testing';

import { ConfirmPurchasePaymentService } from './confirm-purchase-payment.service';

describe('ConfirmPurchasePaymentService', () => {
  let service: ConfirmPurchasePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmPurchasePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
