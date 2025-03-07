import { Component } from '@angular/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { DrawerComponent } from '../drawer/drawer.component';
import { BreakpointService } from '@core/misc/services/breakpoint.service';
import { LogoComponent } from '../logo/logo.component';
import { TuiAvatar } from '@taiga-ui/kit';
import { AuthService } from '@core/auth/services/auth.service';
import {
  TuiButton,
  TuiDataList,
  TuiDialogService,
  TuiDropdown,
} from '@taiga-ui/core';
import { DialogsService } from '@core/dialogs/dialogs.service';
import { DialogEnum } from '@core/dialogs/dialog.enum';
import { UIService } from '../../services/ui.service';
import { UIStylesEnum } from '../../enums/ui-styles.enum';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';

@Component({
  selector: 'app-header',
  imports: [
    TuiNavigation,
    TuiAvatar,
    TuiButton,
    DrawerComponent,
    LogoComponent,
    TuiDataList,
    TuiDropdown,
    TuiButton,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public readonly DialogEnum = DialogEnum;
  public readonly UIStyleEnum = UIStylesEnum;

  public constructor(
    public readonly breakpoints: BreakpointService,
    public readonly auth: AuthService,
    public readonly dialogs: DialogsService,
    public readonly ui: UIService,
    public readonly navigationUtils: NavigationUtilsService,
    public readonly tuiDialogs: TuiDialogService,
  ) {}
}
