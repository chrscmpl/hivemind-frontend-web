import { UserEntity } from '@shared/entities/user.entity';
import { IdeaDto } from '../dto/idea.dto';

export class IdeaEntity {
  private readonly _id: number;
  private readonly _title?: string;
  private readonly _content?: string;
  private _upvoteCount?: number;
  private _downvoteCount?: number;
  private readonly _commentCount?: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private _user?: UserEntity;
  private _myVote?: boolean | null;

  private readonly _age?: number;
  private readonly _updated: boolean;
  private _deleted: boolean;
  private _isComplete: boolean;

  public constructor(data: IdeaDto) {
    this._id = data.id;
    this._title = data.title;
    this._content = data.content;
    this._upvoteCount = data.upvoteCount;
    this._downvoteCount = data.downvoteCount;
    this._commentCount = data.commentCount;
    if (data.createdAt) {
      this._createdAt = new Date(data.createdAt);
      this._age = Date.now() - this._createdAt.getTime();
    }
    if (data.updatedAt) {
      this._updatedAt = new Date(data.updatedAt);
    }
    if (data.user) {
      this._user = new UserEntity(data.user);
    }
    this._updated =
      !!this.createdAt && !!this.updatedAt && this.updatedAt > this.createdAt;
    this._myVote =
      data.myVote === 'up' ? true : data.myVote === 'down' ? false : null;

    this._deleted = false;

    this._isComplete =
      this._id != undefined &&
      this._title != undefined &&
      this._content != undefined &&
      this._upvoteCount != undefined &&
      this._downvoteCount != undefined &&
      this._commentCount != undefined &&
      this._createdAt != undefined &&
      this._updatedAt != undefined &&
      this._user != undefined;
  }

  public get id(): number {
    return this._id;
  }

  public get title(): string | undefined {
    return this._title;
  }

  public get content(): string | undefined {
    return this._content;
  }

  public get upvoteCount(): number | undefined {
    return this._upvoteCount;
  }

  public set upvoteCount(value: number | undefined) {
    this._upvoteCount = value;
  }

  public get downvoteCount(): number | undefined {
    return this._downvoteCount;
  }

  public set downvoteCount(value: number | undefined) {
    this._downvoteCount = value;
  }

  public get commentCount(): number | undefined {
    return this._commentCount;
  }

  public get createdAt(): Date | undefined {
    return this._createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  public get user(): UserEntity | undefined {
    return this._user;
  }

  public set user(value: UserEntity | undefined) {
    this._user = value;
  }

  public get myVote(): boolean | null | undefined {
    return this._myVote;
  }

  public set myVote(value: boolean | null | undefined) {
    this._myVote = value;
  }

  public get age(): number | undefined {
    return this._age;
  }

  public get updated(): boolean {
    return this._updated;
  }

  public get deleted(): boolean {
    return this._deleted;
  }

  public set deleted(value: boolean) {
    this._deleted = value;
  }

  public get isComplete(): boolean {
    return this._isComplete;
  }

  public setMyVoteAndUpdateCounts(value: boolean | null): void {
    if (
      this.myVote === value ||
      this.upvoteCount == undefined ||
      this.downvoteCount == undefined
    ) {
      return;
    }
    if (value === true) {
      this.upvoteCount++;
      this.removeDownvoteIfPresent();
    } else if (value === false) {
      this.downvoteCount++;
      this.removeUpvoteIfPresent();
    } else if (value === null) {
      this.removeUpvoteIfPresent();
      this.removeDownvoteIfPresent();
    }
    this.myVote = value;
  }

  private removeUpvoteIfPresent(): void {
    if (this.myVote === true && this.upvoteCount) {
      this.upvoteCount--;
    }
  }

  private removeDownvoteIfPresent(): void {
    if (this.myVote === false && this.downvoteCount) {
      this.downvoteCount--;
    }
  }
}
