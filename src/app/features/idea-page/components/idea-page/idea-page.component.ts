import { NgClass } from '@angular/common';
import { Component, effect, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { IdeaCardComponent } from '@app/shared/components/idea-card/idea-card.component';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { take } from 'rxjs';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { CommentListComponent } from '@app/shared/components/comment-list/comment-list.component';
import { AuthService } from '@app/core/auth/services/auth.service';
import { IdeaFetchService } from '@app/shared/services/idea-fetch.service';
import { CommentEditorComponent } from '../comment-editor/comment-editor.component';
import { ScrollerService } from '@app/core/misc/services/scroller.service';

@Component({
  selector: 'app-idea-page',
  imports: [
    IdeaCardComponent,
    NgClass,
    BackButtonComponent,
    CommentListComponent,
    CommentEditorComponent,
  ],
  templateUrl: './idea-page.component.html',
  styleUrl: './idea-page.component.scss',
})
export class IdeaPageComponent implements OnInit {
  public animateEntry: boolean = false;

  public commentEditorOpen: boolean = false;

  private _idea!: IdeaEntity;

  public get idea(): IdeaEntity {
    return this._idea;
  }

  public constructor(
    private readonly element: ElementRef,
    private readonly route: ActivatedRoute,
    public readonly breakpoints: BreakpointService,
    public readonly navigationUtils: NavigationUtilsService,
    private readonly scroller: ScrollerService,
    auth: AuthService,
    ideas: IdeaFetchService,
  ) {
    let lastIsAuthenticated: boolean | null = null;
    effect(() => {
      if (!auth.authChecked()) {
        return;
      }
      const isAuthenticated = auth.isAuthenticated();
      if (
        lastIsAuthenticated !== null &&
        isAuthenticated !== lastIsAuthenticated
      ) {
        ideas.fetch(this._idea.id).subscribe((idea) => {
          this._idea = idea;
        });
      }
      lastIsAuthenticated = isAuthenticated;
    });
  }

  public ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe((data) => {
      this._idea = data['idea'];
      this.animateEntry = data['animateEntry'] ?? false;
      if (data['openCommentEditor']) {
        this.openCommentEditor();
      }
    });
  }

  public openCommentEditor(): void {
    if (this.commentEditorOpen) {
      this.element.nativeElement.querySelector('.ProseMirror')?.focus?.();
    }

    this.commentEditorOpen = true;
    setTimeout(
      () =>
        this.scroller.scroll({
          anchor: 'comment-editor-editor',
          smooth: true,
        }),
      200,
    );
  }
}
