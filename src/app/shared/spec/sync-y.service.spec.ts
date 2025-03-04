import { TestBed } from '@angular/core/testing';

import { SyncYService } from '../services/sync-y.service';

describe('SyncYService', () => {
  let service: SyncYService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncYService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
