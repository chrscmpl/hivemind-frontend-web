import { Inject, Injectable } from '@angular/core';
import {
  delay,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { BreakpointService } from './breakpoint.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class VirtualKeyboardService {
  public isPotentiallyOpen$: Observable<boolean>;

  public constructor(
    @Inject(DOCUMENT) document: Document,
    breakpoints: BreakpointService,
  ) {
    this.isPotentiallyOpen$ = merge(
      fromEvent(document.body, 'focus', {
        capture: true,
        passive: true,
      }),
      fromEvent(document.body, 'blur', {
        capture: true,
        passive: true,
      }),
    ).pipe(
      filter(() => breakpoints.isMobile()),
      map<Event, boolean>(
        (e) =>
          e.type === 'focus' &&
          (e?.target as Element)?.matches?.(
            'input, textarea, select, .ProseMirror',
          ) &&
          !['checkbox', 'radio'].includes(
            (e?.target as Element)?.getAttribute('type') ?? '',
          ),
      ),

      startWith(false),
      distinctUntilChanged(),
      switchMap((isOpen) => of(isOpen).pipe(delay(isOpen ? 0 : 50))),
      shareReplay(1),
    );
  }
}
