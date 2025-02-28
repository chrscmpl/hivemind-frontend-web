import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SignupDataEntity } from '@app/core/auth/entities/signup-data.entity';
import { AuthService } from '@app/core/auth/services/auth.service';
import { PasswordPatternsEntity } from '@app/shared/entities/password-patterns.entity';
import { PASSWORD_PATTERNS } from '@app/shared/tokens/password-patterns.token';
import { UpdateOnEnterDirective } from '@app/shared/directives/update-on-enter.directive';
import { passwordStrengthEnum } from '@app/shared/enums/password-strength.enum';
import { customValidationErrors } from '@app/shared/helpers/custom-validation-errors.helper';
import { ApiErrorsService } from '@app/shared/services/api-errors.service';
import { PasswordStrengthMeasurerService } from '@app/shared/services/password-strength-measurer.service';
import { ReactiveFormsUtilsService } from '@app/shared/services/reactive-forms-utils.service';
import { confirmPasswordValidator } from '@app/shared/validators/confirm-password.validator';
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
import {
  TuiCheckbox,
  TuiFieldErrorPipe,
  TuiPassword,
  TuiProgress,
} from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { injectContext } from '@taiga-ui/polymorpheus';
import { interval, take } from 'rxjs';

interface SignupForm {
  displayName: FormControl<string | null>;
  handle: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  acceptTos: FormControl<boolean>;
}

@Component({
  selector: 'app-signup-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TuiTextfield,
    TuiLink,
    TuiForm,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
    TuiIcon,
    TuiPassword,
    TuiProgress,
    TuiCheckbox,
    AsyncPipe,
    UpdateOnEnterDirective,
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent implements OnInit {
  public _form!: FormGroup<SignupForm>;

  public get form(): FormGroup<SignupForm> {
    return this._form;
  }

  public readonly passwordStrengthEnum = passwordStrengthEnum;
  public passwordStrength: passwordStrengthEnum | null = null;

  private readonly context = injectContext<TuiDialogContext<boolean>>();

  public readonly passwordStrengthMeter: WritableSignal<number> = signal(0);

  private readonly strengthMeterValues = {
    null: 0,
    [passwordStrengthEnum.WEAK]: 20,
    [passwordStrengthEnum.MEDIUM]: 50,
    [passwordStrengthEnum.STRONG]: 90,
  };

  public constructor(
    private readonly dialogs: DialogsService,
    private readonly formUtils: ReactiveFormsUtilsService,
    private readonly passwordStrengthMeasurer: PasswordStrengthMeasurerService,
    private readonly auth: AuthService,
    private readonly apiErrorsService: ApiErrorsService,
    private readonly formBuilder: FormBuilder,
    @Inject(PASSWORD_PATTERNS)
    private readonly passwordPatterns: PasswordPatternsEntity,
  ) {}

  public ngOnInit() {
    this._form = this.buildForm();
    this.form.controls.password.valueChanges.subscribe((value) => {
      this.form.controls.confirmPassword.updateValueAndValidity();
      this.updatePasswordStrength(value);
    });
  }

  public buildForm(): FormGroup<SignupForm> {
    return this.formBuilder.group<SignupForm>({
      displayName: this.formBuilder.control(null, {
        validators: [
          customValidationErrors(Validators.required, {
            required: 'Name is required',
          }),
        ],
        updateOn: 'blur',
      }),
      handle: this.formBuilder.control(null, {
        validators: [
          customValidationErrors(Validators.required, {
            required: 'Handle is required',
          }),
        ],
        updateOn: 'blur',
      }),
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
          customValidationErrors(
            Validators.pattern(this.passwordPatterns.valid),
            {
              pattern:
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
          ),
        ],
        updateOn: 'change',
      }),
      confirmPassword: this.formBuilder.control(null, {
        validators: [
          customValidationErrors(Validators.required, {
            required: 'Password confirmation is required',
          }),
          confirmPasswordValidator(
            (): FormControl<string | null> | undefined =>
              this.form?.controls?.password,
          ),
        ],
        updateOn: 'blur',
      }),

      acceptTos: this.formBuilder.control(false, {
        nonNullable: true,
        validators: [
          customValidationErrors(Validators.requiredTrue, {
            required: 'You must accept the terms of service to sign up',
          }),
        ],
        updateOn: 'change',
      }),
    });
  }

  public submit() {
    if (this.form.invalid) {
      this.formUtils.markAllAsTouched(this.form);
      this.formUtils.forceValidation(this.form);
      return;
    }

    this.auth
      .signup(
        new SignupDataEntity({
          displayName: this.form.value.displayName as string,
          handle: this.form.value.handle as string,
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

  public goToLogin() {
    this.close();
    this.dialogs.open(DialogEnum.LOGIN).subscribe();
  }

  private updatePasswordStrength(value: string | null) {
    const oldMeterValue =
      this.strengthMeterValues[this.passwordStrength ?? 'null'];
    this.passwordStrength = value
      ? this.passwordStrengthMeasurer.measure(value)
      : null;
    const newMeterValue =
      this.strengthMeterValues[this.passwordStrength ?? 'null'];

    const valueDifference = newMeterValue - oldMeterValue;

    interval(10)
      .pipe(take(16))
      .subscribe(() =>
        this.passwordStrengthMeter.update(
          (value) => value + valueDifference / 16,
        ),
      );
  }
}
