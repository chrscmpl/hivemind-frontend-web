import { Component, OnInit, OnDestroy, effect, Input } from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.service';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { CommentPaginationMetaEntity } from '@app/shared/entities/comment-pagination-meta.entity';
import { CommentEntity } from '@app/shared/entities/comment.entity';
import { LoadingIndicator } from '@app/shared/helpers/loading-indicator.helper';
import { PaginatedRequestManager } from '@app/shared/helpers/paginated-request-manager.helper';
import { CommentFetchService } from '@app/shared/services/comment-fetch.service';
import { LoadingIndicatorService } from '@app/shared/services/loading-indicator.service';
import { catchError, delayWhen } from 'rxjs';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { AsyncPipe } from '@angular/common';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';

@Component({
  selector: 'app-comment-list',
  imports: [CommentCardComponent, AsyncPipe, TuiLoader, TuiIcon],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
})
export class CommentListComponent implements OnInit, OnDestroy {
  private static readonly LOADING_INDICATOR_START_DELAY = 200;

  @Input({ required: true }) ideaId!: number;

  public requestManager?: PaginatedRequestManager<
    CommentEntity,
    CommentPaginationMetaEntity
  >;

  public readonly loadingIndicator: LoadingIndicator;

  public comments: CommentEntity[] = [];

  public constructor(
    public readonly breakpoints: BreakpointService,
    private readonly commentsFechService: CommentFetchService,
    private readonly auth: AuthService,
    loadingIndicatorService: LoadingIndicatorService,
  ) {
    this.loadingIndicator = loadingIndicatorService.getLoadingIndicator(
      CommentListComponent.LOADING_INDICATOR_START_DELAY,
    );
    let lastIsAuthenticated: boolean | null = null;
    effect(() => {
      if (!this.auth.authChecked()) {
        return;
      }
      const isAuthenticated = this.auth.isAuthenticated();
      if (
        lastIsAuthenticated !== null &&
        isAuthenticated !== lastIsAuthenticated
      ) {
        this.reset();
      }
      lastIsAuthenticated = isAuthenticated;
    });
  }

  public ngOnInit(): void {
    this.auth.authChecked$.subscribe(() => this.reset());
  }

  public ngOnDestroy(): void {
    this.loadingIndicator.complete();
  }

  private reset(): void {
    this.requestManager = undefined;
    this.loadingIndicator.start();
    this.commentsFechService
      .paginate({
        page: 1,
        limit: 10,
        ideaId: this.ideaId,
        includeUser: true,
      })
      .pipe(delayWhen(() => this.auth.authChecked$))
      .subscribe({
        next: (requestManager) => {
          this.loadingIndicator.stop();
          this.requestManager = requestManager;
          this.comments = Array.from(requestManager.data);
        },
        error: () => {
          this.loadingIndicator.stop();
        },
      });
  }

  private jumpToPage(page: number): void {
    this.loadingIndicator.start();

    this.requestManager!.getPage(page)
      .pipe(catchError(() => []))
      .subscribe((data) => {
        this.comments = data;
        this.loadingIndicator.stop();
      });
  }
}
