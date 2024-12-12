import { UserEntity } from '@app/shared/entities/user.entity';
import { IdeaDto } from '../dto/idea.dto';

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

  private readonly _age?: number;
  private readonly _updated: boolean;

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
    if (data.updatedAt) this._updatedAt = new Date(data.updatedAt);
    if (data.user) this._user = new UserEntity(data.user);

    this._updated =
      !!this.createdAt && !!this.updatedAt && this.updatedAt > this.createdAt;

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

  public get age(): number | undefined {
    return this._age;
  }

  public get updated(): boolean {
    return this._updated;
  }
}
