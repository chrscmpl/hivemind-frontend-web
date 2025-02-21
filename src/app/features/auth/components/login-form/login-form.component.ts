import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { DialogEnum } from '@core/dialogs/dialog.enum';
import { DialogsService } from '@core/dialogs/dialogs.service';
import {
  TuiButton,
  TuiDialogContext,
  TuiError,
  TuiIcon,
  TuiLink,
  TuiTextfield,
} from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiForm } from '@taiga-ui/layout';
import { TuiFieldErrorPipe, TuiPassword } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';
import { customValidationErrors } from '@shared/helpers/custom-validation-errors.helper';
import { ReactiveFormsUtilsService } from '@shared/services/reactive-forms-utils.service';
import { AuthService } from '@core/auth/services/auth.service';
import { LoginCredentialsEntity } from '@core/auth/entities/login-credentials.entity';
import { ApiErrorsService } from '@shared/services/api-errors.service';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiLink,
    TuiForm,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
    TuiIcon,
    TuiPassword,
    AsyncPipe,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements AfterViewInit {
  public readonly form = new FormGroup<LoginForm>({
    email: new FormControl(null, {
      validators: [
        customValidationErrors(Validators.required, {
          required: 'Email is required',
        }),
        customValidationErrors(Validators.email, { email: 'Invalid email' }),
      ],
      updateOn: 'blur',
    }),
    password: new FormControl(null, {
      validators: [
        customValidationErrors(Validators.required, {
          required: 'Password is required',
        }),
      ],
      updateOn: 'blur',
    }),
  });

  private context = injectContext<TuiDialogContext<boolean>>();

  public constructor(
    private readonly dialogs: DialogsService,
    private readonly element: ElementRef,
    private readonly formUtils: ReactiveFormsUtilsService,
    private readonly auth: AuthService,
    private readonly apiErrorsService: ApiErrorsService,
  ) {}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.patchValueFromNativeElement('email', '#email');
      this.patchValueFromNativeElement('password', '#password');
    }, 500);
  }

  public submit() {
    if (this.form.invalid) {
      this.formUtils.markAllAsTouched(this.form);
      this.formUtils.forceValidation(this.form);
      return;
    }

    this.auth
      .login(
        new LoginCredentialsEntity(
          this.form.value.email as string,
          this.form.value.password as string,
        ),
      )
      .subscribe({
        next: () => this.close(true),
        error: (err) => this.apiErrorsService.displayErrors(err),
      });
  }

  public close(value = false) {
    this.context.completeWith(value);
  }

  public goToSignup() {
    this.close();
    this.dialogs.open(DialogEnum.SIGNUP).subscribe();
  }

  // makes browser autofill work
  private patchValueFromNativeElement(
    controlName: string,
    querySelector: string,
  ): void {
    const nativeInput = this.element.nativeElement.querySelector(
      querySelector,
    ) as HTMLInputElement | null;

    if (nativeInput?.value)
      this.form.get(controlName)?.patchValue(nativeInput.value);
  }
}
