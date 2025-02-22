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
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { LocalStorageService } from '@core/misc/services/local-storage.service';
import { ACCESS_TOKEN_KEY } from '../const/access-token-key.const';
import { SignupDataEntity } from '../entities/signup-data.entity';
import { AuthStatus } from '../entities/auth-status.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _authStatus: WritableSignal<AuthStatus> = signal<AuthStatus>(
    {
      isAuthenticated: false,
      user: null,
      authChecked: false,
    },
  );

  public readonly authStatus: Signal<AuthStatus> = this._authStatus;

  public readonly authUser: Signal<AuthenticatedUser | null> = computed(
    () => this._authStatus().user,
  );

  public readonly isAuthenticated: Signal<boolean> = computed(
    () => this._authStatus().isAuthenticated,
  );

  public readonly authChecked: Signal<boolean> = computed(
    () => this._authStatus().authChecked,
  );

  private readonly _authChecked$ = new ReplaySubject<void>(1);

  public readonly authChecked$: Observable<void> = this._authChecked$
    .asObservable()
    .pipe(take(1));

  public constructor(
    private readonly storage: LocalStorageService,
    private readonly http: HttpClient,
  ) {
    if (this.accessToken) {
      this.getUserData().subscribe({
        next: () => this.setAuthChecked(),
        error: () => {
          this.logout();
          this.setAuthChecked();
        },
      });
    } else {
      this.setAuthChecked();
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

  public signup(data: SignupDataEntity): Observable<AuthenticatedUser> {
    return this.http
      .post<AuthTokenDto>(`${environment.api}/auth/signup`, {
        displayName: data.displayName,
        handle: data.handle,
        email: data.email,
        password: data.password,
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
    this.setUser(null);
  }

  private getUserData(): Observable<AuthenticatedUser> {
    return this.http.get<AuthenticatedUser>(`${environment.api}/auth/me`).pipe(
      map((user) => new AuthenticatedUser(user)),
      tap((user) => this.setUser(user)),
    );
  }

  private setUser(user: AuthenticatedUser | null): void {
    this._authStatus.set({
      user: user,
      isAuthenticated: user !== null,
      authChecked: true,
    });
  }

  private setAuthChecked(): void {
    this._authStatus.update((status) => ({ ...status, authChecked: true }));
    this._authChecked$.next();
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
