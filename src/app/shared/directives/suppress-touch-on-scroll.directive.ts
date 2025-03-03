import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

@Directive({
  selector: '[appSuppressTouchOnScroll]',
})
export class SuppressTouchOnScrollDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private isHorizontalLocked = false;

  public constructor(
    private readonly zone: NgZone,
    private readonly element: ElementRef,
  ) {}

  public ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        fromEvent(this.element.nativeElement, 'scroll', {
          passive: true,
        })
          .pipe(throttleTime(400))
          .subscribe(() => {
            this.isHorizontalLocked = true;
          }),

        fromEvent<Event>(this.element.nativeElement, 'touchmove', {
          passive: false,
        }).subscribe((event: Event) => {
          if (this.isHorizontalLocked) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        }),

        fromEvent(this.element.nativeElement, 'touchend', {
          passive: true,
        }).subscribe(() => {
          this.isHorizontalLocked = false;
        }),
      );
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
