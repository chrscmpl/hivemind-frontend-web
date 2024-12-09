export class AuthenticatedUser {
  private _id: number;
  private _username: string;

  public constructor(id: number, username: string) {
    this._id = id;
    this._username = username;
  }

  public get id(): number {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }
}
