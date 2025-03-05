import { TestBed } from '@angular/core/testing';

import { CreateIdeaFormService } from '../services/create-idea-form.service';

describe('CreateIdeaFormService', () => {
  let service: CreateIdeaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateIdeaFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
