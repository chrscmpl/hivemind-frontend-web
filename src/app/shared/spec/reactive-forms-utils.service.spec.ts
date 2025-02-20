import { TestBed } from '@angular/core/testing';

import { ReactiveFormsUtilsService } from '../services/reactive-forms-utils.service';

describe('ReactiveFormsUtilsService', () => {
  let service: ReactiveFormsUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactiveFormsUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
