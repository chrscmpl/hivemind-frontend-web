export class SignupDataEntity {
  private _displayName: string;
  private _handle: string;
  private _email: string;
  private _password: string;

  public constructor(
    data: Pick<
      SignupDataEntity,
      'displayName' | 'handle' | 'email' | 'password'
    >,
  ) {
    this._displayName = data.displayName;
    this._handle = data.handle;
    this._email = data.email;
    this._password = data.password;
  }

  public get displayName(): string {
    return this._displayName;
  }

  public get handle(): string {
    return this._handle;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }
}
