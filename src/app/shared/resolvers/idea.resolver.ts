import { ResolveFn } from '@angular/router';
import { IdeaEntity } from '../entities/idea.entity';
import { inject } from '@angular/core';
import { IdeaFetchService } from '../services/idea-fetch.service';

export const ideaResolver: ResolveFn<IdeaEntity> = (route) => {
  return inject(IdeaFetchService).fetch(route.params['id']);
};
