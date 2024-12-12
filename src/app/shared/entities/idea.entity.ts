import { UserEntity } from '@app/users/entities/user.entity';

export class IdeaEntity {
  private readonly _id: number;
  private readonly _title?: string;
  private readonly _content?: string;
  private readonly _upvoteCount?: number;
  private readonly _downvoteCount?: number;
  private readonly _commentCount?: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private readonly _user?: UserEntity;
  private readonly _myVote?: boolean;

  public constructor(
    data: Partial<IdeaEntity> & {
      id: number;
      createdAt: string;
      updatedAt: string;
    }
  ) {
    this._id = data.id;
    this._title = data.title;
    this._content = data.content;
    this._upvoteCount = data.upvoteCount;
    this._downvoteCount = data.downvoteCount;
    this._commentCount = data.commentCount;
    this._createdAt = new Date(data.createdAt);
    this._updatedAt = new Date(data.updatedAt);
    this._user = data.user;
    this._myVote = data.myVote;
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

  public get downvoteCount(): number | undefined {
    return this._downvoteCount;
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

  public get myVote(): boolean | undefined {
    return this._myVote;
  }
}
