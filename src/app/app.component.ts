import { TuiRoot, TuiScrollbar } from '@taiga-ui/core';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './core/navigation/components/header/header.component';
import { SidebarComponent } from './core/navigation/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { BreakpointService } from './core/misc/services/breakpoint.service';
import { ThemeService } from './core/misc/services/theme.service';
import { CreateButtonComponent } from './core/navigation/components/create-button/create-button.component';
import { AppBarComponent } from './core/navigation/components/app-bar/app-bar.component';

@Component({
  selector: 'app-root',
  imports: [
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
    public readonly breakpoints: BreakpointService,
    public readonly themeService: ThemeService,
  ) {}

  public ngOnInit(): void {
    this.themeService.themeStatus$.subscribe(({ theme }) => {
      document.body.setAttribute('tuiTheme', theme);
    });
  }
}
