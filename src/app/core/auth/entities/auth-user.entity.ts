export class AuthenticatedUser {
  private _id: number;
  private _handle: string;
  private _displayName: string;
  private _email: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  public constructor(data: AuthenticatedUser) {
    this._id = data.id;
    this._handle = data.handle;
    this._email = data.email;
    this._displayName = data.displayName;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  public get id(): number {
    return this._id;
  }

  public get handle(): string {
    return this._handle;
  }

  public get displayName(): string {
    return this._displayName;
  }

  public get email(): string {
    return this._email;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
