import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmReloadGuard } from '../guards/confirm-reload.guard';

describe('confirmReloadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => confirmReloadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
