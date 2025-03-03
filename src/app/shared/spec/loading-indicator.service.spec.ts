import { TestBed } from '@angular/core/testing';

import { LoadingIndicatorService } from '../services/loading-indicator.service';

describe('LoadingIndicatorService', () => {
  let service: LoadingIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
