import {
  AfterViewInit,
  OnDestroy,
  Directive,
  ElementRef,
  Input,
} from '@angular/core';
import { SyncYService } from '../services/sync-y.service';

@Directive({
  selector: '[appSyncY]',
})
export class SyncYDirective implements AfterViewInit, OnDestroy {
  @Input({ required: true }) public appSyncY!: string;

  constructor(
    private readonly syncYService: SyncYService,
    private readonly element: ElementRef,
  ) {}

  public ngAfterViewInit(): void {
    const yPosition = this.syncYService.get(this.appSyncY);
    if (yPosition) {
      this.element.nativeElement.scrollTop = yPosition;
    }
  }

  public ngOnDestroy(): void {
    this.syncYService.set(this.appSyncY, this.element.nativeElement.scrollTop);
  }
}
