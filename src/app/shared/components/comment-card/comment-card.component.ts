import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  effect,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { BreakpointService } from '@app/core/misc/services/breakpoint.service';
import { CommentEntity } from '@app/shared/entities/comment.entity';
import { HumanizeDurationPipe } from '@app/shared/pipes/humanize-duration.pipe';
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
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-comment-card',
  imports: [
    NgClass,
    RouterLink,
    TuiCardLarge,
    TuiButton,
    TuiIcon,
    TuiAppearance,
    TuiDropdown,
    TuiDataList,
    TuiHint,
    HumanizeDurationPipe,
    DatePipe,
  ],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss',
})
export class CommentCardComponent implements OnInit {
  private _isMobile = false;
  @ViewChild('menu') menu!: TemplateRef<unknown>;
  @Input({ required: true }) public comment!: CommentEntity;

  public get isMobile(): boolean {
    return this._isMobile;
  }

  private _isAuthor: boolean = false;

  public get isAuthor(): boolean {
    return this._isAuthor;
  }

  private _collapsed: boolean = false;

  public get collapsed(): boolean {
    return this._collapsed;
  }

  public set collapsed(value: boolean) {
    this.comment.collapse = value;
    this._collapsed = value;
  }

  public constructor(
    private readonly tuiDialogs: TuiDialogService,
    private readonly alerts: TuiAlertService,
    breakpoints: BreakpointService,
    auth: AuthService,
  ) {
    effect(() => {
      this._isMobile = breakpoints.isMobile();
    });
    effect(() => {
      this._isAuthor =
        this.comment.user?.id !== undefined &&
        this.comment.user?.id === auth.authUser()?.id;
    });
  }

  public ngOnInit(): void {
    this.collapsed = this.comment.collapse;
  }

  public openDialog(): void {
    this.tuiDialogs.open(this.menu).subscribe();
  }

  public askToDeleteComment(): void {
    this.tuiDialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Are you sure?',
        data: {
          content: 'Are you sure you want to permanently delete your comment?',
          yes: 'Delete this comment',
          no: 'Go back',
        },
      })
      .subscribe((response) => {
        if (response) {
          this.deleteComment();
        } else if (response === false && this.isMobile) {
          this.openDialog();
        }
      });
  }

  private deleteComment() {
    // this.commentMutation.delete(this.comment.id).subscribe(() => {
    //   this.comment.deleted = true;
    //   this.alerts
    //     .open('Idea deleted successfully', {
    //       appearance: 'positive',
    //       label: 'Success',
    //     })
    //     .subscribe();
    // });
  }

  public toggleCollapsed(event: Event): void {
    event.stopPropagation();
    this.collapsed = !this.collapsed;
  }
}
