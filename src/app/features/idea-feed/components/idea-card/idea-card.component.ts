import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { HumanizeDurationPipe } from '@app/shared/pipes/humanize-duration.pipe';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiHint,
  TuiIcon,
} from '@taiga-ui/core';
import { TuiLike } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-idea-card',
  imports: [
    TuiCardLarge,
    TuiButton,
    TuiLike,
    TuiIcon,
    TuiAppearance,
    TuiDropdown,
    TuiDataList,
    TuiHint,
    HumanizeDurationPipe,
    DatePipe,
  ],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss',
})
export class IdeaCardComponent {
  @Input({ required: true }) public idea!: IdeaEntity;
}
