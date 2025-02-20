import { Injectable, Type } from '@angular/core';
import { TuiDialogOptions, TuiDialogService } from '@taiga-ui/core';
import { DialogEnum } from './dialog.enum';
import { LoginFormComponent } from '@app/features/auth/forms/login-form/login-form.component';
import { SignupFormComponent } from '@app/features/auth/forms/signup-form/signup-form.component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';

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
      dismissible: false,
    },
    [DialogEnum.SIGNUP]: {
      component: SignupFormComponent,
      label: 'Sign Up',
      dismissible: false,
    },
  };

  constructor(private readonly dialogs: TuiDialogService) {}

  public open(dialog: DialogEnum): Observable<boolean> {
    const { component, ...options } = this.dialogsMap[dialog];
    return this.dialogs.open(new PolymorpheusComponent(component), options);
  }
}
