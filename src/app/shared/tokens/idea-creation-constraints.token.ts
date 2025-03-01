import { InjectionToken } from '@angular/core';
import { IdeaCreationConstraintsEntity } from '../entities/idea-creation-contraints.entity';

export const IDEA_CREATION_CONSTRAINTS =
  new InjectionToken<IdeaCreationConstraintsEntity>(
    'IDEA_CREATION_CONSTRAINTS',
    {
      providedIn: 'root',
      factory: () => ({
        title: {
          minLength: 1,
          maxLength: 300,
        },
        content: {
          maxLength: 3000,
        },
      }),
    },
  );
