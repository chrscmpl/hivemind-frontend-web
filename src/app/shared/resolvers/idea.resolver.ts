import { ResolveFn } from '@angular/router';
import { IdeaEntity } from '../entities/idea.entity';
import { inject } from '@angular/core';
import { IdeaFetchService } from '../services/idea-fetch.service';
import { of, switchMap, throwError } from 'rxjs';
import { AuthService } from '@app/core/auth/services/auth.service';

interface ideaResolverOptions {
  requireIsAuthor?: boolean;
}

export const ideaResolver: (
  options?: ideaResolverOptions,
) => ResolveFn<IdeaEntity> = (options) => (route) => {
  const auth = options?.requireIsAuthor ? inject(AuthService) : null;

  return inject(IdeaFetchService)
    .fetch(route.params['id'])
    .pipe(
      switchMap((idea) => {
        if (
          options?.requireIsAuthor &&
          (idea.user?.id == null || auth!.authUser()?.id !== idea.user?.id)
        ) {
          return throwError(() => new Error('Not authorized'));
        }
        return of(idea);
      }),
    );
};
