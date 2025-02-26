import { Component, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { TuiButton, TuiDataList } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';

interface item {
  title: string;
  icon: string;
  routerLink?: string;
  action?: () => unknown;
}

interface group {
  items: item[];
  display?: boolean;
}

@Component({
  selector: 'app-drawer',
  imports: [TuiNavigation, TuiDataList, TuiButton, RouterLink],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  public open = false;

  private _groups: group[] = [
    {
      items: [
        {
          title: 'Home',
          icon: '@tui.home',
          routerLink: '/home',
        },
        {
          title: 'Post Idea',
          icon: '@tui.plus',
          routerLink: '/idea/new',
        },
      ],
    },
    {
      items: [
        {
          title: 'Terms of Service',
          icon: '@tui.scroll-text',
          routerLink: '/tos',
        },
        {
          title: 'Privacy Policy',
          icon: '@tui.shield',
          routerLink: '/privacy-policy',
        },
        {
          title: 'Credits',
          icon: '@tui.signature',
          routerLink: '/credits',
        },
      ],
    },
    {
      display: false,
      items: [
        {
          title: 'Logout',
          icon: '@tui.door-open',
          action: () => this.auth.logout(),
        },
      ],
    },
  ];

  public constructor(private readonly auth: AuthService) {
    effect(() => {
      this._groups[2].display = this.auth.isAuthenticated();
    });
  }

  public get groups(): readonly group[] {
    return this._groups;
  }

  public onButtonClick(action?: () => unknown) {
    if (action) {
      action();
    }
    this.open = false;
  }
}
