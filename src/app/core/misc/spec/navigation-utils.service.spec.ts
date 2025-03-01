import { TestBed } from '@angular/core/testing';

import { NavigationUtilsService } from '../services/navigation-utils.service';

describe('NavigationUtilsService', () => {
  let service: NavigationUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
