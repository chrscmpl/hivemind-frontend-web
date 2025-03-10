import {
  Component,
  OnInit,
  OnDestroy,
  effect,
  Input,
  Inject,
} from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.service';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { CommentPaginationMetaEntity } from '@app/shared/entities/comment-pagination-meta.entity';
import { CommentEntity } from '@app/shared/entities/comment.entity';
import { LoadingIndicator } from '@app/shared/helpers/loading-indicator.helper';
import { PaginatedRequestManager } from '@app/shared/helpers/paginated-request-manager.helper';
import { CommentFetchService } from '@app/shared/services/comment-fetch.service';
import { LoadingIndicatorService } from '@app/shared/services/loading-indicator.service';
import { catchError, delayWhen, forkJoin, of, switchMap } from 'rxjs';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { AsyncPipe } from '@angular/common';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { TuiPagination } from '@taiga-ui/kit';
import { ScrollerService } from '@app/core/misc/services/scroller.service';
import { MATH } from '@app/shared/tokens/math.token';

@Component({
  selector: 'app-comment-list',
  imports: [CommentCardComponent, AsyncPipe, TuiLoader, TuiIcon, TuiPagination],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
})
export class CommentListComponent implements OnInit, OnDestroy {
  private static readonly LOADING_INDICATOR_START_DELAY = 400;

  @Input({ required: true }) public ideaId!: number;
  @Input() public commentCount: number | null = null;

  public requestManager?: PaginatedRequestManager<
    CommentEntity,
    CommentPaginationMetaEntity
  >;

  public readonly loadingIndicator: LoadingIndicator;

  public comments: CommentEntity[] = [];

  public constructor(
    @Inject(MATH) private readonly math: Math,
    public readonly breakpoints: BreakpointService,
    private readonly commentsFetchService: CommentFetchService,
    private readonly auth: AuthService,
    private readonly scroller: ScrollerService,
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
    if (this.commentCount === 0) {
      return;
    }
    this.loadingIndicator.start();
    this.commentsFetchService
      .paginate({
        page: 1,
        limit: 10,
        ideaId: this.ideaId,
        includeUser: true,
      })
      .pipe(
        delayWhen(() => this.auth.authChecked$),
        switchMap((manager) => forkJoin([of(manager), manager.getPage(1)])),
      )
      .subscribe({
        next: ([manager, data]) => {
          this.loadingIndicator.stop();
          this.requestManager = manager;
          this.comments = data;
        },
        error: () => {
          this.loadingIndicator.stop();
        },
      });
  }

  public get totalPages(): number {
    return (
      this.requestManager?.meta?.totalPages ??
      (this.requestManager && this.commentCount
        ? this.math.ceil(this.commentCount / this.requestManager.limit)
        : 1)
    );
  }

  public jumpToPage(page: number): void {
    this.loadingIndicator.start();

    this.scroller.scroll({
      anchor: `comment-list-${this.ideaId}`,
      smooth: true,
    });

    this.requestManager
      ?.getPage(page)
      .pipe(catchError(() => []))
      .subscribe((data) => {
        this.comments = data;
        this.loadingIndicator.stop();
      });
  }
}
