import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'app-sidebar',
  imports: [TuiNavigation],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  expanded = false;
}
