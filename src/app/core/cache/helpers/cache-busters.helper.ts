import { merge } from 'rxjs';
import { cacheEvents } from './cache-events.helper';

const authCacheBuster = cacheEvents.AuthChanged$;

const ideasCacheBuster = merge(
  cacheEvents.AuthChanged$,
  cacheEvents.IdeaUpdated$,
  cacheEvents.IdeaDeleted$,
);

const commentsCacheBuster = merge(
  cacheEvents.AuthChanged$,
  cacheEvents.CommentCreated$,
  cacheEvents.CommentDeleted$,
);

export const cacheBusters = {
  get ideas() {
    return ideasCacheBuster;
  },
  get comments() {
    return commentsCacheBuster;
  },
  get auth() {
    return authCacheBuster;
  },
};
