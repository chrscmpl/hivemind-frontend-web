import { Subject } from 'rxjs';

const _AuthChanged$ = new Subject<void>();
const _IdeaUpdated$ = new Subject<void>();
const _IdeaDeleted$ = new Subject<void>();
const _CommentCreated$ = new Subject<void>();
const _CommentUpdated$ = new Subject<void>();
const _CommentDeleted$ = new Subject<void>();

export const cacheEvents = {
  get AuthChanged$() {
    return _AuthChanged$;
  },

  get IdeaUpdated$() {
    return _IdeaUpdated$;
  },

  get IdeaDeleted$() {
    return _IdeaDeleted$;
  },

  get CommentCreated$() {
    return _CommentCreated$;
  },

  get CommentUpdated$() {
    return _CommentUpdated$;
  },

  get CommentDeleted$() {
    return _CommentDeleted$;
  },
};
