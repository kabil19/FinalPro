import { TestBed } from '@angular/core/testing';

import { ReturnCartService } from './return-cart.service';

describe('ReturnCartService', () => {
  let service: ReturnCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
