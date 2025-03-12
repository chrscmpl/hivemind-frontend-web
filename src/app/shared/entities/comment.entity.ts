import { UserEntity } from '@shared/entities/user.entity';
import { CommentDto } from '../dto/comment.dto';

export class CommentEntity {
  private readonly _id: number;
  private _content?: string;
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;
  private _user?: UserEntity;

  private _age?: number;
  private _updated: boolean;
  private _deleted: boolean;
  private _collapse: boolean;

  public constructor(data: CommentDto) {
    this._id = data.id;
    this._content = data.content;
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

    this._collapse = false;
    this._deleted = false;
  }

  public get id(): number {
    return this._id;
  }

  public get content(): string | undefined {
    return this._content;
  }

  public set content(value: string | undefined) {
    this._content = value;
  }

  public get createdAt(): Date | undefined {
    return this._createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  public set updatedAt(value: Date | undefined) {
    this._updatedAt = value;
    this._updated =
      (this._updatedAt &&
        this._createdAt &&
        this._updatedAt > this._createdAt) ??
      false;
  }

  public get user(): UserEntity | undefined {
    return this._user;
  }

  public set user(value: UserEntity | undefined) {
    this._user = value;
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

  public get collapse(): boolean {
    return this._collapse;
  }

  public set collapse(value: boolean) {
    this._collapse = value;
  }
}
