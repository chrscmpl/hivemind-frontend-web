import { UpperCasePipe } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core/auth/services/auth.service';
import { DialogEnum } from '@core/dialogs/dialog.enum';
import { DialogsService } from '@core/dialogs/dialogs.service';
import { AveragePipe } from '@shared/pipes/average.pipe';
import { TuiLike } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-votes-control',
  imports: [ReactiveFormsModule, TuiLike, AveragePipe, UpperCasePipe],
  templateUrl: './votes-control.component.html',
  styleUrl: './votes-control.component.scss',
})
export class VotesControlComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];
  @Input() public voteTotal: number | null = null;
  @Input() public set vote(value: boolean | null) {
    this.ignoreValueChange = true;
    this.upvoteControl.setValue(value === true);
    this.downvoteControl.setValue(value === false);
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ignoreValueChange = false;
      }, 50);
    });
  }
  @Output() public readonly voteChange = new EventEmitter<boolean | null>();

  private isAuthenticated: boolean = false;
  private ignoreValueChange: boolean = false;
  public readonly upvoteControl = new FormControl<boolean | null>(null);
  public readonly downvoteControl = new FormControl<boolean | null>(null);

  public voteCancelled: boolean = false;

  public constructor(
    private readonly dialogs: DialogsService,
    private readonly zone: NgZone,
    auth: AuthService,
  ) {
    effect(() => {
      this.isAuthenticated = auth.isAuthenticated();
    });
  }

  public ngOnInit(): void {
    this.subscriptions.push(
      this.upvoteControl.valueChanges.subscribe(
        this.exclusiveCb((value) => this.onUpvoteChangeEvent(value)),
      ),
      this.downvoteControl.valueChanges.subscribe(
        this.exclusiveCb((value) => this.onDownvoteChangeEvent(value)),
      ),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private exclusiveCb(
    event: (value: boolean | null) => void,
  ): (value: boolean | null) => void {
    return (value: boolean | null) => {
      if (this.ignoreValueChange) {
        return;
      }
      this.ignoreValueChange = true;
      event(value);
      this.ignoreValueChange = false;
    };
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
    this.onNullVote();
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
    this.onNullVote();
  }

  private onUpvote(): void {
    this.downvoteControl.setValue(false);
    this.voteChange.emit(true);
  }

  private onDownvote(): void {
    this.upvoteControl.setValue(false);
    this.voteChange.emit(false);
  }

  private onNullVote(): void {
    this.voteCancelled = true;
    this.voteChange.emit(null);
  }

  private remindToLogin(): void {
    this.dialogs.open(DialogEnum.LOGIN).subscribe();
  }
}
