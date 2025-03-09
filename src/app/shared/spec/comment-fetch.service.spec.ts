import { TestBed } from '@angular/core/testing';

import { CommentFetchService } from '../services/comment-fetch.service';

describe('CommentFetchService', () => {
  let service: CommentFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
