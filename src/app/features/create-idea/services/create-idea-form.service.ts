import { Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdeaCreationConstraintsEntity } from '@app/shared/entities/idea-creation-contraints.entity';
import { customValidationErrors } from '@app/shared/helpers/custom-validation-errors.helper';
import { IDEA_CREATION_CONSTRAINTS } from '@app/shared/tokens/idea-creation-constraints.token';
import { CreateIdeaForm } from '../forms/create-idea.form';
import { ReactiveFormsUtilsService } from '@app/shared/services/reactive-forms-utils.service';
import { IdeaMutationService } from '@app/shared/services/idea-mutation.service';
import { ApiErrorsService } from '@app/shared/services/api-errors.service';
import { TuiAlertService } from '@taiga-ui/core';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { IdeaCreationData } from '@app/shared/entities/idea-creation-data.entity';
import { IdeaUpdateData } from '@app/shared/entities/idea-update-data.entity';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateIdeaFormService {
  private _form!: FormGroup<CreateIdeaForm>;
  private _ideaToUpdate: IdeaEntity | null = null;
  public set ideaToUpdate(value: IdeaEntity | null) {
    this._ideaToUpdate = value;
    if (value) {
      this.form.patchValue({
        title: value.title,
        content: value.content,
      });
    }
  }
  public get ideaToUpdate(): IdeaEntity | null {
    return this._ideaToUpdate;
  }

  public get form(): FormGroup<CreateIdeaForm> {
    return this._form;
  }

  constructor(
    @Inject(IDEA_CREATION_CONSTRAINTS)
    public readonly constraints: IdeaCreationConstraintsEntity,
    private readonly formUtils: ReactiveFormsUtilsService,
    private readonly ideaMutationService: IdeaMutationService,
    private readonly apiErrorsService: ApiErrorsService,
    private readonly alerts: TuiAlertService,
    private readonly navigationUtils: NavigationUtilsService,
    formBuilder: FormBuilder,
  ) {
    this._form = formBuilder.group<CreateIdeaForm>({
      title: formBuilder.control<string | null>(null, {
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
      content: formBuilder.control<string | null>(null, {
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
        next: () => this.onSuccess('Idea published successfully'),
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
    this.form.reset();
  }

  private onError(err: unknown) {
    this.apiErrorsService.displayErrors(err);
  }
}
