import { Injectable, Type } from '@angular/core';
import { TuiDialogOptions, TuiDialogService } from '@taiga-ui/core';
import { DialogEnum } from './dialog.enum';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { from, Observable, OperatorFunction, switchMap } from 'rxjs';
import { SettingsDialogComponent } from '@app/features/settings/components/settings-dialog/settings-dialog.component';
import { BreakpointService } from '../misc/services/breakpoint.service';

type DialogDescriptor = {
  component: () => Promise<Type<unknown>>;
} & Partial<TuiDialogOptions<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  private dialogsMap: Record<DialogEnum, DialogDescriptor> = {
    [DialogEnum.LOGIN]: {
      component: () =>
        import(
          '@features/auth/components/login-form/login-form.component'
        ).then((m) => m.LoginFormComponent),
      label: 'Log In',
      size: 's',
    },
    [DialogEnum.SIGNUP]: {
      component: () =>
        import(
          '@features/auth/components/signup-form/signup-form.component'
        ).then((m) => m.SignupFormComponent),
      label: 'Sign Up',
      size: 's',
    },
    [DialogEnum.SETTINGS]: {
      component: async () => SettingsDialogComponent,
      label: 'Settings',
      size: 'm',
    },
    [DialogEnum.SETTINGS_THEME]: {
      component: async () => SettingsDialogComponent,
      label: 'Settings',
      size: 'm',
      data: { tab: 'theme' },
    },
  };

  constructor(
    private readonly dialogs: TuiDialogService,
    private readonly breakpoints: BreakpointService,
  ) {}

  public open(dialog: DialogEnum): Observable<boolean> {
    const { component, ...options } = this.dialogsMap[dialog];
    if (this.breakpoints.isMobile()) {
      options.size = 'fullscreen';
    }
    return from(component()).pipe(
      switchMap(
        (component) =>
          this.dialogs.open(
            new PolymorpheusComponent(component),
            options,
          ) as Observable<boolean>,
      ),
    );
  }
}
