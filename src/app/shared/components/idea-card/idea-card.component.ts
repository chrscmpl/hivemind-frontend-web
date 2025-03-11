import { DatePipe, NgClass, UpperCasePipe } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
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
import { ShareService } from '@core/misc/services/share.service';
import { environment } from 'src/environments/environment';
import { VotesControlComponent } from '../votes-control/votes-control.component';
import { AveragePipe } from '@shared/pipes/average.pipe';
import { VotesService } from '@shared/services/votes.service';
import { Router, RouterLink } from '@angular/router';
import { IdeaMutationService } from '@app/shared/services/idea-mutation.service';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { IdeaFetchService } from '@app/shared/services/idea-fetch.service';

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
export class IdeaCardComponent implements OnInit {
  private _compact: boolean = false;
  private _isMobile = false;
  @ViewChild('menu') menu!: TemplateRef<unknown>;
  @Output() public readonly init = new EventEmitter<void>();
  @Output() public readonly commentBtnClick = new EventEmitter<void>();
  @Input({ required: true }) public idea!: IdeaEntity;
  @Input() public animateEntry!: boolean;

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

  public get isAuthor(): boolean {
    return this._isAuthor;
  }

  public constructor(
    private readonly shareService: ShareService,
    private readonly votesService: VotesService,
    private readonly dialogsService: TuiDialogService,
    private readonly ideaMutation: IdeaMutationService,
    private readonly alerts: TuiAlertService,
    private readonly fetchService: IdeaFetchService,
    private readonly router: Router,
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

  public onVoteChange(vote: boolean | null): void {
    this.votesService
      .setVote(this.idea.id, vote)
      .subscribe(() => this.idea.setMyVoteAndUpdateCounts(vote));
  }

  public share(): void {
    this.shareService.share({
      title: 'Share this idea',
      text: 'Check this out: ' + this.idea.title,
      url: `${environment.origin}/${this.idea.id}`,
      urlCopiedToClipboardMessage: 'Idea link copied to clipboard',
    });
  }

  public onCommentButtonClick(event: Event): void {
    event.stopPropagation();
    this.commentBtnClick.emit();
    if (this.compact) {
      this.navigateToIdea(true);
    }
  }

  public navigateToIdea(openCommentEditor: boolean = false): void {
    if (this.compact) {
      this.fetchService.cache(this.idea);
      this.router.navigate(['ideas', this.idea.id], {
        state: { animateEntry: true, openCommentEditor },
      });
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
      this.idea.deleted = true;
      this.alerts
        .open('Idea deleted successfully', {
          appearance: 'positive',
          label: 'Success',
        })
        .subscribe();
    });
  }
}
