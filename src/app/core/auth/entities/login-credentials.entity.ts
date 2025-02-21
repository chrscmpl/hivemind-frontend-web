export class LoginCredentialsEntity {
  private _email: string;
  private _password: string;

  public constructor(data: Pick<LoginCredentialsEntity, 'email' | 'password'>) {
    this._email = data.email;
    this._password = data.password;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }
}
