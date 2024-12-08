import { TestBed } from '@angular/core/testing';

import { BreakpointService } from '../services/breakpoint.service';

describe('BreakpointsService', () => {
  let service: BreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreakpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
