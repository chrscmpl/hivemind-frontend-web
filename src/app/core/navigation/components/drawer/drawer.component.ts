import { Component, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { TuiButton, TuiDataList } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';

interface item {
  id: string;
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
          id: 'home',
          title: 'Home',
          icon: '@tui.home',
          routerLink: '/ideas',
        },
        {
          id: 'submit',
          title: 'Post Idea',
          icon: '@tui.plus',
          routerLink: '/ideas/submit',
        },
      ],
    },
    {
      items: [
        {
          id: 'settings',
          title: 'Settings',
          icon: '@tui.settings',
          action: () => this.dialogs.open(DialogEnum.SETTINGS).subscribe(),
        },
      ],
    },
    {
      items: [
        {
          id: 'tos',
          title: 'Terms of Service',
          icon: '@tui.scroll-text',
          routerLink: '/tos',
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: '@tui.shield',
          routerLink: '/privacy-policy',
        },
        {
          id: 'credits',
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
          id: 'logout',
          title: 'Logout',
          icon: '@tui.door-open',
          action: () => this.auth.logout(),
        },
      ],
    },
  ];

  public constructor(
    private readonly auth: AuthService,
    private readonly dialogs: DialogsService,
  ) {
    effect(() => {
      this._groups[3].display = this.auth.isAuthenticated();
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
