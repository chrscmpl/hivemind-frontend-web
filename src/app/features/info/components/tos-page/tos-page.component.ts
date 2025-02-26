import { Component } from '@angular/core';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';

@Component({
  selector: 'app-tos-page',
  imports: [],
  templateUrl: './tos-page.component.html',
  styleUrl: './tos-page.component.scss',
})
export class TosPageComponent {
  public constructor(public readonly breakpoints: BreakpointService) {}
}
