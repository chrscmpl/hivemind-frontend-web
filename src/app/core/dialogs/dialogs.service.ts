import { Injectable, Type } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { DialogEnum } from './dialog.enum';
import { LoginFormComponent } from '@app/features/auth/forms/login-form/login-form.component';
import { SignupFormComponent } from '@app/features/auth/forms/signup-form/signup-form.component';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';

interface DialogDescriptor {
  component: Type<unknown>;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  private dialogsMap: Record<DialogEnum, DialogDescriptor> = {
    [DialogEnum.LOGIN]: {
      component: LoginFormComponent,
      label: 'Login',
    },
    [DialogEnum.SIGNUP]: {
      component: SignupFormComponent,
      label: 'Signup',
    },
  };

  constructor(private readonly dialogs: TuiDialogService) {}

  public open(dialog: DialogEnum): void {
    const { component, label } = this.dialogsMap[dialog];
    this.dialogs
      .open(new PolymorpheusComponent(component), { label })
      .subscribe();
  }
}
