import { InjectionToken } from '@angular/core';
import { CommentCreationConstraintsEntity } from '../entities/comment-creation-constraints.entity';

export const COMMENT_CREATION_CONSTRAINTS =
  new InjectionToken<CommentCreationConstraintsEntity>(
    'COMMENT_CREATION_CONSTRAINTS',
    {
      providedIn: 'root',
      factory: () => ({
        content: {
          maxLength: 1000,
        },
      }),
    },
  );
