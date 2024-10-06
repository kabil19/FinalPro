import { TestBed } from '@angular/core/testing';

import { TempPurchaseCartService } from './temp-purchase-cart.service';

describe('TempPurchaseCartService', () => {
  let service: TempPurchaseCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempPurchaseCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
