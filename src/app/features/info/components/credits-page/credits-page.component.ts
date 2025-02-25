import { Component } from '@angular/core';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { TuiLink } from '@taiga-ui/core';

@Component({
  selector: 'app-credits-page',
  imports: [TuiLink],
  templateUrl: './credits-page.component.html',
  styleUrl: './credits-page.component.scss',
})
export class CreditsPageComponent {
  public constructor(public readonly breakpoints: BreakpointService) {}
}
