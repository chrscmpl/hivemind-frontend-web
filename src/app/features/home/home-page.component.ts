import { TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';
import { TuiCarousel, TuiSegmented } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';
import { IdeaFeedComponent } from '../idea-feed/idea-feed.component';
import { IdeaPaginationService } from '../idea-feed/services/idea-pagination.service';
import { ScrollerService } from '@app/core/misc/services/scroller.service';
import { TuiScrollbar } from '@taiga-ui/core';

@Component({
  selector: 'app-home-page',
  imports: [
    TuiSegmented,
    TuiCarousel,
    TitleCasePipe,
    TuiScrollbar,
    IdeaFeedComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  public readonly IdeaSortEnum = IdeaSortEnum;
  public static readonly DEFAULT_SORT = IdeaSortEnum.CONTROVERSIAL;
  public sort!: string;
  private _index = 1;

  public readonly doFetchFeeds = [false, false, false];

  public set index(value: number) {
    if (this._index === value) {
      return;
    }
    this._index = value;
    this.doFetchFeeds[this._index] = true;
    this.sort =
      value === 2
        ? IdeaSortEnum.UNPOPULAR
        : value === 1
        ? IdeaSortEnum.POPULAR
        : IdeaSortEnum.CONTROVERSIAL;

    this.setQuery(this.sort);
    this.scroller.scroll({ coordinates: { x: 0, y: 0 } });
  }

  public get index(): number {
    return this._index;
  }

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly breakpoints: BreakpointService,
    public readonly ideaPaginationService: IdeaPaginationService,
    public readonly scroller: ScrollerService
  ) {}

  public ngOnInit(): void {
    this.doFetchFeeds[0] = this.ideaPaginationService.has(
      IdeaSortEnum.CONTROVERSIAL
    );
    this.doFetchFeeds[1] = this.ideaPaginationService.has(IdeaSortEnum.POPULAR);
    this.doFetchFeeds[2] = this.ideaPaginationService.has(
      IdeaSortEnum.UNPOPULAR
    );

    this.subscriptions.push(
      this.route.queryParamMap.subscribe((params) => {
        const sort = params.get('sort');
        if (!sort) {
          this.setQuery(HomePageComponent.DEFAULT_SORT);
          return;
        }
        this.sort = sort;
        this.index =
          this.sort === IdeaSortEnum.UNPOPULAR
            ? 2
            : this.sort === IdeaSortEnum.POPULAR
            ? 1
            : 0;
      })
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
