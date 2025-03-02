import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { IdeaCardComponent } from '@app/features/idea-card/components/idea-card/idea-card.component';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { take } from 'rxjs';

@Component({
  selector: 'app-idea-page',
  imports: [IdeaCardComponent],
  templateUrl: './idea-page.component.html',
  styleUrl: './idea-page.component.scss',
})
export class IdeaPageComponent implements OnInit {
  private _idea!: IdeaEntity;

  public get idea(): IdeaEntity {
    return this._idea;
  }

  public constructor(
    private readonly route: ActivatedRoute,
    public readonly breakpoints: BreakpointService,
  ) {}

  public ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe((data) => {
      this._idea = data['idea'];
    });
  }
}
