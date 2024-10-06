import { TestBed } from '@angular/core/testing';

import { ConfirmPurchaseAndCartServiceService } from './confirm-purchase-and-cart-service.service';

describe('ConfirmPurchaseAndCartServiceService', () => {
  let service: ConfirmPurchaseAndCartServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmPurchaseAndCartServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
