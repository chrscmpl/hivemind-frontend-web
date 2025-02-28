import { Component, ElementRef, OnInit } from '@angular/core';
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
  FormBuilder,
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
import { UpdateOnEnterDirective } from '@app/shared/directives/update-on-enter.directive';

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
    UpdateOnEnterDirective,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent implements OnInit {
  private _form!: FormGroup<LoginForm>;

  public get form(): FormGroup<LoginForm> {
    return this._form;
  }

  private context = injectContext<TuiDialogContext<boolean>>();

  public constructor(
    private readonly dialogs: DialogsService,
    private readonly element: ElementRef,
    private readonly formUtils: ReactiveFormsUtilsService,
    private readonly auth: AuthService,
    private readonly apiErrorsService: ApiErrorsService,
    private readonly formBuilder: FormBuilder,
  ) {}

  public ngOnInit() {
    this._form = this.buildForm();
  }

  public buildForm() {
    return this.formBuilder.group<LoginForm>({
      email: this.formBuilder.control(null, {
        validators: [
          customValidationErrors(Validators.required, {
            required: 'Email is required',
          }),
          customValidationErrors(Validators.email, { email: 'Invalid email' }),
        ],
        updateOn: 'blur',
      }),
      password: this.formBuilder.control(null, {
        validators: [
          customValidationErrors(Validators.required, {
            required: 'Password is required',
          }),
        ],
        updateOn: 'blur',
      }),
    });
  }

  public submit() {
    if (this.form.invalid) {
      // makes browser autofill work
      this.patchValueFromNativeElement(
        this.form.controls.email,
        '#login-email',
      );
      this.patchValueFromNativeElement(
        this.form.controls.password,
        '#login-password',
      );
    }

    if (this.form.invalid) {
      this.formUtils.markAllAsTouched(this.form);
      this.formUtils.forceValidation(this.form);
      return;
    }

    this.auth
      .login(
        new LoginCredentialsEntity({
          email: this.form.value.email as string,
          password: this.form.value.password as string,
        }),
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
    control: FormControl<string | null>,
    querySelector: string,
  ): void {
    const nativeInput = this.element.nativeElement.querySelector(
      querySelector,
    ) as HTMLInputElement | null;

    if (nativeInput?.value) control.patchValue(nativeInput.value);
  }
}
