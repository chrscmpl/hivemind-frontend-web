import { Component, Input, OnInit } from '@angular/core';
import { IdeaPaginationService } from './services/idea-pagination.service';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';
import { PaginatedRequestManager } from '@app/shared/helpers/paginated-request-manager.helper';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { IdeaCardComponent } from './components/idea-card/idea-card.component';

@Component({
  selector: 'app-idea-feed',
  imports: [IdeaCardComponent],
  templateUrl: './idea-feed.component.html',
  styleUrl: './idea-feed.component.scss',
})
export class IdeaFeedComponent implements OnInit {
  @Input({ required: true }) public key!: string;
  @Input({ required: true }) public sort!: IdeaSortEnum;
  @Input({ required: true }) public age!: string;
  @Input({ required: true }) public page!: number;
  @Input({ required: true }) public limit!: number;
  @Input() includeOwnVotes: boolean | '' = false;
  @Input() includeUsers: boolean | '' = false;
  private lastLoadedPage!: number;

  public loading: boolean = false;

  public requestManager!: PaginatedRequestManager<IdeaEntity>;

  public constructor(
    private readonly ideaPaginationService: IdeaPaginationService,
  ) {}

  public ngOnInit(): void {
    this.lastLoadedPage = this.page;
    this.requestManager = this.ideaPaginationService.set(this.key, {
      page: this.page,
      limit: this.limit,
      query: {
        sort: this.sort,
        age: this.age,
        includeOwnVotes: this.includeOwnVotes !== false,
        includeUsers: this.includeUsers !== false,
      },
    });

    this.requestManager.next();
  }

  public onScrolled(index: number): void {
    if (this.shouldLoadMore(index)) {
      this.requestManager.next();
      this.lastLoadedPage = this.requestManager.page;
    }
  }

  private shouldLoadMore(index: number) {
    return (
      index >= this.requestManager.page * this.requestManager.limit - 3 &&
      this.requestManager.page < this.lastLoadedPage + 1
    );
  }
}
