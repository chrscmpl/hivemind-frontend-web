import { Component } from '@angular/core';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-back-button',
  imports: [TuiButton],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
})
export class BackButtonComponent {
  public constructor(public readonly navigationUtils: NavigationUtilsService) {}
}
