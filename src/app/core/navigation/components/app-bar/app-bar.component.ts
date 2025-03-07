import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-bar',
  imports: [TuiTabBar, RouterLink],
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.scss',
})
export class AppBarComponent implements OnInit, OnDestroy {
  public activeItemIndex = -1;
  private readonly subscriptions: Subscription[] = [];

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
      action: () => {
        const index = this.activeItemIndex;
        this.dialogs.open(DialogEnum.SETTINGS).subscribe({
          complete: () => (this.activeItemIndex = index),
        });
      },
    },
  ];

  public constructor(
    private readonly dialogs: DialogsService,
    private readonly navigationUtils: NavigationUtilsService,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.navigationUtils.navigationStopped$.subscribe(() => {
        const path = this.router.url.split('?')[0];
        this.activeItemIndex = this.tabs.findIndex(
          (tab) => tab.routerLink === path,
        );
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
