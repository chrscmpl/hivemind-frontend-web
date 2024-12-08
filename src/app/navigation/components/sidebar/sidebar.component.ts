import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { AsyncPipe } from '@angular/common';
import { BreakpointService } from '@app/common/services/breakpoint.service';
import { SidebarService } from '@app/navigation/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [TuiNavigation, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public constructor(
    public readonly breakpointsService: BreakpointService,
    public readonly sidebarService: SidebarService
  ) {}
}
