import { Component } from '@angular/core';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import {
  TuiButton,
  TuiDialogContext,
  TuiLink,
  TuiTextfield,
} from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiForm } from '@taiga-ui/layout';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, TuiTextfield, TuiLink, TuiForm, TuiButton],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private context = injectContext<TuiDialogContext<boolean>>();

  public constructor(private readonly dialogs: DialogsService) {}

  public close() {
    this.context.completeWith(false);
  }

  public goToSignup() {
    this.close();
    this.dialogs.open(DialogEnum.SIGNUP).subscribe();
  }
}
