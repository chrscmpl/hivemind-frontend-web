import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { BreakpointService } from '@core/misc/services/breakpoint.service';
import { IdeaEntity } from '@shared/entities/idea.entity';
import { HumanizeDurationPipe } from '@shared/pipes/humanize-duration.pipe';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDialogService,
  TuiDropdown,
  TuiHint,
  TuiIcon,
} from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { Subscription } from 'rxjs';
import { ShareService } from '@core/misc/services/share.service';
import { environment } from 'src/environments/environment';
import { VotesControlComponent } from '../votes-control/votes-control.component';
import { AveragePipe } from '@shared/pipes/average.pipe';
import { VotesService } from '@shared/services/votes.service';
import { Router, RouterLink } from '@angular/router';
import { IdeaMutationService } from '@app/shared/services/idea-mutation.service';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { CacheService } from '@app/core/cache/services/cache.service';
import { CacheKeysEnum } from '@app/core/cache/enum/cache-keys.enum';

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
  private _isMobile = false;
  @ViewChild('menu') menu!: TemplateRef<unknown>;
  @Output() public readonly init = new EventEmitter<void>();
  @Output() public readonly deleted = new EventEmitter<void>();
  @Input({ required: true }) public idea!: IdeaEntity;

  @Input() public set compact(value: boolean | '') {
    this._compact = value !== false;
  }
  public get compact(): boolean {
    return this._compact;
  }

  public get isMobile(): boolean {
    return this._isMobile;
  }

  private _isAuthor: boolean = false;

  public constructor(
    private readonly shareService: ShareService,
    private readonly votesService: VotesService,
    private readonly router: Router,
    public readonly dialogsService: TuiDialogService,
    private readonly ideaMutation: IdeaMutationService,
    private readonly alerts: TuiAlertService,
    private readonly cache: CacheService,
    breakpoints: BreakpointService,
    auth: AuthService,
  ) {
    effect(() => {
      this._isMobile = breakpoints.isMobile();
    });
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
      if (this.idea.isComplete) {
        this.cache.manualAdd({
          key: CacheKeysEnum.IDEA,
          value: this.idea,
          parameters: [this.idea.id],
        });
      }
      this.router.navigate(['ideas', this.idea.id]);
    }
  }

  public openDialog(): void {
    this.dialogsService.open(this.menu).subscribe();
  }

  public askToDeleteIdea(): void {
    this.dialogsService
      .open<boolean>(TUI_CONFIRM, {
        label: 'Are you sure?',
        data: {
          content: 'Are you sure you want to permanently delete your idea?',
          yes: 'Delete this idea',
          no: 'Go back',
        },
      })
      .subscribe((response) => {
        if (response) {
          this.deleteIdea();
        } else if (response === false && this.isMobile) {
          this.openDialog();
        }
      });
  }

  private deleteIdea() {
    this.ideaMutation.delete(this.idea.id).subscribe(() => {
      this.deleted.emit();
      this.alerts
        .open('Idea deleted successfully', {
          appearance: 'positive',
          label: 'Success',
        })
        .subscribe();
    });
  }
}
