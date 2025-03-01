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
import { FeedDescriptorEntity } from '../../entities/feed-descriptor.entity';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IdeaAgeEnum } from '@app/shared/enums/idea-age.enum';
import { AgeSelectorComponent } from '../age-selector/age-selector.component';
import { NgClass } from '@angular/common';
import { HomePageService } from '../../services/home-page.service';

@Component({
  selector: 'app-home-page',
  imports: [
    ReactiveFormsModule,
    TuiCarousel,
    TuiScrollbar,
    TuiLoader,
    IdeaFeedComponent,
    FeedSelectorComponent,
    AgeSelectorComponent,
    NgClass,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  public readonly IdeaSortEnum = IdeaSortEnum;
  public index: number = 0;

  public feedControl!: FormControl<IdeaSortEnum>;

  public ageControl!: FormControl<IdeaAgeEnum>;

  public readonly feeds: FeedDescriptorEntity[] = Object.values(
    IdeaSortEnum,
  ).map((sort) => ({ sort }));

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly breakpoints: BreakpointService,
    public readonly ideaPaginationService: IdeaPaginationService,
    private readonly homePageService: HomePageService,
  ) {}

  public ngOnInit(): void {
    this.feedControl = new FormControl<IdeaSortEnum>(
      this.homePageService.lastSort,
      {
        nonNullable: true,
      },
    );

    this.ageControl = new FormControl<IdeaAgeEnum>(
      this.homePageService.lastAge,
      {
        nonNullable: true,
      },
    );

    this.feeds.forEach((feed) => {
      feed.fetch = this.ideaPaginationService.has(feed.sort);
    });

    this.subscriptions.push(
      this.feedControl.valueChanges.subscribe((sort) => {
        this.index = this.feeds.findIndex((feed) => feed.sort === sort);
        this.setQuery({
          sort: sort,
        });
        this.feeds[this.index].fetch = true;
        this.homePageService.lastSort = sort;
      }),

      this.ageControl.valueChanges.subscribe((age) => {
        this.setQuery({ age: age });
      }),

      this.route.queryParams.subscribe((params) => {
        const sort = params['sort'];
        const age = params['age'];
        if (!sort || !age) {
          this.setQuery({
            sort: sort ?? this.homePageService.lastSort,
            age: age ?? this.homePageService.lastAge,
          });
          return;
        }
        if (Object.values(IdeaSortEnum).includes(sort as IdeaSortEnum)) {
          this.feedControl.setValue(sort as IdeaSortEnum);
        }
        if (Object.values(IdeaAgeEnum).includes(age as IdeaAgeEnum)) {
          this.ageControl.setValue(age as IdeaAgeEnum);
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private setQuery(query: { sort?: string; age?: string }): void {
    this.router.navigate([], {
      queryParams: {
        sort: query.sort ?? this.feedControl.value,
        age: query.age ?? this.ageControl.value,
      },
      queryParamsHandling: 'merge',
      onSameUrlNavigation: 'reload',
    });
  }

  public onAgeSelectorChange(age: IdeaAgeEnum): void {
    this.feeds.forEach((feed) => {
      feed.fetch = false;
    });
    this.homePageService.lastAge = age;
  }

  public onCarouselChange(index: number): void {
    this.feedControl.setValue(this.feeds[index].sort);
  }
}
