import { TuiRoot } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, TuiNavigation, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  expanded = false;
}
