import { Component, Input } from '@angular/core';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { TuiAppearance, TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiLike, TuiLineClamp } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-idea-card',
  imports: [
    TuiCardLarge,
    TuiLineClamp,
    TuiButton,
    TuiLike,
    TuiIcon,
    TuiAppearance,
  ],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss',
})
export class IdeaCardComponent {
  @Input({ required: true }) public idea!: IdeaEntity;
}
