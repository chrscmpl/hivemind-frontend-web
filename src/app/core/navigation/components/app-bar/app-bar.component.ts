import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiTabBar } from '@taiga-ui/addon-mobile';

@Component({
  selector: 'app-app-bar',
  imports: [TuiTabBar, RouterLink],
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss',
})
export class AppBarComponent {
  public activeItemIndex = 0;

  public readonly tabs = [
    {
      label: 'Home',
      routerLink: '/home',
      icon: '@tui.home',
    },
    {
      label: 'Create',
      routerLink: '/create',
      icon: '@tui.circle-plus',
    },
    {
      label: 'Settings',
      routerLink: '/settings',
      icon: '@tui.settings',
    },
  ];
}
