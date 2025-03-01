import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
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
    TitleCasePipe,
  ],
  templateUrl: './feed-selector.component.html',
  styleUrl: './feed-selector.component.scss',
})
export class FeedSelectorComponent {
  @Input() buttonAppearance: TuiAppearanceOptions['appearance'] = 'primary';

  public open: boolean = false;
  public readonly options = Object.values(IdeaSortEnum);
  public constructor(public readonly control: NgControl) {}

  public setOption(option: IdeaSortEnum) {
    this.control.control?.setValue(option);
    this.open = false;
  }
}
