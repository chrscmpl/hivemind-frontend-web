import { TuiRoot, TuiScrollbar } from '@taiga-ui/core';
import { Component, Inject } from '@angular/core';
import { HeaderComponent } from './core/navigation/components/header/header.component';
import { SidebarComponent } from './core/navigation/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { BreakpointService } from './core/misc/services/breakpoint.service';
import { ThemeService } from './core/misc/services/theme.service';
import { CreateButtonComponent } from './core/navigation/components/create-button/create-button.component';
import { AppBarComponent } from './core/navigation/components/app-bar/app-bar.component';
import { AsyncPipe, DOCUMENT } from '@angular/common';
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
export class AppComponent {
  public constructor(
    @Inject(DOCUMENT) public readonly document: Document,
    public readonly breakpoints: BreakpointService,
    public readonly themeService: ThemeService,
  ) {}
}
