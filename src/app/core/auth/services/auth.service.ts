import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthenticatedUser } from '../entities/auth-user.entity';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginCredentialsEntity } from '../entities/login-credentials.entity';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { catchError, map, Observable, switchMap, tap } from 'rxjs';
import { LocalStorageService } from '@core/misc/services/local-storage.service';
import { ACCESS_TOKEN_KEY } from '../const/access-token-key.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authenticatedUser: WritableSignal<AuthenticatedUser | null> =
    signal<AuthenticatedUser | null>(null);

  public get authenticatedUser(): Signal<AuthenticatedUser | null> {
    return this._authenticatedUser;
  }

  public readonly isAuthenticated: Signal<boolean> = computed(
    () => this._authenticatedUser() !== null,
  );

  public constructor(
    private readonly storage: LocalStorageService,
    private readonly http: HttpClient,
  ) {
    if (this.accessToken) {
      this.getUserData().subscribe();
    }
  }

  public login(
    credentials: LoginCredentialsEntity,
  ): Observable<AuthenticatedUser> {
    return this.http
      .post<AuthTokenDto>(`${environment.api}/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        switchMap((token: AuthTokenDto) => {
          this.accessToken = token.accessToken;
          return this.getUserData();
        }),
      );
  }

  public logout(): void {
    this.storage.removeItem('accessToken');
    this._authenticatedUser.set(null);
  }

  private getUserData(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${environment.api}/auth/me`).pipe(
      map((user) => new AuthenticatedUser(user)),
      tap((user) => this._authenticatedUser.set(user)),
    );
  }

  private get accessToken(): string | null {
    return this.storage.getItem(ACCESS_TOKEN_KEY);
  }

  private set accessToken(token: string | null) {
    if (token === null) {
      this.storage.removeItem(ACCESS_TOKEN_KEY);
    } else {
      this.storage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }
}
