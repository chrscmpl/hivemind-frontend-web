import { Component } from '@angular/core';
import { TuiAsideItemDirective, TuiNavigation } from '@taiga-ui/layout';
import { BreakpointService } from '@app/common/services/breakpoint.service';
import { SidebarService } from '@app/navigation/services/sidebar.service';

interface sidebarItem {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [TuiNavigation, TuiAsideItemDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public readonly headerItems: readonly sidebarItem[] = [
    {
      label: 'Home',
      icon: '@tui.home',
    },
    {
      label: 'Explore controversial',
      icon: '@tui.flame',
    },
    {
      label: 'Explore popular',
      icon: '@tui.trophy',
    },
    {
      label: 'Explore unpopular',
      icon: '@tui.frown',
    },
  ];

  public readonly middleItems: readonly sidebarItem[] = [
    {
      label: 'Post an idea',
      icon: '@tui.plus',
    },
    {
      label: 'Settings',
      icon: '@tui.settings',
    },
    {
      label: 'More',
      icon: '@tui.ellipsis',
    },
  ];

  public constructor(
    public readonly breakpointsService: BreakpointService,
    public readonly sidebarService: SidebarService
  ) {}
}
