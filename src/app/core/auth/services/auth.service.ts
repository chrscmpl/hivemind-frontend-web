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
import { map, Observable, switchMap, tap } from 'rxjs';
import { LocalStorageService } from '@app/core/misc/services/local-storage.service';

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
    if (this.storage.getItem('accessToken')) {
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
          this.storage.setItem('accessToken', token.accessToken);
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
}
