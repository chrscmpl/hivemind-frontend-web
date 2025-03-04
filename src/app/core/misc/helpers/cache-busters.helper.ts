import { Subject } from 'rxjs';

class CacheBusters {
  private _AuthChanged$ = new Subject<void>();

  public get AuthChanged$() {
    return this._AuthChanged$;
  }
}

export const cacheBusters = new CacheBusters();
