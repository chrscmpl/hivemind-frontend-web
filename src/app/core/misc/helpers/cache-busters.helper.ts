import { Subject } from 'rxjs';

class CacheBusters {
  private _AuthChanged$ = new Subject<void>();
  private _IdeaUpdated$ = new Subject<void>();

  public get AuthChanged$() {
    return this._AuthChanged$;
  }

  public get IdeaUpdated$() {
    return this._IdeaUpdated$;
  }
}

export const cacheBusters = new CacheBusters();
