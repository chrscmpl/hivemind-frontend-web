import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { UpdateOnEnterDirective } from '@app/shared/directives/update-on-enter.directive';
import { IdeaCreationConstraintsEntity } from '@app/shared/entities/idea-creation-contraints.entity';
import { IdeaCreationData } from '@app/shared/entities/idea-creation-data.entity';
import { IdeaUpdateData } from '@app/shared/entities/idea-update-data.entity';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { customValidationErrors } from '@app/shared/helpers/custom-validation-errors.helper';
import { ApiErrorsService } from '@app/shared/services/api-errors.service';
import { IdeaMutationService } from '@app/shared/services/idea-mutation.service';
import { ReactiveFormsUtilsService } from '@app/shared/services/reactive-forms-utils.service';
import { EDITOR_TOOLS } from '@app/shared/tokens/editor-tools.token';
import { IDEA_CREATION_CONSTRAINTS } from '@app/shared/tokens/idea-creation-constraints.token';
import {
  TuiAlertService,
  TuiButton,
  TuiError,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiEditor, TuiEditorToolType } from '@taiga-ui/editor';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { take } from 'rxjs';

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

  public ideaToUpdate: IdeaEntity | null = null;

  public constructor(
    @Inject(EDITOR_TOOLS) public readonly tools: TuiEditorToolType[],
    @Inject(IDEA_CREATION_CONSTRAINTS)
    public readonly constraints: IdeaCreationConstraintsEntity,
    private readonly route: ActivatedRoute,
    public readonly breakpoints: BreakpointService,
    private readonly formBuilder: FormBuilder,
    private readonly formUtils: ReactiveFormsUtilsService,
    public readonly navigationUtils: NavigationUtilsService,
    private readonly ideaMutationService: IdeaMutationService,
    private readonly apiErrorsService: ApiErrorsService,
    private readonly alerts: TuiAlertService,
  ) {}

  public ngOnInit(): void {
    this._form = this.buildForm();
    this.route.data.pipe(take(1)).subscribe((data) => {
      this.ideaToUpdate = data['updateIdea'];
      if (this.ideaToUpdate) {
        this.form.patchValue({
          title: this.ideaToUpdate.title,
          content: this.ideaToUpdate.content,
        });
      }
    });
  }

  private buildForm(): FormGroup<IdeaForm> {
    return this.formBuilder.group<IdeaForm>({
      title: this.formBuilder.control<string | null>(null, {
        validators: [
          customValidationErrors(Validators.required, {
            required: 'A title is required',
          }),
          customValidationErrors(
            Validators.minLength(this.constraints.title.minLength),
            {
              minlength: `Title must be at least ${this.constraints.title.minLength} characters`,
            },
          ),
          customValidationErrors(
            Validators.maxLength(this.constraints.title.maxLength),
            {
              maxlength: `Title must be at most ${this.constraints.title.maxLength} characters`,
            },
          ),
        ],
        updateOn: 'blur',
      }),
      content: this.formBuilder.control<string | null>(null, {
        validators: [
          customValidationErrors(
            Validators.maxLength(this.constraints.content.maxLength),
            {
              maxlength: `Content must be at most ${this.constraints.content.maxLength} characters`,
            },
          ),
        ],
        updateOn: 'blur',
      }),
    });
  }

  public submit() {
    if (this.form.invalid) {
      this.formUtils.markAllAsTouched(this.form);
      this.formUtils.forceValidation(this.form);
      return;
    }

    if (this.ideaToUpdate) {
      this.update();
    } else {
      this.create();
    }
  }

  private create() {
    this.ideaMutationService
      .create(
        new IdeaCreationData({
          title: this.form.value.title!,
          content: this.form.value.content!,
        }),
      )
      .subscribe({
        next: () => this.onSuccess('Idea created successfully'),
        error: (err) => this.onError(err),
      });
  }

  private update() {
    this.ideaMutationService
      .update(
        new IdeaUpdateData({
          id: this.ideaToUpdate!.id,
          title: this.form.value.title!,
          content: this.form.value.content!,
        }),
      )
      .subscribe({
        next: () => this.onSuccess('Idea updated successfully'),
        error: (err) => this.onError(err),
      });
  }

  private onSuccess(message: string) {
    this.navigationUtils.back();
    this.alerts
      .open(message, {
        appearance: 'positive',
        label: 'Success',
      })
      .pipe(take(1))
      .subscribe();
  }

  private onError(err: unknown) {
    this.apiErrorsService.displayErrors(err);
  }
}
