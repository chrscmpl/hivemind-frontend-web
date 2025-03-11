import { InjectionToken } from '@angular/core';
import { IdeaCreationConstraintsEntity } from '../entities/idea-creation-constraints.entity';

export const IDEA_CREATION_CONSTRAINTS =
  new InjectionToken<IdeaCreationConstraintsEntity>(
    'IDEA_CREATION_CONSTRAINTS',
    {
      providedIn: 'root',
      factory: () => ({
        title: {
          minLength: 5,
          maxLength: 300,
        },
        content: {
          maxLength: 3000,
        },
      }),
    },
  );
