import { TestBed } from '@angular/core/testing';

import { TempPurchaseService } from './temp-purchase.service';

describe('TempPurchaseService', () => {
  let service: TempPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TempPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
