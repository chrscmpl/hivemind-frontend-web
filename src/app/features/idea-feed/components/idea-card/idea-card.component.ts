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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { TuiLike } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-idea-card',
  imports: [
    ReactiveFormsModule,
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
export class IdeaCardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Output() public readonly init = new EventEmitter<void>();
  @Input({ required: true }) public idea!: IdeaEntity;

  public readonly upvoteControl = new FormControl<boolean | null>(null);
  public readonly downvoteControl = new FormControl<boolean | null>(null);

  private eventStarted: boolean = false;
  private isAuthenticated: boolean = false;

  public constructor(
    public readonly breakpoints: BreakpointService,
    auth: AuthService,
  ) {
    effect(() => {
      this.isAuthenticated = auth.isAuthenticated();
    });
  }

  public ngOnInit(): void {
    this.init.emit();

    this.upvoteControl.setValue(this.idea.myVote === true);
    this.downvoteControl.setValue(this.idea.myVote === false);

    this.subscriptions.push(
      this.upvoteControl.valueChanges.subscribe((value) => {
        if (this.eventStarted) {
          return;
        }
        this.eventStarted = true;
        this.onUpvoteChangeEvent(value);
        this.eventStarted = false;
      }),
      this.downvoteControl.valueChanges.subscribe((value) => {
        if (this.eventStarted) {
          return;
        }
        this.eventStarted = true;
        this.onDownvoteChangeEvent(value);
        this.eventStarted = false;
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private onUpvoteChangeEvent(value: boolean | null): void {
    if (!this.isAuthenticated) {
      this.upvoteControl.setValue(false);
      this.remindToLogin();
      return;
    }
    if (value === true) {
      this.onUpvote();
      return;
    }
    this.onUpvoteCancel();
  }

  private onDownvoteChangeEvent(value: boolean | null): void {
    if (!this.isAuthenticated) {
      this.downvoteControl.setValue(false);
      this.remindToLogin();
      return;
    }
    if (value === true) {
      this.onDownvote();
      return;
    }
    this.onDownvoteCancel();
  }

  private onUpvote(): void {
    if (this.idea.myVote === false) {
      this.idea.downvoteCount = (this.idea.downvoteCount ?? 0) - 1;
    }
    this.idea.myVote = true;
    this.idea.upvoteCount = (this.idea.upvoteCount ?? 0) + 1;
    this.downvoteControl.setValue(false);
  }

  private onDownvote(): void {
    if (this.idea.myVote === true) {
      this.idea.upvoteCount = (this.idea.upvoteCount ?? 0) - 1;
    }
    this.idea.myVote = false;
    this.idea.downvoteCount = (this.idea.downvoteCount ?? 0) + 1;
    this.upvoteControl.setValue(false);
  }

  private onUpvoteCancel(): void {
    this.idea.myVote = null;
    this.idea.upvoteCount = (this.idea.upvoteCount ?? 0) - 1;
  }

  private onDownvoteCancel(): void {
    this.idea.myVote = null;
    this.idea.downvoteCount = (this.idea.downvoteCount ?? 0) - 1;
  }

  private remindToLogin(): void {
    alert('Please login to vote');
  }
}
