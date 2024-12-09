import { Component } from '@angular/core';
import { TuiAsideItemDirective, TuiNavigation } from '@taiga-ui/layout';
import { BreakpointService } from '@app/common/services/breakpoint.service';
import { SidebarService } from '@app/navigation/services/sidebar.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [TuiNavigation, TuiAsideItemDirective, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public constructor(
    public readonly breakpointsService: BreakpointService,
    public readonly sidebarService: SidebarService
  ) {}
}
