import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { DrawerComponent } from '../drawer/drawer.component';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { LogoComponent } from '../logo/logo.component';
import { TuiAvatar } from '@taiga-ui/kit';
import { AuthService } from '@app/core/auth/services/auth.service';
import { TuiButton } from '@taiga-ui/core';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';

@Component({
  selector: 'app-header',
  imports: [
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
  public readonly DialogEnum = DialogEnum;

  public constructor(
    public readonly breakpoints: BreakpointService,
    public readonly auth: AuthService,
    public readonly dialogs: DialogsService,
  ) {}
}
