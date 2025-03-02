import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { filter, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationUtilsService {
  private _backAction: ((defaultFn: () => void) => void) | null = null;

  public readonly navigationStopped$: Observable<
    NavigationEnd | NavigationCancel | NavigationError
  >;
  public readonly navigationEnd$: Observable<NavigationEnd>;
  public readonly navigationCancel$: Observable<NavigationCancel>;
  public readonly navigationError$: Observable<NavigationError>;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
  ) {
    this.navigationStopped$ = this.router.events.pipe(
      filter(
        (e) =>
          e instanceof NavigationCancel ||
          e instanceof NavigationError ||
          e instanceof NavigationEnd,
      ),
    );
    this.navigationEnd$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
    );
    this.navigationCancel$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationCancel),
    );
    this.navigationError$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationError),
    );
  }

  public set backAction(action: ((defaultFn: () => void) => void) | null) {
    this._backAction = action;
  }

  public back(): void {
    if (this._backAction) this._backAction(this.onBackDefault.bind(this));
    else this.onBackDefault();
  }

  private onBackDefault() {
    this.location.back();
  }

  public executeIfNavigationSuccess(fn: () => void): void {
    this.navigationStopped$.pipe(take(1)).subscribe((success) => {
      if (success) fn();
    });
  }

  public executeIfNavigationFailure(fn: () => void): void {
    this.navigationStopped$.pipe(take(1)).subscribe((success) => {
      if (!success) fn();
    });
  }
}
