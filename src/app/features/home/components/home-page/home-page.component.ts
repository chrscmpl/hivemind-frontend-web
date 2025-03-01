import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointService } from '@core/misc/services/breakpoint.service';
import { IdeaSortEnum } from '@shared/enums/idea-sort.enum';
import { TuiCarousel } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';
import { IdeaFeedComponent } from '@features/idea-feed/components/idea-feed/idea-feed.component';
import { IdeaPaginationService } from '@features/idea-feed/services/idea-pagination.service';
import { TuiLoader, TuiScrollbar } from '@taiga-ui/core';
import { FeedSelectorComponent } from '../feed-selector/feed-selector.component';
import { FeedDescriptorEntity } from '../entities/feed-descriptor.entity';

@Component({
  selector: 'app-home-page',
  imports: [
    NgTemplateOutlet,
    TuiCarousel,
    TuiScrollbar,
    TuiLoader,
    IdeaFeedComponent,
    FeedSelectorComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  public readonly IdeaSortEnum = IdeaSortEnum;
  public static readonly DEFAULT_SORT = IdeaSortEnum.CONTROVERSIAL;
  public sort!: string;
  private _index: number | null = null;

  public set index(value: number) {
    if (this._index === value) {
      return;
    }
    this._index = value;
    this.feeds[this._index].fetch = true;
    this.sort = this.feeds[this._index].sort;

    this.setQuery(this.sort);
  }

  public get index(): number {
    return this._index ?? 0;
  }

  public readonly feeds: FeedDescriptorEntity[] = Object.values(
    IdeaSortEnum,
  ).map((sort) => ({ sort }));

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly breakpoints: BreakpointService,
    public readonly ideaPaginationService: IdeaPaginationService,
  ) {}

  public ngOnInit(): void {
    this.feeds.forEach((feed) => {
      feed.fetch = this.ideaPaginationService.has(feed.sort);
    });

    this.subscriptions.push(
      this.route.queryParamMap.subscribe((params) => {
        const sort = params.get('sort');
        if (!sort) {
          this.setQuery(HomePageComponent.DEFAULT_SORT);
          return;
        }
        this.index =
          sort === IdeaSortEnum.UNPOPULAR
            ? 2
            : sort === IdeaSortEnum.POPULAR
              ? 1
              : 0;

        this.feeds.forEach((feed, index) => {
          if (feed.sort === sort) {
            this.index = index;
          }
        });
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private setQuery(sort: string): void {
    this.router.navigate([], {
      queryParams: { sort },
      queryParamsHandling: 'merge',
      onSameUrlNavigation: 'reload',
    });
  }
}
