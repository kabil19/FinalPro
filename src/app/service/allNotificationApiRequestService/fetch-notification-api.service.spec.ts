import { TestBed } from '@angular/core/testing';

import { FetchNotificationApiService } from './fetch-notification-api.service';

describe('FetchNotificationApiService', () => {
  let service: FetchNotificationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchNotificationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
