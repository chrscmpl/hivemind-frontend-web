import { TuiButton, TuiRoot, TuiScrollbar } from '@taiga-ui/core';
import { Component, OnInit } from '@angular/core';
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
    TuiScrollbar,
    HeaderComponent,
    SidebarComponent,
    TuiButton,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public constructor(
    public readonly breakpoints: BreakpointService,
    public readonly themeService: ThemeService,
  ) {}

  public ngOnInit(): void {
    this.themeService.themeStatus$.subscribe(({ theme }) => {
      document.body.setAttribute('tuiTheme', theme);
    });
  }
}
