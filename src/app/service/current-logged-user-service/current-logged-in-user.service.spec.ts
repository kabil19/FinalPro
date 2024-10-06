import { TestBed } from '@angular/core/testing';

import { CurrentLoggedInUserService } from './current-logged-in-user.service';

describe('CurrentLoggedInUserService', () => {
  let service: CurrentLoggedInUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentLoggedInUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
