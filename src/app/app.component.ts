import { TuiAlertService, TuiRoot, TuiScrollbar } from '@taiga-ui/core';
import { Component, Inject, OnInit } from '@angular/core';
import { HeaderComponent } from './core/navigation/components/header/header.component';
import { SidebarComponent } from './core/navigation/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { BreakpointService } from './core/misc/services/breakpoint.service';
import { ThemeService } from './core/misc/services/theme.service';
import { CreateButtonComponent } from './core/navigation/components/create-button/create-button.component';
import { AppBarComponent } from './core/navigation/components/app-bar/app-bar.component';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { NavigationUtilsService } from './core/misc/services/navigation-utils.service';
import { take } from 'rxjs';
import { VirtualKeyboardService } from './core/misc/services/virtual-keyboard.service';
@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    RouterOutlet,
    TuiRoot,
    TuiScrollbar,
    HeaderComponent,
    SidebarComponent,
    CreateButtonComponent,
    AppBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public constructor(
    @Inject(DOCUMENT) public readonly document: Document,
    public readonly breakpoints: BreakpointService,
    public readonly themeService: ThemeService,
    private readonly navigationUtils: NavigationUtilsService,
    private readonly alerts: TuiAlertService,
    public readonly virtualKeyboard: VirtualKeyboardService,
  ) {}

  public ngOnInit(): void {
    this.navigationUtils.navigationError$.subscribe((error) => {
      if (error.error.message) {
        this.displayError(error.error.message);
      }
    });
  }

  private displayError(message: string): void {
    this.alerts
      .open(message, {
        appearance: 'negative',
        label: 'Error',
      })
      .pipe(take(1))
      .subscribe();
  }
}
