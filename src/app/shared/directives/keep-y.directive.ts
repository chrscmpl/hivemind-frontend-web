import {
  AfterViewInit,
  OnDestroy,
  Directive,
  ElementRef,
  NgZone,
  Input,
} from '@angular/core';
import { KeepYService } from '../services/keep-y.service';

@Directive({
  selector: '[appKeepY]',
})
export class KeepYDirective implements AfterViewInit, OnDestroy {
  private _restoreY = true;
  private _afterViewInit = false;
  private yPosition?: number;

  @Input() set restoreY(value: boolean) {
    this._restoreY = value;
    if (this._afterViewInit && this._restoreY) {
      this.restoreYPosition();
    }
  }

  constructor(
    private readonly syncYService: KeepYService,
    private readonly element: ElementRef,
    private readonly zone: NgZone,
  ) {}

  public ngAfterViewInit(): void {
    if (!this.element.nativeElement.id) {
      throw new Error('Element must have an id attribute');
    }
    this.yPosition = this.syncYService.get(this.element.nativeElement.id);
    if (this._restoreY) {
      this.restoreYPosition();
    }
    this._afterViewInit = true;
  }

  public ngOnDestroy(): void {
    this.saveYPosition();
  }

  private restoreYPosition(): void {
    if (this.yPosition) {
      this.zone.runOutsideAngular(() =>
        setTimeout(() => {
          this.element.nativeElement.scrollTop = this.yPosition;
        }, 0),
      );
    }
  }

  private saveYPosition(): void {
    this.syncYService.set(
      this.element.nativeElement.id,
      this.element.nativeElement.scrollTop,
    );
  }
}
