import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-back-button',
  imports: [TuiButton, NgClass],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
})
export class BackButtonComponent {
  public constructor(
    public readonly navigationUtils: NavigationUtilsService,
    public readonly breakpoints: BreakpointService,
  ) {}
}
