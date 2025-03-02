import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { BreakpointService } from '@core/misc/services/breakpoint.service';
import { IdeaEntity } from '@shared/entities/idea.entity';
import { HumanizeDurationPipe } from '@shared/pipes/humanize-duration.pipe';
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiHint,
  TuiIcon,
} from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { ShareService } from '@core/misc/services/share.service';
import { environment } from 'src/environments/environment';
import { VotesControlComponent } from '../../../votes/components/votes-control.component';
import { AveragePipe } from '@shared/pipes/average.pipe';
import { VotesService } from '@features/votes/services/votes.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-idea-card',
  imports: [
    TuiCardLarge,
    TuiButton,
    TuiIcon,
    TuiAppearance,
    TuiDropdown,
    TuiDataList,
    TuiHint,
    HumanizeDurationPipe,
    DatePipe,
    VotesControlComponent,
    AveragePipe,
    UpperCasePipe,
    NgClass,
    RouterLink,
  ],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss',
})
export class IdeaCardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private _compact: boolean = false;
  @Output() public readonly init = new EventEmitter<void>();
  @Input({ required: true }) public idea!: IdeaEntity;
  @Input() public set compact(value: boolean | '') {
    this._compact = value !== false;
  }

  public get compact(): boolean {
    return this._compact;
  }

  private _isAuthor: boolean = false;

  public constructor(
    public readonly breakpoints: BreakpointService,
    private readonly shareService: ShareService,
    private readonly votesService: VotesService,
    private readonly router: Router,
    auth: AuthService,
  ) {
    effect(() => {
      this._isAuthor =
        this.idea.user?.id !== undefined &&
        this.idea.user?.id === auth.authUser()?.id;
    });
  }

  public ngOnInit(): void {
    this.init.emit();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public onVoteChange(vote: boolean | null): void {
    this.votesService
      .setVote(this.idea.id, vote)
      .subscribe(() => this.idea.setMyVoteAndUpdateCounts(vote));
  }

  public get isAuthor(): boolean {
    return this._isAuthor;
  }

  public share(): void {
    this.shareService.share({
      title: 'Share this idea',
      text: 'Check this out: ' + this.idea.title,
      url: `${environment.origin}/${this.idea.id}`,
      urlCopiedToClipboardMessage: 'Idea link copied to clipboard',
    });
  }

  public navigateToIdea(): void {
    if (this.compact) {
      this.router.navigate(['ideas', this.idea.id]);
    }
  }
}
