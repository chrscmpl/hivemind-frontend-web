import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IdeaSortEnum } from '@app/shared/enums/idea-sort.enum';
import { TuiSegmented } from '@taiga-ui/kit';

@Component({
  selector: 'app-feed-selector',
  imports: [TuiSegmented, TitleCasePipe],
  templateUrl: './feed-selector.component.html',
  styleUrl: './feed-selector.component.scss',
})
export class FeedSelectorComponent {
  @Input() public activeIndex = 0;
  @Output() public readonly activeIndexChange = new EventEmitter<number>();

  public readonly IdeaSortEnum = IdeaSortEnum;
}
