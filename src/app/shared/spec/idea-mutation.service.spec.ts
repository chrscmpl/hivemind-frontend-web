import { TestBed } from '@angular/core/testing';

import { IdeaMutationService } from '../services/idea-mutation.service';

describe('IdeaMutationService', () => {
  let service: IdeaMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdeaMutationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
