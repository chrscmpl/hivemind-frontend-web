import { NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { FocusOnEntryDirective } from '@app/shared/directives/focus-on-entry.directive';
import { CommentCreationConstraintsEntity } from '@app/shared/entities/comment-creation-constraints.entity';
import { COMMENT_CREATION_CONSTRAINTS } from '@app/shared/tokens/comment-creation-constraints.token';
import { COMMENT_EDITOR_TOOLS } from '@app/shared/tokens/comment-editor-tools.token';
import { TuiLink, TuiTextfield } from '@taiga-ui/core';
import { TuiEditor, TuiEditorToolType } from '@taiga-ui/editor';

interface CommentForm {
  content: FormControl<string | null>;
}

@Component({
  selector: 'app-comment-editor',
  imports: [
    ReactiveFormsModule,
    TuiEditor,
    TuiTextfield,
    TuiLink,
    FocusOnEntryDirective,
    NgClass,
  ],
  templateUrl: './comment-editor.component.html',
  styleUrl: './comment-editor.component.scss',
})
export class CommentEditorComponent implements OnInit {
  public isOpen = false;
  public form!: FormGroup<CommentForm>;

  public constructor(
    @Inject(COMMENT_EDITOR_TOOLS) public readonly tools: TuiEditorToolType[],
    @Inject(COMMENT_CREATION_CONSTRAINTS)
    public readonly constraints: CommentCreationConstraintsEntity,
    private readonly formBuilder: FormBuilder,
    public readonly breakpoints: BreakpointService,
  ) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group<CommentForm>({
      content: this.formBuilder.control<string | null>(null),
    });
  }
}
