import { TestBed } from '@angular/core/testing';

import { ConfirmSalesInvociePaymentService } from './confirm-sales-invocie-payment.service';

describe('ConfirmSalesInvociePaymentService', () => {
  let service: ConfirmSalesInvociePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmSalesInvociePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
