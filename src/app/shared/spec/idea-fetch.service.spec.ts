import { TestBed } from '@angular/core/testing';

import { IdeaFetchService } from '../services/idea-fetch.service';

describe('IdeaFetchService', () => {
  let service: IdeaFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdeaFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
