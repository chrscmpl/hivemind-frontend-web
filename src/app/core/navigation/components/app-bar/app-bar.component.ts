import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { TuiTabBar } from '@taiga-ui/addon-mobile';

@Component({
  selector: 'app-app-bar',
  imports: [TuiTabBar, RouterLink],
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss',
})
export class AppBarComponent {
  public activeItemIndex = 0;

  public constructor(private readonly dialogs: DialogsService) {}

  public readonly tabs = [
    {
      label: 'Home',
      routerLink: '/home',
      icon: '@tui.home',
    },
    {
      label: 'Create',
      routerLink: '/ideas/new',
      icon: '@tui.circle-plus',
    },
    {
      label: 'Settings',
      icon: '@tui.settings',
      action: () => this.dialogs.open(DialogEnum.SETTINGS).subscribe(),
    },
  ];
}
