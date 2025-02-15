import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
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
export class IdeaCardComponent implements OnInit {
  @Output() public readonly init = new EventEmitter<void>();
  @Input({ required: true }) public idea!: IdeaEntity;

  public constructor(public readonly breakpoints: BreakpointService) {}

  public ngOnInit(): void {
    this.init.emit();
  }
}
