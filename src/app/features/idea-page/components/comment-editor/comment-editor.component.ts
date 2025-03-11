import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@app/core/auth/services/auth.service';
import { DialogEnum } from '@app/core/dialogs/dialog.enum';
import { DialogsService } from '@app/core/dialogs/dialogs.service';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { FocusOnEntryDirective } from '@app/shared/directives/focus-on-entry.directive';
import { CommentCreationConstraintsEntity } from '@app/shared/entities/comment-creation-constraints.entity';
import { CommentCreationData } from '@app/shared/entities/comment-creation-data.entity';
import { CommentUpdateData } from '@app/shared/entities/comment-update-data.entity';
import { CommentEntity } from '@app/shared/entities/comment.entity';
import { customValidationErrors } from '@app/shared/helpers/custom-validation-errors.helper';
import { ApiErrorsService } from '@app/shared/services/api-errors.service';
import { CommentMutationService } from '@app/shared/services/comment-mutation.service';
import { ReactiveFormsUtilsService } from '@app/shared/services/reactive-forms-utils.service';
import { COMMENT_CREATION_CONSTRAINTS } from '@app/shared/tokens/comment-creation-constraints.token';
import { COMMENT_EDITOR_TOOLS } from '@app/shared/tokens/comment-editor-tools.token';
import {
  TuiAlertService,
  TuiButton,
  TuiError,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiEditor, TuiEditorToolType } from '@taiga-ui/editor';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { take } from 'rxjs';

interface CommentForm {
  content: FormControl<string | null>;
}

@Component({
  selector: 'app-comment-editor',
  imports: [
    ReactiveFormsModule,
    TuiEditor,
    TuiTextfield,
    FocusOnEntryDirective,
    NgClass,
    TuiFieldErrorPipe,
    TuiError,
    TuiButton,
    AsyncPipe,
  ],
  templateUrl: './comment-editor.component.html',
  styleUrl: './comment-editor.component.scss',
})
export class CommentEditorComponent implements OnInit {
  @Input({ required: true }) public ideaId!: number;
  @Output() public readonly posted = new EventEmitter<void>();
  public form!: FormGroup<CommentForm>;

  @Input() public isOpen: boolean = false;
  @Output() public isOpenChange = new EventEmitter<boolean>();

  private _commentToUpdate: CommentEntity | null = null;
  @Input() public set update(value: CommentEntity | null) {
    this._commentToUpdate = value;
    if (value) {
      this.form.controls.content.setValue(value.content ?? null);
    }
  }

  public constructor(
    @Inject(COMMENT_EDITOR_TOOLS) public readonly tools: TuiEditorToolType[],
    @Inject(COMMENT_CREATION_CONSTRAINTS)
    public readonly constraints: CommentCreationConstraintsEntity,
    private readonly formBuilder: FormBuilder,
    public readonly breakpoints: BreakpointService,
    private readonly formUtils: ReactiveFormsUtilsService,
    private readonly commentMutation: CommentMutationService,
    private readonly alerts: TuiAlertService,
    private readonly apiErrorsService: ApiErrorsService,
    private readonly auth: AuthService,
    private readonly dialogs: DialogsService,
  ) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group<CommentForm>({
      content: this.formBuilder.control<string | null>(null, {
        validators: customValidationErrors(Validators.required, {
          required: 'Your comment cannot be empty',
        }),
        updateOn: 'blur',
      }),
    });
  }

  public open(event?: Event): void {
    if (event) {
      (event.target as HTMLElement)?.blur?.();
    }

    if (!this.auth.isAuthenticated()) {
      this.dialogs.open(DialogEnum.LOGIN).subscribe((logged) => {
        if (logged) {
          this.setIsOpen(true);
        }
      });
      return;
    }
    this.setIsOpen(true);
  }

  public close(): void {
    this.setIsOpen(false);
  }

  public submit(): void {
    this.form.controls.content.setValue(
      this.form.controls.content.value?.replace(/^<p>\s*<\/p>$/, '') ?? null,
    );

    if (this.form.invalid) {
      this.formUtils.markAllAsTouched(this.form);
      this.formUtils.forceValidation(this.form);
      return;
    }

    if (this._commentToUpdate) {
      this.updateComment();
    } else {
      this.createComment();
    }
  }

  private createComment(): void {
    this.commentMutation
      .create(
        new CommentCreationData({
          ideaId: this.ideaId,
          content: this.form.controls.content.value,
        }),
      )
      .subscribe({
        next: () => this.onSuccess('Comment posted successfully'),
        error: (err) => this.onError(err),
      });
  }

  private updateComment(): void {
    if (!this._commentToUpdate) {
      return;
    }

    if (this._commentToUpdate.content === this.form.controls.content.value) {
      this.form.controls.content.setErrors({ content: 'No changes detected' });
      return;
    }

    this.commentMutation
      .update(
        new CommentUpdateData({
          old: this._commentToUpdate,
          ideaId: this.ideaId,
          newContent: this.form.controls.content.value,
        }),
      )
      .subscribe({
        next: () => this.onSuccess('Comment updated successfully'),
        error: (err) => this.onError(err),
      });
  }

  private onSuccess(message: string) {
    this._commentToUpdate = null;
    this.form.reset();
    this.setIsOpen(false);
    this.posted.emit();

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

  private setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen;
    this.isOpenChange.emit(isOpen);
  }
}
