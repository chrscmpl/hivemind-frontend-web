import { Injectable, Type } from '@angular/core';
import { TuiDialogOptions, TuiDialogService } from '@taiga-ui/core';
import { DialogEnum } from './dialog.enum';
import { LoginFormComponent } from '@features/auth/components/login-form/login-form.component';
import { SignupFormComponent } from '@features/auth/components/signup-form/signup-form.component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';
import { SettingsDialogComponent } from '@app/features/settings/components/settings-dialog/settings-dialog.component';

type DialogDescriptor = {
  component: Type<unknown>;
} & Partial<TuiDialogOptions<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  private dialogsMap: Record<DialogEnum, DialogDescriptor> = {
    [DialogEnum.LOGIN]: {
      component: LoginFormComponent,
      label: 'Log In',
      size: 's',
    },
    [DialogEnum.SIGNUP]: {
      component: SignupFormComponent,
      label: 'Sign Up',
      size: 's',
    },
    [DialogEnum.SETTINGS]: {
      component: SettingsDialogComponent,
      label: 'Settings',
      size: 'm',
    },
    [DialogEnum.SETTINGS_THEME]: {
      component: SettingsDialogComponent,
      label: 'Settings',
      size: 'm',
      data: { tab: 'theme' },
    },
  };

  constructor(private readonly dialogs: TuiDialogService) {}

  public open(dialog: DialogEnum): Observable<boolean> {
    const { component, ...options } = this.dialogsMap[dialog];
    return this.dialogs.open(new PolymorpheusComponent(component), options);
  }
}
