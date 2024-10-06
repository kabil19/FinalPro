import { TestBed } from '@angular/core/testing';

import { CetegoryService } from './cetegory.service';

describe('CetegoryService', () => {
  let service: CetegoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CetegoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
