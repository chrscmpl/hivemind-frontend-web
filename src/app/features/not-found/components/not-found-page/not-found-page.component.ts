import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { LogoComponent } from '@app/core/navigation/components/logo/logo.component';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-not-found-page',
  imports: [LogoComponent, TuiButton, RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {
  public constructor(public readonly breakpoints: BreakpointService) {}
}
