import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogEnum } from '@core/dialogs/dialog.enum';
import { DialogsService } from '@core/dialogs/dialogs.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent {
  private context = injectContext<TuiDialogContext<boolean>>();

  public constructor(private readonly dialogs: DialogsService) {}

  public close() {
    this.context.completeWith(false);
  }

  public goToLogin() {
    this.close();
    this.dialogs.open(DialogEnum.LOGIN).subscribe();
  }
}
