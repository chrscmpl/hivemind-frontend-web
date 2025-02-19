import { Component } from '@angular/core';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-login-form',
  imports: [],
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
    this.dialogs.open(DialogEnum.SIGNUP);
  }
}
