import { AfterViewInit, OnDestroy, Directive, ElementRef } from '@angular/core';
import { SyncYService } from '../services/sync-y.service';

@Directive({
  selector: '[appSyncY]',
})
export class SyncYDirective implements AfterViewInit, OnDestroy {
  constructor(
    private readonly syncYService: SyncYService,
    private readonly element: ElementRef,
  ) {}

  public ngAfterViewInit(): void {
    if (!this.element.nativeElement.id) {
      throw new Error('SyncY: Element must have an id attribute');
    }
    const yPosition = this.syncYService.get(this.element.nativeElement.id);
    if (yPosition) {
      this.element.nativeElement.scrollTop = yPosition;
    }
  }

  public ngOnDestroy(): void {
    this.syncYService.set(
      this.element.nativeElement.id,
      this.element.nativeElement.scrollTop,
    );
  }
}
