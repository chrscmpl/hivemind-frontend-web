import { Subject } from 'rxjs';

const _AuthChanged$ = new Subject<void>();
const _IdeaUpdated$ = new Subject<void>();
const _IdeaDeleted$ = new Subject<void>();

export const cacheBusters = {
  get AuthChanged$() {
    return _AuthChanged$;
  },

  get IdeaUpdated$() {
    return _IdeaUpdated$;
  },

  get IdeaDeleted$() {
    return _IdeaDeleted$;
  },
};
