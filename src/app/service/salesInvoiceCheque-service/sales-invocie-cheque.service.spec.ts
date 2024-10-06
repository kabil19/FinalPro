import { TestBed } from '@angular/core/testing';

import { SalesInvocieChequeService } from './sales-invocie-cheque.service';

describe('SalesInvocieChequeService', () => {
  let service: SalesInvocieChequeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesInvocieChequeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
