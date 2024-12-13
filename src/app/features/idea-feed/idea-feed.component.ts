import { Component, Input, OnInit } from '@angular/core';
import { IdeaPaginationService } from './services/idea-pagination.service';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';
import { PaginatedRequestManager } from '@app/shared/helpers/paginated-request-manager.helper';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { IdeaCardComponent } from './components/idea-card/idea-card.component';
import { TuiLoader } from '@taiga-ui/core';

@Component({
  selector: 'app-idea-feed',
  imports: [IdeaCardComponent, TuiLoader],
  templateUrl: './idea-feed.component.html',
  styleUrl: './idea-feed.component.scss',
})
export class IdeaFeedComponent implements OnInit {
  private _fetch: boolean = false;

  @Input({ required: true }) public key!: string;
  @Input({ required: true }) public sort!: IdeaSortEnum;
  @Input({ required: true }) public age!: string;
  @Input({ required: true }) public page!: number;
  @Input({ required: true }) public limit!: number;
  @Input() includeOwnVotes: boolean | '' = false;
  @Input() includeUsers: boolean | '' = false;

  @Input() public set fetch(value: boolean) {
    if (value === true) {
      this._fetch = value;
      if (this.requestManager) {
        this.requestManager.next();
        this.loading = false;
      }
    }
  }

  public loading: boolean = true;

  public requestManager!: PaginatedRequestManager<IdeaEntity>;

  public constructor(
    private readonly ideaPaginationService: IdeaPaginationService
  ) {}

  public ngOnInit(): void {
    this.requestManager = this.ideaPaginationService.set(this.key, {
      page: this.page,
      limit: this.limit,
      queryParameters: this.buildQueryParameters(),
    });

    if (this._fetch) {
      this.requestManager.next();
      this.loading = false;
    }
  }

  private buildQueryParameters(): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {
      sort: this.sort,
      age: this.age,
    };

    const include = this.buildIncludeParameter();

    if (include) {
      params['include'] = include;
    }

    return params;
  }

  private buildIncludeParameter(): string {
    const include = [];
    if (this.includeOwnVotes !== false) {
      include.push('myVote');
    }
    if (this.includeUsers !== false) {
      include.push('user');
    }
    return include.join(',');
  }
}
