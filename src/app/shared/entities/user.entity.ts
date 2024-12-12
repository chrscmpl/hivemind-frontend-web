export class UserEntity {
  private readonly _id: number;
  private readonly _handle?: string;
  private readonly _displayName?: string;

  public constructor(data: Partial<UserEntity> & { id: number }) {
    this._id = data.id;
    this._handle = data.handle;
    this._displayName = data.displayName;
  }

  public get id(): number {
    return this._id;
  }

  public get handle(): string | undefined {
    return this._handle;
  }

  public get displayName(): string | undefined {
    return this._displayName;
  }
}
