import { NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { EDITOR_TOOLS } from '@app/shared/tokens/editor-tools.token';
import { TuiEditor, TuiEditorToolType } from '@taiga-ui/editor';

interface IdeaForm {
  title: FormControl<string | null>;
  content: FormControl<string | null>;
}

@Component({
  selector: 'app-create-idea-page',
  imports: [ReactiveFormsModule, TuiEditor, NgClass],
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
  ) {}

  public ngOnInit(): void {
    this._form = this.buildForm();
  }

  private buildForm(): FormGroup<IdeaForm> {
    return this.formBuilder.group<IdeaForm>({
      title: this.formBuilder.control<string | null>(null),
      content: this.formBuilder.control<string | null>(null),
    });
  }
}
