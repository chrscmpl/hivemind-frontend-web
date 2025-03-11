export class CommentDeletionData {
  private _ideaId: number;
  private _commentId: number;

  public constructor(data: Pick<CommentDeletionData, 'ideaId' | 'commentId'>) {
    this._ideaId = data.ideaId;
    this._commentId = data.commentId;
  }

  public get ideaId(): number {
    return this._ideaId;
  }

  public get commentId(): number {
    return this._commentId;
  }
}
