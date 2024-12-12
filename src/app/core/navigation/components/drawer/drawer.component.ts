import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';

@Component({
  selector: 'app-drawer',
  imports: [TuiNavigation, TuiButton],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  public open = false;
}
