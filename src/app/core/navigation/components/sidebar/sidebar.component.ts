import { Component } from '@angular/core';
import { TuiAsideItemDirective, TuiNavigation } from '@taiga-ui/layout';
import { BreakpointService } from '@core/misc/services/breakpoint.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IdeaSortEnum } from '@shared/enums/idea-sort.enum';
import { TuiChevron } from '@taiga-ui/kit';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    TuiNavigation,
    TuiAsideItemDirective,
    TuiChevron,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public readonly IdeaSortEnum = IdeaSortEnum;
  public readonly DialogEnum = DialogEnum;

  public constructor(
    public readonly breakpointsService: BreakpointService,
    public readonly sidebarService: SidebarService,
    public readonly dialogs: DialogsService,
  ) {}
}
