import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUpdateOnEnter]',
})
export class UpdateOnEnterDirective {
  constructor(
    private element: ElementRef<HTMLInputElement>,
    private control: NgControl,
  ) {}

  @HostListener('keydown.enter')
  onEnter() {
    this.control.control?.setValue(this.element.nativeElement.value);
  }
}
