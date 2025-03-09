import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { doAnimateEntranceResolver } from './do-animate-entry.resolver';

describe('doAnimateEntryResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      doAnimateEntranceResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
