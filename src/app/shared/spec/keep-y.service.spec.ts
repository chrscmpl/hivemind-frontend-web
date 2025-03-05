import { TestBed } from '@angular/core/testing';

import { KeepYService } from '../services/keep-y.service';

describe('KeepYService', () => {
  let service: KeepYService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeepYService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
