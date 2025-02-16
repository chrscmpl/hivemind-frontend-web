import { DatePipe } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '@app/core/auth/services/auth.service';
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
import { TuiCardLarge } from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { ShareService } from '@app/core/misc/services/share.service';
import { environment } from 'src/environments/environment';
import { VotesControlComponent } from './components/votes-control/votes-control.component';

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
  ],
  templateUrl: './idea-card.component.html',
  styleUrl: './idea-card.component.scss',
})
export class IdeaCardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Output() public readonly init = new EventEmitter<void>();
  @Input({ required: true }) public idea!: IdeaEntity;

  private _isAuthor: boolean = false;

  public constructor(
    public readonly breakpoints: BreakpointService,
    private readonly shareService: ShareService,
    auth: AuthService,
  ) {
    effect(() => {
      this._isAuthor =
        this.idea.user?.id !== undefined &&
        this.idea.user?.id === auth.authenticatedUser()?.id;
    });
  }

  public ngOnInit(): void {
    this.init.emit();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public onVoteChange(vote: boolean | null): void {
    console.log('Vote changed', vote);
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
}
