import { UpperCasePipe } from '@angular/common';
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
import { IdeaEntity } from '@app/shared/entities/idea.entity';
import { AveragePipe } from '@app/shared/pipes/average.pipe';
import { TuiButton } from '@taiga-ui/core';
import { TuiLike } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-votes-control',
  imports: [
    ReactiveFormsModule,
    TuiLike,
    TuiButton,
    AveragePipe,
    UpperCasePipe,
  ],
  templateUrl: './votes-control.component.html',
  styleUrl: './votes-control.component.scss',
})
export class VotesControlComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  @Input({ required: true }) public idea!: IdeaEntity;
  @Output() public readonly vote = new EventEmitter<boolean | null>();

  private isAuthenticated: boolean = false;
  private eventStarted: boolean = false;
  public readonly upvoteControl = new FormControl<boolean | null>(null);
  public readonly downvoteControl = new FormControl<boolean | null>(null);

  public constructor(auth: AuthService) {
    effect(() => {
      this.isAuthenticated = auth.isAuthenticated();
    });
  }

  public ngOnInit(): void {
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
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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
    this.vote.emit(true);
  }

  private onDownvote(): void {
    if (this.idea.myVote === true) {
      this.idea.upvoteCount = (this.idea.upvoteCount ?? 0) - 1;
    }
    this.idea.myVote = false;
    this.idea.downvoteCount = (this.idea.downvoteCount ?? 0) + 1;
    this.upvoteControl.setValue(false);
    this.vote.emit(false);
  }

  private onUpvoteCancel(): void {
    this.idea.myVote = null;
    this.idea.upvoteCount = (this.idea.upvoteCount ?? 0) - 1;
    this.vote.emit(null);
  }

  private onDownvoteCancel(): void {
    this.idea.myVote = null;
    this.idea.downvoteCount = (this.idea.downvoteCount ?? 0) - 1;
    this.vote.emit(null);
  }

  private remindToLogin(): void {
    alert('Please login to vote');
  }
}
