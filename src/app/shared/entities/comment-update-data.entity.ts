import { CommentEntity } from './comment.entity';

export class CommentUpdateData {
  private _old: CommentEntity;
  private _ideaId: number;
  private _newContent: string | null;

  public constructor(
    data: Pick<CommentUpdateData, 'old' | 'ideaId' | 'newContent'>,
  ) {
    this._old = data.old;
    this._ideaId = data.ideaId;
    this._newContent = data.newContent ?? null;
  }

  public get old(): CommentEntity {
    return this._old;
  }

  public get ideaId(): number {
    return this._ideaId;
  }

  public get newContent(): string | null {
    return this._newContent;
  }
}
