import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFocusOnEntry]',
})
export class FocusOnEntryDirective implements AfterViewInit {
  @Input() public appFocusOnEntry: string | null = null;
  @Input() public appFocusOnEntryDelay = 0;

  constructor(private readonly element: ElementRef) {}

  public ngAfterViewInit(): void {
    if (this.appFocusOnEntryDelay > 0) {
      setTimeout(() => {
        this.focusElement();
      }, this.appFocusOnEntryDelay);
    } else {
      this.focusElement();
    }
  }

  private focusElement() {
    const element = this.appFocusOnEntry
      ? this.element.nativeElement.querySelector(this.appFocusOnEntry)
      : this.element.nativeElement;

    if (element) {
      element.focus();
    }
  }
}
