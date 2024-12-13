import { TuiRoot, TuiScrollbar } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { HeaderComponent } from './core/navigation/components/header/header.component';
import { SidebarComponent } from './core/navigation/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { BreakpointService } from './core/misc/services/breakpoint.service';
import { ThemeService } from './core/misc/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
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
