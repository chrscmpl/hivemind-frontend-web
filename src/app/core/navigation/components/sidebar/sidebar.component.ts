import { Component } from '@angular/core';
import { TuiAsideItemDirective, TuiNavigation } from '@taiga-ui/layout';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { SidebarService } from '@app/core/navigation/services/sidebar.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';

@Component({
  selector: 'app-sidebar',
  imports: [TuiNavigation, TuiAsideItemDirective, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public readonly IdeaSortEnum = IdeaSortEnum;

  public constructor(
    public readonly breakpointsService: BreakpointService,
    public readonly sidebarService: SidebarService
  ) {}
}
