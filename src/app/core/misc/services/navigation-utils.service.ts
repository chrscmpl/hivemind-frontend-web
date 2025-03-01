import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { filter, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationUtilsService {
  private _backAction: ((defaultFn: () => void) => void) | null = null;

  constructor(
    private readonly router: Router,
    private readonly location: Location,
  ) {}

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
    this.isCurrentNavigationSuccessful$().subscribe((success) => {
      if (success) fn();
    });
  }

  public executeIfNavigationFailure(fn: () => void): void {
    this.isCurrentNavigationSuccessful$().subscribe((success) => {
      if (!success) fn();
    });
  }

  private isCurrentNavigationSuccessful$() {
    return this.router.events.pipe(
      filter(
        (e) =>
          e instanceof NavigationCancel ||
          e instanceof NavigationError ||
          e instanceof NavigationEnd,
      ),
      take(1),
      map((e) => e instanceof NavigationEnd),
    );
  }
}
