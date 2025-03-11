export class CommentCreationData {
  private _ideaId: number;
  private _content: string | null;

  public constructor(data: Pick<CommentCreationData, 'ideaId' | 'content'>) {
    this._ideaId = data.ideaId;
    this._content = data.content ?? null;
  }

  public get ideaId(): number {
    return this._ideaId;
  }

  public get content(): string | null {
    return this._content;
  }
}
