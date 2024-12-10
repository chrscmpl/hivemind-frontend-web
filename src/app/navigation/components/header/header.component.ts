import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { DrawerComponent } from '../drawer/drawer.component';
import { BreakpointService } from '@app/common/services/breakpoint.service';
import { LogoComponent } from '../logo/logo.component';
import { TuiAvatar } from '@taiga-ui/kit';
import { AuthService } from '@app/common/services/auth.service';
import { TuiButton } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    TuiNavigation,
    TuiAvatar,
    TuiButton,
    DrawerComponent,
    LogoComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public constructor(
    public readonly breakpoints: BreakpointService,
    public readonly auth: AuthService
  ) {}
}
