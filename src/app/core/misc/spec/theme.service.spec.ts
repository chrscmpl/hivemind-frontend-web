import { TestBed } from '@angular/core/testing';

import { ThemeService } from '../services/theme.service';

describe('BreakpointsService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
