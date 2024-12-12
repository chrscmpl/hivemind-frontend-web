import { TestBed } from '@angular/core/testing';

import { IdeaPaginationService } from '../services/idea-pagination.service';

describe('IdeaPaginationService', () => {
  let service: IdeaPaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdeaPaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
