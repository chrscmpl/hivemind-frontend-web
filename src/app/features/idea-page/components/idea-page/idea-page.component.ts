import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { NavigationUtilsService } from '@app/core/misc/services/navigation-utils.service';
import { IdeaCardComponent } from '@app/shared/components/idea-card/idea-card.component';
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { take } from 'rxjs';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-idea-page',
  imports: [IdeaCardComponent, NgClass, BackButtonComponent],
  templateUrl: './idea-page.component.html',
  styleUrl: './idea-page.component.scss',
})
export class IdeaPageComponent implements OnInit {
  public animate: boolean = false;

  private _idea!: IdeaEntity;

  public get idea(): IdeaEntity {
    return this._idea;
  }

  public constructor(
    private readonly route: ActivatedRoute,
    public readonly breakpoints: BreakpointService,
    public readonly navigationUtils: NavigationUtilsService,
  ) {}

  public ngOnInit(): void {
    this.route.data.pipe(take(1)).subscribe((data) => {
      this._idea = data['idea'];
      this.animate = data['animate'];
    });
  }
}
