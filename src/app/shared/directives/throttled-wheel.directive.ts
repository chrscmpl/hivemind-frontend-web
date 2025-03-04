import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

@Directive({
  selector: '[appThrottledWheel]',
})
export class ThrottledWheelDirective implements OnInit, OnDestroy {
  private subscription?: Subscription;
  private timeout: number = 150;
  @Input() public set appThrottledWheel(value: number | '') {
    this.timeout = value === '' ? 150 : value;
  }
  @Output() public throttledWheel = new EventEmitter<WheelEvent>();

  constructor(
    private readonly zone: NgZone,
    private readonly element: ElementRef,
  ) {}

  public ngOnInit(): void {
    this.zone.runOutsideAngular(
      () =>
        (this.subscription = fromEvent<WheelEvent>(
          this.element.nativeElement,
          'wheel',
          { passive: true },
        )
          .pipe(throttleTime(this.timeout))
          .subscribe((event: WheelEvent) =>
            this.zone.run(() => this.throttledWheel.emit(event)),
          )),
    );
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
