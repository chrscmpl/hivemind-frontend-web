import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordStrengthEnum } from '@app/shared/enums/password-strength.enum';
import { customValidationErrors } from '@app/shared/helpers/custom-validation-errors.helper';
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
import { TuiFieldErrorPipe, TuiPassword, TuiProgress } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { injectContext } from '@taiga-ui/polymorpheus';
import { environment } from 'src/environments/environment';

interface SignupForm {
  displayName: FormControl<string | null>;
  handle: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-signup-form',
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
    TuiProgress,
    AsyncPipe,
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent implements OnInit {
  public readonly form = new FormGroup<SignupForm>({
    displayName: new FormControl(null, {
      validators: [
        customValidationErrors(Validators.required, {
          required: 'Name is required',
        }),
      ],
      updateOn: 'blur',
    }),
    handle: new FormControl(null, {
      validators: [
        customValidationErrors(Validators.required, {
          required: 'Handle is required',
        }),
      ],
      updateOn: 'blur',
    }),
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
        customValidationErrors(
          Validators.pattern(environment.passwordStrengthPatterns.medium),
          {
            pattern:
              'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          },
        ),
      ],
      updateOn: 'change',
    }),
    confirmPassword: new FormControl(null, {
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
  });

  public readonly passwordStrengthEnum = passwordStrengthEnum;
  public passwordStrength: passwordStrengthEnum | null = null;

  private context = injectContext<TuiDialogContext<boolean>>();

  public constructor(
    private readonly dialogs: DialogsService,
    private readonly formUtils: ReactiveFormsUtilsService,
    private readonly passwordStrengthMeasurer: PasswordStrengthMeasurerService,
  ) {}

  public ngOnInit() {
    this.form.controls.password.valueChanges.subscribe((value) => {
      this.form.controls.confirmPassword.updateValueAndValidity();
      if (!value) {
        this.passwordStrength = null;
        return;
      }
      this.passwordStrength = this.passwordStrengthMeasurer.measure(value);
    });
  }

  public submit() {
    if (this.form.invalid) {
      this.formUtils.markAllAsTouched(this.form);
      this.formUtils.forceValidation(this.form);
      return;
    }
  }

  public close() {
    this.context.completeWith(false);
  }

  public goToLogin() {
    this.close();
    this.dialogs.open(DialogEnum.LOGIN).subscribe();
  }
}
