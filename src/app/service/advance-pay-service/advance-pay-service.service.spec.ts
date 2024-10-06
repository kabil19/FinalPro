import { TestBed } from '@angular/core/testing';

import { AdvancePayServiceService } from './advance-pay-service.service';

describe('AdvancePayServiceService', () => {
  let service: AdvancePayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancePayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
