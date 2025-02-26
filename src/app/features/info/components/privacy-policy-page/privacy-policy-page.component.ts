import { Component } from '@angular/core';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';

@Component({
  selector: 'app-privacy-policy-page',
  imports: [],
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.scss',
})
export class PrivacyPolicyPageComponent {
  public constructor(public readonly breakpoints: BreakpointService) {}
}
