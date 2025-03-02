import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { uiStyleGuard } from '../guards/ui-style.guard';

describe('uiStyleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => uiStyleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
