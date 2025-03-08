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
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { UserEntity } from '@app/shared/entities/user.entity';
import { IdeaFetchService } from '@app/shared/services/idea-fetch.service';

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
    private readonly router: Router,
    private readonly fetchService: IdeaFetchService,
    private readonly auth: AuthService,
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
        next: (idea) => this.onSuccess('Idea published successfully', idea),
        error: (err) => this.onError(err),
      });
  }

  private update() {
    const updateData = new IdeaUpdateData({
      old: this.ideaToUpdate!,
      newTitle: this.form.value.title,
      newContent: this.form.value.content,
    });

    if (!updateData.newTitle && !updateData.newContent) {
      this.alerts
        .open("You must edit either the idea's title or content", {
          appearance: 'error',
          label: 'Error',
        })
        .subscribe();
      return;
    }

    this.ideaMutationService.update(updateData).subscribe({
      next: (idea) => this.onSuccess('Idea updated successfully', idea),
      error: (err) => this.onError(err),
    });
  }

  private onSuccess(message: string, idea: IdeaEntity) {
    const user = this.auth.authUser();

    if (user) {
      idea.user = new UserEntity(user);
    }

    this.fetchService.cache(idea);

    this.router.navigate(['ideas', idea.id]);

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
