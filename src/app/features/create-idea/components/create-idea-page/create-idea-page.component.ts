import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { UpdateOnEnterDirective } from '@app/shared/directives/update-on-enter.directive';
import { customValidationErrors } from '@app/shared/helpers/custom-validation-errors.helper';
import { ReactiveFormsUtilsService } from '@app/shared/services/reactive-forms-utils.service';
import { EDITOR_TOOLS } from '@app/shared/tokens/editor-tools.token';
import { TuiButton, TuiError, TuiTextfield } from '@taiga-ui/core';
import { TuiEditor, TuiEditorToolType } from '@taiga-ui/editor';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';

interface IdeaForm {
  title: FormControl<string | null>;
  content: FormControl<string | null>;
}

@Component({
  selector: 'app-create-idea-page',
  imports: [
    ReactiveFormsModule,
    TuiEditor,
    NgClass,
    TuiTextfield,
    TuiFieldErrorPipe,
    TuiError,
    TuiButton,
    UpdateOnEnterDirective,
    AsyncPipe,
  ],
  templateUrl: './create-idea-page.component.html',
  styleUrl: './create-idea-page.component.scss',
})
export class CreateIdeaPageComponent implements OnInit {
  private _form!: FormGroup<IdeaForm>;

  public get form(): FormGroup<IdeaForm> {
    return this._form;
  }

  public constructor(
    @Inject(EDITOR_TOOLS) public readonly tools: TuiEditorToolType[],
    public readonly breakpoints: BreakpointService,
    private readonly formBuilder: FormBuilder,
    private readonly formUtils: ReactiveFormsUtilsService,
  ) {}

  public ngOnInit(): void {
    this._form = this.buildForm();
  }

  private buildForm(): FormGroup<IdeaForm> {
    return this.formBuilder.group<IdeaForm>({
      title: this.formBuilder.control<string | null>(null, {
        validators: [
          customValidationErrors(Validators.required, {
            required: 'A title is required',
          }),
        ],
        updateOn: 'blur',
      }),
      content: this.formBuilder.control<string | null>(null),
    });
  }

  public submit() {
    if (this.form.invalid) {
      this.formUtils.markAllAsTouched(this.form);
      this.formUtils.forceValidation(this.form);
      return;
    }
  }
}
