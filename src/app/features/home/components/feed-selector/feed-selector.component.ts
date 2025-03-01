import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { IdeaSortEnum } from '@shared/enums/idea-sort.enum';
import {
  TuiAppearance,
  TuiAppearanceOptions,
  TuiButton,
  TuiDataList,
  TuiDropdown,
} from '@taiga-ui/core';
import { TuiChevron, TuiDataListDropdownManager } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';

interface FeedSelectorOption {
  label: string;
  value: IdeaSortEnum;
  icon?: string;
}

@Component({
  selector: 'app-feed-selector',
  imports: [
    ReactiveFormsModule,
    TuiDataList,
    TuiDataListDropdownManager,
    TuiButton,
    TuiAppearance,
    TuiChevron,
    TuiDropdown,
  ],
  templateUrl: './feed-selector.component.html',
  styleUrl: './feed-selector.component.scss',
})
export class FeedSelectorComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  @Input() buttonAppearance: TuiAppearanceOptions['appearance'] = 'primary';

  public open: boolean = false;

  private _currentFeed?: IdeaSortEnum;
  private _currentFeedLabel!: string;

  public get currentFeedLabel(): string {
    return this._currentFeedLabel;
  }

  public readonly options: FeedSelectorOption[] = [
    {
      label: 'Controversial',
      value: IdeaSortEnum.CONTROVERSIAL,
      icon: '@tui.flame',
    },
    { label: 'Popular', value: IdeaSortEnum.POPULAR, icon: '@tui.trophy' },
    { label: 'Unpopular', value: IdeaSortEnum.UNPOPULAR, icon: '@tui.frown' },
    { label: 'New', value: IdeaSortEnum.NEW, icon: '@tui.clock' },
  ];

  public constructor(public readonly control: NgControl) {}

  public ngOnInit(): void {
    this.updateCurrentFeed(this.control.control?.value);
    if (this.control.control) {
      this.subscriptions.push(
        this.control.control.valueChanges.subscribe((value) =>
          this.updateCurrentFeed(value),
        ),
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private updateCurrentFeed(value?: IdeaSortEnum): void {
    if (value === this._currentFeed) {
      return;
    }
    this._currentFeed = value;
    this._currentFeedLabel =
      this.options.find((option) => option.value === value)?.label ?? '';
  }

  public setOption(option: FeedSelectorOption): void {
    this.control.control?.setValue(option.value);
    this._currentFeedLabel = option.label;
    this.open = false;
  }
}
