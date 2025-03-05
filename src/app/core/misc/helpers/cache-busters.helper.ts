import { Subject } from 'rxjs';

class CacheBusters {
  private _AuthChanged$ = new Subject<void>();
  private _IdeaUpdated$ = new Subject<void>();
  private _IdeaDeleted$ = new Subject<void>();

  public get AuthChanged$() {
    return this._AuthChanged$;
  }

  public get IdeaUpdated$() {
    return this._IdeaUpdated$;
  }

  public get IdeaDeleted$() {
    return this._IdeaDeleted$;
  }
}

export const cacheBusters = new CacheBusters();
