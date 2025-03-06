import { IdeaEntity } from './idea.entity';

export class IdeaUpdateData {
  private _old: IdeaEntity;
  private _newTitle: string | null;
  private _newContent: string | null;

  public constructor(data: {
    old: IdeaEntity;
    newTitle?: string | null;
    newContent?: string | null;
  }) {
    this._old = data.old;
    this._newTitle =
      (data.newTitle === data.old.title ? null : data.newTitle) ?? null;
    this._newContent =
      (data.newContent === data.old.content ? null : data.newContent) ?? null;
  }

  public get old(): IdeaEntity {
    return this._old;
  }

  public get newTitle(): string | null {
    return this._newTitle;
  }

  public get newContent(): string | null {
    return this._newContent;
  }
}
