import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IdeaFetchService } from '../../services/idea-fetch.service';
import { IdeaSortEnum } from '@shared/enums/idea-sort.enum';
import { PaginatedRequestManager } from '@shared/helpers/paginated-request-manager.helper';
import { IdeaEntity } from '@shared/entities/idea.entity';
import { BreakpointService } from '@core/misc/services/breakpoint.service';
import { IdeaCardComponent } from '../idea-card/idea-card.component';
import { UtilsService } from '@app/shared/services/utils.service';
import { LoadingIndicator } from '@app/shared/helpers/loading-indicator.helper';
import { LoadingIndicatorService } from '@app/shared/services/loading-indicator.service';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { IdeaPaginationMetaEntity } from '@app/shared/entities/idea-pagination-meta.entity';
import { CacheService } from '@app/core/cache/services/cache.service';

@Component({
  selector: 'app-idea-feed',
  imports: [IdeaCardComponent, TuiLoader, AsyncPipe, TuiIcon],
  templateUrl: './idea-feed.component.html',
  styleUrl: './idea-feed.component.scss',
})
export class IdeaFeedComponent implements OnInit, OnDestroy {
  private static readonly LOADING_INDICATOR_START_DELAY = 200;
  private readonly subscriptions: Subscription[] = [];

  @Input() includeOwnVotes: boolean | '' = false;
  @Input() includeUsers: boolean | '' = false;

  private _age!: string;
  @Input({ required: true }) public set age(value: string) {
    this._age = value;
    if (this.requestManager) this.utils.runAfterCD(() => this.reset());
  }
  public get age(): string {
    return this._age;
  }

  private _sort!: string;
  @Input({ required: true }) public set sort(value: IdeaSortEnum) {
    this._sort = value;
    if (this.requestManager) this.utils.runAfterCD(() => this.reset());
  }
  public get sort(): string {
    return this._sort;
  }

  private lastLoadedPage!: number;

  public requestManager?: PaginatedRequestManager<
    IdeaEntity,
    IdeaPaginationMetaEntity
  >;

  public readonly loadingIndicator: LoadingIndicator;

  public noResults: boolean = false;

  public constructor(
    public readonly breakpoints: BreakpointService,
    private readonly ideas: IdeaFetchService,
    private readonly utils: UtilsService,
    loadingIndicatorService: LoadingIndicatorService,
    cache: CacheService,
  ) {
    this.loadingIndicator = loadingIndicatorService.getLoadingIndicator(
      IdeaFeedComponent.LOADING_INDICATOR_START_DELAY,
    );
    this.subscriptions.push(
      cache.cacheBusters.auth.subscribe(() =>
        setTimeout(() => this.reset(), 0),
      ),
    );
  }

  public ngOnInit(): void {
    this.reset();
  }

  public ngOnDestroy(): void {
    this.loadingIndicator.complete();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public onScrolled(index: number): void {
    if (this.shouldLoadMore(index)) {
      this.next();
    }
  }

  private reset(): void {
    this.requestManager = undefined;
    this.noResults = false;
    this.loadingIndicator.start();
    this.ideas
      .paginate({
        page: 1,
        limit: 10,
        query: {
          sort: this.sort,
          age: this.age,
          includeOwnVotes: this.includeOwnVotes !== false,
          includeUsers: this.includeUsers !== false,
        },
      })
      .subscribe({
        next: (requestManager) => {
          this.loadingIndicator.stop();
          this.requestManager = requestManager;
          this.lastLoadedPage = this.requestManager.page;
          this.noResults = !this.requestManager.data.length;
        },
        error: () => {
          this.loadingIndicator.stop();
          this.noResults = true;
        },
      });
  }

  private next(): void {
    this.loadingIndicator.start();
    this.requestManager?.next().subscribe({
      next: () => this.onNewData(),
      error: () => this.loadingIndicator.stop(),
    });
  }

  private onNewData(): void {
    this.loadingIndicator.stop();
    this.lastLoadedPage = this.requestManager!.page;
  }

  private shouldLoadMore(index: number) {
    return (
      this.requestManager &&
      (!this.requestManager.meta?.totalPages ||
        this.requestManager.page < this.requestManager.meta.totalPages) &&
      index >= this.requestManager.page * this.requestManager.limit - 3 &&
      this.requestManager.page < this.lastLoadedPage + 1
    );
  }
}
