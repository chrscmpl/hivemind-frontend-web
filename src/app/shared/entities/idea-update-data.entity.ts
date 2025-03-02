export class IdeaUpdateData {
  private _id: number;
  private _title: string;
  private _content: string | null;

  public constructor(data: Pick<IdeaUpdateData, 'id' | 'title' | 'content'>) {
    this._id = data.id;
    this._title = data.title;
    this._content = data.content ?? null;
  }

  public get id(): number {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get content(): string | null {
    return this._content;
  }
}
