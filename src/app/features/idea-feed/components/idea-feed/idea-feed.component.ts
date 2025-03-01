import { Component, Input, OnInit } from '@angular/core';
import { IdeaPaginationService } from '../../services/idea-pagination.service';
import { IdeaSortEnum } from '@shared/enums/idea-sort.enum';
import { PaginatedRequestManager } from '@shared/helpers/paginated-request-manager.helper';
import { IdeaEntity } from '@shared/entities/idea.entity';
import { BreakpointService } from '@core/misc/services/breakpoint.service';
import { IdeaCardComponent } from '../../../idea-card/components/idea-card/idea-card.component';
import { UtilsService } from '@app/shared/services/utils.service';

@Component({
  selector: 'app-idea-feed',
  imports: [IdeaCardComponent],
  templateUrl: './idea-feed.component.html',
  styleUrl: './idea-feed.component.scss',
})
export class IdeaFeedComponent implements OnInit {
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

  public loading: boolean = false;

  public requestManager!: PaginatedRequestManager<IdeaEntity>;

  public constructor(
    public readonly breakpoints: BreakpointService,
    private readonly ideaPaginationService: IdeaPaginationService,
    private readonly utils: UtilsService,
  ) {}

  public ngOnInit(): void {
    this.reset();
  }

  public onScrolled(index: number): void {
    if (this.shouldLoadMore(index)) {
      this.requestManager.next();
      this.lastLoadedPage = this.requestManager.page;
    }
  }

  private reset(): void {
    this.lastLoadedPage = 1;

    this.requestManager = this.ideaPaginationService.createManager({
      page: 1,
      limit: 10,
      query: {
        sort: this.sort,
        age: this.age,
        includeOwnVotes: this.includeOwnVotes !== false,
        includeUsers: this.includeUsers !== false,
      },
    });

    if (!this.requestManager.data.length) this.requestManager.next();
  }

  private shouldLoadMore(index: number) {
    return (
      index >= this.requestManager.page * this.requestManager.limit - 3 &&
      this.requestManager.page < this.lastLoadedPage + 1
    );
  }
}
