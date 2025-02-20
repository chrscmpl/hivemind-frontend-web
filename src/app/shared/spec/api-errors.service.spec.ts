import { TestBed } from '@angular/core/testing';

import { ApiErrorsService } from '../services/api-errors.service';

describe('ApiErrorsService', () => {
  let service: ApiErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
