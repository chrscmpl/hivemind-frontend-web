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
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  imports: [
    ReactiveFormsModule,
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
  public index: number = 0;

  public readonly feedControl = new FormControl<IdeaSortEnum>(
    IdeaSortEnum.CONTROVERSIAL,
    { nonNullable: true },
  );

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
      this.feedControl.valueChanges.subscribe((sort) => {
        this.index = this.feeds.findIndex((feed) => feed.sort === sort);
        this.setQuery(sort);
        this.feeds[this.index].fetch = true;
      }),

      this.route.queryParams.subscribe((params) => {
        const sort = params['sort'];
        if (!sort) {
          this.setQuery(HomePageComponent.DEFAULT_SORT);
          return;
        }
        if (Object.values(IdeaSortEnum).includes(sort as IdeaSortEnum)) {
          this.feedControl.setValue(sort as IdeaSortEnum);
        }
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

  public onCarouselChange(index: number): void {
    this.feedControl.setValue(this.feeds[index].sort);
  }
}
