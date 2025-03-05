import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { BackButtonComponent } from '@app/shared/components/back-button/back-button.component';
import { UpdateOnEnterDirective } from '@app/shared/directives/update-on-enter.directive';
import { EDITOR_TOOLS } from '@app/shared/tokens/editor-tools.token';
import { TuiButton, TuiError, TuiTextfield } from '@taiga-ui/core';
import { TuiEditor, TuiEditorToolType } from '@taiga-ui/editor';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { take } from 'rxjs';
import { CreateIdeaFormService } from '../../services/create-idea-form.service';

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
    BackButtonComponent,
  ],
  templateUrl: './create-idea-page.component.html',
  styleUrl: './create-idea-page.component.scss',
})
export class CreateIdeaPageComponent implements OnInit {
  public constructor(
    @Inject(EDITOR_TOOLS) public readonly tools: TuiEditorToolType[],
    private readonly route: ActivatedRoute,
    public readonly formService: CreateIdeaFormService,
    public readonly breakpoints: BreakpointService,
  ) {}

  public ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe((data) => {
      this.formService.ideaToUpdate = data['updateIdea'];
    });
  }
}
