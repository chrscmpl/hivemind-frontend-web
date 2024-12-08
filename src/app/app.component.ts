import { TuiRoot } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { HeaderComponent } from './navigation/components/header/header.component';
import { SidebarComponent } from './navigation/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, TuiNavigation, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
