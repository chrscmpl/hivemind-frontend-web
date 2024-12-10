import { TuiRoot, TuiScrollbar } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { HeaderComponent } from './navigation/components/header/header.component';
import { SidebarComponent } from './navigation/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { BreakpointService } from './common/services/breakpoint.service';
import { ThemeService } from './common/services/theme.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    RouterOutlet,
    TuiRoot,
    TuiNavigation,
    TuiScrollbar,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public constructor(
    public readonly breakpoints: BreakpointService,
    public readonly themeService: ThemeService
  ) {}
}
