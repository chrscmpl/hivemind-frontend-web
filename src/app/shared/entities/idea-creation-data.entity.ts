export class IdeaCreationData {
  private _title: string;
  private _content: string | null;

  public constructor(data: Pick<IdeaCreationData, 'title' | 'content'>) {
    this._title = data.title;
    this._content = data.content ?? null;
  }

  public get title(): string {
    return this._title;
  }

  public get content(): string | null {
    return this._content;
  }
}
