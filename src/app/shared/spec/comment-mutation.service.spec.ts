import { TestBed } from '@angular/core/testing';

import { CommentMutationService } from '../services/comment-mutation.service';

describe('CommentMutationService', () => {
  let service: CommentMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentMutationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
